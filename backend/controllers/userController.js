const Contact = require("../models/Contact");
// const Form = require("../models/Form");

const AccelerationForm = require("../models/AccelerationForm"); // update path as needed

const generatePassword = require("../utils/passwordGenerator");
// const News =require("../models/News")
// Handle new contact form submission
exports.contactUs = async (req, res) => {
  try {
    const { name, email, subjects, message } = req.body;

    if (!name || !email || !subjects || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, subjects, message });
    await newContact.save();

    res.status(201).json({
      message:
        "Thank you for reaching out! Our team will get back to you soon.",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Form submission controller
exports.form = async (req, res) => {
  try {
    const { state, name, email, phone, address } = req.body;

    // Check for empty fields
    if (!state || !name || !email || !phone || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingForm = await AccelerationForm.findOne({ email });
    if (existingForm) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Create and save new form entry
    // Create new form entry without password
    const newFormEntry = new AccelerationForm({
      state,
      name,
      email,
      phone,
      address,
      status: "pending",
       // Add status field
    });

    await newFormEntry.save();

    // Respond with success message
    res.status(201).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// controllers/adminController.js
exports.loginStateUnion = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const normalizedEmail = email.trim().toLowerCase();
    const stateUnion = await AccelerationForm.findOne({ 
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
    });

    if (!stateUnion) {
      return res.status(404).json({ 
        error: "No state union found with this email" 
      });
    }

    // Check approved status first
    if (stateUnion.status !== "approved") {
      if (stateUnion.rejected) {
        return res.status(403).json({ 
          error: "Your registration has been rejected" 
        });
      }
      return res.status(403).json({ 
        error: "Your registration is pending approval" 
      });
    }

    // Only check password if approved
    const expectedPassword = generatePassword(stateUnion.state);
    
    if (password !== expectedPassword) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    const { password: _, ...userData } = stateUnion.toObject();
    return res.status(200).json(userData);
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      error: "Internal server error" 
    });
  }
};

// // Example password generator - replace with your actual implementation
// function generatePassword(state) {
//   // Your actual password generation logic here
//    const cleanStateName = state.replace(/\s+/g, '').toLowerCase();
//   return `${cleanStateName}ITU@540720`;
// }
