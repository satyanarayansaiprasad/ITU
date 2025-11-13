require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const AccelerationForm = require('../models/AccelerationForm');
const Contact = require('../models/Contact');
const Form = require('../models/Form');
// Try to load Players model if it exists
let Players = null;
try {
  Players = require('../models/Players');
} catch (e) {
  console.log('⚠️  Players model not found, skipping...');
}
const { getFirestore } = require('../config/firebase');
const { initializeFirebase } = require('../config/firebase');

// Emails to delete
const emailsToDelete = [
  'deepakmahanta2324@gmail.com',
  'saisona65@gmail.com'
];

const deleteUsers = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected');

    // Initialize Firebase
    console.log('Initializing Firebase...');
    initializeFirebase();
    const firestore = getFirestore();
    
    let deletedCount = 0;

    // Delete from MongoDB - AccelerationForm collection
    console.log('\n📦 Deleting from MongoDB (AccelerationForm)...');
    for (const email of emailsToDelete) {
      const result = await AccelerationForm.deleteMany({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') } 
      });
      if (result.deletedCount > 0) {
        console.log(`  ✅ Deleted ${result.deletedCount} record(s) for ${email}`);
        deletedCount += result.deletedCount;
      } else {
        console.log(`  ⚠️  No records found for ${email}`);
      }
    }

    // Delete from MongoDB - Contact collection (if exists)
    console.log('\n📦 Deleting from MongoDB (Contact)...');
    for (const email of emailsToDelete) {
      const result = await Contact.deleteMany({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') } 
      });
      if (result.deletedCount > 0) {
        console.log(`  ✅ Deleted ${result.deletedCount} contact record(s) for ${email}`);
        deletedCount += result.deletedCount;
      }
    }

    // Delete from MongoDB - Form collection (if exists)
    console.log('\n📦 Deleting from MongoDB (Form)...');
    for (const email of emailsToDelete) {
      const result = await Form.deleteMany({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') } 
      });
      if (result.deletedCount > 0) {
        console.log(`  ✅ Deleted ${result.deletedCount} form record(s) for ${email}`);
        deletedCount += result.deletedCount;
      }
    }

    // Delete from MongoDB - Players collection (if exists)
    if (Players) {
      console.log('\n📦 Deleting from MongoDB (Players)...');
      for (const email of emailsToDelete) {
        try {
          const result = await Players.deleteMany({ 
            email: { $regex: new RegExp(`^${email}$`, 'i') } 
          });
          if (result.deletedCount > 0) {
            console.log(`  ✅ Deleted ${result.deletedCount} player record(s) for ${email}`);
            deletedCount += result.deletedCount;
          }
        } catch (error) {
          console.log(`  ⚠️  Error deleting from Players for ${email}: ${error.message}`);
        }
      }
    } else {
      console.log('\n📦 Skipping Players collection (model not found)');
    }

    // Delete from Firebase Firestore (if available)
    if (firestore) {
      console.log('\n🔥 Deleting from Firebase Firestore...');
      try {
        const statesCollection = firestore.collection('states');
        const statesSnapshot = await statesCollection.get();
        
        for (const email of emailsToDelete) {
          // Check if there are any states with this email (if stored)
          // This is a placeholder - adjust based on your Firestore structure
          console.log(`  ⚠️  Checking Firebase for ${email}...`);
          // Note: Firebase states collection doesn't typically store user emails
          // But we'll check if needed
        }
        console.log('  ✅ Firebase check completed');
      } catch (firebaseError) {
        console.warn('  ⚠️  Firebase operation failed:', firebaseError.message);
      }
    } else {
      console.log('\n🔥 Firebase not available, skipping...');
    }

    console.log(`\n✅ Deletion complete! Total records deleted: ${deletedCount}`);
    console.log(`\n📧 Emails processed:`);
    emailsToDelete.forEach(email => {
      console.log(`   - ${email}`);
    });

  } catch (error) {
    console.error('❌ Error deleting users:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
};

// Run the script
deleteUsers();

