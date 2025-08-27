# Build stage
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci
RUN cd backend && npm ci
RUN cd frontend && npm ci

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Build backend
RUN cd backend && npm run build

# Generate Prisma client
RUN cd backend && npx prisma generate

# Runtime stage
FROM node:20-alpine AS runtime

# Install runtime dependencies
RUN apk add --no-cache sqlite

# Use existing node user (already exists in node:20-alpine image)
# The node user already has UID 1000 and GID 1000 in the official image

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=node:node /app/backend/dist ./backend/dist
COPY --from=builder --chown=node:node /app/backend/node_modules ./backend/node_modules
COPY --from=builder --chown=node:node /app/backend/package*.json ./backend/
COPY --from=builder --chown=node:node /app/backend/prisma ./backend/prisma
COPY --from=builder --chown=node:node /app/frontend/dist ./frontend/dist

# Create data and logs directories with proper ownership
RUN mkdir -p /app/backend/data /app/backend/logs && \
    chown -R node:node /app/backend/data /app/backend/logs && \
    chmod 755 /app/backend/data /app/backend/logs

# Switch to node user
USER node

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=file:/app/backend/data/promptvault.db
ENV CLIENT_ORIGIN=http://localhost:3000
ENV TZ=UTC

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "backend/dist/server.js"]


