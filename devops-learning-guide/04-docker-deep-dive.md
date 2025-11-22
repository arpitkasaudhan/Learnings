# Lesson 4: Docker Deep Dive

## Introduction

Now that you understand Docker basics, it's time to dive deeper. In this lesson, you'll learn how to write production-ready Dockerfiles, optimize images, understand networking and volumes, and build real-world applications.

Think of the previous lesson as learning to drive, and this one as learning to drive efficiently, safely, and professionally.

## Dockerfile in Detail

A Dockerfile is a recipe for building a Docker image. Let's understand every instruction.

### Complete Dockerfile Example

```dockerfile
# 1. Base Image
FROM node:18-alpine AS base

# 2. Metadata
LABEL maintainer="devops@example.com"
LABEL version="1.0"
LABEL description="Production Node.js API"

# 3. Arguments (available during build)
ARG NODE_ENV=production
ARG APP_PORT=3000

# 4. Environment Variables (available in container)
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${APP_PORT}
ENV APP_HOME=/usr/src/app

# 5. Working Directory
WORKDIR ${APP_HOME}

# 6. Install system dependencies
RUN apk add --no-cache \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# 7. Copy dependency files first (for caching)
COPY package*.json ./

# 8. Install application dependencies
RUN npm ci --only=production \
    && npm cache clean --force

# 9. Copy application code
COPY . .

# 10. Create non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001 \
    && chown -R nodejs:nodejs ${APP_HOME}

# 11. Switch to non-root user
USER nodejs

# 12. Expose port (documentation only)
EXPOSE ${PORT}

# 13. Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# 14. Volume (for persistent data)
VOLUME ["/usr/src/app/logs"]

# 15. Default command
CMD ["node", "server.js"]
```

### Dockerfile Instructions Explained

#### FROM - Base Image

```dockerfile
# Official image (recommended)
FROM node:18-alpine

# Specific version (best for production)
FROM node:18.16.0-alpine3.17

# Multi-stage build base
FROM node:18-alpine AS builder

# Minimal base image
FROM scratch
```

**Best Practices**:
- Use official images
- Use specific versions (not `latest`)
- Prefer Alpine Linux (smaller size)
- Use multi-stage builds

#### RUN - Execute Commands

```dockerfile
# Install packages (each RUN creates a layer)
RUN apt-get update && apt-get install -y curl

# Multiple commands in one RUN (better - fewer layers)
RUN apt-get update \
    && apt-get install -y \
        curl \
        vim \
        git \
    && rm -rf /var/lib/apt/lists/*

# Use pipe and fail fast
RUN set -ex \
    && apk add --no-cache python3 \
    && python3 --version
```

**Best Practices**:
- Combine commands with `&&`
- Clean up in same layer
- Use `\` for readability
- Remove cache files

#### COPY vs ADD

```dockerfile
# COPY - Simple file copy (recommended)
COPY package.json /app/
COPY src/ /app/src/
COPY . /app/

# ADD - Has extra features (auto-extract tar, download URLs)
ADD https://example.com/file.tar.gz /app/
ADD archive.tar.gz /app/  # Auto-extracts

# Use COPY unless you need ADD features
```

**Best Practice**: Use `COPY` unless you specifically need `ADD` features.

#### CMD vs ENTRYPOINT

This is confusing for beginners! Let's clarify:

```dockerfile
# CMD - Can be overridden
CMD ["node", "server.js"]
# docker run myapp              -> runs: node server.js
# docker run myapp npm test     -> runs: npm test (CMD overridden)

# ENTRYPOINT - Always runs, args appended
ENTRYPOINT ["node"]
CMD ["server.js"]
# docker run myapp              -> runs: node server.js
# docker run myapp app.js       -> runs: node app.js

# Exec form (recommended) - doesn't invoke shell
CMD ["node", "server.js"]

# Shell form - invokes /bin/sh -c
CMD node server.js
```

**Common Patterns**:

```dockerfile
# Pattern 1: Simple application
CMD ["node", "server.js"]

# Pattern 2: Script that needs arguments
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["start"]

# Pattern 3: Flexible with defaults
ENTRYPOINT ["python"]
CMD ["app.py"]
```

#### WORKDIR - Set Working Directory

```dockerfile
# Bad - relative paths, hard to track
RUN cd /app
COPY . .

# Good - clear working directory
WORKDIR /usr/src/app
COPY . .
RUN npm install

# Multiple WORKDIR
WORKDIR /app
WORKDIR backend  # Now at /app/backend
WORKDIR ../frontend  # Now at /app/frontend
```

#### ENV - Environment Variables

```dockerfile
# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=postgres://localhost:5432/mydb

# Multiple variables
ENV NODE_ENV=production \
    PORT=3000 \
    LOG_LEVEL=info

# Use ARG for build-time variables
ARG VERSION=1.0
ENV APP_VERSION=${VERSION}
```

#### EXPOSE - Document Ports

```dockerfile
# Document which ports the container listens on
EXPOSE 3000
EXPOSE 8080/tcp
EXPOSE 8080/udp

# Note: EXPOSE doesn't actually publish ports!
# Use -p flag when running: docker run -p 3000:3000 myapp
```

#### USER - Set User

```dockerfile
# Run as root (default, not recommended)
USER root

# Create and use non-root user (recommended)
RUN useradd -m -u 1001 appuser
USER appuser

# Alpine Linux
RUN addgroup -g 1001 appgroup \
    && adduser -D -u 1001 -G appgroup appuser
USER appuser
```

#### VOLUME - Define Mount Points

```dockerfile
# Define volumes for persistent data
VOLUME /var/lib/mysql
VOLUME ["/data", "/logs"]

# Can be overridden at runtime:
# docker run -v /host/data:/data myapp
```

#### ARG - Build Arguments

```dockerfile
# Define build arguments
ARG NODE_VERSION=18
ARG BUILD_DATE

# Use in FROM
FROM node:${NODE_VERSION}-alpine

# Use in RUN
RUN echo "Built on ${BUILD_DATE}"

# Build with arguments:
# docker build --build-arg NODE_VERSION=16 --build-arg BUILD_DATE=$(date) .
```

## Multi-Stage Builds

Multi-stage builds reduce image size by separating build and runtime environments.

### Simple Multi-Stage Build

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**Before**: 1.2GB (includes build tools, source code, etc.)
**After**: 150MB (only runtime and compiled code)

### React Application Multi-Stage Build

```dockerfile
# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### Go Application Multi-Stage Build

```dockerfile
# Stage 1: Build
FROM golang:1.20-alpine AS builder

WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Stage 2: Run
FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .

EXPOSE 8080
CMD ["./main"]
```

**Result**: Final image is only ~10MB!

## Docker Networking

Docker provides several networking options.

### Network Types

```
┌──────────────────────────────────────────────┐
│         Docker Network Types                 │
├──────────────────────────────────────────────┤
│                                              │
│  1. Bridge (default)                         │
│     - Isolated network for containers        │
│     - Containers can communicate             │
│     - Port mapping required for host access  │
│                                              │
│  2. Host                                     │
│     - Container uses host network directly   │
│     - No isolation, better performance       │
│     - No port mapping needed                 │
│                                              │
│  3. None                                     │
│     - No network access                      │
│     - Complete isolation                     │
│                                              │
│  4. Custom Bridge                            │
│     - User-defined bridge networks           │
│     - Better isolation and DNS               │
│     - Recommended for multi-container apps   │
│                                              │
└──────────────────────────────────────────────┘
```

### Network Commands

```bash
# List networks
docker network ls

# Create custom network
docker network create my-network

# Create network with specific driver
docker network create --driver bridge my-bridge

# Create network with subnet
docker network create --subnet=172.18.0.0/16 my-network

# Inspect network
docker network inspect my-network

# Connect container to network
docker network connect my-network my-container

# Disconnect container from network
docker network disconnect my-network my-container

# Remove network
docker network rm my-network

# Remove all unused networks
docker network prune
```

### Practical Example: Multi-Container App

```bash
# Create custom network
docker network create app-network

# Run database
docker run -d \
  --name postgres \
  --network app-network \
  -e POSTGRES_PASSWORD=secret \
  postgres:15

# Run API (can access postgres by name)
docker run -d \
  --name api \
  --network app-network \
  -p 3000:3000 \
  -e DATABASE_URL=postgres://postgres:secret@postgres:5432/mydb \
  my-api-image

# Run frontend (can access api by name)
docker run -d \
  --name frontend \
  --network app-network \
  -p 8080:80 \
  my-frontend-image
```

### DNS Resolution

Containers on the same network can reach each other by name:

```javascript
// In your Node.js API container
const dbUrl = 'postgres://postgres:secret@postgres:5432/mydb';
// 'postgres' resolves to the postgres container IP
```

## Docker Volumes

Volumes are used for persistent data that survives container restarts.

### Volume Types

```
┌──────────────────────────────────────────────┐
│           Docker Volume Types                │
├──────────────────────────────────────────────┤
│                                              │
│  1. Named Volumes (recommended)              │
│     - Managed by Docker                      │
│     - Persistent, easy to backup             │
│     - docker volume create mydata            │
│                                              │
│  2. Bind Mounts                              │
│     - Mount host directory                   │
│     - Good for development                   │
│     - -v /host/path:/container/path          │
│                                              │
│  3. tmpfs Mounts                             │
│     - Stored in memory                       │
│     - Temporary, fast                        │
│     - Lost when container stops              │
│                                              │
└──────────────────────────────────────────────┘
```

### Volume Commands

```bash
# Create volume
docker volume create my-data

# List volumes
docker volume ls

# Inspect volume
docker volume inspect my-data

# Remove volume
docker volume rm my-data

# Remove all unused volumes
docker volume prune

# Remove all volumes (DANGEROUS!)
docker volume rm $(docker volume ls -q)
```

### Using Volumes

```bash
# Named volume
docker run -d \
  --name db \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15

# Bind mount (development)
docker run -d \
  --name dev-app \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/package.json:/app/package.json \
  my-app

# Read-only bind mount
docker run -d \
  --name app \
  -v $(pwd)/config:/app/config:ro \
  my-app

# tmpfs mount (in-memory, temporary)
docker run -d \
  --name app \
  --tmpfs /tmp \
  my-app
```

### Volume Example: PostgreSQL with Persistence

```bash
# Create volume
docker volume create postgres-data

# Run PostgreSQL
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15

# Connect and create data
docker exec -it postgres psql -U postgres -d myapp
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);
INSERT INTO users (name) VALUES ('Alice'), ('Bob');
SELECT * FROM users;
\q

# Stop and remove container
docker stop postgres
docker rm postgres

# Run new container with same volume
docker run -d \
  --name postgres-new \
  -e POSTGRES_PASSWORD=secret \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15

# Data persists!
docker exec -it postgres-new psql -U postgres -d myapp -c "SELECT * FROM users;"
```

## Environment Variables

### Passing Environment Variables

```bash
# Single variable
docker run -e NODE_ENV=production my-app

# Multiple variables
docker run \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DATABASE_URL=postgres://localhost/db \
  my-app

# From file
docker run --env-file .env my-app

# From host environment
export DB_PASSWORD=secret
docker run -e DB_PASSWORD my-app
```

### .env File Example

```bash
# .env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://postgres:secret@db:5432/myapp
REDIS_URL=redis://redis:6379
LOG_LEVEL=info
```

```bash
# Run with env file
docker run --env-file .env my-app
```

### Using in Dockerfile

```dockerfile
# Set defaults
ENV NODE_ENV=development
ENV PORT=3000

# Can be overridden at runtime:
# docker run -e NODE_ENV=production my-app
```

## Docker Build Cache

Understanding the build cache is key to fast builds.

### How Cache Works

```dockerfile
# ❌ Bad - Cache busted on every code change
FROM node:18-alpine
WORKDIR /app
COPY . .                    # Copies everything, including node_modules
RUN npm install             # Runs every time code changes
CMD ["node", "server.js"]

# ✅ Good - Efficient caching
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./       # Only dependency files
RUN npm install             # Cached unless dependencies change
COPY . .                    # Code changes don't bust npm install cache
CMD ["node", "server.js"]
```

**Build time**:
- Bad: 3 minutes every time
- Good: 3 minutes first time, 10 seconds after

### Cache Busting

```bash
# Force rebuild without cache
docker build --no-cache -t my-app .

# Use build argument to bust cache at specific layer
docker build --build-arg CACHEBUST=$(date +%s) -t my-app .
```

## Image Optimization Techniques

### 1. Use Smaller Base Images

```dockerfile
# ❌ Large (800MB+)
FROM node:18

# ✅ Better (200MB)
FROM node:18-slim

# ✅ Best (100MB)
FROM node:18-alpine
```

### 2. Multi-Stage Builds

```dockerfile
# Build stage includes everything
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - only what's needed
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
CMD ["node", "dist/server.js"]
```

### 3. Minimize Layers

```dockerfile
# ❌ Too many layers (9 layers)
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y vim
RUN apt-get install -y git
RUN rm -rf /var/lib/apt/lists/*

# ✅ Combined layers (1 layer)
RUN apt-get update \
    && apt-get install -y \
        curl \
        vim \
        git \
    && rm -rf /var/lib/apt/lists/*
```

### 4. Use .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
.DS_Store
dist
build
coverage
*.md
.vscode
.idea
```

### 5. Remove Unnecessary Files

```dockerfile
# Install dependencies and clean up in same layer
RUN apt-get update \
    && apt-get install -y build-essential \
    && npm install \
    && apt-get purge -y build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/* \
    && npm cache clean --force
```

### 6. Optimize Node.js Images

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production \
    && npm cache clean --force

# Copy source
COPY . .

# Run as non-root
USER node

CMD ["node", "server.js"]
```

## Real-World Examples

### Example 1: Express.js API

**Project Structure**:
```
express-api/
├── src/
│   ├── routes/
│   ├── controllers/
│   └── server.js
├── package.json
├── Dockerfile
└── .dockerignore
```

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source
COPY src/ ./src/

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/src/app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "src/server.js"]
```

**.dockerignore**:
```
node_modules
npm-debug.log
.git
.env
.DS_Store
```

**Build and Run**:
```bash
docker build -t express-api .
docker run -d -p 3000:3000 --name api express-api
curl http://localhost:3000
```

### Example 2: React Application

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Example 3: Full-Stack Application

**docker-compose.yml** (preview for next lesson):
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:secret@postgres:5432/myapp
      NODE_ENV: production
    depends_on:
      - postgres
    networks:
      - app-network

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - app-network

volumes:
  postgres-data:

networks:
  app-network:
```

## Best Practices Summary

### Dockerfile Best Practices

1. **Use official base images**
2. **Pin versions** (not `latest`)
3. **Use multi-stage builds**
4. **Minimize layers**
5. **Order instructions** (least to most likely to change)
6. **Use .dockerignore**
7. **Run as non-root user**
8. **One process per container**
9. **Use HEALTHCHECK**
10. **Don't store secrets in images**

### Security Best Practices

1. **Scan images for vulnerabilities**
   ```bash
   docker scan my-image
   ```

2. **Use minimal base images**
   ```dockerfile
   FROM alpine:latest
   # or
   FROM scratch
   ```

3. **Don't run as root**
   ```dockerfile
   USER nodejs
   ```

4. **Use read-only filesystems**
   ```bash
   docker run --read-only my-app
   ```

5. **Limit resources**
   ```bash
   docker run --memory="512m" --cpus="1.0" my-app
   ```

## Troubleshooting

### Build Fails

```bash
# Build with more output
docker build --progress=plain -t my-app .

# Build without cache
docker build --no-cache -t my-app .

# Check specific layer
docker build --target build -t debug-layer .
docker run -it debug-layer /bin/sh
```

### Image Too Large

```bash
# Check image layers
docker history my-image

# Analyze what takes space
docker run --rm -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  wagoodman/dive my-image
```

### Networking Issues

```bash
# Check container network
docker inspect my-container | grep -A 20 NetworkSettings

# Test connectivity between containers
docker exec my-container ping other-container

# Check DNS resolution
docker exec my-container nslookup other-container
```

## Summary

You've learned:
- Advanced Dockerfile instructions
- Multi-stage builds for optimization
- Docker networking (bridge, host, custom)
- Docker volumes for persistence
- Environment variables management
- Build cache optimization
- Image optimization techniques
- Real-world application examples

**Key Takeaway**: Write efficient, secure, production-ready Dockerfiles using multi-stage builds, proper caching, and security best practices.

## Next Steps

In the next lesson, **Docker Compose**, we'll learn how to manage multi-container applications easily, defining entire application stacks in a single file.

---

**Challenge**:
Take one of your existing applications and:
1. Create a production-ready Dockerfile with multi-stage build
2. Optimize it to be under 100MB (if possible)
3. Add health checks
4. Run as non-root user
5. Document the build and run process
