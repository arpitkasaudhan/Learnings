# Lesson 1: Introduction to Computer Networking

## What is Computer Networking?

Computer networking is the practice of connecting computers and devices together to share resources, exchange data, and communicate. Networks enable everything from browsing websites to video calls, cloud storage, and online gaming.

### Key Concepts

**Network**: A collection of computers, servers, and devices connected to share resources.

**Node**: Any device connected to a network (computer, phone, printer, router, etc.).

**Host**: A computer or device that provides services or resources to other devices on the network.

**Client**: A device that requests services or resources from a host/server.

**Server**: A computer that provides services, resources, or data to clients.

## Types of Networks

### 1. LAN (Local Area Network)
- **Coverage**: Small geographic area (home, office, building)
- **Speed**: Very fast (100 Mbps to 10 Gbps)
- **Examples**: Home Wi-Fi, Office network
- **Characteristics**:
  - Low latency
  - High bandwidth
  - Owned and managed by single organization

```
Example: Your Home Network
[Router] ---- [Laptop]
   |
   |---- [Phone]
   |
   |---- [Smart TV]
   |
   |---- [IoT Devices]
```

### 2. WAN (Wide Area Network)
- **Coverage**: Large geographic area (city, country, world)
- **Speed**: Varies (slower than LAN)
- **Examples**: The Internet, Corporate networks across cities
- **Characteristics**:
  - Higher latency
  - Uses public infrastructure
  - Connects multiple LANs

```
Example: Corporate WAN
[Office NY LAN] ---- Internet ---- [Office SF LAN]
                        |
                   [Office London LAN]
```

### 3. MAN (Metropolitan Area Network)
- **Coverage**: City or large campus
- **Speed**: Between LAN and WAN
- **Examples**: City-wide Wi-Fi, University campus network
- **Characteristics**:
  - Covers larger area than LAN
  - Smaller than WAN
  - Often owned by single entity

### 4. PAN (Personal Area Network)
- **Coverage**: Very small (few meters)
- **Speed**: Moderate
- **Examples**: Bluetooth connections, USB connections
- **Characteristics**:
  - Personal devices
  - Short range
  - Low power

## Network Topologies

### 1. Star Topology
```
      [Switch/Hub]
         /  |  \
       /    |    \
    [PC1] [PC2] [PC3]
```
- All devices connect to central hub
- Most common in modern networks
- **Pros**: Easy to manage, failure of one device doesn't affect others
- **Cons**: Central hub is single point of failure

### 2. Bus Topology
```
[PC1]---[PC2]---[PC3]---[PC4]
    (Single cable backbone)
```
- All devices share single communication line
- **Pros**: Simple, cheap
- **Cons**: Single point of failure, performance degrades with more devices

### 3. Ring Topology
```
    [PC1]
   /      \
[PC4]    [PC2]
   \      /
    [PC3]
```
- Each device connects to exactly two other devices
- **Pros**: Equal access for all devices
- **Cons**: One failure can break the entire network

### 4. Mesh Topology
```
[PC1]---[PC2]
 | \     / |
 |  \ /   |
 |  / \   |
 | /   \  |
[PC3]---[PC4]
```
- Every device connects to every other device
- **Pros**: Highly reliable, no single point of failure
- **Cons**: Expensive, complex

## Network Components

### 1. Router
- Connects different networks together
- Forwards data between networks
- Makes decisions about best path for data
- Your home router connects your LAN to the Internet (WAN)

### 2. Switch
- Connects devices within a LAN
- Forwards data to specific devices (not broadcast)
- More intelligent than hub
- Modern networks use switches

### 3. Hub
- Connects devices in a LAN
- Broadcasts data to all connected devices
- Less efficient than switch
- Rarely used in modern networks

### 4. Modem
- Modulates and demodulates signals
- Converts digital signals to analog (and vice versa)
- Connects your network to ISP

### 5. Access Point (AP)
- Provides wireless connectivity
- Extends wired network to wireless devices
- Common in offices and public spaces

### 6. Firewall
- Security device/software
- Monitors and controls network traffic
- Blocks unauthorized access

## Network Models

### Client-Server Model
```
    [Server]
       |
    [Switch]
    /  |  \
  /    |    \
[C1]  [C2]  [C3]
```
- Centralized server provides services
- Clients request services from server
- **Examples**: Web servers, email servers, database servers
- **Pros**: Centralized control, security, backup
- **Cons**: Server is single point of failure, can be expensive

### Peer-to-Peer (P2P) Model
```
[Peer1] ---- [Peer2]
   |     X      |
   |   /   \    |
[Peer3] ---- [Peer4]
```
- All devices are equal (peers)
- Each device can be client and server
- **Examples**: File sharing (BitTorrent), blockchain
- **Pros**: No central server needed, distributed
- **Cons**: Security concerns, harder to manage

## Data Transmission Modes

### 1. Simplex
- One-way communication only
- Example: Keyboard to computer, TV broadcast

### 2. Half-Duplex
- Two-way communication, but not simultaneously
- Example: Walkie-talkie, CB radio

### 3. Full-Duplex
- Two-way communication simultaneously
- Example: Phone call, modern Ethernet

## Bandwidth vs Latency

### Bandwidth
- **Definition**: Amount of data transmitted in given time
- **Measured in**: bps (bits per second), Mbps, Gbps
- **Analogy**: Width of a pipe
- **Example**: 100 Mbps internet connection

### Latency
- **Definition**: Time delay for data to travel from source to destination
- **Measured in**: milliseconds (ms)
- **Analogy**: Length of a pipe
- **Example**: 20ms ping time

### Throughput
- **Definition**: Actual amount of data successfully transmitted
- **Always ≤ Bandwidth** (due to overhead, errors, etc.)

## Real-World Examples

### 1. Home Network
```
[ISP] --- [Modem] --- [Router] --- [Switch] --- [PC]
                         |             |
                      [Wi-Fi AP]    [Smart TV]
                         |
                    [Phones/Tablets]
```

### 2. Small Office Network
```
                [Internet]
                    |
                [Firewall]
                    |
                [Router]
                    |
            [Core Switch]
            /     |      \
          /       |        \
   [Dept Switch] [Dept Switch] [Dept Switch]
      /  |  \      /  |  \       /  |  \
   [PCs]...    [PCs]...      [PCs]...
```

## Practical Exercise

### Exercise 1: Identify Your Network
1. Open Command Prompt (Windows) or Terminal (Mac/Linux)
2. Run: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Find your:
   - IP Address
   - Subnet Mask
   - Default Gateway (your router)

### Exercise 2: Check Your Connection
```bash
# Check if you can reach Google's DNS
ping 8.8.8.8

# Check latency to a website
ping google.com

# Trace the route to a website
traceroute google.com  # Mac/Linux
tracert google.com     # Windows
```

### Exercise 3: Network Speed Test
1. Visit speedtest.net
2. Run speed test
3. Note:
   - Download speed (bandwidth)
   - Upload speed (bandwidth)
   - Ping (latency)

## Common Network Speeds

| Technology | Speed | Use Case |
|------------|-------|----------|
| Dial-up | 56 Kbps | Obsolete |
| DSL | 1-100 Mbps | Home broadband |
| Cable | 10-500 Mbps | Home broadband |
| Fiber | 100 Mbps - 10 Gbps | Home/Business |
| 4G LTE | 5-50 Mbps | Mobile |
| 5G | 100 Mbps - 10 Gbps | Mobile |
| Ethernet (Cat5e) | 1 Gbps | LAN |
| Ethernet (Cat6) | 10 Gbps | LAN |
| Wi-Fi 4 (802.11n) | 150-600 Mbps | Wireless LAN |
| Wi-Fi 5 (802.11ac) | 433 Mbps - 6.9 Gbps | Wireless LAN |
| Wi-Fi 6 (802.11ax) | Up to 9.6 Gbps | Wireless LAN |

## Key Takeaways

1. **Networks connect devices** to share resources and communicate
2. **Different network types** serve different purposes (LAN, WAN, MAN, PAN)
3. **Network topology** affects performance and reliability
4. **Network devices** (router, switch, modem) each have specific roles
5. **Bandwidth** (speed) and **latency** (delay) both matter for performance

## Interview Questions

**Q1: What's the difference between LAN and WAN?**
- LAN covers small area, WAN covers large area
- LAN is faster with lower latency
- LAN is privately owned, WAN often uses public infrastructure

**Q2: What's the difference between a router and a switch?**
- Router connects different networks, switch connects devices in same network
- Router operates at Layer 3 (Network), switch at Layer 2 (Data Link)
- Router makes decisions about routing, switch forwards frames

**Q3: What's the difference between bandwidth and latency?**
- Bandwidth: Amount of data transmitted (like pipe width)
- Latency: Time delay for data travel (like pipe length)
- Both affect network performance

## Next Steps

In [Lesson 2: OSI & TCP/IP Models](./02-osi-tcpip-models.md), we'll learn:
- The 7 layers of the OSI model
- TCP/IP protocol suite
- How data flows through networks
- Encapsulation and de-encapsulation

---

**Practice**: Before moving on, make sure you can identify all devices in your home network and understand their roles!
