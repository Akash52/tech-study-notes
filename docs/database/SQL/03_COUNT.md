# 03 — COUNT

> **One line:** `COUNT` tells you **how many rows** come back. It's a function, so it always needs parentheses.

---

## The idea in plain English

`COUNT` answers *"how many?"* Instead of scrolling to the bottom of a table to read the row number, you ask the database to count for you — essential once tables have thousands or millions of rows.

```sql
SELECT COUNT(*) FROM payment;   --> 14596   (instantly, no scrolling)
```

By itself `COUNT` is basic. Its real power shows up **combined with `DISTINCT`** — "how many *unique* values?"

---

## Syntax

```sql
SELECT COUNT(*)         FROM table_name;   -- count all rows
SELECT COUNT(column)    FROM table_name;   -- see NULL note below!
SELECT COUNT(DISTINCT column) FROM table_name;  -- count unique values
```

`COUNT` **must** have parentheses — it's a function acting on something. `SELECT COUNT name` fails; `SELECT COUNT(name)` works.

---

## `COUNT(*)` vs `COUNT(column)` — read this carefully ⚠️

The course says these always return the same number. **That's only true when the column has no NULLs** — which happens to be the case in the toy DVD Rental tables, but is *rarely* true in real production data.

The real rule:

| Form | What it counts |
|---|---|
| `COUNT(*)` | **All rows**, including rows with NULLs |
| `COUNT(column)` | Only rows where **that column is NOT NULL** |
| `COUNT(DISTINCT column)` | Unique **non-NULL** values |

So in production, `COUNT(*)` and `COUNT(some_column)` will **differ** whenever that column contains NULLs — and that difference is often exactly the thing you want to measure (see Challenge 3). Internalize this now; it's one of the most common SQL bugs there is.

**Practical takeaway:** use `COUNT(*)` when you mean "how many rows." Use `COUNT(column)` only when you specifically mean "how many rows *have a value* here."

---

## COUNT + DISTINCT

Question: *"How many unique payment amounts exist?"*

```sql
SELECT COUNT(DISTINCT amount) FROM payment;   --> 19
```

**What happens, in order:**
1. `DISTINCT amount` collapses duplicates → the set of unique amounts.
2. `COUNT` counts what's left → `19`.

It tells you *how many* unique values, **not what they are** (that's `SELECT DISTINCT amount` on its own).

**Why the parentheses are required here:** without them, `SELECT COUNT DISTINCT amount` makes Postgres think you're counting a column literally named `distinct`, which doesn't exist. The parens say: *do `DISTINCT amount` first, then count the result.* You can add a second, cosmetic pair for readability — `COUNT(DISTINCT(amount))` — but it's optional.

---

## Production notes

- **Naming the column can be a memory aid.** `COUNT(amount)` vs `COUNT(*)` gives the same number on a no-NULL column, but seeing `amount` later reminds you *what question you were answering*. (Just don't forget the NULL behavior above.)
- **`COUNT(1)` is not faster than `COUNT(*)`.** Common myth. In Postgres they're identical — use `COUNT(*)`.
- **Counting huge tables isn't instant.** `COUNT(*)` may scan the whole table. On very large tables people sometimes use estimates (`reltuples` from `pg_class`) when an approximate number is fine.
- **`COUNT` never returns NULL.** If nothing matches, it returns `0` (unlike `SUM`, which returns NULL on no rows). Handy — you can trust a number always comes back.

---

## Challenges

All use the **DVD Rental** database.

### Challenge 1 — Warm-up
How many films are in the `film` table?

<details>
<summary>Solution</summary>

```sql
SELECT COUNT(*) FROM film;
```

**Why:** "How many rows" → `COUNT(*)`. No need to scroll or guess. This is the go-to for a quick size check on any table.
</details>

---

### Challenge 2 — Count the unique values
How many **different rental rates** does the `film` table use? (Not *what* they are — *how many*.)

<details>
<summary>Solution</summary>

```sql
SELECT COUNT(DISTINCT rental_rate) FROM film;
```

**Why:** "How many *unique*" = count the result of distinct. `DISTINCT rental_rate` finds the unique prices, then `COUNT` counts them. Remember the mandatory parentheses so Postgres runs `DISTINCT` before `COUNT`.
</details>

---

### Challenge 3 — The NULL gotcha 🔎 (production-real)
In the `rental` table, `return_date` is **NULL** for films that haven't been returned yet. A colleague runs both of these and is confused they don't match:

```sql
SELECT COUNT(*) FROM rental;             -- e.g. 16044
SELECT COUNT(return_date) FROM rental;   -- e.g. 15861
```

Why are they different, and what does the difference (183) represent?

<details>
<summary>Solution</summary>

They differ **because `return_date` contains NULLs**:
- `COUNT(*)` = every rental ever made (16044).
- `COUNT(return_date)` = only rentals **with a return date**, i.e. returned films (15861), because `COUNT(column)` skips NULLs.

The difference, **183**, is the number of rentals **still out** (never returned → NULL return date). That's a genuinely useful business number — and you got it by *subtracting two counts*.

```sql
-- currently-out rentals, directly:
SELECT COUNT(*) - COUNT(return_date) AS still_out FROM rental;
```

**Why it matters:** this is *the* everyday `COUNT` bug. Whenever `COUNT(*)` and `COUNT(col)` disagree, NULLs are the reason — and often that gap is the answer you're actually looking for.
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| `COUNT(*)` | Counts **all** rows |
| `COUNT(column)` | Counts **non-NULL** rows only |
| Difference | Shows up whenever the column has NULLs |
| `COUNT(DISTINCT col)` | How many unique (non-NULL) values |
| Parentheses | Always required; needed to order `DISTINCT` before `COUNT` |
| Returns | Always a number, `0` if no rows (never NULL) |
