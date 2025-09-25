const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    subjects: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);

const Contact = mongoose.model('contact', ContactSchema);
module.exports = Contact;
