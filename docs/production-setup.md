# Production Setup

This guide covers deploying PromptVault in a production environment, including security considerations, performance optimization, and monitoring setup.

## 🚀 Production Overview

### Production Requirements

#### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: 100 Mbps
- **OS**: Linux (Ubuntu 20.04+ or CentOS 8+)

#### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 100GB+ SSD
- **Network**: 1 Gbps
- **OS**: Linux with Docker support

### Production Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Reverse Proxy │    │   PromptVault   │
│   (Optional)    │◄──►│   (Nginx)       │◄──►│   (Docker)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SSL/TLS       │    │   Static Files  │    │   Database      │
│   Termination   │    │   (Nginx)       │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 Security Configuration

### SSL/TLS Setup

#### Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt update
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
openssl genrsa -out /etc/ssl/private/promptvault.key 2048

# Generate certificate
openssl req -new -x509 -key /etc/ssl/private/promptvault.key -out /etc/ssl/certs/promptvault.crt -days 365

# Set permissions
sudo chmod 600 /etc/ssl/private/promptvault.key
sudo chmod 644 /etc/ssl/certs/promptvault.crt
```

### Nginx Configuration

#### Basic HTTPS Configuration

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

    ssl_certificate /etc/ssl/certs/promptvault.crt;
    ssl_certificate_key /etc/ssl/private/promptvault.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

#### Advanced Nginx Configuration

```nginx
# /etc/nginx/nginx.conf
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Include site configurations
    include /etc/nginx/sites-enabled/*;
}
```

### Firewall Configuration

#### UFW (Ubuntu)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow specific IPs (optional)
sudo ufw allow from 192.168.1.0/24

# Check status
sudo ufw status
```

#### iptables (CentOS)

```bash
# Allow SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP and HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Drop other traffic
iptables -A INPUT -j DROP

# Save rules
iptables-save > /etc/iptables/rules.v4
```

## 🗄️ Database Configuration

### PostgreSQL Setup

#### Installation

```bash
# Ubuntu
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

#### Database Configuration

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE promptvault;
CREATE USER promptvault WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE promptvault TO promptvault;
ALTER USER promptvault CREATEDB;
\q
```

#### PostgreSQL Optimization

```sql
-- /etc/postgresql/13/main/postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

### Database Backup

#### Automated Backup Script

```bash
#!/bin/bash
# /opt/scripts/backup-promptvault.sh

BACKUP_DIR="/opt/backups/promptvault"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="promptvault"
DB_USER="promptvault"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/promptvault_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/promptvault_$DATE.sql

# Remove old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: promptvault_$DATE.sql.gz"
```

#### Cron Job

```bash
# Add to crontab
0 2 * * * /opt/scripts/backup-promptvault.sh

# Or using systemd timer
# /etc/systemd/system/promptvault-backup.timer
[Unit]
Description=PromptVault Backup Timer

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

## 🚀 Docker Production Setup

### Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  promptvault:
    image: ghcr.io/ghotso/promptvault:latest
    container_name: promptvault
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=${JWT_SECRET}
      - DATABASE_URL=postgresql://promptvault:${DB_PASSWORD}@postgres:5432/promptvault
      - CLIENT_ORIGIN=https://yourdomain.com
    depends_on:
      - postgres
    networks:
      - promptvault-network
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'

  postgres:
    image: postgres:15-alpine
    container_name: promptvault-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=promptvault
      - POSTGRES_USER=promptvault
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - promptvault-network
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'

  redis:
    image: redis:7-alpine
    container_name: promptvault-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - promptvault-network

volumes:
  postgres_data:
  redis_data:

networks:
  promptvault-network:
    driver: bridge
```

### Environment Variables

```bash
# .env.prod
JWT_SECRET=your-super-secure-jwt-secret-here
DB_PASSWORD=your-secure-database-password
CLIENT_ORIGIN=https://yourdomain.com
NODE_ENV=production
```

### Docker Security

#### Non-root User

```dockerfile
# In Dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S promptvault -u 1001
USER promptvault
```

#### Resource Limits

```yaml
# In docker-compose.yml
services:
  promptvault:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'
```

#### Security Scanning

```bash
# Scan for vulnerabilities
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image ghcr.io/ghotso/promptvault:latest
```

## 📊 Monitoring and Logging

### Application Monitoring

#### Health Checks

```bash
# Health check script
#!/bin/bash
# /opt/scripts/health-check.sh

HEALTH_URL="https://yourdomain.com/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "PromptVault is healthy"
    exit 0
else
    echo "PromptVault is unhealthy (HTTP $RESPONSE)"
    exit 1
fi
```

#### Prometheus Metrics

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'promptvault'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
    scrape_interval: 5s
```

### Log Management

#### Centralized Logging

```yaml
# docker-compose.yml
services:
  promptvault:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=promptvault"
```

#### Log Rotation

```bash
# /etc/logrotate.d/promptvault
/var/lib/docker/containers/*/promptvault*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
}
```

### Performance Monitoring

#### System Metrics

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor resources
htop
iotop
nethogs
```

#### Database Monitoring

```sql
-- Monitor database performance
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public';

-- Monitor active connections
SELECT count(*) FROM pg_stat_activity;
```

## 🔄 Backup and Recovery

### Backup Strategy

#### Database Backups

```bash
#!/bin/bash
# /opt/scripts/backup-database.sh

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="promptvault"

# Create backup
pg_dump $DB_NAME | gzip > $BACKUP_DIR/promptvault_$DATE.sql.gz

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/promptvault_$DATE.sql.gz s3://your-backup-bucket/

# Cleanup old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

#### File Backups

```bash
#!/bin/bash
# /opt/scripts/backup-files.sh

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup application files
tar -czf $BACKUP_DIR/promptvault-files_$DATE.tar.gz \
    /opt/promptvault/data \
    /opt/promptvault/logs \
    /opt/promptvault/config

# Upload to S3
aws s3 cp $BACKUP_DIR/promptvault-files_$DATE.tar.gz s3://your-backup-bucket/
```

### Recovery Procedures

#### Database Recovery

```bash
# Stop application
docker-compose down

# Restore database
gunzip -c promptvault_20240101_020000.sql.gz | psql promptvault

# Start application
docker-compose up -d
```

#### Full System Recovery

```bash
# Restore from backup
tar -xzf promptvault-files_20240101_020000.tar.gz -C /

# Restore database
gunzip -c promptvault_20240101_020000.sql.gz | psql promptvault

# Start services
docker-compose up -d
```

## 🚨 Disaster Recovery

### High Availability Setup

#### Load Balancer Configuration

```nginx
# /etc/nginx/sites-available/promptvault
upstream promptvault {
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
    server 192.168.1.12:3000;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    location / {
        proxy_pass http://promptvault;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Database Replication

```sql
-- Master database configuration
-- /etc/postgresql/13/main/postgresql.conf
wal_level = replica
max_wal_senders = 3
max_replication_slots = 3

-- /etc/postgresql/13/main/pg_hba.conf
host replication replicator 192.168.1.0/24 md5
```

### Failover Procedures

#### Automatic Failover

```bash
#!/bin/bash
# /opt/scripts/failover.sh

PRIMARY="192.168.1.10"
SECONDARY="192.168.1.11"

# Check primary health
if ! curl -f http://$PRIMARY:3000/health; then
    echo "Primary server down, failing over to secondary"
    
    # Update load balancer configuration
    sed -i "s/$PRIMARY:3000/$SECONDARY:3000/g" /etc/nginx/sites-available/promptvault
    nginx -s reload
    
    # Send notification
    echo "Failover completed" | mail -s "PromptVault Failover" admin@yourdomain.com
fi
```

## 📈 Performance Optimization

### Application Optimization

#### Node.js Optimization

```bash
# Set Node.js options
export NODE_OPTIONS="--max-old-space-size=2048 --optimize-for-size"

# Use PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js
```

#### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_prompt_user_id ON Prompt(userId);
CREATE INDEX idx_prompt_visibility ON Prompt(visibility);
CREATE INDEX idx_prompt_created_at ON Prompt(createdAt);
CREATE INDEX idx_prompt_updated_at ON Prompt(updatedAt);

-- Analyze tables
ANALYZE Prompt;
ANALYZE User;
ANALYZE Tag;
```

### Caching Strategy

#### Redis Caching

```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
```

#### Application Caching

```javascript
// Cache configuration
const cacheConfig = {
  ttl: 300, // 5 minutes
  max: 1000, // Maximum items
  checkperiod: 120 // Check for expired items every 2 minutes
};
```

## 🔧 Maintenance

### Regular Maintenance

#### Daily Tasks

```bash
#!/bin/bash
# /opt/scripts/daily-maintenance.sh

# Check system health
curl -f https://yourdomain.com/health || echo "Health check failed"

# Check disk space
df -h | awk '$5 > 80 {print $0}'

# Check memory usage
free -h | awk 'NR==2{if($3/$2 > 0.8) print "High memory usage"}'

# Check logs for errors
docker-compose logs --since=24h | grep ERROR
```

#### Weekly Tasks

```bash
#!/bin/bash
# /opt/scripts/weekly-maintenance.sh

# Update system packages
apt update && apt upgrade -y

# Clean up Docker
docker system prune -f

# Optimize database
psql promptvault -c "VACUUM ANALYZE;"

# Check backup integrity
find /opt/backups -name "*.sql.gz" -mtime -7 -exec gunzip -t {} \;
```

### Update Procedures

#### Application Updates

```bash
#!/bin/bash
# /opt/scripts/update-promptvault.sh

# Backup current version
docker-compose down
cp -r /opt/promptvault /opt/promptvault.backup

# Pull latest image
docker-compose pull

# Start new version
docker-compose up -d

# Verify health
sleep 30
curl -f https://yourdomain.com/health || {
    echo "Update failed, rolling back"
    docker-compose down
    cp -r /opt/promptvault.backup /opt/promptvault
    docker-compose up -d
}
```

---

**Ready for production?** Check out the [Security](security.md) guide for additional security considerations and best practices!
