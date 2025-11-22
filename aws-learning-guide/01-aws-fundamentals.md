# Lesson 01: AWS Fundamentals

## What is AWS?

**Amazon Web Services (AWS)** is the world's most comprehensive cloud computing platform.

**Founded**: 2006
**Services**: 200+ services
**Regions**: 30+ geographic regions worldwide
**Customers**: Netflix, Airbnb, NASA, LinkedIn

---

## What is Cloud Computing?

**Cloud Computing**: Delivery of computing services over the internet.

### Traditional IT vs Cloud

**Traditional (On-Premises)**:
- Buy physical servers
- Maintain data centers
- Pay upfront costs
- Limited scalability
- Your responsibility: hardware, software, security, maintenance

**Cloud (AWS)**:
- Rent computing resources
- Pay only for what you use
- Scale instantly
- AWS manages infrastructure
- You focus on your application

---

## Cloud Computing Models

### 1. IaaS (Infrastructure as a Service)
**You manage**: Applications, Data, Runtime, Middleware, OS
**AWS manages**: Virtualization, Servers, Storage, Networking

**Examples**: EC2, S3, VPC

### 2. PaaS (Platform as a Service)
**You manage**: Applications, Data
**AWS manages**: Everything else

**Examples**: Elastic Beanstalk, RDS, Lambda

### 3. SaaS (Software as a Service)
**You manage**: Just use the application
**AWS manages**: Everything

**Examples**: Gmail, Salesforce, Office 365

---

## AWS Global Infrastructure

### Regions
- Geographic locations (e.g., us-east-1, ap-south-1)
- Multiple data centers
- Choose region closest to users (low latency)

### Availability Zones (AZ)
- Isolated data centers within a region
- Each region has 2-6 AZs
- Deploy across multiple AZs for high availability

### Edge Locations
- CloudFront CDN endpoints
- 400+ edge locations worldwide
- Cache content closer to users

---

## Core AWS Services

### Compute
- **EC2**: Virtual servers
- **Lambda**: Serverless functions
- **ECS**: Container orchestration

### Storage
- **S3**: Object storage
- **EBS**: Block storage
- **Glacier**: Archive storage

### Database
- **RDS**: Relational database
- **DynamoDB**: NoSQL database
- **ElastiCache**: In-memory cache

### Networking
- **VPC**: Virtual Private Cloud
- **Route53**: DNS service
- **CloudFront**: CDN

---

## AWS Account Setup

### Step 1: Create Account
1. Go to aws.amazon.com
2. Click "Create an AWS Account"
3. Enter email, password, account name
4. Provide payment information (required)
5. Verify phone number
6. Choose support plan (Free/Basic)

### Step 2: Sign In to Console
1. Go to console.aws.amazon.com
2. Sign in with root account
3. Explore AWS Management Console

### Step 3: Set Up Billing Alerts
```
1. Go to Billing Dashboard
2. Click "Billing Preferences"
3. Enable "Receive Free Tier Usage Alerts"
4. Enter email address
5. Save preferences
```

### Step 4: Enable MFA (Multi-Factor Authentication)
```
1. Go to IAM Dashboard
2. Click "Activate MFA on root account"
3. Choose Virtual MFA device
4. Scan QR code with app (Google Authenticator, Authy)
5. Enter two consecutive codes
6. Activate MFA
```

---

## AWS Pricing

### Pay-As-You-Go
- No upfront costs
- Pay only for what you use
- Stop paying when you stop using

### Free Tier
**12 Months Free** (from signup):
- EC2: 750 hours/month
- S3: 5GB storage
- RDS: 750 hours/month

**Always Free**:
- Lambda: 1M requests/month
- DynamoDB: 25GB storage
- CloudWatch: 10 metrics

### Pricing Example (EC2)
```
t2.micro (Free Tier eligible):
- 1 vCPU, 1GB RAM
- $0.0116/hour = ~$8.50/month
- FREE for first 750 hours/month (12 months)
```

---

## AWS Management Tools

### 1. AWS Management Console
- Web-based interface
- Visual and intuitive
- Best for beginners

### 2. AWS CLI (Command Line Interface)
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure
aws configure
AWS Access Key ID: YOUR_KEY
AWS Secret Access Key: YOUR_SECRET
Default region: us-east-1
Default output format: json

# Test
aws s3 ls
```

### 3. AWS SDKs
- Node.js SDK (aws-sdk, @aws-sdk/client-*)
- Python (boto3)
- Java, .NET, Go, Ruby, PHP

```javascript
// Node.js SDK v3
const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({ region: "us-east-1" });
const command = new ListBucketsCommand({});
const response = await client.send(command);
```

---

## VahanHelp on AWS - Overview

**Architecture**:
```
Users → Route53 (DNS) → CloudFront (CDN) → 
  ├─ S3 (Images, Static Files)
  └─ Load Balancer → EC2 Instances (Backend) → RDS (Database)
```

**Services We'll Use**:
1. EC2 - Run Node.js backend
2. S3 - Store car images
3. RDS - PostgreSQL database
4. VPC - Network isolation
5. Load Balancer - Distribute traffic
6. Auto Scaling - Handle traffic spikes
7. CloudFront - Fast content delivery
8. Route53 - Custom domain
9. CloudWatch - Monitoring
10. CI/CD - Automated deployment

---

## AWS Well-Architected Framework

### 6 Pillars

**1. Operational Excellence**
- Automate changes
- Respond to events
- Define standards

**2. Security**
- Protect information
- Enable traceability
- Automate security

**3. Reliability**
- Recover from failures
- Scale dynamically
- Test disaster recovery

**4. Performance Efficiency**
- Select right resources
- Monitor performance
- Stay updated

**5. Cost Optimization**
- Avoid unnecessary costs
- Measure efficiency
- Use managed services

**6. Sustainability**
- Minimize environmental impact
- Maximize utilization
- Optimize workloads

---

## Key Concepts

### Resource
- Any AWS entity (EC2 instance, S3 bucket, etc.)
- Has unique Amazon Resource Name (ARN)

### Region
- Geographic area with multiple AZs
- Example: us-east-1 (Virginia), ap-south-1 (Mumbai)

### Availability Zone
- Isolated location within region
- Example: us-east-1a, us-east-1b

### Tags
- Key-value pairs for organizing resources
- Example: Environment: Production, Project: VahanHelp

---

## Best Practices

### 1. Use IAM (Never use root account)
✅ Create IAM users for daily tasks
✅ Enable MFA on all accounts
✅ Use roles instead of access keys

### 2. Choose Right Region
✅ Closest to users
✅ Consider data sovereignty laws
✅ Check service availability

### 3. Design for Failure
✅ Use multiple AZs
✅ Regular backups
✅ Test disaster recovery

### 4. Monitor Everything
✅ Enable CloudWatch
✅ Set up billing alerts
✅ Use CloudTrail for auditing

### 5. Secure by Default
✅ Principle of least privilege
✅ Encrypt data at rest and in transit
✅ Use private subnets for databases

---

## Common Mistakes to Avoid

❌ Using root account for daily tasks
❌ Not setting billing alerts
❌ Leaving resources running (costs money!)
❌ Not using multiple AZs
❌ Hardcoding AWS credentials
❌ Not tagging resources
❌ Ignoring security best practices

---

## Practice Exercise

### Exercise 1: Explore AWS Console
1. Sign in to AWS Console
2. Visit each service page
3. Check Free Tier eligible services
4. Review billing dashboard

### Exercise 2: Set Up Billing Alert
1. Go to CloudWatch
2. Create alarm for estimated charges
3. Set threshold: $10
4. Add email notification

### Exercise 3: Explore Regions
1. Check available regions
2. Compare service availability
3. Note latency to different regions

---

## Key Takeaways

✅ **AWS** = World's leading cloud platform
✅ **Pay-as-you-go** pricing model
✅ **Free Tier** available for 12 months
✅ **Regions & AZs** for global reach
✅ **200+ services** for every need
✅ **Security first** - enable MFA, use IAM
✅ **Cost management** - set billing alerts

---

## What's Next?

Now that you understand AWS basics, let's secure your account with IAM!

**Next Lesson**: [02-iam-security.md](02-iam-security.md)

---

**Remember**: AWS offers a Free Tier - use it to learn without worrying about costs!

**Let's build on AWS! ☁️🚀**
