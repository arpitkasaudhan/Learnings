# Lesson 18: Cost Optimization

## AWS Pricing Basics

**Pay-as-you-go** = Only pay for what you use.

**Main cost drivers**:
- **Compute**: EC2, Lambda, Fargate
- **Storage**: S3, EBS, RDS
- **Data Transfer**: Outbound traffic
- **Databases**: RDS, DynamoDB

---

## Free Tier

### Always Free

- **Lambda**: 1M requests/month
- **DynamoDB**: 25GB storage, 25 WCU/RCU
- **SNS**: 1M publishes
- **CloudWatch**: 10 metrics, 5GB logs

### 12 Months Free

- **EC2**: 750 hours/month (t2.micro/t3.micro)
- **RDS**: 750 hours/month (db.t2.micro)
- **S3**: 5GB storage, 20K GET, 2K PUT
- **ELB**: 750 hours/month

**VahanHelp Estimated Cost** (Free Tier):
```
EC2 (t2.micro): $0
RDS (db.t2.micro): $0
S3 (5GB): $0
ALB: $0 (750 hours)
TOTAL: ~$0/month (first 12 months)
```

---

## Cost Monitoring

### 1. Enable Cost Explorer

```
1. Go to AWS Billing Console
2. Enable Cost Explorer
3. Create custom reports
```

### 2. Set Billing Alarms

```bash
# Create SNS topic
aws sns create-topic --name billing-alerts

# Subscribe email
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:billing-alerts \
  --protocol email \
  --notification-endpoint admin@vahanhelp.com

# Create billing alarm ($50 threshold)
aws cloudwatch put-metric-alarm \
  --alarm-name vahanhelp-billing-alert \
  --alarm-description "Alert when bill exceeds $50" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --threshold 50 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --dimensions Name=Currency,Value=USD \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:billing-alerts
```

### 3. AWS Budgets

```bash
# Create budget ($100/month)
aws budgets create-budget \
  --account-id 123456789012 \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

**budget.json**:
```json
{
  "BudgetName": "VahanHelp Monthly Budget",
  "BudgetLimit": {
    "Amount": "100",
    "Unit": "USD"
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
```

**notifications.json**:
```json
[
  {
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80,
      "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [
      {
        "SubscriptionType": "EMAIL",
        "Address": "admin@vahanhelp.com"
      }
    ]
  }
]
```

---

## EC2 Cost Optimization

### 1. Right-Sizing

**Problem**: Using t2.large but only need t2.micro

```bash
# Check CPU usage
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --statistics Average \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z \
  --period 86400
```

**If average CPU < 20%**: Downgrade to smaller instance

### 2. Reserved Instances (RI)

**Save up to 72%** for 1-year or 3-year commitment

```bash
# Purchase Reserved Instance
aws ec2 purchase-reserved-instances-offering \
  --reserved-instances-offering-id offering-id \
  --instance-count 1
```

**When to use**:
- ✅ Predictable workload (production backend)
- ❌ Unpredictable workload (dev/test)

### 3. Spot Instances

**Save up to 90%** for interruptible workloads

```bash
# Launch Spot instance
aws ec2 request-spot-instances \
  --spot-price "0.05" \
  --instance-count 2 \
  --type "one-time" \
  --launch-specification file://specification.json
```

**When to use**:
- ✅ Batch processing, data analysis, CI/CD workers
- ❌ Production API servers

### 4. Auto Scaling Schedule

**Scale down during off-hours**

```bash
# Scale down at night (1 instance)
aws autoscaling put-scheduled-action \
  --auto-scaling-group-name vahanhelp-asg \
  --scheduled-action-name scale-down-night \
  --recurrence "0 22 * * *" \
  --desired-capacity 1 \
  --min-size 1 \
  --max-size 2

# Scale up during business hours (3 instances)
aws autoscaling put-scheduled-action \
  --auto-scaling-group-name vahanhelp-asg \
  --scheduled-action-name scale-up-morning \
  --recurrence "0 9 * * *" \
  --desired-capacity 3 \
  --min-size 2 \
  --max-size 10
```

**Savings**: If running 24/7 → 8 hours/day = **67% savings**

### 5. Stop Unused Instances

```bash
# Stop dev instances at night
aws ec2 stop-instances --instance-ids i-dev123

# Start in morning
aws ec2 start-instances --instance-ids i-dev123
```

**Automate with Lambda**:
```javascript
// Stop all instances tagged "Environment: Dev" at 6 PM
exports.handler = async () => {
  const ec2 = new AWS.EC2();

  const instances = await ec2.describeInstances({
    Filters: [
      { Name: 'tag:Environment', Values: ['Dev'] },
      { Name: 'instance-state-name', Values: ['running'] }
    ]
  }).promise();

  const instanceIds = instances.Reservations
    .flatMap(r => r.Instances)
    .map(i => i.InstanceId);

  if (instanceIds.length > 0) {
    await ec2.stopInstances({ InstanceIds: instanceIds }).promise();
    console.log('Stopped instances:', instanceIds);
  }
};
```

---

## S3 Cost Optimization

### 1. Storage Classes

```bash
# Standard: Frequent access ($0.023/GB)
# Intelligent-Tiering: Automatic optimization
# Infrequent Access: Rare access ($0.0125/GB)
# Glacier: Archive ($0.004/GB)
```

**Lifecycle Policy**:
```json
{
  "Rules": [
    {
      "Id": "Archive old car images",
      "Status": "Enabled",
      "Prefix": "cars/",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 365,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 1825
      }
    }
  ]
}
```

### 2. Delete Unused Objects

```bash
# Find large files
aws s3 ls s3://vahanhelp-bucket --recursive --human-readable --summarize | sort -rh

# Delete old logs
aws s3 rm s3://vahanhelp-logs/ --recursive --exclude "*" --include "*.log" --older-than 30d
```

### 3. Compress Files

```javascript
// Compress before upload
const zlib = require('zlib');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({ region: 'us-east-1' });

async function uploadCompressed(key, data) {
  const compressed = zlib.gzipSync(JSON.stringify(data));

  await s3.send(new PutObjectCommand({
    Bucket: 'vahanhelp-data',
    Key: key,
    Body: compressed,
    ContentEncoding: 'gzip',
    ContentType: 'application/json'
  }));
}
```

---

## RDS Cost Optimization

### 1. Right-Sizing

```bash
# Check CPU/Memory usage
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name CPUUtilization \
  --dimensions Name=DBInstanceIdentifier,Value=vahanhelp-db
```

**If CPU < 20%**: Downgrade from db.t3.medium to db.t3.small

### 2. Reserved Instances

```bash
# Save 40-60% with 1-year RI
aws rds purchase-reserved-db-instances-offering \
  --reserved-db-instances-offering-id offering-id
```

### 3. Stop Dev Databases

```bash
# Stop database (max 7 days)
aws rds stop-db-instance --db-instance-identifier vahanhelp-dev-db

# Start when needed
aws rds start-db-instance --db-instance-identifier vahanhelp-dev-db
```

### 4. Use Aurora Serverless (v2)

**Auto-scales** based on load (0.5 ACU to 128 ACU)

```bash
aws rds create-db-cluster \
  --db-cluster-identifier vahanhelp-aurora \
  --engine aurora-postgresql \
  --engine-mode provisioned \
  --serverless-v2-scaling-configuration MinCapacity=0.5,MaxCapacity=2
```

**Savings**: Pay only for actual usage (not 24/7)

---

## Lambda Cost Optimization

### 1. Right-Size Memory

```bash
# Test different memory sizes
aws lambda update-function-configuration \
  --function-name image-resize \
  --memory-size 512  # Test: 128, 256, 512, 1024
```

**Trade-off**: More memory = faster execution but higher cost per ms

### 2. Reduce Package Size

```bash
# Before: 50MB (node_modules)
# After: 5MB (production only + layer)

# Install production only
npm install --production

# Use Lambda Layers for shared dependencies
aws lambda publish-layer-version \
  --layer-name sharp-layer \
  --zip-file fileb://sharp-layer.zip \
  --compatible-runtimes nodejs18.x
```

### 3. Connection Pooling

```javascript
// ❌ Bad: New connection every invocation
exports.handler = async (event) => {
  const db = new Pool({ connectionString: process.env.DATABASE_URL });
  const result = await db.query('SELECT * FROM users');
  await db.end();
  return result;
};

// ✅ Good: Reuse connection
const db = new Pool({ connectionString: process.env.DATABASE_URL });

exports.handler = async (event) => {
  const result = await db.query('SELECT * FROM users');
  return result;
};
```

---

## Data Transfer Optimization

### 1. Use CloudFront

**Problem**: Users downloading images directly from S3 (expensive data transfer)
**Solution**: Use CloudFront (cheaper + faster)

```
S3 Data Transfer: $0.09/GB
CloudFront: $0.085/GB + caching
```

### 2. Avoid Cross-Region Transfer

```bash
# ❌ Expensive: EC2 in us-east-1 → S3 in eu-west-1
# ✅ Free: EC2 in us-east-1 → S3 in us-east-1
```

### 3. VPC Endpoints

**Avoid NAT Gateway charges** when accessing S3/DynamoDB

```bash
# Create S3 VPC Endpoint (free)
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-123 \
  --service-name com.amazonaws.us-east-1.s3 \
  --route-table-ids rtb-123
```

**Savings**: $0.045/GB NAT Gateway charges → $0

---

## Complete Cost Optimization Checklist

### Compute
- [ ] Right-size EC2 instances based on CloudWatch metrics
- [ ] Use Reserved Instances for production (40-72% savings)
- [ ] Use Spot Instances for batch jobs (up to 90% savings)
- [ ] Stop dev/test instances during off-hours
- [ ] Set up Auto Scaling with scheduled actions
- [ ] Consider Fargate Spot for ECS workloads

### Storage
- [ ] Enable S3 Intelligent-Tiering or Lifecycle Policies
- [ ] Delete old logs and unused files
- [ ] Compress data before uploading to S3
- [ ] Use CloudFront to reduce S3 data transfer
- [ ] Right-size EBS volumes

### Database
- [ ] Right-size RDS instances
- [ ] Use Reserved Instances for production databases
- [ ] Stop dev databases when not in use
- [ ] Enable automated backups (delete old snapshots)
- [ ] Consider Aurora Serverless for variable workloads

### Networking
- [ ] Use VPC Endpoints to avoid NAT Gateway charges
- [ ] Minimize cross-region data transfer
- [ ] Use CloudFront for static assets
- [ ] Enable S3 Transfer Acceleration only if needed

### Monitoring
- [ ] Set up billing alarms (CloudWatch)
- [ ] Create monthly budgets with alerts
- [ ] Enable Cost Explorer
- [ ] Tag all resources for cost allocation
- [ ] Review AWS Cost Anomaly Detection

---

## VahanHelp Production Cost Estimate

### Scenario 1: Small (100 users/day)

```
EC2 t3.micro (Reserved 1yr): $5/month
RDS db.t3.micro (Reserved 1yr): $8/month
S3 (10GB): $0.23/month
CloudFront (50GB transfer): $4.25/month
ALB: $16/month
Route53: $0.50/month
TOTAL: ~$34/month
```

### Scenario 2: Medium (10,000 users/day)

```
EC2 t3.small x2 (Reserved 1yr): $15/month
RDS db.t3.small (Reserved 1yr): $25/month
S3 (100GB): $2.30/month
CloudFront (500GB transfer): $42.50/month
ALB: $16/month
ElastiCache t3.micro: $12/month
Lambda (1M requests): $0.20/month
TOTAL: ~$113/month
```

### Scenario 3: Large (100,000 users/day)

```
ECS Fargate (4 tasks): $120/month
RDS db.r5.large (Reserved 1yr): $200/month
S3 (1TB): $23/month
CloudFront (5TB transfer): $425/month
ALB: $16/month
ElastiCache r5.large: $150/month
Lambda (10M requests): $2/month
CloudWatch Logs: $5/month
TOTAL: ~$941/month
```

---

## Monitoring & Alerts

```javascript
// Lambda: Daily cost report
const { CostExplorerClient, GetCostAndUsageCommand } = require('@aws-sdk/client-cost-explorer');

exports.handler = async () => {
  const ce = new CostExplorerClient({ region: 'us-east-1' });

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const end = today.toISOString().split('T')[0];

  const result = await ce.send(new GetCostAndUsageCommand({
    TimePeriod: { Start: start, End: end },
    Granularity: 'MONTHLY',
    Metrics: ['UnblendedCost'],
    GroupBy: [{ Type: 'SERVICE', Key: 'SERVICE' }]
  }));

  const costs = result.ResultsByTime[0].Groups;
  const totalCost = costs.reduce((sum, g) => sum + parseFloat(g.Metrics.UnblendedCost.Amount), 0);

  console.log(`Total cost this month: $${totalCost.toFixed(2)}`);
  costs.forEach(g => {
    console.log(`${g.Keys[0]}: $${parseFloat(g.Metrics.UnblendedCost.Amount).toFixed(2)}`);
  });

  // Send to Slack if over budget
  if (totalCost > 100) {
    await sendSlackAlert(`⚠️ AWS cost is $${totalCost.toFixed(2)} (budget: $100)`);
  }
};
```

---

## Best Practices

1. **Tag everything**: Use tags for cost allocation
2. **Monitor daily**: Review Cost Explorer weekly
3. **Set budgets**: Alert at 80% threshold
4. **Clean up**: Delete unused resources (snapshots, volumes, IPs)
5. **Use Free Tier**: Maximize free services first
6. **Reserved Instances**: Buy for production workloads
7. **Serverless first**: Lambda/Fargate for variable workloads
8. **Right-size**: Start small, scale up as needed

---

## Congratulations!

You've completed the AWS learning guide! 🎉

**What you learned**:
- ✅ AWS fundamentals (IAM, EC2, S3, RDS)
- ✅ Networking (VPC, Route53, Load Balancer)
- ✅ Scaling (Auto Scaling, CloudFront, ElastiCache)
- ✅ Serverless (Lambda, Fargate)
- ✅ DevOps (CI/CD, ECS, Monitoring)
- ✅ Cost optimization

**Next steps**:
1. Deploy VahanHelp on AWS
2. Set up complete CI/CD pipeline
3. Implement monitoring and alerts
4. Optimize costs
5. Get AWS Certified (Solutions Architect Associate)

**Resources**:
- [AWS Free Tier](https://aws.amazon.com/free/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Cost Calculator](https://calculator.aws/)
- [AWS Certification](https://aws.amazon.com/certification/)

---

**Congratulations!** You're now ready to build and deploy production-ready backends on AWS! 🚀
