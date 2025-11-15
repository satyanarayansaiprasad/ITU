const { upload } = require("../middleware/multer.js");
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.get('/logout', adminController.logout);
router.get('/getContact',adminController.getContacts);
router.post('/addNews',adminController.createNews);
router.get('/getallNews',adminController.getAllNews )

router.put("/editNews/:id", upload.single("image"), adminController.editNews);
router.delete("/deleteNews/:id", adminController.deleteNews);


router.post('/uploadSlider', upload.single('image'), adminController.createSlider);
router.get('/getSlider', adminController.getSliders);
router.put('/editSlider/:id', upload.single('image'), adminController.updateSlider);
router.delete('/deleteSlider/:id', adminController.deleteSlider);


router.post('/uploadGallery', upload.single('image'), adminController.createGallery);
router.get('/getGallery', adminController.getGallery);
 router.put('/editGallery/:id', upload.single('image'), adminController.updateGallery);
router.delete('/deleteGallery/:id', adminController.deleteGallery);

// Self Defence Slider routes
router.post('/uploadSelfDefenceSlider', upload.single('image'), adminController.createSelfDefenceSlider);
router.get('/getSelfDefenceSlider', adminController.getSelfDefenceSliders);
router.put('/editSelfDefenceSlider/:id', upload.single('image'), adminController.updateSelfDefenceSlider);
router.delete('/deleteSelfDefenceSlider/:id', adminController.deleteSelfDefenceSlider);

// Category Slider routes
router.post('/uploadCategorySlider', upload.single('image'), adminController.createCategorySlider);
router.get('/getCategorySlider', adminController.getCategorySliders);
router.put('/editCategorySlider/:id', upload.single('image'), adminController.updateCategorySlider);
router.delete('/deleteCategorySlider/:id', adminController.deleteCategorySlider);




router.get('/getForm',adminController.getForm);

router.put('/approveForm',adminController.approveForm)
router.delete('/deleteUser',adminController.deleteUser)

// District and State Head Management
router.post('/set-district-head', adminController.setDistrictHead);
router.post('/set-state-head', adminController.setStateHead);
router.post('/remove-district-head', adminController.removeDistrictHead);
router.post('/remove-state-head', adminController.removeStateHead);

// Player management routes
router.get('/getPlayers', adminController.getPlayers);
router.post('/approvePlayers', adminController.approvePlayers);
router.post('/rejectPlayers', adminController.rejectPlayers);
router.delete('/deletePlayers', adminController.deletePlayers);
router.get('/organizations/:stateName', adminController.getOrganizationsByState);
// router.put('/rejectForm',adminController.rejectForm)

// ========== BLOG ROUTES ==========
router.get('/blog/posts', adminController.getBlogPosts);
router.get('/blog/post/:slug', adminController.getBlogPostBySlug);
router.get('/blog/categories', adminController.getBlogCategories);
router.get('/blog/tags', adminController.getBlogTags);
router.get('/blog/featured', adminController.getFeaturedPosts);
router.get('/blog/related/:slug', adminController.getRelatedPosts);

// ========== ANALYTICS ROUTES ==========
router.get('/analytics/dashboard', adminController.getDashboardAnalytics);
router.get('/analytics/engagement', adminController.getUserEngagement);
router.get('/analytics/content', adminController.getContentPerformance);

module.exports = router;
