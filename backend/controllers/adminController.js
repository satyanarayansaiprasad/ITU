const adminService = require('../services/adminService');
const News =require('../models/News')
 const Contact =require('../models/Contact')
 const Slider = require('../models/Slider');
 const Gallery=require('../models/Gallery')
 const SelfDefenceSlider = require('../models/SelfDefenceSlider');
 const CategorySlider = require('../models/CategorySlider');
 const Player = require('../models/Players');
 const path=require("path")
 const multer = require('multer');
 const fs = require('fs');
const emailConfig = require('../config/email');
const { sendEmail } = require('../config/email');
const getEmailFrom = emailConfig.getEmailFrom;
const AccelerationForm = require('../models/AccelerationForm');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const { generateTokens } = require('../utils/jwt');

exports.login = async (req, res) => {
  try {
    const admin = await adminService.loginAdmin(req.body);
    
    // Generate JWT tokens
    const tokens = generateTokens({
      userId: admin._id.toString(),
      email: admin.email,
      role: 'admin'
    });

    // Set session (for backward compatibility)
    req.session.admin = admin._id;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: admin,
        ...tokens
      }
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message
    });
  }
};

exports.logout = (req, res) => {
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to logout'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });
};



exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

// Delete contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        error: "Contact not found" 
      });
    }

    await Contact.findByIdAndDelete(id);
    res.status(200).json({ 
      success: true, 
      message: "Contact deleted successfully" 
    });
    
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete contact",
      details: error.message 
    });
  }
};

// Create News


// Removed duplicate multer storage - using middleware/multer.js instead






exports.createNews = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const { 
      title, 
      content, 
      moreContent, 
      author, 
      category, 
      tags, 
      featured, 
      published, 
      readTime,
      metaDescription 
    } = req.body;

    if (!title || !content || !moreContent) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and full content are required"
      });
    }

    // Validate file buffer exists
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid image file. Please upload a valid image."
      });
    }

    // Upload image to Cloudinary with error handling
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadBufferToCloudinary(
        req.file.buffer,
        'itu/blog-posts',
        `blog-${Date.now()}`
      );
      
      if (!cloudinaryResult || !cloudinaryResult.url) {
        throw new Error('Cloudinary upload failed - no URL returned');
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
        error: cloudinaryError.message
      });
    }

    // Parse tags if it's a string
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : tags;
    }

    const news = new News({
      title,
      content,
      moreContent,
      image: cloudinaryResult.url, // Store Cloudinary URL
      cloudinaryPublicId: cloudinaryResult.public_id, // Store public_id for deletion
      author: author || "ITU Admin",
      category: category || "News",
      tags: parsedTags,
      featured: featured === 'true' || featured === true,
      published: published !== 'false' && published !== false,
      readTime: readTime ? parseInt(readTime) : 5,
      metaDescription: metaDescription || content.substring(0, 160)
    });

    await news.save();
    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      news
    });
  } catch (error) {
    console.error("Create News Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog post",
      error: error.message
    });
  }
};




exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });

    if (!news.length) {
      return res.status(404).json({
        success: false,
        message: "No news articles found"
      });
    }

    const updatedNews = news.map(item => {
      let imageUrl = "/default-image.png"; // Default fallback
      
      if (item.image) {
        // If image is already a full URL (Cloudinary, http/https, or data URI), use it directly
        if (/^(https?|data):/i.test(item.image)) {
          imageUrl = item.image;
        } 
        // Legacy: If it's a relative path or local filename, construct URL (for backward compatibility)
        else {
          const baseUrl = `${req.protocol}://${req.get("host")}/`;
          imageUrl = `${baseUrl}${item.image.replace(/^\//, '')}`; // Remove leading slash if present
        }
      }

      return {
        ...item._doc,
        image: imageUrl
      };
    });

    res.status(200).json({
      success: true,
      message: "News articles retrieved successfully",
      news: updatedNews
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve news"
    });
  }
};




exports.editNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      content, 
      moreContent, 
      author, 
      category, 
      tags, 
      featured, 
      published, 
      readTime,
      metaDescription 
    } = req.body;

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ 
        success: false, 
        message: "News not found" 
      });
    }

    // Update text fields
    if (title) news.title = title;
    if (content) news.content = content;
    if (moreContent) news.moreContent = moreContent;
    if (author) news.author = author;
    if (category) news.category = category;
    if (readTime) news.readTime = parseInt(readTime);
    if (metaDescription !== undefined) news.metaDescription = metaDescription;
    
    // Handle boolean fields
    if (featured !== undefined) {
      news.featured = featured === 'true' || featured === true;
    }
    if (published !== undefined) {
      news.published = published !== 'false' && published !== false;
    }

    // Parse and update tags
    if (tags !== undefined) {
      if (typeof tags === 'string') {
        news.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else if (Array.isArray(tags)) {
        news.tags = tags;
      }
    }

    // If new image uploaded, upload to Cloudinary
    if (req.file) {
      // Validate file buffer exists
      if (!req.file.buffer || req.file.buffer.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid image file. Please upload a valid image."
        });
      }

      // Delete old image from Cloudinary if it exists
      if (news.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(news.cloudinaryPublicId);
        } catch (error) {
          console.error("Error deleting old Cloudinary image:", error);
          // Continue even if deletion fails
        }
      }

      // Upload new image to Cloudinary with error handling
      let cloudinaryResult;
      try {
        cloudinaryResult = await uploadBufferToCloudinary(
          req.file.buffer,
          'itu/blog-posts',
          `blog-${Date.now()}`
        );
        
        if (!cloudinaryResult || !cloudinaryResult.url) {
          throw new Error('Cloudinary upload failed - no URL returned');
        }
        
        news.image = cloudinaryResult.url;
        news.cloudinaryPublicId = cloudinaryResult.public_id;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary",
          error: cloudinaryError.message
        });
      }
    }

    await news.save();
    res.status(200).json({ 
      success: true, 
      message: "News updated successfully", 
      news 
    });
  } catch (err) {
    console.error("Edit News Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Update failed",
      error: err.message 
    });
  }
};

// DELETE News
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found" });
    }

    // Delete image from Cloudinary if it exists
    if (news.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(news.cloudinaryPublicId);
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    await News.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "News deleted successfully" });
    
  } catch (err) {
    console.error("Delete News Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Delete failed",
      error: err.message // Send detailed error in development
    });
  }
};



//HomePage Slider mngment 




// POST: Upload a new slider image with Cloudinary
exports.createSlider = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(
      req.file.buffer,
      'itu/sliders',
      `slider-${Date.now()}`
    );

    // Save Cloudinary URL to database
      const newSlider = new Slider({
      filename: cloudinaryResult.url, // Store Cloudinary URL instead of filename
      cloudinaryPublicId: cloudinaryResult.public_id, // Store public_id for deletion
        uploadedAt: new Date()
      });

      await newSlider.save();

      res.status(201).json({
        success: true,
      message: "Slider uploaded successfully to Cloudinary",
        slider: newSlider
      });
    } catch (error) {
    console.error("Slider upload error:", error);
      res.status(500).json({
        success: false,
      message: "Failed to upload slider",
      error: error.message
      });
    }
};



// GET: Get all slider images
exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ uploadedAt: -1 });
    res.status(200).json(sliders);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT: Update a slider image by replacing the image
exports.updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findById(id);

    if (!slider) return res.status(404).json({ success: false, message: "Slider not found" });

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // Delete old image from Cloudinary if it exists
    if (slider.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(slider.cloudinaryPublicId);
      } catch (error) {
        console.error("Error deleting old Cloudinary image:", error);
        // Continue even if deletion fails
      }
    }

    // Upload new image to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(
      req.file.buffer,
      'itu/sliders',
      `slider-${Date.now()}`
    );

    // Update slider with new Cloudinary URL
    slider.filename = cloudinaryResult.url;
    slider.cloudinaryPublicId = cloudinaryResult.public_id;
    slider.uploadedAt = new Date();
    await slider.save();

    res.status(200).json({ success: true, message: "Slider updated", slider });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// DELETE: Delete a slider image from Cloudinary
exports.deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findById(id);

    if (!slider) {
      return res.status(404).json({ success: false, message: "Slider not found" });
    }

    // Delete from Cloudinary if public_id exists
    if (slider.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(slider.cloudinaryPublicId);
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await Slider.findByIdAndDelete(id);

    res.json({ success: true, message: "Slider deleted successfully from Cloudinary and database" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};





//Form
exports.getForm = async (req, res) => {
  try {
    const forms = await AccelerationForm.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forms" });
  }
};





//GalleryMngment

exports.createGallery = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(
      req.file.buffer,
      'itu/gallery',
      `gallery-${Date.now()}`
    );

    // Save Cloudinary URL to database
      const newGallery = new Gallery({
      filename: cloudinaryResult.url, // Store Cloudinary URL instead of filename
      cloudinaryPublicId: cloudinaryResult.public_id, // Store public_id for deletion
      title: req.body.title || null, // Optional title
        uploadedAt: new Date()
      });

      await newGallery.save();

      res.status(201).json({
        success: true,
      message: "Gallery image uploaded successfully to Cloudinary",
        gallery: newGallery
      });
    } catch (error) {
    console.error("Gallery upload error:", error);
      res.status(500).json({
        success: false,
      message: "Failed to upload gallery image",
      error: error.message
      });
    }
};



// GET: Get all slider images
exports.getGallery = async (req, res) => {
  try {
    const Gallerys = await Gallery.find().sort({ uploadedAt: -1 });
    res.status(200).json(Gallerys);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT: Update a gallery image by replacing the image
exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) return res.status(404).json({ success: false, message: "Gallery image not found" });

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // Delete old image from Cloudinary if it exists
    if (gallery.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(gallery.cloudinaryPublicId);
      } catch (error) {
        console.error("Error deleting old Cloudinary image:", error);
        // Continue even if deletion fails
      }
    }

    // Upload new image to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(
      req.file.buffer,
      'itu/gallery',
      `gallery-${Date.now()}`
    );

    // Update gallery with new Cloudinary URL
    gallery.filename = cloudinaryResult.url;
    gallery.cloudinaryPublicId = cloudinaryResult.public_id;
    if (req.body.title) gallery.title = req.body.title;
    gallery.uploadedAt = new Date();
    await gallery.save();

    res.status(200).json({ success: true, message: "Gallery image updated", gallery });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// DELETE: Delete a gallery image from Cloudinary
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({ success: false, message: "Gallery image not found" });
    }

    // Delete from Cloudinary if public_id exists
    if (gallery.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(gallery.cloudinaryPublicId);
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await Gallery.findByIdAndDelete(id);

    res.json({ success: true, message: "Gallery image deleted successfully from Cloudinary and database" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ========== SELF DEFENCE SLIDER MANAGEMENT ==========

// POST: Upload a new self defence slider image with Cloudinary
exports.createSelfDefenceSlider = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(
      req.file.buffer,
      'itu/self-defence-sliders',
      `self-defence-slider-${Date.now()}`
    );

    // Save Cloudinary URL to database
    const newSlider = new SelfDefenceSlider({
      filename: cloudinaryResult.url, // Store Cloudinary URL instead of filename
      cloudinaryPublicId: cloudinaryResult.public_id, // Store public_id for deletion
      uploadedAt: new Date()
    });

    await newSlider.save();

    res.status(201).json({
      success: true,
      message: "Self Defence slider uploaded successfully to Cloudinary",
      slider: newSlider
    });
  } catch (error) {
    console.error("Self Defence Slider upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload self defence slider",
      error: error.message
    });
  }
};

// GET: Get all self defence slider images
exports.getSelfDefenceSliders = async (req, res) => {
  try {
    const sliders = await SelfDefenceSlider.find().sort({ uploadedAt: -1 });
    res.status(200).json(sliders);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT: Update a self defence slider image by replacing the image
exports.updateSelfDefenceSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await SelfDefenceSlider.findById(id);

    if (!slider) return res.status(404).json({ success: false, message: "Self Defence slider not found" });

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // Delete old image from Cloudinary if it exists
    if (slider.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(slider.cloudinaryPublicId);
      } catch (error) {
        console.error("Error deleting old Cloudinary image:", error);
        // Continue even if deletion fails
      }
    }

    // Upload new image to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(
      req.file.buffer,
      'itu/self-defence-sliders',
      `self-defence-slider-${Date.now()}`
    );

    // Update slider with new Cloudinary URL
    slider.filename = cloudinaryResult.url;
    slider.cloudinaryPublicId = cloudinaryResult.public_id;
    slider.uploadedAt = new Date();
    await slider.save();

    res.status(200).json({ success: true, message: "Self Defence slider updated", slider });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// DELETE: Delete a self defence slider image from Cloudinary
exports.deleteSelfDefenceSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await SelfDefenceSlider.findById(id);

    if (!slider) {
      return res.status(404).json({ success: false, message: "Self Defence slider not found" });
    }

    // Delete from Cloudinary if public_id exists
    if (slider.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(slider.cloudinaryPublicId);
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await SelfDefenceSlider.findByIdAndDelete(id);

    res.json({ success: true, message: "Self Defence slider deleted successfully from Cloudinary and database" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ========== CATEGORY SLIDER MANAGEMENT ==========

// POST: Upload a new category slider image with Cloudinary
exports.createCategorySlider = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    const { text, order } = req.body;

    // Upload to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(
      req.file.buffer,
      'itu/category-sliders',
      `category-slider-${Date.now()}`
    );

    // Save Cloudinary URL to database
    const newSlider = new CategorySlider({
      image: cloudinaryResult.url, // Store Cloudinary URL
      cloudinaryPublicId: cloudinaryResult.public_id, // Store public_id for deletion
      text: text || '', // Caption text
      order: order ? parseInt(order) : 0,
      uploadedAt: new Date()
    });

    await newSlider.save();

    res.status(201).json({
      success: true,
      message: "Category slider uploaded successfully to Cloudinary",
      slider: newSlider
    });
  } catch (error) {
    console.error("Category Slider upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload category slider",
      error: error.message
    });
  }
};

// GET: Get all category slider images
exports.getCategorySliders = async (req, res) => {
  try {
    const sliders = await CategorySlider.find().sort({ order: 1, uploadedAt: -1 });
    res.status(200).json(sliders);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT: Update a category slider
exports.updateCategorySlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, order } = req.body;
    const slider = await CategorySlider.findById(id);

    if (!slider) return res.status(404).json({ success: false, message: "Category slider not found" });

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (slider.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(slider.cloudinaryPublicId);
        } catch (error) {
          console.error("Error deleting old Cloudinary image:", error);
        }
      }

      // Upload new image to Cloudinary
      const cloudinaryResult = await uploadBufferToCloudinary(
        req.file.buffer,
        'itu/category-sliders',
        `category-slider-${Date.now()}`
      );

      slider.image = cloudinaryResult.url;
      slider.cloudinaryPublicId = cloudinaryResult.public_id;
    }

    // Update text and order
    if (text !== undefined) slider.text = text;
    if (order !== undefined) slider.order = parseInt(order);
    slider.uploadedAt = new Date();
    
    await slider.save();

    res.status(200).json({ success: true, message: "Category slider updated", slider });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// DELETE: Delete a category slider image from Cloudinary
exports.deleteCategorySlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await CategorySlider.findById(id);

    if (!slider) {
      return res.status(404).json({ success: false, message: "Category slider not found" });
    }

    // Delete from Cloudinary if public_id exists
    if (slider.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(slider.cloudinaryPublicId);
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
      }
    }

    // Delete from database
    await CategorySlider.findByIdAndDelete(id);

    res.json({ success: true, message: "Category slider deleted successfully from Cloudinary and database" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ========== PLAYER MANAGEMENT ==========

// Get all players (for admin dashboard)
exports.getPlayers = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const players = await Player.find(query)
      .sort({ createdAt: -1 })
      .populate('union', 'name email phone');
    
    res.status(200).json({
      success: true,
      data: players,
      count: players.length
    });
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

// Generate player password: playerName + ITU + Union + 540720
const generatePlayerPassword = (playerName) => {
  const cleanName = playerName.replace(/\s+/g, '').toUpperCase();
  return `${cleanName}ITUUnion540720`;
};

// Approve multiple players at once
exports.approvePlayers = async (req, res) => {
  console.log('\n\n🔥🔥🔥 APPROVE PLAYERS FUNCTION CALLED 🔥🔥🔥');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('===========================================\n');
  
  try {
    const { playerIds } = req.body;

    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Player IDs array is required"
      });
    }

    // Find all players
    const players = await Player.find({
      _id: { $in: playerIds },
      status: 'pending'
    });

    if (players.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No pending players found with the provided IDs"
      });
    }

    const approvedPlayers = [];
    const errors = [];

    // Approve each player and send email
    for (const player of players) {
      try {
        // Generate password: playerName + ITU + Union + 540720
        const password = generatePlayerPassword(player.name);
        
        // Generate player ID if not exists
        if (!player.playerId) {
          const timestamp = Date.now().toString().slice(-8);
          const random = Math.floor(1000 + Math.random() * 9000);
          player.playerId = `ITU${timestamp}${random}`;
        }

        // Update player
        player.password = password;
        player.status = 'approved';
        player.approvedAt = new Date();
        await player.save();

        // Send welcome email automatically after approval
        console.log(`📧 Preparing to send welcome email to: ${player.email}`);
        const mailOptions = {
          from: getEmailFrom(),
          to: player.email,
          subject: "Welcome to Indian Taekwondo Union - Your Registration is Approved!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #0E2A4E;">🎉 Welcome to Indian Taekwondo Union!</h2>
              
              <p>Dear <strong>${player.name}</strong>,</p>
              
              <p>We are delighted to inform you that your player registration has been approved!</p>
              
              <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #0E2A4E; margin-top: 0;">Your Login Credentials:</h3>
                <p><strong>Player ID:</strong> ${player.playerId}</p>
                <p><strong>Email:</strong> ${player.email}</p>
                <p><strong>Password:</strong> ${password}</p>
              </div>
              
              <h3 style="color: #0E2A4E;">Next Steps:</h3>
              <ol>
                <li>Login using your Player ID or Email and the password provided above</li>
                <li>Upload your photo</li>
                <li>Complete your profile information</li>
              </ol>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0;"><strong>⚠️ Important Security Notice:</strong></p>
                <ul style="margin: 10px 0;">
                  <li>Keep your credentials secure and confidential</li>
                  <li>Do not share your password with anyone</li>
                  <li>Change your password after first login (if this feature is available)</li>
                </ul>
              </div>
              
              <p>If you have any questions or need assistance, please contact our support team.</p>
              
              <p style="margin-top: 30px;">
                Best regards,<br/>
                <strong>Indian Taekwondo Union</strong><br/>
                System Administrator
              </p>
            </div>
          `
        };

        // Use the sendEmail helper function for reliable email sending
        const emailResult = await sendEmail(mailOptions);
        if (emailResult.success) {
          // Track successful email sending
          player.emailSent = true;
          player.emailSentAt = new Date();
          player.emailError = null;
          await player.save();
          console.log(`✅ Email sent and tracked for player: ${player.name}`);
        } else {
          // Track failed email sending
          player.emailSent = false;
          player.emailError = emailResult.error || 'Unknown error';
          await player.save();
          console.error(`\n⚠️⚠️⚠️  FAILED TO SEND WELCOME EMAIL ⚠️⚠️⚠️`);
          console.error(`Player: ${player.name}`);
          console.error(`Email: ${player.email}`);
          console.error(`Error: ${emailResult.error}`);
          if (emailResult.fullError) {
            console.error('Full Error Details:', JSON.stringify(emailResult.fullError, Object.getOwnPropertyNames(emailResult.fullError), 2));
          }
          console.error(`\n`);
        }
        approvedPlayers.push({
          ...player.toObject(),
          emailSent: player.emailSent,
          emailSentAt: player.emailSentAt,
          emailError: player.emailError
        });
      } catch (error) {
        console.error(`Error approving player ${player._id}:`, error);
        errors.push({
          playerId: player._id,
          name: player.name,
          email: player.email,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `${approvedPlayers.length} player(s) approved successfully`,
      approved: approvedPlayers.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("Error approving players:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message
    });
  }
};

// Reject players
exports.rejectPlayers = async (req, res) => {
  try {
    const { playerIds, reason } = req.body;

    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Player IDs array is required"
      });
    }

    const result = await Player.updateMany(
      { _id: { $in: playerIds } },
      {
        $set: {
          status: 'rejected',
          rejectedAt: new Date(),
          rejectionReason: reason || 'Not specified'
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} player(s) rejected`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error("Error rejecting players:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

// Delete player(s)
exports.deletePlayers = async (req, res) => {
  try {
    const { playerIds } = req.body;

    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Player IDs array is required"
      });
    }

    // Find players to delete their photos from Cloudinary
    const playersToDelete = await Player.find({ _id: { $in: playerIds } });

    // Delete photos from Cloudinary
    for (const player of playersToDelete) {
      if (player.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(player.cloudinaryPublicId);
        } catch (error) {
          console.error(`Error deleting photo for player ${player._id}:`, error);
        }
      }
    }

    // Delete players from database
    const result = await Player.deleteMany({ _id: { $in: playerIds } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} player(s) deleted successfully`,
      count: result.deletedCount
    });
  } catch (error) {
    console.error("Error deleting players:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

//UserApproved

// In your backend routes



// Email transporter is now configured in backend/config/email.js






//
exports.approveForm = async (req, res) => {
  console.log('\n\n🔥🔥🔥 APPROVE FORM FUNCTION CALLED 🔥🔥🔥');
  console.log('Timestamp:', new Date().toISOString());
  console.log('📥 REQUEST RECEIVED FROM FRONTEND:');
  console.log('   Headers:', JSON.stringify(req.headers, null, 2));
  console.log('   Body:', JSON.stringify(req.body, null, 2));
  console.log('   Method:', req.method);
  console.log('   URL:', req.url);
  console.log('===========================================\n');
  
  try {
    const { formId, email, password } = req.body;
    
    // 📧 LOG: Extracted data
    console.log('\n📋 EXTRACTED DATA FROM REQUEST:');
    console.log('   formId:', formId);
    console.log('   email:', email);
    console.log('   password:', password ? '***' + password.substring(password.length - 4) : 'NOT SET');
    console.log('');

    // Validate required fields
    if (!formId) {
      return res.status(400).json({ error: "Form ID is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // 1. Update the form with password
    const updatedForm = await AccelerationForm.findByIdAndUpdate(
  formId,
  {
    password,
    status: "approved" // ✅ Add this line
  },
  { new: true }
);


    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    // 2. Send welcome email automatically after approval
    console.log('\n📧📧📧 PREPARING EMAIL TO SEND TO USER 📧📧📧');
    console.log('   Recipient Email:', email);
    console.log('   Form ID:', formId);
    console.log('   User Name:', updatedForm.name);
    console.log('   Password:', password ? '***' + password.substring(password.length - 4) : 'NOT SET');
    console.log('');
    
const mailOptions = {
  from: getEmailFrom(),
  to: email,
      subject: "🎉 Welcome to Indian Taekwondo Union - Your Affiliation Request Has Been Approved!",
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #0E2A4E 0%, #1a4a7a 100%); padding: 40px 30px; text-align: center;">
              <img src="https://itu-r1qa.onrender.com/uploads/ITU%20LOGO.png" alt="ITU Logo" style="max-width: 120px; height: auto; margin-bottom: 20px;" onerror="this.style.display='none'">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                🎉 Congratulations!
              </h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">
                Your Affiliation Request Has Been Approved
              </p>
            </td>
          </tr>

          <!-- Certificate Section -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);">
              <div style="border: 3px solid #0E2A4E; border-radius: 12px; padding: 30px; background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%); box-shadow: 0 8px 16px rgba(14, 42, 78, 0.1);">
                <div style="border: 2px dashed #0E2A4E; border-radius: 8px; padding: 25px; background-color: #ffffff;">
                  <h2 style="color: #0E2A4E; margin: 0 0 15px 0; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                    Certificate of Affiliation
                  </h2>
                  <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #0E2A4E 0%, #1a4a7a 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                    <span style="font-size: 40px;">🏆</span>
                  </div>
                  <p style="color: #1e293b; margin: 0; font-size: 18px; font-weight: 600; line-height: 1.6;">
                    This certifies that<br/>
                    <span style="color: #0E2A4E; font-size: 22px; font-weight: 700; display: block; margin: 10px 0;">${updatedForm.name}</span>
                    <span style="color: #64748b; font-size: 16px; font-weight: 400; display: block; margin-top: 8px;">
                      ${updatedForm.state} State Union
                    </span>
                  </p>
                  <p style="color: #64748b; margin: 20px 0 0 0; font-size: 14px; font-style: italic;">
                    is officially affiliated with<br/>
                    <strong style="color: #0E2A4E;">Indian Taekwondo Union</strong>
                  </p>
                  <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0; font-size: 12px;">
                      Certificate ID: ITU-${updatedForm._id.toString().substring(0, 8).toUpperCase()}<br/>
                      Date: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <!-- Login Credentials Section -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background: linear-gradient(135deg, #0E2A4E 0%, #1a4a7a 100%); border-radius: 10px; padding: 25px; box-shadow: 0 4px 12px rgba(14, 42, 78, 0.15);">
                <h3 style="color: #ffffff; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                  <span style="margin-right: 10px; font-size: 24px;">🔐</span>
                  Your Login Credentials
                </h3>
                <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                  <div style="margin-bottom: 15px;">
                    <label style="color: #cbd5e1; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;">Email Address</label>
                    <div style="background-color: #ffffff; border-radius: 6px; padding: 12px 15px; font-family: 'Courier New', monospace; font-size: 16px; color: #0E2A4E; font-weight: 600; word-break: break-all;">
                      ${email}
                    </div>
                  </div>
                  <div>
                    <label style="color: #cbd5e1; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;">Password</label>
                    <div style="background-color: #ffffff; border-radius: 6px; padding: 12px 15px; font-family: 'Courier New', monospace; font-size: 16px; color: #0E2A4E; font-weight: 600; letter-spacing: 1px;">
                      ${password}
                    </div>
                  </div>
                </div>
                <div style="background-color: rgba(255, 255, 255, 0.15); border-radius: 6px; padding: 12px; margin-top: 15px;">
                  <p style="color: #e0e7ff; margin: 0; font-size: 13px; line-height: 1.5;">
                    <strong>🔗 Login URL:</strong> <a href="https://taekwondounion.com/login" style="color: #ffffff; text-decoration: underline;">taekwondounion.com/login</a>
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Dashboard Features Section -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 10px; padding: 30px;">
                <h3 style="color: #0E2A4E; margin: 0 0 25px 0; font-size: 22px; font-weight: 700; text-align: center; display: flex; align-items: center; justify-content: center;">
                  <span style="margin-right: 10px; font-size: 28px;">✨</span>
                  What You Can Do in Your Dashboard
                </h3>
                
                <div style="display: grid; gap: 15px;">
                  <!-- Feature 1 -->
                  <div style="background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%); border-left: 4px solid #0E2A4E; border-radius: 8px; padding: 18px; transition: all 0.3s;">
                    <div style="display: flex; align-items: start;">
                      <div style="background: linear-gradient(135deg, #0E2A4E 0%, #1a4a7a 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 15px;">
                        <span style="font-size: 20px;">👤</span>
                      </div>
                      <div style="flex: 1;">
                        <h4 style="color: #0E2A4E; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">Update Your Profile</h4>
                        <p style="color: #64748b; margin: 0; font-size: 14px; line-height: 1.5;">Manage your organization details, contact information, secretary details, and upload your logo and images.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Feature 2 -->
                  <div style="background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%); border-left: 4px solid #0E2A4E; border-radius: 8px; padding: 18px;">
                    <div style="display: flex; align-items: start;">
                      <div style="background: linear-gradient(135deg, #0E2A4E 0%, #1a4a7a 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 15px;">
                        <span style="font-size: 20px;">👥</span>
                      </div>
                      <div style="flex: 1;">
                        <h4 style="color: #0E2A4E; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">View Approved Players</h4>
                        <p style="color: #64748b; margin: 0; font-size: 14px; line-height: 1.5;">Access a complete list of all approved players in your state union. Search, filter, and manage player information.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Feature 3 -->
                  <div style="background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%); border-left: 4px solid #0E2A4E; border-radius: 8px; padding: 18px;">
                    <div style="display: flex; align-items: start;">
                      <div style="background: linear-gradient(135deg, #0E2A4E 0%, #1a4a7a 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 15px;">
                        <span style="font-size: 20px;">🎯</span>
                      </div>
                      <div style="flex: 1;">
                        <h4 style="color: #0E2A4E; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">Belt Promotion Requests</h4>
                        <p style="color: #64748b; margin: 0; font-size: 14px; line-height: 1.5;">Submit belt promotion requests for your players. Track the status and manage promotion applications.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Feature 4 -->
                  <div style="background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%); border-left: 4px solid #0E2A4E; border-radius: 8px; padding: 18px;">
                    <div style="display: flex; align-items: start;">
                      <div style="background: linear-gradient(135deg, #0E2A4E 0%, #1a4a7a 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 15px;">
                        <span style="font-size: 20px;">🏆</span>
                      </div>
                      <div style="flex: 1;">
                        <h4 style="color: #0E2A4E; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">Competition Registration</h4>
                        <p style="color: #64748b; margin: 0; font-size: 14px; line-height: 1.5;">Register your players for competitions and tournaments. Submit competition entries and track registrations.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Feature 5 -->
                  <div style="background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%); border-left: 4px solid #0E2A4E; border-radius: 8px; padding: 18px;">
                    <div style="display: flex; align-items: start;">
                      <div style="background: linear-gradient(135deg, #0E2A4E 0%, #1a4a7a 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 15px;">
                        <span style="font-size: 20px;">🏅</span>
                      </div>
                      <div style="flex: 1;">
                        <h4 style="color: #0E2A4E; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">Manage Achievements</h4>
                        <p style="color: #64748b; margin: 0; font-size: 14px; line-height: 1.5;">Add and showcase achievements, awards, and accomplishments of your state union and players.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Feature 6 -->
                  <div style="background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%); border-left: 4px solid #0E2A4E; border-radius: 8px; padding: 18px;">
                    <div style="display: flex; align-items: start;">
                      <div style="background: linear-gradient(135deg, #0E2A4E 0%, #1a4a7a 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 15px;">
                        <span style="font-size: 20px;">📅</span>
                      </div>
                      <div style="flex: 1;">
                        <h4 style="color: #0E2A4E; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">View Events & News</h4>
                        <p style="color: #64748b; margin: 0; font-size: 14px; line-height: 1.5;">Stay updated with the latest events, news, and announcements from Indian Taekwondo Union.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; border-left: 4px solid #f59e0b;">
                  <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                    <strong>💡 Pro Tip:</strong> After logging in, start by updating your profile with complete information. This helps us serve you better and ensures all communications reach you correctly.
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Next Steps Section -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #ffffff; border-radius: 10px; padding: 25px; border: 2px solid #e2e8f0;">
                <h3 style="color: #0E2A4E; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                  <span style="margin-right: 10px; font-size: 24px;">🚀</span>
                  Quick Start Guide
                </h3>
                <ol style="margin: 0; padding-left: 20px; color: #1e293b;">
                  <li style="margin-bottom: 12px; line-height: 1.6;">
                    <strong style="color: #0E2A4E;">Login</strong> using your email and password provided above
                  </li>
                  <li style="margin-bottom: 12px; line-height: 1.6;">
                    <strong style="color: #0E2A4E;">Complete your profile</strong> - Add all organization details, contact information, and upload your logo
                  </li>
                  <li style="margin-bottom: 12px; line-height: 1.6;">
                    <strong style="color: #0E2A4E;">Explore features</strong> - Check out all the dashboard features mentioned above
                  </li>
                  <li style="margin-bottom: 12px; line-height: 1.6;">
                    <strong style="color: #0E2A4E;">Start managing</strong> - Begin registering players, submitting promotions, and participating in competitions
                  </li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px;">
                <p style="color: #991b1b; margin: 0 0 10px 0; font-size: 15px; font-weight: 600; display: flex; align-items: center;">
                  <span style="margin-right: 8px; font-size: 20px;">🔒</span>
                  Important Security Notice
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 14px; line-height: 1.8;">
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Do not share your password with anyone, including ITU staff</li>
                  <li>Store this password securely - you won't receive it again</li>
                  <li>If you suspect unauthorized access, contact admin immediately</li>
                  <li>Change your password after first login if this option is available</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0E2A4E; padding: 30px; text-align: center;">
              <p style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                Welcome to the ITU Family! 🎉
              </p>
              <p style="color: #cbd5e1; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                If you have any questions or need assistance, please don't hesitate to contact our support team.
              </p>
              <div style="border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 20px; margin-top: 20px;">
                <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                  Best regards,<br/>
                  <strong style="color: #ffffff; font-size: 14px;">Indian Taekwondo Union</strong><br/>
                  System Administrator
                </p>
                <p style="color: #64748b; margin: 15px 0 0 0; font-size: 11px;">
                  This is an automated email. Please do not reply to this message.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
};

    // 📧 LOG: Email data being sent
    console.log('\n📧📧📧 EMAIL DATA TO BE SENT 📧📧📧');
    console.log('   From:', mailOptions.from);
    console.log('   To:', mailOptions.to);
    console.log('   Subject:', mailOptions.subject);
    console.log('   HTML Length:', mailOptions.html.length, 'characters');
    console.log('   Email Content Preview:', mailOptions.html.substring(0, 200) + '...');
    console.log('');

    // Use the sendEmail helper function for reliable email sending
    console.log(`\n📧📧📧 CALLING sendEmail FUNCTION 📧📧📧`);
    const emailResult = await sendEmail(mailOptions);
    console.log(`\n📧📧📧 sendEmail RESULT:`, JSON.stringify(emailResult, null, 2));
    
    if (emailResult && emailResult.success) {
      // Track successful email sending
      updatedForm.emailSent = true;
      updatedForm.emailSentAt = new Date();
      updatedForm.emailError = null;
      await updatedForm.save();
      console.log(`✅ Email sent and tracked for form: ${updatedForm.name}`);
        res.status(200).json({
          success: true,
        message: "Form approved and email sent successfully",
        emailSent: true,
        emailSentAt: updatedForm.emailSentAt,
          form: updatedForm
        });
    } else {
      // Track failed email sending
      const errorMessage = emailResult?.error || emailResult?.fullError?.message || 'Unknown error';
      updatedForm.emailSent = false;
      updatedForm.emailError = errorMessage;
      await updatedForm.save();
      console.error(`\n⚠️⚠️⚠️  FAILED TO SEND APPROVAL EMAIL ⚠️⚠️⚠️`);
      console.error(`Form: ${updatedForm.name}`);
      console.error(`Email: ${email}`);
      console.error(`Error: ${errorMessage}`);
      console.error(`Full Result:`, JSON.stringify(emailResult, null, 2));
      if (emailResult?.fullError) {
        console.error('Full Error Details:', JSON.stringify(emailResult.fullError, Object.getOwnPropertyNames(emailResult.fullError), 2));
      }
      console.error(`\n`);
        res.status(200).json({
          success: true,
          message: "Form approved but email could not be sent",
        emailSent: false,
        emailError: errorMessage,
        form: updatedForm
      });
    }

  } catch (error) {
    console.error("Error approving form:", error);
    res.status(500).json({
      error: "Server error while approving form",
      details: error.message
    });
  }
};

// Set district head
exports.setDistrictHead = async (req, res) => {
  try {
    const { organizationId, district, state } = req.body;
    
    if (!organizationId || !district || !state) {
      return res.status(400).json({
        success: false,
        error: 'Organization ID, district, and state are required'
      });
    }

    // First, unset any existing district head for this district
    await AccelerationForm.updateMany(
      { 
        district: district,
        state: state,
        isDistrictHead: true
      },
      { 
        isDistrictHead: false 
      }
    );

    // Set the new district head
    const updated = await AccelerationForm.findByIdAndUpdate(
      organizationId,
      { isDistrictHead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'District head set successfully',
      data: updated
    });

  } catch (error) {
    console.error('Error setting district head:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while setting district head',
      details: error.message
    });
  }
};

// Set state head
exports.setStateHead = async (req, res) => {
  try {
    const { organizationId, state } = req.body;
    
    if (!organizationId || !state) {
      return res.status(400).json({
        success: false,
        error: 'Organization ID and state are required'
      });
    }

    // First, unset any existing state head for this state
    await AccelerationForm.updateMany(
      { 
        state: state,
        isStateHead: true
      },
      { 
        isStateHead: false 
      }
    );

    // Set the new state head
    const updated = await AccelerationForm.findByIdAndUpdate(
      organizationId,
      { isStateHead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'State head set successfully',
      data: updated
    });

  } catch (error) {
    console.error('Error setting state head:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while setting state head',
      details: error.message
    });
  }
};

// Remove district head
exports.removeDistrictHead = async (req, res) => {
  try {
    const { organizationId, district, state } = req.body;
    
    if (!organizationId || !district || !state) {
      return res.status(400).json({
        success: false,
        error: 'Organization ID, district, and state are required'
      });
    }

    // Remove district head designation
    const updated = await AccelerationForm.findByIdAndUpdate(
      organizationId,
      { isDistrictHead: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'District head removed successfully',
      data: updated
    });

  } catch (error) {
    console.error('Error removing district head:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while removing district head',
      details: error.message
    });
  }
};

// Remove state head
exports.removeStateHead = async (req, res) => {
  try {
    const { organizationId, state } = req.body;
    
    if (!organizationId || !state) {
      return res.status(400).json({
        success: false,
        error: 'Organization ID and state are required'
      });
    }

    // Remove state head designation
    const updated = await AccelerationForm.findByIdAndUpdate(
      organizationId,
      { isStateHead: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'State head removed successfully',
      data: updated
    });

  } catch (error) {
    console.error('Error removing state head:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while removing state head',
      details: error.message
    });
  }
};

// Get all organizations by state (for state head selection)
exports.getOrganizationsByState = async (req, res) => {
  try {
    const { stateName } = req.params;
    
    const organizations = await AccelerationForm.find({
      state: stateName,
      status: 'approved'
    }).select('name email phone district headOfficeAddress isDistrictHead isStateHead state secretaryName presidentName generalSecretaryImage establishedDate');
    
    res.status(200).json({ 
      success: true, 
      data: organizations 
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user completely from all databases
exports.deleteUser = async (req, res) => {
  try {
    const { formId, email } = req.body;
    
    if (!formId && !email) {
      return res.status(400).json({
        success: false,
        error: 'Form ID or email is required'
      });
    }

    let deletedCount = 0;
    const deletedFrom = [];

    // Build query
    const query = formId ? { _id: formId } : { email: { $regex: new RegExp(`^${email}$`, 'i') } };

    // Delete from AccelerationForm collection
    const accelerationResult = await AccelerationForm.deleteMany(query);
    if (accelerationResult.deletedCount > 0) {
      deletedCount += accelerationResult.deletedCount;
      deletedFrom.push('AccelerationForm');
    }

    // Delete from Contact collection
    const contactResult = await Contact.deleteMany({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (contactResult.deletedCount > 0) {
      deletedCount += contactResult.deletedCount;
      deletedFrom.push('Contact');
    }

    // Try to delete from Form collection if it exists
    try {
      const Form = require('../models/Form');
      const formResult = await Form.deleteMany({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      if (formResult.deletedCount > 0) {
        deletedCount += formResult.deletedCount;
        deletedFrom.push('Form');
      }
    } catch (e) {
      // Form model might not exist, skip
    }

    // Try to delete from Players collection if it exists
    try {
      const Players = require('../models/Players');
      const playersResult = await Players.deleteMany({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      if (playersResult.deletedCount > 0) {
        deletedCount += playersResult.deletedCount;
        deletedFrom.push('Players');
      }
    } catch (e) {
      // Players model might not exist, skip
    }

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found in any collection'
      });
    }

    res.status(200).json({
      success: true,
      message: `User deleted successfully from ${deletedFrom.join(', ')}`,
      deletedCount,
      deletedFrom
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting user',
      details: error.message
    });
  }
};

// Reject form application
exports.rejectForm = async (req, res) => {
  try {
    const { formId, email, reason } = req.body;

    if (!formId || !email) {
      return res.status(400).json({ 
        success: false,
        error: "Form ID and email are required" 
      });
    }

    // Update the form with rejected status
    const updatedForm = await AccelerationForm.findByIdAndUpdate(
      formId,
      { 
        status: "reject", // Using "reject" as per schema enum
        rejectionReason: reason || 'Not specified'
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ 
        success: false,
        error: "Form not found" 
      });
    }

    // Send rejection email
    const mailOptions = {
      from: getEmailFrom(),
      to: email,
      subject: "Your Affiliation Request Status",
      html: `
        <h2>Application Status Update</h2>
        <p>Dear ${updatedForm.name || 'Applicant'},</p>
        <p>We regret to inform you that your affiliation request has been rejected.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>If you have any questions or would like to appeal this decision, please contact our support team.</p>
        <p>Regards,<br/>
        Indian Taekwondo Union<br/>
        System Administrator</p>
      `
    };

    // Use the sendEmail helper function for reliable email sending
    const emailResult = await sendEmail(mailOptions);
    if (emailResult.success) {
        res.status(200).json({
          success: true,
        message: "Form rejected and notification sent successfully",
          form: updatedForm
        });
    } else {
      console.error(`\n⚠️⚠️⚠️  FAILED TO SEND REJECTION EMAIL ⚠️⚠️⚠️`);
      console.error(`Form: ${updatedForm.name}`);
      console.error(`Email: ${email}`);
      console.error(`Error: ${emailResult.error}`);
      if (emailResult.fullError) {
        console.error('Full Error Details:', JSON.stringify(emailResult.fullError, Object.getOwnPropertyNames(emailResult.fullError), 2));
      }
      console.error(`\n`);
        res.status(200).json({
          success: true,
          message: "Form rejected but email could not be sent",
        error: emailResult.error,
        form: updatedForm
      });
    }

  } catch (error) {
    console.error("Error rejecting form:", error);
    res.status(500).json({
      success: false,
      error: "Server error while rejecting form",
      details: error.message
    });
  }
};

// ========== BLOG-SPECIFIC ENDPOINTS ==========

// Get blog posts with filtering, pagination, and search
exports.getBlogPosts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tags, 
      search, 
      featured, 
      published = true 
    } = req.query;

    // Build filter object - make published field optional for backward compatibility
    const filter = {};
    if (published === 'false') {
      filter.published = false;
    } else if (published === 'true') {
      filter.published = true;
    }
    // If published is not specified, include all posts
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [posts, total] = await Promise.all([
      News.find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-moreContent'), // Exclude full content for list view
      News.countDocuments(filter)
    ]);

    // Update image URLs
    const updatedPosts = posts.map(post => {
      const postObj = post.toObject();
      if (postObj.image && !postObj.image.startsWith('http')) {
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://itu-r1qa.onrender.com' 
          : 'http://localhost:3001';
        postObj.image = `${baseUrl}/${postObj.image}`;
      }
      return postObj;
    });

    res.status(200).json({
      success: true,
      posts: updatedPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalPosts: total,
        hasNext: skip + posts.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog posts",
      error: error.message
    });
  }
};

// Get single blog post by slug
exports.getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await News.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } }, // Increment view count
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found"
      });
    }

    // Update image URL
    const postObj = post.toObject();
    if (postObj.image && !postObj.image.startsWith('http')) {
      postObj.image = `http://localhost:3001/${postObj.image}`;
    }

    res.status(200).json({
      success: true,
      post: postObj
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog post",
      error: error.message
    });
  }
};

// Get single news post by ID
exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await News.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // Increment view count
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "News post not found"
      });
    }

    // Update image URL - handle Cloudinary URLs and local paths
    const postObj = post.toObject();
    let imageUrl = "/default-image.png";
    
    if (postObj.image) {
      // If image is already a full URL (Cloudinary, http/https, or data URI), use it directly
      if (/^(https?|data):/i.test(postObj.image)) {
        imageUrl = postObj.image;
      } else {
        // Legacy: If it's a relative path or local filename, construct URL
        const baseUrl = `${req.protocol}://${req.get("host")}/`;
        imageUrl = `${baseUrl}${postObj.image.replace(/^\//, '')}`;
      }
    }

    res.status(200).json({
      success: true,
      news: {
        ...postObj,
        image: imageUrl
      }
    });
  } catch (error) {
    console.error("Error fetching news post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch news post",
      error: error.message
    });
  }
};

// Get blog categories
exports.getBlogCategories = async (req, res) => {
  try {
    const categories = await News.distinct('category');
    
    // Get post count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await News.countDocuments({ category });
        return { name: category, count };
      })
    );

    res.status(200).json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
};

// Get popular tags
exports.getBlogTags = async (req, res) => {
  try {
    const tags = await News.aggregate([
      { $match: {} },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.status(200).json({
      success: true,
      tags: tags.map(tag => ({ name: tag._id, count: tag.count }))
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tags",
      error: error.message
    });
  }
};

// Get featured posts
exports.getFeaturedPosts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const posts = await News.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-moreContent');

    // Update image URLs
    const updatedPosts = posts.map(post => {
      const postObj = post.toObject();
      if (postObj.image && !postObj.image.startsWith('http')) {
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://itu-r1qa.onrender.com' 
          : 'http://localhost:3001';
        postObj.image = `${baseUrl}/${postObj.image}`;
      }
      return postObj;
    });

    res.status(200).json({
      success: true,
      posts: updatedPosts
    });
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured posts",
      error: error.message
    });
  }
};

// Get related posts
exports.getRelatedPosts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 4 } = req.query;
    
    const currentPost = await News.findOne({ slug });
    if (!currentPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Find posts with similar tags or same category
    const relatedPosts = await News.find({
      _id: { $ne: currentPost._id },
      $or: [
        { category: currentPost.category },
        { tags: { $in: currentPost.tags || [] } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .select('-moreContent');

    // Update image URLs
    const updatedPosts = relatedPosts.map(post => {
      const postObj = post.toObject();
      if (postObj.image && !postObj.image.startsWith('http')) {
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://itu-r1qa.onrender.com' 
          : 'http://localhost:3001';
        postObj.image = `${baseUrl}/${postObj.image}`;
      }
      return postObj;
    });

    res.status(200).json({
      success: true,
      posts: updatedPosts
    });
  } catch (error) {
    console.error("Error fetching related posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch related posts",
      error: error.message
    });
  }
};

// ========== EMAIL TEST ENDPOINT ==========
exports.testEmail = async (req, res) => {
  console.log('\n\n🧪🧪🧪 TEST EMAIL ENDPOINT CALLED 🧪🧪🧪');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email address is required"
      });
    }

    // Check email configuration
    const emailConfig = require('../config/email');
    const emailFrom = emailConfig.getEmailFrom();
    const resendClient = emailConfig.getResendClient();
    
    console.log('\n--- Email Configuration Check ---');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '***configured***' : '❌ NOT SET');
    console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'not set (using default)');
    console.log('RESEND_FROM_NAME:', process.env.RESEND_FROM_NAME || 'not set (using default)');
    console.log('Email From:', emailFrom);
    console.log('Resend Client:', resendClient ? '✅ Available' : '❌ Not Available');
    
    if (!resendClient) {
      return res.status(500).json({
        success: false,
        error: "Resend email client is not configured",
        details: {
          RESEND_API_KEY: process.env.RESEND_API_KEY ? 'set' : 'NOT SET',
          RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'not set',
          RESEND_FROM_NAME: process.env.RESEND_FROM_NAME || 'not set'
        }
      });
    }

    const mailOptions = {
      from: emailFrom,
      to: email,
      subject: "🧪 Test Email - ITU System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0E2A4E;">Test Email from ITU System</h2>
          <p>This is a test email to verify that the email system is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>From:</strong> ${emailFrom}</p>
          <p><strong>To:</strong> ${email}</p>
          <p>If you received this email, the email system is configured correctly!</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This is an automated test email from Indian Taekwondo Union system.</p>
        </div>
      `,
      text: `Test Email from ITU System\n\nThis is a test email to verify that the email system is working correctly.\nTimestamp: ${new Date().toISOString()}\nFrom: ${emailFrom}\nTo: ${email}\n\nIf you received this email, the email system is configured correctly!`
    };

    console.log('\n--- Sending Test Email ---');
    console.log('To:', email);
    console.log('From:', emailFrom);
    
    const { sendEmail } = require('../config/email');
    const emailResult = await sendEmail(mailOptions);
    
    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Test email sent successfully",
        details: {
          to: email,
          from: emailFrom,
          messageId: emailResult.info?.messageId,
          response: emailResult.info?.response
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to send test email",
        details: {
          error: emailResult.error,
          to: email,
          from: emailFrom
        }
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: "Server error while sending test email",
      details: error.message
    });
  }
};

// ========== ANALYTICS ENDPOINTS ==========

// Get dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const [
      totalPosts,
      totalContacts,
      totalForms,
      totalGalleryImages,
      recentPosts,
      contactsThisMonth,
      formsThisMonth,
      postsThisMonth,
      categoryStats,
      monthlyStats
    ] = await Promise.all([
      News.countDocuments(),
      Contact.countDocuments(),
      AccelerationForm.countDocuments(),
      Gallery.countDocuments(),
      News.find().sort({ createdAt: -1 }).limit(5),
      Contact.countDocuments({
        createdAt: { 
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
        }
      }),
      AccelerationForm.countDocuments({
        createdAt: { 
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
        }
      }),
      News.countDocuments({
        createdAt: { 
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
        }
      }),
      News.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      News.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            posts: { $sum: 1 },
            views: { $sum: "$views" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalPosts,
          totalContacts,
          totalForms,
          totalGalleryImages,
          contactsThisMonth,
          formsThisMonth,
          postsThisMonth
        },
        recentPosts: recentPosts.map(post => ({
          title: post.title,
          category: post.category,
          views: post.views,
          createdAt: post.createdAt
        })),
        categoryStats,
        monthlyStats: monthlyStats.map(stat => ({
          month: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}`,
          posts: stat.posts,
          views: stat.views
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message
    });
  }
};

// Get user engagement analytics
exports.getUserEngagement = async (req, res) => {
  try {
    const [
      topPosts,
      engagementByCategory,
      dailyViews
    ] = await Promise.all([
      News.find()
        .sort({ views: -1 })
        .limit(10)
        .select('title views category createdAt'),
      News.aggregate([
        {
          $group: {
            _id: "$category",
            totalViews: { $sum: "$views" },
            avgViews: { $avg: "$views" },
            postCount: { $sum: 1 }
          }
        },
        { $sort: { totalViews: -1 } }
      ]),
      News.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            views: { $sum: "$views" },
            posts: { $sum: 1 }
          }
        },
        { $sort: { "_id": -1 } },
        { $limit: 30 }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        topPosts,
        engagementByCategory,
        dailyViews: dailyViews.reverse()
      }
    });
  } catch (error) {
    console.error("Error fetching user engagement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user engagement data",
      error: error.message
    });
  }
};

// Get content performance
exports.getContentPerformance = async (req, res) => {
  try {
    const [
      publishedVsDraft,
      featuredVsRegular,
      tagPopularity
    ] = await Promise.all([
      News.aggregate([
        {
          $group: {
            _id: "$published",
            count: { $sum: 1 }
          }
        }
      ]),
      News.aggregate([
        {
          $group: {
            _id: "$featured",
            count: { $sum: 1 },
            avgViews: { $avg: "$views" }
          }
        }
      ]),
      News.aggregate([
        { $unwind: "$tags" },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
            totalViews: { $sum: "$views" }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 15 }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        publishedVsDraft,
        featuredVsRegular,
        tagPopularity
      }
    });
  } catch (error) {
    console.error("Error fetching content performance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch content performance data",
      error: error.message
    });
  }
};