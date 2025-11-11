# Firebase Setup Guide

This guide will help you set up Firebase in your backend application.

## Prerequisites

1. A Firebase project (create one at https://console.firebase.google.com/)
2. Firebase Admin SDK credentials

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Get Service Account Credentials

### Option A: Download Service Account JSON (Recommended)

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Save it securely (e.g., `backend/config/firebase-service-account.json`)
5. **IMPORTANT:** Add this file to `.gitignore` to keep it secure

### Option B: Use Environment Variables

Copy the following from your service account JSON:
- `project_id` → `FIREBASE_PROJECT_ID`
- `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `databaseURL` → `FIREBASE_DATABASE_URL` (from Firebase Console → Project Settings → General)

## Step 3: Enable Firebase Services

### For Firestore (Document Database):
1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (or production mode with security rules)
4. Select a location for your database

### For Realtime Database:
1. Go to Firebase Console → Realtime Database
2. Click "Create database"
3. Choose a location
4. Set security rules

## Step 4: Configure Environment Variables

Add the following to your `.env` file:

### Method 1: Using Service Account JSON File Path
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### Method 2: Using Individual Credentials
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### Method 3: Using JSON String (for cloud deployments)
```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

## Step 5: Update .gitignore

Make sure to add Firebase credentials to `.gitignore`:

```
# Firebase
backend/config/firebase-service-account.json
*.json
!package*.json
```

## Usage Examples

### Using Firestore Service

```javascript
const { firestoreService } = require('./services/firebaseService');

// Create a document
const user = await firestoreService.create('users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Get a document
const user = await firestoreService.getById('users', 'document-id');

// Get all documents
const users = await firestoreService.getAll('users');

// Query documents
const activeUsers = await firestoreService.query('users', 'status', '==', 'active');

// Update a document
await firestoreService.update('users', 'document-id', { status: 'inactive' });

// Delete a document
await firestoreService.delete('users', 'document-id');
```

### Using Realtime Database Service

```javascript
const { realtimeDatabaseService } = require('./services/firebaseService');

// Write data
await realtimeDatabaseService.write('users/user123', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Read data
const user = await realtimeDatabaseService.read('users/user123');

// Update data
await realtimeDatabaseService.update('users/user123', { status: 'active' });

// Delete data
await realtimeDatabaseService.delete('users/user123');
```

## Testing the Connection

After setting up, restart your server. You should see:
- `✅ Firebase initialized with service account` (or similar message)

If you see:
- `⚠️ Firebase credentials not found` - Check your environment variables
- `❌ Firebase initialization error` - Check your credentials format

## Security Best Practices

1. **Never commit service account keys to Git**
2. Use environment variables in production
3. Set up proper Firestore/Realtime Database security rules
4. Use Firebase App Check for additional security
5. Rotate service account keys periodically

## Troubleshooting

### Error: "Firebase is not initialized"
- Check that environment variables are set correctly
- Verify the service account JSON file exists (if using file path)
- Check that Firebase Admin SDK is installed: `npm install firebase-admin`

### Error: "Permission denied"
- Check Firestore/Realtime Database security rules
- Verify service account has proper permissions in Firebase Console

### Error: "Invalid credentials"
- Verify private key includes `\n` characters
- Check that all required fields are present in environment variables
- Ensure service account JSON is valid

## Next Steps

1. Create controllers using Firebase services
2. Set up routes for Firebase operations
3. Implement proper error handling
4. Set up Firebase security rules
5. Consider using Firebase Authentication for user management

