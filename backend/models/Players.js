const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    union: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AccelerationForm',
      required: true,
    },
    unionName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    beltLevel: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    photo: {
      type: String, // Cloudinary URL
      default: null,
    },
    cloudinaryPublicId: {
      type: String,
      default: null,
    },
    playerId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but enforce uniqueness when present
    },
    password: {
      type: String,
      default: null, // Will be set when approved
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  { timestamps: true }
);

// Generate unique player ID before saving (when approved)
PlayerSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'approved' && !this.playerId) {
    // Generate player ID: ITU + timestamp + random 4 digits
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.playerId = `ITU${timestamp}${random}`;
  }
  next();
});

const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;

