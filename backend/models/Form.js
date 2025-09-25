const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Make email unique
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Form = mongoose.model('form', FormSchema);
module.exports = Form;
