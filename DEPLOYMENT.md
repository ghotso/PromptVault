---
hidden: true
---

# PromptVault Deployment Guide

This guide covers deploying PromptVault using Docker Compose for easy setup and management.

## 🚀 Quick Start with Docker Compose

### 1. Prerequisites

* Docker and Docker Compose installed
* Port 3674 available (or change in docker-compose.yml)

### 2. Basic Deployment

#### Linux/macOS

```bash
# Clone the repository
git clone https://github.com/ghotso/PromptVault.git
cd PromptVault

# Create data and logs directories
mkdir -p data logs

# Start PromptVault
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f promptvault
```

#### Windows

```cmd
REM Clone the repository
git clone https://github.com/ghotso/PromptVault.git
cd PromptVault

REM Run the Windows setup script
setup-windows.bat

REM Start PromptVault
docker-compose up -d

REM Check status
docker-compose ps

REM View logs
docker-compose logs -f promptvault
```

### 3. Access the Application

* **URL**: http://localhost:3674
* **Default Admin**: admin@promptvault.local / admin123

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Required: Change this in production!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Customize these as needed
CLIENT_ORIGIN=http://localhost:3674
TZ=Europe/Berlin
DATABASE_URL=file:./data/promptvault.db
```

### Port Configuration

To change the external port, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:8080"  # External:Internal
```

### Volume Paths

Default volume mappings:

* `./data` → `/app/backend/data` (database)
* `./logs` → `/app/backend/logs` (application logs)

## 🔧 Advanced Configuration

### Custom Override

Create `docker-compose.override.yml` for custom settings:

```yaml
version: '3.8'
services:
  promptvault:
    environment:
      - JWT_SECRET=your-actual-secret-key
      - CLIENT_ORIGIN=http://your-domain.com:8080
    ports:
      - "8080:8080"
```

### Resource Limits

Adjust resource limits in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '1.0'
    reservations:
      memory: 512M
      cpus: '0.5'
```

## 📊 Monitoring & Health Checks

### Health Check

The container includes a health check endpoint:

* **Endpoint**: `/health`
* **Check**: Every 30 seconds
* **Timeout**: 10 seconds
* **Retries**: 3

### Logs

```bash
# View real-time logs
docker-compose logs -f promptvault

# View last 100 lines
docker-compose logs --tail=100 promptvault
```

### Status

```bash
# Check container status
docker-compose ps

# Check resource usage
docker stats promptvault
```

## 🗄️ Database Management

### SQLite (Default)

* **Location**: `./data/promptvault.db`
* **Backup**: Copy the `.db` file
* **Restore**: Replace the `.db` file

### PostgreSQL (Optional)

Uncomment the postgres service in `docker-compose.override.yml`:

```yaml
postgres:
  image: postgres:15-alpine
  environment:
    - POSTGRES_DB=promptvault
    - POSTGRES_USER=promptvault
    - POSTGRES_PASSWORD=your-password
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

## 🔒 Security Considerations

### JWT Secret

* **Change the default JWT\_SECRET** in production
* Use a strong, random string
* Keep it secret and secure

### Network Security

* The container runs on a private bridge network
* Only port 3674 (or your chosen port) is exposed
* Consider using a reverse proxy for HTTPS

### File Permissions

```bash
# Secure data directory
chmod 700 data
chown 1000:1000 data  # If running as non-root
```

## 🚨 Troubleshooting

### Common Issues

#### Container Won't Start

```bash
# Check logs
docker-compose logs promptvault

# Check if port is in use
netstat -tulpn | grep 3674
```

#### Database Issues

```bash
# Check database file
ls -la data/

# Restart container
docker-compose restart promptvault
```

#### Permission Issues

```bash
# Fix volume permissions
sudo chown -R 1000:1000 data logs
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

## 📈 Production Considerations

### Reverse Proxy

Use Nginx or Traefik for:

* HTTPS termination
* Load balancing
* Rate limiting

### Monitoring

Consider adding:

* Prometheus metrics
* Grafana dashboards
* Log aggregation (ELK stack)

### Backup Strategy

* Regular database backups
* Volume snapshots
* Configuration backups

## 🔄 Updates

### Update Application

```bash
# Pull latest image
docker-compose pull

# Restart with new image
docker-compose up -d
```

### Update Configuration

```bash
# Reload configuration
docker-compose up -d --force-recreate
```

## 📚 Additional Resources

* [Docker Compose Documentation](https://docs.docker.com/compose/)
* [PromptVault GitHub Repository](https://github.com/ghotso/PromptVault)
* [Issue Tracker](https://github.com/ghotso/PromptVault/issues)

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs promptvault`
2. Search existing issues on GitHub
3. Create a new issue with logs and error details
