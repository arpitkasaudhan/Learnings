# Lesson 10: Decorators

## 🎯 Learning Objectives
- Understand decorators
- Use class decorators
- Apply method decorators
- Work with property decorators

---

## What are Decorators?

**Decorators add metadata or modify classes, methods, and properties.**

Enable in tsconfig.json:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

---

## Class Decorators

```typescript
function LogClass(target: Function) {
  console.log(`Class created: ${target.name}`);
}

@LogClass
class Car {
  constructor(public brand: string) {}
}

const car = new Car("Honda");
// Logs: "Class created: Car"
```

---

## Method Decorators

```typescript
function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    const result = original.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
}

class Calculator {
  @LogMethod
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);
// Logs: "Calling add with [2, 3]"
// Logs: "Result: 5"
```

---

## Property Decorators

```typescript
function Required(target: any, propertyKey: string) {
  let value: any;

  Object.defineProperty(target, propertyKey, {
    get() {
      return value;
    },
    set(newValue: any) {
      if (newValue === undefined || newValue === null) {
        throw new Error(`${propertyKey} is required`);
      }
      value = newValue;
    }
  });
}

class User {
  @Required
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
```

---

## Key Takeaways

1. **Decorators** modify classes/methods/properties
2. **@** syntax applies decorators
3. Enable in tsconfig.json
4. Common in frameworks (NestJS, TypeORM)

**Next**: [11-modules-namespaces.md](11-modules-namespaces.md)
