# Lesson 14: DevSecOps

## Introduction

Security used to be an afterthought - "Let's add it later." But in today's world of frequent deployments and constant threats, security must be built in from the start. DevSecOps (Development + Security + Operations) makes security everyone's responsibility.

Think of security like building safety: You don't add fire exits after the building is complete, you design them in from the beginning.

## What is DevSecOps?

```
┌────────────────────────────────────────────────┐
│         Traditional Security                   │
├────────────────────────────────────────────────┤
│  Dev → Build → Test → [Security Team] → Deploy │
│                        ↑                        │
│                  Bottleneck!                    │
│                  Slow, late fixes               │
│                  Adversarial                    │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│              DevSecOps                         │
├────────────────────────────────────────────────┤
│  Dev (security tools) →                        │
│  Build (security scans) →                      │
│  Test (security tests) →                       │
│  Deploy (secure config) →                      │
│  Monitor (security alerts)                     │
│                                                │
│  Security at every stage!                      │
└────────────────────────────────────────────────┘
```

## Shift-Left Security

**Shift-left** means moving security earlier in the development process.

```
Traditional (Shift-Right):
Plan → Code → Build → Test → [Security] → Deploy
                              ↑ Too late!

DevSecOps (Shift-Left):
[Security] at every stage:
Plan → Code → Build → Test → Deploy → Monitor
  ↓      ↓      ↓       ↓       ↓        ↓
Security checks embedded throughout
```

## Container Security

### 1. Image Scanning

**Scan for vulnerabilities before deploying.**

**Using Trivy**:
```bash
# Install Trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh

# Scan image
trivy image myapp:latest

# Scan and fail on HIGH or CRITICAL
trivy image --severity HIGH,CRITICAL --exit-code 1 myapp:latest

# Scan Dockerfile
trivy config Dockerfile

# Generate report
trivy image --format json --output report.json myapp:latest
```

**In CI/CD (GitHub Actions)**:
```yaml
name: Container Scan

on: [push]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build image
        run: docker build -t myapp:latest .

      - name: Run Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

      - name: Upload results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

### 2. Running as Non-Root

```dockerfile
# ❌ Bad - Runs as root (UID 0)
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]

# ✅ Good - Runs as non-root
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies as root
COPY package*.json ./
RUN npm ci --only=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy app and change ownership
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

EXPOSE 3000
CMD ["node", "server.js"]
```

### 3. Read-Only Filesystem

```yaml
# docker-compose.yml
services:
  app:
    image: myapp:latest
    read_only: true  # Container filesystem is read-only
    tmpfs:
      - /tmp:mode=1777  # Temporary writable space
      - /app/logs:mode=0755
```

### 4. Minimal Base Images

```dockerfile
# 🔴 Large surface area
FROM ubuntu:latest  # 77MB, many packages
RUN apt-get update && apt-get install nodejs

# 🟡 Better
FROM node:18-alpine  # 110MB, minimal packages

# 🟢 Best - Distroless (no shell, no package manager)
FROM gcr.io/distroless/nodejs18-debian11
COPY --from=build /app /app
CMD ["/app/server.js"]
```

## Secrets Management

### 1. Never Commit Secrets

```bash
# ❌ Bad - Secrets in code
const password = "my-secret-password";

# ❌ Bad - Secrets in Dockerfile
ENV DB_PASSWORD=secretpass

# ✅ Good - Use environment variables
const password = process.env.DB_PASSWORD;

# ✅ Good - Use secret management service
```

### 2. Use .gitignore

```.gitignore
# Secrets and credentials
.env
.env.local
.env.*.local
*.pem
*.key
credentials.json
secrets.yaml

# Terraform state (may contain secrets)
*.tfstate
*.tfstate.backup
```

### 3. Environment Variables (Secure)

```bash
# Docker secrets
echo "my-secret" | docker secret create db_password -

# Use in service
docker service create \
  --secret db_password \
  --name myapp \
  myapp:latest
```

```javascript
// Access in app
const fs = require('fs');
const password = fs.readFileSync('/run/secrets/db_password', 'utf8');
```

### 4. HashiCorp Vault

```bash
# Start Vault
docker run -d --name=vault \
  -p 8200:8200 \
  --cap-add=IPC_LOCK \
  vault:latest

# Initialize Vault
vault operator init

# Store secret
vault kv put secret/myapp/db password="secretpass"

# Read secret
vault kv get secret/myapp/db

# In app
curl -H "X-Vault-Token: $VAULT_TOKEN" \
  http://vault:8200/v1/secret/data/myapp/db
```

### 5. AWS Secrets Manager

```bash
# Store secret
aws secretsmanager create-secret \
  --name myapp/db \
  --secret-string '{"username":"admin","password":"secret"}'

# Retrieve secret
aws secretsmanager get-secret-value --secret-id myapp/db
```

```javascript
// In Node.js
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

const data = await secretsManager.getSecretValue({
  SecretId: 'myapp/db'
}).promise();

const secret = JSON.parse(data.SecretString);
console.log(secret.password);
```

### 6. GitHub Secrets

```yaml
# .github/workflows/deploy.yml
name: Deploy

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        env:
          API_KEY: ${{ secrets.API_KEY }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
        run: |
          # Use secrets in deployment
          echo "Deploying with API key..."
```

## Security Scanning in CI/CD

### Complete Security Pipeline

```yaml
name: Security Checks

on: [push, pull_request]

jobs:
  # 1. Secret scanning
  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD

  # 2. Code security scan
  code-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: test

  # 3. Dependency scan
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Dependency Review
        uses: actions/dependency-review-action@v3

      - name: npm audit
        run: npm audit --audit-level=high

  # 4. Container scan
  container-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build image
        run: docker build -t myapp:latest .

      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:latest'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

  # 5. IaC security scan
  iac-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: tfsec
        uses: aquasecurity/tfsec-action@v1.0.0
        with:
          working_directory: terraform/

  # 6. SAST (Static Application Security Testing)
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## OWASP Top 10

### Common Web Security Risks

```
1. Broken Access Control
   - Users can access unauthorized data
   - Fix: Proper authorization checks

2. Cryptographic Failures
   - Sensitive data exposed
   - Fix: Encrypt data at rest and in transit

3. Injection
   - SQL, NoSQL, Command injection
   - Fix: Parameterized queries, input validation

4. Insecure Design
   - Missing security controls
   - Fix: Threat modeling, secure architecture

5. Security Misconfiguration
   - Default credentials, verbose errors
   - Fix: Security hardening, minimal permissions

6. Vulnerable Components
   - Outdated libraries with known vulnerabilities
   - Fix: Regular updates, dependency scanning

7. Identification & Authentication Failures
   - Weak passwords, session management
   - Fix: MFA, strong authentication

8. Software & Data Integrity Failures
   - Untrusted sources, unsigned code
   - Fix: Code signing, integrity checks

9. Security Logging & Monitoring Failures
   - Insufficient logging, no alerts
   - Fix: Comprehensive logging, alerting

10. Server-Side Request Forgery (SSRF)
    - Application fetches remote resources
    - Fix: Validate URLs, deny by default
```

### Preventing SQL Injection

```javascript
// ❌ Bad - SQL Injection vulnerable
const userId = req.query.id;
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query);

// Attacker: ?id=1 OR 1=1
// Reveals all users!

// ✅ Good - Parameterized query
const userId = req.query.id;
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

### Preventing XSS

```javascript
// ❌ Bad - XSS vulnerable
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`<h1>Results for: ${query}</h1>`);
});

// Attacker: ?q=<script>alert('XSS')</script>

// ✅ Good - Escape HTML
const escapeHtml = require('escape-html');
app.get('/search', (req, res) => {
  const query = escapeHtml(req.query.q);
  res.send(`<h1>Results for: ${query}</h1>`);
});
```

## Network Security

### 1. Network Policies (Kubernetes)

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  # Allow from frontend only
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 3000
  egress:
  # Allow to database only
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
```

### 2. Security Groups (AWS)

```hcl
# Terraform - Security group
resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Security group for web servers"

  # Allow HTTP from anywhere
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow HTTPS from anywhere
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow SSH from office only
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["203.0.113.0/24"]  # Office IP
  }

  # Allow all outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## Compliance and Auditing

### 1. Logging Security Events

```javascript
const winston = require('winston');

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' })
  ]
});

// Log authentication
app.post('/login', (req, res) => {
  securityLogger.info('Login attempt', {
    userId: req.body.username,
    ip: req.ip,
    timestamp: new Date(),
    success: true
  });
});

// Log authorization failures
app.get('/admin', authorize, (req, res) => {
  // authorize middleware logs failures
});

function authorize(req, res, next) {
  if (!req.user.isAdmin) {
    securityLogger.warn('Unauthorized access attempt', {
      userId: req.user.id,
      resource: req.path,
      ip: req.ip,
      timestamp: new Date()
    });
    return res.status(403).send('Forbidden');
  }
  next();
}
```

### 2. Audit Trail

```javascript
// Track all changes
app.put('/users/:id', async (req, res) => {
  const oldUser = await User.findById(req.params.id);
  const newUser = await User.update(req.params.id, req.body);

  // Audit log
  await AuditLog.create({
    action: 'UPDATE',
    resource: 'User',
    resourceId: req.params.id,
    userId: req.user.id,
    changes: {
      before: oldUser,
      after: newUser
    },
    timestamp: new Date(),
    ip: req.ip
  });

  res.json(newUser);
});
```

## Security Checklist

### Development

```
□ Use linters with security rules
□ Code review focuses on security
□ Input validation on all user data
□ Output encoding to prevent XSS
□ Parameterized queries to prevent injection
□ No hardcoded secrets
□ Dependencies updated regularly
□ Security tests in test suite
```

### Build & CI/CD

```
□ Dependency scanning (npm audit, Snyk)
□ Secret scanning (TruffleHog)
□ SAST (Static Application Security Testing)
□ Container scanning (Trivy)
□ IaC scanning (tfsec)
□ License compliance checking
□ Build artifacts signed
□ Immutable builds
```

### Deployment

```
□ Run as non-root user
□ Read-only filesystem where possible
□ Minimal base images
□ Resource limits set
□ Secrets from secret manager
□ TLS/HTTPS enabled
□ Security headers configured
□ Network policies enforced
```

### Production

```
□ Security monitoring active
□ Logging captures security events
□ Alerts for suspicious activity
□ Regular security audits
□ Incident response plan
□ Backup and recovery tested
□ Compliance requirements met
□ Regular penetration testing
```

## Summary

You've learned:
- DevSecOps principles (shift-left security)
- Container security (scanning, non-root, read-only, minimal images)
- Secrets management (Vault, AWS Secrets Manager, GitHub Secrets)
- Security scanning in CI/CD
- OWASP Top 10 vulnerabilities
- Network security (policies, security groups)
- Compliance and auditing
- Complete security checklist

**Key Takeaway**: Security is everyone's responsibility. By integrating security into every stage of the DevOps pipeline (DevSecOps), you build more secure systems faster.

## Next Steps

In the final lesson, **DevOps Best Practices**, we'll bring everything together with real-world best practices, workflows, metrics, and career guidance.

---

**Challenge**:
Implement comprehensive security for your application:
1. Scan all Docker images for vulnerabilities
2. Run as non-root user in containers
3. Move all secrets to a secret manager
4. Add security scanning to CI/CD pipeline
5. Implement network policies
6. Add security logging and auditing
7. Create security checklist
8. Document security procedures
9. Perform security audit
10. Fix all HIGH and CRITICAL vulnerabilities
