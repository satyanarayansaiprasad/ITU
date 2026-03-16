const mongoose = require('mongoose');

const taekwondoRegistrationSchema = new mongoose.Schema({
  playerName: { type: String, required: true, trim: true },
  fatherName: { type: String, required: true, trim: true },
  academyName: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },
  dob: { type: String, required: true },
  beltTest: { type: String, required: true },
  transactionId: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('TaekwondoRegistration', taekwondoRegistrationSchema);
