# 11b — GROUP BY (Part 2: Applied)

> Companion to note 11. Same rules — here we build real `GROUP BY` queries on the `payment` table and pick up the practical patterns.

---

## Read every GROUP BY with the word "per"

The single best trick for making `GROUP BY` click: insert **"per"** between the aggregate and the grouped column.

```sql
SELECT customer_id, SUM(amount)
FROM   payment
GROUP BY customer_id;
```

Read it as: *"total `amount` **per** `customer_id`."* Every group-by query becomes obvious this way — "count **per** staff," "average **per** rating," "revenue **per** day."

---

## GROUP BY with no aggregate = DISTINCT

Grouping a column by itself, with no aggregate, just returns its unique values:

```sql
SELECT customer_id FROM payment GROUP BY customer_id;
-- identical result to:
SELECT DISTINCT customer_id FROM payment;
```

Not something you'd normally do (use `DISTINCT` for clarity), but it reveals what grouping *is*: collapsing duplicate category values into one row each. The aggregate is what makes it useful.

---

## The workhorse: category + aggregate

```sql
-- Who spends the most in total?
SELECT customer_id, SUM(amount)
FROM   payment
GROUP BY customer_id
ORDER BY SUM(amount) DESC;   -- full function, not "ORDER BY amount"
```

That column isn't `amount` anymore — it's the **sum of amount per customer**, which is why you sort by `SUM(amount)`, not `amount`.

---

## `SUM` vs `COUNT` — different questions ⚠️

Swapping the aggregate changes the meaning entirely:

```sql
-- Total DOLLARS per customer
SELECT customer_id, SUM(amount)  FROM payment GROUP BY customer_id;

-- Number of TRANSACTIONS per customer
SELECT customer_id, COUNT(*)     FROM payment GROUP BY customer_id;
```

`SUM(amount)` = how much money. `COUNT(*)` = how many payments. A customer with many tiny rentals has a high **count** but maybe low **sum**; a customer with one big purchase is the reverse. In analytics this is the "revenue vs order-count" distinction — don't conflate them. (And their ratio, `SUM/COUNT`, is the average transaction size.)

---

## Grouping by multiple columns

```sql
SELECT customer_id, staff_id, SUM(amount)
FROM   payment
GROUP BY customer_id, staff_id
ORDER BY customer_id;
-- total each customer spent WITH each staff member
```

Now each row is a `(customer, staff)` pair. Both grouped columns are allowed bare; `amount` is aggregated. Reads as: *"sum of amount **per** customer **per** staff."*

**Clarification worth knowing:** for a standard `GROUP BY`, the **order of the grouped columns doesn't change the result** — `GROUP BY a, b` and `GROUP BY b, a` produce the same groups and the same numbers. Only `ORDER BY` changes how rows are *displayed*. (Column order *does* matter in advanced `ROLLUP`/`GROUPING SETS`, but that's a later topic.) Convention: list `SELECT` columns in the same order you group them, for readability.

---

## Grouping a timestamp → group by the DATE

`payment_date` is a **timestamp** (down to the sub-second). Grouping by it raw gives ~one group per row — useless. Strip it to the day first:

```sql
-- extract just the calendar day, then group
SELECT DATE(payment_date) AS day, SUM(amount)
FROM   payment
GROUP BY DATE(payment_date)
ORDER BY SUM(amount) DESC;    -- busiest revenue days first
```

`DATE(payment_date)` throws away hour/minute/second so all payments on the same day fall into one group — giving you daily totals. This is the setup for "per day / per month" reporting.

---

## Production notes

- **Never group by a near-unique column.** Grouping `payment` by `payment_id` (the primary key) makes one group per row — pointless. The grouped column should have **repeats**. Timestamps are the classic trap; always truncate them first.
- **Date-truncation is dialect-flavored.** `DATE(ts)` and `ts::date` return a *date*. `DATE_TRUNC('day', ts)` (Postgres) keeps it a *timestamp* at midnight and lets you pick granularity — `'month'`, `'year'`, `'hour'`. Other engines use `CAST(ts AS DATE)` or `DATE_FORMAT` (MySQL). Know your engine's version.
- **Grouped column with NULLs → one extra "NULL" group.** Expect it in the output.
- **`ORDER BY` an aggregate uses the full function** (`ORDER BY SUM(amount)`), or the `SELECT` alias in Postgres (`ORDER BY total`). The alias trick isn't universal — the full function always works.
- **Filtering here is still `WHERE` (row-level).** To filter on the *aggregate* (e.g. "customers who spent > $100"), you need `HAVING` — next up.

---

## Challenges

All use the **DVD Rental** database, `payment` table. (These are a step up — take your time.)

### Challenge 1 — Count per group
How many payments (transactions) did **each staff member** process? Return `staff_id` and the count.

<details>
<summary>Solution</summary>

```sql
SELECT staff_id, COUNT(*)
FROM   payment
GROUP BY staff_id;
```

**Why:** `staff_id` is the category (grouped), `COUNT(*)` counts rows **per** staff member. Reads as "number of payments per staff." Since there are only a couple of staff, you get a couple of rows.
</details>

---

### Challenge 2 — `SUM` and `COUNT` side by side
For the **top 5 customers by total spend**, show their `customer_id`, how many payments they made, *and* their total spend.

<details>
<summary>Solution</summary>

```sql
SELECT customer_id,
       COUNT(*)    AS num_payments,
       SUM(amount) AS total_spent
FROM   payment
GROUP BY customer_id
ORDER BY SUM(amount) DESC
LIMIT  5;
```

**Why:** Two aggregates on the *same* group — `COUNT(*)` for transactions, `SUM(amount)` for dollars — answering both "how many" and "how much" at once. Sort by the money aggregate and cap at 5 for the leaderboard. This side-by-side view is how you'd actually spot "big spender" vs "frequent renter."
</details>

---

### Challenge 3 — Spot the bug 🔎 (grouping a timestamp)
A teammate wants **daily revenue** and writes:

```sql
SELECT payment_date, SUM(amount)
FROM   payment
GROUP BY payment_date;
```

They get back *thousands* of rows, almost one per payment, instead of one per day. Why, and how do they fix it?

<details>
<summary>Solution</summary>

**Bug:** `payment_date` is a **timestamp** with time down to the sub-second, so nearly every payment has a *unique* value. Grouping by it creates almost one group per row — no real grouping happens.

**Fix — group by the date portion only:**
```sql
SELECT DATE(payment_date) AS day, SUM(amount)
FROM   payment
GROUP BY DATE(payment_date)
ORDER BY day;
```

`DATE(payment_date)` drops the time so all payments on the same calendar day collapse into one group → true daily totals. (Postgres alternatives: `payment_date::date` or `DATE_TRUNC('day', payment_date)`.)

**Why it matters:** grouping raw timestamps is a top real-world mistake — the query runs fine but the "grouping" is meaningless. Always truncate a datetime to the granularity you actually want (day/month/year) before grouping.
</details>

---

## 30-second recap

| Pattern | Takeaway |
|---|---|
| The "per" trick | Read `AGG(x) … GROUP BY y` as "x **per** y" |
| No aggregate | `GROUP BY col` alone = `DISTINCT col` |
| `SUM` vs `COUNT` | Total value vs number of rows — different questions |
| Multiple columns | One row per combination; order doesn't change results |
| Timestamps | Truncate with `DATE()`/`DATE_TRUNC` before grouping |
| Sort by aggregate | `ORDER BY SUM(col)` (+ `LIMIT` for top N) |
| Filter aggregate | Needs `HAVING`, not `WHERE` (next) |
