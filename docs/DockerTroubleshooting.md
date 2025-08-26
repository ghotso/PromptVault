# Docker Troubleshooting Guide

## Common Issues and Solutions

### 1. Database Connection Error: "Unable to open the database file"

**Error Message:**
```
Database initialization failed: PrismaClientInitializationError: Error querying the database: Error code 14: Unable to open the database file
```

**Root Causes:**
- Database directory doesn't exist in the container
- Incorrect file permissions
- Volume mount issues
- Database file path mismatch

**Solutions:**

#### A. Check Volume Mounts
Ensure your `docker-compose.yml` has proper volume mappings:
```yaml
volumes:
  - ./data:/app/backend/data:rw
  - ./logs:/app/backend/logs:rw
```

#### B. Verify Data Directory
Check if the `./data` directory exists in your project root:
```bash
ls -la ./data
```

If it doesn't exist, create it:
```bash
mkdir -p ./data
mkdir -p ./logs
```

#### C. Check Database File
Verify the database file exists and has proper permissions:
```bash
ls -la ./data/promptvault.db
```

#### D. Rebuild and Restart
```bash
# Stop containers
docker-compose down

# Remove old image
docker rmi promptvault:fixed

# Rebuild
docker build -t promptvault:fixed .

# Start fresh
docker-compose up -d
```

### 2. Permission Denied Errors

**Error Message:**
```
Error: EACCES: permission denied, open './data/promptvault.db'
```

**Solutions:**

#### A. Fix File Permissions (Linux/macOS)
```bash
sudo chown -R $USER:$USER ./data
chmod 755 ./data
chmod 644 ./data/*.db
```

#### B. Fix File Permissions (Windows)
Right-click on the `data` folder → Properties → Security → Edit → Add your user with Full Control.

#### C. Use Docker Setup Scripts
Run the provided setup scripts:
- **Linux/macOS:** `./scripts/docker-setup.sh`
- **Windows:** `scripts\docker-setup.bat`

### 3. Container Exits Immediately

**Error Message:**
```
promptvault exited with code 1
```

**Solutions:**

#### A. Check Container Logs
```bash
docker logs promptvault
```

#### B. Run Container Interactively
```bash
docker run -it --rm promptvault:fixed /bin/sh
```

#### C. Check Environment Variables
Verify your `.env` file or environment variables:
```bash
docker exec promptvault env | grep DATABASE
```

### 4. Frontend Not Loading

**Error Message:**
```
Frontend dist not found at: /app/frontend/dist
```

**Solutions:**

#### A. Rebuild Frontend
```bash
cd frontend
npm run build
cd ..
```

#### B. Check Docker Build
Ensure the Dockerfile copies the frontend build:
```dockerfile
COPY --from=builder --chown=node:node /app/frontend/dist /app/frontend/dist
```

### 5. Database Schema Issues

**Error Message:**
```
Prisma schema validation failed
```

**Solutions:**

#### A. Regenerate Prisma Client
```bash
cd backend
npx prisma generate
cd ..
```

#### B. Run Database Migrations
```bash
cd backend
npx prisma migrate deploy
cd ..
```

#### C. Reset Database (Development Only)
```bash
cd backend
npx prisma migrate reset
cd ..
```

## Quick Fix Commands

### Complete Reset (Development)
```bash
# Stop everything
docker-compose down

# Remove volumes (WARNING: This deletes all data!)
docker volume prune -f

# Remove images
docker rmi promptvault:fixed

# Clean up data (WARNING: This deletes all data!)
rm -rf ./data/*.db

# Rebuild and start
docker build -t promptvault:fixed .
docker-compose up -d
```

### Check Container Health
```bash
# Container status
docker ps -a

# Container logs
docker logs -f promptvault

# Container resources
docker stats promptvault

# Container inspection
docker inspect promptvault
```

### Database Connection Test
```bash
# Enter container
docker exec -it promptvault /bin/sh

# Test database connection
cd /app/backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => console.log('Database connected!'))
  .catch(e => console.error('Database error:', e))
  .finally(() => prisma.\$disconnect());
"
```

## Environment Variables

### Required Variables
```bash
DATABASE_URL="file:./data/promptvault.db"
JWT_SECRET="your-secret-key"
NODE_ENV="production"
PORT="8080"
CLIENT_ORIGIN="http://localhost:3674"
```

### Optional Variables
```bash
TZ="Europe/Berlin"
LOG_LEVEL="info"
```

## File Structure

Ensure your project has this structure:
```
PromptVault/
├── data/                    # Database files
├── logs/                    # Application logs
├── backend/                 # Backend source
├── frontend/                # Frontend source
├── docker-compose.yml       # Docker configuration
├── Dockerfile              # Container definition
└── .env                    # Environment variables
```

## Still Having Issues?

1. **Check Docker Desktop**: Ensure it's running and has enough resources
2. **Check Ports**: Verify port 3674 is not in use by another application
3. **Check Firewall**: Ensure Windows Firewall allows Docker connections
4. **Check Antivirus**: Some antivirus software blocks Docker operations
5. **Check WSL2**: On Windows, ensure WSL2 is properly configured

## Getting Help

- Check the logs: `docker logs promptvault`
- Run the setup script: `./scripts/docker-setup.sh` or `scripts\docker-setup.bat`
- Review this troubleshooting guide
- Check the main README.md for setup instructions
