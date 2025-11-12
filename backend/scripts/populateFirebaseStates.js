/**
 * Script to populate Firebase Firestore with States, UTs, and Districts
 * Run this once to initialize the data: node scripts/populateFirebaseStates.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { initializeFirebase, getFirestore } = require('../config/firebase');

// Read and parse the data file manually
const dataPath = path.join(__dirname, '../../frontend/src/data/indianStatesDistricts.js');
const fileContent = fs.readFileSync(dataPath, 'utf8');

// Extract the indianStatesAndDistricts object using regex
const match = fileContent.match(/export const indianStatesAndDistricts = ({[\s\S]*?});/);
if (!match) {
  console.error('❌ Could not parse indianStatesAndDistricts from data file');
  process.exit(1);
}

// Evaluate the object (safe in this context as it's our own file)
let indianStatesAndDistricts;
try {
  eval(`indianStatesAndDistricts = ${match[1]};`);
} catch (e) {
  console.error('❌ Error parsing states data:', e.message);
  process.exit(1);
}

const populateFirebase = async () => {
  try {
    // Initialize Firebase
    initializeFirebase();
    const db = getFirestore();
    
    if (!db) {
      console.error('❌ Firestore not initialized');
      console.error('💡 Make sure:');
      console.error('   1. Firestore is enabled in Firebase Console');
      console.error('   2. Go to Firebase Console → Firestore Database → Create database');
      console.error('   3. Choose "Start in test mode" for development');
      process.exit(1);
    }

    // Test Firestore connection
    try {
      // Try to write a test document
      const testRef = db.collection('_test').doc('connection');
      await testRef.set({ test: true, timestamp: new Date().toISOString() });
      console.log('✅ Firestore connection verified - can write data\n');
      
      // Clean up test document
      await testRef.delete();
    } catch (testError) {
      console.error('❌ Firestore connection test failed:', testError.message);
      console.error('Error code:', testError.code);
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Make sure Firestore is enabled in Firebase Console');
      console.error('   2. Check that your service account has Firestore permissions');
      console.error('   3. Verify the database location matches (asia-south1)');
      console.error('   4. Try creating a collection manually in Firebase Console first');
      process.exit(1);
    }

    console.log('🚀 Starting to populate Firebase with States and Districts...\n');

    let successCount = 0;
    let errorCount = 0;

    // Populate each state/UT
    for (const [stateName, stateData] of Object.entries(indianStatesAndDistricts)) {
      try {
        // Create state document
        const stateDoc = {
          name: stateName,
          type: stateData.type, // 'State' or 'Union Territory'
          active: stateData.active || false,
          districts: stateData.districts,
          districtCount: stateData.districts.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Use state name as document ID (sanitized)
        const docId = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await db.collection('states').doc(docId).set(stateDoc);
        
        successCount++;
        console.log(`✅ Added: ${stateName} (${stateData.districts.length} districts)`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error adding ${stateName}:`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully added: ${successCount} states/UTs`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`\n🎉 Firebase population complete!`);
    console.log(`\n💡 You can now use the API endpoints:`);
    console.log(`   - GET /api/states - Get all states and UTs`);
    console.log(`   - GET /api/states/:stateName/districts - Get districts for a state`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
};

// Run the script
populateFirebase();
