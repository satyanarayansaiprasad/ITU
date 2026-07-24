const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { verifyCertificate } = require('../controllers/verifyCertificateController');

// Rate limiter: 15 requests per 1 minute per IP
const verifyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    status: 'RATE_LIMITED',
    message: 'Too many verification attempts. Please try again after 1 minute.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', verifyLimiter, verifyCertificate);

module.exports = router;
