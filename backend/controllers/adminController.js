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
const nodemailer = require("nodemailer");
const AccelerationForm = require('../models/AccelerationForm');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

exports.login = async (req, res) => {
  try {
    const admin = await adminService.loginAdmin(req.body);
    req.session.admin = admin._id;
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: 'Logged out' });
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

// Create News


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create uploads directory if it doesn't exist
        
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
      } else {
          cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."), false);
      }
  }
});






exports.createNews = (req, res) => {
  upload.single("image")(req, res, async (err) => {
      if (err) {
          console.error("File upload error:", err);
          return res.status(500).json({
              success: false,
              message: "File upload failed"
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
      const image = req.file ? `uploads/${req.file.filename}` : null;

      // ✅ Correct the validation check
      if (!title || !content || !moreContent || !image) {
          return res.status(400).json({
              success: false,
              message: "All fields including the image are required"
          });
      }

      try {
          // Parse tags if it's a string
          let parsedTags = [];
          if (tags) {
            parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
          }

          const news = new News({
              title,
              content,
              moreContent,
              image,
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
          console.error("Database error:", error);
          res.status(500).json({
              success: false,
              message: "Failed to create blog post",
              error: error.message
          });
      }
  });
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
        // If image is already a full URL (http/https) or data URI
        if (/^(https?|data):/i.test(item.image)) {
          imageUrl = item.image;
        } 
        // If it's a relative path
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
    const { title, content, moreContent } = req.body;

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ success: false, message: "News not found" });

    news.title = title;
    news.content = content;
    news.moreContent = moreContent;

    // If new image uploaded
    if (req.file) {
      // Remove old image
      const oldImagePath = path.join("uploads/", news.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);

      news.image = req.file.filename;
    }

    await news.save();
    res.status(200).json({ success: true, message: "News updated successfully", news });
  } catch (err) {
    console.error("Edit News Error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
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

    // Delete image if exists
    if (news.image) {
      const imagePath = path.join(__dirname, '../uploads', news.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image: ${imagePath}`);
        } else {
          console.log(`Image not found at: ${imagePath}, proceeding with DB deletion`);
        }
      } catch (fileErr) {
        console.error("File deletion error:", fileErr);
        // Continue with DB deletion even if file deletion fails
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
      .select('-password');
    
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

        // Send welcome email
        const mailOptions = {
          from: `"Indian Taekwondo Union" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
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

        await transporter.sendMail(mailOptions);
        approvedPlayers.push(player);
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

//UserApproved

// In your backend routes



// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});






//
exports.approveForm = async (req, res) => {
  try {
    const { formId, email, password } = req.body;

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

    // 2. Send email with credentials
const mailOptions = {
  from: `"Indian Taekwondo Union" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
  to: email,
  subject: "Your Affiliation Request Has Been Approved",
  html: `
    <h2>Congratulations! Your Affiliation Request Has Been Approved</h2>
    
    <p>Dear ${updatedForm.name},</p>
    
    <p>We are pleased to inform you that your affiliation request has been approved by the admin.</p>
    
    <p><strong>Next Steps:</strong></p>
    <p>Please update your profile by logging in using the password that was already generated and sent to you via email.</p>
    
    <p><strong>Login Email:</strong> ${email}</p>
    <p><strong>Password:</strong> ${password}</p>
    
    <h3>IMPORTANT:</h3>
    <ul>
      <li>This password was previously sent to you when your account was created</li>
      <li>Please use this same password to login and update your profile</li>
      <li>Store this password securely</li>
      <li>Do not share this password with anyone</li>
    </ul>
    
    <p>After logging in, please complete your profile update to ensure all information is current.</p>
    
    <p>If you didn't request this account or have any questions, contact admin immediately.</p>
    
    <p>Regards,<br/>
    Indian Taekwondo Union<br/>
    System Administrator</p>
  `
};

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Form approved and email sent",
      form: updatedForm
    });

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
    }).select('name email phone district headOfficeAddress isDistrictHead isStateHead state');
    
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

// // In your backend controller
// exports.rejectForm = async (req, res) => {
//   try {
//     const { formId, email } = req.body;

//     // Update the form with rejected status and clear any existing approval
//     const updatedForm = await User.findByIdAndUpdate(
//       formId,
//       { 
//         rejected: true,
//         password: undefined, // Clear any existing password if present
//         $unset: { password: 1 } // Alternative way to remove the field
//       },
//       { new: true }
//     );

//     if (!updatedForm) {
//       return res.status(404).json({ error: "Form not found" });
//     }

//     // Send rejection email
//     const mailOptions = {
//       from: `"Indian Taekwondo Union" <${process.env.EMAIL_FROM}>`,
//       to: email,
//       subject: "Your Application Status",
//       html: `
//         <p>We regret to inform you that your application has been rejected.</p>
//         <p>For more information, please contact our support team.</p>
//       `
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({
//       success: true,
//       message: "Form rejected and notification sent",
//       form: updatedForm
//     });

//   } catch (error) {
//     console.error("Error rejecting form:", error);
//     res.status(500).json({
//       error: "Server error while rejecting form",
//       details: error.message
//     });
//   }
// };

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