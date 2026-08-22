# 06 — LIMIT

> **One line:** `LIMIT` caps how many rows come back. Paired with `ORDER BY`, it's how you get the **"top N"** of anything.

---

## The idea in plain English

Sometimes you don't want every row — you want *a few*. Either to **peek** at a table's shape, or to answer a **"top N"** question ("the 5 most recent payments"). `LIMIT` says: *"after everything else is done, just give me this many rows."*

```sql
SELECT * FROM payment LIMIT 1;   -- peek: what does one row look like?
```

`LIMIT 1` (or `5`) is a fast, harmless way to inspect a table's columns, data types, and sample values without pulling the whole thing.

---

## Where it goes — clause order matters

`LIMIT` is the **very last** clause and the **last thing executed**. The full pecking order:

> **FROM → WHERE → ORDER BY → LIMIT**

```sql
SELECT columns
FROM   table
WHERE  condition        -- 1. filter rows
ORDER BY column DESC    -- 2. sort them
LIMIT  5;               -- 3. keep the first 5
```

⚠️ **The order is required, not optional.** `LIMIT` must come *after* `WHERE` and `ORDER BY`. Writing `LIMIT` before `WHERE` is a **syntax error** — even though you might *type* it in a different order while editing, the final query has to follow this sequence.

---

## The killer combo: `ORDER BY` + `LIMIT` = "top N"

This is the whole point. Sort first, then keep the top slice.

```sql
-- The 5 most recent payments
SELECT * FROM payment
ORDER BY payment_date DESC
LIMIT 5;
```

Add a `WHERE` to make it realistic:

```sql
-- The 5 most recent payments that were actually non-zero
SELECT * FROM payment
WHERE amount != 0
ORDER BY payment_date DESC
LIMIT 5;
```

With just `SELECT`, `WHERE`, `ORDER BY`, and `LIMIT`, you can already answer real business questions. Direction is yours: `DESC` + `LIMIT` = biggest/newest; `ASC` + `LIMIT` = smallest/oldest.

---

## Production notes (important) ⚠️

- **`LIMIT` without `ORDER BY` is non-deterministic.** `SELECT * FROM payment LIMIT 5` gives you *some* 5 rows — whichever the database finds first — **not** a meaningful "top 5," and the set can change between runs. **A "top N" query is only valid if it has an `ORDER BY`.** This is the #1 LIMIT mistake.
- **`LIMIT 1` is your table-inspection reflex.** Before running `SELECT *` on an *unknown or huge* table, add `LIMIT`. It prevents accidentally pulling millions of rows and hammering the server. Great habit.
- **Pagination uses `LIMIT` + `OFFSET`.** `OFFSET` skips rows: `LIMIT 10 OFFSET 20` returns rows 21–30 ("page 3"). Caveat: large `OFFSET`s are **slow** because the DB still scans and discards all the skipped rows — production systems often use keyset/"seek" pagination instead for deep pages.
- **Dialect differences.** `LIMIT` is Postgres/MySQL/SQLite. **SQL Server** uses `SELECT TOP 5 ...`. The **SQL standard** (and Oracle 12c+) is `FETCH FIRST 5 ROWS ONLY`. Know this if your production code has to run on multiple engines.
- **Ties aren't handled.** `LIMIT 5` cuts off exactly at 5 even if rows 5 and 6 have identical sort values — which one you get is arbitrary. `FETCH FIRST 5 ROWS WITH TIES` keeps all tied rows if you need that.

---

## Challenges

All use the **DVD Rental** database.

### Challenge 1 — Peek at a table
You've never seen the `customer` table. Pull just **3 rows** to inspect its columns and sample data.

<details>
<summary>Solution</summary>

```sql
SELECT * FROM customer LIMIT 3;
```

**Why:** Pure inspection — you want the shape, not a "top" anything, so no `ORDER BY` needed. `LIMIT` keeps it cheap. This is the reflex before querying any unfamiliar table.
</details>

---

### Challenge 2 — Top N with a filter (all three clauses)
Return the **5 most expensive-to-replace films that are rated `R`**. Show `title` and `replacement_cost`. (Table: `film`.)

<details>
<summary>Solution</summary>

```sql
SELECT title, replacement_cost
FROM   film
WHERE  rating = 'R'
ORDER BY replacement_cost DESC
LIMIT  5;
```

**Why:** Reads top-to-bottom in execution order — filter to R films (`WHERE`), sort most-expensive first (`ORDER BY ... DESC`), keep the top 5 (`LIMIT`). This is the canonical "top N within a category" pattern you'll use constantly.
</details>

---

### Challenge 3 — Spot the bug 🔎
A teammate says this gives "the 3 highest payments":

```sql
SELECT * FROM payment
LIMIT 3;
```

Why is that wrong, and what did they mean to write?

<details>
<summary>Solution</summary>

**Bug:** There's **no `ORDER BY`**, so this returns *three arbitrary* payments — whatever the database happens to read first — not the highest. Run it again and you might get different rows. `LIMIT` alone means "any N," never "top N."

**Fix — sort before limiting:**
```sql
SELECT * FROM payment
ORDER BY amount DESC
LIMIT 3;
```

**Why it matters:** `LIMIT` without `ORDER BY` produces results that *look* right but aren't reproducible or ranked. **Every "top/bottom N" query needs an `ORDER BY`.** No exceptions.
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| `LIMIT n` | Return at most `n` rows |
| Position | Last clause; runs last |
| Clause order | `WHERE → ORDER BY → LIMIT` (required) |
| Top N | `ORDER BY ... DESC/ASC` **+** `LIMIT` |
| No `ORDER BY` | `LIMIT` gives *arbitrary* rows, not ranked |
| Peeking | `LIMIT 1`/`LIMIT 5` to inspect unknown tables |
| Pagination | `LIMIT` + `OFFSET` (slow on deep pages) |
| Dialects | SQL Server `TOP`; standard `FETCH FIRST` |
