# Development Setup

This guide will help you set up PromptVault for development, including installing dependencies, configuring the environment, and running the development servers.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For cloning the repository
- **SQLite**: For the database (usually pre-installed)

### Optional Software

- **Docker**: For containerized development
- **VS Code**: Recommended code editor
- **Postman**: For API testing
- **Chrome DevTools**: For debugging

### Check Prerequisites

```bash
# Check Node.js version
node --version
# Should be 18.0.0 or higher

# Check npm version
npm --version
# Should be 8.0.0 or higher

# Check Git version
git --version
# Any recent version is fine

# Check SQLite version
sqlite3 --version
# Any recent version is fine
```

## 📥 Getting the Source Code

### Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ghotso/PromptVault.git
cd PromptVault

# Check out the development branch (if available)
git checkout develop
```

### Repository Structure

```
PromptVault/
├── backend/                 # Backend API server
│   ├── src/                # TypeScript source code
│   ├── prisma/             # Database schema and migrations
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # TypeScript configuration
├── frontend/               # React frontend application
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
├── docs/                   # Documentation
├── scripts/                # Build and deployment scripts
├── docker-compose.yml      # Docker configuration
├── Dockerfile             # Docker image definition
└── README.md              # Project overview
```

## 🔧 Backend Setup

### Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### Environment Configuration

```bash
# Create environment file
cp .env.example .env

# Edit environment variables
nano .env
```

#### Required Environment Variables

```bash
# JWT Secret (required)
JWT_SECRET=your-development-jwt-secret

# Database URL
DATABASE_URL=file:./dev.db

# Port
PORT=3000

# Node Environment
NODE_ENV=development

# Client Origin (for CORS)
CLIENT_ORIGIN=http://localhost:5173
```

#### Optional Environment Variables

```bash
# Timezone
TZ=UTC

# Log Level
LOG_LEVEL=debug

# Demo Mode
DEMO_MODE=true
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### Start Backend Server

```bash
# Start development server
npm run dev

# Server will start on http://localhost:3000
# API endpoints available at http://localhost:3000/api
```

## 🎨 Frontend Setup

### Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### Environment Configuration

```bash
# Create environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

#### Frontend Environment Variables

```bash
# API Base URL
VITE_API_BASE=http://localhost:3000

# App Title
VITE_APP_TITLE=PromptVault

# App Version
VITE_APP_VERSION=1.0.0
```

### Start Frontend Server

```bash
# Start development server
npm run dev

# Server will start on http://localhost:5173
# Hot reload enabled for development
```

## 🚀 Running the Full Application

### Method 1: Separate Terminals

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Method 2: Root Package Scripts

```bash
# From project root
npm run dev:backend    # Start backend
npm run dev:frontend   # Start frontend
```

### Method 3: Docker Development

```bash
# Build development image
docker-compose -f docker-compose.dev.yml up --build

# Or use the development script
./scripts/dev-docker.sh
```

## 🔍 Development Tools

### Code Editor Setup

#### VS Code Extensions

Install these recommended extensions:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "prisma.prisma",
    "ms-vscode.vscode-json"
  ]
}
```

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

### Database Tools

#### Prisma Studio

```bash
# Start Prisma Studio
npx prisma studio

# Opens at http://localhost:5555
# Visual database browser and editor
```

#### SQLite Browser

```bash
# Install SQLite Browser
# macOS: brew install --cask db-browser-for-sqlite
# Ubuntu: sudo apt install sqlitebrowser
# Windows: Download from https://sqlitebrowser.org/

# Open database
sqlitebrowser backend/dev.db
```

### API Testing

#### Using curl

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@promptvault.local","password":"admin123"}'

# Test prompts endpoint (with auth)
curl http://localhost:3000/api/prompts \
  -H "Cookie: token=your_jwt_token"
```

#### Using Postman

1. **Import collection**: Use the provided Postman collection
2. **Set environment**: Configure local development environment
3. **Test endpoints**: Run through all API endpoints
4. **Debug issues**: Use Postman's debugging features

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# All tests
npm run test:all
```

### Test Configuration

#### Backend Testing

```bash
# Install test dependencies
npm install --save-dev jest @types/jest ts-jest

# Configure Jest
# jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

#### Frontend Testing

```bash
# Install test dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Configure Vitest
# vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

## 🔧 Development Scripts

### Available Scripts

#### Backend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
```

#### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
```

#### Root Scripts

```bash
npm run dev:backend    # Start backend server
npm run dev:frontend   # Start frontend server
npm run build          # Build both frontend and backend
npm run start          # Start production server
npm run test:all       # Run all tests
npm run lint:all       # Lint all code
```

### Custom Scripts

#### Database Scripts

```bash
# Reset database
npm run db:reset

# Seed database
npm run db:seed

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

#### Development Scripts

```bash
# Start with hot reload
npm run dev:watch

# Start with debugging
npm run dev:debug

# Start with profiling
npm run dev:profile
```

## 🐛 Debugging

### Backend Debugging

#### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/server.ts",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector"
    }
  ]
}
```

#### Debugging Tips

```bash
# Enable debug logging
DEBUG=* npm run dev

# Use Node.js debugger
node --inspect src/server.ts

# Use VS Code debugger
# Set breakpoints and use F5 to start debugging
```

### Frontend Debugging

#### React DevTools

1. **Install browser extension**: React Developer Tools
2. **Enable in browser**: Available in Chrome/Firefox
3. **Debug components**: Inspect component state and props
4. **Profile performance**: Use React Profiler

#### Browser Debugging

```bash
# Enable source maps
# Already enabled in development mode

# Use browser dev tools
# F12 to open developer tools
# Sources tab for debugging
# Console tab for logging
```

## 📦 Building for Production

### Backend Build

```bash
cd backend

# Build TypeScript
npm run build

# Verify build
ls -la dist/

# Test production build
npm run start
```

### Frontend Build

```bash
cd frontend

# Build React app
npm run build

# Verify build
ls -la dist/

# Test production build
npm run preview
```

### Full Production Build

```bash
# From project root
npm run build

# This builds both frontend and backend
# Outputs to respective dist/ directories
```

## 🚀 Deployment

### Development Deployment

```bash
# Using Docker
docker-compose up --build

# Using PM2
npm install -g pm2
pm2 start ecosystem.config.js
```

### Production Deployment

```bash
# Build production image
docker build -t promptvault:latest .

# Run production container
docker run -d \
  --name promptvault \
  -p 8080:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-production-secret \
  promptvault:latest
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use different ports
PORT=3001 npm run dev
```

#### Database Issues

```bash
# Reset database
rm backend/dev.db
npx prisma migrate dev

# Check database connection
npx prisma db pull
```

#### Dependency Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules

# Reinstall dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
```

#### TypeScript Issues

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Regenerate Prisma client
npx prisma generate

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Getting Help

1. **Check logs**: Look at console output for errors
2. **Search issues**: Check GitHub issues for similar problems
3. **Ask for help**: Create a new issue with details
4. **Community**: Join discussions for help

## 📚 Next Steps

After setting up development:

1. **[Architecture](architecture.md)**: Understand the system architecture
2. **[Contributing](contributing.md)**: Learn how to contribute
3. **[API Reference](api-reference.md)**: Explore the API
4. **[User Guide](user-interface.md)**: Learn the user interface

---

**Development setup complete?** Check out the [Architecture](architecture.md) guide to understand how PromptVault is built!
