# Firebase Cloud Functions for Email Service

This directory contains Firebase Cloud Functions for sending emails automatically.

## Setup Instructions

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Functions (if not already done)
```bash
cd functions
npm install
```

### 4. Set Firebase Configuration
```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.pass="your-app-password"
firebase functions:config:set email.service="gmail"
```

Or set environment variables in Firebase Console:
- Go to Firebase Console > Functions > Configuration
- Add environment variables:
  - `EMAIL_USER`: Your Gmail address
  - `EMAIL_PASS`: Your Gmail App Password (16 characters, no spaces)
  - `EMAIL_SERVICE`: gmail

### 5. Deploy Functions
```bash
firebase deploy --only functions
```

### 6. Get Function URL
After deployment, you'll get a URL like:
```
https://us-central1-your-project-id.cloudfunctions.net/sendEmail
```

### 7. Set Environment Variable in Backend
Add to your backend `.env` file:
```
FIREBASE_FUNCTIONS_URL=https://us-central1-your-project-id.cloudfunctions.net
```

## Alternative: Use Firestore Queue

If you prefer to use Firestore triggers instead of HTTP:

1. Set in backend `.env`:
```
USE_FIRESTORE_EMAIL_QUEUE=true
```

2. The system will automatically queue emails in Firestore collection `emailQueue`
3. The Cloud Function trigger will automatically send them

## Testing

Test the function locally:
```bash
firebase emulators:start --only functions
```

Then test with:
```bash
curl -X POST http://localhost:5001/your-project-id/us-central1/sendEmail \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1>"
  }'
```

