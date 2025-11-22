# Lesson 09: Hashing

## What is Hashing?

**Hashing** maps data to fixed-size values using a hash function. Enables O(1) lookup!

**Hash Function**: `hash = hashFunction(key) % tableSize`

**JavaScript**: Objects and Maps use hashing internally.

---

## Hash Table / Hash Map

```javascript
// JavaScript Object (Hash Map)
let carPrices = {
  "Honda": 1500000,
  "Maruti": 800000,
  "BMW": 5000000
};

console.log(carPrices["Honda"]);  // O(1) lookup

// JavaScript Map
let map = new Map();
map.set("Honda", 1500000);
map.set("Maruti", 800000);
console.log(map.get("Honda"));  // O(1)

// Map vs Object
// Map: Keys can be any type, maintains insertion order
// Object: Keys are strings/symbols
```

---

## Hash Map Implementation

```javascript
class HashMap {
  constructor(size = 53) {
    this.table = new Array(size);
    this.size = size;
  }

  // Simple hash function
  hash(key) {
    let hash = 0;
    for (let char of key) {
      hash = (hash + char.charCodeAt(0) * 23) % this.size;
    }
    return hash;
  }

  // Set key-value pair
  set(key, value) {
    let index = this.hash(key);

    if (!this.table[index]) {
      this.table[index] = [];
    }

    // Handle collision using chaining
    for (let pair of this.table[index]) {
      if (pair[0] === key) {
        pair[1] = value;
        return;
      }
    }

    this.table[index].push([key, value]);
  }

  // Get value by key
  get(key) {
    let index = this.hash(key);
    let bucket = this.table[index];

    if (!bucket) return undefined;

    for (let pair of bucket) {
      if (pair[0] === key) {
        return pair[1];
      }
    }

    return undefined;
  }

  // Delete key
  delete(key) {
    let index = this.hash(key);
    let bucket = this.table[index];

    if (!bucket) return false;

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        return true;
      }
    }

    return false;
  }
}
```

---

## Collision Handling

**Collision**: When two keys hash to same index.

### 1. Chaining (Linked List)
```javascript
// Each bucket is a linked list
table[index] = [
  [key1, value1],
  [key2, value2]  // Collision
]
```

### 2. Open Addressing (Linear Probing)
```javascript
function set(key, value) {
  let index = hash(key);

  // Find next empty slot
  while (table[index] !== null) {
    index = (index + 1) % size;
  }

  table[index] = [key, value];
}
```

---

## Common Hash Map Problems

### Problem 1: Two Sum
```javascript
function twoSum(nums, target) {
  let map = new Map();

  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));  // [0, 1]
```

### Problem 2: Frequency Counter
```javascript
function characterFrequency(str) {
  let freq = {};

  for (let char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  return freq;
}

console.log(characterFrequency("hello"));
// { h: 1, e: 1, l: 2, o: 1 }
```

### Problem 3: Group Anagrams
```javascript
function groupAnagrams(words) {
  let map = new Map();

  for (let word of words) {
    let sorted = word.split('').sort().join('');

    if (!map.has(sorted)) {
      map.set(sorted, []);
    }

    map.get(sorted).push(word);
  }

  return Array.from(map.values());
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```

---

## VahanHelp Examples

### Cache Car Data
```javascript
class CarCache {
  constructor() {
    this.cache = new Map();
  }

  get(carId) {
    return this.cache.get(carId);
  }

  set(carId, carData) {
    this.cache.set(carId, carData);
  }

  has(carId) {
    return this.cache.has(carId);
  }
}
```

### Count Car Brands
```javascript
function countBrands(cars) {
  let count = {};

  for (let car of cars) {
    count[car.brand] = (count[car.brand] || 0) + 1;
  }

  return count;
}
```

---

## Set Data Structure

```javascript
let set = new Set();

set.add(1);
set.add(2);
set.add(2);  // Duplicate ignored

console.log(set.has(1));    // true
console.log(set.size);      // 2

set.delete(1);
set.clear();

// Set from array (remove duplicates)
let arr = [1, 2, 2, 3, 3, 4];
let unique = [...new Set(arr)];  // [1, 2, 3, 4]
```

---

## Practice Problems

### Easy
1. Contains duplicate
2. Single number
3. Intersection of two arrays
4. Valid anagram
5. First unique character

### Medium
1. Longest substring without repeating characters
2. Group anagrams
3. Top K frequent elements
4. Subarray sum equals K
5. 4Sum problem

---

## Key Takeaways

✅ **Hash map**: O(1) average lookup, insert, delete
✅ **JavaScript**: Use `Map` for hash maps, `Set` for unique values
✅ **Collision handling**: Chaining or open addressing
✅ **Applications**: Caching, frequency counting, grouping

**Next Lesson**: [10-trees-basics.md](10-trees-basics.md)
