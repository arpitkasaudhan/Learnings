# Lesson 4: IP Addressing & Subnetting

## What is an IP Address?

An **IP (Internet Protocol) address** is a unique numerical identifier assigned to every device connected to a network. Think of it as a postal address for your computer.

## IPv4 Addresses

### Structure

```
Format: Four octets separated by dots
Example: 192.168.1.1

Binary view:
192     .  168     .  1       .  1
11000000.10101000.00000001.00000001

Each octet: 0-255 (8 bits)
Total: 32 bits
Total addresses: 2^32 = 4,294,967,296 (~4.3 billion)
```

### IPv4 Address Classes

**Class A** (Large networks):
```
Range: 1.0.0.0 to 126.0.0.0
First bit: 0
Default mask: 255.0.0.0 (/8)
Networks: 126
Hosts per network: 16,777,214
Use: Very large organizations
```

**Class B** (Medium networks):
```
Range: 128.0.0.0 to 191.255.0.0
First bits: 10
Default mask: 255.255.0.0 (/16)
Networks: 16,384
Hosts per network: 65,534
Use: Medium organizations
```

**Class C** (Small networks):
```
Range: 192.0.0.0 to 223.255.255.0
First bits: 110
Default mask: 255.255.255.0 (/24)
Networks: 2,097,152
Hosts per network: 254
Use: Small businesses, home networks
```

**Class D** (Multicast):
```
Range: 224.0.0.0 to 239.255.255.255
First bits: 1110
Use: Multicast groups (one-to-many)
```

**Class E** (Reserved):
```
Range: 240.0.0.0 to 255.255.255.255
First bits: 1111
Use: Experimental, reserved
```

## Public vs Private IP Addresses

### Private IP Ranges (RFC 1918)

These are **NOT routable** on the internet:

```
Class A: 10.0.0.0 to 10.255.255.255
         10.0.0.0/8
         16,777,216 addresses

Class B: 172.16.0.0 to 172.31.255.255
         172.16.0.0/12
         1,048,576 addresses

Class C: 192.168.0.0 to 192.168.255.255
         192.168.0.0/16
         65,536 addresses
```

**Your home network example**:
```
Router: 192.168.1.1 (private)
Laptop: 192.168.1.100 (private)
Phone: 192.168.1.101 (private)

All share one public IP: 203.45.67.89 (public)
```

### Public IP Addresses

```
Everything NOT in private ranges
Globally unique
Routable on internet
Assigned by ISPs
Example: 8.8.8.8 (Google DNS)
```

### Special IP Addresses

```
0.0.0.0         Default route, "any" address
127.0.0.1       Localhost, loopback (your own computer)
127.0.0.0/8     Entire loopback range
255.255.255.255 Broadcast to local network
169.254.0.0/16  APIPA (Automatic Private IP Addressing)
```

## Subnet Mask

### What is a Subnet Mask?

A subnet mask **divides IP address** into network and host portions.

```
IP Address:    192.168.1.100
Subnet Mask:   255.255.255.0

Binary view:
IP:     11000000.10101000.00000001.01100100
Mask:   11111111.11111111.11111111.00000000
        ^^^^^^^^ ^^^^^^^^ ^^^^^^^^ ^^^^^^^^
        Network portion    | Host portion

Network: 192.168.1.0
Host: 100
```

### CIDR Notation (Classless Inter-Domain Routing)

```
192.168.1.0/24

/24 means first 24 bits are network
     Last 8 bits are host

Common subnet masks:
/8  = 255.0.0.0         (16,777,214 hosts)
/16 = 255.255.0.0       (65,534 hosts)
/24 = 255.255.255.0     (254 hosts)
/25 = 255.255.255.128   (126 hosts)
/26 = 255.255.255.192   (62 hosts)
/27 = 255.255.255.224   (30 hosts)
/28 = 255.255.255.240   (14 hosts)
/29 = 255.255.255.248   (6 hosts)
/30 = 255.255.255.252   (2 hosts) - point-to-point links
/32 = 255.255.255.255   (1 host) - single host
```

## Subnetting Basics

### Why Subnet?

```
Reasons:
1. Organize network (departments, floors)
2. Improve security (isolate segments)
3. Reduce broadcast traffic
4. Efficient IP address usage
```

### Example: Dividing a Network

**Given**: 192.168.1.0/24 (254 hosts)

**Need**: 4 subnets for 4 departments

**Solution**: Borrow 2 host bits

```
Original:  /24 (255.255.255.0)
New:       /26 (255.255.255.192)

Subnet 1: 192.168.1.0/26    (192.168.1.1 - 192.168.1.62)
Subnet 2: 192.168.1.64/26   (192.168.1.65 - 192.168.1.126)
Subnet 3: 192.168.1.128/26  (192.168.1.129 - 192.168.1.190)
Subnet 4: 192.168.1.192/26  (192.168.1.193 - 192.168.1.254)

Each subnet: 62 usable hosts
(64 total - 2 reserved for network and broadcast)
```

### Subnet Calculation

**For 192.168.1.0/26**:

```
Network address:    192.168.1.0     (first address, all host bits 0)
First usable host:  192.168.1.1
Last usable host:   192.168.1.62
Broadcast address:  192.168.1.63    (last address, all host bits 1)
Next subnet:        192.168.1.64
```

**Formula**:
```
Number of subnets = 2^(borrowed bits)
Hosts per subnet = 2^(host bits) - 2

Example /26 from /24:
Borrowed bits: 2
Subnets: 2^2 = 4 subnets
Host bits remaining: 6
Hosts: 2^6 - 2 = 62 usable hosts
```

## IPv6 Addresses

### Why IPv6?

```
Problem: IPv4 addresses exhausted (4.3 billion not enough)
Solution: IPv6

IPv6 addresses: 2^128 = 340 undecillion
(340,282,366,920,938,463,463,374,607,431,768,211,456)

Enough to assign millions of IPs to every person on Earth!
```

### IPv6 Format

```
Format: 8 groups of 4 hexadecimal digits
Example: 2001:0db8:85a3:0000:0000:8a2e:0370:7334

Shorthand rules:
1. Leading zeros can be omitted:
   2001:0db8:85a3:0000:0000:8a2e:0370:7334
   2001:db8:85a3:0:0:8a2e:370:7334

2. Consecutive groups of zeros can be replaced with ::
   2001:db8:85a3:0:0:8a2e:370:7334
   2001:db8:85a3::8a2e:370:7334

3. :: can only be used once:
   2001:0000:0000:0000:0000:0000:0000:0001
   2001::1 (loopback in IPv6)
```

### Common IPv6 Addresses

```
Loopback:       ::1 (like 127.0.0.1 in IPv4)
Unspecified:    :: (like 0.0.0.0 in IPv4)
Link-local:     fe80::/10
Unique local:   fc00::/7 (like private IPs in IPv4)
Multicast:      ff00::/8
Global unicast: 2000::/3 (public IPs)
```

### IPv6 in URLs

```
Because of colons, IPv6 addresses in URLs use brackets:

http://[2001:db8:85a3::8a2e:370:7334]/
https://[2001:db8::1]:8080/api

Not:
http://2001:db8::1/  ❌ (ambiguous with port)
```

## NAT (Network Address Translation)

### What is NAT?

NAT allows **multiple devices** with private IPs to share **one public IP**.

### How NAT Works

```
Your Home Network:

Private IPs:
Laptop: 192.168.1.100
Phone:  192.168.1.101
TV:     192.168.1.102

Router Public IP: 203.45.67.89

When laptop requests google.com:

1. Laptop sends: 192.168.1.100:50000 → google.com:80
2. Router translates:
   Changes source to: 203.45.67.89:50000 → google.com:80
   Remembers: Port 50000 = Laptop
3. Google responds to: 203.45.67.89:50000
4. Router translates back:
   Forwards to: 192.168.1.100:50000
```

### NAT Translation Table

```
Private IP:Port      →  Public IP:Port    →  Destination
192.168.1.100:50000  →  203.45.67.89:50000  →  google.com:80
192.168.1.101:50001  →  203.45.67.89:50001  →  facebook.com:443
192.168.1.102:50002  →  203.45.67.89:50002  →  youtube.com:443
```

### Types of NAT

**1. Static NAT** (one-to-one):
```
Private IP 192.168.1.100 always maps to public IP 203.45.67.89
Used for servers that need consistent public IP
```

**2. Dynamic NAT** (pool):
```
Private IPs map to pool of public IPs
First come, first served
```

**3. PAT (Port Address Translation)** - Most common:
```
Multiple private IPs share ONE public IP
Differentiated by port numbers
Your home router uses this!
```

### Port Forwarding

```
Problem: External users can't reach devices behind NAT

Solution: Port forwarding

Example: Running web server on laptop (192.168.1.100:8080)

Router rule:
External 203.45.67.89:80 → Internal 192.168.1.100:8080

Now people can access:
http://203.45.67.89 → reaches your laptop's web server
```

## DHCP (Dynamic Host Configuration Protocol)

### What is DHCP?

DHCP **automatically assigns** IP addresses to devices.

### DHCP Process (DORA)

```
1. Discover: Client broadcasts "I need an IP!"
   0.0.0.0 → 255.255.255.255

2. Offer: DHCP server offers an IP
   "You can use 192.168.1.100"

3. Request: Client accepts offer
   "I'll take 192.168.1.100"

4. Acknowledge: Server confirms
   "192.168.1.100 is yours for 24 hours"
```

### DHCP Lease

```
Lease time: How long you can use the IP
Typical: 24 hours to 7 days

Renewal: Client tries to renew at 50% of lease time
         If successful, keeps same IP
         If not, requests new IP before lease expires
```

### Static vs Dynamic IP

**Dynamic (DHCP)**:
```
✓ Automatic configuration
✓ Easy for clients
✓ Efficient IP usage
✗ IP can change
Use: Most devices (laptops, phones)
```

**Static**:
```
✓ IP never changes
✓ Reliable for servers
✗ Manual configuration
✗ Can cause conflicts
Use: Servers, printers, routers
```

## Practical IP Commands

### Check Your IP Address

**Windows**:
```bash
ipconfig

# More details
ipconfig /all

# Release DHCP IP
ipconfig /release

# Renew DHCP IP
ipconfig /renew
```

**Linux/Mac**:
```bash
# Show IP addresses
ip addr show
# or
ifconfig

# Show routing table
ip route show

# Release/renew (Linux)
sudo dhclient -r  # release
sudo dhclient     # renew
```

### Test Connectivity

```bash
# Ping IP address
ping 8.8.8.8

# Ping domain name
ping google.com

# Trace route to destination
traceroute google.com  # Linux/Mac
tracert google.com     # Windows

# Show route to destination
ip route get 8.8.8.8
```

### DNS Lookup

```bash
# Resolve domain to IP
nslookup google.com

# More detailed DNS info
dig google.com

# Reverse lookup (IP to domain)
nslookup 8.8.8.8
```

## IP Addressing in Your Code

### Node.js

```javascript
const os = require('os');

// Get network interfaces
const interfaces = os.networkInterfaces();
console.log(interfaces);

// Find your IP address
Object.keys(interfaces).forEach(name => {
  interfaces[name].forEach(iface => {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`${name}: ${iface.address}`);
    }
  });
});

// DNS lookup
const dns = require('dns');

dns.lookup('google.com', (err, address, family) => {
  console.log('IP:', address);  // 172.217.164.142
});

// Get your public IP (from external service)
const https = require('https');
https.get('https://api.ipify.org', (res) => {
  res.on('data', (ip) => {
    console.log('Public IP:', ip.toString());
  });
});
```

### Express.js

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // Get client IP
  const clientIP = req.ip;
  const forwardedFor = req.headers['x-forwarded-for'];

  console.log('Client IP:', clientIP);
  console.log('Forwarded for:', forwardedFor);

  res.send(`Your IP: ${clientIP}`);
});

// Bind to specific IP
app.listen(3000, '192.168.1.100', () => {
  console.log('Server on 192.168.1.100:3000');
});

// Bind to all interfaces
app.listen(3000, '0.0.0.0', () => {
  console.log('Server on all interfaces');
});
```

## Real-World Scenarios

### Scenario 1: Home Network Setup

```
ISP provides:
Public IP: 203.45.67.89 (dynamic)

Your router:
WAN (external): 203.45.67.89
LAN (internal): 192.168.1.1

DHCP range: 192.168.1.100 - 192.168.1.200

Your devices (auto-assigned):
Laptop: 192.168.1.100
Phone: 192.168.1.101
TV: 192.168.1.102

Static IPs (manually set):
Network printer: 192.168.1.10
NAS storage: 192.168.1.11
```

### Scenario 2: Company Network

```
Company has /24 network: 192.168.1.0/24

Divided into subnets:

1. Management: 192.168.1.0/26 (62 hosts)
   192.168.1.1 - 192.168.1.62

2. Sales: 192.168.1.64/26 (62 hosts)
   192.168.1.65 - 192.168.1.126

3. IT: 192.168.1.128/27 (30 hosts)
   192.168.1.129 - 192.168.1.158

4. Servers: 192.168.1.160/28 (14 hosts)
   192.168.1.161 - 192.168.1.174

Benefits:
- Departments isolated
- Firewall rules per subnet
- Reduced broadcast traffic
```

## Common Issues & Troubleshooting

### IP Conflict

```
Problem: Two devices have same IP
Symptoms: Network doesn't work, IP conflict error

Solution:
1. Check for static IPs in DHCP range
2. Reduce DHCP range
3. Renew IP: ipconfig /renew
```

### Can't Get IP (169.254.x.x)

```
Problem: DHCP server not responding
Symptoms: IP starts with 169.254 (APIPA)

Solution:
1. Check DHCP server is running
2. Check network cable/WiFi
3. Restart router
4. ipconfig /renew
```

### Can Ping IP but Not Domain

```
Problem: DNS not working
Can ping: ping 8.8.8.8 ✓
Can't ping: ping google.com ✗

Solution:
1. Check DNS settings
2. Set DNS to 8.8.8.8 (Google)
3. Flush DNS cache:
   ipconfig /flushdns (Windows)
   sudo dscacheutil -flushcache (Mac)
```

## Interview Questions

**Q: What's the difference between IPv4 and IPv6?**
```
IPv4: 32-bit, 4.3 billion addresses, dotted decimal
IPv6: 128-bit, 340 undecillion addresses, hexadecimal
IPv6 created due to IPv4 exhaustion
```

**Q: What are private IP addresses?**
```
10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
Not routable on internet
Used in local networks
Multiple devices share one public IP via NAT
```

**Q: What is subnetting and why use it?**
```
Dividing large network into smaller subnets
Benefits:
- Better organization
- Improved security
- Reduced broadcast traffic
- Efficient IP usage
```

**Q: How does NAT work?**
```
Translates private IPs to public IP
Router maintains translation table
Maps internal IP:port to external IP:port
Allows multiple devices to share one public IP
```

## Key Takeaways

1. **IPv4**: 32-bit addresses, 4.3 billion total
2. **IPv6**: 128-bit addresses, virtually unlimited
3. **Private IPs**: Used in local networks (192.168.x.x)
4. **Public IPs**: Globally unique, routable on internet
5. **Subnet mask**: Divides network and host portions
6. **NAT**: Multiple private IPs share one public IP
7. **DHCP**: Automatically assigns IP addresses

## Next Steps

In [Lesson 5: Network Security](./05-network-security.md), we'll learn:
- SSL/TLS encryption
- Firewalls
- VPN
- Common network attacks and defenses

---

**Practice**: Run `ipconfig` or `ifconfig` on your computer and identify your IP, subnet mask, and default gateway!
