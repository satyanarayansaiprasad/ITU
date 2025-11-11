const { firestoreService, realtimeDatabaseService } = require('../services/firebaseService');

/**
 * Example Firestore Controller
 */
const firestoreController = {
  // Create a document
  createDocument: async (req, res) => {
    try {
      const { collection, data } = req.body;
      if (!collection || !data) {
        return res.status(400).json({ error: 'Collection and data are required' });
      }

      const result = await firestoreService.create(collection, data);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get a document by ID
  getDocument: async (req, res) => {
    try {
      const { collection, id } = req.params;
      const result = await firestoreService.getById(collection, id);
      
      if (!result) {
        return res.status(404).json({ error: 'Document not found' });
      }
      
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error getting document:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get all documents in a collection
  getAllDocuments: async (req, res) => {
    try {
      const { collection } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : null;
      const result = await firestoreService.getAll(collection, limit);
      res.json({ success: true, data: result, count: result.length });
    } catch (error) {
      console.error('Error getting all documents:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Query documents
  queryDocuments: async (req, res) => {
    try {
      const { collection } = req.params;
      const { field, operator, value } = req.query;
      
      if (!field || !operator || !value) {
        return res.status(400).json({ error: 'Field, operator, and value are required' });
      }

      const result = await firestoreService.query(collection, field, operator, value);
      res.json({ success: true, data: result, count: result.length });
    } catch (error) {
      console.error('Error querying documents:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Update a document
  updateDocument: async (req, res) => {
    try {
      const { collection, id } = req.params;
      const data = req.body;
      
      const result = await firestoreService.update(collection, id, data);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a document
  deleteDocument: async (req, res) => {
    try {
      const { collection, id } = req.params;
      await firestoreService.delete(collection, id);
      res.json({ success: true, message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

/**
 * Example Realtime Database Controller
 */
const realtimeController = {
  // Write data
  writeData: async (req, res) => {
    try {
      const { path, data } = req.body;
      if (!path || !data) {
        return res.status(400).json({ error: 'Path and data are required' });
      }

      const result = await realtimeDatabaseService.write(path, data);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error('Error writing data:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Read data
  readData: async (req, res) => {
    try {
      // Get path from query parameter or body
      const path = req.query.path || req.body.path || '/';
      const result = await realtimeDatabaseService.read(path);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error reading data:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Update data
  updateData: async (req, res) => {
    try {
      // Get path from query parameter or body
      const path = req.query.path || req.body.path || '/';
      const data = req.body.data || req.body;
      // Remove path from data if it exists
      if (data.path) delete data.path;
      
      const result = await realtimeDatabaseService.update(path, data);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Delete data
  deleteData: async (req, res) => {
    try {
      // Get path from query parameter or body
      const path = req.query.path || req.body.path || '/';
      await realtimeDatabaseService.delete(path);
      res.json({ success: true, message: 'Data deleted successfully' });
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = {
  firestoreController,
  realtimeController
};

