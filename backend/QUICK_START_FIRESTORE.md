# Quick Start: Firestore Email Queue Setup

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Navigate to Functions Directory
```bash
cd backend/functions
npm install
```

### Step 3: Configure Email Settings
```bash
firebase functions:config:set email.user="indiantaekwondounion@gmail.com"
firebase functions:config:set email.pass="ytctcodgnoehcozg"
firebase functions:config:set email.service="gmail"
```

**Important:** Remove all spaces from the password!

### Step 4: Deploy the Function
```bash
firebase deploy --only functions:sendEmailOnApproval
```

### Step 5: Set Environment Variable

**In your Render Dashboard:**
1. Go to your backend service
2. Click **Environment**
3. Add: `USE_FIRESTORE_EMAIL_QUEUE=true`
4. Save and redeploy

**Or in local .env file:**
```
USE_FIRESTORE_EMAIL_QUEUE=true
```

### Step 6: Verify Firebase is Initialized

Make sure your backend has Firebase credentials configured. Check `backend/config/firebase.js` or set these environment variables:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email
```

## ✅ That's It!

Now when you approve a user:
1. Email is queued in Firestore `emailQueue` collection
2. Firebase Function automatically triggers
3. Email is sent automatically
4. Status is updated in Firestore

## 🔍 Verify It's Working

1. **Check Firebase Console > Functions**: Should see `sendEmailOnApproval` deployed
2. **Approve a test user**
3. **Check Firestore Console > emailQueue**: Should see document created and status updated to "sent"
4. **Check Function Logs**: Should see email sending logs

## 📝 Notes

- Emails are sent automatically via Firebase Cloud Functions
- No need to configure HTTP endpoints
- Firestore automatically triggers the function
- Status tracking in Firestore collection
- Automatic retries handled by Firebase

## 🆘 Troubleshooting

**Function not triggering?**
- Check Firebase Console > Functions - ensure deployed
- Check Firestore rules allow writes
- Check function logs for errors

**Emails not sending?**
- Check Firebase Functions config (email.user, email.pass)
- Verify Gmail App Password is correct (16 chars, no spaces)
- Check function logs in Firebase Console

**Firebase not initialized?**
- Check `backend/config/firebase.js`
- Verify service account file exists or env vars are set
- Check backend startup logs

