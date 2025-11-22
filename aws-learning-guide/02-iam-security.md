# Lesson 02: IAM & Security

## What is IAM?

**Identity and Access Management (IAM)** - Manage access to AWS services securely.

**Key Features**:
- User management
- Permission control
- Multi-factor authentication
- Free service (no charge)

---

## IAM Components

### 1. Users
Individual accounts for people.

```bash
# Create user via CLI
aws iam create-user --user-name john

# Create access key
aws iam create-access-key --user-name john
```

### 2. Groups
Collection of users with same permissions.

```bash
# Create group
aws iam create-group --group-name developers

# Add user to group
aws iam add-user-to-group --user-name john --group-name developers
```

### 3. Roles
Temporary credentials for services/applications.

**Use Cases**:
- EC2 accessing S3
- Lambda accessing DynamoDB
- Cross-account access

### 4. Policies
JSON documents defining permissions.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::vahanhelp-images/*"
    }
  ]
}
```

---

## IAM Best Practices

### 1. Never Use Root Account
```
✅ Create IAM user with admin rights
✅ Use IAM user for daily tasks
✅ Enable MFA on root account
✅ Store root credentials securely
```

### 2. Principle of Least Privilege
Give minimum permissions needed.

### 3. Use Groups
```
✅ Create groups (Developers, Admins, ReadOnly)
✅ Assign policies to groups
✅ Add users to groups
```

### 4. Enable MFA
Multi-Factor Authentication adds extra security.

### 5. Rotate Credentials
Change passwords and access keys regularly.

---

## VahanHelp IAM Setup

### Create Developer User
```bash
# Create user
aws iam create-user --user-name vahanhelp-dev

# Attach policy (PowerUserAccess)
aws iam attach-user-policy \
  --user-name vahanhelp-dev \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# Create access key
aws iam create-access-key --user-name vahanhelp-dev
```

### Create EC2 Role for S3 Access
```bash
# Create role
aws iam create-role --role-name EC2-S3-Access \
  --assume-role-policy-document file://trust-policy.json

# Attach S3 policy
aws iam attach-role-policy \
  --role-name EC2-S3-Access \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

---

## AWS CLI Configuration

```bash
# Configure credentials
aws configure --profile vahanhelp-dev
AWS Access Key ID: YOUR_ACCESS_KEY
AWS Secret Access Key: YOUR_SECRET_KEY
Default region: us-east-1

# Use profile
aws s3 ls --profile vahanhelp-dev

# Set default profile
export AWS_PROFILE=vahanhelp-dev
```

**Next Lesson**: [03-ec2-basics.md](03-ec2-basics.md)
