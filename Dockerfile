# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* tsconfig.json tsconfig.node.json vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src
RUN npm ci

# Build app
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Ensure non-root runtime user can access the files
RUN chown -R nginx:nginx /usr/share/nginx/html
USER nginx

# Install curl for health checks
USER root
RUN apk add --no-cache curl && chown -R nginx:nginx /usr/share/nginx/html
USER nginx

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
