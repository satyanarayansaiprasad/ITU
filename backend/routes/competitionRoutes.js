const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const { authenticate } = require('../middleware/auth');

// State Union routes
router.post('/submit', competitionController.submitCompetition);
router.get('/union/:unionId', competitionController.getCompetitionsByUnion);
router.get('/available', competitionController.getAvailableCompetitions);

// Admin routes
router.get('/admin/list', authenticate, competitionController.getCompetitionRegistrations);
router.get('/admin/:id/download', authenticate, competitionController.downloadCompetitionExcel);
router.post('/admin/:id/approve', authenticate, competitionController.approveCompetition);
router.post('/admin/:id/reject', authenticate, competitionController.rejectCompetition);

module.exports = router;

