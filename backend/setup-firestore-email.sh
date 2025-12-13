#!/bin/bash

echo "🚀 Setting up Firestore Email Queue..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Add USE_FIRESTORE_EMAIL_QUEUE if not exists
if ! grep -q "USE_FIRESTORE_EMAIL_QUEUE" .env; then
    echo "📝 Adding USE_FIRESTORE_EMAIL_QUEUE=true to .env..."
    echo "" >> .env
    echo "# Firebase Firestore Email Queue" >> .env
    echo "USE_FIRESTORE_EMAIL_QUEUE=true" >> .env
    echo "✅ Added USE_FIRESTORE_EMAIL_QUEUE=true"
else
    echo "✅ USE_FIRESTORE_EMAIL_QUEUE already configured"
fi

# Check Firebase configuration
echo ""
echo "📋 Checking Firebase configuration..."
if grep -q "FIREBASE_SERVICE_ACCOUNT_PATH\|FIREBASE_PROJECT_ID" .env; then
    echo "✅ Firebase configuration found"
else
    echo "⚠️  Firebase configuration not found in .env"
    echo "   Please ensure Firebase is configured"
fi

# Check if Firebase service account file exists
if [ -f "config/firebase-service-account.json" ]; then
    echo "✅ Firebase service account file found"
else
    echo "⚠️  Firebase service account file not found"
fi

echo ""
echo "✅ Local setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test locally: node test-firestore-email.js"
echo "2. Deploy Firebase Function: cd functions && npx firebase deploy --only functions:sendEmailOnApproval"
echo "3. Check Firestore Console to see queued emails"

