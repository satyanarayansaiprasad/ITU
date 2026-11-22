const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const visitorController = require('../controllers/visitorController');

// Rate limiter for recording visits: 60 requests per 1 minute per IP
const recordVisitLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: 'Too many visit recording requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for fetching visitor count: 120 requests per 1 minute per IP
const getCountLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: {
    success: false,
    message: 'Too many visitor count requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
router.get('/count', getCountLimiter, visitorController.getVisitorCount);
router.post('/visit', recordVisitLimiter, visitorController.recordVisit);

module.exports = router;
