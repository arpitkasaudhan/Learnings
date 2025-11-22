# Lesson 15: OOP Best Practices

## Best Practices

### 1. Favor Composition Over Inheritance
```typescript
// ✅ Good
class Car {
  constructor(private engine: Engine) {}
}
```

### 2. Program to Interfaces, Not Implementations
```typescript
function processPayment(method: IPaymentMethod) {
  method.process();
}
```

### 3. Keep Classes Small and Focused
```typescript
// ✅ One responsibility
class User {
  constructor(public name: string, public email: string) {}
}
```

### 4. Use Meaningful Names
```typescript
// ✅ Clear names
class CarListingService {
  createListing() {}
  updateListing() {}
}
```

### 5. Encapsulate What Changes
```typescript
class Product {
  private price: number;

  setPrice(price: number) {
    // Validation, logging, etc.
    this.price = price;
  }
}
```

---

## Anti-Patterns to Avoid

### 1. God Object
❌ One class does everything

### 2. Deep Inheritance Hierarchies
❌ Too many levels of inheritance

### 3. Tight Coupling
❌ Classes too dependent on each other

### 4. Premature Optimization
❌ Optimize before knowing bottlenecks

---

## Testing OOP Code

```typescript
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// Test
describe('Calculator', () => {
  it('should add two numbers', () => {
    const calc = new Calculator();
    expect(calc.add(2, 3)).toBe(5);
  });
});
```

---

## You've Completed OOP!

🎉 **Congratulations!** You've mastered:
- Classes and objects
- Four pillars of OOP
- SOLID principles
- Design patterns
- Best practices

**Practice, apply to VahanHelp, and keep coding! 🚀**
