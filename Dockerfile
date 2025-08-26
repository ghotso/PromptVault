# Multi-stage build for single-container app
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --ignore-scripts

# Copy source code
COPY backend ./backend
COPY frontend ./frontend
COPY scripts ./scripts

# Generate Prisma client
WORKDIR /app/backend
RUN npx prisma generate

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Build backend
WORKDIR /app/backend
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/backend/dist /app/backend/dist
COPY --from=builder /app/backend/node_modules /app/backend/node_modules
COPY --from=builder /app/backend/package.json /app/backend/package.json
COPY --from=builder /app/frontend/dist /app/frontend/dist
COPY --from=builder /app/scripts /app/scripts

WORKDIR /app/backend
ENV DATABASE_URL="file:./dev.db"
ENV PORT=8080
ENV CLIENT_ORIGIN=

EXPOSE 8080
CMD ["node", "dist/server.js"]


