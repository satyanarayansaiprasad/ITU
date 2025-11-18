const mongoose = require('mongoose');

const beltPromotionSchema = new mongoose.Schema({
  unionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccelerationForm',
    required: true
  },
  unionName: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  tests: [{
    beltLevel: {
      type: String,
      required: true,
      enum: [
        'Yellow',
        'Yellow One',
        'Green',
        'Green One',
        'Blue',
        'Blue One',
        'Red',
        'Red One',
        '1st Dan Black Belt',
        '2nd Dan Black Belt',
        '3rd Dan Black Belt',
        '4th Dan Black Belt',
        '5th Dan Black Belt',
        '6th Dan Black Belt',
        '7th Dan Black Belt',
        '8th Dan Black Belt',
        '9th Dan Black Belt'
      ]
    },
    players: [{
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      },
      playerName: {
        type: String,
        required: true
      },
      currentBelt: {
        type: String,
        required: true
      },
      email: String,
      phone: String,
      dob: Date,
      playerIdNumber: String
    }]
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  rejectionReason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('BeltPromotion', beltPromotionSchema);

