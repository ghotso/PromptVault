# Backup & Recovery

This guide covers backup and recovery procedures for PromptVault, including automated backup strategies, disaster recovery plans, and data restoration procedures.

## 💾 Backup Overview

### Backup Strategy

#### Backup Types
- **Full Backup**: Complete system backup including database and files
- **Incremental Backup**: Only changed data since last backup
- **Differential Backup**: All changes since last full backup
- **Snapshot Backup**: Point-in-time system state

#### Backup Frequency
- **Daily**: Database and critical files
- **Weekly**: Full system backup
- **Monthly**: Long-term archival backup
- **Before Updates**: Pre-update backup

#### Retention Policy
- **Daily Backups**: Keep for 30 days
- **Weekly Backups**: Keep for 12 weeks
- **Monthly Backups**: Keep for 12 months
- **Yearly Backups**: Keep indefinitely

### Backup Components

#### Database Backup
- **SQLite**: Database file and WAL files
- **PostgreSQL**: Database dump and configuration
- **MySQL**: Database dump and configuration

#### Application Files
- **Configuration**: Environment files and settings
- **Logs**: Application and system logs
- **Uploads**: User-uploaded files (if any)
- **Customizations**: Custom configurations

#### System Files
- **Docker Images**: Application container images
- **Docker Volumes**: Persistent data volumes
- **System Configuration**: OS-level configurations
- **SSL Certificates**: Security certificates

## 🔄 Automated Backup

### Database Backup Scripts

#### SQLite Backup Script
```bash
#!/bin/bash
# backup-sqlite.sh

# Configuration
BACKUP_DIR="/opt/backups/promptvault"
DB_FILE="/opt/promptvault/data/promptvault.db"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
sqlite3 $DB_FILE ".backup $BACKUP_DIR/promptvault_$DATE.db"

# Compress backup
gzip $BACKUP_DIR/promptvault_$DATE.db

# Verify backup
if [ -f "$BACKUP_DIR/promptvault_$DATE.db.gz" ]; then
    echo "Backup successful: promptvault_$DATE.db.gz"
    
    # Test backup integrity
    gunzip -c $BACKUP_DIR/promptvault_$DATE.db.gz | sqlite3 /dev/null "PRAGMA integrity_check;"
    if [ $? -eq 0 ]; then
        echo "Backup integrity verified"
    else
        echo "Backup integrity check failed"
        exit 1
    fi
else
    echo "Backup failed"
    exit 1
fi

# Remove old backups
find $BACKUP_DIR -name "*.db.gz" -mtime +$RETENTION_DAYS -delete

# Upload to cloud storage (optional)
if [ -n "$S3_BUCKET" ]; then
    aws s3 cp $BACKUP_DIR/promptvault_$DATE.db.gz s3://$S3_BUCKET/backups/
fi

echo "Backup completed successfully"
```

#### PostgreSQL Backup Script
```bash
#!/bin/bash
# backup-postgres.sh

# Configuration
BACKUP_DIR="/opt/backups/promptvault"
DB_NAME="promptvault"
DB_USER="promptvault"
DB_HOST="localhost"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_DIR/promptvault_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/promptvault_$DATE.sql

# Verify backup
if [ -f "$BACKUP_DIR/promptvault_$DATE.sql.gz" ]; then
    echo "Backup successful: promptvault_$DATE.sql.gz"
    
    # Test backup integrity
    gunzip -c $BACKUP_DIR/promptvault_$DATE.sql.gz | psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null
    if [ $? -eq 0 ]; then
        echo "Backup integrity verified"
    else
        echo "Backup integrity check failed"
        exit 1
    fi
else
    echo "Backup failed"
    exit 1
fi

# Remove old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Upload to cloud storage (optional)
if [ -n "$S3_BUCKET" ]; then
    aws s3 cp $BACKUP_DIR/promptvault_$DATE.sql.gz s3://$S3_BUCKET/backups/
fi

echo "Backup completed successfully"
```

### File System Backup

#### Application Files Backup
```bash
#!/bin/bash
# backup-files.sh

# Configuration
BACKUP_DIR="/opt/backups/promptvault"
APP_DIR="/opt/promptvault"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
tar -czf $BACKUP_DIR/promptvault-files_$DATE.tar.gz \
    -C $APP_DIR \
    data \
    logs \
    config \
    .env

# Verify backup
if [ -f "$BACKUP_DIR/promptvault-files_$DATE.tar.gz" ]; then
    echo "File backup successful: promptvault-files_$DATE.tar.gz"
    
    # Test backup integrity
    tar -tzf $BACKUP_DIR/promptvault-files_$DATE.tar.gz > /dev/null
    if [ $? -eq 0 ]; then
        echo "File backup integrity verified"
    else
        echo "File backup integrity check failed"
        exit 1
    fi
else
    echo "File backup failed"
    exit 1
fi

# Remove old backups
find $BACKUP_DIR -name "promptvault-files_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Upload to cloud storage (optional)
if [ -n "$S3_BUCKET" ]; then
    aws s3 cp $BACKUP_DIR/promptvault-files_$DATE.tar.gz s3://$S3_BUCKET/backups/
fi

echo "File backup completed successfully"
```

### Docker Backup

#### Container Backup
```bash
#!/bin/bash
# backup-docker.sh

# Configuration
BACKUP_DIR="/opt/backups/promptvault"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Stop containers
docker-compose down

# Backup volumes
docker run --rm -v promptvault_data:/data -v $BACKUP_DIR:/backup alpine \
    tar -czf /backup/promptvault-volumes_$DATE.tar.gz -C /data .

# Backup configuration
cp docker-compose.yml $BACKUP_DIR/
cp .env $BACKUP_DIR/

# Start containers
docker-compose up -d

# Verify backup
if [ -f "$BACKUP_DIR/promptvault-volumes_$DATE.tar.gz" ]; then
    echo "Docker backup successful: promptvault-volumes_$DATE.tar.gz"
else
    echo "Docker backup failed"
    exit 1
fi

# Remove old backups
find $BACKUP_DIR -name "promptvault-volumes_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Docker backup completed successfully"
```

## ⏰ Scheduled Backups

### Cron Jobs

#### Daily Backup
```bash
# Add to crontab
0 2 * * * /opt/scripts/backup-sqlite.sh >> /var/log/backup.log 2>&1
0 3 * * * /opt/scripts/backup-files.sh >> /var/log/backup.log 2>&1
```

#### Weekly Backup
```bash
# Add to crontab
0 1 * * 0 /opt/scripts/backup-docker.sh >> /var/log/backup.log 2>&1
```

#### Monthly Backup
```bash
# Add to crontab
0 0 1 * * /opt/scripts/backup-full.sh >> /var/log/backup.log 2>&1
```

### Systemd Timers

#### Daily Backup Timer
```ini
# /etc/systemd/system/promptvault-backup-daily.timer
[Unit]
Description=PromptVault Daily Backup Timer

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

#### Daily Backup Service
```ini
# /etc/systemd/system/promptvault-backup-daily.service
[Unit]
Description=PromptVault Daily Backup

[Service]
Type=oneshot
ExecStart=/opt/scripts/backup-sqlite.sh
ExecStart=/opt/scripts/backup-files.sh
User=root
```

#### Enable Timers
```bash
# Enable and start timers
sudo systemctl enable promptvault-backup-daily.timer
sudo systemctl start promptvault-backup-daily.timer

# Check timer status
sudo systemctl list-timers promptvault-backup-daily.timer
```

## ☁️ Cloud Backup

### AWS S3 Backup

#### S3 Configuration
```bash
# Install AWS CLI
sudo apt install awscli

# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://promptvault-backups
```

#### S3 Backup Script
```bash
#!/bin/bash
# backup-s3.sh

# Configuration
S3_BUCKET="promptvault-backups"
BACKUP_DIR="/opt/backups/promptvault"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
/opt/scripts/backup-sqlite.sh
/opt/scripts/backup-files.sh

# Upload to S3
aws s3 sync $BACKUP_DIR s3://$S3_BUCKET/backups/

# Verify upload
aws s3 ls s3://$S3_BUCKET/backups/ --recursive

echo "S3 backup completed successfully"
```

### Google Cloud Storage

#### GCS Configuration
```bash
# Install gsutil
curl https://sdk.cloud.google.com | bash
source ~/.bashrc

# Configure authentication
gcloud auth login
gcloud config set project your-project-id

# Create bucket
gsutil mb gs://promptvault-backups
```

#### GCS Backup Script
```bash
#!/bin/bash
# backup-gcs.sh

# Configuration
GCS_BUCKET="gs://promptvault-backups"
BACKUP_DIR="/opt/backups/promptvault"

# Create backup
/opt/scripts/backup-sqlite.sh
/opt/scripts/backup-files.sh

# Upload to GCS
gsutil -m rsync -r $BACKUP_DIR $GCS_BUCKET/backups/

# Verify upload
gsutil ls $GCS_BUCKET/backups/

echo "GCS backup completed successfully"
```

## 🔄 Recovery Procedures

### Database Recovery

#### SQLite Recovery
```bash
#!/bin/bash
# restore-sqlite.sh

# Configuration
BACKUP_FILE="$1"
DB_FILE="/opt/promptvault/data/promptvault.db"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Stop application
docker-compose down

# Backup current database
cp $DB_FILE $DB_FILE.backup.$(date +%Y%m%d_%H%M%S)

# Restore database
gunzip -c $BACKUP_FILE | sqlite3 $DB_FILE

# Verify restoration
sqlite3 $DB_FILE "PRAGMA integrity_check;"
if [ $? -eq 0 ]; then
    echo "Database restoration successful"
else
    echo "Database restoration failed"
    exit 1
fi

# Start application
docker-compose up -d

echo "Database recovery completed successfully"
```

#### PostgreSQL Recovery
```bash
#!/bin/bash
# restore-postgres.sh

# Configuration
BACKUP_FILE="$1"
DB_NAME="promptvault"
DB_USER="promptvault"
DB_HOST="localhost"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Stop application
docker-compose down

# Drop existing database
dropdb -h $DB_HOST -U $DB_USER $DB_NAME

# Create new database
createdb -h $DB_HOST -U $DB_USER $DB_NAME

# Restore database
gunzip -c $BACKUP_FILE | psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Verify restoration
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM \"User\";"
if [ $? -eq 0 ]; then
    echo "Database restoration successful"
else
    echo "Database restoration failed"
    exit 1
fi

# Start application
docker-compose up -d

echo "Database recovery completed successfully"
```

### File System Recovery

#### Application Files Recovery
```bash
#!/bin/bash
# restore-files.sh

# Configuration
BACKUP_FILE="$1"
APP_DIR="/opt/promptvault"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Stop application
docker-compose down

# Backup current files
tar -czf $APP_DIR.backup.$(date +%Y%m%d_%H%M%S).tar.gz -C $APP_DIR .

# Restore files
tar -xzf $BACKUP_FILE -C $APP_DIR

# Verify restoration
if [ -f "$APP_DIR/data/promptvault.db" ]; then
    echo "File restoration successful"
else
    echo "File restoration failed"
    exit 1
fi

# Start application
docker-compose up -d

echo "File recovery completed successfully"
```

### Full System Recovery

#### Complete System Recovery
```bash
#!/bin/bash
# restore-full.sh

# Configuration
BACKUP_DATE="$1"
BACKUP_DIR="/opt/backups/promptvault"
APP_DIR="/opt/promptvault"

# Check if backup date is provided
if [ -z "$BACKUP_DATE" ]; then
    echo "Usage: $0 <backup_date>"
    echo "Example: $0 20240101_020000"
    exit 1
fi

# Check if backup files exist
DB_BACKUP="$BACKUP_DIR/promptvault_$BACKUP_DATE.db.gz"
FILES_BACKUP="$BACKUP_DIR/promptvault-files_$BACKUP_DATE.tar.gz"

if [ ! -f "$DB_BACKUP" ] || [ ! -f "$FILES_BACKUP" ]; then
    echo "Backup files not found for date: $BACKUP_DATE"
    exit 1
fi

# Stop application
docker-compose down

# Restore database
gunzip -c $DB_BACKUP | sqlite3 $APP_DIR/data/promptvault.db

# Restore files
tar -xzf $FILES_BACKUP -C $APP_DIR

# Verify restoration
sqlite3 $APP_DIR/data/promptvault.db "PRAGMA integrity_check;"
if [ $? -eq 0 ]; then
    echo "Full system restoration successful"
else
    echo "Full system restoration failed"
    exit 1
fi

# Start application
docker-compose up -d

echo "Full system recovery completed successfully"
```

## 🚨 Disaster Recovery

### Disaster Recovery Plan

#### Recovery Time Objectives (RTO)
- **Critical Systems**: 1 hour
- **Important Systems**: 4 hours
- **Standard Systems**: 24 hours

#### Recovery Point Objectives (RPO)
- **Critical Data**: 15 minutes
- **Important Data**: 1 hour
- **Standard Data**: 24 hours

### Recovery Procedures

#### Immediate Response
1. **Assess Damage**: Determine extent of damage
2. **Isolate Systems**: Prevent further damage
3. **Notify Stakeholders**: Inform relevant parties
4. **Activate Recovery**: Begin recovery procedures

#### Recovery Steps
1. **Restore Infrastructure**: Rebuild system infrastructure
2. **Restore Data**: Restore from latest backup
3. **Verify Systems**: Test system functionality
4. **Resume Operations**: Return to normal operations

#### Post-Recovery
1. **Document Incident**: Record what happened
2. **Analyze Cause**: Determine root cause
3. **Improve Procedures**: Update recovery procedures
4. **Test Backups**: Verify backup integrity

### Recovery Testing

#### Backup Testing
```bash
#!/bin/bash
# test-backup.sh

# Configuration
BACKUP_DIR="/opt/backups/promptvault"
TEST_DIR="/opt/test-restore"

# Create test directory
mkdir -p $TEST_DIR

# Test database backup
LATEST_DB=$(ls -t $BACKUP_DIR/promptvault_*.db.gz | head -1)
if [ -f "$LATEST_DB" ]; then
    gunzip -c $LATEST_DB | sqlite3 $TEST_DIR/test.db
    sqlite3 $TEST_DIR/test.db "PRAGMA integrity_check;"
    if [ $? -eq 0 ]; then
        echo "Database backup test passed"
    else
        echo "Database backup test failed"
        exit 1
    fi
else
    echo "No database backup found"
    exit 1
fi

# Test file backup
LATEST_FILES=$(ls -t $BACKUP_DIR/promptvault-files_*.tar.gz | head -1)
if [ -f "$LATEST_FILES" ]; then
    tar -tzf $LATEST_FILES > /dev/null
    if [ $? -eq 0 ]; then
        echo "File backup test passed"
    else
        echo "File backup test failed"
        exit 1
    fi
else
    echo "No file backup found"
    exit 1
fi

echo "Backup testing completed successfully"
```

#### Recovery Testing
```bash
#!/bin/bash
# test-recovery.sh

# Configuration
BACKUP_DATE="$1"
TEST_DIR="/opt/test-recovery"

# Check if backup date is provided
if [ -z "$BACKUP_DATE" ]; then
    echo "Usage: $0 <backup_date>"
    exit 1
fi

# Create test directory
mkdir -p $TEST_DIR

# Test database recovery
DB_BACKUP="/opt/backups/promptvault/promptvault_$BACKUP_DATE.db.gz"
if [ -f "$DB_BACKUP" ]; then
    gunzip -c $DB_BACKUP | sqlite3 $TEST_DIR/test.db
    sqlite3 $TEST_DIR/test.db "PRAGMA integrity_check;"
    if [ $? -eq 0 ]; then
        echo "Database recovery test passed"
    else
        echo "Database recovery test failed"
        exit 1
    fi
else
    echo "Database backup not found: $DB_BACKUP"
    exit 1
fi

# Test file recovery
FILES_BACKUP="/opt/backups/promptvault/promptvault-files_$BACKUP_DATE.tar.gz"
if [ -f "$FILES_BACKUP" ]; then
    tar -xzf $FILES_BACKUP -C $TEST_DIR
    if [ -f "$TEST_DIR/data/promptvault.db" ]; then
        echo "File recovery test passed"
    else
        echo "File recovery test failed"
        exit 1
    fi
else
    echo "File backup not found: $FILES_BACKUP"
    exit 1
fi

echo "Recovery testing completed successfully"
```

## 📋 Backup Checklist

### Pre-Backup Checklist
- [ ] **Verify Storage**: Ensure sufficient storage space
- [ ] **Check Permissions**: Verify backup script permissions
- [ ] **Test Scripts**: Run backup scripts manually
- [ ] **Monitor Resources**: Check system resources
- [ ] **Document Procedures**: Update backup procedures

### Post-Backup Checklist
- [ ] **Verify Backups**: Check backup integrity
- [ ] **Test Restoration**: Test recovery procedures
- [ ] **Monitor Logs**: Check backup logs
- [ ] **Update Documentation**: Update backup records
- [ ] **Cleanup**: Remove old backups

### Recovery Checklist
- [ ] **Assess Situation**: Determine recovery needs
- [ ] **Stop Services**: Stop affected services
- [ ] **Restore Data**: Restore from backup
- [ ] **Verify Systems**: Test system functionality
- [ ] **Resume Operations**: Return to normal operations
- [ ] **Document Incident**: Record recovery details

---

**Backup and recovery are critical for data protection!** Regularly test your backup and recovery procedures to ensure they work when needed.
