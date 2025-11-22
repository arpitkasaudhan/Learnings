# Lesson 5: Docker Compose

## What is Docker Compose?

Imagine you're hosting a dinner party. You could prepare each dish separately, one at a time - or you could plan the entire menu, prep everything, and coordinate so it all comes together perfectly. Docker Compose is like that meal plan for your multi-container applications.

### Simple Explanation

**Docker Compose** is a tool for defining and running multi-container Docker applications. Instead of running multiple `docker run` commands with lots of flags, you define everything in a single `docker-compose.yml` file.

### The Problem Docker Compose Solves

**Without Docker Compose**:
```bash
# Create network
docker network create my-app-network

# Run database
docker run -d \
  --name postgres \
  --network my-app-network \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15

# Run Redis
docker run -d \
  --name redis \
  --network my-app-network \
  redis:alpine

# Run API
docker run -d \
  --name api \
  --network my-app-network \
  -p 3000:3000 \
  -e DATABASE_URL=postgres://postgres:secret@postgres:5432/myapp \
  -e REDIS_URL=redis://redis:6379 \
  --depends-on postgres \
  --depends-on redis \
  my-api

# Run frontend
docker run -d \
  --name frontend \
  --network my-app-network \
  -p 80:80 \
  my-frontend
```

**With Docker Compose**:
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:alpine

  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:secret@postgres:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "80:80"

volumes:
  postgres-data:
```

```bash
# Start everything
docker compose up

# Stop everything
docker compose down
```

Much simpler!

## Docker Compose File Structure

### Basic Syntax

```yaml
version: '3.8'  # Compose file version

services:        # Container definitions
  service-name:
    image: ...   # or build: ...
    ports: ...
    environment: ...
    volumes: ...
    networks: ...
    depends_on: ...

volumes:         # Named volumes
  volume-name:

networks:        # Custom networks
  network-name:
```

### Version

```yaml
# Use version 3.8 (recommended)
version: '3.8'

# Version history:
# 3.8 - Latest stable (most features)
# 3.7 - Previous version
# 2.x - Legacy (don't use for new projects)
```

### Services

Services are the containers in your application.

```yaml
services:
  # Service using pre-built image
  database:
    image: postgres:15

  # Service built from Dockerfile
  api:
    build: ./api

  # Service built with options
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        NODE_ENV: production
```

## Complete docker-compose.yml Examples

### Example 1: Simple Web App with Database

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: myapp-db
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myuser"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Node.js API
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: myapp-api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgres://myuser:mypassword@db:5432/myapp
      PORT: 3000
    volumes:
      - ./api:/app
      - /app/node_modules
    depends_on:
      db:
        condition: service_healthy
    command: npm run dev

volumes:
  postgres-data:
```

### Example 2: MERN Stack (MongoDB, Express, React, Node)

```yaml
version: '3.8'

services:
  # MongoDB
  mongodb:
    image: mongo:6
    container_name: mern-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb-data:/data/db
    ports:
      - "27017:27017"
    networks:
      - mern-network

  # Express Backend
  backend:
    build: ./backend
    container_name: mern-backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://admin:password@mongodb:27017/mernapp?authSource=admin
      JWT_SECRET: your-secret-key
      PORT: 5000
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - mongodb
    networks:
      - mern-network
    command: npm run dev

  # React Frontend
  frontend:
    build: ./frontend
    container_name: mern-frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:5000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - mern-network
    stdin_open: true
    tty: true

volumes:
  mongodb-data:

networks:
  mern-network:
    driver: bridge
```

### Example 3: Full Production Stack

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: prod-postgres
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - backend-network
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: prod-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    networks:
      - backend-network
    restart: unless-stopped

  # Node.js API
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.prod
    container_name: prod-api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3000
    depends_on:
      - postgres
      - redis
    networks:
      - backend-network
      - frontend-network
    restart: unless-stopped

  # React Frontend with Nginx
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: prod-frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api
    networks:
      - frontend-network
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:

networks:
  backend-network:
    driver: bridge
  frontend-network:
    driver: bridge
```

**.env file**:
```bash
# Database
DB_USER=myuser
DB_PASSWORD=secretpassword
DB_NAME=myapp

# Redis
REDIS_PASSWORD=redissecret

# API
JWT_SECRET=jwtsecretkey
```

## Docker Compose Commands

### Basic Commands

```bash
# Start all services (detached)
docker compose up -d

# Start and rebuild images
docker compose up --build

# Start specific service
docker compose up -d api

# View logs
docker compose logs

# Follow logs
docker compose logs -f

# Logs for specific service
docker compose logs -f api

# Stop all services
docker compose stop

# Stop specific service
docker compose stop api

# Start stopped services
docker compose start

# Restart services
docker compose restart

# Stop and remove containers, networks
docker compose down

# Stop and remove containers, networks, volumes
docker compose down -v

# Stop and remove containers, networks, images
docker compose down --rmi all
```

### Managing Services

```bash
# List running services
docker compose ps

# List all containers (including stopped)
docker compose ps -a

# Execute command in service
docker compose exec api npm test

# Execute as specific user
docker compose exec -u root api bash

# Run one-off command
docker compose run api npm install

# Scale service to multiple instances
docker compose up -d --scale api=3

# View service logs
docker compose logs api

# Build or rebuild services
docker compose build

# Build without cache
docker compose build --no-cache

# Pull latest images
docker compose pull

# Push images to registry
docker compose push
```

### Advanced Commands

```bash
# Validate compose file
docker compose config

# Show compose file with variables resolved
docker compose config --no-interpolate

# Pause services
docker compose pause

# Unpause services
docker compose unpause

# View container processes
docker compose top

# Display resource usage
docker compose stats

# Remove stopped containers
docker compose rm

# Force remove
docker compose rm -f
```

## Advanced Features

### Environment Variables

**Using .env file**:
```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    image: myapi
    environment:
      DATABASE_URL: ${DATABASE_URL}
      API_KEY: ${API_KEY}
      NODE_ENV: ${NODE_ENV:-development}  # Default value
```

**.env**:
```bash
DATABASE_URL=postgres://user:pass@db:5432/mydb
API_KEY=secret-api-key
NODE_ENV=production
```

**Multiple environment files**:
```bash
# Use specific env file
docker compose --env-file .env.prod up

# Combine multiple env files
docker compose --env-file .env --env-file .env.local up
```

### Service Dependencies

```yaml
services:
  api:
    depends_on:
      - db
      - redis

  # With health checks (better)
  api:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Networks

```yaml
services:
  api:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
```

### Volumes

```yaml
services:
  api:
    volumes:
      # Named volume
      - api-data:/app/data

      # Bind mount
      - ./api:/app

      # Anonymous volume
      - /app/node_modules

      # Read-only bind mount
      - ./config:/app/config:ro

      # tmpfs mount
      - type: tmpfs
        target: /tmp

volumes:
  api-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/on/host
```

### Extending Services

```yaml
# docker-compose.base.yml
version: '3.8'

services:
  api:
    image: myapi
    environment:
      NODE_ENV: development

# docker-compose.prod.yml
version: '3.8'

services:
  api:
    environment:
      NODE_ENV: production
    deploy:
      replicas: 3

# Usage
# docker compose -f docker-compose.base.yml -f docker-compose.prod.yml up
```

### Profiles

```yaml
version: '3.8'

services:
  db:
    image: postgres
    # Always runs

  api:
    build: ./api
    # Always runs

  test:
    build: ./api
    command: npm test
    profiles: ["testing"]  # Only with --profile testing

  debug:
    build: ./api
    command: npm run debug
    profiles: ["debug"]    # Only with --profile debug

# Usage
# docker compose --profile testing up
# docker compose --profile debug up
```

## Real-World Examples

### Example 1: WordPress with MySQL

```yaml
version: '3.8'

services:
  db:
    image: mysql:8
    volumes:
      - db-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: wppassword
    restart: always

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: wppassword
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - ./wordpress:/var/www/html
    restart: always

volumes:
  db-data:
```

### Example 2: Microservices Application

```yaml
version: '3.8'

services:
  # API Gateway
  gateway:
    build: ./gateway
    ports:
      - "80:80"
    depends_on:
      - user-service
      - product-service
      - order-service
    networks:
      - frontend
      - backend

  # User Service
  user-service:
    build: ./services/user
    environment:
      DATABASE_URL: postgres://postgres:secret@user-db:5432/users
    depends_on:
      - user-db
    networks:
      - backend

  user-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: users
    volumes:
      - user-db-data:/var/lib/postgresql/data
    networks:
      - backend

  # Product Service
  product-service:
    build: ./services/product
    environment:
      DATABASE_URL: postgres://postgres:secret@product-db:5432/products
    depends_on:
      - product-db
    networks:
      - backend

  product-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: products
    volumes:
      - product-db-data:/var/lib/postgresql/data
    networks:
      - backend

  # Order Service
  order-service:
    build: ./services/order
    environment:
      DATABASE_URL: postgres://postgres:secret@order-db:5432/orders
      RABBITMQ_URL: amqp://rabbitmq:5672
    depends_on:
      - order-db
      - rabbitmq
    networks:
      - backend

  order-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: orders
    volumes:
      - order-db-data:/var/lib/postgresql/data
    networks:
      - backend

  # Message Queue
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "15672:15672"  # Management UI
    networks:
      - backend

  # Redis Cache
  redis:
    image: redis:alpine
    networks:
      - backend

volumes:
  user-db-data:
  product-db-data:
  order-db-data:

networks:
  frontend:
  backend:
```

### Example 3: Development Environment

```yaml
version: '3.8'

services:
  # Development database
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: devdb
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  # Development API with hot reload
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
      - "9229:9229"  # Debugger port
    environment:
      NODE_ENV: development
      DATABASE_URL: postgres://postgres:devpassword@db:5432/devdb
    volumes:
      - ./api:/app
      - /app/node_modules
      - api-logs:/app/logs
    command: npm run dev
    depends_on:
      - db

  # Development frontend with hot reload
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "8080:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm start
    stdin_open: true
    tty: true
    depends_on:
      - api

  # Database admin tool
  adminer:
    image: adminer
    ports:
      - "8081:8080"
    depends_on:
      - db

volumes:
  postgres-data:
  api-logs:
```

## Development vs Production Configs

### docker-compose.dev.yml
```yaml
version: '3.8'

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    volumes:
      - ./api:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
      DEBUG: api:*
    command: npm run dev
    ports:
      - "3000:3000"
      - "9229:9229"  # Debugger
```

### docker-compose.prod.yml
```yaml
version: '3.8'

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Usage
```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## Debugging Docker Compose

### View Configuration

```bash
# Show resolved configuration
docker compose config

# Check for errors
docker compose config --quiet
```

### Troubleshooting

```bash
# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f api

# View last 100 lines
docker compose logs --tail=100 api

# Check service health
docker compose ps

# Inspect service
docker compose exec api env

# Check networks
docker network ls
docker network inspect myapp_default

# Check volumes
docker volume ls
docker volume inspect myapp_postgres-data

# Run commands in service
docker compose exec api bash
docker compose exec db psql -U postgres
```

## Best Practices

### 1. Use Environment Variables
```yaml
environment:
  DATABASE_URL: ${DATABASE_URL}
  NODE_ENV: ${NODE_ENV:-development}
```

### 2. Pin Image Versions
```yaml
# Bad
image: postgres:latest

# Good
image: postgres:15.2-alpine
```

### 3. Use Health Checks
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### 4. Organize with Networks
```yaml
networks:
  frontend:
  backend:
  database:
```

### 5. Use Named Volumes
```yaml
volumes:
  postgres-data:
  redis-data:
```

### 6. Set Resource Limits
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

### 7. Use .dockerignore
```
node_modules
.git
.env
*.log
.DS_Store
```

### 8. Clean Up Regularly
```bash
docker compose down -v
docker system prune -a
```

## Summary

You've learned:
- What Docker Compose is and why it's useful
- docker-compose.yml syntax and structure
- Essential Docker Compose commands
- Multi-container application management
- Development vs production configurations
- Real-world examples (MERN stack, microservices)
- Debugging and troubleshooting
- Best practices

**Key Takeaway**: Docker Compose simplifies multi-container applications by defining everything in a single YAML file, making it easy to start, stop, and manage complex applications.

## Next Steps

In the next lesson, **Kubernetes Basics**, we'll learn about container orchestration at scale - managing hundreds or thousands of containers across multiple servers.

---

**Challenge**:
Create a Docker Compose setup for a full-stack application with:
1. Database (PostgreSQL or MongoDB)
2. Backend API (Node.js, Python, or Go)
3. Frontend (React, Vue, or Angular)
4. Redis cache
5. Development configuration with hot reload
6. Production configuration with health checks and resource limits
