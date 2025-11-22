# Complete DevOps Learning Guide

A comprehensive, beginner-friendly guide to DevOps, Docker, and all modern DevOps tools and practices. Explained in simple words with detailed examples.

## 📚 What You'll Learn

This guide covers the **complete DevOps journey** from basics to advanced concepts:
- Docker containerization
- Container orchestration (Kubernetes)
- CI/CD pipelines
- Infrastructure as Code
- Monitoring and logging
- Cloud platforms
- DevOps best practices

## 🎯 Guide Structure

### Part 1: DevOps Fundamentals (Lessons 1-2)

**[01. Introduction to DevOps](./01-devops-introduction.md)**
- What is DevOps?
- DevOps culture and principles
- DevOps lifecycle (Plan → Code → Build → Test → Deploy → Monitor)
- DevOps vs Traditional approach
- Benefits of DevOps

**[02. Linux Essentials for DevOps](./02-linux-essentials.md)**
- Essential Linux commands
- File system navigation
- Process management
- Text processing (grep, sed, awk)
- Shell scripting basics
- Permissions and users

### Part 2: Docker & Containers (Lessons 3-6)

**[03. Docker Fundamentals](./03-docker-fundamentals.md)**
- What is Docker?
- Containers vs Virtual Machines
- Docker architecture (Client, Daemon, Registry)
- Installing Docker
- Docker images and containers
- Basic Docker commands
- Dockerfile basics

**[04. Docker Deep Dive](./04-docker-deep-dive.md)**
- Writing Dockerfiles (best practices)
- Multi-stage builds
- Docker networking
- Docker volumes (data persistence)
- Docker environment variables
- Building efficient images
- Image optimization

**[05. Docker Compose](./05-docker-compose.md)**
- What is Docker Compose?
- docker-compose.yml syntax
- Multi-container applications
- Services, networks, volumes
- Environment variables
- Docker Compose commands
- Real-world examples (MERN, MEAN stacks)

**[06. Container Orchestration Basics](./06-kubernetes-basics.md)**
- Introduction to Kubernetes
- Kubernetes architecture (Master, Nodes, Pods)
- Core concepts (Deployments, Services, ConfigMaps, Secrets)
- kubectl basics
- Deploying applications to Kubernetes
- Scaling and updates

### Part 3: CI/CD (Continuous Integration/Deployment) (Lessons 7-9)

**[07. Git Advanced & GitHub](./07-git-advanced.md)**
- Git branching strategies (GitFlow, trunk-based)
- Git hooks
- Merge vs Rebase
- Git best practices
- GitHub Actions introduction
- Pull requests and code review

**[08. CI/CD Concepts](./08-cicd-concepts.md)**
- What is CI/CD?
- Continuous Integration
- Continuous Deployment vs Delivery
- CI/CD pipeline stages
- Testing in CI/CD (Unit, Integration, E2E)
- Deployment strategies (Blue-Green, Canary, Rolling)

**[09. GitHub Actions](./09-github-actions.md)**
- GitHub Actions workflows
- Events, jobs, steps
- Building CI/CD pipelines
- Docker integration
- Automated testing
- Deployment automation
- Secrets management
- Real-world examples

### Part 4: Infrastructure as Code (Lessons 10-11)

**[10. Docker in Production](./10-docker-production.md)**
- Production best practices
- Docker security
- Health checks and monitoring
- Logging strategies
- Resource limits
- Docker Swarm basics
- Container registries (Docker Hub, ECR, GCR)

**[11. Infrastructure as Code Basics](./11-infrastructure-as-code.md)**
- What is IaC?
- Benefits of IaC
- Terraform basics
- Creating infrastructure with Terraform
- Ansible basics
- Configuration management
- IaC best practices

### Part 5: Monitoring, Logging & Cloud (Lessons 12-15)

**[12. Monitoring & Logging](./12-monitoring-logging.md)**
- Why monitoring matters
- Metrics, logs, traces
- Prometheus basics
- Grafana dashboards
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Docker logging
- Application monitoring
- Alerting strategies

**[13. Cloud Platforms - AWS](./13-cloud-aws.md)**
- Cloud computing basics
- AWS core services (EC2, S3, RDS, ECS, EKS)
- Deploying Docker to AWS
- AWS CLI basics
- Serverless (Lambda) introduction
- AWS best practices

**[14. DevOps Security (DevSecOps)](./14-devsecops.md)**
- Security in DevOps
- Container security
- Image scanning
- Secrets management (Vault, AWS Secrets Manager)
- Security best practices
- Compliance and auditing

**[15. DevOps Best Practices](./15-devops-best-practices.md)**
- Complete DevOps workflow
- Automation strategies
- Documentation
- Team collaboration
- Incident management
- Post-mortems
- DevOps metrics (DORA metrics)
- Career path in DevOps

## 🚀 Learning Paths

### Quick Start (Docker Focus) - 1-2 Weeks
```
1. Lesson 1: DevOps Introduction
2. Lesson 3: Docker Fundamentals ⭐
3. Lesson 4: Docker Deep Dive ⭐
4. Lesson 5: Docker Compose ⭐
5. Lesson 10: Docker in Production
```

### Full Stack Developer Path - 4-6 Weeks
```
Week 1: Lessons 1-2 (DevOps basics, Linux)
Week 2: Lessons 3-5 (Docker)
Week 3: Lessons 7-9 (Git, CI/CD, GitHub Actions)
Week 4: Lesson 10 (Docker Production)
```

### DevOps Engineer Path - 8-12 Weeks
```
Weeks 1-2:  Lessons 1-2 (Fundamentals, Linux)
Weeks 3-4:  Lessons 3-6 (Docker, Kubernetes)
Weeks 5-6:  Lessons 7-9 (Git, CI/CD)
Weeks 7-8:  Lessons 10-11 (Production, IaC)
Weeks 9-10: Lessons 12-13 (Monitoring, Cloud)
Weeks 11-12: Lessons 14-15 (Security, Best Practices)
```

## 🎓 Prerequisites

**Minimal**:
- Basic programming knowledge (any language)
- Familiar with command line/terminal
- Understanding of web applications

**Recommended**:
- Backend development experience (Node.js, Python, etc.)
- Basic understanding of Linux
- Git basics

## 💻 Tools You'll Use

Throughout this guide, you'll work with:

**Core Tools**:
- Docker & Docker Compose
- Git & GitHub
- Linux/Unix command line

**CI/CD**:
- GitHub Actions
- Jenkins (basics)

**Orchestration**:
- Kubernetes (kubectl, minikube)

**Infrastructure**:
- Terraform (basics)
- AWS CLI

**Monitoring**:
- Prometheus & Grafana
- Docker logs

## 📖 How to Use This Guide

### 1. Sequential Learning (Recommended for beginners)
- Follow lessons in order
- Complete exercises in each lesson
- Build projects as you learn
- Don't skip fundamentals

### 2. Topic-Based Learning (For experienced developers)
- Jump to specific topics
- Use as reference
- Focus on what you need

### 3. Project-Based Learning
- Each section includes projects
- Apply concepts immediately
- Build portfolio projects

## 🛠️ Setup Instructions

### Install Docker
```bash
# Linux (Ubuntu)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Mac
# Download Docker Desktop from docker.com

# Windows
# Download Docker Desktop from docker.com

# Verify installation
docker --version
docker-compose --version
```

### Install kubectl (Kubernetes CLI)
```bash
# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Mac
brew install kubectl

# Verify
kubectl version --client
```

### Install minikube (Local Kubernetes)
```bash
# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Mac
brew install minikube

# Verify
minikube version
```

## 🎯 Real-World Projects

Throughout this guide, you'll build:

### Project 1: Dockerized MERN Application
- Containerize MongoDB, Express, React, Node.js
- Multi-container setup with Docker Compose
- Development and production configurations

### Project 2: CI/CD Pipeline
- Automated testing on push
- Build and push Docker images
- Deploy to staging/production
- Rollback strategies

### Project 3: Microservices Architecture
- Multiple containerized services
- Service discovery
- Load balancing
- Monitoring and logging

### Project 4: Kubernetes Deployment
- Deploy application to Kubernetes
- Auto-scaling
- Rolling updates
- Health checks

## 📚 Additional Resources

**Official Documentation**:
- [Docker Docs](https://docs.docker.com/)
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [AWS Docs](https://docs.aws.amazon.com/)

**Practice Platforms**:
- [Play with Docker](https://labs.play-with-docker.com/)
- [Katacoda](https://www.katacoda.com/)
- [AWS Free Tier](https://aws.amazon.com/free/)

**Communities**:
- Docker Community Forums
- Kubernetes Slack
- DevOps subreddit
- Stack Overflow

## 🎖️ Certifications to Consider

After completing this guide:
- Docker Certified Associate (DCA)
- Certified Kubernetes Administrator (CKA)
- AWS Certified DevOps Engineer
- GitHub Actions Certification

## 💡 Tips for Learning

1. **Practice Daily**: Spend at least 30-60 minutes daily
2. **Build Projects**: Apply what you learn immediately
3. **Read Documentation**: Get comfortable with official docs
4. **Join Communities**: Ask questions, help others
5. **Break Things**: Learn by troubleshooting
6. **Automate Everything**: Look for automation opportunities
7. **Version Control**: Git commit your learning projects
8. **Document**: Write notes, create personal documentation

## 🚦 Learning Milestones

**Beginner (Weeks 1-4)**:
- ✅ Understand DevOps principles
- ✅ Run Docker containers
- ✅ Write Dockerfiles
- ✅ Use Docker Compose
- ✅ Basic Git workflows

**Intermediate (Weeks 5-8)**:
- ✅ Build CI/CD pipelines
- ✅ Deploy to production
- ✅ Basic Kubernetes
- ✅ Monitoring basics
- ✅ Security awareness

**Advanced (Weeks 9-12)**:
- ✅ Infrastructure as Code
- ✅ Kubernetes orchestration
- ✅ Cloud deployments
- ✅ Complete automation
- ✅ DevOps best practices

## 🎯 After This Guide

You will be able to:
- ✅ Containerize any application
- ✅ Build automated CI/CD pipelines
- ✅ Deploy to cloud platforms
- ✅ Manage infrastructure as code
- ✅ Monitor and debug production systems
- ✅ Implement DevOps best practices
- ✅ Work as DevOps Engineer or SRE

## 🤝 Contributing

This guide is part of the VahanHelp backend learning resources. Suggestions and improvements are welcome!

## 📝 License

Educational purposes - VahanHelp Project

---

**Ready to start your DevOps journey? Let's begin with [Lesson 1: Introduction to DevOps](./01-devops-introduction.md)!** 🚀

---

## Quick Reference Cheat Sheet

### Essential Docker Commands
```bash
docker ps                           # List running containers
docker images                       # List images
docker build -t myapp .            # Build image
docker run -d -p 8080:80 myapp     # Run container
docker-compose up -d               # Start services
docker logs <container>            # View logs
docker exec -it <container> bash   # Enter container
```

### Essential kubectl Commands
```bash
kubectl get pods                   # List pods
kubectl get services              # List services
kubectl apply -f deployment.yaml  # Deploy application
kubectl logs <pod>                # View logs
kubectl describe pod <pod>        # Pod details
kubectl scale deployment myapp --replicas=3  # Scale
```

### Common Git Commands for DevOps
```bash
git checkout -b feature/new       # Create branch
git add .                         # Stage changes
git commit -m "message"          # Commit
git push origin feature/new      # Push branch
git pull --rebase               # Update branch
```

Happy Learning! 🎉
