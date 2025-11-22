# Lesson 17: ECS (Container Orchestration)

## What is ECS?

**ECS (Elastic Container Service)** = Managed container orchestration.

**Benefits**:
- Run Docker containers at scale
- Automatic scaling
- Load balancing
- Service discovery
- No Kubernetes complexity

**Launch Types**:
- **EC2**: You manage EC2 instances
- **Fargate**: Serverless (AWS manages infrastructure) ⭐

---

## ECS Concepts

### Task Definition

**Task Definition** = Blueprint for containers (like docker-compose.yml)

```json
{
  "family": "vahanhelp-backend",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/vahanhelp-backend:latest",
      "memory": 512,
      "cpu": 256,
      "essential": true,
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
        },
        {
          "name": "PORT",
          "value": "3000"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:db-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/vahanhelp-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "256",
  "memory": "512"
}
```

### Service

**Service** = Runs and maintains tasks (ensures X tasks always running)

### Cluster

**Cluster** = Logical grouping of tasks/services

---

## Deploy Node.js App on Fargate

### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

EXPOSE 3000

CMD ["node", "src/server.js"]
```

### Step 2: Push to ECR

```bash
# Create ECR repository
aws ecr create-repository --repository-name vahanhelp-backend

# Login
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t vahanhelp-backend .
docker tag vahanhelp-backend:latest \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/vahanhelp-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/vahanhelp-backend:latest
```

### Step 3: Create Task Definition

```bash
# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

**task-definition.json**:
```json
{
  "family": "vahanhelp-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/vahanhelp-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "3000"}
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:vahanhelp-db-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:vahanhelp-jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/vahanhelp-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ]
}
```

### Step 4: Create Cluster

```bash
aws ecs create-cluster --cluster-name vahanhelp-production
```

### Step 5: Create Service with ALB

```bash
# Create service
aws ecs create-service \
  --cluster vahanhelp-production \
  --service-name vahanhelp-backend-service \
  --task-definition vahanhelp-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-123,subnet-456],
    securityGroups=[sg-789],
    assignPublicIp=ENABLED
  }" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=3000"
```

---

## Auto Scaling

### Target Tracking (CPU-based)

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/vahanhelp-production/vahanhelp-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/vahanhelp-production/vahanhelp-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }'
```

### Scheduled Scaling

```bash
# Scale up during business hours
aws application-autoscaling put-scheduled-action \
  --service-namespace ecs \
  --resource-id service/vahanhelp-production/vahanhelp-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --scheduled-action-name scale-up-morning \
  --schedule "cron(0 9 * * ? *)" \
  --scalable-target-action MinCapacity=5,MaxCapacity=10

# Scale down at night
aws application-autoscaling put-scheduled-action \
  --service-namespace ecs \
  --resource-id service/vahanhelp-production/vahanhelp-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --scheduled-action-name scale-down-night \
  --schedule "cron(0 22 * * ? *)" \
  --scalable-target-action MinCapacity=2,MaxCapacity=4
```

---

## Multi-Container Setup

### Task Definition with Redis

```json
{
  "family": "vahanhelp-app",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/vahanhelp-backend:latest",
      "portMappings": [{"containerPort": 3000}],
      "dependsOn": [
        {
          "containerName": "redis",
          "condition": "HEALTHY"
        }
      ],
      "environment": [
        {"name": "REDIS_HOST", "value": "localhost"},
        {"name": "REDIS_PORT", "value": "6379"}
      ]
    },
    {
      "name": "redis",
      "image": "redis:7-alpine",
      "portMappings": [{"containerPort": 6379}],
      "healthCheck": {
        "command": ["CMD-SHELL", "redis-cli ping || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

---

## Service Discovery

**Use Case**: Backend needs to call other microservices

### Create Service Discovery Namespace

```bash
# Create namespace
aws servicediscovery create-private-dns-namespace \
  --name vahanhelp.local \
  --vpc vpc-123

# Create service
aws servicediscovery create-service \
  --name backend \
  --dns-config "NamespaceId=ns-123,DnsRecords=[{Type=A,TTL=60}]" \
  --health-check-custom-config FailureThreshold=1
```

### Use in ECS Service

```bash
aws ecs create-service \
  --cluster vahanhelp-production \
  --service-name vahanhelp-backend-service \
  --task-definition vahanhelp-backend:1 \
  --service-registries "registryArn=arn:aws:servicediscovery:..." \
  ...
```

**Access from other services**:
```javascript
// Instead of hardcoded IP
const response = await axios.get('http://backend.vahanhelp.local:3000/api/users');
```

---

## Blue/Green Deployment

### Update Service (Rolling Update)

```bash
# Update task definition (new version)
aws ecs register-task-definition --cli-input-json file://task-definition-v2.json

# Update service
aws ecs update-service \
  --cluster vahanhelp-production \
  --service vahanhelp-backend-service \
  --task-definition vahanhelp-backend:2 \
  --desired-count 2
```

**Process**:
1. Start new tasks (v2)
2. Wait for health check
3. Drain connections from old tasks (v1)
4. Stop old tasks

### CodeDeploy Blue/Green

```yaml
# appspec.yml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "arn:aws:ecs:us-east-1:123456789012:task-definition/vahanhelp-backend:2"
        LoadBalancerInfo:
          ContainerName: "backend"
          ContainerPort: 3000
        PlatformVersion: "LATEST"

Hooks:
  - BeforeInstall: "LambdaFunctionToValidateBeforeInstall"
  - AfterInstall: "LambdaFunctionToValidateAfterTrafficShift"
  - AfterAllowTestTraffic: "LambdaFunctionToValidateAfterTestTraffic"
  - BeforeAllowTraffic: "LambdaFunctionToValidateBeforeAllowingTraffic"
  - AfterAllowTraffic: "LambdaFunctionToValidateAfterAllowingTraffic"
```

---

## Monitoring

### CloudWatch Container Insights

```bash
# Enable Container Insights
aws ecs update-cluster-settings \
  --cluster vahanhelp-production \
  --settings name=containerInsights,value=enabled
```

**Metrics available**:
- CPU/Memory utilization
- Network throughput
- Task count
- Container-level metrics

### Custom Metrics

```javascript
// Send custom metrics from container
const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');

const cloudwatch = new CloudWatchClient({ region: 'us-east-1' });

async function trackContainerMetric(name, value) {
  await cloudwatch.send(new PutMetricDataCommand({
    Namespace: 'VahanHelp/ECS',
    MetricData: [{
      MetricName: name,
      Value: value,
      Unit: 'Count',
      Dimensions: [
        { Name: 'ServiceName', Value: 'vahanhelp-backend-service' },
        { Name: 'ClusterName', Value: 'vahanhelp-production' }
      ]
    }]
  }));
}
```

---

## Secrets Management

### AWS Secrets Manager

```bash
# Create secret
aws secretsmanager create-secret \
  --name vahanhelp-db-url \
  --secret-string "postgresql://user:pass@rds-endpoint:5432/vahanhelp"

# Reference in task definition
{
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:vahanhelp-db-url"
    }
  ]
}
```

### AWS Systems Manager (Parameter Store)

```bash
# Store parameter
aws ssm put-parameter \
  --name /vahanhelp/jwt-secret \
  --value "your-secret-key" \
  --type SecureString

# Reference in task definition
{
  "secrets": [
    {
      "name": "JWT_SECRET",
      "valueFrom": "arn:aws:ssm:us-east-1:123456789012:parameter/vahanhelp/jwt-secret"
    }
  ]
}
```

---

## Cost Optimization

### Fargate Spot

**Save up to 70%** using Spot instances for non-critical workloads

```bash
aws ecs create-service \
  --capacity-provider-strategy \
    capacityProvider=FARGATE_SPOT,weight=1 \
    capacityProvider=FARGATE,weight=1,base=2
```

### Right-Sizing

```javascript
// Monitor resource usage
const os = require('os');

setInterval(() => {
  const memUsage = process.memoryUsage();
  const cpuUsage = os.loadavg()[0];

  console.log({
    rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    cpu: cpuUsage
  });
}, 60000);
```

**Adjust task definition** based on actual usage:
- If using < 50% memory: Reduce from 512MB to 256MB
- If CPU consistently low: Reduce from 256 to 128

---

## Complete Production Setup

```bash
# 1. Create cluster
aws ecs create-cluster --cluster-name vahanhelp-production

# 2. Create ALB target group
aws elbv2 create-target-group \
  --name vahanhelp-backend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-123 \
  --target-type ip \
  --health-check-path /api/health

# 3. Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# 4. Create service
aws ecs create-service \
  --cluster vahanhelp-production \
  --service-name vahanhelp-backend-service \
  --task-definition vahanhelp-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-123,subnet-456],securityGroups=[sg-789]}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=3000"

# 5. Enable auto scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/vahanhelp-production/vahanhelp-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# 6. Enable Container Insights
aws ecs update-cluster-settings \
  --cluster vahanhelp-production \
  --settings name=containerInsights,value=enabled
```

---

## Practice Exercise

1. Create Dockerfile for Node.js app
2. Push image to ECR
3. Create ECS task definition with secrets
4. Deploy service on Fargate with ALB
5. Set up auto scaling based on CPU
6. Enable Container Insights monitoring
7. Implement blue/green deployment

---

## ECS vs EC2 vs Lambda

| Feature | ECS Fargate | EC2 | Lambda |
|---------|-------------|-----|--------|
| **Management** | Low | High | None |
| **Scaling** | Automatic | Manual/ASG | Automatic |
| **Cost** | Pay per task | Pay per hour | Pay per request |
| **Use Case** | Containers | Full control | Event-driven |
| **Cold Start** | ~30s | None | ~1s |
| **Max Runtime** | Unlimited | Unlimited | 15 min |

---

**Next Lesson**: [18-cost-optimization.md](18-cost-optimization.md)
