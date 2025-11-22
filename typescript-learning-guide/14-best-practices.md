# Lesson 14: Best Practices

## 🎯 Learning Objectives
- Write clean TypeScript
- Use types effectively
- Avoid common mistakes
- Structure projects

---

## Type Everything

```typescript
// ❌ Bad
function getData(id) {
  // ...
}

// ✅ Good
function getData(id: string): Promise<Data> {
  // ...
}
```

---

## Use Interfaces for Objects

```typescript
// ✅ Good
interface User {
  name: string;
  email: string;
  age: number;
}

function createUser(data: User): void {
  // ...
}
```

---

## Prefer Type Inference

```typescript
// ❌ Unnecessary
let name: string = "John";

// ✅ Good (TypeScript infers)
let name = "John";

// ✅ Use when needed
let data: string | null = null;
```

---

## Use Enums for Constants

```typescript
// ✅ Good
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

let status: Status = Status.Active;
```

---

## Avoid `any`

```typescript
// ❌ Bad
let data: any;

// ✅ Good
let data: unknown;
// or
interface Data {
  // define structure
}
let data: Data;
```

---

## Use Utility Types

```typescript
// ✅ Good
type UpdateUser = Partial<User>;
type UserWithoutPassword = Omit<User, 'password'>;
type UserBasics = Pick<User, 'name' | 'email'>;
```

---

## Key Takeaways

1. **Type everything** explicitly when needed
2. **Use interfaces** for object shapes
3. **Prefer inference** when obvious
4. **Avoid `any`** use `unknown` instead
5. **Use utility types** for transformations

**Next**: [15-common-patterns.md](15-common-patterns.md)
