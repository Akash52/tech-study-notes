# Publish-Subscribe (Pub/Sub) — Lecture Breakdown

---

## 1. THE GIST

Pub/Sub solves the problem of many services needing to react to the same event without knowing about each other. Instead of Service A directly calling B, C, and D in a fragile chain, it publishes one message to a broker and walks away. Every downstream service independently consumes from that broker at its own pace. The YouTube video upload pipeline is the perfect mental model: upload once, and compression, formatting, copyright checking, and notifications all happen in parallel without the uploader waiting for any of it. The hard problems aren't the pattern itself — they're delivery guarantees (at-least-once vs exactly-once) and what happens when consumers don't acknowledge messages.

---

## 2. THE BREAKDOWN

### Why Request-Response Breaks at Scale

The naive YouTube pipeline in request-response:
```
Client → Upload → Compress → Format (480/720/1080/4K) → Notify → Copyright → Response
                                                                              ↑
                                              Client blocked this entire time
```

Every service in the chain must be online simultaneously. One failure breaks everything. Adding a new service (e.g., AI tagging) means rewiring the entire chain. The client waits for the *longest* path. This is called **tight coupling** — and it's fragile.

### The Pub/Sub Fix

```
Client → Upload → publishes to [raw-video topic] → responds immediately ✓

[raw-video topic] → Compression Service  (independent)
                 → Copyright Service     (independent, added later, zero changes upstream)

[compressed-video topic] → Format Service

[4k-ready topic] → Notification Service
[720p topic]     → CDN Distribution
[480p topic]     → Early availability
```

Each service is both a **consumer** (reads a topic) and a **publisher** (writes to a new topic). They never talk directly to each other. The broker is the only shared dependency.

### The Broker — The One Critical Piece
Every pub/sub system has a central broker that:
- Stores messages in topics/queues until consumed
- Manages delivery guarantees
- Handles routing between publishers and subscribers
- Must be highly available — it's the only SPOF in the architecture

**If the broker goes down, everything stops.** This is the trade-off: you eliminated service-to-service coupling at the cost of adding broker dependency. Design your broker for high availability (clustering, replication) from day one.

### Delivery Guarantees — The Hard Part

| Guarantee | Meaning | Problem |
|---|---|---|
| At-most-once | Delivered 0 or 1 times | Messages can be silently lost |
| **At-least-once** | Delivered 1+ times | **Duplicates possible → must be idempotent** |
| Exactly-once | Delivered exactly once | Extremely expensive, rarely truly achievable |

Both Kafka and RabbitMQ offer **at-least-once**. Design your consumers to be idempotent — processing the same message twice must produce the same result as processing it once.

### The ACK Mechanism — From the Demo
RabbitMQ's delivery guarantee in action:
1. Broker delivers message to Consumer A
2. Consumer A processes it but crashes before ACKing
3. Broker: "No ACK received → message not successfully processed"
4. Broker re-delivers to Consumer B

**Without ACK:** message is treated as delivered the moment it leaves the broker — at-most-once (lossy).
**With ACK:** message is retained until consumer explicitly confirms processing — at-least-once (safe).

This is exactly what the demo showed: killing the consumer before ACK caused immediate re-delivery to the second consumer.

### RabbitMQ (Push) vs Kafka (Pull) — The Core Architectural Choice

**RabbitMQ:**
- Broker pushes to consumers as messages arrive
- Consumer must keep up with broker's pace
- Fast delivery, risk of consumer overwhelm
- Messages deleted after consumption (not replayable)

**Kafka:**
- Consumer long-polls for messages at its own pace
- Consumer controls flow — reads when ready
- Messages retained for configurable period (replayable)
- Multiple consumer groups each get all messages independently

The choice: **who controls flow?** RabbitMQ says broker. Kafka says consumer.

### Consumer Groups vs Fan-out
- **Same consumer group** — messages are distributed across consumers (work distribution / parallelism)
- **Different consumer groups** — each group gets all messages independently (fan-out)

This is how Kafka serves both the compression service AND the copyright service from the same topic — they're in different consumer groups, each getting every message.

---

## 3. ENGINEER'S NOTEBOOK

**Core idea:** Publisher fires-and-forgets to a topic. Broker stores it. Consumers pull or receive at their own pace. Nobody talks directly to each other. Loose coupling through a shared intermediary.

**Key moving parts:**
- **Publisher** — produces a message to a topic/queue; doesn't know or care who consumes it
- **Broker** — stores messages, manages topics, handles delivery guarantees; must be HA
- **Consumer/Subscriber** — reads from topic; processes at own pace; sends ACK on success
- **Topic** — logical channel for a category of events; multiple consumers can subscribe
- **Queue** — competing consumers model; only one consumer gets each message
- **ACK** — consumer's signal that processing succeeded; broker removes or advances offset
- **Consumer Group** — set of consumers sharing consumption of a topic; enables parallelism and fan-out

**Gotchas:**
- **No ACK before crash = re-delivery** — the demo showed this live. If your consumer crashes after receiving but before ACKing, the message re-delivers. Without idempotent consumers, you'll double-process. This trips up nearly everyone the first time
- **ACK too early = message loss** — ACKing on receipt (before processing) means a crash during processing loses the message permanently. Always ACK only after successful processing
- **Broker is a SPOF** — clustering and replication are not optional at production scale. A single-node RabbitMQ or Kafka in prod is a time bomb
- **Dead Letter Queue (DLQ)** — what happens to messages that fail processing repeatedly? Without a DLQ, they either loop forever (retrying) or disappear silently. Always configure a DLQ with monitoring
- **Ordering** — Kafka guarantees ordering within a partition, not across partitions. If order matters (e.g., user events), partition by user ID so all events for a user go to the same partition
- **Consumer lag** — the gap between latest published message and what the consumer has processed. Monitoring this is critical — growing lag means your consumers can't keep up with the producer rate

**Terms worth knowing:**
- **Publisher/Producer** — writes messages to a topic; fire-and-forget
- **Consumer/Subscriber** — reads from a topic; controls its own pace
- **Broker** — central server managing topics, storage, and delivery
- **Topic** — named channel; multiple consumer groups each independently read all messages
- **Queue** — competing consumers; each message delivered to exactly one consumer
- **Partition** — Kafka's unit of parallelism within a topic; ordered within, unordered across
- **Consumer Group** — consumers sharing a topic's partitions; different groups = independent fan-out
- **ACK** — consumer's delivery confirmation; triggers broker to advance offset or delete message
- **Idempotency** — processing the same message multiple times produces the same result; required for at-least-once delivery
- **DLQ (Dead Letter Queue)** — destination for messages that failed delivery/processing repeatedly
- **Offset** — Kafka's pointer to a consumer group's position in a partition log

**Don't forget this:**
- Always ACK **after** successful processing, never on receipt
- Design consumers to be idempotent — assume you will receive duplicates
- Always configure a DLQ — silent message loss is the worst bug to debug
- The broker is your new critical dependency — HA it before anything else
- Consumer group = parallelism (same group, split partitions). Different groups = fan-out (each gets all messages)
- Monitor consumer lag — it's your early warning system for capacity problems

---

## 4. QUICK REFERENCE CARD

```
PUB/SUB — QUICK REF
─────────────────────────────────────────────────
Pattern:
  Publisher → [Broker/Topic] → Consumer A  (independent)
                             → Consumer B  (independent)
                             → Consumer C  (added later, zero upstream changes)

Delivery guarantees:
  At-most-once  → fast, lossy (no ACK)
  At-least-once → safe, needs idempotent consumers ← USE THIS
  Exactly-once  → very expensive, rarely worth it

ACK rules:
  ✓ ACK only AFTER successful processing
  ✓ Build idempotent consumers (assume duplicates arrive)
  ✓ Always configure a Dead Letter Queue

RabbitMQ vs Kafka:
  Rabbit → push, broker controls pace, no replay
  Kafka  → pull/long-poll, consumer controls pace, replayable

Consumer groups:
  Same group     → messages split between consumers (parallelism)
  Different group → each group gets all messages (fan-out)

Ordering:
  Kafka: guaranteed within partition
  Partition key = field that must stay ordered (e.g., userId)

Monitor in production:
  Consumer lag  → growing = consumers can't keep up
  DLQ depth     → growing = processing failures
─────────────────────────────────────────────────
```

---

## 5. THE "AHA" MOMENT

**The Office Bulletin Board**

The old way (request-response chain): a manager has news and personally walks to each employee's desk to tell them. Engineer → walks to Desk A, waits for acknowledgment, walks to Desk B, waits, walks to Desk C... If anyone is away from their desk, the whole delivery chain stalls. Adding a new employee means the manager has to remember to visit one more desk every time.

**Pub/Sub is the office bulletin board.**

The manager pins the news once and walks away. Done. HR reads it when they get in. Legal reads it after their 9am call. The new intern on day one reads the last week's posts to catch up. The manager doesn't know how many people read it, doesn't care, and isn't waiting for anyone.

Now here's the **ACK insight**: imagine the bulletin board has a sign-out sheet. You can't tear down an announcement until everyone on the required list has signed it. If someone signs it, processes the info, and then quits before telling their manager — the announcement stays up. The next person who sits at that desk picks it up and processes it too. That's at-least-once delivery.

**The consumer group twist**: Legal and HR are in different departments. Legal has a copy of the bulletin board, HR has a copy. They each get all announcements independently. But within Legal, there are three lawyers — they take turns: Lawyer A gets announcement 1, Lawyer B gets announcement 2, Lawyer C gets announcement 3. They share the work, not duplicate it. That's consumer groups — same group shares the load, different groups each get everything.

The bulletin board (broker) is now the only critical piece of infrastructure. If it burns down, nobody gets news. That's your HA problem to solve — but at least you've eliminated the manager's exhausting desk-to-desk runs.

---

## 6. SHOW ME THE CODE

```javascript
// ─────────────────────────────────────────────────────
// PUB/SUB with RabbitMQ — Node.js
// npm install amqplib uuid
//
// Run: node consumer.js first, then node publisher.js
// Demonstrates: ACK after processing, DLQ, idempotency
// ─────────────────────────────────────────────────────

// ══ PUBLISHER (publisher.js) ══════════════════════════
const amqp = require("amqplib");
const { v4: uuidv4 } = require("uuid");

const BROKER_URL = "amqp://localhost";
const QUEUE = "video-processing";

async function publish(jobData) {
  const conn = await amqp.connect(BROKER_URL);
  const channel = await conn.createChannel();

  // durable: true → queue survives broker restart
  // WHY: without this, a broker crash loses ALL queued messages
  await channel.assertQueue(QUEUE, { durable: true });

  const message = {
    messageId: uuidv4(), // unique ID per message — enables idempotency checks
    ...jobData,
    publishedAt: Date.now()
  };

  // persistent: true → message survives broker restart (written to disk)
  // WHY: non-persistent messages live in RAM only — lost on broker crash
  channel.sendToQueue(
    QUEUE,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );

  console.log(`[Publisher] Published job:`, message);

  // Publisher fires-and-forgets — disconnects immediately
  // Doesn't wait for consumer to process
  await channel.close();
  await conn.close();
}

// Simulate the upload service publishing after a video upload
publish({ videoId: "vid_001", userId: "user_42", rawPath: "/uploads/vid_001.mp4" });
publish({ videoId: "vid_002", userId: "user_99", rawPath: "/uploads/vid_002.mp4" });


// ══ CONSUMER (consumer.js) ════════════════════════════
const amqp = require("amqplib");

const BROKER_URL = "amqp://localhost";
const QUEUE = "video-processing";
const DLQ = "video-processing.dlq"; // Dead Letter Queue

// Idempotency store — tracks processed messageIds
// In production: use Redis SET with TTL
const processedIds = new Set();

async function startConsumer(consumerId) {
  const conn = await amqp.connect(BROKER_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });
  await channel.assertQueue(DLQ, { durable: true }); // always set up DLQ

  // prefetch(1): process one message at a time before getting another
  // WHY: without this, broker dumps ALL queued messages onto this consumer
  // at once — overwhelming it. This is backpressure control.
  channel.prefetch(1);

  console.log(`[Consumer ${consumerId}] Waiting for jobs...`);

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const job = JSON.parse(msg.content.toString());
    console.log(`[Consumer ${consumerId}] Received:`, job.videoId);

    // ── Idempotency check ─────────────────────────────
    // WHY: at-least-once delivery means we CAN receive duplicates
    // Processing the same video twice = double storage cost, duplicate notifications
    // Checking messageId before processing prevents this
    if (processedIds.has(job.messageId)) {
      console.log(`[Consumer ${consumerId}] Duplicate detected, skipping: ${job.messageId}`);
      channel.ack(msg); // ACK it so it leaves the queue
      return;
    }

    try {
      await processVideo(job, consumerId);

      // ── ACK after successful processing ───────────
      // CRITICAL: ACK only here, after we KNOW processing succeeded
      // If we ACK on receipt and then crash during processing:
      //   → message is gone from broker
      //   → processing never completed
      //   → silent data loss
      channel.ack(msg);
      processedIds.add(job.messageId); // mark as processed
      console.log(`[Consumer ${consumerId}] ACK'd: ${job.videoId}`);

    } catch (err) {
      console.error(`[Consumer ${consumerId}] Processing failed:`, err.message);

      // ── NACK with DLQ routing ──────────────────────
      // requeue: false → don't put back on main queue (would loop forever)
      // Instead: message goes to DLQ for human inspection
      // WHY DLQ: failed messages need investigation, not infinite retry
      channel.nack(msg, false, false); // (msg, allUpTo, requeue)
      // In production: configure broker to route nack'd messages to DLQ automatically
      // via dead-letter-exchange configuration
    }
  });
}

async function processVideo(job, consumerId) {
  // Simulate async work: compression, format conversion, etc.
  await new Promise(r => setTimeout(r, 2000));

  // After processing, this consumer could PUBLISH to the next topic
  // That's how you chain microservices without coupling them:
  // Compression consumer → publishes to "compressed-video" topic
  // Format consumer reads from "compressed-video" → publishes to "4k-ready", "720p-ready"
  // Notification consumer reads from "4k-ready" → sends push notification

  console.log(`[Consumer ${consumerId}] Processed video: ${job.videoId} ✓`);
}

// Start two consumers to demonstrate competing consumer pattern
// Both consume from same queue → messages are distributed between them
startConsumer("A");
startConsumer("B");

// ─────────────────────────────────────────────────────
// WHAT TO OBSERVE:
//
// 1. Start consumers: node consumer.js
// 2. Publish jobs:    node publisher.js
//
// 3. Notice:
//    - Jobs are distributed between Consumer A and B (not duplicated)
//    - Kill Consumer A mid-processing (Ctrl+C before ACK)
//    - Consumer B immediately picks up A's unACK'd message
//    - That's at-least-once delivery in action
//
// 4. Add a third consumer (node consumer.js in new terminal)
//    - New consumer automatically joins the pool
//    - Zero changes to publisher or existing consumers
//    - That's loose coupling in action
// ─────────────────────────────────────────────────────
```

---

## 7. WHERE YOU'LL SEE THIS IN THE WILD

**YouTube / Netflix Video Pipeline** — Exactly the architecture from the lecture. Upload triggers events into a processing pipeline where transcoding workers, thumbnail generators, CDN distribution services, and recommendation indexers all consume independently from shared topics. Adding a new downstream feature (say, AI chapter detection) means adding a new consumer — zero changes to upload, compression, or formatting services.

**Stripe Payment Events** — Every payment, refund, or dispute emits an event to Stripe's internal event bus. Fraud detection, accounting, email notifications, webhook delivery, and compliance logging are all independent consumers. If the email service is down, payments still process — emails catch up when it recovers. This is the "works even if consumer is offline" property from the lecture.

**Kafka as the Data Engineering Backbone** — Uber, Airbnb, LinkedIn, and most large tech companies run Kafka as their central nervous system. Every user action, ride event, or transaction publishes to Kafka topics. Data pipelines, ML feature stores, analytics systems, and monitoring tools all consume from those topics independently. LinkedIn built Kafka specifically for this pattern — they open-sourced it because the use case is universal.

**AWS SNS + SQS Fan-out Pattern** — The managed cloud version of pub/sub. SNS is the topic (fan-out). SQS queues are the per-service buffers. One SNS publish → multiple SQS queues each receive a copy → each service's consumers drain their own queue independently. This is the AWS-native implementation of the architecture the lecture describes.

**E-commerce Order Events** — Order placed → event published → inventory service decrements stock, payment service charges card, fulfillment service creates shipment, email service sends confirmation, analytics service records the sale — all independently, all from the same "order.created" event. If analytics is slow that day, orders still ship. If email is temporarily down, it catches up when it recovers.

**Microservice Event Sourcing** — Instead of services sharing a database, they share an event log. Each service reconstructs its own state by replaying events from Kafka. The broker becomes the source of truth. A new service can be added and catch up on the full history by replaying from offset zero — impossible with direct service-to-service communication.

---

## 8. EXPLAIN IT TO MY NON-TECH FRIEND

Imagine a busy newsroom in the days before email.

**The old way (request-response chain):** When breaking news arrives, the editor personally walks the story to the layout desk, waits while they lay it out, then walks it to the print desk, waits for printing, then walks to distribution. One person, one chain, total blocking. If anyone is on lunch break, the whole newspaper stops.

**Pub/Sub is the newsroom wire service.**

The editor writes the story once and pins it to the wire board — a central board everyone in the building can see. Done. The layout team picks it up when they're ready. The print team picks it up when layout finishes theirs. The delivery team picks it up when printing is done. The archive team saves a copy for themselves. The fact-checker reviews it on their own schedule.

Nobody had to coordinate with the editor after that first pin. Nobody even had to be at their desk when the story arrived — they'll see it when they get back.

**The ACK (acknowledgment) part:** Each department has to initial the story when they've successfully processed it. If the layout team takes the story, spills coffee on it, and loses it before initialing — the wire board still shows it as "not processed by layout" and delivers another copy. That's at-least-once delivery. It means you sometimes process the same story twice, so smart teams keep notes: "did we already lay this one out?" — that's idempotency.

**The wire board (broker)** is now the critical piece of infrastructure. If it burns down, nobody gets anything. But the payoff is huge: the editor's job is simple (pin and walk away), every department works at their own pace, and adding a new department (say, a Spanish translation team) means they just start reading the wire board — the editor changes nothing.
