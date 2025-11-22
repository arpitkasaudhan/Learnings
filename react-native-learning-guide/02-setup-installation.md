# Lesson 2: Setup & Installation

## 🎯 Learning Objectives
- Install Node.js and prerequisites
- Install Expo CLI
- Set up your development environment
- Create your first React Native app
- Run the app on your device
- Understand the project structure

---

## Prerequisites

Before installing React Native, you need:

### 1. Node.js (Already Installed!)

Check your Node.js version:
```bash
node --version
# Should show v18.x.x or higher
```

### 2. npm or Yarn

npm comes with Node.js:
```bash
npm --version
# Should show 9.x.x or higher
```

### 3. Git (Already Installed!)

```bash
git --version
# Should show git version 2.x.x
```

### 4. Code Editor

- **VS Code** (Recommended) - Already have it!
- Extensions to install:
  - ES7+ React/Redux/React-Native snippets
  - React Native Tools
  - Prettier
  - ESLint

---

## Two Ways to Start React Native

### Option 1: Expo (Recommended for Beginners) ✅

**Your VahanHelp app uses this method!**

**Pros:**
- ✅ Easy setup
- ✅ No need for Xcode/Android Studio
- ✅ Test on real device instantly
- ✅ Pre-built components
- ✅ Over-the-air updates

**Cons:**
- ❌ Limited access to native code
- ❌ Slightly larger app size

### Option 2: React Native CLI (Advanced)

**Pros:**
- ✅ Full control over native code
- ✅ Smaller app size
- ✅ Access to all native features

**Cons:**
- ❌ Complex setup
- ❌ Need Xcode (Mac) for iOS
- ❌ Need Android Studio for Android
- ❌ Slower development

**We'll focus on Expo since your app uses it!**

---

## Installing Expo CLI

### Step 1: Install Expo CLI Globally

```bash
npm install -g expo-cli
```

### Step 2: Verify Installation

```bash
expo --version
# Should show something like: 6.x.x
```

**Note**: Your VahanHelp app might use `npx expo` instead of global installation.

---

## Creating Your First Expo App

### Method 1: Using Expo CLI

```bash
# Create new app
npx create-expo-app MyFirstApp

# Navigate to app directory
cd MyFirstApp

# Start the development server
npx expo start
```

### Method 2: Using npm/npx (Modern Approach)

```bash
# Create app with specific template
npx create-expo-app@latest my-app --template blank

# Create with TypeScript
npx create-expo-app@latest my-app --template blank-typescript
```

### What Happens When You Create an App?

```
Creating MyFirstApp...
  ✓ Downloaded template
  ✓ Installed dependencies
  ✓ Created project structure
  ✓ Initialized git repository

Success! Created MyFirstApp at /path/to/MyFirstApp
```

---

## Project Structure Explained

After creating an app, you'll see:

```
MyFirstApp/
├── App.js                 # Main entry point (your app starts here)
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── babel.config.js       # Babel configuration
├── .gitignore           # Files to ignore in git
├── assets/              # Images, fonts, etc.
│   ├── icon.png         # App icon
│   ├── splash.png       # Splash screen
│   └── adaptive-icon.png
└── node_modules/        # Installed packages (auto-generated)
```

### Key Files Explained

#### 1. App.js (Main Entry Point)
```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

#### 2. app.json (Expo Configuration)
```json
{
  "expo": {
    "name": "MyFirstApp",
    "slug": "my-first-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.myfirstapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourcompany.myfirstapp"
    }
  }
}
```

#### 3. package.json (Dependencies)
```json
{
  "name": "my-first-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "expo-status-bar": "~1.11.1",
    "react": "18.2.0",
    "react-native": "0.73.0"
  }
}
```

---

## Running Your App

### Step 1: Start Development Server

```bash
cd MyFirstApp
npx expo start
```

You'll see:
```
Starting Metro Bundler
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
› Press r │ reload app
› Press m │ toggle menu
```

### Step 2: Install Expo Go on Your Phone

**Android:**
- Open Google Play Store
- Search "Expo Go"
- Install it

**iOS:**
- Open App Store
- Search "Expo Go"
- Install it

### Step 3: Scan QR Code

1. Open Expo Go app on your phone
2. Tap "Scan QR Code"
3. Scan the QR code from your terminal
4. Wait for app to load

**First time will take 30-60 seconds!**

---

## Your VahanHelp App Setup

Your existing app at `/home/user/VHAPP` already has this structure:

### 1. Check package.json
```bash
cd /home/user/VHAPP
cat package.json
```

You'll see:
```json
{
  "name": "vahanhelp",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "react-native": "~0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@reduxjs/toolkit": "^2.0.1",
    "expo-notifications": "~0.27.0",
    // ... more dependencies
  }
}
```

### 2. Running Your VahanHelp App

```bash
cd /home/user/VHAPP

# Install dependencies (if not already installed)
npm install

# Start the app
npm start

# Or directly with expo
npx expo start
```

### 3. Your App Entry Point

**File**: `/home/user/VHAPP/App.js` or `/home/user/VHAPP/index.js`

This is where your app starts!

---

## Development Workflow

### 1. Make Changes to Code

Edit `App.js`:
```javascript
<Text>Hello from VahanHelp!</Text>
```

### 2. Save File

The app automatically reloads! (Hot Reload)

### 3. See Changes Instantly

No need to restart or rebuild!

---

## Expo Go App vs Standalone Build

### Expo Go App (Development)

**What you use during development:**
- Install Expo Go from store
- Scan QR code
- Test your app instantly
- Free and easy

**Limitations:**
- Must have Expo Go installed
- Internet connection required
- Can't publish to store

### Standalone Build (Production)

**What users get:**
- Your own app in App Store/Play Store
- No Expo Go needed
- Works offline
- Your own icon and name

**Build commands:**
```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

---

## Common Commands

### Development
```bash
# Start development server
npm start
# or
npx expo start

# Start with cache cleared
npx expo start -c

# Start on specific port
npx expo start --port 8082
```

### Running on Devices
```bash
# Open on Android device/emulator
npx expo start --android

# Open on iOS simulator (Mac only)
npx expo start --ios

# Open in web browser
npx expo start --web
```

### Installing Packages
```bash
# Install expo-compatible package
npx expo install package-name

# Install any npm package
npm install package-name
```

### Troubleshooting
```bash
# Clear cache and restart
npx expo start -c

# Clear all caches
rm -rf node_modules
npm cache clean --force
npm install
```

---

## Understanding the Development Server

When you run `npx expo start`, you get:

### Metro Bundler
- Bundles your JavaScript code
- Serves it to your device
- Enables hot reload
- Shows errors and warnings

### QR Code
- Contains URL to your app
- Expo Go scans it to connect
- Format: `exp://192.168.1.100:8081`

### DevTools
- Press `m` to open menu
- Options:
  - Reload app
  - Toggle performance monitor
  - Toggle element inspector
  - Open debugger

---

## Testing Your Setup

### Test 1: Create Simple App

```bash
npx create-expo-app TestApp
cd TestApp
npx expo start
```

**Expected**: QR code appears, Metro bundler starts

### Test 2: Edit App.js

```javascript
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Setup Works! 🎉</Text>
    </View>
  );
}
```

**Expected**: App reloads automatically with new text

### Test 3: Run Your VahanHelp App

```bash
cd /home/user/VHAPP
npm install
npm start
```

**Expected**: Your VahanHelp app opens in Expo Go

---

## Debugging Setup Issues

### Issue 1: "expo: command not found"

**Solution**:
```bash
# Use npx instead
npx expo start

# Or install globally
npm install -g expo-cli
```

### Issue 2: "Unable to resolve module"

**Solution**:
```bash
# Clear cache
npx expo start -c

# Or clear everything
rm -rf node_modules
npm install
npx expo start -c
```

### Issue 3: "Network error" in Expo Go

**Solutions**:
- Make sure phone and computer are on same WiFi
- Check firewall settings
- Try tunnel mode: `npx expo start --tunnel`

### Issue 4: "Module not found"

**Solution**:
```bash
# Install missing dependencies
npm install

# Or use expo install for expo packages
npx expo install expo-package-name
```

---

## VS Code Setup

### Recommended Extensions

1. **ES7+ React/Redux/React-Native snippets**
   - Shortcuts like `rnf` for React Native function component

2. **React Native Tools**
   - Debugging support
   - IntelliSense

3. **Prettier - Code formatter**
   - Auto-format code on save

4. **ESLint**
   - Catch errors as you type

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Your Development Environment Checklist

Before starting development, ensure:

- [ ] Node.js installed (v18+)
- [ ] npm installed (v9+)
- [ ] Expo Go app on phone
- [ ] VS Code installed
- [ ] VS Code extensions installed
- [ ] Can run `npx expo start`
- [ ] Can see QR code
- [ ] Can open app in Expo Go
- [ ] Hot reload works
- [ ] WiFi connection stable

---

## Folder Structure for VahanHelp App

Your production app has this structure:

```
VHAPP/
├── App.js                    # Main entry
├── app.json                  # Expo config
├── package.json             # Dependencies
├── src/                     # Source code
│   ├── components/          # Reusable components
│   │   ├── common/         # Button, Input, Card, etc.
│   │   └── features/       # CarCard, UserProfile, etc.
│   ├── screens/            # App screens
│   │   ├── auth/           # Login, Signup screens
│   │   ├── home/           # Home screen
│   │   ├── car/            # Car listing, details
│   │   └── profile/        # User profile
│   ├── navigation/         # Navigation setup
│   ├── redux/              # State management
│   │   ├── slices/         # Redux slices
│   │   └── store.js        # Redux store
│   ├── services/           # API calls
│   │   ├── api.js          # Axios instance
│   │   ├── auth.service.js
│   │   └── car.service.js
│   ├── utils/              # Utility functions
│   └── constants/          # Constants
├── assets/                 # Images, fonts
└── node_modules/           # Dependencies
```

---

## Next Steps After Setup

1. **Learn Core Components** (Lesson 3)
2. **Understand Expo** (Lesson 4)
3. **Learn Styling** (Lesson 5)
4. **Master Navigation** (Lesson 10)

---

## Practice Exercise

### Exercise 1: Create Your First App

```bash
# 1. Create new app
npx create-expo-app MyTestApp

# 2. Navigate to it
cd MyTestApp

# 3. Start it
npx expo start

# 4. Open in Expo Go
# Scan QR code
```

### Exercise 2: Make First Change

Edit `App.js`:
```javascript
<Text>Hello, I'm learning React Native! 🚀</Text>
```

**Expected**: App reloads with your text

### Exercise 3: Run VahanHelp App

```bash
cd /home/user/VHAPP
npm install
npm start
```

**Expected**: Your VahanHelp app opens

---

## Key Takeaways

1. **Expo makes setup easy** - No Xcode/Android Studio needed
2. **npx expo start** - Start development server
3. **Expo Go** - Test on real device instantly
4. **Hot Reload** - See changes immediately
5. **app.json** - Configure your app
6. **Metro Bundler** - Bundles JavaScript code

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Command not found | Use `npx expo` instead of `expo` |
| Module not found | Run `npm install` |
| Cache issues | Run `npx expo start -c` |
| Network error | Check WiFi, try `--tunnel` |
| Port in use | Run `npx expo start --port 8082` |
| Slow loading | Clear cache with `-c` flag |

---

## Next Lesson

Now that you have everything installed and running, let's learn about Expo in detail!

**Next**: [03-expo-explained.md](03-expo-explained.md) - Deep dive into Expo

---

## Self-Check Questions

1. What are the two ways to create a React Native app?
2. What is Expo Go and why do we need it?
3. What command starts the development server?
4. What is hot reload?
5. Where is the main entry point of a React Native app?
6. How do you install a new package in Expo?

Ready to learn about Expo? Let's go! 🚀
