# AWS CLI Commands Cheatsheet

## Setup & Configuration

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: us-east-1
# Default output format: json

# Configure named profile
aws configure --profile vahanhelp

# Use profile
aws s3 ls --profile vahanhelp
export AWS_PROFILE=vahanhelp

# Check current identity
aws sts get-caller-identity

# List regions
aws ec2 describe-regions --output table
```

---

## IAM (Identity & Access Management)

```bash
# List users
aws iam list-users

# Create user
aws iam create-user --user-name vahanhelp-dev

# Create access key
aws iam create-access-key --user-name vahanhelp-dev

# Attach policy to user
aws iam attach-user-policy \
  --user-name vahanhelp-dev \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# List policies attached to user
aws iam list-attached-user-policies --user-name vahanhelp-dev

# Create role
aws iam create-role \
  --role-name EC2-S3-Access \
  --assume-role-policy-document file://trust-policy.json

# Attach policy to role
aws iam attach-role-policy \
  --role-name EC2-S3-Access \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Delete user
aws iam delete-user --user-name vahanhelp-dev
```

---

## EC2 (Virtual Servers)

```bash
# List instances
aws ec2 describe-instances

# List instances (filtered)
aws ec2 describe-instances \
  --filters "Name=tag:Environment,Values=Production" \
  --query "Reservations[].Instances[].[InstanceId,State.Name,PublicIpAddress]" \
  --output table

# Launch instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name vahanhelp-key \
  --security-group-ids sg-123456 \
  --subnet-id subnet-123456 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=VahanHelp-Backend}]'

# Start instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0

# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# Terminate instance
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0

# Create security group
aws ec2 create-security-group \
  --group-name vahanhelp-backend-sg \
  --description "VahanHelp Backend Security Group" \
  --vpc-id vpc-123456

# Add inbound rule
aws ec2 authorize-security-group-ingress \
  --group-id sg-123456 \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0

# Create key pair
aws ec2 create-key-pair --key-name vahanhelp-key --query 'KeyMaterial' --output text > vahanhelp-key.pem
chmod 400 vahanhelp-key.pem

# Get instance metadata (from within EC2)
curl http://169.254.169.254/latest/meta-data/
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

---

## S3 (Object Storage)

```bash
# List buckets
aws s3 ls

# Create bucket
aws s3 mb s3://vahanhelp-car-images

# List objects in bucket
aws s3 ls s3://vahanhelp-car-images
aws s3 ls s3://vahanhelp-car-images/cars/ --recursive

# Upload file
aws s3 cp image.jpg s3://vahanhelp-car-images/cars/
aws s3 cp ./images/ s3://vahanhelp-car-images/cars/ --recursive

# Download file
aws s3 cp s3://vahanhelp-car-images/cars/image.jpg ./

# Sync directory
aws s3 sync ./build s3://vahanhelp-frontend

# Delete file
aws s3 rm s3://vahanhelp-car-images/cars/image.jpg

# Delete all objects
aws s3 rm s3://vahanhelp-car-images --recursive

# Delete bucket
aws s3 rb s3://vahanhelp-car-images --force

# Set bucket policy
aws s3api put-bucket-policy \
  --bucket vahanhelp-car-images \
  --policy file://bucket-policy.json

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket vahanhelp-car-images \
  --versioning-configuration Status=Enabled

# Enable static website
aws s3 website s3://vahanhelp-frontend/ \
  --index-document index.html \
  --error-document error.html

# Get object size
aws s3 ls s3://vahanhelp-car-images --recursive --summarize --human-readable
```

---

## RDS (Relational Database)

```bash
# List DB instances
aws rds describe-db-instances

# Create DB instance
aws rds create-db-instance \
  --db-instance-identifier vahanhelp-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YourPassword123 \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-123456 \
  --db-subnet-group-name vahanhelp-subnet-group \
  --backup-retention-period 7 \
  --publicly-accessible

# Get DB endpoint
aws rds describe-db-instances \
  --db-instance-identifier vahanhelp-db \
  --query "DBInstances[0].Endpoint.Address" \
  --output text

# Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier vahanhelp-db \
  --db-snapshot-identifier vahanhelp-backup-2024-01-15

# List snapshots
aws rds describe-db-snapshots --db-instance-identifier vahanhelp-db

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier vahanhelp-db-restored \
  --db-snapshot-identifier vahanhelp-backup-2024-01-15

# Stop DB instance
aws rds stop-db-instance --db-instance-identifier vahanhelp-db

# Start DB instance
aws rds start-db-instance --db-instance-identifier vahanhelp-db

# Delete DB instance
aws rds delete-db-instance \
  --db-instance-identifier vahanhelp-db \
  --skip-final-snapshot
```

---

## Lambda (Serverless)

```bash
# List functions
aws lambda list-functions

# Create function
aws lambda create-function \
  --function-name image-resize \
  --runtime nodejs18.x \
  --role arn:aws:iam::123456789012:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://function.zip

# Update function code
aws lambda update-function-code \
  --function-name image-resize \
  --zip-file fileb://function.zip

# Invoke function
aws lambda invoke \
  --function-name image-resize \
  --payload '{"key": "value"}' \
  response.json

# Get function logs
aws logs tail /aws/lambda/image-resize --follow

# Add environment variables
aws lambda update-function-configuration \
  --function-name image-resize \
  --environment "Variables={BUCKET=vahanhelp-images,REGION=us-east-1}"

# Delete function
aws lambda delete-function --function-name image-resize
```

---

## ECS (Container Orchestration)

```bash
# List clusters
aws ecs list-clusters

# Create cluster
aws ecs create-cluster --cluster-name vahanhelp-production

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# List task definitions
aws ecs list-task-definitions

# Create service
aws ecs create-service \
  --cluster vahanhelp-production \
  --service-name vahanhelp-backend \
  --task-definition vahanhelp-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE

# Update service
aws ecs update-service \
  --cluster vahanhelp-production \
  --service vahanhelp-backend \
  --desired-count 3

# List services
aws ecs list-services --cluster vahanhelp-production

# Describe service
aws ecs describe-services \
  --cluster vahanhelp-production \
  --services vahanhelp-backend

# List tasks
aws ecs list-tasks --cluster vahanhelp-production

# Stop task
aws ecs stop-task \
  --cluster vahanhelp-production \
  --task arn:aws:ecs:us-east-1:123456789012:task/abc123

# Delete service
aws ecs delete-service \
  --cluster vahanhelp-production \
  --service vahanhelp-backend \
  --force
```

---

## ECR (Container Registry)

```bash
# Create repository
aws ecr create-repository --repository-name vahanhelp-backend

# List repositories
aws ecr describe-repositories

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# Tag and push image
docker tag vahanhelp-backend:latest \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/vahanhelp-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/vahanhelp-backend:latest

# List images
aws ecr list-images --repository-name vahanhelp-backend

# Delete image
aws ecr batch-delete-image \
  --repository-name vahanhelp-backend \
  --image-ids imageTag=latest

# Delete repository
aws ecr delete-repository --repository-name vahanhelp-backend --force
```

---

## CloudWatch (Monitoring)

```bash
# List log groups
aws logs describe-log-groups

# Create log group
aws logs create-log-group --log-group-name /vahanhelp/backend

# Tail logs
aws logs tail /vahanhelp/backend --follow

# Filter logs
aws logs filter-log-events \
  --log-group-name /vahanhelp/backend \
  --filter-pattern "ERROR"

# Put metric data
aws cloudwatch put-metric-data \
  --namespace VahanHelp/Business \
  --metric-name QuoteRequests \
  --value 1 \
  --dimensions Service=Insurance

# List metrics
aws cloudwatch list-metrics --namespace VahanHelp/Business

# Get metric statistics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --start-time 2024-01-15T00:00:00Z \
  --end-time 2024-01-15T23:59:59Z \
  --period 3600 \
  --statistics Average

# Create alarm
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu \
  --alarm-description "Alert when CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

---

## SQS (Message Queue)

```bash
# Create queue
aws sqs create-queue --queue-name vahanhelp-email-queue

# List queues
aws sqs list-queues

# Get queue URL
aws sqs get-queue-url --queue-name vahanhelp-email-queue

# Send message
aws sqs send-message \
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/vahanhelp-email-queue \
  --message-body "Hello from VahanHelp"

# Receive messages
aws sqs receive-message \
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/vahanhelp-email-queue \
  --max-number-of-messages 10

# Delete message
aws sqs delete-message \
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/vahanhelp-email-queue \
  --receipt-handle RECEIPT_HANDLE

# Purge queue
aws sqs purge-queue \
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/vahanhelp-email-queue

# Delete queue
aws sqs delete-queue \
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/vahanhelp-email-queue
```

---

## SNS (Notifications)

```bash
# Create topic
aws sns create-topic --name vahanhelp-alerts

# List topics
aws sns list-topics

# Subscribe email
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:vahanhelp-alerts \
  --protocol email \
  --notification-endpoint admin@vahanhelp.com

# Publish message
aws sns publish \
  --topic-arn arn:aws:sns:us-east-1:123456789012:vahanhelp-alerts \
  --subject "Alert" \
  --message "High error rate detected"

# List subscriptions
aws sns list-subscriptions

# Unsubscribe
aws sns unsubscribe --subscription-arn arn:aws:sns:...

# Delete topic
aws sns delete-topic --topic-arn arn:aws:sns:us-east-1:123456789012:vahanhelp-alerts
```

---

## Route53 (DNS)

```bash
# List hosted zones
aws route53 list-hosted-zones

# Create hosted zone
aws route53 create-hosted-zone \
  --name vahanhelp.com \
  --caller-reference $(date +%s)

# List record sets
aws route53 list-resource-record-sets \
  --hosted-zone-id Z123456ABCDEFG

# Create A record
aws route53 change-resource-record-sets \
  --hosted-zone-id Z123456ABCDEFG \
  --change-batch file://change-batch.json
```

---

## Secrets Manager

```bash
# Create secret
aws secretsmanager create-secret \
  --name vahanhelp-db-password \
  --secret-string "MySecurePassword123"

# Get secret value
aws secretsmanager get-secret-value \
  --secret-id vahanhelp-db-password \
  --query SecretString \
  --output text

# Update secret
aws secretsmanager update-secret \
  --secret-id vahanhelp-db-password \
  --secret-string "NewPassword456"

# Delete secret
aws secretsmanager delete-secret \
  --secret-id vahanhelp-db-password \
  --force-delete-without-recovery
```

---

## Systems Manager (Parameter Store)

```bash
# Put parameter
aws ssm put-parameter \
  --name /vahanhelp/jwt-secret \
  --value "your-secret-key" \
  --type SecureString

# Get parameter
aws ssm get-parameter \
  --name /vahanhelp/jwt-secret \
  --with-decryption

# List parameters
aws ssm describe-parameters

# Delete parameter
aws ssm delete-parameter --name /vahanhelp/jwt-secret
```

---

## Cost Explorer

```bash
# Get cost and usage
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics UnblendedCost \
  --group-by Type=SERVICE

# Get forecast
aws ce get-cost-forecast \
  --time-period Start=2024-02-01,End=2024-02-28 \
  --metric UNBLENDED_COST \
  --granularity MONTHLY
```

---

## Useful Scripts

### Start/Stop Dev Instances

```bash
#!/bin/bash
# stop-dev.sh - Stop all dev instances

INSTANCES=$(aws ec2 describe-instances \
  --filters "Name=tag:Environment,Values=Dev" "Name=instance-state-name,Values=running" \
  --query "Reservations[].Instances[].InstanceId" \
  --output text)

if [ -n "$INSTANCES" ]; then
  aws ec2 stop-instances --instance-ids $INSTANCES
  echo "Stopped instances: $INSTANCES"
else
  echo "No running dev instances found"
fi
```

### Backup All RDS Databases

```bash
#!/bin/bash
# backup-dbs.sh

DBS=$(aws rds describe-db-instances --query "DBInstances[].DBInstanceIdentifier" --output text)

for DB in $DBS; do
  SNAPSHOT="${DB}-backup-$(date +%Y%m%d)"
  aws rds create-db-snapshot --db-instance-identifier $DB --db-snapshot-identifier $SNAPSHOT
  echo "Created snapshot: $SNAPSHOT"
done
```

### Clean Old S3 Files

```bash
#!/bin/bash
# cleanup-s3.sh - Delete files older than 30 days

BUCKET="vahanhelp-logs"
CUTOFF_DATE=$(date -d "30 days ago" +%Y-%m-%d)

aws s3 ls s3://$BUCKET/ --recursive | while read -r line; do
  FILE_DATE=$(echo $line | awk '{print $1}')
  FILE_NAME=$(echo $line | awk '{print $4}')

  if [[ "$FILE_DATE" < "$CUTOFF_DATE" ]]; then
    aws s3 rm s3://$BUCKET/$FILE_NAME
    echo "Deleted: $FILE_NAME"
  fi
done
```

---

## JQ Queries (JSON Parsing)

```bash
# Get all instance IDs
aws ec2 describe-instances | jq -r '.Reservations[].Instances[].InstanceId'

# Get instance ID and IP
aws ec2 describe-instances | jq -r '.Reservations[].Instances[] | "\(.InstanceId) \(.PublicIpAddress)"'

# Get RDS endpoints
aws rds describe-db-instances | jq -r '.DBInstances[] | "\(.DBInstanceIdentifier): \(.Endpoint.Address)"'

# Get S3 bucket sizes
aws s3 ls | awk '{print $3}' | xargs -I {} aws s3 ls s3://{} --recursive --summarize | grep "Total Size"
```

---

## Aliases (Add to ~/.bashrc)

```bash
# AWS shortcuts
alias aws-instances='aws ec2 describe-instances --query "Reservations[].Instances[].[InstanceId,State.Name,PublicIpAddress,Tags[?Key==`Name`].Value|[0]]" --output table'
alias aws-buckets='aws s3 ls'
alias aws-logs='aws logs tail'
alias aws-dbs='aws rds describe-db-instances --query "DBInstances[].[DBInstanceIdentifier,DBInstanceStatus,Endpoint.Address]" --output table'
alias aws-whoami='aws sts get-caller-identity'
```

---

**Pro Tip**: Use `--dry-run` flag to test commands without actually executing them! 🚀

```bash
# Test without creating
aws ec2 run-instances --image-id ami-123 --instance-type t2.micro --dry-run
```
