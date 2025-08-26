@echo off
REM Docker Setup Script for PromptVault (Windows)
REM This script helps set up and troubleshoot Docker container issues

echo 🚀 PromptVault Docker Setup Script
echo ==================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running

REM Check if data directory exists
if not exist ".\data" (
    echo 📁 Creating data directory...
    mkdir data
    echo ✅ Data directory created
) else (
    echo ✅ Data directory exists
)

REM Check if logs directory exists
if not exist ".\logs" (
    echo 📁 Creating logs directory...
    mkdir logs
    echo ✅ Logs directory created
) else (
    echo ✅ Logs directory exists
)

REM Check database file
if exist ".\data\promptvault.db" (
    echo ✅ Database file exists
    for %%A in (.\data\promptvault.db) do echo 📊 Database size: %%~zA bytes
) else (
    echo ℹ️  Database file will be created on first run
)

REM Build the Docker image
echo 🔨 Building Docker image...
docker build -t promptvault:fixed .

if %errorlevel% equ 0 (
    echo ✅ Docker image built successfully
) else (
    echo ❌ Docker build failed
    pause
    exit /b 1
)

REM Stop and remove existing container if it exists
echo 🧹 Cleaning up existing container...
docker stop promptvault 2>nul
docker rm promptvault 2>nul

REM Start the container
echo 🚀 Starting container...
docker-compose up -d

REM Wait a moment for the container to start
timeout /t 5 /nobreak >nul

REM Check container status
echo 📊 Container status:
docker ps -a --filter name=promptvault

REM Show logs
echo 📋 Container logs (last 20 lines):
docker logs --tail 20 promptvault

echo.
echo 🎉 Setup complete!
echo 🌐 Access your application at: http://localhost:3674
echo 📊 Monitor logs with: docker logs -f promptvault
echo 🛑 Stop with: docker-compose down
pause
