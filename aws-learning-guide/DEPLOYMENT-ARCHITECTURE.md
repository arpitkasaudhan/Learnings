# VahanHelp AWS Deployment Architectures

## Overview

This guide shows different AWS deployment architectures for VahanHelp, from simple (dev) to production-ready.

---

## Architecture 1: Minimal (Development)

**Cost**: ~$0/month (Free Tier)
**Scalability**: Low
**Availability**: Single AZ

```
┌──────────┐
│  Users   │
└────┬─────┘
     │
┌────▼──────┐
│  Route53  │ (DNS)
└────┬──────┘
     │
┌────▼──────┐
│    EC2    │ (t2.micro)
│  Backend  │ - Node.js app
│           │ - SQLite DB (local)
└───────────┘
```

### Setup Commands

```bash
# 1. Launch EC2
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name vahanhelp-key \
  --security-group-ids sg-web

# 2. SSH and deploy
ssh -i vahanhelp-key.pem ec2-user@EC2_IP
git clone https://github.com/vahanhelp/backend.git
cd backend
npm install
pm2 start src/server.js
```

### Pros
- ✅ Free (Free Tier)
- ✅ Simple setup
- ✅ Good for learning

### Cons
- ❌ No redundancy
- ❌ No auto-scaling
- ❌ Manual deployment

---

## Architecture 2: Basic Production

**Cost**: ~$34/month
**Scalability**: Medium
**Availability**: Multi-AZ

```
┌──────────────┐
│    Users     │
└──────┬───────┘
       │
┌──────▼──────┐
│  Route53    │ (vahanhelp.com)
└──────┬──────┘
       │
┌──────▼──────┐
│ CloudFront  │ (CDN)
└──────┬──────┘
       │
    ┌──┴──┐
    │     │
┌───▼─┐ ┌─▼───┐
│ S3  │ │ ALB │
│React│ │     │
└─────┘ └──┬──┘
           │
      ┌────▼────┐
      │   EC2   │ (Auto Scaling: 2-4 instances)
      │ Backend │ (t3.micro)
      └────┬────┘
           │
      ┌────▼────┐
      │   RDS   │ (PostgreSQL, db.t3.micro)
      │         │ (Multi-AZ)
      └─────────┘
```

### Setup

```bash
# 1. Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# 2. Create subnets (2 AZs)
aws ec2 create-subnet --vpc-id vpc-123 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-123 --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

# 3. Create RDS
aws rds create-db-instance \
  --db-instance-identifier vahanhelp-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --allocated-storage 20 \
  --multi-az

# 4. Create ALB
aws elbv2 create-load-balancer \
  --name vahanhelp-alb \
  --subnets subnet-123 subnet-456

# 5. Create Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name vahanhelp-asg \
  --min-size 2 \
  --max-size 4 \
  --desired-capacity 2

# 6. Deploy frontend to S3
npm run build
aws s3 sync ./build s3://vahanhelp-frontend

# 7. Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name vahanhelp-frontend.s3.amazonaws.com
```

### Pros
- ✅ High availability (Multi-AZ)
- ✅ Auto-scaling
- ✅ CDN for fast delivery
- ✅ Managed database

### Cons
- ❌ Manual deployments
- ❌ No caching
- ❌ No CI/CD

---

## Architecture 3: Full Production (Recommended)

**Cost**: ~$113/month
**Scalability**: High
**Availability**: Multi-AZ + Auto Scaling

```
                    ┌──────────┐
                    │  Users   │
                    └─────┬────┘
                          │
                    ┌─────▼─────┐
                    │  Route53  │ (DNS + Health Checks)
                    └─────┬─────┘
                          │
                    ┌─────▼─────┐
                    │CloudFront │ (CDN - Global Edge)
                    └─────┬─────┘
                          │
                 ┌────────┴────────┐
                 │                 │
            ┌────▼────┐      ┌─────▼────┐
            │   S3    │      │   WAF    │ (Firewall)
            │ (React) │      └─────┬────┘
            └─────────┘            │
                              ┌────▼────┐
                              │   ALB   │ (Load Balancer)
                              └────┬────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                    ┌────▼────┐         ┌────▼────┐
                    │   EC2   │         │   EC2   │
                    │(us-e-1a)│         │(us-e-1b)│
                    │ Backend │         │ Backend │
                    └────┬────┘         └────┬────┘
                         │                   │
                         └─────────┬─────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
               ┌────▼────┐    ┌────▼────┐   ┌────▼────┐
               │   RDS   │    │  Redis  │   │   SQS   │
               │(Postgres)│   │ (Cache) │   │ (Queue) │
               │ Multi-AZ│    │         │   └────┬────┘
               └────┬────┘    └─────────┘        │
                    │                        ┌────▼────┐
               ┌────▼────┐                   │ Lambda  │
               │ RDS Read│                   │ Workers │
               │ Replica │                   └─────────┘
               └─────────┘

Monitoring:
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ CloudWatch   │    │  CloudTrail  │    │     SNS      │
│ Logs/Metrics │    │ Audit Logs   │    │ Alerts/Email │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Setup Steps

#### 1. Network Layer (VPC)

```bash
# Create VPC
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)

# Create Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID

# Create subnets (2 public, 2 private)
PUB_SUBNET_1=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --query 'Subnet.SubnetId' --output text)
PUB_SUBNET_2=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone us-east-1b --query 'Subnet.SubnetId' --output text)
PRIV_SUBNET_1=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.3.0/24 --availability-zone us-east-1a --query 'Subnet.SubnetId' --output text)
PRIV_SUBNET_2=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.4.0/24 --availability-zone us-east-1b --query 'Subnet.SubnetId' --output text)

# Create NAT Gateway
EIP_ID=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
NAT_ID=$(aws ec2 create-nat-gateway --subnet-id $PUB_SUBNET_1 --allocation-id $EIP_ID --query 'NatGateway.NatGatewayId' --output text)
```

#### 2. Database Layer

```bash
# Create RDS subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name vahanhelp-db-subnet \
  --db-subnet-group-description "VahanHelp DB Subnet" \
  --subnet-ids $PRIV_SUBNET_1 $PRIV_SUBNET_2

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier vahanhelp-db \
  --db-instance-class db.t3.small \
  --engine postgres \
  --engine-version 15.3 \
  --master-username postgres \
  --master-user-password $(aws secretsmanager get-secret-value --secret-id db-password --query SecretString --output text) \
  --allocated-storage 100 \
  --storage-type gp3 \
  --multi-az \
  --db-subnet-group-name vahanhelp-db-subnet \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00"

# Create read replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier vahanhelp-db-read \
  --source-db-instance-identifier vahanhelp-db \
  --db-instance-class db.t3.small
```

#### 3. Cache Layer

```bash
# Create ElastiCache subnet group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name vahanhelp-cache-subnet \
  --cache-subnet-group-description "VahanHelp Cache Subnet" \
  --subnet-ids $PRIV_SUBNET_1 $PRIV_SUBNET_2

# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id vahanhelp-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --cache-subnet-group-name vahanhelp-cache-subnet
```

#### 4. Compute Layer (EC2 Auto Scaling)

```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name vahanhelp-backend-template \
  --version-description v1 \
  --launch-template-data file://launch-template.json

# Create Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name vahanhelp-asg \
  --launch-template LaunchTemplateName=vahanhelp-backend-template \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --vpc-zone-identifier "$PRIV_SUBNET_1,$PRIV_SUBNET_2" \
  --target-group-arns $TARGET_GROUP_ARN \
  --health-check-type ELB \
  --health-check-grace-period 300

# Create scaling policies
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name vahanhelp-asg \
  --policy-name cpu-target-tracking \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration file://scaling-policy.json
```

#### 5. Load Balancer

```bash
# Create ALB
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name vahanhelp-alb \
  --subnets $PUB_SUBNET_1 $PUB_SUBNET_2 \
  --security-groups $ALB_SG \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# Create target group
TARGET_GROUP_ARN=$(aws elbv2 create-target-group \
  --name vahanhelp-backend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id $VPC_ID \
  --health-check-path /api/health \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# Create listener (HTTPS)
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=$CERT_ARN \
  --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN
```

#### 6. Storage (S3)

```bash
# Frontend bucket
aws s3 mb s3://vahanhelp-frontend
aws s3 website s3://vahanhelp-frontend/ \
  --index-document index.html \
  --error-document index.html

# Images bucket
aws s3 mb s3://vahanhelp-car-images
aws s3api put-bucket-lifecycle-configuration \
  --bucket vahanhelp-car-images \
  --lifecycle-configuration file://lifecycle.json
```

#### 7. CDN (CloudFront)

```bash
# Create distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

#### 8. Messaging (SQS)

```bash
# Create queues
aws sqs create-queue --queue-name vahanhelp-email-queue
aws sqs create-queue --queue-name vahanhelp-notifications-queue
aws sqs create-queue --queue-name vahanhelp-analytics-queue
```

#### 9. Monitoring

```bash
# Create SNS topic for alerts
SNS_ARN=$(aws sns create-topic --name vahanhelp-alerts --query 'TopicArn' --output text)
aws sns subscribe --topic-arn $SNS_ARN --protocol email --notification-endpoint admin@vahanhelp.com

# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name vahanhelp-high-cpu \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions $SNS_ARN
```

### Deployment Process

```bash
# 1. Developer pushes code to GitHub
git push origin main

# 2. CodePipeline detects change
# (Automatically triggers)

# 3. CodeBuild runs tests and builds
# - npm install
# - npm test
# - docker build

# 4. CodeDeploy deploys to EC2
# - Blue/Green deployment
# - Health checks
# - Traffic shift

# 5. Monitoring
# - CloudWatch metrics
# - Error alerts
```

### Pros
- ✅ High availability (99.99%)
- ✅ Auto-scaling (2-10 instances)
- ✅ Caching (Redis)
- ✅ Read replicas
- ✅ CI/CD pipeline
- ✅ Monitoring & alerts

### Cons
- ❌ Higher cost ($113/month)
- ❌ More complex setup

---

## Architecture 4: Serverless (Future-Proof)

**Cost**: ~$25/month (scales with traffic)
**Scalability**: Unlimited
**Availability**: Multi-region

```
┌──────────┐
│  Users   │
└────┬─────┘
     │
┌────▼─────┐
│ Route53  │
└────┬─────┘
     │
┌────▼──────┐
│CloudFront │
└────┬──────┘
     │
  ┌──┴──┐
  │     │
┌─▼─┐ ┌─▼────────┐
│S3 │ │   API    │
│   │ │ Gateway  │
└───┘ └────┬─────┘
           │
      ┌────▼────┐
      │ Lambda  │ (Node.js Functions)
      └────┬────┘
           │
    ┌──────┼──────┐
    │      │      │
┌───▼──┐ ┌─▼───┐ ┌▼────┐
│DynamoDB│ │Redis│ │ SQS │
└────────┘ └─────┘ └─────┘
```

### Setup

```bash
# 1. Create Lambda function
aws lambda create-function \
  --function-name vahanhelp-api \
  --runtime nodejs18.x \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --role $LAMBDA_ROLE

# 2. Create API Gateway
aws apigatewayv2 create-api \
  --name vahanhelp-api \
  --protocol-type HTTP \
  --target arn:aws:lambda:us-east-1:123456789012:function:vahanhelp-api

# 3. Create DynamoDB table
aws dynamodb create-table \
  --table-name VahanHelp \
  --attribute-definitions AttributeName=pk,AttributeType=S AttributeName=sk,AttributeType=S \
  --key-schema AttributeName=pk,KeyType=HASH AttributeName=sk,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### Pros
- ✅ Ultra-low cost (pay per request)
- ✅ Infinite scalability
- ✅ Zero server management
- ✅ Auto-scaling built-in

### Cons
- ❌ Cold starts (~1s)
- ❌ 15-minute timeout limit
- ❌ Vendor lock-in

---

## Architecture 5: Microservices (Enterprise)

**Cost**: ~$500+/month
**Scalability**: Very High
**Availability**: Multi-region

```
              ┌────────────┐
              │   Users    │
              └──────┬─────┘
                     │
              ┌──────▼──────┐
              │   Route53   │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │     ALB     │
              └──────┬──────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼────┐  ┌───▼────┐  ┌────▼─────┐
   │ ECS     │  │  ECS   │  │   ECS    │
   │ Auth    │  │ Cars   │  │Insurance │
   │ Service │  │Service │  │ Service  │
   └────┬────┘  └───┬────┘  └────┬─────┘
        │           │            │
        └───────────┼────────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
    ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
    │  RDS   │ │ Redis  │ │  SQS   │
    │        │ │        │ │        │
    └────────┘ └────────┘ └────────┘
```

### Services

1. **Auth Service**: User authentication, JWT tokens
2. **Cars Service**: Car listings, search, filters
3. **Insurance Service**: Quotes, policies, claims
4. **Payment Service**: Stripe, payment processing
5. **Notification Service**: Email, SMS, push notifications

### Pros
- ✅ Independent scaling
- ✅ Technology flexibility
- ✅ Fault isolation
- ✅ Team autonomy

### Cons
- ❌ Complex deployment
- ❌ Higher operational overhead
- ❌ More expensive

---

## Comparison Table

| Feature | Minimal | Basic Prod | Full Prod | Serverless | Microservices |
|---------|---------|------------|-----------|------------|---------------|
| **Cost/month** | $0 | $34 | $113 | $25 | $500+ |
| **Availability** | 95% | 99.5% | 99.99% | 99.99% | 99.99% |
| **Auto-scaling** | ✗ | ✓ | ✓ | ✓ | ✓ |
| **Multi-AZ** | ✗ | ✓ | ✓ | ✓ | ✓ |
| **CI/CD** | ✗ | ✗ | ✓ | ✓ | ✓ |
| **Monitoring** | Basic | Good | Excellent | Excellent | Excellent |
| **Complexity** | Low | Medium | High | Medium | Very High |

---

## Recommended Path

**For VahanHelp**:

1. **MVP (Month 1-3)**: Start with **Minimal** architecture for development
2. **Launch (Month 4-6)**: Move to **Basic Production** for initial users
3. **Growth (Month 7-12)**: Upgrade to **Full Production** as user base grows
4. **Scale (Year 2+)**: Consider **Serverless** or **Microservices** for high traffic

---

**Pro Tip**: Always start simple and scale as needed. Don't over-engineer early! 🚀
