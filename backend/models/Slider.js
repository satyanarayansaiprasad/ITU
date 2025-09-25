const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  filename: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Slider', sliderSchema);
