const mongoose = require("mongoose");

const Newschema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // Short description/excerpt
    moreContent: { type: String, required: true }, // Full blog content
    image: { type: String, required: true }, // Featured image
    author: { type: String, default: "ITU Admin" },
    category: { 
      type: String, 
      enum: ["Training", "Events", "News", "Competitions", "Achievements", "Self Defence", "Health & Fitness"],
      default: "News" 
    },
    tags: [{ type: String }], // Array of tags
    featured: { type: Boolean, default: false }, // For featured articles
    published: { type: Boolean, default: true },
    readTime: { type: Number, default: 5 }, // Estimated read time in minutes
    views: { type: Number, default: 0 }, // View count
    slug: { type: String, unique: true }, // URL-friendly version of title
    metaDescription: { type: String }, // SEO description
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true // This will automatically handle createdAt and updatedAt
  }
);

// Pre-save middleware to generate slug
Newschema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    // Generate slug from title
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();
    
    // Add timestamp to ensure uniqueness
    this.slug += '-' + Date.now();
  }
  
  // Update the updatedAt field
  this.updatedAt = new Date();
  
  next();
});

const News = mongoose.model('news', Newschema);
module.exports = News;
