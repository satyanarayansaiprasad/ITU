const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  filename: String, // Now stores Cloudinary URL
  cloudinaryPublicId: String, // Store Cloudinary public_id for deletion
  title: String, // Optional title for gallery image
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);
