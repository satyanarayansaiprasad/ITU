const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const instructorRefereeController = require('../controllers/instructorRefereeController');
const { optionalAuth } = require('../middleware/auth');

// Create upload dir if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/instructor-referee');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Public Submission Route
router.post(
  '/submit',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'paymentProof', maxCount: 1 }
  ]),
  instructorRefereeController.submitRegistration
);

// Admin Routes
router.get('/admin/registrations', optionalAuth, instructorRefereeController.getRegistrations);
router.put('/admin/registrations/:id/status', optionalAuth, instructorRefereeController.updateRegistrationStatus);
router.get('/admin/download', optionalAuth, instructorRefereeController.downloadExcel);
router.delete('/admin/registrations', optionalAuth, instructorRefereeController.deleteRegistrations);

module.exports = router;
