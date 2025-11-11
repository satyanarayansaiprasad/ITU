const express = require('express');
const router = express.Router();
const { firestoreController, realtimeController } = require('../controllers/firebaseController');

// Firestore Routes
router.post('/firestore/:collection', firestoreController.createDocument);
router.get('/firestore/:collection/:id', firestoreController.getDocument);
router.get('/firestore/:collection', firestoreController.getAllDocuments);
router.get('/firestore/:collection/query', firestoreController.queryDocuments);
router.put('/firestore/:collection/:id', firestoreController.updateDocument);
router.delete('/firestore/:collection/:id', firestoreController.deleteDocument);

// Realtime Database Routes
router.post('/realtime', realtimeController.writeData);
// Note: Wildcard routes are temporarily disabled due to Express 5 compatibility
// Use query parameter ?path= instead for GET/PUT/DELETE operations
router.get('/realtime', realtimeController.readData);
router.put('/realtime', realtimeController.updateData);
router.delete('/realtime', realtimeController.deleteData);

module.exports = router;

