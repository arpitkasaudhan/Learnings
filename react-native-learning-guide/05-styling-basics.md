# Lesson 5: Styling in React Native - Complete CSS Guide

## 🎯 Learning Objectives
- Understand how styling works in React Native
- Learn StyleSheet API
- Master Flexbox layout
- Learn about dimensions and positioning
- Understand differences from web CSS
- Apply styles to your VahanHelp app

---

## CSS in React Native vs Web

### Web CSS
```html
<!-- Web HTML -->
<div class="container">
  <h1 class="title">Hello</h1>
</div>

<style>
.container {
  background-color: white;
  padding: 20px;
}
.title {
  font-size: 24px;
  color: blue;
}
</style>
```

### React Native Styling
```javascript
// React Native
import { View, Text, StyleSheet } from 'react-native';

<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: 'blue',
  }
});
```

### Key Differences

| Feature | Web CSS | React Native |
|---------|---------|--------------|
| **Syntax** | CSS/SCSS | JavaScript objects |
| **Classes** | `.className` | `style={styles.name}` |
| **IDs** | `#id` | Not used |
| **Units** | `px`, `em`, `rem`, `%` | Numbers (dp), `%` |
| **Layout** | Various | Flexbox (default) |
| **Properties** | kebab-case | camelCase |
| **Cascading** | Yes | No |
| **Specificity** | Yes | No |

---

## StyleSheet API

### Why Use StyleSheet?

**Option 1: Inline Styles (Not Recommended)**
```javascript
<View style={{
  backgroundColor: 'white',
  padding: 20,
  margin: 10
}}>
  <Text style={{ fontSize: 18, color: 'blue' }}>Hello</Text>
</View>
```

**Problems:**
- ❌ Creates new style object on every render
- ❌ Poor performance
- ❌ Hard to maintain
- ❌ No validation

**Option 2: StyleSheet (Recommended) ✅**
```javascript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
  },
  text: {
    fontSize: 18,
    color: 'blue',
  }
});

<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>
```

**Benefits:**
- ✅ Better performance
- ✅ Style validation
- ✅ Reusable
- ✅ Easier to maintain

---

## Basic Styling Properties

### 1. Text Styling

```javascript
const styles = StyleSheet.create({
  text: {
    // Font
    fontSize: 16,                    // Size in dp
    fontWeight: 'bold',              // 'normal', 'bold', '100'-'900'
    fontStyle: 'italic',             // 'normal', 'italic'
    fontFamily: 'Arial',             // Custom fonts

    // Color
    color: '#333333',                // Hex
    color: 'blue',                   // Named color
    color: 'rgb(255, 0, 0)',        // RGB
    color: 'rgba(255, 0, 0, 0.5)',  // RGBA

    // Alignment
    textAlign: 'center',             // 'left', 'center', 'right', 'justify'
    textAlignVertical: 'center',     // 'auto', 'top', 'bottom', 'center'

    // Decoration
    textDecorationLine: 'underline', // 'none', 'underline', 'line-through'
    textTransform: 'uppercase',      // 'none', 'uppercase', 'lowercase', 'capitalize'

    // Spacing
    letterSpacing: 2,                // Space between letters
    lineHeight: 24,                  // Line height
  }
});
```

**Example from VahanHelp:**
```javascript
// Car price text
const styles = StyleSheet.create({
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
    marginTop: 10,
  }
});

<Text style={styles.price}>₹15,00,000</Text>
```

### 2. View Styling (Container)

```javascript
const styles = StyleSheet.create({
  container: {
    // Background
    backgroundColor: '#FFFFFF',
    backgroundColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',

    // Borders
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,

    // Border sides
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,

    // Padding (inside spacing)
    padding: 20,                     // All sides
    paddingVertical: 15,             // Top + Bottom
    paddingHorizontal: 20,           // Left + Right
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,

    // Margin (outside spacing)
    margin: 10,                      // All sides
    marginVertical: 15,              // Top + Bottom
    marginHorizontal: 20,            // Left + Right
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow (Android)
    elevation: 5,

    // Opacity
    opacity: 0.8,                    // 0 (transparent) to 1 (opaque)
  }
});
```

**Example from VahanHelp:**
```javascript
// Car card styling
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 16,

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
});
```

---

## Flexbox Layout (Most Important!)

### Flexbox is Default in React Native

Every `<View>` is a flex container by default!

```javascript
// This View is automatically a flex container
<View>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>
```

### Main Axis vs Cross Axis

```
flexDirection: 'column' (default)
        ↓
        │  ← Cross Axis (horizontal)
        │
        │  Main Axis
        │  (vertical)
        │
        ↓

flexDirection: 'row'
→ → → Main Axis (horizontal) → → →
        ↑
        │
   Cross Axis
   (vertical)
```

### Flex Direction

```javascript
const styles = StyleSheet.create({
  // Column (default) - Items stack vertically
  column: {
    flexDirection: 'column',
  },

  // Row - Items align horizontally
  row: {
    flexDirection: 'row',
  },

  // Column Reverse - Stack vertically (bottom to top)
  columnReverse: {
    flexDirection: 'column-reverse',
  },

  // Row Reverse - Align horizontally (right to left)
  rowReverse: {
    flexDirection: 'row-reverse',
  },
});
```

**Visual Example:**
```javascript
// Column (default)
<View style={{ flexDirection: 'column' }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</View>

// Result:
// Item 1
// Item 2
// Item 3

// Row
<View style={{ flexDirection: 'row' }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</View>

// Result: Item 1  Item 2  Item 3
```

### Justify Content (Main Axis)

```javascript
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',

    // Start (default)
    justifyContent: 'flex-start',   // ├─1─2─3────────┤

    // Center
    justifyContent: 'center',        // ├──────1─2─3───┤

    // End
    justifyContent: 'flex-end',      // ├────────1─2─3─┤

    // Space Between
    justifyContent: 'space-between', // ├1──────2──────3┤

    // Space Around
    justifyContent: 'space-around',  // ├─1───2───3─┤

    // Space Evenly
    justifyContent: 'space-evenly',  // ├──1──2──3──┤
  }
});
```

**Example from VahanHelp:**
```javascript
// Center button at bottom of screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',  // Push to bottom
    paddingBottom: 20,
  },
  button: {
    // Button here
  }
});
```

### Align Items (Cross Axis)

```javascript
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    // Start (default)
    alignItems: 'flex-start',    // Items at top

    // Center
    alignItems: 'center',        // Items in middle

    // End
    alignItems: 'flex-end',      // Items at bottom

    // Stretch
    alignItems: 'stretch',       // Items fill height

    // Baseline
    alignItems: 'baseline',      // Align by text baseline
  }
});
```

**Visual Example:**
```javascript
// Center text vertically and horizontally
<View style={{
  flex: 1,
  justifyContent: 'center',   // Center vertically (main axis)
  alignItems: 'center'        // Center horizontally (cross axis)
}}>
  <Text>Perfectly Centered!</Text>
</View>
```

### Flex Property

```javascript
const styles = StyleSheet.create({
  // Takes all available space
  flex1: {
    flex: 1,
  },

  // Takes twice as much space as flex: 1
  flex2: {
    flex: 2,
  },
});
```

**Example:**
```javascript
<View style={{ flex: 1 }}>
  <View style={{ flex: 1, backgroundColor: 'red' }}>
    {/* Takes 1/3 of screen */}
  </View>
  <View style={{ flex: 2, backgroundColor: 'blue' }}>
    {/* Takes 2/3 of screen */}
  </View>
</View>
```

**From VahanHelp:**
```javascript
// Screen layout
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Takes full screen
  },
  content: {
    flex: 1,  // Takes remaining space after header
  },
  footer: {
    height: 60,  // Fixed height
  }
});
```

---

## Dimensions and Sizing

### Fixed Dimensions

```javascript
const styles = StyleSheet.create({
  box: {
    width: 100,       // 100 dp
    height: 100,      // 100 dp
  }
});
```

### Percentage Dimensions

```javascript
const styles = StyleSheet.create({
  box: {
    width: '50%',     // 50% of parent width
    height: '30%',    // 30% of parent height
  }
});
```

### Using Dimensions API

```javascript
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  box: {
    width: windowWidth * 0.9,   // 90% of screen width
    height: windowHeight * 0.5,  // 50% of screen height
  }
});
```

**Example from VahanHelp:**
```javascript
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  carImage: {
    width: SCREEN_WIDTH - 32,  // Full width minus padding
    height: 200,
    borderRadius: 12,
  }
});
```

### Min/Max Dimensions

```javascript
const styles = StyleSheet.create({
  box: {
    minWidth: 100,
    maxWidth: 300,
    minHeight: 50,
    maxHeight: 200,
  }
});
```

---

## Positioning

### Relative (Default)

```javascript
const styles = StyleSheet.create({
  box: {
    position: 'relative',  // Default
    top: 10,               // Shift 10dp down
    left: 20,              // Shift 20dp right
  }
});
```

### Absolute

```javascript
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
});
```

**Example from VahanHelp:**
```javascript
// Badge on car image (e.g., "Featured")
const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});

<View style={styles.imageContainer}>
  <Image source={{ uri: carImage }} />
  <View style={styles.badge}>
    <Text style={styles.badgeText}>Featured</Text>
  </View>
</View>
```

---

## Combining Styles

### Array of Styles

```javascript
<View style={[styles.box, styles.shadow, { marginTop: 20 }]}>
  <Text>Multiple Styles</Text>
</View>
```

Later styles override earlier ones:
```javascript
const styles = StyleSheet.create({
  base: {
    backgroundColor: 'red',
    padding: 10,
  },
  override: {
    backgroundColor: 'blue',  // This wins!
  }
});

<View style={[styles.base, styles.override]}>
  {/* Background will be blue */}
</View>
```

### Conditional Styles

```javascript
<View style={[
  styles.button,
  isActive && styles.activeButton,
  isDisabled && styles.disabledButton
]}>
  <Text>Button</Text>
</View>
```

**Example from VahanHelp:**
```javascript
const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#2196F3',
  },
  secondary: {
    backgroundColor: '#757575',
  },
  disabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  }
});

<TouchableOpacity
  style={[
    styles.button,
    isPrimary ? styles.primary : styles.secondary,
    isDisabled && styles.disabled
  ]}
  disabled={isDisabled}
>
  <Text>Submit</Text>
</TouchableOpacity>
```

---

## Colors in React Native

### Color Formats

```javascript
const styles = StyleSheet.create({
  // Named colors
  box1: {
    backgroundColor: 'red',
    backgroundColor: 'blue',
    backgroundColor: 'transparent',
  },

  // Hex
  box2: {
    backgroundColor: '#2196F3',
    backgroundColor: '#FFF',      // Short form
  },

  // RGB
  box3: {
    backgroundColor: 'rgb(33, 150, 243)',
  },

  // RGBA (with transparency)
  box4: {
    backgroundColor: 'rgba(33, 150, 243, 0.5)',  // 50% transparent
  },

  // HSL
  box5: {
    backgroundColor: 'hsl(207, 90%, 54%)',
  },

  // HSLA
  box6: {
    backgroundColor: 'hsla(207, 90%, 54%, 0.5)',
  },
});
```

**VahanHelp Color Palette:**
```javascript
// Create a colors file: src/constants/colors.js
export const COLORS = {
  primary: '#2196F3',      // Blue
  secondary: '#FF5722',    // Orange
  success: '#4CAF50',      // Green
  error: '#F44336',        // Red
  warning: '#FFC107',      // Yellow
  background: '#F5F5F5',   // Light gray
  text: '#333333',         // Dark gray
  textLight: '#757575',    // Medium gray
  border: '#E0E0E0',       // Border gray
  white: '#FFFFFF',
  black: '#000000',
};

// Use in styles
import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  text: {
    color: COLORS.text,
  }
});
```

---

## Shadows

### iOS Shadow

```javascript
const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});
```

### Android Shadow

```javascript
const styles = StyleSheet.create({
  card: {
    elevation: 5,  // Higher number = more shadow
  }
});
```

### Cross-Platform Shadow

```javascript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  card: {
    // iOS
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  }
});

// Or simpler:
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,

    // Both platforms
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});
```

---

## Real Examples from VahanHelp

### 1. Car Card Component

```javascript
// src/components/CarCard.js
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const CarCard = ({ car, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: car.images[0] }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>
          {car.brand} {car.model}
        </Text>
        <Text style={styles.year}>{car.year}</Text>
        <View style={styles.row}>
          <Text style={styles.kms}>{car.kmsDriven} km</Text>
          <Text style={styles.fuel}>{car.fuelType}</Text>
        </View>
        <Text style={styles.price}>₹{car.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  kms: {
    fontSize: 14,
    color: '#757575',
  },
  fuel: {
    fontSize: 14,
    color: '#757575',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
});
```

### 2. Button Component

```javascript
// src/components/common/Button.js
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        (disabled || loading) && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[
          styles.text,
          variant === 'secondary' && styles.secondaryText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: '#2196F3',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  disabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#2196F3',
  },
});
```

### 3. Screen Layout

```javascript
// src/screens/HomeScreen.js
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Header content */}
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Scrollable content */}
        </ScrollView>

        <View style={styles.footer}>
          {/* Fixed footer */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  footer: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
```

---

## Best Practices

### 1. Use StyleSheet.create

```javascript
// ✅ Good
const styles = StyleSheet.create({
  container: { padding: 20 }
});

// ❌ Bad
<View style={{ padding: 20 }} />
```

### 2. Define Styles at Bottom

```javascript
// Component code first
const MyComponent = () => {
  return <View style={styles.container} />;
};

// Styles at bottom
const styles = StyleSheet.create({
  container: { padding: 20 }
});
```

### 3. Use Constants for Colors

```javascript
// src/constants/colors.js
export const COLORS = {
  primary: '#2196F3',
  // ...
};

// Use everywhere
import { COLORS } from '../constants/colors';
```

### 4. Name Styles Descriptively

```javascript
// ✅ Good
const styles = StyleSheet.create({
  primaryButton: {},
  cardContainer: {},
  errorText: {},
});

// ❌ Bad
const styles = StyleSheet.create({
  button1: {},
  box: {},
  red: {},
});
```

### 5. Group Related Styles

```javascript
const styles = StyleSheet.create({
  // Container styles
  container: {},
  header: {},
  content: {},
  footer: {},

  // Text styles
  title: {},
  subtitle: {},
  body: {},

  // Button styles
  button: {},
  buttonText: {},
});
```

---

## Key Takeaways

1. **Use StyleSheet.create()** for better performance
2. **Flexbox is default** - every View is a flex container
3. **Properties are camelCase** - `backgroundColor`, not `background-color`
4. **No units** - numbers are in density-independent pixels (dp)
5. **No cascading** - styles don't inherit (except Text)
6. **Absolute positioning** - relative to parent, not document
7. **Platform-specific styles** - Use `Platform.select()` or `Platform.OS`

---

## Next Lesson

Now that you know styling, let's learn about handling user input!

**Next**: [06-user-input.md](06-user-input.md) - TextInput, forms, and validation

---

## Self-Check Questions

1. What's the difference between `margin` and `padding`?
2. How do you center content horizontally and vertically?
3. What's the default `flexDirection` in React Native?
4. How do you add shadows on iOS and Android?
5. What's wrong with inline styles?
6. How do you combine multiple styles?

Ready to learn about user input? Let's go! 🚀
