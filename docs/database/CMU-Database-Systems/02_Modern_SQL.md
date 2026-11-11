# Lecture 2 – Modern SQL (Full Engineer Notes)

*CMU 15-445 Intro to Database Systems · Lecture 2 · plus guest talk on dbt*

**Big idea of the lecture:** SQL is old (1970s) but not dead. It keeps adding features, and it is the one language you will use for the rest of your career. The standard says one thing, but every database has its own "dialect", so learn the concepts, not one system's syntax.

---

## 0. Practice setup (run this first)

Every example in these notes runs on this small university database. The queries were tested in **DuckDB**, which uses PostgreSQL-style syntax. Where a line is specific to one system (dialect tables, `WITH TIES`, `SELECT INTO`), it's marked.

```sql
CREATE TABLE student (
  sid   INT PRIMARY KEY,
  name  VARCHAR,
  login VARCHAR,
  age   INT,
  gpa   DECIMAL(3,2)
);

CREATE TABLE course (
  cid  VARCHAR PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE enrolled (
  sid   INT REFERENCES student(sid),
  cid   VARCHAR REFERENCES course(cid),
  grade CHAR(1),
  PRIMARY KEY (sid, cid)
);

INSERT INTO student VALUES
 (53666, 'RZA',    'rza@cs',    55, 4.0),
 (53688, 'Taylor', 'swift@cs',  27, 3.9),
 (53655, 'Tupac',  'shakur@cs', 25, 3.5);

INSERT INTO course VALUES
 ('15-445', 'Database Systems'),
 ('15-721', 'Advanced Database Systems'),
 ('15-826', 'Data Mining'),
 ('15-799', 'Special Topics in Databases');

INSERT INTO enrolled VALUES
 (53666, '15-445', 'C'),
 (53688, '15-721', 'A'),
 (53688, '15-826', 'B'),
 (53655, '15-445', 'B'),
 (53666, '15-721', 'C');
```

**How to try it fast:** `pip install duckdb`, then in Python: `import duckdb; con = duckdb.connect(); con.sql("...").show()`. Or install the DuckDB CLI and paste the SQL.

---

## 1. Short history of SQL

| Year | Event |
|---|---|
| 1970 | Ted Codd's relational model paper. No query language defined. |
| early 1970s | IBM builds **SQUARE**, the first relational query language. Odd vertical syntax, never really used. |
| 1972 | Chamberlin & Boyce (IBM, System R project) create **SEQUEL** = "Structured English Query Language". |
| later | Renamed **SQL** because of a trademark lawsuit. That's why older people say "sequel". |
| 1970s | **Oracle** (Larry Ellison) copies IBM's approach. Berkeley's **Ingres** uses its own language, **QUEL**. |
| 1983 | IBM releases **DB2** (still widely used in banks). SQL becomes the de facto standard. |
| 1986 / 1987 | SQL becomes an ANSI (US) standard, then ISO (international). Now "Structured Query Language". |
| SQL-92 | The **minimum** a system needs to claim "we support SQL": SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, indexes, transactions. |
| SQL:2023 | Latest version: added property graph queries and multi-dimensional arrays. |

**Why SQL survives:** it evolves. When JSON was hot (MongoDB era), SQL added JSON. When XML was hot, it added XML. Now it's adding graphs. Every attempt to replace SQL in 50+ years has failed. The closest thing is **Google's pipe SQL syntax**, which extends SQL rather than replacing it.

**Fun fact:** the original IBM design put `FROM` before `SELECT`. A user study at a university preferred `SELECT` first, so that's how it has stayed for 50 years.

**Reality check:** no system implements the standard exactly. Some are ahead of it and push their version in. Some add features later, with their own twist. Example: the standard has `LATERAL` joins, but SQL Server built its own version called `CROSS APPLY`.

---

## 2. Parts of SQL

| Part | Full name | What it does | Examples |
|---|---|---|---|
| **DML** | Data Manipulation Language | Read and change data | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **DDL** | Data Definition Language | Define structure | `CREATE TABLE`, `CREATE INDEX`, `CREATE VIEW`, `DROP` |
| **DCL** | Data Control Language | Control who can see/do what | `GRANT`, `REVOKE` |
| (TCL) | Transaction Control | Group changes safely (later in course) | `BEGIN`, `COMMIT`, `ROLLBACK` |

---

## 3. Sets vs Bags vs Lists (very important)

| Collection | Ordered? | Duplicates allowed? |
|---|---|---|
| **Set** | No | No |
| **Bag** | No | **Yes** |
| **List** | **Yes** | Yes |

- Relational algebra (Lecture 1) is based on **sets**.
- SQL is based on **bags**: results can contain duplicates, because removing them costs extra work.
- To remove duplicates, ask for it: `SELECT DISTINCT ...`.
- To get an order, ask for it: `ORDER BY ...`. Without it, row order is **not guaranteed**, even if it looks sorted today.

**Engineer note:** `UNION` removes duplicates (extra work: sort or hash). `UNION ALL` keeps them and is faster. Use `UNION ALL` when you know there are no duplicates or you don't care.

---

## 4. Logical order of a SELECT (the key to understanding SQL errors)

You **write** SQL in one order, but the database **logically evaluates** it in another:

```
Written order:     SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT
Logical order:     FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

This one idea explains many rules:
- `WHERE` can't use `AVG(...)`, because grouping hasn't happened yet when `WHERE` runs.
- `WHERE` (and in Postgres, `HAVING`) can't use an alias from `SELECT`, because `SELECT` runs later.
- `ORDER BY` **can** use a `SELECT` alias, because it runs after `SELECT`.

(The optimizer may physically run things in a different order. This is the *meaning* of the query, not the execution plan.)

---

## 5. Aggregates

**Aggregate function** = takes values from many rows and returns **one** value.

| Function | Returns |
|---|---|
| `COUNT` | number of rows / values |
| `SUM` | total |
| `AVG` | average |
| `MIN` / `MAX` | smallest / largest |

Many systems add more (standard deviation, geometric mean, etc.). Mostly used in the `SELECT` list.

```sql
-- How many students have a CS login?
SELECT COUNT(*) AS cnt FROM student WHERE login LIKE '%@cs';
-- → 3
```

### `COUNT(*)` vs `COUNT(col)` — engineer precision
The lecture says `COUNT(login)`, `COUNT(*)` and `COUNT(1)` give the same answer. That's true in this example, **but not always**:
- `COUNT(*)` and `COUNT(1)` count **rows**.
- `COUNT(col)` counts rows where `col` is **NOT NULL**.

```sql
SELECT COUNT(*) AS all_rows, COUNT(x) AS non_null
FROM (VALUES (1), (NULL), (3)) AS t(x);
-- → all_rows = 3, non_null = 2
```

- `COUNT(DISTINCT col)` counts unique non-null values.
- All aggregates except `COUNT(*)` **ignore NULLs**. `AVG` of (4, NULL, 2) is 3, not 2.

### Mixing aggregates and normal columns: the classic error
```sql
-- ❌ WRONG: which cid should go next to ONE average?
SELECT AVG(s.gpa), e.cid
FROM enrolled AS e JOIN student AS s ON e.sid = s.sid;
```
- Most systems throw an error. **SQLite allows it** (and old MySQL did), returning a random-ish `cid`. That's a silent bug.
- Newer SQL has `ANY_VALUE(e.cid)` when you really don't care which one you get.
- The correct fix is `GROUP BY`.

---

## 6. GROUP BY

**GROUP BY** splits rows into groups, then runs the aggregate **once per group**.

```sql
-- Average GPA of students in each course
SELECT e.cid, AVG(s.gpa) AS avg_gpa
FROM enrolled AS e
JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid;
```

| cid | avg_gpa |
|---|---|
| 15-445 | 3.75 |
| 15-721 | 3.95 |
| 15-826 | 3.90 |

**Rule:** every non-aggregated column in `SELECT` must appear in `GROUP BY`.

How the DBMS does it (covered later in the course): either **sort** by the group key, or build a **hash table** keyed by it.

### GROUPING SETS (several GROUP BYs in one query)
Instead of three queries glued with `UNION`, ask for all groupings at once. The DB scans the data **once**.

```sql
-- Students per (course, grade), per course, and overall total
SELECT c.name, e.grade, COUNT(*) AS num_students
FROM enrolled e JOIN course c ON e.cid = c.cid
GROUP BY GROUPING SETS (
  (c.name, e.grade),   -- per course + grade
  (c.name),            -- per course
  ()                   -- grand total
);
```
Columns not in a grouping show as **NULL** in those rows (e.g. the grand-total row is `NULL, NULL, 5`).

Related shortcuts: `ROLLUP` (hierarchical subtotals) and `CUBE` (every combination).

**Engineer lesson (recurring theme):** fewer round-trips between the app and the database = faster. Give the DB the whole question in one query so it can optimise it.

---

## 7. HAVING vs WHERE

| | WHERE | HAVING |
|---|---|---|
| Filters | individual **rows** | **groups** |
| Runs | before grouping | after grouping |
| Can use aggregates? | ❌ No | ✅ Yes |

```sql
-- ❌ WRONG: avg_gpa doesn't exist yet when WHERE runs
SELECT e.cid, AVG(s.gpa) AS avg_gpa
FROM enrolled e JOIN student s ON e.sid = s.sid
WHERE avg_gpa > 3.9
GROUP BY e.cid;

-- ✅ RIGHT
SELECT e.cid, AVG(s.gpa) AS avg_gpa
FROM enrolled e JOIN student s ON e.sid = s.sid
GROUP BY e.cid
HAVING AVG(s.gpa) > 3.9;
-- → 15-721 (3.95)
```

**Dialect note:** Postgres does **not** allow `HAVING avg_gpa > 3.9` (the alias). You must repeat `AVG(s.gpa)`. DuckDB and MySQL allow the alias. Writing the full aggregate works everywhere, and a good optimizer computes it only once.

**Style rule from the lecture:** always write an explicit `JOIN ... ON`. The old style `FROM enrolled e, student s WHERE e.sid = s.sid` works, but it's easy to forget the condition and get a Cartesian product (every row × every row).

---

## 8. Strings

### Standard vs reality

| System | Case-sensitive? | Quotes for strings |
|---|---|---|
| **SQL standard** | Yes | Single `'...'` |
| PostgreSQL | Yes | Single only. Double `"..."` = column/table name |
| MySQL | **No** (by default) | Single or double |
| SQLite | Yes | Single (double is tolerated in places) |
| DuckDB | Yes | Single. Double = identifier |

```sql
SELECT * FROM student WHERE name = 'RZA';   -- ✅ works in Postgres
SELECT * FROM student WHERE name = 'rza';   -- ❌ no rows in Postgres, ✅ a row in MySQL
```

**Identifiers in Postgres:** unquoted table/column names are converted to lowercase. `CREATE TABLE "XXX"` keeps the capitals, and then you must always write `"XXX"` with quotes.

**Engineer rule:** single quotes for strings, double quotes only for names. Use lowercase snake_case names so you never need quotes.

### LIKE pattern matching

| Symbol | Means | Example |
|---|---|---|
| `%` | any substring, **including empty** | `'15-%'` matches all 15- courses |
| `_` | exactly **one** character | `'15-4_5'` matches 15-445, 15-455 |

```sql
SELECT * FROM enrolled WHERE cid LIKE '15-%';
```
- `ILIKE` = case-insensitive LIKE (Postgres, DuckDB).
- `SIMILAR TO` = standard regular expressions (Postgres, DuckDB). Many systems use their own regex functions instead, such as `REGEXP_LIKE` or `~` in Postgres.

### String functions
`SUBSTRING`, `UPPER`, `LOWER`, `TRIM`, `LENGTH`: mostly the same everywhere.

### Concatenation: a good example of dialect chaos

| System | Syntax |
|---|---|
| SQL standard, Postgres, SQLite, DuckDB | `'a' \|\| 'b'` |
| SQL Server | `'a' + 'b'` |
| MySQL | `CONCAT('a', 'b')` (`\|\|` means logical OR by default!) |

---

## 9. Dates and times (where everything falls apart)

The standard defines `DATE`, `TIME` and `TIMESTAMP` (optionally with time zone). If you don't store a time zone, you get whatever the server's time zone is, which may not be UTC.

### The famous demo: days from 2025-01-01 to 2025-08-27 (correct answer: 238)

| System | How to get 238 |
|---|---|
| **PostgreSQL / DuckDB / Firebolt** | `SELECT DATE '2025-08-27' - DATE '2025-01-01';` or `SELECT '2025-08-27'::date - '2025-01-01'::date;` |
| **MySQL** | `SELECT DATEDIFF('2025-08-27', '2025-01-01');` ⚠️ plain subtraction gives **726** |
| **SQL Server** | `SELECT DATEDIFF(day, '2025-01-01', '2025-08-27');` (and its own client needs `GO` after a batch) |
| **ClickHouse** | `dateDiff('day', ...)`. Functions like `today()` are case-sensitive: lowercase only |
| **SQLite** | `SELECT CAST(julianday('2025-08-27') - julianday('2025-01-01') AS INT);` (or `unixepoch` difference ÷ 86400) |

**Why MySQL says 726:** it silently turned the dates into numbers, 20250827 − 20250101 = 726. No error, just a wrong answer. *That* is the dangerous kind of bug.

**"Current time" is also different everywhere:**
- `NOW()` works in Postgres, MySQL, DuckDB, ClickHouse and Firebolt, but not in SQLite or SQL Server.
- `CURRENT_TIMESTAMP` (keyword) works in Postgres, MySQL, SQLite, DuckDB and SQL Server.
- SQL Server also has `GETDATE()`. ClickHouse has `today()`.

**Postgres casting shortcut:** `value::type` is the same as `CAST(value AS type)`.

**Engineer rules for dates:**
- Store timestamps in **UTC** (`TIMESTAMPTZ` in Postgres). Convert to local time only for display.
- Never subtract dates without checking what your database actually returns.
- Test date logic on your **actual** database, not on one you assume behaves the same.

---

## 10. Output control

```sql
-- Sorting
SELECT sid, name FROM student ORDER BY gpa DESC, name ASC;

-- Top-N, standard SQL
SELECT sid, name FROM student ORDER BY gpa DESC FETCH FIRST 2 ROWS ONLY;
-- → RZA, Taylor

-- Skip rows (pagination)
SELECT sid, name FROM student ORDER BY sid OFFSET 1 ROWS FETCH NEXT 2 ROWS ONLY;

-- Include ties at the cutoff (Postgres 13+; NOT supported in DuckDB)
SELECT sid, name FROM student ORDER BY gpa DESC FETCH FIRST 2 ROWS WITH TIES;
```

| System | Top-N syntax |
|---|---|
| Standard | `FETCH FIRST n ROWS ONLY` |
| Postgres, MySQL, SQLite, DuckDB | `LIMIT n OFFSET m` (not standard, but very common) |
| SQL Server | `SELECT TOP 10 ...` |

**Engineer note:** `LIMIT` without `ORDER BY` returns *some* n rows, not the "first" ones. Always pair them. For deep pagination (page 10,000), `OFFSET` gets slow. Prefer "keyset" pagination: `WHERE sid > last_seen_sid ORDER BY sid LIMIT 20`.

### Saving results into a table
```sql
-- Standard
SELECT DISTINCT cid INTO course_ids FROM enrolled;
-- Postgres temp table (deleted when the session ends)
SELECT DISTINCT cid INTO TEMPORARY course_ids FROM enrolled;
-- Most portable alternative
CREATE TABLE course_ids AS SELECT DISTINCT cid FROM enrolled;
```

---

## 11. Nested queries (subqueries)

A **nested query** is a SELECT inside another SELECT.
- **Outer query** = the main query.
- **Inner query** = the one inside.
- They can appear in `WHERE` (most common), in `SELECT` (a scalar value) or in `FROM` (a derived table).

**How to write one (professor's tip):** write the outer query first, the final output you want. Then describe the inner query in plain English. Then write it in SQL.

### Example 1: names of students in 15-445
```sql
SELECT name FROM student
WHERE sid IN (SELECT sid FROM enrolled WHERE cid = '15-445');
-- → RZA, Tupac
```

### Example 2: student with the highest ID enrolled in at least one course
```sql
SELECT sid, name FROM student
WHERE sid = (SELECT MAX(sid) FROM enrolled);
-- → 53688 Taylor
```
(Other correct ways: `ORDER BY sid DESC FETCH FIRST 1 ROW`, or a join with a CTE. Many forms give the same answer.)

### Example 3: courses with NO students (correlated subquery)
```sql
SELECT * FROM course c
WHERE NOT EXISTS (
  SELECT 1 FROM enrolled e WHERE e.cid = c.cid   -- refers to outer c!
);
-- → 15-799 Special Topics in Databases
```
**Correlated subquery** = the inner query uses a value from the outer row (`c.cid`), so logically it's re-evaluated per outer row.

### Subquery operators

| Operator | Meaning |
|---|---|
| `IN (...)` | value is in the inner result (same as `= ANY`) |
| `ANY (...)` | condition is true for at least one inner row |
| `ALL (...)` | condition is true for every inner row |
| `EXISTS (...)` | inner query returns at least one row |
| `NOT EXISTS (...)` | inner query returns no rows |

### Performance: the big point
- Naive execution = **nested loops**: rerun the inner query for every outer row. Very slow. Old MySQL did this.
- Good optimizers **rewrite subqueries into joins** (called *decorrelation* / *unnesting*), because joins run fast.
- The lecture says Postgres is relatively weak at this. **DuckDB** is good. **Umbra / CedarDB** (German research system, now commercial) can unnest almost anything.
- In homework-sized data you won't notice a difference. In production with millions of rows, you will.

### ⚠️ Engineer trap: NOT IN with NULLs
```sql
SELECT COUNT(*) FROM course
WHERE cid NOT IN (SELECT 'x' UNION ALL SELECT NULL);
-- → 0 rows! Not 4.
```
If the subquery returns even one `NULL`, `NOT IN` matches nothing (because "x ≠ NULL" is *unknown*, not true). **Use `NOT EXISTS` instead.** It handles NULLs the way you expect.

---

## 12. LATERAL joins

**Idea:** a subquery in `FROM` normally can't see other tables in the same `FROM`. With `LATERAL`, it can refer to tables listed **before** it. It behaves like a **for-each loop**.

```
for each row c in course:
    t1 = count students in c
    t2 = average GPA of students in c
    output (c, t1, t2)
```

```sql
-- For each course: number of students and their average GPA, most popular first
SELECT c.cid, t1.cnt, t2.avg_gpa
FROM course AS c,
  LATERAL (SELECT COUNT(*) AS cnt
           FROM enrolled e WHERE e.cid = c.cid) AS t1,
  LATERAL (SELECT AVG(s.gpa) AS avg_gpa
           FROM student s JOIN enrolled e ON s.sid = e.sid
           WHERE e.cid = c.cid) AS t2
ORDER BY t1.cnt DESC;
```

| cid | cnt | avg_gpa |
|---|---|---|
| 15-445 | 2 | 3.75 |
| 15-721 | 2 | 3.95 |
| 15-826 | 1 | 3.90 |
| 15-799 | 0 | NULL |

- Order matters here: `t1` and `t2` can reference `c` because `c` comes first.
- Supported in Postgres, DuckDB, MySQL 8+ and Firebolt. **SQL Server calls it `CROSS APPLY` / `OUTER APPLY`.**
- This example could also be written with a normal `LEFT JOIN` + `GROUP BY`. LATERAL shines for "top-N per group" queries (e.g. each customer's latest 3 orders).

---

## 13. CTEs – Common Table Expressions (`WITH`)

**Idea:** a named, temporary result that exists **only for one query**. It's like a temp table without the cleanup, and much easier to read than deep nesting.

```sql
WITH max_sid (max_id) AS (
  SELECT MAX(sid) FROM enrolled
)
SELECT s.sid, s.name
FROM student s
JOIN max_sid m ON s.sid = m.max_id;
-- → 53688 Taylor
```

- `WITH name (columns) AS (query)`: you name the columns, and the types are inferred.
- Then you use `name` like a normal table.
- You can define several: `WITH a AS (...), b AS (... uses a ...) SELECT ...`.
- **Why it's nicer than nesting:** you declare pieces at the top and build up step by step, like variables in code.
- The DB may compute it once and reuse it, or inline it like a macro. Postgres 12+ inlines by default unless you write `AS MATERIALIZED`.

**Extra (not in the lecture, but asked in interviews):** `WITH RECURSIVE` lets a CTE refer to itself, for hierarchies like an org chart or category trees.

```sql
WITH RECURSIVE nums(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM nums WHERE n < 5
)
SELECT n FROM nums;   -- → 1, 2, 3, 4, 5
```

---

## 14. Window functions

**Idea:** compute an aggregate-like value **for every row**, looking at a "window" of related rows, **without collapsing** rows the way `GROUP BY` does.

| | GROUP BY | Window function |
|---|---|---|
| Output rows | one per group | **one per input row** |
| Example | average per course | each row + its course's average next to it |

Use cases: moving averages (temperature, stock prices), running totals, ranking, "latest record per user".

### Syntax
```sql
FUNCTION_NAME(...) OVER (
  PARTITION BY ...   -- like GROUP BY: split into groups
  ORDER BY ...       -- order inside each group
)
```

### Window-only functions

| Function | Gives |
|---|---|
| `ROW_NUMBER()` | 1, 2, 3, … position within the partition (no ties) |
| `RANK()` | rank by sort order. Ties share a rank, then it **skips** (1, 1, 3) |
| `DENSE_RANK()` | ties share a rank, **no gaps** (1, 1, 2) |

Normal aggregates (`AVG`, `SUM`, `COUNT`, `MIN`, `MAX`) also work with `OVER`. Others include `LAG()` / `LEAD()` (previous/next row's value).

### Example 1: row number per course
```sql
SELECT cid, sid,
       ROW_NUMBER() OVER (PARTITION BY cid ORDER BY sid) AS row_num
FROM enrolled;
```

| cid | sid | row_num |
|---|---|---|
| 15-445 | 53655 | 1 |
| 15-445 | 53666 | 2 |
| 15-721 | 53666 | 1 |
| 15-721 | 53688 | 2 |
| 15-826 | 53688 | 1 |

The numbering **restarts at 1** for each new partition.

### Example 2: best grade in each course
```sql
SELECT * FROM (
  SELECT e.cid, e.sid, e.grade,
         RANK() OVER (PARTITION BY e.cid ORDER BY e.grade) AS rnk
  FROM enrolled e
) t
WHERE rnk = 1;
-- → 15-445: 53655 (B), 15-721: 53688 (A), 15-826: 53688 (B)
```
You can't put a window function directly in `WHERE`, because windows are computed during `SELECT` (remember the logical order). So wrap it in a subquery or CTE, then filter. Some systems (DuckDB, Snowflake) offer `QUALIFY rnk = 1` as a shortcut.

### Example 3: moving average (the classic use case)
```sql
-- 3-day moving average of temperature
SELECT day, temp,
       AVG(temp) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg
FROM weather;
```

---

## 15. Guest talk: dbt (data build tool)

**What it is:** dbt is **not** a database. It's a tool that helps companies transform data **inside** their data warehouse using SQL, the way software engineers manage code.

**The problem it solves:**
- Companies load data from many sources (Postgres, payments, ads, support…) into a **data warehouse** (Snowflake, BigQuery, Redshift, Databricks).
- Then dashboards, ML and apps all query the raw tables directly. The result is a mess:
  - no **lineage** (where did this number come from?)
  - no **documentation**
  - no **deployment process** (people edit in production)
  - no **QA** (things break silently)
  - **duplicated business logic** ("what is a customer?" defined 100 different ways)

**dbt's approach:**
1. Raw data stays on one side of the warehouse.
2. You write **SQL SELECT models** that turn raw tables → cleaned "staging" tables → business-ready tables (e.g. `dim_stripe_customers`).
3. dbt wraps each SELECT in `CREATE TABLE AS` / `CREATE VIEW AS` and builds them in **dependency order** (a DAG = directed acyclic graph).
4. **Jinja templates** inside the SQL let you reference other models (`{{ ref('stg_github_stars') }}`), write loops and reuse code.
5. You get version control (Git), CI, tests (`unique`, `not_null`), docs and a lineage graph.

**Key point:** dbt runs the SQL **on the customer's own warehouse**. It has no execution engine of its own. A large share of all queries on Snowflake and BigQuery come from dbt.

**One-line summary:** "Transform data in the warehouse, and do it like a software engineer writes code."

---

## 16. Production tips (things that bite in real jobs)

1. **Know your dialect.** Before copying SQL from a blog or an LLM, check that it's for *your* database. Date functions differ the most.
2. **Watch for silent wrong answers** (like MySQL's 726) more than errors. Errors are easy, wrong numbers reach the CEO.
3. **Use `COUNT(*)` to count rows.** Use `COUNT(col)` only when you mean "non-NULL values".
4. **Use `NOT EXISTS`, not `NOT IN`,** when the subquery column can be NULL.
5. **Always pair `LIMIT` with `ORDER BY`.**
6. **Use explicit `JOIN ... ON`.** Never rely on comma joins.
7. **Store times in UTC** with a time zone type.
8. **Prefer CTEs over deeply nested subqueries** for readability, then check the plan with `EXPLAIN` if it's slow.
9. **Use one query instead of many** (GROUPING SETS, window functions, LATERAL) to cut app↔DB round-trips.
10. **Single quotes for strings, lowercase snake_case names.** No quoting headaches.
11. **Use LLMs for a first draft, but verify.** As the professor said: if you don't understand the SQL it produces, you can't tell when it's wrong.

---

## 17. Interview questions with answers

1. **What are DML, DDL and DCL?**
   DML reads/changes data (SELECT, INSERT, UPDATE, DELETE). DDL defines structure (CREATE, ALTER, DROP). DCL controls permissions (GRANT, REVOKE).
2. **Is SQL based on sets or bags?**
   Bags: duplicates are allowed by default. Use DISTINCT to remove them.
3. **Difference between WHERE and HAVING?**
   WHERE filters rows before grouping and can't use aggregates. HAVING filters groups after aggregation.
4. **What is the logical order of a SELECT query?**
   FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.
5. **`COUNT(*)` vs `COUNT(column)`?**
   `COUNT(*)` counts all rows. `COUNT(column)` counts only non-NULL values in that column.
6. **Why does `SELECT cid, AVG(gpa) FROM enrolled` fail?**
   `cid` is neither aggregated nor in GROUP BY, so there's no single value to show. Add `GROUP BY cid`.
7. **What is GROUPING SETS / ROLLUP / CUBE?**
   Ways to compute several groupings (subtotals, totals) in one query and one scan, instead of UNIONing many queries.
8. **UNION vs UNION ALL?**
   UNION removes duplicates (slower). UNION ALL keeps everything (faster).
9. **What is a correlated subquery?**
   An inner query that refers to a column from the outer query, so it's conceptually evaluated once per outer row.
10. **IN vs EXISTS? Why prefer NOT EXISTS over NOT IN?**
    IN checks membership in a list. EXISTS checks whether any row exists. NOT IN returns no rows if the subquery contains a NULL. NOT EXISTS behaves correctly.
11. **Why are subqueries sometimes slow, and how do databases fix it?**
    Naively they rerun per outer row (nested loops). Good optimizers rewrite them into joins (decorrelation).
12. **What is a CTE? Why use one?**
    A named temporary result defined with WITH, living for one query. It's more readable than nesting and can be reused within the query.
13. **What is a recursive CTE?**
    A CTE that refers to itself, used for hierarchies or graphs (org charts, folder trees).
14. **What is a LATERAL join?**
    A FROM-clause subquery that can reference earlier tables in the same FROM, like a for-each loop. SQL Server calls it CROSS APPLY.
15. **Window function vs GROUP BY?**
    GROUP BY collapses to one row per group. A window function keeps every row and adds a computed value from its window.
16. **ROW_NUMBER vs RANK vs DENSE_RANK?**
    For ties at 1st place: ROW_NUMBER gives 1, 2. RANK gives 1, 1, then 3. DENSE_RANK gives 1, 1, then 2.
17. **How do you get the top 1 row per group?**
    `ROW_NUMBER() OVER (PARTITION BY group ORDER BY x)` in a subquery or CTE, then `WHERE rn = 1` (or QUALIFY, or LATERAL).
18. **LIKE wildcards?**
    `%` = any number of characters (including zero). `_` = exactly one character.
19. **Why might date math differ across databases?**
    Each dialect has its own functions and casts. MySQL subtracting dates can silently turn them into numbers (726 instead of 238).
20. **What is dbt?**
    A tool that turns SQL SELECT models into tables/views inside your warehouse, in dependency order, with Git, tests, docs and lineage. It's not a database.

---

## 18. Practice tasks (do these on your laptop)

1. Run the setup in section 0 in DuckDB.
2. Find the average age of students per grade they received.
3. List courses with more than 1 student (use HAVING).
4. Find students not enrolled in 15-721, using NOT EXISTS.
5. Rewrite task 4 with a LEFT JOIN + `IS NULL` and compare.
6. Using a window function, show each enrollment with the course's average GPA next to it.
7. Compute days between your birthday and today in DuckDB, then look up how you'd do it in MySQL.
8. Write one query with a CTE that finds the course with the highest average GPA.

---

## 19. One-page summary

- SQL: born at IBM in the 1970s (SEQUEL), standard since 1986, latest SQL:2023, minimum = SQL-92.
- Every DBMS has its own dialect, so learn concepts, then check syntax.
- DML = data, DDL = structure, DCL = permissions.
- SQL uses **bags**: duplicates OK, no order unless you `ORDER BY`.
- Logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.
- Aggregates collapse rows. GROUP BY = one result per group. HAVING filters groups.
- Strings: single quotes, case-sensitive (not in MySQL). LIKE `%` and `_`. Concatenation differs per system.
- Dates are the most inconsistent area. Check your system (726 vs 238!).
- Nested queries: IN / EXISTS / ANY / ALL. Prefer NOT EXISTS. Good DBs rewrite subqueries to joins.
- LATERAL = for-each subquery. CTE (`WITH`) = named temp result. Window functions = per-row aggregates with `OVER (PARTITION BY … ORDER BY …)`.
- dbt = SQL-based transformation pipelines that run inside your warehouse.
