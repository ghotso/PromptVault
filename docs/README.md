# PromptVault

A self-hosted, privacy-friendly vault for AI prompts with advanced features including tagging, versioning, team sharing, and full-text search.

<div align="center"><img src="../frontend/public/PromptVault_Icon_No_BG.svg" alt="PromptVault" width="200"></div>

## ✨ Features

### 🔐 Authentication & User Management

* **Secure Authentication**: JWT-based authentication with http-only cookies
* **User Roles**: Admin and User roles with granular permissions
* **Team Management**: Create teams and assign users to teams
* **Registration Control**: Toggle public registration on/off via admin panel
* **Profile Management**: Update personal information and passwords

### 📝 Prompt Management

* **Create & Edit**: Rich prompt creation with title, content, notes, and model hints
* **Auto-Versioning**: Automatic version history for all prompt changes with pagination
* **Advanced Tagging**: Smart tag system with autocomplete and existing tag suggestions
* **Visibility Control**: Private, Team, or Public prompt sharing
* **Full-Text Search**: Search across prompt titles, content, and tags
* **Copy to Clipboard**: One-click copying of prompt content and version history
* **Detail Views**: Comprehensive prompt details with edit mode and version management

### 🏷️ Tag System

* **Smart Tagging**: Add tags one by one with autocomplete and suggestions
* **Tag Management**: Admin can create, edit, and delete tags with usage tracking
* **Usage Tracking**: See how many prompts use each tag
* **Safe Deletion**: Tags are only deleted when not in use by any prompts

### 👥 Team Collaboration

* **Team Feed**: View prompts shared within your team with detailed cards
* **Team Assignment**: Admins can assign users to teams
* **Cross-Team Sharing**: Share prompts with specific teams or make them public
* **Team Prompt Details**: Read-only detailed views for team-shared prompts

### 🎨 Modern UI/UX

* **Responsive Design**: Works seamlessly on desktop and mobile
* **Dark/Light Mode**: Beautiful theme switching with custom color schemes and glow effects
* **Modern Components**: Built with shadcn/ui and Tailwind CSS
* **Smooth Animations**: Hover effects, transitions, and enhanced shadows
* **Custom Branding**: Professional PromptVault icon and logo throughout the interface

### 🔧 Admin Features

* **User Management**: Create, edit, and delete users with role assignment
* **Team Administration**: Manage team creation and user assignments
* **System Settings**: Control registration and application behavior
* **Tag Administration**: Manage the global tag system with usage statistics
* **Automatic Admin Assignment**: First registered user automatically becomes admin
* **Default Admin Account**: System creates `admin@promptvault.local` if no users exist

### 🌐 API Endpoints

All API endpoints are now available under `/api/*`:

* **Authentication**: `/api/auth/*`
* **Prompts**: `/api/prompts/*`
* **Search**: `/api/search/*`
* **Ratings**: `/api/ratings/*`
* **Sharing**: `/api/share/*`
* **Import/Export**: `/api/import-export/*`
* **Tags**: `/api/tags/*`
* **Admin**: `/api/admin/*`
* **Health**: `/health` (public)
* **Settings**: `/settings` (public)

## 🚀 Quick Start

### Prerequisites

* Docker and Docker Compose
* Git (for development)

### 🐳 Docker Installation (Recommended)

#### Option 1: Using GHCR Image (Latest Release)

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
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - PORT=8080
      - JWT_SECRET=your-super-secret-jwt-key-change-this
      - DATABASE_URL=file:./data/promptvault.db
      - CLIENT_ORIGIN=http://localhost:3000
    volumes:
      - ./data:/app/backend/data
      - ./logs:/app/backend/logs
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
EOF

# Start PromptVault
docker-compose up -d

# Access the application at http://localhost:8080
```

#### Option 2: Using Docker Run

```bash
# Create data directory
mkdir -p ~/promptvault/data ~/promptvault/logs

# Run PromptVault
docker run -d \
  --name promptvault \
  --restart unless-stopped \
  -p 8080:8080 \
  -v ~/promptvault/data:/app/backend/data \
  -v ~/promvault/logs:/app/backend/logs \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e JWT_SECRET=your-super-secret-jwt-key-change-this \
  -e DATABASE_URL=file:./data/promptvault.db \
  -e CLIENT_ORIGIN=http://localhost:3000 \
  ghcr.io/ghotso/promptvault:latest
```

### 🔧 Environment Variables

| Variable        | Description                | Default                      | Required |
| --------------- | -------------------------- | ---------------------------- | -------- |
| `NODE_ENV`      | Environment mode           | `production`                 | No       |
| `PORT`          | Server port                | `8080`                       | No       |
| `JWT_SECRET`    | Secret for JWT tokens      | -                            | **Yes**  |
| `DATABASE_URL`  | Database connection string | `file:./data/promptvault.db` | No       |
| `CLIENT_ORIGIN` | Frontend URL for CORS      | -                            | No       |

### 📁 Volume Mappings

| Host Path | Container Path      | Description                        |
| --------- | ------------------- | ---------------------------------- |
| `./data`  | `/app/backend/data` | Database files and persistent data |
| `./logs`  | `/app/backend/logs` | Application logs                   |

### 🚀 Development Setup

```bash
# Clone the repository
git clone https://github.com/ghotso/PromptVault.git
cd PromptVault

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up development database
cd backend
npx prisma migrate dev
npx prisma generate

# Start the backend
npm run dev

# Start the frontend (in a new terminal)
cd frontend && npm run dev
```

## 🏗️ Architecture

### Tech Stack

* **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
* **Backend**: Node.js + Express + TypeScript + Prisma ORM
* **Database**: SQLite with FTS5 full-text search (PostgreSQL ready)
* **Authentication**: JWT with http-only cookies
* **Styling**: Custom design system with CSS variables and enhanced shadows

### Project Structure

```
PromptVault/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities and API client
│   │   └── styles/         # Global styles and theme
│   └── public/             # Static assets
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── lib/            # Database and utilities
│   │   └── middleware/     # Express middleware
│   └── prisma/             # Database schema and migrations
├── docs/                    # Documentation
├── .github/                 # GitHub templates and workflows
└── docker-compose.yml      # Docker configuration
```

## 📱 Usage

### First Time Setup

1. Start the application using Docker
2. Access http://localhost:8080
3. **Default Admin Account**: If no users exist, a default admin is created:
   * **Email**: `admin@promptvault.local`
   * **Password**: `admin123`
   * **Role**: `ADMIN` (full system access)
4. Create teams and invite users
5. Start creating and organizing your prompts

### Creating Prompts

1. Navigate to the Prompts page
2. Click "New Prompt"
3. Fill in title, content, and optional fields
4. Add tags one by one with autocomplete
5. Set visibility (Private/Team/Public)
6. Save your prompt

### Managing Teams

1. Go to Admin → Teams
2. Create new teams
3. Assign users to teams
4. Users can now share prompts within their team

### Tag Management

1. Use the smart tag input when creating prompts
2. Search existing tags or create new ones
3. Admins can manage tags globally in Admin → Tags
4. Tags show usage statistics and safe deletion

### Version History

1. View prompt details to see version history
2. Toggle between compact and detailed views
3. Copy content from any version
4. Pagination for prompts with many versions

## 🚀 Deployment

### Quick Start with Docker Compose (Recommended)

The easiest way to deploy PromptVault is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/ghotso/PromptVault.git
cd PromptVault

# Create data and logs directories
mkdir -p data logs

# Start PromptVault
docker-compose up -d

# Access at http://localhost:3674

## 🔑 Default Admin Account
If no users exist, the system automatically creates a default admin account:
- **Email**: `admin@promptvault.local`
- **Password**: `admin123`
- **Role**: `ADMIN` (full system access)

**Note**: Change the default password after first login for security!
```

For detailed Docker Compose instructions, see [DEPLOYMENT.md](../DEPLOYMENT.md).

### Production Docker Deployment

```bash
# Using the latest GHCR image
docker run -d \
  --name promptvault \
  --restart unless-stopped \
  -p 8080:8080 \
  -v /opt/promptvault/data:/app/backend/data \
  -v /opt/promptvault/logs:/app/backend/logs \
  -e NODE_ENV=production \
  -e JWT_SECRET="your-production-jwt-secret" \
  -e DATABASE_URL="file:./data/promptvault.db" \
  -e CLIENT_ORIGIN="https://yourdomain.com" \
  ghcr.io/ghotso/promptvault:latest
```

### Environment Variables for Production

```env
NODE_ENV=production
JWT_SECRET="your-production-jwt-secret"
DATABASE_URL="file:./data/promptvault.db"
CLIENT_ORIGIN="https://yourdomain.com"
```

### Reverse Proxy Setup (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8080;
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

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

### Development Setup

```bash
# Install dependencies
npm install

# Set up development database
cd backend
npx prisma migrate dev
npx prisma generate

# Start development servers
npm run dev:backend
npm run dev:frontend
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE/) file for details.

## 🆘 Support

* **Issues**: [GitHub Issues](https://github.com/ghotso/PromptVault/issues)
* **Discussions**: [GitHub Discussions](https://github.com/ghotso/PromptVault/discussions)
* **Documentation**: [Wiki](https://github.com/ghotso/PromptVault/wiki)

## 🙏 Acknowledgments

* Built with [React](https://reactjs.org/), [Express](https://expressjs.com/), and [Prisma](https://www.prisma.io/)
* UI components from [shadcn/ui](https://ui.shadcn.com/)
* Icons from [Lucide React](https://lucide.dev/)
* Styling with [Tailwind CSS](https://tailwindcss.com/)

***

**PromptVault** - Organize your AI prompts with style and security.
