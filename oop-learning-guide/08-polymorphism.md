# Lesson 08: Polymorphism

## What is Polymorphism?

**Polymorphism**: "Many forms" - same interface, different implementations.

**Benefits**:
- Flexibility
- Extensibility
- Code reusability

---

## Method Overriding (Runtime Polymorphism)

```typescript
class Animal {
  speak(): void {
    console.log("Animal makes a sound");
  }
}

class Dog extends Animal {
  speak(): void {
    console.log("Dog barks");
  }
}

class Cat extends Animal {
  speak(): void {
    console.log("Cat meows");
  }
}

// Polymorphism in action
let animals: Animal[] = [new Dog(), new Cat(), new Animal()];

animals.forEach(animal => {
  animal.speak();  // Different behavior for each
});
// Output:
// Dog barks
// Cat meows
// Animal makes a sound
```

---

## VahanHelp Example

```typescript
abstract class PaymentMethod {
  abstract processPayment(amount: number): Promise<boolean>;

  getProcessingFee(amount: number): number {
    return amount * 0.02;  // Default 2%
  }
}

class CreditCard extends PaymentMethod {
  constructor(private cardNumber: string) {
    super();
  }

  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing credit card payment: ₹${amount}`);
    // Credit card processing logic
    return true;
  }

  getProcessingFee(amount: number): number {
    return amount * 0.025;  // 2.5% for credit cards
  }
}

class UPI extends PaymentMethod {
  constructor(private upiId: string) {
    super();
  }

  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing UPI payment: ₹${amount} to ${this.upiId}`);
    // UPI processing logic
    return true;
  }

  getProcessingFee(amount: number): number {
    return 0;  // No fee for UPI
  }
}

class NetBanking extends PaymentMethod {
  constructor(private bankName: string) {
    super();
  }

  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing net banking payment: ₹${amount} via ${this.bankName}`);
    // Net banking logic
    return true;
  }
}

// Polymorphism - same interface, different implementations
class PaymentProcessor {
  async processPayment(method: PaymentMethod, amount: number): Promise<void> {
    const fee = method.getProcessingFee(amount);
    const total = amount + fee;

    console.log(`Amount: ₹${amount}, Fee: ₹${fee}, Total: ₹${total}`);

    const success = await method.processPayment(total);

    if (success) {
      console.log("Payment successful!");
    } else {
      console.log("Payment failed!");
    }
  }
}

// Usage
const processor = new PaymentProcessor();

processor.processPayment(new CreditCard("1234-5678-9012-3456"), 10000);
processor.processPayment(new UPI("user@upi"), 10000);
processor.processPayment(new NetBanking("HDFC"), 10000);
```

**Next Lesson**: [09-abstraction.md](09-abstraction.md)
