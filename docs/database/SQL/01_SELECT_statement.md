# 01 — The SELECT Statement

> **One line:** `SELECT` is how you *read* data out of a table. It's the most-used statement in all of SQL.

---

## The idea in plain English

A database holds **tables**. A table is just a spreadsheet: **columns** (fields) across the top, **rows** (records) going down.

`SELECT` says: *"Give me these columns, from this table."* That's it. Everything fancy in SQL is built on top of this.

**How the database actually reads it (backwards):**
1. First it figures out **which table** you want (`FROM`).
2. Then it grabs **which columns** you asked for (`SELECT`).

You already told it the *database* when you opened the query tool — so it only needs the table and columns.

---

## Syntax

```sql
-- One column
SELECT column_name FROM table_name;

-- Multiple columns (separate with commas)
SELECT col_1, col_2, col_3 FROM table_name;

-- All columns (the asterisk = "everything")
SELECT * FROM table_name;
```

Two habits that don't change behavior but make life easier:
- **Capitalize keywords** (`SELECT`, `FROM`). SQL runs fine in lowercase, but caps make queries readable and tools highlight them.
- **End with a semicolon** `;`. It marks where a query ends. Optional for a single query, but essential once you run several at once.

---

## Examples (DVD Rental DB)

```sql
-- Every column in the actor table (the whole thing back)
SELECT * FROM actor;

-- Just one column
SELECT first_name FROM actor;

-- Two columns
SELECT first_name, last_name FROM actor;

-- Column ORDER is up to you — output follows what you type
SELECT last_name, first_name FROM actor;   -- last name shows first
```

Rows stay linked across columns — pick `last_name, first_name` and each last name still lines up with its own first name (Penelope Guiness, Nick Wahlberg, …).

---

## Production notes (the stuff that matters at work)

- **Avoid `SELECT *` in real code.** It pulls *every* column, which:
  - increases traffic between the DB server and your app → **slower** responses,
  - breaks silently if someone adds/renames/reorders columns later,
  - hides your actual intent from whoever reads the code next.
  - ✅ Use it only for quick exploration ("what's in this table?"). In apps, **name the columns you need**.
- **Columns you don't ask for cost nothing to leave out** — narrow queries are cheaper and clearer.
- **Naming columns explicitly = stability.** Your query returns the same shape even if the table grows new columns.
- The order of columns in `SELECT` controls the **output order** — handy for reports without touching the data.

**Finding your way around in pgAdmin:** `Servers → PostgreSQL → your DB → Schemas → public → Tables`. That tree shows every table and its columns. (The DVD Rental DB has **15 tables**.) Later you'll ask the database this *programmatically* instead of clicking — but the tree is fine for now.

---

## Challenges

Try each before peeking. All use the **DVD Rental** database.

### Challenge 1 — Warm-up
Return **only the email addresses** of every customer. (Table: `customer`, column: `email`.)

<details>
<summary>Solution</summary>

```sql
SELECT email FROM customer;
```

**Why:** You want one field, so name just that column. No reason to drag back the whole `customer` row when you only need emails — this is exactly the "don't use `*`" habit in action.
</details>

---

### Challenge 2 — Order matters
From the `customer` table, show **last name first, then first name**.

<details>
<summary>Solution</summary>

```sql
SELECT last_name, first_name FROM customer;
```

**Why:** The output columns appear in the order you list them. Swapping the two names in the `SELECT` swaps the columns in the result — the data itself doesn't move, only how it's presented.
</details>

---

### Challenge 3 — Spot the smell 🔎
A teammate ships this in the app's login code:

```sql
SELECT * FROM customer;
```

They only need each customer's `email` and `store_id`. What's wrong, and what should it be?

<details>
<summary>Solution</summary>

**Problem:** `SELECT *` pulls all columns for every customer — more data over the wire, slower queries, and it silently changes shape if the table gains columns later. It also hides what the code actually needs.

**Fix:**
```sql
SELECT email, store_id FROM customer;
```

**Why:** Ask for exactly what you use. Faster, cheaper, and self-documenting — anyone reading it instantly knows what this query depends on.
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| `SELECT` | Reads columns from a table |
| `FROM` | Names the table (DB reads this first) |
| Commas | Separate multiple columns |
| `*` | All columns — great for exploring, avoid in app code |
| Column order | You control output order in the `SELECT` |
| `;` and CAPS | Optional but standard — do them for readability |
