# Architecture

This document provides a comprehensive overview of PromptVault's architecture, including system design, technology stack, data flow, and key architectural decisions.

## 🏗️ System Overview

PromptVault is built as a modern web application with a clear separation between frontend and backend, designed for scalability, maintainability, and ease of deployment.

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (SQLite)      │
│   Port: 5173    │    │   Port: 3000    │    │   File-based    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   API Routes    │    │   FTS5 Search   │
│   (Vite)        │    │   (REST)        │    │   (Full-text)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎨 Frontend Architecture

### Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing for SPA experience
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible UI components

### Component Architecture

```
src/
├── components/           # Reusable UI components
│   ├── CustomIcon.tsx   # Custom icon component
│   ├── Modal.tsx        # Modal dialog component
│   ├── Nav.tsx          # Navigation component
│   ├── ThemeToggle.tsx  # Theme switching component
│   └── icons/           # Icon components
├── lib/                 # Utilities and services
│   ├── api.ts          # API client
│   ├── auth.tsx        # Authentication context
│   ├── design-tokens.ts # Design system tokens
│   └── theme.tsx       # Theme management
├── pages/               # Page components
│   ├── About.tsx       # About page
│   ├── Account.tsx     # Account management
│   ├── Admin.tsx       # Admin panel
│   ├── Login.tsx       # Authentication
│   ├── Prompts.tsx     # Prompt management
│   └── ...
└── App.tsx             # Main application component
```

### State Management

#### Authentication State
- **Context API**: Global authentication state
- **JWT Tokens**: Stored in HTTP-only cookies
- **User Information**: Cached in React context
- **Auto-refresh**: Automatic token refresh on API calls

#### Local State
- **useState**: Component-level state
- **useEffect**: Side effects and lifecycle management
- **Custom Hooks**: Reusable stateful logic
- **Form State**: Controlled components with validation

#### Data Fetching
- **Fetch API**: Native browser API
- **Custom API Client**: Centralized API communication
- **Error Handling**: Consistent error handling across components
- **Loading States**: User feedback during data operations

### Design System

#### Design Tokens
```typescript
export const designTokens = {
  colors: {
    light: { /* Light theme colors */ },
    dark: { /* Dark theme colors */ }
  },
  spacing: { /* Spacing scale */ },
  typography: { /* Font families and sizes */ },
  shadows: { /* Shadow definitions */ }
}
```

#### Theme System
- **CSS Variables**: Dynamic theming with CSS custom properties
- **Theme Context**: React context for theme management
- **System Preference**: Automatic dark/light mode detection
- **Persistence**: Theme preference stored in localStorage

## 🔧 Backend Architecture

### Technology Stack

- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Fast, unopinionated web framework
- **TypeScript**: Type-safe server-side development
- **Prisma ORM**: Modern database toolkit and query builder
- **SQLite**: Lightweight, file-based database
- **JWT**: JSON Web Tokens for authentication

### Project Structure

```
backend/
├── src/
│   ├── lib/              # Core utilities
│   │   ├── db.ts        # Database utilities
│   │   ├── env.ts       # Environment configuration
│   │   └── prisma.ts    # Prisma client
│   ├── middleware/       # Express middleware
│   │   └── auth.ts      # Authentication middleware
│   ├── routes/          # API route handlers
│   │   ├── admin.ts     # Admin endpoints
│   │   ├── auth.ts      # Authentication endpoints
│   │   ├── prompts.ts   # Prompt management
│   │   ├── search.ts    # Search functionality
│   │   └── ...
│   └── server.ts        # Main server file
├── prisma/              # Database schema
│   ├── schema.prisma   # Prisma schema
│   └── migrations/     # Database migrations
└── dist/               # Compiled JavaScript
```

### API Architecture

#### RESTful Design
- **Resource-based URLs**: `/api/prompts`, `/api/users`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: Appropriate HTTP status codes
- **JSON Responses**: Consistent JSON response format

#### Route Organization
```typescript
// Authentication routes
app.use('/api/auth', authRoutes);

// Resource routes
app.use('/api/prompts', promptsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tags', tagsRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);
```

#### Middleware Stack
```typescript
// Global middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Route-specific middleware
app.use('/api/admin', requireAuth, requireAdmin);
app.use('/api/prompts', requireAuth);
```

### Authentication System

#### JWT Implementation
- **Token Generation**: Signed JWT tokens with user information
- **Cookie Storage**: HTTP-only cookies for security
- **Token Validation**: Middleware validates tokens on protected routes
- **Role-based Access**: Admin and User roles with different permissions

#### Security Features
- **Password Hashing**: bcrypt for password security
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Zod schemas for request validation
- **SQL Injection Prevention**: Prisma ORM prevents SQL injection

### Database Architecture

#### Prisma Schema
```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  name      String?
  team      String?
  role      Role       @default(USER)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  prompts   Prompt[]
  ratings   Rating[]
  UserTeam  UserTeam[]
}

model Prompt {
  id               String          @id @default(cuid())
  title            String
  body             String
  variables        String?
  notes            String?
  modelHints       String?
  visibility       Visibility      @default(PRIVATE)
  userId           String
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  isPubliclyShared Boolean         @default(false)
  publicShareId    String?         @unique
  user             User            @relation(fields: [userId], references: [id])
  tags             PromptTag[]
  versions         PromptVersion[]
  ratings          Rating[]
}
```

#### Database Features
- **ACID Compliance**: SQLite provides ACID transactions
- **Full-Text Search**: FTS5 for advanced search capabilities
- **Migrations**: Prisma handles database schema changes
- **Relationships**: Proper foreign key relationships
- **Indexing**: Optimized queries with proper indexing

## 🔄 Data Flow

### Request Flow

```
1. User Action (Frontend)
   ↓
2. API Call (React Component)
   ↓
3. HTTP Request (Fetch API)
   ↓
4. Express Router (Backend)
   ↓
5. Middleware (Authentication, Validation)
   ↓
6. Route Handler (Business Logic)
   ↓
7. Database Query (Prisma ORM)
   ↓
8. Response (JSON)
   ↓
9. State Update (React)
   ↓
10. UI Update (Component Re-render)
```

### Authentication Flow

```
1. Login Request
   ↓
2. Credential Validation
   ↓
3. Password Verification (bcrypt)
   ↓
4. JWT Token Generation
   ↓
5. Cookie Setting (HTTP-only)
   ↓
6. User Data Response
   ↓
7. Frontend State Update
   ↓
8. Protected Route Access
```

### Search Flow

```
1. Search Query (Frontend)
   ↓
2. API Request (/api/search)
   ↓
3. FTS5 Query (SQLite)
   ↓
4. Result Processing
   ↓
5. JSON Response
   ↓
6. Search Results Display
```

## 🚀 Deployment Architecture

### Docker Configuration

#### Multi-stage Build
```dockerfile
# Build stage
FROM node:20-alpine AS builder
# Install dependencies and build

# Runtime stage
FROM node:20-alpine AS runtime
# Copy built application and start
```

#### Container Features
- **Alpine Linux**: Minimal base image for security
- **Non-root User**: Runs as node user for security
- **Health Checks**: Built-in health monitoring
- **Volume Mounting**: Persistent data storage

### Production Considerations

#### Scalability
- **Stateless Design**: No server-side session storage
- **Database Scaling**: Ready for PostgreSQL migration
- **Horizontal Scaling**: Multiple container instances
- **Load Balancing**: Reverse proxy configuration

#### Security
- **HTTPS**: SSL/TLS encryption
- **CORS**: Controlled cross-origin requests
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: Protection against abuse

#### Monitoring
- **Health Endpoints**: `/health` for monitoring
- **Logging**: Structured logging for debugging
- **Metrics**: Performance and usage metrics
- **Error Tracking**: Centralized error reporting

## 🔧 Key Architectural Decisions

### Technology Choices

#### Frontend: React + TypeScript
- **Reasoning**: Modern, type-safe, large ecosystem
- **Benefits**: Developer experience, maintainability
- **Trade-offs**: Learning curve, bundle size

#### Backend: Node.js + Express
- **Reasoning**: JavaScript ecosystem, fast development
- **Benefits**: Code sharing, rapid prototyping
- **Trade-offs**: Single-threaded, memory usage

#### Database: SQLite + Prisma
- **Reasoning**: Simple deployment, type safety
- **Benefits**: Zero configuration, excellent DX
- **Trade-offs**: Limited concurrency, file-based

#### Styling: Tailwind CSS
- **Reasoning**: Utility-first, consistent design
- **Benefits**: Rapid development, maintainable styles
- **Trade-offs**: Learning curve, bundle size

### Design Patterns

#### Component Composition
- **Pattern**: Composition over inheritance
- **Implementation**: React components with props
- **Benefits**: Reusability, testability

#### Context API
- **Pattern**: Global state management
- **Implementation**: React Context for auth state
- **Benefits**: Simple, built-in solution

#### Repository Pattern
- **Pattern**: Data access abstraction
- **Implementation**: Prisma ORM
- **Benefits**: Database agnostic, testable

#### Middleware Pattern
- **Pattern**: Cross-cutting concerns
- **Implementation**: Express middleware
- **Benefits**: Separation of concerns, reusability

### Performance Optimizations

#### Frontend
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Vite's built-in optimizations
- **Image Optimization**: Optimized static assets
- **Caching**: Browser caching strategies

#### Backend
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Response Compression**: Gzip compression
- **Caching Headers**: Appropriate cache headers

#### Database
- **FTS5**: Full-text search optimization
- **Indexes**: Proper database indexing
- **Query Optimization**: Efficient Prisma queries
- **Connection Management**: Proper connection handling

## 🔮 Future Architecture Considerations

### Scalability Improvements

#### Database Migration
- **Current**: SQLite (file-based)
- **Future**: PostgreSQL (client-server)
- **Benefits**: Better concurrency, replication
- **Migration**: Prisma makes this straightforward

#### Caching Layer
- **Redis**: In-memory caching
- **Benefits**: Faster response times
- **Use Cases**: Session storage, API caching

#### Microservices
- **Current**: Monolithic application
- **Future**: Service-oriented architecture
- **Benefits**: Independent scaling, technology diversity
- **Trade-offs**: Complexity, network overhead

### Technology Upgrades

#### Frontend
- **React 19**: Latest React features
- **Server Components**: Improved performance
- **Suspense**: Better loading states

#### Backend
- **Node.js 20+**: Latest Node.js features
- **Fastify**: Alternative to Express
- **GraphQL**: Alternative to REST

#### Database
- **PostgreSQL**: Production database
- **Redis**: Caching layer
- **Elasticsearch**: Advanced search

### Monitoring and Observability

#### Logging
- **Structured Logging**: JSON format
- **Log Aggregation**: Centralized logging
- **Log Analysis**: Search and analytics

#### Metrics
- **Application Metrics**: Custom metrics
- **System Metrics**: CPU, memory, disk
- **Business Metrics**: User activity, usage patterns

#### Tracing
- **Distributed Tracing**: Request flow tracking
- **Performance Monitoring**: Response time analysis
- **Error Tracking**: Centralized error reporting

---

**Want to contribute?** Check out the [Contributing](contributing.md) guide to learn how to contribute to PromptVault's development!
