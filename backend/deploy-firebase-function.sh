#!/bin/bash

echo "🚀 Firebase Function Deployment Script"
echo "========================================"
echo ""

cd "$(dirname "$0")"

# Check if logged in
echo "📋 Checking Firebase login status..."
if ! npx firebase-tools projects:list &> /dev/null; then
    echo ""
    echo "❌ Not logged in to Firebase"
    echo ""
    echo "Please run this command to login:"
    echo "  cd backend"
    echo "  npx firebase-tools login"
    echo ""
    echo "Or if you prefer non-interactive:"
    echo "  npx firebase-tools login --no-localhost"
    echo ""
    exit 1
fi

echo "✅ Logged in to Firebase"
echo ""

# Navigate to functions directory
cd functions

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Set email configuration
echo "⚙️  Configuring email settings..."
echo "Email User: indiantaekwondounion@gmail.com"
echo "Email Service: gmail"
echo "Setting password (spaces will be removed automatically)..."
echo ""

npx firebase-tools functions:config:set \
    email.user="indiantaekwondounion@gmail.com" \
    email.pass="ytctcodgnoehcozg" \
    email.service="gmail"

if [ $? -eq 0 ]; then
    echo "✅ Email configuration set successfully"
else
    echo "❌ Failed to set email configuration"
    exit 1
fi

echo ""
echo "🚀 Deploying sendEmailOnApproval function..."
echo ""

npx firebase-tools deploy --only functions:sendEmailOnApproval

if [ $? -eq 0 ]; then
    echo ""
    echo "✅✅✅ DEPLOYMENT SUCCESSFUL! ✅✅✅"
    echo ""
    echo "📝 Next steps:"
    echo "1. Check Firebase Console > Functions - you should see sendEmailOnApproval deployed"
    echo "2. Test by approving a user - email should be sent automatically"
    echo "3. Check Firestore Console > emailQueue collection to see queued emails"
    echo ""
else
    echo ""
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi

