# MongoDB Aggregation Pipeline - Lesson 5

## 📖 What is Aggregation?

**Aggregation** = Processing data through a pipeline of stages to transform and analyze it.

Think of it like a factory assembly line:
```
Raw Data → Stage 1 → Stage 2 → Stage 3 → Final Result
```

## 🔧 Basic Aggregation

```javascript
db.collection.aggregate([
  { stage1 },
  { stage2 },
  { stage3 }
])
```

## 📊 Common Stages

### 1. $match (Filter)

Like `find()`, filters documents.

```javascript
// Find active cars in Delhi
db.cars.aggregate([
  {
    $match: {
      status: "active",
      city: "Delhi"
    }
  }
]);

// Always put $match early for performance!
```

### 2. $group (Aggregate)

Group documents and calculate values.

```javascript
// Count cars by brand
db.cars.aggregate([
  {
    $group: {
      _id: "$brand",              // Group by brand
      count: { $sum: 1 },         // Count documents
      avgPrice: { $avg: "$price" },  // Average price
      minPrice: { $min: "$price" },  // Minimum
      maxPrice: { $max: "$price" }   // Maximum
    }
  }
]);

// Result:
[
  { _id: "Maruti", count: 150, avgPrice: 650000, minPrice: 400000, maxPrice: 900000 },
  { _id: "Honda", count: 80, avgPrice: 1200000, minPrice: 800000, maxPrice: 1600000 }
]
```

**Accumulator Operators:**
- `$sum`: Count or sum
- `$avg`: Average
- `$min`/`$max`: Min/max values
- `$first`/`$last`: First/last value
- `$push`: Create array of values
- `$addToSet`: Create array of unique values

```javascript
// Advanced grouping
db.cars.aggregate([
  {
    $group: {
      _id: {
        brand: "$brand",
        city: "$city"
      },
      count: { $sum: 1 },
      cars: { $push: "$model" },          // Array of models
      uniqueYears: { $addToSet: "$year" }  // Unique years
    }
  }
]);
```

### 3. $project (Select/Transform)

Select fields and create new ones.

```javascript
// Select specific fields
db.cars.aggregate([
  {
    $project: {
      brand: 1,
      model: 1,
      price: 1,
      _id: 0  // Exclude _id
    }
  }
]);

// Create computed fields
db.cars.aggregate([
  {
    $project: {
      brand: 1,
      model: 1,
      price: 1,
      year: 1,
      age: { $subtract: [2024, "$year"] },  // Calculated field
      priceInLakhs: { $divide: ["$price", 100000] }
    }
  }
]);

// String operations
db.cars.aggregate([
  {
    $project: {
      fullName: {
        $concat: ["$brand", " ", "$model", " ", { $toString: "$year" }]
      },
      brandUpper: { $toUpper: "$brand" }
    }
  }
]);
```

### 4. $sort (Order)

```javascript
// Sort by price descending
db.cars.aggregate([
  { $sort: { price: -1 } }  // -1 = descending, 1 = ascending
]);

// Multiple sort fields
db.cars.aggregate([
  { $sort: { brand: 1, price: -1 } }
]);
```

### 5. $limit and $skip (Pagination)

```javascript
// Top 10 most expensive cars
db.cars.aggregate([
  { $match: { status: "active" } },
  { $sort: { price: -1 } },
  { $limit: 10 }
]);

// Pagination (page 2, 20 per page)
db.cars.aggregate([
  { $match: { status: "active" } },
  { $sort: { createdAt: -1 } },
  { $skip: 20 },
  { $limit: 20 }
]);
```

### 6. $lookup (JOIN)

Join with another collection.

```javascript
// Get cars with dealer info
db.cars.aggregate([
  {
    $lookup: {
      from: "dealers",              // Collection to join
      localField: "dealerId",       // Field in cars
      foreignField: "_id",          // Field in dealers
      as: "dealerInfo"              // Output array name
    }
  }
]);

// Result:
{
  _id: ObjectId("..."),
  brand: "Maruti",
  model: "Swift",
  dealerId: ObjectId("dealer123"),
  dealerInfo: [  // Array (even if one match)
    {
      _id: ObjectId("dealer123"),
      businessName: "AutoWorld",
      city: "Delhi"
    }
  ]
}

// Unwrap array with $unwind
db.cars.aggregate([
  {
    $lookup: {
      from: "dealers",
      localField: "dealerId",
      foreignField: "_id",
      as: "dealer"
    }
  },
  { $unwind: "$dealer" }  // Convert array to object
]);
```

### 7. $unwind (Flatten Arrays)

```javascript
// Document with array
{
  _id: 1,
  brand: "Maruti",
  features: ["ABS", "Airbags", "AC"]
}

// Unwind creates document per array element
db.cars.aggregate([
  { $unwind: "$features" }
]);

// Result:
[
  { _id: 1, brand: "Maruti", features: "ABS" },
  { _id: 1, brand: "Maruti", features: "Airbags" },
  { _id: 1, brand: "Maruti", features: "AC" }
]

// Use case: Count most common features
db.cars.aggregate([
  { $unwind: "$features" },
  {
    $group: {
      _id: "$features",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]);
```

### 8. $addFields (Add Fields)

Add new fields without removing existing ones.

```javascript
db.cars.aggregate([
  {
    $addFields: {
      age: { $subtract: [2024, "$year"] },
      priceCategory: {
        $cond: {
          if: { $lt: ["$price", 500000] },
          then: "Budget",
          else: "Premium"
        }
      }
    }
  }
]);
```

## 🎯 Real-World Examples

### Example 1: Dealer Dashboard

```javascript
db.cars.aggregate([
  // Filter by dealer
  { $match: { dealerId: ObjectId("dealer123") } },

  // Group by status
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 },
      totalValue: { $sum: "$price" },
      avgPrice: { $avg: "$price" },
      cars: {
        $push: {
          brand: "$brand",
          model: "$model",
          price: "$price"
        }
      }
    }
  },

  // Sort by count
  { $sort: { count: -1 } }
]);

// Result:
[
  {
    _id: "active",
    count: 25,
    totalValue: 20000000,
    avgPrice: 800000,
    cars: [{ brand: "Maruti", model: "Swift", price: 550000 }, ...]
  },
  {
    _id: "sold",
    count: 10,
    totalValue: 9500000,
    avgPrice: 950000,
    cars: [...]
  }
]
```

### Example 2: Monthly Sales Report

```javascript
db.cars.aggregate([
  // Only sold cars
  { $match: { status: "sold" } },

  // Add month field
  {
    $addFields: {
      month: { $month: "$soldAt" },
      year: { $year: "$soldAt" }
    }
  },

  // Group by month
  {
    $group: {
      _id: { year: "$year", month: "$month" },
      totalSales: { $sum: 1 },
      revenue: { $sum: "$price" },
      avgPrice: { $avg: "$price" }
    }
  },

  // Sort by date
  { $sort: { "_id.year": -1, "_id.month": -1 } },

  // Format output
  {
    $project: {
      _id: 0,
      year: "$_id.year",
      month: "$_id.month",
      totalSales: 1,
      revenue: 1,
      avgPrice: { $round: ["$avgPrice", 2] }
    }
  }
]);
```

### Example 3: Top Dealers by Revenue

```javascript
db.cars.aggregate([
  // Only sold cars
  { $match: { status: "sold" } },

  // Join with dealers
  {
    $lookup: {
      from: "dealers",
      localField: "dealerId",
      foreignField: "_id",
      as: "dealer"
    }
  },
  { $unwind: "$dealer" },

  // Group by dealer
  {
    $group: {
      _id: "$dealerId",
      dealerName: { $first: "$dealer.businessName" },
      dealerCity: { $first: "$dealer.city" },
      totalSold: { $sum: 1 },
      revenue: { $sum: "$price" }
    }
  },

  // Sort by revenue
  { $sort: { revenue: -1 } },

  // Top 10
  { $limit: 10 },

  // Clean output
  {
    $project: {
      _id: 0,
      dealerName: 1,
      city: "$dealerCity",
      totalSold: 1,
      revenue: 1,
      avgSalePrice: { $divide: ["$revenue", "$totalSold"] }
    }
  }
]);
```

### Example 4: Car Search with Filters

```javascript
// Function to build search pipeline
function buildSearchPipeline(filters) {
  const pipeline = [];

  // Match stage
  const matchStage = { status: "active" };
  if (filters.city) matchStage.city = filters.city;
  if (filters.brand) matchStage.brand = filters.brand;
  if (filters.minPrice || filters.maxPrice) {
    matchStage.price = {};
    if (filters.minPrice) matchStage.price.$gte = filters.minPrice;
    if (filters.maxPrice) matchStage.price.$lte = filters.maxPrice;
  }
  pipeline.push({ $match: matchStage });

  // Join with dealer
  pipeline.push({
    $lookup: {
      from: "dealers",
      localField: "dealerId",
      foreignField: "_id",
      as: "dealer"
    }
  });
  pipeline.push({ $unwind: "$dealer" });

  // Add computed fields
  pipeline.push({
    $addFields: {
      age: { $subtract: [2024, "$year"] },
      dealerRating: "$dealer.rating.average"
    }
  });

  // Sort
  if (filters.sort === "price_asc") {
    pipeline.push({ $sort: { price: 1 } });
  } else if (filters.sort === "price_desc") {
    pipeline.push({ $sort: { price: -1 } });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  pipeline.push({ $skip: (page - 1) * limit });
  pipeline.push({ $limit: limit });

  // Project final fields
  pipeline.push({
    $project: {
      brand: 1,
      model: 1,
      year: 1,
      price: 1,
      kmsDriven: 1,
      fuelType: 1,
      transmission: 1,
      images: { $slice: ["$images", 3] },  // First 3 images
      dealerName: "$dealer.businessName",
      dealerCity: "$dealer.city",
      dealerRating: 1,
      age: 1
    }
  });

  return pipeline;
}

// Usage
const filters = {
  city: "Delhi",
  minPrice: 500000,
  maxPrice: 1000000,
  brand: "Maruti",
  sort: "price_asc",
  page: 1,
  limit: 20
};

const results = await db.cars.aggregate(buildSearchPipeline(filters));
```

## 🔍 Advanced Stages

### $facet (Multiple Pipelines)

Run multiple aggregations in parallel.

```javascript
db.cars.aggregate([
  { $match: { status: "active" } },
  {
    $facet: {
      // Pipeline 1: Get cars
      cars: [
        { $sort: { price: -1 } },
        { $limit: 20 }
      ],

      // Pipeline 2: Get stats
      stats: [
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" }
          }
        }
      ],

      // Pipeline 3: Brand distribution
      brands: [
        { $group: { _id: "$brand", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]
    }
  }
]);

// Result:
{
  cars: [ /* array of cars */ ],
  stats: [{ total: 150, avgPrice: 750000, ... }],
  brands: [{ _id: "Maruti", count: 50 }, ...]
}
```

### $bucket (Histogram)

Group into ranges.

```javascript
// Price distribution
db.cars.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 500000, 1000000, 1500000, 2000000],
      default: "2000000+",
      output: {
        count: { $sum: 1 },
        cars: { $push: "$model" }
      }
    }
  }
]);

// Result:
[
  { _id: 0, count: 30, cars: ["Alto", "Kwid", ...] },
  { _id: 500000, count: 80, cars: ["Swift", "i20", ...] },
  { _id: 1000000, count: 50, cars: ["City", "Creta", ...] },
  { _id: 1500000, count: 20, cars: ["Fortuner", ...] }
]
```

## ✅ Best Practices

1. **$match early** - Filter data ASAP
2. **$project late** - Keep all fields until end
3. **Create indexes** for $match and $sort
4. **Use $lookup sparingly** - Can be slow
5. **Limit result size** - Use $limit
6. **Test with explain()** - Check performance

```javascript
db.cars.aggregate([...]).explain("executionStats")
```

## 🏃 Exercises

```javascript
// 1. Count cars by city and brand
db.cars.aggregate([
  {
    $group: {
      _id: { city: "$city", brand: "$brand" },
      count: { $sum: 1 }
    }
  }
]);

// 2. Average price by year
db.cars.aggregate([
  {
    $group: {
      _id: "$year",
      avgPrice: { $avg: "$price" }
    }
  },
  { $sort: { _id: -1 } }
]);

// 3. Top 5 most saved cars
db.cars.aggregate([
  { $match: { status: "active" } },
  { $sort: { saves: -1 } },
  { $limit: 5 },
  {
    $project: {
      brand: 1,
      model: 1,
      price: 1,
      saves: 1
    }
  }
]);
```

## ✅ Key Takeaways

1. **Aggregation** = Data processing pipeline
2. **$match** filters documents (use early!)
3. **$group** aggregates data
4. **$project** selects/transforms fields
5. **$lookup** joins collections
6. **$unwind** flattens arrays
7. **Order matters** - optimize pipeline order

---

**Master aggregation to unlock MongoDB's analytical power! 📊**
