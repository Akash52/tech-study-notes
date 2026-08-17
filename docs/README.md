# Tech Study Notes

Plain-language notes on things worth understanding properly — one topic at a time.

> **New here?** Start with [Request-Response](backend-engineering/01_Request-Response-Notes.md) and work down the Backend Engineering list — each note builds on the one before it.
> Press <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>K</kbd> to search every section, and tick sections off as you go.

## Backend Engineering

*A lecture-style series — 16 notes, best read in order.*

1. [Request-Response](backend-engineering/01_Request-Response-Notes.md) — full cost timeline, serialization, boundary detection
2. [Sync vs Async](backend-engineering/02_Sync-vs-Async-Notes.md) — event loop, epoll, io_uring, async commit risks
3. [Push Model](backend-engineering/03_Push_Model.md) — WebSocket push, fan-out, heartbeats, connection cleanup
4. [Short Polling](backend-engineering/04_Short_Polling.md) — job-ID pattern, polling intervals, TTL strategies
5. [Long Polling](backend-engineering/05_Long_Polling.md) — long vs short poll, Kafka use case, timeout handling
6. [Server-Sent Events](backend-engineering/06_Server_Sent_Events.md) — SSE wire format, Last-Event-ID, auto-reconnect
7. [Pub/Sub](backend-engineering/07_Pub_Sub.md) — delivery guarantees, RabbitMQ vs Kafka, idempotency, DLQ
8. [Multiplexing & Pooling](backend-engineering/08_Multiplexing_Demultiplexing_Pooling.md) — HTTP/2 streams, QUIC, connection pooling, PgBouncer
9. [Stateful vs Stateless](backend-engineering/09_Stateful_VS_Stateless.md) — session vs JWT, the revocation problem, refresh tokens
10. [Sidecar Pattern](backend-engineering/10_Sidecar_Pattern.md) — service mesh, Envoy, Istio, Dapr

*Protocols — the layer everything above sits on.*

1. [Protocol Properties](backend-engineering/Protocol/01_Protocol.md) — framing, addressing, flow control, stateful vs stateless
2. [The OSI Model](backend-engineering/Protocol/02_OSI_Model.md) — 7 layers, L4 vs L7 proxies, VPNs, CDNs
3. [UDP](backend-engineering/Protocol/03_UDP.md) — connectionless transport, and when it is the right call
4. [TCP](backend-engineering/Protocol/04_TCP.md) — reliable transport, handshakes, congestion control
5. [TLS](backend-engineering/Protocol/05_TLS.md) — handshake, certificates, encryption in transit
6. [Internet Protocol](backend-engineering/Protocol/internet_protocol.md) — IP addressing, subnetting, TTL, ICMP

## Interview Prep

*Question-and-answer guides — 8 notes. Dip in by topic.*

- [JavaScript](interview-prep/javascript-interview-mastery-guide.md) — scope, closures, prototypes, async/await, the event loop, memory, ES6+
- [The JavaScript Interview Bible](javascript-interview-bible.md) — engine internals through to production war stories, chapter by chapter
- [React](interview-prep/react-interview-mastery-guide.md) — hooks, virtual DOM, Fiber, state, context, performance, Server Components, React 19
- [TypeScript](interview-prep/typescript-interview-mastery-guide.md) — types, generics, utility types, decorators, conditional types, declaration merging
- [Angular](interview-prep/angular-interview-questions.md) — components, services, NgModules, router, RxJS, signals, standalone, `@defer`
- [Design Patterns](interview-prep/design-patterns-interview-mastery-guide.md) — the GoF 23, singleton, observer, factory, strategy, modern JS/TS patterns
- [Data Structures & Algorithms](interview-prep/dsa-interview-mastery-guide.md) — Big-O, arrays, trees, graphs, dynamic programming, sorting
- [System Design](interview-prep/system-design-interview-mastery-guide.md) — scalability, CAP, caching, CQRS

## Language Guides

*Practical references — 3 notes.*

- [Modern JavaScript (ES2024)](language-guides/js-es2024-guide.md) — async/await, `toSorted()`, `Object.groupBy()`, `Promise.withResolvers()`, Set operations
- [Essential TypeScript](language-guides/ts-essentials-guide.md) — the daily-use subset: utility types, type guards, `unknown`, `satisfies`, `Result<T,E>`
- [TypeScript Q&A](language-guides/ts-interview-qa.md) — fast reference: interface vs type, generics, narrowing, strict mode

## Deep Dives

*Long-form explanations — 2 notes.*

- [React Fiber, Explained Simply](react_fiber_explained.md) — how React decides what to update, and why it matters for performance
- [React Fiber Internals](react-fiber-internals-notes.md) — building a "smoosh mode" with Dan Abramov to explore the begin/complete/commit phases, double buffering, and the reconciler source

## Cheatsheets

*Grab-and-go reference — 1 note.*

- [Docker](cheatsheets/docker-cheatsheet.md) — commands, logs, cleanup, common errors

## Tools

*Working with the tooling — 7 notes.*

- [GitHub Copilot Cloud Agent](tools/01_GitHub_Copilot_Cloud_Agent.md) — what the background agent does and when to reach for it
- [Asking Copilot to Create a PR](tools/02_Asking_Copilot_to_Create_a_Pull_Request.md) — entry points and how to phrase the request
- [Changing an Existing PR](tools/03_Asking_Copilot_to_Make_Changes_to_an_Existing_PR.md) — steering Copilot with `@copilot` review comments
- [Reviewing Copilot's PR](tools/04_Reviewing_a_Pull_Request_Created_by_Copilot.md) — what to check before merging, and why you still own the code
- [Tracking Copilot Sessions](tools/05_Tracking_GitHub_Copilot_Sessions.md) — following what the agent actually did
- [Copilot Interview Prep](tools/06_SDLC_Copilot.md) — Copilot features across the SDLC, in interview-answer form
- [Git Tricks](tools/GIT_TRICKS.md) — day-to-day scenarios and the commands that get you out of them
