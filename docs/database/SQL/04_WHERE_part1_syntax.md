# 04 — WHERE (Part 1: Syntax)

> **One line:** `WHERE` filters rows — it keeps only the rows that meet your condition(s). `SELECT` + `WHERE` are the backbone of nearly every query you'll write.

---

## The idea in plain English

`SELECT` chooses **columns**. `WHERE` chooses **rows**. Together: *"give me these columns, but only for the rows that match this condition."*

> *"Show me the name and choice, but only where the name is David."*

`WHERE` goes **immediately after `FROM`**.

```sql
SELECT col_1, col_2
FROM   table_name
WHERE  condition;
```

---

## The operators

### Comparison operators (compare a column to a value)

| Operator | Meaning | Example |
|---|---|---|
| `=` | equal to | `WHERE price = 3` |
| `>` | greater than | `WHERE price > 3` |
| `<` | less than | `WHERE price < 3` |
| `>=` | greater than or equal | `WHERE price >= 3` |
| `<=` | less than or equal | `WHERE price <= 3` |
| `!=` or `<>` | not equal | `WHERE name != 'Sam'` |

Two ways to write "not equal": `!=` (common) and `<>` (the SQL standard). Both work in Postgres.

### Logical operators (combine conditions)

- **`AND`** — *both* must be true
- **`OR`** — *at least one* must be true
- **`NOT`** — flips a condition (true ↔ false)

These operators are **standard across every major SQL engine**, not Postgres-only.

---

## Examples

```sql
-- One string condition. Strings use SINGLE quotes.
SELECT name, choice
FROM   table
WHERE  name = 'David';

-- Filter on one column, still return others (usually what you want)
SELECT name, choice
FROM   table
WHERE  name = 'David';     -- returns name + choice for every David

-- Multiple conditions with AND (both must hold)
SELECT name, choice
FROM   table
WHERE  name = 'David' AND choice = 'Red';
```

You'll almost always `SELECT` **more columns than you filter on** — filtering on `name` but only returning `name` isn't very useful; you want `name, choice`.

---

## Gotchas that matter (read these) ⚠️

**1. Single quotes for values, double quotes mean something else.**
In Postgres, `'David'` is the **string** David. `"David"` is treated as an **identifier** (a column/table name) — so `WHERE name = "David"` errors with *column "David" does not exist*. Always single-quote text values.

**2. Equality is one `=`, not `==`.**
Coming from Python/JavaScript, you'll reach for `==`. In SQL it's a single `=`. `==` is a syntax error.

**3. String comparison is case-sensitive.**
`WHERE name = 'david'` will **not** match `David`. (Later you'll use `ILIKE` or `LOWER(name) = 'david'` for case-insensitive matching.)

**4. `AND` binds tighter than `OR`.**
This silently changes results. `A OR B AND C` is read as `A OR (B AND C)`, **not** `(A OR B) AND C`. When you mix them, **use parentheses** to say exactly what you mean — see Challenge 3.

**5. You can't compare to NULL with `=`.**
`WHERE return_date = NULL` returns nothing — NULL is never "equal" to anything, even itself. Use `IS NULL` / `IS NOT NULL` (a later lesson). Just tuck this away for now.

---

## Challenges

All use the **DVD Rental** database, `film` table (`title`, `rating`, `rental_rate`, `length`, `replacement_cost`…).

### Challenge 1 — Single condition
Return the `title` and `rental_rate` of every film rated **R**.

<details>
<summary>Solution</summary>

```sql
SELECT title, rental_rate
FROM   film
WHERE  rating = 'R';
```

**Why:** One string condition → `= 'R'` with single quotes. Note we return `title` and `rental_rate`, not just the `rating` we filtered on — that's the useful shape.
</details>

---

### Challenge 2 — Two conditions (AND)
Return the `title` of films that are rated **R** *and* cost more than **$2** to rent.

<details>
<summary>Solution</summary>

```sql
SELECT title
FROM   film
WHERE  rating = 'R' AND rental_rate > 2;
```

**Why:** Both conditions must hold, so join them with `AND`. A film rated R at $0.99 is excluded; a PG film at $4.99 is excluded. Only R-rated films above $2 survive both filters.
</details>

---

### Challenge 3 — Spot the bug 🔎 (precedence)
A teammate wants: *films that are rated **R** or **PG-13**, and cost more than **$3**.* They write:

```sql
SELECT title, rating, rental_rate
FROM   film
WHERE  rating = 'R' OR rating = 'PG-13' AND rental_rate > 3;
```

They get cheap R-rated films in the results, which they didn't expect. Why — and how do you fix it?

<details>
<summary>Solution</summary>

**Bug:** `AND` binds tighter than `OR`, so Postgres reads it as:
```sql
WHERE rating = 'R' OR (rating = 'PG-13' AND rental_rate > 3);
```
That means *every* R film (any price) **OR** PG-13 films over $3 — which is why cheap R films slipped in.

**Fix:** wrap the `OR` in parentheses so the price filter applies to both:
```sql
SELECT title, rating, rental_rate
FROM   film
WHERE  (rating = 'R' OR rating = 'PG-13') AND rental_rate > 3;
```

**Why it matters:** this returns *wrong data silently* — no error, just incorrect rows. When mixing `AND` and `OR`, always parenthesize. It's one of the most common "the query runs but the numbers are wrong" bugs.
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| `WHERE` | Filters **rows** (SELECT filters columns) |
| Position | Right after `FROM` |
| Comparison | `= > < >= <= != <>` |
| Logical | `AND` (both), `OR` (either), `NOT` (flip) |
| Strings | **Single** quotes; `"double"` = column name |
| Equality | Single `=`, never `==` |
| Precedence | `AND` before `OR` → parenthesize when mixing |
