# Multi-stage build for Angular application
# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files only (not node_modules)
COPY package*.json ./

# Install dependencies inside container (fresh install)
RUN npm ci --include=dev

# Copy source code (excluding node_modules via .dockerignore)
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production server with Nginx
FROM nginx:alpine

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage (correct path)
COPY --from=builder /app/dist /usr/share/nginx/html

# Create logs directory
RUN mkdir -p /var/log/nginx

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/log/nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
