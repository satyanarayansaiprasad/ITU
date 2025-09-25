const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  filename: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);
