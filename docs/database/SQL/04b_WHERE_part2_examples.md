# 04b — WHERE (Part 2: Applied)

> Companion to note 04. Same operators — here we **build real queries** on the DVD Rental DB and combine `WHERE` with `COUNT`.

---

## The core workflow: build a query condition by condition

You don't write the whole filter at once. You **start broad, then tack on conditions** with `AND` / `OR`. Crucially, you write `WHERE` **once** — every extra condition just links on:

```sql
-- Start: one condition
SELECT * FROM film
WHERE rental_rate > 4;

-- Add a second (no second WHERE!)
SELECT * FROM film
WHERE rental_rate > 4
  AND replacement_cost >= 19.99;

-- Add a third
SELECT * FROM film
WHERE rental_rate > 4
  AND replacement_cost >= 19.99
  AND rating = 'R';

-- Then narrow the columns to just what you need
SELECT title FROM film
WHERE rental_rate > 4
  AND replacement_cost >= 19.99
  AND rating = 'R';
```

Notice numbers (`4`, `19.99`) need **no quotes**, but the string `'R'` does. pgAdmin color-codes these — strings, numbers, and keywords each get their own color, a quick visual sanity check.

---

## `COUNT` + `WHERE` = "how many rows match?"

Once your filter is right, wrap it in `COUNT` to get a number instead of a list. This is one of the most common real-world query shapes.

```sql
-- How many films meet all three conditions?
SELECT COUNT(*) FROM film
WHERE rental_rate > 4
  AND replacement_cost >= 19.99
  AND rating = 'R';
--> 34
```

`COUNT(*)`, `COUNT(title)`, `COUNT(film_id)` all give **34** here — you're counting matching *rows*, so the column doesn't matter (assuming no NULLs — see note 03).

---

## `OR` and `!=` in action

```sql
-- Either rating (note: each side of OR is a FULL condition)
SELECT COUNT(*) FROM film
WHERE rating = 'R' OR rating = 'PG-13';
--> 418

-- Everything EXCEPT R
SELECT * FROM film
WHERE rating != 'R';   -- returns G, PG, PG-13, NC-17 — no R
```

---

## The `OR` mistake everyone makes ⚠️

You cannot "share" the column across `OR`. This looks natural but is **wrong**:

```sql
-- ❌ ERROR / nonsense
WHERE rating = 'R' OR 'PG-13'
```

Each side of `OR` must be a complete, standalone condition:

```sql
-- ✅ correct
WHERE rating = 'R' OR rating = 'PG-13'
```

**Cleaner alternative (coming soon): `IN`.** When you're OR-ing the same column against several values, `IN` reads far better:

```sql
WHERE rating IN ('R', 'PG-13')   -- same result, less repetition
```

Keep this in your back pocket — the moment you write three or more `OR`s on one column, switch to `IN`.

---

## Quirk worth knowing: the `customer` table

The `customer` table stores "is this customer active?" **twice** — as `activebool` (a true/false boolean) and `active` (an integer 1/0). Real databases accumulate redundant columns like this over time. Always check *which* column the app actually uses before filtering on it, or you may filter on the stale one.

---

## Challenges

All use the **DVD Rental** database.

### Challenge 1 — Find a specific person
A customer walks in and says their name is **Nancy Thomas**. Return all columns for that customer. (Table: `customer`; columns `first_name`, `last_name`.)

<details>
<summary>Solution</summary>

```sql
SELECT * FROM customer
WHERE first_name = 'Nancy'
  AND last_name = 'Thomas';
```

**Why:** Two string conditions, both must match → `AND`. Filtering on first name alone could return several Nancys; adding the last name pins down the one person. Single quotes on both values.
</details>

---

### Challenge 2 — Count with conditions
How many films are rated **PG** *and* have a `rental_rate` of exactly **0.99**?

<details>
<summary>Solution</summary>

```sql
SELECT COUNT(*) FROM film
WHERE rating = 'PG'
  AND rental_rate = 0.99;
```

**Why:** Build the filter (two `AND` conditions), then wrap in `COUNT(*)` because the question is "how many," not "which." String gets quotes, number doesn't. `COUNT(*)` vs `COUNT(title)` gives the same answer here.
</details>

---

### Challenge 3 — Spot the bug 🔎
A teammate wants the count of films rated **G, PG, or PG-13**. They write:

```sql
SELECT COUNT(*) FROM film
WHERE rating = 'G' OR 'PG' OR 'PG-13';
```

It errors. Why, and what are two correct ways to write it?

<details>
<summary>Solution</summary>

**Bug:** Each side of `OR` must be a **complete condition**. `'PG'` and `'PG-13'` on their own aren't conditions — there's no `rating =` in front of them. SQL can't evaluate a bare string as true/false.

**Fix 1 — repeat the column:**
```sql
SELECT COUNT(*) FROM film
WHERE rating = 'G' OR rating = 'PG' OR rating = 'PG-13';
```

**Fix 2 — use `IN` (cleaner):**
```sql
SELECT COUNT(*) FROM film
WHERE rating IN ('G', 'PG', 'PG-13');
```

**Why it matters:** this is the #1 beginner `OR` error. Rule: **every side of `AND`/`OR` is its own full condition.** Once you're listing 3+ values for one column, prefer `IN`.
</details>

---

## 30-second recap

| Pattern | Takeaway |
|---|---|
| Chaining | Write `WHERE` once; link more with `AND`/`OR` |
| Numbers vs strings | Numbers unquoted, strings single-quoted |
| `COUNT(*)` + `WHERE` | "How many rows match these conditions?" |
| `OR` rule | Each side is a **full** condition (`rating = 'R' OR rating = 'PG-13'`) |
| `IN` | Cleaner than many `OR`s on one column (coming up) |
| `!=` | Returns everything *except* the value |
