# Lesson 2: OSI & TCP/IP Models

## Why Do We Need Network Models?

Network models provide a **standardized framework** for understanding how data travels across networks. They break down complex networking into manageable layers, making it easier to:
- Troubleshoot problems
- Design networks
- Develop protocols
- Understand communication

## The OSI Model (Open Systems Interconnection)

### 7 Layers of OSI Model

```
Application Layer     [Layer 7]  ← User Interface
Presentation Layer    [Layer 6]  ← Data Format
Session Layer         [Layer 5]  ← Connections
Transport Layer       [Layer 4]  ← End-to-End Delivery
Network Layer         [Layer 3]  ← Routing
Data Link Layer       [Layer 2]  ← Switching
Physical Layer        [Layer 1]  ← Hardware
```

**Mnemonic to Remember**: "All People Seem To Need Data Processing"
- **A**pplication
- **P**resentation
- **S**ession
- **T**ransport
- **N**etwork
- **D**ata Link
- **P**hysical

### Layer 7: Application Layer

**Purpose**: Provides network services directly to end-users

**Functions**:
- User interface
- Network process to application
- Provides protocols for applications

**Protocols**:
- HTTP/HTTPS (Web browsing)
- FTP (File transfer)
- SMTP (Email sending)
- POP3/IMAP (Email receiving)
- DNS (Domain name resolution)
- SSH (Secure shell)

**Real Example**:
```
When you type "google.com" in browser:
- Browser (application) uses HTTP protocol
- DNS resolves domain to IP address
- Application layer handles this user request
```

**In Your Code**:
```javascript
// Application Layer - Making HTTP request
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data));

// This is Application Layer in action!
```

### Layer 6: Presentation Layer

**Purpose**: Translates data formats, encryption/decryption, compression

**Functions**:
- Data encryption/decryption
- Data compression
- Character encoding (ASCII, Unicode)
- Format conversion

**Protocols/Standards**:
- SSL/TLS (Encryption)
- JPEG, GIF, PNG (Image formats)
- MPEG, QuickTime (Video formats)
- ASCII, EBCDIC (Character encoding)

**Real Example**:
```
Sending encrypted data over HTTPS:
1. Your data: "password123"
2. Presentation layer encrypts: "x7g#9kL@pQ2"
3. Sent over network encrypted
4. Receiver's presentation layer decrypts back
```

**In Your Code**:
```javascript
// Presentation Layer - Data encryption
const encryptedData = CryptoJS.AES.encrypt(
  'sensitive data',
  'secret-key'
).toString();

// JSON conversion (data formatting)
const jsonData = JSON.stringify({ name: 'John', age: 30 });
```

### Layer 5: Session Layer

**Purpose**: Manages sessions/connections between applications

**Functions**:
- Establishes, maintains, and terminates sessions
- Synchronization
- Dialog control (half-duplex or full-duplex)
- Session checkpointing and recovery

**Protocols**:
- NetBIOS
- RPC (Remote Procedure Call)
- PPTP (Point-to-Point Tunneling Protocol)

**Real Example**:
```
Video call (Zoom/Teams):
- Session layer establishes connection
- Maintains it during the call
- Handles reconnection if interrupted
- Terminates when you hang up
```

**In Your Code**:
```javascript
// Session Layer - WebSocket connection management
const socket = new WebSocket('wss://example.com/socket');

socket.onopen = () => {
  console.log('Session established');
};

socket.onclose = () => {
  console.log('Session terminated');
};

// Session maintains continuous connection
```

### Layer 4: Transport Layer

**Purpose**: Ensures reliable data delivery between devices

**Functions**:
- Segmentation and reassembly
- Error detection and correction
- Flow control
- Port addressing

**Protocols**:
- **TCP** (Transmission Control Protocol)
  - Connection-oriented
  - Reliable
  - Error checking
  - Used for: HTTP, HTTPS, FTP, Email

- **UDP** (User Datagram Protocol)
  - Connectionless
  - Faster but less reliable
  - No error checking
  - Used for: Video streaming, gaming, DNS

**TCP vs UDP**:
```
TCP (Reliable):
[Sender] --SYN--> [Receiver]
[Sender] <--SYN-ACK-- [Receiver]
[Sender] --ACK--> [Receiver]
(3-way handshake)

UDP (Fast):
[Sender] --Data--> [Receiver]
(No handshake, just send)
```

**Real Example**:
```
Web browsing (TCP):
- Browser ensures all page data received
- If packet lost, requests retransmission
- Order maintained

Live streaming (UDP):
- Speed more important than reliability
- If frame lost, keep going
- Don't wait for retransmission
```

**In Your Code**:
```javascript
// TCP connection (HTTP uses TCP)
fetch('https://api.example.com/data'); // Reliable

// UDP-like behavior (WebRTC for video)
const peerConnection = new RTCPeerConnection();
// Uses UDP for real-time video/audio
```

**Port Numbers**:
```
HTTP: 80
HTTPS: 443
FTP: 21
SSH: 22
SMTP: 25
DNS: 53
MongoDB: 27017
PostgreSQL: 5432
Redis: 6379
```

### Layer 3: Network Layer

**Purpose**: Routes packets across networks

**Functions**:
- Logical addressing (IP addresses)
- Routing
- Packet forwarding
- Fragmentation and reassembly

**Protocols**:
- IP (Internet Protocol)
- ICMP (Internet Control Message Protocol) - used by ping
- ARP (Address Resolution Protocol)
- Routing protocols: OSPF, BGP, RIP

**Real Example**:
```
Sending email from NY to London:
Router 1 (NY) → Router 2 (Atlantic) → Router 3 (London)
Each router uses IP address to determine next hop
```

**IP Addresses**:
```
IPv4: 192.168.1.1 (32-bit, 4.3 billion addresses)
IPv6: 2001:0db8:85a3::8a2e:0370:7334 (128-bit, 340 undecillion addresses)
```

**In Your Code**:
```javascript
// Network Layer - Working with IP addresses
const dns = require('dns');

dns.lookup('google.com', (err, address) => {
  console.log('IP address:', address); // 172.217.164.142
});

// Your app doesn't directly handle routing,
// but understands IP addressing
```

### Layer 2: Data Link Layer

**Purpose**: Transfers data between adjacent network nodes

**Functions**:
- Physical addressing (MAC addresses)
- Frame creation
- Error detection
- Flow control

**Sub-layers**:
- **LLC** (Logical Link Control)
- **MAC** (Media Access Control)

**Protocols**:
- Ethernet
- Wi-Fi (802.11)
- PPP (Point-to-Point Protocol)

**MAC Address**:
```
Format: 48-bit hexadecimal
Example: 00:1A:2B:3C:4D:5E
First 24 bits: Manufacturer ID
Last 24 bits: Device ID
```

**Real Example**:
```
Within your home network:
- Your laptop MAC: AA:BB:CC:DD:EE:FF
- Router MAC: 11:22:33:44:55:66
- Switch uses MAC addresses to forward frames
```

**Frame Structure**:
```
[Preamble][Dest MAC][Source MAC][Type][Data][CRC]
```

### Layer 1: Physical Layer

**Purpose**: Transmits raw bits over physical medium

**Functions**:
- Bit transmission
- Physical topology
- Signal encoding
- Hardware specifications

**Components**:
- Cables (Ethernet, Fiber optic)
- Network adapters
- Hubs
- Repeaters
- Modems

**Transmission Media**:
```
Wired:
- Coaxial cable
- Twisted pair (Cat5e, Cat6)
- Fiber optic

Wireless:
- Radio waves (Wi-Fi, Bluetooth)
- Microwave
- Infrared
```

**Real Example**:
```
Ethernet cable transmitting bits:
Electrical signal: High voltage = 1, Low voltage = 0
10110101... → Converted to electrical signals → Transmitted
```

## TCP/IP Model (Internet Protocol Suite)

The TCP/IP model is a simplified, practical model with 4 layers:

```
OSI Model                TCP/IP Model
-------------           ---------------
Application     ]
Presentation    ]  →    Application Layer
Session         ]

Transport       →       Transport Layer

Network         →       Internet Layer

Data Link       ]  →    Network Access Layer
Physical        ]
```

### TCP/IP Layers

#### 1. Application Layer
- Combines OSI layers 5, 6, 7
- Protocols: HTTP, FTP, SMTP, DNS, SSH

#### 2. Transport Layer
- Same as OSI Layer 4
- Protocols: TCP, UDP

#### 3. Internet Layer
- Same as OSI Layer 3
- Protocols: IP, ICMP, ARP

#### 4. Network Access Layer
- Combines OSI layers 1, 2
- Handles physical transmission

## Data Encapsulation Process

### Sending Data (Top to Bottom)

```
Layer 7 (Application):    [Data]
                          ↓
Layer 4 (Transport):      [TCP Header | Data] = Segment
                          ↓
Layer 3 (Network):        [IP Header | TCP Header | Data] = Packet
                          ↓
Layer 2 (Data Link):      [Frame Header | IP Header | TCP Header | Data | Frame Trailer] = Frame
                          ↓
Layer 1 (Physical):       01011010101... (Bits)
```

### Receiving Data (Bottom to Top)

```
Layer 1: Receives bits → Converts to frame
Layer 2: Removes frame header/trailer → Passes packet
Layer 3: Removes IP header → Passes segment
Layer 4: Removes TCP header → Passes data
Layer 7: Receives original data
```

## Real-World Example: Browsing a Website

Let's trace what happens when you visit `https://example.com`:

```
YOUR COMPUTER:

Layer 7 (Application):
- Browser creates HTTP GET request
- Request: "GET / HTTP/1.1"

Layer 6 (Presentation):
- Encrypts data using TLS
- Converts to proper format

Layer 5 (Session):
- Establishes SSL/TLS session
- Manages connection

Layer 4 (Transport):
- Adds TCP header
- Source port: 50000, Destination port: 443 (HTTPS)
- Creates segments

Layer 3 (Network):
- Adds IP header
- Source IP: 192.168.1.100 (your IP)
- Destination IP: 93.184.216.34 (example.com)
- Creates packets

Layer 2 (Data Link):
- Adds Ethernet header
- Source MAC: Your computer's MAC
- Destination MAC: Router's MAC
- Creates frames

Layer 1 (Physical):
- Converts to electrical/optical signals
- Transmits over cable/wireless

--- INTERNET ---

(Routers process at Layer 3, switches at Layer 2)

SERVER (example.com):

Layer 1: Receives signals → Converts to frames
Layer 2: Removes Ethernet header
Layer 3: Removes IP header
Layer 4: Removes TCP header, reassembles segments
Layer 5: Verifies session
Layer 6: Decrypts data
Layer 7: Web server processes HTTP request → Sends response

--- Response travels back the same way ---
```

## Practical Debugging with OSI Model

### Troubleshooting Network Issues

**Layer 1 (Physical) Issues**:
- Cable unplugged
- Bad cable
- Network adapter disabled
- No Wi-Fi signal

**How to check**:
```bash
# Check if network interface is up
ip link show  # Linux
ipconfig      # Windows

# Check cable connection
ethtool eth0  # Linux
```

**Layer 2 (Data Link) Issues**:
- MAC address conflict
- Switch misconfiguration
- VLAN issues

**How to check**:
```bash
# View MAC address
ip addr show        # Linux
ipconfig /all       # Windows

# Check ARP table
arp -a
```

**Layer 3 (Network) Issues**:
- Wrong IP address
- Incorrect subnet mask
- Routing problems

**How to check**:
```bash
# Check IP configuration
ip addr             # Linux
ipconfig            # Windows

# Test connectivity
ping 8.8.8.8

# Trace route
traceroute google.com   # Linux
tracert google.com      # Windows
```

**Layer 4 (Transport) Issues**:
- Port blocked
- Firewall blocking
- Service not running

**How to check**:
```bash
# Check open ports
netstat -an
ss -tuln            # Linux

# Test specific port
telnet example.com 80
nc -zv example.com 80
```

**Layer 7 (Application) Issues**:
- Web server down
- Incorrect URL
- Application error

**How to check**:
```bash
# Test HTTP connection
curl -v https://example.com

# Check DNS resolution
nslookup example.com
dig example.com
```

## Interview Questions

**Q1: Explain the OSI model and its layers.**
```
7 layers from top to bottom:
- Application: User interface, protocols (HTTP, FTP)
- Presentation: Data format, encryption
- Session: Connection management
- Transport: Reliable delivery (TCP/UDP)
- Network: Routing, IP addressing
- Data Link: Switching, MAC addressing
- Physical: Bit transmission, hardware
```

**Q2: What's the difference between TCP and UDP?**
```
TCP (Reliable):
- Connection-oriented (3-way handshake)
- Reliable delivery
- Error checking & retransmission
- Ordered delivery
- Slower
- Used for: HTTP, Email, FTP

UDP (Fast):
- Connectionless
- No delivery guarantee
- No error checking
- Faster
- Used for: Video streaming, Gaming, DNS
```

**Q3: What happens when you type a URL in browser?**
```
1. DNS lookup (Application Layer) - Resolve domain to IP
2. TCP connection (Transport Layer) - 3-way handshake
3. HTTP request (Application Layer) - Send GET request
4. Routing (Network Layer) - Packets routed to server
5. Server processes request
6. Server sends response back
7. Browser renders page
```

**Q4: What's the difference between OSI and TCP/IP models?**
```
OSI (7 layers):
- Theoretical model
- More detailed
- Developed by ISO

TCP/IP (4 layers):
- Practical model
- What internet actually uses
- Developed by DARPA
```

## Practical Exercises

### Exercise 1: Trace a Network Request

Open browser DevTools (F12) and go to Network tab:
```
1. Visit any website
2. Click on first request
3. Observe:
   - Request headers (Application Layer)
   - Response headers
   - Status code
   - Timing (shows all layers in action)
```

### Exercise 2: Test Each Layer

```bash
# Layer 1 (Physical)
ip link show  # Is interface up?

# Layer 2 (Data Link)
arp -a  # View MAC address table

# Layer 3 (Network)
ping 8.8.8.8  # Can reach Google's DNS?

# Layer 4 (Transport)
telnet google.com 80  # Can connect to port 80?

# Layer 7 (Application)
curl https://google.com  # Can retrieve webpage?
```

### Exercise 3: Analyze with Wireshark

1. Install Wireshark (packet analyzer)
2. Start capture
3. Visit a website
4. Stop capture
5. Analyze packets at each layer

## Key Takeaways

1. **OSI model** has 7 layers, **TCP/IP** has 4 layers
2. **Each layer** has specific responsibilities
3. **Encapsulation** adds headers at each layer going down
4. **De-encapsulation** removes headers going up
5. **TCP** is reliable, **UDP** is fast
6. **Troubleshooting** uses layer-by-layer approach

## Next Steps

In [Lesson 3: Network Protocols](./03-network-protocols.md), we'll dive deep into:
- HTTP/HTTPS in detail
- WebSockets for real-time communication
- DNS and how domain names work
- Other essential protocols (FTP, SSH, etc.)

---

**Practice**: Use `ping`, `traceroute`, and browser DevTools to see the OSI model in action!
