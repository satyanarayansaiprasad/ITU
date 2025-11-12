# Firebase Quick Setup Checklist

## 🎯 Quick Steps (5 minutes)

### ✅ Step 1: Create Firebase Project
1. Go to: https://console.firebase.google.com/
2. Click **"Add project"**
3. Enter project name (e.g., `itu-firebase`)
4. Click **"Continue"** → **"Create project"** → **"Continue"**

### ✅ Step 2: Enable Firestore
1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose location: **"asia-south1"** (Mumbai)
5. Click **"Enable"**

### ✅ Step 3: Get Credentials
1. Click **⚙️ Settings** → **"Project settings"**
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** (JSON file downloads)
5. **Move the file** to: `backend/config/firebase-service-account.json`

### ✅ Step 4: Add to .env
Open `backend/.env` and add:
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_DATABASE_URL=https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=YOUR-PROJECT-ID
```
*(Replace YOUR-PROJECT-ID with your actual project ID from Firebase Console)*

### ✅ Step 5: Enable Firebase Code
```bash
cd backend
mv config/firebase.js.disabled config/firebase.js
```

### ✅ Step 6: Update index.js
Uncomment these lines in `backend/index.js`:
```javascript
const { initializeFirebase } = require('./config/firebase');
// ...
initializeFirebase();
```

### ✅ Step 7: Test Connection
```bash
cd backend
mv scripts/testFirestore.js.disabled scripts/testFirestore.js
node scripts/testFirestore.js
```

### ✅ Step 8: Populate Data
```bash
mv scripts/populateFirebaseStates.js.disabled scripts/populateFirebaseStates.js
node scripts/populateFirebaseStates.js
```

### ✅ Step 9: Verify
```bash
curl http://localhost:3001/api/states | grep "source"
```
Should show: `"source":"firebase"`

---

## 📋 What You Need

1. **Firebase Project ID**: Found in Project Settings → General
2. **Service Account JSON**: Downloaded from Service Accounts tab
3. **Database URL**: Found in Project Settings → General (or use project ID)

---

## 🔍 Where to Find Things in Firebase Console

| What You Need | Where to Find |
|--------------|---------------|
| Project ID | Settings → General → Project ID |
| Database URL | Settings → General → Your apps → Database URL |
| Service Account | Settings → Service accounts → Generate new private key |
| Firestore | Left sidebar → Firestore Database |

---

## ✅ Verification

After setup, check:
- [ ] Firebase project created
- [ ] Firestore enabled (Native mode)
- [ ] JSON file in `backend/config/`
- [ ] `.env` file updated
- [ ] `firebase.js` enabled (not .disabled)
- [ ] `index.js` has `initializeFirebase()`
- [ ] Test script passes
- [ ] API returns `"source":"firebase"`

---

## 🆘 Common Issues

**"5 NOT_FOUND" error:**
- Make sure Firestore is in **Native mode** (not Datastore)
- Create a test collection manually in Firebase Console first

**"Permission denied":**
- Go to Google Cloud Console → IAM
- Add "Cloud Datastore User" role to service account

**"File not found":**
- Check JSON file path in `.env`
- Verify file is in `backend/config/` folder

---

**That's it!** Once these steps are done, Firebase will work alongside MongoDB. 🎉

