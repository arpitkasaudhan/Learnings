# Lesson 13: Real-World Examples from This Codebase

This lesson shows you REAL TypeScript code from the VahanHelp backend you're working on!

## Example 1: User Model with Interface

**File:** `src/infrastructure/database/mongodb/models/User.model.ts`

```typescript
import { Schema, model, Document } from 'mongoose';

// Define the interface for User document
export interface IUser extends Document {
  phone: string;
  email?: string;
  name?: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  refreshToken?: string;
}

// Create the schema
const userSchema = new Schema<IUser>({
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  email: { 
    type: String, 
    sparse: true, 
    index: true 
  },
  name: String,
  role: { 
    type: String, 
    required: true 
  },
  avatar: String,
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  refreshToken: String,
}, { 
  timestamps: true 
});

// Export the model
export default model<IUser>('User', userSchema);
```

**TypeScript Features Used:**
- ✅ Interface extending Document
- ✅ Optional properties (`email?`, `name?`)
- ✅ Generic types (`Schema<IUser>`, `model<IUser>`)
- ✅ Type safety for database model

---

## Example 2: Authentication Service with Async/Await

**File:** `src/domain/services/auth.service.ts`

```typescript
import { IUser } from '../entities/User';
import UserModel from '../../infrastructure/database/mongodb/models/User.model';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import SMSService from '../../infrastructure/external-apis/sms.service';
import { NotFoundError, ValidationError } from '../../utils/errors';

export class AuthService {
  /**
   * Send OTP to phone number
   */
  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Save to database with expiry
      await OTPModel.create({
        phone,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });
      
      // Send via SMS
      await SMSService.sendOTP(phone, otp);
      
      return { success: true, message: 'OTP sent successfully' };
    } catch (error: any) {
      throw new ValidationError('Failed to send OTP');
    }
  }

  /**
   * Verify OTP and return user with tokens
   */
  async verifyOTP(
    phone: string, 
    otp: string
  ): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }> {
    // Find OTP
    const otpRecord = await OTPModel.findOne({ 
      phone, 
      otp, 
      isUsed: false 
    });
    
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new ValidationError('Invalid or expired OTP');
    }
    
    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();
    
    // Find or create user
    let user = await UserModel.findOne({ phone });
    if (!user) {
      user = await UserModel.create({
        phone,
        role: 'customer',
        isVerified: true,
      });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken({ 
      userId: user._id, 
      role: user.role 
    });
    const refreshToken = generateRefreshToken({ 
      userId: user._id 
    });
    
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();
    
    return { user, accessToken, refreshToken };
  }
}

export default new AuthService();
```

**TypeScript Features Used:**
- ✅ Class with async methods
- ✅ Promise return types with generics
- ✅ Object return types (explicit structure)
- ✅ Error handling with custom error classes
- ✅ Type imports from other modules

---

## Example 3: Controller with Express Types

**File:** `src/api/controllers/auth.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import AuthService from '../../domain/services/auth.service';
import { HTTP_STATUS } from '../../config/constants';

export class AuthController {
  /**
   * Send OTP
   * POST /api/v1/auth/send-otp
   */
  async sendOTP(
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    try {
      const { phone } = req.body;
      
      const result = await AuthService.sendOTP(phone);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify OTP
   * POST /api/v1/auth/verify-otp
   */
  async verifyOTP(
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    try {
      const { phone, otp } = req.body;
      
      const result = await AuthService.verifyOTP(phone, otp);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
```

**TypeScript Features Used:**
- ✅ Imported types from Express (`Request`, `Response`, `NextFunction`)
- ✅ `Promise<void>` for async functions that don't return values
- ✅ Try-catch error handling
- ✅ Destructuring with type inference

---

## Example 4: Utility Functions with Generics

**File:** `src/utils/helpers.ts`

```typescript
/**
 * Calculate pagination values
 */
export function calculatePagination(
  page: number, 
  limit: number
): { skip: number; limit: number } {
  const skip = (page - 1) * limit;
  return { skip, limit };
}

/**
 * Get pagination metadata
 */
export function getPaginationMeta(
  page: number,
  limit: number,
  total: number
): {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    totalPages,
    totalItems: total,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Format vehicle registration number
 */
export function formatVehicleNumber(number: string): string {
  return number.toUpperCase().replace(/\s/g, '');
}

/**
 * Pick specific properties from object
 */
export function pick<T, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}
```

**TypeScript Features Used:**
- ✅ Explicit return type objects
- ✅ Generics (`<T, K extends keyof T>`)
- ✅ Utility types (`Pick<T, K>`)
- ✅ Type constraints (`K extends keyof T`)

---

## Example 5: Custom Error Classes

**File:** `src/utils/errors.ts`

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(401, message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
```

**TypeScript Features Used:**
- ✅ Class inheritance (extends Error, extends AppError)
- ✅ Public properties in constructor
- ✅ Default parameter values
- ✅ Constructor overloading pattern

---

## Example 6: Configuration with Type Safety

**File:** `src/config/environment.ts`

```typescript
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  apiVersion: string;
  jwt: {
    secret: string;
    refreshSecret: string;
    accessExpiration: string;
    refreshExpiration: string;
  };
  database: {
    uri: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    s3Bucket: string;
    region: string;
  };
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8080', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vahanhelp',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    s3Bucket: process.env.AWS_S3_BUCKET || 'vahanhelp-images',
    region: process.env.AWS_REGION || 'ap-south-1',
  },
};
```

**TypeScript Features Used:**
- ✅ Interface for configuration structure
- ✅ Type assertion for environment variables
- ✅ Optional properties (`password?`)
- ✅ Nested object types
- ✅ Default values with ||

---

## Key Patterns You See Throughout the Codebase

### 1. Service Pattern
```typescript
export class ServiceName {
  async methodName(param: Type): Promise<ReturnType> {
    // Business logic
    return result;
  }
}

export default new ServiceName();
```

### 2. Controller Pattern
```typescript
export class ControllerName {
  async methodName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await Service.method();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
```

### 3. Model Pattern
```typescript
interface IModel extends Document {
  property: Type;
}

const schema = new Schema<IModel>({ /* ... */ });

export default model<IModel>('ModelName', schema);
```

### 4. Error Pattern
```typescript
if (!condition) {
  throw new CustomError('Error message');
}
```

### 5. Response Pattern
```typescript
res.status(STATUS_CODE).json({
  success: boolean,
  data?: any,
  message?: string,
  error?: string
});
```

---

## How Types Help in This Codebase

### 1. Preventing Bugs
```typescript
// TypeScript catches this before running
const user = await UserModel.findById(userId);
user.emaill = "test@example.com";  // ❌ Typo caught! Should be 'email'
```

### 2. Better Refactoring
```typescript
// Change interface
interface IUser {
  phone: string;
  phoneNumber: string;  // Renamed from 'phone'
}

// TypeScript shows all places that need updating
```

### 3. Documentation
```typescript
// Types document what functions expect
async verifyOTP(
  phone: string,    // Clear: needs phone string
  otp: string       // Clear: needs OTP string
): Promise<{        // Clear: returns user and tokens
  user: IUser;
  accessToken: string;
  refreshToken: string;
}> {
  // ...
}
```

### 4. IDE Support
- Autocomplete knows all properties
- Jump to definition works
- Refactoring is safe
- Errors show immediately

---

## Practice: Explore the Codebase

Open these files and study them:

1. **Start here:** `src/domain/entities/User.ts`
2. **Then:** `src/domain/services/auth.service.ts`
3. **Then:** `src/api/controllers/auth.controller.ts`
4. **Finally:** `src/utils/errors.ts`

**Look for:**
- How interfaces are used
- How async/await is typed
- How errors are handled
- How functions are typed

You're now seeing TypeScript in action in a real production codebase! 🎉
