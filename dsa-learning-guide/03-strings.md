# Lesson 03: Strings - Text Manipulation Mastery

## Why Strings Matter

Strings are the second most common data structure after arrays. String problems appear in:
- **20-30%** of coding interviews
- Text processing, search, validation
- API responses, database queries
- User input handling

**In VahanHelp**:
- Car model names, descriptions
- User search queries
- Email, phone validation
- License plate numbers
- Address formatting

---

## String Basics in JavaScript

### Creating Strings
```javascript
let str1 = "Hello";           // Double quotes
let str2 = 'World';           // Single quotes
let str3 = `Template ${str1}`; // Template literal

// Strings are immutable!
let name = "Honda";
name[0] = "h";  // ❌ Doesn't work!
console.log(name);  // Still "Honda"

// To change, create new string
name = "h" + name.slice(1);  // "honda"
```

### String Properties and Methods
```javascript
let car = "Honda City";

// Properties
car.length                  // 10

// Access characters
car[0]                      // "H"
car.charAt(0)               // "H"
car.charCodeAt(0)           // 72 (ASCII code)

// Search
car.indexOf("a")            // 4
car.lastIndexOf("i")        // 8
car.includes("City")        // true
car.startsWith("Hon")       // true
car.endsWith("ity")         // true

// Extract
car.slice(0, 5)             // "Honda"
car.substring(0, 5)         // "Honda"
car.substr(6, 4)            // "City" (deprecated)

// Modify (creates new string)
car.toLowerCase()           // "honda city"
car.toUpperCase()           // "HONDA CITY"
car.trim()                  // Remove whitespace
car.replace("Honda", "Toyota")  // "Toyota City"
car.replaceAll("i", "I")    // "Honda CIty"

// Split and join
car.split(" ")              // ["Honda", "City"]
["Honda", "City"].join(" ")  // "Honda City"

// Repeat and pad
"*".repeat(5)               // "*****"
"5".padStart(3, "0")        // "005"
"5".padEnd(3, "0")          // "500"
```

### Time Complexity
```
Operation                | Complexity
──────────────────────────────────────
Access character         | O(1)
Search substring         | O(n*m)
Concatenation            | O(n+m)
Slice/substring          | O(n)
Split                    | O(n)
Replace                  | O(n)
```

---

## Common String Patterns

### Pattern 1: Two Pointers

**Use**: Palindrome check, reverse, matching pairs.

```javascript
// Check if string is palindrome
function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    if (str[left] !== str[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

console.log(isPalindrome("racecar"));  // true
console.log(isPalindrome("hello"));    // false

// Valid palindrome (ignore non-alphanumeric)
function isValidPalindrome(str) {
  let cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

console.log(isValidPalindrome("A man, a plan, a canal: Panama"));  // true
```

**VahanHelp Example**:
```javascript
// Check if license plate is valid palindrome format
function isValidPalindromePlate(plate) {
  let cleaned = plate.replace(/[^A-Z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}
```

---

### Pattern 2: Sliding Window

**Use**: Substring problems, longest/shortest substrings.

```javascript
// Longest substring without repeating characters
function lengthOfLongestSubstring(str) {
  let maxLength = 0;
  let start = 0;
  let charIndex = new Map();

  for (let end = 0; end < str.length; end++) {
    let char = str[end];

    if (charIndex.has(char) && charIndex.get(char) >= start) {
      start = charIndex.get(char) + 1;
    }

    charIndex.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }

  return maxLength;
}

console.log(lengthOfLongestSubstring("abcabcbb"));  // 3 ("abc")
console.log(lengthOfLongestSubstring("bbbbb"));     // 1 ("b")
```

**Time**: O(n)
**Space**: O(min(n, m)) where m is charset size

---

### Pattern 3: Character Frequency (Hash Map)

**Use**: Anagrams, character counting, permutations.

```javascript
// Check if two strings are anagrams
function isAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;

  let freq = {};

  for (let char of str1) {
    freq[char] = (freq[char] || 0) + 1;
  }

  for (let char of str2) {
    if (!freq[char]) return false;
    freq[char]--;
  }

  return true;
}

console.log(isAnagram("listen", "silent"));  // true
console.log(isAnagram("hello", "world"));    // false

// Find all anagrams in array
function groupAnagrams(strs) {
  let groups = new Map();

  for (let str of strs) {
    let sorted = str.split('').sort().join('');
    if (!groups.has(sorted)) {
      groups.set(sorted, []);
    }
    groups.get(sorted).push(str);
  }

  return Array.from(groups.values());
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```

**VahanHelp Example**:
```javascript
// Group cars by anagram of brand name (for fun!)
function groupCarsByAnagram(cars) {
  let groups = new Map();

  for (let car of cars) {
    let sorted = car.brand.toLowerCase().split('').sort().join('');
    if (!groups.has(sorted)) {
      groups.set(sorted, []);
    }
    groups.get(sorted).push(car);
  }

  return groups;
}
```

---

### Pattern 4: String Builder (Array Join)

**Use**: Build strings efficiently, avoid concatenation in loops.

```javascript
// ❌ Inefficient - O(n²) due to immutable strings
function buildString_Slow(n) {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += i;  // Creates new string each time!
  }
  return result;
}

// ✅ Efficient - O(n)
function buildString_Fast(n) {
  let parts = [];
  for (let i = 0; i < n; i++) {
    parts.push(i);
  }
  return parts.join('');
}
```

**VahanHelp Example**:
```javascript
// Build car description efficiently
function buildCarDescription(car) {
  let parts = [];

  parts.push(`${car.brand} ${car.model}`);

  if (car.year) {
    parts.push(`(${car.year})`);
  }

  if (car.color) {
    parts.push(`- ${car.color}`);
  }

  if (car.price) {
    parts.push(`- ₹${car.price.toLocaleString()}`);
  }

  return parts.join(' ');
}
```

---

## Common String Problems

### Problem 1: Reverse String

```javascript
// Method 1: Two pointers (in-place if array)
function reverseString(str) {
  let arr = str.split('');
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }

  return arr.join('');
}

// Method 2: Built-in (easiest)
function reverseStringSimple(str) {
  return str.split('').reverse().join('');
}

// Method 3: Recursion
function reverseStringRecursive(str) {
  if (str.length <= 1) return str;
  return reverseStringRecursive(str.slice(1)) + str[0];
}

console.log(reverseString("hello"));  // "olleh"
```

---

### Problem 2: First Non-Repeating Character

```javascript
function firstNonRepeatingChar(str) {
  let freq = {};

  // Count frequency
  for (let char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Find first with frequency 1
  for (let char of str) {
    if (freq[char] === 1) {
      return char;
    }
  }

  return null;
}

console.log(firstNonRepeatingChar("leetcode"));  // "l"
console.log(firstNonRepeatingChar("aabb"));      // null
```

**Time**: O(n)
**Space**: O(1) - max 26 letters in English

---

### Problem 3: String Compression

```javascript
function compressString(str) {
  if (str.length === 0) return str;

  let compressed = [];
  let count = 1;

  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++;
    } else {
      compressed.push(str[i - 1] + count);
      count = 1;
    }
  }

  // Add last group
  compressed.push(str[str.length - 1] + count);

  let result = compressed.join('');
  return result.length < str.length ? result : str;
}

console.log(compressString("aabcccccaaa"));  // "a2b1c5a3"
console.log(compressString("abc"));          // "abc" (no compression)
```

---

### Problem 4: Valid Parentheses

```javascript
function isValidParentheses(str) {
  let stack = [];
  let pairs = {
    '(': ')',
    '{': '}',
    '[': ']'
  };

  for (let char of str) {
    if (char in pairs) {
      // Opening bracket
      stack.push(char);
    } else {
      // Closing bracket
      let last = stack.pop();
      if (pairs[last] !== char) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

console.log(isValidParentheses("()[]{}"));     // true
console.log(isValidParentheses("([)]"));       // false
console.log(isValidParentheses("{[]}"));       // true
```

---

### Problem 5: Longest Common Prefix

```javascript
function longestCommonPrefix(strs) {
  if (strs.length === 0) return "";

  let prefix = strs[0];

  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }

  return prefix;
}

console.log(longestCommonPrefix(["flower", "flow", "flight"]));  // "fl"
console.log(longestCommonPrefix(["dog", "racecar", "car"]));     // ""
```

**VahanHelp Example**:
```javascript
// Find common prefix in car model names
function findCommonModelPrefix(models) {
  if (models.length === 0) return "";

  let prefix = models[0];

  for (let model of models) {
    while (model.indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }

  return prefix;
}

console.log(findCommonModelPrefix(["City LX", "City VX", "City ZX"]));  // "City "
```

---

## VahanHelp Real-World Examples

### Example 1: Search Car Listings

```javascript
function searchCars(cars, query) {
  let normalizedQuery = query.toLowerCase().trim();

  return cars.filter(car => {
    let brand = car.brand.toLowerCase();
    let model = car.model.toLowerCase();
    let description = (car.description || "").toLowerCase();

    return brand.includes(normalizedQuery) ||
           model.includes(normalizedQuery) ||
           description.includes(normalizedQuery);
  });
}

// Fuzzy search (simple version)
function fuzzySearchCars(cars, query) {
  let normalizedQuery = query.toLowerCase().replace(/\s+/g, '');

  return cars.filter(car => {
    let searchText = `${car.brand} ${car.model}`.toLowerCase().replace(/\s+/g, '');
    return searchText.includes(normalizedQuery);
  });
}
```

---

### Example 2: Validate Input

```javascript
// Validate email
function isValidEmail(email) {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validate phone (Indian format)
function isValidIndianPhone(phone) {
  let cleaned = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

// Validate license plate (Indian)
function isValidLicensePlate(plate) {
  // Format: XX00XX0000 (e.g., MH12AB1234)
  let regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
  return regex.test(plate.replace(/\s/g, ''));
}

// Validate VIN (Vehicle Identification Number)
function isValidVIN(vin) {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
}
```

---

### Example 3: Format Text

```javascript
// Format car price
function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}

// Format phone number
function formatPhone(phone) {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

// Truncate description with ellipsis
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Slugify (URL-friendly string)
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

console.log(slugify("Honda City 2023!"));  // "honda-city-2023"
```

---

### Example 4: Extract Information

```javascript
// Extract model year from description
function extractYear(description) {
  let match = description.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0]) : null;
}

// Extract price from text
function extractPrice(text) {
  let match = text.match(/₹?\s*([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''));
  }
  return null;
}

// Extract hashtags
function extractHashtags(text) {
  let regex = /#[a-zA-Z0-9_]+/g;
  return text.match(regex) || [];
}

console.log(extractHashtags("Great car! #Honda #City #2023"));
// ["#Honda", "#City", "#2023"]
```

---

## Common Mistakes

### Mistake 1: Forgetting Strings are Immutable
```javascript
// ❌ Wrong
let str = "hello";
str[0] = "H";  // Doesn't work!

// ✅ Correct
str = "H" + str.slice(1);  // "Hello"
```

### Mistake 2: Inefficient String Concatenation
```javascript
// ❌ Wrong - O(n²)
let result = "";
for (let i = 0; i < 1000; i++) {
  result += i;  // Creates new string each time
}

// ✅ Correct - O(n)
let parts = [];
for (let i = 0; i < 1000; i++) {
  parts.push(i);
}
let result = parts.join('');
```

### Mistake 3: Case Sensitivity
```javascript
// ❌ Wrong
if (car.brand === "honda") {  // Won't match "Honda"

// ✅ Correct
if (car.brand.toLowerCase() === "honda") {
```

---

## Practice Problems

### Easy
1. Reverse words in a string
2. Check if string contains all unique characters
3. Count vowels and consonants
4. Remove duplicates from string
5. Check if two strings are rotations of each other

### Medium
1. Longest palindromic substring
2. String to integer (atoi)
3. Implement strStr() (find needle in haystack)
4. Minimum window substring
5. Group shifted strings

### Hard
1. Regular expression matching
2. Wildcard matching
3. Edit distance (Levenshtein distance)
4. Longest valid parentheses
5. Count and say sequence

---

## Quick Reference

### Essential String Methods
```javascript
str.length
str.charAt(i)
str.charCodeAt(i)
str.indexOf(substr)
str.lastIndexOf(substr)
str.includes(substr)
str.startsWith(prefix)
str.endsWith(suffix)
str.slice(start, end)
str.substring(start, end)
str.toLowerCase()
str.toUpperCase()
str.trim()
str.replace(old, new)
str.replaceAll(old, new)
str.split(separator)
str.repeat(count)
str.padStart(length, char)
str.padEnd(length, char)
```

### Regular Expressions
```javascript
/pattern/flags

// Flags
/g  - global (all matches)
/i  - case insensitive
/m  - multiline

// Methods
str.match(regex)
str.search(regex)
str.replace(regex, replacement)
regex.test(str)
regex.exec(str)
```

---

## Key Takeaways

✅ Strings are **immutable** in JavaScript
✅ Use **array join** instead of concatenation in loops
✅ **Two pointers** for palindromes and reversing
✅ **Sliding window** for substring problems
✅ **Hash map** for character frequency
✅ **toLowerCase()** for case-insensitive comparison
✅ **Regular expressions** for pattern matching
✅ **Validate user input** before processing
✅ **O(n)** is typical for string problems

---

## What's Next?

Now that you've mastered strings, let's learn efficient searching!

**Next Lesson**: [04-searching-algorithms.md](04-searching-algorithms.md)

---

**Remember**: Practice string problems daily - they're everywhere!

**Keep coding! 🚀**
