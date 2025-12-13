# Environment Variables Setup for Firestore Email Queue

## Required Environment Variables

Add these to your backend `.env` file or Render environment variables:

### 1. Enable Firestore Queue
```
USE_FIRESTORE_EMAIL_QUEUE=true
```

### 2. Firebase Configuration

Choose ONE of these options:

#### Option A: Service Account File Path
```
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
```

#### Option B: Individual Firebase Credentials
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

### 3. Email Configuration (for fallback)
```
EMAIL_USER=indiantaekwondounion@gmail.com
EMAIL_PASS=ytctcodgnoehcozg
EMAIL_SERVICE=gmail
```

## Render Environment Variables Setup

1. Go to Render Dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add these variables:

```
USE_FIRESTORE_EMAIL_QUEUE=true
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email
EMAIL_USER=indiantaekwondounion@gmail.com
EMAIL_PASS=ytctcodgnoehcozg
EMAIL_SERVICE=gmail
```

## Verification

After setting up, check your backend logs on startup. You should see:
```
✅ Firebase initialized with service account
📧 Email Configuration Status:
  USE_FIRESTORE_EMAIL_QUEUE: true
```

