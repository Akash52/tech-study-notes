# 10 — Aggregate Functions

> **One line:** An aggregate function takes **many rows in** and gives **one value out** — the total, average, min, max, or count of a column.

---

## The idea in plain English

Regular queries return rows. Aggregate functions **collapse** a whole column down to a single summary number.

> *"What's the **average** film replacement cost?"* → one number, not 1000 rows.

The five you'll use constantly (all standard across SQL engines):

| Function | Returns |
|---|---|
| `COUNT()` | number of rows/values |
| `SUM()` | total of all values |
| `AVG()` | mean (average) |
| `MIN()` | smallest value |
| `MAX()` | largest value |

They're all function calls, so they all need **parentheses**: `MIN(replacement_cost)`.

---

## Examples (DVD Rental, `film` table)

```sql
SELECT MIN(replacement_cost) FROM film;   --> 9.99
SELECT MAX(replacement_cost) FROM film;   --> 29.99
SELECT COUNT(*)              FROM film;   --> 1000
SELECT SUM(replacement_cost) FROM film;   --> 19984.00
SELECT AVG(replacement_cost) FROM film;   --> 19.9840000000000000  😬
```

**Sanity check:** `SUM = AVG × COUNT` → `19.984 × 1000 = 19984`. Aggregates are internally consistent, which is a handy way to gut-check results.

---

## `AVG` gives too many decimals → use `ROUND`

`AVG` returns a long floating-point value. Wrap it in `ROUND(value, decimal_places)`:

```sql
SELECT ROUND(AVG(replacement_cost), 2) FROM film;   --> 19.98
```

`ROUND` takes **two arguments**: the value to round, and how many decimal places. It's just math applied to the aggregate's result — change the `2` to `3` for three places, etc.

---

## The key limitation → this is *why* GROUP BY exists

Aggregate calls live **only in the `SELECT` clause (or `HAVING`, later)** — never in `WHERE`.

And you **cannot mix an aggregate with a plain column** in `SELECT`:

```sql
-- ❌ ERROR
SELECT MAX(replacement_cost), title FROM film;
```

Why: `MAX(replacement_cost)` is **one** value, but `title` has **1000** values — SQL can't line up one number against a thousand titles. It doesn't know *which* title you mean.

What *does* work: **multiple aggregates together**, because each collapses to a single value and they line up:

```sql
-- ✅ both return one value
SELECT MIN(replacement_cost), MAX(replacement_cost) FROM film;
```

To pair an aggregate *with* a category (like "max cost **per rating**"), you need `GROUP BY` — the next lesson. This limitation is exactly the problem `GROUP BY` solves.

---

## Production notes (important)

- **Aggregates ignore NULLs (except `COUNT(*)`). ⚠️** `SUM`, `AVG`, `MIN`, `MAX` all **skip NULL** values. This matters most for `AVG`: it divides by the count of **non-NULL** values, *not* total rows. So `AVG` of `(10, 20, NULL)` is **15**, not 10. If NULL should count as zero, you must handle it: `AVG(COALESCE(col, 0))`.
- **Empty/all-NULL result → `SUM`/`AVG`/`MIN`/`MAX` return `NULL`, not 0.** `COUNT` returns `0`, but the others give `NULL` when there's nothing to aggregate. Guard totals with `COALESCE(SUM(x), 0)` when you need a number.
- **You can't use an aggregate in `WHERE`.** `WHERE amount > AVG(amount)` fails — `WHERE` runs *before* aggregation happens. Filtering on an aggregate is what **`HAVING`** is for (coming up).
- **`MIN`/`MAX` work on text and dates too**, not just numbers. `MAX(payment_date)` = most recent payment; `MIN(last_name)` = alphabetically first. Very useful.
- **`ROUND` type quirk in Postgres.** The two-argument `ROUND(value, places)` expects a `numeric` value. `AVG` on a `numeric` column returns `numeric`, so it's fine — but if you ever round a `double precision` result, you may need a cast like `ROUND(avg_col::numeric, 2)`.

---

## Challenges

All use the **DVD Rental** database.

### Challenge 1 — Warm-up (average, rounded)
What's the **average rental rate** of all films, rounded to **2 decimal places**? (Table: `film`, column `rental_rate`.)

<details>
<summary>Solution</summary>

```sql
SELECT ROUND(AVG(rental_rate), 2) FROM film;
```

**Why:** `AVG(rental_rate)` gives a long decimal; `ROUND(…, 2)` trims it to cents. This `ROUND(AVG(...), 2)` pattern is one you'll reuse constantly for readable averages.
</details>

---

### Challenge 2 — Several aggregates at once
In a **single query**, return the cheapest, most expensive, and average (rounded to 2 dp) `replacement_cost` across all films, plus the total number of films.

<details>
<summary>Solution</summary>

```sql
SELECT
    MIN(replacement_cost)          AS cheapest,
    MAX(replacement_cost)          AS most_expensive,
    ROUND(AVG(replacement_cost),2) AS avg_cost,
    COUNT(*)                       AS total_films
FROM film;
```

**Why:** Every item in the `SELECT` is an aggregate, so each collapses to one value and they sit happily in one row. (`AS` just names the columns — nicer output.) Mixing aggregates is fine; mixing an aggregate with a *plain* column is not — see Challenge 3.
</details>

---

### Challenge 3 — Spot the bug 🔎 (the GROUP BY motivator)
A teammate wants "the title of the most expensive-to-replace film" and writes:

```sql
SELECT title, MAX(replacement_cost) FROM film;
```

It errors. Why — and what's a correct way to get that title?

<details>
<summary>Solution</summary>

**Bug:** You're mixing a **plain column** (`title`, 1000 values) with an **aggregate** (`MAX(replacement_cost)`, one value). SQL can't align one number against a thousand titles, so it refuses — it doesn't know which single title goes with the max.

**Fix — sort and take the top row instead:**
```sql
SELECT title, replacement_cost
FROM   film
ORDER BY replacement_cost DESC
LIMIT  1;
```

**Why it matters:** This "aggregate + bare column" error is the exact wall that leads to `GROUP BY`. Rule of thumb: if a `SELECT` has an aggregate, **every other column must either be inside an aggregate or in a `GROUP BY`** — otherwise use the `ORDER BY … LIMIT` trick shown here.
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| Aggregates | Many rows in → one value out |
| The five | `COUNT` `SUM` `AVG` `MIN` `MAX` |
| Where allowed | `SELECT` and `HAVING` only (not `WHERE`) |
| `AVG` decimals | Wrap in `ROUND(value, places)` |
| NULLs | Ignored by all except `COUNT(*)`; `AVG` divides by non-NULLs |
| Empty set | `SUM`/`AVG`/`MIN`/`MAX` → `NULL`; `COUNT` → `0` |
| Aggregate + plain column | Errors → that's what `GROUP BY` fixes (next) |
