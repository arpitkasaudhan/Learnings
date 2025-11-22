# Lesson 12: Elastic Beanstalk

## What is Elastic Beanstalk?

**Elastic Beanstalk** = Platform as a Service (PaaS).

**Benefits**:
- Easy deployment
- Automatic infrastructure
- Managed platform
- Built-in monitoring

---

## Deploy Node.js App

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js vahanhelp-backend

# Create environment
eb create vahanhelp-prod

# Deploy
eb deploy

# Open in browser
eb open
```

---

## Configuration

```yaml
# .ebextensions/nodecommand.config
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
```

**Next Lesson**: [13-cloudwatch-monitoring.md](13-cloudwatch-monitoring.md)
