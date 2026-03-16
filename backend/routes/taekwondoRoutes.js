const express = require('express');
const router = express.Router();
const taekwondoController = require('../controllers/taekwondoController');

// Public routes
router.get('/settings', taekwondoController.getSettings);
router.post('/submit', taekwondoController.submitRegistration);

// Admin routes (no JWT middleware - consistent with rest of admin API pattern)
router.get('/admin/registrations', taekwondoController.getRegistrations);
router.get('/admin/download', taekwondoController.downloadCSV);
router.put('/admin/settings', taekwondoController.updateSettings);

module.exports = router;
