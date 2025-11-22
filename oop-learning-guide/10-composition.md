# Lesson 10: Composition over Inheritance

## What is Composition?

**Composition**: Build complex objects by combining simpler objects.

**Principle**: "Has-A" relationship instead of "Is-A".

---

## Composition vs Inheritance

### Inheritance (Is-A)
```typescript
class Car extends Vehicle {
  // Car IS-A Vehicle
}
```

### Composition (Has-A)
```typescript
class Car {
  private engine: Engine;  // Car HAS-A Engine

  constructor(engine: Engine) {
    this.engine = engine;
  }
}
```

---

## VahanHelp Example

```typescript
// Components
class Engine {
  constructor(public type: string, public horsepower: number) {}

  start(): void {
    console.log(`${this.type} engine started`);
  }
}

class GPS {
  getCurrentLocation(): string {
    return "Current location";
  }

  navigateTo(destination: string): void {
    console.log(`Navigating to ${destination}`);
  }
}

class MusicSystem {
  play(song: string): void {
    console.log(`Playing: ${song}`);
  }
}

// Car using composition
class Car {
  private engine: Engine;
  private gps?: GPS;
  private musicSystem?: MusicSystem;

  constructor(
    public brand: string,
    public model: string,
    engine: Engine
  ) {
    this.engine = engine;
  }

  addGPS(gps: GPS): void {
    this.gps = gps;
  }

  addMusicSystem(system: MusicSystem): void {
    this.musicSystem = system;
  }

  start(): void {
    this.engine.start();
  }

  navigate(destination: string): void {
    if (this.gps) {
      this.gps.navigateTo(destination);
    } else {
      console.log("GPS not available");
    }
  }

  playMusic(song: string): void {
    if (this.musicSystem) {
      this.musicSystem.play(song);
    } else {
      console.log("Music system not available");
    }
  }
}

// Usage
let engine = new Engine("Petrol", 120);
let car = new Car("Honda", "City", engine);

car.start();
car.addGPS(new GPS());
car.navigate("Mumbai");
car.addMusicSystem(new MusicSystem());
car.playMusic("Song 1");
```

**Next Lesson**: [11-static-members.md](11-static-members.md)
