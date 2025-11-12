/**
 * Script to restore Firebase setup after creating a new project
 * Run this after you've:
 * 1. Created a new Firebase project
 * 2. Downloaded the service account JSON
 * 3. Added Firebase config to .env
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Restoring Firebase setup...\n');

// Step 1: Restore firebase.js
const firebaseConfigDisabled = path.join(__dirname, '../config/firebase.js.disabled');
const firebaseConfig = path.join(__dirname, '../config/firebase.js');

if (fs.existsSync(firebaseConfigDisabled) && !fs.existsSync(firebaseConfig)) {
  fs.renameSync(firebaseConfigDisabled, firebaseConfig);
  console.log('✅ Restored: config/firebase.js');
} else if (fs.existsSync(firebaseConfig)) {
  console.log('ℹ️  config/firebase.js already exists');
} else {
  console.log('⚠️  config/firebase.js.disabled not found');
}

// Step 2: Restore test script
const testScriptDisabled = path.join(__dirname, 'testFirestore.js.disabled');
const testScript = path.join(__dirname, 'testFirestore.js');

if (fs.existsSync(testScriptDisabled) && !fs.existsSync(testScript)) {
  fs.renameSync(testScriptDisabled, testScript);
  console.log('✅ Restored: scripts/testFirestore.js');
} else if (fs.existsSync(testScript)) {
  console.log('ℹ️  scripts/testFirestore.js already exists');
}

// Step 3: Restore populate script
const populateScriptDisabled = path.join(__dirname, 'populateFirebaseStates.js.disabled');
const populateScript = path.join(__dirname, 'populateFirebaseStates.js');

if (fs.existsSync(populateScriptDisabled) && !fs.existsSync(populateScript)) {
  fs.renameSync(populateScriptDisabled, populateScript);
  console.log('✅ Restored: scripts/populateFirebaseStates.js');
} else if (fs.existsSync(populateScript)) {
  console.log('ℹ️  scripts/populateFirebaseStates.js already exists');
}

// Step 4: Check .env
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('FIREBASE_SERVICE_ACCOUNT_PATH')) {
    console.log('✅ Firebase config found in .env');
  } else {
    console.log('⚠️  Firebase config not found in .env');
    console.log('   Add these lines to .env:');
    console.log('   FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json');
    console.log('   FIREBASE_DATABASE_URL=https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com');
    console.log('   FIREBASE_PROJECT_ID=YOUR-PROJECT-ID');
  }
} else {
  console.log('⚠️  .env file not found');
}

// Step 5: Check service account file
const serviceAccountPath = path.join(__dirname, '../config/firebase-service-account.json');
if (fs.existsSync(serviceAccountPath)) {
  console.log('✅ Service account file found');
} else {
  console.log('⚠️  Service account file not found');
  console.log('   Expected: config/firebase-service-account.json');
  console.log('   Download from Firebase Console → Settings → Service accounts');
}

// Step 6: Check index.js
const indexPath = path.join(__dirname, '../index.js');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  if (indexContent.includes('initializeFirebase')) {
    if (indexContent.includes('// initializeFirebase()')) {
      console.log('⚠️  Firebase initialization is commented out in index.js');
      console.log('   Uncomment: initializeFirebase();');
    } else if (indexContent.includes('initializeFirebase()')) {
      console.log('✅ Firebase initialization enabled in index.js');
    }
  } else {
    console.log('⚠️  Firebase not found in index.js');
    console.log('   Add: const { initializeFirebase } = require(\'./config/firebase\');');
    console.log('   Add: initializeFirebase();');
  }
}

console.log('\n📝 Next steps:');
console.log('   1. Make sure service account JSON is in config/ folder');
console.log('   2. Update .env with Firebase credentials');
console.log('   3. Uncomment initializeFirebase() in index.js');
console.log('   4. Run: node scripts/testFirestore.js');
console.log('   5. If test passes, run: node scripts/populateFirebaseStates.js');

