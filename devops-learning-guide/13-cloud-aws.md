# Lesson 13: Cloud Computing & AWS

## Introduction

Imagine having infinite servers that you can spin up in seconds, pay only for what you use, and discard when done. That's cloud computing. Amazon Web Services (AWS) pioneered this revolution and remains the market leader.

Think of cloud computing like electricity - you don't build your own power plant, you just plug in and pay for what you use.

## What is Cloud Computing?

```
Traditional (On-Premises):
┌────────────────────────────────────┐
│ Buy servers ($$$)                  │
│ └─ Wait weeks for delivery         │
│ Set up data center                 │
│ └─ Cooling, power, security        │
│ Maintain hardware                  │
│ └─ Replace failures                │
│ Over-provision for peaks           │
│ └─ Waste money on idle capacity    │
└────────────────────────────────────┘

Cloud:
┌────────────────────────────────────┐
│ Rent servers (minutes)             │
│ └─ Instant provisioning            │
│ No data center needed              │
│ └─ AWS handles everything          │
│ Auto-scaling                       │
│ └─ Match capacity to demand        │
│ Pay for what you use               │
│ └─ No wasted capacity              │
└────────────────────────────────────┘
```

## Cloud Service Models

### IaaS vs PaaS vs SaaS

```
┌──────────────────────────────────────────────────┐
│           Cloud Service Models                   │
├──────────────────────────────────────────────────┤
│                                                  │
│  IaaS (Infrastructure as a Service)              │
│  ├─ You manage: OS, runtime, apps, data          │
│  ├─ Provider manages: Servers, storage, network  │
│  └─ Example: AWS EC2, Google Compute Engine      │
│                                                  │
│  PaaS (Platform as a Service)                    │
│  ├─ You manage: Apps, data                       │
│  ├─ Provider manages: OS, runtime, servers       │
│  └─ Example: Heroku, Google App Engine           │
│                                                  │
│  SaaS (Software as a Service)                    │
│  ├─ You manage: Your data                        │
│  ├─ Provider manages: Everything else            │
│  └─ Example: Gmail, Salesforce, Slack            │
│                                                  │
└──────────────────────────────────────────────────┘
```

## AWS Core Services

### 1. EC2 (Elastic Compute Cloud)

**Virtual servers in the cloud.**

```bash
# Launch EC2 instance with AWS CLI
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name my-key-pair \
  --security-group-ids sg-12345678 \
  --subnet-id subnet-12345678 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=MyServer}]'

# List instances
aws ec2 describe-instances

# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# Terminate instance
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0
```

**Instance Types**:
```
t2.micro  - 1 vCPU, 1 GB RAM   (Free tier)
t2.small  - 1 vCPU, 2 GB RAM
t2.medium - 2 vCPU, 4 GB RAM
m5.large  - 2 vCPU, 8 GB RAM   (General purpose)
c5.large  - 2 vCPU, 4 GB RAM   (Compute optimized)
r5.large  - 2 vCPU, 16 GB RAM  (Memory optimized)
```

### 2. S3 (Simple Storage Service)

**Object storage for any type of data.**

```bash
# Create bucket
aws s3 mb s3://my-bucket-name

# Upload file
aws s3 cp myfile.txt s3://my-bucket-name/

# Upload directory
aws s3 sync ./local-folder s3://my-bucket-name/remote-folder

# List files
aws s3 ls s3://my-bucket-name/

# Download file
aws s3 cp s3://my-bucket-name/myfile.txt ./

# Delete file
aws s3 rm s3://my-bucket-name/myfile.txt

# Make file public
aws s3api put-object-acl \
  --bucket my-bucket-name \
  --key myfile.txt \
  --acl public-read
```

**S3 Storage Classes**:
```
Standard          - Frequently accessed
Intelligent-Tiering - Auto-optimize costs
Standard-IA       - Infrequently accessed
Glacier           - Long-term archive (cheap)
Glacier Deep Archive - Rarely accessed (cheapest)
```

### 3. RDS (Relational Database Service)

**Managed relational databases.**

```bash
# Create PostgreSQL database
aws rds create-db-instance \
  --db-instance-identifier mydb \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password MyPassword123 \
  --allocated-storage 20

# Describe databases
aws rds describe-db-instances

# Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier mydb \
  --db-snapshot-identifier mydb-snapshot
```

**Supported Engines**:
- PostgreSQL
- MySQL
- MariaDB
- Oracle
- SQL Server
- Aurora (AWS-optimized)

### 4. ECS (Elastic Container Service)

**Run Docker containers.**

```yaml
# Task Definition
{
  "family": "myapp",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "myapp:latest",
      "memory": 512,
      "cpu": 256,
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  ]
}
```

**With Fargate (serverless)**:
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name my-cluster

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster my-cluster \
  --service-name my-service \
  --task-definition myapp:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345]}"
```

### 5. EKS (Elastic Kubernetes Service)

**Managed Kubernetes.**

```bash
# Create EKS cluster
eksctl create cluster \
  --name my-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3

# Update kubeconfig
aws eks update-kubeconfig --name my-cluster

# Deploy application
kubectl apply -f deployment.yaml
```

### 6. Lambda (Serverless Functions)

**Run code without managing servers.**

**handler.js**:
```javascript
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      input: event
    })
  };

  return response
};
```

```bash
# Create function
aws lambda create-function \
  --function-name my-function \
  --runtime nodejs18.x \
  --role arn:aws:iam::123456789012:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip

# Invoke function
aws lambda invoke \
  --function-name my-function \
  --payload '{"key":"value"}' \
  response.json
```

### 7. CloudWatch (Monitoring)

**Monitoring and observability.**

```bash
# View logs
aws logs tail /aws/lambda/my-function --follow

# Create alarm
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

## Deploying Docker to AWS

### Option 1: EC2 with Docker

```bash
# Launch EC2 instance with Docker
# 1. Create user data script
cat > user-data.sh <<'EOF'
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Pull and run container
docker pull myapp:latest
docker run -d -p 80:3000 myapp:latest
EOF

# 2. Launch instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name my-key \
  --security-group-ids sg-12345 \
  --user-data file://user-data.sh
```

### Option 2: ECS with Fargate

```yaml
# docker-compose.yml for ECS
version: '3.8'

services:
  web:
    image: myapp:latest
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

x-aws-cloudformation:
  Resources:
    WebTaskDefinition:
      Properties:
        RequiresCompatibilities:
          - FARGATE
        NetworkMode: awsvpc
```

```bash
# Deploy to ECS
docker context create ecs myecs
docker context use myecs
docker compose up
```

### Option 3: EKS (Kubernetes)

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:latest
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 3000
```

```bash
# Deploy
kubectl apply -f deployment.yaml
```

## AWS Networking

### VPC (Virtual Private Cloud)

```
┌────────────────────────────────────────────┐
│              VPC (10.0.0.0/16)             │
├────────────────────────────────────────────┤
│                                            │
│  Public Subnet (10.0.1.0/24)               │
│  ├─ Web servers                            │
│  ├─ Load balancer                          │
│  └─ Internet Gateway                       │
│                                            │
│  Private Subnet (10.0.2.0/24)              │
│  ├─ Application servers                    │
│  ├─ Database servers                       │
│  └─ NAT Gateway (outbound only)            │
│                                            │
└────────────────────────────────────────────┘
```

**Security Groups** (Firewall):
```bash
# Create security group
aws ec2 create-security-group \
  --group-name web-sg \
  --description "Web server security group" \
  --vpc-id vpc-12345

# Allow HTTP
aws ec2 authorize-security-group-ingress \
  --group-id sg-12345 \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow SSH from specific IP
aws ec2 authorize-security-group-ingress \
  --group-id sg-12345 \
  --protocol tcp \
  --port 22 \
  --cidr 203.0.113.0/24
```

## AWS CLI Basics

### Installation

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: us-east-1
# Default output format: json
```

### Common Commands

```bash
# List S3 buckets
aws s3 ls

# List EC2 instances
aws ec2 describe-instances --query 'Reservations[].Instances[].[InstanceId,State.Name,PrivateIpAddress]'

# List running instances
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"

# Get account ID
aws sts get-caller-identity

# List IAM users
aws iam list-users
```

## Best Practices

### 1. Security

```bash
# Use IAM roles, not access keys
# Enable MFA
# Follow least privilege principle
# Encrypt data at rest and in transit
# Regular security audits
```

### 2. Cost Optimization

```bash
# Use Reserved Instances for stable workloads
# Use Spot Instances for flexible workloads
# Right-size instances
# Use Auto Scaling
# Delete unused resources
# Use S3 lifecycle policies
# Monitor costs with AWS Cost Explorer
```

### 3. High Availability

```yaml
# Multiple Availability Zones
# Load balancers
# Auto Scaling groups
# Database replication
# Backup strategy
```

### 4. Tagging Strategy

```bash
# Tag all resources
aws ec2 create-tags \
  --resources i-1234567890abcdef0 \
  --tags \
    Key=Environment,Value=Production \
    Key=Project,Value=MyApp \
    Key=Owner,Value=DevOps \
    Key=CostCenter,Value=Engineering
```

## Complete AWS Deployment Example

**Terraform + AWS**:
```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

# VPC
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "myapp-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = false
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "myapp-cluster"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "myapp"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = "myapp:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "main" {
  name            = "myapp-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.app.id]
  }
}
```

## Summary

You've learned:
- Cloud computing fundamentals
- IaaS vs PaaS vs SaaS
- AWS core services (EC2, S3, RDS, ECS, EKS, Lambda, CloudWatch)
- Deploying Docker to AWS (EC2, ECS, EKS)
- AWS networking (VPC, Security Groups)
- AWS CLI basics
- Best practices (security, cost, HA)
- Complete deployment example

**Key Takeaway**: Cloud platforms like AWS provide scalable, reliable infrastructure that you can provision and manage programmatically, enabling modern DevOps practices.

## Next Steps

In the next lesson, **DevSecOps**, we'll learn how to integrate security into the DevOps lifecycle, shifting security left and making it everyone's responsibility.

---

**Challenge**:
Deploy a complete application to AWS:
1. Set up VPC with public and private subnets
2. Deploy containerized application to ECS/Fargate
3. Use RDS for database
4. Configure load balancer
5. Set up auto-scaling
6. Implement monitoring with CloudWatch
7. Use Terraform for infrastructure
8. Optimize costs
