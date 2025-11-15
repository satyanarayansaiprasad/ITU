const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist (for fallback/local storage)
const uploadDir = path.join(__dirname, "../uploads");
const logosDir = path.join(__dirname, "../uploads/logos");
const secretaryImagesDir = path.join(__dirname, "../uploads/secretary-images");

// Create directories if they don't exist
[uploadDir, logosDir, secretaryImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Memory storage for Cloudinary uploads (uploads directly from buffer)
const memoryStorage = multer.memoryStorage();

// Disk storage for local fallback (if needed)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination folder based on field name
    let destinationFolder = uploadDir;
    
    if (file.fieldname === 'logo') {
      destinationFolder = logosDir;
    } else if (file.fieldname === 'generalSecretaryImage') {
      destinationFolder = secretaryImagesDir;
    }
    
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed."), false);
  }
};

// Use memory storage for Cloudinary (default)
const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max for Cloudinary
});

// Disk storage upload (for fallback)
const uploadDisk = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = { upload, uploadDisk };
