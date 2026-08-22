# 02 — SELECT DISTINCT

> **One line:** `DISTINCT` strips out duplicate values so you get back only the **unique** ones in a column.

---

## The idea in plain English

A column often repeats values — the same color chosen by many people, the same release year across many films. `DISTINCT` answers one question:

> *"What are the unique values in this column?"*

Imagine a survey where **David** appears twice. `SELECT DISTINCT name` returns **David** once. Important subtlety: it does **not** tell you *why* there were two Davids — same person who changed their mind, or two different people with the same name. `DISTINCT` doesn't explain duplicates; it just collapses them.

That's why choosing the *right column* matters: "unique names" is rarely useful, but "unique **color choices**" answers a real question.

---

## Syntax

```sql
-- DISTINCT goes right after SELECT, in front of the column
SELECT DISTINCT column_name FROM table_name;

-- Parentheses are optional — purely cosmetic here
SELECT DISTINCT(column_name) FROM table_name;
```

Both run identically. Some people like the parentheses for readability. (You'll *need* a parenthesis structure later when combining `DISTINCT` with `COUNT` — but that's a future lesson.)

---

## Examples (DVD Rental DB)

```sql
-- How many unique release years are in the film table?
SELECT DISTINCT release_year FROM film;
--> 2006          (just one — every film released in 2006)

-- How many unique rental rates?
SELECT DISTINCT rental_rate FROM film;
--> 0.99, 2.99, 4.99   (three price tiers)
```

**Note on ordering:** results come back in **no guaranteed order**. Postgres returns them however is fastest, so the order can differ by machine/OS. Sorting is a separate step (`ORDER BY`, coming later).

---

## Production notes (the stuff that matters at work)

- **The multi-column trap ⚠️** — This trips up almost everyone:
  ```sql
  SELECT DISTINCT rating, rental_rate FROM film;
  ```
  This is **not** "distinct ratings and distinct rates." `DISTINCT` applies to the **whole row** — you get every unique **combination** of `(rating, rental_rate)`. And those parentheses in `DISTINCT(rating), rental_rate`? Still cosmetic — it's *still* distinct on the pair. `DISTINCT` is a keyword over the entire `SELECT` list, **not** a function scoped to one column.
- **`DISTINCT` isn't free.** To remove duplicates the database must sort or hash the results. On big tables that's real work — don't sprinkle it in "just in case." Use it when you actually need uniqueness.
- **A stray `DISTINCT` can hide a bug.** If your query returns unexpected duplicates and you slap `DISTINCT` on to "fix" it, you may be masking a bad join. Understand *why* the dupes exist first.
- **Great for exploration.** Before writing app logic, `SELECT DISTINCT some_column` is a fast way to learn a column's real range of values (all the ratings, all the statuses, etc.).

---

## Challenges

All use the **DVD Rental** database, `film` table.

### Challenge 1 — Warm-up
List every unique **rating** a film can have (the MPAA ratings like G, PG, R…). Column: `rating`.

<details>
<summary>Solution</summary>

```sql
SELECT DISTINCT rating FROM film;
```

**Why:** One column, want the unique set → `DISTINCT` on `rating`. This is the fastest way to discover a column's full range of possible values without scrolling the whole table.
</details>

---

### Challenge 2 — Real question
Your team wants to know how many different **rental durations** (in days) films can be rented for, to design pricing. Column: `rental_duration`.

<details>
<summary>Solution</summary>

```sql
SELECT DISTINCT rental_duration FROM film;
```

**Why:** You care about the distinct set of duration values, not every row. Same pattern as Challenge 1 — the skill is recognizing "how many *kinds* of X" → reach for `DISTINCT`.
</details>

---

### Challenge 3 — Spot the misconception 🔎
A teammate wants a list of the unique ratings **and** separately the unique rental rates. They write:

```sql
SELECT DISTINCT rating, rental_rate FROM film;
```

Will this give them what they want? Explain.

<details>
<summary>Solution</summary>

**No.** This returns every unique **combination** of `(rating, rental_rate)` — e.g. `(PG, 0.99)`, `(PG, 4.99)`, `(R, 0.99)`… `PG` can appear in several rows. `DISTINCT` dedupes the *whole row*, not each column on its own.

To get each column's unique values separately, run **two queries**:
```sql
SELECT DISTINCT rating FROM film;
SELECT DISTINCT rental_rate FROM film;
```

**Why it matters:** This misunderstanding produces "duplicate-looking" results that are actually correct combinations — and people waste hours confused. Remember: **`DISTINCT` = unique rows, not unique columns.**
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| `DISTINCT` | Returns unique values, drops duplicates |
| Position | Right after `SELECT`, before the column(s) |
| Parentheses | Optional & cosmetic (for now) |
| Multiple columns | Distinct on the **combination**, not each column |
| Ordering | Not guaranteed — use `ORDER BY` later |
| Cost | Requires sort/hash — not free on big tables |
