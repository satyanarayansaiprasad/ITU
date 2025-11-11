# Enable Firestore in Firebase

Before running the populate script, you need to enable Firestore in your Firebase project.

## Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **itup-5cee3**
3. Click on **"Firestore Database"** in the left sidebar
4. Click **"Create database"**
5. Choose **"Start in test mode"** (for development)
   - This allows read/write access for 30 days
   - For production, set up proper security rules later
6. Select a location (choose closest to your users)
7. Click **"Enable"**

## After Enabling:

Run the populate script:
```bash
cd backend
node scripts/populateFirebaseStates.js
```

This will populate Firestore with all states, UTs, and districts.

## Security Rules (for later):

Once you enable Firestore, update the security rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to states
    match /states/{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // Allow read access to districts
    match /districts/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

