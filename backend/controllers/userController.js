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
    const { state, name, email, phone, address, district } = req.body;

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
      district: district || "",
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

// Update state union profile
exports.updateStateUnionProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Prevent updating state and district via this endpoint
    delete updateData.state;
    delete updateData.district;

    // Clean up any undefined or empty string values to keep DB clean
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Ensure establishedDate is properly formatted if provided
    if (updateData.establishedDate) {
      // If it's already a date string, ensure it's in correct format
      if (typeof updateData.establishedDate === 'string' && updateData.establishedDate.includes('-')) {
        // Already formatted, keep as is
      } else {
        // Convert to Date object if needed
        updateData.establishedDate = new Date(updateData.establishedDate);
      }
    }
    
    const updatedProfile = await AccelerationForm.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({ error: "State union not found" });
    }
    
    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Upload logo
exports.uploadLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const imageUrl = `uploads/${file.filename}`;
    const updatedProfile = await AccelerationForm.findByIdAndUpdate(
      id,
      { logo: imageUrl },
      { new: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({ error: "State union not found" });
    }
    
    res.status(200).json({ 
      success: true, 
      logoUrl: imageUrl,
      data: updatedProfile 
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Upload general secretary image
exports.uploadGeneralSecretaryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const imageUrl = `uploads/${file.filename}`;
    const updatedProfile = await AccelerationForm.findByIdAndUpdate(
      id,
      { generalSecretaryImage: imageUrl },
      { new: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({ error: "State union not found" });
    }
    
    res.status(200).json({ 
      success: true, 
      generalSecretaryImageUrl: imageUrl,
      data: updatedProfile 
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get organizations by district
exports.getOrganizationsByDistrict = async (req, res) => {
  try {
    const { stateName, districtName } = req.params;
    
    const organizations = await AccelerationForm.find({
      state: stateName,
      district: districtName,
      status: 'approved'
    }).select('name email phone address district state isDistrictHead isStateHead secretaryName presidentName generalSecretaryImage establishedDate headOfficeAddress contactEmail contactPhone officialWebsite aboutUnion logo').lean();
    
    // Sort: district head first, then state head, then others
    organizations.sort((a, b) => {
      if (a.isDistrictHead && !b.isDistrictHead) return -1;
      if (!a.isDistrictHead && b.isDistrictHead) return 1;
      if (a.isStateHead && !b.isStateHead) return -1;
      if (!a.isStateHead && b.isStateHead) return 1;
      return 0;
    });
    
    res.status(200).json({ 
      success: true, 
      data: organizations 
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get state union by ID
exports.getStateUnionById = async (req, res) => {
  try {
    const { id } = req.params;
    const stateUnion = await AccelerationForm.findById(id);
    
    if (!stateUnion) {
      return res.status(404).json({ error: "State union not found" });
    }
    
    res.status(200).json({ success: true, data: stateUnion });
  } catch (error) {
    console.error("Error fetching state union:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// function generatePassword(state) {
//   // Your actual password generation logic here
//    const cleanStateName = state.replace(/\s+/g, '').toLowerCase();
//   return `${cleanStateName}ITU@540720`;
// }
