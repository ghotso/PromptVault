# Configuration

This guide covers all configuration options for PromptVault, including environment variables, database settings, and advanced configuration options.

## 🔧 Environment Variables

### Required Variables

#### JWT_SECRET
- **Description**: Secret key for JWT token signing
- **Type**: String
- **Required**: Yes
- **Example**: `JWT_SECRET=your-super-secret-jwt-key-change-this`
- **Security**: Use a strong, random string (32+ characters)

```bash
# Generate a secure JWT secret
openssl rand -base64 32
```

### Optional Variables

#### NODE_ENV
- **Description**: Node.js environment mode
- **Type**: String
- **Default**: `production`
- **Options**: `development`, `production`, `test`

```bash
NODE_ENV=production
```

#### PORT
- **Description**: Port number for the server
- **Type**: Number
- **Default**: `3000`
- **Range**: 1-65535

```bash
PORT=3000
```

#### DATABASE_URL
- **Description**: Database connection string
- **Type**: String
- **Default**: `file:./data/promptvault.db`
- **Examples**:
  - SQLite: `file:./data/promptvault.db`
  - PostgreSQL: `postgresql://user:password@localhost:5432/promptvault`
  - MySQL: `mysql://user:password@localhost:3306/promptvault`

```bash
# SQLite (default)
DATABASE_URL=file:./data/promptvault.db

# PostgreSQL
DATABASE_URL=postgresql://promptvault:password@localhost:5432/promptvault

# MySQL
DATABASE_URL=mysql://promptvault:password@localhost:3306/promptvault
```

#### CLIENT_ORIGIN
- **Description**: Frontend URL for CORS configuration
- **Type**: String
- **Default**: `http://localhost:5173`
- **Examples**:
  - Development: `http://localhost:5173`
  - Production: `https://yourdomain.com`

```bash
CLIENT_ORIGIN=https://yourdomain.com
```

#### TZ
- **Description**: Timezone for the application
- **Type**: String
- **Default**: `UTC`
- **Examples**: `UTC`, `America/New_York`, `Europe/London`

```bash
TZ=UTC
```

### Advanced Variables

#### LOG_LEVEL
- **Description**: Logging level
- **Type**: String
- **Default**: `info`
- **Options**: `error`, `warn`, `info`, `debug`

```bash
LOG_LEVEL=debug
```

#### DEMO_MODE
- **Description**: Enable demo mode features
- **Type**: Boolean
- **Default**: `false`
- **Note**: Only for development/demo purposes

```bash
DEMO_MODE=true
```

#### PUBLIC_ORIGIN
- **Description**: Public URL for sharing links
- **Type**: String
- **Default**: Same as CLIENT_ORIGIN
- **Use Case**: Different internal/external URLs

```bash
PUBLIC_ORIGIN=https://yourdomain.com
```

## 🗄️ Database Configuration

### SQLite (Default)

#### Basic Configuration
```bash
DATABASE_URL=file:./data/promptvault.db
```

#### Advanced SQLite Options
```bash
# With additional parameters
DATABASE_URL=file:./data/promptvault.db?mode=rwc&cache=shared

# With WAL mode
DATABASE_URL=file:./data/promptvault.db?mode=rwc&journal_mode=WAL
```

#### SQLite Performance Tuning
```sql
-- Enable WAL mode
PRAGMA journal_mode=WAL;

-- Set cache size
PRAGMA cache_size=10000;

-- Enable foreign keys
PRAGMA foreign_keys=ON;

-- Set synchronous mode
PRAGMA synchronous=NORMAL;
```

### PostgreSQL

#### Basic Configuration
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/promptvault
```

#### Advanced PostgreSQL Options
```bash
# With SSL
DATABASE_URL=postgresql://username:password@localhost:5432/promptvault?sslmode=require

# With connection pooling
DATABASE_URL=postgresql://username:password@localhost:5432/promptvault?pool_timeout=20&connection_limit=10
```

#### PostgreSQL Setup
```sql
-- Create database
CREATE DATABASE promptvault;

-- Create user
CREATE USER promptvault WITH PASSWORD 'your_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE promptvault TO promptvault;

-- Set timezone
ALTER DATABASE promptvault SET timezone TO 'UTC';
```

### MySQL

#### Basic Configuration
```bash
DATABASE_URL=mysql://username:password@localhost:3306/promptvault
```

#### Advanced MySQL Options
```bash
# With SSL
DATABASE_URL=mysql://username:password@localhost:3306/promptvault?ssl=true

# With connection options
DATABASE_URL=mysql://username:password@localhost:3306/promptvault?charset=utf8mb4&timezone=UTC
```

#### MySQL Setup
```sql
-- Create database
CREATE DATABASE promptvault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'promptvault'@'localhost' IDENTIFIED BY 'your_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON promptvault.* TO 'promptvault'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;
```

## 🌐 CORS Configuration

### Basic CORS Setup
```javascript
// Backend CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-api-key'],
};
```

### Multiple Origins
```javascript
// Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
```

### Environment-specific CORS
```bash
# Development
CLIENT_ORIGIN=http://localhost:5173

# Staging
CLIENT_ORIGIN=https://staging.yourdomain.com

# Production
CLIENT_ORIGIN=https://yourdomain.com
```

## 🔐 Security Configuration

### JWT Configuration

#### Secret Generation
```bash
# Generate secure JWT secret
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### JWT Settings
```javascript
// JWT configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d',
  algorithm: 'HS256'
};
```

### Password Security

#### bcrypt Configuration
```javascript
// Password hashing
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Hash password
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### HTTPS Configuration

#### SSL/TLS Setup
```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Or use Let's Encrypt
certbot --nginx -d yourdomain.com
```

#### Environment Variables
```bash
# Enable HTTPS
NODE_ENV=production
CLIENT_ORIGIN=https://yourdomain.com
```

## 📊 Logging Configuration

### Log Levels

#### Available Levels
- **error**: Only error messages
- **warn**: Warning and error messages
- **info**: Informational, warning, and error messages
- **debug**: All messages including debug information

#### Configuration
```bash
# Production
LOG_LEVEL=info

# Development
LOG_LEVEL=debug

# Staging
LOG_LEVEL=warn
```

### Log Formatting

#### JSON Format (Production)
```javascript
// Structured logging
const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
};
```

#### Human-readable Format (Development)
```javascript
// Simple logging
const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${message}`, meta);
  }
};
```

## 🚀 Performance Configuration

### Database Optimization

#### SQLite Optimization
```sql
-- Enable WAL mode
PRAGMA journal_mode=WAL;

-- Set cache size
PRAGMA cache_size=10000;

-- Enable query optimization
PRAGMA optimize;

-- Set page size
PRAGMA page_size=4096;
```

#### PostgreSQL Optimization
```sql
-- Set shared buffers
ALTER SYSTEM SET shared_buffers = '256MB';

-- Set effective cache size
ALTER SYSTEM SET effective_cache_size = '1GB';

-- Set work memory
ALTER SYSTEM SET work_mem = '4MB';

-- Reload configuration
SELECT pg_reload_conf();
```

### Memory Configuration

#### Node.js Memory
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=2048"

# Or in Docker
docker run -e NODE_OPTIONS="--max-old-space-size=2048" promptvault
```

#### Database Memory
```bash
# SQLite memory settings
DATABASE_URL=file:./data/promptvault.db?cache_size=10000&temp_store=memory

# PostgreSQL memory settings
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
```

## 🔄 Backup Configuration

### Automated Backups

#### Database Backup
```bash
#!/bin/bash
# backup.sh

# Create backup directory
mkdir -p backups

# Backup SQLite database
sqlite3 data/promptvault.db ".backup backups/promptvault-$(date +%Y%m%d).db"

# Compress backup
gzip backups/promptvault-$(date +%Y%m%d).db

# Remove old backups (keep 30 days)
find backups -name "*.db.gz" -mtime +30 -delete
```

#### Cron Job
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh

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

### Backup Retention

#### Retention Policy
```bash
# Keep daily backups for 7 days
find backups -name "*-daily-*" -mtime +7 -delete

# Keep weekly backups for 4 weeks
find backups -name "*-weekly-*" -mtime +28 -delete

# Keep monthly backups for 12 months
find backups -name "*-monthly-*" -mtime +365 -delete
```

## 🌍 Environment-specific Configuration

### Development Environment

```bash
# .env.development
NODE_ENV=development
PORT=3000
DATABASE_URL=file:./dev.db
CLIENT_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
DEMO_MODE=true
```

### Staging Environment

```bash
# .env.staging
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@staging-db:5432/promptvault
CLIENT_ORIGIN=https://staging.yourdomain.com
LOG_LEVEL=info
```

### Production Environment

```bash
# .env.production
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@prod-db:5432/promptvault
CLIENT_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn
```

## 🔧 Docker Configuration

### Docker Environment

#### Environment File
```bash
# .env.docker
NODE_ENV=production
PORT=3000
DATABASE_URL=file:./data/promptvault.db
CLIENT_ORIGIN=http://localhost:8080
TZ=UTC
```

#### Docker Compose
```yaml
version: '3.8'
services:
  promptvault:
    image: ghcr.io/ghotso/promptvault:latest
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - PORT=${PORT:-3000}
      - DATABASE_URL=${DATABASE_URL}
      - CLIENT_ORIGIN=${CLIENT_ORIGIN}
      - JWT_SECRET=${JWT_SECRET}
    env_file:
      - .env.docker
```

### Kubernetes Configuration

#### ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: promptvault-config
data:
  NODE_ENV: "production"
  PORT: "3000"
  LOG_LEVEL: "info"
  TZ: "UTC"
```

#### Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: promptvault-secrets
type: Opaque
data:
  JWT_SECRET: <base64-encoded-secret>
  DATABASE_URL: <base64-encoded-url>
```

## 🚨 Troubleshooting Configuration

### Common Issues

#### Database Connection Issues
```bash
# Check database file permissions
ls -la data/promptvault.db

# Test database connection
sqlite3 data/promptvault.db "SELECT 1;"

# Check database URL format
echo $DATABASE_URL
```

#### CORS Issues
```bash
# Check CORS origin
echo $CLIENT_ORIGIN

# Test CORS from browser console
fetch('http://localhost:3000/api/health', {
  credentials: 'include'
}).then(r => r.json()).then(console.log);
```

#### JWT Issues
```bash
# Check JWT secret
echo $JWT_SECRET

# Test JWT generation
node -e "console.log(require('jsonwebtoken').sign({test: true}, process.env.JWT_SECRET))"
```

### Configuration Validation

#### Environment Check Script
```bash
#!/bin/bash
# check-config.sh

echo "Checking PromptVault configuration..."

# Check required variables
if [ -z "$JWT_SECRET" ]; then
  echo "ERROR: JWT_SECRET is not set"
  exit 1
fi

# Check database URL
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

# Check client origin
if [ -z "$CLIENT_ORIGIN" ]; then
  echo "ERROR: CLIENT_ORIGIN is not set"
  exit 1
fi

echo "Configuration looks good!"
```

---

**Need help with configuration?** Check out the [Troubleshooting](troubleshooting.md) guide for common configuration issues and solutions!
