#!/bin/bash

# Docker Setup Script for PromptVault
# This script helps set up and troubleshoot Docker container issues

set -e

echo "🚀 PromptVault Docker Setup Script"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Check if data directory exists
if [ ! -d "./data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p ./data
    echo "✅ Data directory created"
else
    echo "✅ Data directory exists"
fi

# Check if logs directory exists
if [ ! -d "./logs" ]; then
    echo "📁 Creating logs directory..."
    mkdir -p ./logs
    echo "✅ Logs directory created"
else
    echo "✅ Logs directory exists"
fi

# Check database file
if [ -f "./data/promptvault.db" ]; then
    echo "✅ Database file exists"
    echo "📊 Database size: $(du -h ./data/promptvault.db | cut -f1)"
else
    echo "ℹ️  Database file will be created on first run"
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t promptvault:fixed .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Docker build failed"
    exit 1
fi

# Stop and remove existing container if it exists
echo "🧹 Cleaning up existing container..."
docker stop promptvault 2>/dev/null || true
docker rm promptvault 2>/dev/null || true

# Start the container
echo "🚀 Starting container..."
docker-compose up -d

# Wait a moment for the container to start
sleep 5

# Check container status
echo "📊 Container status:"
docker ps -a --filter name=promptvault

# Show logs
echo "📋 Container logs (last 20 lines):"
docker logs --tail 20 promptvault

echo ""
echo "🎉 Setup complete!"
echo "🌐 Access your application at: http://localhost:3674"
echo "📊 Monitor logs with: docker logs -f promptvault"
echo "🛑 Stop with: docker-compose down"
