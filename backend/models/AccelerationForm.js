const mongoose = require("mongoose");

const accelerationFormSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved','reject'],
      default: 'pending'
    },
    role: {
    type: String,
    enum: ['admin', 'stateunion', 'player'], // restrict values
    default: 'stateunion' // default value
  },
  presidentName: String,
  secretaryName: String,
  directorName: String,
  establishedDate: Date,
  headOfficeAddress: String,
  contactEmail: String,
  contactPhone: String,
  officialWebsite: String,
  aboutUnion: String,
   // Array of Object - Achievements
    achievements: [
      {
        title: String,
        year: Number,
        description: String
      }
    ],
       galleryImages: [
      {
        url: String,
        caption: String,
        event: String,
        date: Date
      }
    ],
  galleryImages: [String],
  logo: String,
  logoCloudinaryPublicId: String, // Store Cloudinary public_id for logo deletion
  generalSecretaryImage: String,
  generalSecretaryImageCloudinaryPublicId: String, // Store Cloudinary public_id for secretary image deletion
  isDistrictHead: {
    type: Boolean,
    default: false
  },
  isStateHead: {
    type: Boolean,
    default: false
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
  emailSentAt: {
    type: Date,
    default: null,
  },
  emailError: {
    type: String,
    default: null,
  },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AccelerationForm", accelerationFormSchema);