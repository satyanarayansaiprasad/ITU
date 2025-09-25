const adminService = require('../services/adminService');
const News =require('../models/News')
 const Contact =require('../models/Contact')
 const Slider = require('../models/Slider');
 const Gallery=require('../models/Gallery')
 const path=require("path")
 const multer = require('multer');
 const fs = require('fs');
const nodemailer = require("nodemailer");
const AccelerationForm = require('../models/AccelerationForm');

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




// POST: Upload a new slider image

// Your controller
exports.createSlider = (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(500).json({
        success: false,
        message: "File upload failed"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    try {
      const newSlider = new Slider({
        filename: req.file.filename, // e.g., 1749670368854.jpg
        uploadedAt: new Date()
      });

      await newSlider.save();

      res.status(201).json({
        success: true,
        message: "Slider uploaded successfully",
        slider: newSlider
      });
    } catch (error) {
      console.error("Database save error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to save slider"
      });
    }
  });
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

    // Delete old image from disk
    const oldPath = path.join(__dirname, "../uploads", slider.filename);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

    // Save new image file
    slider.filename = req.file.filename;
    slider.uploadedAt = new Date();
    await slider.save();

    res.status(200).json({ success: true, message: "Slider updated", slider });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE: Delete a slider image
exports.deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findById(id);

    if (!slider) {
      return res.status(404).json({ success: false, message: "Slider not found" });
    }

    const imagePath = path.join(__dirname, "../uploads", slider.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // delete the image file
    }

    await Slider.findByIdAndDelete(id);

    res.json({ success: true, message: "Slider deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





//Form
exports.getForm = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};





//GalleryMngment

exports.createGallery = (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(500).json({
        success: false,
        message: "File upload failed"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    try {
      const newGallery = new Gallery({
        filename: req.file.filename, // e.g., 1749670368854.jpg
        uploadedAt: new Date()
      });

      await newGallery.save();

      res.status(201).json({
        success: true,
        message: "Slider uploaded successfully",
        gallery: newGallery
      });
    } catch (error) {
      console.error("Database save error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to save slider"
      });
    }
  });
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

// PUT: Update a slider image by replacing the image
exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) return res.status(404).json({ success: false, message: "Slider not found" });

    // Delete old image from disk
    const oldPath = path.join(__dirname, "../uploads", gallery.filename);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

    // Save new image file
    gallery.filename = req.file.filename;
    gallery.uploadedAt = new Date();
    await gallery.save();

    res.status(200).json({ success: true, message: "Slider updated", slider });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE: Delete a slider image
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({ success: false, message: "Slider not found" });
    }

    const imagePath = path.join(__dirname, "../uploads", slider.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // delete the image file
    }

    await Gallery.findByIdAndDelete(id);

    res.json({ success: true, message: "Slider deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
    const updatedForm = await User.findByIdAndUpdate(
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
    // 2. Send email with credentials
const mailOptions = {
  from: `"Indian Taekwondo Union" <${process.env.EMAIL_FROM}>`,
  to: email,
  subject: "Your Permanent Account Credentials",
  html: `
    <h2>Your Account Approval</h2>
    
    <p><strong>Login Email:</strong> ${email}</p>
    <p><strong>Permanent Password:</strong> ${password}</p>
    
    <h3>IMPORTANT:</h3>
    <ul>
      <li>This password is permanent and cannot be changed</li>
      <li>You will use this same password every time you login</li>
      <li>Store this password securely</li>
      <li>Do not share this password with anyone</li>
    </ul>
    
    <p>If you didn't request this account, contact admin immediately.</p>
    
    <p>Regards,<br/>
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
        postObj.image = `http://localhost:3001/${postObj.image}`;
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
        postObj.image = `http://localhost:3001/${postObj.image}`;
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
        postObj.image = `http://localhost:3001/${postObj.image}`;
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