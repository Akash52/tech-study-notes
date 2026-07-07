# Multiplexing, Demultiplexing & Connection Pooling — Lecture Breakdown

---

## 1. THE GIST

This lecture covers how connections are managed and shared between clients and servers — a concept called multiplexing. HTTP/1.1 opens up to 6 TCP connections per domain and dedicates each one to a single request, which means you can hit a hard ceiling fast. HTTP/2 solves this by multiplexing multiple requests over a single connection as independent streams. Connection pooling is the database-tier version of the same idea: keep a fixed number of warm connections open and route queries through them instead of opening a new connection per request. Understanding this saves you from mysterious request stalls, slow DB queries, and misdiagnosed production bottlenecks.

---

## 2. THE BREAKDOWN

### What Multiplexing Actually Means
**Multiplexing** = many signals merged into one channel.
**Demultiplexing** = one channel split back out into many signals.

In networking terms:
- **Mux**: 3 client requests → collapsed into 1 TCP connection → sent to server
- **Demux**: 1 TCP connection from server → split into 3 responses → delivered to correct clients

This shows up at every layer of the stack.

### HTTP/1.1 — The Painful Reality
- Browser opens **max 6 TCP connections per domain** (Chrome's hard limit)
- Each connection handles **one request at a time**
- 6 requests in flight = ceiling hit = every subsequent request **stalls** in queue
- This is why SSE connections from the previous lecture are dangerous — each one permanently occupies a slot

**Pipelining** was HTTP/1.1's attempted fix (send multiple requests without waiting for responses). It was so buggy and poorly supported that nobody uses it.

### HTTP/2 — Multiplexing Done Right
- **One TCP connection per domain**, always
- Requests are split into **streams** — independent, numbered, interleaved
- All streams share the one TCP connection, managed by the protocol
- Chrome can handle ~100+ concurrent streams over that single connection
- Trade-off: the server CPU now has to multiplex/demultiplex all those streams — more throughput, more CPU cost per connection

### The Reverse Proxy Multiplexing Pattern
A common production setup:
```
Client ──(HTTP/1.1, 3 TCP conns)──→ Nginx/Envoy ──(HTTP/2, 1 TCP conn)──→ Backend
```
The proxy accepts old-style multiple connections from the client, then multiplexes them into a single HTTP/2 connection toward the backend. Best of both worlds — backward compatibility + efficient backend comms.

### Demux in the Proxy (Flip Side)
The proxy can also do the reverse — receive one HTTP/2 multiplexed connection and **demultiplex** it into separate backend connections, one per request. This gives each request its own flow control and congestion control, so a slow request doesn't block a fast one.

### Connection Pooling — Multiplexing for Databases
Opening a DB connection is expensive (TCP handshake + auth + SSL). Connection pooling solves this:

1. At startup, open **N connections** to the DB (the pool)
2. Each incoming request grabs a **free connection** from the pool
3. After the query completes, the connection is returned — not closed
4. If all N connections are busy, new requests **wait in queue**

This is structurally identical to multiplexing: many application requests funneled through a fixed set of connections.

### Why You Can't Just Pipeline SQL Queries
If you send 3 queries on the same connection, responses can come back out of order (fast query finishes before slow one). Without request tagging, you have no idea which response matches which query — you're flying blind. PostgreSQL 14+ added pipeline support (tagged, ordered responses), but it's still not the default pattern most ORMs use.

---

## 3. ENGINEER'S NOTEBOOK

**Core idea:** Connections are expensive. Multiplexing and pooling let you share them intelligently — many logical requests over fewer physical connections.

**Key moving parts:**
- **HTTP/1.1**: up to 6 TCP connections/domain, 1 request per connection at a time
- **HTTP/2**: 1 TCP connection, N concurrent streams via multiplexing
- **Reverse proxy**: translates between the two worlds, often muxing on the backend
- **Connection pool**: fixed set of warm DB connections; requests queue if pool is exhausted
- **Stream**: HTTP/2's unit of a single request/response within a shared connection

**Gotchas:**
- **SSE + HTTP/1.1 = connection starvation** — each SSE request permanently holds one of your 6 slots. Open 6 SSE streams and your page can't load CSS or make API calls
- **Pool exhaustion looks like app slowness** — requests don't error, they just hang waiting for a free connection. This is often misread as a "slow database" when it's actually a pool config problem
- **HTTP/2 head-of-line blocking at TCP layer** — if a TCP packet is dropped, all streams on that connection stall waiting for retransmission. HTTP/3 (QUIC) fixes this with UDP-based streams that are truly independent
- **Django's single connection per thread** — Django doesn't pool by default; you're limited by your thread count. Use PgBouncer or similar in front of Postgres at scale
- **Connection pool size is not "bigger = better"** — Postgres has a per-connection memory cost. Too many connections = OOM on the DB server. A small pool + a connection pooler (PgBouncer) is often better than a huge pool

**Terms worth knowing:**
- **Multiplexing** — Combining multiple signals/requests into a single channel
- **Demultiplexing** — Splitting a single channel back into its original separate signals
- **Stream (HTTP/2)** — A single independent request/response pair within a shared TCP connection; identified by a stream ID
- **Connection Pool** — A pre-initialized set of reusable connections; requests borrow and return connections instead of opening new ones
- **Pool Exhaustion** — All connections in the pool are occupied; new requests queue or timeout
- **Head-of-Line Blocking** — A slow or stalled request blocks everything behind it in the same queue/connection
- **PgBouncer** — A lightweight PostgreSQL connection pooler; sits between app and DB, massively reduces connection overhead
- **QUIC/HTTP/3** — UDP-based protocol where each stream is truly independent; no TCP-level head-of-line blocking

**Don't forget this:**
- HTTP/2 = 1 TCP connection, not 1 request. The streams inside are logical, not physical
- Pool size should match DB capacity, not app concurrency. Common mistake: set pool=100 because you have 100 workers, then watch Postgres run out of memory
- SSE on HTTP/1.1 in production is a footgun — always verify HTTP/2 is enabled
- Connection pool wait time showing up in your traces = time to increase pool size or optimize query duration
- Multiplexing gives throughput; demultiplexing gives isolation. Sometimes you want both at different layers

---

## 4. QUICK REFERENCE CARD

```
MULTIPLEXING & CONNECTION POOLING — QUICK REF
─────────────────────────────────────────────────
Multiplexing:   many requests → 1 connection
Demultiplexing: 1 connection → many requests/clients

HTTP/1.1:
  Max connections: 6 per domain (Chrome)
  Requests per connection: 1 at a time
  Risk: connection starvation (SSE, long poll)

HTTP/2:
  Connections: 1 per domain
  Streams: ~100+ concurrent, multiplexed
  Cost: higher CPU on server to mux/demux
  Win: no 6-connection ceiling

Common proxy pattern:
  Client──(HTTP/1.1, N conns)──Nginx──(HTTP/2, 1 conn)──Backend

Connection Pooling:
  Pool = fixed set of warm DB connections
  Request → borrow connection → query → return connection
  Pool full → request waits in queue

Pool sizing rule of thumb:
  pool_size = (core_count * 2) + effective_spindle_count
  (from PgBouncer / HikariCP docs)

Head-of-line blocking:
  HTTP/1.1 → per connection
  HTTP/2   → at TCP packet level
  HTTP/3   → eliminated (QUIC/UDP)
─────────────────────────────────────────────────
```

---

## 5. THE "AHA" MOMENT

**The Tollbooth Highway**

Picture a highway with 6 toll lanes feeding into a city. That's HTTP/1.1. Each lane handles one car at a time. If 6 cars pull up to pay, the 7th car has to wait on the ramp — even if some tolls take 10 minutes because someone's searching for change. The road is blocked. This is exactly what happens when your SSE connections eat all 6 lanes.

**HTTP/2 is a single express lane with a really smart traffic controller.** One lane — but the controller can let 50 cars partially through simultaneously, interleaving them, and each car gets flagged with a number so the city knows which car goes to which address. The throughput is way higher, but now the traffic controller (your CPU) is doing a lot more coordination work.

**Connection pooling is the carpool parking lot.** Instead of every employee driving their own car to the DB (expensive, slow, limited parking), the company runs a fixed fleet of 10 shuttle buses. Every employee request hops on a free bus, gets delivered, and the bus comes back for the next person. If all 10 buses are out? You wait at the stop. That wait time in your traces? That's pool exhaustion.

---

## 6. SHOW ME THE CODE

```javascript
// ─────────────────────────────────────────────────────
// CONNECTION POOLING — Node.js with PostgreSQL (pg library)
// npm install pg
//
// Demonstrates: pool creation, request handling, exhaustion behavior
// ─────────────────────────────────────────────────────

const { Pool } = require("pg");

// ── Create the pool at startup, NOT per request ──────
// WHY: creating a new connection per query costs ~50-100ms
// (TCP handshake + auth + SSL). A pool pays this cost ONCE.
const pool = new Pool({
  host: "localhost",
  database: "myapp",
  user: "postgres",
  password: "secret",
  port: 5432,

  // Max connections in the pool
  // WHY NOT higher: Postgres has memory cost per connection (~5-10MB)
  // Too many = DB OOM. Match this to DB capacity, not app concurrency.
  max: 10,

  // How long a request waits for a free connection before erroring
  // WHY: without this, requests queue forever → silent hang
  connectionTimeoutMillis: 3000,

  // How long an idle connection stays open before being closed
  // WHY: keeps the pool warm without holding connections DB doesn't need
  idleTimeoutMillis: 30000,
});

// ── Pool events — always wire these in production ────
pool.on("connect", () => console.log("New DB connection established"));
pool.on("error", (err) => console.error("Idle connection error:", err.message));

// ── Query helper — borrow, query, return ─────────────
async function query(sql, params = []) {
  // pool.query() automatically:
  //   1. Picks a free connection from the pool
  //   2. Executes the query
  //   3. Returns the connection to the pool
  // If no connection is free → waits up to connectionTimeoutMillis
  const start = Date.now();

  try {
    const result = await pool.query(sql, params);
    console.log(`Query took ${Date.now() - start}ms | Pool: ${pool.totalCount} total, ${pool.idleCount} idle, ${pool.waitingCount} waiting`);
    return result.rows;
  } catch (err) {
    // "timeout exceeded when trying to connect" = pool exhaustion
    // Action: increase pool size OR optimize slow queries holding connections
    if (err.message.includes("timeout")) {
      console.error("POOL EXHAUSTED — all connections busy");
    }
    throw err;
  }
}

// ── Simulate concurrent requests hitting the pool ────
async function simulateConcurrentLoad() {
  console.log("\n── Firing 15 concurrent queries against pool of 10 ──");

  const queries = Array.from({ length: 15 }, (_, i) =>
    query("SELECT pg_sleep(1), $1::text as request_id", [`req-${i + 1}`])
      .then(() => console.log(`req-${i + 1} ✓ complete`))
      .catch((err) => console.error(`req-${i + 1} ✗ failed: ${err.message}`))
  );

  // First 10 execute immediately (pool has 10 connections)
  // Requests 11-15 queue and wait for a free connection
  // If any wait > 3000ms → connectionTimeoutMillis fires
  await Promise.all(queries);
}

// ── Manual connection for transactions ───────────────
// Use pool.connect() when you need multiple queries in one transaction
// WHY: pool.query() returns connection immediately after each query
// For transactions, you need to HOLD the same connection across queries
async function runTransaction(userId, amount) {
  const client = await pool.connect(); // explicitly borrow a connection

  try {
    await client.query("BEGIN");
    await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, userId]);
    await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, 999]);
    await client.query("COMMIT");
    console.log("Transaction committed");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Transaction rolled back:", err.message);
    throw err;
  } finally {
    // ── CRITICAL: always release, even on error ───
    // WHY: if you forget this, the connection is never returned to the pool
    // Pool slowly drains to 0 available → complete stall
    client.release();
  }
}

// ── Graceful shutdown ────────────────────────────────
// Always drain the pool on shutdown
// WHY: abruptly killing connections can leave transactions open on the DB
process.on("SIGTERM", async () => {
  console.log("Draining connection pool...");
  await pool.end();
  console.log("Pool closed. Bye.");
  process.exit(0);
});

simulateConcurrentLoad();

// ─────────────────────────────────────────────────────
// WHAT TO WATCH:
// - "Pool: X total, Y idle, Z waiting" in logs
// - Z (waiting) > 0 = pool pressure, consider tuning max
// - Frequent "POOL EXHAUSTED" = increase max OR fix slow queries
// - Transaction that never calls client.release() = connection leak
// ─────────────────────────────────────────────────────
```

---

## 7. WHERE YOU'LL SEE THIS IN THE WILD

**Every database-backed web service** uses connection pooling. PgBouncer is the standard in front of Postgres at scale — it sits between your app servers and the DB, maintains a small pool of real connections, and multiplexes thousands of app-level "connections" through them. Without it, 100 app server instances × 10 pool connections each = 1000 Postgres connections = out of memory.

**Nginx as HTTP/2 terminator** — Nearly every production setup has Nginx or Envoy accepting HTTP/2 from clients and either passing it through or demultiplexing it to HTTP/1.1 backends. This is the proxy mux/demux pattern from the lecture, running in prod right now on most major websites.

**gRPC** is built entirely on HTTP/2 multiplexing. A single gRPC connection between microservices carries thousands of concurrent RPC calls as independent streams. This is why gRPC is preferred over REST for high-throughput internal service communication.

**HikariCP (Java/Spring)** — The gold-standard connection pool for JVM apps. Its default pool size formula (`(core_count * 2) + spindle_count`) is the most cited pool sizing heuristic in backend engineering. Your Spring Boot app is using it right now.

**AWS RDS Proxy** — Amazon's managed connection pooler for RDS. Serverless functions (Lambda) are the worst offenders for connection exhaustion — each Lambda invocation tries to open its own DB connection, and with thousands of concurrent invocations you'll exhaust Postgres instantly. RDS Proxy sits in front and pools them.

**Redis connection pools** — Same problem, same solution. Node.js apps using `ioredis` or `redis` maintain a pool of connections to Redis. Fire-and-forget commands get multiplexed over the pool without opening new sockets.

**HTTP/3 (QUIC) in production** — Google, Cloudflare, and most major CDNs already serve HTTP/3. The reason it matters: true stream independence at the transport layer eliminates the last remaining head-of-line blocking problem that HTTP/2's TCP foundation couldn't solve.

---

## 8. EXPLAIN IT TO MY NON-TECH FRIEND

Imagine a busy office building with only **6 revolving doors** at the entrance.

During normal hours, people flow in and out fine. But imagine someone decides to walk *very slowly* through one door — just standing in it, not moving. That door is now blocked. If 6 slow people occupy all 6 doors at once, everyone else piles up outside. Doesn't matter how urgent their meeting is — they're stuck waiting.

That's your browser with HTTP/1.1. Six doors (connections). Anything that hogs a door blocks everyone else.

**HTTP/2 is a single giant automatic sliding door** that can let 50 people through simultaneously, shuffling them around each other intelligently. One door — way more people getting through — but the security guard (your server's CPU) is working much harder to manage the flow.

**Connection pooling is the office coffee machine.** Making a fresh pot of coffee every time someone wants a cup takes forever. So instead, the office keeps 10 cups of coffee hot and ready at all times. Someone wants coffee? Grab a cup, drink it, put it back for washing. If all 10 cups are in use, you wait by the machine until one comes back. The pool *is* those 10 cups — always warm, always ready, never wasted on making a fresh pot for every single request.

The big lesson: physical connections are expensive to make. Smart engineers reuse them.
