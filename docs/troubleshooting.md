# Troubleshooting

This guide helps you resolve common issues with PromptVault. If you encounter problems not covered here, please check the [GitHub Issues](https://github.com/ghotso/PromptVault/issues) or create a new issue.

## 🚨 Common Issues

### Login Problems

#### Can't Log In
**Symptoms**: Unable to log in with correct credentials

**Possible Causes**:
- Incorrect email or password
- Account not activated
- System maintenance
- Browser issues

**Solutions**:
1. **Verify credentials**:
   - Check email spelling
   - Ensure password is correct
   - Try typing password in a text editor first

2. **Check system status**:
   - Visit `/health` endpoint
   - Check if system is running
   - Look for maintenance messages

3. **Clear browser data**:
   - Clear cookies and cache
   - Try incognito/private mode
   - Try different browser

4. **Reset password**:
   - Contact administrator
   - Use password reset if available

#### Wrong Credentials Error
**Symptoms**: "Invalid credentials" message

**Solutions**:
1. **Check email format**: Ensure proper email format
2. **Verify password**: Check for typos or caps lock
3. **Try default admin**: `admin@promptvault.local` / `admin123`
4. **Contact admin**: Ask admin to reset password

#### Session Expired
**Symptoms**: "Session expired" or automatic logout

**Solutions**:
1. **Log in again**: Simply log in again
2. **Check time**: Ensure system time is correct
3. **Clear cookies**: Clear browser cookies
4. **Contact admin**: If problem persists

### Database Issues

#### Database Connection Error
**Symptoms**: "Database connection failed" or similar errors

**Solutions**:
1. **Check database file**:
   ```bash
   # Check if database file exists
   ls -la data/promptvault.db
   
   # Check file permissions
   ls -la data/
   ```

2. **Restart application**:
   ```bash
   # Docker
   docker-compose restart promptvault
   
   # Manual
   npm run dev
   ```

3. **Check disk space**:
   ```bash
   df -h
   ```

4. **Recreate database**:
   ```bash
   # Backup first
   cp data/promptvault.db data/promptvault.db.backup
   
   # Remove database
   rm data/promptvault.db
   
   # Restart to recreate
   docker-compose restart promptvault
   ```

#### Database Locked
**Symptoms**: "Database is locked" error

**Solutions**:
1. **Wait and retry**: Database might be busy
2. **Check processes**: Ensure no other processes are using database
3. **Restart application**: Restart the application
4. **Check permissions**: Ensure proper file permissions

#### Data Corruption
**Symptoms**: Unexpected errors or missing data

**Solutions**:
1. **Check database integrity**:
   ```bash
   sqlite3 data/promptvault.db "PRAGMA integrity_check;"
   ```

2. **Restore from backup**:
   ```bash
   cp data/promptvault.db.backup data/promptvault.db
   ```

3. **Contact support**: If data is critical

### Performance Issues

#### Slow Loading
**Symptoms**: Pages load slowly or timeout

**Solutions**:
1. **Check system resources**:
   ```bash
   # Check memory usage
   free -h
   
   # Check CPU usage
   top
   
   # Check disk usage
   df -h
   ```

2. **Restart application**:
   ```bash
   docker-compose restart promptvault
   ```

3. **Check database size**:
   ```bash
   ls -lh data/promptvault.db
   ```

4. **Optimize database**:
   ```bash
   sqlite3 data/promptvault.db "VACUUM;"
   ```

#### High Memory Usage
**Symptoms**: Application uses too much memory

**Solutions**:
1. **Check memory limits**:
   ```bash
   docker stats promptvault
   ```

2. **Increase memory limits**:
   ```yaml
   # docker-compose.yml
   services:
     promptvault:
       deploy:
         resources:
           limits:
             memory: 2G
   ```

3. **Restart application**: Regular restarts help

#### Search Issues
**Symptoms**: Search not working or slow

**Solutions**:
1. **Check FTS5**: Ensure full-text search is enabled
2. **Rebuild search index**:
   ```bash
   sqlite3 data/promptvault.db "DELETE FROM PromptSearch;"
   sqlite3 data/promptvault.db "INSERT INTO PromptSearch(promptId, title, body) SELECT id, title, body FROM Prompt;"
   ```

3. **Check search query**: Ensure search terms are valid

### UI Issues

#### Page Not Loading
**Symptoms**: Blank page or loading errors

**Solutions**:
1. **Check browser console**: Look for JavaScript errors
2. **Clear browser cache**: Clear cache and cookies
3. **Try different browser**: Test in different browser
4. **Check network**: Ensure internet connection

#### Styling Issues
**Symptoms**: Broken layout or missing styles

**Solutions**:
1. **Hard refresh**: Ctrl+F5 or Cmd+Shift+R
2. **Clear cache**: Clear browser cache
3. **Check CSS loading**: Ensure CSS files are loading
4. **Try different browser**: Test in different browser

#### JavaScript Errors
**Symptoms**: JavaScript errors in console

**Solutions**:
1. **Check console**: Look for specific error messages
2. **Clear cache**: Clear browser cache
3. **Update browser**: Ensure browser is up to date
4. **Report issue**: Report specific errors

### Team Issues

#### Can't Access Team Feed
**Symptoms**: Team feed is empty or inaccessible

**Solutions**:
1. **Check team assignment**: Ensure you're assigned to a team
2. **Check team prompts**: Ensure team has shared prompts
3. **Contact admin**: Ask admin to check team settings
4. **Refresh page**: Try refreshing the page

#### Can't Share Prompts
**Symptoms**: Unable to share prompts with team

**Solutions**:
1. **Check permissions**: Ensure you have sharing permissions
2. **Check team assignment**: Ensure you're in a team
3. **Check prompt visibility**: Set visibility to "Team"
4. **Contact admin**: Ask admin to check settings

#### Team Prompts Not Updating
**Symptoms**: Team prompts not showing updates

**Solutions**:
1. **Refresh page**: Try refreshing the page
2. **Check network**: Ensure internet connection
3. **Clear cache**: Clear browser cache
4. **Contact team**: Ask team members to check

### Admin Issues

#### Can't Access Admin Panel
**Symptoms**: Admin panel not accessible

**Solutions**:
1. **Check role**: Ensure you have admin role
2. **Log out and in**: Try logging out and back in
3. **Check permissions**: Ensure admin permissions are set
4. **Contact support**: If problem persists

#### Can't Create Users
**Symptoms**: Unable to create new users

**Solutions**:
1. **Check permissions**: Ensure you have admin permissions
2. **Check email format**: Ensure proper email format
3. **Check for duplicates**: Ensure email isn't already used
4. **Try different email**: Test with different email

#### Can't Manage Teams
**Symptoms**: Unable to create or manage teams

**Solutions**:
1. **Check permissions**: Ensure admin permissions
2. **Check team name**: Ensure unique team name
3. **Check user assignments**: Ensure users exist
4. **Restart application**: Try restarting application

## 🔧 Technical Troubleshooting

### Docker Issues

#### Container Won't Start
**Symptoms**: Container fails to start

**Solutions**:
1. **Check logs**:
   ```bash
   docker-compose logs promptvault
   ```

2. **Check port conflicts**:
   ```bash
   netstat -tulpn | grep 8080
   ```

3. **Check resource limits**:
   ```bash
   docker stats
   ```

4. **Rebuild container**:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

#### Permission Issues
**Symptoms**: Permission denied errors

**Solutions**:
1. **Check file permissions**:
   ```bash
   ls -la data/
   ```

2. **Fix permissions**:
   ```bash
   sudo chown -R 1000:1000 data logs
   ```

3. **Check Docker user**:
   ```bash
   docker exec promptvault id
   ```

#### Volume Issues
**Symptoms**: Data not persisting

**Solutions**:
1. **Check volume mounts**:
   ```bash
   docker inspect promptvault | grep Mounts
   ```

2. **Check volume permissions**:
   ```bash
   ls -la data/
   ```

3. **Recreate volumes**:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Network Issues

#### Connection Refused
**Symptoms**: "Connection refused" errors

**Solutions**:
1. **Check if service is running**:
   ```bash
   docker-compose ps
   ```

2. **Check port binding**:
   ```bash
   docker-compose port promptvault 3000
   ```

3. **Check firewall**:
   ```bash
   sudo ufw status
   ```

4. **Check network**:
   ```bash
   netstat -tulpn | grep 3000
   ```

#### CORS Issues
**Symptoms**: CORS errors in browser

**Solutions**:
1. **Check CLIENT_ORIGIN**:
   ```bash
   echo $CLIENT_ORIGIN
   ```

2. **Update CORS settings**:
   ```bash
   CLIENT_ORIGIN=http://localhost:8080
   ```

3. **Check browser console**: Look for CORS errors

#### SSL Issues
**Symptoms**: SSL/TLS errors

**Solutions**:
1. **Check certificate**:
   ```bash
   openssl x509 -in cert.pem -text -noout
   ```

2. **Check certificate chain**:
   ```bash
   openssl verify -CAfile ca.pem cert.pem
   ```

3. **Check SSL configuration**: Ensure proper SSL setup

### Database Troubleshooting

#### SQLite Issues
**Symptoms**: SQLite-specific errors

**Solutions**:
1. **Check SQLite version**:
   ```bash
   sqlite3 --version
   ```

2. **Check database integrity**:
   ```bash
   sqlite3 data/promptvault.db "PRAGMA integrity_check;"
   ```

3. **Optimize database**:
   ```bash
   sqlite3 data/promptvault.db "VACUUM;"
   ```

4. **Check database locks**:
   ```bash
   lsof data/promptvault.db
   ```

#### Migration Issues
**Symptoms**: Database migration errors

**Solutions**:
1. **Check migration status**:
   ```bash
   npx prisma migrate status
   ```

2. **Reset migrations**:
   ```bash
   npx prisma migrate reset
   ```

3. **Apply migrations**:
   ```bash
   npx prisma migrate deploy
   ```

4. **Check schema**:
   ```bash
   npx prisma db pull
   ```

## 📊 Diagnostic Tools

### Health Checks

#### Application Health
```bash
# Check health endpoint
curl http://localhost:8080/health

# Check with verbose output
curl -v http://localhost:8080/health
```

#### Database Health
```bash
# Check database connection
sqlite3 data/promptvault.db "SELECT 1;"

# Check database size
ls -lh data/promptvault.db

# Check database integrity
sqlite3 data/promptvault.db "PRAGMA integrity_check;"
```

#### System Health
```bash
# Check system resources
free -h
df -h
top

# Check network
netstat -tulpn | grep 8080
```

### Log Analysis

#### Application Logs
```bash
# View recent logs
docker-compose logs --tail=100 promptvault

# Follow logs in real-time
docker-compose logs -f promptvault

# Filter logs by level
docker-compose logs promptvault | grep ERROR
```

#### System Logs
```bash
# Check system logs
journalctl -u promptvault

# Check Docker logs
journalctl -u docker

# Check system messages
dmesg | tail
```

### Performance Monitoring

#### Resource Usage
```bash
# Monitor container resources
docker stats promptvault

# Monitor system resources
htop

# Monitor disk usage
iotop
```

#### Database Performance
```bash
# Check database performance
sqlite3 data/promptvault.db "EXPLAIN QUERY PLAN SELECT * FROM Prompt;"

# Check database statistics
sqlite3 data/promptvault.db "PRAGMA stats;"
```

## 🆘 Getting Help

### Self-Help Resources

#### Documentation
- **User Guide**: Check user documentation
- **API Reference**: Check API documentation
- **Configuration**: Check configuration guide
- **Troubleshooting**: This guide

#### Community Resources
- **GitHub Issues**: Search existing issues
- **GitHub Discussions**: Ask questions
- **Community Forums**: Community support
- **Wiki**: Community-maintained documentation

### Reporting Issues

#### Before Reporting
1. **Check existing issues**: Search GitHub issues
2. **Try troubleshooting**: Use this guide
3. **Gather information**: Collect relevant details
4. **Test reproduction**: Ensure you can reproduce the issue

#### Issue Template
```markdown
## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., Windows 10, macOS 12, Ubuntu 20.04]
- Browser: [e.g., Chrome 91, Firefox 89, Safari 14]
- PromptVault Version: [e.g., 1.0.0]
- Docker Version: [e.g., 20.10.0]

## Logs
```
Paste relevant logs here
```

## Additional Context
Any other context about the problem.
```

### Contact Support

#### GitHub Issues
- **Bug Reports**: Report bugs and issues
- **Feature Requests**: Request new features
- **Questions**: Ask questions about usage
- **Discussions**: General discussions

#### Direct Contact
- **Email**: Contact maintainers directly
- **Discord**: Real-time chat support
- **Slack**: Team communication
- **Forums**: Community forums

## 🔄 Recovery Procedures

### Data Recovery

#### From Backup
```bash
# Stop application
docker-compose down

# Restore from backup
cp data/promptvault.db.backup data/promptvault.db

# Start application
docker-compose up -d
```

#### From Export
```bash
# Export data first
curl -H "Cookie: token=your_token" http://localhost:8080/api/import-export/export > backup.json

# Import data later
curl -X POST -H "Cookie: token=your_token" -H "Content-Type: application/json" -d @backup.json http://localhost:8080/api/import-export/import
```

### System Recovery

#### Complete Reset
```bash
# Stop application
docker-compose down

# Remove data
rm -rf data logs

# Remove containers
docker-compose down -v

# Start fresh
docker-compose up -d
```

#### Partial Reset
```bash
# Stop application
docker-compose down

# Backup data
cp -r data data.backup

# Remove specific data
rm data/promptvault.db

# Start application
docker-compose up -d
```

---

**Still having issues?** Check the [GitHub Issues](https://github.com/ghotso/PromptVault/issues) or create a new issue with detailed information about your problem!
