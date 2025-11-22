# Lesson 06: Encapsulation

## What is Encapsulation?

**Encapsulation**: Bundle data and methods together, hide internal details.

**Benefits**:
- Data protection
- Controlled access
- Easier maintenance

---

## Access Modifiers (TypeScript)

### Public (default)
```typescript
class Car {
  public brand: string;  // Accessible everywhere

  constructor(brand: string) {
    this.brand = brand;
  }
}

let car = new Car("Honda");
console.log(car.brand);  // ✅ Accessible
```

### Private
```typescript
class Car {
  private mileage: number = 0;  // Only inside class

  drive(distance: number) {
    this.mileage += distance;
  }

  getMileage(): number {
    return this.mileage;
  }
}

let car = new Car();
car.drive(100);
console.log(car.getMileage());  // ✅ Via method
// console.log(car.mileage);    // ❌ Error: Private
```

### Protected
```typescript
class Vehicle {
  protected mileage: number = 0;  // Accessible in subclasses
}

class Car extends Vehicle {
  drive(distance: number) {
    this.mileage += distance;  // ✅ Accessible in subclass
  }
}
```

---

## Private Fields (JavaScript ES2022)

```javascript
class BankAccount {
  #balance = 0;  // Private field

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
    }
  }

  getBalance() {
    return this.#balance;
  }
}

let account = new BankAccount();
account.deposit(1000);
console.log(account.getBalance());  // ✅ 1000
// console.log(account.#balance);   // ❌ Error
```

---

## VahanHelp Example

```typescript
class User {
  private password: string;
  private loginAttempts: number = 0;

  constructor(
    public email: string,
    password: string
  ) {
    this.password = this.hashPassword(password);
  }

  private hashPassword(password: string): string {
    // Hash implementation
    return `hashed_${password}`;
  }

  validatePassword(password: string): boolean {
    if (this.loginAttempts >= 3) {
      throw new Error('Account locked');
    }

    const isValid = this.hashPassword(password) === this.password;

    if (!isValid) {
      this.loginAttempts++;
    } else {
      this.loginAttempts = 0;
    }

    return isValid;
  }

  resetPassword(oldPassword: string, newPassword: string): boolean {
    if (!this.validatePassword(oldPassword)) {
      return false;
    }

    this.password = this.hashPassword(newPassword);
    return true;
  }
}

let user = new User("john@example.com", "secret123");
console.log(user.validatePassword("secret123"));  // true
// console.log(user.password);  // ❌ Error: Private
```

---

## Best Practices

✅ **Make fields private by default**
✅ **Provide getters/setters for controlled access**
✅ **Validate data in setters**
✅ **Hide implementation details**
✅ **Expose minimal API**

**Next Lesson**: [07-inheritance.md](07-inheritance.md)
