const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firebase Admin if not already initialized
let firebaseInitialized = false;
try {
  if (admin.apps.length === 0) {
    const { initializeFirebase } = require('../config/firebase');
    initializeFirebase();
  }
  firebaseInitialized = true;
} catch (error) {
  console.warn('Firebase not initialized, will use HTTP endpoint');
}

/**
 * Send email using Firebase Cloud Functions
 * This service can use either:
 * 1. HTTP Cloud Function endpoint (if deployed)
 * 2. Firestore queue (if Firestore trigger is set up)
 */
class FirebaseEmailService {
  constructor() {
    // Try to get Firebase Cloud Functions URL from environment
    this.functionsUrl = process.env.FIREBASE_FUNCTIONS_URL || 
                       process.env.FIREBASE_EMAIL_FUNCTION_URL ||
                       null;
    
    // Check if we should use Firestore queue
    this.useFirestoreQueue = process.env.USE_FIRESTORE_EMAIL_QUEUE === 'true';
  }

  /**
   * Send email via HTTP Cloud Function
   */
  async sendViaHTTP(mailOptions) {
    if (!this.functionsUrl) {
      throw new Error('Firebase Functions URL not configured. Set FIREBASE_FUNCTIONS_URL or FIREBASE_EMAIL_FUNCTION_URL');
    }

    try {
      const response = await axios.post(`${this.functionsUrl}/sendEmail`, {
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
        from: mailOptions.from
      }, {
        timeout: 30000 // 30 second timeout
      });

      return {
        success: response.data.success,
        messageId: response.data.messageId,
        info: response.data
      };
    } catch (error) {
      console.error('Error calling Firebase Function:', error.message);
      if (error.response) {
        throw new Error(error.response.data.error || error.message);
      }
      throw error;
    }
  }

  /**
   * Queue email in Firestore (will be sent by Cloud Function trigger)
   */
  async sendViaFirestoreQueue(mailOptions) {
    if (!firebaseInitialized) {
      throw new Error('Firebase not initialized');
    }

    try {
      const db = admin.firestore();
      const emailQueueRef = db.collection('emailQueue');

      const emailDoc = {
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
        from: mailOptions.from || `"Indian Taekwondo Union" <${process.env.EMAIL_USER}>`,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await emailQueueRef.add(emailDoc);
      
      console.log(`📧 Email queued in Firestore: ${docRef.id}`);

      return {
        success: true,
        queueId: docRef.id,
        message: 'Email queued successfully'
      };
    } catch (error) {
      console.error('Error queueing email in Firestore:', error);
      throw error;
    }
  }

  /**
   * Send email using the configured method
   */
  async sendEmail(mailOptions) {
    console.log('\n========== FIREBASE EMAIL SERVICE ==========');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Method:', this.useFirestoreQueue ? 'Firestore Queue' : 'HTTP Function');

    try {
      if (this.useFirestoreQueue && firebaseInitialized) {
        return await this.sendViaFirestoreQueue(mailOptions);
      } else if (this.functionsUrl) {
        return await this.sendViaHTTP(mailOptions);
      } else {
        throw new Error('No Firebase email method configured. Set FIREBASE_FUNCTIONS_URL or USE_FIRESTORE_EMAIL_QUEUE=true');
      }
    } catch (error) {
      console.error('❌ Firebase Email Service Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
module.exports = new FirebaseEmailService();

