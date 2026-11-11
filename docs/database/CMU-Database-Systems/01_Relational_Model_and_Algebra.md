# Database Notes – Lecture 1: Relational Model & Relational Algebra

Nov 11, 2026 · @Akash

These notes cover Lecture 1 of CMU 15-445 (Intro to Database Systems): what a database is, the relational model, keys, and relational algebra. They are written in short lines so you can copy them into your notebook.

**How to copy this into your notebook**

- Write each `##` heading on a new page or with a box around it.
- Underline every **bold word**. These are the words interviewers listen for.
- Lines starting with **Remember:** go in a different colour pen.
- Lines starting with **Explain like this:** are what you say out loud when teaching a friend.
- Draw the small tables by hand. Drawing them is how you remember them.

**The big idea of the whole lecture, in one line**

Tell the database **WHAT** answer you want, not **HOW** to find it. The database figures out the fastest way.

## 1. Database vs Database Management System (DBMS)

A **database** is the data. A **DBMS** is the software that stores and manages that data. People mix them up, but in an interview you must keep them separate.

| Word | Simple meaning | Example |
| --- | --- | --- |
| **Database** | A collection of related data that models something in the real world | List of students in a class: name, email, date of birth |
| **DBMS** | Software that lets apps store, query and analyse a database | PostgreSQL, MySQL, SQLite, SQL Server, ClickHouse, Oracle |

**Explain like this:** "Postgres is not a database. Postgres is a DBMS. The table of my customers inside it is the database."

**Remember:** The professor's advice: for any new app, your first choice should be **PostgreSQL** (or SQLite for small apps). You almost never need to build your own system.

**Why databases matter:** Almost every app (bank, Spotify, Instagram) sits on top of a DBMS. If a query is slow or data looks wrong, knowing what happens inside the DBMS tells you why.

## 2. Why not just store data in CSV files?

You can, but it breaks quickly. This example is how the lecture explains why a DBMS exists.

**The example:** a music app (like Spotify) with two files.

```
artists.csv  ->  "Wu-Tang Clan",1992,"USA"
albums.csv   ->  "Enter the Wu-Tang","Wu-Tang Clan",1993
```

To find something, your code opens the file, reads every line, splits by comma, and checks each value.

**Problems with flat files (learn this list: D-I-I-C-D)**

1. **Data integrity** – Nothing stops bad data. You can type "Wu Tang" in one place and "Wu-Tang" in another. You can add an album whose artist does not exist. You can store a year as "abcd".
2. **Implementation (speed)** – To find one record you must read the whole file line by line (linear scan). Field positions are hard-coded in your program.
3. **Implementation (many apps)** – A second app in Python or Rust must rewrite all the same file-reading logic and keep it in sync.
4. **Concurrency** – Two users write to the file at the same time. Who wins? Data can get mixed up.
5. **Durability** – The machine crashes while writing. What is left in the file? And if the one machine dies, all data is gone unless you copy it to other machines.

**Other design problems:** one album can have many artists (collaborations), but one field allows only one. If you delete an artist, their albums point to nothing (a "dangling" record).

**Explain like this:** "A DBMS solves integrity, speed, concurrency and crash safety for you, so you don't write that hard code yourself in every app."

**Real-world warning from the lecture:** some systems turn off safe writes by default so they look faster in benchmarks. Data can then be lost on a crash. Always check what a DBMS really promises, especially in its documentation.

## 3. Data model vs Schema

A **data model** is the set of rules for how data can be described. A **schema** is one real description of your data that follows those rules.

**Building example (from the lecture)**

- Data model = the rules of architecture: "a building can have rooms, doors and windows."
- Schema = the blueprint of one house: "3 rooms, the door is here, this room is 10 x 12 ft."
- You can build many houses (database instances) from one blueprint.

**Types of data models**

| Data model | Simple meaning | Example systems | Used for |
| --- | --- | --- | --- |
| **Relational** | Tables with rows and columns | PostgreSQL, MySQL, Oracle | Most apps (this course) |
| **Key/Value** | A key maps to a value, like a hashmap | Redis | Caching |
| **Document** | JSON or XML objects | MongoDB | Flexible app data |
| **Graph** | Nodes and edges | – | Relationships, networks |
| **Wide-column / Column-family** | Groups of columns | – | NoSQL workloads |
| **Array / Matrix / Vector** | Vectors, matrices, tensors | – | Machine learning, science, RAG / semantic search |
| **Hierarchical, Network** | Tree or linked records | IBM IMS | Old systems (1960s–80s) |

**Remember:** Key/value, graph, document and column-family are usually called **NoSQL**. Most NoSQL systems now add SQL support too.

**Professor's view:** the relational model is the base building block. Other models are either weaker or a subset of what relational can do. Matrices are one case where relational is not always the best fit.

## 4. Short history: why the relational model won

Old systems made the programmer walk through the data by hand. The relational model let the programmer just ask for the answer. That is why it won.

**Timeline to write in your notebook**

- **1965** – First DBMS: **IDS** by General Electric, written in assembly.
- **Late 1960s** – **IBM IMS**, a hierarchical DBMS built for the Apollo moon mission. Banks still use it today.
- **1969–70** – **Ted Codd** (IBM) proposes the **relational model**.
- **1973** – **Charles Bachman** wins the Turing Award; his paper "The Programmer as Navigator" pushes the **CODASYL** / navigational way.
- **1974** – The big debate at the University of Michigan: CODASYL people vs relational people. Relational wins over time.
- After that: **System R** (IBM, Jim Gray worked on it) and **Ingres** (Mike Stonebraker). Postgres is named "Post-Ingres".

**The 4 database Turing Award winners:** Codd, Bachman, Gray, Stonebraker.

**Old way (navigational, CODASYL) vs New way (relational, SQL)**

| Old way | New way (SQL) |
| --- | --- |
| You write nested for-loops over artists, then albums | You write one query: `SELECT ... FROM artist JOIN album ...` |
| You decide the order and the path (the HOW) | You say only the result you want (the WHAT) |
| If data grows or changes shape, your loop may become slow and you must rewrite code | The DBMS picks a new best plan by itself |

**Explain like this:** "Old systems were like giving a taxi driver every turn. SQL is like just telling the driver the address."

## 5. The relational model: 3 key ideas

Ted Codd's relational model is built on three simple ideas. Learn them as **S-I-A**: Simple structure, Integrity, Access through a high-level language.

1. **Simple structure** – Store data in **relations** (tables). Link tables using **values** (like an ID), not memory addresses or disk positions.
2. **Integrity** – Add **constraints** so bad data can't get in. Example: the year column must be an integer.
3. **High-level access** – You ask for data with a **declarative** language (SQL). The DBMS chooses the best way to run it.

**Why this matters:** the data changes over time (100 rows today, 1 billion next year). Your SQL stays the same. The DBMS just picks a new, faster plan.

**Data independence (draw this in your notebook)**

&#91;embedded content: data independence · 5 layers\]

Each layer hides the one below it. Change how data is stored and the app's SQL does not break: that is **physical data independence**.

**Explain like this:** "A **view** is like a window. I can show the students table to an app but hide the password column."

**Interview tip:** old IBM IMS made you choose a tree or a hash table, and the API changed with that choice. Switching meant rewriting the app. Relational systems removed that problem.

## 6. Words you must know: relation, tuple, keys, NULL, constraints

A relation is a table, a tuple is a row, an attribute is a column. Keys connect and identify rows.

| Formal word | Everyday word | Simple meaning |
| --- | --- | --- |
| **Relation** | Table | An **unordered set** of rows describing one kind of thing (students, artists) |
| **Tuple** | Row / record | One entry in the table |
| **Attribute** | Column | One property, like name or year |
| **Domain** | Data type / allowed values | What values a column may hold (e.g. a 32-bit integer) |
| **NULL** | Unknown | A special value meaning "we don't know". You can't compare or reason about it like a normal value |
| **n-ary relation** | Table with n columns | A table with 3 columns is a 3-ary relation |

**Remember:** "unordered" means the rows have no fixed order. If you want order, you must ask for it (ORDER BY).

### Primary key

A **primary key** uniquely identifies **one** row in a table.

- Artist name is a bad primary key: two bands can have the same name.
- So we add a **synthetic key**: an `id` column that the DBMS fills with a counter (1, 2, 3 …). Also called an **identity column** or **sequence**.
- A **natural key** comes from real life. Example: a university email address.

### Foreign key

A **foreign key** says: "the value in this column must exist in another table." It stops dangling records.

**Draw these 3 tables (many-to-many example)**

```
ARTIST                      ALBUM
id  | name      | year      id | name           | year
----+-----------+-----      ---+----------------+-----
101 | Wu-Tang   | 1992      11 | Enter the 36   | 1993
102 | Notorious | 1992      22 | DJ Tribute     | 2025
103 | GZA       | 1990

ARTIST_ALBUM  (the link table)
artist_id | album_id
----------+---------
   101    |   11
   101    |   22
   103    |   22
```

- `ARTIST_ALBUM` is a **cross-reference** (join) table. One row = "this artist is on this album".
- Its primary key is **both columns together** (artist\_id + album\_id). Yes, a primary key can have many columns.
- `artist_id` is a foreign key to `ARTIST.id`. `album_id` is a foreign key to `ALBUM.id`.
- Now one album can have many artists, and one artist many albums.
- If you try to delete an artist who still appears in `ARTIST_ALBUM`, the DBMS stops you.

### Constraints

Rules the DBMS checks on every insert or update, beyond the data type.

- `NOT NULL` – name can't be empty.
- `CHECK (year > 1900)` – a value must follow a rule.
- `UNIQUE` – no two rows share this value.
- **Assertions** – bigger rules checked by a SQL query each time. Rarely used because they are slow.

## 7. DML: two ways to ask for data

**DML (Data Manipulation Language)** is how you store and get data. Even a read-only `SELECT` counts as DML.

| Type | You describe | Theory behind it | Example |
| --- | --- | --- | --- |
| **Procedural** | The exact steps and their order (HOW) | **Relational algebra** | Nested for-loops, or an algebra expression |
| **Non-procedural / Declarative** | Only the result you want (WHAT) | **Relational calculus** | SQL |

**Remember:** SQL is declarative. Inside, the DBMS turns your SQL into relational algebra steps and picks the best order. That inside part is the **query optimizer**.

**What to study:** relational algebra is a must (it is how queries run inside the engine). Relational calculus is only needed if you build a query optimizer.

## 8. Relational algebra: the 7 basic operators

Codd defined 7 operators. Each one takes table(s) in and gives **one table out**, so you can chain them like LEGO blocks to build any query.

**Memory trick:** **S**ome **P**eople **U**se **I**ntelligent **D**ata **P**roducts **J**oyfully = Select, Projection, Union, Intersection, Difference, Product, Join.

| # | Operator | Symbol | What it does (simple) | SQL version |
| --- | --- | --- | --- | --- |
| 1 | **Select** | σ (sigma) | Keeps only the **rows** that match a condition | `WHERE` |
| 2 | **Projection** | π (pi) | Keeps / reorders / changes **columns** | the column list after `SELECT` |
| 3 | **Union** | ∪ | All rows from both tables | `UNION` (or `UNION ALL` to keep duplicates) |
| 4 | **Intersection** | ∩ | Only rows in **both** tables | `INTERSECT` |
| 5 | **Difference** | − | Rows in the first table but **not** the second | `EXCEPT` |
| 6 | **Product** | × | **Every** row of A paired with **every** row of B | `CROSS JOIN` |
| 7 | **Join** | ⋈ (bowtie) | Pairs rows from A and B that **match** on a value | `JOIN ... ON ...` |

**Interview trap:** the algebra **Select (σ)** is the SQL **WHERE**, not the SQL SELECT. The SQL SELECT list is **Projection (π)**.

### Worked examples (copy these by hand)

**Table R** for select and projection:

```
R(a_id, b_id)
a1 | 101
a2 | 102
a2 | 103
a3 | 104
```

**1. Select** – `σ a_id='a2' (R)` gives `a2|102` and `a2|103`.

```sql
SELECT * FROM R WHERE a_id = 'a2';
```

With two conditions: `σ a_id='a2' ∧ b_id>102 (R)` gives only `a2|103`. (∧ means AND.)

**2. Projection** – `π b_id-100, a_id ( σ a_id='a2' (R) )` gives `2|a2` and `3|a2`.

```sql
SELECT b_id - 100, a_id FROM R WHERE a_id = 'a2';
```

Projection can reorder columns, drop columns (like hiding a password) and compute new values.

**Tables for set operators** (both must have the **same columns**):

```
R(a_id, b_id)      S(a_id, b_id)
a1 | 101           a3 | 103
a2 | 102           a4 | 104
a3 | 103           a5 | 105
```

- **3. Union** – `R ∪ S` = a1, a2, a3, a4, a5 (a3|103 shown once).
- **4. Intersection** – `R ∩ S` = `a3|103` only.
- **5. Difference** – `R − S` = `a1|101`, `a2|102`.

```sql
(SELECT * FROM R) UNION (SELECT * FROM S);
(SELECT * FROM R) INTERSECT (SELECT * FROM S);
(SELECT * FROM R) EXCEPT (SELECT * FROM S);
```

**6. Product** – `R × S` = 3 × 3 = **9 rows**, every combination. Usually too noisy to be useful alone.

```sql
SELECT * FROM R CROSS JOIN S;   -- or: SELECT * FROM R, S;
```

**7. Join** – think of it as **Product + a filter**. `R ⋈ S` (natural join) matches columns with the same name and type, so the result is `a3|103`.

```sql
SELECT * FROM R JOIN S ON R.a_id = S.a_id AND R.b_id = S.b_id;
```

**Remember:** avoid `NATURAL JOIN` in real code. It guesses the matching columns from their names. Always write the `ON` condition yourself.

**Extra operators added later:** rename (ρ), assignment, duplicate removal, aggregation (AVG, COUNT, SUM), sorting (ORDER BY), division. The original 7 had no sorting or aggregation.

## 9. Why the order of steps matters (query performance)

The same answer can be fast or very slow depending on the order of operations. This is why we let the DBMS choose.

**Example:** find rows in R joined with S where `b_id = 102`.

- **Plan A:** `σ b_id=102 ( R ⋈ S )` – join everything first, then filter.
- **Plan B:** `R ⋈ ( σ b_id=102 (S) )` – filter S first, then join the few rows left.

Both give the **same answer**. But if R and S each have **1 trillion rows** and only 2 match, Plan A does a huge join for nothing. Plan B is far faster.

**Remember (professor's rule):** always think in **extremes**. Imagine a table with 5 rows and then with 1 trillion rows. Does your plan still work?

**Explain like this:** "Relational algebra fixes the order of steps. SQL does not. So in SQL the optimizer can reorder steps, like pushing the filter before the join, to make the query fast."

**Note:** many operators can be reordered safely, but not always. You can't project a column away and then filter on it later.

## 10. Using this in real production work

These are the habits from this lecture that show up in real jobs.

1. **Start with PostgreSQL** (or SQLite for small or local apps). Don't build your own storage in files.
2. **Use a synthetic primary key** (`id` with an identity / sequence) when no natural value is truly unique.
3. **Model many-to-many with a link table** (like `ARTIST_ALBUM`) with a composite primary key.
4. **Declare foreign keys** so you can't get orphan rows when something is deleted.
5. **Add constraints** (`NOT NULL`, `CHECK`, `UNIQUE`). Let the database protect your data, not just your app code.
6. **Use views** to hide sensitive columns (passwords, salaries) from some apps or users.
7. **Write explicit joins** with `ON`. Avoid `NATURAL JOIN` and accidental cross joins (a missing join condition gives you rows × rows).
8. **Remember NULL means unknown.** `col = NULL` never matches. Use `IS NULL`.
9. **When a query is slow, think about the plan.** Is it filtering early? Use `EXPLAIN` in Postgres to see the plan the optimizer chose.
10. **Check durability settings.** Read the docs: is data really safe on disk after a write, or only in memory?

**Starter SQL for the music example (practice typing this in Postgres)**

```sql
CREATE TABLE artist (
  id    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  year  INT CHECK (year > 1900),
  country VARCHAR(50)
);

CREATE TABLE album (
  id    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name  VARCHAR(200) NOT NULL,
  year  INT
);

CREATE TABLE artist_album (
  artist_id INT REFERENCES artist(id),
  album_id  INT REFERENCES album(id),
  PRIMARY KEY (artist_id, album_id)
);

-- Which artists are on album 22?
SELECT ar.name
FROM artist ar
JOIN artist_album aa ON ar.id = aa.artist_id
WHERE aa.album_id = 22;
```

## 11. Interview questions with short answers

Practise saying each answer out loud in 2–3 sentences.

1. **What is the difference between a database and a DBMS?**
   - A database is the related data itself. A DBMS is the software (like PostgreSQL) that stores, protects and queries it.
2. **Why use a DBMS instead of files?**
   - Files give no data integrity, slow full scans, no safe multi-user writes, and no crash safety. A DBMS handles all of these.
3. **What is a data model? What is a schema?**
   - A data model is the rules for describing data (relational, document, key/value). A schema is one actual design that follows those rules, like a blueprint.
4. **What are the 3 key ideas of the relational model?**
   - Store data in simple relations (tables), keep it correct with integrity constraints, and access it with a high-level declarative language.
5. **What is data independence?**
   - Physical: you can change how data is stored without changing queries. Logical: you can change tables without breaking views and apps.
6. **Primary key vs foreign key?**
   - A primary key uniquely identifies a row in its own table. A foreign key points to a primary key in another table, so the value must exist there.
7. **Can a primary key have more than one column?**
   - Yes. That is a composite key, like (artist\_id, album\_id) in a link table.
8. **Natural key vs synthetic key?**
   - A natural key comes from real data (email). A synthetic key is a generated number (id). Use synthetic when real values can repeat or change.
9. **How do you model a many-to-many relationship?**
   - Use a third link table that holds both foreign keys, with both columns as the primary key.
10. **What does NULL mean?**
    - The value is unknown. You can't treat it like a normal value, so you check it with `IS NULL`.
11. **Procedural vs declarative language?**
    - Procedural says HOW (exact steps and order), like relational algebra. Declarative says WHAT result you want, like SQL.
12. **Name the basic relational algebra operators.**
    - Select σ, Projection π, Union ∪, Intersection ∩, Difference −, Product ×, Join ⋈.
13. **Is relational algebra Select the same as SQL SELECT?**
    - No. Algebra Select filters rows, which is SQL `WHERE`. SQL's SELECT column list is Projection.
14. **What is the difference between a cross join and a join?**
    - A cross join pairs every row with every row. A join pairs only rows that match a condition: a product plus a filter.
15. **Why does SQL let the DBMS choose the order of steps?**
    - Because data changes. The optimizer can pick a faster plan, like filtering before joining, without you rewriting the query.
16. **What is NoSQL?**
    - Non-relational systems such as key/value (Redis), document (MongoDB), graph and column-family. Many now support SQL too.

## 12. One-page revision (write this on the last page)

- **Database** = the data. **DBMS** = the software.
- **Files are bad** because of integrity, speed, concurrency and crashes.
- **Data model** = rules. **Schema** = blueprint.
- **Relational model (Codd, \~1970)** = tables + constraints + declarative queries.
- **Relational won** over hierarchical / CODASYL because you say WHAT, not HOW.
- **Data independence:** change storage or tables without breaking the app.
- **Relation = table, tuple = row, attribute = column, NULL = unknown.**
- **Primary key** = unique row ID. **Foreign key** = must exist in another table.
- **Many-to-many** = link table with a composite primary key.
- **Relational algebra** (7): σ rows, π columns, ∪ ∩ − sets, × all pairs, ⋈ matching pairs.
- **σ = WHERE, π = SELECT list.**
- **Order of steps changes speed.** Filter early. Think: 5 rows vs 1 trillion rows.
- **First choice in real life: PostgreSQL.**

**Next lecture:** writing queries in modern SQL.
