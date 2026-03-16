const mongoose = require('mongoose');

const taekwondoSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  isActive: { type: Boolean, default: true },
  testDate: { type: String, default: '29th March, 2026 (Sunday)' },
  time: { type: String, default: '9:30 Am to 1:30 Pm' },
  venue: { type: String, default: 'GM-49, 1st Floor, Pratima Bhawan, Near BSNL Chowk, Chhend, Rourkela.' },
}, { timestamps: true });

module.exports = mongoose.model('TaekwondoSettings', taekwondoSettingsSchema);
