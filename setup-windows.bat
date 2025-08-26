@echo off
REM PromptVault Windows Setup Script
REM This script sets up the necessary directories for Docker deployment on Windows

echo 🚀 Setting up PromptVault Docker environment for Windows...

REM Create directories if they don't exist
echo 📁 Creating data and logs directories...
if not exist "data" mkdir data
if not exist "logs" mkdir logs

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file...
    (
        echo # PromptVault Environment Configuration
        echo # Change these values for production!
        echo.
        echo # Required: Change this in production!
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo.
        echo # Optional: Customize these as needed
        echo CLIENT_ORIGIN=http://localhost:3674
        echo TZ=Europe/Berlin
        echo DATABASE_URL=file:./data/promptvault.db
    ) > .env
    echo ✅ .env file created. Please edit it with your actual values!
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup complete! You can now run:
echo    docker-compose up -d
echo.
echo 📋 Next steps:
echo    1. Edit .env file with your JWT_SECRET
echo    2. Run: docker-compose up -d
echo    3. Access at: http://localhost:3674
echo    4. Default admin: admin@promptvault.local / admin123
echo.
echo ⚠️  Note: Make sure Docker Desktop is running and has access to your project directory
pause
