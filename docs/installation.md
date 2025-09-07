# Installation Guide

This guide covers different ways to install and deploy PromptVault, from quick Docker setups to production deployments.

## 🐳 Docker Installation (Recommended)

Docker is the easiest and most reliable way to deploy PromptVault. It handles all dependencies and provides consistent deployment across different environments.

### Prerequisites

- Docker 20.10+ installed
- Docker Compose 2.0+ installed
- At least 1GB of available RAM
- At least 2GB of available disk space

### Option 1: Using Pre-built Image (Fastest)

```bash
# Create a directory for PromptVault
mkdir promptvault && cd promptvault

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  promptvault:
    image: ghcr.io/ghotso/promptvault:latest
    container_name: promptvault
    restart: unless-stopped
    ports:
      - "8080:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=your-super-secret-jwt-key-change-this
      - DATABASE_URL=file:./data/promptvault.db
      - CLIENT_ORIGIN=http://localhost:8080
    volumes:
      - ./data:/app/backend/data
      - ./logs:/app/backend/logs
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
EOF

# Start PromptVault
docker-compose up -d

# Access at http://localhost:8080
```

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/ghotso/PromptVault.git
cd PromptVault

# Create data directories
mkdir -p data logs

# Start with Docker Compose
docker-compose up -d
```

### Option 3: Docker Run (Single Command)

```bash
# Create data directory
mkdir -p ~/promptvault/data ~/promptvault/logs

# Run PromptVault
docker run -d \
  --name promptvault \
  --restart unless-stopped \
  -p 8080:3000 \
  -v ~/promptvault/data:/app/backend/data \
  -v ~/promptvault/logs:/app/backend/logs \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e JWT_SECRET=your-super-secret-jwt-key-change-this \
  -e DATABASE_URL=file:./data/promptvault.db \
  -e CLIENT_ORIGIN=http://localhost:8080 \
  ghcr.io/ghotso/promptvault:latest
```

## 🛠️ Manual Installation

For development or custom deployments, you can install PromptVault manually.

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for cloning the repository

### Step 1: Clone Repository

```bash
git clone https://github.com/ghotso/PromptVault.git
cd PromptVault
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Environment Configuration

```bash
# Create environment file
cat > .env << 'EOF'
# JWT Secret (required)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Database URL
DATABASE_URL=file:./data/promptvault.db

# Client Origin (for CORS)
CLIENT_ORIGIN=http://localhost:5173

# Port
PORT=3000

# Node Environment
NODE_ENV=development
EOF
```

### Step 4: Database Setup

```bash
# Navigate to backend directory
cd backend

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Step 5: Build Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Build the frontend
npm run build
```

### Step 6: Start the Application

```bash
# Start the backend server
cd ../backend
npm run dev

# In a new terminal, start the frontend (optional for development)
cd frontend
npm run dev
```

## 🚀 Production Deployment

### Using Docker Compose (Recommended)

```bash
# Clone and setup
git clone https://github.com/ghotso/PromptVault.git
cd PromptVault

# Create production environment
cat > .env << 'EOF'
JWT_SECRET=your-production-jwt-secret-here
DATABASE_URL=file:./data/promptvault.db
CLIENT_ORIGIN=https://yourdomain.com
NODE_ENV=production
PORT=3000
EOF

# Create data directories
mkdir -p data logs

# Start in production mode
docker-compose up -d
```

### Using Docker with Reverse Proxy

```yaml
# docker-compose.yml
version: '3.8'
services:
  promptvault:
    image: ghcr.io/ghotso/promptvault:latest
    container_name: promptvault
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-production-secret
      - DATABASE_URL=file:./data/promptvault.db
      - CLIENT_ORIGIN=https://yourdomain.com
    volumes:
      - ./data:/app/backend/data
      - ./logs:/app/backend/logs
    networks:
      - promptvault-network

  nginx:
    image: nginx:alpine
    container_name: promptvault-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - promptvault
    networks:
      - promptvault-network

networks:
  promptvault-network:
    driver: bridge
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream promptvault {
        server promptvault:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://promptvault;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `production` | No |
| `PORT` | Server port | `3000` | No |
| `JWT_SECRET` | Secret for JWT tokens | - | **Yes** |
| `DATABASE_URL` | Database connection string | `file:./data/promptvault.db` | No |
| `CLIENT_ORIGIN` | Frontend URL for CORS | - | No |
| `TZ` | Timezone | `UTC` | No |

### Database Configuration

#### SQLite (Default)
```bash
DATABASE_URL=file:./data/promptvault.db
```

#### PostgreSQL
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/promptvault
```

#### MySQL
```bash
DATABASE_URL=mysql://username:password@localhost:3306/promptvault
```

### Security Configuration

```bash
# Strong JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-very-strong-secret-key-here

# HTTPS client origin
CLIENT_ORIGIN=https://yourdomain.com

# Production environment
NODE_ENV=production
```

## 📊 System Requirements

### Minimum Requirements
- **CPU**: 1 core
- **RAM**: 512MB
- **Storage**: 1GB
- **OS**: Linux, macOS, or Windows

### Recommended Requirements
- **CPU**: 2+ cores
- **RAM**: 2GB+
- **Storage**: 10GB+
- **OS**: Linux (Ubuntu 20.04+ or CentOS 8+)

### For Production
- **CPU**: 4+ cores
- **RAM**: 4GB+
- **Storage**: 50GB+ (with backups)
- **OS**: Linux with Docker support
- **Network**: HTTPS with SSL certificate

## 🔍 Verification

### Check Installation

```bash
# Check if PromptVault is running
curl http://localhost:8080/health

# Should return: {"ok":true}
```

### Check Database

```bash
# For Docker installations
docker exec promptvault ls -la /app/backend/data/

# Should show promptvault.db file
```

### Check Logs

```bash
# Docker logs
docker-compose logs promptvault

# Should show startup messages and "Backend listening on :3000"
```

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
netstat -tulpn | grep 8080

# Change port in docker-compose.yml
ports:
  - "3000:3000"  # Use different external port
```

#### Permission Issues
```bash
# Fix data directory permissions
sudo chown -R 1000:1000 data logs

# Or run with correct user
docker-compose up -d --user 1000:1000
```

#### Database Issues
```bash
# Reset database
docker-compose down
rm -rf data/*
docker-compose up -d
```

#### Memory Issues
```bash
# Check memory usage
docker stats promptvault

# Increase memory limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 2G
```

### Getting Help

If you encounter issues:

1. **Check logs**: `docker-compose logs promptvault`
2. **Verify configuration**: Check environment variables
3. **Test connectivity**: `curl http://localhost:8080/health`
4. **Search issues**: [GitHub Issues](https://github.com/ghotso/PromptVault/issues)
5. **Create issue**: [Report the problem](https://github.com/ghotso/PromptVault/issues)

## 📚 Next Steps

After successful installation:

1. **[Quick Start](quick-start.md)**: Learn the basics
2. **[User Interface](user-interface.md)**: Understand the UI
3. **[Configuration](configuration.md)**: Advanced configuration
4. **[Production Setup](production-setup.md)**: Production deployment
5. **[Security](security.md)**: Security best practices

---

**Installation complete?** Head over to the [Quick Start Guide](quick-start.md) to begin using PromptVault!
