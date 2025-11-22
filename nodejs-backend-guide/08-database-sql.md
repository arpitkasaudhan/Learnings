# Lesson 08: SQL Databases & Sequelize

## Setup

```bash
npm install pg sequelize  # PostgreSQL
# OR
npm install mysql2 sequelize  # MySQL
```

## Connect

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',  // or 'mysql'
  logging: false
});
```

## Define Model

```javascript
const { DataTypes } = require('sequelize');

const Car = sequelize.define('Car', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand: { type: DataTypes.STRING, allowNull: false },
  model: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('active', 'sold'),
    defaultValue: 'active'
  }
});

module.exports = Car;
```

## CRUD Operations

```javascript
// Create
const car = await Car.create({
  brand: 'Honda',
  model: 'City',
  year: 2023,
  price: 1500000
});

// Read
const cars = await Car.findAll({ where: { brand: 'Honda' } });
const car = await Car.findByPk(id);

// Update
await car.update({ price: 1400000 });

// Delete
await car.destroy();
```

## Relationships

```javascript
// One-to-Many
User.hasMany(Car, { foreignKey: 'ownerId' });
Car.belongsTo(User, { foreignKey: 'ownerId' });

// Many-to-Many
User.belongsToMany(Car, { through: 'Favorites' });
Car.belongsToMany(User, { through: 'Favorites' });

// Query with associations
const user = await User.findByPk(id, {
  include: [{ model: Car }]
});
```

**Next Lesson**: [09-authentication-jwt.md](09-authentication-jwt.md)
