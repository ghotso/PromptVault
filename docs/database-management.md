# Database Management

This guide covers database operations, maintenance, and management for PromptVault, including backup procedures, performance optimization, and migration strategies.

## 🗄️ Database Overview

### Database Architecture

PromptVault uses a relational database with the following key components:

#### Core Tables
- **User**: User accounts and authentication
- **Prompt**: User prompts and content
- **PromptVersion**: Version history for prompts
- **Tag**: Global tag system
- **PromptTag**: Many-to-many relationship between prompts and tags
- **Rating**: User ratings for prompts
- **Team**: Team definitions
- **UserTeam**: Many-to-many relationship between users and teams
- **Settings**: System-wide settings

#### Database Schema
```sql
-- User table
CREATE TABLE User (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  team TEXT,
  role TEXT DEFAULT 'USER',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Prompt table
CREATE TABLE Prompt (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  variables TEXT,
  notes TEXT,
  modelHints TEXT,
  visibility TEXT DEFAULT 'PRIVATE',
  userId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  isPubliclyShared BOOLEAN DEFAULT FALSE,
  publicShareId TEXT UNIQUE,
  FOREIGN KEY (userId) REFERENCES User(id)
);
```

### Supported Databases

#### SQLite (Default)
- **File-based**: Single file database
- **Zero Configuration**: No setup required
- **Portable**: Easy to backup and move
- **Lightweight**: Minimal resource usage

#### PostgreSQL (Production)
- **Client-Server**: Network database
- **ACID Compliance**: Full transaction support
- **Concurrent Access**: Multiple users
- **Advanced Features**: Full-text search, JSON support

#### MySQL (Alternative)
- **Widely Supported**: Popular database
- **High Performance**: Optimized for web applications
- **Replication**: Built-in replication support
- **Compatibility**: Good compatibility with tools

## 🔧 Database Operations

### Database Connection

#### SQLite Connection
```bash
# Connect to SQLite database
sqlite3 data/promptvault.db

# Basic commands
.tables                    # List all tables
.schema                    # Show database schema
.quit                      # Exit SQLite
```

#### PostgreSQL Connection
```bash
# Connect to PostgreSQL
psql -h localhost -U promptvault -d promptvault

# Basic commands
\dt                        # List all tables
\d+ table_name            # Describe table
\q                         # Quit psql
```

#### MySQL Connection
```bash
# Connect to MySQL
mysql -h localhost -u promptvault -p promptvault

# Basic commands
SHOW TABLES;              # List all tables
DESCRIBE table_name;      # Describe table
EXIT;                     # Quit MySQL
```

### Database Queries

#### Common Queries

##### User Queries
```sql
-- Get all users
SELECT id, email, name, role, createdAt FROM User;

-- Get user by email
SELECT * FROM User WHERE email = 'user@example.com';

-- Get users by team
SELECT * FROM User WHERE team = 'development';

-- Get admin users
SELECT * FROM User WHERE role = 'ADMIN';
```

##### Prompt Queries
```sql
-- Get all prompts
SELECT id, title, body, userId, createdAt FROM Prompt;

-- Get prompts by user
SELECT * FROM Prompt WHERE userId = 'user_id';

-- Get team prompts
SELECT * FROM Prompt WHERE visibility = 'TEAM';

-- Get public prompts
SELECT * FROM Prompt WHERE isPubliclyShared = TRUE;
```

##### Tag Queries
```sql
-- Get all tags
SELECT id, name FROM Tag;

-- Get tags with usage count
SELECT t.name, COUNT(pt.promptId) as usage_count
FROM Tag t
LEFT JOIN PromptTag pt ON t.id = pt.tagId
GROUP BY t.id, t.name;

-- Get most used tags
SELECT t.name, COUNT(pt.promptId) as usage_count
FROM Tag t
JOIN PromptTag pt ON t.id = pt.tagId
GROUP BY t.id, t.name
ORDER BY usage_count DESC;
```

#### Advanced Queries

##### Search Queries
```sql
-- Full-text search (SQLite FTS5)
SELECT p.* FROM Prompt p
JOIN PromptSearch ps ON p.id = ps.promptId
WHERE PromptSearch MATCH 'search term';

-- Tag-based search
SELECT p.* FROM Prompt p
JOIN PromptTag pt ON p.id = pt.promptId
JOIN Tag t ON pt.tagId = t.id
WHERE t.name LIKE '%search%';
```

##### Analytics Queries
```sql
-- User activity
SELECT 
  u.email,
  COUNT(p.id) as prompt_count,
  MAX(p.createdAt) as last_prompt
FROM User u
LEFT JOIN Prompt p ON u.id = p.userId
GROUP BY u.id, u.email;

-- Popular prompts
SELECT 
  p.title,
  COUNT(r.id) as rating_count,
  AVG(r.value) as avg_rating
FROM Prompt p
LEFT JOIN Rating r ON p.id = r.promptId
GROUP BY p.id, p.title
ORDER BY avg_rating DESC;
```

## 💾 Backup and Recovery

### Backup Procedures

#### SQLite Backup

##### Manual Backup
```bash
# Create backup
sqlite3 data/promptvault.db ".backup backup_$(date +%Y%m%d).db"

# Compress backup
gzip backup_$(date +%Y%m%d).db

# Verify backup
sqlite3 backup_$(date +%Y%m%d).db "SELECT COUNT(*) FROM User;"
```

##### Automated Backup Script
```bash
#!/bin/bash
# backup-sqlite.sh

BACKUP_DIR="/opt/backups/promptvault"
DATE=$(date +%Y%m%d_%H%M%S)
DB_FILE="data/promptvault.db"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
sqlite3 $DB_FILE ".backup $BACKUP_DIR/promptvault_$DATE.db"

# Compress backup
gzip $BACKUP_DIR/promptvault_$DATE.db

# Remove old backups (keep 30 days)
find $BACKUP_DIR -name "*.db.gz" -mtime +30 -delete

echo "Backup completed: promptvault_$DATE.db.gz"
```

#### PostgreSQL Backup

##### Manual Backup
```bash
# Create backup
pg_dump -h localhost -U promptvault -d promptvault > backup_$(date +%Y%m%d).sql

# Compress backup
gzip backup_$(date +%Y%m%d).sql

# Verify backup
gunzip -c backup_$(date +%Y%m%d).sql.gz | head -20
```

##### Automated Backup Script
```bash
#!/bin/bash
# backup-postgres.sh

BACKUP_DIR="/opt/backups/promptvault"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="promptvault"
DB_USER="promptvault"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/promptvault_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/promptvault_$DATE.sql

# Remove old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: promptvault_$DATE.sql.gz"
```

### Recovery Procedures

#### SQLite Recovery
```bash
# Stop application
docker-compose down

# Restore from backup
gunzip -c backup_20240101.db.gz > data/promptvault.db

# Verify restoration
sqlite3 data/promptvault.db "SELECT COUNT(*) FROM User;"

# Start application
docker-compose up -d
```

#### PostgreSQL Recovery
```bash
# Stop application
docker-compose down

# Drop existing database
dropdb -h localhost -U promptvault promptvault

# Create new database
createdb -h localhost -U promptvault promptvault

# Restore from backup
gunzip -c backup_20240101.sql.gz | psql -h localhost -U promptvault -d promptvault

# Start application
docker-compose up -d
```

### Backup Verification

#### Integrity Checks
```bash
# SQLite integrity check
sqlite3 data/promptvault.db "PRAGMA integrity_check;"

# PostgreSQL integrity check
psql -h localhost -U promptvault -d promptvault -c "SELECT COUNT(*) FROM User;"

# Compare backup with current
sqlite3 data/promptvault.db "SELECT COUNT(*) FROM User;" > current_count.txt
sqlite3 backup_20240101.db "SELECT COUNT(*) FROM User;" > backup_count.txt
diff current_count.txt backup_count.txt
```

## ⚡ Performance Optimization

### SQLite Optimization

#### Database Configuration
```sql
-- Enable WAL mode
PRAGMA journal_mode=WAL;

-- Set cache size
PRAGMA cache_size=10000;

-- Enable foreign keys
PRAGMA foreign_keys=ON;

-- Set synchronous mode
PRAGMA synchronous=NORMAL;

-- Optimize database
PRAGMA optimize;
```

#### Index Creation
```sql
-- Create indexes for better performance
CREATE INDEX idx_prompt_user_id ON Prompt(userId);
CREATE INDEX idx_prompt_visibility ON Prompt(visibility);
CREATE INDEX idx_prompt_created_at ON Prompt(createdAt);
CREATE INDEX idx_prompt_updated_at ON Prompt(updatedAt);
CREATE INDEX idx_prompt_public_share_id ON Prompt(publicShareId);

-- Create composite indexes
CREATE INDEX idx_prompt_user_visibility ON Prompt(userId, visibility);
CREATE INDEX idx_prompt_user_created ON Prompt(userId, createdAt);
```

#### Query Optimization
```sql
-- Use EXPLAIN QUERY PLAN to analyze queries
EXPLAIN QUERY PLAN SELECT * FROM Prompt WHERE userId = 'user_id';

-- Optimize queries with proper WHERE clauses
SELECT * FROM Prompt WHERE userId = 'user_id' AND visibility = 'PRIVATE';

-- Use LIMIT for large result sets
SELECT * FROM Prompt WHERE userId = 'user_id' ORDER BY createdAt DESC LIMIT 10;
```

### PostgreSQL Optimization

#### Database Configuration
```sql
-- Optimize PostgreSQL settings
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Reload configuration
SELECT pg_reload_conf();
```

#### Index Creation
```sql
-- Create indexes for better performance
CREATE INDEX idx_prompt_user_id ON "Prompt"("userId");
CREATE INDEX idx_prompt_visibility ON "Prompt"("visibility");
CREATE INDEX idx_prompt_created_at ON "Prompt"("createdAt");
CREATE INDEX idx_prompt_updated_at ON "Prompt"("updatedAt");
CREATE INDEX idx_prompt_public_share_id ON "Prompt"("publicShareId");

-- Create composite indexes
CREATE INDEX idx_prompt_user_visibility ON "Prompt"("userId", "visibility");
CREATE INDEX idx_prompt_user_created ON "Prompt"("userId", "createdAt");
```

### Full-Text Search Optimization

#### FTS5 Configuration (SQLite)
```sql
-- Create FTS5 virtual table
CREATE VIRTUAL TABLE PromptSearch USING fts5(
    promptId,
    title,
    body,
    content='Prompt',
    content_rowid='id'
);

-- Populate FTS5 table
INSERT INTO PromptSearch(promptId, title, body)
SELECT id, title, body FROM Prompt;

-- Create triggers to keep FTS5 in sync
CREATE TRIGGER prompt_ai AFTER INSERT ON Prompt BEGIN
    INSERT INTO PromptSearch(promptId, title, body)
    VALUES (new.id, new.title, new.body);
END;

CREATE TRIGGER prompt_au AFTER UPDATE ON Prompt BEGIN
    UPDATE PromptSearch SET title = new.title, body = new.body
    WHERE promptId = new.id;
END;

CREATE TRIGGER prompt_ad AFTER DELETE ON Prompt BEGIN
    DELETE FROM PromptSearch WHERE promptId = old.id;
END;
```

#### PostgreSQL Full-Text Search
```sql
-- Create full-text search index
CREATE INDEX idx_prompt_fts ON "Prompt" USING gin(to_tsvector('english', title || ' ' || body));

-- Search query
SELECT * FROM "Prompt"
WHERE to_tsvector('english', title || ' ' || body) @@ plainto_tsquery('english', 'search term');
```

## 🔄 Database Migration

### Prisma Migrations

#### Creating Migrations
```bash
# Create new migration
npx prisma migrate dev --name add_new_field

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

#### Migration Files
```sql
-- Migration: add_new_field
-- Add new field to Prompt table
ALTER TABLE "Prompt" ADD COLUMN "newField" TEXT;
```

### Database Schema Changes

#### Adding Columns
```sql
-- Add new column
ALTER TABLE "Prompt" ADD COLUMN "newField" TEXT;

-- Add column with default value
ALTER TABLE "Prompt" ADD COLUMN "status" TEXT DEFAULT 'active';

-- Add column with constraint
ALTER TABLE "Prompt" ADD COLUMN "priority" INTEGER CHECK (priority >= 1 AND priority <= 5);
```

#### Modifying Columns
```sql
-- Modify column type
ALTER TABLE "Prompt" ALTER COLUMN "title" TYPE VARCHAR(500);

-- Modify column constraint
ALTER TABLE "Prompt" ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE';

-- Add column constraint
ALTER TABLE "Prompt" ADD CONSTRAINT check_visibility CHECK (visibility IN ('PRIVATE', 'TEAM', 'PUBLIC'));
```

#### Dropping Columns
```sql
-- Drop column
ALTER TABLE "Prompt" DROP COLUMN "oldField";

-- Drop column with constraint
ALTER TABLE "Prompt" DROP CONSTRAINT check_old_field;
ALTER TABLE "Prompt" DROP COLUMN "oldField";
```

### Data Migration

#### Data Transformation
```sql
-- Transform data during migration
UPDATE "Prompt" SET "visibility" = 'PRIVATE' WHERE "visibility" IS NULL;

-- Migrate data between tables
INSERT INTO "NewTable" (id, name, value)
SELECT id, name, value FROM "OldTable";

-- Clean up old data
DELETE FROM "OldTable" WHERE "createdAt" < '2023-01-01';
```

## 📊 Database Monitoring

### Performance Monitoring

#### Query Performance
```sql
-- PostgreSQL: Check slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- SQLite: Check query plan
EXPLAIN QUERY PLAN SELECT * FROM Prompt WHERE userId = 'user_id';
```

#### Database Statistics
```sql
-- PostgreSQL: Database statistics
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
FROM pg_stat_user_tables;

-- SQLite: Table statistics
SELECT name, sql FROM sqlite_master WHERE type='table';
```

### Health Monitoring

#### Database Health Checks
```bash
# SQLite health check
sqlite3 data/promptvault.db "PRAGMA integrity_check;"

# PostgreSQL health check
psql -h localhost -U promptvault -d promptvault -c "SELECT 1;"

# Check database size
du -h data/promptvault.db
```

#### Connection Monitoring
```sql
-- PostgreSQL: Active connections
SELECT count(*) FROM pg_stat_activity;

-- PostgreSQL: Connection details
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start
FROM pg_stat_activity;
```

## 🚨 Troubleshooting

### Common Database Issues

#### Connection Issues
```bash
# Check database file permissions
ls -la data/promptvault.db

# Check database file integrity
sqlite3 data/promptvault.db "PRAGMA integrity_check;"

# Check database locks
lsof data/promptvault.db
```

#### Performance Issues
```sql
-- Check database size
SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();

-- Check index usage
EXPLAIN QUERY PLAN SELECT * FROM Prompt WHERE userId = 'user_id';

-- Analyze query performance
EXPLAIN QUERY PLAN SELECT * FROM Prompt WHERE title LIKE '%search%';
```

#### Data Corruption
```sql
-- Check for corruption
PRAGMA integrity_check;

-- Check specific tables
PRAGMA integrity_check(Prompt);
PRAGMA integrity_check(User);

-- Rebuild database
VACUUM;
```

### Recovery Procedures

#### Database Recovery
```bash
# Stop application
docker-compose down

# Backup current database
cp data/promptvault.db data/promptvault.db.backup

# Try to recover
sqlite3 data/promptvault.db ".recover" | sqlite3 data/promptvault_recovered.db

# Verify recovered database
sqlite3 data/promptvault_recovered.db "PRAGMA integrity_check;"

# Replace corrupted database
mv data/promptvault_recovered.db data/promptvault.db

# Start application
docker-compose up -d
```

#### Data Recovery
```sql
-- Recover deleted data (if available in WAL)
PRAGMA wal_checkpoint;

-- Check WAL file
PRAGMA wal_autocheckpoint;

-- Recover from backup
-- (Use backup restoration procedures above)
```

---

**Need help with database management?** Check out the [Troubleshooting](troubleshooting.md) guide for common database issues and solutions!
