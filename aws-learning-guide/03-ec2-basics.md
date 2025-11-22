# Lesson 03: EC2 (Elastic Compute Cloud)

## What is EC2?

**EC2** = Virtual servers in the cloud.

**Use Cases**:
- Web servers
- Application servers
- Databases
- Development environments

---

## Instance Types

```
t2.micro  - 1 vCPU, 1GB RAM  (Free Tier)
t2.small  - 1 vCPU, 2GB RAM
t2.medium - 2 vCPU, 4GB RAM
t3.large  - 2 vCPU, 8GB RAM
c5.xlarge - 4 vCPU, 8GB RAM  (Compute optimized)
r5.xlarge - 4 vCPU, 32GB RAM (Memory optimized)
```

**Naming**: Family.Size
- **t** = burstable performance
- **c** = compute optimized
- **r** = memory optimized
- **m** = general purpose

---

## Launch EC2 Instance

### Via Console
```
1. Go to EC2 Dashboard
2. Click "Launch Instance"
3. Choose AMI (Amazon Machine Image)
   - Amazon Linux 2
   - Ubuntu Server 22.04
4. Choose Instance Type: t2.micro
5. Configure Instance
   - Network: Default VPC
   - Auto-assign Public IP: Enable
6. Add Storage: 8GB (Free Tier)
7. Add Tags: Name = VahanHelp-Backend
8. Configure Security Group
   - SSH (22): My IP
   - HTTP (80): Anywhere
   - HTTPS (443): Anywhere
9. Review and Launch
10. Create new key pair: vahanhelp-key.pem
11. Download key pair
12. Launch
```

### Via CLI
```bash
# Launch instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t2.micro \
  --key-name vahanhelp-key \
  --security-group-ids sg-123456 \
  --subnet-id subnet-123456 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=VahanHelp-Backend}]'
```

---

## Connect to EC2

### SSH Connection
```bash
# Set permissions
chmod 400 vahanhelp-key.pem

# Connect
ssh -i vahanhelp-key.pem ec2-user@EC2_PUBLIC_IP

# For Ubuntu
ssh -i vahanhelp-key.pem ubuntu@EC2_PUBLIC_IP
```

### Install Node.js on EC2
```bash
# Update system
sudo yum update -y  # Amazon Linux
# OR
sudo apt update -y  # Ubuntu

# Install Node.js (using NVM)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18

# Verify
node --version
npm --version

# Install PM2
npm install -g pm2
```

---

## Deploy VahanHelp Backend

```bash
# Clone repository
git clone https://github.com/your-repo/vahanhelp-backend.git
cd vahanhelp-backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add: PORT, MONGODB_URI, JWT_SECRET, etc.

# Start with PM2
pm2 start src/server.js --name vahanhelp-api
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs
```

---

## Security Groups

**Firewall rules for EC2 instances.**

### Inbound Rules
```
SSH (22)    - Source: My IP (your IP only)
HTTP (80)   - Source: 0.0.0.0/0 (anywhere)
HTTPS (443) - Source: 0.0.0.0/0 (anywhere)
Custom (3000) - Source: Load Balancer SG (for backend API)
```

### Outbound Rules
```
All Traffic - Destination: 0.0.0.0/0 (default)
```

---

## Elastic IP

Static public IP address.

```bash
# Allocate Elastic IP
aws ec2 allocate-address

# Associate with instance
aws ec2 associate-address \
  --instance-id i-1234567890abcdef0 \
  --allocation-id eipalloc-12345678
```

**Note**: Elastic IPs are free when attached to running instance, charged when not in use.

---

## EC2 User Data (Bootstrap Script)

```bash
#!/bin/bash
# Install Node.js and deploy app on launch

yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18

# Install PM2
npm install -g pm2

# Clone and start app
cd /home/ec2-user
git clone https://github.com/your-repo/vahanhelp-backend.git
cd vahanhelp-backend
npm install
pm2 start src/server.js
pm2 startup
pm2 save
```

---

## Best Practices

✅ Use IAM roles instead of access keys
✅ Restrict Security Group rules
✅ Use Elastic IP for static IP
✅ Enable detailed monitoring
✅ Regular backups (AMI snapshots)
✅ Use Auto Scaling for production
✅ Monitor with CloudWatch

**Next Lesson**: [04-s3-storage.md](04-s3-storage.md)
