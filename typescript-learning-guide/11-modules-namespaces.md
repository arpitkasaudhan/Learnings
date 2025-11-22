# Lesson 11: Modules and Namespaces

## 🎯 Learning Objectives
- Use ES6 modules in TypeScript
- Export and import types
- Understand module resolution
- Organize large codebases

---

## ES6 Modules

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

export interface MathOperation {
  (a: number, b: number): number;
}

// app.ts
import { add, PI, MathOperation } from './math';

console.log(add(2, 3));  // 5
console.log(PI);         // 3.14159
```

---

## Default Exports

```typescript
// carService.ts
export default class CarService {
  async getCars() {
    // ...
  }
}

// app.ts
import CarService from './carService';

const service = new CarService();
```

---

## Re-exporting

```typescript
// models/index.ts
export { Car } from './Car';
export { User } from './User';
export { Inquiry } from './Inquiry';

// app.ts
import { Car, User, Inquiry } from './models';
```

---

## Your Backend Structure

```typescript
// src/domain/entities/Car.ts
export interface ICar {
  brand: string;
  model: string;
  // ...
}

// src/domain/services/car.service.ts
import { ICar } from '../entities/Car';

export class CarService {
  async getAll(): Promise<ICar[]> {
    // ...
  }
}

// src/api/controllers/car.controller.ts
import { CarService } from '../../domain/services/car.service';
```

---

## Key Takeaways

1. **export** makes code available
2. **import** brings code in
3. **default export** for main export
4. **Re-export** to organize modules

**Next**: [12-typescript-compiler.md](12-typescript-compiler.md)
