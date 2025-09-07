# Admin Panel

This guide covers the administrative features of PromptVault, including user management, team administration, system settings, and monitoring capabilities.

## 🔧 Admin Panel Overview

### Accessing the Admin Panel

#### Prerequisites
- **Admin Role**: You must have admin privileges
- **Authentication**: Must be logged in to the system
- **Permissions**: Admin panel access is restricted to admin users

#### Navigation
1. **Login** to your PromptVault account
2. **Click "Admin"** in the top navigation
3. **Access admin features** from the admin dashboard

### Admin Panel Features

#### Main Sections
- **Users**: Manage user accounts and permissions
- **Teams**: Create and manage teams
- **Tags**: Global tag management
- **Settings**: System-wide configuration
- **Analytics**: Usage statistics and monitoring

## 👥 User Management

### Viewing Users

#### User List
The admin panel displays all users in the system with:
- **User ID**: Unique identifier
- **Email**: User's email address
- **Name**: Display name
- **Team**: Assigned team
- **Role**: User or Admin
- **Created**: Account creation date
- **Last Active**: Last activity timestamp

#### User Actions
- **View Details**: See full user information
- **Edit User**: Modify user details
- **Delete User**: Remove user account
- **Reset Password**: Generate new password

### Creating Users

#### Manual User Creation
1. **Click "Create User"** in the Users section
2. **Fill in user details**:
   - Email address
   - Display name
   - Password
   - Role (User or Admin)
   - Team assignment
3. **Click "Create"** to add the user

#### User Creation Form
```typescript
interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role: 'USER' | 'ADMIN';
  team?: string;
}
```

#### Validation Rules
- **Email**: Must be valid email format and unique
- **Name**: Required, 1-100 characters
- **Password**: Minimum 7 characters
- **Role**: Must be USER or ADMIN
- **Team**: Optional, must exist if provided

### Editing Users

#### User Edit Form
1. **Click "Edit"** next to a user
2. **Modify user details**:
   - Update name
   - Change password (optional)
   - Modify role
   - Change team assignment
3. **Save changes**

#### Edit Permissions
- **Name**: Can be updated by admin
- **Email**: Cannot be changed (creates new account)
- **Password**: Can be reset by admin
- **Role**: Can be changed by admin
- **Team**: Can be reassigned by admin

### Deleting Users

#### User Deletion Process
1. **Click "Delete"** next to a user
2. **Confirm deletion** in the dialog
3. **User account is permanently removed**

#### Deletion Considerations
- **Data Impact**: User's personal prompts are deleted
- **Team Impact**: User is removed from teams
- **Irreversible**: Deletion cannot be undone
- **Backup**: Consider backing up user data first

#### Safe Deletion
- **Export Data**: Export user's prompts before deletion
- **Notify User**: Inform user of account deletion
- **Team Cleanup**: Update team assignments
- **Documentation**: Keep record of deletion

## 🏢 Team Management

### Creating Teams

#### Team Creation Process
1. **Go to Teams section**
2. **Click "Create Team"**
3. **Enter team name**
4. **Click "Create"**

#### Team Naming
- **Unique Names**: Team names must be unique
- **Descriptive**: Use clear, descriptive names
- **Consistent**: Follow naming conventions
- **Examples**: "Marketing Team", "Development Team", "Sales Team"

### Managing Teams

#### Team Information
- **Team ID**: Unique identifier
- **Team Name**: Display name
- **Created Date**: When team was created
- **Member Count**: Number of team members
- **Active Status**: Whether team is active

#### Team Actions
- **Edit Team**: Modify team name
- **Delete Team**: Remove team
- **View Members**: See team members
- **Manage Members**: Add/remove members

### Assigning Users to Teams

#### User Assignment Process
1. **Go to Users section**
2. **Click "Edit"** next to a user
3. **Select team** from dropdown
4. **Save changes**

#### Team Assignment Rules
- **Single Team**: Users can be in one team at a time
- **Optional**: Team assignment is optional
- **Changeable**: Teams can be changed anytime
- **Admin Control**: Only admins can assign teams

#### Team Benefits
- **Team Feed**: Access to team-shared prompts
- **Collaboration**: Work with team members
- **Sharing**: Share prompts with team
- **Organization**: Better prompt organization

## 🏷️ Tag Management

### Global Tag Administration

#### Tag Overview
The admin panel shows all tags in the system with:
- **Tag Name**: The tag text
- **Usage Count**: How many prompts use this tag
- **Created Date**: When tag was first created
- **Last Used**: When tag was last used

#### Tag Actions
- **View Details**: See tag usage statistics
- **Edit Tag**: Rename tag
- **Delete Tag**: Remove tag (if not in use)
- **Merge Tags**: Combine similar tags

### Creating Tags

#### Manual Tag Creation
1. **Go to Tags section**
2. **Click "Create Tag"**
3. **Enter tag name**
4. **Click "Create"**

#### Tag Naming Guidelines
- **Consistent**: Use consistent naming conventions
- **Descriptive**: Clear and descriptive names
- **Hierarchical**: Use forward slashes for hierarchies
- **Examples**: `writing/emails`, `development/code-review`

### Editing Tags

#### Tag Renaming
1. **Click "Edit"** next to a tag
2. **Enter new name**
3. **Click "Save"**

#### Rename Considerations
- **Usage Impact**: All prompts using this tag are updated
- **Consistency**: Ensure new name follows conventions
- **Uniqueness**: New name must be unique
- **Communication**: Notify users of changes

### Deleting Tags

#### Tag Deletion Process
1. **Click "Delete"** next to a tag
2. **Confirm deletion** in dialog
3. **Tag is removed** if not in use

#### Deletion Rules
- **Usage Check**: Tag must not be in use
- **Safety**: Prevents accidental data loss
- **Confirmation**: Requires confirmation
- **Irreversible**: Deletion cannot be undone

#### Safe Deletion
- **Check Usage**: Verify tag is not in use
- **Notify Users**: Inform users of tag removal
- **Update Documentation**: Update any references
- **Consider Alternatives**: Maybe rename instead

## ⚙️ System Settings

### General Settings

#### Registration Control
- **Allow Registration**: Enable/disable user registration
- **Public Access**: Control who can create accounts
- **Admin Approval**: Require admin approval for new users
- **Invite Only**: Restrict registration to invited users

#### System Information
- **Version**: Current PromptVault version
- **Uptime**: System uptime
- **Database**: Database status and size
- **Storage**: Disk usage and available space

### Security Settings

#### Authentication Settings
- **Password Requirements**: Minimum password length
- **Session Timeout**: Automatic logout time
- **Login Attempts**: Failed login lockout
- **Two-Factor Auth**: Enable 2FA (future feature)

#### Access Control
- **Admin Access**: Who can access admin panel
- **API Access**: API access controls
- **Rate Limiting**: API rate limiting settings
- **IP Restrictions**: IP-based access controls

### Performance Settings

#### Database Settings
- **Connection Pool**: Database connection pool size
- **Query Timeout**: Database query timeout
- **Cache Settings**: Caching configuration
- **Backup Schedule**: Automatic backup settings

#### System Resources
- **Memory Limits**: Application memory limits
- **CPU Limits**: CPU usage limits
- **Disk Space**: Disk usage monitoring
- **Log Retention**: Log file retention policy

## 📊 Analytics and Monitoring

### User Analytics

#### User Statistics
- **Total Users**: Number of registered users
- **Active Users**: Users active in last 30 days
- **New Users**: Users created in last 30 days
- **User Growth**: User growth over time

#### User Activity
- **Login Frequency**: How often users log in
- **Feature Usage**: Which features are used most
- **Session Duration**: Average session length
- **Geographic Distribution**: User locations

### Content Analytics

#### Prompt Statistics
- **Total Prompts**: Number of prompts created
- **Prompts per User**: Average prompts per user
- **Team Prompts**: Number of team-shared prompts
- **Public Prompts**: Number of public prompts

#### Tag Analytics
- **Most Used Tags**: Popular tags
- **Tag Growth**: New tags over time
- **Tag Distribution**: Tag usage distribution
- **Tag Effectiveness**: Which tags help organization

### System Performance

#### Performance Metrics
- **Response Time**: Average API response time
- **Database Performance**: Query performance
- **Memory Usage**: Application memory usage
- **CPU Usage**: CPU utilization

#### Error Monitoring
- **Error Rate**: Application error rate
- **Error Types**: Most common errors
- **Error Trends**: Error trends over time
- **Critical Errors**: High-priority errors

## 🔍 Monitoring and Alerts

### System Health Monitoring

#### Health Checks
- **Database Health**: Database connection status
- **API Health**: API endpoint availability
- **Storage Health**: Disk space and file system
- **Network Health**: Network connectivity

#### Alert Configuration
- **Email Alerts**: Send alerts via email
- **Webhook Alerts**: Send alerts to webhooks
- **Threshold Settings**: Configure alert thresholds
- **Alert Frequency**: How often to send alerts

### Performance Monitoring

#### Resource Monitoring
- **CPU Usage**: Monitor CPU utilization
- **Memory Usage**: Track memory consumption
- **Disk Usage**: Monitor disk space
- **Network Usage**: Track network traffic

#### Performance Alerts
- **High CPU**: Alert when CPU usage is high
- **Low Memory**: Alert when memory is low
- **Disk Space**: Alert when disk space is low
- **Slow Response**: Alert when response time is slow

## 🚨 Troubleshooting

### Common Admin Issues

#### User Management Issues
- **Can't Create User**: Check email format and uniqueness
- **Can't Edit User**: Verify admin permissions
- **Can't Delete User**: Check for dependencies
- **Password Issues**: Verify password requirements

#### Team Management Issues
- **Can't Create Team**: Check team name uniqueness
- **Can't Assign Users**: Verify user and team exist
- **Team Not Showing**: Check team assignment
- **Permission Issues**: Verify admin permissions

#### System Issues
- **Settings Not Saving**: Check permissions and validation
- **Analytics Not Loading**: Check data availability
- **Performance Issues**: Monitor system resources
- **Error Messages**: Check logs for details

### Debugging Tools

#### Admin Debug Tools
- **System Logs**: View system logs
- **Error Logs**: Check error logs
- **Performance Logs**: Monitor performance
- **Audit Logs**: Track admin actions

#### Diagnostic Commands
```bash
# Check system status
curl http://localhost:8080/health

# Check database
sqlite3 data/promptvault.db "SELECT COUNT(*) FROM User;"

# Check logs
docker-compose logs promptvault
```

## 📋 Admin Best Practices

### User Management Best Practices

#### User Onboarding
- **Welcome Email**: Send welcome email to new users
- **Team Assignment**: Assign users to appropriate teams
- **Training**: Provide user training materials
- **Documentation**: Share relevant documentation

#### User Maintenance
- **Regular Reviews**: Review user accounts regularly
- **Permission Audits**: Audit user permissions
- **Inactive Users**: Handle inactive users
- **Security Updates**: Keep users informed of security updates

### Team Management Best Practices

#### Team Organization
- **Clear Structure**: Organize teams logically
- **Naming Conventions**: Use consistent naming
- **Documentation**: Document team purposes
- **Regular Reviews**: Review team effectiveness

#### Team Collaboration
- **Team Guidelines**: Establish team guidelines
- **Communication**: Facilitate team communication
- **Best Practices**: Share best practices
- **Regular Meetings**: Schedule team meetings

### System Administration Best Practices

#### Regular Maintenance
- **System Updates**: Keep system updated
- **Security Patches**: Apply security patches
- **Backup Verification**: Verify backups regularly
- **Performance Monitoring**: Monitor system performance

#### Documentation
- **Admin Procedures**: Document admin procedures
- **System Configuration**: Document system configuration
- **Troubleshooting**: Maintain troubleshooting guides
- **Change Log**: Keep change log updated

---

**Need help with administration?** Check out the [Troubleshooting](troubleshooting.md) guide for common admin issues and solutions!
