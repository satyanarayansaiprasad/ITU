const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/multer');

const userController = require('../controllers/userController');
router.post('/stateunionlogin',userController.loginStateUnion)
router.post('/contactus',userController.contactUs)
router.post('/accelarationform',userController.form)

// Player routes
router.post('/playerregistration', userController.registerPlayers);
router.post('/player/login', userController.playerLogin);
router.get('/players/:id', userController.getPlayerProfile);
router.patch('/players/:id', userController.updatePlayerProfile);
router.post('/players/:id/photo', upload.single('photo'), userController.uploadPlayerPhoto);

// State union profile routes
router.get('/stateunions/:id', userController.getStateUnionById);
router.patch('/stateunions/:id', userController.updateStateUnionProfile);
router.post('/stateunions/:id/logo', upload.single('logo'), userController.uploadLogo);
router.post('/stateunions/:id/general-secretary-image', upload.single('generalSecretaryImage'), userController.uploadGeneralSecretaryImage);

// Get organizations by district
router.get('/organizations/:stateName/:districtName', userController.getOrganizationsByDistrict);

// router.get('/getallNews',userController.getAllNews );
module.exports = router;