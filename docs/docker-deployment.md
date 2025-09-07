# Docker Deployment

This guide covers deploying PromptVault using Docker, including basic deployment, production setup, and advanced configuration options.

## 🐳 Docker Overview

Docker provides a consistent, portable way to deploy PromptVault across different environments. The application is containerized with all dependencies included, making deployment simple and reliable.

### Why Docker?

- **Consistency**: Same environment across development, staging, and production
- **Isolation**: Application runs in its own container
- **Portability**: Easy to move between different hosts
- **Scalability**: Simple horizontal scaling
- **Dependency Management**: All dependencies included in the image

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+ installed
- Docker Compose 2.0+ installed
- At least 1GB of available RAM
- At least 2GB of available disk space

### Basic Deployment

#### Option 1: Using Pre-built Image

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

#### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/ghotso/PromptVault.git
cd PromptVault

# Create data directories
mkdir -p data logs

# Start with Docker Compose
docker-compose up -d
```

### Verify Deployment

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f promptvault

# Test health endpoint
curl http://localhost:8080/health
```

## ⚙️ Configuration

### Environment Variables

#### Required Variables

```bash
# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Database URL
DATABASE_URL=file:./data/promptvault.db

# Client Origin (for CORS)
CLIENT_ORIGIN=http://localhost:8080
```

#### Optional Variables

```bash
# Node Environment
NODE_ENV=production

# Port (internal container port)
PORT=3000

# Timezone
TZ=UTC

# Demo Mode
DEMO_MODE=false
```

### Volume Mappings

```yaml
volumes:
  - ./data:/app/backend/data      # Database files
  - ./logs:/app/backend/logs      # Application logs
```

#### Data Directory Structure

```
data/
├── promptvault.db               # SQLite database
├── promptvault.db-wal          # SQLite WAL file
└── promptvault.db-shm          # SQLite shared memory

logs/
├── app.log                     # Application logs
├── error.log                   # Error logs
└── access.log                  # Access logs
```

### Port Configuration

```yaml
ports:
  - "8080:3000"  # External:Internal port mapping
```

#### Common Port Mappings

- **Development**: `3000:3000`
- **Production**: `80:3000` or `443:3000`
- **Custom**: `8080:3000`

## 🔧 Advanced Configuration

### Custom Docker Compose

Create `docker-compose.override.yml` for custom settings:

```yaml
version: '3.8'
services:
  promptvault:
    environment:
      - JWT_SECRET=your-actual-secret-key
      - CLIENT_ORIGIN=https://yourdomain.com
    ports:
      - "80:3000"
    volumes:
      - /opt/promptvault/data:/app/backend/data
      - /opt/promptvault/logs:/app/backend/logs
```

### Resource Limits

```yaml
services:
  promptvault:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
```

### Health Checks

```yaml
services:
  promptvault:
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Restart Policies

```yaml
services:
  promptvault:
    restart: unless-stopped  # Restart unless manually stopped
    # Other options:
    # restart: no           # Never restart
    # restart: always       # Always restart
    # restart: on-failure   # Restart on failure
```

## 🌐 Production Deployment

### Reverse Proxy Setup

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/promptvault
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
        proxy_pass http://localhost:3000;
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
```

#### Traefik Configuration

```yaml
# docker-compose.yml
version: '3.8'
services:
  promptvault:
    image: ghcr.io/ghotso/promptvault:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.promptvault.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.promptvault.tls=true"
      - "traefik.http.routers.promptvault.tls.certresolver=letsencrypt"
      - "traefik.http.services.promptvault.loadbalancer.server.port=3000"
```

### SSL/TLS Configuration

#### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Self-signed Certificate

```bash
# Generate private key
openssl genrsa -out key.pem 2048

# Generate certificate
openssl req -new -x509 -key key.pem -out cert.pem -days 365

# Update Nginx configuration
ssl_certificate /path/to/cert.pem;
ssl_certificate_key /path/to/key.pem;
```

### Database Configuration

#### SQLite (Default)

```yaml
services:
  promptvault:
    environment:
      - DATABASE_URL=file:./data/promptvault.db
    volumes:
      - ./data:/app/backend/data
```

#### PostgreSQL

```yaml
version: '3.8'
services:
  promptvault:
    image: ghcr.io/ghotso/promptvault:latest
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/promptvault
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=promptvault
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 📊 Monitoring and Logging

### Log Management

#### View Logs

```bash
# View all logs
docker-compose logs -f promptvault

# View last 100 lines
docker-compose logs --tail=100 promptvault

# View specific log level
docker-compose logs -f promptvault | grep ERROR
```

#### Log Rotation

```yaml
services:
  promptvault:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Health Monitoring

#### Built-in Health Check

```bash
# Check container health
docker inspect promptvault | grep Health

# Test health endpoint
curl http://localhost:8080/health
```

#### External Monitoring

```bash
# Using curl in cron
*/5 * * * * curl -f http://localhost:8080/health || echo "PromptVault is down" | mail -s "Alert" admin@example.com

# Using monitoring tools
# Prometheus, Grafana, or other monitoring solutions
```

### Performance Monitoring

```bash
# Container resource usage
docker stats promptvault

# Container processes
docker top promptvault

# Container logs
docker logs promptvault
```

## 🔄 Updates and Maintenance

### Updating PromptVault

#### Using Docker Compose

```bash
# Pull latest image
docker-compose pull

# Restart with new image
docker-compose up -d

# Or force recreate
docker-compose up -d --force-recreate
```

#### Using Docker Run

```bash
# Stop current container
docker stop promptvault

# Remove old container
docker rm promptvault

# Run new container
docker run -d \
  --name promptvault \
  --restart unless-stopped \
  -p 8080:3000 \
  -v ~/promptvault/data:/app/backend/data \
  -v ~/promptvault/logs:/app/backend/logs \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  ghcr.io/ghotso/promptvault:latest
```

### Backup and Restore

#### Database Backup

```bash
# Backup SQLite database
docker exec promptvault sqlite3 /app/backend/data/promptvault.db ".backup /app/backend/data/backup.db"

# Copy backup to host
docker cp promptvault:/app/backend/data/backup.db ./backup-$(date +%Y%m%d).db
```

#### Full Backup

```bash
# Backup data directory
tar -czf promptvault-backup-$(date +%Y%m%d).tar.gz data/

# Backup with logs
tar -czf promptvault-full-backup-$(date +%Y%m%d).tar.gz data/ logs/
```

#### Restore

```bash
# Restore from backup
tar -xzf promptvault-backup-20240101.tar.gz

# Restart container
docker-compose restart promptvault
```

### Maintenance Tasks

#### Regular Maintenance

```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Clean up Docker
docker system prune -f

# Check disk space
df -h

# Check container health
docker-compose ps
```

#### Database Maintenance

```bash
# Optimize SQLite database
docker exec promptvault sqlite3 /app/backend/data/promptvault.db "VACUUM;"

# Check database integrity
docker exec promptvault sqlite3 /app/backend/data/promptvault.db "PRAGMA integrity_check;"
```

## 🚨 Troubleshooting

### Common Issues

#### Container Won't Start

```bash
# Check logs
docker-compose logs promptvault

# Check container status
docker-compose ps

# Check resource usage
docker stats promptvault
```

#### Database Issues

```bash
# Check database file
ls -la data/

# Check database permissions
docker exec promptvault ls -la /app/backend/data/

# Restart container
docker-compose restart promptvault
```

#### Port Issues

```bash
# Check if port is in use
netstat -tulpn | grep 8080

# Change port in docker-compose.yml
ports:
  - "3000:3000"
```

#### Permission Issues

```bash
# Fix data directory permissions
sudo chown -R 1000:1000 data logs

# Check container user
docker exec promptvault id
```

### Debug Mode

#### Enable Debug Logging

```yaml
services:
  promptvault:
    environment:
      - LOG_LEVEL=debug
      - NODE_ENV=development
```

#### Access Container Shell

```bash
# Access running container
docker exec -it promptvault sh

# Run commands in container
docker exec promptvault ls -la /app/backend/
```

### Reset Everything

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: Data loss!)
docker-compose down -v

# Remove data directory
rm -rf data logs

# Start fresh
docker-compose up -d
```

## 🔒 Security Considerations

### Container Security

#### Run as Non-root User

```yaml
services:
  promptvault:
    user: "1000:1000"  # Run as non-root user
```

#### Resource Limits

```yaml
services:
  promptvault:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
```

#### Network Security

```yaml
services:
  promptvault:
    networks:
      - promptvault-network
    # Don't expose ports directly
    # ports: []  # Comment out ports

networks:
  promptvault-network:
    driver: bridge
```

### Data Security

#### Volume Permissions

```bash
# Secure data directory
chmod 700 data
chown 1000:1000 data
```

#### Backup Encryption

```bash
# Encrypt backups
tar -czf - data/ | gpg --symmetric --cipher-algo AES256 -o backup-$(date +%Y%m%d).tar.gz.gpg
```

## 📈 Scaling

### Horizontal Scaling

#### Load Balancer Setup

```yaml
version: '3.8'
services:
  promptvault-1:
    image: ghcr.io/ghotso/promptvault:latest
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/promptvault
    networks:
      - promptvault-network

  promptvault-2:
    image: ghcr.io/ghotso/promptvault:latest
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/promptvault
    networks:
      - promptvault-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - promptvault-1
      - promptvault-2
    networks:
      - promptvault-network

networks:
  promptvault-network:
    driver: bridge
```

### Vertical Scaling

#### Resource Allocation

```yaml
services:
  promptvault:
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'
        reservations:
          memory: 2G
          cpus: '1.0'
```

---

**Ready to deploy?** Check out the [Production Setup](production-setup.md) guide for production deployment considerations!
