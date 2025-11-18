const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
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
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'news',
    required: true
  },
  competitionTitle: {
    type: String,
    required: true
  },
  competitionCategory: {
    type: String,
    required: true
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
    playerIdNumber: String,
    email: String,
    phone: String,
    dob: Date,
    beltLevel: String,
    unionName: String,
    unionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AccelerationForm'
    }
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

module.exports = mongoose.model('Competition', competitionSchema);

