# Firebase Quick Start Guide

## ✅ What's Been Set Up

1. ✅ Firebase Admin SDK installed
2. ✅ Firebase configuration file created (`config/firebase.js`)
3. ✅ Firebase service layer created (`services/firebaseService.js`)
4. ✅ Example controllers and routes created
5. ✅ Firebase initialized in main server file
6. ✅ Usage examples provided

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Go to **Project Settings** → **Service Accounts**
4. Click **"Generate new private key"**
5. Save the JSON file as `backend/config/firebase-service-account.json`

### Step 2: Enable Firebase Services

**For Firestore:**
- Firebase Console → Firestore Database → Create database
- Choose "Start in test mode" (for development)

**For Realtime Database (optional):**
- Firebase Console → Realtime Database → Create database

### Step 3: Add to .env File

Add this line to your `.env` file:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

**Get Database URL:** Firebase Console → Project Settings → General → Your apps → Database URL

## 🧪 Test the Connection

1. Restart your server: `npm run dev`
2. Look for: `✅ Firebase initialized with service account`
3. If you see `⚠️ Firebase credentials not found`, check your .env file

## 📝 Usage Examples

### In Your Controllers

```javascript
const { firestoreService } = require('../services/firebaseService');

// Create a document
const result = await firestoreService.create('collection_name', {
  field1: 'value1',
  field2: 'value2'
});

// Get all documents
const all = await firestoreService.getAll('collection_name');

// Query documents
const filtered = await firestoreService.query('collection_name', 'field', '==', 'value');
```

### API Endpoints (if routes are enabled)

**Firestore:**
- `POST /api/firebase/firestore/:collection` - Create document
- `GET /api/firebase/firestore/:collection` - Get all documents
- `GET /api/firebase/firestore/:collection/:id` - Get document by ID
- `PUT /api/firebase/firestore/:collection/:id` - Update document
- `DELETE /api/firebase/firestore/:collection/:id` - Delete document

**Realtime Database:**
- `POST /api/firebase/realtime` - Write data
- `GET /api/firebase/realtime/:path` - Read data
- `PUT /api/firebase/realtime/:path` - Update data
- `DELETE /api/firebase/realtime/:path` - Delete data

## 🔒 Security Notes

1. **Never commit** `firebase-service-account.json` to Git
2. The file is already in `.gitignore`
3. For production, use environment variables instead of file path
4. Set up proper Firestore security rules in Firebase Console

## 📚 More Information

See `FIREBASE_SETUP.md` for detailed setup instructions and troubleshooting.

## 💡 Common Use Cases

- **MongoDB**: Main application data (users, posts, etc.)
- **Firestore**: User preferences, analytics, logs
- **Realtime Database**: Live status, notifications, chat

Both databases can work together in the same application!

