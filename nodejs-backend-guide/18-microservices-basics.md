# Lesson 18: Microservices Basics

## Microservices Architecture

Break monolith into independent services:
- User Service
- Car Listing Service
- Payment Service
- Notification Service

## Service Communication

### HTTP REST

```javascript
// Car Service calls User Service
const axios = require('axios');

const getUser = async (userId) => {
  const response = await axios.get(`http://user-service:3001/users/${userId}`);
  return response.data;
};
```

### Message Queue (RabbitMQ/Redis)

```bash
npm install amqplib
```

```javascript
const amqp = require('amqplib');

// Producer
const publishEvent = async (queue, message) => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

  await channel.close();
  await connection.close();
};

// Consumer
const consumeEvents = async (queue, callback) => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue);
  channel.consume(queue, (msg) => {
    const data = JSON.parse(msg.content.toString());
    callback(data);
    channel.ack(msg);
  });
};

// Usage
// When car is created, notify users
publishEvent('car_created', { carId: 123, brand: 'Honda' });

// Notification service consumes event
consumeEvents('car_created', async (data) => {
  await sendNotification(data);
});
```

## API Gateway

```javascript
// gateway/index.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true
}));

app.use('/api/cars', createProxyMiddleware({
  target: 'http://car-service:3002',
  changeOrigin: true
}));

app.listen(3000);
```

**Congratulations! You've completed all backend lessons! 🎉**
