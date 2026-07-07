# Server-Sent Events (SSE) — Lecture Breakdown

---

## 1. THE GIST

SSE is an elegant hack on top of plain HTTP: one request, but the response never ends. The server keeps writing small event chunks down the open connection indefinitely, and the browser's built-in `EventSource` object parses them automatically. It's real-time, works on any standard HTTP server (no WebSocket upgrade needed), and auto-reconnects for free. The critical gotcha is the HTTP/1.1 six-connection-per-domain limit — if you open six SSE streams, every other request to that domain starves. HTTP/2 eliminates this entirely. SSE wins when communication is server-to-client only and you want real-time without WebSocket complexity.

---

## 2. THE BREAKDOWN

### The Core Trick
Normal HTTP: request → response → **connection closes**.
SSE: request → response starts → **response never ends** → server keeps writing events forever.

The server sets `Content-Type: text/event-stream`, writes `data: <payload>\n\n`, and then just... keeps writing. Never calls the response-ending method. The browser's `EventSource` object knows this content type means "keep reading and fire events for each chunk."

### The Wire Format — Deceptively Simple
```
data: your message here\n\n
```
That's the minimal valid SSE event. The `\n\n` (double newline) is the event boundary — the protocol delimiter that tells the client "this event is complete, here's the next one." Extended format:
```
id: 42\n
event: user-login\n
data: {"userId": 7, "username": "alice"}\n\n
```
- `id` — enables resumability; browser sends `Last-Event-ID` header on reconnect
- `event` — named event type; client can listen for specific event names
- `data` — payload; must be on a single line (newline = end of field)

### The Browser `EventSource` API
```javascript
const es = new EventSource('/stream');
es.onmessage = e => console.log(e.data);                    // all events
es.addEventListener('user-login', e => console.log(e.data)); // named events
es.onerror = e => console.error('Connection error', e);
es.close(); // explicit disconnect
```
The browser handles all parsing, chunked transfer decoding, and automatic reconnection. Zero protocol implementation work on the client side — it's all built in.

### The HTTP/1.1 Six-Connection Limit — The Critical Gotcha
Browsers allow max **6 TCP connections per domain** under HTTP/1.1. SSE consumes one permanently (the response never finishes, so the connection is always "busy"). Open 6 SSE streams → zero connections left for CSS, JS, API calls — everything else starves.

```
6 SSE streams from same domain = 0 connections for anything else
→ JS files won't load
→ API calls queue indefinitely  
→ Page appears broken
```

**Fix:** Use HTTP/2. One TCP connection, multiplexed streams — SSE plus unlimited other requests coexist without conflict.

### Free Auto-Reconnect
Unlike WebSockets (where you implement reconnection manually), `EventSource` reconnects automatically if the connection drops. It sends `Last-Event-ID` header with the last received event ID so the server can resume from where it left off. This is built into the spec — you get it for free.

### SSE vs Push (WebSocket) — When Each Wins
| | SSE | WebSocket |
|---|---|---|
| Direction | Server → Client only | Bidirectional |
| Protocol | Plain HTTP | WS upgrade |
| Auto-reconnect | ✅ Built-in | ❌ Manual |
| HTTP/2 compatible | ✅ Yes | ✅ Yes |
| HTTP/1.1 conn limit | ⚠️ Yes (6-conn risk) | No (different protocol) |
| Browser support | All modern | All modern |
| Use case | Feed, notifications, streaming | Chat, gaming, collab |

---

## 3. ENGINEER'S NOTEBOOK

**Core idea:** One HTTP request, infinite response. Server writes `data: ...\n\n` chunks continuously. Client parses them as discrete events. Never call `res.end()`.

**Key moving parts:**
- `Content-Type: text/event-stream` — signals browser to use `EventSource` parsing
- `Cache-Control: no-cache` — prevents any proxy from buffering events
- `Connection: keep-alive` — ensures intermediaries don't close the connection
- `res.write()` — sends event chunks without ending response
- Never `res.end()` — calling this closes the stream
- `req.on('close')` — fires when client disconnects; MUST clean up here
- `Last-Event-ID` — browser sends this on reconnect; server uses it to resume

**Gotchas:**
- **Proxy buffering** — nginx and some CDNs buffer responses until they reach a minimum size threshold before forwarding. Your events will appear to "batch up" and deliver late. Fix: `X-Accel-Buffering: no` header for nginx, or `proxy_buffering off`
- **Connection leak without cleanup** — if you store client `res` objects and never remove them on disconnect, memory grows unboundedly. Always wire `req.on('close')` to remove from your registry
- **HTTP/1.1 six-connection wall** — if your frontend opens multiple SSE streams to the same domain on HTTP/1.1, you will hit this. Test with DevTools Network tab → look for "stalled" requests. Fix: ensure HTTP/2 in production
- **Multiline data** — SSE data must be on a single line per field. If your payload has newlines (e.g., raw JSON with formatting), serialize it first: `JSON.stringify(payload)` collapses it to one line
- **EventSource is browser-only** — Node.js doesn't have native `EventSource`. For server-to-server SSE consumption, use `fetch` with streaming response body or the `eventsource` npm package
- **No binary data** — SSE is text-only. Base64 encode binary data if needed, or use WebSockets instead

**Terms worth knowing:**
- **Chunked Transfer Encoding** — HTTP mechanism for sending response body in pieces without knowing total size upfront; SSE rides on this
- **`EventSource`** — browser API for SSE; handles parsing, reconnection, event ID tracking automatically
- **Event boundary** — the `\n\n` double newline marking the end of one SSE event and start of the next
- **`text/event-stream`** — the Content-Type that activates SSE parsing in the browser
- **`Last-Event-ID`** — header the browser sends on reconnect containing the `id` of the last received event; enables resumable streams
- **Proxy buffering** — intermediary (nginx, CDN) accumulating response bytes before forwarding; breaks SSE's real-time delivery

**⚠️ Don't forget this:**
- Never call `res.end()` while streaming — it closes the SSE connection
- Always handle `req.on('close')` to remove dead connections — missing this is a memory leak
- Check for proxy buffering in staging — SSE often works locally but "batches" through nginx without the right headers
- HTTP/2 in production is not optional if you're using SSE — six-connection limit will bite you
- `EventSource` auto-reconnects with `Last-Event-ID` for free — use `id:` in your events to enable proper resumability

---

## 4. QUICK REFERENCE CARD

```
SERVER-SENT EVENTS — QUICK REF
─────────────────────────────────────────────────
Pattern: 1 request → infinite response → stream of events

Required server headers:
  Content-Type: text/event-stream
  Cache-Control: no-cache
  Connection: keep-alive
  X-Accel-Buffering: no   ← nginx anti-buffering

Event wire format:
  data: payload\n\n                          ← minimal
  id: 42\nevent: login\ndata: payload\n\n    ← full

Client (browser):
  const es = new EventSource('/stream');
  es.onmessage = e => console.log(e.data);
  es.addEventListener('login', handler);     ← named events
  es.close();

Server rules:
  ✓ res.write('data: msg\n\n')   ← send event
  ✗ res.end()                    ← closes stream (never call)
  ✓ req.on('close', cleanup)     ← remove dead connections

HTTP/1.1 connection limit:
  6 connections/domain max
  Each SSE = 1 permanent connection
  6 SSE streams = page completely starved
  Fix: ensure HTTP/2 (multiplexed, no limit)

vs WebSocket:
  SSE    = server→client only, HTTP, auto-reconnect, simple
  WS     = bidirectional, upgrade protocol, manual reconnect
─────────────────────────────────────────────────
```

---

## 5. THE "AHA" MOMENT

**The Sports Radio Broadcast**

Normal HTTP is like calling a sports hotline for scores. You call, they answer, you hang up. To get the next update you call again. Every call is a full round trip.

**SSE is subscribing to live radio.** You tune in once. The broadcaster keeps talking — play-by-play, score updates, commentary — and you just listen. You didn't ask for each piece of news. It just comes to you continuously over the same channel you opened at the start.

Now here's the elegant engineering insight: **it's still just a phone call.** There's no special "radio protocol." It's the same telephone network everyone uses. The only trick is that the broadcaster never says "that's all for today" — they just keep talking. The phone line stays open. That's it. That's SSE.

**The six-connection problem** becomes obvious with this analogy. Imagine you only have six phone lines into your house (HTTP/1.1's limit). If you use all six to subscribe to six different radio stations, nobody can call you, you can't order pizza, your fax machine is dead. Everything else is blocked because all your lines are busy with open broadcasts.

HTTP/2 is like upgrading to a single fiber optic line that can carry 200 conversations simultaneously. One line — six radio subscriptions plus all your normal calls, all at once, no conflict.

**The `Last-Event-ID` reconnect** is like the radio station saying "you're listening to segment 247" every few minutes. If the signal drops and you reconnect, you tell them "I last heard segment 247" and they pick up exactly from 248. That resumability is free — built into the protocol — and it's one of SSE's most underrated features.

---

## 6. SHOW ME THE CODE

```javascript
// ─────────────────────────────────────────────────────
// SERVER-SENT EVENTS — Node.js / Express (production-ready)
// npm install express uuid
//
// Includes: connection registry, cleanup, named events,
// resumability via Last-Event-ID, anti-buffering headers
// ─────────────────────────────────────────────────────

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(express.json());

// ── Connection Registry ───────────────────────────────
// Map of clientId → { res, lastEventId, connectedAt }
// WHY Map not Array: O(1) delete on disconnect, no filtering needed
const clients = new Map();

// ── SSE Connection endpoint ───────────────────────────
app.get("/stream", (req, res) => {

  // ── 1. Set SSE headers ─────────────────────────────
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  // ⚠️ CRITICAL for nginx: without this, nginx buffers events
  // and delivers them in batches instead of real-time
  res.setHeader("X-Accel-Buffering", "no");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // ── 2. Handle resumability ─────────────────────────
  // Browser sends this header on reconnect with last received event ID
  // WHY: allows server to replay missed events since disconnection
  const lastEventId = req.headers["last-event-id"] || null;
  if (lastEventId) {
    console.log(`[SSE] Client resuming from event ID: ${lastEventId}`);
    // In production: query your event store for events after lastEventId
    // and replay them before resuming live stream
  }

  // ── 3. Register this client ────────────────────────
  const clientId = uuidv4();
  clients.set(clientId, { res, lastEventId, connectedAt: Date.now() });
  console.log(`[SSE] Client ${clientId.slice(0,8)} connected | Total: ${clients.size}`);

  // ── 4. Send initial event ──────────────────────────
  sendEvent(res, {
    id: Date.now(),
    eventName: "connected",
    data: { clientId, message: "Stream open", connectedClients: clients.size }
  });

  // ── 5. Handle disconnect ───────────────────────────
  // ⚠️ CRITICAL: without this, dead connections stay in registry forever
  // Memory grows unboundedly; broadcast loop slows with every disconnect
  req.on("close", () => {
    clients.delete(clientId);
    console.log(`[SSE] Client ${clientId.slice(0,8)} disconnected | Total: ${clients.size}`);
  });

  // ── 6. NEVER call res.end() here ──────────────────
  // res.end() closes the HTTP response = closes the SSE stream
  // The browser would immediately reconnect (auto-reconnect is built-in)
  // but we'd lose the current stream context
});

// ── Broadcast to all connected clients ───────────────
// This is the server-push operation: one event → all clients
function broadcast(data, eventName = null) {
  let sent = 0;

  clients.forEach((client, clientId) => {
    try {
      sendEvent(client.res, {
        id: Date.now(),
        eventName,
        data
      });
      sent++;
    } catch (err) {
      // Write to dead connection — clean it up
      console.error(`[SSE] Failed to send to ${clientId.slice(0,8)}, removing`);
      clients.delete(clientId);
    }
  });

  return sent;
}

// ── SSE event formatter ───────────────────────────────
// Formats payload into the SSE wire protocol
function sendEvent(res, { id, eventName, data }) {
  let chunk = "";

  // id field: enables Last-Event-ID resumability
  // Without this, browser can't tell server where to resume from
  if (id) chunk += `id: ${id}\n`;

  // event field: named events (client uses addEventListener)
  // Without this, defaults to "message" event (es.onmessage)
  if (eventName) chunk += `event: ${eventName}\n`;

  // data field: the actual payload
  // JSON.stringify ensures no embedded newlines break the format
  chunk += `data: ${JSON.stringify(data)}\n\n`; // ← double \n = event boundary

  res.write(chunk);
}

// ── Example: trigger a broadcast via POST ─────────────
// Simulates: new message, user login notification, system alert
app.post("/broadcast", (req, res) => {
  const { message, eventName } = req.body;
  const count = broadcast({ message, timestamp: Date.now() }, eventName);
  res.json({ message: `Broadcast to ${count} clients` });
});

// ── Heartbeat to keep connections alive ───────────────
// Some proxies close idle connections after 30-60s
// WHY: a comment line (starting with :) is a valid SSE no-op
// it keeps the connection alive without triggering a client event
setInterval(() => {
  clients.forEach((client) => {
    client.res.write(": heartbeat\n\n"); // SSE comment — ignored by EventSource
  });
}, 15_000);

app.listen(3000, () => console.log("SSE server on :3000"));

// ─────────────────────────────────────────────────────
// CLIENT USAGE (paste in browser console):
//
// const es = new EventSource('http://localhost:3000/stream');
//
// // Default handler (catches events without named 'event:' field)
// es.onmessage = e => console.log('message:', JSON.parse(e.data));
//
// // Named event handler (matches eventName in broadcast)
// es.addEventListener('alert', e => console.log('alert:', JSON.parse(e.data)));
//
// // Auto-reconnect is BUILT IN — no code needed
// // On reconnect, browser automatically sends Last-Event-ID header
//
// es.close(); // explicit disconnect
//
// TRIGGER A BROADCAST (from another terminal):
// curl -X POST http://localhost:3000/broadcast \
//   -H "Content-Type: application/json" \
//   -d '{"message": "Hello all!", "eventName": "alert"}'
// ─────────────────────────────────────────────────────
```

---

## 7. WHERE YOU'LL SEE THIS IN THE WILD

**AI Token Streaming (the most visible example today)** — Every LLM that shows a typewriter effect — Claude, ChatGPT, Copilot — uses SSE. The model generates a token, server writes `data: {"token":"Hello"}\n\n`, browser appends it to the UI. The "thinking" animation and progressive text reveal are both SSE streams. The Anthropic API's streaming endpoint is literally `Content-Type: text/event-stream`.

**GitHub Copilot inline suggestions** — Code completions that appear character-by-character in your editor are SSE streams from GitHub's inference servers. The VS Code extension opens one SSE connection per completion request and renders tokens as they arrive.

**Live Build Logs (Vercel, Netlify, Railway)** — When you deploy and watch the build log scroll in real time, that's SSE. The build server writes log lines as events; your browser renders them as they arrive. No polling. No WebSocket complexity. Just an open HTTP response that keeps writing.

**Financial Dashboards and Stock Tickers** — Platforms like Robinhood, Coinbase, and Bloomberg terminals use SSE (or WebSockets) for price feed updates. The moment a trade executes, a price change event is written to all subscribed SSE streams. At lower frequency (seconds not milliseconds), SSE is often preferred over WebSockets for its simplicity.

**Notification Systems in SaaS** — Linear, Notion, and similar tools use SSE to push "someone commented on your doc," "build failed," or "you have a new mention" notifications. One persistent SSE connection per logged-in user. Server writes an event when something relevant happens. Browser shows the notification badge without any polling.

**Server-Sent Progress for Long Operations** — Export jobs, data migrations, bulk operations. Instead of short-polling `/status/:id` repeatedly, the server opens an SSE stream that writes progress events: `data: {"progress": 45}\n\n`. Client gets live progress without the chatty round trips of polling.

**Why not WebSockets for all of this?** SSE wins when you don't need client-to-server messages over the same channel, you want HTTP/2 multiplexing for free, auto-reconnect without implementing it yourself, and compatibility with standard HTTP infrastructure (CDNs, proxies, load balancers) without special handling.

---

## 8. EXPLAIN IT TO MY NON-TECH FRIEND

Imagine how a regular phone call works versus a news ticker at the bottom of a TV broadcast.

A regular phone call (normal web request): you call someone, they answer, you talk, you hang up. Every time you want information, you call again.

**SSE is the news ticker.** You turn on the TV once — that's your one request. From that moment on, the news channel just keeps sending you information: weather updates, stock prices, breaking news. You never called again. The channel just... keeps talking to you. The TV screen is always updating with whatever the channel sends next.

The clever part is that this runs over the same "cables" as a regular website — no special equipment. The only trick is that the channel never says "that's all for today." It just keeps the broadcast going until you turn off the TV.

**The six-connection problem** is like having only six TV sets in your house. If you use all six to watch six different news tickers, you can't watch movies, you can't play video games, your kids can't watch cartoons — every screen is occupied with news feeds. HTTP/2 is like upgrading so all six news tickers run on one TV in a split-screen, freeing the other five for everything else.

**The resume feature** is like a news ticker that tells you "this was item #247." If your TV loses signal and comes back, it tells the channel "I last saw item 247" and the ticker resumes from 248. No gaps. This happens automatically — you don't have to do anything.

That's SSE. Tune in once, get a live feed forever, with automatic recovery built in.
