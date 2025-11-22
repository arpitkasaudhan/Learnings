# Lesson 10: CloudFront (CDN)

## What is CloudFront?

**CloudFront** = Content Delivery Network (CDN).

**Benefits**:
- Faster content delivery
- Lower latency
- DDoS protection
- SSL/TLS support

---

## Create Distribution

```
1. Go to CloudFront
2. Create distribution
3. Origin: S3 bucket or Load Balancer
4. Price class: Use all edge locations
5. Alternate domain: cdn.vahanhelp.com
6. SSL certificate: Custom (from ACM)
7. Default root object: index.html
8. Create
```

---

## Use Cases

### Frontend (S3 + CloudFront)
```
S3 Bucket → CloudFront → Route53 → Users
```

### Images (S3 + CloudFront)
```
S3: vahanhelp-car-images
CloudFront: https://cdn.vahanhelp.com/cars/image.jpg
```

---

## Invalidate Cache

```bash
aws cloudfront create-invalidation \
  --distribution-id E123456 \
  --paths "/*"
```

**Next Lesson**: [11-lambda-serverless.md](11-lambda-serverless.md)
