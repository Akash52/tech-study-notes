# 09 — LIKE & ILIKE (Pattern Matching)

> **One line:** `LIKE` matches strings against a **pattern** using wildcards — for "starts with," "ends with," "contains," and more. `ILIKE` is the case-insensitive version.

---

## The idea in plain English

Exact matching (`first_name = 'John'`) only finds *exactly* John. Pattern matching answers fuzzier questions:

> *"All emails ending in `@gmail.com`"* · *"All names starting with A"* · *"Anything with `er` in it"*

You do this with two wildcards inside a quoted pattern:

| Wildcard | Matches | Think of it as |
|---|---|---|
| `%` | **any sequence** of characters (including zero) | "…anything here…" |
| `_` | **exactly one** character | "one slot" |

---

## The building blocks

```sql
WHERE name LIKE 'A%'      -- starts with A        (A, then anything)
WHERE name LIKE '%a'      -- ends with a          (anything, then a)
WHERE name LIKE '%er%'    -- contains 'er'         (er anywhere)
WHERE name LIKE '_her%'   -- one char, 'her', then anything → Cheryl, Theresa
WHERE title LIKE 'Mission Impossible _'  -- one char after (part 1, 2, 3…)
WHERE code  LIKE 'version#__'            -- exactly two chars after
```

Key mental model for `%`: it matches **zero or more** characters, so `'%er%'` finds `er` whether it's at the **start**, **middle**, or **end** (Jennif**er**, Kimb**er**ly, C**er**ys) — the surrounding `%` are allowed to match nothing.

`_` is strict: `'_her%'` requires **exactly one** character before `her`, so it accepts Cheryl but rejects "her" alone or "Ather...".

---

## `LIKE` vs `ILIKE` — case sensitivity ⚠️

- **`LIKE` is case-sensitive.** `first_name LIKE 'john%'` returns **nothing** if the data is `John` — the lowercase `j` doesn't match.
- **`ILIKE` is case-insensitive.** `first_name ILIKE 'john%'` matches John, JOHN, john.

```sql
WHERE first_name LIKE  'J%'   -- only capital-J names
WHERE first_name ILIKE 'j%'   -- any-case, matches John, jared, JEROME…
```

---

## Combining patterns & operators

Everything you know still stacks — `NOT LIKE`, `AND`, `OR`, `ORDER BY`:

```sql
SELECT * FROM customer
WHERE first_name LIKE 'A%'          -- first name starts with A
  AND last_name  NOT LIKE 'B%'      -- but last name does NOT start with B
ORDER BY last_name;
```

`NOT LIKE` returns everything the pattern *doesn't* match.

---

## Production notes (important)

- **Leading wildcard = no index = slow. ⚠️** This is the big one. `LIKE 'A%'` (anchored at the start) **can use a normal index** — fast even on huge tables. But `LIKE '%er%'` or `LIKE '%a'` (a wildcard at the *front*) forces a **full table scan**, because the database can't jump to a starting point. Fine on the DVD Rental toy DB; painful on millions of rows. For fast substring/contains search at scale, you need a **trigram index** (`pg_trgm` extension) or **full-text search**.
- **`ILIKE` is Postgres-only.** It won't exist in most other engines. For **portable** case-insensitive matching, lower both sides: `WHERE LOWER(first_name) LIKE 'j%'`. (Note: wrapping the column in `LOWER()` also defeats a plain index unless you build a matching *functional* index.)
- **Match a literal `%` or `_`.** Since they're wildcards, searching for a real percent sign needs an escape: `WHERE discount LIKE '%50\%%' ESCAPE '\'` finds strings containing "50%". Easy to forget when your data legitimately contains those characters.
- **Postgres also has full regex.** `~`, `~*`, and functions like `regexp_match` give you real regular expressions when `LIKE` isn't expressive enough. (Not covered here — just know it's there in the docs under pattern-matching functions.)
- **NULLs don't match.** `LIKE` against NULL is unknown, so NULL rows are excluded (same as any `WHERE`).

---

## Challenges

All use the **DVD Rental** database, `customer` table.

### Challenge 1 — Warm-up (starts with)
Count how many customers have a `first_name` starting with **M**.

<details>
<summary>Solution</summary>

```sql
SELECT COUNT(*) FROM customer
WHERE first_name LIKE 'M%';
```

**Why:** `'M%'` = capital M followed by anything → "starts with M." This pattern is **anchored at the start**, so it's also the index-friendly, fast kind. Wrap in `COUNT(*)` for "how many."
</details>

---

### Challenge 2 — Combine `_` and `%`
Find customers whose `first_name` has **`a` as its second letter** (e.g. Nancy, Larry, Karen). Return `first_name`, `last_name`.

<details>
<summary>Solution</summary>

```sql
SELECT first_name, last_name
FROM   customer
WHERE  first_name LIKE '_a%';
```

**Why:** `_` reserves exactly **one** character (the first letter, any value), then `a` pins the **second** letter, then `%` allows anything after. So the pattern says "any first letter, then `a`, then whatever." Mixing `_` (exact position) with `%` (open-ended) is where pattern matching gets precise.
</details>

---

### Challenge 3 — Spot the bug 🔎 (case sensitivity)
A teammate wants every customer whose first name starts with "jo" (John, Joanne, Josephine…). They write:

```sql
SELECT * FROM customer
WHERE first_name LIKE 'jo%';
```

It returns **nothing**, even though there are obviously Johns. Why, and give two fixes.

<details>
<summary>Solution</summary>

**Bug:** `LIKE` is **case-sensitive**, and the data is stored capitalized (`John`, `Joanne`). The lowercase pattern `'jo%'` never matches a capital `J`.

**Fix 1 — use `ILIKE` (Postgres):**
```sql
SELECT * FROM customer WHERE first_name ILIKE 'jo%';
```

**Fix 2 — normalize case (portable across databases):**
```sql
SELECT * FROM customer WHERE LOWER(first_name) LIKE 'jo%';
```

**Why it matters:** "My `LIKE` returns nothing" is almost always a case mismatch. Use `ILIKE` in Postgres, or `LOWER(col) LIKE LOWER(pattern)` when the code must run on other engines — just remember `LOWER(col)` can disable a plain index unless you add a functional one.
</details>

---

## 30-second recap

| Thing | Takeaway |
|---|---|
| `LIKE` | Pattern match, **case-sensitive** |
| `ILIKE` | Same, **case-insensitive** (Postgres only) |
| `%` | Any sequence (zero or more chars) |
| `_` | Exactly one char |
| `NOT LIKE` | Everything the pattern doesn't match |
| Leading `%` | Kills index use → slow at scale |
| Portable case-insensitive | `LOWER(col) LIKE LOWER(pattern)` |
| Literal `%`/`_` | Use `ESCAPE` |
