const mongoose = require('mongoose');
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../config/db');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Models
const Slider = require('../models/Slider');
const Gallery = require('../models/Gallery');
const News = require('../models/News');
const Player = require('../models/Players');
const AccelerationForm = require('../models/AccelerationForm');

const CONCURRENCY_LIMIT = 3;
const NEW_MARKER = 'v177728'; // Images uploaded today will have this or later

/**
 * Re-processes an image through the optimizer and re-uploads to Cloudinary
 */
async function reprocessImage(url, publicId, folder, filename = null) {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  // Skip if already processed today (extreme compression applied)
  if (url.includes(NEW_MARKER)) {
    console.log(`Skipping (already processed): ${url}`);
    return null;
  }
  
  let retries = 3;
  while (retries > 0) {
    try {
      console.log(`Processing: ${url}`);
      
      // 1. Download image
      const buffer = await new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to download: ${res.statusCode}`));
            return;
          }
          const data = [];
          res.on('data', (chunk) => data.push(chunk));
          res.on('end', () => resolve(Buffer.concat(data)));
        });
        req.on('error', (err) => reject(err));
        req.setTimeout(30000, () => {
          req.destroy();
          reject(new Error('Timeout downloading image'));
        });
      });
      
      // 2. Re-upload
      const result = await uploadBufferToCloudinary(buffer, folder, filename);
      
      // 3. Delete old image
      if (publicId && result.public_id !== publicId) {
        try {
          await deleteFromCloudinary(publicId);
          console.log(`Deleted old version: ${publicId}`);
        } catch (err) {
          console.warn(`Could not delete old version ${publicId}: ${err.message}`);
        }
      }
      
      console.log(`Success: ${result.url}`);
      return result;
    } catch (err) {
      retries--;
      console.error(`Error processing ${url} (${retries} retries left): ${err.message}`);
      if (retries === 0) return null;
      await new Promise(r => setTimeout(r, 2000)); // Wait before retry
    }
  }
}

async function processBatch(items, processor) {
  const results = [];
  for (let i = 0; i < items.length; i += CONCURRENCY_LIMIT) {
    const batch = items.slice(i, i + CONCURRENCY_LIMIT);
    console.log(`\n--- Processing batch ${Math.floor(i/CONCURRENCY_LIMIT) + 1}/${Math.ceil(items.length/CONCURRENCY_LIMIT)} ---`);
    const batchResults = await Promise.all(batch.map(item => processor(item)));
    results.push(...batchResults);
  }
  return results;
}

async function runMigration() {
  await connectDB();
  console.log('Starting Optimized Extreme Image Compression Migration...');

  // 1. Sliders
  console.log('\n--- Optimizing Sliders ---');
  const sliders = await Slider.find();
  await processBatch(sliders, async (slider) => {
    const result = await reprocessImage(slider.filename, slider.cloudinaryPublicId, 'itu/sliders');
    if (result) {
      slider.filename = result.url;
      slider.cloudinaryPublicId = result.public_id;
      await slider.save();
    }
  });

  // 2. Gallery
  console.log('\n--- Optimizing Gallery ---');
  const gallery = await Gallery.find();
  await processBatch(gallery, async (item) => {
    const result = await reprocessImage(item.filename, item.cloudinaryPublicId, 'itu/gallery');
    if (result) {
      item.filename = result.url;
      item.cloudinaryPublicId = result.public_id;
      await item.save();
    }
  });

  // 3. News
  console.log('\n--- Optimizing News ---');
  const newsItems = await News.find();
  await processBatch(newsItems, async (item) => {
    const result = await reprocessImage(item.image, item.cloudinaryPublicId, 'itu/news');
    if (result) {
      item.image = result.url;
      item.cloudinaryPublicId = result.public_id;
      await item.save();
    }
  });

  // 4. Players
  console.log('\n--- Optimizing Player Photos ---');
  const players = await Player.find({ photo: { $ne: null } });
  await processBatch(players, async (player) => {
    const result = await reprocessImage(player.photo, player.cloudinaryPublicId, 'itu/player-photos');
    if (result) {
      player.photo = result.url;
      player.cloudinaryPublicId = result.public_id;
      await player.save();
    }
  });

  // 5. AccelerationForm
  console.log('\n--- Optimizing Form Logos & Secretary Images ---');
  const forms = await AccelerationForm.find({ 
    $or: [
      { logo: { $ne: null } },
      { generalSecretaryImage: { $ne: null } }
    ] 
  });
  await processBatch(forms, async (form) => {
    let changed = false;
    if (form.logo) {
      const res = await reprocessImage(form.logo, form.logoCloudinaryPublicId, 'itu/logos');
      if (res) {
        form.logo = res.url;
        form.logoCloudinaryPublicId = res.public_id;
        changed = true;
      }
    }
    if (form.generalSecretaryImage) {
      const res = await reprocessImage(form.generalSecretaryImage, form.generalSecretaryImageCloudinaryPublicId, 'itu/secretary-images');
      if (res) {
        form.generalSecretaryImage = res.url;
        form.generalSecretaryImageCloudinaryPublicId = res.public_id;
        changed = true;
      }
    }
    if (changed) await form.save();
  });

  console.log('\n✅ Migration Completed Successfully!');
  process.exit(0);
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
