# 12 — HAVING

> **One line:** `HAVING` filters **groups after aggregation** — it's a `WHERE` for aggregate results (`SUM`, `COUNT`, `AVG`…).

---

## The idea in plain English

`WHERE` filters **individual rows**. But what if your condition is about an *aggregate* — "customers who spent more than $100 **in total**"? That total doesn't exist until *after* grouping, so `WHERE` can't see it.

`HAVING` is the answer: it runs **after** `GROUP BY` and lets you filter on the aggregated result.

> `WHERE` = filter rows **before** grouping · `HAVING` = filter groups **after** grouping

---

## Why you can't just use WHERE (execution order)

Recall the order SQL actually runs clauses:

> **FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY**

`WHERE` happens at step 2, **before** `GROUP BY` at step 3. So when `WHERE` runs, `SUM(amount)` hasn't been computed yet — you literally can't filter on it:

```sql
-- ❌ ERROR: the sum doesn't exist when WHERE runs
SELECT customer_id, SUM(amount)
FROM payment
WHERE SUM(amount) > 100     -- aggregate not allowed in WHERE
GROUP BY customer_id;
```

`HAVING` sits at step 4, **after** `GROUP BY`, so by then the sums exist and you can filter on them. This is the entire reason `HAVING` exists.

---

## Syntax

```sql
SELECT   category_col, AGG(data_col)
FROM     table
WHERE    row_condition        -- optional: filter rows first
GROUP BY category_col
HAVING   AGG(data_col) condition   -- filter groups after aggregating
ORDER BY AGG(data_col);        -- optional
```

Like `ORDER BY`, `HAVING` needs the **full aggregate function**, not the bare column:

```sql
HAVING SUM(amount) > 100     -- ✅
HAVING amount > 100          -- ❌ (that column no longer exists post-group)
```

---

## Examples (DVD Rental)

```sql
-- Customers whose TOTAL spend exceeds $100
SELECT customer_id, SUM(amount)
FROM   payment
GROUP BY customer_id
HAVING SUM(amount) > 100;

-- Stores with more than 300 customers
SELECT store_id, COUNT(*)
FROM   customer
GROUP BY store_id
HAVING COUNT(*) > 300;
```

**WHERE and HAVING together** — filter rows first, then filter groups:

```sql
-- Among customers (excluding a few IDs), those who spent over $100
SELECT customer_id, SUM(amount)
FROM   payment
WHERE  customer_id NOT IN (184, 87, 477)   -- 1. drop these rows first
GROUP BY customer_id
HAVING SUM(amount) > 100;                   -- 2. then keep big spenders
```

`COUNT(customer_id)` and `COUNT(*)` behave the same here — pick whichever reads clearer. `COUNT(customer_id)` documents intent ("count customers per store"); `COUNT(*)` is terser.

---

## Production notes (important)

- **Filter as early as possible — prefer `WHERE` over `HAVING` when you can. ⚠️** `WHERE` cuts rows *before* aggregation, so the database groups less data → faster. A row-level condition dumped into `HAVING` (e.g. `HAVING store_id = 1`) still works if the column is grouped, but it filters *after* doing all the grouping work — wasteful. **Rule: row conditions → `WHERE`; aggregate conditions → `HAVING`.**
- **You can't use a `SELECT` alias in `HAVING`.** Since `HAVING` (step 4) runs *before* `SELECT` (step 5), the alias doesn't exist yet — you must repeat the aggregate:
  ```sql
  SELECT customer_id, SUM(amount) AS total ... GROUP BY customer_id
  HAVING SUM(amount) > 100;   -- ✅ repeat it; HAVING total > 100 fails in standard SQL
  ```
- **`HAVING` can filter on an aggregate that isn't in the `SELECT`.** You don't have to display the sum to filter by it:
  ```sql
  SELECT customer_id FROM payment
  GROUP BY customer_id HAVING SUM(amount) > 100;   -- valid; sum not shown
  ```
- **`HAVING` without `GROUP BY`** treats the whole table as one group — occasionally handy (`SELECT SUM(amount) FROM payment HAVING SUM(amount) > 1000`), but uncommon.

---

## Challenges

All use the **DVD Rental** database.

### Challenge 1 — Warm-up (`HAVING` + `COUNT`)
Which ratings have **more than 200 films**? Return `rating` and the film count. (Table: `film`.)

<details>
<summary>Solution</summary>

```sql
SELECT rating, COUNT(*)
FROM   film
GROUP BY rating
HAVING COUNT(*) > 200;
```

**Why:** Group by `rating`, count films per rating, then keep only groups where the count clears 200 — a filter on the *aggregate*, so it's `HAVING`, not `WHERE`. Reads cleanly as "film count per rating, having count over 200."
</details>

---

### Challenge 2 — `WHERE` + `HAVING` together
Considering **only payments over $2**, find the customers who made **more than 20 such payments**. Show `customer_id` and that count, most first. (Table: `payment`.)

<details>
<summary>Solution</summary>

```sql
SELECT customer_id, COUNT(*) AS big_payments
FROM   payment
WHERE  amount > 2                 -- row filter: keep only >$2 payments
GROUP BY customer_id
HAVING COUNT(*) > 20              -- group filter: 20+ of them
ORDER BY COUNT(*) DESC;
```

**Why:** Two filters at two stages. `WHERE amount > 2` is *row-level* (does this single payment exceed $2?) so it runs first. `HAVING COUNT(*) > 20` is *group-level* (does this customer have 20+ such payments?) so it runs after grouping. This "narrow the rows, then threshold the groups" pattern is everywhere in real reporting.
</details>

---

### Challenge 3 — Spot the bug 🔎 (WHERE vs HAVING)
A teammate wants "customers who spent more than $150 total" and writes:

```sql
SELECT customer_id, SUM(amount)
FROM   payment
WHERE  SUM(amount) > 150
GROUP BY customer_id;
```

It errors. Why, and what's the fix? Bonus: where *would* a `customer_id NOT IN (…)` filter go?

<details>
<summary>Solution</summary>

**Bug:** `SUM(amount)` is an aggregate, but `WHERE` runs **before** `GROUP BY` — the sum doesn't exist yet, so aggregates aren't allowed in `WHERE`. Postgres rejects it.

**Fix — move the aggregate condition to `HAVING`:**
```sql
SELECT customer_id, SUM(amount)
FROM   payment
GROUP BY customer_id
HAVING SUM(amount) > 150;
```

**Bonus:** a `customer_id NOT IN (…)` filter is **row-level** (it looks at each row's `customer_id`, not an aggregate), so it belongs in `WHERE` — *before* grouping, where it's cheaper:
```sql
... WHERE customer_id NOT IN (184, 87)
GROUP BY customer_id
HAVING SUM(amount) > 150;
```

**Why it matters:** the whole skill is placing each filter at the right stage. **Is the condition about one row?** → `WHERE`. **Is it about the group's aggregate?** → `HAVING`. Getting this wrong either errors (aggregate in `WHERE`) or silently wastes performance (row filter in `HAVING`).
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| `HAVING` | Filters **groups after** aggregation |
| vs `WHERE` | `WHERE` = rows before grouping; `HAVING` = groups after |
| Why needed | Aggregates don't exist when `WHERE` runs (order) |
| Syntax | Repeat the **full aggregate** (`HAVING SUM(x) > n`) |
| No aliases | Can't use `SELECT` aliases in `HAVING` |
| Performance | Prefer `WHERE` for row conditions (filters earlier) |
| Placement test | About one row → `WHERE`; about the group → `HAVING` |
