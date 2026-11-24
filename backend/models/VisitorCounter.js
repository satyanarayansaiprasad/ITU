const mongoose = require('mongoose');

const visitorCounterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      default: 'total_visitors',
    },
    count: {
      type: Number,
      required: true,
      default: 125143,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const VisitorCounter = mongoose.model('VisitorCounter', visitorCounterSchema);

module.exports = VisitorCounter;
