# Security

This guide covers security considerations, best practices, and recommendations for deploying and using PromptVault securely.

## 🔐 Security Overview

### Security Principles

PromptVault is designed with security in mind, following industry best practices:

- **Defense in Depth**: Multiple layers of security
- **Least Privilege**: Minimal necessary permissions
- **Secure by Default**: Secure configuration out of the box
- **Regular Updates**: Keep software updated
- **Monitoring**: Continuous security monitoring

### Threat Model

#### Potential Threats
- **Unauthorized Access**: Unauthorized users gaining access
- **Data Breaches**: Sensitive data exposure
- **Injection Attacks**: SQL injection, XSS
- **Session Hijacking**: Stealing user sessions
- **Man-in-the-Middle**: Intercepting communications
- **Denial of Service**: Overwhelming the system

#### Mitigation Strategies
- **Authentication**: Strong authentication mechanisms
- **Authorization**: Role-based access control
- **Encryption**: Data encryption at rest and in transit
- **Input Validation**: Comprehensive input sanitization
- **Secure Headers**: Security headers for protection
- **Rate Limiting**: Protection against abuse

## 🔑 Authentication Security

### JWT Security

#### JWT Configuration
```javascript
// Secure JWT configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET, // Strong, random secret
  expiresIn: '7d', // Reasonable expiration
  algorithm: 'HS256', // Secure algorithm
  issuer: 'promptvault',
  audience: 'promptvault-users'
};
```

#### JWT Best Practices
- **Strong Secret**: Use cryptographically secure random secret
- **Reasonable Expiration**: Balance security and usability
- **Secure Storage**: Store in HTTP-only cookies
- **Rotation**: Rotate secrets periodically
- **Validation**: Validate all JWT claims

#### Secret Management
```bash
# Generate secure JWT secret
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Store securely
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
```

### Password Security

#### Password Hashing
```javascript
// bcrypt configuration
const bcrypt = require('bcryptjs');
const saltRounds = 12; // Increased from default 10

// Hash password
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### Password Requirements
- **Minimum Length**: 8+ characters
- **Complexity**: Mix of letters, numbers, symbols
- **Uniqueness**: Different from other accounts
- **Regular Updates**: Change periodically
- **No Reuse**: Don't reuse passwords

#### Password Policies
```javascript
// Password validation
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character');
```

### Session Management

#### Secure Session Configuration
```javascript
// Cookie configuration
const cookieConfig = {
  httpOnly: true, // Prevent XSS
  secure: process.env.NODE_ENV === 'production', // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};
```

#### Session Security
- **HTTP-Only**: Prevent JavaScript access
- **Secure**: HTTPS only in production
- **SameSite**: CSRF protection
- **Expiration**: Automatic session expiration
- **Rotation**: Rotate session tokens

## 🛡️ Authorization Security

### Role-Based Access Control

#### User Roles
```typescript
enum Role {
  ADMIN = 'ADMIN',    // Full system access
  USER = 'USER'       // Standard user access
}
```

#### Permission Matrix
| Resource | Admin | User |
|----------|-------|------|
| View own prompts | ✅ | ✅ |
| Create prompts | ✅ | ✅ |
| Edit own prompts | ✅ | ✅ |
| Delete own prompts | ✅ | ✅ |
| View team prompts | ✅ | ✅ |
| Share prompts | ✅ | ✅ |
| Manage users | ✅ | ❌ |
| Manage teams | ✅ | ❌ |
| System settings | ✅ | ❌ |

#### Authorization Middleware
```javascript
// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (req.auth?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// User or admin middleware
const requireAuth = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};
```

### Resource Access Control

#### Prompt Access Control
```javascript
// Check prompt ownership
const checkPromptOwnership = async (req, res, next) => {
  const { id } = req.params;
  const { userId, role } = req.auth;
  
  const prompt = await prisma.prompt.findUnique({
    where: { id },
    select: { userId: true, visibility: true }
  });
  
  if (!prompt) {
    return res.status(404).json({ error: 'Prompt not found' });
  }
  
  // Admin can access all prompts
  if (role === 'ADMIN') {
    return next();
  }
  
  // Users can access their own prompts
  if (prompt.userId === userId) {
    return next();
  }
  
  // Users can access team prompts if in same team
  if (prompt.visibility === 'TEAM') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { team: true }
    });
    
    if (user?.team) {
      const promptUser = await prisma.user.findUnique({
        where: { id: prompt.userId },
        select: { team: true }
      });
      
      if (promptUser?.team === user.team) {
        return next();
      }
    }
  }
  
  return res.status(403).json({ error: 'Access denied' });
};
```

## 🔒 Data Security

### Data Encryption

#### Encryption at Rest
```javascript
// Database encryption (PostgreSQL)
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};
```

#### Encryption in Transit
```nginx
# HTTPS configuration
server {
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/promptvault.crt;
    ssl_certificate_key /etc/ssl/private/promptvault.key;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

### Input Validation

#### Input Sanitization
```javascript
// Zod validation schemas
const promptSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  body: z.string().min(1).max(10000).trim(),
  notes: z.string().max(1000).trim().optional(),
  modelHints: z.string().max(500).trim().optional(),
  tags: z.array(z.string().min(1).max(50)).max(10).optional()
});

// Sanitize HTML content
const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};
```

#### SQL Injection Prevention
```javascript
// Use Prisma ORM (prevents SQL injection)
const prompts = await prisma.prompt.findMany({
  where: {
    userId: req.auth.userId,
    title: { contains: searchTerm }
  }
});

// Never use raw SQL with user input
// BAD: `SELECT * FROM prompts WHERE title = '${userInput}'`
// GOOD: Use Prisma ORM or parameterized queries
```

### XSS Prevention

#### Content Security Policy
```html
<!-- CSP header -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:; 
               connect-src 'self';">
```

#### XSS Protection Headers
```nginx
# XSS protection headers
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

## 🌐 Network Security

### HTTPS Configuration

#### SSL/TLS Best Practices
```nginx
# Modern SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/ssl/certs/ca-certificates.crt;
```

#### Certificate Management
```bash
# Let's Encrypt setup
certbot --nginx -d yourdomain.com

# Auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

### CORS Configuration

#### Secure CORS Setup
```javascript
// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://yourdomain.com',
      'https://www.yourdomain.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};
```

### Rate Limiting

#### API Rate Limiting
```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts',
  skipSuccessfulRequests: true
});
```

#### Nginx Rate Limiting
```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

# Apply rate limiting
location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://localhost:3000;
}

location /api/auth/ {
    limit_req zone=auth burst=5 nodelay;
    proxy_pass http://localhost:3000;
}
```

## 🔍 Security Monitoring

### Logging and Monitoring

#### Security Event Logging
```javascript
// Security event logging
const logSecurityEvent = (event, details) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.auth?.userId
  };
  
  console.log(JSON.stringify(logEntry));
  
  // Send to security monitoring system
  if (process.env.SECURITY_WEBHOOK) {
    fetch(process.env.SECURITY_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    });
  }
};

// Log failed login attempts
app.post('/api/auth/login', async (req, res) => {
  try {
    // ... authentication logic
  } catch (error) {
    logSecurityEvent('failed_login', {
      email: req.body.email,
      error: error.message
    });
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

#### Intrusion Detection
```bash
# Fail2ban configuration
# /etc/fail2ban/jail.local
[promptvault]
enabled = true
port = 80,443
filter = promptvault
logpath = /var/log/nginx/access.log
maxretry = 5
bantime = 3600
findtime = 600
```

### Security Headers

#### Comprehensive Security Headers
```nginx
# Security headers
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
```

## 🚨 Incident Response

### Security Incident Procedures

#### Incident Classification
- **Low**: Minor security issues, no data exposure
- **Medium**: Potential data exposure, limited impact
- **High**: Confirmed data exposure, significant impact
- **Critical**: Major breach, widespread impact

#### Response Procedures
1. **Detection**: Identify and confirm incident
2. **Containment**: Isolate affected systems
3. **Investigation**: Determine scope and impact
4. **Eradication**: Remove threat and vulnerabilities
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Improve security measures

#### Incident Response Plan
```bash
#!/bin/bash
# incident-response.sh

# 1. Immediate containment
docker-compose down
iptables -A INPUT -j DROP

# 2. Preserve evidence
mkdir -p /opt/incident-$(date +%Y%m%d)
cp -r /var/log /opt/incident-$(date +%Y%m%d)/
docker logs promptvault > /opt/incident-$(date +%Y%m%d)/promptvault.log

# 3. Notify stakeholders
echo "Security incident detected" | mail -s "URGENT: Security Incident" admin@yourdomain.com

# 4. Begin investigation
# ... investigation procedures
```

### Backup and Recovery

#### Secure Backup Procedures
```bash
#!/bin/bash
# secure-backup.sh

# Encrypt backup
tar -czf - /opt/promptvault/data | gpg --symmetric --cipher-algo AES256 -o backup-$(date +%Y%m%d).tar.gz.gpg

# Upload to secure storage
aws s3 cp backup-$(date +%Y%m%d).tar.gz.gpg s3://secure-backup-bucket/

# Verify backup integrity
gpg --verify backup-$(date +%Y%m%d).tar.gz.gpg
```

## 🔧 Security Hardening

### System Hardening

#### OS Security
```bash
# Disable unnecessary services
systemctl disable bluetooth
systemctl disable cups
systemctl disable avahi-daemon

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Disable root login
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart ssh
```

#### Docker Security
```yaml
# docker-compose.yml security
services:
  promptvault:
    image: ghcr.io/ghotso/promptvault:latest
    user: "1000:1000"  # Non-root user
    read_only: true    # Read-only filesystem
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    tmpfs:
      - /tmp
      - /var/tmp
```

### Application Hardening

#### Environment Security
```bash
# Secure environment variables
chmod 600 .env
chown root:root .env

# Remove sensitive data from logs
grep -v "password\|secret\|key" /var/log/promptvault.log > /var/log/promptvault-clean.log
```

#### Database Security
```sql
-- PostgreSQL security
-- Create read-only user
CREATE USER promptvault_readonly WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO promptvault_readonly;

-- Enable row-level security
ALTER TABLE "Prompt" ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY prompt_access_policy ON "Prompt"
  FOR ALL TO promptvault
  USING (userId = current_setting('app.current_user_id')::text);
```

## 📋 Security Checklist

### Pre-deployment Security

- [ ] **Strong JWT Secret**: Use cryptographically secure random secret
- [ ] **HTTPS Enabled**: SSL/TLS certificate configured
- [ ] **Firewall Configured**: Only necessary ports open
- [ ] **Database Secured**: Strong passwords and encryption
- [ ] **Input Validation**: All inputs validated and sanitized
- [ ] **Security Headers**: Comprehensive security headers
- [ ] **Rate Limiting**: API rate limiting configured
- [ ] **Logging**: Security event logging enabled
- [ ] **Backup**: Secure backup procedures in place
- [ ] **Monitoring**: Security monitoring configured

### Post-deployment Security

- [ ] **Regular Updates**: Keep software updated
- [ ] **Security Scanning**: Regular vulnerability scans
- [ ] **Log Monitoring**: Monitor security logs
- [ ] **Access Review**: Regular access reviews
- [ ] **Incident Response**: Incident response plan ready
- [ ] **Security Training**: Team security training
- [ ] **Penetration Testing**: Regular security testing
- [ ] **Compliance**: Meet security compliance requirements

### Ongoing Security

- [ ] **Security Updates**: Apply security patches promptly
- [ ] **Vulnerability Management**: Track and remediate vulnerabilities
- [ ] **Security Awareness**: Regular security training
- [ ] **Incident Response**: Test incident response procedures
- [ ] **Security Audits**: Regular security audits
- [ ] **Compliance Monitoring**: Monitor compliance requirements

---

**Security is an ongoing process!** Regularly review and update your security measures to stay protected against evolving threats.
