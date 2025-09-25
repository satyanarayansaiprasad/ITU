const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
router.post('/stateunionlogin',userController.loginStateUnion)
router.post('/contactus',userController.contactUs)
router.post('/accelarationform',userController.form)
// router.get('/getallNews',userController.getAllNews );
module.exports = router;