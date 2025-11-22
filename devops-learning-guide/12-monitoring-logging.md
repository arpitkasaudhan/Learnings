# Lesson 12: Monitoring and Logging

## Introduction

"You can't improve what you can't measure" - and in production, if you can't see it, you can't fix it! Monitoring and logging are your eyes into production systems. They help you answer: "Is my system healthy?" and "What went wrong?"

Think of monitoring like a car's dashboard - speedometer, fuel gauge, engine temperature. Logging is like a black box flight recorder - detailed records of everything that happened.

## The Three Pillars of Observability

```
┌─────────────────────────────────────────────────┐
│         Three Pillars of Observability          │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. METRICS                                     │
│  What: Numerical measurements over time         │
│  Example: CPU usage, request rate, error rate   │
│  Tools: Prometheus, Grafana                     │
│                                                 │
│  2. LOGS                                        │
│  What: Detailed events and messages             │
│  Example: "User logged in", "Error connecting"  │
│  Tools: ELK Stack, Loki                         │
│                                                 │
│  3. TRACES                                      │
│  What: Path of a request through system         │
│  Example: Request flow through microservices    │
│  Tools: Jaeger, Zipkin                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Prometheus - Metrics Collection

### What is Prometheus?

**Prometheus** is an open-source monitoring and alerting toolkit designed for reliability and scalability.

### How Prometheus Works

```
┌──────────────────────────────────────────────┐
│        Prometheus Architecture               │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐                           │
│  │  Prometheus  │                           │
│  │    Server    │                           │
│  │              │                           │
│  │  ┌────────┐  │                           │
│  │  │ TSDB   │  │ (Time Series Database)    │
│  │  └────────┘  │                           │
│  └──────┬───────┘                           │
│         │                                    │
│         │ Pull metrics every 15s             │
│         │                                    │
│    ┌────┴────┬─────────┬──────────┐         │
│    │         │         │          │         │
│  ┌─▼──┐   ┌─▼──┐   ┌──▼─┐    ┌──▼─┐       │
│  │App │   │App │   │cAdv│    │Node│       │
│  │:9090   │:8080│   │:8081    │Exp │       │
│  └────┘   └────┘   └────┘    └────┘       │
│  Exporters expose /metrics endpoint         │
│                                              │
└──────────────────────────────────────────────┘
```

### Metric Types

```yaml
# 1. Counter - Only goes up
http_requests_total{method="GET", status="200"} 1234

# 2. Gauge - Can go up or down
memory_usage_bytes 1073741824

# 3. Histogram - Observations in buckets
http_request_duration_seconds_bucket{le="0.1"} 24
http_request_duration_seconds_bucket{le="0.5"} 45
http_request_duration_seconds_bucket{le="1.0"} 67

# 4. Summary - Similar to histogram, calculates quantiles
http_request_duration_seconds{quantile="0.5"} 0.23
http_request_duration_seconds{quantile="0.9"} 0.67
```

### Installing Prometheus

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

volumes:
  prometheus-data:
```

**prometheus.yml**:
```yaml
global:
  scrape_interval: 15s  # Scrape targets every 15 seconds
  evaluation_interval: 15s  # Evaluate rules every 15 seconds

# Scrape targets
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'nodejs-app'
    static_configs:
      - targets: ['api:3000']
```

### Instrumenting Node.js Application

```bash
npm install prom-client
```

**metrics.js**:
```javascript
const promClient = require('prom-client');

// Create a Registry
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Custom counter
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

// Custom histogram
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register]
});

// Custom gauge
const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register]
});

module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDuration,
  activeConnections
};
```

**server.js**:
```javascript
const express = require('express');
const {
  register,
  httpRequestsTotal,
  httpRequestDuration,
  activeConnections
} = require('./metrics');

const app = express();

// Metrics middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode
    });

    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode
    });
  });

  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// API endpoints
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

### PromQL (Prometheus Query Language)

```promql
# Current HTTP request rate
rate(http_requests_total[5m])

# Average request duration
rate(http_request_duration_seconds_sum[5m])
  /
rate(http_request_duration_seconds_count[5m])

# Error rate (5xx responses)
rate(http_requests_total{status=~"5.."}[5m])

# CPU usage
100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage percentage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)
  /
node_memory_MemTotal_bytes * 100

# Top 5 endpoints by request count
topk(5, sum by (route) (http_requests_total))

# 95th percentile response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

## Grafana - Visualization

### What is Grafana?

**Grafana** is an open-source analytics and visualization platform that works with multiple data sources, including Prometheus.

### Setting Up Grafana

**docker-compose.yml**:
```yaml
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning

volumes:
  grafana-data:
```

### Grafana Dashboard JSON

**grafana/provisioning/dashboards/api-dashboard.json**:
```json
{
  "dashboard": {
    "title": "API Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "{{route}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "{{route}}"
          }
        ],
        "type": "graph"
      }
    ]
  }
}
```

### Alerting in Grafana

```yaml
# Alert rules
groups:
  - name: api_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} requests/sec"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile is {{ $value }} seconds"

      - alert: InstanceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Instance {{ $labels.instance }} down"
```

## Logging with ELK Stack

### What is ELK Stack?

**ELK** = **E**lasticsearch + **L**ogstash + **K**ibana

```
┌────────────────────────────────────────────┐
│           ELK Stack Flow                   │
├────────────────────────────────────────────┤
│                                            │
│  Application                               │
│  └─ Writes logs                            │
│      ↓                                     │
│  Logstash (or Filebeat)                    │
│  └─ Collects, parses, transforms          │
│      ↓                                     │
│  Elasticsearch                             │
│  └─ Stores and indexes logs               │
│      ↓                                     │
│  Kibana                                    │
│  └─ Visualizes and searches                │
│                                            │
└────────────────────────────────────────────┘
```

### ELK Stack with Docker Compose

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.9.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.9.0
    ports:
      - "5000:5000"
      - "5044:5044"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.9.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elasticsearch-data:
```

**logstash/pipeline/logstash.conf**:
```
input {
  tcp {
    port => 5000
    codec => json
  }
}

filter {
  # Parse JSON logs
  json {
    source => "message"
  }

  # Add timestamp
  date {
    match => ["timestamp", "ISO8601"]
  }

  # Extract fields
  grok {
    match => {
      "message" => "%{COMBINEDAPACHELOG}"
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"
  }

  stdout {
    codec => rubydebug
  }
}
```

### Structured Logging in Node.js

**logger.js**:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'api',
    environment: process.env.NODE_ENV
  },
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),

    // File output
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

module.exports = logger;
```

**Usage**:
```javascript
const logger = require('./logger');

// Info log
logger.info('User logged in', {
  userId: '12345',
  email: 'user@example.com'
});

// Error log
logger.error('Database connection failed', {
  error: err.message,
  stack: err.stack,
  dbHost: 'db.example.com'
});

// Warning
logger.warn('High memory usage', {
  memoryUsage: process.memoryUsage(),
  threshold: '80%'
});
```

## Complete Monitoring Stack

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  # Application
  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    networks:
      - monitoring

  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - monitoring

  # Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - monitoring

  # Node Exporter (system metrics)
  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    networks:
      - monitoring

  # cAdvisor (container metrics)
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
    networks:
      - monitoring

volumes:
  prometheus-data:
  grafana-data:

networks:
  monitoring:
```

## Best Practices

### 1. Log Levels

```javascript
// Use appropriate log levels
logger.debug('Detailed debugging info');  // Development only
logger.info('Normal operation');          // Production
logger.warn('Warning, but not critical'); // Production
logger.error('Error occurred');           // Production
logger.fatal('System unusable');          // Production
```

### 2. Structured Logging

```javascript
// ❌ Bad - Unstructured
logger.info('User john@example.com logged in from 192.168.1.1');

// ✅ Good - Structured
logger.info('User logged in', {
  userId: '123',
  email: 'john@example.com',
  ip: '192.168.1.1',
  timestamp: new Date().toISOString()
});
```

### 3. SLIs, SLOs, and SLAs

```
SLI (Service Level Indicator): Measurement
├─ Example: Request success rate, latency

SLO (Service Level Objective): Target
├─ Example: 99.9% of requests succeed in < 200ms

SLA (Service Level Agreement): Contract
├─ Example: Guarantee 99.9% uptime or refund
```

### 4. The Four Golden Signals

```
1. Latency: How long requests take
2. Traffic: How many requests
3. Errors: Rate of failed requests
4. Saturation: How "full" is the service
```

### 5. Alert Fatigue Prevention

```yaml
# Good alert rules:
- Alert only on actionable issues
- Set appropriate thresholds
- Use "for" clause to avoid flapping
- Group related alerts
- Clear, actionable descriptions
```

## Summary

You've learned:
- The three pillars of observability (metrics, logs, traces)
- Prometheus for metrics collection
- PromQL for querying metrics
- Grafana for visualization and dashboarding
- ELK stack for centralized logging
- Structured logging best practices
- Complete monitoring stack setup
- SLIs, SLOs, and SLAs
- Alerting strategies

**Key Takeaway**: Monitoring and logging provide visibility into production systems, enabling you to detect, diagnose, and resolve issues quickly.

## Next Steps

In the next lesson, **Cloud AWS**, we'll learn about cloud computing and how to deploy applications on Amazon Web Services.

---

**Challenge**:
Set up complete monitoring for your application:
1. Instrument application with Prometheus metrics
2. Set up Prometheus to scrape metrics
3. Create Grafana dashboards for visualization
4. Implement structured logging
5. Set up ELK stack for log aggregation
6. Configure alerts for critical issues
7. Define SLOs for your service
8. Document your monitoring strategy
