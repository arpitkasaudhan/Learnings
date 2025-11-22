# Lesson 3: Expo Explained - Complete Guide

## 🎯 Learning Objectives
- Understand what Expo is and why it exists
- Learn how Expo is used in your VahanHelp app
- Know Expo's features and limitations
- Understand Expo modules and services
- Learn about EAS (Expo Application Services)
- Know when to use Expo vs React Native CLI

---

## What is Expo?

**Expo is a platform and set of tools built on top of React Native that makes mobile development easier.**

### Simple Analogy

Think of React Native as a car engine, and Expo as a complete car:
- **React Native**: The engine (core framework)
- **Expo**: The complete car with steering wheel, dashboard, GPS, etc. (tools + services)

```
React Native (Framework)
        +
Expo Tools & Services
        =
Faster, Easier Development
```

---

## Why Expo Exists

### Problems Without Expo

**1. Complex Setup**
```bash
# Without Expo (React Native CLI)
- Install Xcode (Mac only, 40GB+)
- Install Android Studio (10GB+)
- Configure Android SDK
- Configure environment variables
- Install CocoaPods
- Link native modules manually
- Deal with native code errors
```

**2. Native Code Required**
```javascript
// Want camera access? Write native code!
// iOS: Swift/Objective-C
// Android: Java/Kotlin
// JavaScript: Bridge between them
```

**3. Difficult Testing**
```bash
# Need to build app for every change
# iOS: Wait 10-15 minutes for build
# Android: Wait 5-10 minutes for build
```

### Solution: Expo

**1. Simple Setup**
```bash
# With Expo
npm install -g expo-cli
npx create-expo-app MyApp
npx expo start
# Done! Scan QR code and test on your phone
```

**2. Pre-built Native Modules**
```javascript
// Camera access in JavaScript!
import { Camera } from 'expo-camera';
// No native code needed!
```

**3. Instant Testing**
```bash
# Change code, save
# App reloads instantly on your phone
# No build required!
```

---

## How Expo Works

### Architecture

```
┌─────────────────────────────────┐
│   Your JavaScript Code          │
│   (App.js, components, etc.)    │
└──────────┬──────────────────────┘
           │
           ↓
┌─────────────────────────────────┐
│   Expo SDK                      │
│   (Pre-built native modules)    │
│   - Camera, Location, Notifications│
│   - File System, Storage        │
│   - Push Notifications          │
└──────────┬──────────────────────┘
           │
           ↓
┌─────────────────────────────────┐
│   React Native                  │
│   (Core framework)              │
└──────────┬──────────────────────┘
           │
           ↓
┌─────────────────────────────────┐
│   Native iOS & Android          │
│   (Actual device features)      │
└─────────────────────────────────┘
```

### Expo in Your VahanHelp App

Your app at `/home/user/VHAPP` uses Expo extensively!

**Check package.json:**
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-camera": "~14.0.0",
    "expo-image-picker": "~14.7.0",
    "expo-location": "~16.5.0",
    "expo-notifications": "~0.27.0",
    "expo-secure-store": "~12.8.0",
    "expo-splash-screen": "~0.26.0",
    "expo-status-bar": "~1.11.0"
  }
}
```

---

## Expo Components and APIs

### 1. Core Expo Modules

#### Camera (expo-camera)
```javascript
import { Camera } from 'expo-camera';

// Request permission
const { status } = await Camera.requestCameraPermissionsAsync();

// Use camera
<Camera style={{ flex: 1 }} />
```

**Used in VahanHelp for**: Taking car photos

#### Image Picker (expo-image-picker)
```javascript
import * as ImagePicker from 'expo-image-picker';

// Pick image from gallery
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 1,
});
```

**Used in VahanHelp for**: Uploading car images, profile pictures

#### Location (expo-location)
```javascript
import * as Location from 'expo-location';

// Get current location
const { status } = await Location.requestForegroundPermissionsAsync();
const location = await Location.getCurrentPositionAsync({});

console.log(location.coords.latitude);  // 28.7041
console.log(location.coords.longitude); // 77.1025
```

**Used in VahanHelp for**: Finding nearby cars, showing car location

#### Notifications (expo-notifications)
```javascript
import * as Notifications from 'expo-notifications';

// Get push token
const token = await Notifications.getExpoPushTokenAsync();

// Send to backend
await api.post('/users/push-token', { token: token.data });
```

**Used in VahanHelp for**: Push notifications for new messages, car updates

#### Secure Store (expo-secure-store)
```javascript
import * as SecureStore from 'expo-secure-store';

// Save securely (encrypted)
await SecureStore.setItemAsync('auth_token', token);

// Retrieve
const token = await SecureStore.getItemAsync('auth_token');
```

**Used in VahanHelp for**: Storing JWT tokens securely

---

## Expo vs React Native CLI

### Comparison Table

| Feature | Expo | React Native CLI |
|---------|------|------------------|
| **Setup** | 5 minutes | 2-3 hours |
| **Xcode needed** | ❌ No | ✅ Yes (for iOS) |
| **Android Studio** | ❌ No | ✅ Yes |
| **Native code** | ❌ Can't modify | ✅ Full access |
| **Testing** | QR code scan | Build required |
| **Camera** | ✅ Built-in | Manual setup |
| **Push notifications** | ✅ Built-in | Manual setup |
| **OTA updates** | ✅ Yes | ❌ No |
| **App size** | Larger (~50MB) | Smaller (~30MB) |
| **Best for** | Most apps, MVPs | Custom native features |

### When to Use Expo (Your Case!)

✅ **Use Expo when:**
- Building business apps (VahanHelp ✅)
- Need fast development
- Don't need custom native code
- Want easy testing
- Need standard features (camera, location, notifications)
- Building MVP/prototype
- Small team/solo developer

❌ **Don't use Expo when:**
- Need custom native modules
- Building games with heavy graphics
- Need specific native libraries not in Expo
- App size is critical concern
- Need bleeding-edge native features

**Your VahanHelp app is perfect for Expo!** ✅

---

## Expo Workflow: Managed vs Bare

### Managed Workflow (Your VahanHelp App Uses This)

**What it means:**
- Expo manages all native code
- You only write JavaScript
- Easy updates
- Limited to Expo modules

```
Your JavaScript Code
        ↓
   Expo handles everything
        ↓
    Working App
```

**Example from Your App:**
```javascript
// App.js
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

export default function App() {
  // All JavaScript - no native code!
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
```

### Bare Workflow (If You Need Native Code)

**What it means:**
- You have access to native code
- Can install any native library
- More complex
- Loses some Expo benefits

```bash
# Eject to bare workflow (careful!)
npx expo prebuild
```

**You probably don't need this for VahanHelp!**

---

## Expo Services You're Using

### 1. Expo Go App

**What it is:**
- Mobile app from Expo
- Runs your development code
- Scan QR code to test

**How it works:**
```bash
# On your computer
npx expo start
# Shows QR code

# On your phone
# Open Expo Go app
# Scan QR code
# Your app loads!
```

### 2. Metro Bundler

**What it is:**
- JavaScript bundler
- Combines all your code
- Enables hot reload

**What you see:**
```
Metro waiting on exp://192.168.1.100:8081
✓ Bundled 1234 modules in 5s
```

### 3. Expo Push Notifications Service

**How it works in VahanHelp:**

```javascript
// 1. Get token in app
const token = await Notifications.getExpoPushTokenAsync();
// Returns: ExponentPushToken[xxxxxxxxxxxxxx]

// 2. Send token to your backend
await axios.post('/users/push-token', {
  token: token.data
});

// 3. Backend stores token in MongoDB

// 4. When sending notification, backend calls Expo API
await fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'ExponentPushToken[xxxxxxxxxxxxxx]',
    title: 'New Message',
    body: 'You have a new inquiry about your car',
    data: { carId: '123' },
  }),
});

// 5. User receives notification!
```

---

## EAS (Expo Application Services)

### What is EAS?

**EAS = Expo Application Services**
- Cloud build service
- Submit apps to stores
- Over-the-air updates

### EAS Build (Building for Production)

**Instead of building locally, build in cloud:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

**Benefits:**
- ✅ No need for Mac to build iOS
- ✅ Fast cloud builds
- ✅ Build history
- ✅ Easy to share test builds

### EAS Submit (Publishing to Stores)

```bash
# Submit to Google Play Store
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

### EAS Update (Over-The-Air Updates)

**Update app without app store review!**

```bash
# Publish update
eas update --branch production --message "Fix login bug"

# Users get update automatically!
```

**What can be updated:**
- ✅ JavaScript code
- ✅ Assets (images, etc.)
- ✅ Bug fixes
- ✅ New features

**What cannot be updated:**
- ❌ Native code changes
- ❌ App icon
- ❌ App permissions

---

## How Expo is Used in Your VahanHelp App

### 1. App Entry Point

**File**: `app.json`
```json
{
  "expo": {
    "name": "VahanHelp",
    "slug": "vahanhelp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#2196F3"
        }
      ]
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.vahanhelp.app"
    },
    "android": {
      "package": "com.vahanhelp.app",
      "permissions": [
        "CAMERA",
        "LOCATION",
        "NOTIFICATIONS"
      ]
    }
  }
}
```

### 2. Notifications Setup

**File**: `src/services/notifications.service.js`
```javascript
import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications
export async function registerForPushNotifications() {
  // Check permission
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    alert('Need notification permissions!');
    return;
  }

  // Get token
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-project-id-from-app.json'
  });

  // Send to backend
  return token.data;
}
```

### 3. Image Picker Integration

**File**: `src/screens/car/AddCarScreen.js`
```javascript
import * as ImagePicker from 'expo-image-picker';

async function pickImage() {
  // Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    alert('Need camera roll permissions!');
    return;
  }

  // Launch picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.8,
  });

  if (!result.canceled) {
    // Upload to backend
    uploadImage(result.assets[0].uri);
  }
}
```

### 4. Secure Token Storage

**File**: `src/utils/storage.js`
```javascript
import * as SecureStore from 'expo-secure-store';

export const storage = {
  // Save token securely
  async setToken(token) {
    await SecureStore.setItemAsync('auth_token', token);
  },

  // Get token
  async getToken() {
    return await SecureStore.getItemAsync('auth_token');
  },

  // Remove token (logout)
  async removeToken() {
    await SecureStore.deleteItemAsync('auth_token');
  }
};
```

---

## Expo SDK Versions

### Version Compatibility

Expo SDK versions correspond to React Native versions:

```
Expo SDK 50 → React Native 0.73
Expo SDK 49 → React Native 0.72
Expo SDK 48 → React Native 0.71
```

**Your VahanHelp app uses:**
- Expo SDK: 50.0.0
- React Native: 0.73.0

### Upgrading Expo

```bash
# Check for updates
npx expo-doctor

# Upgrade to latest
npx expo install expo@latest

# Upgrade all expo packages
npx expo install --fix
```

---

## Expo Configuration (app.json)

### Key Configuration Options

```json
{
  "expo": {
    "name": "VahanHelp",           // App display name
    "slug": "vahanhelp",            // URL slug
    "version": "1.0.0",             // App version
    "orientation": "portrait",       // Screen orientation
    "icon": "./assets/icon.png",    // App icon (1024x1024)

    // Splash screen
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },

    // iOS specific
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.vahanhelp.app",
      "buildNumber": "1.0.0"
    },

    // Android specific
    "android": {
      "package": "com.vahanhelp.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "NOTIFICATIONS"
      ]
    },

    // Expo plugins
    "plugins": [
      "expo-camera",
      "expo-location",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#2196F3"
        }
      ]
    ]
  }
}
```

---

## Expo Limitations

### What You CAN'T Do with Expo

1. **Custom Native Modules**
   ```
   ❌ Can't use libraries that require native code linking
   ❌ Can't modify iOS/Android native code directly
   ```

2. **Background Tasks (Limited)**
   ```
   ❌ Limited background execution
   ⚠️ Background location tracking is limited
   ```

3. **App Size**
   ```
   ❌ Expo apps are ~20-30MB larger than bare React Native
   ```

4. **Bluetooth (Limited)**
   ```
   ⚠️ Limited Bluetooth support
   ```

### What You CAN Do

1. **99% of Business Apps** ✅
2. **Camera & Media** ✅
3. **Location Services** ✅
4. **Push Notifications** ✅
5. **Authentication** ✅
6. **API Calls** ✅
7. **Storage** ✅
8. **Navigation** ✅

**Your VahanHelp needs? All covered!** ✅

---

## Expo Development Tools

### 1. Expo CLI Commands

```bash
# Start development server
npx expo start

# Clear cache
npx expo start -c

# Open on Android
npx expo start --android

# Open on iOS
npx expo start --ios

# Open in web browser
npx expo start --web

# Check for issues
npx expo-doctor

# Install dependencies
npx expo install package-name
```

### 2. Expo Dev Tools Menu

**In terminal after running `npx expo start`, press:**
- `a` - Open on Android
- `i` - Open on iOS
- `w` - Open in web browser
- `r` - Reload app
- `m` - Toggle menu
- `d` - Show developer menu
- `shift+d` - Open DevTools

### 3. On-Device Dev Menu

**Shake your phone or press Cmd+D (iOS) / Cmd+M (Android)**

Options:
- Reload
- Toggle Performance Monitor
- Toggle Element Inspector
- Enable Hot Reloading
- Enable Live Reload

---

## Debugging with Expo

### Console Logs

```javascript
console.log('Debug info');
console.warn('Warning');
console.error('Error');
```

**See logs in:**
- Terminal (where you ran `npx expo start`)
- Metro bundler console
- React Native Debugger

### React Native Debugger

```bash
# Install
brew install --cask react-native-debugger

# Or download from: https://github.com/jhen0409/react-native-debugger

# Open debugger
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

**Features:**
- Redux DevTools
- Console logs
- Network requests
- Element inspector

---

## Expo Ecosystem

### Tools You're Using

1. **Expo CLI** - Command line tool
2. **Expo Go** - Mobile testing app
3. **Expo SDK** - Pre-built native modules
4. **EAS** - Build and deployment
5. **Expo Push Notifications** - Push notification service

### Online Resources

- **Expo Docs**: https://docs.expo.dev
- **Expo Forums**: https://forums.expo.dev
- **Expo Discord**: https://chat.expo.dev
- **Expo Snacks**: https://snack.expo.dev (online playground)

---

## Try Expo Snack

**Expo Snack** = Online React Native playground

Visit: https://snack.expo.dev

**Try this code:**
```javascript
import { View, Text, Button, Alert } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Hello from Expo Snack!
      </Text>
      <Button
        title="Press Me"
        onPress={() => Alert.alert('Hello!', 'You pressed the button')}
      />
    </View>
  );
}
```

**You can:**
- Test code instantly
- Share with QR code
- See live preview
- No installation needed

---

## Key Takeaways

1. **Expo = React Native + Tools + Services**
2. **Your VahanHelp app uses Expo Managed Workflow**
3. **Expo provides**: Camera, Notifications, Location, Storage
4. **Expo Go**: Test app instantly on your phone
5. **EAS**: Build and deploy apps
6. **No native code needed** for most features
7. **Perfect for business apps** like VahanHelp

---

## Next Lesson

Now that you understand Expo, let's learn about React Native components!

**Next**: [04-core-components.md](04-core-components.md) - View, Text, Button, and more

---

## Self-Check Questions

1. What is Expo and how does it relate to React Native?
2. Name 3 Expo modules used in VahanHelp
3. What is Expo Go and why is it useful?
4. What is EAS Build?
5. Can you modify native code in Managed Workflow?
6. What is the difference between Expo and React Native CLI?

Ready to learn about components? Let's go! 🚀
