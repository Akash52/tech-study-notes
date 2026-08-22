# 11 — GROUP BY (Part 1: Theory)

> **One line:** `GROUP BY` splits your table into groups by category, then runs an aggregate on **each group** — turning "one number for the whole table" into "one number **per category**."

---

## The idea in plain English: split → apply → combine

Aggregates alone give one number for everything. `GROUP BY` gives one number *per bucket*.

Imagine a table of sales — a `category` column (companies A, B, C) and a `sales` value:

```
A 10 |  A 5  →  group A: [10, 5]  →  SUM = 15
B 2  |  B 4  →  group B: [2, 4]   →  SUM = 6
C 8  |  C 10 →  group C: [8, 10]  →  SUM = 18
```

`GROUP BY category` does exactly that: **splits** rows by category, **applies** the aggregate to each group, **combines** into one row per category. Swap `SUM` for `AVG`, `COUNT`, `MIN`, `MAX` — any aggregate works the same way.

---

## Choosing the category column — it can be numeric!

You group by a **categorical** column (non-continuous, or treated that way). Key insight: **"categorical" doesn't mean "non-numeric."**

- Cabin class `1, 2, 3` → numeric but categorical.
- DVD rental `rental_rate` (`0.99, 1.99, 2.99…`) → looks continuous, but you can treat each distinct rate as its own category.

If a column has a small set of repeating values, it's a candidate to group by — regardless of its data type.

---

## Syntax & placement

```sql
SELECT category_col, AGG(data_col)
FROM   table
GROUP BY category_col;
```

`GROUP BY` goes **right after `FROM`**, or **right after `WHERE`** if you're filtering first:

```sql
SELECT category_col, SUM(data_col)
FROM   table
WHERE  category_col != 'A'     -- filter rows BEFORE grouping
GROUP BY category_col;
```

---

## ⭐ THE GOLDEN RULE (this is where everyone trips)

> **In the `SELECT`, every column must either be (a) inside an aggregate function, or (b) listed in the `GROUP BY`.**

```sql
-- ✅ category is grouped; sales is aggregated
SELECT category, SUM(sales) FROM t GROUP BY category;

-- ❌ ERROR: 'name' is neither grouped nor aggregated
SELECT category, name, SUM(sales) FROM t GROUP BY category;
```

**Why:** each output row represents a *whole group*. `SUM(sales)` collapses the group to one value — fine. But a bare `name` column has *many* different values within the group, and SQL can't pick one to show. So it demands you either aggregate it or group by it.

Quick test before running any `GROUP BY` query: look at each `SELECT` column and ask *"is this aggregated, or is it in the GROUP BY?"* If a column is neither → that's your error.

---

## ⭐ Execution order — the master key to this whole section

SQL runs clauses in this order (**not** top-to-bottom as written):

> **FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY**

This single fact explains every rule in this section:

- **`WHERE` can't reference an aggregate** (e.g. `WHERE SUM(sales) > 100` fails) — `WHERE` runs *before* `GROUP BY`, so the sums don't exist yet. Filtering on aggregates is `HAVING`'s job (later).
- **`ORDER BY` *can* use an aggregate** — it runs *after* `SELECT`, once the sums are computed.
- **Grouping happens before the columns are chosen**, which is why the Golden Rule exists.

Internalize this order and GROUP BY / HAVING stop feeling like arbitrary rules.

---

## Grouping by multiple columns

List several columns to group by their **combination** — order matters, like `ORDER BY`:

```sql
SELECT company, division, SUM(sales)
FROM   finance
WHERE  division IN ('Marketing', 'Transport')   -- filter first
GROUP BY company, division;                      -- sum per division, per company
```

`company` and `division` are grouped (so they're allowed bare); `sales` is aggregated (so it's allowed without being grouped). Result: total sales for each `(company, division)` pair.

---

## Sorting by an aggregate — reference the whole function

To order by an aggregate, write the **full function**, not the bare column:

```sql
SELECT company, SUM(sales)
FROM   table
GROUP BY company
ORDER BY SUM(sales) DESC   -- ✅ full function, not "ORDER BY sales"
LIMIT 5;                   -- top 5 companies by total sales
```

Whatever you sort by should appear in the `SELECT`. `GROUP BY` + `ORDER BY aggregate` + `LIMIT` = **"top N categories"** — an extremely common real-world query.

---

## Production notes

- **Databases differ on strictness. ⚠️** Postgres, SQL Server, and Oracle **enforce** the Golden Rule. Older **MySQL** was lax — it let you select non-grouped columns and returned an *arbitrary* value from the group (silently wrong!). Modern MySQL fixed this with `ONLY_FULL_GROUP_BY`. Don't rely on the loose behavior; it produces bad data.
- **NULLs form their own group.** If the grouped column has NULLs, all NULL rows collapse into a single "NULL" group. Expect an extra group in your output when nulls are present.
- **You can group by an expression, not just a column.** `GROUP BY DATE(payment_date)` groups timestamps by calendar day — very handy for "per day / per month" summaries (more when you hit date functions).
- **`GROUP BY 1, 2` (by position) works** like `ORDER BY`, but it's fragile — reordering the `SELECT` silently changes the grouping. Prefer naming columns.
- **`WHERE` filters rows, `HAVING` filters groups.** Keep row-level conditions in `WHERE` (it runs first and is cheaper); save aggregate conditions for `HAVING`.

---

## Challenges

All use the **DVD Rental** database.

### Challenge 1 — Warm-up (count per group)
How many films are there **for each rating**? Return `rating` and the count. (Table: `film`.)

<details>
<summary>Solution</summary>

```sql
SELECT rating, COUNT(*)
FROM   film
GROUP BY rating;
```

**Why:** `rating` is the category (grouped), `COUNT(*)` is the aggregate per group. One row per rating, each showing how many films have it. `rating` is allowed bare *because* it's in the `GROUP BY` — the Golden Rule satisfied.
</details>

---

### Challenge 2 — Top N groups
Find the **5 customers who have spent the most** overall. Return `customer_id` and their total spend, biggest first. (Table: `payment`, column `amount`.)

<details>
<summary>Solution</summary>

```sql
SELECT customer_id, SUM(amount) AS total_spent
FROM   payment
GROUP BY customer_id
ORDER BY SUM(amount) DESC
LIMIT  5;
```

**Why:** Group by `customer_id`, `SUM(amount)` per customer, then sort by the **full aggregate** `SUM(amount) DESC` and keep the top 5. This `GROUP BY → ORDER BY agg → LIMIT` combo is the canonical "top spenders / best sellers" query. Note `ORDER BY total_spent DESC` also works in Postgres since the alias is defined — but `ORDER BY SUM(amount)` always works everywhere.
</details>

---

### Challenge 3 — Spot the bug 🔎 (Golden Rule)
A teammate wants total payments per customer, but also throws `staff_id` into the `SELECT`:

```sql
SELECT customer_id, staff_id, SUM(amount)
FROM   payment
GROUP BY customer_id;
```

It errors. Why, and what are the two valid ways to fix it?

<details>
<summary>Solution</summary>

**Bug:** `staff_id` is in the `SELECT` but it's **neither aggregated nor in the `GROUP BY`**. A single customer's payments can involve different staff, so SQL can't pick one `staff_id` for that customer's row — Golden Rule violation.

**Fix 1 — drop it** (if you only care about per-customer totals):
```sql
SELECT customer_id, SUM(amount)
FROM   payment
GROUP BY customer_id;
```

**Fix 2 — add it to the grouping** (if you want per-customer *and* per-staff totals):
```sql
SELECT customer_id, staff_id, SUM(amount)
FROM   payment
GROUP BY customer_id, staff_id;
```

**Why it matters:** the two fixes answer *different questions* — "total per customer" vs "total per customer-staff pair." The error is SQL forcing you to be explicit about which one you mean. (In old MySQL this would've silently returned a random `staff_id` — a real bug.)
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| `GROUP BY` | Split into groups, aggregate each → one row per group |
| Category column | Can be numeric; just needs repeating values |
| Placement | After `FROM`, or after `WHERE` |
| **Golden Rule** | Every `SELECT` column: aggregated **or** in `GROUP BY` |
| **Execution order** | `FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY` |
| `WHERE` vs aggregate | `WHERE` runs first → can't see aggregates (use `HAVING`) |
| Sort by aggregate | `ORDER BY SUM(col)` (full function), often + `LIMIT` |
| Multiple columns | Groups by the combination, order matters |
