const express = require('express');
const router = express.Router();
const beltPromotionController = require('../controllers/beltPromotionController');
const { authenticate, optionalAuth } = require('../middleware/auth');

// State Union routes
router.post('/submit', beltPromotionController.submitBeltPromotion);
router.get('/union/:unionId', beltPromotionController.getBeltPromotionsByUnion);

// Player routes
router.get('/player/:playerId', beltPromotionController.getBeltPromotionsByPlayer);

// Admin routes
router.get('/admin/list', optionalAuth, beltPromotionController.getBeltPromotions);
router.get('/admin/:id/download', optionalAuth, beltPromotionController.downloadBeltPromotionExcel);
router.post('/admin/:id/approve', optionalAuth, beltPromotionController.approveBeltPromotion);
router.post('/admin/:id/reject', optionalAuth, beltPromotionController.rejectBeltPromotion);

module.exports = router;

