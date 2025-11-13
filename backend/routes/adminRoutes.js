const upload =require("../middleware/multer.js");
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


router.post('/uploadSlider', adminController.createSlider);
router.get('/getSlider', adminController.getSliders);
router.put('/editSlider/:id', upload.single('image'), adminController.updateSlider);
router.delete('/deleteSlider/:id', adminController.deleteSlider);


router.post('/uploadGallery', adminController.createGallery);
router.get('/getGallery', adminController.getGallery);
 router.put('/editGallery/:id', upload.single('image'), adminController.updateGallery);
router.delete('/deleteGallery/:id', adminController.deleteGallery);




router.get('/getForm',adminController.getForm);

router.put('/approveForm',adminController.approveForm)
router.delete('/deleteUser',adminController.deleteUser)
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
