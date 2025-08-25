# Multi-stage build for single-container app
FROM node:20-alpine AS builder
WORKDIR /app

# Install PNPM for faster monorepo-ish install (optional). Using npm to reduce deps.
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm i --ignore-scripts

COPY backend ./backend
COPY frontend ./frontend
COPY scripts ./scripts

# Build frontend
WORKDIR /app/frontend
RUN npm i --ignore-scripts && npm run build

# Build backend
WORKDIR /app/backend
RUN npm i --ignore-scripts && npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/frontend/dist /app/frontend/dist
COPY --from=builder /app/scripts /app/scripts

WORKDIR /app/backend
ENV DATABASE_URL="file:./dev.db"
ENV PORT=8080
ENV CLIENT_ORIGIN=

EXPOSE 8080
CMD ["node", "dist/server.js"]


