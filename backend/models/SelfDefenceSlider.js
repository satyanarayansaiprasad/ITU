const mongoose = require('mongoose');

const selfDefenceSliderSchema = new mongoose.Schema({
  filename: String, // Now stores Cloudinary URL
  cloudinaryPublicId: String, // Store Cloudinary public_id for deletion
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SelfDefenceSlider', selfDefenceSliderSchema);

