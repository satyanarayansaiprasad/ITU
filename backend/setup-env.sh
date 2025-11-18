#!/bin/bash

echo "🔐 Setting up backend .env file..."
echo ""

# Generate secrets
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Create .env file
cat > .env << EOF
# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# JWT Configuration (Auto-generated)
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}

# Session Configuration (Auto-generated)
SESSION_SECRET=${SESSION_SECRET}

# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=development

# CORS Configuration (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://yourdomain.com
EOF

echo "✅ Created backend/.env file with secure secrets!"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. Update MONGODB_URI with your MongoDB connection string"
echo "   2. Update ALLOWED_ORIGINS with your frontend URLs"
echo "   3. Never commit .env to git (it's already in .gitignore)"
echo ""
