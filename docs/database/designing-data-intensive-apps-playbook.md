# DDIA Made Simple
## Learn *Designing Data-Intensive Applications* by building a real app, and walk into any system design interview ready
### NestJS + PostgreSQL · one real-world app · 12 hands-on modules · plain-English explanations · interview answers

> **What this is.** A step-by-step guide that turns Martin Kleppmann's book into things you build, break, measure, write about, teach and explain in interviews. Every idea is explained in everyday words first, with an example from normal life, before any technical term appears. Every technical word is explained the first time it shows up. You can follow everything here with the book, a terminal and the official docs of each tool. No AI assistant is needed at any step.

---

## Contents

- **Getting started**
  - [Start here](#start-here)
  - [The 30 words you need before Module 1](#the-30-words-you-need-before-module-1)
  - [The story we'll build: one ticket, start to finish](#the-story-well-build-one-ticket-start-to-finish)
  - [Why this matters in the age of AI](#why-this-matters-in-the-age-of-ai)
- **[Part 1 · Set up your lab](#part-1--set-up-your-lab)**
  - [How to run this as a team](#how-to-run-this-as-a-team)
  - [TicketRush: the domain](#ticketrush-the-domain)
  - [The tools, and what each one is for](#the-tools-and-what-each-one-is-for)
  - [Repository layout](#repository-layout)
  - [Shared building blocks (write these once)](#shared-building-blocks-write-these-once)
- **[Part 2 · The 12 modules](#part-2--the-12-modules)**
  - [Module 1 · Reliable, scalable, maintainable](#module-1--reliable-scalable-maintainable)
  - [Module 2 · Data models and query languages](#module-2--data-models-and-query-languages)
  - [Module 3 · Storage and retrieval](#module-3--storage-and-retrieval)
  - [Module 4 · Encoding and evolution](#module-4--encoding-and-evolution)
  - [Module 5 · Replication](#module-5--replication)
  - [Module 6 · Partitioning (sharding)](#module-6--partitioning-sharding)
  - [Module 7 · Transactions](#module-7--transactions)
  - [Module 8 · The trouble with distributed systems](#module-8--the-trouble-with-distributed-systems)
  - [Module 9 · Consistency and consensus](#module-9--consistency-and-consensus)
  - [Module 10 · Batch processing](#module-10--batch-processing)
  - [Module 11 · Stream processing](#module-11--stream-processing)
  - [Module 12 · Putting it all together](#module-12--putting-it-all-together)
- **[Part 3 · The system design interview guide](#part-3--the-system-design-interview-guide)**
  - [A. How a system design interview works](#a-how-a-system-design-interview-works)
  - [B. The 7-step framework](#b-the-7-step-framework)
  - [C. Back-of-the-envelope math](#c-back-of-the-envelope-math)
  - [D. Numbers worth remembering](#d-numbers-worth-remembering)
  - [E. A complete worked answer: "Design a ticket booking system"](#e-a-complete-worked-answer-design-a-ticket-booking-system)
  - [F. Topics interviews ask that the book only touches](#f-topics-interviews-ask-that-the-book-only-touches)
  - [G. Other classic questions, mapped to the modules](#g-other-classic-questions-mapped-to-the-modules)
  - [H. Trade-off cheat sheet](#h-trade-off-cheat-sheet)
  - [I. Talking about your POCs (behavioural questions)](#i-talking-about-your-pocs-behavioural-questions)
  - [J. Red flags to avoid](#j-red-flags-to-avoid)
  - [K. Last-night revision sheet](#k-last-night-revision-sheet)
- **[Part 4 · Capstone, templates and checklists](#part-4--capstone-templates-and-checklists)**
  - [Capstone: TicketRush 1.0 and game day](#capstone-ticketrush-10-and-game-day)
  - [Appendices](#appendices)

---

## Start here

### Who this guide is for

Anyone who writes software and wants to understand how real systems store, move and protect data: a junior developer who has only used one database, a frontend developer moving to backend, a senior engineer preparing for system design interviews, or a team lead running internal training. You don't need to know anything about distributed systems. If you can write a basic REST API and a SQL `SELECT`, you can follow this guide.

### How every module is explained

Each module follows the same path, from simple to deep, so you never meet a word you haven't been given:

| Part | What it gives you |
|---|---|
| **In one line** | The whole idea in a single sentence. |
| **Think of it like this** | An everyday example (a bank, a library, a cinema) that shows the idea without any tech words. |
| **The idea, step by step** | The concept explained slowly, in short sentences. |
| **Words you'll meet** | A small dictionary: each technical word, what it means in plain English, and an example. |
| **Picture it** | A simple diagram. |
| **Build it** | The hands-on proof of concept (POC) in NestJS + PostgreSQL, with code. |
| **Break it, Measure it** | Experiments that make the problem happen on your laptop, and a table to record what you saw. |
| **Mistakes people make** | The traps, so you can avoid them at work and spot them in interviews. |
| **Interview corner** | Questions interviewers really ask about this topic, with answers you can say out loud. |
| **Cheat card** | Six lines to re-read the night before an interview. |
| **Share it** | A blog post outline and a 90-minute training session plan for your team. |

### Which book edition do you have?

Your PDF is the **early-release copy of the first edition** (491 pages). It has Chapters 1–11; Chapter 12 wasn't written yet when that copy was made. The full first edition came out in 2017. A **second edition**, written by Martin Kleppmann and Chris Riccomini, was published by O'Reilly in **March 2026** (about 670 pages, 14 chapters). The big ideas are the same; the second edition adds cloud systems, renames "partitioning" to "sharding", splits the first chapter into two, and adds a chapter on law, privacy and responsibility.

This guide works with any edition. Each module lists where to read in both:

| Module | 1st edition (your PDF) | 2nd edition (2026) |
|---|---|---|
| 1 Reliable, scalable, maintainable | Ch 1 (PDF p. 23) | Ch 1 Trade-offs in Data Systems Architecture, Ch 2 Defining Nonfunctional Requirements |
| 2 Data models | Ch 2 (p. 47) | Ch 3 |
| 3 Storage and retrieval | Ch 3 (p. 89) | Ch 4 |
| 4 Encoding and evolution | Ch 4 (p. 129) | Ch 5 |
| 5 Replication | Ch 5 (p. 167) | Ch 6 |
| 6 Partitioning / sharding | Ch 6 (p. 213) | Ch 7 |
| 7 Transactions | Ch 7 (p. 235) | Ch 8 |
| 8 Trouble with distributed systems | Ch 8 (p. 287) | Ch 9 |
| 9 Consistency and consensus | Ch 9 (p. 333) | Ch 10 |
| 10 Batch processing | Ch 10 (p. 399) | Ch 11 |
| 11 Stream processing | Ch 11 (p. 447) | Ch 12 |
| 12 Putting it all together | Ch 12 (not in your PDF) | Ch 13, plus Ch 14 for privacy and ethics |

Page numbers for your PDF are the page counter in your PDF reader, not the numbers printed on the pages.

### Tool versions (checked October 2026)

The code in this guide was tested against PostgreSQL 16. A few things in the wider ecosystem have changed recently, and the guide accounts for them:

- **NestJS 12** came out in August 2026. When `nest new` asks whether you want CommonJS or ESM, choose **CommonJS** to follow this guide exactly (it keeps Jest for tests). ESM works too; your test files will use Vitest instead, with almost identical code. NestJS 12 needs Node.js 20.19+ or 22.12+.
- **PostgreSQL 18's Docker image** moved its data folder. This guide pins version 16, where volumes mount at `/var/lib/postgresql/data`. If you move to 18, mount the volume at `/var/lib/postgresql` instead, or the container won't start.
- **KafkaJS** (the Kafka library NestJS uses) has had no new code since mid-2024. It's fine for learning. For production, Confluent's official JavaScript client (version 1.x) offers a KafkaJS-compatible API.
- **Debezium** is on the 3.x line (3.6), and **etcd** on 3.6/3.7; the Compose files below use those.
- **BullMQ** now recommends "job schedulers" (`upsertJobScheduler`) for repeating jobs; Module 10 uses them.

---

## The 30 words you need before Module 1

Read this once. Every module also has its own small dictionary, but these words appear everywhere.

| Word | What it means in plain English | Everyday example |
|---|---|---|
| **Server** | A computer program that waits for requests and answers them. | A waiter taking orders. |
| **Client** | Whatever sends the request: a browser, a mobile app, another server. | The customer at the table. |
| **Request / response** | A question sent to a server, and its answer. | "One coffee, please." / "Here you go." |
| **API** | The list of requests a server accepts, and what each returns. | The restaurant's menu. |
| **Database** | A program that stores data safely and lets you search it. | A well-organised filing cabinet. |
| **Table, row, column** | A table holds one kind of thing; each row is one item; each column is one detail. | A spreadsheet tab "Seats": one row per seat, columns "section", "price". |
| **Query** | A question you ask the database, usually written in SQL. | "Show me all free seats in section A." |
| **Index** | An extra structure that lets the database find rows fast without reading everything. | The index at the back of a book. |
| **Transaction** | A group of database changes that all happen, or none happen. | A bank transfer: money leaves one account and arrives in the other, never half. |
| **Cache** | A fast, temporary copy of data kept close by, so you don't ask the slow source every time. | A sticky note with a phone number you use often. |
| **Queue** | A line of tasks waiting to be processed in order. | The token line at a bank counter. |
| **Message / event** | A small piece of data sent from one program to another, often saying "this happened". | A text message: "Your order has shipped." |
| **Log** | A list of records that you only add to at the end, never edit. | A diary. |
| **Node** | One machine (or one running copy of a program) in a group. | One branch office of a bank. |
| **Cluster** | A group of nodes working together. | All the branches of the bank. |
| **Replica** | A copy of the data kept on another node. | A photocopy of the main ledger kept at a branch. |
| **Partition / shard** | One slice of the data, when data is split across nodes. | A phone book split into volume A–M and volume N–Z. |
| **Latency** | How long one request takes. | How long you wait for your coffee. |
| **Throughput** | How many requests the system handles per second. | How many customers the café serves per hour. |
| **p50, p95, p99** | "Percentiles": p99 = 200 ms means 99 out of 100 requests finish within 200 ms; the slowest 1 take longer. | "99 out of 100 customers get coffee within 5 minutes." |
| **Timeout** | The longest you'll wait before giving up. | Hanging up after 30 seconds of ringing. |
| **Retry** | Trying a failed request again. | Calling back after the line was busy. |
| **Idempotent** | Doing it twice has the same result as doing it once. | Pressing a lift button again doesn't call two lifts. |
| **Concurrency** | Several things happening at the same time. | Two cashiers serving customers at once. |
| **Race condition** | A bug that only happens when two things run at the same moment, in an unlucky order. | Two people at two counters both sell the last cinema seat. |
| **Lock** | A way to make sure only one program changes something at a time. | The single key to a shared meeting room. |
| **Schema** | The agreed shape of data: which fields exist and what type they are. | The layout of a paper form. |
| **Migration** | A script that changes the database's schema, applied in order. | Reprinting the form with a new box, and updating old forms. |
| **Deploy / rolling deploy** | Releasing a new version; "rolling" means replacing servers one by one, so old and new run side by side for a while. | Changing a car's tyres one at a time while it keeps moving. |
| **Failover** | Switching to a backup when the main one fails. | A deputy taking over when the manager is sick. |

---

## The story we'll build: one ticket, start to finish

Every module improves the same application, **TicketRush**, a website for buying event tickets. Here is one purchase, step by step, with what can go wrong at each step and which module fixes it. If you understand this story, you understand why the whole book exists.

| Step | What the user does | What can go wrong | Fixed in |
|---|---|---|---|
| 1 | Opens the site the moment a big concert goes on sale, along with 500,000 other people. | The site falls over. One popular event slows down every other event. | Modules 1, 6 |
| 2 | Browses the seat map. | It's slow. Or it shows a seat as free that was just taken. | Modules 3, 5 |
| 3 | Clicks seat A-12 to hold it for 10 minutes. | Two people click the same seat at the same moment and both "get" it. | Module 7 |
| 4 | Refreshes the page. | Their hold has "disappeared" because the page read from a copy that is a few seconds behind. | Module 5 |
| 5 | Pays. The payment page is slow, so they click "Pay" again. | They are charged twice. | Modules 8, 12 |
| 6 | Gets a confirmation email. | They get no email, or two. | Modules 9, 11 |
| 7 | Searches for other events by the same artist. | Search shows old data, or misses the new event. | Module 11 |
| 8 | Months later, asks the site to delete their account. | Copies of their data stay in caches, search indexes and backups. | Module 12 |
| Behind the scenes | The team ships new versions every day; old mobile apps are still in use. | A new release breaks old apps or loses data during a database change. | Module 4 |
| Behind the scenes | Reports and dashboards run every night. | A buggy report job overwrites good data with bad. | Module 10 |
| Behind the scenes | Background jobs run on several servers. | A job that must run once runs twice because a server froze for a few seconds. | Modules 8, 9 |

---

## Why this matters in the age of AI

AI assistants can write a NestJS controller, a migration and a Kafka consumer in seconds. What they cannot do for you is decide whether that code double-sells a seat when two users click at the same moment, charges a card twice when the client retries, serves stale data right after a failover, or silently loses events when a consumer crashes. Those judgments are exactly what DDIA teaches, and they are becoming the main thing that separates a strong engineer from someone who pastes generated code.

AI products are also data-intensive systems in their own right. A retrieval-augmented chatbot is a database, a derived vector index, a cache, a queue, a rate-limited upstream API and a streaming pipeline glued together. Every chapter of this book applies to them directly, and each module below ends with an "AI-era angle" that shows how.

---

# Part 1 · Set up your lab

This part explains how to run the guide as a team, introduces the tools, and gives you the shared code every module reuses. If a word here is new, check the 30-word dictionary above.

## How to run this as a team

### The loop you run for every module

Each module follows the same seven steps. The order matters: you build only after you can state the problem, and you write only after you have measured.

| Step | What you do | Output |
|---|---|---|
| **Read** | Read the chapter with the "read closely" sections in mind. Take notes in your own words. | `notes.md` in the POC folder |
| **Model** | Write down the invariant or property you care about before coding ("a seat is sold at most once", "a user always sees their own writes"). | Invariant statement at the top of the POC README |
| **Build** | Implement the POC in NestJS + Postgres following the steps. | Running code, `docker compose up` works |
| **Break** | Run the "break it" experiments. Every POC must fail on purpose at least once. | Failure screenshots / logs |
| **Measure** | Load test, record p50/p95/p99, error rates, and the numbers each experiment asks for. | A results table in the README |
| **Write** | Turn what you learned into a blog post using the outline provided. | `blogs/NN-title.md` |
| **Teach** | Run the 90-minute training session for the team. | Slides/notes in `sessions/NN/` |

### Two-week cadence (recommended)

About 1–2 hours per working day. Twelve modules take roughly 24 weeks, plus 3–4 weeks for the capstone. If you want to go faster, compress each module into one week and skip the stretch POCs.

| Days | Activity |
|---|---|
| 1–3 | Read the chapter (45–60 min/day). Write notes. Answer the interview-corner questions out loud without looking. |
| 4–7 | Build the core POC. Commit daily. |
| 8 | Break it: run every failure experiment. |
| 9 | Measure: load test, fill in the results table, write an ADR for any design choice you made. |
| 10 | Draft the blog post; one teammate reviews it. Run the training session at the end of the week. |

### Team operating model

Rotate a **module owner** for each module. The owner builds the reference POC, writes the blog post and runs the session; everyone else reads the chapter and completes at least the core exercises on their own branch. Pairing works well for the "break it" day. Keep everything in one repository so the app grows module by module and anyone can check out any stage.

### Definition of done for a "production-level" POC

A POC is not production-level because it is big. It is production-level because it is honest about failure and can be run by someone else without help. Tick all of these before you call a module done:

- [ ] `docker compose up` plus one command starts everything; no manual steps.
- [ ] README states the invariant, the design, how to run, how to break it, and the measured results.
- [ ] Config is validated at startup; secrets come from env, never from code.
- [ ] Every outbound call (DB, Redis, HTTP, broker) has a timeout.
- [ ] Health endpoints (`/health/live`, `/health/ready`) and graceful shutdown work.
- [ ] Structured logs with a request ID; `/metrics` exposes latency histograms.
- [ ] At least one automated test proves the invariant, including a concurrency test where relevant.
- [ ] A k6 script exists and its results are recorded (p50/p95/p99, error rate, throughput).
- [ ] At least one failure experiment is documented with what happened and why.
- [ ] Schema changes are migrations (numbered SQL files), never hand-edited tables.
- [ ] An ADR records each non-obvious trade-off.

### Golden rules

1. **Measure, don't guess.** Every claim in a blog post needs a number from your own run.
2. **Write the invariant before the code.** If you can't state what must always be true, you can't test it.
3. **Prefer the database's guarantees over application cleverness.** Constraints, transactions and isolation levels are battle-tested; your `if` statement is not.
4. **Assume every network call can hang, fail, or succeed without telling you.**
5. **Explain it in your own words.** If you can only repeat the book's phrasing, you don't own the idea yet.

---

## TicketRush: the domain

Every module extends one application: **TicketRush**, an event ticketing platform (concerts, matches, conferences). Ticketing was chosen on purpose because it forces almost every problem in the book to show up naturally.

| Real-world pressure | Book topic it forces |
|---|---|
| Thousands of people click "buy" on the same seats when sales open | Transactions, isolation, locking, hot spots |
| Millions browse seat maps; few buy | Replication, caching, read scaling |
| A popular event concentrates all load on one key | Partitioning and skew |
| Payments and retries must never double-charge | Idempotency, end-to-end correctness |
| Search, recommendations, dashboards, emails all derive from orders | Batch, streams, CDC, derived data |
| Mobile apps on old versions keep calling your API | Encoding, schema evolution |
| Background jobs run on many replicas | Locks, leases, fencing, leader election |
| An "ask about this event" AI assistant | Vector indexes as derived data, freshness |

### Core domain

| Entity | Meaning |
|---|---|
| `region` | Country → state → city hierarchy |
| `venue` | A place with sections and seats |
| `event` | A show at a venue at a time; has flexible `details` (lineup, FAQ, tags) |
| `seat` | One sellable seat for one event, with status `available` / `held` / `sold` |
| `hold` | A temporary reservation (10 minutes) of a seat by a user |
| `ticket_type` | General-admission inventory with a capacity |
| `order` | A purchase that turns holds into tickets after payment |
| `payment` | A charge at an external provider (mocked) |
| `outbox` / events | Facts published to other systems |

### How TicketRush grows

| Module | TicketRush gains |
|---|---|
| 1 | Skeleton API with SLOs, metrics, health checks, load tests |
| 2 | Relational + JSONB + hierarchical data model, seeded data |
| 3 | Indexes tuned with `EXPLAIN`, an analytics copy in DuckDB, a toy storage engine |
| 4 | Versioned API, Protobuf events, zero-downtime migrations |
| 5 | Primary + replica, read routing with read-your-writes |
| 6 | Partitioned tables, a shard router, a waiting room for hot on-sales |
| 7 | Correct seat holds under heavy contention; no overselling |
| 8 | Fault injection, circuit breakers, fenced background jobs |
| 9 | Leader election, transactional outbox, sagas |
| 10 | Nightly batch jobs with atomic output swaps |
| 11 | Redpanda, CDC with Debezium, event-sourced seat history, live sales dashboard |
| 12 | End-to-end idempotent checkout, invariant auditor, privacy-aware derived data, AI search |

---

## The tools, and what each one is for

| Concern | Tool | Why this one |
|---|---|---|
| API | **NestJS 12** (TypeScript; v11 also works) | Organises code into modules with dependency injection (Nest creates and passes objects for you); good testing story; what your team ships |
| Primary database | **PostgreSQL 16** (image `pgvector/pgvector:pg16`) | Strong transactions, MVCC (keeps row versions so readers and writers don't block each other), replication, partitioning, JSONB, and pgvector for AI search. On version 18, mount Docker volumes at `/var/lib/postgresql`. |
| DB access | **node-postgres (`pg`)** with a thin repository layer | You must *see* the SQL, locks and isolation levels to learn this book. ORMs (Prisma, TypeORM) are fine in product code once you know what they generate. |
| Migrations | Numbered SQL files run by **dbmate** or **node-pg-migrate** | Plain SQL keeps DDL visible |
| Cache / locks / queues | **Redis 7** | Caching, rate limits, waiting room, lock experiments |
| Jobs | **BullMQ** via `@nestjs/bullmq` | Retries, backoff, repeatable jobs |
| Event log | **Redpanda** (Kafka-compatible, single binary, built-in schema registry) | Same concepts as Kafka, far lighter on a laptop |
| CDC | **Debezium** (Kafka Connect) | Turns the Postgres WAL into an event stream |
| Analytics | **DuckDB** (embedded, columnar) | Feel the OLTP vs OLAP difference in minutes |
| Coordination | **etcd** | A real Raft implementation you can kill and watch |
| Fault injection | **Toxiproxy** | Latency, partitions, resets between app and dependencies |
| Load testing | **k6** | Scriptable, arrival-rate load, percentile thresholds |
| Observability | **prom-client + Prometheus + Grafana**, **nestjs-pino**; OpenTelemetry later | Percentiles and request IDs from day one |
| Tests | **Jest + Supertest + Testcontainers** | Real Postgres in tests, not mocks |
| Local infra | **Docker Compose** | One command to run everything |

**Install once:** Node.js 22 LTS, Docker with Compose v2, `psql`, `k6`, `jq`, DuckDB CLI, the Nest CLI (`npm i -g @nestjs/cli`), and `rpk` (Redpanda CLI, optional; it also ships inside the Redpanda container).

> **Kafka client note.** NestJS's Kafka transport uses KafkaJS, which is fine for learning, but KafkaJS has had no new code since mid-2024. For production, evaluate Confluent's official client `@confluentinc/kafka-javascript` (version 1.x), which offers a KafkaJS-compatible API (`require('@confluentinc/kafka-javascript').KafkaJS`), so the consumer code in this guide changes very little.

---

## Repository layout

Use Nest's monorepo mode so each module is its own app and shared code lives in libraries.

```bash
nest new ddia-labs            # choose npm or pnpm; when asked CommonJS or ESM, pick CommonJS to follow this guide
cd ddia-labs
nest generate app m01-reliability     # converts the project to monorepo mode
nest generate library db              # importable as @app/db
nest generate library observability   # importable as @app/observability
```

```
ddia-labs/
├── apps/
│   ├── m01-reliability/
│   ├── m02-data-models/
│   ├── ...
│   └── capstone/
├── libs/
│   ├── db/               # pg pools, transaction helper, error mapping
│   └── observability/    # logger, metrics, health
├── infra/
│   ├── compose.base.yml  # postgres, redis, prometheus, grafana
│   ├── compose.m05.yml   # replication overlay
│   ├── compose.m08.yml   # toxiproxy overlay
│   ├── compose.m11.yml   # redpanda + debezium overlay
│   └── prometheus.yml
├── migrations/           # 0001_init.sql, 0002_..., applied in order
├── load/                 # k6 scripts per module
├── experiments/          # break-it scripts and recorded results
├── blogs/
├── sessions/
├── adr/                  # architecture decision records
└── README.md             # how to run any module
```

Run a module with an overlay: `docker compose -f infra/compose.base.yml -f infra/compose.m05.yml up -d`.

---

## Shared building blocks (write these once)

Write these once in Module 1 and reuse them everywhere.

### Base infrastructure (`infra/compose.base.yml`)

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: tickets
    command: >
      postgres
        -c shared_preload_libraries=pg_stat_statements
        -c log_min_duration_statement=200
        -c log_lock_waits=on
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d tickets"]
      interval: 3s
      timeout: 3s
      retries: 20

  redis:
    image: redis:7
    ports: ["6379:6379"]

  prometheus:
    image: prom/prometheus
    volumes: [./prometheus.yml:/etc/prometheus/prometheus.yml:ro]
    ports: ["9090:9090"]
    extra_hosts: ["host.docker.internal:host-gateway"]   # lets Linux reach the app on the host

  grafana:
    image: grafana/grafana
    ports: ["3001:3000"]

volumes:
  pgdata:
```

`infra/prometheus.yml`:

```yaml
global:
  scrape_interval: 5s
scrape_configs:
  - job_name: ticketrush
    static_configs:
      - targets: ["host.docker.internal:3000"]
```

After the first start, enable query statistics once: `psql postgres://app:app@localhost:5432/tickets -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"`

### Database library (`libs/db`)

A pool with timeouts, and a transaction helper that understands isolation levels and retries the errors that are *meant* to be retried.

```ts
// libs/db/src/db.module.ts
import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Pool } from 'pg';

export const PG_POOL = Symbol('PG_POOL');

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () => {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          max: Number(process.env.PG_POOL_MAX ?? 10),
          connectionTimeoutMillis: 2_000,   // waiting for a free connection
          idleTimeoutMillis: 30_000,
          statement_timeout: 5_000,         // server-side cap per statement
          idle_in_transaction_session_timeout: 10_000, // kills forgotten transactions
        });
        // Without this listener, an idle connection dropped by the server (DB restart,
        // failover, network blip) emits an unhandled 'error' event and crashes the process.
        pool.on('error', (err) => console.warn('pg idle client error', err.message));
        return pool;
      },
    },
  ],
  exports: [PG_POOL],
})
export class DbModule implements OnApplicationShutdown {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}
  async onApplicationShutdown() {
    await this.pool.end();
  }
}
```

```ts
// libs/db/src/tx.ts
import { Pool, PoolClient } from 'pg';

export type Isolation = 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';

// 40001 = serialization_failure, 40P01 = deadlock_detected
const RETRYABLE = new Set(['40001', '40P01']);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Runs fn inside a transaction. Retries only on errors Postgres tells us are safe to retry.
 * IMPORTANT: fn may run more than once, so it must not have side effects outside the
 * database (no emails, no HTTP calls to payment providers) — use the outbox for those.
 */
export async function withTransaction<T>(
  pool: Pool,
  fn: (client: PoolClient) => Promise<T>,
  opts: { isolation?: Isolation; maxRetries?: number } = {},
): Promise<T> {
  const { isolation = 'READ COMMITTED', maxRetries = 5 } = opts;
  for (let attempt = 0; ; attempt++) {
    const client = await pool.connect();
    try {
      await client.query(`BEGIN ISOLATION LEVEL ${isolation}`);
      const result = await fn(client);
      await client.query('COMMIT'); // SERIALIZABLE can fail here too; caught below
      return result;
    } catch (err: any) {
      await client.query('ROLLBACK').catch(() => undefined);
      if (RETRYABLE.has(err?.code) && attempt < maxRetries) {
        await sleep(Math.random() * 20 * 2 ** attempt); // exponential backoff, full jitter
        continue;
      }
      throw err;
    } finally {
      client.release();
    }
  }
}
```

```ts
// libs/db/src/pg-errors.ts — map database errors to HTTP meaningfully
export const PG = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  CHECK_VIOLATION: '23514',
  EXCLUSION_VIOLATION: '23P01',
  SERIALIZATION_FAILURE: '40001',
  DEADLOCK: '40P01',
  QUERY_CANCELED: '57014', // statement_timeout fired
} as const;
```

> `pg` returns `bigint` (int8) columns as **strings** by default, because JavaScript numbers lose precision above 2^53. Keep IDs as strings in TypeScript, or explicitly parse only columns you know are small. This is your first encoding lesson (Module 4).

### Observability (`libs/observability`)

Structured logs with request IDs:

```ts
// in AppModule imports
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

LoggerModule.forRoot({
  pinoHttp: {
    level: process.env.LOG_LEVEL ?? 'info',
    genReqId: (req) => (req.headers['x-request-id'] as string) ?? randomUUID(),
    redact: ['req.headers.authorization', 'req.headers.cookie'],
  },
}),
```

Latency histograms (percentiles come from histograms, never from averages):

```ts
// libs/observability/src/metrics.ts
import { Injectable, NestMiddleware, Controller, Get, Res } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { Histogram, collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics(); // event loop lag, heap, GC — you'll need these in Module 8

export const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const end = httpDuration.startTimer();
    res.on('finish', () => {
      // use the route *pattern* (/events/:id), never the raw URL, to keep label cardinality low
      end({ method: req.method, route: req.route?.path ?? 'unmatched', status: res.statusCode });
    });
    next();
  }
}

@Controller()
export class MetricsController {
  @Get('metrics')
  async metrics(@Res() res: Response) {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
  }
}
```

Register the middleware in your module with `consumer.apply(MetricsMiddleware).forRoutes('*')`. Useful PromQL:

```promql
# p99 latency per route over the last minute
histogram_quantile(0.99, sum by (le, route) (rate(http_request_duration_seconds_bucket[1m])))

# error ratio
sum(rate(http_request_duration_seconds_count{status=~"5.."}[1m]))
  / sum(rate(http_request_duration_seconds_count[1m]))
```

### Health, timeouts and graceful shutdown

```ts
// health.controller.ts
import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '@app/db';

@Controller('health')
export class HealthController {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  @Get('live')   // "is the process alive?" — never check dependencies here
  live() {
    return { status: 'ok' };
  }

  @Get('ready')  // "should I receive traffic?" — check what you need to serve requests
  async ready() {
    try {
      await this.pool.query('SELECT 1');
      return { status: 'ok' };
    } catch {
      throw new ServiceUnavailableException('postgres unavailable');
    }
  }
}
```

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks(); // SIGTERM -> onApplicationShutdown -> pool.end()

  const server = app.getHttpServer();
  server.keepAliveTimeout = 65_000; // longer than your load balancer's idle timeout
  server.headersTimeout = 66_000;
  server.requestTimeout = 30_000;

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

For production, `@nestjs/terminus` gives you richer health indicators; the hand-written version above is easier to reason about while learning.

### k6 load test template (`load/template.js`)

Use an **arrival-rate** executor: it keeps sending requests at the target rate even when the server slows down, which is how real users behave. Closed-loop tools that wait for each response before sending the next one hide your worst latencies.

```js
import http from 'k6/http';
import { check } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    browse: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 1000,
      stages: [
        { target: 100, duration: '1m' },
        { target: 500, duration: '2m' },
        { target: 0, duration: '30s' },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<200', 'p(99)<500'],
  },
};

export default function () {
  const res = http.get(`${BASE}/events/1/seats?section=A`);
  check(res, { 'status is 200': (r) => r.status === 200 });
}
```

Run with `k6 run load/template.js` and paste the summary into the POC README.

### Concurrency test harness

Most bugs in this book only appear under concurrency. Every POC that touches shared state gets a test like this, running against a real Postgres (Testcontainers or the compose database).

```ts
// test/concurrency.helpers.ts
import request from 'supertest';
import type { INestApplication } from '@nestjs/common';

export async function fireConcurrently(
  app: INestApplication,
  n: number,
  makeRequest: (i: number, agent: ReturnType<typeof request>) => request.Test,
) {
  const agent = request(app.getHttpServer());
  const results = await Promise.allSettled(Array.from({ length: n }, (_, i) => makeRequest(i, agent)));
  const statuses = results.map((r) => (r.status === 'fulfilled' ? r.value.status : 0));
  const count = (s: number) => statuses.filter((x) => x === s).length;
  return { statuses, count };
}
```

Make the pool bigger than 1 in tests (`PG_POOL_MAX=20`) or you will accidentally serialize everything and the test will pass for the wrong reason.

---

# Part 2 · The 12 modules

Each module follows the same path: one-line idea → everyday example → step by step → words → picture → build → break → measure → mistakes → interview answers → cheat card.

## Module 1 · Reliable, scalable, maintainable

**Read:** 1st edition Chapter 1 (PDF pp. 23–46); focus on "Describing load" (p. 31) and "Describing performance" (p. 33). 2nd edition: Chapters 1–2.
**What must be true at the end:** *"99 out of 100 seat-map requests finish in under 200 ms, and the API recovers by itself when the database comes back."*

### In one line

A good system keeps working when parts of it break, stays fast when more people use it, and stays easy for the next engineer to change.

### Think of it like this

Picture a busy restaurant. **Reliable** means customers get the right food even when one cook calls in sick or the oven breaks. **Scalable** means the restaurant still serves everyone well on a Friday night, when three times as many people show up. **Maintainable** means a new chef can walk into the kitchen and understand where everything is, so changing the menu doesn't take a month.

Now think about waiting times. If the *average* wait is 10 minutes, that sounds fine, but it says nothing to the family that waited 60 minutes and won't come back. To know how customers feel, you look at the slowest waits, not the average. And if a table orders five dishes, the meal is only ready when the *slowest* dish is ready. The more dishes per order, the more likely one of them is late.

### The idea, step by step

1. Things will break: disks fail, code has bugs, people make mistakes. One broken part is called a **fault**. When the whole service stops working for users, that's a **failure**. You can't prevent faults, so you design so that a fault doesn't turn into a failure, and you cause faults on purpose to prove it.
2. Before talking about "scaling", describe your **load** with the number that actually hurts. For TicketRush, it isn't "requests per day"; it's "hold attempts per second on one event when sales open".
3. Measure speed with **percentiles**, not averages. p50 tells you the typical experience; p99 tells you what your unluckiest 1% of users feel. At scale, that 1% is thousands of people.
4. When one request calls several other services, the user waits for the slowest one. If each service is slow 1% of the time and you call 5 of them, about 5% of user requests will be slow. This is called **tail latency amplification**.
5. You handle more load either by buying a bigger machine (**scaling up**, simple but has a limit) or by adding more machines (**scaling out**, no hard limit but more moving parts). App servers that keep no data are easy to scale out; databases are the hard part, which is what most of this book is about.
6. Maintainability has three parts: **operability** (easy to run and watch), **simplicity** (no unnecessary complexity) and **evolvability** (easy to change safely).

### Words you'll meet

| Word | Plain meaning | Example in TicketRush |
|---|---|---|
| Fault | One part misbehaving. | The database restarts for 30 seconds. |
| Failure | The whole service stops working for users. | Nobody can open the seat map. |
| Load parameter | The number that best describes how busy the system is. | Hold attempts per second on the hottest event. |
| Percentile (p50/p95/p99) | The time within which 50/95/99% of requests finish. | p99 = 180 ms: only 1 in 100 seat-map loads is slower than 180 ms. |
| Tail latency | The slowest requests (p99 and above). | The 1% of users who wait 2 seconds. |
| SLI / SLO / SLA | SLI: what you measure (latency). SLO: your target (p99 < 200 ms). SLA: a promise to customers with penalties. | SLO: "99% of seat maps load in under 200 ms." |
| Error budget | How much failure your SLO allows; you can "spend" it on risky releases. | 99.9% success allows about 43 minutes of errors per month. |
| Liveness check | "Is the program alive?" If not, restart it. | `/health/live` returns OK if the process is running. |
| Readiness check | "Can it serve traffic right now?" If not, stop sending requests to it. | `/health/ready` fails while the database is down. |
| Graceful shutdown | Finishing current requests before the program stops. | During a deploy, no request is cut off halfway. |
| Connection pool | A small set of reusable database connections shared by all requests. | 10 connections serve hundreds of requests per second. |
| Backoff and jitter | Waiting longer after each failed retry (backoff), plus a random extra wait (jitter) so clients don't all retry at the same instant. | Retry after ~50 ms, then ~100 ms, then ~200 ms, each slightly random. |
| Load test | Sending lots of fake traffic to see how the system behaves. | k6 sends 500 requests per second for 2 minutes. |

### Picture it

```
           one user request (waits for the SLOWEST call)
                           │
        ┌────────┬────────┼────────┬────────┐
        ▼        ▼        ▼        ▼        ▼
     pricing   seats    user    promos   fraud      each one is slow 1% of the time
        └────────┴────────┴────────┴────────┘
                           │
       chance the user waits on at least one slow call = 1 − 0.99⁵ ≈ 5%
```

### Where this bites in real life

The dashboard says "average latency 40 ms", but customers complain that checkout is slow. A health check that tests the database causes every server to restart during a five-second database blip, and the restart storm keeps the site down for ten minutes. A backup has run every night for a year, and nobody has ever tried restoring it.

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### POC 1 — TicketRush skeleton with SLOs and a latency budget

**Build**

1. Create `apps/m01-reliability`. Wire in `DbModule`, `LoggerModule`, `MetricsMiddleware`, `MetricsController` and `HealthController` from the shared building blocks above.
2. Temporary schema (Module 2 replaces it) and seed data:

```sql
-- migrations/0000_m01_scratch.sql
CREATE TABLE events (
  id         bigserial PRIMARY KEY,
  title      text NOT NULL,
  starts_at  timestamptz NOT NULL
);
CREATE TABLE seats (
  id          bigserial PRIMARY KEY,
  event_id    bigint NOT NULL REFERENCES events(id),
  section     text   NOT NULL,
  row_label   text   NOT NULL,
  number      int    NOT NULL,
  price_cents int    NOT NULL,
  status      text   NOT NULL DEFAULT 'available',
  UNIQUE (event_id, section, row_label, number)
);
CREATE TABLE holds (              -- naive on purpose: no protection against double holds
  id         bigserial PRIMARY KEY,
  seat_id    bigint NOT NULL REFERENCES seats(id),
  user_id    bigint NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO events (title, starts_at) VALUES ('Garba Night Live', now() + interval '30 days');

-- 4 sections x 25 rows x 100 seats = 10,000 seats
INSERT INTO seats (event_id, section, row_label, number, price_cents)
SELECT 1, s.section, chr(64 + r), n, 5000
FROM (VALUES ('A'), ('B'), ('C'), ('D')) AS s(section),
     generate_series(1, 25) AS r,
     generate_series(1, 100) AS n;
```

3. Endpoints: `GET /events`, `GET /events/:id/seats?section=A`, and a deliberately naive `POST /holds` (leave a `// TODO(M7): this races` comment; you will break and fix it in Module 7).
4. A lab endpoint to study tail latency:

```ts
// lab.controller.ts — only mounted when LAB_ENDPOINTS=true
@Get('lab/fanout')
async fanout(@Query('calls') calls = '5', @Query('slowPct') slowPct = '1') {
  const n = Number(calls);
  const p = Number(slowPct) / 100;
  const backend = () =>
    new Promise<void>((resolve) => setTimeout(resolve, Math.random() < p ? 1000 : 10));
  const t0 = performance.now();
  await Promise.all(Array.from({ length: n }, backend)); // the user waits for the slowest one
  return { calls: n, tookMs: Math.round(performance.now() - t0) };
}
```

5. Retries done right, for idempotent reads only (writes wait for Module 12):

```ts
// libs/observability/src/retry.ts
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function callWithRetry<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  { attempts = 3, timeoutMs = 500, baseMs = 50 } = {},
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn(AbortSignal.timeout(timeoutMs)); // every attempt has a deadline
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await sleep(Math.random() * baseMs * 2 ** i); // jittered backoff
    }
  }
  throw lastErr;
}

// usage: await callWithRetry((signal) => fetch(url, { signal }).then((r) => r.json()));
```

6. Write the SLOs into the README: "99% of `GET /events/:id/seats` under 200 ms over 30 days; 99.9% of requests non-5xx." The difference between 100% and your target is your **error budget**: the amount of unreliability you are allowed to spend on deploys and experiments.

**Break it**

| # | Experiment | What to look for |
|---|---|---|
| E1 | Under k6 load, `docker compose stop postgres`, wait 30 s, start it again. Then temporarily remove the `pool.on('error')` listener and repeat. | Do clients get fast 503s or hang? Does `/health/ready` flip? Does the app recover without a restart? Without the listener, the process crashes: write down why. |
| E2 | Make 1% of seat-map requests sleep 1 s. | Average barely moves; p99 jumps to ~1 s. Screenshot both. |
| E3 | Call `/lab/fanout?calls=5` then `calls=20` with `slowPct=1`. | Predict first: 1 − 0.99⁵ ≈ 4.9% and 1 − 0.99²⁰ ≈ 18.2% of requests will take ~1 s. Then verify with k6. |
| E4 | Ramp load until the p99 SLO breaks. Then double `PG_POOL_MAX` and repeat. | Where is the knee? Did more connections help, or did DB contention make it worse? |
| E5 | On a copy of the DB, drop the `seats` table, then restore from `pg_dump`. Time it. | Your real recovery time. A backup you have never restored is a hope, not a backup. |

**Measure** — fill this in for the README:

| Target RPS | p50 | p95 | p99 | Error % | App CPU | DB CPU | Notes |
|---|---|---|---|---|---|---|---|
| 100 | | | | | | | |
| 300 | | | | | | | |
| 500 | | | | | | | |
| knee | | | | | | | |

### Production checklist


- [ ] SLOs written per critical route, with an error budget and an alert on burn rate.
- [ ] Dashboards show p50/p95/p99 per route, never just the average.
- [ ] Every dependency call has a timeout; retries only on idempotent operations, with jitter and a cap.
- [ ] Liveness checks only the process; readiness checks dependencies.
- [ ] Graceful shutdown tested by a rolling restart under load (zero 5xx).
- [ ] Backups restored on a schedule; restore time recorded.
- [ ] Every alert links to a runbook.

### Mistakes people make

- Watching only the average latency. Always graph p95 and p99.
- Letting the liveness check call the database, so a short database outage restarts every server at once.
- No timeout on outgoing calls, so one slow dependency makes every request hang.
- Retrying immediately and forever, which multiplies load on a struggling service.
- Saying "we need to scale" without naming the number that's growing.
- Never testing backups by actually restoring them.

### Interview corner

**Q: What do reliability, scalability and maintainability mean?**
Say this: "Reliability is continuing to work correctly when things go wrong: hardware, software or human mistakes. Scalability is having a plan for growth: I describe the load with a specific number, measure performance with percentiles, and decide how to add capacity. Maintainability is making life easy for the people who run and change the system: good observability, simple design, and safe ways to evolve it."

**Q: Why use percentiles instead of the average?**
Say this: "The average hides the slow requests. If 99 requests take 10 ms and one takes 5 seconds, the average is about 60 ms, which describes nobody. p99 tells me what my unluckiest 1% of users experience, and at scale that's a lot of people. Those are often my most valuable users too, because they have the most data."

**Q: What is tail latency amplification?**
Say this: "When a request fans out to several backends in parallel, it's only as fast as the slowest one. If each backend is slow 1% of the time, a request that calls 10 of them is slow about 10% of the time, because 1 − 0.99¹⁰ ≈ 9.6%. So the more fan-out, the more each backend's p99 matters."

**Q: Scaling up vs scaling out?**
Say this: "Scaling up means a bigger machine: simple, no code changes, but it has a ceiling and is a single point of failure. Scaling out means more machines: it can grow further and survive a machine dying, but it brings distributed-systems problems. I'd scale out stateless app servers early because it's cheap, and keep the database on one primary as long as possible, adding read replicas and caching before sharding."

**Q: What's the difference between SLI, SLO and SLA?**
Say this: "An SLI is the thing I measure, like the percentage of requests under 200 ms. An SLO is my internal target for it, like 99%. An SLA is an external contract with consequences if we miss it. The SLA is usually looser than the SLO, so we get warned before we break a promise."

**Q: How do you protect an API from a slow dependency?**
Say this: "A timeout on every call, retries only for safe operations with exponential backoff and jitter, a circuit breaker that stops calling a dependency that keeps failing, and a fallback so the user gets a degraded answer instead of an error. I also keep separate connection pools so one slow dependency can't use up all my resources."

**Q: Liveness vs readiness probes?**
Say this: "Liveness asks 'is the process stuck?' and leads to a restart, so it should check only the process itself. Readiness asks 'can I serve traffic now?' and takes the instance out of the load balancer, so it can check dependencies. If liveness checks the database, a database blip restarts everything at once."

**Q: Latency vs throughput?**
Say this: "Latency is how long one request takes; throughput is how many requests per second we handle. They're linked: as throughput approaches capacity, requests queue up and latency shoots up. That's why I load test to find the 'knee' where p99 starts rising sharply, and keep normal traffic well below it."

**What impresses interviewers:** naming a concrete load parameter, using p99, mentioning error budgets, and knowing that retries can make an outage worse.
**Red flag:** "We'll just add more servers" without saying what is actually the bottleneck.

### Cheat card

- Fault = one part breaks. Failure = users can't use the service. Design so faults don't become failures.
- Describe load with the number that hurts (per-event hold rate), not requests per day.
- Use p95/p99, never just the average.
- Fan-out makes the tail worse: 1 − 0.99ⁿ.
- Every remote call: timeout, retries with backoff + jitter (only if safe), circuit breaker, fallback.
- Liveness = process only. Readiness = dependencies.

### AI-era angle

Calls to AI models are usually the slowest and least predictable part of a backend. Treat them like any other remote call: measure p99, set a hard timeout and a token budget, retry only on safe errors with jitter, treat "429 Too Many Requests" as your capacity limit, and give the feature a non-AI fallback so an AI outage breaks one feature, not checkout.

### Share it: blog post and training session

#### Blog post
**Title:** "Your average latency is lying to you: percentiles, fan-out and SLOs in a NestJS API"
1. The incident: fine dashboard, angry users.
2. Mean vs percentiles, with your E2 screenshots.
3. Tail amplification: the math and your E3 measurements.
4. Choosing the right load parameter for ticketing (per-event hold rate).
5. Liveness vs readiness: the restart-storm trap.
6. Our SLO and error budget, and what we will do when we burn it.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–10 | Hook: show a dashboard with a great average and a terrible p99. Ask: "Is this service healthy?" |
| 10–30 | Concepts: faults vs failures, load parameters, percentiles, fan-out. |
| 30–55 | Live demo: k6 + Grafana; toggle the slow path; stop Postgres live. |
| 55–80 | Exercise in pairs: draw our real service call graph, estimate the user-visible p99 from each dependency's p99. |
| 80–90 | Discussion: which of our services has liveness checks that could cause a restart storm? |

---

## Module 2 · Data models and query languages

**Read:** 1st edition Chapter 2 (PDF pp. 47–88); focus on "The object-relational mismatch" (p. 50), "Many-to-one and many-to-many relationships" (p. 53), "Graph queries in SQL" (p. 74). 2nd edition: Chapter 3.
**What must be true at the end:** *"For each kind of data, you chose a model on purpose and can defend the choice with code and numbers."*

### In one line

How you shape your data (tables, documents or a network of connections) decides which questions are easy to answer and which are painful.

### Think of it like this

There are three ways to keep records about concerts:

- **A set of linked spreadsheet tabs** (relational). One tab for venues, one for artists, one for events. An event row says "venue 7" instead of copying the venue's name. Change the venue's name once and every event shows the new name.
- **A folder per event** (document). Everything about the event sits in one folder: lineup, FAQ, photos, even a copy of the venue's name. Opening one event is quick because everything is in one place. But if a venue changes its name, you must open every folder that mentions it.
- **A map of connections** (graph). Dots for people, artists and events, with lines between them: "Priya went to Concert X", "Concert X featured Artist Y". Questions like "people who went to the same shows as me also liked…" are natural to ask on a map.

### The idea, step by step

1. **Relational** data lives in tables connected by IDs. It shines when things are shared and connected: many events at one venue, many artists at many events. Each fact is stored once; you combine tables at query time with a **join**.
2. **Document** data stores a whole item as one nested object (JSON). It shines when the data is tree-shaped and read together, like an event's details page. It gets painful when documents start referring to each other, because you either copy data (and keep copies in sync) or do the joining in your own code.
3. "Schemaless" doesn't mean "no structure". It means the structure is checked by the code that **reads** the data (**schema-on-read**) instead of by the database when you **write** it (**schema-on-write**). Flexible, but every reader must handle missing or misspelled fields.
4. **Declarative** languages like SQL describe *what* you want, and the database figures out *how*. That's why adding an index can make a query faster without changing your code.
5. **Graph** data fits when you follow chains of connections of unknown length (friends of friends of friends). SQL can do this with "recursive" queries, but it gets clumsy beyond a couple of hops.
6. PostgreSQL lets you mix all three: normal tables, JSONB columns for flexible documents, and recursive queries for hierarchies.

### Words you'll meet

| Word | Plain meaning | Example in TicketRush |
|---|---|---|
| Relational model | Data in tables linked by IDs. | `events.venue_id` points to `venues.id`. |
| Document model | One nested JSON object per item. | An event's lineup, FAQ and tags stored together. |
| Graph model | Dots (nodes) and lines (edges) between them. | Fans connected to artists through events they attended. |
| Join | Combining rows from two tables that share an ID. | Events joined with venues to show the venue name. |
| Foreign key | A column that must point to an existing row elsewhere. | You can't create an event for venue 999 if it doesn't exist. |
| One-to-many / many-to-many | One venue has many events; many artists play many events (needs a linking table). | `event_artists(event_id, artist_id)`. |
| Normalize / denormalize | Normalize: store each fact once. Denormalize: copy facts to make reads faster. | Venue name stored once vs copied into every event document. |
| JSONB | PostgreSQL's binary JSON column type, which can be indexed and searched. | `events.details` holds category, tags and lineup. |
| GIN index | A PostgreSQL index type for searching inside JSON, arrays or text. | Finds events whose tags include "outdoor". |
| Schema-on-read / on-write | Who checks the data's shape: the reader's code, or the database at write time. | zod validates `details` when reading; a `CHECK` rejects bad writes. |
| Declarative query | You say what you want, not how to get it. | `SELECT ... WHERE category = 'concert'`. |
| Recursive query (CTE) | A SQL query that repeats itself to walk a tree or graph. | Find all cities inside a state, at any depth. |
| N+1 queries | Running 1 query for a list, then 1 more query per item. Slow. | Fetch 50 events, then 50 separate venue lookups. |

### Picture it

```
RELATIONAL (linked tabs)                 DOCUMENT (one folder per event)
venues(id, name)  ◄── events(venue_id)   { "title": "Concert X",
artists(id, name) ◄── event_artists ──►    "venue": "Arena A",        ← copied
                         events            "artists": ["Y", "Z"],     ← copied
                                           "faq": [...], "tags": [...] }

GRAPH (map of connections)
  (Priya) ──attended──► (Concert X) ──featured──► (Artist Y)
     ▲                                                 │
     └──────────── "fans of Y also liked…" ◄───────────┘
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### POC 2 — Three models, one domain

**Build**

1. The real TicketRush schema (replaces the Module 1 scratch tables):

```sql
-- migrations/0001_init.sql
CREATE TABLE regions (
  id        bigserial PRIMARY KEY,
  name      text NOT NULL,
  kind      text NOT NULL CHECK (kind IN ('country', 'state', 'city')),
  parent_id bigint REFERENCES regions(id)
);

CREATE TABLE venues (
  id        bigserial PRIMARY KEY,
  name      text   NOT NULL,
  region_id bigint NOT NULL REFERENCES regions(id)
);

CREATE TABLE artists (
  id   bigserial PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE events (
  id        bigserial PRIMARY KEY,
  venue_id  bigint      NOT NULL REFERENCES venues(id),
  title     text        NOT NULL,
  starts_at timestamptz NOT NULL,
  details   jsonb       NOT NULL DEFAULT '{}'::jsonb,
  version   int         NOT NULL DEFAULT 1,           -- used in Module 7
  CHECK (details ? 'category')                         -- schema-on-write for the one key we rely on
);
CREATE INDEX events_details_gin ON events USING gin (details jsonb_path_ops);
CREATE INDEX events_starts_at ON events (starts_at);

CREATE TABLE event_artists (            -- many-to-many
  event_id      bigint NOT NULL REFERENCES events(id),
  artist_id     bigint NOT NULL REFERENCES artists(id),
  billing_order int    NOT NULL DEFAULT 1,
  PRIMARY KEY (event_id, artist_id)
);

CREATE TABLE seats (
  id          bigserial PRIMARY KEY,
  event_id    bigint NOT NULL REFERENCES events(id),
  section     text   NOT NULL,
  row_label   text   NOT NULL,
  number      int    NOT NULL,
  price_cents int    NOT NULL CHECK (price_cents >= 0),     -- money as integer minor units
  status      text   NOT NULL DEFAULT 'available'
              CHECK (status IN ('available', 'held', 'sold')),
  UNIQUE (event_id, section, row_label, number)
);

CREATE TABLE holds (              -- still naive; Module 7 shows why and replaces it
  id         bigserial PRIMARY KEY,
  seat_id    bigint NOT NULL REFERENCES seats(id),
  user_id    bigint NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX holds_user ON holds (user_id);

CREATE TABLE orders (
  id          bigserial PRIMARY KEY,
  user_id     bigint NOT NULL,
  status      text   NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  total_cents int    NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  order_id    bigint NOT NULL REFERENCES orders(id),
  seat_id     bigint NOT NULL REFERENCES seats(id),
  price_cents int    NOT NULL,
  PRIMARY KEY (order_id, seat_id)
);
```

2. Seed a region tree (India → Gujarat → Ahmedabad, Surat, Vadodara; Maharashtra → Mumbai, Pune), 20 venues, 200 artists, 500 events with varied `details`, and seats for a handful of events. Write the seed as a SQL file so anyone can reproduce it.

3. **Fetch the event page three ways** and compare:

   **(a) Relational, one round trip** — let Postgres build the JSON:

```sql
SELECT e.id, e.title, e.starts_at, e.details,
       json_build_object('id', v.id, 'name', v.name) AS venue,
       COALESCE(
         json_agg(json_build_object('id', a.id, 'name', a.name) ORDER BY ea.billing_order)
           FILTER (WHERE a.id IS NOT NULL),
         '[]') AS artists
FROM events e
JOIN venues v           ON v.id = e.venue_id
LEFT JOIN event_artists ea ON ea.event_id = e.id
LEFT JOIN artists a     ON a.id = ea.artist_id
WHERE e.id = $1
GROUP BY e.id, v.id;
```

   **(b) Pure document** — a table `events_doc(id bigint primary key, doc jsonb)` where each document embeds the venue name and artist names.

   **(c) Hybrid** — relational core plus the `details` JSONB column for attributes that vary by category.

4. **The rename test.** Rename an artist who plays 40 events. In (a) it is one `UPDATE artists`. Now write the same change for (b). Time how long it takes you to write and how long it takes to run. This is the many-to-many pain the book describes.

5. **Schema-on-read, done safely.** Validate `details` with zod when reading, so a missing or misspelled field fails loudly in one place:

```ts
import { z } from 'zod';

export const EventDetails = z.object({
  category: z.enum(['concert', 'sports', 'conference', 'comedy']),
  tags: z.array(z.string()).default([]),
  ageLimit: z.number().int().positive().optional(),
  lineup: z.array(z.object({ time: z.string(), act: z.string() })).optional(),
});
export type EventDetails = z.infer<typeof EventDetails>;

// in the repository
const details = EventDetails.parse(row.details);
```

   Query documents with containment, which uses the GIN index:

```sql
SELECT id, title FROM events
WHERE details @> '{"category": "concert", "tags": ["outdoor"]}';
```

6. **Hierarchy with a recursive query** — "all upcoming events anywhere in Gujarat":

```sql
WITH RECURSIVE sub AS (
  SELECT id FROM regions WHERE name = 'Gujarat'
  UNION ALL
  SELECT r.id FROM regions r JOIN sub ON r.parent_id = sub.id
)
SELECT e.id, e.title, v.name AS venue
FROM events e
JOIN venues v ON v.id = e.venue_id
WHERE v.region_id IN (SELECT id FROM sub)
  AND e.starts_at > now()
ORDER BY e.starts_at;
```

7. **A two-hop graph query** — "fans of this artist also bought tickets for…":

```sql
WITH fans AS (
  SELECT DISTINCT o.user_id
  FROM orders o
  JOIN order_items oi   ON oi.order_id = o.id
  JOIN seats s          ON s.id = oi.seat_id
  JOIN event_artists ea ON ea.event_id = s.event_id
  WHERE ea.artist_id = $1 AND o.status = 'paid'
)
SELECT a.id, a.name, count(DISTINCT o.user_id) AS shared_fans
FROM fans f
JOIN orders o         ON o.user_id = f.user_id AND o.status = 'paid'
JOIN order_items oi   ON oi.order_id = o.id
JOIN seats s          ON s.id = oi.seat_id
JOIN event_artists ea ON ea.event_id = s.event_id
JOIN artists a        ON a.id = ea.artist_id
WHERE a.id <> $1
GROUP BY a.id, a.name
ORDER BY shared_fans DESC
LIMIT 10;
```

   Now try to write the three-hop version ("fans of fans"). Notice how the SQL grows. That growth is the argument for graph databases. Stretch: install the Apache AGE extension and write the same query in Cypher.

**Break it**

| # | Experiment | What to look for |
|---|---|---|
| E1 | Insert an event whose `details` has `"catgory"` (typo) through raw SQL. | The `CHECK` rejects it. Remove the check and insert again: now zod fails on read. Which failure would you rather have in production? |
| E2 | In the document model, update an artist name in only 39 of 40 documents (simulate a crash mid-loop). | You now have inconsistent data and no constraint to tell you. |
| E3 | Implement "top 10 events by seats sold" twice: in SQL, and in TypeScript by loading rows and looping. | Compare code size, memory, and latency at 1M order items. |

**Measure**

| Approach | Round trips | p95 latency (event page) | Lines of code | Rename effort |
|---|---|---|---|---|
| Relational | | | | |
| Document | | | | |
| Hybrid | | | | |

### Production checklist


- [ ] Each table's model choice is written down in an ADR with the access pattern that justifies it.
- [ ] Money stored as integer minor units (paise/cents), never floating point.
- [ ] JSONB columns have a validation schema in code and `CHECK` constraints for keys the system depends on.
- [ ] Foreign keys and unique constraints exist for every relationship you rely on.
- [ ] No N+1 queries on hot paths (verify with `pg_stat_statements`).

### Mistakes people make

- Putting shared, changing data (venue names, user profiles) inside many documents, then forgetting to update every copy.
- Using a document database "because it's flexible" when the data is full of relationships.
- Storing money as a floating-point number. Use whole numbers of the smallest unit (cents, paise).
- Writing N+1 queries: loading a list, then querying once per item.
- Treating JSON columns as "no rules needed" and discovering typos in production.

### Interview corner

**Q: SQL or NoSQL: how do you choose?**
Say this: "I start from the access patterns, not the brand. If the data has lots of relationships and I need transactions and flexible queries, a relational database fits. If data is mostly self-contained documents read by one key, or I need very high write throughput with simple lookups, a document or key-value store can fit. 'NoSQL' covers very different systems, so I'd name the specific one. Often PostgreSQL with JSONB covers both needs in one system."

**Q: What are normalization and denormalization, and when would you denormalize?**
Say this: "Normalization stores each fact once, which keeps updates simple and consistent. Denormalization copies data to make reads faster, at the cost of keeping copies in sync. I denormalize when a read path is hot and measured to be slow, and I keep the copy updated from a single source, for example with an event stream, rather than by hand."

**Q: What is the N+1 problem and how do you fix it?**
Say this: "It's when code runs one query to get a list and then one query per item, so 50 items means 51 round trips. I fix it with a join, an `IN (...)` query that fetches all related rows at once, or by letting the database build the nested JSON in one query."

**Q: When would you use a graph database?**
Say this: "When the main questions follow relationships of unknown depth: social networks, recommendations, fraud rings, access-control hierarchies. For one or two hops, SQL joins or a recursive query are fine. If most queries are deep traversals, a graph database is simpler and faster."

**Q: Would you store JSON in a relational database?**
Say this: "Yes, for data that varies per record and is read as a whole, like event details. In PostgreSQL I'd use JSONB with a GIN index, validate it in code, and add CHECK constraints for the keys the system depends on. I wouldn't put relationships or frequently updated shared data inside JSON."

**Q: What's schema-on-read vs schema-on-write?**
Say this: "Schema-on-write means the database rejects data that doesn't match the schema, like a relational table. Schema-on-read means the data is stored as-is and the reading code interprets it, like most document stores. Schema-on-read is flexible when records differ, but every reader has to handle old or missing fields."

**What impresses interviewers:** starting from access patterns, mentioning the cost of keeping copies in sync, and knowing Postgres can do documents too.
**Red flag:** "NoSQL scales better" with no explanation of what kind of scaling or which trade-off.

### Cheat card

- Relationships and transactions → relational. Self-contained tree-shaped data read together → document. Deep relationship chains → graph.
- Normalize by default; denormalize a measured hot read path, fed from one source of truth.
- "Schemaless" = schema-on-read: the structure still exists, your code enforces it.
- SQL is declarative: indexes speed it up without code changes.
- PostgreSQL JSONB + GIN index + validation covers most "document" needs.
- Money in integer minor units; avoid N+1 queries.

### AI-era angle

AI features add new kinds of data: embeddings (lists of numbers that represent meaning, stored with pgvector next to the row they describe), chat transcripts (natural documents) and knowledge graphs. Use the same reasoning: keep an embedding next to its source row when they must stay in sync, store transcripts as documents because they're read whole, and use a graph only if your questions really follow chains of connections. Always store which AI model produced each embedding.

### Share it: blog post and training session

#### Blog post
**Title:** "Relational, document or both? Modeling a ticketing platform in PostgreSQL"
1. Our access patterns. 2. Where documents win (event details). 3. Where they lose (the artist rename). 4. Schema-on-read without chaos: zod + CHECK. 5. Hierarchies and graphs with recursive CTEs. 6. Our decision record.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–15 | Show the same event page as a JSON document and as tables. Vote: which is better? |
| 15–35 | Concepts: impedance mismatch, relationships, schema-on-read, declarative queries. |
| 35–60 | Live: run the rename test in both models. |
| 60–80 | Exercise: model "season passes that cover many events at many venues". Defend your choice. |
| 80–90 | Discuss: where in our current codebase do we store relationships inside JSON? |

---

## Module 3 · Storage and retrieval

**Read:** 1st edition Chapter 3 (PDF pp. 89–128); focus on "Hash indexes" (p. 92), "SSTables and LSM-trees" (p. 96), "B-trees" (p. 99), "Transaction Processing or Analytics?" (p. 109), "Column-oriented storage" (p. 115). 2nd edition: Chapter 4.
**What must be true at the end:** *"You can explain what the database does with your write, and why an index makes one query fast and another write slower."*

### In one line

Databases are clever ways of writing data to disk so it can be found again quickly, and every trick that speeds up reading costs something when writing.

### Think of it like this

- **A diary** is the simplest database: you only ever write on the next empty line. Writing is instant. Finding what you wrote about "seat A-12" means reading the whole diary, unless you keep a separate note saying "A-12 → page 37" (that note is an **index**).
- A diary that never gets cleaned up grows forever, full of old crossed-out entries. Every so often you copy only the latest entries into a fresh diary and throw the old one away (**compaction**).
- **A library** keeps books sorted on shelves by section, and you walk the signs ("Science → Physics → shelf 4") to find one. That's a **B-tree**: sorted, organised pages you update in place.
- **A busy reporter** scribbles notes on sticky notes all day (fast), and every evening sorts them into a neat binder (background merging). That's an **LSM-tree**: very fast writes, tidying later.
- If you only care about the "price" column of a 50-column spreadsheet with a million rows, it's much faster to read a list of just the prices than to read every full row. That's a **column store**, used for analytics.

### The idea, step by step

1. The fastest way to write is to **append** to the end of a file. Keep an in-memory map from each key to its position in the file, and reads are fast too. Limits: all keys must fit in memory, and you can't ask for a range ("all seats from A-1 to A-100").
2. Files grow forever, so databases periodically **compact**: rewrite the file keeping only the latest value for each key.
3. Keeping data **sorted** solves range queries. **LSM-trees** collect writes in memory, write them out as sorted files, and merge files in the background. Great for heavy writes.
4. **B-trees** keep data in sorted fixed-size pages and update them in place. Most relational databases, including PostgreSQL, use them. To survive crashes mid-update, the database first records each change in a **write-ahead log (WAL)**.
5. Every index speeds up some reads and slows down every write, because each write must also update the index. Don't add indexes "just in case".
6. Two workload types: **OLTP** (lots of small reads/writes by users, like "hold seat 12") and **OLAP** (big scans for reports, like "revenue per month"). Analytics databases store data **by column**, which compresses well and reads only the columns a query needs.

### Words you'll meet

| Word | Plain meaning | Example |
|---|---|---|
| Append-only log | A file you only add to at the end. | Every write adds a line; nothing is edited. |
| Hash index | An in-memory map from key to file position. | `"seat:42" → byte 10,240`. |
| Compaction | Rewriting files to drop old and deleted values. | 1 GB of history becomes 10 MB of current values. |
| Tombstone | A special record meaning "this key was deleted". | Deletes are writes too. |
| SSTable | A file of key-value pairs sorted by key. | Allows range scans and efficient merging. |
| LSM-tree | Write-optimised storage: buffer in memory, flush sorted files, merge later. | Used by RocksDB, Cassandra. |
| B-tree | Sorted pages organised as a tree, updated in place. | PostgreSQL's default index. |
| WAL (write-ahead log) | A log of changes written before the data itself, for crash recovery. | After a power cut, Postgres replays the WAL. |
| fsync | Forcing data from memory to the physical disk. | Slower, but survives a power cut. |
| Write amplification | One logical write causing many physical writes. | Inserting a row also updates 5 indexes. |
| Composite index | An index on several columns, in a specific order. | `(user_id, created_at)` serves "my orders, newest first". |
| Covering index / index-only scan | The index contains every column the query needs, so the table isn't read. | `INCLUDE (total_cents)`. |
| Partial index | An index on only the rows matching a condition. | Only `status = 'pending'` orders. |
| BRIN index | A tiny index that stores min/max per block; works when rows are stored in order. | Time-ordered logs. |
| `EXPLAIN ANALYZE` | Shows how Postgres actually ran a query and how long each step took. | "Seq Scan" means it read the whole table. |
| OLTP / OLAP | Small user-facing operations vs big analytical scans. | Holding a seat vs a monthly revenue report. |
| Column store | Stores each column separately; great for analytics. | DuckDB, ClickHouse, Parquet files. |
| Materialized view | A saved query result you refresh on a schedule. | A dashboard table refreshed every 5 minutes. |

### Picture it

```
APPEND-ONLY LOG + HASH INDEX            B-TREE (PostgreSQL)
file: [k1=a][k2=b][k1=c][k3=d] …                [ root ]
index (in memory):                     ┌────────┼────────┐
  k1 → offset 2   (latest)          [A–F]    [G–M]    [N–Z]
  k2 → offset 1                      │
  k3 → offset 3                   [A][B][C]…  sorted pages, updated in place

ROW STORE (OLTP)                        COLUMN STORE (OLAP)
row 1: id | event | status | price      id:     1, 2, 3, 4 …
row 2: id | event | status | price      status: paid, paid, refunded …
row 3: …                                price:  5000, 5000, 3000 …   ← read only this
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### POC 3a — Build a tiny log-structured key-value store

About 100 lines of TypeScript that teach more about databases than a week of reading.

```ts
// apps/m03-storage/src/logkv.ts
import {
  openSync, closeSync, writeSync, readSync, fstatSync,
  fsyncSync, ftruncateSync, renameSync,
} from 'node:fs';

const TOMBSTONE = '__tombstone__';
type Loc = { offset: number; length: number };

export class LogKV {
  private index = new Map<string, Loc>();
  private fd: number;
  private size = 0;

  constructor(private readonly path: string, private readonly fsyncEachWrite = false) {
    this.fd = openSync(path, 'a+');          // append for writes, positional reads allowed
    this.size = fstatSync(this.fd).size;
    this.recover();
  }

  set(key: string, value: string): void {
    const buf = Buffer.from(JSON.stringify([key, value]) + '\n', 'utf8');
    writeSync(this.fd, buf);                 // 'a' mode: the OS always appends
    if (this.fsyncEachWrite) fsyncSync(this.fd); // durability has a price; measure it
    this.index.set(key, { offset: this.size, length: buf.length });
    this.size += buf.length;
  }

  get(key: string): string | undefined {
    const loc = this.index.get(key);
    if (!loc) return undefined;
    const buf = Buffer.alloc(loc.length);
    readSync(this.fd, buf, 0, loc.length, loc.offset);
    const [, value] = JSON.parse(buf.toString('utf8'));
    return value === TOMBSTONE ? undefined : value;
  }

  delete(key: string): void {
    this.set(key, TOMBSTONE);                // deletes are writes too
  }

  /** Rebuild the in-memory index by scanning the log (this is "crash recovery"). */
  private recover(): void {
    if (this.size === 0) return;
    const buf = Buffer.alloc(this.size);
    readSync(this.fd, buf, 0, this.size, 0);
    let start = 0;
    for (let i = 0; i < buf.length; i++) {
      if (buf[i] !== 0x0a) continue;         // records end with '\n'
      try {
        const [key] = JSON.parse(buf.toString('utf8', start, i));
        this.index.set(key, { offset: start, length: i - start + 1 });
      } catch {
        break;                               // corrupt record: stop here
      }
      start = i + 1;
    }
    if (start < this.size) {                 // torn write at the tail after a crash
      ftruncateSync(this.fd, start);
      this.size = start;
    }
  }

  /** Rewrite only live keys into a new file, then atomically swap it in. */
  compact(): void {
    const tmp = `${this.path}.compact`;
    const out = openSync(tmp, 'w');
    const next = new Map<string, Loc>();
    let offset = 0;
    for (const key of this.index.keys()) {
      const value = this.get(key);
      if (value === undefined) continue;     // drop deleted keys
      const buf = Buffer.from(JSON.stringify([key, value]) + '\n', 'utf8');
      writeSync(out, buf);
      next.set(key, { offset, length: buf.length });
      offset += buf.length;
    }
    fsyncSync(out);
    closeSync(out);
    closeSync(this.fd);
    renameSync(tmp, this.path);              // atomic on POSIX filesystems
    this.fd = openSync(this.path, 'a+');
    this.index = next;
    this.size = offset;
  }
}
```

**Experiments with LogKV**

| # | Experiment | What to look for |
|---|---|---|
| E1 | Write 1M keys with `fsyncEachWrite=false`, then `true`. | Throughput drops by orders of magnitude. This is the durability vs speed trade-off every database makes. |
| E2 | Write in a loop and `kill -9` the process; restart and call `recover()`. | The torn last record is detected and truncated. Count how many acknowledged writes were lost without fsync. |
| E3 | Update the same 1,000 keys 1,000 times, then `compact()`. | File size before and after. |
| E4 | Try to answer "all keys between `seat:A:001` and `seat:A:100`". | Impossible without a full scan. That is why sorted structures (SSTables, B-trees) exist. |
| E5 | Load 50M distinct keys. | Memory grows until the process dies: the hash index must fit in RAM. |

#### POC 3b — Indexes in PostgreSQL, measured

```sql
-- 5M synthetic orders
CREATE TABLE orders_lab (
  id          bigserial PRIMARY KEY,
  user_id     bigint NOT NULL,
  event_id    bigint NOT NULL,
  status      text   NOT NULL,
  total_cents int    NOT NULL,
  created_at  timestamptz NOT NULL
);

INSERT INTO orders_lab (user_id, event_id, status, total_cents, created_at)
SELECT (random() * 100000)::int,
       (random() * 500)::int,
       (ARRAY['pending', 'paid', 'refunded'])[1 + (random() * 2)::int],
       (random() * 20000)::int,
       now() - random() * interval '365 days'
FROM generate_series(1, 5000000);
ANALYZE orders_lab;

-- 1. Baseline: watch for "Seq Scan" and the Buffers line
EXPLAIN (ANALYZE, BUFFERS)
SELECT created_at, total_cents FROM orders_lab
WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20;

-- 2. Composite index; column order matches "filter by user, sort by time"
CREATE INDEX orders_lab_user_created ON orders_lab (user_id, created_at DESC) INCLUDE (total_cents);
VACUUM ANALYZE orders_lab;   -- updates the visibility map so "Index Only Scan" is possible
-- re-run the EXPLAIN: look for Index Only Scan and far fewer buffers

-- 3. Partial index: only the rows a background job cares about
CREATE INDEX orders_lab_pending ON orders_lab (created_at) WHERE status = 'pending';

-- 4. BRIN: tiny index that only works when physical order follows the column
CREATE INDEX orders_lab_created_brin ON orders_lab USING brin (created_at);
```

**Experiments**

| # | Experiment | What to look for |
|---|---|---|
| E1 | Compare the EXPLAIN before and after the composite index. | Execution time, rows scanned, shared buffers hit/read. |
| E2 | Create the index as `(created_at, user_id)` instead. | Postgres may not use it for this query. Explain why column order matters. |
| E3 | Check whether the BRIN index helps a date-range query on `orders_lab`. | It barely helps, because rows were inserted with *random* timestamps. Now create a table where rows are inserted in time order and repeat. BRIN works when physical order correlates with the value. |
| E4 | Insert 500k rows with 0, 2, then 6 indexes on the table. | Write throughput drops as indexes grow: write amplification you can see. |
| E5 | `SELECT pg_size_pretty(pg_relation_size('orders_lab_user_created'));` for each index. | Indexes cost disk and cache memory. |

#### POC 3c — OLTP vs OLAP with DuckDB

```sql
-- in the DuckDB CLI
INSTALL postgres; LOAD postgres;
ATTACH 'dbname=tickets user=app password=app host=127.0.0.1' AS pg (TYPE postgres);
COPY (SELECT * FROM pg.public.orders_lab) TO 'orders.parquet' (FORMAT parquet);

-- revenue per event per month, columnar and vectorized
SELECT event_id, date_trunc('month', created_at) AS month, sum(total_cents) AS revenue
FROM 'orders.parquet'
WHERE status = 'paid'
GROUP BY ALL
ORDER BY revenue DESC
LIMIT 20;
```

Run the equivalent query in Postgres and compare time. Compare the file size of `orders.parquet` with `pg_total_relation_size('orders_lab')` to see columnar compression. Then build the dashboard version inside Postgres with a materialized view:

```sql
CREATE MATERIALIZED VIEW event_monthly_revenue AS
SELECT event_id, date_trunc('month', created_at) AS month, sum(total_cents) AS revenue
FROM orders_lab WHERE status = 'paid'
GROUP BY 1, 2;
CREATE UNIQUE INDEX ON event_monthly_revenue (event_id, month); -- required for CONCURRENTLY
REFRESH MATERIALIZED VIEW CONCURRENTLY event_monthly_revenue;   -- readers aren't blocked
```

### Production checklist


- [ ] Every index exists for a named query; unused indexes are found (`pg_stat_user_indexes.idx_scan = 0`) and dropped.
- [ ] Indexes on large tables are created with `CREATE INDEX CONCURRENTLY`.
- [ ] Slow query log and `pg_stat_statements` are reviewed weekly.
- [ ] Analytics queries never run on the OLTP primary; they go to a replica, a materialized view or a columnar store.
- [ ] Autovacuum is monitored (dead tuples, table bloat).

### Mistakes people make

- Adding an index for every column "to be safe", which slows every write and wastes memory.
- Creating a composite index in the wrong column order, so the query can't use it.
- Wrapping an indexed column in a function (`WHERE lower(email) = ...`) and wondering why the index isn't used. Index the expression instead.
- Running heavy reports on the main database during peak traffic.
- Building an index on a big table without `CONCURRENTLY`, which blocks writes until it finishes.

### Interview corner

**Q: How does an index make queries faster, and what does it cost?**
Say this: "Without an index the database reads every row. An index is a sorted structure, usually a B-tree, that lets it jump straight to matching rows, like a book's index. The cost is extra disk and memory, and every insert or update must also update the index, so writes get slower. I add indexes for specific, measured queries."

**Q: B-tree vs LSM-tree?**
Say this: "A B-tree keeps sorted pages and updates them in place; reads are fast and predictable, which is why relational databases use it. An LSM-tree buffers writes in memory and writes sorted files sequentially, merging them in the background, so it handles very high write rates, but reads may check several files and background compaction uses disk bandwidth. Write-heavy systems like logs or metrics often use LSM; general OLTP often uses B-trees."

**Q: What is a write-ahead log?**
Say this: "Before changing data pages, the database writes the change to an append-only log and forces it to disk. If the machine crashes mid-update, on restart it replays the log to finish or undo changes. The same log is also used for replication to other machines."

**Q: In what order should columns go in a composite index?**
Say this: "Columns used with equality filters first, then the column used for range filters or sorting. For 'orders of user 42, newest first', the index is `(user_id, created_at DESC)`. An index on `(created_at, user_id)` wouldn't serve that query well, because the first column isn't the one being filtered by equality."

**Q: Why isn't my query using the index?**
Say this: "Common reasons: the filter matches a big fraction of the table, so a full scan is cheaper; the column is wrapped in a function or cast; the index's leading column isn't in the filter; statistics are outdated, so I'd run `ANALYZE`; or the table is tiny. I check with `EXPLAIN ANALYZE`."

**Q: OLTP vs OLAP, and why are column stores faster for analytics?**
Say this: "OLTP serves users with many small reads and writes by key; OLAP scans millions of rows to aggregate. A column store keeps each column together, so a query that needs 3 of 50 columns reads only those 3, and similar values compress very well. Column stores are bad at updating single rows, so analytics usually runs on a separate copy of the data."

**Q: What is a covering index?**
Say this: "An index that contains all the columns a query needs, so the database answers from the index alone without visiting the table: an index-only scan. In PostgreSQL I'd use `INCLUDE` to add extra columns without making them part of the sort key."

**What impresses interviewers:** explaining the write cost of indexes, reading an `EXPLAIN` plan, and separating OLTP from analytics.
**Red flag:** "Just add an index" without saying which columns, in which order, for which query.

### Cheat card

- Append = fast writes. Index = fast reads. Every index slows writes.
- B-tree: sorted pages, in-place updates, protected by the WAL. LSM: memory buffer → sorted files → background merge.
- Composite index: equality columns first, then range/sort column.
- Use `EXPLAIN ANALYZE`; "Seq Scan" on a big table is a clue.
- OLTP on the main database; OLAP on a copy, ideally columnar.
- Big tables: `CREATE INDEX CONCURRENTLY`.

### AI-era angle

Vector indexes (HNSW and IVFFlat in pgvector) are just another kind of index with the same trade-offs: they take time to build, use memory, slow writes, and add one new knob, **recall vs speed** (how often the true nearest match is found vs how fast). Try adding a `vector(384)` column and an HNSW index, then measure recall and latency as you change `hnsw.ef_search`.

### Share it: blog post and training session

#### Blog post
**Title:** "I built a database in 100 lines of TypeScript, and it taught me how to index Postgres"
1. The append-only log and why it's fast. 2. Crash recovery and torn writes (E2). 3. Compaction. 4. Why range queries need sorted structures. 5. Postgres B-tree indexes with real EXPLAIN output. 6. Rows vs columns: DuckDB vs Postgres on the same data.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–10 | Live: the fsync on/off throughput gap. |
| 10–35 | Concepts: log + hash index, LSM vs B-tree, WAL, write amplification. |
| 35–60 | Live EXPLAIN clinic: take three real slow queries from our services and fix them together. |
| 60–80 | Exercise: each pair designs the indexes for the TicketRush "my orders" and "event sales" pages. |
| 80–90 | OLTP vs OLAP: where do our reports run today? |

---

## Module 4 · Encoding and evolution

**Read:** 1st edition Chapter 4 (PDF pp. 129–162); focus on "Thrift and Protocol Buffers" (p. 135), "The merits of schemas" (p. 145), "Modes of Data Flow" (p. 146). 2nd edition: Chapter 5.
**What must be true at the end:** *"During a rolling deploy, old and new versions of the app run side by side with zero errors and zero data loss."*

### In one line

Data lives longer than code, so every change to its shape must work for old and new versions of your software at the same time.

### Think of it like this

A government office updates its paper form, adding a new box for "email". For months, people still hand in the old form, and some clerks still have old instructions. For this to work: clerks with new instructions must accept old forms without the email box (**backward compatible**), and clerks with old instructions must accept new forms and simply ignore the box they don't recognise (**forward compatible**). And nobody may ever reuse "box 3" for something different, because old forms with "box 3 = phone number" are still out there.

### The idea, step by step

1. Before data is saved or sent over the network, it's turned into bytes: **encoding** (also called serialization). Reading it back is **decoding**.
2. During a **rolling deploy**, some servers run the new version and some the old, reading and writing the same database and messages. Mobile apps are worse: old versions stay installed for months.
3. So every change needs **backward compatibility** (new code reads old data) and **forward compatibility** (old code reads new data, ignoring unknown fields).
4. **JSON** is easy to read but loose: large numbers lose precision in JavaScript, there's no binary type, and nothing stops a field from vanishing. **Binary formats with schemas** (Protocol Buffers, Avro, Thrift) are compact and make the rules explicit: in Protobuf every field has a number, unknown numbers are skipped, and a number must never be reused.
5. Data flows three ways, each with its own trap: **through the database** (old code may rewrite a record and drop fields it doesn't know), **through APIs** (clients upgrade on their own schedule, so you need versioning), and **through messages** (old and new consumers read the same queue).
6. To change a database schema safely, use **expand/contract**: first add the new thing, run both for a while, move the data across, switch reads, and only at the end remove the old thing.

### Words you'll meet

| Word | Plain meaning | Example |
|---|---|---|
| Encoding / serialization | Turning data into bytes to store or send. | An object → JSON text → bytes. |
| Backward compatibility | New code can read data written by old code. | v2 reads holds created before `salesChannel` existed. |
| Forward compatibility | Old code can read data written by new code. | v1 ignores the new `salesChannel` field. |
| Protocol Buffers (Protobuf) | A compact binary format defined by a schema with numbered fields. | `int64 seat_id = 2;` |
| Field tag | The number that identifies a field in Protobuf. | Tag 3 must always mean `user_id`. |
| `reserved` | Protobuf keyword that blocks a removed field's number from reuse. | `reserved 3;` |
| Avro | A binary format where the writer's and reader's schemas are compared at read time. | Common with Kafka and a schema registry. |
| Schema registry | A service that stores message schemas and checks new ones are compatible. | Rejects a change that would break old consumers. |
| Rolling deploy | Replacing servers one by one, so versions overlap. | v1 and v2 serve traffic together for 10 minutes. |
| Expand / contract | Add new → run both → migrate data → switch → remove old. | Renaming a column with no downtime. |
| Backfill | Filling a new column for existing rows, in small batches. | 1,000 rows at a time. |
| `lock_timeout` | How long a schema change may wait for a lock before giving up. | Stops a migration from freezing the whole table. |
| API versioning | Keeping old API behaviour available while adding a new version. | `/v1/events` and `/v2/events`. |
| Tolerant reader | Code that ignores fields it doesn't understand. | The mobile app ignores a new `badge` field. |
| Upcasting | Converting an old message version to the newest shape when reading. | v1 event gets a default `salesChannel`. |

### Picture it

```
ROLLING DEPLOY: old and new code overlap
time ─────────────────────────────────────────────►
server 1:  v1 ████████ v2 ██████████████████████
server 2:  v1 ████████████████ v2 ██████████████
server 3:  v1 ████████████████████████ v2 ██████
                   ▲ both versions read and write the same DB and topics here

EXPAND / CONTRACT (rename venues.name → display_name)
1 add column → 2 write both → 3 backfill → 4 read new → 5 write only new → 6 drop old
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### POC 4 — Zero-downtime evolution

**Build**

1. **The JSON number trap** (run it in a Node REPL):

```ts
JSON.parse('{"id": 9007199254740993}').id; // 9007199254740992 — silently wrong
```

   This is why `pg` returns int8 as strings, why IDs in your API should be strings, and why money is integer minor units.

2. **Protobuf schema evolution** with `protobufjs`:

```proto
// proto/v1/ticket_held.proto
syntax = "proto3";
package tickets;

message TicketHeld {
  int64 hold_id       = 1;
  int64 seat_id       = 2;
  int64 user_id       = 3;
  int64 expires_at_ms = 4;
}
```

```proto
// proto/v2/ticket_held.proto — adds a field (safe)
syntax = "proto3";
package tickets;

message TicketHeld {
  int64  hold_id       = 1;
  int64  seat_id       = 2;
  int64  user_id       = 3;
  int64  expires_at_ms = 4;
  string sales_channel = 5;   // new: "web" | "mobile" | "box_office"
}
```

```proto
// proto/v3/ticket_held.proto — removes a field (safe only with "reserved")
syntax = "proto3";
package tickets;

message TicketHeld {
  reserved 3;
  reserved "user_id";         // nobody can ever reuse tag 3 by accident
  int64  hold_id       = 1;
  int64  seat_id       = 2;
  int64  expires_at_ms = 4;
  string sales_channel = 5;
}
```

```ts
// apps/m04-evolution/src/proto-compat.ts
import protobuf from 'protobufjs';

async function main() {
  const load = async (v: string) =>
    (await protobuf.load(`proto/${v}/ticket_held.proto`)).lookupType('tickets.TicketHeld');
  const V1 = await load('v1');
  const V2 = await load('v2');
  const opts = { longs: String, defaults: true };

  // new writer, old reader: forward compatibility (field 5 is skipped)
  const fromV2 = V2.encode(V2.create({
    holdId: 1, seatId: 7, userId: 9, expiresAtMs: Date.now(), salesChannel: 'mobile',
  })).finish();
  console.log('v1 reads v2:', V1.toObject(V1.decode(fromV2), opts));

  // old writer, new reader: backward compatibility (salesChannel gets its default "")
  const fromV1 = V1.encode(V1.create({ holdId: 2, seatId: 8, userId: 10, expiresAtMs: Date.now() })).finish();
  console.log('v2 reads v1:', V2.toObject(V2.decode(fromV1), opts));

  const asJson = JSON.stringify({ holdId: '1', seatId: '7', userId: '9', expiresAtMs: Date.now(), salesChannel: 'mobile' });
  console.log(`size: json=${Buffer.byteLength(asJson)} bytes, protobuf=${fromV2.length} bytes`);
}
main();
```

3. **Expand/contract migration: renaming a column with no downtime.** Rename `venues.name` to `display_name` while v1 (reads `name`) and v2 (reads `display_name`) both run.

| Phase | Database change | App change | Safe to roll back? |
|---|---|---|---|
| 1. Expand | `ALTER TABLE venues ADD COLUMN display_name text;` | none | yes |
| 2. Dual write | none | v2 writes both columns, still reads `name` | yes |
| 3. Backfill | batched `UPDATE` (below) | none | yes |
| 4. Switch reads | add `NOT NULL` via validated check | v3 reads `display_name`, still writes both | yes |
| 5. Stop old writes | none | v4 writes only `display_name` | only to v3 |
| 6. Contract | `ALTER TABLE venues DROP COLUMN name;` | none | no: take a backup first |

```sql
-- Phase 3: backfill in small batches so you never hold long locks. Repeat until 0 rows.
UPDATE venues SET display_name = name
WHERE id IN (SELECT id FROM venues WHERE display_name IS NULL LIMIT 1000);

-- Phase 4: add NOT NULL without a long table scan under an exclusive lock
SET lock_timeout = '3s';   -- give up instead of blocking all traffic behind your DDL
ALTER TABLE venues ADD CONSTRAINT venues_display_name_nn CHECK (display_name IS NOT NULL) NOT VALID;
ALTER TABLE venues VALIDATE CONSTRAINT venues_display_name_nn; -- scans without blocking writes
```

4. **API versioning in NestJS:**

```ts
// main.ts
import { VersioningType } from '@nestjs/common';
app.enableVersioning({ type: VersioningType.URI });   // /v1/events, /v2/events

// events.v1.controller.ts
@Controller({ path: 'events', version: '1' })
export class EventsV1Controller { /* returns { id, title, venueName } */ }

// events.v2.controller.ts
@Controller({ path: 'events', version: '2' })
export class EventsV2Controller { /* returns { id, title, venue: { id, displayName } } */ }
```

   Rules for evolving a response without a new version: only add fields, never rename or remove; never change a field's type; clients must ignore fields they don't know (the "tolerant reader").

5. **The "old code deletes new fields" bug.** Make v1 code load `details`, map it into a DTO with only the fields it knows, add a tag, and write the whole object back. Meanwhile v2 has added `details.accessibility`. Run v1 once and the accessibility data is gone. Fix it by updating only what you changed:

```ts
// BAD: rewrites the whole document with only the fields this version knows about
const known = { category: row.details.category, tags: [...row.details.tags, 'sold-out'] };
await pool.query('UPDATE events SET details = $1 WHERE id = $2', [known, id]);

// GOOD: change one key, preserve everything else
await pool.query(
  `UPDATE events SET details = jsonb_set(details, '{tags}', $1::jsonb) WHERE id = $2`,
  [JSON.stringify([...row.details.tags, 'sold-out']), id], // JSON.stringify: pg turns JS arrays
);                                                          // into Postgres arrays, not JSON
```

6. **Message envelopes with versions** (used from Module 9 onward):

```ts
export interface Envelope<T> {
  id: string;            // UUID, used by consumers to deduplicate
  type: string;          // 'TicketHeld'
  version: number;       // schema version of `data`
  occurredAt: string;    // ISO-8601 event time
  data: T;
}

// consumers "upcast" old versions to the latest shape in one place
function upcastTicketHeld(e: Envelope<any>) {
  if (e.version === 1) return { ...e, version: 2, data: { ...e.data, salesChannel: 'web' } };
  return e;
}
```

**Break it**

| # | Experiment | What to look for |
|---|---|---|
| E1 | Create `proto/v3-bad` that reuses tag 3 as `string coupon_code = 3;` and decode v1 bytes with it. | A decode error or garbage. Write in the README why `reserved` exists. |
| E2 | Run v1 and v2 of the app on ports 3000 and 3002 behind nginx round-robin, with k6 traffic, while you execute all six migration phases. | Target: zero 5xx. If you see errors, find which phase broke compatibility. |
| E3 | Run the "old code deletes new fields" bug, then the fix. | Data loss you can see in a `SELECT details`. |
| E4 | Run the Phase 4 `ALTER TABLE` without `lock_timeout` while a long transaction holds a lock on `venues`. | Every query on `venues` queues behind your DDL. This is how "a simple migration" takes production down. |

nginx for E2:

```nginx
upstream api { server host.docker.internal:3000; server host.docker.internal:3002; }
server { listen 8080; location / { proxy_pass http://api; } }
```

### Production checklist


- [ ] Every schema change follows expand/contract; destructive steps ship in a later release.
- [ ] DDL runs with `lock_timeout`; large indexes use `CONCURRENTLY`; backfills are batched.
- [ ] APIs only add fields within a version; breaking changes get a new version and a sunset date.
- [ ] Message schemas are versioned; consumers tolerate unknown fields and old versions.
- [ ] Protobuf: removed fields are `reserved`; tags never reused.
- [ ] Partial updates for documents; no "read whole object, write whole object" with a lossy DTO.

### Mistakes people make

- Renaming or dropping a column in the same release that stops using it, while old servers are still running.
- Adding a required (non-null, no default) field to an API request or message, which breaks every old client.
- Reusing a Protobuf field number.
- Reading a whole record into a class with only "known" fields and writing it back, silently deleting newer fields.
- Running `ALTER TABLE` on a busy table without `lock_timeout`, freezing all queries behind it.
- Sending IDs larger than 2⁵³ as JSON numbers to JavaScript clients.

### Interview corner

**Q: What are backward and forward compatibility?**
Say this: "Backward compatibility means new code can read data written by old code. Forward compatibility means old code can read data written by new code, ignoring what it doesn't understand. A rolling deploy needs both, because old and new versions run at the same time against the same database and queues."

**Q: How do you rename a database column with zero downtime?**
Say this: "Expand and contract. Add the new column, deploy code that writes both, backfill old rows in small batches, add constraints without long locks, switch reads to the new column, stop writing the old one, and only then drop it in a later release. Every step can be rolled back except the last, so I take a backup first."

**Q: JSON vs Protobuf vs Avro?**
Say this: "JSON is human-readable and universal, good for public APIs, but verbose and loose about types. Protobuf is compact and fast, with numbered fields that make evolution rules clear; it's common for internal service calls with gRPC. Avro also has schemas, and compares the writer's and reader's schema when decoding, which works well for data files and Kafka with a schema registry."

**Q: How do you version an API?**
Say this: "Within a version, I only make additive changes: new optional fields, new endpoints. For breaking changes I publish a new version, usually in the URL like `/v2`, keep the old one running, and announce a sunset date. Clients must ignore unknown fields so I can add things safely."

**Q: REST or gRPC?**
Say this: "REST with JSON is simple, works everywhere, and is easy to debug, so I use it for public and browser-facing APIs. gRPC with Protobuf is faster and strongly typed, with streaming support, so it suits internal service-to-service calls. Either way, I remember a network call can fail or time out in ways a local function call can't."

**Q: How do you change the schema of messages in Kafka?**
Say this: "I use a schema registry with a compatibility rule, usually backward compatibility, so producers can't publish a schema that breaks consumers. I make additive changes with defaults, put a version in the message envelope, and convert old versions in one place on the consumer side."

**What impresses interviewers:** mentioning that old and new code overlap, expand/contract, and `lock_timeout`.
**Red flag:** "We'll just run the migration during the deploy" with no thought about the overlap.

### Cheat card

- Old and new code always overlap: rolling deploys, old mobile apps, queued messages.
- Backward = new reads old. Forward = old reads new.
- Only add optional fields; never reuse a Protobuf tag (use `reserved`).
- Schema changes: expand → dual write → backfill → switch reads → contract.
- DDL with `lock_timeout`; indexes `CONCURRENTLY`; backfill in batches.
- Update only the fields you changed; don't rewrite whole records with lossy DTOs.

### AI-era angle

Prompts, tool definitions and structured-output schemas are contracts too: version them and log the version with each AI response. Embeddings have a hidden "schema": the model that produced them. Embeddings from two different models can't be compared, so store the model name with every vector and treat a model upgrade like a column rename: write both, backfill, switch, then remove the old.

### Share it: blog post and training session

#### Blog post
**Title:** "Renaming a column without downtime: the expand/contract playbook for NestJS and Postgres"
1. Why old and new code always overlap. 2. Forward vs backward compatibility with a picture of a rolling deploy. 3. The six phases with SQL. 4. The lock_timeout incident (E4). 5. Protobuf tags and `reserved`. 6. The silent data-loss bug and the fix.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–10 | Quiz: "Is adding a required field to a request DTO a breaking change?" |
| 10–30 | Concepts: compatibility directions, schemas, the three modes of data flow. |
| 30–55 | Live: rolling deploy behind nginx while running the migration phases. |
| 55–80 | Exercise: plan the migration that splits `users.name` into `first_name` and `last_name`. |
| 80–90 | Review: which of our current APIs would break old mobile clients? |

---

## Module 5 · Replication

**Read:** 1st edition Chapter 5 (PDF pp. 167–212); focus on "Synchronous vs. asynchronous replication" (p. 169), "Handling node outages" (p. 172), "Problems With Replication Lag" (p. 177), "Limitations of quorum consistency" (p. 197). 2nd edition: Chapter 6.
**What must be true at the end:** *"After a user creates a hold, their next page load always shows it, even when reads go to replicas."*

### In one line

Replication keeps copies of the same data on several machines, so you survive failures and serve more reads, but the copies are sometimes a little behind.

### Think of it like this

A company keeps its main ledger at head office. Every branch has a photocopy, updated by a courier who brings new pages every few seconds. Customers can check balances at any branch, which spreads the work. But if you deposit money at head office and immediately check at a branch, the courier may not have arrived yet, and your deposit "isn't there". If head office burns down, a branch can take over, but anything the courier hadn't delivered is lost.

### The idea, step by step

1. **Why copy data?** To keep working when a machine dies, to handle more reads, and to be closer to users.
2. **Single-leader replication** (the most common): all writes go to one machine, the **leader** (or primary). It sends every change to the **followers** (or replicas), which apply them in the same order. Reads can go to any copy.
3. **Synchronous** replication: the leader waits until a follower confirms before telling the user "saved". Safer, but slower, and if that follower is stuck, writes stop. **Asynchronous**: the leader confirms immediately. Faster, but if the leader dies, recent writes may be lost.
4. Async followers lag behind (**replication lag**), usually by milliseconds, sometimes by minutes. This causes three visible problems:
   - **Read-your-writes**: you save something, refresh, and it's gone.
   - **Monotonic reads**: you refresh twice and see newer data, then older data (time goes backwards).
   - **Consistent prefix**: you see an answer before the question it replies to.
5. **Failover**: when the leader dies, a follower is promoted. Dangers: losing writes the new leader never received, two machines both thinking they're the leader (**split brain**), and choosing how long to wait before declaring the leader dead.
6. Two other styles exist. **Multi-leader**: several machines accept writes (useful for multiple data centres or offline apps), so conflicts must be resolved. **Leaderless**: the client writes to several replicas and reads from several, and uses a **quorum**: with `n` copies, if writes reach `w` and reads ask `r` where `w + r > n`, at least one copy you read has the latest value, usually.

### Words you'll meet

| Word | Plain meaning | Example in TicketRush |
|---|---|---|
| Leader / primary | The one copy that accepts writes. | `pg-primary` on port 5432. |
| Follower / replica | A read-only copy kept up to date by the leader. | `pg-replica1` on port 5433. |
| Synchronous / asynchronous | Leader waits for the follower before confirming, or doesn't. | Async by default in Postgres. |
| Replication lag | How far behind a follower is. | Replica 2 is 5 seconds behind. |
| WAL streaming | Postgres sends its write-ahead log to followers, which replay it. | How our replicas stay updated. |
| LSN (log sequence number) | A position in the WAL, like a page number in the ledger. | `0/3000148`. |
| Replication slot | A bookmark on the leader that keeps WAL until a follower has read it. | `replica1` slot. |
| Read-your-writes | You always see your own latest changes. | Your new hold shows after refresh. |
| Monotonic reads | You never see data go back in time. | Your hold doesn't appear then vanish. |
| Consistent prefix | Related writes are seen in the right order. | A reply never appears before its question. |
| Failover / promotion | Turning a follower into the new leader. | `SELECT pg_promote();` |
| Split brain | Two nodes both acting as leader. | Both accept writes; data diverges. |
| RPO | Recovery point objective: how much recent data you can afford to lose. | "At most 1 second of orders." |
| Multi-leader | Several nodes accept writes. | One per region. |
| Leaderless / quorum | Clients write to and read from several replicas; `w + r > n`. | n=3, w=2, r=2. |
| Read repair | When a read finds a stale copy, it updates it. | Our quorum toy does this. |
| CRDT | A data type that merges concurrent edits automatically without conflicts. | Collaborative notes. |

### Picture it

```
            writes                     reads
client ───────────► PRIMARY ◄───────── (must be fresh)
                      │  WAL stream (async)
            ┌─────────┴──────────┐
            ▼                    ▼
        REPLICA 1            REPLICA 2  (5 s behind)
            ▲                    ▲
            └── reads that may be slightly stale ──┘

Read-your-writes trick: after a write, remember the primary's position (LSN).
Read from a replica only if it has replayed past that position; otherwise use the primary.
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### POC 5a — Primary with two replicas in Docker Compose

`infra/compose.m05.yml` (standalone; replica 2 deliberately lags by 5 seconds):

```yaml
services:
  pg-primary:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: tickets
    command: >
      postgres -c wal_level=replica -c max_wal_senders=10
               -c max_replication_slots=10 -c hot_standby=on
    volumes:
      - ./m05/primary-init.sh:/docker-entrypoint-initdb.d/01-replication.sh:ro
    ports: ["5432:5432"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d tickets"]
      interval: 3s
      retries: 20

  pg-replica1: &replica
    image: postgres:16
    user: postgres
    entrypoint: ["/bin/bash", "/replica-start.sh"]
    depends_on:
      pg-primary: { condition: service_healthy }
    environment:
      PGPASSWORD: replpass
      SLOT: replica1
      APPLY_DELAY: "0"
    volumes:
      - ./m05/replica-start.sh:/replica-start.sh:ro
      - replica1-data:/var/lib/postgresql/data
    ports: ["5433:5432"]

  pg-replica2:
    <<: *replica
    environment:
      PGPASSWORD: replpass
      SLOT: replica2
      APPLY_DELAY: "5s"
    volumes:
      - ./m05/replica-start.sh:/replica-start.sh:ro
      - replica2-data:/var/lib/postgresql/data
    ports: ["5434:5432"]

volumes:
  replica1-data:
  replica2-data:
```

`infra/m05/primary-init.sh`:

```bash
#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-SQL
  CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replpass';
  SELECT pg_create_physical_replication_slot('replica1');
  SELECT pg_create_physical_replication_slot('replica2');
SQL
echo "host replication replicator all scram-sha-256" >> "$PGDATA/pg_hba.conf"
```

`infra/m05/replica-start.sh`:

```bash
#!/bin/bash
set -euo pipefail
DATA=/var/lib/postgresql/data
if [ ! -s "$DATA/PG_VERSION" ]; then
  # copy a snapshot of the primary, then stream changes from the slot (-R writes standby config)
  until pg_basebackup -h pg-primary -U replicator -D "$DATA" -R -X stream -S "$SLOT"; do
    echo "waiting for primary..."; sleep 2
  done
  chmod 0700 "$DATA"
fi
exec postgres -c hot_standby=on -c cluster_name="$SLOT" -c recovery_min_apply_delay="$APPLY_DELAY"
```

Verify:

```sql
-- on the primary (port 5432)
SELECT application_name, state, sync_state, write_lag, flush_lag, replay_lag FROM pg_stat_replication;

-- on a replica (5433 / 5434)
SELECT pg_is_in_recovery();                                -- true
SELECT now() - pg_last_xact_replay_timestamp() AS replay_lag;
```

#### POC 5b — Read routing with read-your-writes and monotonic reads

Two kinds of pools: `PG_PRIMARY` for writes and `PG_REPLICAS` (an array) for reads.

```ts
// apps/m05-replication/src/read-router.ts
import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { Pool } from 'pg';

export const PG_PRIMARY = Symbol('PG_PRIMARY');
export const PG_REPLICAS = Symbol('PG_REPLICAS');
const LSN_RE = /^[0-9A-F]{1,8}\/[0-9A-F]{1,8}$/i;

@Injectable()
export class ReadRouter {
  constructor(
    @Inject(PG_PRIMARY) private readonly primary: Pool,
    @Inject(PG_REPLICAS) private readonly replicas: Pool[],
  ) {}

  /** Monotonic reads: a given user always reads from the same replica. */
  private replicaFor(userId: string): Pool {
    const h = createHash('sha1').update(userId).digest().readUInt32BE(0);
    return this.replicas[h % this.replicas.length];
  }

  /** Read-your-writes: use the replica only if it has replayed past the user's last write. */
  async poolFor(userId: string, lastWriteLsn?: string): Promise<Pool> {
    const replica = this.replicaFor(userId);
    if (!lastWriteLsn || !LSN_RE.test(lastWriteLsn)) return replica;
    try {
      const { rows } = await replica.query(
        'SELECT pg_last_wal_replay_lsn() >= $1::pg_lsn AS caught_up', [lastWriteLsn]);
      return rows[0]?.caught_up ? replica : this.primary;
    } catch {
      return this.primary; // replica unavailable: fall back, and alert on primary read load
    }
  }

  /** Call after a committed write; send the value to the client (cookie or header). */
  async currentLsn(): Promise<string> {
    const { rows } = await this.primary.query('SELECT pg_current_wal_lsn()::text AS lsn');
    return rows[0].lsn;
  }
}
```

```ts
// holds.controller.ts (excerpt)
@Post('holds')
async create(@Body() dto: CreateHoldDto, @Res({ passthrough: true }) res: Response) {
  const hold = await this.holds.create(dto);                  // writes go to the primary
  res.setHeader('X-Last-Write-LSN', await this.router.currentLsn());
  return hold;
}

@Get('users/:userId/holds')
async mine(@Param('userId') userId: string, @Headers('x-last-write-lsn') lsn?: string) {
  const pool = await this.router.poolFor(userId, lsn);
  const { rows } = await pool.query('SELECT * FROM holds WHERE user_id = $1', [userId]);
  return rows;
}
```

A simpler alternative many teams use: "read from the primary for 10 seconds after a user's last write". Implement both and compare: the time-based rule is easy but either wastes primary capacity or still shows stale data when lag exceeds 10 s.

**Break it**

| # | Experiment | What to look for |
|---|---|---|
| E1 | Create a hold, then immediately read it from replica 2 directly (no router). | It's missing for ~5 s: read-your-writes violated. |
| E2 | Same flow through the router with the LSN header. | Always visible. Count how often the router fell back to the primary. |
| E3 | Read through a naive round-robin across both replicas, refreshing every 500 ms after a write. | The hold appears, disappears, reappears: monotonic reads violated. Then use the sticky `replicaFor`. |
| E4 | Failover with data loss: `docker compose pause pg-replica1`, write 100 numbered holds and log which were acknowledged, `docker compose stop pg-primary`, `unpause` replica 1, run `SELECT pg_promote();` on it, point the app at it. | Count acknowledged writes that no longer exist. That's the price of async replication. |
| E5 | Synchronous replication: on the primary `ALTER SYSTEM SET synchronous_standby_names = 'replica1'; SELECT pg_reload_conf();` then pause replica 1 and try to write. | Commits hang. Durability bought with availability. Reset it afterwards. |
| E6 | Stop replica 2 for an hour while writing heavily. Watch `SELECT slot_name, active, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) FROM pg_replication_slots;` | The primary keeps WAL for the absent replica. An abandoned slot can fill the primary's disk. |

#### POC 5c (stretch) — A leaderless quorum store in 60 lines

```ts
// apps/m05-replication/src/quorum.ts
type Versioned = { value: string; version: number };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class Replica {
  data = new Map<string, Versioned>();
  up = true;
  latencyMs = 5;
  constructor(readonly name: string) {}

  async put(key: string, v: Versioned) {
    if (!this.up) throw new Error(`${this.name} down`);
    await sleep(this.latencyMs);
    const cur = this.data.get(key);
    if (!cur || v.version > cur.version) this.data.set(key, v); // highest version wins
  }

  async get(key: string) {
    if (!this.up) throw new Error(`${this.name} down`);
    await sleep(this.latencyMs);
    return { replica: this as Replica, v: this.data.get(key) };
  }
}

/** Resolve as soon as n promises succeed; reject when n successes become impossible. */
function firstN<T>(ps: Promise<T>[], n: number): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const ok: T[] = [];
    let failed = 0;
    for (const p of ps) {
      p.then((v) => { ok.push(v); if (ok.length === n) resolve(ok); })
       .catch(() => { if (ps.length - ++failed < n) reject(new Error('quorum not reached')); });
    }
  });
}

export class QuorumStore {
  constructor(private readonly replicas: Replica[], private readonly w: number, private readonly r: number) {}

  async write(key: string, value: string, version: number) {
    await firstN(this.replicas.map((x) => x.put(key, { value, version })), this.w);
  }

  async read(key: string): Promise<string | undefined> {
    const replies = await firstN(this.replicas.map((x) => x.get(key)), this.r);
    const newest = replies.reduce<Versioned | undefined>(
      (best, { v }) => (v && (!best || v.version > best.version) ? v : best), undefined);
    if (newest) {
      for (const { replica, v } of replies) {
        if (!v || v.version < newest.version) replica.put(key, newest).catch(() => undefined); // read repair
      }
    }
    return newest?.value;
  }
}
```

Experiments: n=3, w=2, r=2 with one replica down (works) and two down (fails); w=1, r=1 (stale reads appear); make one replica slow and watch read repair fix it; generate `version` from `Date.now()` on two clients whose clocks differ by 100 ms and watch the later write lose. That last one leads straight into Module 8.

### Production checklist


- [ ] Replication lag is graphed and alerted on (both bytes and seconds).
- [ ] Every read path is classified: "must be fresh" (primary or LSN-gated) vs "may be stale" (replica).
- [ ] Replication slots are monitored; abandoned slots are dropped.
- [ ] Failover is automated by a proven tool (Patroni, or your cloud's managed Postgres), and drilled quarterly.
- [ ] You know your recovery point objective (how much data async replication can lose) and it's written down.
- [ ] Connection strings go through a stable endpoint (DNS, PgBouncer, or a proxy), not a hard-coded host.

### Mistakes people make

- Sending every read to replicas, including "show me what I just saved".
- Load-balancing a user's reads across replicas at random, so data seems to go back in time.
- Assuming failover loses nothing with async replication.
- Forgetting about replication slots: a dead replica's slot makes the primary keep WAL until its disk fills.
- Building your own failover scripts instead of using a proven tool or a managed database.

### Interview corner

**Q: Why replicate a database?**
Say this: "Three reasons: availability, so the system survives a machine failing; read scaling, so many replicas share read traffic; and latency, so users read from a copy near them. Replication doesn't help write throughput in a single-leader setup, because all writes still go to one machine; that's what sharding is for."

**Q: Synchronous vs asynchronous replication?**
Say this: "With synchronous replication, the leader waits for a follower to confirm before acknowledging the write, so a confirmed write survives the leader dying, but writes are slower and stop if the follower is unavailable. Asynchronous acknowledges immediately, which is fast and keeps working when followers lag, but recent writes can be lost on failover. A common middle ground is one synchronous follower and the rest async."

**Q: What problems does replication lag cause, and how do you fix them?**
Say this: "Read-your-writes, where a user doesn't see their own change; I fix it by reading from the leader for things the user just changed, or by tracking the write's log position and only using a replica that has caught up. Monotonic reads, where data goes back in time; I fix it by sending each user to the same replica. Consistent prefix, where related writes appear out of order; I keep related writes in the same partition so they're applied in order."

**Q: What happens during a failover, and what can go wrong?**
Say this: "The system detects the leader is gone, usually by a timeout, promotes the most up-to-date follower, and redirects writes to it. Risks: with async replication, the last writes are lost; if the old leader comes back and still thinks it's the leader, we get split brain; and the timeout is a trade-off between false alarms and slow recovery. I'd use a proven tool like Patroni or a managed service, plus fencing so the old leader can't accept writes."

**Q: Single-leader vs multi-leader vs leaderless?**
Say this: "Single-leader is simplest and gives a clear order of writes; most apps should start here. Multi-leader accepts writes in several places, good for multiple regions or offline clients, but you must resolve conflicting writes. Leaderless, like Cassandra or DynamoDB-style systems, writes to several replicas and uses quorums, which tolerates node failures well, but gives weaker guarantees and needs conflict handling."

**Q: Explain quorums: why w + r > n?**
Say this: "With n copies, if every write reaches w of them and every read asks r of them, and w + r is greater than n, the set I read from must overlap with the set I wrote to, so at least one reply has the latest value. With n=3, w=2, r=2 we tolerate one node down. It's not a perfect guarantee: concurrent writes, failed partial writes and clock-based conflict resolution can still return stale or lost data."

**Q: How would you scale reads for a read-heavy system?**
Say this: "First a cache for hot data, then read replicas for the rest, routing reads that must be fresh to the primary. For static content, a CDN. I'd monitor replication lag and have the app fall back to the primary if a replica falls too far behind."

**What impresses interviewers:** naming the three lag anomalies and a concrete fix for each, and mentioning split brain and fencing.
**Red flag:** "Replicas are always in sync" or "replication scales writes".

### Cheat card

- Single leader: writes to one, reads from many. Async by default = fast but can lose the latest writes on failover.
- Lag anomalies: read-your-writes, monotonic reads, consistent prefix.
- Fixes: read-from-leader after writes or LSN check; sticky replica per user; same-partition ordering.
- Failover risks: lost writes, split brain, wrong timeout. Use proven tooling.
- Quorum: w + r > n (e.g. 2 + 2 > 3).
- Replication scales reads and availability, not writes.

### AI-era angle

RAG systems hit read-your-writes all the time: a user uploads a document and immediately asks about it, but the indexing pipeline hasn't processed it yet, so the assistant says it can't find it. The fix is the same: track the write (an ingestion job ID), and either wait until the index has processed it or show an "indexing…" state instead of a wrong answer.

### Share it: blog post and training session

#### Blog post
**Title:** "Why did my hold disappear? Read-your-writes on Postgres replicas with NestJS"
1. The bug users report. 2. How streaming replication works. 3. Three lag anomalies with screenshots. 4. LSN-based routing vs time-based stickiness. 5. The failover drill and the writes we lost. 6. What we monitor now.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–10 | Live: E1, the vanishing hold. |
| 10–30 | Concepts: leader/follower, sync vs async, failover traps, the three anomalies. |
| 30–55 | Live: router with LSN; round-robin vs sticky reads. |
| 55–75 | Failover drill as a team: one person breaks the primary, others recover and count losses. |
| 75–90 | Leaderless and multi-leader in 15 minutes using the quorum toy. |

---

## Module 6 · Partitioning (sharding)

**Read:** 1st edition Chapter 6 (PDF pp. 213–234); focus on "Partitioning by hash of key" (p. 217), "Skewed workloads and relieving hot spots" (p. 218), "Partitioning secondary indexes by document" (p. 220), "Strategies for rebalancing" (p. 223). 2nd edition: Chapter 7, which calls it "sharding".
**What must be true at the end:** *"One blockbuster on-sale cannot slow down every other event."*

### In one line

When data or traffic is too big for one machine, split it into slices and give each machine some slices, choosing the split so the work spreads evenly.

### Think of it like this

A city's phone book is too thick, so it's printed in volumes: A–F, G–M, N–S, T–Z. That's splitting **by range**: easy to find all the "Sharma"s together, but if everyone is named "Patel", one volume is huge and the others are thin. Another way: assign each name to a volume by a formula that scrambles names evenly (**by hash**). Now volumes are equal, but "all names starting with Sh" are scattered everywhere.

Even with perfect splitting, if a celebrity's number is in volume 3 and the whole city calls it at once, volume 3's desk is overwhelmed (**hot spot**). A bank handles a rush by giving out numbered tokens and calling a few people at a time; that's a **waiting room**.

### The idea, step by step

1. **Partitioning** (also called sharding) splits data into slices called partitions or shards. Each piece of data belongs to exactly one partition. Each partition is usually also replicated (Module 5).
2. **By key range**: neighbouring keys stay together, so range queries are cheap ("all orders in October"). Risk: if keys are timestamps, all new writes go to the newest partition.
3. **By hash of key**: a hash function scrambles the key into a number; the number decides the partition. Load spreads evenly, but range queries must ask every partition.
4. **Hot spots**: one key gets most of the traffic. The database can't fix this; the application must spread the hot key (for example, split one counter into 16 sub-counters) or slow the traffic down before it arrives (a waiting room).
5. **Secondary indexes** (searching by something other than the partition key): a **local** index lives in each partition, so searching by that field means asking every partition and combining answers (**scatter/gather**). A **global** index is itself partitioned by the searched value, so reads are targeted but writes touch several partitions.
6. **Rebalancing**: when you add machines, some data must move. Never use `hash % number_of_machines`: going from 3 to 4 machines moves about 75% of the data. Instead, create many more partitions than machines (say 64) and move whole partitions; **consistent hashing** is another way to move only a small share of keys.
7. **Request routing**: something must know which machine holds which partition: the client, a routing layer, or a coordination service.

### Words you'll meet

| Word | Plain meaning | Example in TicketRush |
|---|---|---|
| Partition / shard | One slice of the data. | Holds for events 1–1,000. |
| Partition key / shard key | The field that decides the slice. | `event_id`. |
| Range partitioning | Slices by value ranges. | One partition per month of activity. |
| Hash partitioning | Slices by a scrambled number from the key. | `hash(event_id) mod 4`. |
| Hash function | Turns any input into a fixed-size, evenly spread number. | md5, murmur. |
| Hot spot / hot key | One slice or key getting far more traffic than others. | A superstar's concert. |
| Skew | Uneven spread of data or load. | One partition has 90% of writes. |
| Salting | Adding a random suffix to a hot key to spread it. | `event:1:slot:7`. |
| Local / global secondary index | Index per partition vs index partitioned by the indexed value. | "Holds by user" scans all partitions locally. |
| Scatter/gather | Ask every partition, then merge the answers. | Search by `user_id` on holds partitioned by event. |
| Rebalancing | Moving data when machines are added or removed. | Moving 16 of 64 partitions to a new shard. |
| Consistent hashing | Placing keys and machines on a ring so adding a machine moves only nearby keys. | Common in caches and DynamoDB-style stores. |
| Partition pruning | The database skips partitions that can't match the query. | `WHERE event_id = 42` reads one partition. |
| Waiting room | A queue that lets users in a few at a time. | 200 users admitted per second. |

### Picture it

```
HASH PARTITIONING by event_id                    HOT SPOT
event 1  ─┐                                      event 1 (superstar) ████████████████
event 2  ─┼─ hash ─► p0  p1  p2  p3              event 2             ██
event 3  ─┘          ▲ even spread               event 3             █
                                                  → one partition melts, others idle

WAITING ROOM
users ──► [ queue: 1 2 3 4 5 … 500,000 ] ──admit 200/s──► seat holds ──► database
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### POC 6a — Native partitioning in PostgreSQL

```sql
-- Range partitioning: an append-only activity log, one partition per month
CREATE TABLE ticket_activity (
  id         bigserial,
  event_id   bigint      NOT NULL,
  kind       text        NOT NULL,
  payload    jsonb       NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)          -- the partition key must be part of every unique key
) PARTITION BY RANGE (created_at);

CREATE TABLE ticket_activity_2026_10 PARTITION OF ticket_activity
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE ticket_activity_2026_11 PARTITION OF ticket_activity
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');

-- Hash partitioning: seat holds spread by event
CREATE TABLE seat_holds (
  event_id   bigint      NOT NULL,
  seat_id    bigint      NOT NULL,
  user_id    bigint      NOT NULL,
  expires_at timestamptz NOT NULL,
  PRIMARY KEY (event_id, seat_id)
) PARTITION BY HASH (event_id);

CREATE TABLE seat_holds_p0 PARTITION OF seat_holds FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE seat_holds_p1 PARTITION OF seat_holds FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE seat_holds_p2 PARTITION OF seat_holds FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE seat_holds_p3 PARTITION OF seat_holds FOR VALUES WITH (MODULUS 4, REMAINDER 3);
CREATE INDEX ON seat_holds (user_id);   -- a LOCAL index: one per partition
```

Things to observe:

```sql
-- Partition pruning: only one partition is scanned
EXPLAIN SELECT * FROM seat_holds WHERE event_id = 42;

-- Secondary attribute: every partition is scanned (scatter/gather on local indexes)
EXPLAIN SELECT * FROM seat_holds WHERE user_id = 7;

-- Retention in milliseconds instead of a giant DELETE
ALTER TABLE ticket_activity DETACH PARTITION ticket_activity_2026_10 CONCURRENTLY;
DROP TABLE ticket_activity_2026_10;
```

Create future partitions ahead of time (a scheduled job or the `pg_partman` extension); an insert with no matching partition fails.

#### POC 6b — Application-level sharding and rebalancing math

Run three Postgres containers as shards and route by event. First, convince yourself why `% N` is a trap:

```ts
// apps/m06-partitioning/src/rebalance-math.ts
import { createHash } from 'node:crypto';
const h = (key: string) => createHash('md5').update(key).digest().readUInt32BE(0);
const keys = Array.from({ length: 100_000 }, (_, i) => `event:${i}`);

// Strategy 1: hash mod N, growing from 3 to 4 shards
const movedModN = keys.filter((k) => h(k) % 3 !== h(k) % 4).length;

// Strategy 2: 64 fixed logical partitions, assigned to shards by a map
const P = 64;
const before = Array.from({ length: P }, (_, p) => p % 3);
const after = [...before];
for (let p = 3; p < P; p += 4) after[p] = 3;      // the new shard takes 16 partitions
const movedFixed = keys.filter((k) => before[h(k) % P] !== after[h(k) % P]).length;

console.log({
  movedModN: (movedModN / keys.length).toFixed(2),   // ≈ 0.75
  movedFixed: (movedFixed / keys.length).toFixed(2), // ≈ 0.25, the minimum possible
});
```

```ts
// apps/m06-partitioning/src/shard-router.ts
@Injectable()
export class ShardRouter {
  // In production this map lives in a config store (a table, etcd) and is cached with a version.
  private partitionToShard: number[] = loadPartitionMap();
  constructor(@Inject(SHARD_POOLS) private readonly shards: Pool[]) {}

  poolForEvent(eventId: string): Pool {
    const partition = h(`event:${eventId}`) % 64;
    return this.shards[this.partitionToShard[partition]];
  }
}
```

Exercise: write the rebalancing procedure for moving one partition from shard 0 to shard 3 while traffic continues (copy, catch up, briefly block writes for that partition, flip the map, unblock). Every step is a place where data can be lost; write down how you'd detect it.

#### POC 6c — The blockbuster on-sale: hot keys and a waiting room

When one event gets 90% of the traffic, partitioning by `event_id` puts it all on one partition. Two real-world mitigations:

**1. Shape the load with a virtual waiting room** (Redis, `ioredis`):

```ts
// apps/m06-partitioning/src/waiting-room.ts
@Injectable()
export class WaitingRoom {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  /** Give each user a stable place in line. */
  async join(eventId: string, userId: string): Promise<number> {
    const k = `wr:${eventId}`;
    const existing = await this.redis.hget(`${k}:pos`, userId);
    if (existing) return Number(existing);
    const pos = await this.redis.incr(`${k}:tail`);
    await this.redis.hsetnx(`${k}:pos`, userId, String(pos)); // first position wins on a double click
    return Number(await this.redis.hget(`${k}:pos`, userId));
  }

  async isAdmitted(eventId: string, userId: string): Promise<boolean> {
    const k = `wr:${eventId}`;
    const [pos, head] = await Promise.all([this.redis.hget(`${k}:pos`, userId), this.redis.get(`${k}:head`)]);
    return pos !== null && Number(pos) <= Number(head ?? 0);
  }

  /** Run every second by exactly ONE instance (see Module 9 for leader election). */
  async admit(eventId: string, perTick = 200) {
    await this.redis.incrby(`wr:${eventId}:head`, perTick);
  }
}
```

The hold endpoint now checks `isAdmitted` first and returns `429` with the user's position otherwise. Notice the comment on `admit`: if three app replicas all run the admitter, you admit three times as many users. That's a distributed-systems bug hiding in a one-line function.

**2. Split a hot counter** (and understand the price):

```sql
CREATE TABLE event_sales_counter (
  event_id bigint NOT NULL,
  slot     int    NOT NULL,             -- 0..15
  sold     bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (event_id, slot)
);
-- write: each sale increments a random slot, so writers rarely wait on the same row
UPDATE event_sales_counter SET sold = sold + 1 WHERE event_id = $1 AND slot = $2;
-- read: sum all slots
SELECT sum(sold) AS sold FROM event_sales_counter WHERE event_id = $1;
```

**Break it**

| # | Experiment | What to look for |
|---|---|---|
| E1 | 500 concurrent increments on a single-row counter vs the 16-slot counter. | Throughput and lock waits (`log_lock_waits` output). |
| E2 | Use the 16-slot counter to enforce "sold < capacity". | You can't do it safely without reading all slots under a lock. Splitting a hot key trades away easy invariants. Keep this for Module 7. |
| E3 | k6: 90% of traffic to event 1, 10% spread over 99 others, with and without the waiting room. | p99 for the *other* events. Isolation of the blast radius is the real win. |
| E4 | Run three app instances, each running the admitter. | Admission rate triples. Write the bug report. |
| E5 | `EXPLAIN ANALYZE` the `user_id` query on `seat_holds` with 4 vs 32 partitions. | Scatter/gather cost grows with partition count. |

### Production checklist


- [ ] The partition key is chosen from the dominant access pattern, and written in an ADR.
- [ ] Hot keys are identified from metrics (top-N keys by QPS), not guesses.
- [ ] Rebalancing moves whole logical partitions; the procedure is scripted and rehearsed.
- [ ] Future time partitions are created automatically, with an alert if the next one is missing.
- [ ] Queries without the partition key are known, measured and rare.
- [ ] Before sharding Postgres yourself, evaluate partitioning, read replicas and Citus.

### Mistakes people make

- Sharding too early. A well-indexed single PostgreSQL with replicas handles more than most products ever need.
- Choosing a partition key that most queries don't include, so everything becomes scatter/gather.
- Using a timestamp as a range key for heavy writes, so the newest partition takes all the load.
- Using `hash % N` and discovering that adding one machine moves most of the data.
- Ignoring hot keys until launch day.
- Running a "once per tick" job on every server (the triple-admitter bug in this module).

### Interview corner

**Q: What's the difference between partitioning and replication?**
Say this: "Replication copies the same data to several machines for availability and read scaling. Partitioning splits different data across machines so that each holds only part of it, which scales storage and writes. Real systems usually do both: each partition is replicated."

**Q: How do you choose a shard key?**
Say this: "I pick the field that most queries filter by, that spreads data and load evenly, and that keeps data that's used together in one shard. For a ticketing system, `event_id` works for seats and holds because almost every query is about one event. Then I check for hot keys and plan what happens for queries that don't include the key."

**Q: Range vs hash partitioning?**
Say this: "Range keeps nearby keys together, so range scans are cheap, but sequential keys like timestamps create hot spots. Hash spreads load evenly but range queries must hit every partition. A common compromise is a compound key: hash on the first part to spread load, and sort by the second part within the partition, like hash by user and sort by time."

**Q: How do you handle a hot key?**
Say this: "First detect it from per-key metrics. Then either spread it, for example split a counter into N sub-counters and sum them on read, or cache the hot reads, or control the arrival rate with a queue or waiting room. Spreading a key makes invariants harder, like 'never sell more than capacity', so I'd say that trade-off out loud."

**Q: What is consistent hashing and why use it?**
Say this: "Keys and servers are placed on a circle using a hash. Each key belongs to the next server clockwise. When a server joins or leaves, only the keys between it and its neighbour move, instead of almost all keys as with `hash % N`. Virtual nodes, where each server appears many times on the ring, smooth out the load. A simpler alternative many databases use is a fixed number of partitions mapped to servers."

**Q: How do you handle queries across shards?**
Say this: "Avoid them on hot paths by choosing the key well. When needed, scatter/gather: send the query to every shard and merge, which costs latency and grows with the number of shards. For frequent cross-shard lookups, maintain a separate index partitioned by the other field, updated asynchronously from a change stream."

**Q: How would you handle a sudden traffic spike for one item, like a concert on-sale?**
Say this: "A virtual waiting room in front of the purchase flow: users get a position in a queue and are admitted at a rate the inventory system can handle. Seat-map reads are served from cache. Only admitted users reach the database, and the seat claim itself is an atomic database operation."

**What impresses interviewers:** saying "it depends on access patterns", spotting hot keys, explaining why `% N` rebalances badly.
**Red flag:** "We'll shard the database" at modest scale, with no partition key reasoning.

### Cheat card

- Partition = split data; replicate = copy data. Usually both.
- Shard key: in most queries, spreads evenly, keeps related data together.
- Range: good for scans, risk of hot newest partition. Hash: even, bad for ranges.
- Hot keys: detect, then split, cache or queue. Splitting costs easy invariants.
- Rebalance by moving whole partitions or consistent hashing; never `% N`.
- Flash sale: waiting room + cached reads + atomic claim.

### AI-era angle

Multi-tenant AI products partition naturally by customer: each customer's documents, embeddings and chat history. This gives isolation and easy deletion, and also hot tenants (one huge customer). Searching only the current customer's partition is faster and is a security boundary. Per-customer AI token limits are the AI version of the waiting room.

### Share it: blog post and training session

#### Blog post
**Title:** "Surviving the blockbuster on-sale: hot keys, waiting rooms and partitioning in Postgres"
1. What a hot key looks like in metrics. 2. Range vs hash partitioning with EXPLAIN output. 3. Why `% N` moves 75% of your data. 4. The waiting room. 5. Splitting counters and the invariant you lose. 6. Local vs global indexes.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–10 | Story: a real on-sale crash (pick a public incident). |
| 10–30 | Concepts: range vs hash, skew, secondary indexes, rebalancing, routing. |
| 30–50 | Live: partition pruning and scatter/gather in EXPLAIN. |
| 50–75 | Exercise: choose partition keys for orders, holds, activity and search. Defend them. |
| 75–90 | Live: the waiting room under k6, and the triple-admitter bug. |

---

## Module 7 · Transactions

**Read:** 1st edition Chapter 7 (PDF pp. 235–286); focus on "The meaning of ACID" (p. 237), "Read committed" (p. 247), "Snapshot isolation and repeatable read" (p. 250), "Preventing lost updates" (p. 255), "Preventing write skew and phantoms" (p. 259). 2nd edition: Chapter 8.
**What must be true at the end:** *"A seat is sold at most once, and general-admission sales never go over capacity, no matter how many people click at once."*

This is the most important module for TicketRush, for interviews, and for almost every business system. Take your time.

### In one line

A transaction makes several changes happen all together or not at all, and isolation decides what happens when many people change the same data at the same moment.

### Think of it like this

**All or nothing.** A bank transfer takes money out of your account and puts it into your friend's. If the power fails halfway, you'd never accept "money left you but never arrived". A transaction guarantees both steps happen, or neither does, so it's always safe to try again.

**Two counters, one seat.** A cinema has two ticket counters. Both cashiers look at their screen, see seat A-12 is free, and both sell it. Each cashier did nothing wrong on their own; the problem is that "check if free" and "mark as sold" were two separate steps, and someone else acted in between. This is a **race condition**.

**Two managers, one rule.** A team rule says at least one manager must be in the office. Two managers each check the calendar, see the other is in, and both book leave for the same day. Each one changed only *their own* row, so no single change looked wrong, but together they broke the rule. This sneaky case is called **write skew**.

### The idea, step by step

1. **ACID** describes what transactions promise:
   - **Atomicity**: all changes happen or none do. Really it means "safe to abort and retry".
   - **Consistency**: your business rules stay true (the database helps, but the rules are yours).
   - **Isolation**: transactions running at the same time don't step on each other (how much depends on the isolation level).
   - **Durability**: once confirmed, data survives crashes.
2. Full isolation is slow, so databases default to weaker levels that allow some anomalies:
   - **Dirty read**: seeing another transaction's changes before it commits. Prevented by almost all databases.
   - **Non-repeatable read**: reading the same row twice in one transaction and getting different values.
   - **Lost update**: two people read a value, both change it, and one change overwrites the other.
   - **Write skew / phantom**: both check a condition, both write different rows, and together they break the rule.
3. PostgreSQL's levels:
   - **READ COMMITTED** (default): you never see uncommitted data, but "check then act" races still happen.
   - **REPEATABLE READ**: your whole transaction sees one frozen snapshot of the data ("snapshot isolation"). Great for reports. Still allows write skew.
   - **SERIALIZABLE**: results are as if transactions ran one at a time. PostgreSQL does this optimistically and cancels one transaction when there's a conflict, so your code must retry.
4. The fixes, from simplest to strongest:
   - **Atomic update**: put the check inside the update: `UPDATE ... SET status='held' WHERE id=$1 AND status='available'`. If zero rows changed, someone else won.
   - **Row lock**: `SELECT ... FOR UPDATE` locks the row until you finish, so others wait.
   - **Constraint**: let the database reject conflicts (unique or exclusion constraints).
   - **SERIALIZABLE** isolation with retries.
   - **Optimistic concurrency**: add a version number; update only if the version hasn't changed.
5. Keep transactions short, and never call slow external services (like payment providers) while holding a lock.

### Words you'll meet

| Word | Plain meaning | Example in TicketRush |
|---|---|---|
| Transaction | A group of changes that succeed or fail together. | Create order + mark seat sold. |
| Commit / rollback | Make the changes permanent / undo them all. | Payment failed → rollback. |
| ACID | Atomicity, Consistency, Isolation, Durability. | See above. |
| Isolation level | How strictly concurrent transactions are kept apart. | READ COMMITTED, REPEATABLE READ, SERIALIZABLE. |
| Race condition | A bug from two operations interleaving badly. | Two users hold the same seat. |
| Check-then-act | Reading a condition, then writing based on it, in separate steps. | The naive hold code. |
| Lost update | One write silently overwrites another. | Two organisers edit the event title. |
| Write skew | Two transactions check the same rule and write different rows, together breaking it. | 101 tickets sold for capacity 100. |
| Phantom | A row that appears matching your search because someone else inserted it. | The 101st ticket. |
| MVCC / snapshot | Keeping several versions of rows so each transaction sees a consistent picture. | How REPEATABLE READ works. |
| Atomic update / compare-and-set | Check and change in one statement. | `... WHERE status = 'available'`. |
| Pessimistic locking | Lock first, then work (`SELECT ... FOR UPDATE`). | Others wait for the seat row. |
| Optimistic locking | Work first, then check nothing changed (version column). | `WHERE version = 3`. |
| `SKIP LOCKED` | Skip rows others are locking instead of waiting. | "Give me any 2 free seats". |
| Deadlock | Two transactions each wait for a lock the other holds. | Postgres cancels one with error `40P01`. |
| Serialization failure | Postgres cancels a transaction to keep SERIALIZABLE correct. | Error `40001`: retry it. |
| Exclusion constraint | A rule that no two rows may overlap (for example in time). | Two holds on one seat can't overlap. |
| ETag / If-Match | HTTP headers that carry a version so updates don't overwrite each other. | `If-Match: "3"`. |

### Picture it

```
THE RACE (check-then-act)                         THE FIX (atomic update)
User A: SELECT status → 'available'               User A: UPDATE ... WHERE status='available' → 1 row ✔
User B: SELECT status → 'available'               User B: UPDATE ... WHERE status='available' → 0 rows ✘ (409)
User A: UPDATE status = 'held'   ✔
User B: UPDATE status = 'held'   ✔  ← double booked   The database checks and changes in one step.
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### PostgreSQL isolation cheat sheet

| Level | Dirty reads | Non-repeatable reads | Lost update on the same row | Write skew / phantoms |
|---|---|---|---|---|
| READ COMMITTED (default) | prevented | possible | **possible** unless you use atomic updates or `FOR UPDATE` | **possible** |
| REPEATABLE READ (snapshot isolation) | prevented | prevented | detected: one transaction fails with `40001` | **possible** |
| SERIALIZABLE (SSI) | prevented | prevented | detected (`40001`) | detected (`40001`) |

#### POC 7 — The double-booking lab

**Setup**

```sql
-- migrations/0007_transactions.sql
ALTER TABLE seats ADD COLUMN held_by bigint, ADD COLUMN held_until timestamptz;

CREATE EXTENSION IF NOT EXISTS btree_gist;   -- lets GiST indexes compare plain columns with "="
CREATE TABLE seat_reservations (
  id          bigserial PRIMARY KEY,
  seat_id     bigint    NOT NULL REFERENCES seats(id),
  user_id     bigint    NOT NULL,
  hold_period tstzrange NOT NULL,
  -- no two reservations for the same seat may overlap in time
  EXCLUDE USING gist (seat_id WITH =, hold_period WITH &&)
);

CREATE TABLE ticket_types (
  id       bigserial PRIMARY KEY,
  event_id bigint NOT NULL REFERENCES events(id),
  name     text   NOT NULL,
  capacity int    NOT NULL,
  sold     int    NOT NULL DEFAULT 0 CHECK (sold <= capacity)   -- last line of defense
);

CREATE TABLE ga_tickets (
  id             bigserial PRIMARY KEY,
  ticket_type_id bigint NOT NULL REFERENCES ticket_types(id),
  user_id        bigint NOT NULL
);
```

**Approach 0 — Naive (the bug most code has).** Check, then act:

```ts
async holdNaive(seatId: string, userId: string) {
  const { rows } = await this.pool.query('SELECT status FROM seats WHERE id = $1', [seatId]);
  if (rows[0]?.status !== 'available') throw new ConflictException('Seat not available');
  await sleep(20); // pricing/validation calls widen the race window; real code has these too
  await this.pool.query(
    `INSERT INTO holds (seat_id, user_id, expires_at) VALUES ($1, $2, now() + interval '10 minutes')`,
    [seatId, userId]);
  await this.pool.query(`UPDATE seats SET status = 'held' WHERE id = $1`, [seatId]);
}
```

The test that proves it's broken:

```ts
it('lets only one user hold a seat', async () => {
  const { count } = await fireConcurrently(app, 50, (i, agent) =>
    agent.post('/holds').send({ seatId: '1', userId: String(i + 1) }));
  expect(count(201)).toBe(1);
  expect(count(409)).toBe(49);
});
```

Now wrap the naive code in `withTransaction` (READ COMMITTED) and run the test again. It still fails. A transaction alone does not prevent this; the isolation level and the shape of the query do.

> **What you should see.** In a reference run against PostgreSQL 16 (50 buyers, one seat, a pool of 20 connections), the naive code let all 50 buyers hold the same seat, and the READ COMMITTED transaction version let 20 of them (one per connection). Approaches 1–4 below each produced exactly one hold. Your numbers will differ; the pattern won't.

**Approach 1 — Atomic compare-and-set.** One statement, the condition and the write together. This also expires stale holds lazily:

```ts
async holdAtomic(seatId: string, userId: string) {
  const { rowCount } = await this.pool.query(
    `UPDATE seats
        SET status = 'held', held_by = $2, held_until = now() + interval '10 minutes'
      WHERE id = $1
        AND (status = 'available' OR (status = 'held' AND held_until < now()))`,
    [seatId, userId]);
  if (rowCount !== 1) throw new ConflictException('Seat not available');
}
```

Under READ COMMITTED, if two of these run at once, the second waits for the first's row lock and then **re-checks the WHERE clause** against the new row version, so it matches zero rows.

**Approach 2 — Pessimistic lock with `FOR UPDATE`.** Use when you must read, decide in code, then write:

```ts
async holdLocked(seatId: string, userId: string) {
  await withTransaction(this.pool, async (c) => {
    const { rows } = await c.query('SELECT status FROM seats WHERE id = $1 FOR UPDATE', [seatId]);
    if (rows[0]?.status !== 'available') throw new ConflictException('Seat not available');
    await c.query(
      `UPDATE seats SET status = 'held', held_by = $2, held_until = now() + interval '10 minutes'
        WHERE id = $1`, [seatId, userId]);
  });
}
```

And the real-world favorite for "give me the best 2 available seats in section A" during an on-sale, where hundreds of buyers compete:

```sql
SELECT id FROM seats
WHERE event_id = $1 AND section = $2 AND status = 'available'
ORDER BY row_label, number
LIMIT 2
FOR UPDATE SKIP LOCKED;   -- skip seats other buyers are locking right now instead of queueing
```

**Approach 3 — Let a constraint enforce it.** The exclusion constraint makes overlapping reservations impossible, regardless of application code:

```ts
async holdByConstraint(seatId: string, userId: string) {
  try {
    const { rows } = await this.pool.query(
      `INSERT INTO seat_reservations (seat_id, user_id, hold_period)
       VALUES ($1, $2, tstzrange(now(), now() + interval '10 minutes'))
       RETURNING id`, [seatId, userId]);
    return rows[0];
  } catch (err: any) {
    if (err.code === PG.EXCLUSION_VIOLATION) throw new ConflictException('Seat not available');
    throw err;
  }
}
```

Expired holds stop overlapping automatically because their ranges are in the past. To purchase, make the reservation open-ended so the seat is blocked forever, and only if it hasn't expired:

```sql
UPDATE seat_reservations
   SET hold_period = tstzrange(lower(hold_period), NULL)   -- unbounded: sold
 WHERE id = $1 AND user_id = $2 AND upper(hold_period) > now()
RETURNING seat_id;
```

**Approach 4 — SERIALIZABLE with retries.** Keep the naive logic, but run it at the strongest level and let `withTransaction` retry:

```ts
await withTransaction(this.pool, (c) => this.naiveLogic(c, seatId, userId), { isolation: 'SERIALIZABLE' });
```

The losing transaction fails with `40001`, the helper retries it, and the retry sees `held` and returns 409. Count the retries in a metric; under heavy contention they cost throughput.

**Approach 5 — Optimistic concurrency for edits (lost updates).** Two organizers edit the same event page. Without protection, the last save silently overwrites the first. Use the `version` column with HTTP `ETag` / `If-Match`:

```ts
@Patch('events/:id')
async update(
  @Param('id') id: string,
  @Headers('if-match') ifMatch: string | undefined,
  @Body() dto: UpdateEventDto,
  @Res({ passthrough: true }) res: Response,
) {
  if (!ifMatch) throw new HttpException('If-Match header required', 428);
  const expected = Number(ifMatch.replace(/"/g, ''));
  const { rows } = await this.pool.query(
    `UPDATE events SET title = $1, version = version + 1
      WHERE id = $2 AND version = $3
      RETURNING version`, [dto.title, id, expected]);
  if (rows.length === 0) throw new PreconditionFailedException('Event changed since you loaded it');
  res.setHeader('ETag', `"${rows[0].version}"`);
  return { ok: true };
}
```

#### The write-skew lab: overselling general admission

Capacity 100, 300 concurrent buyers. Version A has a write-skew bug even at REPEATABLE READ:

```ts
// Version A — check by counting, then insert a NEW row. Each transaction writes a different row,
// so snapshot isolation sees no conflict. Oversells at READ COMMITTED and REPEATABLE READ.
await withTransaction(this.pool, async (c) => {
  const { rows: [t] } = await c.query('SELECT capacity FROM ticket_types WHERE id = $1', [typeId]);
  const { rows: [n] } = await c.query(
    'SELECT count(*)::int AS sold FROM ga_tickets WHERE ticket_type_id = $1', [typeId]);
  if (n.sold >= t.capacity) throw new ConflictException('Sold out');
  await c.query('INSERT INTO ga_tickets (ticket_type_id, user_id) VALUES ($1, $2)', [typeId, userId]);
}, { isolation: 'REPEATABLE READ' });
```

Run it at REPEATABLE READ (oversells), then at SERIALIZABLE (correct, with retries). Then write Version B, which **materializes the conflict**: it turns the invisible clash into one real row (the ticket type's `sold` counter) that every buyer must update, so the database can see and stop it:

```ts
// Version B — correct at READ COMMITTED: all buyers contend on the same counter row
await withTransaction(this.pool, async (c) => {
  const { rowCount } = await c.query(
    `UPDATE ticket_types SET sold = sold + 1 WHERE id = $1 AND sold < capacity`, [typeId]);
  if (rowCount !== 1) throw new ConflictException('Sold out');
  await c.query('INSERT INTO ga_tickets (ticket_type_id, user_id) VALUES ($1, $2)', [typeId, userId]);
});
```

> **What you should see.** In the reference run (300 buyers, capacity 100): Version A sold 113 tickets at READ COMMITTED, 108 at REPEATABLE READ, and exactly 100 at SERIALIZABLE; Version B sold exactly 100 at READ COMMITTED. Snapshot isolation alone does not stop write skew.

Notice the circle back to Module 6: Version B creates a hot row. That's the trade-off between correctness and contention you'll explain in the blog post.

**Measure** — 50 concurrent buyers for one seat, then 500 buyers for 100 seats:

| Approach | Double-sold? | Throughput (holds/s) | p99 | Aborts/retries | Lines of code |
|---|---|---|---|---|---|
| 0 Naive | | | | | |
| 0 Naive in a READ COMMITTED transaction | | | | | |
| 1 Atomic UPDATE | | | | | |
| 2 FOR UPDATE | | | | | |
| 2b FOR UPDATE SKIP LOCKED (best available) | | | | | |
| 3 Exclusion constraint | | | | | |
| 4 SERIALIZABLE + retry | | | | | |
| GA Version A @ REPEATABLE READ | | | | | |
| GA Version A @ SERIALIZABLE | | | | | |
| GA Version B (materialized) | | | | | |

**Break it (more)**

| # | Experiment | What to look for |
|---|---|---|
| E1 | Two transactions lock seats 1 then 2, and 2 then 1. | Deadlock: Postgres aborts one with `40P01`. Fix by always locking in a consistent order (`ORDER BY id`). |
| E2 | Inside a transaction holding `FOR UPDATE`, call a mock payment API that takes 3 s. | Every other buyer of that seat waits 3 s. Never call external services while holding locks. |
| E3 | Start a transaction, run one query, then do nothing for 15 s. | `idle_in_transaction_session_timeout` kills it. Without that setting, it would hold locks and block vacuum indefinitely. |
| E4 | Run a long `REPEATABLE READ` report while writes continue. | The report sees a frozen, consistent snapshot. This is why snapshot isolation is great for backups and analytics. |

### Production checklist


- [ ] Every invariant is written down and enforced by the database (constraint, atomic update, lock, or serializable).
- [ ] No "check then act" across separate statements without a lock or a stronger isolation level.
- [ ] Code that uses SERIALIZABLE or REPEATABLE READ retries `40001` and `40P01`, and has no side effects inside the retried function.
- [ ] Locks are acquired in a consistent order; transactions are short; no network calls while holding locks.
- [ ] `statement_timeout`, `lock_timeout` and `idle_in_transaction_session_timeout` are set.
- [ ] Editable resources use optimistic concurrency (version / ETag).
- [ ] A concurrency test exists for every endpoint that changes shared state.

### Mistakes people make

- Writing "check then act" in two queries and thinking a transaction alone makes it safe. At READ COMMITTED it doesn't.
- Relying on application code (`if`) to enforce a rule the database could enforce with a constraint.
- Calling a payment provider or sending an email inside a transaction that holds locks.
- Using SERIALIZABLE without retry logic, then treating `40001` errors as bugs.
- Locking rows in different orders in different code paths, causing deadlocks.
- Testing only with one user at a time; these bugs never show up that way.

### Interview corner

**Q: Explain ACID.**
Say this: "Atomicity: all changes in a transaction happen or none do, so a failed transaction can be safely retried. Consistency: the application's rules stay true. Isolation: concurrent transactions don't interfere, to a degree set by the isolation level. Durability: committed data survives crashes, usually via a write-ahead log and replication."

**Q: How do you prevent double booking of a seat?**
Say this: "The bug is check-then-act, so I make the check and the claim one atomic step. Simplest: `UPDATE seats SET status='held', held_by=? WHERE id=? AND status='available'` and check that exactly one row changed. Alternatives: lock the row with `SELECT FOR UPDATE`, a unique or exclusion constraint so the database rejects a second hold, or SERIALIZABLE with retries. For time-limited holds I like an exclusion constraint on a time range, so expired holds stop blocking automatically. I'd prove it with a test that fires 50 concurrent requests and expects exactly one success."

**Q: Optimistic vs pessimistic locking: when do you use each?**
Say this: "Pessimistic locking takes the lock first, so others wait; it's good when conflicts are frequent and the critical section is short, like a hot seat. Optimistic locking lets everyone proceed and checks a version at write time, failing the loser; it's good when conflicts are rare and you don't want to hold locks, like editing a profile, and it maps nicely to HTTP ETags."

**Q: What are the isolation levels and which anomalies do they allow?**
Say this: "Read committed prevents dirty reads and dirty writes but allows non-repeatable reads, lost updates and write skew. Snapshot isolation, which PostgreSQL calls repeatable read, gives each transaction a consistent snapshot and catches concurrent updates to the same row, but still allows write skew. Serializable prevents all of them, at the cost of blocking or aborting transactions. PostgreSQL defaults to read committed; MySQL's InnoDB defaults to repeatable read."

**Q: Give an example of write skew and how to prevent it.**
Say this: "General admission with capacity 100: two transactions both count 99 sold tickets and each inserts a new ticket, giving 101. Neither updated the same row, so snapshot isolation doesn't see a conflict. Fixes: run it at SERIALIZABLE and retry, or turn the hidden conflict into a real one, for example a `sold` counter on the ticket type that every purchase updates with `WHERE sold < capacity`."

**Q: What is a deadlock and how do you avoid it?**
Say this: "Two transactions each hold a lock the other needs, so both wait forever. The database detects it and aborts one. I avoid it by always locking rows in the same order, for example by ID, keeping transactions short, and retrying the aborted one."

**Q: Why shouldn't you call an external API inside a database transaction?**
Say this: "The transaction holds locks and a connection the whole time. If the external call takes seconds, everyone else waiting on those rows waits too, and the connection pool can run out. Also, if the transaction rolls back, the external call can't be undone. I do the database work, commit, then call out, and use an outbox or saga to tie them together."

**Q: What's a lost update?**
Say this: "Two clients read the same value, both modify it in application code, and both write it back; the second write erases the first. Fixes: an atomic update like `SET count = count + 1`, `SELECT FOR UPDATE`, or optimistic concurrency with a version column."

**What impresses interviewers:** leading with "the crux is check-then-act", giving several fixes with trade-offs, mentioning write skew, and testing with concurrency.
**Red flag:** "I'll check if the seat is free, then book it" with no word about concurrency, or "use a transaction" as the whole answer.

### Cheat card

- ACID: all-or-nothing, rules hold, isolation level decides interference, survives crashes.
- Postgres default = READ COMMITTED: check-then-act still races.
- Fix order: atomic `UPDATE ... WHERE` → `FOR UPDATE` → constraint → SERIALIZABLE + retry.
- Write skew: different rows, same rule. Fix with SERIALIZABLE or a shared counter row.
- Optimistic (version/ETag) for rare conflicts; pessimistic (locks) for hot, short ones.
- No external calls while holding locks; always retry `40001`/`40P01`.

### AI-era angle

Check-then-act races are among the most common bugs in quickly written code, including code produced by AI assistants, because the naive version reads naturally and passes every single-user test. Make the concurrency test part of "done", and review every data-changing function with one question: "what if two of these run at the same time?" AI agents that take actions are concurrent users too.

### Share it: blog post and training session

#### Blog post
**Title:** "Six ways to stop double-booking in PostgreSQL, measured under load"
1. The naive code and the failing test. 2. Why wrapping it in a transaction doesn't help. 3. Atomic updates, `FOR UPDATE`, `SKIP LOCKED`. 4. Exclusion constraints for time-based holds. 5. Write skew and the oversold concert. 6. SERIALIZABLE and the cost of retries. 7. The results table and our choice.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–10 | Live: run the 50-buyer test against the naive code. Everyone watches it fail. |
| 10–30 | Concepts: ACID honestly, the anomalies, the Postgres isolation table. |
| 30–55 | Live coding: approaches 1–4, each with the test going green. |
| 55–75 | Exercise: find one check-then-act race in our real codebase and write the test that proves it. |
| 75–90 | Write skew: the GA lab, and why the fix creates a hot row. |

---

## Module 8 · The trouble with distributed systems

**Read:** 1st edition Chapter 8 (PDF pp. 287–332); focus on "Timeouts and unbounded delays" (p. 295), "Monotonic vs. time-of-day clocks" (p. 301), "Process pauses" (p. 309), "The truth is defined by the majority" (p. 314). 2nd edition: Chapter 9.
**What must be true at the end:** *"A slow or unreachable dependency breaks one feature, never the whole API, and a background job never runs twice at the same time, even if a server freezes."*

### In one line

When programs talk over a network, messages get lost or delayed, clocks disagree, and machines freeze without knowing it, so you must design for uncertainty.

### Think of it like this

**The unanswered letter.** You post a letter asking a shop to deliver a sofa, and no reply comes. Did the letter get lost? Is the shop closed? Did they deliver and the receipt got lost? Are they just slow? You can't tell. All you can do is wait a while (a **timeout**) and decide what to do. If you send a second letter, they might deliver two sofas, unless your letter says "order number 123, ignore duplicates".

**Clocks in two rooms.** Two wall clocks in different rooms never show exactly the same time, and sometimes someone resets one. If you decide "who spoke last" by looking at whichever clock was nearest, you'll get it wrong.

**The sleeping key-holder.** Only one person may use the meeting room, so whoever has the key uses it, and the key automatically "expires" after an hour. A person takes the key and falls asleep for two hours. The building gives a new key to someone else. The sleeper wakes up, still holding the old key, and walks in. The fix: number every key, and the room's door only accepts the highest number it has seen. That number is a **fencing token**.

### The idea, step by step

1. In a distributed system, parts fail **partially**: one call works, the next hangs, a third fails. And failures are often silent.
2. When a request gets no answer, you **cannot know** what happened. The only tool is a **timeout**. Too short: you give up on healthy but slow servers, and retries add load. Too long: users wait.
3. Retrying a failing service immediately, from every client at once, makes things worse (a **retry storm**). Use **exponential backoff with jitter**, a cap on retries, and a **circuit breaker**: after many failures, stop calling for a while and use a fallback.
4. **Wall-clock time** (`Date.now()`) can jump forwards or backwards when the computer syncs its clock. Never use it to measure how long something took (use a **monotonic clock**, `performance.now()`), and never use clocks from different machines to decide which write is newest ("last write wins" can silently drop the later write).
5. A program can **pause** for seconds without noticing: garbage collection, the virtual machine being paused, the laptop lid closing. If it held a lock or lease, it may wake up and act as if it still does. **Fencing tokens** make the storage reject such "zombie" writes.
6. Because no single node can trust its own view, decisions like "is the leader dead?" are made by a **majority** of nodes (a quorum).

### Words you'll meet

| Word | Plain meaning | Example |
|---|---|---|
| Partial failure | Some parts work while others fail. | Database fine, pricing service down. |
| Timeout | Maximum time to wait for a reply. | 300 ms for the pricing service. |
| Network partition | Machines that can't reach each other, even though each is running. | App can't reach Redis. |
| Retry storm | Retries multiplying load on a struggling service. | 1,000 clients each retry 3 times instantly. |
| Exponential backoff + jitter | Waiting longer after each retry, with randomness. | ~50, ~100, ~200 ms. |
| Circuit breaker | Stops calls to a failing service for a while, then tests it again. | "Open" after 50% failures, retry after 5 s. |
| Fallback / graceful degradation | A simpler answer when a dependency fails. | "Price shown at checkout". |
| Fail open / fail closed | On failure, allow everything vs block everything. | Waiting room down: let all in, or none? |
| Black hole | A connection that stays open but never answers. | The worst failure for clients without timeouts. |
| Time-of-day clock | The calendar clock; can jump. | `Date.now()`. |
| Monotonic clock | Only moves forward; for measuring durations. | `performance.now()`. |
| Clock skew | The difference between two machines' clocks. | Server B is 2 seconds ahead. |
| Last write wins (LWW) | Keep the write with the newest timestamp. | Loses data when clocks disagree. |
| Process pause | A program freezing without knowing. | A long garbage-collection pause. |
| Lease | A lock that expires after a time. | Redis lock with a 10-second expiry. |
| Fencing token | An increasing number given with each lock; storage rejects older numbers. | Token 34 rejected after token 35 was used. |
| Advisory lock | A PostgreSQL lock on a number you choose, not on a row. | `pg_try_advisory_xact_lock(...)`. |
| Byzantine fault | A node lying or behaving maliciously. | Mostly relevant to blockchains, not normal backends. |
| Toxiproxy | A tool that sits between your app and a dependency and injects faults. | Adds 800 ms latency to Postgres. |

### Picture it

```
FENCING TOKENS
Worker A gets lock (token 33) ──► freezes 15 s ............................ wakes ──► write(token 33) ✘ rejected
                       lock expires after 10 s
Worker B gets lock (token 34) ─────────────────► write(token 34) ✔  storage now remembers "34"

CIRCUIT BREAKER
CLOSED (normal) ──too many failures──► OPEN (fail fast, use fallback) ──after 5 s──► HALF-OPEN (try one call)
     ▲                                                                                   │
     └──────────────────────────── call succeeded ◄─────────────────────────────────────┘
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### POC 8a — Chaos lab with Toxiproxy

`infra/compose.m08.yml` (overlay on the base file, same network):

```yaml
services:
  toxiproxy:
    image: ghcr.io/shopify/toxiproxy   # pin a version tag in your repo
    ports:
      - "8474:8474"     # control API
      - "15432:15432"   # proxied Postgres
      - "16379:16379"   # proxied Redis
      - "18080:18080"   # proxied mock pricing service
```

```bash
# Create proxies; point the app at localhost:15432 / 16379 / 18080 instead of the real ports
curl -s -X POST localhost:8474/proxies -d '{"name":"pg","listen":"0.0.0.0:15432","upstream":"postgres:5432"}'
curl -s -X POST localhost:8474/proxies -d '{"name":"redis","listen":"0.0.0.0:16379","upstream":"redis:6379"}'
curl -s -X POST localhost:8474/proxies -d '{"name":"pricing","listen":"0.0.0.0:18080","upstream":"pricing:8080"}'

# Slow network: +800 ms ± 400 ms on responses from Postgres
curl -s -X POST localhost:8474/proxies/pg/toxics \
  -d '{"name":"slow","type":"latency","stream":"downstream","attributes":{"latency":800,"jitter":400}}'

# Black hole: connections stay open but no data flows (the nastiest failure for clients)
curl -s -X POST localhost:8474/proxies/pricing/toxics \
  -d '{"name":"blackhole","type":"timeout","attributes":{"timeout":0}}'

# Hard partition: the dependency is unreachable
curl -s -X POST localhost:8474/proxies/pg -d '{"enabled":false}'

# Heal
curl -s -X DELETE localhost:8474/proxies/pg/toxics/slow
curl -s -X DELETE localhost:8474/proxies/pricing/toxics/blackhole
curl -s -X POST localhost:8474/proxies/pg -d '{"enabled":true}'
```

The mock pricing service can be any tiny HTTP server that returns a price for an event. Add it to the overlay as `pricing`.

**Circuit breaker** for the pricing dependency (`opossum`):

```ts
// apps/m08-faults/src/pricing.client.ts
import CircuitBreaker from 'opossum';

@Injectable()
export class PricingClient {
  private readonly breaker = new CircuitBreaker(
    (eventId: string) =>
      fetch(`${process.env.PRICING_URL}/price/${eventId}`, { signal: AbortSignal.timeout(300) })
        .then((r) => { if (!r.ok) throw new Error(`pricing ${r.status}`); return r.json(); }),
    {
      timeout: 400,                 // fail fast even if fetch misbehaves
      errorThresholdPercentage: 50, // open the circuit when half the recent calls fail
      resetTimeout: 5_000,          // after 5 s, let one trial call through (half-open)
      volumeThreshold: 10,          // don't judge on fewer than 10 calls
    },
  );

  constructor() {
    this.breaker.fallback(() => ({ price: null, degraded: true })); // show "price at checkout"
    this.breaker.on('open', () => console.warn('pricing circuit OPEN'));
    this.breaker.on('close', () => console.info('pricing circuit closed'));
  }

  quote(eventId: string) {
    return this.breaker.fire(eventId);
  }
}
```

**Break it**

| # | Experiment | What to look for |
|---|---|---|
| E1 | 800 ms latency on Postgres under k6 load. | Pool exhaustion: requests wait for connections, `connectionTimeoutMillis` fires, latency of *all* routes rises. Which timeout fired first? |
| E2 | Black-hole the pricing service **without** a client timeout. | Requests hang until the server's `requestTimeout`; the event loop is fine but sockets and memory pile up. |
| E3 | Same, with timeout but naive immediate retries (3×, no backoff). | Load on the struggling dependency multiplies: a retry storm. |
| E4 | Same, with jittered backoff and the circuit breaker. | Fast fallbacks, stable p99, automatic recovery when healed. |
| E5 | Partition Redis while the waiting room is in use. | Decide and document: fail open (let everyone in) or fail closed (nobody in)? Both are business decisions. |

#### POC 8b — Clocks lie

```ts
// WRONG for durations: the wall clock can jump (NTP correction, manual change, VM resume)
const start = Date.now(); await work(); const elapsedWall = Date.now() - start; // can be negative

// RIGHT for durations: monotonic clock
const t0 = performance.now(); await work(); const elapsed = performance.now() - t0;
```

**The last-write-wins disaster.** Run two app instances, one with `CLOCK_SKEW_MS=2000`, both updating an event description with "newest timestamp wins":

```ts
const now = () => Date.now() + Number(process.env.CLOCK_SKEW_MS ?? 0); // simulated skew

await this.pool.query(
  `UPDATE events SET details = jsonb_set(details, '{description}', to_jsonb($1::text)),
                     details_updated_ms = $2
    WHERE id = $3 AND details_updated_ms < $2`,     // "only if my write is newer"
  [description, now(), eventId]);
```

(Add `details_updated_ms bigint NOT NULL DEFAULT 0` to `events` for this lab.) Write "A" on the skewed instance, then one second later write "B" on the normal one. B, the later write, is silently rejected because A's clock was ahead. Nobody gets an error. Fix: don't order writes by wall clocks from different machines; use a version counter or compare-and-set (Module 7), or let a single authority (the database) assign the order.

#### POC 8c — Locks, pauses and fencing tokens

A background job "release expired holds" runs on every app instance and must run on only one at a time. First, the common approach with a Redis lock, and the bug:

```ts
// apps/m08-faults/src/redis-lock.ts
export async function acquire(redis: Redis, name: string, ttlMs: number) {
  const token = await redis.incr(`fence:${name}`);                   // ever-increasing number
  const ok = await redis.set(`lock:${name}`, String(token), 'PX', ttlMs, 'NX');
  return ok === 'OK' ? { token } : null;
}
```

```sql
CREATE TABLE job_fence (job text PRIMARY KEY, last_token bigint NOT NULL);
INSERT INTO job_fence VALUES ('release-expired-holds', 0);
CREATE TABLE job_runs (job text, worker text, token bigint, ran_at timestamptz DEFAULT now());
```

```ts
// apps/m08-faults/src/reaper.ts
async function runReaper(worker: string, pauseMs = 0, fenced = true) {
  const lock = await acquire(redis, 'release-expired-holds', 10_000);
  if (!lock) return;
  if (pauseMs) await sleep(pauseMs);   // simulate a GC pause or frozen VM longer than the TTL

  await withTransaction(pool, async (c) => {
    if (fenced) {
      const f = await c.query(
        `UPDATE job_fence SET last_token = $2 WHERE job = $1 AND last_token <= $2`,
        ['release-expired-holds', lock.token]);
      if (f.rowCount === 0) throw new Error(`${worker}: fenced off, token ${lock.token} is stale`);
    }
    await c.query(
      `UPDATE seats SET status = 'available', held_by = NULL, held_until = NULL
        WHERE status = 'held' AND held_until < now()`);
    await c.query('INSERT INTO job_runs (job, worker, token) VALUES ($1, $2, $3)',
      ['release-expired-holds', worker, lock.token]);
  });
}
```

Experiment: start worker A with `pauseMs=15000`. After the 10 s TTL, start worker B normally. When A wakes up:

- with `fenced=false`, `job_runs` shows both A and B ran: the lock didn't protect you;
- with `fenced=true`, A's write is rejected because B's token is larger.

Then try the PostgreSQL-native alternative, where the lock and the data live in the same system:

```sql
-- inside the job's transaction: lock is released automatically at COMMIT/ROLLBACK
SELECT pg_try_advisory_xact_lock(hashtext('release-expired-holds')) AS got_lock;
```

If the process pauses mid-transaction, it keeps the lock (others wait), and `idle_in_transaction_session_timeout` eventually kills its session, which rolls back its work. Write in the README why this is safer than a lock in a separate system.

### Production checklist


- [ ] Every remote call: timeout, bounded retries with jitter, and only for idempotent operations.
- [ ] Circuit breakers and fallbacks on non-critical dependencies; documented fail-open vs fail-closed decisions.
- [ ] Durations measured with monotonic clocks; no cross-machine ordering by wall clock.
- [ ] Clock sync (NTP/chrony) monitored on hosts that care about time.
- [ ] Distributed locks are paired with fencing, or the lock lives in the same database as the data.
- [ ] Event-loop lag and GC pause metrics are graphed (from `collectDefaultMetrics`).
- [ ] A game day with Toxiproxy runs at least once a quarter.

### Mistakes people make

- No timeout on HTTP or database calls.
- Retrying instantly, without limits, on operations that aren't idempotent.
- Measuring durations with `Date.now()`.
- Resolving conflicts with timestamps from different machines.
- Trusting a Redis lock for correctness without fencing, or without thinking about what happens when it expires early.
- Treating "no response" as "it didn't happen".

### Interview corner

**Q: Why are distributed systems hard?**
Say this: "Three things you can't fully trust: the network, which can lose or delay messages with no way to tell which; clocks, which drift and jump; and processes, which can pause at any moment. Failures are partial, so some parts work while others don't, and nodes have to make decisions without knowing the true state of the others."

**Q: How do you choose a timeout?**
Say this: "From measurements: I look at the dependency's p99 or p99.9 latency and set the timeout a bit above it, so I rarely cut off healthy calls. I also give each user request an overall deadline and pass the remaining time down to inner calls, so retries can't push the total past what the user will wait."

**Q: What's exponential backoff with jitter, and why jitter?**
Say this: "After each failed attempt you wait longer, for example 100 ms, 200 ms, 400 ms, up to a cap, so a struggling service gets room to recover. Jitter adds randomness to each wait. Without it, thousands of clients that failed at the same moment retry at the same moment, causing waves of load."

**Q: Explain the circuit breaker pattern.**
Say this: "A wrapper around calls to a dependency. While things work, it's closed and calls pass through. If the failure rate crosses a threshold, it opens and immediately returns a fallback instead of calling, which protects both us and the dependency. After a cool-down, it goes half-open and lets a test call through; if that works, it closes again."

**Q: Can you use a Redis lock to make sure only one worker does something?**
Say this: "A Redis lock with an expiry is fine for efficiency, like avoiding duplicate work. For correctness it isn't enough on its own: if the holder pauses longer than the expiry, a second worker gets the lock and both act. The fix is a fencing token, an increasing number issued with each lock, which the storage checks and rejects if it's older than one it has seen. Or put the lock in the same database as the data, for example a Postgres advisory lock inside the transaction."

**Q: Why not use timestamps to decide which write is newest?**
Say this: "Clocks on different machines disagree, and can jump when synced. If machine A's clock is two seconds ahead, its older write looks newer and silently wins over a later write from machine B. Better options are version numbers assigned by one authority, compare-and-set updates, or data types that merge concurrent changes."

**Q: Is exactly-once delivery possible?**
Say this: "Not over an unreliable network: if a sender doesn't get an acknowledgement, it can't know whether the message arrived, so it must either risk losing it or risk sending it twice. What we can achieve is exactly-once *effect*: deliver at least once and make processing idempotent, for example by deduplicating on a message ID."

**What impresses interviewers:** "you can't distinguish slow from dead", jitter, fencing tokens, and the difference between exactly-once delivery and exactly-once effect.
**Red flag:** "The network is reliable inside our data centre" or "we'll use the server timestamp to order events from different services".

### Cheat card

- No reply ≠ didn't happen. Only timeouts, and they're guesses.
- Every call: timeout + capped backoff with jitter + circuit breaker + fallback.
- Durations: monotonic clock. Ordering across machines: never wall clocks.
- Locks expire; processes pause. Use fencing tokens, or lock inside the same database.
- Decisions by majority, not by one node's opinion.
- Exactly-once delivery: impossible. Exactly-once effect: at-least-once + idempotency.

### AI-era angle

AI model calls fail in all of these ways: slow streams, timeouts, rate limits, errors, and the worst case, a request that timed out on your side but completed (and was billed) on theirs. Give each AI tool call an ID so it can be retried safely, put a circuit breaker around each model provider with a fallback model or non-AI path, and never let an agent's lock on a resource outlive its lease without fencing.

### Share it: blog post and training session

#### Blog post
**Title:** "Your lock isn't a lock: process pauses, fencing tokens and other distributed-systems lies in Node.js"
1. Why "no response" tells you nothing. 2. Timeouts, retry storms and circuit breakers, with Toxiproxy graphs. 3. Wall clocks vs monotonic clocks. 4. The last-write-wins data loss. 5. The paused worker and the fencing fix. 6. Our chaos checklist.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–10 | Live: black-hole the pricing service; watch the API degrade. |
| 10–30 | Concepts: partial failure, timeouts, clocks, pauses, fencing, quorums. |
| 30–55 | Live: retry storm vs backoff + breaker; then the paused worker. |
| 55–80 | Team game: one person injects a secret Toxiproxy fault; others diagnose from dashboards only. |
| 80–90 | Decide fail-open vs fail-closed for our real dependencies. |

---

## Module 9 · Consistency and consensus

**Read:** 1st edition Chapter 9 (PDF pp. 333–396); focus on "What makes a system linearizable?" (p. 337), "Relying on linearizability" (p. 342), "Total order broadcast" (p. 360), "Atomic commit and two-phase commit" (p. 366), "Membership and coordination services" (p. 382). 2nd edition: Chapter 10.
**What must be true at the end:** *"Exactly one server runs leader-only work at a time, and an order is never saved without its 'order created' event eventually being sent."*

### In one line

Consistency is about whether everyone sees the same answer, and consensus is how several machines agree on one answer even when some of them fail.

### Think of it like this

**One scoreboard.** At a cricket ground, there's one big scoreboard. The moment it changes, everyone looking at it sees the new score; nobody sees the old score after someone else has seen the new one. That's **linearizability**: the system behaves as if there's one copy of the data. Now imagine fans checking scores on different apps that update at different speeds: one friend says "he's out!" while your app still shows him batting. That's **eventual consistency**: all copies agree *eventually*.

**A group chat picking a restaurant.** Five friends need to agree on one restaurant. One person acts as organiser (the **leader**), proposes options, and the choice is final once a **majority** (3 of 5) agree. If the organiser's phone dies, the others elect a new organiser. With only 2 of 5 reachable, no decision can be made, which is annoying but safe: two groups can never pick two different restaurants. That's how **consensus** algorithms like Raft work.

**A wedding.** The officiant asks each person "do you?", and only after both say yes does the officiant declare them married. If the officiant faints right after both said yes, everyone is stuck waiting: they've promised, but nobody has declared it. That's **two-phase commit (2PC)** and its main weakness.

**A letter in the same envelope.** Instead of saving an order and then separately trying to post a "thank you" letter (and maybe forgetting), you write the letter onto the same order form. A postman regularly collects every letter that hasn't been sent yet. That's the **transactional outbox**.

### The idea, step by step

1. **Linearizability** (strong consistency): once any reader sees a new value, nobody sees the old one again. You need it for "only one" decisions: leader election, locks, unique usernames, "is this seat taken?". A single PostgreSQL primary gives you this; async replicas don't.
2. It has a cost. The **CAP theorem** says: if the network splits, you must choose between staying consistent (refuse some requests) and staying available (answer, maybe with stale data). **PACELC** adds: even without a split, you trade latency against consistency. The book points out CAP is narrow; in practice, think about which operations truly need strong consistency.
3. **Causality** is weaker and cheaper: if B happened because of A, everyone sees A before B. **Lamport timestamps** order events consistently with cause and effect, but can't tell you "right now" whether someone else is claiming the same name.
4. **Consensus** means getting several nodes to agree on a value despite failures. **Raft** and **Paxos** do this with a leader, majority votes and "term" (epoch) numbers. You rarely write them; you use systems built on them: **etcd**, **ZooKeeper**, and the leader-election inside many databases.
5. **Two-phase commit** makes one transaction span several databases: "prepare" (everyone promises), then "commit". If the coordinator dies after prepare, participants hold locks until it returns. That's why most teams avoid 2PC across services.
6. Instead, commit to **one** database and publish events reliably with the **outbox**, and coordinate multi-step processes as a **saga**: a series of local steps, each with a "compensating" undo step if a later step fails.

### Words you'll meet

| Word | Plain meaning | Example |
|---|---|---|
| Linearizability / strong consistency | Behaves like a single copy; reads never go back in time. | A unique index on the primary. |
| Eventual consistency | Copies agree if you wait long enough. | Replicas, caches, search indexes. |
| CAP theorem | During a network split, choose consistency or availability. | A split region refuses writes (CP) or accepts them (AP). |
| PACELC | If Partition: Availability vs Consistency; Else: Latency vs Consistency. | Sync replication costs latency even with no failures. |
| Causality | Cause before effect, for everyone. | A reply is never seen before the question. |
| Lamport timestamp | A counter that orders events by cause and effect. | Bumped on every send and receive. |
| Total order broadcast | Every node receives the same messages in the same order. | A single Kafka partition behaves like this. |
| Consensus | Nodes agreeing on one value despite failures. | Electing one leader. |
| Raft / Paxos | Well-known consensus algorithms. | etcd uses Raft. |
| Quorum / majority | More than half of the nodes. | 2 of 3, 3 of 5. |
| Term / epoch | A number that increases with each new leader, so old leaders are recognised. | Term 7 beats term 6. |
| etcd / ZooKeeper | Small, strongly consistent stores used for coordination. | Leader election, config. |
| Two-phase commit (2PC) | Prepare everyone, then commit everyone. | `PREPARE TRANSACTION` in Postgres. |
| In-doubt transaction | Prepared but never committed or aborted, holding locks. | After the coordinator crashed. |
| Dual write | Writing to two systems separately and hoping both succeed. | DB insert + Kafka publish in app code. |
| Transactional outbox | Saving the event in the same DB transaction as the change, publishing it later. | `outbox` table + relay. |
| Saga | A multi-step process of local transactions with undo steps. | Order → payment → tickets; refund if tickets fail. |
| Choreography / orchestration | Saga steps react to each other's events / a central coordinator drives the steps. | Event-driven vs a "checkout orchestrator". |
| At-least-once | Every message arrives, maybe more than once. | The outbox relay after a crash. |

### Picture it

```
RAFT IN ONE PICTURE (3 nodes)                     TRANSACTIONAL OUTBOX
   ┌──────────┐ append entry  ┌──────────┐       ┌──────────── one DB transaction ────────────┐
   │ LEADER   │──────────────►│ follower │       │ INSERT INTO orders ...                      │
   │ term 7   │──────────────►│ follower │       │ INSERT INTO outbox ('OrderCreated', ...)    │
   └──────────┘               └──────────┘       └─────────────────────────────────────────────┘
   committed once a MAJORITY (2 of 3) stored it        relay ──reads unsent rows──► Kafka ──► email, search…
   leader dies → others vote → new leader, term 8      (may send twice → consumers deduplicate)
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### POC 9a — Where linearizability matters

1. **Uniqueness.** Ticket barcodes must be globally unique. Compare: (a) check on a replica, then insert on the primary; (b) `INSERT ... ON CONFLICT (barcode) DO NOTHING RETURNING id` on the primary. Fire 100 concurrent inserts of the same barcode at each. (a) produces duplicates or errors; (b) is correct, because the unique index on the primary is linearizable.
2. **Cross-channel timing.** The order service commits an order on the primary and immediately publishes `OrderCreated` to Redis or Redpanda. The email worker receives it and reads the order from a **replica**: "order not found". Two different channels (the message and the replication stream) raced. Fix it three ways and compare: read from the primary in the worker; include the needed data in the message (event-carried state); or include the LSN and wait until the replica has replayed it (your Module 5 router).

#### POC 9b — Raft for real: etcd and leader election

`infra/compose.m09.yml`:

```yaml
x-etcd: &etcd
  image: gcr.io/etcd-development/etcd:v3.6.14   # official registry; pin the latest patch release
  environment:
    ETCD_INITIAL_CLUSTER: etcd1=http://etcd1:2380,etcd2=http://etcd2:2380,etcd3=http://etcd3:2380
    ETCD_INITIAL_CLUSTER_STATE: new
    ETCD_INITIAL_CLUSTER_TOKEN: ticketrush
    ETCD_LISTEN_PEER_URLS: http://0.0.0.0:2380
    ETCD_LISTEN_CLIENT_URLS: http://0.0.0.0:2379

services:
  etcd1:
    <<: *etcd
    command: /usr/local/bin/etcd --name etcd1 --initial-advertise-peer-urls http://etcd1:2380 --advertise-client-urls http://etcd1:2379
    ports: ["2379:2379"]
  etcd2:
    <<: *etcd
    command: /usr/local/bin/etcd --name etcd2 --initial-advertise-peer-urls http://etcd2:2380 --advertise-client-urls http://etcd2:2379
    ports: ["22379:2379"]
  etcd3:
    <<: *etcd
    command: /usr/local/bin/etcd --name etcd3 --initial-advertise-peer-urls http://etcd3:2380 --advertise-client-urls http://etcd3:2379
    ports: ["32379:2379"]
```

Watch consensus with no code at all:

```bash
EP=http://etcd1:2379,http://etcd2:2379,http://etcd3:2379
docker compose -f infra/compose.m09.yml exec etcd1 /usr/local/bin/etcdctl --endpoints=$EP endpoint status -w table  # see IS LEADER

# two terminals campaign for the same election; only one becomes leader
docker compose -f infra/compose.m09.yml exec etcd2 /usr/local/bin/etcdctl elect admitter instance-a
docker compose -f infra/compose.m09.yml exec etcd3 /usr/local/bin/etcdctl elect admitter instance-b
# Ctrl+C the leader's terminal: the other one is elected

# kill the Raft leader node: a new leader appears; writes keep working with 2 of 3
docker compose -f infra/compose.m09.yml stop etcd1
# stop a second node: with 1 of 3 left there is no majority, so writes fail
docker compose -f infra/compose.m09.yml stop etcd2
```

Leader election inside NestJS with the `etcd3` package, guarding the waiting-room admitter from Module 6:

```ts
// apps/m09-consensus/src/leader.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Etcd3, Campaign } from 'etcd3';

@Injectable()
export class LeaderService implements OnModuleInit, OnModuleDestroy {
  private readonly client = new Etcd3({ hosts: (process.env.ETCD_HOSTS ?? 'http://localhost:2379').split(',') });
  private campaign?: Campaign;
  isLeader = false;

  onModuleInit() {
    this.run();
  }

  private run() {
    const election = this.client.election('ticketrush/admitter', 10); // lease TTL in seconds
    this.campaign = election.campaign(process.env.INSTANCE_ID ?? `pid-${process.pid}`);
    this.campaign.on('elected', () => {
      this.isLeader = true;
    });
    this.campaign.on('error', () => {
      this.isLeader = false;             // lease lost (partition, pause): stop leader work NOW
      setTimeout(() => this.run(), 2_000);
    });
  }

  async onModuleDestroy() {
    this.isLeader = false;
    await this.campaign?.resign().catch(() => undefined);
    this.client.close();
  }
}

// in the admitter: if (!this.leader.isLeader) return;
```

`isLeader` can be stale after a pause, exactly like the Redis lock in Module 8. Keep leader-only work idempotent or fenced. Watch the Raft visualization at *thesecretlivesofdata.com/raft* before the training session.

#### POC 9c — Two-phase commit, and why we use an outbox instead

Run two Postgres containers (`orders-db`, `payments-db`), both started with `-c max_prepared_transactions=10`.

```ts
// apps/m09-consensus/src/two-phase.ts — for learning only
async function payOrder2pc(orders: Pool, payments: Pool, orderId: string) {
  if (!/^\d+$/.test(orderId)) throw new Error('bad id'); // gid can't be a bind parameter
  const gid = `order-${orderId}`;
  const a = await orders.connect();
  const b = await payments.connect();
  try {
    await a.query('BEGIN');
    await b.query('BEGIN');
    await a.query(`UPDATE orders SET status = 'paid' WHERE id = $1`, [orderId]);
    await b.query('INSERT INTO ledger (order_id, amount_cents) VALUES ($1, 5000)', [orderId]);

    await a.query(`PREPARE TRANSACTION '${gid}-a'`);  // phase 1: "I promise I can commit"
    await b.query(`PREPARE TRANSACTION '${gid}-b'`);
    if (process.env.CRASH_AFTER_PREPARE) process.exit(1); // the coordinator dies here

    await a.query(`COMMIT PREPARED '${gid}-a'`);      // phase 2
    await b.query(`COMMIT PREPARED '${gid}-b'`);
  } finally {
    a.release();
    b.release();
  }
}
```

Run with `CRASH_AFTER_PREPARE=1`, then on each database:

```sql
SELECT gid, prepared FROM pg_prepared_xacts;            -- the in-doubt transactions
UPDATE orders SET status = 'cancelled' WHERE id = 42;   -- blocks: the prepared txn holds the row lock
COMMIT PREPARED 'order-42-a';                           -- a human must resolve it
```

That blocked `UPDATE` is the whole argument against 2PC across services. Now build the alternative.

**Transactional outbox:**

```sql
CREATE TABLE outbox (
  id           bigserial PRIMARY KEY,
  event_id     uuid        NOT NULL DEFAULT gen_random_uuid(),  -- consumers deduplicate on this
  topic        text        NOT NULL,
  aggregate_id text        NOT NULL,                           -- becomes the message key
  payload      jsonb       NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE INDEX outbox_unpublished ON outbox (id) WHERE published_at IS NULL;
```

```ts
// the business write and the event are ONE local transaction: both or neither
await withTransaction(this.pool, async (c) => {
  const { rows: [order] } = await c.query(
    `INSERT INTO orders (user_id, status, total_cents) VALUES ($1, 'pending', $2) RETURNING *`,
    [userId, total]);
  await c.query(
    `INSERT INTO outbox (topic, aggregate_id, payload) VALUES ('orders', $1, $2)`,
    [order.id, { type: 'OrderCreated', version: 1, data: order }]);
  return order;
});
```

```ts
// apps/m09-consensus/src/outbox.relay.ts — polls and publishes (Module 11 replaces polling with CDC)
async relayOnce(batch = 100): Promise<number> {
  return withTransaction(this.pool, async (c) => {
    const { rows } = await c.query(
      `SELECT id, event_id, topic, aggregate_id, payload FROM outbox
        WHERE published_at IS NULL
        ORDER BY id
        LIMIT $1
        FOR UPDATE SKIP LOCKED`, [batch]);
    if (rows.length === 0) return 0;

    const byTopic = new Map<string, { key: string; value: string }[]>();
    for (const r of rows) {
      const list = byTopic.get(r.topic) ?? [];
      list.push({ key: r.aggregate_id, value: JSON.stringify({ id: r.event_id, ...r.payload }) });
      byTopic.set(r.topic, list);
    }
    await this.producer.sendBatch({
      topicMessages: [...byTopic].map(([topic, messages]) => ({ topic, messages })),
    });
    await c.query('UPDATE outbox SET published_at = now() WHERE id = ANY($1::bigint[])',
      [rows.map((r) => r.id)]);
    return rows.length;
  });
}
```

This is **at-least-once**: if the process dies after publishing but before the commit, the same rows are published again. That's why every message carries `event_id` and every consumer deduplicates (Module 11). If you run several relays, per-aggregate ordering can break; run one relay, or partition relays by aggregate.

**Saga for checkout** (each step is a local transaction plus an outbox event; failures trigger compensations):

| Step | Action | Compensation if a later step fails |
|---|---|---|
| 1 | Create order `pending`, keep the seat reservation | Cancel order, release reservation |
| 2 | Charge payment (idempotent, Module 12) | Refund |
| 3 | Issue tickets, mark reservation sold | Void tickets |
| 4 | Send confirmation email | none needed (retry until done) |

#### POC 9d (short) — Lamport clocks

```ts
class LamportClock {
  private t = 0;
  constructor(readonly nodeId: string) {}
  tick() { return ++this.t; }                                       // local event or send
  receive(remote: number) { this.t = Math.max(this.t, remote) + 1; return this.t; }
}
// total order: compare (timestamp, nodeId); ties broken by node ID
```

Simulate three nodes exchanging messages and sort all events by `(t, nodeId)`: the order respects causality. Then try to use it to decide "is barcode X already taken?" at the moment of the request. You can't, without hearing from every node first. Write down why that leads to consensus.

### Production checklist


- [ ] Uniqueness and "only one" decisions are made by a linearizable authority (a unique index on the primary, etcd), never by reading a replica.
- [ ] No 2PC across services; multi-step processes are sagas with explicit compensations.
- [ ] Every event that must follow a DB write goes through an outbox (or CDC), never a "dual write".
- [ ] Consumers are idempotent because delivery is at-least-once.
- [ ] Leader-only work is idempotent or fenced; leadership loss stops work immediately.
- [ ] Coordination clusters run an odd number of nodes (3 or 5) across failure domains.

### Mistakes people make

- Writing to the database and then publishing to a queue in application code (a dual write). One of them will eventually fail.
- Using two-phase commit across microservices.
- Checking "is this name taken?" on a replica or cache, then inserting.
- Running a coordination cluster with an even number of nodes (4 tolerates no more failures than 3).
- Quoting CAP as "pick any two of three". The real choice only appears during a network split.

### Interview corner

**Q: Explain the CAP theorem.**
Say this: "When a network partition happens, a distributed system must choose between consistency, meaning every read sees the latest write, and availability, meaning every request gets a response. Partitions can't be ruled out, so the real question is what each operation should do during one. For a ticketing system, seat claims should stay consistent and refuse rather than oversell, while browsing can stay available with slightly stale data. PACELC adds that even without partitions, stronger consistency costs latency."

**Q: Strong vs eventual consistency: where do you need each?**
Say this: "Strong consistency where a wrong answer causes real damage and can't be fixed later: money, inventory, uniqueness, locks. Eventual consistency where slightly stale data is acceptable and speed matters: feeds, view counts, search results, seat-map browsing. I'd design the critical write path to be strongly consistent and let read-heavy paths be eventually consistent."

**Q: What is consensus and where is it used?**
Say this: "Getting several nodes to agree on a value, like who the leader is or the order of log entries, even if some nodes crash. Raft does it by electing a leader with a majority vote; the leader appends entries and they count as committed once a majority stores them. It's used in etcd and ZooKeeper for leader election and configuration, and inside many databases for replication."

**Q: Why do coordination clusters use an odd number of nodes?**
Say this: "Decisions need a majority. Three nodes tolerate one failure; four nodes need three for a majority, so they still only tolerate one failure, with more cost. Five tolerate two. So you add nodes in odd numbers."

**Q: What's two-phase commit and why is it avoided across services?**
Say this: "A coordinator asks every participant to prepare, which means they promise they can commit and hold their locks; if all say yes, it tells them to commit. If the coordinator crashes after prepare, participants are stuck holding locks until it comes back, which blocks other work. It also couples services tightly. Most systems use a saga with an outbox instead."

**Q: What is the outbox pattern and what problem does it solve?**
Say this: "It solves the dual-write problem: saving to the database and publishing an event are two systems, and one can fail. With the outbox, the event is inserted into an outbox table in the same transaction as the business change, so both happen or neither does. A relay, or change data capture, publishes unsent rows. Delivery is at-least-once, so consumers deduplicate by event ID."

**Q: Saga: choreography vs orchestration?**
Say this: "In choreography, each service listens for events and reacts, with no central controller; it's loosely coupled but the flow can be hard to follow. In orchestration, one coordinator tells each service what to do and handles failures; it's easier to understand and monitor. In both, every step needs a compensating action, like refunding a payment if ticket issuing fails."

**What impresses interviewers:** separating which operations need strong consistency, explaining the outbox, and knowing why 2PC blocks.
**Red flag:** "We'll use distributed transactions across all services", or CAP as "choose two of three" with no mention of partitions.

### Cheat card

- Linearizable = one copy, no going back in time. Needed for locks, uniqueness, inventory.
- CAP: during a partition, consistency or availability. PACELC: otherwise latency vs consistency.
- Consensus (Raft): leader + majority + terms. Use etcd/ZooKeeper; don't write your own.
- Odd cluster sizes: 3 tolerates 1, 5 tolerates 2.
- 2PC blocks if the coordinator dies; avoid across services.
- Outbox + saga + idempotent consumers instead of dual writes.

### AI-era angle

Don't confuse "consensus" in distributed systems with asking several AI models and taking the majority answer; that's about quality, not agreement under failure. Multi-agent systems still need the real kind: one planner elected at a time, locks on shared resources, and an outbox so "the agent decided to email the customer" is never recorded without the email eventually being sent.

### Share it: blog post and training session

#### Blog post
**Title:** "Stop dual-writing: the transactional outbox, sagas, and why we don't use two-phase commit"
1. The dual-write bug (DB commit succeeded, publish failed). 2. 2PC and the blocked row, with screenshots. 3. The outbox with SQL and the relay. 4. At-least-once and deduplication. 5. Sagas for checkout. 6. Leader election with etcd for the jobs that must run once.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–15 | Raft visualization, then kill etcd nodes live. |
| 15–35 | Concepts: linearizability, causality, total order, consensus, 2PC. |
| 35–55 | Live: the 2PC coordinator crash and the blocked row. |
| 55–80 | Exercise: design the saga for "refund a cancelled event for 10,000 ticket holders". |
| 80–90 | Where do we dual-write today? Make a list. |

---

## Module 10 · Batch processing

**Read:** 1st edition Chapter 10 (PDF pp. 399–446); focus on "Simple log analysis" (p. 401), "The Unix philosophy" (p. 404), "Reduce-side joins and grouping" (p. 413), "The output of batch workflows" (p. 420). 2nd edition: Chapter 11.
**What must be true at the end:** *"Any batch job can be re-run for any date and produce the same result, and a bad run can be undone in seconds."*

### In one line

Batch processing takes a big pile of fixed data, processes all of it at once without a user waiting, and writes a fresh result.

### Think of it like this

**Laundry day.** You don't wash each sock the moment it gets dirty; you collect a week of clothes and wash them in one batch. Nobody stands waiting for each item.

**Counting election votes.** Each polling booth counts its own ballots (**map**). All the counts for each candidate are gathered into one pile per candidate (**shuffle**). Then each pile is added up (**reduce**). Many booths work in parallel, and nobody needs to see all the ballots.

**Printing a new report instead of erasing the old one.** If every night you print a fresh sales report and keep last night's copy in the drawer, a mistake tonight is easy to fix: hand out yesterday's copy, fix the mistake, and print again. If you had erased and rewritten the same page, yesterday's good numbers would be gone.

### The idea, step by step

1. A **batch job** reads a fixed input (yesterday's orders, last month's logs), processes it, and writes an output. It runs on a schedule, not in response to a user click.
2. **Unix tools** already show the best design: each program does one thing, programs pass text lines to each other through **pipes**, and inputs are never modified. `sort` even uses the disk when data is bigger than memory.
3. **MapReduce** spreads that idea across many machines: **map** turns each record into key-value pairs; the system **shuffles** them so all values with the same key land together (by sorting); **reduce** processes each group.
4. **Joins** in batch: emit both datasets keyed by the join key and let the reducer see matching records side by side (**sort-merge** or reduce-side join). If one dataset is small, load it into memory on every worker and skip the shuffle (**broadcast hash** or map-side join).
5. Treat inputs as **immutable** and write outputs to a **new location**, then switch readers to it in one step. If the output is wrong, switch back and re-run. Nothing was overwritten, so nothing was lost.
6. Make jobs **idempotent and re-runnable**: running the job twice for the same date gives the same result. Then retries and backfills are safe.
7. Modern engines (Spark, Flink, DuckDB for single machines) keep the same model but avoid writing every intermediate step to disk.

### Words you'll meet

| Word | Plain meaning | Example in TicketRush |
|---|---|---|
| Batch job | A scheduled job over a fixed input. | Nightly revenue per event. |
| Pipe (`\|`) | Sends one program's output into another's input. | `jq ... \| sort \| uniq -c`. |
| MapReduce | Map → shuffle (group by key) → reduce. | Revenue per artist. |
| Shuffle | Moving and sorting data so equal keys end up together. | All rows for event 42 meet in one place. |
| Sort-merge join | Join by sorting both sides on the key and walking them together. | Orders joined with headliners. |
| Broadcast hash join | Copy the small table into memory everywhere; no shuffle. | Load 500 headliners into a `Map`. |
| Immutable input | Input that never changes during the job. | Orders before midnight. |
| Idempotent job | Running it twice gives the same result. | Same output for `asOf = 2026-10-08`. |
| Backfill | Running a job for past dates. | Recompute stats for all of September. |
| Atomic switch | Readers move from old to new output in one step. | `CREATE OR REPLACE VIEW event_stats ...`. |
| Keyset pagination | Paging with `WHERE id > last_id` instead of `OFFSET`. | Stays fast over 5 million rows. |
| Checkpoint | Saving progress so a crashed job can resume. | Store the last processed ID. |
| ETL / ELT | Extract, transform, load (transform before loading) vs load first, transform inside the warehouse. | Export to Parquet, then query with DuckDB. |
| Data warehouse / lake | A store for analytics: structured tables / raw files. | Parquet files on disk or S3. |

### Picture it

```
MAPREDUCE: revenue per headline artist
 orders.csv ─┐         ┌─ part 0 ─ sort ─► reduce ─┐
             ├─ map ──►├─ part 1 ─ sort ─► reduce ─┼─► revenue per artist
 artists.csv ┘ (key =  ├─ part 2 ─ sort ─► reduce ─┤
               event)  └─ part 3 ─ sort ─► reduce ─┘

VERSIONED OUTPUT + ATOMIC SWITCH
event_stats_20261007 (yesterday, kept)      event_stats_20261008 (tonight, new)
                ▲                                         ▲
                └─────── VIEW event_stats points here ────┘  (one statement to switch, one to roll back)
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### POC 10a — Unix pipelines on your own logs

Your NestJS app already writes JSON logs (nestjs-pino). Generate a few million lines with k6, then:

```bash
# Routes with the most requests slower than 1 s
jq -r 'select(.responseTime > 1000) | .req.url | sub("\\?.*$"; "")' logs/app.log \
  | sort | uniq -c | sort -rn | head -10

# Status code distribution
jq -r '.res.statusCode // empty' logs/app.log | sort | uniq -c | sort -rn
```

The same thing in Node, streaming with constant memory:

```ts
// apps/m10-batch/src/slow-routes.ts
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

export async function slowRoutes(path: string, thresholdMs = 1000) {
  const counts = new Map<string, number>();
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line) continue;
    const log = JSON.parse(line);
    if (log.responseTime > thresholdMs) {
      const route = String(log.req?.url ?? '').split('?')[0];
      counts.set(route, (counts.get(route) ?? 0) + 1);
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 10);
}
```

Experiment: run both on a 5 GB file. Then change the key to the full URL including IDs (millions of distinct keys). The Node `Map` runs out of memory; the `sort | uniq -c` pipeline doesn't, because sorting spills to disk. That is the book's in-memory-hash vs sort-based argument, on your laptop.

#### POC 10b — MapReduce from scratch: revenue per headline artist

Export inputs with `psql`:

```sql
\copy (SELECT event_id, artist_name FROM headliners_view) TO 'data/headliners.csv' CSV
\copy (SELECT s.event_id, oi.price_cents FROM order_items oi JOIN seats s ON s.id = oi.seat_id) TO 'data/order_items.csv' CSV
```

(`headliners_view` joins `event_artists` with `billing_order = 1` to `artists`.)

```ts
// apps/m10-batch/src/mapreduce.ts
import { createReadStream, createWriteStream, WriteStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const R = 4; // number of partitions (reducers)
const partition = (key: string) => createHash('md5').update(key).digest().readUInt32BE(0) % R;

async function* lines(path: string) {
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  for await (const l of rl) if (l) yield l;
}

// MAP: emit "key \t tag \t value", routed to a partition by key
export async function map(dir: string) {
  const outs: WriteStream[] = Array.from({ length: R }, (_, i) => createWriteStream(`${dir}/part-${i}.tsv`));
  for await (const l of lines(`${dir}/headliners.csv`)) {
    const [eventId, artist] = l.split(',');
    outs[partition(eventId)].write(`${eventId}\tA\t${artist}\n`);   // tag A sorts before O
  }
  for await (const l of lines(`${dir}/order_items.csv`)) {
    const [eventId, cents] = l.split(',');
    outs[partition(eventId)].write(`${eventId}\tO\t${cents}\n`);
  }
  await Promise.all(outs.map((o) => new Promise((resolve) => o.end(resolve))));
}

// SHUFFLE: an external sort per partition; works for files larger than RAM
export function sortPartitions(dir: string) {
  for (let i = 0; i < R; i++) {
    execFileSync('sort', ['-t', '\t', '-k1,1', '-k2,2', '-o', `${dir}/part-${i}.sorted`, `${dir}/part-${i}.tsv`],
      { env: { ...process.env, LC_ALL: 'C' } });   // byte-order sort, same result on every machine
  }
}

// REDUCE: one streaming pass; for each event the artist record arrives first, then its orders
export async function reduce(dir: string) {
  const revenue = new Map<string, number>(); // output is small: one entry per artist
  for (let i = 0; i < R; i++) {
    let currentEvent = '';
    let artist: string | undefined;
    for await (const l of lines(`${dir}/part-${i}.sorted`)) {
      const [eventId, tag, value] = l.split('\t');
      if (eventId !== currentEvent) { currentEvent = eventId; artist = undefined; }
      if (tag === 'A') artist = value;
      else if (artist) revenue.set(artist, (revenue.get(artist) ?? 0) + Number(value));
    }
  }
  return [...revenue].sort((a, b) => b[1] - a[1]);
}
```

Then do it the modern way and compare time and effort:

```sql
-- DuckDB
SELECT h.column1 AS artist, sum(o.column1) AS revenue
FROM read_csv('data/order_items.csv', header = false) o
JOIN read_csv('data/headliners.csv', header = false) h ON h.column0 = o.column0
GROUP BY ALL ORDER BY revenue DESC;
```

Exercise: rewrite the job as a **map-side broadcast join** (load `headliners.csv` into a `Map` in the mapper and skip the shuffle). When is that allowed, and what happens when the "small" side grows to 50 GB?

#### POC 10c — A production batch job in NestJS

A nightly job builds `event_stats` for dashboards. It follows three rules: the input is a fixed point in time, the output goes to a new versioned table, and readers switch atomically through a view.

```ts
// apps/m10-batch/src/event-stats.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Pool } from 'pg';
import { PG_POOL } from '@app/db';

@Processor('batch')
export class EventStatsProcessor extends WorkerHost {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {
    super();
  }

  async process(job: Job<{ asOf?: string }>) {
    // re-runs and backfills pass asOf explicitly; scheduled runs use "midnight UTC of today"
    const asOf = job.data.asOf ?? new Date(job.timestamp).toISOString().slice(0, 10);
    const version = asOf.replace(/-/g, '');
    if (!/^\d{8}$/.test(version)) throw new Error(`bad asOf ${asOf}`);
    const table = `event_stats_${version}`;

    const c = await this.pool.connect();
    try {
      await c.query(`SET statement_timeout = '15min'`);
      await c.query(`DROP TABLE IF EXISTS ${table}`);          // a crashed earlier attempt leaves junk
      await c.query(`CREATE TABLE ${table} (
        event_id      bigint PRIMARY KEY,
        as_of         date   NOT NULL,
        orders        int    NOT NULL,
        revenue_cents bigint NOT NULL)`);
      await c.query(
        `INSERT INTO ${table} (event_id, as_of, orders, revenue_cents)
         SELECT s.event_id, $1::date, count(DISTINCT o.id), sum(oi.price_cents)
           FROM orders o
           JOIN order_items oi ON oi.order_id = o.id
           JOIN seats s        ON s.id = oi.seat_id
          WHERE o.status = 'paid' AND o.created_at < $1::date
          GROUP BY s.event_id`, [asOf]);
      await c.query(`ANALYZE ${table}`);
      // the switch: readers see yesterday's complete table or today's, never a half-built one
      await c.query(`CREATE OR REPLACE VIEW event_stats AS SELECT * FROM ${table}`);
    } finally {
      c.release();
    }
  }
}
```

```ts
// schedule it once at startup (BullMQ 5.16+ "job schedulers"; calling again updates, never duplicates)
await this.batchQueue.upsertJobScheduler(
  'event-stats-nightly',                     // stable scheduler ID
  { pattern: '0 2 * * *', tz: 'UTC' },        // 02:00 UTC every day
  {
    name: 'event-stats',
    data: {},
    opts: { attempts: 3, backoff: { type: 'exponential', delay: 60_000 } },
  },
);

// manual re-run or backfill for a specific day
await this.batchQueue.add('event-stats', { asOf: '2026-10-01' });

// rollback after a bad run: point the view back at a previous version
// CREATE OR REPLACE VIEW event_stats AS SELECT * FROM event_stats_20261007;
```

When a job has to process rows in application code, page with a **keyset**, never `OFFSET` (which re-reads every skipped row):

```ts
let lastId = '0';
for (;;) {
  const { rows } = await pool.query(
    'SELECT id, user_id, total_cents FROM orders WHERE id > $1 ORDER BY id LIMIT 5000', [lastId]);
  if (rows.length === 0) break;
  await processChunk(rows);               // make this idempotent; the job may be retried
  lastId = rows[rows.length - 1].id;      // checkpoint this value to resume after a crash
}
```

**Break it**

| # | Experiment | What to look for |
|---|---|---|
| E1 | Run the job twice for the same `asOf` and compare checksums: `SELECT md5(string_agg(t::text, ',' ORDER BY event_id)) FROM event_stats_20261008 t;` | Identical: the job is deterministic. If not, find the hidden non-determinism (`now()`, unordered input). |
| E2 | Introduce a bug that doubles revenue, run it, then roll back by repointing the view; fix and re-run. | Recovery from a human error in seconds, with no data restored from backup. |
| E3 | Kill the worker mid-job. | BullMQ retries; the partial table is dropped and rebuilt. |
| E4 | Paginate 5M rows with `OFFSET` vs keyset. | `OFFSET` gets slower with every page; keyset stays flat. |
| E5 | Run the job on the primary while k6 runs checkout traffic, then on a replica. | Effect on checkout p99. Batch jobs belong on replicas or analytical copies. |

### Production checklist


- [ ] Batch inputs are fixed snapshots (a cut-off time, an exported file, a REPEATABLE READ transaction).
- [ ] Outputs are written to new, versioned locations and switched atomically; old versions kept for rollback.
- [ ] Jobs are idempotent and re-runnable for any date; backfills use the same code path.
- [ ] Large jobs checkpoint progress (keyset position) and resume.
- [ ] Heavy jobs run off the OLTP primary.
- [ ] Each job has a duration metric, a freshness metric ("stats are N hours old") and an alert.

### Mistakes people make

- Jobs that update the live table in place, so a bug destroys good data.
- Jobs that use "now" inside the logic, so re-running gives a different answer.
- Paging through big tables with `OFFSET`, which gets slower every page.
- Running heavy jobs on the main database during business hours.
- No alert when a nightly job silently didn't run.

### Interview corner

**Q: Batch vs stream processing?**
Say this: "Batch processes a bounded, fixed dataset all at once, with results available after the job finishes, often hours later; it's simple, easy to re-run, and good for reports, billing and rebuilding indexes. Stream processing handles unbounded data continuously, with results in seconds; it's needed for alerts, live dashboards and keeping systems in sync. Many systems use both: streams for freshness, batch to recompute and correct."

**Q: Explain MapReduce.**
Say this: "Three phases. Map reads each input record and emits key-value pairs, like (artist, ticket price). Shuffle groups all pairs with the same key onto the same worker, by partitioning and sorting. Reduce processes each key's values, like summing revenue per artist. Because each phase works on independent pieces, it scales across many machines and failed pieces can simply be re-run."

**Q: How do you make a batch job safe to re-run?**
Say this: "Fix the input to a point in time, like 'orders before midnight on the 8th', so it doesn't change between runs. Avoid using the current time inside the logic. Write output to a new, versioned table or file, then switch readers atomically. Then a retry or backfill just produces the same output again, and a bad run is rolled back by pointing readers at the previous version."

**Q: Sort-merge join vs broadcast join?**
Say this: "A sort-merge join partitions and sorts both datasets by the join key so matching records meet in the same place; it works for any size but requires a shuffle. A broadcast join copies the smaller dataset into memory on every worker and streams the big one past it; it's much faster but only works if the small side fits in memory."

**Q: Why is `OFFSET` pagination slow for large jobs, and what's the alternative?**
Say this: "`OFFSET 1000000` still makes the database read and discard a million rows, so each page gets slower. Keyset pagination remembers the last ID and asks for `WHERE id > last_id ORDER BY id LIMIT 5000`, which uses the index and stays fast. It also gives a natural checkpoint for resuming."

**Q: Lambda vs Kappa architecture?**
Say this: "Lambda runs a batch layer for accurate, complete results and a separate streaming layer for fresh, approximate results, then merges them; the cost is maintaining the same logic twice. Kappa uses only stream processing and reprocesses history by replaying the log when logic changes. Kappa is simpler if your stream platform keeps enough history."

**What impresses interviewers:** idempotent, versioned outputs with atomic switch and easy rollback; knowing when a broadcast join applies.
**Red flag:** a nightly job that "updates the table" with no story for bugs or re-runs.

### Cheat card

- Batch = fixed input, no user waiting, output at the end.
- Map (extract key) → shuffle (group by key via sort) → reduce (aggregate).
- Big × big join: sort-merge. Big × small: broadcast hash join.
- Immutable input, versioned output, atomic switch, one-line rollback.
- Idempotent jobs: fixed "as of" time, no `now()` inside.
- Keyset pagination, checkpoints, run off the main database.

### AI-era angle

Generating embeddings for all documents, re-chunking content and running model evaluations are batch jobs. Build each new embedding set into a new versioned table, switch retrieval to it in one step, and keep the old one to roll back if the new model is worse. Use frozen datasets for evaluations so results are comparable over time.

### Share it: blog post and training session

#### Blog post
**Title:** "Batch jobs that can't hurt you: immutable inputs, versioned outputs and one-line rollbacks"
1. Unix pipes on our logs. 2. MapReduce in 80 lines of TypeScript. 3. Sort-merge vs broadcast joins. 4. The versioned-table + view pattern. 5. The doubled-revenue bug and the 10-second rollback. 6. Keyset pagination.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–15 | Live: answer a real production question from logs with one Unix pipeline. |
| 15–35 | Concepts: Unix philosophy, map/shuffle/reduce, joins, immutable outputs. |
| 35–55 | Live: the MapReduce job, then the same in DuckDB. |
| 55–80 | Exercise: redesign one of our existing cron jobs to be idempotent and rollback-able. |
| 80–90 | Discuss: which of our jobs overwrite data in place today? |

---

## Module 11 · Stream processing

**Read:** 1st edition Chapter 11 (PDF pp. 447–491); focus on "Partitioned logs" (p. 454), "Keeping systems in sync" (p. 459), "Change data capture" (p. 461), "Event sourcing" (p. 464), "Reasoning about time" (p. 474). 2nd edition: Chapter 12.
**What must be true at the end:** *"Every copy of data (search, cache, dashboard) catches up with the database, and can be rebuilt from scratch."*

### In one line

Stream processing handles events continuously as they happen, and a durable, ordered log of changes is the best way to keep many systems in sync.

### Think of it like this

**A conveyor belt sushi bar.** Plates (events) move past continuously. Each customer (consumer) picks what they need as it passes. Nobody waits for "all the sushi of the day" to arrive.

**CCTV recording vs a security guard's memory.** A guard who sees something and forgets it is like a traditional message queue: once a message is handled, it's gone. A CCTV recording keeps everything in order, and anyone can rewind and watch again from any point. That's a **log-based broker** like Kafka.

**Your bank passbook.** The bank doesn't just store "balance: 5,000". It stores every deposit and withdrawal in order, and the balance is the sum of all entries. You can always recompute it, and see what the balance was on any past date. That's **event sourcing**.

**Two notebooks, one secretary.** If you tell the secretary to update the main ledger *and* a copy for the reception desk separately, sooner or later the copy will be wrong: she'll forget one, or do them in a different order. Better: she updates only the ledger, and the reception desk reads the ledger's daily list of changes. That's **change data capture (CDC)**.

### The idea, step by step

1. An **event** is a small, immutable fact: "seat 12 was held at 10:00:05". A **stream** is an endless sequence of events.
2. **Traditional brokers** (RabbitMQ style) give each message to one consumer and delete it once acknowledged: good for task queues. **Log-based brokers** (Kafka, Redpanda) append events to durable, partitioned logs; consumers track their own position (**offset**) and can rewind. Order is guaranteed **within a partition**, so give related events the same **key** (like the event ID).
3. **Dual writes** (writing to the database and to the cache or search index separately from app code) go wrong: two updates can arrive in different orders, or one write can fail, leaving systems permanently different.
4. **CDC** reads the database's own change log (in PostgreSQL, the WAL) and publishes every change, in order. Every other system (search, cache, analytics) consumes that stream, so they all apply the same changes in the same order.
5. **Event sourcing** stores the events themselves as the source of truth and computes current state from them. Separate **commands** (a request that can be rejected: "hold seat 12") from **events** (a fact that happened: "seat 12 was held").
6. Time is tricky: **event time** (when it happened) differs from **processing time** (when you saw it). Counting "tickets sold per minute" must decide how long to wait for late events (a **watermark**).
7. Fault tolerance: consumers may crash and re-read messages, so processing must be **idempotent**. The usual delivery guarantee is **at-least-once**; with deduplication you get an exactly-once *effect*.

### Words you'll meet

| Word | Plain meaning | Example in TicketRush |
|---|---|---|
| Event | An immutable fact that something happened. | `OrderPaid`. |
| Stream | An unbounded sequence of events. | All seat changes, forever. |
| Producer / consumer | Writes events / reads events. | API produces; search indexer consumes. |
| Topic | A named stream in Kafka/Redpanda. | `tr.public.events`. |
| Partition (of a topic) | One ordered slice of a topic. | Events for event 42 always go to partition 3. |
| Message key | Decides the partition; same key = same order. | `event_id`. |
| Offset | A consumer's position in a partition. | "I've read up to message 1,882". |
| Consumer group | Several consumers sharing a topic's partitions. | 3 indexer instances split 12 partitions. |
| Consumer lag | How far behind a consumer is. | 50,000 unread messages. |
| Retention / compaction | How long messages are kept / keeping only the latest per key. | Keep 7 days; or latest state per seat. |
| Dual write | App writes to two systems separately. | DB + Redis from the controller. |
| CDC | Turning the database's change log into a stream. | Debezium reads Postgres WAL. |
| Event sourcing | Storing events as the truth, deriving state. | `seat_events` table. |
| Command vs event | A request that may fail vs a fact that happened. | `HoldSeat` vs `SeatHeld`. |
| Projection | A view of current state built from events. | `seats.status` rebuilt from `seat_events`. |
| Event time / processing time | When it happened / when we processed it. | Sale at 10:00:05, seen at 10:01:30. |
| Window | A time bucket for counting. | Tickets per minute. |
| Watermark | "We think all events before time T have arrived." | T = latest seen − 30 s. |
| Late event | Arrives after its window closed. | Corrected by the nightly batch. |
| Delivery semantics | At-most-once (may lose), at-least-once (may duplicate), exactly-once effect (dedupe). | We use at-least-once + dedupe. |
| Backpressure | Slowing producers when consumers can't keep up. | Lag grows → scale consumers or slow input. |

### Picture it

```
               ┌──────────── Postgres (source of truth) ────────────┐
 API writes ──►│ events, seats, orders, outbox            WAL ──────┼──► Debezium (CDC)
               └─────────────────────────────────────────────────────┘          │
                                                                                ▼
                          Redpanda topic (ordered per key, kept, rewindable)
                 ┌───────────────┬────────────────┬────────────────┬──────────────┐
                 ▼               ▼                ▼                ▼              ▼
          search indexer   cache updater    sales dashboard   email sender   embedder (AI)
          (rebuildable)    (rebuildable)    (event-time       (deduplicates  (rebuildable)
                                             windows)          by event ID)
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### Infrastructure: Redpanda, Debezium and logical decoding

`infra/compose.m11.yml` (overlay on the base file):

```yaml
services:
  postgres:                       # override: logical decoding for CDC
    command: >
      postgres -c wal_level=logical -c max_replication_slots=10 -c max_wal_senders=10
               -c shared_preload_libraries=pg_stat_statements

  redpanda:
    image: redpandadata/redpanda   # pin a version tag in your repo
    command:
      - redpanda
      - start
      - --mode=dev-container
      - --smp=1
      - --kafka-addr=internal://0.0.0.0:9092,external://0.0.0.0:19092
      - --advertise-kafka-addr=internal://redpanda:9092,external://localhost:19092
    ports: ["19092:19092", "18081:8081"]   # Kafka API, schema registry

  console:
    image: redpandadata/console
    environment:
      KAFKA_BROKERS: redpanda:9092
    ports: ["8080:8080"]
    depends_on: [redpanda]

  connect:
    image: quay.io/debezium/connect:3.6    # Debezium 3.6.x; pin the exact patch you test with
    environment:
      BOOTSTRAP_SERVERS: redpanda:9092
      GROUP_ID: ticketrush-connect
      CONFIG_STORAGE_TOPIC: _connect_configs
      OFFSET_STORAGE_TOPIC: _connect_offsets
      STATUS_STORAGE_TOPIC: _connect_status
    ports: ["8083:8083"]
    depends_on: [redpanda, postgres]
```

Register the CDC connector (`infra/m11/connector.json`):

```json
{
  "name": "ticketrush-pg",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "plugin.name": "pgoutput",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "app",
    "database.password": "app",
    "database.dbname": "tickets",
    "topic.prefix": "tr",
    "table.include.list": "public.events,public.seats",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "key.converter.schemas.enable": "false",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false"
  }
}
```

```bash
curl -s -X POST -H 'Content-Type: application/json' --data @infra/m11/connector.json localhost:8083/connectors
curl -s localhost:8083/connectors/ticketrush-pg/status
# open http://localhost:8080 (Redpanda Console) and watch topic tr.public.events as you UPDATE an event
```

Each change message has `op` (`c` create, `u` update, `d` delete, `r` snapshot read), `before`, `after` and a `source` block that includes the WAL position `lsn`.

#### POC 11a — The dual-write race, and the CDC fix

First prove the problem. The app updates the event title in Postgres, then in a Redis cache; add a random 0–50 ms delay between the two writes. Fire two concurrent updates ("Title A", "Title B") at the same event, 100 times. Count how often Postgres and Redis end up disagreeing. Then remove the cache write from the API path and let a CDC consumer maintain it instead.

A derived **search index** maintained from CDC (Postgres full-text search as the "search engine", so no extra system is needed):

```sql
CREATE TABLE event_search (
  event_id   bigint   PRIMARY KEY,
  title      text     NOT NULL,
  doc        tsvector NOT NULL,
  source_lsn bigint   NOT NULL        -- position in the source log; makes the consumer idempotent
);
CREATE INDEX event_search_doc ON event_search USING gin (doc);
```

```ts
// apps/m11-streams/src/search-indexer.ts
import { Kafka } from 'kafkajs';

const kafka = new Kafka({ clientId: 'search-indexer', brokers: ['localhost:19092'] });
const consumer = kafka.consumer({ groupId: 'search-indexer' });

export async function startSearchIndexer(pool: Pool) {
  await consumer.connect();
  await consumer.subscribe({ topic: 'tr.public.events', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;                    // tombstone that follows a delete
      const { op, before, after, source } = JSON.parse(message.value.toString());

      if (op === 'd') {
        await pool.query('DELETE FROM event_search WHERE event_id = $1 AND source_lsn < $2',
          [before.id, source.lsn]);
        return;
      }
      // Upsert, but never let an older change overwrite a newer one (safe to replay)
      await pool.query(
        `INSERT INTO event_search (event_id, title, doc, source_lsn)
         VALUES ($1, $2, to_tsvector('simple', $2 || ' ' || coalesce($3, '')), $4)
         ON CONFLICT (event_id) DO UPDATE
           SET title = EXCLUDED.title, doc = EXCLUDED.doc, source_lsn = EXCLUDED.source_lsn
         WHERE event_search.source_lsn < EXCLUDED.source_lsn`,
        [after.id, after.title, after.details, source.lsn]);
    },
  });
}
```

```sql
-- the search endpoint reads the derived view
SELECT event_id, title FROM event_search
WHERE doc @@ plainto_tsquery('simple', $1)
LIMIT 20;
```

**Rebuild from scratch** (the superpower of logs): stop the indexer, `TRUNCATE event_search`, then reset the consumer group and start again:

```bash
docker compose exec redpanda rpk group seek search-indexer --to start
```

If the topic no longer holds the full history (retention), trigger a new Debezium snapshot or use a compacted topic. Write down which one you chose and why.

#### POC 11b — Idempotent consumers for side effects

Delivery is at-least-once (the outbox from Module 9 and Kafka consumers both redeliver after crashes). For effects like "queue a confirmation email", deduplicate on the event ID inside the same transaction as the effect:

```sql
CREATE TABLE processed_events (
  consumer     text        NOT NULL,
  event_id     uuid        NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (consumer, event_id)
);
```

```ts
await withTransaction(pool, async (c) => {
  const first = await c.query(
    `INSERT INTO processed_events (consumer, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    ['email-sender', evt.id]);
  if (first.rowCount === 0) return;               // already handled: do nothing
  await c.query(`INSERT INTO email_queue (order_id, template) VALUES ($1, 'order-confirmed')`,
    [evt.data.id]);
});
```

Experiment: kill the consumer with `kill -9` between processing and committing its offset, 20 times, then count emails per order. Without deduplication you'll see duplicates; with it, exactly one.

#### POC 11c — Event-sourced seat history

```sql
CREATE TABLE seat_events (
  seq         bigserial   PRIMARY KEY,           -- global order of facts
  seat_id     bigint      NOT NULL,
  type        text        NOT NULL CHECK (type IN ('SeatHeld', 'HoldReleased', 'SeatSold')),
  data        jsonb       NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON seat_events (seat_id, seq);
```

```ts
type SeatEvent =
  | { type: 'SeatHeld'; seatId: string; data: { userId: string } }
  | { type: 'HoldReleased'; seatId: string; data: Record<string, never> }
  | { type: 'SeatSold'; seatId: string; data: { orderId: string } };

type SeatState = { status: 'available' | 'held' | 'sold'; by?: string };

// current state is a left fold over the facts
export function project(events: SeatEvent[]): Map<string, SeatState> {
  const state = new Map<string, SeatState>();
  for (const e of events) {
    switch (e.type) {
      case 'SeatHeld':     state.set(e.seatId, { status: 'held', by: e.data.userId }); break;
      case 'HoldReleased': state.set(e.seatId, { status: 'available' }); break;
      case 'SeatSold':     state.set(e.seatId, { status: 'sold' }); break;
    }
  }
  return state;
}
```

Distinguish **commands** from **events**: "HoldSeat" is a request that can be rejected (validate it against current state, using Module 7's techniques); "SeatHeld" is a fact that already happened and is never changed or deleted. Exercises: answer "what did the seat map look like at 10:00:05, when the sale opened?" by folding events with `occurred_at <= '...'`; rebuild the `seats.status` projection from events and diff it against the table.

#### POC 11d — A live sales dashboard with event-time windows

Consume `OrderPaid` events (published by the outbox) and count tickets per event per minute, by **event time**:

```ts
// apps/m11-streams/src/sales-windows.ts
const WINDOW_MS = 60_000;
const ALLOWED_LATENESS_MS = 30_000;

export class SalesWindows {
  private windows = new Map<string, number>(); // `${eventId}:${windowStart}` -> tickets
  private watermark = 0;                       // "we believe we've seen everything before this"
  lateEvents = 0;

  onSale(e: { eventId: string; qty: number; occurredAt: string }) {
    const t = Date.parse(e.occurredAt);        // when it happened, not when we received it
    this.watermark = Math.max(this.watermark, t - ALLOWED_LATENESS_MS);
    const start = t - (t % WINDOW_MS);
    if (start + WINDOW_MS <= this.watermark) {
      this.lateEvents++;                       // too late for the live view; the nightly batch corrects it
      return;
    }
    const key = `${e.eventId}:${start}`;
    this.windows.set(key, (this.windows.get(key) ?? 0) + e.qty);
  }

  latest(eventId: string) {
    return [...this.windows]
      .filter(([k]) => k.startsWith(`${eventId}:`))
      .map(([k, n]) => ({ windowStart: new Date(Number(k.split(':')[1])).toISOString(), tickets: n }))
      .sort((a, b) => a.windowStart.localeCompare(b.windowStart))
      .slice(-30);
  }
}
```

```ts
// Server-Sent Events endpoint for the dashboard
import { MessageEvent, Param, Sse } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';

@Sse('events/:id/sales-stream')
stream(@Param('id') id: string): Observable<MessageEvent> {
  return interval(1000).pipe(map(() => ({ data: this.salesWindows.latest(id) })));
}
```

Experiment: replay a recorded hour of sales with random delivery delays of 0–90 s. Compare the live window counts with the nightly batch (Module 10) for the same hour. The difference is the late data; tune `ALLOWED_LATENESS_MS` and watch the trade-off between freshness and accuracy. (In production you'd also evict old windows; this toy keeps them in memory.)

### Production checklist


- [ ] No dual writes: derived stores are fed from CDC or an outbox, in source order.
- [ ] Message keys are chosen for ordering (e.g. `event_id`); partition count chosen for future parallelism.
- [ ] Every consumer is idempotent (dedupe table or version/LSN-guarded upserts).
- [ ] Consumer lag is monitored per group, with alerts.
- [ ] Each derived view has a documented rebuild procedure, and it has been rehearsed.
- [ ] Windowed aggregations use event time, define allowed lateness, and are reconciled by batch.
- [ ] Replication slots used by CDC are monitored (Module 5, E6).

### Mistakes people make

- Updating the cache or search index directly from API code (dual writes).
- Choosing a message key that doesn't match the ordering you need, so related events arrive out of order.
- Consumers that aren't idempotent, so a crash and replay sends duplicate emails.
- Counting by processing time when the business question is about event time.
- Not monitoring consumer lag, so a stuck consumer goes unnoticed for days.
- Event sourcing everything "because it's cool": it adds real complexity.

### Interview corner

**Q: Kafka vs RabbitMQ?**
Say this: "RabbitMQ is a traditional message broker: it routes each message to a consumer and deletes it once acknowledged, which is great for task queues and flexible routing. Kafka is a distributed, partitioned log: messages are kept for a retention period, consumers track their own offsets and can replay, and order is guaranteed per partition. I'd pick Kafka for event streams, CDC and replay; RabbitMQ for work queues where replay doesn't matter."

**Q: How does Kafka guarantee ordering?**
Say this: "Only within a partition. Messages with the same key always go to the same partition, so if I key by event ID, all changes to one event are consumed in order. There's no global order across partitions, so I choose the key based on which things must stay in order."

**Q: What are at-most-once, at-least-once and exactly-once?**
Say this: "At-most-once: the consumer commits its position before processing, so a crash can lose a message. At-least-once: it processes first and commits after, so a crash causes a re-delivery and a duplicate. Exactly-once processing within Kafka exists via transactions, but for side effects outside Kafka, like sending emails or writing to a database, the practical answer is at-least-once plus idempotent processing, for example deduplicating on an event ID."

**Q: How do you keep a cache or search index in sync with the database?**
Say this: "Not with dual writes from the application, because concurrent updates can be applied in different orders and partial failures leave them different forever. I use change data capture: read the database's change log and apply changes to the cache or index in commit order, with version-guarded upserts so replays are safe. For caches, a simpler option is invalidation on change plus a short TTL."

**Q: What is event sourcing, and what are its pros and cons?**
Say this: "Storing every change as an immutable event and deriving the current state from them. Pros: a full audit trail, the ability to see state at any past time, and rebuilding new views by replaying. Cons: more complexity, schema evolution of old events, and queries need projections. I'd use it where history really matters, like seat lifecycles or ledgers, not everywhere."

**Q: Event time vs processing time; what's a watermark?**
Say this: "Event time is when something happened; processing time is when the system saw it. They differ because of network delays and offline devices. A watermark is the system's estimate that all events before a certain time have arrived, so a window can be closed. Events arriving after that are late; you either drop them, count them separately, or correct the results later in batch."

**Q: What's backpressure and how do you handle it?**
Say this: "When consumers can't keep up with producers. With Kafka, messages simply wait in the log and consumer lag grows, so I monitor lag, add consumers up to the number of partitions, and make processing faster or batch it. In push-based systems, you bound the buffers and slow down or reject producers instead of running out of memory."

**What impresses interviewers:** "ordering per partition, choose the key", dual-write problems, CDC, and "at-least-once + idempotency".
**Red flag:** "Kafka gives exactly-once, so we don't need deduplication" for external side effects.

### Cheat card

- Queue (RabbitMQ): deliver and delete. Log (Kafka): keep, order per partition, replay.
- Same key → same partition → same order.
- No dual writes: use CDC or the outbox.
- At-least-once + idempotent consumers = exactly-once effect.
- Event sourcing: events are the truth; state is a projection. Use it where history matters.
- Event time + watermark for windows; reconcile late data in batch. Monitor consumer lag.

### AI-era angle

The freshest AI search (RAG) systems are stream processors: CDC on the source tables, a consumer that re-embeds changed rows, and a version-guarded upsert into the vector index, exactly like the search indexer in this module. AI usage metering (tokens per customer per minute) is a windowed count, and storing every step of an AI agent's run as an event lets you replay it to debug or to test a new prompt.

### Share it: blog post and training session

#### Blog post
**Title:** "Why our cache disagreed with our database, and how CDC fixed it for good"
1. The dual-write race, with numbers. 2. Logs vs queues. 3. Debezium and the Postgres WAL. 4. Idempotent upserts guarded by LSN. 5. Rebuilding a derived index from zero. 6. Event-time windows and late data.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–10 | Live: update an event in `psql`, watch it appear in Redpanda Console. |
| 10–30 | Concepts: logs, CDC, event sourcing, dual writes, event time. |
| 30–55 | Live: the dual-write race; then the CDC indexer; then rebuild from scratch. |
| 55–80 | Exercise: list every derived copy of order data in our systems; mark how each is kept in sync. |
| 80–90 | Event sourcing: when it's worth it, and when it's not. |

---

## Module 12 · Putting it all together

**Read:** Chapter 12 of the final 1st edition ("The Future of Data Systems"); *not in your early-release PDF*. 2nd edition: Chapter 13, plus Chapter 14 for law, privacy and responsibility. The summary below is enough to complete the module.
**What must be true at the end:** *"Every user action has an exactly-once effect end to end, every business rule is continuously checked, and every copy of a user's personal data can be found and deleted."*

### In one line

Real systems combine one source of truth with many derived copies, and correctness must be guaranteed from the user's click all the way to the final effect.

### Think of it like this

**A main ledger and its index cards.** A shop keeps one master ledger (the **source of truth**). From it, staff make index cards sorted by customer, a summary for the manager, and a list for the delivery team. These are **derived data**: if one gets lost or messed up, you can rebuild it from the ledger. You'd never let staff write directly on the index cards instead of the ledger.

**An order number on the form.** When you fill in a paper order at a counter and it gets lost in the queue, you fill in another, but it carries the *same order number*. The cashier sees the number has already been paid and doesn't charge you again. That number, created by you at the start, is an **idempotency key**. It works only because *every* desk the form passes through checks the number, not just one.

**Monthly bank reconciliation.** Even with careful systems, the accountant compares the bank statement with the company's books every month, because trusting is not the same as checking. That's **auditing**.

### The idea, step by step

1. No single database is best at everything, so real apps combine several: a **system of record** (PostgreSQL), plus caches, search indexes, analytics stores and vector indexes. Treat those as **derived views** fed from one ordered log of changes (Modules 9 and 11), so they can always be rebuilt by replaying.
2. The **end-to-end argument**: a guarantee is only real if it holds from start to finish. A database transaction doesn't stop a mobile app from retrying a request after a timeout and paying twice. The fix is an ID created at the very start (by the client) and checked at every step: API, database, payment provider.
3. **Timeliness vs integrity.** Timeliness: seeing the latest data right now. Integrity: never losing or corrupting data. Users tolerate a dashboard that's a few seconds old; they don't tolerate a lost payment. Design for integrity first.
4. **Trust, but verify**: run regular checks (auditors) that confirm the rules still hold: no seat sold twice, every paid order has exactly one payment, derived views match the source.
5. **Privacy and responsibility**: collect only what you need, keep personal data out of logs, and be able to delete a person's data everywhere it has spread, including caches, search indexes, embeddings and backups.

### Words you'll meet

| Word | Plain meaning | Example in TicketRush |
|---|---|---|
| System of record / source of truth | The authoritative copy of the data. | PostgreSQL. |
| Derived data / derived view | A copy computed from the source; can be rebuilt. | Search index, cache, stats, embeddings. |
| Unbundling the database | Treating separate systems like the parts of one big database, connected by a log. | Postgres + CDC + Redpanda + consumers. |
| End-to-end argument | Guarantees must hold from the origin to the final effect, not just in one layer. | Client-generated idempotency key. |
| Idempotency key | A unique ID for one user action, reused on every retry. | `Idempotency-Key: 6f1c…` header. |
| Lease | A claim that expires, so a crashed attempt can be taken over. | `locked_until` on the key. |
| Timeliness vs integrity | Fresh data now vs never wrong or lost. | Dashboard can lag; payments can't be wrong. |
| Invariant | A rule that must always be true. | "No seat sold twice." |
| Auditor / reconciliation | A job that checks invariants and alerts on violations. | Runs every 5 minutes. |
| Data minimization | Collect and keep only what you need. | No card numbers in our database. |
| Redaction | Removing sensitive fields from logs. | pino `redact`. |
| Crypto-shredding | Encrypting personal data with a per-user key, then deleting the key. | Backups become unreadable for that user. |
| Ledger (double-entry) | Recording every money movement as matching debit and credit entries. | Common in payment systems. |

### Picture it

```
END-TO-END IDEMPOTENCY: the SAME key travels through every step
  mobile app ──(Idempotency-Key: K)──► API ──► idempotency_keys table (claim K)
       │  timeout! retry with K                     │
       └──────────────────────────────►  API sees K: "already done" → returns the saved result
                                                    │
                                     payment provider charge(K) → provider also dedupes on K
                                                    │
                                     one DB transaction: order + key=completed + outbox event
```

### Build it

This is the hands-on part. Work through it in order: build the POC, then run every "break it" experiment so the problem from this module actually happens on your laptop, then fill in the measurement table.

#### POC 12a — End-to-end idempotent checkout

```sql
-- migrations/0012_correctness.sql
CREATE TABLE idempotency_keys (
  key          text        PRIMARY KEY,           -- UUID generated by the CLIENT
  user_id      bigint      NOT NULL,
  request_hash text        NOT NULL,
  status       text        NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  response     jsonb,
  locked_until timestamptz NOT NULL DEFAULT now() + interval '30 seconds',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id              bigserial   PRIMARY KEY,
  order_id        bigint      REFERENCES orders(id),
  idempotency_key text        NOT NULL UNIQUE,
  provider_ref    text        UNIQUE,
  amount_cents    int         NOT NULL,
  status          text        NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at      timestamptz NOT NULL DEFAULT now()
);
```

```ts
// apps/capstone/src/checkout/checkout.service.ts
@Injectable()
export class CheckoutService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly payments: PaymentProviderClient,
    private readonly orders: OrdersRepository,
  ) {}

  async checkout(key: string, userId: string, reservationId: string) {
    if (!/^[0-9a-f-]{36}$/i.test(key)) throw new BadRequestException('Idempotency-Key must be a UUID');
    const requestHash = createHash('sha256').update(JSON.stringify({ userId, reservationId })).digest('hex');

    const claim = await this.claim(key, userId, requestHash);
    if (claim.kind === 'replay') return claim.response;         // same request, already done

    // The provider receives the SAME key, so a retried charge is deduplicated there too.
    const payment = await this.payments.charge({ idempotencyKey: key, reservationId, userId });

    return withTransaction(this.pool, async (c) => {
      const order = await this.orders.completeFromReservation(c, reservationId, userId, payment);
      await c.query(`UPDATE idempotency_keys SET status = 'completed', response = $2 WHERE key = $1`,
        [key, order]);
      await c.query(`INSERT INTO outbox (topic, aggregate_id, payload) VALUES ('orders', $1, $2)`,
        [order.id, { type: 'OrderPaid', version: 1, data: order }]);
      return order;
    });
  }

  private async claim(key: string, userId: string, requestHash: string) {
    const inserted = await this.pool.query(
      `INSERT INTO idempotency_keys (key, user_id, request_hash) VALUES ($1, $2, $3)
       ON CONFLICT (key) DO NOTHING`, [key, userId, requestHash]);
    if (inserted.rowCount === 1) return { kind: 'claimed' as const };

    const { rows: [prev] } = await this.pool.query(
      `SELECT user_id, request_hash, status, response, locked_until < now() AS lease_expired
         FROM idempotency_keys WHERE key = $1`, [key]);
    if (prev.user_id !== userId || prev.request_hash !== requestHash) {
      throw new UnprocessableEntityException('Idempotency-Key was already used for a different request');
    }
    if (prev.status === 'completed') return { kind: 'replay' as const, response: prev.response };
    if (prev.lease_expired) {
      // an earlier attempt crashed midway; take over (safe because every downstream step is idempotent)
      const took = await this.pool.query(
        `UPDATE idempotency_keys SET locked_until = now() + interval '30 seconds'
          WHERE key = $1 AND status = 'in_progress' AND locked_until < now()`, [key]);
      if (took.rowCount === 1) return { kind: 'claimed' as const };
    }
    throw new ConflictException('A request with this Idempotency-Key is in progress; retry shortly');
  }
}
```

```ts
// checkout.controller.ts
@Post('reservations/:id/checkout')
checkout(
  @Param('id') reservationId: string,
  @Headers('idempotency-key') key: string,
  @Req() req: AuthedRequest,
) {
  return this.checkoutService.checkout(key, req.user.id, reservationId);
}
```

Build a **mock payment provider** (a tiny Nest app) that stores results by idempotency key and returns the stored result on repeats. Give it two failure switches: "charge, then respond after 5 s" (longer than the client timeout) and "charge, then crash before responding".

**Break it**

| # | Experiment | What to look for |
|---|---|---|
| E1 | Client times out at 2 s and retries; provider responds after 5 s. Run without and with the idempotency key. | Without: two charges. With: one charge, and the retry returns the original order. |
| E2 | Double-click: two identical requests at the same instant. | One proceeds, one gets 409; a later retry gets the stored response. |
| E3 | Kill the API after the charge but before the commit; retry after 30 s. | The lease expires, the retry takes over, the provider dedupes the charge, the order completes exactly once. |
| E4 | Reuse a key with a different reservation. | 422, never a silent wrong replay. |

#### POC 12b — The unbundled TicketRush

```
                              ┌──────────────── derived views (rebuildable) ────────────────┐
 clients ──► NestJS API ──►  PostgreSQL ──WAL──► Debezium ──► Redpanda ──► search indexer  ──► event_search (FTS)
              │  (system of   (holds, orders,    (CDC)        (ordered     cache updater   ──► Redis
              │   record)      outbox)                         log)        embedder        ──► event_embeddings (pgvector)
              │                                                            sales windows   ──► live dashboard (SSE)
              │                                                            email sender    ──► email_queue (deduped)
              └──► reads: primary / LSN-gated replicas / derived views     nightly batch   ──► event_stats_YYYYMMDD
```

Add one new derived view end to end: **semantic event search for the "ask about events" assistant**.

```sql
CREATE TABLE event_embeddings (
  event_id        bigint      PRIMARY KEY REFERENCES events(id),
  embedding       vector(384) NOT NULL,
  embedding_model text        NOT NULL,     -- the hidden schema of every vector (Module 4)
  source_version  int         NOT NULL      -- events.version this embedding was built from
);
CREATE INDEX ON event_embeddings USING hnsw (embedding vector_cosine_ops);

-- nearest events to a query embedding (pass the vector as the string '[0.12, -0.03, ...]')
SELECT e.id, e.title
FROM event_embeddings x JOIN events e ON e.id = x.event_id
ORDER BY x.embedding <=> $1::vector
LIMIT 10;

-- freshness: how many embeddings are behind their source row?
SELECT count(*) FROM events e LEFT JOIN event_embeddings x ON x.event_id = e.id
WHERE x.event_id IS NULL OR x.source_version < e.version;
```

The embedder is one more CDC consumer: on each change to `events`, call your embedding provider (keep it behind an interface so you can swap models), and upsert guarded by `source_version`, exactly like the search indexer. To change models, build `event_embeddings_v2` by replaying, compare retrieval quality, then switch (Module 10's pattern).

#### POC 12c — The invariant auditor ("trust, but verify")

A scheduled job runs these checks every 5 minutes, exports each count as a metric, and alerts on anything non-zero:

```sql
-- 1. no seat sold twice
SELECT oi.seat_id, count(*) FROM order_items oi JOIN orders o ON o.id = oi.order_id
WHERE o.status = 'paid' GROUP BY oi.seat_id HAVING count(*) > 1;

-- 2. general admission never oversold
SELECT t.id FROM ticket_types t
WHERE (SELECT count(*) FROM ga_tickets g WHERE g.ticket_type_id = t.id) > t.capacity;

-- 3. every paid order has exactly one successful payment
SELECT o.id FROM orders o
LEFT JOIN payments p ON p.order_id = o.id AND p.status = 'succeeded'
WHERE o.status = 'paid'
GROUP BY o.id HAVING count(p.id) <> 1;

-- 4. the outbox isn't stuck
SELECT count(*) FROM outbox WHERE published_at IS NULL AND created_at < now() - interval '5 minutes';

-- 5. derived views have converged
SELECT (SELECT count(*) FROM events) - (SELECT count(*) FROM event_search) AS missing_from_search;
```

Then break things on purpose (insert a duplicate sale with constraints disabled on a copy, stop the outbox relay, stop the indexer) and confirm each alert fires.

#### POC 12d — Privacy across derived data

1. **Log hygiene.** Extend the pino `redact` list to request bodies with personal data (`req.body.email`, `req.body.phone`) and verify with a grep over your logs.
2. **Deletion that follows the data.** A `UserDeleted` event goes through the outbox; every consumer deletes or anonymizes its derived copy; the auditor checks that no derived store still holds the user.
3. **Crypto-shredding** for copies you can't easily reach (backups, old log segments): encrypt personal fields with a per-user key, and delete the key to make every copy unreadable.

```ts
// apps/capstone/src/privacy/crypto.ts  (in production the per-user keys live in a KMS)
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export function encrypt(plain: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64'); // iv | tag | ciphertext
}

export function decrypt(blob: string, key: Buffer): string {
  const b = Buffer.from(blob, 'base64');
  const decipher = createDecipheriv('aes-256-gcm', key, b.subarray(0, 12));
  decipher.setAuthTag(b.subarray(12, 28));
  return Buffer.concat([decipher.update(b.subarray(28)), decipher.final()]).toString('utf8');
}
```

### Production checklist


- [ ] Every non-idempotent endpoint accepts an `Idempotency-Key`; clients generate it once per user action and reuse it on retries.
- [ ] The same key is passed to downstream providers that support it.
- [ ] Each derived store is listed with its source, its update path (CDC/outbox/batch), its rebuild procedure and its freshness metric.
- [ ] Invariants are audited continuously, with alerts.
- [ ] A data map shows every place personal data lives, including derived copies, logs and backups; deletion is tested end to end.
- [ ] Integrity is never traded for timeliness; staleness is shown to users where it matters.

### Mistakes people make

- Generating the idempotency key on the server, so a client retry gets a new key.
- Deduplicating in your API but not passing the same key to the payment provider.
- Letting teams write directly to a derived store, so it can no longer be rebuilt.
- Assuming invariants hold because "the code is correct", with no auditor.
- Forgetting that "delete my account" must reach caches, indexes, embeddings, logs and backups.

### Interview corner

**Q: How do you design an idempotent payment API?**
Say this: "The client generates an idempotency key once per user action and sends it with every retry. The server stores the key with a hash of the request; the first request claims it, does the work, and saves the response. Repeats with the same key return the saved response; a key reused with a different request is rejected. The same key is passed to the payment provider so it deduplicates too. A lease on in-progress keys lets a retry take over if the first attempt crashed."

**Q: What is the end-to-end argument?**
Say this: "Reliability features in one layer don't give guarantees across the whole path. TCP removes duplicate packets and the database has transactions, but neither stops a user's retried request from creating a second order. Only an identifier created at the origin and checked at every hop gives an end-to-end guarantee."

**Q: How do you keep many data stores consistent with each other?**
Say this: "One system of record, and every other store derived from its ordered change log via CDC or an outbox, with idempotent, version-guarded consumers. Then they converge to the same state and can be rebuilt by replaying. I monitor freshness for each derived store and run reconciliation checks."

**Q: How would you design a payment system so money is never lost or doubled?**
Say this: "A state machine for each payment, idempotency keys end to end, the payment provider as the source of truth for charges, webhooks handled idempotently, and a double-entry ledger so every movement has matching entries. A reconciliation job compares our records with the provider's daily reports and alerts on any difference. I'd favour correctness over speed: a delayed confirmation is fine; a double charge isn't."

**Q: How do you handle a GDPR "delete my data" request across many systems?**
Say this: "Keep a data map of every place personal data lives. Publish a 'user deleted' event through the outbox; every consumer deletes or anonymizes its copy; an auditor confirms nothing is left. For backups and logs that are hard to edit, encrypt personal fields with a per-user key and delete the key, which makes those copies unreadable."

**Q: Timeliness vs integrity: which do you sacrifice?**
Say this: "Timeliness. A dashboard or search result that's a few seconds behind is acceptable and recovers on its own. Lost or corrupted data usually can't be fixed later. So the critical write path is strict, and derived views are allowed to lag, with their freshness measured."

**What impresses interviewers:** client-generated keys passed downstream, reconciliation, and treating derived stores as rebuildable.
**Red flag:** "We use exactly-once delivery so duplicates can't happen."

### Cheat card

- One source of truth; everything else is derived, fed by a log, rebuildable.
- Idempotency key: created by the client, reused on retries, checked at every hop including the provider.
- Integrity over timeliness.
- Audit invariants continuously; alert on violations.
- Payments: state machine + idempotency + ledger + reconciliation.
- Deletion must reach every derived copy; crypto-shredding for backups.

### AI-era angle

AI features are derived data that isn't deterministic: the same input can produce a different output. Store every AI output with its inputs, model, prompt version and retrieved context, so you can audit, reproduce and re-generate it. An assistant answering from stale or deleted data is an integrity and privacy failure, so freshness checks and deletion propagation apply to your vector index too.

### Share it: blog post and training session

#### Blog post
**Title:** "Exactly-once is a lie, exactly-once *effects* are not: end-to-end idempotency for payments"
1. The double-charge incident. 2. Why database transactions alone can't prevent it. 3. Client-generated keys, leases and provider dedupe. 4. The crash experiments. 5. Our unbundled architecture and the invariant auditor. 6. Privacy: deleting data that has spread everywhere.

#### Training session (90 min)
| Time | Segment |
|---|---|
| 0–10 | Live: E1, the double charge. |
| 10–30 | Concepts: derived data, unbundling, end-to-end argument, timeliness vs integrity, auditing. |
| 30–55 | Live: the idempotent checkout surviving every crash experiment. |
| 55–80 | Exercise: draw our real system as a dataflow; mark the system of record and every derived view. |
| 80–90 | Ethics and privacy: where would a user's data still exist after we "delete" them? |

---

# Part 3 · The system design interview guide

Everything in the modules prepares you for this. This part shows how to use it under interview pressure.

## A. How a system design interview works

You get an open question ("Design a ticket booking system") and 45–60 minutes. There is no single right answer. The interviewer is watching **how you think**: do you ask good questions, make sensible assumptions, find the hard part, explain trade-offs, and think about failures? Talking clearly matters as much as the diagram. Drawing twenty boxes with brand names impresses nobody; explaining why one box exists and what happens when it fails impresses everyone.

## B. The 7-step framework

| Step | Time | What you do | What to say |
|---|---|---|---|
| 1. Clarify requirements | 5 min | List what the system must do (functional) and how well (non-functional: scale, latency, consistency, availability). | "Before I design, let me confirm what matters most…" |
| 2. Estimate scale | 5 min | Rough numbers: users, requests per second, peak, storage. | "I'll assume… tell me if you'd like different numbers." |
| 3. Define the API | 5 min | The main endpoints and what they take and return. | "The core operations are…" |
| 4. Data model | 5 min | Main entities, keys, relationships; which database and why. | "The data is relational because… the key access patterns are…" |
| 5. High-level design | 10 min | A simple diagram of the request flow. Start simple. | "Here's the simplest version that works; then I'll find the bottlenecks." |
| 6. Deep dives | 15 min | The 2–3 hardest parts, in depth: concurrency, scale, failures. | "The crux of this problem is… here are three options and their trade-offs." |
| 7. Wrap up | 5 min | Failures, monitoring, what you'd do next with more time. | "If this component fails… I'd monitor… next I'd improve…" |

If the interviewer steers you, follow them; they're telling you what they want to see.

## C. Back-of-the-envelope math

You don't need precision; you need the right order of magnitude, quickly.

| Handy fact | Value |
|---|---|
| Seconds in a day | 86,400 ≈ **100,000** (10⁵) |
| 1 million requests per day | ≈ **12 per second** on average |
| 100 million per day | ≈ **1,200 per second** |
| Peak vs average | usually **2–10×** (flash sales can be 100×+) |
| 1 KB × 1 million | 1 GB |
| 1 KB × 1 billion | 1 TB |
| 99.9% availability | ≈ 43 minutes of downtime per month |
| 99.99% availability | ≈ 4.3 minutes per month |

**Worked example: TicketRush.** Say these assumptions out loud; the interviewer can change them.

- 2 million daily active users, 20 page views each = 40 M page views/day ≈ **460/s average**, ≈ **4,600/s at peak**. Mostly reads: serve from a CDN and cache.
- Big on-sale: 1 million people join the waiting room for a 60,000-seat stadium. If we admit 2,000 people per minute (\~33/s) and each makes about 3 hold attempts, that's **\~100 seat holds/s**, easily handled by one PostgreSQL primary.
- But the waiting room itself: 1 million browsers checking their position every 5 seconds is **200,000 requests/s**. So the waiting room must be extremely cheap: served from Redis or the edge, or pushed to clients instead of polled. Spotting this is exactly the kind of insight interviewers love.
- Storage: 50,000 events/year × 20,000 seats ≈ 1 billion seat rows/year; at ~100 bytes each that's ~100 GB/year plus indexes. Partition by event or date and archive old events.

## D. Numbers worth remembering

These are rough, order-of-magnitude figures. Real numbers depend on hardware, data and configuration; always say "roughly" and offer to measure.

| Operation | Roughly |
|---|---|
| Read from memory (RAM) | ~100 nanoseconds |
| Random 4 KB read from an SSD | ~20–100 microseconds |
| Network round trip inside one data centre | ~0.5 milliseconds |
| Redis `GET` over the network | ~0.2–1 ms |
| Simple indexed PostgreSQL query (data in memory) | ~1 ms |
| Round trip between continents | ~100–250 ms |

| Component | Rough capacity per node (simple operations) |
|---|---|
| PostgreSQL | thousands to tens of thousands of indexed queries per second |
| Redis | 100,000+ operations per second |
| One Node.js API instance | hundreds to a few thousand requests per second, depending on the work |
| One Kafka/Redpanda partition | tens of MB per second |

## E. A complete worked answer: "Design a ticket booking system"

This is one of the most common system design questions, and you've built every part of it. Here's how to walk through it in an interview.

**1. Clarify.** Functional: search and browse events; view a seat map; hold seats for ~10 minutes; pay; receive tickets; support reserved seats and general admission. Non-functional: **never sell a seat twice** (strong consistency for inventory); survive on-sale spikes of a million users; seat map loads fast (p99 under ~200 ms) and may be a few seconds stale; browsing stays available even if checkout is degraded; fairness in the queue.

**2. Estimate.** As in section C. Key insight: inventory writes are modest once traffic is shaped; the waiting room and seat-map reads are the heavy parts.

**3. API.**

```
GET  /events?q=…                         search (served by a search index)
GET  /events/{id}/seats                  seat map (cached, may be seconds stale)
POST /events/{id}/queue                  join waiting room → position + token
POST /holds        {eventId, seatIds}    requires admission token → {holdId, expiresAt}
POST /holds/{id}/checkout                header Idempotency-Key → order
POST /payments/webhook                   from the payment provider (idempotent)
```

**4. Data model.** Relational (PostgreSQL), because inventory needs transactions and constraints. `events`, `venues`, `seats(event_id, section, row, number, status, held_by, held_until)`, `holds`, `orders`, `order_items`, `payments`, `idempotency_keys`, `outbox`. Seats and holds are partitioned by `event_id`.

**5. High-level design.**

```
clients ─► CDN (static assets, seat-map snapshots)
   │
   ▼
load balancer ─► waiting room (Redis: positions, admission tokens)
   │
   ▼
booking API (stateless, many instances)
   │         ├──► PostgreSQL primary: seats, holds, orders, outbox   (strongly consistent)
   │         ├──► read replicas + cache: seat maps, event pages        (may be stale)
   │         └──► payment provider (idempotency keys, webhooks)
   ▼
outbox / CDC ─► Kafka ─► search index · email/notifications · analytics · AI search
```

**6. Deep dives** (lead with the first one; it's the crux).

- **No double booking.** The bug is check-then-act. Make the claim atomic: `UPDATE seats SET status='held', held_by=?, held_until=now()+10 min WHERE id=? AND (status='available' OR held_until < now())` and require exactly one row updated. Alternatives: `SELECT … FOR UPDATE`, an exclusion constraint on hold time ranges, or a Redis lock with expiry for a per-seat fast path, with the database still as the final judge. **Never decide availability from the cache.**
- **Hold expiry.** Store `held_until`; the claim query treats expired holds as free, so correctness doesn't depend on a cleanup job. A background job just tidies up and refreshes seat maps.
- **The on-sale spike.** Virtual waiting room: users get a queue position and a signed, short-lived admission token; the system admits users at the rate inventory can handle. Seat maps come from cache/CDN and updates are pushed (SSE/WebSocket). Only admitted users reach the database.
- **Checkout and payment.** The client sends an idempotency key; the API passes the same key to the payment provider; webhooks are processed idempotently. One local transaction marks the order paid, the seats sold and writes an outbox event. It's a saga: if payment fails, release the hold; if ticket issuing fails, refund.
- **General admission.** A counter row per ticket type: `UPDATE ticket_types SET sold = sold + 1 WHERE id=? AND sold < capacity`. It's a hot row by design; the waiting room keeps the rate manageable.
- **Failures.** Primary database failover (discuss how much data async replication can lose and whether inventory needs a synchronous replica); payment provider down (circuit breaker, keep the hold, tell the user to retry); duplicate webhooks (deduplicate by event ID); a server freezing during a background job (fencing).

**7. Wrap up.** "I chose correctness over availability for seat claims and availability over freshness for browsing. I'd monitor hold success rate, queue wait time, p99 of the hold endpoint, consumer lag, and an auditor that alerts if any seat is ever sold twice."

**What interviewers look for here:** leading with double booking; separating the read path from the write path; a waiting room for spikes; hold expiry; idempotent payments.
**Common ways candidates lose points:** trusting the cache for availability; holding a database lock while calling the payment provider; a Redis lock with no thought about expiry or fencing; no plan for expired holds; ignoring the spike entirely.

## F. Topics interviews ask that the book only touches

**Caching patterns.**
- *Cache-aside* (most common): read from cache; on a miss, read the database and store the result. On write, update the database, then delete the cache key.
- *Write-through*: write to cache and database together. *Write-behind*: write to cache, flush to the database later (fast, risks loss).
- Set a **TTL** (expiry) so mistakes heal themselves. Beware a **cache stampede**: when a hot key expires, thousands of requests hit the database at once; fix with request coalescing (one request refreshes, others wait), a short lock, or refreshing early.
- Don't use the cache to make correctness decisions (seat availability, balances).

**Load balancing.** Spreads requests across servers: round robin, least connections, or hashing (sticky sessions). Layer 4 balancers route by IP/port; layer 7 balancers understand HTTP paths and headers. Health checks remove broken servers.

**CDN.** Copies static and cacheable content to servers near users, cutting latency and load.

**Rate limiting.** *Token bucket*: a bucket holds up to B tokens, refilled at R per second; each request takes one; empty bucket → reject with `429 Too Many Requests` and a `Retry-After` header. *Sliding window*: count requests in the last N seconds. Implement in Redis with atomic operations so all servers share the count.

**Unique IDs.**
- Database sequences: simple, ordered, but tied to one database.
- UUIDv4: random, no coordination, but scattered inserts hurt B-tree index performance.
- UUIDv7 / ULID: time-ordered UUIDs, good for indexes and generated anywhere (PostgreSQL 18 adds a built-in `uuidv7()`).
- Snowflake-style: timestamp + machine ID + sequence; compact and ordered, but depends on clocks (Module 8).

**Bloom filter.** A tiny structure that answers "definitely not in the set" or "maybe in the set". No false negatives, some false positives. LSM-tree databases use it to skip files that can't contain a key.

**Real-time updates.** Polling (simple, wasteful), long polling (server holds the request until there's news), Server-Sent Events (one-way server push over HTTP, used in Module 11), WebSockets (two-way). For seat maps and queue positions, SSE is often enough.

**Search.** An inverted index maps each word to the list of documents containing it. Search engines (Elasticsearch, OpenSearch, PostgreSQL full-text) are derived data fed from the source of truth (Module 11).

**Location.** Geohashes or quadtrees split the map into cells so "nearby" becomes a prefix or cell lookup; PostGIS adds geo indexes to PostgreSQL.

## G. Other classic questions, mapped to the modules

| Question | The hard part | Modules | Key idea in one line |
|---|---|---|---|
| URL shortener | Unique short codes; huge read traffic | 3, 6, 7 | Unique index decides collisions; cache hot links; partition by code. |
| Rate limiter | Shared, accurate counts across servers | 7, 8 | Atomic counters in Redis (token bucket); fail open or closed by policy. |
| News feed / timeline | Celebrities with millions of followers | 1, 6, 11 | Fan-out on write for normal users, on read for celebrities (hybrid). |
| Chat app | Ordering, offline delivery, receipts | 5, 8, 11 | Partition by conversation for order; at-least-once + dedupe by message ID. |
| Payment system | Never lose or double money | 7, 9, 12 | Idempotency keys, state machine, ledger, reconciliation. |
| Hotel / flight booking | Same as tickets, with date ranges | 7 | Exclusion constraints on date ranges; holds with expiry. |
| Notification system | Many channels, retries, no spam | 9, 11 | Outbox → queue; idempotent senders; per-user rate limits. |
| Distributed cache | Spreading keys, node failures | 5, 6 | Consistent hashing, replication, eviction (LRU), stampede protection. |
| Leaderboard | Fast top-N with constant updates | 3, 6, 10 | Redis sorted sets; partition by game; batch recompute for history. |
| Search autocomplete | Fast prefix lookup, freshness | 3, 10, 11 | Prefix index built in batch, updated by stream. |
| Ride sharing / nearby drivers | Constantly moving locations | 6, 8 | Geo cells (geohash), partition by region, treat locations as stale quickly. |
| Metrics / logging platform | Huge write volume, time queries | 3, 6, 10, 11 | LSM/time-series storage, time partitions, stream ingestion, downsampling. |
| Collaborative editor | Concurrent edits from many devices | 5 | Multi-leader with CRDTs or operational transformation. |
| Web crawler | Billions of URLs, politeness | 10, 6 | Batch frontier, dedupe with Bloom filters, partition by domain. |

## H. Trade-off cheat sheet

| Decision | Choose the first when… | Choose the second when… |
|---|---|---|
| SQL vs NoSQL | relationships, transactions, flexible queries | simple key lookups at huge scale, or flexible self-contained documents |
| Normalize vs denormalize | data changes often; consistency matters | a hot read path is measured to be slow |
| Sync vs async replication | losing a confirmed write is unacceptable | write latency and availability matter more |
| Strong vs eventual consistency | money, inventory, uniqueness, locks | feeds, counts, search, browsing |
| Pessimistic vs optimistic locking | conflicts are frequent and short | conflicts are rare; edits are long |
| Range vs hash partitioning | you need range scans; keys don't arrive in order | you need an even spread; point lookups |
| Cache-aside vs write-through | read-heavy, misses are acceptable | reads must almost always hit fresh cache |
| Fan-out on write vs on read | most users have few followers | a few users have huge audiences |
| Polling vs push (SSE/WebSocket) | updates are rare; simplicity wins | updates are frequent; latency matters |
| Queue (RabbitMQ) vs log (Kafka) | task distribution, no replay needed | ordered events, replay, many consumers |
| Batch vs stream | completeness and simplicity | freshness in seconds |
| REST vs gRPC | public, browser-facing APIs | internal, high-throughput service calls |
| 2PC vs saga | almost never across services | multi-step business processes across services |

## I. Talking about your POCs (behavioural questions)

Interviewers often ask "Tell me about a time you…". Your POCs give you real stories. Use **STAR**: Situation, Task, Action, Result, with a number in the result.

**Example (Module 7):** "*Situation:* in our ticketing prototype, seat holds looked fine in manual testing. *Task:* I wanted to prove a seat can't be sold twice. *Action:* I wrote a test that fired 50 simultaneous hold requests. All 50 succeeded on the naive code, and wrapping it in a transaction still let 20 through. I compared four fixes under load: an atomic conditional update, row locks, an exclusion constraint and serializable isolation. *Result:* every fix allowed exactly one hold; we chose the atomic update for its speed and simplicity, and the test now runs in CI."

Other stories you'll have: the "disappearing hold" caused by replica lag (Module 5), the retry storm you stopped with backoff and a circuit breaker (Module 8), the double charge you prevented with idempotency keys (Module 12), the zero-downtime column rename (Module 4).

**Phrases that help you think out loud:**
- "Let me first make sure I understand the requirements…"
- "The rule that must never break here is…"
- "I'll assume … — tell me if you'd like a different assumption."
- "The trade-off is X versus Y. Given Z, I'd choose…"
- "Let's start simple and find the bottleneck."
- "What happens when this part fails?"
- "This is something I'd load test before deciding."

## J. Red flags to avoid

- Jumping into boxes and brand names before clarifying requirements.
- Sharding, microservices and Kafka for a system with 100 requests per second.
- "Exactly-once delivery" or "the network is reliable".
- Ignoring concurrency on anything involving money or inventory.
- Saying "it depends" without saying what it depends on and what you'd choose.
- Never mentioning failure, monitoring or how you'd test it.

## K. Last-night revision sheet

1. Describe load with the number that hurts; measure p99, not the average.
2. Every remote call: timeout, capped backoff with jitter, circuit breaker, fallback.
3. Relationships + transactions → relational; documents for self-contained data.
4. Index = faster reads, slower writes. Composite: equality columns first.
5. B-tree: in-place pages + WAL. LSM: memory → sorted files → merge.
6. OLTP on the primary; analytics on a copy, columnar.
7. Rolling deploys mean old and new code overlap: backward + forward compatible.
8. Schema changes: expand → dual write → backfill → switch → contract.
9. Replication scales reads, not writes. Async can lose the latest writes.
10. Lag anomalies: read-your-writes, monotonic reads, consistent prefix.
11. Quorum: w + r > n.
12. Shard key: in most queries, spreads evenly; watch hot keys; never `% N`.
13. Postgres default READ COMMITTED: check-then-act still races.
14. Fixes: atomic `UPDATE … WHERE`, `FOR UPDATE`, constraints, SERIALIZABLE + retry.
15. Write skew: different rows, same rule.
16. No external calls while holding locks.
17. You can't tell slow from dead. Clocks drift. Processes pause.
18. Locks expire: use fencing tokens.
19. CAP: during a partition, consistency or availability. PACELC: otherwise latency vs consistency.
20. Consensus: leader + majority + terms; odd cluster sizes.
21. Avoid 2PC across services; use outbox + saga.
22. Batch: immutable input, versioned output, atomic switch, re-runnable.
23. Kafka: order per partition by key; consumers replay from offsets.
24. No dual writes: CDC or outbox. At-least-once + idempotency = exactly-once effect.
25. Idempotency keys come from the client and travel through every hop.
26. Integrity over timeliness. Audit your invariants.

---

# Part 4 · Capstone, templates and checklists

## Capstone: TicketRush 1.0 and game day

**Duration:** 3–4 weeks · **Goal:** one deployable system that meets every invariant from the twelve modules, proven with numbers, and survives a live game day.

### Squads

| Squad | Owns |
|---|---|
| Core API & correctness | Holds, checkout, idempotency, sagas, concurrency tests (Modules 7, 9, 12) |
| Data pipeline | Outbox/CDC, search indexer, embedder, idempotent consumers (Modules 9, 11, 12) |
| Platform & reliability | Replication, read routing, partitioning, chaos, observability (Modules 1, 5, 6, 8) |
| Analytics | Nightly batch, live dashboard, reconciliation (Modules 3, 10, 11) |

### Acceptance criteria

Record your hardware next to every performance number, since laptop results vary widely.

| # | Requirement | Target | How you prove it |
|---|---|---|---|
| 1 | No seat sold twice | 0 duplicates under 2,000 concurrent hold attempts on 100 seats | Concurrency test + auditor |
| 2 | General admission never oversold | 0 over capacity with 3× demand | Concurrency test + auditor |
| 3 | Hold latency | p99 < 300 ms at 300 holds/s | k6 report |
| 4 | Read-your-writes | 100% of "my holds" reads show the user's latest hold, with a 5 s replica delay | Automated test |
| 5 | Exactly-once payment effect | 0 duplicate charges across 1,000 retried checkouts with injected timeouts and crashes | Module 12 harness |
| 6 | Primary failure | Service restored in < 60 s; acknowledged-order loss measured and documented | Failover drill |
| 7 | Dependency failure | Pricing black-holed: checkout still works with a degraded price display | Toxiproxy run |
| 8 | Hot on-sale isolation | 10× traffic to one event: other events' p99 within SLO | k6 + waiting room |
| 9 | Derived views | Search and embeddings rebuilt from scratch for 100k events in < 10 min; freshness p99 < 5 s | Replay run |
| 10 | Batch | Nightly stats deterministic (checksum) and rollback in < 1 min | E1/E2 from Module 10 |
| 11 | Observability | Every SLO on a dashboard; every alert has a runbook | Review |
| 12 | Privacy | User deletion removes them from every derived store within 1 hour | Auditor |

### Game day script (2 hours)

Roles: a **game master** who injects faults (secretly), an **incident commander**, a **scribe**, and **responders** who may only use dashboards, logs and runbooks.

| Time | Injection | Expected behavior |
|---|---|---|
| T+0 | Baseline k6 mix: 80% browse, 15% hold, 5% checkout | All SLOs green |
| T+10 | 800 ms latency on Postgres (Toxiproxy) | Timeouts fire, degraded but no pile-up |
| T+25 | Stop the primary | Failover; writes resume; losses counted |
| T+45 | `kill -STOP` the outbox relay for 5 minutes, then `kill -CONT` | Outbox alert fires; backlog drains; no duplicate emails |
| T+60 | Black-hole the pricing service | Circuit opens; fallback prices shown |
| T+75 | On-sale spike: 10× hold traffic to one event | Waiting room engages; other events unaffected |
| T+90 | `TRUNCATE event_search` | Auditor alerts; rebuild from the log |
| T+105 | Retro | Blameless write-up with timeline and action items |

### Demo day

Each squad gives a 10-minute talk: the invariant, the design, one failure they caused, and the numbers. Publish the blog series and the recorded sessions internally so new joiners can work through the playbook on their own.

---

## Appendices

### A. POC README template

```markdown
# Module NN — <title>

## Invariant
<One sentence that must always be true.>

## Design
<Diagram or 5–10 lines. Link to ADRs.>

## Run it
docker compose -f infra/compose.base.yml [-f infra/compose.mNN.yml] up -d
npm run migrate && npm run start:mNN

## Prove it
npm run test:mNN            # includes the concurrency / failure tests
k6 run load/mNN.js

## Break it
| # | Experiment | Command | What happened | Why |
|---|---|---|---|---|

## Results
| Scenario | p50 | p95 | p99 | Errors | Throughput | Notes |
|---|---|---|---|---|---|---|
Hardware: <CPU, RAM, disk>

## What I'd do differently in production
```

### B. Architecture Decision Record (ADR) template

```markdown
# ADR-NNN: <decision>
Date: YYYY-MM-DD · Status: proposed | accepted | superseded by ADR-MMM

## Context
<The problem, constraints, and the numbers that matter.>

## Options considered
1. <Option> — pros / cons / measured result
2. <Option> — pros / cons / measured result

## Decision
<What we chose and the one-sentence reason.>

## Consequences
<What gets easier, what gets harder, what we must monitor, when we'd revisit.>
```

### C. Blog post template

```markdown
# <Title that names the problem, not the technology>

**TL;DR:** <Three sentences: the problem, the fix, the measured result.>

## The problem
<A concrete story. A failing test, a graph, an incident.>

## Why it happens
<The concept from DDIA, in your own words, with one diagram.>

## What we tried
<Each approach with code and its measured result.>

## What we chose and why
<Trade-offs, honestly.>

## Try it yourself
<Link to the POC and the exact commands.>

## Further reading
<Book chapter and page, plus one or two primary sources.>
```

Rules for every post: one idea per post; every claim backed by your own measurement; code that runs as shown; no copied passages from the book (summarize and cite the chapter); a teammate reviews before publishing.

### D. Training session template (90 minutes)

| Time | Segment | Facilitator notes |
|---|---|---|
| 0–10 | **Hook**: a live failure or a surprising graph | Make people guess before you reveal |
| 10–30 | **Concepts**: at most four ideas, drawn on a whiteboard | No slides full of text |
| 30–55 | **Live demo**: break it, then fix it | Rehearse twice; have a recording as backup |
| 55–80 | **Hands-on exercise** in pairs, applied to *our* systems | Prepare a starter branch |
| 80–90 | **Discussion + action items** | Write down one real change to make in our codebase |

Send the chapter's "read closely" sections one week before. Record the session. Collect three questions people still have and answer them in the next session.

### E. Design review checklist (use on every PR and design doc, including AI-generated code; it doubles as an interview self-check)

**Data model and storage**
- [ ] Which access patterns does this serve, and is the model (relational/JSONB/graph) chosen for them?
- [ ] Is there an index for every new query on a hot path, and have you checked `EXPLAIN`?
- [ ] Is money stored in integer minor units and are IDs safe from JavaScript number precision loss?

**Concurrency and correctness**
- [ ] What happens if two of these requests run at the same time? Is there a test for it?
- [ ] Is every invariant enforced by the database (constraint, atomic update, lock, isolation level)?
- [ ] Is there any check-then-act across separate statements without protection?
- [ ] Are external calls made outside of transactions that hold locks?
- [ ] Is retried code free of side effects?

**Failure handling**
- [ ] Does every network call have a timeout? Are retries bounded, jittered and only for idempotent operations?
- [ ] What does the user see if this dependency is slow, down, or black-holed?
- [ ] If this succeeds remotely but the response is lost, can the client safely retry (idempotency key)?
- [ ] Does any logic depend on wall-clock ordering across machines?
- [ ] If this runs on N instances, is it still correct (locks, leader election, fencing)?

**Replication and partitioning**
- [ ] Is each read allowed to be stale? If not, is it routed to the primary or LSN-gated?
- [ ] Does this introduce a hot key or a query without the partition key?

**Evolution**
- [ ] Is this change backward and forward compatible during a rolling deploy?
- [ ] Do migrations follow expand/contract with `lock_timeout` and batched backfills?
- [ ] Are message and API schemas versioned and tolerant of unknown fields?

**Derived data and events**
- [ ] Is there a dual write? Should it be an outbox or CDC instead?
- [ ] Are consumers idempotent? Can the derived view be rebuilt from the log?

**Operations and privacy**
- [ ] Are there metrics (percentiles), structured logs with request IDs, and an alert with a runbook?
- [ ] Does this add personal data anywhere new (logs, caches, indexes, embeddings)? Can it be deleted?

### F. PostgreSQL cheat sheet

```sql
-- Top queries by total time (needs pg_stat_statements)
SELECT calls, round(mean_exec_time::numeric, 1) AS mean_ms,
       round(total_exec_time::numeric) AS total_ms, left(query, 80) AS query
FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;

-- Who is blocked, and by whom
SELECT pid, pg_blocking_pids(pid) AS blocked_by, state,
       now() - xact_start AS xact_age, left(query, 60) AS query
FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) > 0;

-- Oldest open transactions (they block vacuum and hold locks)
SELECT pid, now() - xact_start AS age, state, left(query, 60) AS query
FROM pg_stat_activity WHERE xact_start IS NOT NULL ORDER BY xact_start LIMIT 10;

-- Dead tuples and autovacuum
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 10;

-- Unused indexes
SELECT relname, indexrelname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes WHERE idx_scan = 0 ORDER BY pg_relation_size(indexrelid) DESC;

-- Replication (on primary) and replication slots
SELECT application_name, state, sync_state, replay_lag FROM pg_stat_replication;
SELECT slot_name, active,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal
FROM pg_replication_slots;

-- Replica lag (on replica)
SELECT now() - pg_last_xact_replay_timestamp() AS replay_lag;

-- Safe DDL session settings
SET lock_timeout = '3s';
SET statement_timeout = '15min';
```

| SQLSTATE | Meaning | Typical handling |
|---|---|---|
| `23505` | unique_violation | 409 Conflict, or treat as "already done" |
| `23503` | foreign_key_violation | 422 / 404 |
| `23514` | check_violation | 422 |
| `23P01` | exclusion_violation | 409 (overlapping hold) |
| `40001` | serialization_failure | Retry the whole transaction |
| `40P01` | deadlock_detected | Retry; fix lock ordering |
| `57014` | query_canceled (statement timeout) | 503 / investigate the query |
| `55P03` | lock_not_available (lock_timeout, NOWAIT) | Retry later; DDL: try again off-peak |

### G. Glossary

| Term | Meaning in one line |
|---|---|
| Backward compatibility | New code can read data written by old code. |
| Forward compatibility | Old code can read data written by new code, ignoring what it doesn't know. |
| B-tree | Sorted, page-based index updated in place; the default in PostgreSQL. |
| LSM-tree | Write-optimized storage of sorted immutable files merged in the background. |
| WAL | Write-ahead log: changes are logged before being applied, for crash recovery and replication. |
| Compaction | Rewriting log files to drop overwritten and deleted values. |
| Replication lag | How far a follower is behind the leader. |
| Read-your-writes | A user always sees their own latest writes. |
| Monotonic reads | A user never sees data go back in time between reads. |
| Consistent prefix | Readers see writes in an order that makes causal sense. |
| Split brain | Two nodes both believe they are the leader. |
| Quorum | The minimum number of replicas that must respond for an operation to count. |
| Partition (shard) | A subset of the data owned by one node. |
| Hot spot | A partition or key receiving disproportionate load. |
| Snapshot isolation | Each transaction reads from a consistent point-in-time snapshot (Postgres REPEATABLE READ). |
| Write skew | Two transactions read the same condition and write different rows, jointly breaking a rule. |
| SSI | Serializable snapshot isolation: optimistic serializability that aborts conflicting transactions. |
| Fencing token | A monotonically increasing number that lets storage reject writes from stale lock holders. |
| Linearizability | The system behaves as if there is one copy of the data and operations are instantaneous. |
| Consensus | Several nodes agreeing on a value despite failures (Raft, Paxos). |
| 2PC | Two-phase commit: atomic commit across participants, blocking if the coordinator fails. |
| Outbox | Writing events to a table in the same transaction as the business change, then publishing them. |
| Saga | A multi-step process of local transactions with compensating actions on failure. |
| CDC | Change data capture: turning the database's change log into a stream. |
| Event sourcing | Storing immutable events as the source of truth and deriving state from them. |
| Derived data | Any data that can be recomputed from a source (caches, indexes, views, embeddings). |
| Event time | When something happened, as opposed to when it was processed. |
| Watermark | A point in event time before which you assume all events have arrived. |
| Idempotency | Doing something twice has the same effect as doing it once. |
| Tail latency | The slowest requests (p99, p99.9), which dominate user experience at scale. |

### H. Progress tracker

| Module | Owner | Read | POC built | Broken on purpose | Measured | Interview Qs said aloud | Blog published | Session held | Date |
|---|---|---|---|---|---|---|---|---|---|
| 1 Reliability | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 2 Data models | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 3 Storage | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 4 Encoding | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 5 Replication | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 6 Partitioning | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 7 Transactions | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 8 Distributed trouble | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 9 Consensus | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 10 Batch | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 11 Streams | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| 12 Together | | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Capstone | | — | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |

### I. Further reading

- **The book's own references.** Every chapter ends with a long reference list; for each module, pick one primary source and read it.
- **Martin Kleppmann's distributed systems lecture course** (University of Cambridge), with free videos and notes. A perfect companion to Modules 8 and 9.
- **Jepsen analyses** (jepsen.io): real databases tested against the guarantees they claim.
- **PostgreSQL documentation, "Concurrency Control" chapter**: MVCC, isolation levels and explicit locking, precisely.
- **"Use The Index, Luke"** by Markus Winand: SQL indexing explained for developers.
- **"The Log: What every software engineer should know about real-time data's unifying abstraction"** by Jay Kreps.
- **Google's *Site Reliability Engineering* book** (free online): SLOs and error budgets.
- **AWS Builders' Library, "Timeouts, retries, and backoff with jitter."**
- **Stripe's engineering writing on idempotency keys** for API design.
- **The Raft paper** ("In Search of an Understandable Consensus Algorithm", Ongaro and Ousterhout) and raft.github.io.
- **Debezium documentation** on the PostgreSQL connector and the outbox event router.
- **The second edition of DDIA** (Kleppmann and Riccomini, O'Reilly, March 2026). Use the module table at the start of this guide to find the matching chapters.
- **Practice designing systems out loud.** Pick a question from Part 3, section G, set a 45-minute timer, and explain your design to a teammate using the 7-step framework.
---

*Work through one module at a time, measure everything, and teach what you learn. By the end, your team won't just use databases, queues and caches; you'll know exactly what they promise, where those promises break, and how to build systems that stay correct when they do.*
