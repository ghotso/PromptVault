# PromptVault

A self-hosted, privacy-friendly vault for AI prompts with advanced features including tagging, versioning, team sharing, and full-text search.

<p align="center">
  <img src="frontend/public/PromptVault_Icon_No_BG.svg" alt="PromptVault" width="200"/>
</p>

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Authentication**: JWT-based authentication with http-only cookies
- **User Roles**: Admin and User roles with granular permissions
- **Team Management**: Create teams and assign users to teams
- **Registration Control**: Toggle public registration on/off
- **Profile Management**: Update personal information and passwords

### 📝 Prompt Management
- **Create & Edit**: Rich prompt creation with title, content, notes, and model hints
- **Auto-Versioning**: Automatic version history for all prompt changes
- **Advanced Tagging**: Smart tag system with autocomplete and existing tag suggestions
- **Visibility Control**: Private, Team, or Public prompt sharing
- **Full-Text Search**: Search across prompt titles, content, and tags
- **Copy to Clipboard**: One-click copying of prompt content

### 🏷️ Tag System
- **Smart Tagging**: Add tags one by one with autocomplete
- **Tag Management**: Admin can create, edit, and delete tags
- **Usage Tracking**: See how many prompts use each tag
- **Safe Deletion**: Tags are only deleted when not in use

### 👥 Team Collaboration
- **Team Feed**: View prompts shared within your team
- **Team Assignment**: Admins can assign users to teams
- **Cross-Team Sharing**: Share prompts with specific teams or make them public

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Beautiful theme switching with custom color schemes
- **Modern Components**: Built with shadcn/ui and Tailwind CSS
- **Smooth Animations**: Hover effects and transitions throughout
- **Custom Branding**: Professional PromptVault icon and logo

### 🔧 Admin Features
- **User Management**: Create, edit, and delete users
- **Team Administration**: Manage team creation and assignments
- **System Settings**: Control registration and application behavior
- **Tag Administration**: Manage the global tag system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker (recommended)
- Git

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/PromptVault.git
cd PromptVault

# Start the application
docker-compose up -d

# Access the application at http://localhost:3000
```

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/PromptVault.git
cd PromptVault

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the backend
cd backend && npm run dev

# Start the frontend (in a new terminal)
cd frontend && npm run dev
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: SQLite with FTS5 full-text search
- **Authentication**: JWT with http-only cookies
- **Styling**: Custom design system with CSS variables

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
└── docker-compose.yml      # Docker configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# Server Port
PORT=8080

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

### Database Setup

The application uses Prisma with SQLite by default. For production, you can switch to PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/promptvault"
```

## 📱 Usage

### First Time Setup
1. Start the application
2. Register your first account (automatically becomes admin)
3. Create teams and invite users
4. Start creating and organizing your prompts

### Creating Prompts
1. Navigate to the Prompts page
2. Click "New Prompt"
3. Fill in title, content, and optional fields
4. Add tags and set visibility
5. Save your prompt

### Managing Teams
1. Go to Admin → Teams
2. Create new teams
3. Assign users to teams
4. Users can now share prompts within their team

### Tag Management
1. Use the tag input when creating prompts
2. Search existing tags or create new ones
3. Admins can manage tags globally in Admin → Tags

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# For production, use the production compose file
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm run start
```

### Environment Variables for Production

```env
NODE_ENV=production
JWT_SECRET="your-production-jwt-secret"
DATABASE_URL="your-production-database-url"
FRONTEND_URL="https://yourdomain.com"
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/PromptVault/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/PromptVault/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/PromptVault/wiki)

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/), [Express](https://expressjs.com/), and [Prisma](https://www.prisma.io/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**PromptVault** - Organize your AI prompts with style and security.