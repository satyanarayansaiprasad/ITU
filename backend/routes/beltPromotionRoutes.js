const express = require('express');
const router = express.Router();
const beltPromotionController = require('../controllers/beltPromotionController');
const { authenticate } = require('../middleware/auth');

// State Union routes
router.post('/submit', beltPromotionController.submitBeltPromotion);
router.get('/union/:unionId', beltPromotionController.getBeltPromotionsByUnion);

// Admin routes
router.get('/admin/list', authenticate, beltPromotionController.getBeltPromotions);
router.get('/admin/:id/download', authenticate, beltPromotionController.downloadBeltPromotionExcel);
router.post('/admin/:id/approve', authenticate, beltPromotionController.approveBeltPromotion);
router.post('/admin/:id/reject', authenticate, beltPromotionController.rejectBeltPromotion);

module.exports = router;

