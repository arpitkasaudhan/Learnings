# Lesson 3: Network Protocols

## What is a Network Protocol?

A **protocol** is a set of rules and standards that define how data is transmitted and received over a network. Think of it as a language that computers use to communicate.

## HTTP (HyperText Transfer Protocol)

### What is HTTP?

HTTP is the foundation of data communication on the Web. It's an **application-layer protocol** for transmitting hypermedia documents (HTML).

### HTTP Request/Response Cycle

```
CLIENT                                  SERVER
  |                                       |
  |------- HTTP REQUEST ----------------->|
  |  (GET /api/users HTTP/1.1)            |
  |                                       |
  |<------ HTTP RESPONSE ------------------|
  |  (200 OK + Data)                      |
```

### HTTP Request Structure

```
GET /api/users HTTP/1.1                    ← Request Line
Host: api.example.com                      ← Headers
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer token123
                                           ← Blank Line
{ "userId": 123 }                          ← Body (optional)
```

### HTTP Request Methods

| Method | Purpose | Has Body | Idempotent | Safe |
|--------|---------|----------|------------|------|
| GET | Retrieve data | No | Yes | Yes |
| POST | Create new resource | Yes | No | No |
| PUT | Update/Replace resource | Yes | Yes | No |
| PATCH | Partial update | Yes | No | No |
| DELETE | Delete resource | No | Yes | No |
| HEAD | Get headers only | No | Yes | Yes |
| OPTIONS | Get supported methods | No | Yes | Yes |

**Real-World Examples**:
```javascript
// GET - Retrieve users
fetch('https://api.example.com/users')

// POST - Create new user
fetch('https://api.example.com/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
})

// PUT - Update user
fetch('https://api.example.com/users/123', {
  method: 'PUT',
  body: JSON.stringify({ name: 'John Smith', email: 'john@example.com' })
})

// PATCH - Partially update user
fetch('https://api.example.com/users/123', {
  method: 'PATCH',
  body: JSON.stringify({ name: 'John Smith' })
})

// DELETE - Remove user
fetch('https://api.example.com/users/123', {
  method: 'DELETE'
})
```

### HTTP Response Status Codes

#### 1xx - Informational
```
100 Continue - Server received request headers
101 Switching Protocols - Switching to WebSocket
```

#### 2xx - Success
```
200 OK - Request succeeded
201 Created - Resource created successfully
204 No Content - Success but no content to return
```

#### 3xx - Redirection
```
301 Moved Permanently - Resource permanently moved
302 Found - Temporary redirect
304 Not Modified - Use cached version
```

#### 4xx - Client Errors
```
400 Bad Request - Invalid request syntax
401 Unauthorized - Authentication required
403 Forbidden - No permission
404 Not Found - Resource doesn't exist
429 Too Many Requests - Rate limit exceeded
```

#### 5xx - Server Errors
```
500 Internal Server Error - Server crashed
502 Bad Gateway - Invalid response from upstream
503 Service Unavailable - Server temporarily down
504 Gateway Timeout - Upstream server timeout
```

**In Your Code**:
```javascript
fetch('https://api.example.com/users/123')
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 404) {
      throw new Error('User not found');
    } else if (response.status === 500) {
      throw new Error('Server error');
    }
  })
  .catch(error => console.error(error));
```

### HTTP Headers

#### Request Headers
```
Host: api.example.com                    ← Required in HTTP/1.1
User-Agent: Mozilla/5.0                  ← Client info
Accept: application/json                 ← Preferred response format
Accept-Language: en-US,en;q=0.9          ← Language preference
Accept-Encoding: gzip, deflate, br       ← Compression support
Authorization: Bearer eyJhbGc...         ← Authentication token
Cookie: sessionId=abc123                 ← Session cookie
Content-Type: application/json           ← Request body format
Content-Length: 348                      ← Body size
Cache-Control: no-cache                  ← Caching directive
Referer: https://example.com             ← Previous page
Origin: https://example.com              ← CORS
```

#### Response Headers
```
Content-Type: application/json           ← Response format
Content-Length: 1234                     ← Response size
Content-Encoding: gzip                   ← Compression used
Set-Cookie: sessionId=xyz789             ← Set cookie
Cache-Control: max-age=3600              ← Cache for 1 hour
Expires: Wed, 21 Oct 2025 07:28:00 GMT  ← Expiration time
ETag: "33a64df551425fcc55e4d42a148795d9" ← Version identifier
Access-Control-Allow-Origin: *           ← CORS policy
Location: https://example.com/new        ← Redirect URL
Server: nginx/1.18.0                     ← Server info
```

**In Your Code**:
```javascript
// Setting request headers
fetch('https://api.example.com/users', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123',
    'Accept': 'application/json'
  }
});

// Reading response headers
fetch('https://api.example.com/users')
  .then(response => {
    console.log(response.headers.get('Content-Type'));
    console.log(response.headers.get('Cache-Control'));
  });
```

### HTTP Versions

#### HTTP/1.0 (1996)
- One request per connection
- No persistent connections
- Slow for multiple resources

#### HTTP/1.1 (1997)
- **Persistent connections** (keep-alive)
- **Pipelining** (multiple requests without waiting)
- **Chunked transfer encoding**
- **Host header** (virtual hosting)
- Most widely used

#### HTTP/2 (2015)
- **Binary protocol** (instead of text)
- **Multiplexing** (multiple requests on single connection)
- **Header compression**
- **Server push**
- Faster, more efficient

#### HTTP/3 (2020)
- Uses **QUIC** (over UDP instead of TCP)
- Even faster
- Better for mobile/unstable connections

## HTTPS (HTTP Secure)

### What is HTTPS?

HTTPS is HTTP over **TLS/SSL**, providing:
- **Encryption**: Data encrypted in transit
- **Authentication**: Verify server identity
- **Integrity**: Data not tampered with

### How HTTPS Works

```
1. CLIENT → SERVER: "Hello, let's use HTTPS"
2. SERVER → CLIENT: "Here's my SSL certificate"
3. CLIENT: Verifies certificate with Certificate Authority (CA)
4. CLIENT & SERVER: Negotiate encryption keys
5. Encrypted communication begins
```

**TLS Handshake**:
```
CLIENT                                  SERVER
  |                                       |
  |------- ClientHello ------------------>|
  |                                       |
  |<------ ServerHello -------------------|
  |<------ Certificate -------------------|
  |<------ ServerKeyExchange --------------|
  |<------ ServerHelloDone ----------------|
  |                                       |
  |------- ClientKeyExchange ------------>|
  |------- ChangeCipherSpec ------------->|
  |------- Finished --------------------->|
  |                                       |
  |<------ ChangeCipherSpec ---------------|
  |<------ Finished -----------------------|
  |                                       |
  |======== Encrypted Data =============>|
```

### SSL/TLS Certificates

**Certificate Contains**:
- Domain name
- Organization name
- Public key
- Expiration date
- Certificate Authority (CA) signature

**In Browser**:
- 🔒 Padlock icon = HTTPS
- Click padlock to view certificate
- Certificate verifies server identity

**In Your Code**:
```javascript
// Always use HTTPS in production
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.example.com'  // HTTPS in production
  : 'http://localhost:3000';   // HTTP in development

// Fetch automatically handles HTTPS
fetch('https://api.example.com/users');
```

### Why HTTPS Matters

1. **Security**: Prevents eavesdropping, man-in-the-middle attacks
2. **Privacy**: User data encrypted
3. **SEO**: Google ranks HTTPS sites higher
4. **Trust**: Users trust sites with padlock
5. **Required**: Many modern features require HTTPS (geolocation, camera, etc.)

## DNS (Domain Name System)

### What is DNS?

DNS translates human-readable domain names to IP addresses.

```
You type: www.google.com
DNS resolves to: 172.217.164.196
```

### DNS Hierarchy

```
                     [Root DNS Servers]
                            |
          +----------------+----------------+
          |                |                |
        [.com]           [.org]           [.net]
          |                |                |
      [google.com]     [wikipedia.org]  [cloudflare.net]
          |
      [www.google.com]
```

### DNS Resolution Process

```
1. You type: www.google.com in browser

2. Browser checks cache:
   - Browser cache
   - Operating system cache
   - Router cache

3. If not cached, queries DNS servers:
   a. Local DNS server (ISP)
   b. Root DNS server → ".com" location
   c. TLD server → "google.com" location
   d. Authoritative server → "www.google.com" IP

4. IP address returned: 172.217.164.196

5. Browser connects to that IP
```

### DNS Record Types

```
A Record:       Domain → IPv4 address
                example.com → 93.184.216.34

AAAA Record:    Domain → IPv6 address
                example.com → 2606:2800:220:1:248:1893:25c8:1946

CNAME Record:   Domain → Another domain (alias)
                www.example.com → example.com

MX Record:      Mail server for domain
                example.com → mail.example.com

TXT Record:     Text information
                Used for: SPF, DKIM, domain verification

NS Record:      Name servers for domain
                example.com → ns1.cloudflare.com

SOA Record:     Start of Authority
                Domain ownership and update info
```

**In Your Code**:
```javascript
// DNS lookup (Node.js)
const dns = require('dns');

dns.lookup('google.com', (err, address, family) => {
  console.log('IP:', address);  // 172.217.164.196
  console.log('IPv:', family);  // 4
});

// Resolve all IPs
dns.resolve4('google.com', (err, addresses) => {
  console.log('IPs:', addresses);
  // ['172.217.164.196', '172.217.164.197', ...]
});

// Get MX records
dns.resolveMx('gmail.com', (err, addresses) => {
  console.log('Mail servers:', addresses);
  // [{ exchange: 'gmail-smtp-in.l.google.com', priority: 5 }, ...]
});
```

**Browser DevTools**:
```
1. Open DevTools (F12)
2. Network tab
3. Load a page
4. Click on first request
5. Timing tab → See "DNS Lookup" time
```

### DNS Caching

```
Browser:        60 seconds to 10 minutes
OS:             Few minutes
Router:         Few minutes to hours
ISP DNS:        Hours to days
```

**Clear DNS Cache**:
```bash
# Windows
ipconfig /flushdns

# Mac
sudo dscacheutil -flushcache

# Linux
sudo systemd-resolve --flush-caches

# Chrome browser
chrome://net-internals/#dns → Clear host cache
```

## WebSockets

### What are WebSockets?

WebSockets provide **full-duplex, bidirectional** communication over a single TCP connection. Unlike HTTP (request-response), WebSockets allow **server to push** data to client.

### HTTP vs WebSockets

```
HTTP (Request-Response):
CLIENT ---request---> SERVER
CLIENT <--response--- SERVER
(New connection for each request)

WebSockets (Persistent Connection):
CLIENT <==== bidirectional ====> SERVER
(Data flows both ways continuously)
```

### When to Use WebSockets

**Use WebSockets for**:
- Real-time chat applications
- Live notifications
- Multiplayer games
- Live stock prices
- Collaborative editing (Google Docs)
- Live sports scores

**Use HTTP for**:
- Standard web pages
- REST APIs
- File uploads
- One-time data fetches

### WebSocket Connection Process

```
1. Client sends HTTP request with "Upgrade" header:
   GET /chat HTTP/1.1
   Host: server.example.com
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   Sec-WebSocket-Version: 13

2. Server responds:
   HTTP/1.1 101 Switching Protocols
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

3. Connection established! Now bidirectional communication.
```

### WebSocket Code Example

**Client (Browser)**:
```javascript
// Create WebSocket connection
const socket = new WebSocket('wss://example.com/socket');

// Connection opened
socket.addEventListener('open', (event) => {
  console.log('Connected to server');
  socket.send('Hello Server!');
});

// Listen for messages from server
socket.addEventListener('message', (event) => {
  console.log('Message from server:', event.data);
});

// Connection closed
socket.addEventListener('close', (event) => {
  console.log('Disconnected from server');
});

// Error handling
socket.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

// Send data to server
function sendMessage(message) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'message', content: message }));
  }
}

// Close connection
socket.close();
```

**Server (Node.js with ws library)**:
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Receive message from client
  ws.on('message', (data) => {
    console.log('Received:', data);

    // Send response to client
    ws.send(`Server received: ${data}`);

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${data}`);
      }
    });
  });

  // Client disconnected
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send message to client
  ws.send('Welcome to the server!');
});
```

**Real-World Example: Chat Application**:
```javascript
// Client
const socket = new WebSocket('wss://chat.example.com');

socket.onopen = () => {
  console.log('Connected to chat');
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  displayMessage(message);
};

function sendChatMessage(text) {
  socket.send(JSON.stringify({
    type: 'chat',
    user: 'John',
    message: text,
    timestamp: Date.now()
  }));
}
```

## Other Important Protocols

### FTP (File Transfer Protocol)

- **Purpose**: Transfer files between client and server
- **Ports**: 20 (data), 21 (control)
- **Uses**: Website deployment, file sharing

```bash
# FTP commands
ftp ftp.example.com
> USER username
> PASS password
> GET file.txt      # Download file
> PUT file.txt      # Upload file
> LS                # List files
> BYE               # Exit
```

### SSH (Secure Shell)

- **Purpose**: Secure remote login and command execution
- **Port**: 22
- **Uses**: Server management, secure file transfer (SFTP)

```bash
# SSH login
ssh user@server.com

# SSH with key
ssh -i ~/.ssh/id_rsa user@server.com

# Execute command remotely
ssh user@server.com "ls -la"

# SFTP (secure file transfer)
sftp user@server.com
```

### SMTP, POP3, IMAP (Email Protocols)

**SMTP (Simple Mail Transfer Protocol)**:
- **Purpose**: Send email
- **Port**: 25, 587 (with TLS)
- **Flow**: Your email client → SMTP server → Recipient's mail server

**POP3 (Post Office Protocol)**:
- **Purpose**: Receive email
- **Port**: 110, 995 (with TLS)
- **Behavior**: Downloads emails, deletes from server

**IMAP (Internet Message Access Protocol)**:
- **Purpose**: Receive email
- **Port**: 143, 993 (with TLS)
- **Behavior**: Emails stay on server, synced across devices

```
Sending Email Flow:
[Your Computer] --SMTP--> [Gmail SMTP Server] --SMTP--> [Recipient Server]

Receiving Email Flow (IMAP):
[Your Computer] <--IMAP--> [Gmail Server]
(Emails stay on server, multiple devices can access)

Receiving Email Flow (POP3):
[Your Computer] <--POP3--> [Gmail Server]
(Emails downloaded and removed from server)
```

### DHCP (Dynamic Host Configuration Protocol)

- **Purpose**: Automatically assigns IP addresses to devices
- **How it works**:
  1. Device joins network
  2. Sends DHCP discover broadcast
  3. DHCP server offers IP address
  4. Device requests that IP
  5. Server acknowledges, assigns IP

```
Your Phone joins Wi-Fi:
1. Phone: "I need an IP address!"
2. Router (DHCP server): "Use 192.168.1.105"
3. Phone: "OK, I'll use 192.168.1.105"
4. Router: "Confirmed. Valid for 24 hours."
```

## Practical Exercises

### Exercise 1: Analyze HTTP Requests

```javascript
// Open browser DevTools (F12) → Network tab
fetch('https://api.github.com/users/github')
  .then(response => response.json())
  .then(data => console.log(data));

// Observe:
// 1. Request method (GET)
// 2. Status code (200)
// 3. Request headers
// 4. Response headers
// 5. Response body
// 6. Timing (DNS, SSL, etc.)
```

### Exercise 2: Test Different HTTP Methods

```javascript
// Try all HTTP methods
const baseUrl = 'https://jsonplaceholder.typicode.com/posts';

// GET
fetch(baseUrl).then(r => r.json()).then(console.log);

// POST
fetch(baseUrl, {
  method: 'POST',
  body: JSON.stringify({ title: 'Test', body: 'Content', userId: 1 }),
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.json()).then(console.log);

// PUT
fetch(`${baseUrl}/1`, {
  method: 'PUT',
  body: JSON.stringify({ id: 1, title: 'Updated', body: 'New content', userId: 1 }),
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.json()).then(console.log);

// DELETE
fetch(`${baseUrl}/1`, { method: 'DELETE' })
  .then(r => console.log('Deleted:', r.status));
```

### Exercise 3: DNS Lookups

```bash
# Find IP address of domain
nslookup google.com

# Get all DNS records
dig google.com

# Get specific record type
dig google.com MX     # Mail servers
dig google.com AAAA   # IPv6 address
dig google.com NS     # Name servers

# Trace DNS resolution
dig +trace google.com
```

### Exercise 4: WebSocket Chat

```javascript
// Simple WebSocket echo test
const socket = new WebSocket('wss://echo.websocket.org');

socket.onopen = () => {
  console.log('Connected');
  socket.send('Hello WebSocket!');
};

socket.onmessage = (event) => {
  console.log('Received:', event.data);
};
```

## Interview Questions

**Q1: Explain the difference between HTTP and HTTPS.**
```
HTTP:
- Unencrypted
- Data sent in plain text
- Port 80
- Vulnerable to eavesdropping

HTTPS:
- Encrypted with TLS/SSL
- Data encrypted in transit
- Port 443
- Secure, prevents tampering
```

**Q2: What happens when you type a URL in the browser?**
```
1. DNS lookup - Resolve domain to IP
2. TCP connection - 3-way handshake
3. TLS handshake - If HTTPS
4. HTTP request - Browser sends GET request
5. Server processes request
6. Server sends HTTP response
7. Browser renders page
8. Additional requests for resources (CSS, JS, images)
```

**Q3: When would you use WebSockets vs HTTP?**
```
Use WebSockets:
- Real-time bidirectional communication
- Server needs to push updates
- Examples: Chat, live notifications, gaming

Use HTTP:
- Request-response pattern sufficient
- RESTful APIs
- Examples: Loading web pages, API calls
```

**Q4: Explain different HTTP methods and their uses.**
```
GET - Retrieve data (idempotent, safe)
POST - Create new resource
PUT - Update/replace entire resource (idempotent)
PATCH - Partial update
DELETE - Remove resource (idempotent)
HEAD - Get headers only (like GET without body)
OPTIONS - Get supported methods (CORS preflight)
```

## Key Takeaways

1. **HTTP** is request-response, **WebSockets** are bidirectional
2. **HTTPS** encrypts data with TLS/SSL certificates
3. **DNS** translates domain names to IP addresses
4. **Different HTTP methods** serve different purposes
5. **Status codes** indicate success, errors, redirects
6. **Headers** carry metadata about requests and responses

## Next Steps

In [Lesson 4: IP Addressing](./04-ip-addressing.md), we'll learn:
- IPv4 vs IPv6
- Public vs Private IP addresses
- Subnetting basics
- NAT (Network Address Translation)

---

**Practice**: Use browser DevTools Network tab daily to observe HTTP requests and responses!
