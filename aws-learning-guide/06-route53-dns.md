# Lesson 06: Route53 (DNS Service)

## What is Route53?

**Route53** = AWS's Domain Name System (DNS) service.

**Features**:
- Domain registration
- DNS routing
- Health checking
- Traffic management

---

## Register Domain

```
1. Go to Route53 Dashboard
2. Click "Register Domain"
3. Search domain: vahanhelp.com
4. Add to cart ($12/year)
5. Contact information
6. Complete purchase
7. Wait for registration (15 min - 24 hours)
```

---

## Create Hosted Zone

Automatically created with domain registration.

**Records**:
- A record: Domain → IP address
- CNAME record: Alias
- MX record: Mail server
- TXT record: Verification

---

## Configure DNS Records

### Point Domain to Load Balancer
```
Type: A
Name: vahanhelp.com
Value: Alias to Load Balancer
```

### Point Subdomain to CloudFront
```
Type: A
Name: cdn.vahanhelp.com
Value: Alias to CloudFront distribution
```

### API Subdomain
```
Type: A
Name: api.vahanhelp.com
Value: Alias to Load Balancer
```

---

## Routing Policies

### Simple Routing
Single resource.

### Weighted Routing
Distribute traffic (A/B testing).

### Latency Routing
Route to lowest latency region.

### Failover Routing
Primary + Backup resources.

### Geolocation Routing
Route based on user location.

---

## VahanHelp DNS Setup

```
vahanhelp.com           → CloudFront (Frontend)
api.vahanhelp.com       → Load Balancer (Backend API)
admin.vahanhelp.com     → S3 Static Website (Admin Panel)
```

---

## SSL Certificate (ACM)

```
1. Go to ACM (Certificate Manager)
2. Request public certificate
3. Domain: *.vahanhelp.com
4. Validation: DNS
5. Add CNAME record to Route53
6. Wait for validation
7. Use certificate in Load Balancer/CloudFront
```

**Next Lesson**: [07-vpc-networking.md](07-vpc-networking.md)
