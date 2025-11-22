# AWS Services Quick Reference

## Compute

| Service | Purpose | Use When | Free Tier |
|---------|---------|----------|-----------|
| **EC2** | Virtual servers | Need full control, long-running apps | 750 hrs/month (t2.micro) |
| **Lambda** | Serverless functions | Event-driven, short tasks (< 15 min) | 1M requests/month |
| **ECS** | Container orchestration | Dockerized apps, microservices | ✗ (but Fargate has pricing) |
| **Fargate** | Serverless containers | Containers without managing servers | ✗ |
| **Elastic Beanstalk** | PaaS | Deploy apps without infrastructure setup | ✗ |

**VahanHelp Example**: EC2/Fargate for backend API, Lambda for image processing

---

## Storage

| Service | Purpose | Use When | Free Tier |
|---------|---------|----------|-----------|
| **S3** | Object storage | Files, images, backups, static sites | 5GB, 20K GET, 2K PUT |
| **EBS** | Block storage | EC2 disk volumes | 30GB |
| **EFS** | File storage | Shared file system across EC2 | 5GB |
| **Glacier** | Archive storage | Long-term backup (cheap) | ✗ |

**VahanHelp Example**: S3 for car images, EBS for EC2 disk

---

## Database

| Service | Purpose | Use When | Free Tier |
|---------|---------|----------|-----------|
| **RDS** | Relational DB (PostgreSQL, MySQL) | ACID transactions, relational data | 750 hrs/month (db.t2.micro) |
| **DynamoDB** | NoSQL DB | High-scale, key-value, flexible schema | 25GB, 25 RCU/WCU |
| **ElastiCache** | In-memory cache (Redis, Memcached) | Caching, sessions, leaderboards | ✗ |
| **Aurora** | MySQL/PostgreSQL compatible | High performance, auto-scaling | ✗ |

**VahanHelp Example**: RDS PostgreSQL for main DB, ElastiCache Redis for caching

---

## Networking

| Service | Purpose | Use When | Free Tier |
|---------|---------|----------|-----------|
| **VPC** | Virtual network | Isolate resources, security | ✓ |
| **Route53** | DNS | Domain management, routing | $0.50/hosted zone |
| **CloudFront** | CDN | Fast content delivery worldwide | 1TB transfer, 10M requests |
| **ELB** | Load balancer | Distribute traffic across servers | 750 hrs/month |
| **API Gateway** | API management | REST/WebSocket APIs | 1M requests/month |

**VahanHelp Example**: Route53 for DNS, CloudFront for CDN, ALB for load balancing

---

## Security & Identity

| Service | Purpose | Use When | Free Tier |
|---------|---------|----------|-----------|
| **IAM** | Users, roles, permissions | Access control | ✓ |
| **Secrets Manager** | Manage secrets | Store DB passwords, API keys | 30-day trial |
| **Systems Manager** | Parameter store | Configuration values | ✓ (10K params) |
| **Certificate Manager** | SSL certificates | HTTPS for custom domains | ✓ |

**VahanHelp Example**: IAM for access, Secrets Manager for DB password, ACM for SSL

---

## Messaging

| Service | Purpose | Use When | Free Tier |
|---------|---------|----------|-----------|
| **SQS** | Message queue | Async processing, decouple services | 1M requests/month |
| **SNS** | Pub/Sub | Fan-out notifications | 1M publishes, 100K HTTP |
| **EventBridge** | Event bus | Event-driven architecture | 14M events/month |

**VahanHelp Example**: SQS for email queue, SNS for admin alerts

---

## Monitoring & Logging

| Service | Purpose | Use When | Free Tier |
|---------|---------|----------|-----------|
| **CloudWatch** | Logs, metrics, alarms | Monitor resources, set alerts | 10 metrics, 5GB logs |
| **CloudTrail** | Audit logs | Track API calls, compliance | 1 trail |
| **X-Ray** | Distributed tracing | Debug microservices | 100K traces/month |

**VahanHelp Example**: CloudWatch for logs/metrics, CloudTrail for security audit

---

## DevOps

| Service | Purpose | Use When | Free Tier |
|---------|---------|----------|-----------|
| **CodePipeline** | CI/CD orchestration | Automate deployments | 1 pipeline/month |
| **CodeBuild** | Build & test | Run tests, build Docker images | 100 build min/month |
| **CodeDeploy** | Deployment | Deploy to EC2/ECS/Lambda | ✓ (EC2/on-prem) |
| **CodeCommit** | Git repository | AWS-managed Git | 5 users, 50GB/month |

**VahanHelp Example**: CodePipeline + CodeBuild + CodeDeploy for CI/CD

---

## Service Selection Guide

### Compute Decision Tree

```
Need to run code?
├─ Event-driven, < 15 min? → Lambda
├─ Containerized?
│  ├─ Manage servers? → ECS on EC2
│  └─ Serverless? → Fargate
├─ Full control needed? → EC2
└─ Just deploy code? → Elastic Beanstalk
```

### Database Decision Tree

```
Need database?
├─ Relational (SQL)?
│  ├─ MySQL/PostgreSQL compatible? → RDS
│  └─ High performance? → Aurora
└─ NoSQL?
   ├─ Key-value, flexible? → DynamoDB
   └─ In-memory cache? → ElastiCache
```

### Storage Decision Tree

```
Need storage?
├─ Files/Images? → S3
├─ EC2 disk? → EBS
├─ Shared file system? → EFS
└─ Archive/Backup? → Glacier
```

---

## Common Patterns

### Pattern 1: Web App (EC2)
```
Users → Route53 → ALB → EC2 (Auto Scaling) → RDS
                       ↓
                  ElastiCache
```

### Pattern 2: Web App (Serverless)
```
Users → Route53 → API Gateway → Lambda → DynamoDB
                                       ↓
                                 ElastiCache
```

### Pattern 3: Web App (Containers)
```
Users → Route53 → ALB → ECS Fargate → RDS
                       ↓           ↓
                  CloudWatch   ElastiCache
```

### Pattern 4: Static Site + API
```
Users → Route53 → CloudFront → S3 (Frontend)
                              ↓
                         ALB → EC2 (Backend API) → RDS
```

### Pattern 5: Event-Driven
```
Upload to S3 → Lambda (process image) → Store in S3
             ↓
         SQS → Lambda (send email)
             ↓
         SNS → Multiple subscribers
```

---

## VahanHelp Complete Architecture

```
┌──────────────────────────────────────────────────────────┐
│                         USERS                            │
└──────────────────┬───────────────────────────────────────┘
                   │
            ┌──────▼──────┐
            │  Route53    │ (DNS: vahanhelp.com)
            └──────┬──────┘
                   │
            ┌──────▼──────────┐
            │   CloudFront    │ (CDN)
            └──────┬──────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼─────┐      ┌─────▼──────┐
    │    S3    │      │    ALB     │
    │ (Static) │      │ (Backend)  │
    └──────────┘      └─────┬──────┘
                            │
                   ┌────────▼────────┐
                   │  Auto Scaling   │
                   │  EC2 / Fargate  │
                   └────────┬────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
         ┌────▼────┐   ┌────▼────┐  ┌────▼────────┐
         │   RDS   │   │  Redis  │  │  Lambda     │
         │(Postgres)│  │ (Cache) │  │ (Jobs)      │
         └─────────┘   └─────────┘  └────┬────────┘
                                          │
                                     ┌────▼────┐
                                     │   SQS   │
                                     │ (Queue) │
                                     └─────────┘
```

---

## Cost Comparison (Monthly)

| Setup | Small (100 users/day) | Medium (10K users/day) | Large (100K users/day) |
|-------|----------------------|------------------------|------------------------|
| **EC2 + RDS** | $34 | $113 | $500 |
| **Fargate + RDS** | $45 | $180 | $941 |
| **Lambda + DynamoDB** | $5 | $25 | $150 |

**Recommendation**:
- **Small**: Lambda + DynamoDB (cheapest)
- **Medium**: EC2 + RDS (balance)
- **Large**: Fargate + Aurora (scalable)

---

## Deployment Checklist

### Production Readiness

- [ ] **Security**
  - [ ] IAM roles configured
  - [ ] Secrets in Secrets Manager
  - [ ] Security groups locked down
  - [ ] SSL certificate on ALB

- [ ] **Reliability**
  - [ ] Multi-AZ deployment
  - [ ] Auto Scaling enabled
  - [ ] Health checks configured
  - [ ] Backup strategy

- [ ] **Monitoring**
  - [ ] CloudWatch logs/metrics
  - [ ] Billing alarms
  - [ ] Error alerts (SNS)
  - [ ] Dashboard created

- [ ] **Performance**
  - [ ] ElastiCache for caching
  - [ ] CloudFront for CDN
  - [ ] Database indexed
  - [ ] Connection pooling

- [ ] **Cost**
  - [ ] Right-sized instances
  - [ ] Reserved Instances (if predictable)
  - [ ] S3 lifecycle policies
  - [ ] Budget alerts

---

## Quick Links

- **Documentation**: https://docs.aws.amazon.com/
- **Free Tier**: https://aws.amazon.com/free/
- **Pricing Calculator**: https://calculator.aws/
- **Well-Architected**: https://aws.amazon.com/architecture/well-architected/
- **Cost Explorer**: https://console.aws.amazon.com/cost-management/
- **Service Health**: https://status.aws.amazon.com/

---

**Pro Tip**: Bookmark this page for quick reference! 🔖
