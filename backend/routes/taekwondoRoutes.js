const express = require('express');
const router = express.Router();
const taekwondoController = require('../controllers/taekwondoController');

// Public routes
router.get('/settings', taekwondoController.getSettings);
router.post('/submit', taekwondoController.submitRegistration);

// Admin routes - no JWT middleware (consistent with other admin routes in this project)
// Access control is handled by the React AdminLayout frontend component
router.get('/admin/registrations', taekwondoController.getRegistrations);
router.get('/admin/download', taekwondoController.downloadCSV);
router.put('/admin/settings', taekwondoController.updateSettings);
router.delete('/admin/registrations', taekwondoController.deleteRegistrations);

module.exports = router;
