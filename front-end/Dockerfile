# Multi-stage build: build the Vite React app, then serve with Nginx
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies
COPY front-end/package*.json ./
RUN npm ci --silent

# Copy source and build
COPY front-end/ ./
RUN npm run build

# Production image
FROM nginx:stable-alpine
COPY front-end/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
