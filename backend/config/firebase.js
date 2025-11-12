const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin SDK
let firebaseApp = null;

const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      firebaseApp = admin.app();
      console.log('✅ Firebase already initialized');
      return firebaseApp;
    }

    // Option 1: Using service account JSON (Recommended for production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      console.log('✅ Firebase initialized with service account');
      return firebaseApp;
    }

    // Option 2: Using service account file path
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      // Resolve the path relative to the backend directory
      const serviceAccountPath = path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH.replace('./', ''));
      const serviceAccount = require(serviceAccountPath);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      console.log('✅ Firebase initialized with service account file');
      return firebaseApp;
    }

    // Option 3: Using individual credentials from .env
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      console.log('✅ Firebase initialized with environment variables');
      return firebaseApp;
    }

    console.warn('⚠️  Firebase credentials not found. Firebase features will be disabled.');
    return null;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    return null;
  }
};

// Get Firebase Admin instance
const getFirebaseAdmin = () => {
  if (!firebaseApp) {
    firebaseApp = initializeFirebase();
  }
  return firebaseApp;
};

// Get Firestore database
const getFirestore = () => {
  const app = getFirebaseAdmin();
  if (!app) return null;
  
  // Get Firestore instance - try with database ID if specified
  const dbId = process.env.FIREBASE_DATABASE_ID || '(default)';
  try {
    return admin.firestore(app);
  } catch (error) {
    console.error('Error getting Firestore:', error);
    return null;
  }
};

// Get Realtime Database
const getDatabase = () => {
  const app = getFirebaseAdmin();
  if (!app) return null;
  return admin.database();
};

module.exports = {
  initializeFirebase,
  getFirebaseAdmin,
  getFirestore,
  getDatabase,
  admin
};

