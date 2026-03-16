const express = require('express');
const router = express.Router();
const taekwondoController = require('../controllers/taekwondoController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/settings', taekwondoController.getSettings);
router.post('/submit', taekwondoController.submitRegistration);

// Admin routes (protected with JWT, same as beltPromotionRoutes)
router.get('/admin/registrations', authenticate, taekwondoController.getRegistrations);
router.get('/admin/download', authenticate, taekwondoController.downloadCSV);
router.put('/admin/settings', authenticate, taekwondoController.updateSettings);

module.exports = router;
