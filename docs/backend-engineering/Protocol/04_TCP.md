# TCP: Transmission Control Protocol — Full Breakdown

---

## 1. THE GIST

This lecture is your deep dive into TCP — the protocol that powers almost every reliable network communication you've ever built on top of. Unlike UDP, TCP *controls* the transmission: it guarantees delivery, enforces order, handles retransmission, and manages congestion. The price you pay is statefulness — both sides must maintain a connection, stored in memory as a file descriptor. You establish that connection via a 3-way handshake (SYN → SYN-ACK → ACK) and tear it down with a 4-way handshake (FIN → ACK → FIN → ACK). Every segment has a sequence number so the receiver can detect gaps and request retransmission. The lecture closes with working TCP server code in both C and Node.js — showing you just how much heavy lifting the kernel and runtime do for you.

---

## 2. THE BREAKDOWN

### Why TCP Exists

UDP is a firehose — fast, dumb, unordered. TCP exists because most applications need *certainty*: that the data arrived, in order, without corruption. Think database queries, SSH sessions, HTTP/1.1 and HTTP/2. You can't have `SELECT * FROM employees` silently scrambled into `TRUNCATE TABLE employees`.

---

### Connection = State = Memory

A TCP connection is **not** just a handshake event — it's an ongoing agreement stored in RAM on both sides. The OS hashes the **4-tuple** to create a file descriptor:

```
{ Source IP, Source Port, Destination IP, Destination Port }
         ↓
    Hash → File Descriptor (stored in kernel memory)
```

Every incoming segment is checked against this hash table. No entry? Drop it. This is what prevents spoofed segments from injecting data into your session.

**Memory implication:** Each connection costs RAM. WhatsApp reportedly handled ~3M concurrent TCP connections per server. That's the real-world ceiling you need to design for.

---

### The 3-Way Handshake (Connection Setup)

| Step | Who | What | Why |
|---|---|---|---|
| 1 | Client | SYN | "Here's my starting sequence number" |
| 2 | Server | SYN-ACK | "Got it. Here's mine" |
| 3 | Client | ACK | "Got yours. We're synced." |

After step 3, both sides have a file descriptor. Sequences are synchronized — critical because TCP is **bidirectional**. Both sides send data independently, so both need their own sequence counters.

---

### The 4-Way Handshake (Teardown)

```
Client → FIN   →  Server
Client ← ACK   ←  Server
Client ← FIN   ←  Server
Client → ACK   →  Server
```

The initiating side enters **TIME_WAIT** state — it doesn't immediately destroy the file descriptor. This is intentional: stale segments from the old session might still be in transit. TIME_WAIT waits ~2× MSL (Maximum Segment Lifetime) before cleanup. This is why you see `TIME_WAIT` piling up on high-traffic servers.

---

### Sequence Numbers & Retransmission

Every segment is stamped with a sequence number. The receiver ACKs *up to* the highest contiguous sequence received:

- Received 1, 2, 3 → ACK 3 (means "I have everything through 3")
- Received 1, 2, missing 3 → ACK 2 → sender retransmits 3

This is **cumulative acknowledgment**. One ACK can confirm multiple segments — efficient.

Sequence numbers are 32-bit (~4 billion). On a very high-throughput, long-lived connection, they wrap around. Handled, but worth knowing.

---

### Flow Control (Window Size)

The receiver advertises how much buffer space it has left via the **window size** field (16-bit = max 65KB default). The sender must not flood beyond this. There's a TCP option called **Window Scaling** that can push this to ~1GB. Without it, high-latency, high-bandwidth links (like satellite) would be catastrophically underutilized.

---

### Congestion Control

Separate from flow control. Flow control is about the *receiver's* capacity. Congestion control is about the *network's* capacity. TCP uses algorithms (like CUBIC, BBR) to probe how much the network can handle and backs off when it detects congestion — either via packet loss or ECN (Explicit Congestion Notification) flags in the header.

---

### The TCP Segment Header (20–60 bytes)

| Field | Size | Purpose |
|---|---|---|
| Source Port | 16 bits | Identifies sending process |
| Destination Port | 16 bits | Identifies receiving process |
| Sequence Number | 32 bits | Position of this data in the stream |
| Acknowledgment Number | 32 bits | Next expected byte from other side |
| Window Size | 16 bits | Flow control buffer advertisement |
| Flags | 9 bits | SYN, ACK, FIN, RST, PSH, URG, ECE, CWR, NS |
| Options | Variable | MSS, Window Scale, SACK, timestamps |

**Maximum overhead:** 60 (TCP) + 60 (IP) = 120 bytes of pure headers before a single byte of your payload.

---

### Maximum Segment Size (MSS)

MSS = MTU − IP header − TCP header = 1500 − 20 − 20 = **1460 bytes**

This is how much application payload fits in one segment without IP fragmentation. Jumbo frames (MTU ~9000) are used in data centers to reduce header overhead and improve throughput. MSS is negotiated during the handshake.

---

### The `accept()` Bottleneck

In C (and internally in every server), `listen()` performs the TCP handshake and queues completed connections up to the **backlog** limit. `accept()` dequeues one connection and hands it to your app. If your app can't call `accept()` fast enough, the queue fills and new handshakes are rejected. This is why production TCP servers use thread pools, event loops, or `SO_REUSEPORT` to parallelize `accept()`.

---

## 3. ENGINEER'S NOTEBOOK

**Core idea:** TCP is reliable, ordered, bidirectional byte-stream delivery with built-in congestion and flow control — all managed by the kernel. You just write to a socket.

**Key moving parts:**
- 4-tuple → file descriptor → connection identity
- 3-way handshake to sync sequence numbers
- Sequence + ACK for ordered, reliable delivery
- Window size for flow control (receiver-side)
- Congestion window (CWND) for congestion control (network-side)
- MSS = 1460 bytes on standard Ethernet

**Gotchas & edge cases:**
- `TIME_WAIT` accumulation — high connection churn (many short-lived connections) will pile these up. Use `SO_REUSEADDR`, tune `tcp_tw_reuse`, or use connection pooling
- Half-open connections — one side crashes without sending FIN. Use `SO_KEEPALIVE` or application-level heartbeats
- Sequence number wrap-around — 32-bit wraps at ~4GB of data on a single connection. Mitigated by TCP timestamps option
- Small writes + Nagle's algorithm — TCP may buffer small writes and batch them. Can add latency in request-response patterns. Disable with `TCP_NODELAY` for low-latency apps (e.g., game servers, trading systems)
- Backlog queue full → silent drop — clients see connection timeouts, not errors. Tune `net.core.somaxconn` and `net.ipv4.tcp_max_syn_backlog`
- Port exhaustion on the *client* side — if you're making massive outbound connections from one IP, you only have 65K ephemeral ports. Use multiple source IPs or connection pooling

**Key terms:**
- **File Descriptor** — OS-level handle to a socket/connection. Is the connection, in memory
- **SYN / SYN-ACK / ACK** — the 3 handshake packets
- **FIN / ACK** — teardown packets
- **TIME_WAIT** — post-close grace period on the initiating side
- **MSS** — max payload per segment, negotiated at handshake
- **MTU** — max frame size at layer 2 (typically 1500 bytes)
- **Window Size** — receiver's buffer advertisement (flow control)
- **CWND** — congestion window, sender-side limit based on network conditions
- **ECN** — Explicit Congestion Notification, routers flag instead of drop
- **Backlog** — queue of completed-but-not-yet-accepted connections
- **Nagle's Algorithm** — batches small writes to reduce segment count

**Don't forget this:**
> TCP reliability lives in the *kernel*, not your app. Your app just reads a byte stream. The kernel handles retransmission, ordering, and ACKs. But *connection limits*, *TIME_WAIT*, *backlog tuning*, and *Nagle's* are your operational responsibility.

---

## 4. QUICK REFERENCE CARD

```
TCP AT A GLANCE
───────────────────────────────────────────────
Layer:          4 (Transport)
Connection:     Stateful (file descriptor in RAM)
Identity:       4-tuple { SrcIP, SrcPort, DstIP, DstPort }
Handshake:      3-way (SYN → SYN-ACK → ACK)
Teardown:       4-way (FIN → ACK → FIN → ACK)
Header:         20 bytes base, up to 60 bytes
MSS:            1460 bytes (Ethernet, standard MTU)
MTU:            1500 bytes (standard), 9000 (jumbo)
Window Size:    Up to 65KB default, ~1GB with scaling
Sequence:       32-bit (wraps at ~4B)

RULES OF THUMB
───────────────────────────────────────────────
• TCP = reliability + order + flow/congestion control
• 1 connection = 1 file descriptor = finite RAM
• ACK N means "I have everything through N"
• listen() handshakes. accept() gives you the socket.
• Backlog full = new connections silently dropped
• Nagle on = batched writes = latency. TCP_NODELAY kills it.
• TIME_WAIT is normal. Tune, don't panic.

FLAGS (the ones that matter)
───────────────────────────────────────────────
SYN   → open connection
ACK   → acknowledge received data
FIN   → graceful close
RST   → hard reset ("something's wrong, abort")
PSH   → push data immediately, bypass buffer
ECE   → ECN echo (congestion warning from network)
CWR   → congestion window reduced (sender confirmed)
```

---

## 5. THE "AHA" MOMENT

**The trickiest concept: Why does TCP need sequence numbers AND acknowledgment numbers separately?**

Here's the analogy: imagine you and a colleague are both working on a Google Doc *simultaneously*, each editing different sections. You're not taking turns — you're both writing at the same time, and changes flow both ways.

Now, say you send your colleague 3 paragraphs (segments 1, 2, 3), and they send you 2 sections (their segments A, B) *at the same time*. You need to tell them "I got your A and B" while they're telling you "I got your 1 and 2." Those are completely independent acknowledgments for completely independent data streams.

If sequence numbers and ACK numbers were the same field, you couldn't do both at once. TCP is a **full-duplex** pipe — data flows in both directions simultaneously. That's why every segment carries:

- **Its own sequence number** → "this is where *my* data lives in the stream"
- **An acknowledgment number** → "this is how much of *your* data I've received"

They're separate because *two conversations are happening at once*, and you need to track both independently. A single segment can carry new data *and* acknowledge the other side's data in the same packet — that's the elegant efficiency of TCP's design.

---

## 6. SHOW ME THE CODE

```javascript
import net from 'net';

// TCP server — the kernel has already completed the 3-way handshake
// by the time your callback fires. You're handed a live, established socket.
const server = net.createServer((socket) => {
  const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
  
  // This fires once per connection — the file descriptor is now live in the kernel.
  // Each socket object here IS the connection. Lose the reference, lose the connection.
  console.log(`[CONNECTED] ${clientId}`);

  // Nagle's algorithm is ON by default — TCP may batch small writes.
  // For request-response or real-time apps (chat, gaming, trading),
  // disable it so data flushes immediately:
  socket.setNoDelay(true); // sets TCP_NODELAY

  // Heartbeat — detects half-open connections (other side crashed without FIN)
  // Without this, a dead peer can ghost you indefinitely.
  socket.setKeepAlive(true, 10000); // start keepalive after 10s of silence

  socket.on('data', (data) => {
    // 'data' is a Buffer (byte array) — TCP is a byte STREAM, not a message stream.
    // There are NO message boundaries. "Hello" + "World" might arrive as
    // "Hel" + "loWorld" or "HelloWorld". You must frame your own messages.
    console.log(`[DATA from ${clientId}]`, data.toString());

    // Echo back — this write() queues a segment to send.
    // The kernel handles ACKs, retransmission, window sizing — not you.
    socket.write(`Echo: ${data}`);
  });

  socket.on('end', () => {
    // Remote side sent FIN — graceful close initiated by peer.
    // We can still write() here before our own FIN is sent.
    console.log(`[FIN received from ${clientId}] — peer is done sending`);
  });

  socket.on('close', () => {
    // 4-way handshake complete. File descriptor destroyed.
    // The port/IP 4-tuple is now in TIME_WAIT on the initiating side.
    console.log(`[CLOSED] ${clientId}`);
  });

  socket.on('error', (err) => {
    // RST received, or network failure — no graceful FIN.
    // Common causes: peer process killed, network drop, firewall RST injection.
    console.error(`[ERROR on ${clientId}]`, err.message);
  });
});

// listen() registers this port with the kernel.
// The kernel will now complete TCP handshakes autonomously.
// Completed connections queue up (backlog) waiting for accept() (called internally by Node).
// Default Node.js backlog is 511 — tune if you expect high connection burst.
server.listen(8800, '127.0.0.1', () => {
  console.log('TCP server listening on 127.0.0.1:8800');
  console.log('Test with: nc 127.0.0.1 8800');
});

// Graceful shutdown — drain existing connections before closing
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed. All connections drained.');
    process.exit(0);
  });
});
```

**Key thing to internalize:** the `data` event is a byte *stream*, not a message stream. This trips up almost every developer the first time they build a TCP protocol. You **must** implement your own framing — a length prefix, a delimiter, or a higher-level protocol like HTTP.

---

## 7. IN THE WILD

**Databases:** Every PostgreSQL or MySQL connection is a TCP connection. Your connection pool (`pg-pool`, `HikariCP`) exists because TCP handshakes are expensive (~1 RTT), and creating a new connection per query would kill performance. The pool keeps connections warm. `TIME_WAIT` storms happen when you naively open/close DB connections at high rate.

**HTTP/1.1:** Each request was historically a new TCP connection. HTTP/1.1 introduced `keep-alive` to reuse connections. HTTP/2 multiplexes many logical streams over *one* TCP connection — reducing handshake overhead. HTTP/3 (QUIC) drops TCP entirely and rebuilds reliability over UDP, eliminating head-of-line blocking.

**Nginx/HAProxy:** These proxies spend most of their life in `accept()` loops. `SO_REUSEPORT` lets multiple worker processes each `accept()` on the same port, avoiding a single-threaded bottleneck. Backlog tuning (`net.core.somaxconn`) is one of the first things you touch when optimizing a high-traffic proxy.

**Kubernetes / Service Meshes:** Istio's sidecar proxy (Envoy) intercepts all TCP traffic with `iptables` rules — it's essentially a programmable layer 4/7 proxy. Connection pooling, retries, circuit breaking — all implemented at the TCP socket level.

**SSH:** A single TCP connection. The terminal session is encrypted application data riding inside TCP segments. If the connection drops mid-session, the TCP FIN/RST propagates and the session dies — which is why tools like `tmux` or `mosh` exist (mosh is UDP-based and survives IP changes).

**gRPC:** Built on HTTP/2 (which is TCP). Long-lived connections with multiplexed streams. Connection management, keepalive (`GOAWAY` frames), and flow control happen at both the HTTP/2 and TCP layers simultaneously.

---

## 8. EXPLAIN IT TO A NON-TECH FRIEND

Imagine you want to mail a very long novel to a friend across the country, but the post office can only handle one page at a time in each envelope.

You number every page — page 1, 2, 3... — and mail them all. But here's the catch: the post office doesn't guarantee they arrive in order. Page 7 might arrive before page 3. Some pages might get lost entirely.

Your friend is smart. They keep track of what they've received, and every few pages they send you a note back: *"Got everything up to page 12."* If you never hear back about page 9, you send page 9 again.

Also, before you even start sending the novel, you call your friend first. You say: *"Hey, I'm about to send you a novel, ready?"* They say *"Ready! I can handle about 50 pages in my mailbox at a time — don't send more than that."* You say *"Got it, starting now."* That phone call? That's the handshake.

When you're done, you don't just stop sending. You call again: *"I'm done."* They say *"Okay, got it."* Then they call back: *"I'm done too."* And you say *"Great, talk later."* Only then does the mailbox close.

**TCP is that entire system** — the page numbering, the "got it" notes, the mailbox size limit, the opening call, and the closing call. All of it, running invisibly every time you load a webpage or send a chat message.
