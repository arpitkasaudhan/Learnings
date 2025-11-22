# Lesson 10: Docker in Production

## Introduction

Running Docker in development is easy. Running Docker in production? That's a whole different game. This lesson teaches you how to run containers safely, securely, and efficiently in production environments.

Think of development like test-driving a car in a parking lot. Production is driving on a busy highway at high speed - you need proper safety measures, monitoring, and best practices.

## Production vs Development

### Key Differences

```
┌────────────────────────────────────────────────────┐
│      Development vs Production                     │
├────────────────────────────────────────────────────┤
│                                                    │
│  Development:                                      │
│  ├─ Hot reload for fast iteration                 │
│  ├─ Debug tools enabled                           │
│  ├─ Verbose logging                               │
│  ├─ No resource limits                            │
│  ├─ Source code mounted                           │
│  └─ Run as root (for convenience)                 │
│                                                    │
│  Production:                                       │
│  ├─ Optimized, production builds                  │
│  ├─ No debug tools                                │
│  ├─ Structured logging                            │
│  ├─ Resource limits enforced                      │
│  ├─ Code baked into image                         │
│  └─ Run as non-root user                          │
│                                                    │
└────────────────────────────────────────────────────┘
```

## Docker Security Best Practices

### 1. Run as Non-Root User

**Problem**: Root user in container = root on host (if container escapes)

```dockerfile
# ❌ Bad - Runs as root
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]

# ✅ Good - Runs as non-root
FROM node:18-alpine
WORKDIR /app

# Copy files first
COPY package*.json ./
RUN npm ci --only=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy app files and change ownership
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

EXPOSE 3000
CMD ["node", "server.js"]
```

### 2. Use Minimal Base Images

```dockerfile
# ❌ Bad - Large, many vulnerabilities
FROM ubuntu:latest
RUN apt-get update && apt-get install -y nodejs npm
# Size: 400MB+, 100+ vulnerabilities

# ✅ Good - Small, fewer vulnerabilities
FROM node:18-alpine
# Size: 110MB, 0-5 vulnerabilities

# ✅ Better - Distroless (Google)
FROM gcr.io/distroless/nodejs:18
# Size: 120MB, minimal vulnerabilities
# Only runtime, no shell, no package managers
```

### 3. Scan Images for Vulnerabilities

```bash
# Scan with Docker Scout
docker scout cves myapp:latest

# Scan with Trivy
trivy image myapp:latest

# Scan with Snyk
snyk container test myapp:latest

# In CI/CD
docker build -t myapp:latest .
trivy image --severity HIGH,CRITICAL --exit-code 1 myapp:latest
```

### 4. Use Read-Only Filesystem

```bash
# Run container with read-only root filesystem
docker run -d \
  --read-only \
  --tmpfs /tmp \
  --tmpfs /var/run \
  myapp:latest

# In docker-compose.yml
services:
  app:
    image: myapp:latest
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

### 5. Drop Unnecessary Capabilities

```bash
# Remove all capabilities, add only needed ones
docker run -d \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  myapp:latest

# In docker-compose.yml
services:
  app:
    image: myapp:latest
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

### 6. Use Secret Management

```bash
# ❌ Bad - Secrets in environment variables
docker run -e DATABASE_PASSWORD=secretpass myapp

# ❌ Bad - Secrets in Dockerfile
ENV DATABASE_PASSWORD=secretpass

# ✅ Good - Use Docker secrets
echo "secretpass" | docker secret create db_password -
docker service create \
  --secret db_password \
  --name myapp \
  myapp:latest

# ✅ Good - Use secret management service
# AWS Secrets Manager, HashiCorp Vault, etc.
```

## Health Checks

### Dockerfile HEALTHCHECK

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

USER node

# Health check
HEALTHCHECK --interval=30s \
            --timeout=3s \
            --start-period=5s \
            --retries=3 \
  CMD node healthcheck.js

CMD ["node", "server.js"]
```

**healthcheck.js**:
```javascript
const http = require('http');

const options = {
  host: 'localhost',
  port: 3000,
  path: '/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('ERROR:', err);
  process.exit(1);
});

request.end();
```

### Health Check Endpoint

```javascript
// server.js
const express = require('express');
const app = express();

let isReady = false;

// Health check (liveness)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Readiness check
app.get('/ready', (req, res) => {
  if (isReady) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

// Startup logic
async function startup() {
  // Connect to database, warm caches, etc.
  await connectToDatabase();
  isReady = true;
}

app.listen(3000, () => {
  console.log('Server started');
  startup();
});
```

## Resource Limits

### CPU and Memory Limits

```bash
# Docker run with limits
docker run -d \
  --name myapp \
  --memory="512m" \
  --memory-reservation="256m" \
  --cpus="1.0" \
  --cpu-shares=1024 \
  myapp:latest

# Docker Compose
services:
  app:
    image: myapp:latest
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Monitoring Resources

```bash
# View resource usage
docker stats

# Specific container
docker stats myapp

# Format output
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## Logging Strategies

### Logging Drivers

```bash
# JSON file (default)
docker run -d \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  myapp:latest

# Syslog
docker run -d \
  --log-driver syslog \
  --log-opt syslog-address=tcp://192.168.0.42:514 \
  myapp:latest

# Fluentd
docker run -d \
  --log-driver fluentd \
  --log-opt fluentd-address=localhost:24224 \
  --log-opt tag=myapp.logs \
  myapp:latest

# AWS CloudWatch
docker run -d \
  --log-driver awslogs \
  --log-opt awslogs-region=us-east-1 \
  --log-opt awslogs-group=myapp \
  --log-opt awslogs-stream=production \
  myapp:latest
```

### Structured Logging

```javascript
// Use structured logging library
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Log with context
logger.info('User logged in', {
  userId: '12345',
  email: 'user@example.com',
  timestamp: new Date().toISOString()
});

// Output:
// {"level":"info","message":"User logged in","service":"api","userId":"12345","email":"user@example.com","timestamp":"2024-01-01T12:00:00.000Z"}
```

## Container Orchestration Comparison

### Docker Swarm

**Simple orchestration built into Docker.**

```bash
# Initialize Swarm
docker swarm init

# Create service
docker service create \
  --name myapp \
  --replicas 3 \
  --publish 80:3000 \
  --update-parallelism 1 \
  --update-delay 10s \
  myapp:latest

# Scale service
docker service scale myapp=5

# Update service
docker service update --image myapp:v2 myapp

# View services
docker service ls
docker service ps myapp
```

**Pros**:
- Simple to set up
- Built into Docker
- Good for small deployments

**Cons**:
- Less features than Kubernetes
- Smaller community
- Limited ecosystem

### Kubernetes

**Production-grade orchestration.**

**Pros**:
- Mature, battle-tested
- Huge ecosystem
- Auto-scaling, self-healing
- Multi-cloud support

**Cons**:
- Complex to set up
- Steeper learning curve
- More overhead

### When to Use What

```
Docker Swarm:
├─ Small deployments (< 10 nodes)
├─ Simple requirements
├─ Team familiar with Docker
└─ Quick setup needed

Kubernetes:
├─ Large deployments (> 10 nodes)
├─ Complex requirements
├─ Need advanced features
└─ Long-term investment
```

## Container Registries

### Docker Hub

```bash
# Login
docker login

# Tag image
docker tag myapp:latest username/myapp:v1.0.0

# Push
docker push username/myapp:v1.0.0

# Pull
docker pull username/myapp:v1.0.0
```

### GitHub Container Registry (GHCR)

```bash
# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag
docker tag myapp:latest ghcr.io/username/myapp:v1.0.0

# Push
docker push ghcr.io/username/myapp:v1.0.0
```

### AWS ECR

```bash
# Login (get password from AWS CLI)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# Create repository
aws ecr create-repository --repository-name myapp

# Tag
docker tag myapp:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0

# Push
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0
```

### Private Registry

```bash
# Run registry
docker run -d -p 5000:5000 --name registry registry:2

# Tag
docker tag myapp:latest localhost:5000/myapp:v1.0.0

# Push
docker push localhost:5000/myapp:v1.0.0

# Pull
docker pull localhost:5000/myapp:v1.0.0
```

## Production Deployment Checklist

### Pre-Deployment

```
□ Images scanned for vulnerabilities
□ Health checks implemented
□ Resource limits set
□ Logging configured
□ Monitoring set up
□ Secrets managed securely
□ Backups configured
□ Rollback plan ready
□ Documentation updated
□ Team notified
```

### Dockerfile Production Checklist

```
□ Using minimal base image
□ Running as non-root user
□ Multi-stage build for smaller size
□ No secrets in image
□ HEALTHCHECK defined
□ Proper labels added
□ .dockerignore configured
□ Dependencies pinned
□ Security patches applied
□ Build reproducible
```

### Runtime Checklist

```
□ Resource limits set
□ Read-only filesystem where possible
□ Capabilities dropped
□ Health checks enabled
□ Logging driver configured
□ Restart policy set
□ Network isolation
□ Volume permissions correct
□ Auto-scaling configured
□ Monitoring active
```

## Monitoring Containers

### Basic Monitoring

```bash
# Container stats
docker stats

# Inspect container
docker inspect myapp

# View logs
docker logs -f myapp

# Top processes
docker top myapp

# Resource usage over time
docker stats --no-stream > stats.log
```

### Production Monitoring Stack

```yaml
version: '3.8'

services:
  # Application
  app:
    image: myapp:latest
    ports:
      - "3000:3000"
    networks:
      - monitoring

  # Prometheus (metrics collection)
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - monitoring

  # Grafana (visualization)
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - monitoring

  # cAdvisor (container metrics)
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
    networks:
      - monitoring

volumes:
  prometheus-data:
  grafana-data:

networks:
  monitoring:
```

## Backup and Disaster Recovery

### Backup Strategies

```bash
# Backup volumes
docker run --rm \
  -v myapp_data:/data \
  -v $(pwd):/backup \
  alpine \
  tar czf /backup/backup.tar.gz /data

# Restore volumes
docker run --rm \
  -v myapp_data:/data \
  -v $(pwd):/backup \
  alpine \
  tar xzf /backup/backup.tar.gz -C /

# Export container
docker export myapp > myapp.tar

# Import container
docker import myapp.tar myapp:backup

# Save image
docker save myapp:latest > myapp.tar

# Load image
docker load < myapp.tar
```

### Automated Backups

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup volume
docker run --rm \
  -v postgres_data:/data \
  -v $BACKUP_DIR:/backup \
  alpine \
  tar czf /backup/postgres_$DATE.tar.gz /data

# Cleanup old backups (keep 7 days)
find $BACKUP_DIR -name "postgres_*.tar.gz" -mtime +7 -delete

# Upload to S3
aws s3 cp $BACKUP_DIR/postgres_$DATE.tar.gz s3://mybucket/backups/
```

## Production Docker Compose Example

```yaml
version: '3.8'

services:
  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - backend
    secrets:
      - db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Redis
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    networks:
      - backend
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  # API
  api:
    image: myapp/api:${VERSION}
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - backend
      - frontend
    read_only: true
    tmpfs:
      - /tmp
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      rollback_config:
        parallelism: 1
        delay: 5s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Nginx
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - frontend
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 128M

volumes:
  postgres-data:
  redis-data:

networks:
  backend:
    internal: true
  frontend:

secrets:
  db_password:
    external: true
```

## Best Practices Summary

### Security

1. Run as non-root user
2. Use minimal base images
3. Scan for vulnerabilities
4. Use secrets management
5. Read-only filesystem
6. Drop unnecessary capabilities

### Performance

1. Set resource limits
2. Use multi-stage builds
3. Optimize image layers
4. Enable caching
5. Use appropriate restart policies

### Reliability

1. Implement health checks
2. Configure proper logging
3. Set up monitoring
4. Plan for backups
5. Test disaster recovery
6. Use orchestration for scaling

### Operations

1. Use infrastructure as code
2. Automate deployments
3. Version everything
4. Document processes
5. Monitor metrics
6. Set up alerts

## Summary

You've learned:
- Production vs development differences
- Docker security best practices
- Health checks and resource limits
- Logging strategies
- Container orchestration (Swarm vs Kubernetes)
- Container registries
- Production deployment checklist
- Monitoring and backups
- Complete production Docker Compose example

**Key Takeaway**: Running Docker in production requires security hardening, proper monitoring, resource management, and robust operational practices.

## Next Steps

In the next lesson, **Infrastructure as Code**, we'll learn about Terraform and Ansible to manage infrastructure programmatically.

---

**Challenge**:
Prepare a production-ready Docker setup:
1. Create production Dockerfile with all security best practices
2. Implement health checks
3. Set resource limits
4. Configure structured logging
5. Set up monitoring with Prometheus and Grafana
6. Create backup automation
7. Document rollback procedures
8. Test disaster recovery
