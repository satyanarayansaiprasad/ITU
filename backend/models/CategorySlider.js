const mongoose = require('mongoose');

const categorySliderSchema = new mongoose.Schema({
  image: String, // Cloudinary URL
  cloudinaryPublicId: String, // Store Cloudinary public_id for deletion
  text: String, // Caption text to display on the image
  order: {
    type: Number,
    default: 0
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CategorySlider', categorySliderSchema);

