# SQL in Practice: The 20-Year Field Guide (Deep Research Edition)

**MySQL and PostgreSQL, from first query to database expert.**
As of October 2026. Written to be read side by side with Mosh Hamedani's 3-hour MySQL course. Parts 11–17 add original research: a failure atlas of 14 public incidents, database time bombs, independent isolation testing, zero-downtime migrations, and hands-on incident labs, with key claims reproduced in our own PostgreSQL lab.

---

## Contents

- Part 0. Twenty years in one chapter (2006–2026): the 360° view
- How to use this book
- Part 1. Foundations
- Part 2. Querying one table
- Part 3. Joins
- Part 4. Changing data safely
- Part 5. Aggregation and reports
- Part 6. Subqueries, CTEs and window functions
- Part 7. Schema design
- Part 8. Indexes, performance and maintenance
- Part 9. Transactions, isolation, locking and replication
- Part 10. Real-world cookbook (14 recipes)
- Deep Research Edition:
    - Part 11. The Database Failure Atlas (2015–2025)
    - Part 12. Time bombs: limits that explode years later
    - Part 13. What isolation levels really guarantee
    - Part 14. Zero-downtime schema changes
    - Part 15. Database physics: numbers to reason with
    - Part 16. Twenty laws of databases
    - Part 17. Incident Lab: recreate famous failures on your laptop
- MySQL vs PostgreSQL
- Portfolio projects
- Interview prep
- Roadmap to database expert and reading list
- One-page cheat sheet
- Sources

---

## Part 0. Twenty years in one chapter (2006–2026)

**The short version:** for twenty years, a new kind of database was announced every few years as the replacement for SQL. None replaced it. SQL databases absorbed the useful ideas instead (JSON documents, key-value speed, columnar analytics, vector search), and the skills that paid off in 2006 still pay off in 2026.

That is the central finding of Stonebraker and Pavlo's 2024 survey of the period, "What Goes Around Comes Around... And Around": repeated attempts to replace SQL or the relational model failed, and SQL extended itself with the good ideas from each challenger. They single out MapReduce as dead, and key-value stores as having either grown into relational systems or settled into narrow uses.

This chapter gives you the whole picture from six angles: history, technology, production failures, security, the job market, and AI. Each angle ends with what it means for how you learn.

### 0.1 The timeline

| Year | What happened | What it taught |
|---|---|---|
| 2006 | AWS launches S3 and EC2. Google publishes the Bigtable paper. Hadoop starts. | Data moves to commodity hardware and rented clouds. |
| 2007 | Amazon publishes the Dynamo paper. | Availability vs consistency becomes an explicit design choice. |
| 2008 | Sun buys MySQL AB. Facebook open-sources Cassandra. | Big companies build their own data stores for web scale. |
| 2009 | MongoDB and Redis are released; the "NoSQL" label spreads. Amazon RDS launches. MariaDB forks from MySQL. | Managed databases begin replacing hand-run servers. |
| 2010 | Oracle completes its Sun purchase and now owns MySQL. PostgreSQL 9.0 adds built-in streaming replication. | Open-source governance matters; PostgreSQL becomes production-ready at scale. |
| 2012 | Google's Spanner paper. Amazon Redshift. PostgreSQL 9.2 adds a JSON type. | Distributed SQL and cloud warehouses arrive; SQL starts absorbing documents. |
| 2014 | PostgreSQL 9.4 adds indexable JSONB. Amazon Aurora is announced. | One relational database can now serve document workloads. |
| 2015 | MySQL 5.7 adds a JSON type. Sentry is down most of a workday from PostgreSQL transaction-ID wraparound. | Know your engine's maintenance internals. |
| 2016 | PostgreSQL 9.5 adds UPSERT and row-level security. Uber publishes why it moved core storage from PostgreSQL to MySQL. | Choose by workload, and re-evaluate as databases improve. |
| 2017 | PostgreSQL 10 adds declarative partitioning and logical replication. GitLab loses about 6 hours of production data when backups fail. *Designing Data-Intensive Applications* (1st ed.) is published. | Untested backups are not backups. |
| 2018 | MySQL 8.0 adds CTEs and window functions. A 43-second network cut becomes a 24-hour degradation at GitHub. | Automated failover needs rehearsal too. |
| 2019 | DuckDB is first released. | Analytics SQL moves onto laptops and into apps. |
| 2021 | pgvector is released for PostgreSQL. | Vectors become just another column type. |
| 2022 | ChatGPT launches; LLMs start drafting SQL for everyone. | Reading and verifying SQL becomes as valuable as writing it. |
| 2023 | PostgreSQL becomes the most-used database in the Stack Overflow survey. The MOVEit SQL injection hits 2,000+ organizations. | Popularity shifts; old vulnerabilities still work. |
| 2024 | MySQL 8.4, the first long-term release of its new model. Stonebraker and Pavlo publish their 20-year survey. Figma describes sharding PostgreSQL after ~100x growth. | Even giants scale relational databases instead of abandoning them. |
| 2025 | PostgreSQL 18. OWASP Top 10 2025 ranks injection #5, down from a decade at #1. | Frameworks help, but injection is not gone. |
| 2026 | *DDIA* 2nd edition (March). MySQL 9.7 LTS (April). MySQL 8.0 reaches end of life. PostgreSQL 19 in beta. | The fundamentals carry forward; the versions change. |

### 0.2 Seven lessons from twenty years

1. **SQL is the most durable skill in data.** It was born at IBM in the 1970s, outlived object databases in the 1990s, NoSQL in the 2010s, and is now absorbing vector search. In the 2025 Stack Overflow survey, SQL was used by 58.6% of respondents, third among all languages. Invest deeply.
2. **Databases converge, so learn concepts, not brands.** PostgreSQL and MySQL added JSON, full-text search and vectors; NoSQL systems added SQL-like languages and transactions. Data models, indexes, transactions and replication transfer between every product.
3. **Most disasters are operations, not queries.** GitLab (backups), GitHub (failover), and Sentry (maintenance) all failed outside the SQL you write. Learning restore, replication lag and vacuum is what separates a developer from a database engineer.
4. **One well-run database goes a very long way.** Figma ran on a single PostgreSQL instance (the largest AWS offered) until 2020 and still chose to scale PostgreSQL in steps rather than replace it. Master indexing, partitioning and read replicas before reaching for distributed databases. Shard last.
5. **Security mistakes repeat.** SQL injection was OWASP's #1 web risk for about a decade and is still #5 in 2025. The 2023 MOVEit breach was a SQL injection. Parameterized queries are not optional.
6. **Popularity shifts; bilingual people win.** PostgreSQL was the 4th most-used database in the 2017 survey, about 30 points behind MySQL; by 2025 it led MySQL by more than 15 points among developers. MySQL still powers a huge share of existing apps. Learn both.
7. **AI changes who types SQL, not who is responsible for it.** On Spider 2.0, a benchmark built from real enterprise databases, models that scored around 90% on older academic benchmarks fell to 10–20% at its release in late 2024. The best published systems have since climbed to about 72% execution accuracy, which still means more than 1 answer in 4 is wrong. The person who can verify SQL is worth more than ever.

### 0.3 Real production failures and what they teach

| Incident | What happened | The lesson | Where this book covers it |
|---|---|---|---|
| **Sentry, July 2015** (PostgreSQL) | A write-heavy app hit transaction-ID wraparound protection. PostgreSQL stopped accepting writes, and the service was down for most of the US workday while tables were vacuumed. | Understand MVCC and VACUUM. Monitor transaction-ID age before it becomes an outage. | Part 8.7, Part 9 |
| **Uber, July 2016** (PostgreSQL → MySQL) | Uber moved core storage to its MySQL-based "Schemaless" layer, citing write amplification from index updates and replication traffic. PostgreSQL experts replied that some issues were solvable and that logical replication, missing then, was coming (it shipped in PostgreSQL 10, 2017). | No database is best for everything. Decide by your workload, and re-evaluate as databases improve. | MySQL vs PostgreSQL |
| **GitLab, January 2017** (PostgreSQL) | During a replication repair, data on the primary was deleted by mistake. The team then found that backups had not been running or could not be used. Database changes from about 17:20 to 00:00 UTC were lost. | A backup you have never restored is a hope. Monitor backups and rehearse restores. | Part 4.5, Cookbook 13, Project 4 |
| **GitHub, October 2018** (MySQL) | A 43-second network cut triggered automated cross-region failover. Writes landed on both coasts, and restoring multiple terabytes from backups took hours. Service was degraded for 24 hours and 11 minutes. | Failover can create split brain. Restore time is part of your recovery plan, not an afterthought. | Part 9.5, Cookbook 14 |
| **MOVEit, May 2023** (SQL injection) | A SQL injection zero-day in a file-transfer product was mass-exploited. One tracker counted 2,095 organizations and about 62 million individuals affected. | Parameterized queries, least-privilege database users, and fast patching. | Cookbook 12 |
| **Figma, 2020–2024** (PostgreSQL at scale) | The database stack grew almost 100x. It went from one PostgreSQL instance to vertical partitioning, then a nine-month horizontal sharding project behind a query proxy, keeping the ability to roll back. Vacuum reliability was one of the pressures. | Scale in steps; separate logical from physical sharding; keep every migration reversible. | Part 8, Projects 3–4 |

Part 11 extends this table to fourteen incidents through 2025, classifies them, and draws out the patterns they share.

### 0.4 The skill durability map

Spend your learning time in proportion to how long a skill stays valuable. A reasonable split is about 70% timeless, 25% durable, 5% perishable.

| Durability | Skills | Shelf life |
|---|---|---|
| **Timeless** | Relational modeling, SQL (joins, grouping, window functions), keys and constraints, transactions and isolation, indexing principles, reading query plans, backup and restore discipline | Decades |
| **Durable** | One engine's internals (InnoDB, PostgreSQL MVCC and VACUUM), replication and high-availability patterns, cloud managed-database operations, migration tooling, partitioning | 5–10 years |
| **Perishable** | Specific versions, GUI tools, vendor-only features, today's AI tools and prompts | 1–3 years |

### 0.5 How the database job changed

| Then (around 2006) | Now (2026) |
|---|---|
| A DBA installs, patches and tunes one big server | Managed cloud services handle installs, patching, backups and failover |
| Developers send SQL to the DBA for review | Developers own schemas, migrations and query performance |
| Scale up: buy a bigger box | Scale in steps: indexes, read replicas, partitioning, sharding last |
| Reports run on the production database | Analytics moves to warehouses, lakehouses and embedded engines such as DuckDB |
| Hand-written SQL everywhere | ORMs plus SQL; AI drafts queries and humans verify them |

The roles that use these skills today: backend developer, data analyst, analytics engineer, data engineer, database reliability or platform engineer, and DBA. The book *Database Reliability Engineering* (Campbell and Majors, O'Reilly, 2017) describes the modern operations role well.

### 0.6 Learning SQL in the AI era

AI is an excellent tutor and a risky author. Use it to learn faster without losing the skill.

- **Use it as a tutor:** ask it to explain a query plan, quiz you, or find the bug in *your* query. Do not let it solve the "Your turn" problems for you; that skips the practice that builds memory.
- **Rule one:** never run AI-written SQL you cannot explain line by line.
- **Give it context:** paste the `CREATE TABLE` statements and say which database and version. Most wrong answers come from guessed column names, the wrong dialect, or an ambiguous business term ("active customer" means what, exactly?).
- **Verify every generated query:**
    1. Dialect: does it run on *your* database?
    2. Row count: compare with a simple `COUNT(*)` you trust.
    3. Joins: are the keys right, and could a join multiply rows (fan-out)?
    4. Edge cases: NULLs, ties, empty groups, duplicates.
    5. Performance: `EXPLAIN` it on realistic data.
    6. Writes: SELECT the WHERE first, run inside a transaction, have a backup.
- **Privacy:** never paste production data, customer details, or credentials into a chatbot.
- **Practice "read before run":** for any query, predict its output before executing it. This is the skill interviews and code reviews now test most.

---

## How to use this book

Give it 45–60 minutes a day for 4 weeks: read one Part, type every query in MySQL and PostgreSQL, and solve the "Your turn" problems before looking at the answers. Parts 1–4 follow the same order as Mosh's course, so you can watch a chapter and then work the matching Part.

### The daily learning loop

1. **Read** the short explanation (5 minutes).
2. **Type** every example yourself. No copy-paste: your fingers learn the syntax.
3. **Break it** on purpose: drop a comma, change JOIN to LEFT JOIN, add a NULL row. Read the error.
4. **Solve** the "Your turn" problems from memory, then check the answers.
5. **Explain** the idea out loud in two sentences, as if to an interviewer.
6. **Revisit** 2–3 old problems for 10 minutes before starting anything new.

Steps 4 and 6 matter most. A major review of learning research (Dunlosky et al., 2013) rated self-testing and spaced-out practice as the most effective study methods, and re-reading and highlighting as weak ones.

### Setup

| Option | Best for | What to do |
|---|---|---|
| Mosh's course setup | You already installed MySQL + Workbench | Keep using `sql_store`; add PostgreSQL with Docker below |
| Docker (both databases) | Fastest clean install | Run the commands below |
| DBeaver | One free GUI for both databases | Connect to MySQL on port 3306 and PostgreSQL on 5432 |
| db-fiddle.com | No install, quick tests | Pick MySQL or PostgreSQL, paste the schema, run |

```bash
# MySQL 9.7 (current LTS) and PostgreSQL 18, side by side
docker run --name mysql -e MYSQL_ROOT_PASSWORD=secret -p 3306:3306 -d mysql:9.7
docker run --name pg -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:18

# open a SQL prompt in each
docker exec -it mysql mysql -uroot -psecret
docker exec -it pg psql -U postgres
```

### How every Part is laid out

**Concept → Example → Real-world use → Trap → Your turn → Answers.** Where the two databases differ, lines are tagged **MySQL:** and **PostgreSQL:**. All examples run on the practice store built in Part 1.

### 4-week plan

- [ ] Week 1: Part 0 (read once), Parts 1–2. Course: intro through LIMIT.
- [ ] Week 2: Parts 3–4. Course: joins through deleting data.
- [ ] Week 3: Parts 5–7 (aggregation, CTEs and window functions, schema design).
- [ ] Week 4: Parts 8–10 (performance, transactions, cookbook). Start Project 1.
- [ ] Every day from Week 2: 2 problems from the interview bank.
- [ ] After Week 4: one project per month and one book from the reading list.

---

## Part 1. Foundations

A relational database stores data in tables that point to each other through keys, and SQL is the language you use to read and change those tables.

| Term | Meaning | In the practice store |
|---|---|---|
| Database (schema) | A named container of tables | `practice_store` |
| DBMS | The server software that runs your SQL | MySQL, PostgreSQL |
| Table | One kind of thing | `customers`, `orders` |
| Row (record) | One instance of that thing | customer #3 |
| Column (field) | One attribute, with a fixed data type | `first_name VARCHAR(50)` |
| Primary key (PK) | Column(s) that uniquely identify each row | `customers.customer_id` |
| Foreign key (FK) | Column that points to another table's PK | `orders.customer_id` |
| Composite key | A PK made of 2+ columns | `order_items (order_id, product_id)` |

### Relationships

- **One-to-many (1:N):** one customer has many orders. The FK lives on the "many" side: `orders.customer_id`.
- **Many-to-many (N:M):** an order has many products and a product appears in many orders, so a junction table sits in the middle: `order_items`.
- **One-to-one (1:1):** rare, e.g. `users` and `user_settings` sharing the same PK.
- **Self-reference:** an employee's manager is also an employee: `employees.reports_to → employees.employee_id`.

Why not store the customer's name inside each order? Names and addresses change. Store them once, point to them by id, and you update one row instead of hundreds. This is normalization (Part 7).

`order_items` has its own `unit_price`: the price **at the time of purchase**. `products.unit_price` is today's price. Keeping both is correct design, not duplication.

### How the practice store connects

```text
 customers (PK customer_id)
     1
     |
     N
 orders (PK order_id) ---- N:1 ---- shippers (PK shipper_id)
     |    \
     |     \---- N:1 ---- order_statuses (PK order_status_id)
     1
     |
     N
 order_items (PK order_id + product_id) ---- N:1 ---- products (PK product_id)

 employees (PK employee_id, FK reports_to -> employees.employee_id)   a self join
```

Read each link from the 1 side to the N side: one customer places many orders, each order holds many `order_items` rows, and each product appears in many of those rows.

### Build the practice store (works in both databases)

Run this once in each database. It is a smaller copy of Mosh's `sql_store` plus an `employees` table. To reset after experiments, drop the database and run it again.

```sql
-- MySQL:      CREATE DATABASE practice_store;  USE practice_store;
-- PostgreSQL: CREATE DATABASE practice_store;  then in psql:  \c practice_store
-- Foreign keys are written as table-level FOREIGN KEY clauses:
-- MySQL 8.x silently ignores inline column REFERENCES (fixed in 9.0).

CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  birth_date  DATE,
  phone       VARCHAR(50),
  city        VARCHAR(50) NOT NULL,
  state       CHAR(2)     NOT NULL,
  points      INT         NOT NULL DEFAULT 0
);

CREATE TABLE products (
  product_id        INT PRIMARY KEY,
  name              VARCHAR(50)  NOT NULL,
  quantity_in_stock INT          NOT NULL,
  unit_price        DECIMAL(6,2) NOT NULL
);

CREATE TABLE shippers (
  shipper_id INT PRIMARY KEY,
  name       VARCHAR(50) NOT NULL
);

CREATE TABLE order_statuses (
  order_status_id INT PRIMARY KEY,
  name            VARCHAR(50) NOT NULL
);

CREATE TABLE orders (
  order_id     INT PRIMARY KEY,
  customer_id  INT  NOT NULL,
  order_date   DATE NOT NULL,
  status       INT  NOT NULL DEFAULT 1,
  shipped_date DATE,
  shipper_id   INT,
  comments     VARCHAR(255),
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id),
  FOREIGN KEY (status)      REFERENCES order_statuses (order_status_id),
  FOREIGN KEY (shipper_id)  REFERENCES shippers (shipper_id)
);

CREATE TABLE order_items (
  order_id   INT          NOT NULL,
  product_id INT          NOT NULL,
  quantity   INT          NOT NULL,
  unit_price DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id)   REFERENCES orders (order_id),
  FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  job_title   VARCHAR(50) NOT NULL,
  department  VARCHAR(50) NOT NULL,
  salary      INT         NOT NULL,
  reports_to  INT,
  FOREIGN KEY (reports_to) REFERENCES employees (employee_id)
);

INSERT INTO customers VALUES
 (1,'Babara','MacCaffrey','1986-03-28','781-932-9754','Arlington','VA',2273),
 (2,'Ines','Brushfield','1986-04-13','804-427-9456','Richmond','VA',947),
 (3,'Freddi','Boagey','1985-02-07','719-724-7869','Colorado Springs','CO',2967),
 (4,'Ambur','Roseburgh','1974-04-14','407-231-8017','Orlando','FL',457),
 (5,'Clemmie','Betchley','1973-11-07',NULL,'Hartford','CT',3675),
 (6,'Elka','Twiddell','1991-09-04','312-480-8498','Chicago','IL',3073),
 (7,'Ilene','Dowson','1964-08-30','615-641-4759','Nashville','TN',1672),
 (8,'Thacher','Naseby','1993-07-17','941-527-3977','Sarasota','FL',205);

INSERT INTO products VALUES
 (1,'Coffee Beans 1kg',40,18.50),
 (2,'Green Tea 100 bags',75,6.25),
 (3,'Dark Chocolate Bar',120,2.99),
 (4,'Almond Milk 1L',60,3.40),
 (5,'Oat Cookies',90,4.10),
 (6,'Honey Jar 500g',0,9.75);

INSERT INTO shippers VALUES (1,'QuickMove'), (2,'ParcelPro'), (3,'Swift Cargo');

INSERT INTO order_statuses VALUES (1,'Processed'), (2,'Shipped'), (3,'Delivered');

INSERT INTO orders VALUES
 (1, 6,'2026-01-15',1,NULL,NULL,NULL),
 (2, 7,'2025-08-02',2,'2025-08-05',1,NULL),
 (3, 1,'2025-11-20',3,'2025-11-22',2,NULL),
 (4, 2,'2025-03-11',1,NULL,NULL,'Gift wrap'),
 (5, 5,'2025-12-30',3,'2026-01-02',3,NULL),
 (6, 1,'2026-02-03',2,'2026-02-04',1,NULL),
 (7, 2,'2026-02-27',1,NULL,NULL,NULL),
 (8, 5,'2026-03-14',3,'2026-03-16',2,NULL),
 (9, 6,'2026-04-01',2,'2026-04-03',3,NULL),
 (10,7,'2026-04-18',1,NULL,NULL,NULL);

INSERT INTO order_items VALUES
 (1,1,2,18.50), (1,3,4,2.99),
 (2,2,1,6.00),  (2,5,3,4.10),
 (3,1,1,17.90), (3,4,6,3.40),
 (4,3,10,2.99),
 (5,1,3,18.50), (5,2,2,6.25),
 (6,5,5,4.10),
 (7,4,2,3.40),  (7,1,1,18.50),
 (8,2,4,6.25),  (8,3,2,2.99),
 (9,1,2,18.50),
 (10,5,1,4.10), (10,3,3,2.99);

INSERT INTO employees VALUES
 (1,'Asha','Mehta','CEO','Management',190000,NULL),
 (2,'Ravi','Patel','VP Engineering','Engineering',150000,1),
 (3,'Lena','Fischer','VP Sales','Sales',145000,1),
 (4,'Omar','Haddad','Senior Engineer','Engineering',152000,2),
 (5,'Mei','Chen','Engineer','Engineering',95000,2),
 (6,'Carlos','Ruiz','Engineer','Engineering',95000,2),
 (7,'Nina','Kowalski','Sales Rep','Sales',70000,3),
 (8,'Sam','Okafor','Sales Rep','Sales',72000,3);
```

The data is planted for practice: customers 3, 4 and 8 have no orders, product 6 was never sold, 4 orders are not shipped yet, customer 5 has no phone, Omar earns more than his manager, and Mei and Carlos tie on salary.

---

## Part 2. Querying one table

Every read query is the same skeleton. Write the clauses in this order or you get a syntax error.

```sql
SELECT   column_list          -- what to show
FROM     table_name           -- where from
WHERE    condition            -- which rows
GROUP BY columns              -- Part 5
HAVING   group_condition      -- Part 5
ORDER BY columns [ASC|DESC]   -- sort
LIMIT    n;                   -- how many
```

**Interview favourite:** the database *runs* the clauses in a different order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. That is why a SELECT alias fails inside WHERE but works in ORDER BY.

### 2.1 SELECT: choose and compute columns

```sql
SELECT first_name, last_name, points,
       (points + 10) * 100 AS discount_factor   -- expression + alias
FROM customers;

SELECT DISTINCT state FROM customers;           -- unique values only
```

- **Real world:** list the columns you need. `SELECT *` on a wide, million-row table wastes network and memory, and breaks app code when someone adds a column.
- **Trap:** `*` and `/` run before `+` and `-`. Add parentheses whenever you mix them.
- **Trap:** aliases with spaces need quotes, and the quotes differ. MySQL accepts backticks; PostgreSQL needs double quotes, because single quotes always mean a string there. Use snake_case aliases and skip the problem.

### 2.2 WHERE: filter rows

| Operator | Example |
|---|---|
| `=  <>  !=  >  >=  <  <=` | `points > 3000`, `state <> 'VA'` |
| `AND`, `OR`, `NOT` | `birth_date > '1990-01-01' AND points > 1000` |
| `IN`, `NOT IN` | `state IN ('VA', 'FL', 'GA')` |
| `BETWEEN` (inclusive) | `points BETWEEN 1000 AND 3000` |
| `LIKE` (`%` any characters, `_` one) | `last_name LIKE 'b%'` |
| `IS NULL`, `IS NOT NULL` | `phone IS NULL` |
| Regex | **MySQL** `last_name REGEXP '^b'` · **PostgreSQL** `last_name ~* '^b'` |

```sql
SELECT *
FROM customers
WHERE birth_date > '1990-01-01'
   OR (points > 1000 AND state = 'VA');
```

Traps that cause real production bugs:

- `AND` binds tighter than `OR`. Always add parentheses when you mix them.
- `WHERE phone = NULL` returns nothing, ever. NULL means "unknown", so use `IS NULL`.
- `NOT IN (subquery)` returns zero rows if the subquery yields a single NULL. Prefer `NOT EXISTS` (Part 6).
- MySQL's default collation compares text case-insensitively (`'va' = 'VA'` is true). PostgreSQL is case-sensitive: use `ILIKE` or `LOWER()`.
- A leading wildcard such as `LIKE '%field'` cannot use an index and scans the whole table (Part 8).

Write dates as `'YYYY-MM-DD'`. "Orders this year" without hard-coding the year:

```sql
-- MySQL
SELECT * FROM orders WHERE order_date >= MAKEDATE(YEAR(CURDATE()), 1);
-- PostgreSQL
SELECT * FROM orders WHERE order_date >= date_trunc('year', CURRENT_DATE);
```

### 2.3 ORDER BY and LIMIT

```sql
SELECT customer_id, first_name, points
FROM customers
ORDER BY points DESC, first_name   -- second column breaks ties
LIMIT 3;                           -- top 3 loyal customers

-- page 3 with 3 rows per page: skip 6, take 3
SELECT * FROM customers ORDER BY customer_id LIMIT 3 OFFSET 6;
```

- Without `ORDER BY`, row order is **not guaranteed**, even if it looks sorted today.
- Sort by column names, not positions (`ORDER BY 1, 2`), which break when someone edits the SELECT list.
- `LIMIT 6, 3` is MySQL-only; `LIMIT 3 OFFSET 6` works in both.
- **Real world:** OFFSET slows down on deep pages, because page 10,000 reads and throws away every earlier row. Large apps use keyset pagination (Cookbook 3).

### Your turn

1. Products with name, unit price and a `new_price` 10% higher.
2. Orders placed in 2026 (a hard-coded date is fine).
3. Items of order 6 whose total (quantity × unit price) is over 20.
4. Customers born between 1990-01-01 and 2000-01-01.
5. Customers whose last name contains "se" or starts with "ma" (use regex).
6. Orders not shipped yet.
7. The 3 customers with the most points.
8. Items of order 2 with a `total_price` column, highest first.

### Answers

```sql
-- 1
SELECT name, unit_price, unit_price * 1.1 AS new_price FROM products;
-- 2
SELECT * FROM orders WHERE order_date >= '2026-01-01';
-- 3  (one row: product 5, 5 × 4.10 = 20.50)
SELECT * FROM order_items WHERE order_id = 6 AND quantity * unit_price > 20;
-- 4  (Elka and Thacher)
SELECT * FROM customers WHERE birth_date BETWEEN '1990-01-01' AND '2000-01-01';
-- 5
SELECT * FROM customers WHERE last_name REGEXP 'se|^ma';   -- MySQL
SELECT * FROM customers WHERE last_name ~* 'se|^ma';       -- PostgreSQL
-- 6  (orders 1, 4, 7, 10)
SELECT * FROM orders WHERE shipped_date IS NULL;
-- 7  (Clemmie, Elka, Freddi)
SELECT * FROM customers ORDER BY points DESC LIMIT 3;
-- 8
SELECT order_id, product_id, quantity, unit_price,
       quantity * unit_price AS total_price
FROM order_items
WHERE order_id = 2
ORDER BY total_price DESC;
```

---

## Part 3. Joins

A join lines up rows from two tables where a condition matches, usually FK = PK. Choose the type by asking: "Which rows must appear even when they have no match?"

| Join | Returns | Typical use |
|---|---|---|
| `JOIN` (= `INNER JOIN`) | Only rows that match in both tables | Orders with their customer |
| `LEFT JOIN` | Every row of the left table; NULLs where no match | All customers, with orders if any |
| `RIGHT JOIN` | Every row of the right table | Avoid: rewrite as LEFT JOIN |
| `FULL OUTER JOIN` | Every row of both | PostgreSQL only; in MySQL, LEFT JOIN UNION RIGHT JOIN |
| `CROSS JOIN` | Every combination | Sizes × colours |
| Self join | A table joined to itself | Employee and manager |

### 3.1 Inner join with aliases

```sql
SELECT o.order_id, o.order_date, c.first_name, c.last_name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id;
```

When a column exists in both tables, prefix it (`o.customer_id`) or you get an "ambiguous column" error.

### 3.2 Three or more tables

```sql
SELECT o.order_id, o.order_date, c.first_name, s.name AS status
FROM orders o
JOIN customers c      ON o.customer_id = c.customer_id
JOIN order_statuses s ON o.status = s.order_status_id;
```

Joining 5–10 tables is normal in reporting queries. Put each join on its own line.

### 3.3 LEFT JOIN: keep rows with no match

```sql
-- every customer, plus their orders and shipper if any
SELECT c.customer_id, c.first_name, o.order_id, sh.name AS shipper
FROM customers c
LEFT JOIN orders o    ON c.customer_id = o.customer_id
LEFT JOIN shippers sh ON o.shipper_id = sh.shipper_id
ORDER BY c.customer_id;
```

Once you LEFT JOIN a table, every later join that depends on it must also be LEFT. One INNER JOIN after it silently drops the unmatched rows again.

**The most common join bug in production:** a filter on the right-hand table placed in WHERE turns your LEFT JOIN back into an INNER JOIN.

```sql
-- WRONG: customers with no 2026 orders disappear
SELECT c.first_name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2026-01-01';

-- RIGHT: the filter goes in ON
SELECT c.first_name, o.order_id
FROM customers c
LEFT JOIN orders o
  ON c.customer_id = o.customer_id
 AND o.order_date >= '2026-01-01';
```

**Anti-join (rows with no match).** "Customers who never ordered" appears in almost every interview.

```sql
SELECT c.*
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;          -- customers 3, 4, 8
```

### 3.4 Self join

```sql
SELECT e.first_name AS employee, m.first_name AS manager
FROM employees e
LEFT JOIN employees m ON e.reports_to = m.employee_id;   -- LEFT keeps the CEO
```

Same table, two aliases. For an org chart of any depth, use a recursive CTE (Part 6).

### 3.5 Composite keys and USING

```sql
-- a notes table keyed by (order_id, product_id) needs both columns in the join
JOIN order_item_notes n
  ON oi.order_id = n.order_id AND oi.product_id = n.product_id

-- USING is shorthand when the column names are identical in both tables
SELECT o.order_id, sh.name
FROM orders o
LEFT JOIN shippers sh USING (shipper_id);
```

Avoid two shortcuts. `NATURAL JOIN` joins on every same-named column and breaks silently when someone adds `created_at` to both tables. Implicit joins (`FROM a, b WHERE ...`) become a cross join the day someone forgets the WHERE.

### 3.6 CROSS JOIN and UNION

```sql
SELECT sh.name AS shipper, p.name AS product
FROM shippers sh CROSS JOIN products p;           -- 3 × 6 = 18 rows

-- UNION stacks rows from queries with the same number of columns
SELECT order_id, order_date, 'Active' AS status
FROM orders WHERE order_date >= '2026-01-01'
UNION ALL
SELECT order_id, order_date, 'Archived'
FROM orders WHERE order_date < '2026-01-01';
```

`UNION` removes duplicates, which costs a sort. `UNION ALL` keeps them and is faster; use it unless you need de-duplication. Column names come from the first query.

**Real-world trap: fan-out.** Joining `orders` to `order_items` repeats each order once per item. Summing an order-level column (a shipping fee, say) after that join double-counts. Aggregate first, then join (Part 6, CTEs).

### Your turn

1. Each order item with the product name, quantity and the price actually paid.
2. All products with quantity ordered, including products never ordered.
3. Orders with date, customer first name, shipper (NULL if not shipped) and status name.
4. Products that have never been ordered.
5. Employees who earn more than their manager.

### Answers

```sql
-- 1  order_items.unit_price is the price paid, not today's price
SELECT oi.order_id, p.name, oi.quantity, oi.unit_price
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id;

-- 2  (Honey Jar shows NULL)
SELECT p.product_id, p.name, oi.quantity
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id;

-- 3
SELECT o.order_id, o.order_date, c.first_name AS customer,
       sh.name AS shipper, s.name AS status
FROM orders o
JOIN customers c      ON o.customer_id = c.customer_id
LEFT JOIN shippers sh ON o.shipper_id = sh.shipper_id
JOIN order_statuses s ON o.status = s.order_status_id;

-- 4
SELECT p.*
FROM products p
WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id);

-- 5  (Omar, 152000 vs Ravi, 150000)
SELECT e.first_name, e.salary, m.first_name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.reports_to = m.employee_id
WHERE e.salary > m.salary;
```

---

## Part 4. Changing data safely

Writes are where real damage happens, so build one habit now: run your WHERE as a SELECT first, then make the change inside a transaction you can roll back.

### 4.1 INSERT

```sql
-- one row: always name the columns
INSERT INTO customers (customer_id, first_name, last_name, city, state)
VALUES (9, 'John', 'Smith', 'Austin', 'TX');   -- points gets DEFAULT 0, phone gets NULL

-- many rows in one statement (much faster than one INSERT per row)
INSERT INTO shippers (shipper_id, name)
VALUES (4, 'Shipper A'), (5, 'Shipper B'), (6, 'Shipper C');

-- copy a table's structure + rows (keys, indexes and auto-increment are NOT copied)
CREATE TABLE orders_archive AS
SELECT * FROM orders WHERE order_date < '2026-01-01';
```

**Auto-generated ids.** The practice store uses plain INT keys so one script runs everywhere. Real apps let the database generate ids and read them back:

```sql
-- MySQL: column defined as  order_id INT AUTO_INCREMENT PRIMARY KEY
START TRANSACTION;
INSERT INTO orders (customer_id, order_date, status) VALUES (1, CURRENT_DATE, 1);
INSERT INTO order_items VALUES (LAST_INSERT_ID(), 1, 1, 18.50),
                               (LAST_INSERT_ID(), 2, 1, 6.25);
COMMIT;

-- PostgreSQL: column defined as  order_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
WITH new_order AS (
  INSERT INTO orders (customer_id, order_date, status)
  VALUES (1, CURRENT_DATE, 1)
  RETURNING order_id
)
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT order_id, 1, 1, 18.50 FROM new_order;
```

This parent-then-children pattern (an order and its items, a user and their settings) is everywhere. Wrap it in a transaction so you never get an order with no items.

### 4.2 UPDATE

```sql
-- one row
UPDATE customers SET phone = '555-0100' WHERE customer_id = 5;

-- many rows, using an expression
UPDATE customers SET points = points + 50 WHERE birth_date < '1990-01-01';

-- with a subquery: tag the orders of gold customers
UPDATE orders
SET comments = 'Gold customer'
WHERE customer_id IN (SELECT customer_id FROM customers WHERE points > 3000);

-- the same with a join (syntax differs)
-- MySQL
UPDATE orders o JOIN customers c ON o.customer_id = c.customer_id
SET o.comments = 'Gold customer'
WHERE c.points > 3000;
-- PostgreSQL
UPDATE orders o SET comments = 'Gold customer'
FROM customers c
WHERE o.customer_id = c.customer_id AND c.points > 3000;
```

- **MySQL Workbench safe mode** rejects UPDATE/DELETE whose WHERE does not use a key column. Turn it off in Preferences → SQL Editor → Safe Updates, then reconnect. Many developers keep it on deliberately.
- **MySQL error 1093:** you cannot UPDATE a table while selecting from the same table in a subquery. Use the JOIN form instead.
- `SET col = DEFAULT` resets a column to its default; `SET col = NULL` clears it.

### 4.3 DELETE, TRUNCATE, DROP

```sql
DELETE FROM order_items WHERE order_id = 10;   -- children first
DELETE FROM orders WHERE order_id = 10;        -- fails if items still point to it
```

| Command | Removes | WHERE allowed | Can roll back | Notes |
|---|---|---|---|---|
| `DELETE` | Chosen rows | Yes | Yes | Slow on huge tables; fires triggers |
| `TRUNCATE` | All rows | No | PostgreSQL yes, MySQL no | Very fast; resets auto-increment |
| `DROP TABLE` | Rows and the table itself | No | PostgreSQL yes, MySQL no | Gone, including indexes and grants |

### 4.4 Upsert: insert, or update if it exists

```sql
-- MySQL 8.0.19+
INSERT INTO products (product_id, name, quantity_in_stock, unit_price)
VALUES (3, 'Dark Chocolate Bar', 150, 2.99) AS new
ON DUPLICATE KEY UPDATE quantity_in_stock = new.quantity_in_stock;

-- PostgreSQL
INSERT INTO products (product_id, name, quantity_in_stock, unit_price)
VALUES (3, 'Dark Chocolate Bar', 150, 2.99)
ON CONFLICT (product_id)
DO UPDATE SET quantity_in_stock = EXCLUDED.quantity_in_stock;
```

Real uses: syncing records from an external API, counters, "last seen" timestamps. It also removes the race in "SELECT, then INSERT if missing", where two requests both see nothing and both insert.

### 4.5 The safe-change ritual

1. Write the WHERE as a `SELECT` and note the row count.
2. `BEGIN;` (works in both; MySQL also accepts `START TRANSACTION;`).
3. Run the UPDATE or DELETE. Compare "rows affected" with step 1.
4. `COMMIT;` if it matches, `ROLLBACK;` if not.
5. On production: have a **tested** backup (GitLab 2017 is why), copy affected rows to an archive table, and change big tables in batches (Cookbook 8).

### Your turn

1. Insert 3 new products in one statement.
2. Give 15 extra points to every customer born before 1990.
3. Create `orders_archive` holding all orders placed before 2026.
4. Upsert shipper 3 with the name "Swift Cargo Ltd" (insert it if missing).
5. Inside a transaction, delete order 10 and its items, check they are gone, then roll back and confirm they are back.

### Answers

```sql
-- 1
INSERT INTO products (product_id, name, quantity_in_stock, unit_price)
VALUES (7, 'Product 1', 10, 1.95), (8, 'Product 2', 20, 2.95), (9, 'Product 3', 30, 3.95);
-- 2
UPDATE customers SET points = points + 15 WHERE birth_date < '1990-01-01';
-- 3
CREATE TABLE orders_archive AS
SELECT * FROM orders WHERE order_date < '2026-01-01';
-- 4  MySQL
INSERT INTO shippers (shipper_id, name) VALUES (3, 'Swift Cargo Ltd') AS new
ON DUPLICATE KEY UPDATE name = new.name;
-- 4  PostgreSQL
INSERT INTO shippers (shipper_id, name) VALUES (3, 'Swift Cargo Ltd')
ON CONFLICT (shipper_id) DO UPDATE SET name = EXCLUDED.name;
-- 5
BEGIN;
DELETE FROM order_items WHERE order_id = 10;
DELETE FROM orders WHERE order_id = 10;
SELECT * FROM orders WHERE order_id = 10;   -- empty
ROLLBACK;
SELECT * FROM orders WHERE order_id = 10;   -- back again
```

---

## Part 5. Aggregation and reports

Aggregate functions collapse many rows into one number, and GROUP BY gives one number per group. Most dashboards are GROUP BY queries underneath.

| Function | Returns | NULL handling |
|---|---|---|
| `COUNT(*)` | Number of rows | Counts every row |
| `COUNT(col)` | Rows where `col` is not NULL | Skips NULLs |
| `COUNT(DISTINCT col)` | Number of different values | Skips NULLs |
| `SUM`, `AVG` | Total, mean | Skip NULLs (AVG of 10, NULL, 20 is 15) |
| `MIN`, `MAX` | Smallest, largest (numbers, dates, text) | Skip NULLs |

```sql
SELECT COUNT(*)                    AS orders,       -- 10
       COUNT(shipped_date)         AS shipped,      -- 6
       COUNT(DISTINCT customer_id) AS buyers,       -- 5
       MIN(order_date)             AS first_order,  -- 2025-03-11
       MAX(order_date)             AS last_order    -- 2026-04-18
FROM orders;
```

### 5.1 GROUP BY

```sql
-- revenue per customer
SELECT c.customer_id, c.first_name,
       SUM(oi.quantity * oi.unit_price) AS revenue
FROM customers c
JOIN orders o       ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY c.customer_id, c.first_name
ORDER BY revenue DESC;          -- Clemmie first with 98.98
```

**Rule:** every column in SELECT is either inside an aggregate or listed in GROUP BY. PostgreSQL always enforces this; MySQL enforces it through `ONLY_FULL_GROUP_BY`, on by default. Old tutorials that switch it off return random values from each group.

### 5.2 WHERE vs HAVING

```sql
SELECT c.customer_id, SUM(oi.quantity * oi.unit_price) AS revenue
FROM customers c
JOIN orders o       ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
WHERE c.state IN ('VA', 'FL')                   -- filters ROWS before grouping
GROUP BY c.customer_id
HAVING SUM(oi.quantity * oi.unit_price) > 50;   -- filters GROUPS after
```

Put every filter you can in WHERE: fewer rows reach the grouping step, so the query is faster.

### 5.3 CASE: if/else inside SQL

```sql
SELECT customer_id, first_name, points,
       CASE
         WHEN points > 3000  THEN 'Gold'
         WHEN points >= 2000 THEN 'Silver'
         ELSE 'Bronze'
       END AS tier
FROM customers
ORDER BY first_name;
```

One pass replaces the three-query UNION from the course exercise and reads the table once instead of three times.

### 5.4 Conditional aggregation (pivot)

```sql
SELECT COUNT(*)                                    AS total_orders,
       SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS processed,
       SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS shipped,
       SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS delivered
FROM orders;
-- PostgreSQL shortcut: COUNT(*) FILTER (WHERE status = 1) AS processed
```

### 5.5 Grouping by time

```sql
-- MySQL
SELECT DATE_FORMAT(o.order_date, '%Y-%m') AS month,
       SUM(oi.quantity * oi.unit_price)    AS revenue
FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY month ORDER BY month;

-- PostgreSQL
SELECT to_char(o.order_date, 'YYYY-MM')    AS month,
       SUM(oi.quantity * oi.unit_price)    AS revenue
FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY month ORDER BY month;
```

- **Subtotals and grand total:** MySQL `GROUP BY state WITH ROLLUP`; PostgreSQL `GROUP BY ROLLUP (state)`.
- **List values per group:** MySQL `GROUP_CONCAT(name ORDER BY name SEPARATOR ', ')`; PostgreSQL `STRING_AGG(name, ', ' ORDER BY name)`.
- **Trap: integer division.** `5 / 2` is 2.5000 in MySQL but 2 in PostgreSQL. Write `5 * 1.0 / 2` for percentages.

### Your turn

1. Number of orders per status **name**.
2. Monthly revenue for 2026 only.
3. Units sold per product, showing 0 (not NULL) for products never sold.
4. Customers with more than one order.
5. Per state: number of customers and average points, only states with 2+ customers.

### Answers

```sql
-- 1
SELECT s.name, COUNT(*) AS orders
FROM orders o JOIN order_statuses s ON o.status = s.order_status_id
GROUP BY s.name;

-- 2  (MySQL; in PostgreSQL use to_char as above)
SELECT DATE_FORMAT(o.order_date, '%Y-%m') AS month,
       SUM(oi.quantity * oi.unit_price)    AS revenue
FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.order_date >= '2026-01-01'
GROUP BY month ORDER BY month;

-- 3
SELECT p.product_id, p.name, COALESCE(SUM(oi.quantity), 0) AS units_sold
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.product_id
GROUP BY p.product_id, p.name
ORDER BY units_sold DESC;

-- 4  (customers 1, 2, 5, 6, 7 each have 2)
SELECT customer_id, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 1;

-- 5  (VA and FL)
SELECT state, COUNT(*) AS customers, ROUND(AVG(points), 0) AS avg_points
FROM customers
GROUP BY state
HAVING COUNT(*) >= 2;
```

---

## Part 6. Subqueries, CTEs and window functions

These three tools solve most "hard" interview questions: a subquery asks a question inside a question, a CTE names each step so long queries read top to bottom, and a window function ranks or totals rows without collapsing them. All of it works in MySQL 8.0+ and PostgreSQL.

### 6.1 Subqueries

```sql
-- scalar subquery: products priced above the average
SELECT name, unit_price
FROM products
WHERE unit_price > (SELECT AVG(unit_price) FROM products);

-- EXISTS: stops at the first match, and is NULL-safe
SELECT c.*
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);

-- correlated subquery: re-evaluated for each outer row
-- employees paid above their own department's average
SELECT e.first_name, e.department, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(x.salary)
                  FROM employees x
                  WHERE x.department = e.department);
```

IN, EXISTS and JOIN often compile to the same plan, so choose the clearest. The exception: use `NOT EXISTS` instead of `NOT IN` whenever the subquery column can be NULL.

### 6.2 CTEs (WITH): name your steps

```sql
WITH order_totals AS (
  SELECT order_id, SUM(quantity * unit_price) AS total
  FROM order_items
  GROUP BY order_id
),
customer_totals AS (
  SELECT o.customer_id, COUNT(*) AS orders, SUM(t.total) AS revenue
  FROM orders o
  JOIN order_totals t ON t.order_id = o.order_id
  GROUP BY o.customer_id
)
SELECT c.first_name, ct.orders, ct.revenue,
       ROUND(ct.revenue / ct.orders, 2) AS avg_order_value
FROM customer_totals ct
JOIN customers c ON c.customer_id = ct.customer_id
ORDER BY ct.revenue DESC;
```

This is also the cure for fan-out: aggregate at the right level first, then join.

**Recursive CTE: walk a tree of any depth.**

```sql
WITH RECURSIVE chain AS (
  SELECT employee_id, first_name, reports_to, 1 AS level
  FROM employees
  WHERE reports_to IS NULL                    -- start at the CEO
  UNION ALL
  SELECT e.employee_id, e.first_name, e.reports_to, c.level + 1
  FROM employees e
  JOIN chain c ON e.reports_to = c.employee_id
)
SELECT * FROM chain ORDER BY level, employee_id;
```

Real uses: category trees, threaded comments, folders, bills of materials, and generating a calendar of dates.

### 6.3 Window functions

The pattern is `function() OVER (PARTITION BY group ORDER BY sort)`. Unlike GROUP BY, every row stays in the result.

| Function | Gives | Salaries 95k, 95k, 72k get |
|---|---|---|
| `ROW_NUMBER()` | 1, 2, 3… always unique | 1, 2, 3 |
| `RANK()` | Rank with gaps after ties | 1, 1, 3 |
| `DENSE_RANK()` | Rank without gaps | 1, 1, 2 |
| `LAG(col)`, `LEAD(col)` | Previous / next row's value | — |
| `SUM(col) OVER (ORDER BY …)` | Running total | — |
| `NTILE(4)` | Quartile bucket 1–4 | — |

```sql
-- top 2 salaries per department
-- (filter in an outer query: window functions run after WHERE)
SELECT *
FROM (
  SELECT first_name, department, salary,
         DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk <= 2;

-- latest order per customer
SELECT *
FROM (
  SELECT o.*,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
  FROM orders o
) x
WHERE rn = 1;

-- monthly revenue, running total, and change vs previous month
WITH monthly AS (
  SELECT DATE_FORMAT(o.order_date, '%Y-%m') AS month,   -- PostgreSQL: to_char(o.order_date, 'YYYY-MM')
         SUM(oi.quantity * oi.unit_price)  AS revenue
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  GROUP BY month
)
SELECT month, revenue,
       SUM(revenue) OVER (ORDER BY month)                    AS running_total,
       revenue - LAG(revenue) OVER (ORDER BY month)          AS change,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / LAG(revenue) OVER (ORDER BY month), 1)        AS change_pct
FROM monthly
ORDER BY month;
```

**Interview classic: Nth highest salary.**

```sql
-- second highest (152000)
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Nth highest, tie-safe (N = 3 gives 150000)
SELECT DISTINCT salary
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS r FROM employees) t
WHERE r = 3;
```

### 6.4 Views: save a query under a name

```sql
CREATE VIEW customer_revenue AS
SELECT o.customer_id, SUM(oi.quantity * oi.unit_price) AS revenue
FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY o.customer_id;

SELECT * FROM customer_revenue WHERE revenue > 50;
```

A view stores the query, not the data, so it is always current. PostgreSQL also has `CREATE MATERIALIZED VIEW`, which stores the result until refreshed: ideal for heavy dashboards. MySQL has no materialized views; teams use a summary table refreshed by a scheduled job.

### Your turn

1. Customers who spent more than the average customer.
2. Rank products by units sold; ties share a rank and there are no gaps.
3. For each order, the number of days since that customer's previous order.
4. Generate every date in March 2026.

### Answers

```sql
-- 1  (customers 5 and 6)
WITH spend AS (
  SELECT o.customer_id, SUM(oi.quantity * oi.unit_price) AS total
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  GROUP BY o.customer_id
)
SELECT * FROM spend WHERE total > (SELECT AVG(total) FROM spend);

-- 2  (Coffee Beans and Oat Cookies tie at 9 units)
SELECT p.name,
       COALESCE(SUM(oi.quantity), 0) AS units,
       DENSE_RANK() OVER (ORDER BY COALESCE(SUM(oi.quantity), 0) DESC) AS rnk
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.product_id
GROUP BY p.product_id, p.name;

-- 3  MySQL
SELECT customer_id, order_id, order_date,
       DATEDIFF(order_date,
                LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)) AS days_since_prev
FROM orders;
-- 3  PostgreSQL (date minus date = days)
SELECT customer_id, order_id, order_date,
       order_date - LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS days_since_prev
FROM orders;

-- 4  MySQL
WITH RECURSIVE days AS (
  SELECT DATE '2026-03-01' AS d
  UNION ALL
  SELECT d + INTERVAL 1 DAY FROM days WHERE d < '2026-03-31'
)
SELECT d FROM days;
-- 4  PostgreSQL
SELECT generate_series(DATE '2026-03-01', DATE '2026-03-31', INTERVAL '1 day')::date AS d;
```

---

## Part 7. Schema design

A good schema makes wrong data impossible: pick the right type, add constraints so the database rejects bad rows, and store each fact in exactly one place. Fixing a bad schema after launch is the most expensive change in a project.

### 7.1 Choosing data types

| Data | Use | Avoid | Why |
|---|---|---|---|
| Ids | `INT`; `BIGINT` for fast-growing tables | — | INT tops out near 2.1 billion; changing later rewrites the table |
| Money | `DECIMAL(12,2)` / `NUMERIC` | `FLOAT`, `DOUBLE` | Floats round: 0.1 + 0.2 is not exactly 0.3 |
| Short text | `VARCHAR(n)` | `CHAR(n)` except fixed codes | In PostgreSQL, `TEXT` is just as fast |
| Yes / no | `BOOLEAN` | `'Y'`/`'N'` strings | MySQL stores it as `TINYINT(1)` |
| Calendar date | `DATE` | Strings | Strings sort and compare wrongly |
| Point in time | MySQL `DATETIME`; PostgreSQL `TIMESTAMPTZ` | Local time without a zone | Store UTC. MySQL `TIMESTAMP` ends in 2038 |
| Flexible attributes | MySQL `JSON`; PostgreSQL `JSONB` | JSON for core relational data | JSON skips constraints and is harder to join |
| Public ids in URLs | `UUID` (PostgreSQL native; MySQL `BINARY(16)`) | Sequential ids in URLs | Hides your row counts, safe to merge |
| Embeddings (AI) | PostgreSQL `vector` (pgvector); MySQL 9 `VECTOR` | Storing them in a separate system by default | Keeps search next to your data and permissions |

### 7.2 Constraints: let the database say no

```sql
-- PostgreSQL
CREATE TABLE users (
  user_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  full_name  VARCHAR(100) NOT NULL,
  age        INT CHECK (age >= 13),
  status     VARCHAR(20)  NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- MySQL
CREATE TABLE users (
  user_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  full_name  VARCHAR(100) NOT NULL,
  age        INT CHECK (age >= 13),            -- enforced since MySQL 8.0.16
  status     VARCHAR(20)  NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- foreign key with an ON DELETE rule (both databases)
CREATE TABLE posts (
  post_id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title   VARCHAR(200) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);
```

| ON DELETE | What happens to children | Use for |
|---|---|---|
| `RESTRICT` / `NO ACTION` (default) | Parent delete is blocked | Important history: a customer's orders |
| `CASCADE` | Children are deleted too | Owned parts: an order's items |
| `SET NULL` | Children stay, link is cleared | Optional links: a task's assignee |

**Index your foreign keys.** MySQL (InnoDB) creates an index on each FK column automatically. PostgreSQL does not, so joins and parent deletes get slow until you add one.

### 7.3 Changing a live schema

```sql
ALTER TABLE customers ADD COLUMN email VARCHAR(255);
ALTER TABLE customers DROP COLUMN phone;
ALTER TABLE customers MODIFY first_name VARCHAR(100) NOT NULL;           -- MySQL
ALTER TABLE customers ALTER COLUMN first_name TYPE VARCHAR(100);         -- PostgreSQL
```

- Keep every change in versioned migration files (Flyway, Liquibase, Alembic, Prisma, Rails or Laravel migrations), never ad-hoc on production.
- Prefer additive steps on big tables: add a nullable column → backfill in batches → then add NOT NULL or the constraint.
- Make every migration reversible, as Figma did with its sharding work: a rollback plan is part of the change.
- PostgreSQL runs DDL inside transactions, so a failed migration rolls back cleanly. MySQL commits each DDL statement immediately.

### 7.4 Normalization in plain words

**Before:** one wide table, the way spreadsheets grow.

| order_id | customer_name | customer_email | products | total |
|---|---|---|---|---|
| 1 | Elka Twiddell | elka@mail.com | Coffee, Chocolate | 48.96 |
| 9 | Elka Twiddell | elka@mail.com | Coffee | 37.00 |

It breaks three ways: Elka's email is stored twice (update anomaly), "products" holds a list in one cell (unqueryable), and `total` can drift from the real items.

- **1NF:** one value per cell, no repeating columns. No `phone1, phone2, phone3`; no comma lists in a cell.
- **2NF:** with a composite key, every column depends on the *whole* key. In `order_items (order_id, product_id)`, a `product_name` column depends only on `product_id`, so it belongs in `products`.
- **3NF:** non-key columns depend only on the key, not on each other. `city_population` depends on `city`, so it belongs in a `cities` table.

**After:** `customers`, `orders`, `products`, `order_items`: exactly the practice store. Rule of thumb: every fact lives in one place.

**When to denormalize on purpose:** read-heavy reports (summary tables), counters such as `posts.comment_count`, and snapshots that must not change, such as `order_items.unit_price`. Always keep a way to rebuild or sync the copy.

### 7.5 Design checklist for any new feature

- Nouns become tables; links between them become foreign keys or junction tables.
- Every table has a primary key; use a surrogate id unless a natural key truly never changes.
- NOT NULL by default; allow NULL only when "unknown" is a real state.
- UNIQUE constraints for business rules: one email per user, one `(user_id, product_id)` per cart.
- A foreign key on every relationship, with a deliberate ON DELETE rule.
- `created_at` and `updated_at` on most tables; `deleted_at` if you soft-delete.
- Indexes for the queries you will actually run (Part 8).
- One naming convention: snake_case, consistently singular or plural table names.
- If you think you need a different database for one feature (documents, search, vectors), first check whether PostgreSQL or MySQL already does it well enough. Twenty years of convergence say it often does.

### Your turn

Design the tables for a movie-ticket booking app: movies, theatres, screens, seats, shows and bookings. One rule is non-negotiable: a seat can never be sold twice for the same show.

### Answer (one good design)

```sql
CREATE TABLE movies   (movie_id INT PRIMARY KEY, title VARCHAR(200) NOT NULL, duration_min INT NOT NULL);
CREATE TABLE theatres (theatre_id INT PRIMARY KEY, name VARCHAR(100) NOT NULL, city VARCHAR(50) NOT NULL);
CREATE TABLE screens  (screen_id INT PRIMARY KEY, theatre_id INT NOT NULL, name VARCHAR(20) NOT NULL,
                       FOREIGN KEY (theatre_id) REFERENCES theatres (theatre_id));
CREATE TABLE seats    (seat_id INT PRIMARY KEY, screen_id INT NOT NULL, seat_row CHAR(2) NOT NULL, seat_no INT NOT NULL,
                       UNIQUE (screen_id, seat_row, seat_no),
                       FOREIGN KEY (screen_id) REFERENCES screens (screen_id));
CREATE TABLE shows    (show_id INT PRIMARY KEY, movie_id INT NOT NULL, screen_id INT NOT NULL,
                       starts_at TIMESTAMP NOT NULL, price DECIMAL(8,2) NOT NULL,
                       FOREIGN KEY (movie_id) REFERENCES movies (movie_id),
                       FOREIGN KEY (screen_id) REFERENCES screens (screen_id));
CREATE TABLE bookings (booking_id INT PRIMARY KEY, user_id INT NOT NULL, show_id INT NOT NULL,
                       status VARCHAR(20) NOT NULL DEFAULT 'confirmed', created_at TIMESTAMP NOT NULL,
                       FOREIGN KEY (show_id) REFERENCES shows (show_id));
CREATE TABLE booking_seats (
  booking_id INT NOT NULL,
  show_id    INT NOT NULL,
  seat_id    INT NOT NULL,
  PRIMARY KEY (booking_id, seat_id),
  UNIQUE (show_id, seat_id),          -- the rule: one sale per seat per show
  FOREIGN KEY (booking_id) REFERENCES bookings (booking_id),
  FOREIGN KEY (seat_id)    REFERENCES seats (seat_id)
);
```

The `UNIQUE (show_id, seat_id)` constraint is the real protection. Even if two requests arrive in the same millisecond, the database lets only one insert succeed. Application checks alone cannot guarantee that.

---

## Part 8. Indexes, performance and maintenance

Most slow queries in growing apps are fixed by two things: the right index, and a query written so the database can use it. Learn to read EXPLAIN and you diagnose problems instead of guessing.

### 8.1 What an index is

An index is a sorted copy of one or more columns with pointers back to the rows, like the index at the back of a book. Both databases use B-tree indexes by default. Without a usable index the database reads every row (a full table scan); with one, it jumps straight to the matches.

Indexes are not free. Every INSERT, UPDATE and DELETE must also update each index, and indexes use disk and memory. (Uber's 2016 write-amplification complaint was exactly this cost, multiplied by heavy updates.) Index for the queries you actually run, not for every column.

### 8.2 Create, inspect, drop

```sql
CREATE INDEX idx_orders_customer      ON orders (customer_id);
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);   -- composite
CREATE UNIQUE INDEX idx_users_email   ON users (email);

SHOW INDEX FROM orders;                    -- MySQL
\d orders                                  -- PostgreSQL (psql)

DROP INDEX idx_orders_customer ON orders;  -- MySQL
DROP INDEX idx_orders_customer;            -- PostgreSQL
```

On a busy production table, PostgreSQL's `CREATE INDEX CONCURRENTLY` builds the index without blocking writes; MySQL's InnoDB builds most secondary indexes online by default.

### 8.3 Reading EXPLAIN

```sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 5;          -- the plan
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 5;  -- runs it, shows real time
```

`EXPLAIN ANALYZE` exists in PostgreSQL and in MySQL 8.0.18+. It really runs the statement, so wrap UPDATE or DELETE in `BEGIN … ROLLBACK`.

| What you see | MySQL | PostgreSQL | Meaning |
|---|---|---|---|
| Full scan | `type: ALL` | `Seq Scan` | Reads the whole table |
| Index used | `type: ref`, `range` or `const`; `key: idx_…` | `Index Scan`, `Bitmap Index Scan` | Good |
| Covering index | `Extra: Using index` | `Index Only Scan` | Answered from the index alone: best |
| Extra sort | `Extra: Using filesort` | `Sort` node | An index matching ORDER BY can remove it |
| Bad estimates | `rows` far from reality | `rows=` estimate vs actual differ a lot | Stale statistics: `ANALYZE TABLE t;` / `ANALYZE t;` |

On tiny tables the planner often picks a full scan anyway, because reading 10 rows is cheaper than using an index. To see indexes matter, load a million rows (Project 3).

### 8.4 Rules that make or break an index

- **Leftmost prefix.** An index on `(customer_id, order_date)` helps `WHERE customer_id = 5` and `WHERE customer_id = 5 AND order_date > '2026-01-01'`. It does not help `WHERE order_date > '2026-01-01'` alone.
- **Equality columns first, range column last** in a composite index.
- **Never wrap the indexed column in a function:**

```sql
WHERE YEAR(order_date) = 2026                                  -- cannot use the index
WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01' -- can
```

If you must search on an expression, index the expression: PostgreSQL `CREATE INDEX ON users (LOWER(email));`, MySQL 8.0.13+ `CREATE INDEX idx_email_lower ON users ((LOWER(email)));`.

- **No leading wildcard.** `LIKE 'son%'` can use an index; `LIKE '%son'` cannot. For real search, use full-text (Cookbook 10).
- **Match types.** Comparing a VARCHAR column to a number (`WHERE phone = 5550100`) forces MySQL to convert every row and skip the index. Quote the value.
- **Low-selectivity columns** (booleans, a 3-value status) rarely help on their own. Use them inside a composite index, or as a PostgreSQL partial index: `CREATE INDEX ON orders (order_date) WHERE shipped_date IS NULL;`
- **Covering indexes** hold every column a query needs, so the table is never touched. PostgreSQL can add payload columns: `CREATE INDEX ON orders (customer_id) INCLUDE (order_date, status);`

### 8.5 Slow-query checklist for production

1. **Find it.** MySQL: slow query log (`long_query_time`) and `performance_schema`. PostgreSQL: the `pg_stat_statements` extension and `log_min_duration_statement`.
2. **EXPLAIN ANALYZE** it with realistic parameters.
3. **Look for** full scans on big tables, extra sorts, and large estimate-vs-actual gaps.
4. **Fix in this order:** rewrite the query (index-friendly WHERE, fewer columns) → add or adjust an index → refresh statistics → change the schema (summary table, partitioning) → cache.
5. **Measure again** and keep the before/after numbers. They make strong interview stories.

### 8.6 Application-level performance killers

- **N+1 queries:** code loads 100 orders, then runs 100 more queries for their customers. Use a JOIN or your ORM's eager loading (`include`, `select_related`, `with`).
- **`SELECT *`** dragging large TEXT or JSON columns you never display.
- **Deep OFFSET pagination** (Cookbook 3).
- **No connection pool:** opening connections is expensive, and PostgreSQL starts a process per connection. Use a pool such as HikariCP, PgBouncer or ProxySQL.
- **Long-running transactions:** they hold locks and stop cleanup of old row versions (next section).

### 8.7 Maintenance: the part that caused real outages

Both databases use MVCC: an UPDATE writes a new row version and keeps the old one for transactions that might still need it. Something must clean up old versions later. When cleanup falls behind, tables bloat and, in PostgreSQL's worst case, writes stop (Sentry, 2015).

**PostgreSQL: VACUUM and transaction-ID age.** Autovacuum removes dead rows and "freezes" old transaction IDs. Transaction IDs are 32-bit, so PostgreSQL refuses new writes before the counter can wrap around (near 2 billion). Forced anti-wraparound vacuums start at `autovacuum_freeze_max_age`, 200 million by default.

```sql
-- how old is the oldest unfrozen transaction ID in each database?
SELECT datname, age(datfrozenxid) AS xid_age
FROM pg_database
ORDER BY xid_age DESC;

-- tables with the most dead rows, and when autovacuum last ran
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 10;

-- long transactions that block cleanup
SELECT pid, now() - xact_start AS running_for, state, left(query, 60) AS query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY xact_start
LIMIT 10;
```

Alert when `xid_age` keeps climbing well past a few hundred million, or when dead rows pile up on a hot table. Avoid `VACUUM FULL` on production: it locks the table. Tools like `pg_repack` rebuild bloated tables online.

**MySQL (InnoDB): purge and long transactions.** InnoDB keeps old versions in undo logs, and a purge thread removes them. A transaction left open for hours makes the "history list" grow and everything slow down.

```sql
-- long-running InnoDB transactions
SELECT trx_id, trx_started,
       TIMESTAMPDIFF(SECOND, trx_started, NOW()) AS seconds_open,
       trx_query
FROM information_schema.innodb_trx
ORDER BY trx_started
LIMIT 10;
-- SHOW ENGINE INNODB STATUS\G  →  look for "History list length"
```

The habit in both: keep transactions short, never leave a session "idle in transaction", and keep statistics fresh with `ANALYZE`.

### Your turn

1. Which index best serves `WHERE customer_id = ? AND order_date >= ? ORDER BY order_date`?
2. Rewrite `WHERE DATE(created_at) = '2026-03-14'` so it can use an index on `created_at`.
3. A query uses `WHERE LOWER(email) = ?` and is slow. Give two fixes.
4. In PostgreSQL, a table's dead rows keep growing and autovacuum never seems to finish. What do you check first?

### Answers

1. `(customer_id, order_date)`: equality column first, then the range column, which also serves the ORDER BY.
2. `WHERE created_at >= '2026-03-14' AND created_at < '2026-03-15'`.
3. Add an expression index on `LOWER(email)`, or store emails lower-cased at write time and query `WHERE email = ?`. In PostgreSQL, the `citext` type is a third option.
4. Long-running or idle-in-transaction sessions in `pg_stat_activity`: an old open transaction stops VACUUM from removing rows that it might still see.

---

## Part 9. Transactions, isolation, locking and replication

A transaction makes several statements succeed or fail as one unit, the isolation level decides what concurrent transactions see of each other, and replication decides what survives when a server dies. Backend and senior interviews spend most of their time here.

### 9.1 ACID

| Letter | Promise | Example |
|---|---|---|
| Atomicity | All or nothing | The debit and the credit both happen, or neither does |
| Consistency | Constraints always hold | A CHECK (balance >= 0) is never violated |
| Isolation | Concurrent work does not corrupt each other | Two buyers race for the last ticket; one wins cleanly |
| Durability | Committed means it survives a crash | Written to the redo log (MySQL) or WAL (PostgreSQL) first |

### 9.2 Transfer money safely

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100
WHERE account_id = 1 AND balance >= 100;   -- check and change in ONE statement
-- application: if rows affected = 0 → ROLLBACK (insufficient funds)
UPDATE accounts SET balance = balance + 100
WHERE account_id = 2;
COMMIT;
```

Putting `balance >= 100` inside the UPDATE removes the race in "SELECT the balance, then UPDATE it", where two requests both see enough money. Both databases autocommit each statement unless you open a transaction. In app code, use your driver's transaction API and always roll back on error.

### 9.3 Isolation levels

- **Dirty read:** you see another transaction's uncommitted change.
- **Non-repeatable read:** you read the same row twice and get different values.
- **Phantom:** you run the same query twice and new rows appear.

| Level | Dirty read | Non-repeatable read | Phantom | Default in |
|---|---|---|---|---|
| READ UNCOMMITTED | Possible | Possible | Possible | Neither (PostgreSQL treats it as READ COMMITTED) |
| READ COMMITTED | No | Possible | Possible | PostgreSQL |
| REPEATABLE READ | No | No in PostgreSQL; MySQL can show it (Part 13) | Allowed by the standard; plain reads usually hide them | MySQL (InnoDB) |
| SERIALIZABLE | No | No | No | Neither |

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;   -- before the transaction's first query
```

At PostgreSQL's REPEATABLE READ and SERIALIZABLE levels, a conflicting transaction fails with SQLSTATE `40001`, and your code must retry it.

**Warning:** this table is the textbook view. Independent testing (Jepsen) shows real databases deliver less than the names promise, including lost updates under both databases' defaults. Part 13 has the evidence and two-terminal demos.

### 9.4 Locking patterns

**Pessimistic: lock first, then change.** Use it when conflicts are likely (stock, seats, balances).

```sql
BEGIN;
SELECT quantity_in_stock FROM products WHERE product_id = 3 FOR UPDATE;  -- row locked
-- application checks stock >= requested quantity
UPDATE products SET quantity_in_stock = quantity_in_stock - 2 WHERE product_id = 3;
COMMIT;                                                                   -- lock released
```

**Optimistic: detect conflicts with a version column.** Use it when conflicts are rare (editing a profile or a document).

```sql
UPDATE products
SET unit_price = 3.25, version = version + 1
WHERE product_id = 3 AND version = 7;
-- 0 rows updated = someone changed it first: reload, show the user, retry
```

**Deadlocks** happen when two transactions each wait for a lock the other holds; the database kills one. Lock rows in a consistent order (for example by id), keep transactions short, and retry on the deadlock error (MySQL 1213, PostgreSQL `40P01`).

**Never** wait for user input, call an external API, or send email inside an open transaction. Locks stay held for the whole wait.

### 9.5 Replication, failover and recovery

Almost every production database runs as a **primary** that takes writes plus one or more **replicas** that copy its changes and serve reads.

- **Replication is usually asynchronous**, so replicas lag behind. A user who saves a profile and immediately reads from a replica may see old data. Fix: read your own recent writes from the primary.
- **A replica is not a backup.** An accidental `DELETE` replicates to every replica within seconds. Backups plus point-in-time recovery (MySQL binlogs, PostgreSQL WAL archiving) let you rewind to just before the mistake.
- **Failover** promotes a replica when the primary dies. Done automatically across regions, it can create **split brain**: two servers both accepting writes. That is what turned a 43-second network cut into a 24-hour degradation at GitHub in 2018.
- **Two numbers define your recovery plan.** RPO (recovery point objective) is how much data you can afford to lose; RTO (recovery time objective) is how long you can be down. GitLab's 2017 incident was an RPO failure (hours of data lost); GitHub's was an RTO problem (restoring terabytes took hours).
- **Synchronous replication** waits for a replica to confirm each commit: no data loss on failover, at the cost of slower writes.

```sql
-- MySQL replica: how far behind is it?
SHOW REPLICA STATUS\G          -- look at Seconds_Behind_Source (MySQL 8.0.22+ naming)

-- PostgreSQL primary: lag per replica
SELECT client_addr, state, write_lag, flush_lag, replay_lag
FROM pg_stat_replication;

-- PostgreSQL replica: time since the last replayed transaction
SELECT now() - pg_last_xact_replay_timestamp() AS replication_delay;
```

### Your turn (two terminal windows)

1. In window A: `BEGIN; UPDATE products SET quantity_in_stock = 1 WHERE product_id = 1;` and do not commit. In window B, run the same UPDATE. What happens? Now COMMIT in A.
2. In A: `BEGIN;` then `SELECT unit_price FROM products WHERE product_id = 2;`. In B, update that price and commit. Run A's SELECT again. Try it once under READ COMMITTED and once under REPEATABLE READ.
3. Your company says "we have three replicas, so we don't need backups." Reply in two sentences.

### Answers

1. B blocks: it waits for A's row lock. When A commits, B's UPDATE runs immediately. If A waited long enough, B would fail with a lock-wait timeout.
2. Under READ COMMITTED, A's second SELECT shows the new price (a non-repeatable read). Under REPEATABLE READ, A keeps seeing the old price until its transaction ends.
3. Replicas copy mistakes as fast as they copy good data, so a bad DELETE or a corrupting bug reaches all three in seconds. Only backups with point-in-time recovery, restored and tested regularly, let you go back to before the mistake.

---

## Part 10. Real-world cookbook (14 recipes)

These recipes cover problems developers meet every week in production apps. Each gives the pattern for MySQL and PostgreSQL; adapt the table names to your project.

### 1. Find and remove duplicates

```sql
-- find
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

-- keep the lowest id, delete the rest
-- MySQL
DELETE u FROM users u
JOIN users keep ON u.email = keep.email AND u.user_id > keep.user_id;
-- PostgreSQL
DELETE FROM users u
USING users keep
WHERE u.email = keep.email AND u.user_id > keep.user_id;
```

Then add `UNIQUE (email)` so it cannot happen again. A cleanup without a constraint is a cleanup you will repeat.

### 2. Latest row per group

Use `ROW_NUMBER()` partitioned by the group (Part 6.3). PostgreSQL also has a shortcut:

```sql
SELECT DISTINCT ON (customer_id) *
FROM orders
ORDER BY customer_id, order_date DESC;
```

### 3. Fast pagination on big tables (keyset)

```sql
-- page 1
SELECT order_id, order_date FROM orders ORDER BY order_id DESC LIMIT 20;

-- next page: pass the last id the client saw (say 981)
SELECT order_id, order_date FROM orders
WHERE order_id < 981
ORDER BY order_id DESC
LIMIT 20;

-- sorting by a non-unique column: add the id as a tie-breaker
SELECT order_id, order_date FROM orders
WHERE (order_date, order_id) < ('2026-03-14', 8)
ORDER BY order_date DESC, order_id DESC
LIMIT 20;
```

This stays fast on page 10,000 because the index seeks straight to the start point instead of skipping rows. The trade-off: no "jump to page 57". It is how infinite-scroll feeds work.

### 4. Reports with missing days filled in as zero

```sql
-- PostgreSQL
SELECT d.dt::date AS day,
       COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue
FROM generate_series(DATE '2026-02-01', DATE '2026-02-28', INTERVAL '1 day') AS d(dt)
LEFT JOIN orders o       ON o.order_date = d.dt::date
LEFT JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY d.dt
ORDER BY d.dt;

-- MySQL: build the calendar with a recursive CTE
WITH RECURSIVE days AS (
  SELECT DATE '2026-02-01' AS dt
  UNION ALL
  SELECT dt + INTERVAL 1 DAY FROM days WHERE dt < '2026-02-28'
)
SELECT days.dt AS day,
       COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue
FROM days
LEFT JOIN orders o       ON o.order_date = days.dt
LEFT JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY days.dt
ORDER BY days.dt;
```

Without this, charts silently skip days with no sales and the trend line lies.

### 5. Customers at risk: no order in 90 days

```sql
SELECT c.customer_id, c.first_name, MAX(o.order_date) AS last_order
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.first_name
HAVING MAX(o.order_date) IS NULL
    OR MAX(o.order_date) < CURRENT_DATE - INTERVAL 90 DAY;       -- MySQL
-- PostgreSQL: CURRENT_DATE - INTERVAL '90 days'
```

### 6. Job queue workers that never grab the same job

```sql
BEGIN;
SELECT job_id, payload
FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 10
FOR UPDATE SKIP LOCKED;       -- other workers skip rows locked here
-- process the jobs, then:
UPDATE jobs SET status = 'done' WHERE job_id IN (/* ids from above */);
COMMIT;
```

Works in MySQL 8.0+ and PostgreSQL. Many teams run background jobs this way before adding a separate queue system.

### 7. Soft delete with "email unique among active users"

```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL;

-- PostgreSQL: partial unique index
CREATE UNIQUE INDEX uq_active_email ON users (email) WHERE deleted_at IS NULL;

-- MySQL: no partial indexes, but UNIQUE ignores NULLs, so index a generated column
ALTER TABLE users
  ADD COLUMN active_email VARCHAR(255)
    GENERATED ALWAYS AS (CASE WHEN deleted_at IS NULL THEN email END) STORED,
  ADD UNIQUE INDEX uq_active_email (active_email);
```

Every query must now add `WHERE deleted_at IS NULL`. Create a view such as `active_users` so nobody forgets.

### 8. Change millions of rows without freezing the app

```sql
-- MySQL: repeat until 0 rows are affected
DELETE FROM logs WHERE created_at < '2025-01-01' LIMIT 5000;

-- PostgreSQL: DELETE has no LIMIT, so pick a batch by key
DELETE FROM logs
WHERE log_id IN (SELECT log_id FROM logs WHERE created_at < '2025-01-01' LIMIT 5000);
```

Run it in a loop from a script with a short pause between batches. Each batch commits quickly, so locks, replica lag and (in PostgreSQL) dead rows stay small. For data you purge on a schedule, partition the table by month and drop old partitions instead.

### 9. Track who changed what, and when

```sql
-- MySQL: updated_at maintains itself
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

-- PostgreSQL: a small trigger
CREATE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

For a full history, add an `audit_log (table_name, row_id, changed_by, changed_at, old_values JSON, new_values JSON)` table written by the app or by triggers.

### 10. Search

```sql
-- MySQL
ALTER TABLE products ADD FULLTEXT INDEX ft_name (name);
SELECT * FROM products WHERE MATCH(name) AGAINST ('chocolate');

-- PostgreSQL
CREATE INDEX idx_products_fts ON products USING GIN (to_tsvector('english', name));
SELECT * FROM products
WHERE to_tsvector('english', name) @@ plainto_tsquery('english', 'chocolate');
```

`LIKE 'term%'` handles prefixes, built-in full-text search covers most apps, and typo-tolerant search at scale moves to a search engine such as OpenSearch or Meilisearch. For "find similar items" (AI embeddings), PostgreSQL's pgvector adds a `vector` column type and similarity indexes.

### 11. Time zones and money

- Store timestamps in UTC; convert to the user's zone only for display. PostgreSQL: `TIMESTAMPTZ`. MySQL: `TIMESTAMP` converts using the session time zone, while `DATETIME` stores exactly what you give it, so pick one rule and document it.
- Store money as `DECIMAL`, and keep the currency in its own column if you sell in more than one.

### 12. Security: injection, privileges, secrets

```python
# safe: the driver sends the value separately from the SQL
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))

# SQL injection: never build SQL by pasting user input into a string
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")
```

```sql
-- give the app only what it needs
-- MySQL
CREATE USER 'app'@'%' IDENTIFIED BY 'use-a-strong-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON practice_store.* TO 'app'@'%';
-- PostgreSQL
CREATE ROLE app LOGIN PASSWORD 'use-a-strong-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app;
```

- Table and column names cannot be parameters. If users choose a sort column, map their choice to an allow-list in code (`{"newest": "created_at"}`), never paste it in.
- Keep credentials in a secrets manager or environment variables, never in the repository.
- Patch the database and every product that talks to it. The 2023 MOVEit breach was SQL injection in a vendor product, not in the victims' own code.

### 13. Prove your backups restore

A backup counts only after you have restored it. GitLab learned this in 2017. After that incident, one widely shared practice was a daily job that spins up a fresh server, restores the latest dump, and runs integrity checks.

```bash
# PostgreSQL: dump, restore into a scratch database, sanity-check, clean up
pg_dump -Fc -d practice_store -f store.dump
createdb restore_test
pg_restore -d restore_test store.dump
psql -d restore_test -c "SELECT COUNT(*) FROM orders;"
dropdb restore_test

# MySQL
mysqldump --single-transaction --routines practice_store > store.sql
mysql -e "CREATE DATABASE restore_test"
mysql restore_test < store.sql
mysql -e "SELECT COUNT(*) FROM restore_test.orders"
mysql -e "DROP DATABASE restore_test"
```

- Schedule it, and alert if the newest backup is older than expected or the restore fails.
- Record how long the restore takes. That number is your real RTO, not the one in the slide deck.
- Large databases use physical backups and point-in-time recovery (managed snapshots, pgBackRest, Percona XtraBackup); test those the same way.

### 14. Read from replicas without surprising users

```text
write request          → primary
read right after write → primary (same session, for a few seconds)
other reads            → replica, only if its lag is below your limit (say 1–2 s)
replica too far behind → fall back to primary
```

- Check lag with the queries in Part 9.5 and export it to monitoring.
- Never let two servers accept writes for the same data. Prefer manual or well-fenced failover across regions, and rehearse it in staging.
- Write down the promotion steps before you need them; GitHub's 2018 incident shows how fast a small network blip escalates.

---

## Deep Research Edition: Parts 11–17

Parts 0–10 teach SQL and how databases work. Parts 11–17 go where courses rarely go: how real databases actually fail, which limits explode years later, what isolation levels really guarantee under independent testing, and how to change a live schema without downtime. Every surprising claim marked **[verified in our lab]** was reproduced on PostgreSQL 16 while writing this book; everything else links to a primary source in the Sources list.

---

## Part 11. The Database Failure Atlas (2015–2025)

Fourteen public incident reports and engineering write-ups, read side by side and classified by root cause. The "control that helps" column is this book's analysis of what would most likely have prevented or shortened each one, not a claim made by the companies.

### 11.1 The atlas

| # | Year · Company (database) | What happened | Failure class | Impact | Control that helps |
|---|---|---|---|---|---|
| 1 | 2015 · Sentry (PostgreSQL) | A write-heavy workload outran autovacuum; transaction-ID wraparound protection stopped writes | Time bomb (maintenance) | Down for most of a US workday | Alert on XID age; tune autovacuum; kill long transactions |
| 2 | 2016 · Uber (PostgreSQL → MySQL) | Write amplification from index updates and heavy replication traffic drove a move to a MySQL-based layer | Engine–workload fit | Multi-year re-platforming | Benchmark your real write pattern; re-evaluate as engines improve |
| 3 | 2017 · GitLab (PostgreSQL) | Data deleted on the primary during a replication repair; backups turned out not to work | Human error + unverified backups | Database changes from about 17:20 to 00:00 UTC lost | Scheduled, timed restore tests; guarded destructive commands |
| 4 | 2017 · Instapaper (MySQL on RDS) | Hit a 2 TB file-size limit on RDS instances created before April 2014, with no console warning; backups had the same limit | Silent platform limit | 31 hours down; the first full dump took 24 hours, the parallel retry 10 | Know provider limits; restore onto fresh infrastructure; monthly backup tests (their fix) |
| 5 | 2018 · GitHub (MySQL) | A 43-second network cut triggered cross-region failover; writes landed on both coasts | Failover / split brain | Degraded for 24 hours 11 minutes | Rehearsed failover, fencing, restore-time planning |
| 6 | 2018 · Basecamp (Rails app) | An important tracking table's INT id column ran out at 2,147,483,647; Rails had switched its default to big integers two years earlier | Time bomb (ID exhaustion) | Almost five hours read-only, the worst outage in about a decade | Alert on key usage; BIGINT keys for growing tables |
| 7 | 2019 · Mandrill / Mailchimp (sharded PostgreSQL) | A write spike on one of five shards triggered transaction-ID wraparound protection | Time bomb (maintenance) | 05:35 UTC on 4 Feb to 22:09 UTC on 5 Feb (about 40 hours); XID alerting added during the incident; refunds | The alert they added afterwards, added before |
| 8 | 2010s · GoCardless (PostgreSQL) | A fast ALTER TABLE waited for an exclusive lock; every API query queued behind it until clients timed out | Migration lock queue | API downtime | `lock_timeout` on every migration, with retries |
| 9 | 2017–2023 · Discord (Cassandra → ScyllaDB) | Hot partitions on busy channels slowed the whole 177-node message cluster | Hot spots / data model | Constant firefighting; ended on 72 ScyllaDB nodes plus Rust data services that coalesce requests | Model by access pattern; shield hot keys upstream |
| 10 | 2020–2024 · Figma (PostgreSQL) | ~100x growth: the largest single instance, then vertical partitioning, then a nine-month horizontal sharding project; vacuum reliability was one pressure | Scale wall | Planned project, kept reversible | Scale in reversible steps; shard last |
| 11 | 2022 · Atlassian | A maintenance script was given site IDs instead of app IDs; peer review checked the endpoint, not the IDs | Bulk-delete human error | 883 sites (775 customers) deleted in 23 minutes; up to 14 days to restore | Dry runs with row counts, delayed hard deletes, restore-at-scale drills |
| 12 | 2023 · MOVEit (vendor app) | A SQL injection zero-day was mass-exploited | Injection | 2,095 organizations and ~62 million people in one tally | Parameterized queries, least privilege, fast patching |
| 13 | 2025 · AWS DynamoDB (us-east-1) | A latent race condition in DNS automation left the regional endpoint with an empty DNS record | Managed-platform automation | 11:48 PM 19 Oct to 2:20 PM 20 Oct PDT, with knock-on impact across AWS | Design for regional failure; no service is immune |
| 14 | 2025 · Cloudflare (ClickHouse) | A permissions change made a metadata query (which did not filter by database) return rows from a second schema, doubling a feature file past a hard-coded 200-feature limit | Change altered query results | Worst outage since 2019; core traffic restored 14:30 UTC, fully normal 17:06 UTC | Filter metadata queries by schema; validate generated outputs before shipping |

### 11.2 Nine failure classes

| Class | Incidents above | Early-warning signal | Control |
|---|---|---|---|
| Unverified backups and slow restores | GitLab, Instapaper, GitHub, Atlassian | Nobody knows the date or duration of the last real restore | Scheduled, timed restore tests (Cookbook 13) |
| Time bombs (limits) | Basecamp, Instapaper, Sentry, Mandrill, Cloudflare | Distance to each limit is unmeasured | The quarterly audit in Part 12 |
| Failover and split brain | GitHub | Failover never rehearsed | Drills, fencing, one writable primary |
| Human or script error on bulk data | GitLab, Atlassian | Destructive commands run without a row count | Dry run, row-count guard, soft delete, two-person rule (Part 17, lab 6) |
| Changes that alter query results | Cloudflare | Output size or shape changes after a "harmless" change | Schema filters; output validation; keep last known good |
| Migration lock queues | GoCardless | Lock waits during deploys | `lock_timeout`, online DDL tools (Part 14) |
| Hot spots and scale walls | Discord, Figma, Uber | p99 latency rises while averages look fine | Model by access pattern; reversible scaling steps |
| Injection | MOVEit | Usually none before exploitation | Parameterized queries, allow-lists, patching |
| Platform and automation failures | AWS, Instapaper | Provider limits and dependencies undocumented in your runbook | Know the limits; plan for a region or service being gone |

### 11.3 Six patterns across all fourteen

1. **Small trigger, enormous blast radius.** 43 seconds of network loss became 24 hours (GitHub). One permissions change took down a global network (Cloudflare). One script deleted 883 sites in 23 minutes (Atlassian). Design for the blast radius, not the trigger.
2. **The failure mode was already public.** Rails had changed its default to big integers two years before Basecamp ran out of INT ids. Mandrill's own write-up points to Sentry's 2015 wraparound post. Reading other people's postmortems is the cheapest prevention there is.
3. **Recovery time is set by data size.** Instapaper's dump took 24 hours, then 10 in parallel; GitHub spent hours restoring terabytes; Atlassian needed up to 14 days. Measure your restore time before you need it.
4. **Monitoring arrived after the outage.** Mandrill added wraparound alerting during the incident. Instapaper found no warning anywhere in its console, and moved backup tests from every three months to monthly afterwards.
5. **Reviews checked the code, not the data.** Atlassian's peer review focused on which endpoint was called, not the IDs passed to it. Cloudflare's query text never changed; the data it could see did.
6. **Managed does not mean immune.** Instapaper ran on RDS; AWS's own DynamoDB went down. A managed service moves some failures elsewhere, but you still own your limits, restores and regional plan.

### 11.4 Pre-mortem: ask these before any risky change

- What is the worst output this change could produce, and would we notice within five minutes?
- How many rows will it touch? Have I seen that number from a SELECT?
- Can I undo it, and how long would the undo take at full data size?
- When did we last restore the backup we would need, and how long did it take?
- Does it take a lock? Is `lock_timeout` (PostgreSQL) or `lock_wait_timeout` (MySQL) set?
- Could a permission or schema change make any query return more or fewer rows than today?
- Is any limit within 20%: ids, disk, XID age, connections, file sizes, or a hard-coded limit in a consumer?
- If the primary disappears mid-change, what state are we left in?
- Is it split into reversible steps (expand, migrate, contract)?
- Has a second person checked the **data** (the IDs, the WHERE clause, the row count), not only the code?

---

## Part 12. Time bombs: limits that explode years later

A time bomb is a limit that is irrelevant for years and then fatal in one afternoon. Basecamp, Sentry, Mandrill, Instapaper and Cloudflare all hit one. The defence is boring and reliable: measure the distance to every limit, every quarter.

| Time bomb | Real incident | How to detect it | How to defuse it |
|---|---|---|---|
| 32-bit integer ids (max 2,147,483,647) | Basecamp 2018 | Sequence / auto-increment usage % | BIGINT for new tables; widen early with online tools |
| PostgreSQL transaction-ID wraparound | Sentry 2015, Mandrill 2019 | `age(datfrozenxid)` (Part 8.7) | Healthy autovacuum, no long transactions, alerts |
| Platform or filesystem size limits | Instapaper 2017 (2 TB) | Table and file sizes vs documented limits | Know the limits; migrate long before them |
| Hard-coded limits in consumers | Cloudflare 2025 (200 features) | Size and shape checks on generated data | Validate inputs; keep the last good version |
| MySQL `TIMESTAMP` ends 2038-01-19 03:14:07 UTC | Ahead of us | List every TIMESTAMP column | `DATETIME` (stored as UTC) or a BIGINT epoch |
| An unused PostgreSQL replication slot keeps WAL forever | Disk-full outages | WAL retained per slot | Drop dead slots; `max_slot_wal_keep_size` (PostgreSQL 13+) |
| MySQL binary logs fill the disk | Disk-full outages | Binlog size and expiry | `binlog_expire_logs_seconds` |
| Connection limits | Pile-ups during traffic spikes | Connections in use vs maximum | A connection pool sized with Little's law (Part 15) |
| Disk growth | Any database | Growth per day vs free space | Alerts at about 70% and 85% |

### 12.1 Detection queries: PostgreSQL

```sql
-- 1. identity / serial sequences closest to their maximum
SELECT schemaname, sequencename, last_value, max_value,
       round(100.0 * last_value / max_value, 2) AS pct_used
FROM pg_sequences
WHERE last_value IS NOT NULL
ORDER BY pct_used DESC
LIMIT 10;

-- 2. transaction-ID age
SELECT datname, age(datfrozenxid) AS xid_age
FROM pg_database
ORDER BY xid_age DESC;

-- 3. WAL held back by replication slots (an inactive slot here is a disk-full warning)
SELECT slot_name, active,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS wal_retained
FROM pg_replication_slots;

-- 4. biggest tables (compare with any platform limits)
SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;

-- 5. connections in use vs the limit
SELECT count(*) AS connections, current_setting('max_connections') AS max_allowed
FROM pg_stat_activity;
```

For an INT identity or serial column the sequence maximum is 2,147,483,647, so `pct_used` is exact **[verified in our lab]**. If someone attached a BIGINT sequence to an INT column, the sequence looks safe while the column is not, so check the column type too, and remember that foreign-key columns pointing at the id must be widened as well.

### 12.2 Detection queries: MySQL

```sql
-- 1. auto-increment columns closest to their type's maximum (sys schema)
SELECT table_schema, table_name, column_name, column_type,
       auto_increment, max_value, auto_increment_ratio
FROM sys.schema_auto_increment_columns
ORDER BY auto_increment_ratio DESC
LIMIT 10;

-- 2. TIMESTAMP columns that stop working in January 2038
SELECT table_schema, table_name, column_name
FROM information_schema.columns
WHERE data_type = 'timestamp'
  AND table_schema NOT IN ('mysql', 'sys', 'performance_schema', 'information_schema');

-- 3. biggest tables
SELECT table_schema, table_name,
       ROUND((data_length + index_length) / 1024 / 1024 / 1024, 2) AS size_gb
FROM information_schema.tables
ORDER BY data_length + index_length DESC
LIMIT 10;

-- 4. connections vs the limit
SHOW GLOBAL STATUS LIKE 'Threads_connected';
SHOW VARIABLES LIKE 'max_connections';
```

### 12.3 Defusing an INT id that is running out

- **Small or medium table:** `ALTER TABLE t ALTER COLUMN id TYPE BIGINT;` (PostgreSQL) or `ALTER TABLE t MODIFY id BIGINT AUTO_INCREMENT;` (MySQL). It rewrites the table under a lock, so run it in a quiet window with `lock_timeout` set. In PostgreSQL 16, widening an INT identity column also widened its sequence to BIGINT automatically, and the next insert succeeded **[verified in our lab]**.
- **Large table:** add a BIGINT column, keep it in sync with a trigger, backfill in batches, then swap in one short transaction (PostgreSQL); or use gh-ost or pt-online-schema-change (MySQL). Basecamp's fix was to migrate half the replica fleet offline, then the other half.
- **Prevention:** BIGINT keys for any table that grows with user activity. At 500 million rows the extra 4 bytes per key cost about 2 GB per index containing it. That is cheap compared with five hours read-only.

### 12.4 Quarterly time-bomb audit

- [ ] Run the detection queries above; record every value and its trend in a dated note.
- [ ] Anything above 50% of a limit gets a ticket; above 80% gets a date.
- [ ] Re-read the limits page of your cloud provider for your database service.
- [ ] Check every system that **consumes** database output for hard-coded size limits.
- [ ] Restore last night's backup and time it (Cookbook 13).
- [ ] List TIMESTAMP columns (MySQL) and any 32-bit ids in application code too.

---

## Part 13. What isolation levels really guarantee

Isolation level names are promises written in the language of a 1992 standard, and independent testing shows that real databases often deliver something different. Know which anomaly you are defending against, and test it.

### 13.1 The four anomalies that break real apps

| Anomaly | What happens | Real-world example |
|---|---|---|
| **Lost update** | Two transactions read the same value, both write a new value based on it, and one write silently disappears | Counters, stock levels, account balances |
| **Write skew** | Two transactions read overlapping data, then write *different* rows, and together break a rule that each checked | "At least one doctor on call"; booking two overlapping slots stored as separate rows |
| **Read skew** | You read two related rows at different moments and see an impossible combination | A transfer appears to have taken money out but not put it in |
| **Phantom** | Rows matching your search appear or vanish between two reads | Checking "is this time slot free?" and then inserting |

### 13.2 What independent testing found

- **Hermitage (2014).** Martin Kleppmann, author of *Designing Data-Intensive Applications*, built a test suite showing that the same level name means different things in different databases. Jepsen later revisited his MySQL findings.
- **PostgreSQL 12.3 (Jepsen, June 2020).** SERIALIZABLE allowed a serializability violation under concurrent inserts and updates, from a bug present since serializable snapshot isolation arrived in version 9.1; a fix was scheduled for the next minor release. Jepsen also noted that PostgreSQL's REPEATABLE READ is snapshot isolation, which is weaker than the formal definition of repeatable read.
- **MySQL 8.0.34 (Jepsen, December 2023).** MySQL's default, REPEATABLE READ, allowed lost updates and other anomalies and violated internal consistency; Jepsen concluded it satisfies neither the formal nor the ANSI definition and sits only somewhat above READ COMMITTED. Jepsen also found AWS RDS MySQL clusters violating serializability at SERIALIZABLE.
- **Since then:** MariaDB added an option (`innodb_snapshot_isolation`) that makes its REPEATABLE READ reject lost updates, and Jepsen reported a "long fork" anomaly at REPEATABLE READ on Amazon RDS for PostgreSQL clusters.

### 13.3 We reproduced it [verified in our lab]

Two sessions on PostgreSQL 16, each running the classic patterns:

| Scenario | READ COMMITTED (PostgreSQL default) | REPEATABLE READ | SERIALIZABLE |
|---|---|---|---|
| Lost update: both read 10, both write 11 | **Both commit; final value 11, one update silently lost** | Second transaction fails with SQLSTATE 40001; retry needed | Second fails with 40001 |
| Write skew: two doctors on call, each takes themselves off | Both commit (weaker than REPEATABLE READ) | **Both commit; nobody left on call** | Second fails with 40001; one doctor stays on call |
| Atomic `UPDATE … SET counter = counter + 1` from two sessions | **Correct: 12** | — | — |

On MySQL, per Jepsen and Percona's tests, the lost-update case commits silently even at the default REPEATABLE READ.

The takeaway: **in both databases' default settings, read-modify-write logic in application code can silently lose data.**

### 13.4 Try it yourself: two terminals

```sql
-- setup (both databases)
CREATE TABLE counters (id INT PRIMARY KEY, counter INT NOT NULL);
INSERT INTO counters VALUES (1, 10);

-- Terminal A                                   -- Terminal B
BEGIN;
SELECT counter FROM counters WHERE id = 1;      -- 10
                                                 BEGIN;
                                                 SELECT counter FROM counters WHERE id = 1;  -- 10
UPDATE counters SET counter = 11 WHERE id = 1;
COMMIT;
                                                 UPDATE counters SET counter = 11 WHERE id = 1;
                                                 COMMIT;
SELECT counter FROM counters WHERE id = 1;      -- 11, not 12: an update was lost
```

```sql
-- write skew (PostgreSQL), run both sides with:
--   BEGIN ISOLATION LEVEL REPEATABLE READ;   then repeat with SERIALIZABLE
CREATE TABLE doctors (name VARCHAR(20) PRIMARY KEY, on_call BOOLEAN NOT NULL);
INSERT INTO doctors VALUES ('alice', true), ('bob', true);

-- A: SELECT count(*) FROM doctors WHERE on_call;            -- 2, so Alice may leave
-- B: SELECT count(*) FROM doctors WHERE on_call;            -- 2, so Bob may leave
-- A: UPDATE doctors SET on_call = false WHERE name = 'alice';  COMMIT;
-- B: UPDATE doctors SET on_call = false WHERE name = 'bob';    COMMIT;
-- REPEATABLE READ: both succeed, nobody is on call.
-- SERIALIZABLE: B fails with "could not serialize access"; retry it and it sees only 1 doctor.
```

### 13.5 Rules that hold in every database

1. **Never read-modify-write across two statements unprotected.** Use one atomic statement (`SET x = x + 1`, `WHERE balance >= 100`), lock the row with `SELECT … FOR UPDATE`, or use a version column.
2. **Put invariants in constraints** whenever possible: UNIQUE, CHECK, foreign keys, and in PostgreSQL exclusion constraints for overlaps.
3. **For rules spanning several rows** (at least one doctor on call), use PostgreSQL SERIALIZABLE with a retry loop, or explicitly lock every row you read.
4. **Always write the retry loop** for serialization failures (40001) and deadlocks (MySQL 1213, PostgreSQL 40P01).
5. **Do not trust the name.** Test your critical flows with two sessions before production does it for you.

```sql
-- PostgreSQL: no two bookings of one room may overlap [verified in our lab]
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE room_bookings (
  room_id INT NOT NULL,
  during  TSTZRANGE NOT NULL,
  EXCLUDE USING gist (room_id WITH =, during WITH &&)
);
-- 10:00–11:00 succeeds, 10:30–11:30 is rejected, 11:00–12:00 succeeds (ranges touch, not overlap)
```

```python
# retry loop for SERIALIZABLE transactions (psycopg2)
import time, psycopg2
from psycopg2 import errors

def run_serializable(conn, work, attempts=5):
    for attempt in range(attempts):
        try:
            with conn:                      # commits, or rolls back on error
                with conn.cursor() as cur:
                    cur.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE")
                    return work(cur)
        except errors.SerializationFailure:
            time.sleep(0.05 * 2 ** attempt)  # back off, then try again
    raise RuntimeError("gave up after retries")
```

---

## Part 14. Zero-downtime schema changes

A schema change can take down an app even when the statement itself runs in milliseconds. The cause is the lock queue, and the cure is a handful of disciplined patterns.

### 14.1 The lock queue [verified in our lab]

1. Session 1 runs a long SELECT (or forgets to close a transaction). It holds a light shared lock on the table.
2. Session 2 runs `ALTER TABLE`, which needs an exclusive lock, so it waits for session 1.
3. Session 3 runs an ordinary SELECT. It conflicts with the *waiting* ALTER, so it queues behind it.
4. Every new query on the table now queues. To users, the app is down.

In our lab, a plain `SELECT count(*) FROM orders` sat blocked behind a waiting `ALTER TABLE` until its 2-second statement timeout fired. With `SET lock_timeout = '1s'` on the ALTER session, the ALTER gave up after one second and the waiting reader ran immediately. That is exactly the GoCardless incident, and exactly its fix. MySQL has the same queue for metadata locks: you will see "Waiting for table metadata lock" in `SHOW PROCESSLIST`.

### 14.2 PostgreSQL: safe patterns

```sql
-- every migration session
SET lock_timeout = '2s';        -- give up instead of blocking everyone; retry later
SET statement_timeout = '15min';
```

| Change | Risky way | Safe way |
|---|---|---|
| Add an index | `CREATE INDEX` (blocks writes while it builds) | `CREATE INDEX CONCURRENTLY` (not inside a transaction; if it fails, drop the INVALID index it leaves) |
| Add a foreign key | `ADD FOREIGN KEY` (checks every row under lock) | `ADD … NOT VALID`, then `VALIDATE CONSTRAINT` |
| Add a CHECK | `ADD CHECK` | `ADD CHECK … NOT VALID`, then `VALIDATE CONSTRAINT` |
| Make a column NOT NULL | `SET NOT NULL` directly (full scan under exclusive lock) | Add `CHECK (col IS NOT NULL) NOT VALID` → `VALIDATE` → `SET NOT NULL` (PostgreSQL 12+ uses the validated check to skip the scan) → drop the check |
| Add a column with a default | A volatile default such as `random()` rewrites the table | A constant default is instant (PostgreSQL 11+) |
| INT → BIGINT on a big table | `ALTER COLUMN … TYPE BIGINT` (rewrite under lock) | New column + trigger + batched backfill + quick swap |
| Rename or drop a column | Doing it while running code still uses it | Expand/contract (14.4) |

```sql
-- the NOT NULL sequence, as tested [verified in our lab]
ALTER TABLE customers ADD CONSTRAINT customers_city_nn CHECK (city IS NOT NULL) NOT VALID;
ALTER TABLE customers VALIDATE CONSTRAINT customers_city_nn;   -- scans without blocking writes
ALTER TABLE customers ALTER COLUMN city SET NOT NULL;           -- now instant
ALTER TABLE customers DROP CONSTRAINT customers_city_nn;

-- the same VALIDATE step fails safely if bad rows exist:
-- a CHECK (phone IS NOT NULL) on the practice store is rejected because customer 5 has no phone
```

### 14.3 MySQL: safe patterns

```sql
-- every migration session: the default lock_wait_timeout is one year
SET SESSION lock_wait_timeout = 5;

-- ask for the cheap algorithm explicitly, so MySQL errors instead of silently copying the table
ALTER TABLE orders ADD COLUMN note VARCHAR(255), ALGORITHM=INSTANT;
ALTER TABLE orders ADD INDEX idx_orders_date (order_date), ALGORITHM=INPLACE, LOCK=NONE;
```

For changes MySQL cannot do in place on big, busy tables, teams use online schema change tools:

- **gh-ost** (from GitHub): copies rows into a shadow table and replays changes by reading the binary log instead of using triggers. It can pause itself when replicas lag and postpone the final table swap until you are ready. GitHub continuously runs trivial migrations with checksums to validate it.
- **pt-online-schema-change** (Percona Toolkit): the trigger-based classic. GitHub's write-up explains why triggers can add load and lock contention on very busy servers.

### 14.4 Expand/contract: the safest way to change anything

Example: rename `customers.phone` to `phone_number` with zero downtime.

| Step | Database | Application |
|---|---|---|
| 1. Expand | Add `phone_number`, nullable | No change |
| 2. Dual write | — | Write both columns |
| 3. Backfill | Copy old values in batches (Cookbook 8) | — |
| 4. Switch reads | — | Read `phone_number` |
| 5. Stop old writes | — | Write only `phone_number` |
| 6. Contract | Drop `phone`, after a safe waiting period | — |

Every step deploys on its own and can be rolled back on its own. The same pattern handles type changes, table splits, and moving data between databases. It is the idea behind Figma's "logical then physical" sharding.

### 14.5 Migration pre-flight checklist

- [ ] Timeouts set (`lock_timeout` / `lock_wait_timeout`, `statement_timeout`).
- [ ] No long-running transactions open right now (Part 8.7 queries).
- [ ] The change is additive, or the code that depended on the old shape is already gone.
- [ ] Tested on a copy with production-like size, and the duration recorded.
- [ ] Rollback written and tested.
- [ ] Replica lag watched during the change.
- [ ] Someone else reviewed the SQL **and** its effect on data.

---

## Part 15. Database physics: numbers to reason with

You cannot design or debug well without a feel for how long things take. The figures below are rough orders of magnitude for typical modern hardware and networks, not guarantees; measure your own with `\timing` in psql, `EXPLAIN ANALYZE`, and ping.

| Operation | Rough time |
|---|---|
| Read a page already in the database's memory cache | ~0.1 µs |
| Random read from an NVMe SSD | ~10–100 µs |
| Network round trip inside one data center | ~0.5 ms |
| Round trip across a continent | ~30–70 ms |
| Round trip across an ocean | ~70–150 ms |

### 15.1 What the numbers tell you

- **N+1 is a network problem.** 200 small queries at about 0.5 ms each cost 100 ms in the same data center. If the app runs in a different region from the database, the same page costs 200 × 70 ms = 14 seconds. Keep the app next to the primary, and batch.
- **Memory beats disk by about a thousand times.** A query that touches 1,000 random rows may take ~100 ms from SSD and well under 1 ms from cache. Watch whether your working set fits in memory:

```sql
-- PostgreSQL: share of reads served from cache (healthy OLTP is usually well above 95%)
SELECT round(100.0 * sum(blks_hit) / nullif(sum(blks_hit) + sum(blks_read), 0), 2) AS cache_hit_pct
FROM pg_stat_database;
-- MySQL: compare Innodb_buffer_pool_read_requests (logical) with Innodb_buffer_pool_reads (from disk)
SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';
```

- **Cross-region consistency costs a round trip per commit.** That is why most systems replicate asynchronously across regions, and why replica lag and failover (Part 9.5) exist at all.

### 15.2 Back-of-envelope sizing

- **Table size** ≈ rows × average row bytes, plus indexes, which commonly add as much again or more. 500 million rows × 150 bytes ≈ 75 GB before indexes.
- **INT vs BIGINT:** 4 extra bytes per key per index. At 500 million rows that is about 2 GB per index containing the key: small insurance against a Basecamp-style outage.
- **Connection pools (Little's law):** busy connections ≈ queries per second × average query time. 2,000 queries/s × 5 ms = 10 busy connections, so a pool of about 20 is plenty, while 500 direct connections only add overhead, especially in PostgreSQL's process-per-connection model.
- **Backfill time:** rows ÷ (batch size × batches per second). 100 million rows in batches of 5,000 at 4 batches/s is about 1.4 hours. Write that number in the migration plan.

---

## Part 16. Twenty laws of databases

Distilled from twenty years of history (Part 0), fourteen incidents (Part 11) and our own lab tests. Each law names its evidence.

1. **A backup is a restore you have not tried yet.** (GitLab, Instapaper)
2. **Every limit is reached eventually; measure your distance to each one.** (Basecamp, Instapaper, Sentry, Mandrill)
3. **The trigger is small; the blast radius is designed.** (GitHub, Cloudflare, Atlassian)
4. **Review the data, not only the code.** (Atlassian)
5. **Permission and schema changes can change query results.** Filter metadata queries and validate outputs. (Cloudflare)
6. **Defaults are decisions someone else made.** Rails' big integers, MySQL's REPEATABLE READ, PostgreSQL's READ COMMITTED: know them. (Basecamp, Jepsen)
7. **Isolation names over-promise.** Test the anomaly you care about. (Jepsen, our lab)
8. **Read-modify-write belongs in one statement, a locked row, or a versioned update.** (our lab)
9. **Locks queue.** A one-millisecond ALTER can still cause an outage. (GoCardless, our lab)
10. **Replicas copy mistakes.** Only point-in-time recovery rewinds them. (Part 9.5)
11. **Failover is a feature you must rehearse.** (GitHub)
12. **Recovery time grows with data size.** Plan with measured numbers. (Instapaper, GitHub, Atlassian)
13. **Scale in reversible steps; shard last.** (Figma)
14. **Choose the data model by access pattern.** (Discord, Uber)
15. **Hot keys hurt whole clusters.** Watch p99, not averages. (Discord)
16. **Watch the boring counters:** XID age, id usage, disk, WAL retention, replica lag, long transactions. (Sentry, Mandrill, Basecamp)
17. **Managed services move failures; they do not remove them.** (Instapaper, AWS DynamoDB)
18. **Old vulnerabilities never die.** (MOVEit; injection still in OWASP's 2025 top five)
19. **Every destructive change needs a guard and an undo.** (GitLab, Atlassian)
20. **Postmortems are the cheapest education in the industry.** Mandrill's write-up cites Sentry's; read before you repeat.

---

## Part 17. Incident Lab: recreate famous failures on your laptop

Reading about outages is useful; causing small ones on purpose is unforgettable. Every lab uses the practice store from Part 1 and takes 5–15 minutes.

| Lab | Recreates | You will see | Database |
|---|---|---|---|
| 1. Lost update | Silent data loss in counters | Final value 11 instead of 12 | Both |
| 2. Write skew | Broken multi-row rules | Nobody on call at REPEATABLE READ | PostgreSQL |
| 3. Lock queue | GoCardless | A SELECT stuck behind a waiting ALTER | Both |
| 4. ID exhaustion | Basecamp | Inserts fail at 2,147,483,647 | Both |
| 5. Duplicate metadata | Cloudflare | Twice the rows after adding a schema | Both |
| 6. Guarded bulk delete | Atlassian, GitLab | A DELETE that refuses to run on the wrong row count | PostgreSQL |
| 7. Vacuum blocked by an old snapshot | Sentry, Mandrill (the mechanism) | "dead but not yet removable" | PostgreSQL |
| 8. Restore drill | GitLab, Instapaper | Your real recovery time | Both |

**Labs 1 and 2:** use the two-terminal scripts in Part 13.4.

**Lab 3: lock queue (three terminals)**

```sql
-- T1: hold a shared lock by leaving a transaction open
BEGIN; SELECT count(*) FROM orders;

-- T2: the migration (it will wait)
ALTER TABLE orders ADD COLUMN lab_note TEXT;

-- T3: an innocent read, now stuck behind T2
SELECT count(*) FROM orders;

-- T1: COMMIT;  → T2 and then T3 finish at once.
-- Repeat with   SET lock_timeout = '1s';   (PostgreSQL) or
--               SET SESSION lock_wait_timeout = 1;   (MySQL) in T2 first:
-- T2 now gives up after a second, and T3 runs.
-- MySQL: run SHOW PROCESSLIST in a fourth terminal to see "Waiting for table metadata lock".
```

**Lab 4: ID exhaustion**

```sql
-- PostgreSQL
CREATE TABLE ticks (id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, note TEXT);
SELECT setval(pg_get_serial_sequence('ticks', 'id'), 2147483646);
INSERT INTO ticks (note) VALUES ('last one');   -- id 2147483647
INSERT INTO ticks (note) VALUES ('one more');   -- fails: sequence reached its maximum
ALTER TABLE ticks ALTER COLUMN id TYPE BIGINT;  -- widens the column and its sequence
INSERT INTO ticks (note) VALUES ('works again'); -- id 2147483648

-- MySQL
CREATE TABLE ticks (id INT AUTO_INCREMENT PRIMARY KEY, note VARCHAR(20)) AUTO_INCREMENT = 2147483646;
INSERT INTO ticks (note) VALUES ('a'), ('b');
INSERT INTO ticks (note) VALUES ('c');          -- fails: no id left in the INT range
ALTER TABLE ticks MODIFY id BIGINT AUTO_INCREMENT;
INSERT INTO ticks (note) VALUES ('c');          -- works
```

**Lab 5: duplicate metadata (the Cloudflare pattern)**

```sql
-- PostgreSQL: a second schema with a same-named table
CREATE SCHEMA r0;
CREATE TABLE r0.orders (LIKE public.orders);
SELECT count(*) FROM information_schema.columns WHERE table_name = 'orders';                            -- 14
SELECT count(*) FROM information_schema.columns WHERE table_name = 'orders' AND table_schema = 'public'; -- 7
DROP SCHEMA r0 CASCADE;
-- MySQL: CREATE DATABASE r0; CREATE TABLE r0.orders LIKE practice_store.orders;  then the same two queries
```

Any code that generates configuration, features or reports from metadata must filter by schema **and** check the size of what it produced.

**Lab 6: a bulk delete that guards itself**

```sql
-- PostgreSQL: refuse to delete unless exactly the expected number of rows match
DO $$
DECLARE n int;
BEGIN
  DELETE FROM order_items WHERE order_id = 10;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 3 THEN
    RAISE EXCEPTION 'expected 3 rows, got %', n;   -- order 10 has 2 items, so this aborts
  END IF;
END $$;
SELECT count(*) FROM order_items WHERE order_id = 10;   -- still 2: nothing was deleted
```

In MySQL, use the transaction ritual (Part 4.5): SELECT the count, run the DELETE, compare "rows affected", then COMMIT or ROLLBACK. Add a "deleted_at" soft delete with a delayed purge for anything customers own.

**Lab 7: an old snapshot blocks VACUUM**

```sql
-- PostgreSQL
CREATE TABLE vac_demo AS SELECT g AS id, 0 AS v FROM generate_series(1, 10000) g;
-- T1: BEGIN ISOLATION LEVEL REPEATABLE READ; SELECT count(*) FROM vac_demo;   (leave it open)
-- T2:
UPDATE vac_demo SET v = 1;
VACUUM (VERBOSE) vac_demo;   -- "10000 are dead but not yet removable"
-- T1: ROLLBACK;
VACUUM (VERBOSE) vac_demo;   -- "10000 removed"
```

Scale that up to a busy table and a transaction left open for days, and you have the mechanism behind bloat and, in the worst case, wraparound emergencies.

**Lab 8: restore drill.** Run Cookbook 13 with a stopwatch. Write the time in your README. That number is your real recovery time.

### Run the PostgreSQL labs automatically

```python
# labs.py  (pip install psycopg2-binary;  set DSN for your server)
import threading, time, psycopg2, psycopg2.errors
DSN = "host=localhost dbname=practice_store user=postgres password=secret"

def conn(level=None, autocommit=False):
    c = psycopg2.connect(DSN); c.autocommit = autocommit
    if level: c.set_session(isolation_level=level)
    return c

admin = conn(autocommit=True); s = admin.cursor()
s.execute("DROP TABLE IF EXISTS counters, doctors")
s.execute("CREATE TABLE counters (id INT PRIMARY KEY, counter INT NOT NULL)")
s.execute("INSERT INTO counters VALUES (1, 10)")
s.execute("CREATE TABLE doctors (name VARCHAR(20) PRIMARY KEY, on_call BOOLEAN NOT NULL)")

def lost_update(level):
    s.execute("UPDATE counters SET counter = 10 WHERE id = 1")
    a, b = conn(level), conn(level); ca, cb = a.cursor(), b.cursor()
    ca.execute("SELECT counter FROM counters WHERE id = 1"); va = ca.fetchone()[0]
    cb.execute("SELECT counter FROM counters WHERE id = 1"); vb = cb.fetchone()[0]
    ca.execute("UPDATE counters SET counter = %s WHERE id = 1", (va + 1,)); a.commit()
    try:
        cb.execute("UPDATE counters SET counter = %s WHERE id = 1", (vb + 1,)); b.commit(); r = "both committed"
    except Exception as e:
        b.rollback(); r = "second failed: " + type(e).__name__
    s.execute("SELECT counter FROM counters WHERE id = 1")
    print(f"lost update @ {level}: {r}; final = {s.fetchone()[0]} (12 means nothing was lost)")

def write_skew(level):
    s.execute("DELETE FROM doctors; INSERT INTO doctors VALUES ('alice', true), ('bob', true)")
    a, b = conn(level), conn(level); ca, cb = a.cursor(), b.cursor()
    ca.execute("SELECT count(*) FROM doctors WHERE on_call"); na = ca.fetchone()[0]
    cb.execute("SELECT count(*) FROM doctors WHERE on_call"); nb = cb.fetchone()[0]
    if na >= 2: ca.execute("UPDATE doctors SET on_call = false WHERE name = 'alice'")
    if nb >= 2: cb.execute("UPDATE doctors SET on_call = false WHERE name = 'bob'")
    out = []
    for name, c in (("A", a), ("B", b)):
        try: c.commit(); out.append(name + " committed")
        except Exception as e: c.rollback(); out.append(name + " failed: " + type(e).__name__)
    s.execute("SELECT count(*) FROM doctors WHERE on_call")
    print(f"write skew @ {level}: {', '.join(out)}; on call = {s.fetchone()[0]}")

for lvl in ("READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE"):
    lost_update(lvl)
for lvl in ("REPEATABLE READ", "SERIALIZABLE"):
    write_skew(lvl)

# lock queue: a reader stuck behind a waiting ALTER
holder = conn(); holder.cursor().execute("SELECT count(*) FROM orders")
ddl = conn(autocommit=True)
t = threading.Thread(target=lambda: ddl.cursor().execute("ALTER TABLE orders ADD COLUMN lab_note TEXT"))
t.start(); time.sleep(0.5)
reader = conn(autocommit=True); rc = reader.cursor(); rc.execute("SET statement_timeout = '2s'")
try:
    rc.execute("SELECT count(*) FROM orders"); print("lock queue: reader was not blocked")
except psycopg2.errors.QueryCanceled:
    print("lock queue: a plain SELECT waited behind the ALTER until its 2 s timeout")
holder.rollback(); t.join()
ddl.cursor().execute("ALTER TABLE orders DROP COLUMN lab_note")
```

---

## MySQL vs PostgreSQL

Learn both, because they share most of their SQL. Lean toward PostgreSQL for new projects, and keep MySQL for the huge number of existing apps that run on it.

**Twenty years in two lines.** In the 2017 Stack Overflow survey PostgreSQL was the 4th most-used database, about 30 points behind MySQL. In 2025, 58.2% of professional developers used PostgreSQL and 39.6% used MySQL, while people still learning to code used MySQL more (47.7% vs 39.2%).

**Current versions (October 2026):** MySQL 9.7 is the newest long-term-support line (April 2026); 8.4 LTS is still supported and 8.0 has reached end of life. PostgreSQL 18 is the current stable release; PostgreSQL 19 reached Beta 4 on 24 September 2026, with a release candidate planned for early October.

| Task | MySQL | PostgreSQL |
|---|---|---|
| Open a SQL prompt | `mysql -u root -p` | `psql -U postgres` |
| List databases / tables | `SHOW DATABASES;` `SHOW TABLES;` | `\l` and `\dt` |
| Describe a table | `DESCRIBE customers;` | `\d customers` |
| Switch database | `USE practice_store;` | `\c practice_store` |
| Auto-generated id | `AUTO_INCREMENT` | `GENERATED ALWAYS AS IDENTITY` (older code: `SERIAL`) |
| Read the new id | `LAST_INSERT_ID()` | `INSERT … RETURNING id` |
| Upsert | `ON DUPLICATE KEY UPDATE` | `ON CONFLICT (col) DO UPDATE` |
| Quote an identifier | Backticks | Double quotes |
| Join strings | `CONCAT(a, b)` | `CONCAT(a, b)` or the double-pipe operator |
| Case-insensitive match | `LIKE` (default collation ignores case) | `ILIKE` or `LOWER()` |
| Regex | `REGEXP` | `~` (case-sensitive), `~*` (ignore case) |
| Paging | `LIMIT 3 OFFSET 6` (also `LIMIT 6, 3`) | `LIMIT 3 OFFSET 6` |
| Full outer join | Not supported: LEFT JOIN UNION RIGHT JOIN | `FULL OUTER JOIN` |
| NULL fallback | `IFNULL(a, b)` or `COALESCE` | `COALESCE` |
| Inline if | `IF(cond, a, b)` | `CASE WHEN … END` (works in both) |
| Today / now | `CURDATE()`, `NOW()` | `CURRENT_DATE`, `now()` |
| Days between dates | `DATEDIFF(d2, d1)` | `d2 - d1` |
| Add 7 days | `d + INTERVAL 7 DAY` | `d + INTERVAL '7 days'` |
| Format a date | `DATE_FORMAT(d, '%Y-%m')` | `to_char(d, 'YYYY-MM')` |
| List values per group | `GROUP_CONCAT(x SEPARATOR ', ')` | `STRING_AGG(x, ', ')` |
| `5 / 2` | 2.5000 | 2 (integer division) |
| Boolean | Alias for `TINYINT(1)` | Real `boolean` type |
| JSON | `JSON` | `JSON` and indexable `JSONB` |
| Vectors | `VECTOR` type (9.0+) | pgvector extension |
| Series of numbers or dates | Recursive CTE | `generate_series()` |
| Partial index | No | Yes |
| Materialized view | No | Yes |
| Update with a join | `UPDATE a JOIN b ON … SET …` | `UPDATE a SET … FROM b WHERE …` |
| Delete with a join | `DELETE a FROM a JOIN b …` | `DELETE FROM a USING b WHERE …` |
| DDL inside a transaction | Commits immediately | Fully transactional |
| Default isolation level | REPEATABLE READ | READ COMMITTED |
| Old-version cleanup | InnoDB purge (watch long transactions) | VACUUM / autovacuum (watch XID age) |
| Connections | Thread per connection | Process per connection (use a pooler) |
| Inline column `REFERENCES` | Ignored before 9.0; enforced from 9.0 | Enforced |

Portable habits that prevent most dialect problems: use `CONCAT`, `COALESCE` and `CASE`; write `LIMIT n OFFSET m`; quote strings with single quotes only; and name everything in lowercase snake_case so identifiers never need quoting.

**When to pick which.** MySQL fits existing PHP and CMS stacks (WordPress, Laravel) and simple read-heavy web apps with a huge hosting ecosystem; very large MySQL fleets are proven at companies such as GitHub, Uber and Shopify. PostgreSQL fits complex queries, strict data integrity, JSONB documents, and extensions such as PostGIS (maps) and pgvector (AI embeddings). Uber's 2016 move and the rebuttals that followed teach the real lesson: decide by your workload's write pattern, replication needs and team skills, not by fashion.

---

## Portfolio projects

Build these four in order, one per month after the 4-week plan. Each proves a skill interviewers probe, and each ends as a public GitHub repo you can walk through in an interview.

| # | Project | Proves | Time |
|---|---|---|---|
| 1 | E-commerce analytics | Joins, aggregation, window functions, business thinking | 1–2 weeks |
| 2 | Ticket booking engine | Schema design, constraints, transactions, locking | 2 weeks |
| 3 | Performance lab (1M+ rows) | Indexes, EXPLAIN, pagination, partitioning, vacuum | 2 weeks |
| 4 | Multi-tenant SaaS backend | Real app design, migrations, security, backups, replicas | 3–4 weeks |

Every repo contains `schema.sql`, `seed.sql`, `queries.sql` (each query commented with the question it answers), and a README with an ER diagram, sample results and "what I learned". Run everything on both MySQL and PostgreSQL and note the differences you hit.

### Project 1. E-commerce analytics

Extend the practice store to about 2,000 customers and 20,000 orders (a short Python script with the Faker library, or `generate_series` in PostgreSQL). Then answer these business questions in SQL:

1. Monthly revenue and month-over-month growth %.
2. Top 5 products by revenue each month.
3. Repeat-customer rate: share of customers with 2+ orders.
4. Average order value by state.
5. Customers who bought coffee but never tea.
6. Revenue from first orders vs repeat orders.
7. Cohort retention: of customers who first ordered in month M, how many ordered again in M+1, M+2, M+3?
8. Median days between a customer's orders.
9. Average shipping time per shipper.
10. Products likely to run out within 30 days at the current sales rate.

Stretch: load the same data into DuckDB and compare how fast the analytics queries run against PostgreSQL. You will see why analytics moved to columnar engines.

### Project 2. Ticket booking engine

Start from the Part 7 design. Add seat holds that expire after 10 minutes, and a job that releases expired holds.

- Prove `UNIQUE (show_id, seat_id)` blocks double booking: open two terminals and book the same seat at the same time.
- Implement the purchase twice, once with `SELECT … FOR UPDATE` and once with optimistic version checks, and write down the trade-offs.
- Queries: seat map for a show, occupancy % per show, revenue per movie per week.

### Project 3. Performance lab

```sql
-- PostgreSQL: 2 million events in a few seconds
CREATE TABLE events (
  event_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    INT NOT NULL,
  event_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
INSERT INTO events (user_id, event_type, created_at)
SELECT (random() * 100000)::int,
       (ARRAY['view', 'click', 'cart', 'buy'])[1 + floor(random() * 4)::int],
       now() - random() * INTERVAL '365 days'
FROM generate_series(1, 2000000);
ANALYZE events;

-- MySQL: 1 million events with a recursive CTE
CREATE TABLE events (
  event_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  event_type VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL
);
SET SESSION cte_max_recursion_depth = 1000000;
INSERT INTO events (user_id, event_type, created_at)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 1000000)
SELECT FLOOR(RAND() * 100000),
       ELT(1 + FLOOR(RAND() * 4), 'view', 'click', 'cart', 'buy'),
       NOW() - INTERVAL FLOOR(RAND() * 525600) MINUTE
FROM seq;
ANALYZE TABLE events;
```

Then run the experiment:

1. Write 8 queries an app would run: a user's last 50 events, daily counts per type, top 100 users this week, and so on.
2. Record `EXPLAIN ANALYZE` time for each with no extra indexes.
3. Add indexes one at a time; record the time again and explain why each one helped or did not.
4. Compare OFFSET and keyset pagination at page 1, 1,000 and 10,000.
5. Run a big UPDATE on half the rows in PostgreSQL, then watch `n_dead_tup` and autovacuum in `pg_stat_user_tables` (Part 8.7).
6. PostgreSQL stretch: partition `events` by month and compare a "last 7 days" query.

Put the before/after table at the top of the README. Concrete measured numbers are the most convincing thing a junior candidate can show.

### Project 4. Multi-tenant SaaS backend

A tiny project-management product: `organizations`, `users`, `memberships (org_id, user_id, role)`, `projects`, `tasks`, `comments`, `audit_log`.

- Every tenant-owned table carries `org_id`, and composite indexes start with it (Notion shards its PostgreSQL the same way, by workspace).
- Manage the schema with a migration tool, and make every migration reversible.
- Build a small API in your language (Node, Python, Java or PHP) with parameterized queries and a connection pool.
- Add soft delete, `updated_at` triggers, and a nightly backup **with an automated restore test** (Cookbook 13).
- Add one read replica (Docker is enough), route reads with the rules in Cookbook 14, and graph replication lag.
- PostgreSQL stretch: row-level security so one organization can never read another's rows.

### Share as you learn

- Post one problem and your solution each week on LinkedIn or dev.to, explaining the trap it avoids.
- Write a one-page summary of one public postmortem from Part 0.3 in your own words: what failed, what you would monitor.
- Answer beginner SQL questions on Stack Overflow or DBA Stack Exchange; explaining forces precision.
- Teach one friend Parts 1–3. If you can teach a join, you understand joins.

---

## Interview prep

SQL interviews test three things: writing correct queries under time pressure, explaining concepts in plain words, and reasoning about design, performance and failure. Practise all three out loud.

### How to answer a SQL coding question

1. **Clarify:** ties? NULLs? duplicates? time zone? what if there are no rows?
2. **State the output shape:** "one row per customer per month, with these columns".
3. **Build it in steps** with CTEs; get a simple correct version first.
4. **Test edge cases** in your head: NULL, ties, empty tables, duplicate rows.
5. **Mention performance:** which index helps and how it behaves at 100 million rows.

### Concept questions with short answers

| Question | Short answer |
|---|---|
| WHERE vs HAVING? | WHERE filters rows before grouping; HAVING filters groups after aggregation. |
| INNER vs LEFT JOIN? | INNER keeps only matches; LEFT keeps every left row and fills NULLs where nothing matches. |
| UNION vs UNION ALL? | UNION removes duplicates (extra sort); UNION ALL keeps them and is faster. |
| DELETE vs TRUNCATE vs DROP? | DELETE removes chosen rows; TRUNCATE empties the table fast; DROP removes the table itself. |
| Primary key vs unique key? | One PK per table, never NULL; many unique keys allowed, and they accept NULLs. |
| What is a foreign key? | A column that must match a PK in another table, protecting referential integrity. |
| Explain 1NF, 2NF, 3NF. | One value per cell; every column depends on the whole key; no column depends on another non-key column. |
| When would you denormalize? | Read-heavy reporting, counters, and historical snapshots, with a way to keep copies in sync. |
| What is an index and its cost? | A sorted structure (B-tree) for fast lookups; it costs disk, memory and slower writes. |
| Clustered vs secondary index? | InnoDB stores rows in PK order (clustered) and secondary indexes point to the PK; PostgreSQL stores rows in a heap and every index is secondary. |
| Composite index rule? | Leftmost prefix: an index on (a, b) serves a, or a + b, but not b alone. |
| Why might an index be ignored? | Function on the column, leading wildcard, type mismatch, low selectivity, or stale statistics. |
| ACID? | Atomicity, Consistency, Isolation, Durability (Part 9). |
| Isolation levels? | READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE; each blocks more anomalies. |
| Optimistic vs pessimistic locking? | Version check at write time vs lock rows up front with FOR UPDATE. |
| Deadlock? | Two transactions wait on each other's locks; the database kills one. Lock in a consistent order and retry. |
| COUNT(*) vs COUNT(col)? | COUNT(*) counts rows; COUNT(col) skips NULLs; COUNT(DISTINCT col) counts unique values. |
| ROW_NUMBER vs RANK vs DENSE_RANK? | 1,2,3 always; 1,1,3 with gaps; 1,1,2 without gaps. |
| Correlated subquery? | A subquery that references the outer row, so it is evaluated per row. |
| CTE vs subquery vs temp table vs view? | CTE and subquery live in one query; a temp table lives for the session; a view is a saved query. |
| View vs materialized view? | A view runs its query each time; a materialized view stores the result until refreshed (PostgreSQL). |
| How do you stop SQL injection? | Parameterized queries, allow-lists for identifiers, least-privilege users, patching. |
| Does NULL = NULL? | No: the result is unknown (NULL). Use IS NULL, and beware NOT IN with NULLs. |
| OLTP vs OLAP? | Many small transactional reads and writes vs large analytical scans and aggregations. |
| Replication vs sharding vs partitioning? | Copies for reads and failover; splitting data across servers; splitting one table into pieces on one server. |
| What is MVCC? | Keeping several row versions so readers do not block writers; used by InnoDB and PostgreSQL. |
| What is PostgreSQL transaction-ID wraparound? | 32-bit transaction IDs must be "frozen" by VACUUM; if that falls far behind, PostgreSQL stops accepting writes to avoid corruption. |
| Is a replica a backup? | No. Mistakes replicate instantly; only backups with point-in-time recovery let you rewind. |
| RPO vs RTO? | How much data you can lose vs how long you can be down. |
| What is split brain? | Two servers both accept writes after a failover, so data diverges and must be reconciled. |
| When would you shard? | Last: after indexing, query fixes, caching, read replicas, partitioning and vertical splits are exhausted. |
| What is write skew? | Two transactions read overlapping data and update different rows, together breaking a rule each one checked; snapshot isolation allows it (Part 13). |
| Can you lose an update at the default isolation level? | Yes, in both PostgreSQL (READ COMMITTED) and MySQL (REPEATABLE READ) if the app reads, computes and writes back. Use atomic updates, FOR UPDATE, or versions. |
| Why can a 1 ms ALTER TABLE cause an outage? | It queues for an exclusive lock behind a long query, and every later query queues behind it. Set lock_timeout (Part 14). |
| How would you find time bombs in a database? | Measure id usage, XID age, disk and WAL retention, connection use and TIMESTAMP columns every quarter (Part 12). |
| Logical order of a SELECT? | FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. |

### Must-solve query patterns

| Problem | Technique | Where in this book |
|---|---|---|
| Second / Nth highest salary | Subquery with MAX, or DENSE_RANK | Part 6.3 |
| Employees earning more than their manager | Self join | Part 3, answer 5 |
| Customers who never ordered | LEFT JOIN … IS NULL, or NOT EXISTS | Part 3.3 |
| Duplicate emails, then delete them | GROUP BY HAVING, self-join DELETE | Cookbook 1 |
| Top N per group | DENSE_RANK with PARTITION BY | Part 6.3 |
| Latest row per group | ROW_NUMBER = 1 | Part 6.3, Cookbook 2 |
| Running total, month-over-month growth | SUM OVER, LAG | Part 6.3 |
| Pivot statuses into columns | SUM(CASE …) | Part 5.4 |
| Fill missing dates | Calendar CTE or generate_series + LEFT JOIN | Cookbook 4 |
| Consecutive days, percent of total, median, retention | See below | Below |

```sql
-- Users who logged in 3+ days in a row (gaps and islands)
-- table: logins(user_id, login_date DATE)
WITH d AS (SELECT DISTINCT user_id, login_date FROM logins),
r AS (
  SELECT user_id, login_date,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
  FROM d
),
g AS (
  SELECT user_id,
         DATE_SUB(login_date, INTERVAL rn DAY) AS grp     -- PostgreSQL: login_date - rn::int
  FROM r
)
SELECT DISTINCT user_id
FROM g
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;

-- Each product's share of total revenue
SELECT p.name,
       SUM(oi.quantity * oi.unit_price) AS revenue,
       ROUND(100.0 * SUM(oi.quantity * oi.unit_price)
             / SUM(SUM(oi.quantity * oi.unit_price)) OVER (), 1) AS pct_of_total
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
GROUP BY p.product_id, p.name
ORDER BY revenue DESC;

-- Median salary (120000 in the practice data)
-- PostgreSQL
SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median FROM employees;
-- MySQL (no built-in median)
SELECT AVG(salary) AS median
FROM (
  SELECT salary,
         ROW_NUMBER() OVER (ORDER BY salary) AS rn,
         COUNT(*) OVER () AS cnt
  FROM employees
) t
WHERE rn IN (FLOOR((cnt + 1) / 2), CEIL((cnt + 1) / 2));

-- Month-to-next-month retention (MySQL; PostgreSQL notes inline)
WITH active AS (
  SELECT DISTINCT customer_id,
         CAST(DATE_FORMAT(order_date, '%Y-%m-01') AS DATE) AS month  -- PG: date_trunc('month', order_date)::date
  FROM orders
)
SELECT a.month,
       COUNT(*)                                           AS active_customers,
       COUNT(b.customer_id)                               AS came_back_next_month,
       ROUND(100.0 * COUNT(b.customer_id) / COUNT(*), 1)  AS retention_pct
FROM active a
LEFT JOIN active b
  ON b.customer_id = a.customer_id
 AND b.month = a.month + INTERVAL 1 MONTH                         -- PG: (a.month + INTERVAL '1 month')::date
GROUP BY a.month
ORDER BY a.month;
```

### Design questions

Typical asks: design the database for a URL shortener, a ride-hailing app, a chat app, a library, an Instagram-style feed, or the ticket booking app from Part 7. Walk through it in this order:

1. Entities and relationships (draw them).
2. Keys and constraints, especially the business rule that must never break.
3. The top 3–5 queries the app runs, and the indexes that serve them.
4. Growth path: read replicas, caching, partitioning, vertical splits, and sharding only when needed.
5. Failure plan: backups, restore time, replica lag, failover.
6. Trade-offs you chose and why.

### Scenario questions (with the 20-year lesson behind them)

- **"This query got slow when the table hit 50 million rows. What do you do?"** Find it in the slow log or pg_stat_statements, EXPLAIN ANALYZE, look for full scans and bad estimates, fix the query or index, measure again (Part 8.5).
- **"Add a NOT NULL column to a 200-million-row table without downtime."** Add it nullable, backfill in batches, then add the constraint. A column with a constant default is instant in PostgreSQL 11+ and MySQL 8.0+.
- **"Two users bought the same seat. How do you prevent it?"** A unique constraint on (show_id, seat_id) plus a transaction (Part 7, Project 2).
- **"A user saves a profile, refreshes, and sees old data."** Replica lag: route reads-after-writes to the primary (Cookbook 14).
- **"Writes suddenly fail on PostgreSQL with a wraparound warning."** Find long transactions, let VACUUM finish (in the worst case in single-user mode), then tune autovacuum and add XID-age alerts (Part 8.7, Sentry 2015).
- **"How do you know your backups work?"** We restore them on a schedule, check row counts, time the restore and alert on failure (Cookbook 13, GitLab 2017).
- **"Our primary went down and the replica was promoted automatically, and now data is missing."** Explain split brain and replica lag, reconcile from binlog/WAL, and add fencing so only one primary can accept writes (Part 9.5, GitHub 2018).
- **"How do you review SQL written by an AI assistant?"** Dialect, row counts, join fan-out, NULLs and ties, EXPLAIN, and transaction plus backup for writes (Part 0.6).
- **"Tell me about a database outage you learned from."** Pick one from the Failure Atlas (Part 11), explain the trigger, the failure class, and the control you would add, then show you reproduced it (Part 17).
- **"Should we store this in JSON?"** Only for flexible attributes you rarely filter or join on; core fields stay in columns with constraints.

### Where to practise

| Platform | Best for | Cost |
|---|---|---|
| [LeetCode Top SQL 50](https://leetcode.com/studyplan/top-sql-50/) | A structured first 50 problems | Free |
| [DataLemur](https://datalemur.com/questions) | Real interview-style questions from product companies | Free tier + paid |
| StrataScratch | Business-case questions | Free tier + paid |
| pgexercises.com | PostgreSQL-specific practice | Free |
| HackerRank SQL | Gentle beginner drills | Free |
| SQL Murder Mystery (Knight Lab) | A fun detective game for joins | Free |

### 2-week interview sprint

- [ ] Days 1–3: read the concept table aloud, 10 questions per day, answering before you look.
- [ ] Days 1–14: 3 problems per day, LeetCode SQL 50 first, then DataLemur.
- [ ] Days 5 and 10: one design question on paper in 30 minutes, including the failure plan.
- [ ] Days 7 and 14: a timed mock, 3 problems in 45 minutes, explaining out loud.
- [ ] Prepare three stories: a slow query you fixed (Project 3), a data bug you prevented (Project 2), and a public postmortem you studied and what you would have monitored.

---

## Roadmap to database expert

Becoming a database expert takes 12–18 months of steady practice after this book, in five phases. Do not move on until you pass the gate: a gate you can demonstrate is worth more than a chapter you have read.

| Phase | When | What to do | Gate to pass |
|---|---|---|---|
| 1. SQL fluency | Weeks 1–4 | Parts 0–6, Mosh's course, daily problems | Solve the LeetCode SQL 50 without hints |
| 2. Data modeling | Month 2 | Part 7, Projects 1–2, *SQL Antipatterns* | Design a new app's schema in 30 minutes and defend each constraint |
| 3. Performance | Month 3 | Parts 8–9, Project 3, *SQL Performance Explained* | Read any EXPLAIN plan and show a measured speed-up |
| 4. Production | Months 4–6 | Project 4, Parts 11–14: migrations, tested backups, replicas, time-bomb audits, monitoring, security | Restore a backup on schedule, run a replica, ship a zero-downtime migration |
| 5. Expert | Months 6–18 | Parts 15–17, Internals (Rogov), *DDIA* 2nd ed., CMU 15-445, Jepsen reports, partitioning and sharding, public postmortems | Explain MVCC, WAL and a B-tree page split, and help others debug real problems |

Phases 1–3 cover what most developer interviews test; phases 4–5 are the specialist path toward database engineer and DBA roles.

### Reading list

Read one book per phase, in this order, with a database open.

| Book | Author | Level | Read it for | Phase |
|---|---|---|---|---|
| *Learning SQL*, 3rd ed. (O'Reilly, 2020) | Alan Beaulieu | Beginner | A clear, complete tour of the language | 1 |
| *Practical SQL*, 2nd ed. (No Starch, 2022) | Anthony DeBarros | Beginner | PostgreSQL on real public datasets | 1 |
| [*SQL Antipatterns, Volume 1*](https://www.oreilly.com/library/view/-/9798888650011/) (Pragmatic Bookshelf, 2022) | Bill Karwin | Intermediate | The design and query mistakes teams actually make, and the fixes | 2 |
| *SQL Performance Explained* (free online as use-the-index-luke.com) | Markus Winand | Intermediate | How indexes really work, across databases | 3 |
| *Efficient MySQL Performance* (O'Reilly, 2021) | Daniel Nichter | Intermediate | MySQL performance from an app developer's view | 3 |
| *High Performance MySQL*, 4th ed. (O'Reilly, 2021) | Silvia Botros, Jeremy Tinley | Advanced | Running MySQL in production: replication, scaling, operations | 4 |
| *Database Reliability Engineering* (O'Reilly, 2017) | Laine Campbell, Charity Majors | Advanced | The modern operations mindset: automation, recovery, on-call | 4 |
| [*PostgreSQL 14 Internals*](https://postgrespro.com/community/books/internals) (free PDF) | Egor Rogov | Advanced | MVCC, VACUUM, WAL, locks, the planner and every index type | 5 |
| [*Designing Data-Intensive Applications*, 2nd ed.](https://martin.kleppmann.com/2026/03/24/designing-data-intensive-applications-2e.html) (O'Reilly, March 2026) | Martin Kleppmann, Chris Riccomini | Expert | Replication, partitioning, consistency and distributed data systems | 5 |
| *Database Internals* (O'Reilly, 2019) | Alex Petrov | Expert | How storage engines and distributed databases are built | 5 |

**Free extras:** the official PostgreSQL documentation and MySQL Reference Manual; CMU 15-445/645 *Intro to Database Systems* lectures (Andy Pavlo); Stonebraker and Pavlo's 2024 paper (an afternoon's read that explains 60 years of database history); and the public postmortems in the Sources list, which teach more about production than most books.

---

## One-page cheat sheet

```sql
-- READ (written order)
SELECT   col, SUM(x) AS total
FROM     t1
JOIN     t2 ON t2.t1_id = t1.id
WHERE    row_filter
GROUP BY col
HAVING   SUM(x) > 100
ORDER BY total DESC
LIMIT    10 OFFSET 0;
-- run order: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT

-- WRITE (SELECT the WHERE first, then wrap in a transaction)
INSERT INTO t (a, b) VALUES (1, 'x'), (2, 'y');
UPDATE t SET a = a + 1 WHERE id = 5;
DELETE FROM t WHERE id = 5;
BEGIN;  /* changes */  COMMIT;   -- or ROLLBACK;

-- ANTI-JOIN: rows with no match
SELECT a.* FROM a LEFT JOIN b ON b.a_id = a.id WHERE b.id IS NULL;

-- TOP N PER GROUP
SELECT * FROM (
  SELECT t.*, ROW_NUMBER() OVER (PARTITION BY grp ORDER BY val DESC) AS rn
  FROM t
) x WHERE rn <= 3;

-- RUNNING TOTAL, PREVIOUS ROW, SHARE OF TOTAL
SUM(v) OVER (ORDER BY d)
LAG(v) OVER (ORDER BY d)
100.0 * v / SUM(v) OVER ()

-- PIVOT
SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid

-- STEPS
WITH step1 AS (SELECT ...), step2 AS (SELECT ... FROM step1)
SELECT * FROM step2;

-- INDEX + PLAN
CREATE INDEX idx_t_a_b ON t (a, b);   -- equality column first, range column last
EXPLAIN ANALYZE SELECT ...;

-- HEALTH CHECKS
-- PostgreSQL: SELECT datname, age(datfrozenxid) FROM pg_database;   (XID age)
-- PostgreSQL: SELECT client_addr, replay_lag FROM pg_stat_replication;
-- MySQL:      SHOW REPLICA STATUS\G   (Seconds_Behind_Source)
-- MySQL:      SELECT * FROM information_schema.innodb_trx;   (long transactions)
```

### Twelve rules that prevent most production bugs

1. Name the columns in every INSERT and SELECT.
2. NULL is "unknown": use `IS NULL`; `COUNT(col)` skips NULLs; `NOT IN` with a NULL returns nothing.
3. Filter the right-hand table of a LEFT JOIN in `ON`, not in `WHERE`.
4. Aggregate before you join, to avoid fan-out double counting.
5. Never wrap an indexed column in a function inside WHERE; compare ranges instead.
6. SELECT before every UPDATE or DELETE, and run them inside a transaction.
7. Money in `DECIMAL`, time in UTC.
8. Let constraints guard the data: PK, FK, UNIQUE, NOT NULL, CHECK.
9. Keyset pagination for big tables; OFFSET only for small ones.
10. Parameterized queries, always. Never paste user input into SQL.
11. Keep transactions short; watch XID age (PostgreSQL) and long transactions (MySQL).
12. A backup counts only after a successful, timed restore. A replica is not a backup.

---

## Sources

Research for Part 0 and the production lessons, plus the facts cited elsewhere in this book.

**History and trends**

- Stonebraker and Pavlo, "What Goes Around Comes Around... And Around...", SIGMOD Record, June 2024: https://db.cs.cmu.edu/papers/2024/whatgoesaround-sigmodrec2024.pdf
- Summary of the paper's conclusions (BigDATAwire, July 2024): https://bigdatawire.com/2024/07/08/dont-believe-the-big-database-hype-stonebraker-warns
- Stack Overflow Developer Survey 2025, Technology: https://survey.stackoverflow.co/2025/technology/
- PostgreSQL's rise in the survey since 2017 (EDB, August 2025): https://enterprisedb.com/blog/postgresqls-incredible-trip-top-developers-0

**Production incidents**

- Sentry, "Transaction ID Wraparound in Postgres" (July 2015): https://blog.sentry.io/transaction-id-wraparound-in-postgres
- Uber, "Why Uber Engineering Switched from Postgres to MySQL" (July 2016): https://www.uber.com/en-FR/blog/postgres-to-mysql-migration/
- Responses: LWN summary https://lwn.net/Articles/696085 · Markus Winand https://use-the-index-luke.com/blog/2016-07-29/on-ubers-choice-of-databases · Robert Haas https://enterprisedb.com/blog/ubers-move-away-postgresql
- GitLab, "Postmortem of database outage of January 31" (February 2017): https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/
- Daily restore-test practice after GitLab and Instapaper: https://ruk.ca/content/art-meltdown-postmortem
- GitHub, "October 21 post-incident analysis" (October 2018): https://github.blog/2018-10-30-oct21-post-incident-analysis/
- Figma, "How Figma's databases team lived to tell the scale" (March 2024): https://www.figma.com/blog/how-figmas-databases-team-lived-to-tell-the-scale/
- Notion's and Figma's sharding approaches compared (pganalyze): https://pganalyze.com/blog/5mins-postgres-figma-dbproxy-sharding-postgres

**Security**

- MOVEit SQL injection, scale of impact (TechTarget): https://www.techtarget.com/cybersecurity/news/366553304/Clop-MoveIt-Transfer-attacks-affect-over-2000-organizations
- MOVEit as a SQL injection reminder (SC Media): https://www.scworld.com/native/sql-injection-vulnerability-in-moveit-transfer-leads-to-data-breaches-worldwide
- OWASP Top 10 2025 changes (GitLab blog): https://about.gitlab.com/blog/2025-owasp-top-10-whats-changed-and-why-it-matters/

**AI and SQL**

- Spider 2.0 benchmark (ICLR 2025): https://github.com/xlang-ai/Spider2
- Drop from ~90% to 10–20% on enterprise tasks at release: https://ascii.co.uk/news/article/news-20260118-3e9e9dee/spider-20-exposes-text-to-sql-accuracy-crisis-in-enterprise
- A leading system at about 72% execution accuracy on Spider 2.0-Lite (Oracle): https://blogs.oracle.com/cloud-infrastructure/?p=15151

**Versions and features**

- MySQL 9.7 LTS announcement (April 2026): https://blogs.oracle.com/mysql/mysql-9-7-0-lts-is-now-available-expanded-community-capabilities-and-dynamic-data-masking-for-enterprise
- MySQL 9.7 context (InfoQ, May 2026): https://infoq.com/news/2026/05/mysql-97-lts/
- MySQL 9.0 "What Is New" (inline foreign keys, VECTOR type): https://dev.mysql.com/doc/refman/9.0/en/mysql-nutshell.html
- PostgreSQL 19 Beta 4 (September 2026): https://www.postgresql.org/about/news/postgresql-19-beta-4-3386/

**Deep Research Edition (Parts 11–17)**

- Basecamp ID exhaustion (November 2018): https://signalvnoise.com/svn3/update-on-basecamp-3-being-stuck-in-read-only-as-of-nov-8-922am-cst/
- Instapaper 2 TB limit (February 2017): https://techcrunch.com/2017/02/14/instapaper-says-its-now-fully-restored-after-last-weeks-outage/ · details quoted at https://mjtsai.com/blog/2017/02/14/instapaper-outage-cause-recovery/
- Mandrill transaction-ID wraparound (February 2019): https://mailchimp.com/what-we-learned-from-the-recent-mandrill-outage/ · shard detail: https://status.paywhirl.com/incidents/kctywjfj877v
- Atlassian post-incident review (April 2022): https://atlassian.com/engineering/post-incident-review-april-2022-outage
- Discord, "How Discord Stores Trillions of Messages" (2023): https://discord.com/blog/how-discord-stores-trillions-of-messages · node counts: https://www.infoq.com/news/2023/06/discord-cassandra-scylladb/
- AWS DynamoDB us-east-1 summary (October 2025): https://aws.amazon.com/message/101925
- Cloudflare outage of 18 November 2025: https://blog.cloudflare.com/18-november-2025-outage/ · timeline summary: https://www.ilert.com/postmortems/cloudflare-global-outage-nov-2025
- GoCardless, "Zero-downtime Postgres migrations: the hard parts": https://gocardless.com/blog/zero-downtime-postgres-migrations-the-hard-parts/ · and "a little help": https://gocardless.com/blog/zero-downtime-postgres-migrations-a-little-help/
- NOT VALID / VALIDATE migration patterns: https://www.bytebase.com/blog/postgres-schema-migration-without-downtime/
- gh-ost, why triggerless: https://github.com/github/gh-ost/blob/master/doc/why-triggerless.md · design and continuous testing: https://github.com/github/gh-ost/blob/master/doc/triggerless-design.md
- Jepsen, PostgreSQL 12.3 (June 2020): https://jepsen.io/analyses/postgresql-12.3
- Jepsen, MySQL 8.0.34 (December 2023): https://jepsen.io/analyses/mysql-8.0.34 · later findings (MariaDB option, RDS PostgreSQL): https://jepsen.io/blog
- Percona on MySQL lost updates and MariaDB's snapshot-isolation option: https://www.percona.com/blog/mariadbs-snapshot-isolation-a-fix-that-breaks-more-than-it-fixes/
- Our lab: every item marked **[verified in our lab]** was run on PostgreSQL 16 in October 2026 while writing this edition. MySQL behaviour in Part 13 comes from the Jepsen and Percona sources above and was not re-run here.

**Learning research and books**

- Dunlosky et al. (2013) summarized by the Association for Psychological Science: https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html
- *Designing Data-Intensive Applications*, 2nd ed.: https://martin.kleppmann.com/2026/03/24/designing-data-intensive-applications-2e.html
- *PostgreSQL 14 Internals* (free): https://postgrespro.com/community/books/internals
- *SQL Antipatterns, Volume 1*: https://www.oreilly.com/library/view/-/9798888650011/
- Course this book pairs with: Mosh Hamedani's 3-hour MySQL course.
