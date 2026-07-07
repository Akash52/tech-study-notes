# 📚 Tech Study Notes

Plain-language notes on things worth understanding properly — one topic at a time.

Use the sidebar to browse, or hit `/` to search.

## Deep Dives

- [React Fiber, Explained Simply](react_fiber_explained.md) — how React decides what to update, and why it matters for performance.

## Interview Prep

| Note | Topics |
|---|---|
| [Angular Interview Questions and Answers](interview-prep/angular-interview-questions.md) | Components, Services, NgModules, Router, RxJS, Signals, Standalone, Control Flow, `@defer` |
| [React Interview Mastery Guide](interview-prep/react-interview-mastery-guide.md) | Hooks, Virtual DOM, Fiber, State, Context, Performance, Server Components, React 19 |
| [JavaScript Interview Mastery Guide](interview-prep/javascript-interview-mastery-guide.md) | Scope, Closures, Prototypes, Async/Await, Event Loop, Memory, ES6+ |
| [TypeScript Interview Mastery Guide](interview-prep/typescript-interview-mastery-guide.md) | Types, Generics, Utility Types, Decorators, Conditional Types, Declaration Merging |
| [Design Patterns Interview Mastery Guide](interview-prep/design-patterns-interview-mastery-guide.md) | GoF 23 Patterns, Singleton, Observer, Factory, Strategy, modern JS/TS patterns |
| [Data Structures & Algorithms Interview Mastery Guide](interview-prep/dsa-interview-mastery-guide.md) | Big-O, Arrays, Trees, Graphs, DP, Sorting |
| [System Design Interview Mastery Guide](interview-prep/system-design-interview-mastery-guide.md) | Scalability, CAP, Caching, CQRS |

## Language Guides

| Note | Topics |
|---|---|
| [Modern JavaScript (ES2024)](language-guides/js-es2024-guide.md) | async/await, `toSorted()`, `Object.groupBy()`, `Promise.withResolvers()`, Set operations |
| [Essential TypeScript](language-guides/ts-essentials-guide.md) | The daily-use subset — utility types, type guards, `unknown`, `satisfies`, `Result<T,E>` |
| [TypeScript Interview Q&A](language-guides/ts-interview-qa.md) | Fast-reference: interface vs type, generics, narrowing, strict mode |

## Backend Engineering

A lecture-style series covering core backend concepts from scratch.

| Note | Topic |
|---|---|
| [Request-Response](backend-engineering/01_Request-Response-Notes.md) | Full cost timeline, serialization, boundary detection |
| [Sync vs Async](backend-engineering/02_Sync-vs-Async-Notes.md) | Event loop, epoll, io_uring, async commit risks |
| [Push Model](backend-engineering/03_Push_Model.md) | WebSocket push, fan-out, heartbeats, connection cleanup |
| [Short Polling](backend-engineering/04_Short_Polling.md) | Job-ID pattern, polling intervals, TTL strategies |
| [Long Polling](backend-engineering/05_Long_Polling.md) | Long poll vs short poll, Kafka use case, timeout handling |
| [Server-Sent Events](backend-engineering/06_Server_Sent_Events.md) | SSE wire format, Last-Event-ID, auto-reconnect |
| [Pub/Sub](backend-engineering/07_Pub_Sub.md) | Delivery guarantees, RabbitMQ vs Kafka, idempotency, DLQ |
| [Multiplexing & Pooling](backend-engineering/08_Multiplexing_Demultiplexing_Pooling.md) | HTTP/2 streams, QUIC, connection pooling, PgBouncer |
| [Stateful vs Stateless](backend-engineering/09_Stateful_VS_Stateless.md) | Session vs JWT, revocation problem, refresh tokens |
| [Sidecar Pattern](backend-engineering/10_Sidecar_Pattern.md) | Service mesh, Envoy, Istio, Dapr |
| [Protocol Properties](backend-engineering/Protocol/01_Protocol.md) | Framing, addressing, flow control, stateful vs stateless |
| [OSI Model](backend-engineering/Protocol/02_OSI_Model.md) | 7 layers, L4 vs L7 proxies, VPNs, CDNs |
| [UDP](backend-engineering/Protocol/03_UDP.md) | Connectionless transport, use cases |
| [TCP](backend-engineering/Protocol/04_TCP.md) | Reliable transport, handshakes, congestion control |
| [TLS](backend-engineering/Protocol/05_TLS.md) | Handshake, certificates, encryption in transit |
| [Internet Protocol](backend-engineering/Protocol/internet_protocol.md) | IP addressing, subnetting, TTL, ICMP |

## Cheatsheets

- [Docker Cheatsheet](cheatsheets/docker-cheatsheet.md) — commands, logs, cleanup, common errors

## Tools

- [GitHub Copilot Cloud Agent](tools/01_GitHub_Copilot_Cloud_Agent.md)
- [Asking Copilot to Create a Pull Request](tools/02_Asking_Copilot_to_Create_a_Pull_Request.md)
- [Asking Copilot to Make Changes to an Existing PR](tools/03_Asking_Copilot_to_Make_Changes_to_an_Existing_PR.md)
- [Reviewing a Pull Request Created by Copilot](tools/04_Reviewing_a_Pull_Request_Created_by_Copilot.md)
- [Tracking GitHub Copilot Sessions](tools/05_Tracking_GitHub_Copilot_Sessions.md)
- [Copilot Interview Prep](tools/06_SDLC_Copilot.md)
- [Git Day-to-Day Tricks & Scenarios](tools/GIT_TRICKS.md)
