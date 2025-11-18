const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/multer');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validateLogin, sanitizeInput } = require('../middleware/validation');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Auth routes
router.post('/refresh-token', authController.refreshToken);
router.post('/stateunionlogin', loginLimiter, sanitizeInput, validateLogin, userController.loginStateUnion)
router.post('/contactus',userController.contactUs)
router.post('/accelarationform',userController.form)

// Player routes
router.post('/playerregistration', userController.registerPlayers);
router.post('/player/login', loginLimiter, sanitizeInput, validateLogin, userController.playerLogin);
router.get('/players/:id', userController.getPlayerProfile);
router.patch('/players/:id', userController.updatePlayerProfile);
router.post('/players/:id/photo', upload.single('photo'), userController.uploadPlayerPhoto);
router.get('/unions/:unionId/players', userController.getPlayersByUnion);

// State union profile routes
router.get('/stateunions/:id', userController.getStateUnionById);
router.patch('/stateunions/:id', userController.updateStateUnionProfile);
router.post('/stateunions/:id/logo', upload.single('logo'), userController.uploadLogo);
router.post('/stateunions/:id/general-secretary-image', upload.single('generalSecretaryImage'), userController.uploadGeneralSecretaryImage);

// Get organizations by district
router.get('/organizations/:stateName/:districtName', userController.getOrganizationsByDistrict);

// router.get('/getallNews',userController.getAllNews );
module.exports = router;