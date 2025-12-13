# Setup Firestore Email Queue (Option 2)

This guide will help you set up automatic email sending using Firebase Firestore triggers.

## Prerequisites

1. Firebase project created
2. Firebase CLI installed: `npm install -g firebase-tools`
3. Firebase Admin SDK configured in your backend

## Step-by-Step Setup

### Step 1: Login to Firebase
```bash
firebase login
```

### Step 2: Initialize Firebase Functions (if not done)
```bash
cd backend
firebase init functions
```
- Select your Firebase project
- Use existing `functions` directory: **Yes**
- Install dependencies: **Yes**

### Step 3: Install Dependencies
```bash
cd functions
npm install
```

### Step 4: Set Email Configuration in Firebase

You have two options:

#### Option A: Using Firebase Functions Config (Recommended)
```bash
firebase functions:config:set email.user="indiantaekwondounion@gmail.com"
firebase functions:config:set email.pass="ytctcodgnoehcozg"
firebase functions:config:set email.service="gmail"
```

#### Option B: Using Environment Variables in Firebase Console
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to **Functions** > **Configuration**
4. Add environment variables:
   - `EMAIL_USER`: indiantaekwondounion@gmail.com
   - `EMAIL_PASS`: ytctcodgnoehcozg (no spaces)
   - `EMAIL_SERVICE`: gmail

### Step 5: Deploy Only the Firestore Trigger Function
```bash
firebase deploy --only functions:sendEmailOnApproval
```

### Step 6: Set Environment Variable in Backend

Add to your backend `.env` file (or Render environment variables):
```
USE_FIRESTORE_EMAIL_QUEUE=true
```

Also ensure Firebase is initialized:
```
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
# OR use environment variables:
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_PRIVATE_KEY=your-private-key
# FIREBASE_CLIENT_EMAIL=your-client-email
```

### Step 7: Verify Setup

1. Check Firebase Console > Functions - you should see `sendEmailOnApproval` deployed
2. Check Firebase Console > Firestore - collection `emailQueue` will be created automatically
3. When you approve a user, check Firestore console - you should see documents being created and updated

## How It Works

1. When admin approves a user, the backend creates a document in Firestore `emailQueue` collection
2. Firebase Cloud Function `sendEmailOnApproval` automatically triggers
3. Function sends the email using nodemailer
4. Document status is updated to "sent" or "failed"

## Monitoring

- **Firebase Console > Functions > Logs**: See function execution logs
- **Firebase Console > Firestore > emailQueue**: See queued emails and their status
- **Backend Logs**: See email queueing status

## Troubleshooting

### Function not triggering?
- Check Firebase Console > Functions - ensure function is deployed
- Check Firestore rules - ensure writes are allowed
- Check function logs in Firebase Console

### Emails not sending?
- Check Firebase Functions config - ensure EMAIL_USER and EMAIL_PASS are set
- Check function logs for errors
- Verify Gmail App Password is correct (no spaces)

### Firebase not initialized?
- Check `backend/config/firebase.js` - ensure service account is configured
- Check environment variables in Render/backend

## Testing

1. Approve a test user
2. Check Firestore `emailQueue` collection - should see new document
3. Check function logs - should see email sending attempt
4. Check user's inbox - should receive email

