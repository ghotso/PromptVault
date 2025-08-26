# Multi-stage build for single-container app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy all source code first
COPY . .

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm ci --ignore-scripts
RUN npm run build

# Install backend dependencies, generate Prisma client, and build
WORKDIR /app/backend
RUN npm ci --ignore-scripts
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install runtime dependencies
RUN apk add --no-cache sqlite

# Create necessary directories with proper permissions
RUN mkdir -p /app/backend/data /app/backend/logs && \
    chown -R node:node /app

# Switch to non-root user for security
USER node

# Copy built application
COPY --from=builder --chown=node:node /app/backend/dist /app/backend/dist
COPY --from=builder --chown=node:node /app/backend/node_modules /app/backend/node_modules
COPY --from=builder --chown=node:node /app/backend/package.json /app/backend/package.json
COPY --from=builder --chown=node:node /app/frontend/dist /app/frontend/dist
COPY --from=builder --chown=node:node /app/scripts /app/scripts
COPY --from=builder --chown=node:node /app/backend/prisma /app/backend/prisma

# Set working directory to backend and ensure data path is correct
WORKDIR /app/backend
ENV DATABASE_URL="file:/app/backend/data/promptvault.db"
ENV PORT=8080
ENV CLIENT_ORIGIN=

# Ensure the data directory exists and has correct permissions
RUN mkdir -p /app/backend/data && \
    chown -R node:node /app/backend/data

EXPOSE 8080
CMD ["node", "dist/server.js"]


