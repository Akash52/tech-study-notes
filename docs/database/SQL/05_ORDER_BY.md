# 05 — ORDER BY

> **One line:** `ORDER BY` sorts your result rows — alphabetically for text, numerically for numbers — ascending or descending.

---

## The idea in plain English

By default the database returns rows in whatever order is **fastest**, which can differ between machines/runs. If you want a *guaranteed* order, you must ask for it with `ORDER BY`.

> *"Give me the customers, sorted A→Z by first name."*

---

## Syntax & where it goes

```sql
SELECT columns
FROM   table
WHERE  condition          -- filter first
ORDER BY column [ASC|DESC];  -- sort last
```

`ORDER BY` sits at the **end** of the query and is one of the **last** things SQL does — it selects and filters first, *then* sorts what's left. Mental order of operations:

> **FROM → WHERE → SELECT → ORDER BY**

- `ASC` = ascending (A→Z, low→high) — **this is the default** if you write nothing.
- `DESC` = descending (Z→A, high→low).

```sql
SELECT first_name FROM customer ORDER BY first_name;       -- A→Z (default)
SELECT first_name FROM customer ORDER BY first_name ASC;    -- same, but explicit
SELECT first_name FROM customer ORDER BY first_name DESC;   -- Z→A
```

Writing `ASC` explicitly changes nothing at runtime, but it tells the next reader *"I meant ascending on purpose."* Small clarity win.

---

## Sorting by multiple columns

Useful when the first column has **duplicates**. SQL sorts by the first column, then breaks ties with the second, and so on.

```sql
SELECT company, name, sales
FROM   table
ORDER BY company, sales;
```

Reads as: **sort by `company` first** (Apple, Google, Xerox…), then **within each company, sort by `sales`**. So Apple's people come first, and *among* Apple's people they're ordered by sales.

**Each column gets its own direction:**

```sql
SELECT store_id, first_name, last_name
FROM   customer
ORDER BY store_id DESC, first_name ASC;
-- store 2 group first; within each store, names A→Z
```

The order of columns = priority. `ORDER BY a, b` is *primary* sort `a`, *tiebreaker* `b` — **not** the same as `ORDER BY b, a`.

---

## Production notes

- **`ORDER BY` + `LIMIT` = "top N."** Sorting then keeping the first few rows is *the* way to get "top 5 highest payments," "most recent orders," etc. (`LIMIT` is the next lesson.)
- **Sorting is expensive.** On large tables, `ORDER BY` forces a sort of the result set. Sorting on an **indexed** column is much cheaper — worth knowing when queries get slow.
- **Where do NULLs go? ⚠️** In Postgres, NULLs sort **last** in `ASC` and **first** in `DESC` by default. You can control it explicitly: `ORDER BY col ASC NULLS FIRST`. **This differs across databases** (MySQL treats NULL as smallest, so NULLs come first in `ASC`) — don't assume, especially in portable code.
- **You can sort by a column you didn't `SELECT`.** `SELECT first_name, last_name ... ORDER BY store_id` is valid. It *works*, but usually you should **select the column you sort by** so the result makes visual sense to whoever reads it.
- **`ORDER BY 1, 2` (by position) exists but is fragile.** You can sort by the *position number* of a SELECT column (`ORDER BY 1` = first selected column). It's terse, but if someone reorders your `SELECT` list the sort silently changes. Prefer naming the column.
- **Text sort depends on collation.** Whether uppercase sorts before lowercase (and how accents sort) depends on the database's collation setting — occasionally surprising when "Zebra" and "apple" don't sort where you expect.

---

## Challenges

All use the **DVD Rental** database.

### Challenge 1 — Warm-up
Return `store_id`, `first_name`, `last_name` from `customer`, sorted by `first_name` **Z→A**.

<details>
<summary>Solution</summary>

```sql
SELECT store_id, first_name, last_name
FROM   customer
ORDER BY first_name DESC;
```

**Why:** One sort column, descending → `DESC`. Starts at Zachary and works back to A. We select the column we're sorting on so the ordering is obvious in the output.
</details>

---

### Challenge 2 — Multi-column, mixed direction
From the `payment` table, list `customer_id` and `amount`. Group the rows by customer (lowest `customer_id` first), and within each customer show their **biggest payments first**.

<details>
<summary>Solution</summary>

```sql
SELECT customer_id, amount
FROM   payment
ORDER BY customer_id ASC, amount DESC;
```

**Why:** `customer_id ASC` is the primary sort (groups each customer together, small IDs first). `amount DESC` is the tiebreaker *within* each customer, so their largest payment sits at the top of their block. Two columns, two independent directions — exactly what mixed-direction sorting is for.
</details>

---

### Challenge 3 — Spot the issue 🔎
A teammate wants films **grouped by rating**, and within each rating listed **alphabetically by title**. They write:

```sql
SELECT title, rating
FROM   film
ORDER BY title, rating;
```

The output isn't grouped by rating at all. Why, and what's the fix?

<details>
<summary>Solution</summary>

**Issue:** Column order in `ORDER BY` sets priority. Here `title` is the **primary** sort, so everything is sorted by title first. `rating` only breaks ties *between identical titles* — and titles are basically unique, so `rating` never does anything visible.

**Fix — put the grouping column first:**
```sql
SELECT title, rating
FROM   film
ORDER BY rating, title;
```

Now `rating` groups the rows, and `title` sorts alphabetically inside each rating group.

**Why it matters:** `ORDER BY a, b` ≠ `ORDER BY b, a`. The **first** column is the one that "groups"; later columns only settle ties. Getting the order backwards is a classic "my sort looks random" bug.
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| `ORDER BY` | Sorts result rows |
| Position | End of query; runs after SELECT/WHERE |
| `ASC` / `DESC` | Ascending (default) / descending |
| Multiple columns | Primary sort, then tiebreakers, in list order |
| Per-column direction | Each column can be `ASC` or `DESC` |
| NULLs | Postgres: last in `ASC` (differs by DB) |
| Pairs with | `LIMIT` for "top N" (next) |
