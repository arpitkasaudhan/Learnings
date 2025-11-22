# Lesson 3: Docker Fundamentals

## What is Docker? (The Simple Explanation)

Imagine you're shipping a piece of furniture. You could ship all the parts loose (risky!), or you could put everything in a standardized shipping container that fits on any truck, ship, or train. Docker does this for software.

### The Shipping Container Analogy

```
Traditional Shipping (Before Containers):
┌──────────────────────────────────────────┐
│  Different packages, different sizes     │
│  ┌────┐  ╔═══╗  ◇────◇  ▲        │
│  │ Box│  ║Box║  ○○○○○○  ││        │
│  └────┘  ╚═══╝  Barrel  Crate     │
│                                          │
│  Problems:                               │
│  - Hard to stack                         │
│  - Inefficient loading                   │
│  - Damage during transfer                │
└──────────────────────────────────────────┘

With Containers (Modern):
┌──────────────────────────────────────────┐
│  Everything in standard containers       │
│  ┏━━━━━━┓ ┏━━━━━━┓ ┏━━━━━━┓      │
│  ┃      ┃ ┃      ┃ ┃      ┃      │
│  ┗━━━━━━┛ ┗━━━━━━┛ ┗━━━━━━┛      │
│                                          │
│  Benefits:                               │
│  - Easy to stack                         │
│  - Efficient loading                     │
│  - Protected contents                    │
│  - Works anywhere                        │
└──────────────────────────────────────────┘
```

### Docker Definition

**Docker** is a platform that packages your application and all its dependencies (libraries, configuration, etc.) into a standardized unit called a **container**. This container can run consistently on any machine that has Docker installed.

**Key Idea**: "Build once, run anywhere"

## Containers vs Virtual Machines

This is crucial to understand!

### Virtual Machines (The Old Way)

```
┌─────────────────────────────────────────────┐
│           Physical Server                   │
├─────────────────────────────────────────────┤
│           Host Operating System             │
├─────────────────────────────────────────────┤
│              Hypervisor (VMware, VirtualBox)│
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Guest OS │  │ Guest OS │  │ Guest OS │ │
│  │ (Linux)  │  │ (Linux)  │  │ (Windows)│ │
│  ├──────────┤  ├──────────┤  ├──────────┤ │
│  │  Libs    │  │  Libs    │  │  Libs    │ │
│  ├──────────┤  ├──────────┤  ├──────────┤ │
│  │  App A   │  │  App B   │  │  App C   │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  Each VM includes full OS (GBs of space)   │
│  Slow to start (minutes)                   │
│  Resource intensive                        │
└─────────────────────────────────────────────┘
```

### Docker Containers (The Modern Way)

```
┌─────────────────────────────────────────────┐
│           Physical Server                   │
├─────────────────────────────────────────────┤
│        Host Operating System (Linux)        │
├─────────────────────────────────────────────┤
│           Docker Engine                     │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Libs    │  │  Libs    │  │  Libs    │ │
│  ├──────────┤  ├──────────┤  ├──────────┤ │
│  │  App A   │  │  App B   │  │  App C   │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│   Container    Container    Container     │
│                                             │
│  Share host OS (MBs of space)              │
│  Start instantly (seconds)                 │
│  Lightweight and efficient                 │
└─────────────────────────────────────────────┘
```

### Detailed Comparison

| Aspect | Virtual Machines | Docker Containers |
|--------|------------------|-------------------|
| **Size** | GBs (includes full OS) | MBs (shares host OS) |
| **Startup** | Minutes | Seconds |
| **Performance** | Slower (full OS overhead) | Near-native speed |
| **Isolation** | Complete (own kernel) | Process-level |
| **Portability** | Less portable | Highly portable |
| **Resource Usage** | Heavy | Lightweight |
| **Density** | Few VMs per host | Many containers per host |
| **Best For** | Running different OSes | Running many instances of same OS |

### When to Use What?

**Use VMs when**:
- You need complete isolation
- You need to run different operating systems
- You need to run legacy applications
- Security requirements demand kernel-level isolation

**Use Containers when**:
- You want fast deployment
- You need high density (many apps on one host)
- You want consistency across environments
- You're building microservices

## Docker Architecture

Docker uses a client-server architecture:

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ┌──────────────┐         ┌──────────────────────┐ │
│  │   Docker     │         │   Docker Host        │ │
│  │   Client     │◄───────►│                      │ │
│  │              │  REST   │  ┌────────────────┐  │ │
│  │  docker      │   API   │  │ Docker Daemon  │  │ │
│  │  commands    │         │  │    (dockerd)   │  │ │
│  └──────────────┘         │  └────────┬───────┘  │ │
│                           │           │          │ │
│                           │  ┌────────▼───────┐  │ │
│                           │  │   Containers   │  │ │
│                           │  │  ┌──┐ ┌──┐ ┌──┐ │  │
│                           │  │  │C1│ │C2│ │C3│ │  │
│                           │  │  └──┘ └──┘ └──┘ │  │
│                           │  └────────────────┘  │ │
│                           │  ┌────────────────┐  │ │
│                           │  │    Images      │  │
│                           │  │  ┌──┐ ┌──┐ ┌──┐ │  │
│                           │  │  │I1│ │I2│ │I3│ │  │
│                           │  │  └──┘ └──┘ └──┘ │  │
│                           │  └────────────────┘  │ │
│                           └──────────────────────┘ │
│                                                      │
│  ┌───────────────────────────────────────────────┐ │
│  │         Docker Registry (Docker Hub)          │ │
│  │  Public images available for download         │ │
│  │  nginx, node, python, mongodb, etc.           │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Components Explained

1. **Docker Client** (`docker` CLI)
   - What you interact with
   - Sends commands to Docker Daemon
   - Example: `docker run`, `docker build`

2. **Docker Daemon** (`dockerd`)
   - Background service running on host
   - Manages containers, images, networks, volumes
   - Listens for Docker API requests

3. **Docker Images**
   - Read-only templates
   - Blueprint for containers
   - Contains application code, runtime, libraries, dependencies
   - Stored in layers for efficiency

4. **Docker Containers**
   - Running instances of images
   - Isolated processes
   - Can be started, stopped, deleted
   - Writable layer on top of image

5. **Docker Registry**
   - Stores Docker images
   - Docker Hub is the default public registry
   - Can host private registries

## Installing Docker

### Ubuntu/Debian

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add your user to docker group (avoid using sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect

# Verify installation
docker --version
docker run hello-world
```

### CentOS/RHEL

```bash
# Install required packages
sudo yum install -y yum-utils

# Add Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Install Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER

# Verify
docker --version
docker run hello-world
```

### macOS

```bash
# Download Docker Desktop from docker.com
# Install the .dmg file
# Docker Desktop includes Docker Engine, CLI, and Compose
```

### Windows

```bash
# Download Docker Desktop for Windows from docker.com
# Install and enable WSL 2
# Docker Desktop includes everything you need
```

## Your First Container

Let's run the famous "Hello World" container:

```bash
docker run hello-world
```

**What happens?**

```
1. Docker client contacts Docker daemon
2. Daemon checks if 'hello-world' image exists locally
3. If not, pulls it from Docker Hub
4. Creates a new container from the image
5. Runs the container
6. Container prints message and exits
```

**Output explanation**:
```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete
Digest: sha256:...
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
```

## Basic Docker Commands

### Working with Images

#### Pull an Image

```bash
# Pull an image from Docker Hub
docker pull nginx

# Pull specific version
docker pull nginx:1.21

# Pull from specific registry
docker pull myregistry.com/myimage:tag
```

#### List Images

```bash
# List all images
docker images

# Same command, different name
docker image ls

# Show image digests
docker images --digests

# Filter images
docker images nginx
```

**Output**:
```
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
nginx        latest    605c77e624dd   2 weeks ago    141MB
node         18        1234abcd5678   3 weeks ago    918MB
python       3.9       9876fedc4321   1 month ago    885MB
```

#### Remove Images

```bash
# Remove an image
docker rmi nginx

# Remove by ID
docker rmi 605c77e624dd

# Remove multiple images
docker rmi nginx node python

# Remove all unused images
docker image prune -a

# Force remove (even if container using it)
docker rmi -f nginx
```

### Working with Containers

#### Run a Container

```bash
# Basic run
docker run nginx

# Run in detached mode (background)
docker run -d nginx

# Run with name
docker run -d --name my-nginx nginx

# Run with port mapping (host:container)
docker run -d -p 8080:80 nginx

# Run with environment variables
docker run -d -e "ENV=production" nginx

# Run with volume mount
docker run -d -v /host/path:/container/path nginx

# Run interactively
docker run -it ubuntu /bin/bash

# Run and remove after exit
docker run --rm nginx

# Combining options
docker run -d -p 8080:80 --name web-server nginx
```

**Common flags explained**:
- `-d`: Detached mode (run in background)
- `-p`: Port mapping (host_port:container_port)
- `-e`: Environment variable
- `-v`: Volume mount
- `-it`: Interactive with terminal
- `--name`: Give container a name
- `--rm`: Remove container after it stops

#### List Containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# List with specific format
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"

# Show only IDs
docker ps -q

# Show last created container
docker ps -l
```

**Output**:
```
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                  NAMES
abc123def456   nginx     "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp   web-server
```

#### Stop and Start Containers

```bash
# Stop container
docker stop web-server

# Stop by ID
docker stop abc123def456

# Stop multiple containers
docker stop web-server app-server db-server

# Start stopped container
docker start web-server

# Restart container
docker restart web-server

# Pause container
docker pause web-server

# Unpause container
docker unpause web-server
```

#### Remove Containers

```bash
# Remove stopped container
docker rm web-server

# Force remove running container
docker rm -f web-server

# Remove all stopped containers
docker container prune

# Remove all containers (stopped and running)
docker rm -f $(docker ps -aq)
```

#### Execute Commands in Containers

```bash
# Execute command
docker exec web-server ls /usr/share/nginx/html

# Interactive shell
docker exec -it web-server /bin/bash

# As specific user
docker exec -u root -it web-server /bin/bash

# Execute multiple commands
docker exec web-server sh -c "ls && pwd && whoami"
```

#### View Logs

```bash
# View logs
docker logs web-server

# Follow logs (like tail -f)
docker logs -f web-server

# Show timestamps
docker logs -t web-server

# Show last 100 lines
docker logs --tail 100 web-server

# Since specific time
docker logs --since 30m web-server
```

#### Inspect Container

```bash
# Full details
docker inspect web-server

# Get specific info (IP address)
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' web-server

# Get container state
docker inspect -f '{{.State.Status}}' web-server
```

#### Container Stats

```bash
# Real-time stats
docker stats

# Specific container
docker stats web-server

# No streaming (one-time output)
docker stats --no-stream
```

## Container Lifecycle

```
┌────────────────────────────────────────────┐
│         Container Lifecycle                │
└────────────────────────────────────────────┘

  docker create        docker start
     ┌─────┐              ┌─────┐
     │     ▼              ▼     │
  CREATED ──────────► RUNNING  │
     │                   │ ▲    │
     │  docker run       │ │    │ docker restart
     └───────────────────┘ │    │
                           │    │
                    docker │    │
                     pause │    │ docker unpause
                           ▼    │
                         PAUSED─┘

                    docker stop
                      or exit
                           │
                           ▼
                        STOPPED
                           │
                   docker rm│
                           ▼
                        REMOVED
```

## Hands-On Examples

### Example 1: Simple Web Server

```bash
# Run nginx web server
docker run -d -p 8080:80 --name my-web-server nginx

# Visit http://localhost:8080 in browser
# You should see "Welcome to nginx!"

# View logs
docker logs my-web-server

# Stop and remove
docker stop my-web-server
docker rm my-web-server
```

### Example 2: Interactive Ubuntu Container

```bash
# Run Ubuntu container with interactive shell
docker run -it --name my-ubuntu ubuntu /bin/bash

# Inside container, try these commands:
apt update
apt install -y curl
curl https://api.github.com
exit

# Container is stopped but still exists
docker ps -a

# Start and attach again
docker start my-ubuntu
docker attach my-ubuntu

# Or execute command
docker exec -it my-ubuntu /bin/bash

# Remove when done
docker rm my-ubuntu
```

### Example 3: Node.js Application

Create a simple Node.js app:

```javascript
// app.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello from Node.js in Docker!\n');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

Create a Dockerfile:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY app.js .

EXPOSE 3000

CMD ["node", "app.js"]
```

Build and run:

```bash
# Build image
docker build -t my-node-app .

# Run container
docker run -d -p 3000:3000 --name node-server my-node-app

# Test
curl http://localhost:3000

# View logs
docker logs -f node-server

# Stop and remove
docker stop node-server
docker rm node-server
```

### Example 4: Python Flask Application

Create Flask app:

```python
# app.py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello from Python Flask in Docker!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

Create requirements:

```
# requirements.txt
Flask==2.3.0
```

Create Dockerfile:

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]
```

Build and run:

```bash
# Build
docker build -t my-flask-app .

# Run
docker run -d -p 5000:5000 --name flask-server my-flask-app

# Test
curl http://localhost:5000

# Clean up
docker stop flask-server
docker rm flask-server
```

### Example 5: MongoDB Database

```bash
# Run MongoDB
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -v mongodb_data:/data/db \
  mongo:6

# Connect to MongoDB
docker exec -it mongodb mongosh -u admin -p password123

# Inside MongoDB shell:
show dbs
use myapp
db.users.insertOne({name: "John", age: 30})
db.users.find()
exit

# Stop and remove (data persists in volume)
docker stop mongodb
docker rm mongodb

# List volumes
docker volume ls

# Remove volume (deletes data!)
docker volume rm mongodb_data
```

## Understanding Docker Images and Layers

Images are built in layers:

```
┌─────────────────────────────────────┐
│     Node.js Application Image      │
├─────────────────────────────────────┤
│  Layer 5: CMD ["node", "app.js"]   │
├─────────────────────────────────────┤
│  Layer 4: COPY app.js /app         │
├─────────────────────────────────────┤
│  Layer 3: RUN npm install          │
├─────────────────────────────────────┤
│  Layer 2: COPY package.json        │
├─────────────────────────────────────┤
│  Layer 1: FROM node:18-alpine      │
└─────────────────────────────────────┘
         ▲
         │
    Layers are read-only
    Shared between images
    Cached for faster builds
```

Each layer is cached. If you change only `app.js`, layers 1-3 are reused!

## Common Docker Commands Cheat Sheet

```bash
# Images
docker pull <image>              # Download image
docker build -t <name> .         # Build image from Dockerfile
docker images                    # List images
docker rmi <image>               # Remove image
docker tag <image> <new-name>    # Tag image

# Containers
docker run <image>               # Create and start container
docker ps                        # List running containers
docker ps -a                     # List all containers
docker stop <container>          # Stop container
docker start <container>         # Start stopped container
docker restart <container>       # Restart container
docker rm <container>            # Remove container
docker exec -it <container> bash # Execute command in container

# Information
docker logs <container>          # View logs
docker inspect <container>       # Detailed info
docker stats                     # Resource usage
docker top <container>           # Running processes

# Cleanup
docker container prune           # Remove stopped containers
docker image prune               # Remove unused images
docker volume prune              # Remove unused volumes
docker system prune              # Remove everything unused
docker system prune -a           # Remove all unused (including images)
```

## Troubleshooting

### Port Already in Use

```bash
# Error: Bind for 0.0.0.0:8080 failed: port is already allocated

# Solution 1: Use different port
docker run -p 8081:80 nginx

# Solution 2: Find and stop process using port
lsof -i :8080
kill <PID>

# Solution 3: Stop container using that port
docker ps
docker stop <container>
```

### Container Exits Immediately

```bash
# Check logs
docker logs <container>

# Run interactively to debug
docker run -it <image> /bin/bash

# Check if process in foreground
# Containers need a foreground process to stay alive
```

### Cannot Connect to Docker Daemon

```bash
# Error: Cannot connect to the Docker daemon

# Solution 1: Start Docker
sudo systemctl start docker

# Solution 2: Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in

# Solution 3: Check Docker is running
sudo systemctl status docker
```

### Image Pull Error

```bash
# Error: Error response from daemon: pull access denied

# Solution: Check image name and tag
docker pull nginx:latest  # Correct
docker pull ngnix:latest  # Typo!

# Login if private image
docker login
```

## Best Practices for Beginners

1. **Always name your containers**
   ```bash
   docker run --name my-app nginx  # Good
   docker run nginx                # Gets random name
   ```

2. **Clean up regularly**
   ```bash
   docker system prune -a
   ```

3. **Use specific image tags**
   ```bash
   docker pull node:18-alpine  # Good
   docker pull node:latest     # Can break
   ```

4. **Check logs when troubleshooting**
   ```bash
   docker logs -f container-name
   ```

5. **Use `.dockerignore`**
   ```
   node_modules
   .git
   .env
   ```

6. **Run as non-root user** (we'll learn in next lesson)

7. **One process per container**

8. **Use volumes for persistent data**

## Practice Exercises

### Exercise 1: Basic Commands
1. Pull the nginx image
2. Run it on port 8080
3. Access it in browser
4. View the logs
5. Stop and remove the container

### Exercise 2: Interactive Exploration
1. Run Ubuntu container interactively
2. Install a package (curl, vim)
3. Create a file
4. Exit and restart
5. Notice your file is gone (no persistence)

### Exercise 3: Build Simple App
1. Create a simple HTML page
2. Create Dockerfile with nginx
3. Copy HTML to nginx directory
4. Build and run
5. Access your custom page

### Exercise 4: Environment Variables
1. Run container with environment variable
2. Execute command to print the variable
3. Try with multiple variables

## Summary

You've learned:
- What Docker is and why it's revolutionary
- Containers vs Virtual Machines
- Docker architecture
- Installing Docker
- Essential Docker commands
- Running real applications in containers
- Troubleshooting common issues

**Key Takeaway**: Docker makes applications portable and consistent across environments. "Works on my machine" is no longer an excuse!

## Next Steps

In the next lesson, **Docker Deep Dive**, we'll learn:
- Writing advanced Dockerfiles
- Multi-stage builds
- Docker networking
- Docker volumes
- Image optimization
- Best practices for production

---

**Challenge**:
Containerize a simple web application you've built (or build a new one). Make sure it:
1. Builds successfully
2. Runs on a specific port
3. Has proper logging
4. Can be stopped and restarted without losing functionality
