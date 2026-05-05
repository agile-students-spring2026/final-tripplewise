# Multi-stage build: install dependencies, then run backend
FROM node:22-alpine AS deps
WORKDIR /app
COPY back-end/package*.json ./
RUN npm ci --omit=dev --silent

# Production image
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy dependencies from build stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code — chown so the non-root node user can read the files
COPY --chown=node:node back-end/ ./

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Run as non-root user for security
USER node

# Start server
CMD ["node", "server.js"]
