# Short Polling — Lecture Breakdown

---

## 1. THE GIST

Short polling is the simplest pattern for tracking long-running async work: client submits a job, gets back an ID immediately, then repeatedly asks "is it done yet?" on a timer until the answer is yes. It's easy to build, works everywhere, and lets clients safely disconnect and reconnect since the job state lives on the server. The critical trade-off is chattiness — at scale, the vast majority of polls return "not done yet," which means most of your network traffic and backend CPU is pure waste. It's the right default for simple async workflows, but it breaks down fast under load, which is exactly why long polling and pub/sub exist.

---

## 2. THE BREAKDOWN

### The Problem It Solves
Plain request-response forces the client to stay connected for the entire duration of a long job. If the job takes 10 minutes and the client disconnects at minute 3, the response is gone. Short polling decouples submission from result delivery:

```
Naive:   Client → [waits 10 minutes blocked] → Result
Polling: Client → Submit → gets jobId → disconnects
         Client → reconnects → polls every N seconds → Result when ready
```

The job state now lives on the server, not in the connection.

### The Full Flow
```
1. POST /submit          → Server queues job, returns { jobId }  [immediate]
2. Client saves jobId    → to memory, disk, wherever
3. GET /status?id=jobId  → Server checks: returns { progress: 40% } [fast]
4. GET /status?id=jobId  → { progress: 70% }
5. GET /status?id=jobId  → { progress: 100%, result: "..." }  [done]
```

Steps 3-5 are the "short polls" — each is a complete, independent request-response cycle. The "short" in short polling means the server responds immediately with current status, not that the requests are infrequent.

### Why It's "Chatty" and Why That Actually Matters

Say you have 10,000 concurrent users, each with a job in flight, polling every 3 seconds:

```
10,000 users × (60s / 3s) = 200,000 requests/minute
```

If average job takes 5 minutes, and only the last poll actually returns a result:

```
200,000 req/min × 5 min = 1,000,000 total requests
Of those: ~999,900 return "not done yet"  ← pure waste
```

At cloud pricing, this is real money. At traffic volume, this congests your network and burns backend CPU on checks that return nothing useful. The backend still has to parse the request, look up the job, serialize the response — even for a useless "not ready" answer.

### The Polling Interval Trade-off
```
Short interval (1s)  → low latency when job completes, high chattiness
Long interval (30s)  → low chattiness, high latency on completion
```

There's no right answer — it depends on how time-sensitive the result is and how much traffic you can absorb. This is why the interval is a configuration knob, not a hardcoded value.

### Key Design Decision: Where Does Job State Live?
The server must store job state somewhere persistent enough to survive the answer to "is it done?" Options:

- **In-memory** (Map/dict) — simplest, dies on server restart, doesn't work with multiple backend instances
- **Database** (Postgres, MySQL) — durable, queryable, works with multiple backends, adds latency
- **Cache** (Redis) — fast, TTL-based cleanup, works across instances, standard choice in production

The in-memory version from the demo is fine for a single-server demo. In production, Redis is the standard.

### The Reconnect Feature (Underrated)
Because the job state is server-side and the client just holds a jobId, the client can:
- Save the jobId to disk before disconnecting
- Crash and restart
- Switch devices
- Come back hours later and resume polling

This is genuinely useful — YouTube's upload system works exactly this way with a resumable upload ID.

### Job Retention — The Forgotten Detail
How long does the server keep completed job results? If you never clean them up, your job store grows forever. If you clean too aggressively, a slow client that reconnects after 10 minutes gets a 404. Standard approach: TTL-based expiry (Redis does this natively). Set it based on how long you're willing to support reconnect-and-resume.

---

## 3. ENGINEER'S NOTEBOOK

**Core idea:** Submit job → get ID → repeatedly ask "done?" → get result when ready. Three independent concerns: submission, processing, and status checks. Each is a normal request-response.

**Key moving parts:**
- **Job ID** — the handle tying all three concerns together; must be globally unique (use UUID, not timestamp)
- **Job store** — where job state lives; Redis in prod, in-memory for demos
- **Submit endpoint** — queues work, returns jobId immediately; must be non-blocking
- **Status endpoint** — fast read from job store; returns current progress or result
- **Poll interval** — client-side timer configuration; tune based on latency vs. chattiness requirements
- **TTL / expiry** — how long completed jobs are retained; set it or your job store fills up forever

**Gotchas:**
- **Timestamp as job ID** — the demo does this, the lecture even admits it's bad. Two concurrent requests in the same millisecond = collision. Always use UUID4 or similar
- **In-memory job store + multiple backend instances** — if your load balancer sends submit to Instance A but the status poll hits Instance B, Instance B has no record of the job. Use Redis or a DB as the shared state layer
- **Unbounded job store growth** — no TTL = memory leak. Completed jobs pile up forever. Set expiry (Redis TTL, a cleanup cron, or soft-delete with a timestamp)
- **Poll interval vs. user experience** — polling every 30s on a 5-second job means the user waits up to 30s after completion to find out. Don't just pick a round number; benchmark your average job duration and set the interval accordingly
- **What to do when a job fails** — the demo only tracks progress. Production needs: `status: "failed"`, `error: "..."`, retry logic, and dead-letter handling. "Is it done?" needs to mean "done OR failed"
- **The 99% empty poll problem** — most polls return "not ready." Cache the "not ready" response aggressively if you can, or use exponential backoff (poll at 1s, 2s, 4s, 8s...) to reduce traffic on long-running jobs

**Terms worth knowing:**
- **Short Polling** — client repeatedly sends requests at fixed intervals to check job status; server responds immediately with current state
- **Handle / Job ID** — unique identifier returned on job submission; used to correlate all subsequent status checks to the original job
- **Chatty** — making many small requests where the ratio of useful responses to total requests is very low
- **Exponential Backoff** — polling strategy where the interval doubles after each "not ready" response; reduces load on long jobs
- **TTL (Time To Live)** — expiry duration for stored data; how long the server retains job results before deleting them
- **Idempotent status check** — a GET to `/status?id=X` should always return the same result for the same job state; no side effects

**Don't forget this:**
- Never use timestamp as a job ID in production — use UUID
- In-memory job store breaks the moment you have more than one server instance — use Redis
- Always set a TTL on completed jobs or your store fills up
- Polling interval is a UX and cost tradeoff — measure, don't guess
- A job result of "failed" is just as important as "complete" — build error state into your job schema from day one

---

## 4. QUICK REFERENCE CARD

```
SHORT POLLING — QUICK REF
─────────────────────────────────────────────────
Pattern:
  POST /submit        → { jobId }          (immediate)
  GET  /status/:id    → { status, progress } (repeated)
  GET  /status/:id    → { status: "complete", result } (eventually)

Job states to implement:
  queued → processing → complete | failed

Job store options:
  Demo:       In-memory Map (dies on restart, single instance only)
  Production: Redis with TTL (fast, shared, auto-expires)
  Durable:    Postgres (queryable history, survives restarts)

Job ID: always UUID, never timestamp

Poll interval trade-off:
  Fast poll (1s)  → better UX, high chattiness, more cost
  Slow poll (30s) → poor UX, low chattiness, cheaper
  Backoff pattern → 1s → 2s → 4s → 8s → cap at 30s

Chattiness math:
  N users × (job_duration / poll_interval) = total requests
  Most return "not ready" → mostly wasted

When to use:
  ✓ Long-running jobs (uploads, exports, ML inference)
  ✓ Client may disconnect and reconnect
  ✓ Simple to implement and debug
When NOT to use:
  ✗ Real-time events (use push/SSE/WebSockets)
  ✗ Very high concurrency with short jobs (too chatty)
  ✗ Sub-second latency requirements
─────────────────────────────────────────────────
```

---

## 5. THE "AHA" MOMENT

**The Pizza Tracker**

You order a pizza online. The restaurant could make you sit on hold while they bake it — 45 minutes of silence until someone picks up and says "your pizza is ready." That's naive request-response. You're blocked for 45 minutes.

Instead, they give you an order number and hang up. That's the **job ID**. You're free. You go watch TV, do dishes, whatever.

Every few minutes, you pull up the pizza tracker website and refresh: "Prep... Prep... Baking... Baking... Out for delivery... Delivered!" Each refresh is a **poll**. The website doesn't stay open — you check it when you feel like it.

Now here's the chattiness problem in plain English: imagine the restaurant has 10,000 customers all refreshing their pizza tracker every 30 seconds. 99% of those refreshes return "still baking." The restaurant's website is getting hammered with requests, almost all of which say "nothing new yet." Their servers are busy answering useless questions while trying to also process new orders.

**The job ID is the key insight.** Because you have that number, you can close the browser, restart your phone, or even hand the number to a friend to check for you. The state lives at the restaurant, not in your browser session. That's what makes short polling resilient — and what makes it genuinely useful despite the chattiness problem.

The interval is your knob: check every 5 seconds (annoying for the restaurant, great for you) or every 5 minutes (cheap for the restaurant, agonizing if the pizza arrived 4 minutes ago).

---

## 6. SHOW ME THE CODE

```javascript
// ─────────────────────────────────────────────────────
// SHORT POLLING — Node.js / Express (production-ready patterns)
// npm install express uuid
//
// Fixes the demo bugs: UUID job IDs, proper job states,
// TTL cleanup, multi-instance ready (swap Map for Redis)
// ─────────────────────────────────────────────────────

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(express.json());

// ── Job Store ─────────────────────────────────────────
// In production: replace this Map with Redis
// WHY: Map is in-memory; dies on restart, breaks with multiple instances
// Redis replacement: await redis.set(jobId, JSON.stringify(job), 'EX', 3600)
const jobs = new Map(); // jobId → JobRecord

// Job schema — define ALL states upfront (including failure)
// WHY: "is it done?" is not enough; you need to distinguish complete vs failed
function createJob(input) {
  return {
    id: uuidv4(),          // WHY UUID: timestamps collide under concurrent load
    status: "queued",      // queued | processing | complete | failed
    progress: 0,
    input,
    result: null,
    error: null,
    createdAt: Date.now(),
    completedAt: null,
    expiresAt: Date.now() + 60 * 60 * 1000, // TTL: 1 hour
  };
}

// ── Submit endpoint ───────────────────────────────────
// Returns immediately — does NOT wait for job completion
// This is what makes it async; job runs in background
app.post("/submit", (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: "input required" });

  const job = createJob(input);
  jobs.set(job.id, job);

  // Kick off async processing WITHOUT awaiting it
  // WHY: if we await, the client blocks — defeats the purpose
  processJob(job.id);

  console.log(`[Submit] Job ${job.id} queued`);

  // Respond immediately with the handle
  res.status(202).json({
    jobId: job.id,
    status: job.status,
    // Tell client exactly where to poll — good API design
    pollUrl: `/status/${job.id}`,
    suggestedInterval: 3000, // ms — client hint for poll frequency
  });
});

// ── Status endpoint ───────────────────────────────────
// Fast read — just look up and return; no processing
// This is what gets hammered repeatedly by the client
app.get("/status/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);

  // Job not found — either expired or never existed
  if (!job) {
    return res.status(404).json({ error: "Job not found or expired" });
  }

  // Check TTL expiry (Redis does this automatically)
  if (Date.now() > job.expiresAt) {
    jobs.delete(job.id);
    return res.status(410).json({ error: "Job result expired" });
  }

  // Return appropriate response based on state
  const response = {
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    createdAt: job.createdAt,
  };

  if (job.status === "complete") {
    response.result = job.result;
    response.completedAt = job.completedAt;
  }

  if (job.status === "failed") {
    response.error = job.error;
  }

  // Hint to client: stop polling if done/failed
  response.done = ["complete", "failed"].includes(job.status);

  res.json(response);
});

// ── Background job processor ──────────────────────────
// Simulates long-running work (video encoding, ML, export, etc.)
async function processJob(jobId) {
  const job = jobs.get(jobId);
  if (!job) return;

  job.status = "processing";
  console.log(`[Process] Job ${jobId} started`);

  try {
    // Simulate 10 steps of work, each taking 1 second
    for (let step = 1; step <= 10; step++) {
      await sleep(1000);
      job.progress = step * 10;
      console.log(`[Process] Job ${jobId} → ${job.progress}%`);
    }

    // Simulate occasional failure (10% chance)
    if (Math.random() < 0.1) throw new Error("Processing failed: corrupted input");

    job.status = "complete";
    job.result = { output: `Processed: ${job.input}`, processedAt: new Date() };
    job.completedAt = Date.now();
    console.log(`[Process] Job ${jobId} complete`);

  } catch (err) {
    // WHY: always model failure — "is it done" includes "did it fail"
    job.status = "failed";
    job.error = err.message;
    console.error(`[Process] Job ${jobId} failed:`, err.message);
  }
}

// ── TTL Cleanup ───────────────────────────────────────
// Without this, completed jobs accumulate forever → memory leak
// WHY: in production, Redis TTL handles this automatically
// In dev with a Map: run a cleanup sweep periodically
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  jobs.forEach((job, id) => {
    if (now > job.expiresAt) {
      jobs.delete(id);
      cleaned++;
    }
  });
  if (cleaned > 0) console.log(`[Cleanup] Removed ${cleaned} expired jobs`);
}, 5 * 60 * 1000); // every 5 minutes

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

app.listen(3000, () => console.log("Server on :3000"));

// ─────────────────────────────────────────────────────
// CLIENT-SIDE POLLING (paste in browser console or Node script):
//
// async function pollUntilDone(jobId, interval = 3000) {
//   while (true) {
//     const res = await fetch(`http://localhost:3000/status/${jobId}`);
//     const data = await res.json();
//     console.log(`[Poll] Status: ${data.status} | Progress: ${data.progress}%`);
//
//     if (data.done) {
//       console.log('Final result:', data);
//       break;
//     }
//     await new Promise(r => setTimeout(r, interval));
//   }
// }
//
// // Submit then poll:
// const res = await fetch('http://localhost:3000/submit', {
//   method: 'POST',
//   headers: {'Content-Type': 'application/json'},
//   body: JSON.stringify({ input: 'my-video.mp4' })
// });
// const { jobId, suggestedInterval } = await res.json();
// await pollUntilDone(jobId, suggestedInterval);
// ─────────────────────────────────────────────────────
```

---

## 7. WHERE YOU'LL SEE THIS IN THE WILD

**AWS S3 Multipart Upload** — You initiate an upload, get an `UploadId`, upload chunks, then call `CompleteMultipartUpload`. S3 assembles the chunks async and you poll (or use an event notification) to confirm completion. The UploadId is the job handle; the assembly is the background work.

**Stripe Payouts and Charge Status** — Many Stripe operations are async. You create a charge or payout, get an ID back immediately, and poll the Charges API to track state transitions (`pending → succeeded | failed`). Stripe's webhook system is the server-push alternative — but polling the API is the fallback when webhooks aren't set up.

**GitHub Actions and CI/CD APIs** — Trigger a workflow run via API, get a `run_id` back. Poll `/repos/{owner}/{repo}/actions/runs/{run_id}` to check `status` and `conclusion`. GitHub's own UI does this — that spinner updating build progress is polling the same API endpoint.

**AWS Batch / Lambda Async Invocation** — When you invoke Lambda with `InvocationType: Event`, you get a 202 immediately and no result. You poll CloudWatch logs or an SQS output queue for the result. The Lambda invocation ID is the job handle.

**Video Transcoding APIs (Mux, Cloudinary, FFmpeg services)** — Submit a video for transcoding, get an asset ID. Poll `/assets/:id` for status (`preparing → ready | errored`). Mux's dashboard is essentially a UI wrapping this exact polling pattern with a progress bar.

**Database Long-Running Queries (pg_cancel_backend)** — In Postgres, `pg_stat_activity` is effectively a polling interface. You submit a long query, note the `pid`, and can poll `pg_stat_activity` to check if it's still running. `pg_cancel_backend(pid)` is the cancel mechanism — same job-ID-based control pattern.

**Export Jobs in SaaS Platforms** — Every "Export to CSV" button in any serious SaaS product that deals with large datasets (Salesforce reports, Mixpanel data exports, Shopify order exports) uses this pattern. Click export → get a notification/email when done → download the file. The email is just the "poll result" delivered via a different channel.

---

## 8. EXPLAIN IT TO MY NON-TECH FRIEND

Think about getting a prescription at the pharmacy.

The old way would be: you hand in your prescription, then stand at the counter and stare at the pharmacist until they fill it. Could be 10 minutes, could be 45. You can't go anywhere. That's the naive approach — you're stuck waiting.

The modern pharmacy gives you a **buzzer and a ticket number**. You take the ticket, go sit down, maybe walk around the store, grab a snack. Every few minutes you glance at the board to see if your number is up. That's **short polling** — you're periodically checking "is it ready yet?"

The ticket number is your **job ID**. Even if you had to step outside for a moment and come back, you can still show your ticket and ask "is number 47 ready?" The pharmacy holds the state — your job — not you.

The downside becomes obvious in a busy pharmacy: imagine 200 people all walking up to the counter every 2 minutes to ask "is mine ready?" The pharmacist spends half their time just answering "not yet, not yet, not yet" instead of actually filling prescriptions. That's the **chatty problem** — most of the questions are wasted effort.

The better pharmacy solution is the buzzer that goes off automatically the moment it's ready — that's **push** or **long polling**. But even without the buzzer, the ticket system works. It's simple, everyone understands it, and it gets the job done — which is exactly why short polling is still widely used today despite its inefficiency.
