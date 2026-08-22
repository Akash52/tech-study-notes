# 07 — BETWEEN

> **One line:** `BETWEEN low AND high` matches values in a range — **inclusive** of both ends. It's shorthand you attach to a `WHERE`.

---

## The idea in plain English

`BETWEEN` is a cleaner way to write a two-sided range check:

```sql
WHERE amount BETWEEN 8 AND 9
-- is exactly the same as:
WHERE amount >= 8 AND amount <= 9
```

Both endpoints are **included** — 8 and 9 both count. So `BETWEEN 8 AND 9` catches `8.00`, `8.99`, and `9.00`.

**`NOT BETWEEN`** flips it — everything *outside* the range, and now the endpoints are **excluded**:

```sql
WHERE amount NOT BETWEEN 8 AND 9
-- is the same as:
WHERE amount < 8 OR amount > 9
```

| Operator | Endpoints | Equivalent to |
|---|---|---|
| `BETWEEN low AND high` | **inclusive** | `>= low AND <= high` |
| `NOT BETWEEN low AND high` | **exclusive** | `< low OR > high` |

If you want different inclusivity than `BETWEEN` gives, drop it and write the comparisons manually with `AND`.

---

## Syntax

```sql
-- Numbers
SELECT * FROM payment
WHERE amount BETWEEN 8 AND 9;

-- Count how many fall in the range
SELECT COUNT(*) FROM payment
WHERE amount BETWEEN 8 AND 9;     --> 439

-- Dates — must be ISO 8601 format 'YYYY-MM-DD', single-quoted
SELECT * FROM payment
WHERE payment_date BETWEEN '2007-02-01' AND '2007-02-15';
```

Dates go in **ISO 8601**: four-digit year `-` two-digit month `-` two-digit day, as a quoted string: `'2007-02-01'`.

---

## The timestamp trap ⚠️ (this one bites everyone)

When your column is a **timestamp** (date *and* time) but you compare against a plain **date**, SQL reads that date as **midnight — the very start of the day** (`00:00:00`).

So `'2007-02-14'` actually means `2007-02-14 00:00:00`. That has a nasty consequence:

```sql
-- Intent: "all payments through Feb 14th"
WHERE payment_date BETWEEN '2007-02-01' AND '2007-02-14';
--> returns NOTHING from the 14th!
```

Why: a payment at `2007-02-14 09:23:00` is **greater than** `2007-02-14 00:00:00`, so it falls *outside* the range. `BETWEEN` includes the high endpoint, but the high endpoint is only the *first instant* of the 14th — everything that happened *during* the 14th is excluded. To capture the whole 14th with `BETWEEN`, you'd have to push the high bound to `'2007-02-15'`.

**The professional fix: use a half-open range instead of `BETWEEN` for datetimes.**

```sql
-- "All of Feb 1st through Feb 14th", safely
WHERE payment_date >= '2007-02-01'
  AND payment_date <  '2007-02-15';   -- note: < next day
```

This `>= start AND < end` (a "half-open interval" `[start, end)`) is the **standard production pattern for date ranges**. It sidesteps midnight ambiguity entirely, handles any time-of-day, and doesn't care whether the column has a time component. Reach for it whenever timestamps are involved.

---

## Production notes

- **`BETWEEN` on timestamps → prefer `>= AND <`.** As above. `BETWEEN` is fine for integers and clean dates; for datetimes, half-open ranges save you.
- **Low must be ≤ high.** `BETWEEN 9 AND 8` returns **nothing** — SQL doesn't auto-swap them. If a range mysteriously returns zero rows, check you didn't flip the bounds.
- **Both endpoints inclusive** — easy to forget when you actually wanted an exclusive edge. `BETWEEN 0 AND 100` includes 0 and 100.
- **NULLs are excluded.** If the value is NULL, `BETWEEN` is neither true nor false, so those rows don't appear (same as any `WHERE`).
- **Works on text too, but be careful.** `BETWEEN 'A' AND 'M'` does an alphabetical range — rarely what you want, and results depend on collation. Usually clearer to use explicit comparisons or `IN`.

---

## Challenges

All use the **DVD Rental** database, `payment` table.

### Challenge 1 — Warm-up (numeric)
How many payments were between **$2 and $4** (inclusive)?

<details>
<summary>Solution</summary>

```sql
SELECT COUNT(*) FROM payment
WHERE amount BETWEEN 2 AND 4;
```

**Why:** A two-sided numeric range → `BETWEEN 2 AND 4`, which includes both $2.00 and $4.00. Wrap in `COUNT(*)` because the question is "how many," not "which."
</details>

---

### Challenge 2 — NOT BETWEEN
Return all payments whose `amount` is **outside** the $1–$8 range (i.e. cheaper than $1 or pricier than $8).

<details>
<summary>Solution</summary>

```sql
SELECT * FROM payment
WHERE amount NOT BETWEEN 1 AND 8;
```

**Why:** `NOT BETWEEN 1 AND 8` = `amount < 1 OR amount > 8`, and it **excludes** exactly 1 and 8. It's the clean way to express "everything except this middle band."
</details>

---

### Challenge 3 — Spot the bug 🔎 (the timestamp trap)
A teammate wants **every payment made during the first 14 days of February 2007**. They write:

```sql
SELECT COUNT(*) FROM payment
WHERE payment_date BETWEEN '2007-02-01' AND '2007-02-14';
```

They're surprised the count is far lower than expected and seems to drop the 14th entirely. What's wrong, and how should they write it?

<details>
<summary>Solution</summary>

**Bug:** `payment_date` is a **timestamp**, but `'2007-02-14'` is interpreted as `2007-02-14 00:00:00` — midnight at the *start* of the 14th. Any payment made *during* the 14th (e.g. `13:47`) is greater than that instant, so `BETWEEN` excludes it. The query effectively stops at the very beginning of the 14th.

**Fix — half-open range to the next day:**
```sql
SELECT COUNT(*) FROM payment
WHERE payment_date >= '2007-02-01'
  AND payment_date <  '2007-02-15';
```

`>= '2007-02-01' AND < '2007-02-15'` captures every timestamp from the start of the 1st up to (but not including) the start of the 15th — i.e. all of the 1st through the 14th, any time of day.

**Why it matters:** This is *the* classic date-range bug. When a column has a time component, plain `BETWEEN` silently drops the last day. Default to `>= start AND < end` for datetime ranges.
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| `BETWEEN low AND high` | Range check, **both ends inclusive** |
| Equivalent | `>= low AND <= high` |
| `NOT BETWEEN` | Outside the range, **ends exclusive** |
| Dates | ISO 8601 `'YYYY-MM-DD'`, single-quoted |
| Timestamp trap | Plain date = midnight → drops the last day |
| Datetime ranges | Prefer `>= start AND < end` (half-open) |
| Bound order | `low` must be ≤ `high`, or you get nothing |
