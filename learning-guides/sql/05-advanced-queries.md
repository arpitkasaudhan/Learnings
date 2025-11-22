# SQL Advanced Queries - Lesson 5

## 📖 Introduction

Advanced SQL queries allow you to solve complex problems with elegant solutions. This lesson covers subqueries, CTEs, window functions, and more.

## 🔍 Subqueries

A **subquery** is a query nested inside another query.

### Types of Subqueries

#### 1. Scalar Subquery (Returns single value)

```sql
-- Find cars priced above average
SELECT brand, model, price
FROM cars
WHERE price > (
    SELECT AVG(price) FROM cars
);
```

#### 2. Row Subquery (Returns single row)

```sql
-- Find car with highest price
SELECT brand, model, price
FROM cars
WHERE price = (
    SELECT MAX(price) FROM cars
);
```

#### 3. Column Subquery (Returns single column)

```sql
-- Find cars from dealers in Delhi
SELECT brand, model, price
FROM cars
WHERE dealer_id IN (
    SELECT dealer_id
    FROM dealers
    WHERE city = 'Delhi'
);
```

#### 4. Table Subquery (Returns multiple rows and columns)

```sql
-- Find dealers with above-average car count
SELECT d.business_name, car_counts.total
FROM dealers d
INNER JOIN (
    SELECT dealer_id, COUNT(*) as total
    FROM cars
    GROUP BY dealer_id
) AS car_counts ON d.dealer_id = car_counts.dealer_id
WHERE car_counts.total > (
    SELECT AVG(total) FROM (
        SELECT COUNT(*) as total
        FROM cars
        GROUP BY dealer_id
    ) AS counts
);
```

### WHERE Clause Subqueries

```sql
-- Using IN
SELECT * FROM cars
WHERE brand IN ('Maruti', 'Honda', 'Hyundai');

-- Using NOT IN
SELECT * FROM users
WHERE user_id NOT IN (
    SELECT customer_id FROM leads
);

-- Using EXISTS (efficient for checking existence)
SELECT d.business_name
FROM dealers d
WHERE EXISTS (
    SELECT 1 FROM cars c
    WHERE c.dealer_id = d.dealer_id
    AND c.status = 'sold'
);

-- Using NOT EXISTS
SELECT d.business_name
FROM dealers d
WHERE NOT EXISTS (
    SELECT 1 FROM cars c
    WHERE c.dealer_id = d.dealer_id
);

-- Using ANY/SOME
SELECT * FROM cars
WHERE price > ANY (
    SELECT price FROM cars WHERE brand = 'Maruti'
);

-- Using ALL
SELECT * FROM cars
WHERE price > ALL (
    SELECT price FROM cars WHERE brand = 'Maruti'
);
```

### SELECT Clause Subqueries

```sql
-- Calculate derived columns
SELECT
    d.business_name,
    d.city,
    (SELECT COUNT(*) FROM cars c WHERE c.dealer_id = d.dealer_id) AS total_cars,
    (SELECT AVG(price) FROM cars c WHERE c.dealer_id = d.dealer_id) AS avg_price,
    (SELECT COUNT(*) FROM leads l
     JOIN cars c ON l.car_id = c.car_id
     WHERE c.dealer_id = d.dealer_id) AS total_leads
FROM dealers d;
```

### Correlated Subqueries

A subquery that references columns from the outer query.

```sql
-- Find cars more expensive than average for their brand
SELECT c1.brand, c1.model, c1.price
FROM cars c1
WHERE c1.price > (
    SELECT AVG(c2.price)
    FROM cars c2
    WHERE c2.brand = c1.brand  -- References outer query!
);
```

**More Examples:**

```sql
-- Dealers with above-average car prices
SELECT d.business_name
FROM dealers d
WHERE (
    SELECT AVG(c.price)
    FROM cars c
    WHERE c.dealer_id = d.dealer_id
) > (
    SELECT AVG(price) FROM cars
);

-- Latest lead for each car
SELECT c.brand, c.model,
    (SELECT MAX(l.created_at)
     FROM leads l
     WHERE l.car_id = c.car_id) AS latest_lead
FROM cars c;
```

## 📝 Common Table Expressions (CTEs)

**CTEs** make complex queries more readable using `WITH` clause.

### Basic CTE

```sql
-- Without CTE (hard to read)
SELECT *
FROM (
    SELECT brand, AVG(price) as avg_price
    FROM cars
    GROUP BY brand
) AS brand_avg
WHERE avg_price > 800000;

-- With CTE (much clearer!)
WITH brand_avg AS (
    SELECT brand, AVG(price) as avg_price
    FROM cars
    GROUP BY brand
)
SELECT *
FROM brand_avg
WHERE avg_price > 800000;
```

### Multiple CTEs

```sql
-- Calculate dealer performance metrics
WITH
active_cars AS (
    SELECT dealer_id, COUNT(*) as active_count
    FROM cars
    WHERE status = 'active'
    GROUP BY dealer_id
),
sold_cars AS (
    SELECT dealer_id, COUNT(*) as sold_count
    FROM cars
    WHERE status = 'sold'
    GROUP BY dealer_id
),
lead_stats AS (
    SELECT c.dealer_id, COUNT(l.lead_id) as total_leads
    FROM cars c
    LEFT JOIN leads l ON c.car_id = l.car_id
    GROUP BY c.dealer_id
)
SELECT
    d.business_name,
    COALESCE(ac.active_count, 0) as active,
    COALESCE(sc.sold_count, 0) as sold,
    COALESCE(ls.total_leads, 0) as leads
FROM dealers d
LEFT JOIN active_cars ac ON d.dealer_id = ac.dealer_id
LEFT JOIN sold_cars sc ON d.dealer_id = sc.dealer_id
LEFT JOIN lead_stats ls ON d.dealer_id = ls.dealer_id;
```

### Recursive CTEs

For hierarchical data (trees, org charts).

```sql
-- Referral tree
WITH RECURSIVE referral_tree AS (
    -- Base case: Top-level users (no referrer)
    SELECT user_id, name, referred_by, 1 as level
    FROM users
    WHERE referred_by IS NULL

    UNION ALL

    -- Recursive case: Users referred by previous level
    SELECT u.user_id, u.name, u.referred_by, rt.level + 1
    FROM users u
    INNER JOIN referral_tree rt ON u.referred_by = rt.user_id
)
SELECT * FROM referral_tree
ORDER BY level, user_id;
```

**Result:**
```
user_id | name    | referred_by | level
--------|---------|-------------|------
1       | Alice   | NULL        | 1
2       | Bob     | 1           | 2
3       | Charlie | 1           | 2
4       | David   | 2           | 3
```

### VahanHelp CTE Examples

```sql
-- Dealer performance dashboard
WITH
dealer_stats AS (
    SELECT
        dealer_id,
        COUNT(*) as total_cars,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_cars,
        COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_cars,
        SUM(CASE WHEN status = 'sold' THEN price ELSE 0 END) as revenue
    FROM cars
    GROUP BY dealer_id
),
lead_conversion AS (
    SELECT
        c.dealer_id,
        COUNT(l.lead_id) as total_leads,
        COUNT(CASE WHEN l.status = 'converted' THEN 1 END) as converted_leads
    FROM cars c
    LEFT JOIN leads l ON c.car_id = l.car_id
    GROUP BY c.dealer_id
)
SELECT
    d.business_name,
    d.city,
    ds.total_cars,
    ds.active_cars,
    ds.sold_cars,
    ds.revenue,
    lc.total_leads,
    lc.converted_leads,
    CASE
        WHEN lc.total_leads > 0 THEN
            ROUND(lc.converted_leads * 100.0 / lc.total_leads, 2)
        ELSE 0
    END as conversion_rate
FROM dealers d
LEFT JOIN dealer_stats ds ON d.dealer_id = ds.dealer_id
LEFT JOIN lead_conversion lc ON d.dealer_id = lc.dealer_id;
```

## 🪟 Window Functions

**Window functions** perform calculations across rows related to the current row.

**Syntax:**
```sql
function_name() OVER (
    PARTITION BY column
    ORDER BY column
    ROWS/RANGE frame_clause
)
```

### ROW_NUMBER()

Assign unique numbers to rows.

```sql
-- Rank cars by price within each brand
SELECT
    brand,
    model,
    year,
    price,
    ROW_NUMBER() OVER (PARTITION BY brand ORDER BY price DESC) as rank_in_brand
FROM cars
WHERE status = 'active';
```

**Result:**
```
brand   | model  | year | price   | rank_in_brand
--------|--------|------|---------|---------------
Maruti  | Dzire  | 2022 | 800000  | 1
Maruti  | Swift  | 2021 | 600000  | 2
Maruti  | Alto   | 2020 | 400000  | 3
Honda   | City   | 2023 | 1400000 | 1
Honda   | Amaze  | 2022 | 900000  | 2
```

**Use with WHERE:**
```sql
-- Get top 3 most expensive cars per brand
WITH ranked_cars AS (
    SELECT
        brand, model, price,
        ROW_NUMBER() OVER (PARTITION BY brand ORDER BY price DESC) as rn
    FROM cars
)
SELECT brand, model, price
FROM ranked_cars
WHERE rn <= 3;
```

### RANK() and DENSE_RANK()

```sql
SELECT
    brand,
    model,
    price,
    ROW_NUMBER() OVER (ORDER BY price DESC) as row_num,
    RANK() OVER (ORDER BY price DESC) as rank,
    DENSE_RANK() OVER (ORDER BY price DESC) as dense_rank
FROM cars
WHERE brand = 'Maruti';
```

**Result:**
```
model  | price   | row_num | rank | dense_rank
-------|---------|---------|------|------------
Dzire  | 800000  | 1       | 1    | 1
Swift  | 800000  | 2       | 1    | 1  ← Same rank
Baleno | 750000  | 3       | 3    | 2  ← rank skips, dense_rank doesn't
Alto   | 400000  | 4       | 4    | 3
```

**Differences:**
- **ROW_NUMBER**: Always unique (1, 2, 3, 4...)
- **RANK**: Ties get same rank, skips next (1, 1, 3, 4...)
- **DENSE_RANK**: Ties get same rank, no skip (1, 1, 2, 3...)

### Aggregate Window Functions

```sql
-- Running totals and moving averages
SELECT
    DATE(created_at) as date,
    COUNT(*) as daily_leads,
    SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as cumulative_leads,
    AVG(COUNT(*)) OVER (
        ORDER BY DATE(created_at)
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as avg_7day
FROM leads
GROUP BY DATE(created_at)
ORDER BY date;
```

**Result:**
```
date       | daily_leads | cumulative_leads | avg_7day
-----------|-------------|------------------|----------
2024-01-01 | 5           | 5                | 5.00
2024-01-02 | 8           | 13               | 6.50
2024-01-03 | 6           | 19               | 6.33
2024-01-04 | 10          | 29               | 7.25
...
2024-01-10 | 12          | 85               | 8.43  ← 7-day average
```

### LAG() and LEAD()

Access previous or next row values.

```sql
-- Compare each month's leads to previous month
WITH monthly_leads AS (
    SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as total_leads
    FROM leads
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
)
SELECT
    month,
    total_leads,
    LAG(total_leads) OVER (ORDER BY month) as prev_month,
    total_leads - LAG(total_leads) OVER (ORDER BY month) as change,
    ROUND(
        (total_leads - LAG(total_leads) OVER (ORDER BY month)) * 100.0 /
        NULLIF(LAG(total_leads) OVER (ORDER BY month), 0),
        2
    ) as pct_change
FROM monthly_leads;
```

**Result:**
```
month   | total_leads | prev_month | change | pct_change
--------|-------------|------------|--------|------------
2024-01 | 150         | NULL       | NULL   | NULL
2024-02 | 180         | 150        | 30     | 20.00
2024-03 | 220         | 180        | 40     | 22.22
```

### FIRST_VALUE() and LAST_VALUE()

```sql
-- Compare each car price to cheapest and most expensive in its brand
SELECT
    brand,
    model,
    price,
    FIRST_VALUE(price) OVER (
        PARTITION BY brand ORDER BY price
    ) as cheapest_in_brand,
    LAST_VALUE(price) OVER (
        PARTITION BY brand ORDER BY price
        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as most_expensive_in_brand,
    price - FIRST_VALUE(price) OVER (
        PARTITION BY brand ORDER BY price
    ) as premium_over_cheapest
FROM cars
WHERE status = 'active';
```

### Window Frame Clauses

```sql
-- Different frame specifications
SELECT
    created_at,
    amount,
    -- All rows in partition
    SUM(amount) OVER (ORDER BY created_at
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as total,
    -- From start to current row
    SUM(amount) OVER (ORDER BY created_at
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as running_total,
    -- Previous 3, current, next 3 (7 rows total)
    AVG(amount) OVER (ORDER BY created_at
        ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING
    ) as centered_avg,
    -- Previous 6 days + today
    SUM(amount) OVER (ORDER BY created_at
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as last_7_days
FROM transactions
ORDER BY created_at;
```

## 🔄 Set Operations

Combine results from multiple queries.

### UNION

Combines results, removes duplicates.

```sql
-- All cities where we have dealers or active cars
SELECT city FROM dealers
UNION
SELECT city FROM cars WHERE status = 'active';
```

### UNION ALL

Combines results, keeps duplicates (faster).

```sql
-- All activities (keeping duplicates)
SELECT 'car_view' as event_type, car_id, user_id, created_at
FROM car_views
UNION ALL
SELECT 'car_save' as event_type, car_id, user_id, saved_at
FROM saved_cars
UNION ALL
SELECT 'lead_created' as event_type, car_id, customer_id, created_at
FROM leads
ORDER BY created_at DESC;
```

### INTERSECT

Returns only rows present in both queries.

```sql
-- Cities with both dealers and active cars
SELECT city FROM dealers
INTERSECT
SELECT city FROM cars WHERE status = 'active';
```

### EXCEPT (MINUS in Oracle)

Returns rows in first query but not in second.

```sql
-- Cities with dealers but no active cars
SELECT city FROM dealers
EXCEPT
SELECT city FROM cars WHERE status = 'active';
```

## 🎯 CASE Expressions

Conditional logic in queries.

### Simple CASE

```sql
SELECT
    brand,
    model,
    price,
    CASE brand
        WHEN 'Maruti' THEN 'Budget Friendly'
        WHEN 'Honda' THEN 'Reliable'
        WHEN 'Mercedes' THEN 'Luxury'
        ELSE 'Other'
    END as category
FROM cars;
```

### Searched CASE

```sql
SELECT
    brand,
    model,
    price,
    kms_driven,
    CASE
        WHEN price < 500000 THEN 'Budget'
        WHEN price < 1000000 THEN 'Mid-Range'
        WHEN price < 2000000 THEN 'Premium'
        ELSE 'Luxury'
    END as price_segment,
    CASE
        WHEN kms_driven < 10000 THEN 'Almost New'
        WHEN kms_driven < 50000 THEN 'Good Condition'
        WHEN kms_driven < 100000 THEN 'Used'
        ELSE 'High Mileage'
    END as condition_rating
FROM cars;
```

### CASE in Aggregations

```sql
-- Pivot-like query
SELECT
    brand,
    COUNT(*) as total_cars,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
    COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold,
    COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive,
    SUM(CASE WHEN status = 'sold' THEN price ELSE 0 END) as total_revenue
FROM cars
GROUP BY brand;
```

## 🏃 Practical Exercises

### Exercise 1: Complex Dashboard Query

```sql
-- Dealer analytics dashboard
WITH
monthly_stats AS (
    SELECT
        dealer_id,
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as cars_listed,
        COUNT(CASE WHEN status = 'sold' THEN 1 END) as cars_sold,
        SUM(CASE WHEN status = 'sold' THEN price ELSE 0 END) as revenue
    FROM cars
    WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
    GROUP BY dealer_id, DATE_FORMAT(created_at, '%Y-%m')
),
ranked_months AS (
    SELECT
        dealer_id,
        month,
        revenue,
        LAG(revenue) OVER (PARTITION BY dealer_id ORDER BY month) as prev_month_revenue,
        RANK() OVER (PARTITION BY dealer_id ORDER BY revenue DESC) as best_month_rank
    FROM monthly_stats
)
SELECT
    d.business_name,
    rm.month,
    rm.revenue,
    rm.prev_month_revenue,
    rm.revenue - rm.prev_month_revenue as revenue_change,
    CASE WHEN rm.best_month_rank = 1 THEN 'YES' ELSE 'NO' END as is_best_month
FROM dealers d
INNER JOIN ranked_months rm ON d.dealer_id = rm.dealer_id
ORDER BY d.business_name, rm.month;
```

### Exercise 2: User Engagement Analysis

```sql
-- Find users who viewed cars but didn't save any
SELECT u.user_id, u.name, u.phone
FROM users u
WHERE EXISTS (
    SELECT 1 FROM car_views cv WHERE cv.user_id = u.user_id
)
AND NOT EXISTS (
    SELECT 1 FROM saved_cars sc WHERE sc.user_id = u.user_id
);

-- Or using LEFT JOIN
SELECT DISTINCT u.user_id, u.name, u.phone
FROM users u
INNER JOIN car_views cv ON u.user_id = cv.user_id
LEFT JOIN saved_cars sc ON u.user_id = sc.user_id
WHERE sc.user_id IS NULL;
```

### Exercise 3: Advanced Filtering

```sql
-- Cars with price within 10% of brand average
WITH brand_avg AS (
    SELECT brand, AVG(price) as avg_price
    FROM cars
    WHERE status = 'active'
    GROUP BY brand
)
SELECT c.brand, c.model, c.price, ba.avg_price
FROM cars c
INNER JOIN brand_avg ba ON c.brand = ba.brand
WHERE c.price BETWEEN ba.avg_price * 0.9 AND ba.avg_price * 1.1
  AND c.status = 'active';
```

## ✅ Key Takeaways

1. **Subqueries**: Queries within queries - use for filtering, calculations
2. **CTEs**: Make complex queries readable with `WITH` clause
3. **Window Functions**: Calculations across related rows without GROUP BY
4. **Set Operations**: Combine results from multiple queries (UNION, INTERSECT, EXCEPT)
5. **CASE**: Conditional logic in SELECT, WHERE, ORDER BY
6. **Performance**: CTEs often more readable, but sometimes slower than subqueries

## 🚀 Next Lesson

In [Lesson 6: Indexes & Performance](./06-indexes-performance.md), we'll learn:
- How indexes work
- Types of indexes
- When to create indexes
- Query optimization
- EXPLAIN and query analysis

---

**Master these advanced queries to become a SQL expert! 🎯**
