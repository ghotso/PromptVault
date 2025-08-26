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


