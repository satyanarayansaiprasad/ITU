# Firebase Setup - Simple Steps

## 🎯 Goal
Set up Firebase Firestore to store states and districts data, working alongside your existing MongoDB.

---

## 📝 Step-by-Step Instructions

### **STEP 1: Create Firebase Project** (2 minutes)

1. **Go to:** https://console.firebase.google.com/
2. **Click:** "Add project" button
3. **Enter name:** `itu-firebase` (or any name you like)
4. **Click:** Continue → Create project → Continue

**✅ Done when:** You see your project dashboard

---

### **STEP 2: Enable Firestore** (1 minute)

1. **In Firebase Console**, click **"Firestore Database"** (left sidebar)
2. **Click:** "Create database" button
3. **Select:** "Start in test mode" 
4. **Choose location:** "asia-south1" (Mumbai, India)
5. **Click:** "Enable"

**✅ Done when:** You see "Your database is ready to go"

---

### **STEP 3: Download Service Account Key** (1 minute)

1. **Click:** ⚙️ Settings icon (top left) → "Project settings"
2. **Click:** "Service accounts" tab
3. **Click:** "Generate new private key" button
4. **Click:** "Generate key" in popup
5. **File downloads:** Save it somewhere you can find it

**✅ Done when:** JSON file is downloaded

---

### **STEP 4: Save the JSON File** (30 seconds)

1. **Move the downloaded JSON file** to: `backend/config/`
2. **Rename it to:** `firebase-service-account.json`

**Example:**
- Downloaded: `itu-firebase-xxxxx-firebase-adminsdk-xxxxx.json`
- Rename to: `firebase-service-account.json`
- Location: `backend/config/firebase-service-account.json`

**✅ Done when:** File is in `backend/config/firebase-service-account.json`

---

### **STEP 5: Get Your Project Details** (30 seconds)

**Still in Firebase Console → Project Settings → General tab:**

1. **Find "Project ID"** - Copy this (e.g., `itu-firebase`)
2. **Find "Database URL"** (if shown) - Or use: `https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com`

**Example:**
- Project ID: `itu-firebase`
- Database URL: `https://itu-firebase-default-rtdb.firebaseio.com`

**✅ Done when:** You have Project ID and Database URL

---

### **STEP 6: Update .env File** (1 minute)

1. **Open:** `backend/.env` file
2. **Add these lines at the end:**

```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_DATABASE_URL=https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=YOUR-PROJECT-ID
```

**Replace:**
- `YOUR-PROJECT-ID` with your actual Project ID from Step 5

**Example:**
```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_DATABASE_URL=https://itu-firebase-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=itu-firebase
```

**✅ Done when:** `.env` file has Firebase configuration

---

### **STEP 7: Enable Firebase in Code** (1 minute)

**Option A: Use Restore Script (Easiest)**
```bash
cd backend
node scripts/restoreFirebase.js
```

**Option B: Manual**
1. **Rename:** `config/firebase.js.disabled` → `config/firebase.js`
2. **Edit:** `index.js` - Uncomment these lines:
   ```javascript
   const { initializeFirebase } = require('./config/firebase');
   // ...
   initializeFirebase();
   ```

**✅ Done when:** Firebase files are enabled and `index.js` calls `initializeFirebase()`

---

### **STEP 8: Test Connection** (1 minute)

```bash
cd backend
node scripts/testFirestore.js
```

**✅ Success looks like:**
```
✅ Firebase initialized
✅ Firestore connection verified - can write data
🎉 Firestore is working correctly!
```

**❌ If error:** Check that:
- JSON file is in correct location
- `.env` has correct paths
- Firestore is enabled in Firebase Console

---

### **STEP 9: Populate States Data** (2 minutes)

```bash
cd backend
node scripts/populateFirebaseStates.js
```

**✅ Success looks like:**
```
✅ Added: Andhra Pradesh (24 districts)
✅ Added: Arunachal Pradesh (25 districts)
... (continues for all 36 states/UTs)
📊 Summary: ✅ Successfully added: 36 states/UTs
🎉 Firebase population complete!
```

**✅ Verify in Firebase Console:**
- Go to Firestore Database
- You should see `states` collection
- Click it to see all states

---

### **STEP 10: Test API** (30 seconds)

```bash
curl http://localhost:3001/api/states | grep "source"
```

**✅ Should show:** `"source":"firebase"`

**Or test in browser:**
- Open: http://localhost:3001/api/states
- Look for: `"source":"firebase"` in the response

---

## ✅ Final Checklist

After completing all steps:

- [ ] Firebase project created
- [ ] Firestore database enabled (Native mode)
- [ ] Service account JSON in `backend/config/`
- [ ] `.env` file updated with Firebase config
- [ ] `firebase.js` enabled (not .disabled)
- [ ] `initializeFirebase()` uncommented in `index.js`
- [ ] Test script passes ✅
- [ ] States data populated in Firestore
- [ ] API returns `"source":"firebase"`

---

## 🎉 You're Done!

**Now you have:**
- ✅ **MongoDB**: For users, forms, contacts, etc. (existing)
- ✅ **Firebase**: For states and districts (new)
- ✅ **Both working together** seamlessly

**Your API will:**
1. Try Firebase first
2. Fall back to static data if Firebase fails
3. Always work, no matter what!

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "5 NOT_FOUND" | Make sure Firestore is in **Native mode** |
| "File not found" | Check JSON file path in `.env` |
| "Permission denied" | Add "Cloud Datastore User" role in Google Cloud Console |
| Test fails | Create a test collection manually in Firebase Console first |

---

## 📚 More Help

- **Detailed Guide:** See `FIREBASE_SETUP_GUIDE.md`
- **Quick Reference:** See `FIREBASE_QUICK_SETUP.md`
- **Restore Script:** `node scripts/restoreFirebase.js`

---

**Total Time:** ~10 minutes  
**Difficulty:** Easy  
**Result:** Firebase + MongoDB working together! 🚀

