# Multi-stage build: install dependencies, then run backend
FROM node:22-alpine AS deps
WORKDIR /app
COPY back-end/package*.json ./
RUN npm ci --silent

# Production image
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy dependencies from build stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY back-end/ ./

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run as non-root user
USER node

# Start server
CMD ["node", "server.js"]
