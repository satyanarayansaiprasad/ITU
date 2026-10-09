const mongoose = require('mongoose');

const instructorRefereeRegistrationSchema = new mongoose.Schema({
  registrationNo: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  // Personal Details
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  fatherMotherName: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  nationality: {
    type: String,
    default: 'Indian',
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pinCode: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    default: null
  },

  // Taekwondo Details
  presentDan: {
    type: String,
    required: true,
    trim: true
  },
  danCertificateNo: {
    type: String,
    trim: true,
    default: ''
  },
  dateOfDanCertification: {
    type: Date,
    default: null
  },
  isAwaitingDanCertificate: {
    type: Boolean,
    default: false
  },
  academyName: {
    type: String,
    required: true,
    trim: true
  },
  yearsExperience: {
    type: Number,
    required: true,
    min: 0
  },
  currentDesignation: {
    type: String,
    required: true,
    trim: true
  },

  // Course Options & Details
  courseOption: {
    type: String,
    enum: ['instructor', 'referee', 'both'],
    required: true
  },
  selectedCourses: [{
    type: String
  }],
  feeAmount: {
    type: Number,
    required: true
  },
  previousCourseAttended: {
    type: Boolean,
    default: false
  },
  previousCourseDetails: {
    type: String,
    trim: true,
    default: ''
  },
  previousGrade: {
    type: String,
    trim: true,
    default: ''
  },

  // Payment Details
  transactionId: {
    type: String,
    required: true,
    trim: true
  },
  paymentProof: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },

  // General Status
  status: {
    type: String,
    enum: ['submitted', 'approved', 'rejected'],
    default: 'submitted'
  },
  adminNotes: {
    type: String,
    trim: true,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InstructorRefereeRegistration', instructorRefereeRegistrationSchema);
