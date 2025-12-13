#!/bin/bash

# Script to deploy Firestore Email Queue Trigger Function

echo "🚀 Deploying Firestore Email Queue Trigger Function..."
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Check if logged in
echo "📋 Checking Firebase login status..."
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run:"
    echo "   firebase login"
    exit 1
fi

echo "✅ Firebase CLI ready"
echo ""

# Navigate to functions directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Set email configuration
echo "⚙️  Setting email configuration..."
echo "Please enter your email credentials:"
read -p "Email User (indiantaekwondounion@gmail.com): " email_user
read -sp "Email Password (App Password, no spaces): " email_pass
echo ""
read -p "Email Service (gmail): " email_service

email_user=${email_user:-indiantaekwondounion@gmail.com}
email_service=${email_service:-gmail}

# Remove spaces from password
email_pass=$(echo "$email_pass" | tr -d ' ')

echo ""
echo "📧 Configuring Firebase Functions..."
firebase functions:config:set email.user="$email_user" email.pass="$email_pass" email.service="$email_service"

echo ""
echo "🚀 Deploying sendEmailOnApproval function..."
firebase deploy --only functions:sendEmailOnApproval

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Add to your backend .env file:"
echo "   USE_FIRESTORE_EMAIL_QUEUE=true"
echo ""
echo "2. Ensure Firebase is initialized in your backend"
echo ""
echo "3. Test by approving a user and check Firestore emailQueue collection"

