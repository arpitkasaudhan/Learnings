# Lesson 14: Push Notifications - Complete Guide

## 🎯 Learning Objectives
- Understand how push notifications work
- Learn Expo Notifications API
- Implement notifications in your VahanHelp app
- Handle notification permissions
- Send notifications from backend
- Respond to notification taps

---

## What are Push Notifications?

**Push notifications are messages sent to users' devices even when the app is closed.**

### Types of Notifications

1. **Local Notifications**
   - Scheduled by the app itself
   - Don't need internet
   - Example: Reminder at 9 AM

2. **Push Notifications (Remote)**
   - Sent from your server
   - Need internet
   - Example: "New message from buyer"

**Your VahanHelp app uses Push Notifications!**

---

## How Push Notifications Work

### The Complete Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User Opens App                                       │
│    └─→ App requests notification permission             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. User Grants Permission                               │
│    └─→ Device generates Expo Push Token                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. App Sends Token to Backend                          │
│    POST /api/users/push-token                           │
│    { token: "ExponentPushToken[xxxxxx]" }              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Backend Stores Token in MongoDB                      │
│    user.pushToken = "ExponentPushToken[xxxxxx]"        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Event Happens (e.g., new inquiry)                   │
│    └─→ Backend prepares notification                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Backend Sends to Expo Push Service                   │
│    POST https://exp.host/--/api/v2/push/send           │
│    { to: token, title: "...", body: "..." }            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Expo Routes to Apple (iOS) or Google (Android)      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 8. User Receives Notification                           │
│    └─→ Shows on lock screen/notification center         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 9. User Taps Notification                               │
│    └─→ App opens to specific screen                     │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1: Install Expo Notifications

### Check Installation

Your VahanHelp app already has it:
```json
// package.json
{
  "dependencies": {
    "expo-notifications": "~0.27.0"
  }
}
```

### If Not Installed

```bash
npx expo install expo-notifications
```

---

## Step 2: Configure Notifications

### Configure app.json

```json
{
  "expo": {
    "name": "VahanHelp",
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#2196F3",
          "sounds": [
            "./assets/notification-sound.wav"
          ]
        }
      ]
    ],
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#2196F3",
      "iosDisplayInForeground": true,
      "androidMode": "default",
      "androidCollapsedTitle": "New notification"
    }
  }
}
```

### Notification Icon Requirements

**Android:**
- Size: 96x96 pixels
- Format: PNG
- Color: White/transparent
- Background: Transparent

**iOS:**
- Uses app icon automatically
- No special requirements

---

## Step 3: Request Permission

### Create Notification Service

**File**: `src/services/notification.service.js`

```javascript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are shown when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,      // Show notification banner
    shouldPlaySound: true,       // Play sound
    shouldSetBadge: true,        // Update badge count
  }),
});

export async function registerForPushNotifications() {
  let token;

  // Check if physical device (notifications don't work in simulator)
  if (!Device.isDevice) {
    alert('Push notifications only work on physical devices');
    return;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Ask for permission if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Permission denied
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  // Get Expo Push Token
  token = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-project-id', // From app.json expo.extra.eas.projectId
  });

  // Android-specific: Set notification channel
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2196F3',
    });
  }

  return token.data;
}
```

### Use in App.js

```javascript
import React, { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications } from './src/services/notification.service';
import { savePushToken } from './src/services/api';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register for notifications
    registerForPushNotifications()
      .then(token => {
        setExpoPushToken(token);
        // Send token to backend
        savePushToken(token);
      })
      .catch(err => console.error(err));

    // Listen for notifications while app is open
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // You can show custom UI here
    });

    // Listen for notification taps
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      // Navigate to specific screen based on notification data
      const data = response.notification.request.content.data;
      if (data.screen) {
        // navigation.navigate(data.screen, data.params);
      }
    });

    // Cleanup
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    // Your app content
  );
}
```

---

## Step 4: Send Token to Backend

### Frontend API Call

**File**: `src/services/api.js`

```javascript
import axios from 'axios';

const API_URL = 'http://your-backend.com/api';

export async function savePushToken(token) {
  try {
    const response = await axios.post(`${API_URL}/users/push-token`, {
      token: token
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save push token:', error);
    throw error;
  }
}
```

---

## Step 5: Backend Implementation

### Store Token in Database

**File**: `backend/src/api/controllers/user.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../domain/services/user.service';

export class UserController {
  async updatePushToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId; // From auth middleware
      const { token } = req.body;

      // Validate token format
      if (!token || !token.startsWith('ExponentPushToken[')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid push token format'
        });
      }

      // Update user's push token
      await UserService.updatePushToken(userId, token);

      res.status(200).json({
        success: true,
        message: 'Push token saved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
```

**File**: `backend/src/domain/services/user.service.ts`

```typescript
import { UserModel } from '../../infrastructure/database/mongodb/models/User.model';

export class UserService {
  async updatePushToken(userId: string, pushToken: string) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { pushToken },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUsersByPushTokens(userIds: string[]) {
    const users = await UserModel.find({
      _id: { $in: userIds },
      pushToken: { $exists: true, $ne: null }
    }).select('pushToken');

    return users.map(user => user.pushToken);
  }
}
```

### Add Route

**File**: `backend/src/api/routes/user.routes.ts`

```typescript
import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/push-token', authenticate, UserController.updatePushToken);

export default router;
```

---

## Step 6: Send Notifications from Backend

### Create Notification Service

**File**: `backend/src/infrastructure/services/push-notification.service.ts`

```typescript
import axios from 'axios';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

export interface PushNotification {
  to: string | string[];        // Push token(s)
  title: string;                 // Notification title
  body: string;                  // Notification body
  data?: any;                    // Custom data
  sound?: 'default' | null;      // Notification sound
  badge?: number;                // iOS badge count
  priority?: 'default' | 'normal' | 'high';
}

export class PushNotificationService {
  /**
   * Send push notification to single user
   */
  static async sendToUser(pushToken: string, notification: Omit<PushNotification, 'to'>) {
    return this.send({
      to: pushToken,
      ...notification
    });
  }

  /**
   * Send push notification to multiple users
   */
  static async sendToMultipleUsers(pushTokens: string[], notification: Omit<PushNotification, 'to'>) {
    return this.send({
      to: pushTokens,
      ...notification
    });
  }

  /**
   * Send push notification via Expo API
   */
  private static async send(notification: PushNotification) {
    try {
      const message = {
        to: notification.to,
        sound: notification.sound || 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        priority: notification.priority || 'high',
        badge: notification.badge,
      };

      const response = await axios.post(EXPO_PUSH_URL, message, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Check for errors
      if (response.data.data) {
        const results = response.data.data;
        results.forEach((result: any) => {
          if (result.status === 'error') {
            console.error('Push notification error:', result.message);
            // Handle token errors (e.g., invalid token, remove from DB)
            if (result.details?.error === 'DeviceNotRegistered') {
              // TODO: Remove invalid token from database
            }
          }
        });
      }

      return response.data;
    } catch (error) {
      console.error('Failed to send push notification:', error);
      throw error;
    }
  }

  /**
   * Send notification when new inquiry is received
   */
  static async sendNewInquiryNotification(sellerPushToken: string, inquiryData: any) {
    return this.sendToUser(sellerPushToken, {
      title: 'New Inquiry! 🚗',
      body: `${inquiryData.buyerName} is interested in your ${inquiryData.carBrand} ${inquiryData.carModel}`,
      data: {
        screen: 'InquiryDetails',
        inquiryId: inquiryData.inquiryId,
        carId: inquiryData.carId,
      },
      sound: 'default',
      priority: 'high',
    });
  }

  /**
   * Send notification when car is verified
   */
  static async sendCarVerifiedNotification(sellerPushToken: string, carData: any) {
    return this.sendToUser(sellerPushToken, {
      title: 'Car Listing Approved! ✅',
      body: `Your ${carData.brand} ${carData.model} is now live on VahanHelp`,
      data: {
        screen: 'CarDetails',
        carId: carData.carId,
      },
      sound: 'default',
    });
  }

  /**
   * Send notification for new message
   */
  static async sendNewMessageNotification(recipientPushToken: string, messageData: any) {
    return this.sendToUser(recipientPushToken, {
      title: `New message from ${messageData.senderName}`,
      body: messageData.messagePreview,
      data: {
        screen: 'Chat',
        chatId: messageData.chatId,
        senderId: messageData.senderId,
      },
      sound: 'default',
      badge: messageData.unreadCount,
    });
  }
}
```

### Use in Your Controllers

**Example**: Send notification when inquiry is created

**File**: `backend/src/api/controllers/inquiry.controller.ts`

```typescript
import { PushNotificationService } from '../../infrastructure/services/push-notification.service';
import { UserService } from '../../domain/services/user.service';

export class InquiryController {
  async createInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const buyerId = (req as any).user.userId;
      const { carId, message } = req.body;

      // Create inquiry in database
      const inquiry = await InquiryService.create({
        carId,
        buyerId,
        message
      });

      // Get car and seller details
      const car = await CarService.getById(carId);
      const seller = await UserService.getById(car.sellerId);
      const buyer = await UserService.getById(buyerId);

      // Send push notification to seller
      if (seller.pushToken) {
        await PushNotificationService.sendNewInquiryNotification(
          seller.pushToken,
          {
            inquiryId: inquiry._id,
            carId: car._id,
            carBrand: car.brand,
            carModel: car.model,
            buyerName: buyer.name || 'A buyer',
          }
        );
      }

      res.status(201).json({
        success: true,
        data: inquiry
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

## Step 7: Handle Notification Taps

### Navigate Based on Notification Data

**File**: `App.js`

```javascript
import { useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const navigationRef = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Handle notification tap
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      // Navigate based on notification data
      if (data.screen && navigationRef.current) {
        navigationRef.current.navigate(data.screen, data.params);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {/* Your navigation */}
    </NavigationContainer>
  );
}
```

### Handle Deep Linking

```javascript
// Handle notification tap when app is closed
const lastNotificationResponse = Notifications.useLastNotificationResponse();

useEffect(() => {
  if (lastNotificationResponse) {
    const data = lastNotificationResponse.notification.request.content.data;

    // Navigate to screen
    if (data.screen) {
      navigation.navigate(data.screen, data.params);
    }
  }
}, [lastNotificationResponse]);
```

---

## Local Notifications (Bonus)

### Schedule Local Notification

```javascript
import * as Notifications from 'expo-notifications';

// Schedule notification
async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Remember! 📋",
      body: "Check your car inquiries",
      data: { screen: 'Inquiries' },
    },
    trigger: {
      seconds: 60 * 60, // 1 hour from now
      // Or specific time
      // hour: 9,
      // minute: 0,
      // repeats: true
    },
  });
}

// Cancel all scheduled notifications
async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
```

---

## Notification Best Practices

### 1. Ask Permission at Right Time

```javascript
// ❌ Bad - Ask immediately on app open
useEffect(() => {
  registerForPushNotifications();
}, []);

// ✅ Good - Ask after user takes meaningful action
function handleListCar() {
  // Show dialog explaining why notifications are needed
  Alert.alert(
    'Enable Notifications',
    'Get instant alerts when buyers show interest in your car',
    [
      { text: 'Not Now', style: 'cancel' },
      {
        text: 'Enable',
        onPress: () => registerForPushNotifications()
      }
    ]
  );
}
```

### 2. Handle Permission Denial

```javascript
async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    // Show how to enable in settings
    Alert.alert(
      'Notifications Disabled',
      'To receive updates, please enable notifications in Settings',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings()
        }
      ]
    );
  }
}
```

### 3. Meaningful Notification Content

```javascript
// ❌ Bad
{
  title: 'New notification',
  body: 'You have a new notification'
}

// ✅ Good
{
  title: 'New Inquiry on Honda City',
  body: 'Rahul Kumar wants to know about test drive options'
}
```

### 4. Include Actionable Data

```javascript
{
  title: 'New Message',
  body: 'Buyer: When can I see the car?',
  data: {
    screen: 'Chat',
    chatId: '123',
    senderId: '456',
    // Include enough data to show the screen
  }
}
```

### 5. Test on Physical Device

```javascript
// Check if running on physical device
if (!Device.isDevice) {
  console.warn('Notifications only work on physical devices');
}
```

---

## Testing Notifications

### Test from Backend

**Using curl:**
```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ExponentPushToken[xxxxxxxxxxxxxx]",
    "title": "Test Notification",
    "body": "This is a test",
    "data": {"screen": "Home"}
  }'
```

**Using Postman:**
1. Method: POST
2. URL: `https://exp.host/--/api/v2/push/send`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "to": "ExponentPushToken[your-token-here]",
  "title": "Test from Postman",
  "body": "If you see this, it works!",
  "data": {
    "screen": "Home"
  }
}
```

### Test from Expo Notifications Tool

Visit: https://expo.dev/notifications

1. Enter your Expo Push Token
2. Enter title and body
3. Click "Send Notification"

---

## Troubleshooting

### Issue 1: Not Receiving Notifications

**Check:**
- [ ] Running on physical device (not simulator)
- [ ] Permission granted
- [ ] Token sent to backend
- [ ] Token format correct (starts with `ExponentPushToken[`)
- [ ] Internet connection
- [ ] Notification channel configured (Android)

### Issue 2: Token Format Error

```javascript
// ❌ Wrong
const token = await Notifications.getExpoPushTokenAsync();
sendToBackend(token); // Sends entire object

// ✅ Correct
const token = await Notifications.getExpoPushTokenAsync();
sendToBackend(token.data); // Send only the token string
```

### Issue 3: iOS Notifications Not Showing

```json
// Add to app.json
{
  "expo": {
    "notification": {
      "iosDisplayInForeground": true
    }
  }
}
```

### Issue 4: Android Sound Not Playing

```javascript
// Create notification channel with sound
await Notifications.setNotificationChannelAsync('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.MAX,
  sound: 'default', // or your custom sound
});
```

---

## Complete VahanHelp Example

### Frontend Setup

**File**: `src/services/notifications.js`

```javascript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-project-id',
  });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2196F3',
    });
  }

  // Send to backend
  await api.post('/users/push-token', { token: token.data });

  return token.data;
}
```

**File**: `App.js`

```javascript
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications } from './src/services/notifications';

export default function App() {
  const navigationRef = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotifications();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { screen, ...params } = response.notification.request.content.data;
      if (screen && navigationRef.current) {
        navigationRef.current.navigate(screen, params);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {/* Your app */}
    </NavigationContainer>
  );
}
```

---

## Key Takeaways

1. **Expo handles complexity** - No need for Firebase setup
2. **Token = User ID** - Store Expo Push Token for each user
3. **Backend sends** - Your server calls Expo API
4. **Physical device only** - Simulators don't support push
5. **Handle responses** - Navigate when user taps notification
6. **Ask permission wisely** - Explain why before asking

---

## Next Steps

Now you know push notifications! Next, let's build a real feature.

**Next**: [15-building-features.md](15-building-features.md) - Build complete features

---

## Self-Check Questions

1. What's the difference between local and push notifications?
2. What is an Expo Push Token?
3. Where do you store the push token?
4. How do you send a notification from your backend?
5. How do you handle notification taps?
6. Why don't notifications work in simulator?

Ready to build real features? Let's go! 🚀
