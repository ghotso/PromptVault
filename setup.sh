#!/bin/bash

# PromptVault Docker Setup Script
# This script sets up the necessary directories and permissions for Docker deployment

set -e

echo "🚀 Setting up PromptVault Docker environment..."

# Create directories if they don't exist
echo "📁 Creating data and logs directories..."
mkdir -p data logs

# Set proper permissions (Docker container runs as UID 1000)
echo "🔐 Setting proper permissions..."
sudo chown -R 1000:1000 data logs
chmod 755 data logs

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# PromptVault Environment Configuration
# Change these values for production!

# Required: Change this in production!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Customize these as needed
CLIENT_ORIGIN=http://localhost:3674
TZ=Europe/Berlin
DATABASE_URL=file:./data/promptvault.db
EOF
    echo "✅ .env file created. Please edit it with your actual values!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete! You can now run:"
echo "   docker-compose up -d"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env file with your JWT_SECRET"
echo "   2. Run: docker-compose up -d"
echo "   3. Access at: http://localhost:3674"
echo "   4. Default admin: admin@promptvault.local / admin123"
