# Lesson 14: SQS & SNS (Messaging)

## What is SQS?

**SQS (Simple Queue Service)** = Managed message queue.

**Benefits**:
- Decouple services
- Handle traffic spikes
- Retry failed jobs
- Process tasks asynchronously

**Types**:
- **Standard Queue**: High throughput, at-least-once delivery
- **FIFO Queue**: Guaranteed order, exactly-once delivery

---

## What is SNS?

**SNS (Simple Notification Service)** = Pub/Sub messaging.

**Benefits**:
- Send notifications to multiple subscribers
- Fan-out pattern
- Push notifications (Email, SMS, HTTP, Lambda)

---

## SQS: Message Queue

### Create Queue

```bash
# Create standard queue
aws sqs create-queue --queue-name vahanhelp-email-queue

# Create FIFO queue
aws sqs create-queue \
  --queue-name vahanhelp-payment-queue.fifo \
  --attributes FifoQueue=true,ContentBasedDeduplication=true
```

### Send Message (Producer)

```javascript
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const sqs = new SQSClient({ region: 'us-east-1' });
const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/123456789012/vahanhelp-email-queue';

// Send message
async function sendEmail(to, subject, body) {
  const params = {
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify({
      to,
      subject,
      body,
      timestamp: new Date().toISOString()
    }),
    MessageAttributes: {
      Type: {
        DataType: 'String',
        StringValue: 'email'
      },
      Priority: {
        DataType: 'Number',
        StringValue: '1'
      }
    }
  };

  const result = await sqs.send(new SendMessageCommand(params));
  console.log('Message sent:', result.MessageId);
}

// Use in API
app.post('/api/auth/register', async (req, res) => {
  const user = await User.create(req.body);

  // Send welcome email asynchronously
  await sendEmail(
    user.email,
    'Welcome to VahanHelp!',
    `Hi ${user.name}, welcome to VahanHelp!`
  );

  res.status(201).json({ user });
});
```

### Receive Message (Consumer)

```javascript
const { ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Worker: Process email queue
async function processEmailQueue() {
  while (true) {
    const params = {
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20, // Long polling
      VisibilityTimeout: 60
    };

    const data = await sqs.send(new ReceiveMessageCommand(params));

    if (!data.Messages) {
      console.log('No messages, waiting...');
      continue;
    }

    for (const message of data.Messages) {
      try {
        const email = JSON.parse(message.Body);

        // Send email
        await transporter.sendMail({
          from: 'noreply@vahanhelp.com',
          to: email.to,
          subject: email.subject,
          text: email.body
        });

        console.log(`Email sent to ${email.to}`);

        // Delete message from queue
        await sqs.send(new DeleteMessageCommand({
          QueueUrl: QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle
        }));
      } catch (err) {
        console.error('Failed to process message:', err);
        // Message will become visible again after VisibilityTimeout
      }
    }
  }
}

// Start worker
processEmailQueue();
```

---

## SNS: Pub/Sub

### Create Topic

```bash
# Create SNS topic
aws sns create-topic --name vahanhelp-notifications

# Subscribe email
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:vahanhelp-notifications \
  --protocol email \
  --notification-endpoint admin@vahanhelp.com

# Subscribe SMS
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:vahanhelp-notifications \
  --protocol sms \
  --notification-endpoint +1234567890
```

### Publish Message

```javascript
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const sns = new SNSClient({ region: 'us-east-1' });
const TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:vahanhelp-notifications';

// Publish notification
async function notifyAdmins(subject, message) {
  const params = {
    TopicArn: TOPIC_ARN,
    Subject: subject,
    Message: message,
    MessageAttributes: {
      Priority: {
        DataType: 'String',
        StringValue: 'high'
      }
    }
  };

  await sns.send(new PublishCommand(params));
}

// Use case: Alert on payment failure
app.post('/api/payments', async (req, res) => {
  try {
    const payment = await processPayment(req.body);
    res.json({ payment });
  } catch (err) {
    // Notify admins immediately
    await notifyAdmins(
      'Payment Failure',
      `Payment failed for order ${req.body.orderId}: ${err.message}`
    );

    res.status(500).json({ error: 'Payment failed' });
  }
});
```

---

## Pattern: Fan-Out (SNS → SQS)

**Use Case**: New insurance quote → Multiple services need to process it

### Architecture

```
User submits quote → SNS Topic → [SQS: Email Queue]
                                 → [SQS: Analytics Queue]
                                 → [SQS: CRM Queue]
```

### Setup

```bash
# Create SNS topic
aws sns create-topic --name vahanhelp-new-quote

# Create SQS queues
aws sqs create-queue --queue-name vahanhelp-email-queue
aws sqs create-queue --queue-name vahanhelp-analytics-queue
aws sqs create-queue --queue-name vahanhelp-crm-queue

# Subscribe queues to topic
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:vahanhelp-new-quote \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:us-east-1:123456789012:vahanhelp-email-queue
```

### Implementation

```javascript
// API: Publish to SNS
app.post('/api/insurance/quote', async (req, res) => {
  const quote = await InsuranceQuote.create(req.body);

  // Publish to SNS (fan-out to multiple queues)
  await sns.send(new PublishCommand({
    TopicArn: 'arn:aws:sns:us-east-1:123456789012:vahanhelp-new-quote',
    Message: JSON.stringify(quote)
  }));

  res.status(201).json({ quote });
});

// Worker 1: Send email
async function emailWorker() {
  while (true) {
    const messages = await receiveMessages('vahanhelp-email-queue');
    for (const msg of messages) {
      const quote = JSON.parse(JSON.parse(msg.Body).Message);
      await sendEmail(quote.email, 'Quote Received', `Your quote: $${quote.amount}`);
      await deleteMessage('vahanhelp-email-queue', msg.ReceiptHandle);
    }
  }
}

// Worker 2: Save to analytics
async function analyticsWorker() {
  while (true) {
    const messages = await receiveMessages('vahanhelp-analytics-queue');
    for (const msg of messages) {
      const quote = JSON.parse(JSON.parse(msg.Body).Message);
      await Analytics.create({ quoteId: quote.id, amount: quote.amount });
      await deleteMessage('vahanhelp-analytics-queue', msg.ReceiptHandle);
    }
  }
}

// Worker 3: Send to CRM
async function crmWorker() {
  while (true) {
    const messages = await receiveMessages('vahanhelp-crm-queue');
    for (const msg of messages) {
      const quote = JSON.parse(JSON.parse(msg.Body).Message);
      await axios.post('https://crm.vahanhelp.com/leads', quote);
      await deleteMessage('vahanhelp-crm-queue', msg.ReceiptHandle);
    }
  }
}
```

---

## Dead Letter Queue (DLQ)

**DLQ** = Queue for failed messages after max retries.

### Setup DLQ

```bash
# Create DLQ
aws sqs create-queue --queue-name vahanhelp-email-dlq

# Configure redrive policy
aws sqs set-queue-attributes \
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/vahanhelp-email-queue \
  --attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:123456789012:vahanhelp-email-dlq\",\"maxReceiveCount\":\"3\"}"
  }'
```

### Monitor DLQ

```javascript
// Check DLQ periodically
async function checkDLQ() {
  const messages = await receiveMessages('vahanhelp-email-dlq');

  if (messages.length > 0) {
    // Alert admins
    await notifyAdmins(
      'DLQ Alert',
      `${messages.length} messages failed after 3 retries`
    );

    // Log to CloudWatch
    logger.error('DLQ messages found', { count: messages.length, messages });
  }
}

setInterval(checkDLQ, 60000); // Check every minute
```

---

## FIFO Queue (Guaranteed Order)

**Use Case**: Process payments in order

```javascript
const { SendMessageCommand } = require('@aws-sdk/client-sqs');

const FIFO_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/123456789012/vahanhelp-payment-queue.fifo';

// Send to FIFO queue
async function queuePayment(orderId, amount) {
  const params = {
    QueueUrl: FIFO_QUEUE_URL,
    MessageBody: JSON.stringify({ orderId, amount }),
    MessageGroupId: String(orderId), // Messages with same ID are processed in order
    MessageDeduplicationId: `${orderId}-${Date.now()}` // Prevent duplicates
  };

  await sqs.send(new SendMessageCommand(params));
}

// Process FIFO queue
async function processPayments() {
  while (true) {
    const messages = await receiveMessages(FIFO_QUEUE_URL);
    for (const msg of messages) {
      const { orderId, amount } = JSON.parse(msg.Body);
      await processPayment(orderId, amount);
      await deleteMessage(FIFO_QUEUE_URL, msg.ReceiptHandle);
    }
  }
}
```

---

## Complete Example: VahanHelp Event System

```javascript
// src/services/messaging.js
const { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const sqs = new SQSClient({ region: 'us-east-1' });
const sns = new SNSClient({ region: 'us-east-1' });

const QUEUES = {
  email: 'https://sqs.us-east-1.amazonaws.com/123456789012/vahanhelp-email-queue',
  notifications: 'https://sqs.us-east-1.amazonaws.com/123456789012/vahanhelp-notifications-queue'
};

const TOPICS = {
  newQuote: 'arn:aws:sns:us-east-1:123456789012:vahanhelp-new-quote',
  alerts: 'arn:aws:sns:us-east-1:123456789012:vahanhelp-alerts'
};

// Queue message
exports.queueEmail = async (to, subject, body) => {
  await sqs.send(new SendMessageCommand({
    QueueUrl: QUEUES.email,
    MessageBody: JSON.stringify({ to, subject, body })
  }));
};

// Publish event
exports.publishQuote = async (quote) => {
  await sns.send(new PublishCommand({
    TopicArn: TOPICS.newQuote,
    Message: JSON.stringify(quote)
  }));
};

// Alert admins
exports.alertAdmins = async (message) => {
  await sns.send(new PublishCommand({
    TopicArn: TOPICS.alerts,
    Subject: 'VahanHelp Alert',
    Message: message
  }));
};

module.exports = exports;
```

---

## Practice Exercise

1. Create SQS queue for email sending
2. Create SNS topic for admin alerts
3. Implement fan-out pattern: New quote → Email + Analytics + CRM
4. Set up Dead Letter Queue
5. Build worker to process queues
6. Monitor queue depth with CloudWatch

---

## Real-World Use Cases

- **Email Queue**: Async email sending (welcome, password reset)
- **Image Processing**: Upload image → SQS → Lambda resizes
- **Order Processing**: Place order → SQS → Payment → Fulfillment
- **Notifications**: SNS → Email + SMS + Push + Slack
- **Fan-Out**: New user → Welcome email + Analytics + CRM + Billing

---

**Next Lesson**: [15-elasticache-caching.md](15-elasticache-caching.md)
