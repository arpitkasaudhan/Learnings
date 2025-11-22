# Lesson 07: VPC (Virtual Private Cloud)

## What is VPC?

**VPC** = Your own private network in AWS.

**Components**:
- Subnets
- Route Tables
- Internet Gateway
- NAT Gateway
- Security Groups
- Network ACLs

---

## VahanHelp VPC Architecture

```
VPC: 10.0.0.0/16

Public Subnets (for Load Balancer, Bastion):
- 10.0.1.0/24 (AZ-1)
- 10.0.2.0/24 (AZ-2)

Private Subnets (for EC2, RDS):
- 10.0.10.0/24 (AZ-1)
- 10.0.11.0/24 (AZ-2)
```

---

## Create VPC

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create Subnets
aws ec2 create-subnet --vpc-id vpc-123 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-123 --cidr-block 10.0.10.0/24 --availability-zone us-east-1a

# Create Internet Gateway
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-123 --internet-gateway-id igw-123

# Create NAT Gateway
aws ec2 create-nat-gateway --subnet-id subnet-public --allocation-id eipalloc-123
```

**Next Lesson**: [08-elastic-load-balancer.md](08-elastic-load-balancer.md)
