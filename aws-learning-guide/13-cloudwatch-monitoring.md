# Lesson 13: CloudWatch Monitoring

## What is CloudWatch?

**CloudWatch** = Monitoring and observability service.

**Features**:
- Logs aggregation
- Metrics collection
- Alarms and notifications
- Dashboards
- Application insights

---

## CloudWatch Logs

### Send Node.js Logs to CloudWatch

```javascript
// Install winston + cloudwatch transport
const winston = require('winston');
const CloudWatchTransport = require('winston-cloudwatch');

const logger = winston.createLogger({
  transports: [
    new CloudWatchTransport({
      logGroupName: '/vahanhelp/backend',
      logStreamName: `${new Date().toISOString().split('T')[0]}-api`,
      awsRegion: 'us-east-1',
      jsonMessage: true
    })
  ]
});

// Use logger
logger.info('User registered', { userId: 123, email: 'user@example.com' });
logger.error('Payment failed', { orderId: 456, error: 'Card declined' });
```

### Query Logs

```bash
# View logs
aws logs tail /vahanhelp/backend --follow

# Filter logs
aws logs filter-log-events \
  --log-group-name /vahanhelp/backend \
  --filter-pattern "ERROR"

# Search for specific user
aws logs filter-log-events \
  --log-group-name /vahanhelp/backend \
  --filter-pattern '{ $.userId = "123" }'
```

---

## CloudWatch Metrics

### Custom Metrics

```javascript
const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');

const cloudwatch = new CloudWatchClient({ region: 'us-east-1' });

// Track custom metric
async function trackCarInsuranceQuote() {
  const params = {
    Namespace: 'VahanHelp/Business',
    MetricData: [
      {
        MetricName: 'InsuranceQuotes',
        Value: 1,
        Unit: 'Count',
        Timestamp: new Date(),
        Dimensions: [
          { Name: 'Service', Value: 'CarInsurance' },
          { Name: 'Environment', Value: 'Production' }
        ]
      }
    ]
  };

  await cloudwatch.send(new PutMetricDataCommand(params));
}

// Middleware to track API requests
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;

    await cloudwatch.send(new PutMetricDataCommand({
      Namespace: 'VahanHelp/API',
      MetricData: [{
        MetricName: 'ResponseTime',
        Value: duration,
        Unit: 'Milliseconds',
        Dimensions: [
          { Name: 'Endpoint', Value: req.path },
          { Name: 'Method', Value: req.method },
          { Name: 'StatusCode', Value: String(res.statusCode) }
        ]
      }]
    }));
  });

  next();
});
```

---

## CloudWatch Alarms

### Create High CPU Alarm

```bash
# EC2 CPU > 80%
aws cloudwatch put-metric-alarm \
  --alarm-name vahanhelp-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:vahanhelp-alerts
```

### Application Alarms

```bash
# High error rate
aws cloudwatch put-metric-alarm \
  --alarm-name vahanhelp-high-errors \
  --metric-name Errors \
  --namespace VahanHelp/API \
  --statistic Sum \
  --period 60 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:vahanhelp-alerts

# Slow response time
aws cloudwatch put-metric-alarm \
  --alarm-name vahanhelp-slow-response \
  --metric-name ResponseTime \
  --namespace VahanHelp/API \
  --statistic Average \
  --period 300 \
  --threshold 1000 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

---

## CloudWatch Dashboards

### Create Dashboard

```bash
# Create dashboard with widgets
aws cloudwatch put-dashboard \
  --dashboard-name VahanHelp-Production \
  --dashboard-body file://dashboard.json
```

**dashboard.json**:
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/EC2", "CPUUtilization", {"stat": "Average"}],
          ["AWS/RDS", "CPUUtilization", {"stat": "Average"}]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "CPU Usage"
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["VahanHelp/API", "ResponseTime", {"stat": "Average"}]
        ],
        "period": 60,
        "stat": "Average",
        "region": "us-east-1",
        "title": "API Response Time"
      }
    },
    {
      "type": "log",
      "properties": {
        "query": "SOURCE '/vahanhelp/backend' | fields @timestamp, @message | filter @message like /ERROR/ | sort @timestamp desc | limit 20",
        "region": "us-east-1",
        "title": "Recent Errors"
      }
    }
  ]
}
```

---

## CloudWatch Insights

### Log Queries

```sql
-- Find slowest endpoints
fields @timestamp, endpoint, duration
| filter duration > 1000
| sort duration desc
| limit 10

-- Count errors by type
fields @timestamp, error
| filter level = "ERROR"
| stats count() by error

-- User activity
fields @timestamp, userId, action
| filter userId = "123"
| sort @timestamp desc

-- API usage by endpoint
fields endpoint
| stats count() by endpoint
| sort count desc
```

---

## CloudTrail (Auditing)

**CloudTrail** = AWS API call logging for compliance and security.

### Enable CloudTrail

```bash
# Create trail
aws cloudtrail create-trail \
  --name vahanhelp-audit-trail \
  --s3-bucket-name vahanhelp-cloudtrail-logs

# Start logging
aws cloudtrail start-logging --name vahanhelp-audit-trail

# View recent events
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=RunInstances
```

### Use Cases

- **Security**: Who deleted the S3 bucket?
- **Compliance**: Track all database access
- **Debugging**: What IAM changes were made?
- **Cost**: Which user launched expensive instances?

---

## Complete Monitoring Setup

### VahanHelp Production Monitoring

```javascript
// src/utils/monitoring.js
const winston = require('winston');
const CloudWatchTransport = require('winston-cloudwatch');
const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');

const cloudwatch = new CloudWatchClient({ region: 'us-east-1' });

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new CloudWatchTransport({
      logGroupName: '/vahanhelp/backend',
      logStreamName: `${new Date().toISOString().split('T')[0]}-${process.env.NODE_ENV}`,
      awsRegion: 'us-east-1'
    })
  ]
});

// Metrics
async function trackMetric(name, value, unit = 'Count', dimensions = []) {
  try {
    await cloudwatch.send(new PutMetricDataCommand({
      Namespace: 'VahanHelp/Business',
      MetricData: [{
        MetricName: name,
        Value: value,
        Unit: unit,
        Timestamp: new Date(),
        Dimensions: dimensions
      }]
    }));
  } catch (err) {
    logger.error('Failed to track metric', { metric: name, error: err.message });
  }
}

// Monitoring middleware
function monitoringMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;

    // Log request
    logger.info('API Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    // Track metrics
    await trackMetric('APIRequests', 1, 'Count', [
      { Name: 'Endpoint', Value: req.path },
      { Name: 'Method', Value: req.method },
      { Name: 'StatusCode', Value: String(res.statusCode) }
    ]);

    await trackMetric('ResponseTime', duration, 'Milliseconds', [
      { Name: 'Endpoint', Value: req.path }
    ]);

    if (res.statusCode >= 500) {
      await trackMetric('Errors', 1, 'Count', [
        { Name: 'ErrorType', Value: '5xx' }
      ]);
    }
  });

  next();
}

module.exports = { logger, trackMetric, monitoringMiddleware };
```

**Use in app**:
```javascript
const { logger, trackMetric, monitoringMiddleware } = require('./utils/monitoring');

app.use(monitoringMiddleware);

// Business metrics
app.post('/api/insurance/quote', async (req, res) => {
  try {
    const quote = await createInsuranceQuote(req.body);

    await trackMetric('InsuranceQuotes', 1, 'Count', [
      { Name: 'InsuranceType', Value: quote.type }
    ]);

    res.json(quote);
  } catch (err) {
    logger.error('Quote creation failed', { error: err.message, body: req.body });
    res.status(500).json({ error: 'Failed to create quote' });
  }
});
```

---

## Practice Exercise

1. Set up CloudWatch Logs for your Node.js app
2. Create custom metrics for:
   - User registrations
   - Insurance quotes
   - Payment transactions
3. Create alarms for:
   - High error rate (> 10 errors/min)
   - Slow response time (> 2 seconds)
   - High memory usage (> 80%)
4. Build a CloudWatch dashboard
5. Enable CloudTrail for security auditing

---

## Real-World Example: VahanHelp Monitoring

**Logs**: API requests, errors, user actions
**Metrics**: Quote requests, payment success rate, response times
**Alarms**: High error rate → SNS → Slack notification
**Dashboard**: Real-time business and infrastructure metrics
**CloudTrail**: Security and compliance auditing

---

**Next Lesson**: [14-sqs-sns-messaging.md](14-sqs-sns-messaging.md)
