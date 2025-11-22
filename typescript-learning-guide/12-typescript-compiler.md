# Lesson 12: TypeScript Compiler

## 🎯 Learning Objectives
- Understand tsconfig.json
- Configure compiler options
- Use compiler flags
- Build for production

---

## tsconfig.json

```json
{
  "compilerOptions": {
    // Target JavaScript version
    "target": "ES2020",
    
    // Module system
    "module": "commonjs",
    
    // Output directory
    "outDir": "./dist",
    
    // Root directory
    "rootDir": "./src",
    
    // Enable strict type checking
    "strict": true,
    
    // ES modules interop
    "esModuleInterop": true,
    
    // Skip lib check
    "skipLibCheck": true,
    
    // Resolve JSON modules
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Compiler Commands

```bash
# Compile
tsc

# Watch mode
tsc --watch

# Specific file
tsc file.ts

# With config
tsc -p tsconfig.json
```

---

## Your Backend Config

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noEmitOnError": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

---

## Key Takeaways

1. **tsconfig.json** configures compiler
2. **tsc** compiles TypeScript
3. **strict** enables strict checks
4. **outDir** sets output directory

**Next**: [13-real-world-examples.md](13-real-world-examples.md)
