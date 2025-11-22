# Lesson 08: Elastic Load Balancer

## What is ELB?

**Load Balancer** = Distributes traffic across multiple targets.

**Types**:
- ALB (Application Load Balancer) - HTTP/HTTPS
- NLB (Network Load Balancer) - TCP/UDP
- CLB (Classic Load Balancer) - Legacy

---

## Create Application Load Balancer

```
1. Go to EC2 → Load Balancers
2. Create Load Balancer → ALB
3. Name: VahanHelp-ALB
4. Scheme: Internet-facing
5. IP address type: IPv4
6. Listeners: HTTP:80, HTTPS:443
7. Availability Zones: Select 2+ AZs
8. Security Group: Allow HTTP/HTTPS
9. Target Group: VahanHelp-Backend
10. Health check: /api/health
11. Create
```

---

## Target Groups

```bash
# Create target group
aws elbv2 create-target-group \
  --name vahanhelp-backend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-123 \
  --health-check-path /api/health

# Register targets
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --targets Id=i-instance1 Id=i-instance2
```

---

## SSL/TLS Certificate

```
1. Request certificate in ACM
2. Add to ALB listener
3. Redirect HTTP → HTTPS
```

**Next Lesson**: [09-auto-scaling.md](09-auto-scaling.md)
