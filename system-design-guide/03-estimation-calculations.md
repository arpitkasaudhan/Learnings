# Lesson 03: Back-of-Envelope Estimation

## Why Estimates Matter

**Capacity planning** = Estimating resources needed for your system.

**What you'll calculate**:
- Traffic (QPS - Queries Per Second)
- Storage (GB/TB)
- Bandwidth (MB/s)
- Memory (for caching)
- Servers needed

**Goal**: Make informed decisions about infrastructure.

---

## Powers of Two (Memorize This!)

| Power | Exact Value | Approx | Name |
|-------|-------------|--------|------|
| 2^10 | 1,024 | ~1 thousand | 1 KB |
| 2^20 | 1,048,576 | ~1 million | 1 MB |
| 2^30 | 1,073,741,824 | ~1 billion | 1 GB |
| 2^40 | 1,099,511,627,776 | ~1 trillion | 1 TB |

**Rule of thumb**: 1 million ≈ 10^6 ≈ 2^20

---

## Latency Numbers (Memorize This!)

| Operation | Latency |
|-----------|---------|
| L1 cache | 0.5 ns |
| L2 cache | 7 ns |
| RAM | 100 ns |
| SSD | 150 μs |
| HDD | 10 ms |
| Network (same datacenter) | 0.5 ms |
| Network (CA to NY) | 40 ms |
| Network (CA to Europe) | 150 ms |

**Key Takeaways**:
- Memory is fast (~100 ns)
- Disk is slow (~10 ms = 100,000x slower than memory)
- Network is slower than disk for long distances

---

## Calculation Framework

### Step 1: Traffic Estimation

**Formula**:
```
QPS = Total requests per day / 86,400 seconds
Peak QPS = QPS × 10 (assume 10x spike)
```

**VahanHelp Example**:

Given:
- 10,000 DAU (Daily Active Users)
- Each user creates 1 quote per day
- Each user views 5 quotes

Calculations:
```
Write QPS:
  10,000 quotes/day ÷ 86,400 sec/day = 0.12 QPS
  Peak write QPS = 0.12 × 10 = 1.2 QPS

Read QPS:
  50,000 views/day ÷ 86,400 = 0.58 QPS
  Peak read QPS = 0.58 × 10 = 5.8 QPS

Total Peak QPS = 1.2 + 5.8 = 7 QPS
```

**Conclusion**: Very low traffic, single server can handle this easily.

---

### Step 2: Storage Estimation

**Formula**:
```
Daily storage = Records per day × Size per record
Yearly storage = Daily storage × 365
N-year storage = Yearly storage × N
```

**VahanHelp Example**:

**User Data**:
```
100,000 users × 1 KB/user = 100 MB
```

**Quote Data**:
```
Per quote: ~5 KB (car details + quote results)
10,000 quotes/day × 5 KB = 50 MB/day
50 MB × 365 days = 18.25 GB/year
18.25 GB × 5 years = 91.25 GB (retention period)
```

**Car Images** (optional):
```
30% of quotes include images
3,000 images/day × 500 KB/image = 1.5 GB/day
1.5 GB × 365 = 547.5 GB/year
547.5 GB × 2 years = 1,095 GB = ~1.1 TB
```

**Total Storage (5 years)**:
```
Users: 100 MB
Quotes: 91 GB
Images: 1.1 TB
Total: ~1.2 TB
```

**Conclusion**: Need ~1.5 TB disk space with some buffer.

---

### Step 3: Bandwidth Estimation

**Formula**:
```
Bandwidth = (Data in + Data out) / Second
```

**VahanHelp Example**:

**Incoming Traffic**:
```
Write requests: 0.12 QPS × 5 KB = 0.6 KB/s
Image uploads: 0.035 QPS × 500 KB = 17.5 KB/s
Total incoming: ~18 KB/s = 0.018 MB/s
```

**Outgoing Traffic**:
```
Read requests: 0.58 QPS × 5 KB = 2.9 KB/s
Image downloads: 0.1 QPS × 500 KB = 50 KB/s
Total outgoing: ~53 KB/s = 0.053 MB/s
```

**Total Bandwidth**: ~0.07 MB/s

**Peak Bandwidth**: 0.07 × 10 = 0.7 MB/s

**Conclusion**: Negligible bandwidth, even cheapest hosting plan works.

---

### Step 4: Memory (Cache) Estimation

**Formula**:
```
Cache size = Hot data × Cache percentage
```

**80/20 Rule**: 20% of data gets 80% of traffic.

**VahanHelp Example**:

Cache popular quotes:
```
Total quotes: 1.8M quotes/year = 9 GB
Hot quotes (20%): 360K quotes = 1.8 GB
Cache in memory: 1.8 GB

Add user sessions:
10,000 concurrent users × 10 KB/session = 100 MB

Total cache needed: ~2 GB
```

**Conclusion**: Redis with 4 GB memory is sufficient.

---

### Step 5: Server Estimation

**Formula**:
```
Servers needed = Peak QPS / Server capacity
```

**Assumptions**:
- Single server handles: ~1,000 QPS
- Database handles: ~10,000 QPS (with indexes)

**VahanHelp Example**:

```
Peak QPS: 7 QPS
Server capacity: 1,000 QPS

Servers needed: 7 / 1,000 = 0.007 servers
```

**Conclusion**: 1 server is more than enough. Add 1 more for redundancy = 2 servers.

---

## Real-World Examples

### Example 1: Twitter

**Given**:
- 300M DAU
- Each user reads 100 tweets/day
- Each user writes 2 tweets/day

**Traffic Estimation**:
```
Read QPS:
  300M × 100 tweets/day = 30B reads/day
  30B / 86,400 = 347,222 QPS
  Peak: 347K × 10 = 3.47M QPS

Write QPS:
  300M × 2 tweets/day = 600M writes/day
  600M / 86,400 = 6,944 QPS
  Peak: 6,944 × 10 = 69,440 QPS
```

**Storage**:
```
Tweets per day: 600M
Tweet size: 280 chars × 2 bytes = 560 bytes
Daily: 600M × 560 bytes = 336 GB/day
Yearly: 336 GB × 365 = 122.6 TB/year
5 years: 613 TB
```

**Bandwidth**:
```
Read: 347K QPS × 560 bytes = 194 MB/s
Write: 6,944 QPS × 560 bytes = 3.9 MB/s
Total: ~200 MB/s
```

**Servers**:
```
Assume 1 server = 1,000 QPS
Servers needed: 3,470,000 / 1,000 = 3,470 servers
With redundancy: ~5,000 servers
```

---

### Example 2: YouTube

**Given**:
- 2B users
- 1B hours of video watched daily
- Average video: 50 MB for 10 minutes

**Storage**:
```
Hours watched: 1B hours/day
Hours uploaded: 500 hours/minute = 720,000 hours/day

Per video (10 min):
  Raw: 1 GB
  Compressed: 50 MB
  Multiple resolutions: 200 MB total

Daily uploads:
  720,000 hours × 6 videos/hour = 4.32M videos/day
  4.32M × 200 MB = 864 TB/day

Yearly: 864 TB × 365 = 315 PB/year
```

**Bandwidth**:
```
Views: 1B hours/day = 6B videos/day (10 min each)
6B videos/day / 86,400 = 69,444 videos/sec
69,444 × 50 MB = 3,472 GB/s = 3.4 TB/s
```

**CDN**: Absolutely required!

---

### Example 3: WhatsApp

**Given**:
- 2B users
- 100B messages/day
- Average message: 100 bytes

**Storage**:
```
Daily: 100B × 100 bytes = 10 TB/day
Yearly: 10 TB × 365 = 3,650 TB = 3.65 PB/year
```

**Traffic**:
```
Messages/second: 100B / 86,400 = 1.16M QPS
```

**Conclusion**: Heavily distributed system required.

---

## Estimation Template

### 1. **Traffic**
```
DAU: _______
Actions per user: _______
Total actions/day: DAU × Actions = _______
QPS: Total / 86,400 = _______
Peak QPS: QPS × 10 = _______
```

### 2. **Storage**
```
Records/day: _______
Size per record: _______
Daily storage: Records × Size = _______
Yearly: Daily × 365 = _______
N-year: Yearly × N = _______
```

### 3. **Bandwidth**
```
Incoming: Write QPS × Avg size = _______ MB/s
Outgoing: Read QPS × Avg size = _______ MB/s
Total: _______ MB/s
```

### 4. **Cache**
```
Total data: _______
Hot data (20%): _______
Cache size needed: _______
```

### 5. **Servers**
```
Peak QPS: _______
Server capacity: 1,000 QPS
Servers: Peak / 1,000 = _______
With redundancy: _______ servers
```

---

## Common Sizes

### Data Sizes
- User record: 1 KB
- Tweet: 280 bytes
- Image (compressed): 500 KB
- Video (10 min, HD): 50 MB
- Log entry: 100 bytes

### Time
- 1 day = 86,400 seconds
- 1 year = 365 days
- 1 month = 30 days (for estimation)

### Traffic
- Small site: < 100 QPS
- Medium site: 100-10K QPS
- Large site: 10K-100K QPS
- Huge site: > 100K QPS

---

## Practice Exercise

**Design TinyURL**

**Given**:
- 100M URLs shortened per month
- 10:1 read/write ratio (10 reads for every 1 write)
- URL size: 500 bytes
- Retention: 5 years

**Your Task**:
Calculate:
1. Write QPS
2. Read QPS
3. Total storage (5 years)
4. Bandwidth (read + write)
5. Cache size (20% hot data)

### Answers

1. **Write QPS**:
```
100M URLs/month = 100M / (30 × 86,400) = 38.5 QPS
Peak: 38.5 × 10 = 385 QPS
```

2. **Read QPS**:
```
10:1 ratio = 38.5 × 10 = 385 QPS
Peak: 385 × 10 = 3,850 QPS
```

3. **Storage**:
```
Monthly: 100M × 500 bytes = 50 GB
Yearly: 50 GB × 12 = 600 GB
5 years: 600 GB × 5 = 3 TB
```

4. **Bandwidth**:
```
Write: 38.5 QPS × 500 bytes = 19.25 KB/s
Read: 385 QPS × 500 bytes = 192.5 KB/s
Total: ~212 KB/s = 0.2 MB/s
```

5. **Cache**:
```
Total: 3 TB
Hot (20%): 600 GB
But cache recent month: 50 GB
```

---

## Summary

**Key Formulas**:
```
QPS = Daily requests / 86,400
Peak QPS = QPS × 10
Storage = Records × Size × Days × Retention
Bandwidth = QPS × Avg size
Cache = 20% of total or recent data
Servers = Peak QPS / 1,000
```

**Tips**:
- Round numbers (easier to calculate)
- Show your work
- State assumptions
- Use powers of 2

**Remember**: These are estimates, not exact numbers. Close enough is good enough!

---

**Next Lesson**: [04-client-server-architecture.md](04-client-server-architecture.md)

Learn about the foundation of all web systems!
