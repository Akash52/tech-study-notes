# Protocol Properties — Lecture Breakdown

---

## 1. THE GIST

A protocol is just a shared set of rules that lets two parties communicate — if both follow the same rules, they can talk. Every protocol ever built was designed to solve a specific problem, and its properties reflect that purpose. This lecture covers the key dimensions you evaluate when designing or choosing a protocol: data format, transfer mode, addressing, directionality, state, routing, reliability, and error handling. TCP was built for low-bandwidth networks in the 60s and is now hitting its limits in modern data centers — new protocols like Homa are emerging to replace it. Don't memorize these as gospel; understand them as a lens for evaluating tradeoffs.

---

## 2. THE BREAKDOWN

### What Is a Protocol?

A protocol is a system of rules. If both parties follow the same rules, they can exchange information. That's it. The rules exist to solve a specific problem — and the protocol's properties are a direct reflection of what problem it was designed for.

---

### Property 1: Data Format

Two categories, and the tradeoff is always **human readability vs. machine efficiency**:

**Text-based**
- Human-readable on the wire (assuming no encryption)
- Examples: HTTP/1.1 headers, JSON, XML, SMTP
- Easier to debug, more verbose, larger payload size

**Binary**
- Machine-optimized. Humans can't read it directly.
- Examples: Protocol Buffers (gRPC), RESP (Redis), HTTP/2, HTTP/3
- Smaller payload, faster to parse, harder to debug without tooling

> Note: HTTP/2 and HTTP/3 are binary **on the wire** but maintain a text-based API. You still write `GET /resource` — the library handles the binary encoding underneath. The API contract didn't change; only the transport did.

---

### Property 2: Transfer Mode

**Message-based**
- Each unit of data has a clear start and end
- Examples: HTTP (request/response boundaries), UDP (each datagram is discrete)
- UDP datagrams are bounded by MTU. If too large, IP fragments them and reassembles at the destination using fragment IDs

**Stream-based**
- Continuous flow of bytes, no inherent boundaries
- Examples: TCP, WebRTC (audio/video streams)
- The application layer must parse the stream to find message boundaries — this is expensive and is one of TCP's core limitations at scale
- HTTP built on top of TCP has to do this parsing work on every request, which adds overhead

> This is why Homa (a new 2022 research protocol) is interesting — it attempts to be a message-based protocol at the TCP level, eliminating the need for stream parsing entirely.

---

### Property 3: Addressing

Every protocol needs to answer: **where is this going and where did it come from?**

| Layer | Addressing System | Example |
|---|---|---|
| Layer 2 | MAC address | ARP — maps IP → MAC |
| Layer 3 | IP address | `93.184.216.34` |
| Layer 7 | DNS | `google.com` |

When you send a request to `google.com`, the full chain is: DNS resolves the hostname → TCP connects to the IP → HTTP sends the request with the `Host: google.com` header. Each layer uses its own addressing. When a proxy is involved, the immediate TCP destination is the proxy, but the logical destination remains the origin server.

---

### Property 4: Directionality

- **Unidirectional** — Data flows one way only
- **Half-duplex** — Both directions, but not simultaneously (Wi-Fi, walkie-talkie)
- **Full-duplex** — Both directions simultaneously (TCP connections, WebSockets)

This affects throughput design significantly. Half-duplex protocols must coordinate turn-taking; full-duplex protocols need to handle simultaneous send/receive buffers.

---

### Property 5: State

**Stateful** — The protocol maintains context across multiple messages
- Examples: TCP, gRPC, Apache Thrift
- The connection itself carries meaning; sequence numbers, session state, flow control windows

**Stateless** — Each message is independent, no memory between them
- Examples: UDP, HTTP/1.0 (technically)
- Simpler to scale horizontally; any server can handle any message

---

### Property 6: Routing

How does the protocol behave when traversing gateways and proxies? DNS resolves to an IP, TCP connects to that IP — but if a proxy intercepts, the TCP connection terminates at the proxy, which opens a new connection to the origin. The protocol must have semantics for this. HTTP's `Host` header and `CONNECT` method exist specifically to handle proxy routing.

---

### Property 7: Flow Control, Congestion Control & Reliability

| Feature | TCP | UDP |
|---|---|---|
| Guaranteed delivery | ✅ | ❌ |
| Retransmission | ✅ | ❌ |
| Flow control | ✅ | ❌ |
| Congestion control | ✅ | ❌ |
| Ordering | ✅ | ❌ |
| Speed | Slower | Faster |

UDP is fire-and-forget. TCP is the opposite — it tracks every byte. The cost of TCP's reliability is complexity and latency overhead, which is why it's being reconsidered for data center use.

---

### Property 8: Error Management

How does the protocol communicate and handle failure?
- HTTP uses status codes (4xx client errors, 5xx server errors)
- TCP uses RST packets to signal connection reset
- gRPC has its own status codes layered on top
- UDP has no error management whatsoever — the application layer handles everything or ignores it

---

## 3. ENGINEER'S NOTEBOOK

**Core idea:** Every protocol is a bundle of design decisions made to solve a specific problem in a specific era. When you understand the properties, you understand *why* a protocol behaves the way it does — and when it's the wrong tool.

---

**Key moving parts:**

- **Data format** — Text (debuggable, verbose) vs binary (efficient, opaque)
- **Transfer mode** — Message (bounded) vs stream (unbounded, requires parsing)
- **Addressing** — Which layer, which system (MAC/IP/DNS)
- **Directionality** — Uni / half-duplex / full-duplex
- **State** — Stateful vs stateless
- **Routing** — How proxies and gateways interact with the protocol
- **Reliability** — Guaranteed delivery, retransmission, ordering
- **Error handling** — Error codes, timeouts, retry semantics

---

**Gotchas that trip people up:**

- **HTTP/2 is binary but you don't feel it.** People assume HTTP is always text because HTTP/1.1 is. HTTP/2 is fully binary on the wire. The API is the same; the transport is not.
- **TCP is a stream, not a message protocol.** This is a constant source of bugs. If you read from a TCP socket and get 200 bytes, that might be one message, two messages, or half a message. You *must* implement your own framing.
- **UDP fragmentation is invisible to you.** If your UDP payload exceeds the MTU (~1500 bytes on Ethernet), IP silently fragments it. If any fragment is lost, the entire datagram is dropped. This surprises people who assume UDP is simple.
- **Stateless ≠ connectionless.** HTTP/1.1 is stateless but uses a persistent TCP connection (Connection: keep-alive). The connection has state even if the protocol doesn't.
- **DNS is Layer 7, not Layer 3.** People often think of addressing as purely an IP thing. DNS is an application-layer addressing system. This matters when you're working with proxies, service meshes, or split-horizon DNS.

---

**Terms worth knowing:**

| Term | Definition |
|---|---|
| **MTU** | Maximum Transmission Unit — max size of a single network frame (~1500 bytes on Ethernet) |
| **Fragment ID** | IP-level tag used to reassemble fragmented UDP datagrams |
| **RESP** | Redis Serialization Protocol — binary protocol Redis uses for client-server communication |
| **ARP** | Address Resolution Protocol — maps IP addresses to MAC addresses at Layer 2 |
| **Half-duplex** | Communication in both directions but not simultaneously |
| **Full-duplex** | Simultaneous bidirectional communication |
| **Flow control** | Mechanism to prevent a fast sender from overwhelming a slow receiver |
| **Congestion control** | Mechanism to prevent a sender from overwhelming the network itself |
| **Homa** | 2022 research protocol — message-based replacement for TCP, designed for data center workloads |

---

**Don't forget this:**
> TCP was designed in the 1960s for unreliable, low-bandwidth, long-distance networks. Modern data centers are high-bandwidth, low-latency, close-proximity environments — the exact opposite. TCP's reliability mechanisms become overhead in that context. That's why the protocol landscape is shifting.

---

## 4. QUICK REFERENCE CARD

```
PROTOCOL PROPERTIES — QUICK REF
──────────────────────────────────────────────────────
PROPERTY         OPTIONS                  EXAMPLES
──────────────────────────────────────────────────────
Data Format      Text                     HTTP/1.1, JSON, XML, SMTP
                 Binary                   HTTP/2, gRPC/protobuf, RESP

Transfer Mode    Message-based            UDP, HTTP (req/res)
                 Stream-based             TCP, WebRTC

Addressing       MAC (L2)                 ARP
                 IP (L3)                  IPv4/IPv6
                 DNS (L7)                 google.com

Directionality   Unidirectional           —
                 Half-duplex              Wi-Fi
                 Full-duplex              TCP, WebSockets

State            Stateful                 TCP, gRPC, Thrift
                 Stateless               UDP, HTTP (per-request)

Reliability      Guaranteed + retry       TCP
                 Best-effort             UDP

Error Handling   Status codes             HTTP (4xx/5xx), gRPC codes
                 None                     UDP

──────────────────────────────────────────────────────
KEY RULE: Protocol properties = design decisions made to solve
          a specific problem in a specific context.
          TCP ≠ always right. UDP ≠ always wrong.
──────────────────────────────────────────────────────
```

---

## 5. THE "AHA" MOMENT

**The TCP Stream Problem — Analogy: Listening to Someone Through a Wall**

Imagine you're trying to understand a conversation happening in the next room, but all you can hear is a **continuous murmur of sound** with no pauses, no punctuation, no silences between sentences. It's just one long unbroken noise. Your job is to figure out where one sentence ends and the next begins.

That's TCP. It gives your application a raw stream of bytes — no markers, no boundaries, no "this is where the message starts" signal. Just bytes. Your application has to listen to that stream and figure out on its own where one HTTP request ends and another begins.

Now imagine instead that someone slides **individual envelopes under the door**, one at a time. Each envelope is self-contained. You pick it up, it's a complete message, you read it, done. That's UDP — discrete, bounded datagrams.

The envelope approach seems simpler, right? But here's the catch: the person sliding envelopes under the door doesn't care if you got them. Some might get lost. They might arrive out of order. There's no acknowledgment. UDP is those envelopes.

TCP is the murmur — harder to parse, but every sound is guaranteed to arrive, in order, nothing missing. The cost is that your application has to do the work of finding the message boundaries in that stream. **That parsing cost, multiplied across billions of requests, is exactly why people are building new protocols to replace TCP in data centers.**

---

## 6. SHOW ME THE CODE

This example demonstrates the core stream-vs-message problem with TCP — the thing that bites engineers most often.

```javascript
// ─────────────────────────────────────────────
// tcp-stream-problem.js
// Demonstrates WHY TCP being a stream protocol requires
// application-level message framing — the most common TCP gotcha
// ─────────────────────────────────────────────

const net = require("net");

// WHY: We define a simple length-prefix framing protocol.
// This is how HTTP, Redis (RESP), and most real protocols solve
// the "where does the message end?" problem on a TCP stream.
//
// Message format: [4-byte length header][message body]
// The receiver reads the 4-byte header first, then knows
// exactly how many bytes to read for the full message.

function encodeMessage(text) {
  const body = Buffer.from(text, "utf8");
  const header = Buffer.alloc(4);
  
  // WHY: Write message length into first 4 bytes
  // Without this, the receiver has no idea where the message ends
  header.writeUInt32BE(body.length, 0);
  
  return Buffer.concat([header, body]);
}

function createMessageParser(onMessage) {
  // WHY: We maintain a buffer across multiple data events.
  // TCP might deliver partial messages — we can't assume one
  // 'data' event = one complete message. This trips people up constantly.
  let buffer = Buffer.alloc(0);

  return function handleData(chunk) {
    // Append incoming chunk to our running buffer
    buffer = Buffer.concat([buffer, chunk]);

    // Keep extracting complete messages as long as we have enough data
    while (buffer.length >= 4) {
      const messageLength = buffer.readUInt32BE(0); // Read the header

      // WHY: Check if the full message body has arrived yet.
      // This is the critical check — the stream might have delivered
      // only PART of a message. We wait until it's complete.
      if (buffer.length < 4 + messageLength) break;

      const messageBody = buffer.slice(4, 4 + messageLength).toString("utf8");
      
      // Advance the buffer past this message
      buffer = buffer.slice(4 + messageLength);

      onMessage(messageBody);
    }
  };
}

// ── Server ──────────────────────────────────────
const server = net.createServer((socket) => {
  console.log("[Server] Client connected");

  // WHY: We use our message parser — not raw 'data' events.
  // Raw data events would break if a message arrives in multiple chunks.
  const handleData = createMessageParser((message) => {
    console.log(`[Server] Complete message received: "${message}"`);
    socket.write(encodeMessage(`Echo: ${message}`));
  });

  socket.on("data", handleData);
  socket.on("end", () => console.log("[Server] Client disconnected"));
});

server.listen(7777, () => console.log("[Server] Listening on port 7777"));

// ── Client ──────────────────────────────────────
setTimeout(() => {
  const client = net.createConnection({ port: 7777 }, () => {
    console.log("[Client] Connected to server");

    const handleData = createMessageParser((message) => {
      console.log(`[Client] Got response: "${message}"`);
    });

    client.on("data", handleData);

    // WHY: Send two messages back-to-back immediately.
    // TCP may merge them into one chunk — our framing handles this correctly.
    client.write(encodeMessage("Hello from client"));
    client.write(encodeMessage("Second message"));

    setTimeout(() => client.end(), 1000);
  });
}, 100);

// Key takeaway:
// Without length-prefix framing, you'd have NO idea where
// "Hello from client" ends and "Second message" begins.
// This is the stream problem. Every protocol built on TCP must solve it.
```

**What this demonstrates:**
- TCP delivers a raw stream — two messages sent together may arrive as one chunk
- Application-level framing (length prefix) is how you find message boundaries
- The parser buffers partial data across multiple `data` events — this is mandatory
- HTTP solves this with `Content-Length` headers and `\r\n\r\n` delimiters — same idea, different syntax

---

## 7. WHERE YOU'LL SEE THIS IN THE WILD

**Data Format decisions in production:**

JSON over HTTP is everywhere — easy to debug with curl, readable in logs, works with every language. But at scale (say, 50k RPS) the parsing overhead adds up. That's why gRPC/Protobuf is dominant in internal microservice communication at companies like Google, Netflix, and Uber — binary is just faster and smaller.

**The TCP stream problem in real systems:**

Redis solves it with RESP — every response is prefixed with a type indicator and length. PostgreSQL's wire protocol does the same. WebSocket has its own framing layer on top of TCP. Every single protocol built on TCP has had to solve this problem independently. HTTP does it with `Content-Length` or chunked transfer encoding (`Transfer-Encoding: chunked`).

**Protocol mismatch causing real outages:**

When Kafka clients misparse a stream (partial message read, buffer overflow), they stall or crash. When a load balancer operates at Layer 4 (TCP) but the protocol needs Layer 7 understanding to route properly, requests get misrouted. These aren't theoretical — they're regular production incidents.

**TCP hitting its limits in data centers:**

Google's QUIC (which became HTTP/3) is a direct response to TCP's limitations — specifically its head-of-line blocking problem and the cost of its handshake. Microsoft's RoCE (RDMA over Converged Ethernet) bypasses TCP entirely for inter-server communication in Azure data centers. The Homa protocol mentioned in the lecture is a research effort targeting the same problem from a different angle. TCP will be around for decades, but the smart money is on it being replaced in data center contexts within 10–15 years.

**Stateless vs stateful design and horizontal scaling:**

REST APIs are stateless by design — any server can handle any request, which is why they scale horizontally so easily behind a load balancer. gRPC streams are stateful — you need sticky sessions or connection-aware load balancing. This is a direct consequence of the protocol's state property, and it shapes your entire infrastructure design.

---

## 8. EXPLAIN IT TO MY NON-TECH FRIEND

**The Story of Two Pen Pals and a Phone Call**

Imagine two ways to communicate with someone far away.

**Option 1: Letters.** You write a letter, seal it in an envelope, and mail it. The envelope is self-contained — it has a clear start, a clear end, and an address on the front. If it gets lost in the mail, you don't know unless they write back saying they never got it. That's like UDP — discrete messages, no guarantees.

**Option 2: A phone call.** Once you're connected, words just flow continuously. There's no "envelope" — it's just a stream of sound. But here's the thing: the phone company guarantees every sound arrives, in order, nothing dropped. If there's interference, it retransmits. That's TCP.

Now, the weird part about the phone call: if two people speak at exactly the same time without pausing, how do you know where one sentence ends and another begins? The phone doesn't tell you. You have to listen carefully for natural breaks, changes in topic, or you agree on a code — like "over" in walkie-talkie communication. **That's the framing problem engineers have to solve when building on top of TCP.**

The other properties — text vs binary, addressing, error handling — are just questions like: do we write our letters in plain English or shorthand? Do we use street addresses or GPS coordinates? What do we do if a letter comes back marked "undeliverable"? Every communication system has to answer these questions, and the answers depend entirely on what you're trying to accomplish.
