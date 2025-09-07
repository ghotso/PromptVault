# Quick Start Guide

Get PromptVault up and running in minutes with this quick start guide. We'll cover the fastest way to get started using Docker.

## 🚀 Prerequisites

Before you begin, make sure you have:

- **Docker** installed on your system
- **Docker Compose** (usually included with Docker Desktop)
- **Git** (for cloning the repository)

### Check Prerequisites

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Check Git version
git --version
```

## ⚡ Quick Start with Docker

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ghotso/PromptVault.git
cd PromptVault
```

### Step 2: Create Data Directories

```bash
# Create data and logs directories
mkdir -p data logs
```

### Step 3: Start PromptVault

```bash
# Start PromptVault with Docker Compose
docker-compose up -d
```

### Step 4: Access the Application

Open your web browser and navigate to:

**http://localhost:8080**

## 🔑 First Login

When you first access PromptVault, you'll see the login screen. Use these default credentials:

- **Email**: `admin@promptvault.local`
- **Password**: `admin123`

> ⚠️ **Important**: Change the default password after your first login for security!

## 🎯 First Steps

### 1. Change Your Password

1. Click on your profile in the top-right corner
2. Go to **Account** settings
3. Update your password to something secure

### 2. Create Your First Prompt

1. Click **"New Prompt"** on the main page
2. Fill in the prompt details:
   - **Title**: Give your prompt a descriptive name
   - **Content**: Write your actual prompt
   - **Notes**: Add any additional context or instructions
   - **Model Hints**: Specify which AI model this works best with
3. Add some tags to help organize it
4. Click **"Save"**

### 3. Explore the Interface

- **Prompts**: Your personal prompt library
- **Team Feed**: Prompts shared by your team (if you're in a team)
- **Admin**: System administration (admin users only)
- **Account**: Your profile and settings

## 🔧 Configuration

### Environment Variables

The default configuration works out of the box, but you can customize it by creating a `.env` file:

```bash
# Create .env file
cat > .env << 'EOF'
# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Database URL
DATABASE_URL=file:./data/promptvault.db

# Client Origin (for CORS)
CLIENT_ORIGIN=http://localhost:8080

# Timezone
TZ=UTC
EOF
```

### Port Configuration

To change the port, edit `docker-compose.yml`:

```yaml
services:
  promptvault:
    ports:
      - "3000:3000"  # Change 3000 to your desired port
```

## 📊 Verify Installation

### Check Container Status

```bash
# Check if container is running
docker-compose ps

# Should show something like:
# NAME                IMAGE               COMMAND                  SERVICE             CREATED             STATUS                    PORTS
# promptvault         promptvault         "node dist/server.js"    promptvault         2 minutes ago       Up 2 minutes (healthy)   0.0.0.0:8080->3000/tcp
```

### Check Logs

```bash
# View application logs
docker-compose logs -f promptvault

# Should show startup messages and "Backend listening on :3000"
```

### Health Check

```bash
# Check if the application is healthy
curl http://localhost:8080/health

# Should return: {"ok":true}
```

## 🎉 You're Ready!

Congratulations! PromptVault is now running on your system. Here's what you can do next:

### For Users
- **Create Prompts**: Start building your prompt library
- **Add Tags**: Organize your prompts with tags
- **Search**: Use the search feature to find prompts quickly
- **Export**: Backup your prompts with the export feature

### For Administrators
- **Manage Users**: Create additional user accounts
- **Create Teams**: Set up teams for collaboration
- **Configure Settings**: Adjust system-wide settings
- **Manage Tags**: Organize the global tag system

## 🚨 Troubleshooting

### Container Won't Start

```bash
# Check logs for errors
docker-compose logs promptvault

# Common issues:
# - Port already in use: Change port in docker-compose.yml
# - Permission issues: Check data directory permissions
```

### Can't Access the Application

```bash
# Check if port is accessible
curl http://localhost:8080/health

# If not accessible:
# - Check if container is running: docker-compose ps
# - Check port mapping: docker-compose port promptvault 3000
# - Check firewall settings
```

### Database Issues

```bash
# Check database file
ls -la data/

# Should show promptvault.db file
# If missing, restart container: docker-compose restart
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v

# Remove data directory
rm -rf data logs

# Start fresh
docker-compose up -d
```

## 📚 Next Steps

Now that you have PromptVault running, explore these guides:

- **[User Interface](user-interface.md)**: Learn about the UI and navigation
- **[Creating Prompts](creating-prompts.md)**: Master prompt creation and management
- **[Team Collaboration](team-collaboration.md)**: Set up teams and sharing
- **[Docker Deployment](docker-deployment.md)**: Production deployment guide
- **[Configuration](configuration.md)**: Advanced configuration options

## 🆘 Need Help?

If you run into issues:

1. **Check the logs**: `docker-compose logs promptvault`
2. **Restart the container**: `docker-compose restart`
3. **Check the troubleshooting section** in this guide
4. **Search existing issues**: [GitHub Issues](https://github.com/ghotso/PromptVault/issues)
5. **Create a new issue**: [Report the problem](https://github.com/ghotso/PromptVault/issues)

---

**Ready to dive deeper?** Check out the [User Interface Guide](user-interface.md) to learn how to use PromptVault effectively!
