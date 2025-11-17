const Contact = require("../models/Contact");
// const Form = require("../models/Form");

const AccelerationForm = require("../models/AccelerationForm"); // update path as needed
const Player = require("../models/Players");

const generatePassword = require("../utils/passwordGenerator");
const path = require("path");
const fs = require("fs");
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
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
    // For affiliation forms, the "name" field is actually the secretary name
    const newFormEntry = new AccelerationForm({
      state,
      secretaryName: name, // Save name as secretaryName for affiliation forms
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

// Upload logo to Cloudinary
exports.uploadLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    
    console.log('Upload Logo Request:', { id, file: file ? { size: file.size, mimetype: file.mimetype } : null });
    
    if (!file) {
      console.error('No file received in uploadLogo');
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }
    
    // Get existing profile to delete old Cloudinary image if exists
    const existingProfile = await AccelerationForm.findById(id);
    
    // Upload to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(
      file.buffer,
      'itu/logos',
      `logo-${id}-${Date.now()}`
    );
    
    // Delete old logo from Cloudinary if it exists and is a Cloudinary URL
    if (existingProfile && existingProfile.logo && existingProfile.logo.includes('cloudinary.com')) {
      // Extract public_id from Cloudinary URL or use stored cloudinaryPublicId
      if (existingProfile.logoCloudinaryPublicId) {
        try {
          await deleteFromCloudinary(existingProfile.logoCloudinaryPublicId);
        } catch (error) {
          console.error('Error deleting old logo from Cloudinary:', error);
          // Continue even if deletion fails
        }
      }
    }
    
    // Save Cloudinary URL to database
    const updatedProfile = await AccelerationForm.findByIdAndUpdate(
      id,
      { 
        logo: cloudinaryResult.url,
        logoCloudinaryPublicId: cloudinaryResult.public_id
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedProfile) {
      console.error('State union not found:', id);
      return res.status(404).json({ success: false, error: "State union not found" });
    }
    
    console.log('Logo saved successfully to Cloudinary:', { 
      id, 
      logo: updatedProfile.logo,
      cloudinaryPublicId: updatedProfile.logoCloudinaryPublicId
    });
    
    res.status(200).json({ 
      success: true, 
      logoUrl: cloudinaryResult.url,
      data: updatedProfile 
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
    res.status(500).json({ success: false, error: "Internal server error", details: error.message });
  }
};

// Upload general secretary image to Cloudinary
exports.uploadGeneralSecretaryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    
    console.log('Upload General Secretary Image Request:', { id, file: file ? { size: file.size, mimetype: file.mimetype } : null });
    
    if (!file) {
      console.error('No file received in uploadGeneralSecretaryImage');
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }
    
    // Get existing profile to delete old Cloudinary image if exists
    const existingProfile = await AccelerationForm.findById(id);
    
    // Upload to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(
      file.buffer,
      'itu/secretary-images',
      `secretary-${id}-${Date.now()}`
    );
    
    // Delete old secretary image from Cloudinary if it exists and is a Cloudinary URL
    if (existingProfile && existingProfile.generalSecretaryImage && existingProfile.generalSecretaryImage.includes('cloudinary.com')) {
      // Extract public_id from Cloudinary URL or use stored cloudinaryPublicId
      if (existingProfile.generalSecretaryImageCloudinaryPublicId) {
        try {
          await deleteFromCloudinary(existingProfile.generalSecretaryImageCloudinaryPublicId);
        } catch (error) {
          console.error('Error deleting old secretary image from Cloudinary:', error);
          // Continue even if deletion fails
        }
      }
    }
    
    // Save Cloudinary URL to database
    const updatedProfile = await AccelerationForm.findByIdAndUpdate(
      id,
      { 
        generalSecretaryImage: cloudinaryResult.url,
        generalSecretaryImageCloudinaryPublicId: cloudinaryResult.public_id
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedProfile) {
      console.error('State union not found:', id);
      return res.status(404).json({ success: false, error: "State union not found" });
    }
    
    console.log('General secretary image saved successfully to Cloudinary:', { 
      id, 
      generalSecretaryImage: updatedProfile.generalSecretaryImage,
      cloudinaryPublicId: updatedProfile.generalSecretaryImageCloudinaryPublicId
    });
    
    res.status(200).json({ 
      success: true, 
      generalSecretaryImageUrl: cloudinaryResult.url,
      data: updatedProfile 
    });
  } catch (error) {
    console.error("Error uploading general secretary image:", error);
    res.status(500).json({ success: false, error: "Internal server error", details: error.message });
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

// ========== PLAYER REGISTRATION ==========

// Register multiple players at once
exports.registerPlayers = async (req, res) => {
  try {
    const { state, district, players } = req.body;

    // Validate required fields
    if (!state || !district || !players || !Array.isArray(players) || players.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "State, district, and at least one player are required" 
      });
    }

    // Validate union is provided
    const { union } = req.body;
    if (!union) {
      return res.status(400).json({
        success: false,
        error: "Union selection is required"
      });
    }

    // Verify union exists and matches state/district
    const unionOrg = await AccelerationForm.findById(union);
    if (!unionOrg) {
      return res.status(404).json({
        success: false,
        error: "Selected union not found"
      });
    }

    if (unionOrg.state !== state || unionOrg.district !== district) {
      return res.status(400).json({
        success: false,
        error: "Selected union does not match the selected state and district"
      });
    }

    // Validate each player
    const validatedPlayers = [];
    const errors = [];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      
      if (!player.name || !player.email || !player.phone || !player.address || 
          !player.dob || !player.beltLevel || !player.yearsOfExperience) {
        errors.push(`Player ${i + 1}: All fields are required`);
        continue;
      }

      // Check if email already exists
      const existingPlayer = await Player.findOne({ 
        email: player.email.toLowerCase().trim() 
      });
      
      if (existingPlayer) {
        errors.push(`Player ${i + 1} (${player.email}): Email already exists`);
        continue;
      }

      validatedPlayers.push({
        name: player.name.trim(),
        email: player.email.toLowerCase().trim(),
        phone: player.phone.toString(),
        state: state,
        district: district,
        union: union,
        unionName: unionOrg.name,
        address: player.address.trim(),
        dob: new Date(player.dob),
        beltLevel: player.beltLevel.trim(),
        yearsOfExperience: parseInt(player.yearsOfExperience) || 0,
        status: 'pending'
      });
    }

    if (validatedPlayers.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid players to register",
        errors: errors
      });
    }

    // Insert all valid players
    const savedPlayers = await Player.insertMany(validatedPlayers);

    res.status(201).json({
      success: true,
      message: `${savedPlayers.length} player(s) registered successfully`,
      data: savedPlayers,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("Error registering players:", error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "One or more players with this email already exist"
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message
    });
  }
};

// Player login
exports.playerLogin = async (req, res) => {
  try {
    const { playerId, password } = req.body;

    if (!playerId || !password) {
      return res.status(400).json({
        success: false,
        error: "Player ID and password are required"
      });
    }

    // Find player by playerId or email
    const player = await Player.findOne({
      $or: [
        { playerId: playerId.trim() },
        { email: playerId.toLowerCase().trim() }
      ]
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        error: "Invalid Player ID or email"
      });
    }

    // Check if player is approved
    if (player.status !== 'approved') {
      return res.status(403).json({
        success: false,
        error: "Your registration is pending approval"
      });
    }

    // Check if password is set
    if (!player.password) {
      return res.status(403).json({
        success: false,
        error: "Your account is not activated. Please contact administrator."
      });
    }

    // Verify password
    if (player.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Invalid password"
      });
    }

    // Return player data (without password)
    const playerData = player.toObject();
    delete playerData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: playerData
    });
  } catch (error) {
    console.error("Error in player login:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

// Get player profile by ID
exports.getPlayerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id).select('-password');
    
    if (!player) {
      return res.status(404).json({ 
        success: false,
        error: "Player not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: player 
    });
  } catch (error) {
    console.error("Error fetching player profile:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

// Update player profile
exports.updatePlayerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.playerId;
    delete updateData.status;
    delete updateData.approvedAt;
    delete updateData.approvedBy;

    const player = await Player.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!player) {
      return res.status(404).json({
        success: false,
        error: "Player not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: player
    });
  } catch (error) {
    console.error("Error updating player profile:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

// Get players by union (for organization dashboard)
exports.getPlayersByUnion = async (req, res) => {
  try {
    const { unionId } = req.params;
    const { 
      status = 'approved', 
      search = '', 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build query
    const query = {
      union: unionId,
      status: status
    };

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { beltLevel: { $regex: search, $options: 'i' } },
        { playerId: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Player.countDocuments(query);

    // Get players with pagination
    const players = await Player.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('union', 'name email phone')
      .lean();

    res.status(200).json({
      success: true,
      data: players,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalPlayers: total,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error("Error fetching players by union:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

// Upload player photo
exports.uploadPlayerPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({
        success: false,
        error: "Player not found"
      });
    }

    // Delete old photo from Cloudinary if exists
    if (player.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(player.cloudinaryPublicId);
      } catch (error) {
        console.error("Error deleting old photo from Cloudinary:", error);
      }
    }

    // Upload new photo to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(
      file.buffer,
      'itu/player-photos',
      `player-${id}-${Date.now()}`
    );

    // Update player photo
    player.photo = cloudinaryResult.url;
    player.cloudinaryPublicId = cloudinaryResult.public_id;
    await player.save();

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      photoUrl: cloudinaryResult.url,
      data: player
    });
  } catch (error) {
    console.error("Error uploading player photo:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
// function generatePassword(state) {
//   // Your actual password generation logic here
//    const cleanStateName = state.replace(/\s+/g, '').toLowerCase();
//   return `${cleanStateName}ITU@540720`;
// }
