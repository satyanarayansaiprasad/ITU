/**
 * Firebase Usage Examples
 * 
 * This file demonstrates how to use Firebase alongside MongoDB in your application
 */

const { firestoreService, realtimeDatabaseService } = require('../services/firebaseService');

// ============================================
// FIRESTORE EXAMPLES (Document Database)
// ============================================

/**
 * Example 1: Store user preferences in Firestore while keeping main user data in MongoDB
 */
async function storeUserPreferences(userId, preferences) {
  try {
    // Store in Firestore
    const result = await firestoreService.create('user_preferences', {
      userId: userId,
      theme: preferences.theme || 'light',
      notifications: preferences.notifications || true,
      language: preferences.language || 'en',
      createdAt: new Date().toISOString()
    });
    
    console.log('User preferences stored in Firestore:', result);
    return result;
  } catch (error) {
    console.error('Error storing preferences:', error);
    throw error;
  }
}

/**
 * Example 2: Store analytics/events in Firestore
 */
async function logEvent(eventType, eventData) {
  try {
    await firestoreService.create('events', {
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging event:', error);
  }
}

/**
 * Example 3: Query user preferences
 */
async function getUserPreferences(userId) {
  try {
    const preferences = await firestoreService.query(
      'user_preferences',
      'userId',
      '==',
      userId
    );
    return preferences[0] || null;
  } catch (error) {
    console.error('Error getting preferences:', error);
    throw error;
  }
}

// ============================================
// REALTIME DATABASE EXAMPLES
// ============================================

/**
 * Example 4: Store real-time presence/status
 */
async function updateUserStatus(userId, status) {
  try {
    await realtimeDatabaseService.write(`users/${userId}/status`, {
      online: status === 'online',
      lastSeen: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

/**
 * Example 5: Store real-time notifications
 */
async function sendNotification(userId, notification) {
  try {
    const notificationId = Date.now().toString();
    await realtimeDatabaseService.write(
      `notifications/${userId}/${notificationId}`,
      {
        ...notification,
        read: false,
        timestamp: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

/**
 * Example 6: Store chat messages in Realtime Database
 */
async function sendChatMessage(chatId, message) {
  try {
    const messageId = Date.now().toString();
    await realtimeDatabaseService.write(
      `chats/${chatId}/messages/${messageId}`,
      {
        ...message,
        timestamp: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// ============================================
// COMBINED USAGE EXAMPLE
// ============================================

/**
 * Example 7: Using both MongoDB and Firebase together
 * 
 * This shows how you might:
 * - Store main user data in MongoDB (structured, relational)
 * - Store real-time status in Firebase Realtime Database
 * - Store preferences/analytics in Firestore
 */
async function createUserWithFirebase(userData) {
  try {
    // 1. Store main user data in MongoDB (using your existing User model)
    // const user = await User.create(userData);
    
    // 2. Store user preferences in Firestore
    await firestoreService.create('user_preferences', {
      userId: userData._id || userData.id,
      theme: 'light',
      notifications: true
    });
    
    // 3. Initialize user status in Realtime Database
    await realtimeDatabaseService.write(`users/${userData._id || userData.id}/status`, {
      online: false,
      lastSeen: new Date().toISOString()
    });
    
    console.log('User created with Firebase integration');
    // return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// ============================================
// EXPORT EXAMPLES (if you want to use them)
// ============================================

module.exports = {
  storeUserPreferences,
  logEvent,
  getUserPreferences,
  updateUserStatus,
  sendNotification,
  sendChatMessage,
  createUserWithFirebase
};

