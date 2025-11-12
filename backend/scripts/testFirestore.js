/**
 * Test Firestore connection
 */

require('dotenv').config();
const { initializeFirebase, getFirestore } = require('../config/firebase');

async function testFirestore() {
  try {
    console.log('🔍 Testing Firestore connection...\n');
    
    // Initialize Firebase
    initializeFirebase();
    const db = getFirestore();
    
    if (!db) {
      console.error('❌ Firestore not initialized');
      return;
    }
    
    console.log('✅ Firestore instance created');
    console.log('📝 Attempting to write test document...\n');
    
    // Try to write
    try {
      const testRef = db.collection('test').doc('connection-test');
      await testRef.set({
        message: 'Test connection',
        timestamp: new Date().toISOString(),
        test: true
      });
      console.log('✅ Successfully wrote to Firestore!');
      
      // Try to read
      const doc = await testRef.get();
      if (doc.exists) {
        console.log('✅ Successfully read from Firestore!');
        console.log('📄 Document data:', doc.data());
      }
      
      // Clean up
      await testRef.delete();
      console.log('✅ Test document deleted\n');
      
      console.log('🎉 Firestore is working correctly!');
      console.log('💡 You can now run: node scripts/populateFirebaseStates.js');
      
    } catch (error) {
      console.error('❌ Error accessing Firestore:');
      console.error('   Code:', error.code);
      console.error('   Message:', error.message);
      console.error('\n💡 Possible solutions:');
      console.error('   1. Make sure Firestore is in Native mode (not Datastore mode)');
      console.error('   2. Check Firebase Console → Firestore Database → Settings');
      console.error('   3. Verify the database is created in asia-south1 region');
      console.error('   4. Check service account permissions in Google Cloud Console');
      console.error('   5. Try creating a collection manually in Firebase Console first');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

testFirestore();

