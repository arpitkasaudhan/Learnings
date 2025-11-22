# Lesson 5: Network Security

## Introduction to Network Security

Network security protects data during transmission and prevents unauthorized access to network resources.

## SSL/TLS (Secure Sockets Layer / Transport Layer Security)

### What is SSL/TLS?

SSL/TLS provides **encryption** for data transmitted over networks, primarily used in HTTPS.

**History**:
```
SSL 1.0  - Never released (flawed)
SSL 2.0  - 1995 (deprecated, insecure)
SSL 3.0  - 1996 (deprecated, POODLE attack)
TLS 1.0  - 1999 (successor to SSL 3.0)
TLS 1.1  - 2006 (deprecated)
TLS 1.2  - 2008 (widely used)
TLS 1.3  - 2018 (current, fastest, most secure)
```

### How TLS Works

**TLS Handshake**:
```
1. Client Hello
   - TLS version
   - Supported cipher suites
   - Random number

2. Server Hello
   - Selected cipher suite
   - SSL certificate
   - Random number

3. Certificate Verification
   - Client verifies certificate with CA
   - Checks expiration, domain, signature

4. Key Exchange
   - Client generates pre-master secret
   - Encrypts with server's public key
   - Sends to server

5. Session Keys Generated
   - Both derive same session keys
   - From random numbers + pre-master secret

6. Encrypted Communication
   - All further data encrypted with session keys
```

### SSL Certificates

**Certificate Contents**:
```
- Domain name (example.com)
- Organization name
- Public key
- Expiration date
- Certificate Authority signature
- Serial number
```

**Types of Certificates**:

**1. Domain Validated (DV)**:
```
- Verifies domain ownership only
- Issued in minutes
- Cheapest
- Use: Blogs, personal sites
```

**2. Organization Validated (OV)**:
```
- Verifies organization details
- Takes days to issue
- Shows company name
- Use: Business websites
```

**3. Extended Validation (EV)**:
```
- Extensive verification
- Shows company name in address bar
- Most expensive
- Use: Banks, e-commerce
```

**4. Wildcard Certificate**:
```
Covers all subdomains:
*.example.com covers:
- www.example.com
- api.example.com
- blog.example.com
```

### Certificate Authorities (CA)

**Trusted CAs**:
```
- Let's Encrypt (free, automated)
- DigiCert
- Comodo
- GlobalSign
- GoDaddy
```

**Certificate Chain**:
```
Root CA (trusted by browsers)
  └─ Intermediate CA
       └─ Your Certificate (example.com)

Browser has Root CA certificate pre-installed
Verifies entire chain
```

### Implementing HTTPS

**Node.js/Express**:
```javascript
const https = require('https');
const fs = require('fs');
const express = require('express');

const app = express();

// SSL certificate files
const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  ca: fs.readFileSync('ca-bundle.pem') // Optional chain
};

app.get('/', (req, res) => {
  res.send('Secure connection!');
});

// HTTPS server
https.createServer(options, app).listen(443, () => {
  console.log('HTTPS server on port 443');
});

// Redirect HTTP to HTTPS
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80);
```

**Let's Encrypt (Free SSL)**:
```bash
# Install Certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d example.com

# Auto-renewal (cron job)
sudo certbot renew --dry-run

# Certificates saved to:
/etc/letsencrypt/live/example.com/
  ├─ privkey.pem (private key)
  ├─ cert.pem (certificate)
  ├─ chain.pem (intermediate)
  └─ fullchain.pem (cert + chain)
```

## Firewalls

### What is a Firewall?

A firewall **filters network traffic** based on security rules, blocking unauthorized access.

### Types of Firewalls

**1. Packet Filtering (Stateless)**:
```
Checks each packet independently
Rules based on:
- Source IP
- Destination IP
- Protocol (TCP/UDP)
- Port number

Example rule:
ALLOW TCP from 192.168.1.0/24 to any port 443
DENY all other traffic
```

**2. Stateful Inspection**:
```
Tracks connection state
Remembers outgoing requests
Allows related responses
Smarter than packet filtering

Example:
You request: google.com:443
Firewall: Allows outgoing request
          Automatically allows response
```

**3. Application Layer (Layer 7)**:
```
Inspects application data
Understands protocols (HTTP, FTP, etc.)
Can block specific URLs, file types

Example:
Block: facebook.com
Allow: google.com
Block: .exe file downloads
```

**4. Next-Generation Firewall (NGFW)**:
```
Combines all above plus:
- Intrusion Prevention System (IPS)
- Deep packet inspection
- Application awareness
- Threat intelligence
```

### Firewall Rules (iptables - Linux)

```bash
# View current rules
sudo iptables -L

# Allow SSH (port 22)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP (port 80) and HTTPS (port 443)
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow established connections
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Block specific IP
sudo iptables -A INPUT -s 192.168.1.100 -j DROP

# Block port range
sudo iptables -A INPUT -p tcp --dport 3000:4000 -j DROP

# Default policy: Drop all other incoming
sudo iptables -P INPUT DROP

# Save rules
sudo iptables-save > /etc/iptables/rules.v4
```

### Application Firewall

**Web Application Firewall (WAF)**:
```javascript
// Express.js with Helmet (security middleware)
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security headers
app.use(helmet());

// Rate limiting (prevent brute force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Max 100 requests per windowMs
});
app.use(limiter);

// IP whitelist
const whitelist = ['192.168.1.100', '10.0.0.5'];
app.use((req, res, next) => {
  const clientIP = req.ip;
  if (whitelist.includes(clientIP)) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
});
```

## VPN (Virtual Private Network)

### What is a VPN?

VPN creates a **secure, encrypted tunnel** over a public network (internet).

### How VPN Works

```
Your Computer → VPN Client → Encrypted Tunnel → VPN Server → Internet

Without VPN:
You → ISP → Website
(ISP sees everything)

With VPN:
You → ISP → VPN Server → Website
(ISP only sees encrypted data to VPN)
(Website sees VPN's IP, not yours)
```

### VPN Benefits

```
1. Privacy: Hides your IP address
2. Security: Encrypts all traffic
3. Bypass restrictions: Access geo-blocked content
4. Secure public WiFi: Protects on unsecured networks
5. Remote access: Access company network remotely
```

### VPN Protocols

**1. OpenVPN**:
```
- Open source
- Very secure
- Flexible
- Good speed
- Most popular
```

**2. WireGuard**:
```
- Modern, fast
- Simple code (secure)
- Low overhead
- Best performance
```

**3. IPSec/IKEv2**:
```
- Built into many devices
- Fast reconnection
- Good for mobile
```

**4. L2TP/IPSec**:
```
- Widely supported
- Less secure than OpenVPN
- Slower
```

### Setting Up OpenVPN (Simple)

**Server setup** (using Docker):
```bash
# Run OpenVPN server
docker run -v openvpn-data:/etc/openvpn \
  -p 1194:1194/udp \
  --cap-add=NET_ADMIN \
  kylemanna/openvpn
```

**Client (Node.js)**:
```bash
# Install OpenVPN
sudo apt install openvpn

# Connect
sudo openvpn --config client.ovpn
```

## Common Network Attacks

### 1. Man-in-the-Middle (MITM)

**Attack**:
```
You → Attacker → Website

You think you're talking to website
Actually talking to attacker
Attacker intercepts/modifies data
```

**Defense**:
```
✓ Use HTTPS (TLS encryption)
✓ Verify SSL certificates
✓ Use VPN on public WiFi
✓ HSTS (HTTP Strict Transport Security)
✗ Don't trust unknown certificates
```

**Implementing HSTS**:
```javascript
// Express.js
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  next();
});

// Or with Helmet
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true
}));
```

### 2. DDoS (Distributed Denial of Service)

**Attack**:
```
Thousands of computers flood server with requests
Server overwhelmed, crashes or slows down
Legitimate users can't access
```

**Defense**:
```
✓ Rate limiting
✓ CDN (Cloudflare, AWS CloudFront)
✓ Load balancers
✓ Firewall rules
✓ DDoS protection services
```

**Rate Limiting**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// Stricter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});

app.post('/api/login', loginLimiter, loginHandler);
```

### 3. SQL Injection

**Attack**:
```javascript
// Vulnerable code
const username = req.body.username; // "admin' OR '1'='1"
const query = `SELECT * FROM users WHERE username = '${username}'`;
// Query becomes:
// SELECT * FROM users WHERE username = 'admin' OR '1'='1'
// Returns all users!
```

**Defense**:
```javascript
// Use parameterized queries
const query = 'SELECT * FROM users WHERE username = ?';
db.query(query, [username]);

// Or ORM (Sequelize, Mongoose)
User.findOne({ where: { username } });

// Input validation
const { body, validationResult } = require('express-validator');

app.post('/login',
  body('username').trim().escape().isAlphanumeric(),
  body('password').trim().isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process login
  }
);
```

### 4. Cross-Site Scripting (XSS)

**Attack**:
```javascript
// Attacker injects script
const comment = "<script>alert('XSS')</script>";

// Vulnerable code renders it
res.send(`<div>${comment}</div>`);
// Script executes in other users' browsers!
```

**Defense**:
```javascript
// Escape user input
const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

res.send(`<div>${escapeHtml(comment)}</div>`);

// Use templating engines (auto-escape)
// EJS, Handlebars, Pug

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:']
  }
}));
```

### 5. Cross-Site Request Forgery (CSRF)

**Attack**:
```html
<!-- Malicious website -->
<img src="https://bank.com/transfer?to=attacker&amount=1000">

<!-- If user is logged into bank.com, this executes! -->
```

**Defense**:
```javascript
// CSRF tokens
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/process', csrfProtection, (req, res) => {
  // Token verified automatically
  res.send('Data processed');
});

// In HTML form
// <input type="hidden" name="_csrf" value="<%= csrfToken %>">

// SameSite cookies
res.cookie('session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' // Prevents CSRF
});
```

### 6. Brute Force

**Attack**:
```
Attacker tries many passwords:
password123
password1
admin123
...
(Until finds correct one)
```

**Defense**:
```javascript
// Rate limiting (shown earlier)

// Account lockout after failed attempts
const failedAttempts = new Map();

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const attempts = failedAttempts.get(username) || 0;

  // Lock after 5 failed attempts
  if (attempts >= 5) {
    return res.status(429).json({
      error: 'Account locked. Try again in 15 minutes.'
    });
  }

  const user = await User.findOne({ username });
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    failedAttempts.set(username, attempts + 1);
    setTimeout(() => failedAttempts.delete(username), 15 * 60 * 1000);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Success: reset attempts
  failedAttempts.delete(username);
  // Generate session, etc.
});

// CAPTCHA after several attempts
// Two-factor authentication (2FA)
```

## Security Best Practices

### 1. Authentication & Authorization

```javascript
// Hash passwords (never store plain text!)
const bcrypt = require('bcrypt');

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const valid = await bcrypt.compare(password, hashedPassword);

// JWT for API authentication
const jwt = require('jsonwebtoken');

// Create token
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: '1h'
});

// Verify token middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected data', userId: req.userId });
});
```

### 2. Input Validation

```javascript
const { body, param, query } = require('express-validator');

app.post('/user',
  body('email').isEmail().normalizeEmail(),
  body('age').isInt({ min: 0, max: 120 }),
  body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process validated data
  }
);
```

### 3. Secure Headers

```javascript
const helmet = require('helmet');

app.use(helmet()); // Enables all default protections

// Or configure individually:
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
```

### 4. Environment Variables

```javascript
// Never commit secrets to code!

// Bad ❌
const apiKey = 'sk_live_abc123';

// Good ✓
require('dotenv').config();
const apiKey = process.env.API_KEY;

// .env file (add to .gitignore!)
API_KEY=sk_live_abc123
DB_PASSWORD=secret123
JWT_SECRET=random_string_here
```

### 5. HTTPS Only

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 6. CORS (Cross-Origin Resource Sharing)

```javascript
const cors = require('cors');

// Allow all origins (development only!)
app.use(cors());

// Production: specify allowed origins
app.use(cors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Security Checklist

### Server Security
```
☐ Use HTTPS (TLS 1.2+)
☐ Keep software updated
☐ Use strong firewall rules
☐ Disable unnecessary services
☐ Use SSH keys (not passwords)
☐ Regular security audits
☐ Monitor logs
☐ Backup regularly
```

### Application Security
```
☐ Validate all input
☐ Parameterized queries (prevent SQL injection)
☐ Escape output (prevent XSS)
☐ Use CSRF tokens
☐ Hash passwords (bcrypt, argon2)
☐ Rate limiting
☐ Security headers (Helmet)
☐ Dependency scanning (npm audit)
☐ Environment variables for secrets
☐ CORS configuration
☐ Content Security Policy
```

### User Security
```
☐ Strong password requirements
☐ Two-factor authentication (2FA)
☐ Account lockout after failed attempts
☐ Password reset via email
☐ Session timeout
☐ Logout functionality
☐ Security notifications
```

## Tools & Commands

```bash
# Check SSL certificate
openssl s_client -connect example.com:443

# Scan for vulnerabilities
nmap -sV example.com

# Check for open ports
netstat -tuln

# NPM security audit
npm audit
npm audit fix

# Check TLS version
curl -I https://example.com

# View firewall rules
sudo iptables -L -n -v

# Monitor network traffic
sudo tcpdump -i eth0

# Check failed login attempts
sudo tail -f /var/log/auth.log
```

## Key Takeaways

1. **HTTPS** is essential - use TLS 1.2+
2. **Firewalls** filter network traffic
3. **VPN** encrypts all traffic
4. **Input validation** prevents injections
5. **Rate limiting** prevents brute force
6. **Security headers** add protection layers
7. **Never trust user input** - always validate
8. **Defense in depth** - multiple security layers

## Next Steps

You've completed the **Networking** section! Next:
- [Lesson 6: DBMS Introduction](./06-dbms-introduction.md) (Already created)
- [Lesson 7: Relational Databases & SQL](./07-relational-databases.md)

---

**Practice**: Run `npm audit` on your project and check for security vulnerabilities!
