# Lesson 8: Enums and Literal Types

## 🎯 Learning Objectives
- Use enums
- Create literal types
- Understand union types
- Work with type aliases

---

## Enums

```typescript
// Numeric enum
enum Role {
  User,      // 0
  Admin,     // 1
  Moderator  // 2
}

let role: Role = Role.Admin;
console.log(role);  // 1

// String enum (recommended)
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING"
}

let status: Status = Status.Active;
console.log(status);  // "ACTIVE"
```

---

## Literal Types

```typescript
// String literal type
let fuelType: "Petrol" | "Diesel" | "CNG" | "Electric";

fuelType = "Petrol";    // ✅ OK
fuelType = "Diesel";    // ✅ OK
fuelType = "Hydrogen";  // ❌ Error!

// Number literal type
let rating: 1 | 2 | 3 | 4 | 5;

// Boolean literal type
let isPublished: true;  // Must be exactly true
```

---

## Union Types

```typescript
// Can be one of multiple types
let id: string | number;

id = "abc123";  // ✅ OK
id = 123;       // ✅ OK
id = true;      // ❌ Error!

function display(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

---

## Type Aliases

```typescript
// Create reusable type
type ID = string | number;
type CarStatus = "active" | "sold" | "pending";
type Fuel = "Petrol" | "Diesel" | "CNG" | "Electric";

let carId: ID = "car123";
let status: CarStatus = "active";
let fuel: Fuel = "Petrol";
```

---

## Real Examples from VahanHelp

```typescript
// Enums
export enum UserRole {
  USER = "user",
  SELLER = "seller",
  ADMIN = "admin"
}

export enum ListingStatus {
  ACTIVE = "active",
  SOLD = "sold",
  PENDING = "pending",
  REJECTED = "rejected"
}

// Type aliases
type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric";
type Transmission = "Manual" | "Automatic" | "CVT";

interface ICar {
  fuelType: FuelType;
  transmission: Transmission;
  status: ListingStatus;
}
```

---

## Key Takeaways

1. **Enums** for named constants
2. **Literal types** for exact values
3. **Union types** for multiple types
4. **Type aliases** for reusable types

**Next**: [09-advanced-types.md](09-advanced-types.md)
