const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Player = require('../models/Players');
const connectDB = require('../config/db');

async function migratePasswords() {
  try {
    // Check for MongoDB URI
    if (!process.env.MONGO_URI) {
      console.error('Error: MONGO_URI not found in .env');
      process.exit(1);
    }

    await connectDB();
    console.log('✅ Connected to database');

    // Find all approved players who have a DOB
    const players = await Player.find({ 
      status: 'approved',
      dob: { $exists: true, $ne: null }
    });
    
    console.log(`🔍 Found ${players.length} approved players to update`);

    let updatedCount = 0;
    for (const player of players) {
      const year = new Date(player.dob).getFullYear();
      const newPassword = `Itu@${year}`;
      
      // Update with plain text password (will be hashed on next login)
      player.password = newPassword;
      await player.save();
      
      updatedCount++;
      if (updatedCount % 10 === 0) {
        console.log(`⏳ Progress: ${updatedCount}/${players.length} updated...`);
      }
    }

    console.log(`\n✨ Migration complete!`);
    console.log(`✅ Successfully updated ${updatedCount} players' passwords to Itu@YYYY format.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migratePasswords();
