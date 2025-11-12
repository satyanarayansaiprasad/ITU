# Firebase Setup Guide - Step by Step

This guide will help you set up Firebase alongside your existing MongoDB database.

## 📋 Prerequisites
- A Google account
- Access to Firebase Console
- Your existing MongoDB setup (already working)

---

## Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Open your browser and go to: **https://console.firebase.google.com/**
2. Sign in with your Google account

### 1.2 Create New Project
1. Click **"Add project"** or **"Create a project"** button
2. **Project name**: Enter a name (e.g., `itu-firebase` or `itu-states-db`)
3. Click **"Continue"**
4. **Google Analytics**: You can disable this (toggle OFF) or keep it enabled
5. Click **"Create project"**
6. Wait for project creation (30-60 seconds)
7. Click **"Continue"** when ready

---

## Step 2: Enable Firestore Database

### 2.1 Navigate to Firestore
1. In your Firebase project dashboard, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"** button

### 2.2 Configure Database
1. **Select mode**: Choose **"Start in test mode"** (for development)
   - This allows read/write access for 30 days
   - For production, you'll set up security rules later
2. Click **"Next"**

### 2.3 Choose Location
1. **Select location**: Choose **"asia-south1"** (Mumbai) or closest to your users
2. Click **"Enable"**
3. Wait for database creation (1-2 minutes)

### 2.4 Verify Database is Ready
- You should see: "Your database is ready to go. Just add data."
- The database is now active! ✅

---

## Step 3: Get Service Account Credentials

### 3.1 Go to Project Settings
1. Click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
2. Click **"Project settings"**

### 3.2 Generate Service Account Key
1. Go to the **"Service accounts"** tab
2. Click **"Generate new private key"** button
3. A popup will appear - click **"Generate key"**
4. A JSON file will download automatically (e.g., `itu-firebase-xxxxx-firebase-adminsdk-xxxxx.json`)

### 3.3 Save the JSON File
1. **Move the downloaded JSON file** to: `backend/config/`
2. **Rename it** to something simple like: `firebase-service-account.json`
   - Example: If downloaded as `itu-firebase-xxxxx.json`
   - Rename to: `firebase-service-account.json`

---

## Step 4: Get Database URL

### 4.1 Find Database URL
1. Still in **Project settings** → **General** tab
2. Scroll down to **"Your apps"** section
3. Look for **"Database URL"** or **"Firestore Database URL"**
4. It will look like: `https://itu-firebase-default-rtdb.firebaseio.com` (for Realtime DB)
   - OR you can use: `https://itu-firebase.firebaseio.com`
   - For Firestore, the URL format is different, but you can use the project ID

### 4.2 Note Your Project ID
- In the same **General** tab, you'll see **"Project ID"**
- Note this down (e.g., `itu-firebase`)

---

## Step 5: Configure Environment Variables

### 5.1 Update .env File
Open `backend/.env` and add these lines:

```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_DATABASE_URL=https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=YOUR-PROJECT-ID
```

**Replace:**
- `YOUR-PROJECT-ID` with your actual Firebase project ID
- `firebase-service-account.json` with your actual JSON filename

**Example:**
```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_DATABASE_URL=https://itu-firebase-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=itu-firebase
```

---

## Step 6: Re-enable Firebase in Code

### 6.1 Restore Firebase Configuration
1. Rename `config/firebase.js.disabled` back to `config/firebase.js`
2. Or create a new one if it was deleted

### 6.2 Update index.js
Uncomment Firebase initialization in `backend/index.js`:

```javascript
const { initializeFirebase } = require('./config/firebase');
// ... other imports

// Initialize Firebase
initializeFirebase();
```

### 6.3 Update Routes (Optional)
If you want Firebase routes enabled:
```javascript
const firebaseRoutes = require('./routes/firebaseRoutes');
// ...
app.use('/api/firebase', firebaseRoutes);
```

---

## Step 7: Test Firebase Connection

### 7.1 Test Script
Run the test script:
```bash
cd backend
node scripts/testFirestore.js
```

**Expected output:**
```
✅ Firebase initialized with service account file
✅ Firestore connection verified - can write data
🎉 Firestore is working correctly!
```

### 7.2 If Test Fails
- Check that the JSON file path is correct
- Verify the JSON file is in `backend/config/` folder
- Make sure Firestore is enabled in Firebase Console
- Check that you selected "Native mode" (not Datastore mode)

---

## Step 8: Populate States Data

### 8.1 Run Populate Script
Once Firebase is working:
```bash
cd backend
node scripts/populateFirebaseStates.js
```

**Expected output:**
```
✅ Firebase initialized
✅ Firestore connection verified
🚀 Starting to populate Firebase...
✅ Added: Andhra Pradesh (24 districts)
✅ Added: Arunachal Pradesh (25 districts)
... (continues for all states)
📊 Summary: ✅ Successfully added: 36 states/UTs
🎉 Firebase population complete!
```

### 8.2 Verify in Firebase Console
1. Go to Firebase Console → Firestore Database
2. You should see a `states` collection
3. Click on it to see all 36 states/UTs
4. Each document contains state name, districts, etc.

---

## Step 9: Update States Controller

### 9.1 Re-enable Firebase in Controller
Update `backend/controllers/statesController.js` to use Firebase:

```javascript
const { firestoreService } = require('../services/firebaseService');

// In getAllStates function, it will automatically try Firebase first,
// then fall back to static data if Firebase fails
```

The controller already has fallback logic, so it will work automatically!

---

## Step 10: Test the API

### 10.1 Test States Endpoint
```bash
curl http://localhost:3001/api/states
```

**Expected response:**
```json
{
  "success": true,
  "data": [...],
  "count": 36,
  "source": "firebase"  // Should say "firebase" now!
}
```

### 10.2 Test Districts Endpoint
```bash
curl http://localhost:3001/api/states/Maharashtra/districts
```

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled (Native mode)
- [ ] Service account JSON file downloaded and saved
- [ ] Environment variables added to `.env`
- [ ] Firebase config file enabled
- [ ] Firebase initialized in `index.js`
- [ ] Test script passes
- [ ] States data populated in Firestore
- [ ] API returns data with `"source": "firebase"`

---

## 🔒 Security Notes

1. **Never commit** the service account JSON file to Git
2. It's already in `.gitignore`, but double-check
3. For production, set up Firestore security rules
4. Rotate service account keys periodically

---

## 🆘 Troubleshooting

### Error: "Firebase service not available"
- Check `.env` file has correct paths
- Verify JSON file exists in `config/` folder
- Check file permissions

### Error: "5 NOT_FOUND"
- Make sure Firestore is in **Native mode** (not Datastore)
- Verify database is created and enabled
- Check service account has proper permissions

### Error: "Permission denied"
- Go to Google Cloud Console → IAM
- Add "Cloud Datastore User" role to service account

---

## 📝 Summary

**What you'll have:**
- ✅ MongoDB: For your existing data (users, forms, etc.)
- ✅ Firebase Firestore: For states and districts data
- ✅ Both databases working together seamlessly
- ✅ Automatic fallback to static data if Firebase fails

**Data Storage:**
- **MongoDB**: Users, Forms, Contacts, News, Gallery, Sliders, etc.
- **Firebase**: States, Union Territories, Districts (dynamic, easy to update)

---

## 🚀 Next Steps After Setup

1. Populate Firebase with states data
2. Test API endpoints
3. Verify frontend fetches from Firebase
4. (Optional) Set up Firestore security rules for production

---

**Need Help?** If you encounter any issues, check the error message and refer to the troubleshooting section above.

