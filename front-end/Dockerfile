# Multi-stage build: build the Vite React app, then serve with Nginx
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies
COPY front-end/package*.json ./
RUN npm ci

# Copy source and build
COPY front-end/ ./
RUN npm run build

# Production image — nginx serves the static build output
FROM nginx:stable-alpine

# Remove default nginx config and replace with ours
RUN rm /etc/nginx/conf.d/default.conf
COPY front-end/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
