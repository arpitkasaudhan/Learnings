# Lesson 05: RDS (Relational Database Service)

## What is RDS?

**RDS** = Managed relational database service.

**Supported Engines**:
- PostgreSQL
- MySQL
- MariaDB
- Oracle
- SQL Server
- Amazon Aurora

**Benefits**:
- Automated backups
- Automated software patching
- Multi-AZ for high availability
- Read replicas for scaling
- Monitoring with CloudWatch

---

## Create RDS Instance

### PostgreSQL Database

```
1. Go to RDS Dashboard
2. Create database
3. Engine: PostgreSQL 15
4. Template: Free tier
5. DB Instance Identifier: vahanhelp-db
6. Master username: postgres
7. Master password: (strong password)
8. DB instance class: db.t3.micro (Free Tier)
9. Storage: 20GB
10. VPC: Default
11. Public access: No (for security)
12. Security group: Create new
13. Database name: vahanhelp
14. Backup retention: 7 days
15. Create database
```

### Via CLI
```bash
aws rds create-db-instance \
  --db-instance-identifier vahanhelp-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YourPassword123! \
  --allocated-storage 20 \
  --backup-retention-period 7 \
  --no-publicly-accessible \
  --vpc-security-group-ids sg-123456
```

---

## Connect to RDS

### Get Endpoint
```bash
aws rds describe-db-instances \
  --db-instance-identifier vahanhelp-db \
  --query 'DBInstances[0].Endpoint.Address'

# Output: vahanhelp-db.abc123.us-east-1.rds.amazonaws.com
```

### Connect from EC2
```bash
# Install PostgreSQL client
sudo yum install postgresql -y

# Connect
psql -h vahanhelp-db.abc123.us-east-1.rds.amazonaws.com \
  -U postgres -d vahanhelp
```

### Connect from Node.js
```javascript
// Install: npm install pg
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.RDS_HOSTNAME,
  port: 5432,
  user: 'postgres',
  password: process.env.RDS_PASSWORD,
  database: 'vahanhelp',
  ssl: { rejectUnauthorized: false }
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Connected to RDS:', res.rows[0]);
  }
});

module.exports = pool;
```

---

## RDS Security

### Security Group Rules
```
Inbound:
PostgreSQL (5432) - Source: EC2 Security Group

Outbound:
All traffic - Destination: 0.0.0.0/0
```

### Store Credentials Securely
```bash
# Use AWS Secrets Manager
aws secretsmanager create-secret \
  --name vahanhelp/db/credentials \
  --secret-string '{"username":"postgres","password":"YourPassword123!"}'

# Retrieve in application
const secret = await secretsManager.getSecretValue({ SecretId: 'vahanhelp/db/credentials' }).promise();
const { username, password } = JSON.parse(secret.SecretString);
```

---

## Multi-AZ Deployment

High availability setup.

```bash
# Enable Multi-AZ
aws rds modify-db-instance \
  --db-instance-identifier vahanhelp-db \
  --multi-az \
  --apply-immediately
```

**Features**:
- Automatic failover
- Synchronous replication
- Higher availability
- No downtime for backups

---

## Read Replicas

Scale read operations.

```bash
# Create read replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier vahanhelp-db-replica \
  --source-db-instance-identifier vahanhelp-db
```

**Use Cases**:
- Reporting queries
- Analytics
- Read-heavy workloads

---

## Backups

### Automated Backups
- Daily automatic backups
- Retention: 1-35 days
- Point-in-time recovery

### Manual Snapshots
```bash
# Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier vahanhelp-db \
  --db-snapshot-identifier vahanhelp-db-snapshot-$(date +%Y%m%d)

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier vahanhelp-db-restored \
  --db-snapshot-identifier vahanhelp-db-snapshot-20240101
```

**Next Lesson**: [06-route53-dns.md](06-route53-dns.md)
