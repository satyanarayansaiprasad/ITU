const { getFirestore, getDatabase } = require('../config/firebase');

/**
 * Firestore Service - For document-based database operations
 */
class FirestoreService {
  constructor() {
    this.db = getFirestore();
  }

  // Check if Firestore is available
  isAvailable() {
    return this.db !== null;
  }

  // Create a document
  async create(collection, data, docId = null) {
    if (!this.isAvailable()) {
      throw new Error('Firestore is not initialized');
    }

    try {
      const collectionRef = this.db.collection(collection);
      if (docId) {
        await collectionRef.doc(docId).set(data);
        return { id: docId, ...data };
      } else {
        const docRef = await collectionRef.add(data);
        return { id: docRef.id, ...data };
      }
    } catch (error) {
      console.error(`Error creating document in ${collection}:`, error);
      throw error;
    }
  }

  // Read a document by ID
  async getById(collection, docId) {
    if (!this.isAvailable()) {
      throw new Error('Firestore is not initialized');
    }

    try {
      const doc = await this.db.collection(collection).doc(docId).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error(`Error getting document from ${collection}:`, error);
      throw error;
    }
  }

  // Read all documents in a collection
  async getAll(collection, limit = null) {
    if (!this.isAvailable()) {
      throw new Error('Firestore is not initialized');
    }

    try {
      let query = this.db.collection(collection);
      if (limit) {
        query = query.limit(limit);
      }
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error getting all documents from ${collection}:`, error);
      throw error;
    }
  }

  // Query documents
  async query(collection, field, operator, value) {
    if (!this.isAvailable()) {
      throw new Error('Firestore is not initialized');
    }

    try {
      const snapshot = await this.db.collection(collection)
        .where(field, operator, value)
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error querying ${collection}:`, error);
      throw error;
    }
  }

  // Update a document
  async update(collection, docId, data) {
    if (!this.isAvailable()) {
      throw new Error('Firestore is not initialized');
    }

    try {
      await this.db.collection(collection).doc(docId).update(data);
      return await this.getById(collection, docId);
    } catch (error) {
      console.error(`Error updating document in ${collection}:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(collection, docId) {
    if (!this.isAvailable()) {
      throw new Error('Firestore is not initialized');
    }

    try {
      await this.db.collection(collection).doc(docId).delete();
      return true;
    } catch (error) {
      console.error(`Error deleting document from ${collection}:`, error);
      throw error;
    }
  }
}

/**
 * Realtime Database Service - For real-time data synchronization
 */
class RealtimeDatabaseService {
  constructor() {
    this.db = getDatabase();
  }

  // Check if Realtime Database is available
  isAvailable() {
    return this.db !== null;
  }

  // Write data to a path
  async write(path, data) {
    if (!this.isAvailable()) {
      throw new Error('Realtime Database is not initialized');
    }

    try {
      await this.db.ref(path).set(data);
      return data;
    } catch (error) {
      console.error(`Error writing to ${path}:`, error);
      throw error;
    }
  }

  // Read data from a path
  async read(path) {
    if (!this.isAvailable()) {
      throw new Error('Realtime Database is not initialized');
    }

    try {
      const snapshot = await this.db.ref(path).once('value');
      return snapshot.val();
    } catch (error) {
      console.error(`Error reading from ${path}:`, error);
      throw error;
    }
  }

  // Update data at a path
  async update(path, data) {
    if (!this.isAvailable()) {
      throw new Error('Realtime Database is not initialized');
    }

    try {
      await this.db.ref(path).update(data);
      return data;
    } catch (error) {
      console.error(`Error updating ${path}:`, error);
      throw error;
    }
  }

  // Delete data at a path
  async delete(path) {
    if (!this.isAvailable()) {
      throw new Error('Realtime Database is not initialized');
    }

    try {
      await this.db.ref(path).remove();
      return true;
    } catch (error) {
      console.error(`Error deleting ${path}:`, error);
      throw error;
    }
  }
}

// Export services
const firestoreService = new FirestoreService();
const realtimeDatabaseService = new RealtimeDatabaseService();

module.exports = {
  firestoreService,
  realtimeDatabaseService,
  FirestoreService,
  RealtimeDatabaseService
};

