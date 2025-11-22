# Lesson 4: Core Components

## 🎯 Learning Objectives
- Learn essential React Native components
- Understand View, Text, Image, Button
- Work with TouchableOpacity and Pressable
- Use ScrollView and FlatList
- Handle user interactions

---

## Core Components Overview

React Native provides built-in components that compile to native UI elements.

### Web vs React Native

| Web HTML | React Native | Purpose |
|----------|--------------|---------|
| `<div>` | `<View>` | Container |
| `<span>`, `<p>`, `<h1>` | `<Text>` | Text |
| `<img>` | `<Image>` | Images |
| `<button>` | `<Button>` | Button |
| `<input>` | `<TextInput>` | Text input |
| `<a>` | `<TouchableOpacity>` | Clickable |
| `<ul>`, `<li>` | `<FlatList>` | Lists |
| `<div>` (scrollable) | `<ScrollView>` | Scrollable |

---

## View Component

**The most fundamental component - like `<div>` in HTML.**

```javascript
import { View } from 'react-native';

<View style={{ padding: 20, backgroundColor: 'white' }}>
  {/* Child components */}
</View>
```

### Use Cases
- Container for other components
- Layout with Flexbox
- Styling (background, borders, shadows)
- Touch handling

**Example from VahanHelp:**
```javascript
<View style={styles.card}>
  <Image source={{ uri: carImage }} />
  <View style={styles.details}>
    <Text>{carBrand}</Text>
    <Text>{carPrice}</Text>
  </View>
</View>
```

---

## Text Component

**Display text - ONLY component that can show text.**

```javascript
import { Text } from 'react-native';

<Text>Hello World</Text>
<Text style={{ fontSize: 20, color: 'blue' }}>Styled Text</Text>
```

### Important Rules
- ✅ Text must be inside `<Text>` component
- ❌ Cannot put text directly in `<View>`
- ✅ Text inherits styles from parent `<Text>`

```javascript
// ❌ Wrong
<View>Hello</View>

// ✅ Correct
<View>
  <Text>Hello</Text>
</View>

// ✅ Nested Text (inherits style)
<Text style={{ fontSize: 20, color: 'blue' }}>
  Hello <Text style={{ fontWeight: 'bold' }}>World</Text>
</Text>
```

**Example from VahanHelp:**
```javascript
<Text style={styles.title}>{car.brand} {car.model}</Text>
<Text style={styles.price}>₹{car.price.toLocaleString()}</Text>
<Text style={styles.subtitle} numberOfLines={2}>
  {car.description}
</Text>
```

---

## Image Component

**Display images from various sources.**

```javascript
import { Image } from 'react-native';

// Network image (URL)
<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
/>

// Local image (imported)
<Image
  source={require('./assets/logo.png')}
  style={{ width: 100, height: 100 }}
/>
```

### Image Props
```javascript
<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode="cover"  // 'cover', 'contain', 'stretch', 'center'
  defaultSource={require('./placeholder.png')}  // Shown while loading
  onLoad={() => console.log('Image loaded')}
  onError={() => console.log('Image failed')}
/>
```

**Example from VahanHelp:**
```javascript
<Image
  source={{ uri: car.images[0] }}
  style={styles.carImage}
  resizeMode="cover"
  defaultSource={require('../assets/car-placeholder.png')}
/>
```

---

## Button Component

**Simple button component.**

```javascript
import { Button } from 'react-native';

<Button
  title="Press Me"
  onPress={() => console.log('Button pressed')}
  color="#2196F3"
  disabled={false}
/>
```

### Limitations
- ❌ Limited styling options
- ❌ Can't add icons
- ❌ Looks different on iOS/Android

**Most apps create custom buttons using TouchableOpacity!**

---

## TouchableOpacity

**Pressable component that reduces opacity when touched - most common for buttons.**

```javascript
import { TouchableOpacity, Text } from 'react-native';

<TouchableOpacity
  onPress={() => console.log('Pressed')}
  style={styles.button}
  activeOpacity={0.7}  // Opacity when pressed (0-1)
  disabled={false}
>
  <Text style={styles.buttonText}>Press Me</Text>
</TouchableOpacity>
```

**Example from VahanHelp:**
```javascript
<TouchableOpacity
  style={styles.primaryButton}
  onPress={handleSubmit}
  disabled={loading}
>
  <Text style={styles.buttonText}>
    {loading ? 'Loading...' : 'Submit'}
  </Text>
</TouchableOpacity>
```

---

## Pressable Component

**More flexible than TouchableOpacity - responds to press states.**

```javascript
import { Pressable, Text } from 'react-native';

<Pressable
  onPress={() => console.log('Pressed')}
  onLongPress={() => console.log('Long pressed')}
  onPressIn={() => console.log('Press started')}
  onPressOut={() => console.log('Press ended')}
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed
  ]}
>
  {({ pressed }) => (
    <Text>{pressed ? 'Pressed!' : 'Press Me'}</Text>
  )}
</Pressable>
```

---

## ScrollView

**Scrollable container - use for small lists.**

```javascript
import { ScrollView, Text } from 'react-native';

<ScrollView
  style={{ flex: 1 }}
  contentContainerStyle={{ padding: 20 }}
  showsVerticalScrollIndicator={false}
  bounces={true}  // iOS bounce effect
>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
  {/* More content */}
</ScrollView>
```

### When to Use
- ✅ Small lists (< 20 items)
- ✅ Mixed content
- ✅ Form screens
- ❌ Long lists (use FlatList instead)

**Example from VahanHelp:**
```javascript
<ScrollView style={styles.container}>
  <Image source={{ uri: car.images[0] }} />
  <Text style={styles.title}>{car.brand}</Text>
  <Text style={styles.description}>{car.description}</Text>
  <View style={styles.features}>
    {/* Car features */}
  </View>
</ScrollView>
```

---

## FlatList

**Efficient list rendering - use for long lists.**

```javascript
import { FlatList, Text } from 'react-native';

const data = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
];

<FlatList
  data={data}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Text>{item.title}</Text>}
  ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
  ListEmptyComponent={() => <Text>No items</Text>}
  onEndReached={() => console.log('Load more')}
  onEndReachedThreshold={0.5}
  refreshing={false}
  onRefresh={() => console.log('Pull to refresh')}
/>
```

**Example from VahanHelp:**
```javascript
<FlatList
  data={cars}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <CarCard car={item} onPress={() => navigateToDetails(item._id)} />
  )}
  ListEmptyComponent={() => (
    <Text style={styles.empty}>No cars found</Text>
  )}
  onEndReached={loadMoreCars}
  refreshing={refreshing}
  onRefresh={handleRefresh}
/>
```

---

## TextInput

**Text input field - covered in detail in Lesson 6.**

```javascript
import { TextInput } from 'react-native';

<TextInput
  style={styles.input}
  placeholder="Enter text"
  value={text}
  onChangeText={setText}
  keyboardType="default"
  autoCapitalize="none"
  secureTextEntry={false}
/>
```

---

## SafeAreaView

**Respects device safe areas (notches, status bars).**

```javascript
import { SafeAreaView } from 'react-native';

<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
  {/* Your content - won't go under notch/status bar */}
</SafeAreaView>
```

---

## ActivityIndicator

**Loading spinner.**

```javascript
import { ActivityIndicator } from 'react-native';

<ActivityIndicator size="large" color="#2196F3" />
```

---

## Modal

**Popup overlay.**

```javascript
import { Modal, View, Text, Button } from 'react-native';

<Modal
  visible={isVisible}
  animationType="slide"  // 'slide', 'fade', 'none'
  transparent={true}
  onRequestClose={() => setIsVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text>Modal Content</Text>
      <Button title="Close" onPress={() => setIsVisible(false)} />
    </View>
  </View>
</Modal>
```

---

## Complete Example: Car Card

```javascript
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

const CarCard = ({ car, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: car.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {car.brand} {car.model}
        </Text>
        <Text style={styles.year}>{car.year}</Text>
        <View style={styles.row}>
          <Text style={styles.detail}>{car.kmsDriven} km</Text>
          <Text style={styles.detail}>{car.fuelType}</Text>
        </View>
        <Text style={styles.price}>₹{car.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
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
  },
  year: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detail: {
    fontSize: 14,
    color: '#757575',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
    marginTop: 10,
  },
});

export default CarCard;
```

---

## Key Takeaways

1. **View** - Container (like `<div>`)
2. **Text** - Only component that displays text
3. **Image** - Display images with `source` prop
4. **TouchableOpacity** - Better than Button for custom buttons
5. **FlatList** - Use for long lists (better performance)
6. **ScrollView** - Use for scrollable content (small lists)

---

## Next Lesson

**Next**: [05-styling-basics.md](05-styling-basics.md) - Learn styling and CSS

---

## Self-Check Questions

1. What's the difference between View and Text?
2. When should you use FlatList vs ScrollView?
3. Why is TouchableOpacity better than Button?
4. How do you display a network image?
5. What is SafeAreaView used for?

Ready for styling? Let's go! 🚀
