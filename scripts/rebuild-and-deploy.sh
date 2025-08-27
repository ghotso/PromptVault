#!/bin/bash

echo "🚀 Rebuilding and deploying PromptVault..."

# Stop and remove existing container
echo "📦 Stopping existing container..."
docker stop promptvault 2>/dev/null || true
docker rm promptvault 2>/dev/null || true

# Remove old image
echo "🗑️  Removing old image..."
docker rmi promptvault:latest 2>/dev/null || true

# Clean up data directory (optional - comment out if you want to keep data)
echo "🧹 Cleaning up data directory..."
rm -rf ./data/promptvault.db 2>/dev/null || true

# Rebuild the image
echo "🔨 Building new Docker image..."
docker build -t promptvault:latest .

# Start the container
echo "🚀 Starting container..."
docker-compose up -d

# Wait a moment for startup
echo "⏳ Waiting for container to start..."
sleep 5

# Show logs
echo "📋 Container logs:"
docker logs promptvault

echo "✅ Done! Container should be running on http://localhost:3000"
echo "🔍 To monitor logs: docker logs -f promptvault"
