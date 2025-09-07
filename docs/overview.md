# PromptVault Overview

PromptVault is a modern, self-hosted application designed to help individuals and teams organize, manage, and share AI prompts effectively. Built with privacy and collaboration in mind, it provides a comprehensive solution for prompt management with advanced features that scale from personal use to enterprise teams.

## 🎯 Why PromptVault?

### The Problem
As AI tools become more prevalent, managing prompts has become increasingly challenging:

- **Scattered Prompts**: Prompts are often stored in various places - text files, notes apps, or just in memory
- **No Organization**: Without proper tagging and categorization, finding the right prompt becomes difficult
- **Version Control**: Tracking changes and improvements to prompts is nearly impossible
- **Team Collaboration**: Sharing prompts with team members lacks structure and control
- **Privacy Concerns**: Using third-party services means your prompts might be stored on external servers

### The Solution
PromptVault addresses these challenges with:

- **Centralized Storage**: All prompts in one secure, searchable location
- **Smart Organization**: Advanced tagging system with autocomplete and suggestions
- **Version History**: Automatic tracking of all prompt changes with detailed history
- **Team Features**: Controlled sharing within teams with proper permissions
- **Privacy First**: Self-hosted solution keeps your data under your control
- **Modern Interface**: Beautiful, responsive design that works on all devices

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Admin and User roles with appropriate permissions
- **HTTP-only Cookies**: Enhanced security for authentication tokens
- **Self-hosted**: Complete control over your data and privacy

### 📝 Prompt Management
- **Rich Prompt Creation**: Create prompts with title, content, notes, and model hints
- **Auto-Versioning**: Every change is automatically saved as a new version
- **Smart Tagging**: Add tags with autocomplete and existing tag suggestions
- **Visibility Control**: Set prompts as Private, Team, or Public
- **Copy to Clipboard**: One-click copying of prompt content and versions

### 🏷️ Advanced Tagging System
- **Smart Tag Input**: Autocomplete with existing tag suggestions
- **Usage Tracking**: See how many prompts use each tag
- **Admin Management**: Global tag management with usage statistics
- **Safe Deletion**: Tags are only deleted when not in use

### 👥 Team Collaboration
- **Team Creation**: Admins can create and manage teams
- **User Assignment**: Assign users to teams for organized collaboration
- **Team Feed**: View all prompts shared within your team
- **Cross-Team Sharing**: Share prompts with specific teams or make them public
- **Read-only Team Views**: Team members can view but not edit shared prompts

### 🔍 Search & Discovery
- **Full-Text Search**: Search across prompt titles, content, and tags using FTS5
- **Advanced Filtering**: Filter by tags, visibility, and other criteria
- **Quick Access**: Fast search results with highlighting
- **Search History**: Keep track of recent searches

### 🌐 Sharing & Export
- **Public Sharing**: Generate unique URLs for public prompt sharing
- **Import/Export**: Backup and restore your prompt collections
- **Team Sharing**: Controlled sharing within teams
- **Version Sharing**: Share specific versions of prompts

### 🎨 Modern User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Beautiful theme switching with custom color schemes
- **Modern Components**: Built with shadcn/ui and Tailwind CSS
- **Smooth Animations**: Hover effects, transitions, and enhanced shadows
- **Custom Branding**: Professional PromptVault icon and logo throughout

### 🔧 Administrative Features
- **User Management**: Create, edit, and delete users with role assignment
- **Team Administration**: Manage team creation and user assignments
- **System Settings**: Control registration and application behavior
- **Tag Administration**: Manage the global tag system
- **Usage Statistics**: Monitor system usage and activity

## 🏗️ Technical Architecture

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible UI components
- **React Router**: Client-side routing for SPA experience

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Fast, unopinionated web framework
- **TypeScript**: Type-safe server-side development
- **Prisma ORM**: Modern database toolkit and query builder
- **SQLite**: Lightweight, file-based database (PostgreSQL ready)

### Database
- **SQLite**: Default database for simplicity and portability
- **FTS5**: Full-text search capabilities
- **Prisma Migrations**: Database schema management
- **PostgreSQL Support**: Ready for production database scaling

### Authentication
- **JWT Tokens**: Secure, stateless authentication
- **bcrypt**: Password hashing and verification
- **HTTP-only Cookies**: Enhanced security for token storage
- **Role-based Access**: Admin and User permission levels

### Deployment
- **Docker**: Containerized deployment for consistency
- **Docker Compose**: Multi-container orchestration
- **Health Checks**: Built-in health monitoring
- **Volume Mounting**: Persistent data storage

## 🎯 Use Cases

### Personal Use
- **Individual Researchers**: Organize research prompts and experiments
- **Content Creators**: Manage writing prompts and templates
- **AI Enthusiasts**: Build a personal library of effective prompts
- **Students**: Organize study materials and AI-assisted learning prompts

### Team Use
- **Development Teams**: Share coding prompts and AI assistance templates
- **Marketing Teams**: Collaborate on content creation prompts
- **Research Groups**: Share and refine research prompts
- **Educational Institutions**: Manage prompts for AI-assisted learning

### Enterprise Use
- **Large Organizations**: Centralized prompt management across departments
- **Consulting Firms**: Share client-specific prompts and templates
- **AI Companies**: Manage internal prompt libraries and best practices
- **Government Agencies**: Secure prompt management for sensitive applications

## 🚀 Getting Started

Ready to try PromptVault? Here are your next steps:

1. **Quick Start**: Follow the [Quick Start Guide](quick-start.md) to get running in minutes
2. **Installation**: Choose your preferred installation method in [Installation](installation.md)
3. **User Guide**: Learn how to use PromptVault effectively in the [User Guide](user-interface.md)
4. **Deployment**: Set up for production with [Docker Deployment](docker-deployment.md)

## 🔮 Future Roadmap

PromptVault is actively developed with plans for:

- **Advanced Analytics**: Usage statistics and prompt effectiveness metrics
- **API Integrations**: Connect with popular AI services
- **Advanced Permissions**: Granular permission system for enterprise use
- **Mobile Apps**: Native mobile applications
- **Plugin System**: Extensible architecture for custom features
- **Advanced Search**: AI-powered semantic search capabilities

## 🤝 Community & Support

- **GitHub Repository**: [View source code and contribute](https://github.com/ghotso/PromptVault)
- **Issue Tracker**: [Report bugs and request features](https://github.com/ghotso/PromptVault/issues)
- **Discussions**: [Join community discussions](https://github.com/ghotso/PromptVault/discussions)
- **Documentation**: This comprehensive guide covers all aspects of PromptVault

---

**Ready to get started?** Head over to the [Quick Start Guide](quick-start.md) to have PromptVault running in minutes!
