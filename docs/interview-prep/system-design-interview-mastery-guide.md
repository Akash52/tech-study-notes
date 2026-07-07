# System Design Interview Mastery Guide

This guide covers backend systems, frontend architecture, and full-stack integration for system design interviews. Each topic includes architecture diagrams, TypeScript implementations, capacity estimations, and interview guidance. The questions progress from foundational concepts to advanced distributed systems patterns.

| Prerequisites | Description |
|---------------|-------------|
| Networking basics | HTTP, TCP/IP, DNS |
| Database fundamentals | ACID, indexing, joins |
| Data structures and algorithms | Hash maps, trees, graphs |
| Frontend frameworks | React, Vue, or Angular |
| RESTful API concepts | HTTP verbs, status codes, resource modeling |
| Cloud services basics | AWS, GCP, or Azure fundamentals |

## Table of contents

### Part 1: Foundational System Design (Q1-Q10)

| # | Topic | Difficulty |
|---|-------|------------|
| 1 | [System Design Fundamentals](#q1-system-design-fundamentals) — CAP theorem, scalability, availability | Beginner |
| 2 | [Load Balancing and Reverse Proxy](#q2-load-balancing-and-reverse-proxy) — Distribution strategies, health checks | Beginner |
| 3 | [Caching Strategies](#q3-caching-strategies) — Redis, CDN, browser cache, cache invalidation | Intermediate |
| 4 | [Database Design](#q4-database-design) — SQL vs NoSQL, sharding, replication, indexing | Intermediate |
| 5 | [API Design](#q5-api-design) — REST, GraphQL, gRPC, versioning, rate limiting | Intermediate |
| 6 | Message Queues and Event Streaming — RabbitMQ, Kafka, async processing | Intermediate |
| 7 | Microservices Architecture — Service decomposition, communication patterns | Advanced |
| 8 | Authentication and Authorization — OAuth2, JWT, SSO, RBAC | Intermediate |
| 9 | Monitoring and Observability — Logging, metrics, tracing, alerting | Intermediate |
| 10 | Content Delivery Network (CDN) — Edge caching, global distribution | Beginner |

### Part 2: Frontend Architecture and System Design (Q11-Q15)

| # | Topic | Difficulty |
|---|-------|------------|
| 11 | Frontend Architecture Patterns — MVC, Flux, Redux, Component architecture | Intermediate |
| 12 | State Management at Scale — Global state, server state, local state | Intermediate |
| 13 | Frontend Performance Optimization — Code splitting, lazy loading, bundling | Intermediate |
| 14 | Real-time Frontend Systems — WebSockets, SSE, polling strategies | Intermediate |
| 15 | Micro-Frontends — Module federation, component sharing, deployment | Advanced |

### Part 3: Full-Stack System Design Problems (Q16-Q25)

| # | Topic | Difficulty |
|---|-------|------------|
| 16 | Design URL Shortener — End-to-end with frontend | Intermediate |
| 17 | Design Social Media Feed — Twitter/Instagram timeline with UI | Advanced |
| 18 | Design E-Commerce Platform — Product catalog, cart, checkout flow | Advanced |
| 19 | Design Video Streaming Service — YouTube/Netflix with player | Advanced |
| 20 | Design Real-time Collaboration Tool — Google Docs/Figma with CRDT | Advanced |
| 21 | Design Ride-Sharing App — Uber/Lyft with live tracking | Advanced |
| 22 | Design Chat Application — WhatsApp/Slack with message sync | Advanced |
| 23 | Design Search Autocomplete — Frontend + backend with ranking | Intermediate |
| 24 | Design Notification System — Multi-channel with preferences UI | Advanced |
| 25 | Design Analytics Dashboard — Real-time data visualization | Advanced |

### Part 4: Advanced System Design (Q26-Q30)

| # | Topic | Difficulty |
|---|-------|------------|
| 26 | Distributed Systems Patterns — Saga, CQRS, Event Sourcing | Advanced |
| 27 | Data Consistency and Replication — Eventual consistency, conflict resolution | Advanced |
| 28 | High Availability and Disaster Recovery — Failover, backup strategies | Advanced |
| 29 | Security Architecture — DDoS protection, encryption, secure frontend | Advanced |
| 30 | Global Scale Systems — Multi-region, geo-distribution, data sovereignty | Advanced |

### Part 5: Behavioral Questions (Q31-Q35)

| # | Topic |
|---|-------|
| 31 | System Design Trade-offs — STAR format examples |
| 32 | Scaling Challenges — Real production incidents |
| 33 | Cross-Team Collaboration — Frontend-backend alignment |
| 34 | Technical Debt — Architectural decisions and refactoring |
| 35 | Performance Optimization Stories — End-to-end improvements |

### Part 6: Quick Fire Round (Q36-Q45)

Rapid-fire system design concepts and comparisons.

### Part 7: Interview Success Resources

System design frameworks (USCALES, RADIO), company-specific focus areas, essential resources, practice platforms, and preparation timeline.

---

## Study strategy

### By experience level

| Level | Focus areas | Study time | Key goals |
|-------|-------------|------------|-----------|
| Junior (0-2 yrs) | Q1-Q5, Q10, Q16, Q23 | 6-8 weeks | Fundamentals, simple diagrams, basic trade-offs |
| Mid-Level (2-5 yrs) | Q1-Q15, Q16-Q18, Q23-Q24 | 8-10 weeks | Deep dive all foundations + frontend architecture, capacity estimates |
| Senior (5+ yrs) | All Q1-Q45 | 4-6 weeks | Distributed systems, multi-region, security, driving ambiguity |

### Preparation timeline

| Weeks | Focus |
|-------|-------|
| 1-2 | CAP theorem, scalability, load balancing, caching, database fundamentals |
| 3-4 | API design (REST, GraphQL), message queues, authentication, monitoring |
| 5-6 | Component architecture, state management, performance optimization, real-time |
| 7-8 | Full-stack problems (2-3 per week), end-to-end diagrams, capacity estimates |
| 9-10 | Distributed systems, multi-region, mock interviews, behavioral stories |

### USCALES framework

Use this framework for every system design problem:

| Step | Meaning | Actions |
|------|---------|---------|
| U | Understand requirements | Functional + non-functional requirements |
| S | Scope the problem | What is in/out of scope |
| C | Capacity estimation | Users, requests, storage |
| A | API design | Endpoints, data models |
| L | Low-level design | Component details |
| E | Extensions | How to scale, future features |
| S | Security and monitoring | Auth, logging, alerting |

> **Note:** Always include both frontend and backend in your designs. Show data flow in both directions. Label all components, number the steps, and include databases, caches, and queues.

### Capacity estimation reference

| Metric | How to estimate |
|--------|----------------|
| DAU | Daily Active Users |
| QPS | Queries per second = DAU x actions/user / 86400 |
| Peak QPS | ~3x average QPS |
| Storage | items/day x item_size x retention_years x 365 |
| Bandwidth | QPS x average_response_size |
| Cache size | Working set (80/20 rule) x item_size |

---

## Q1: System Design Fundamentals

System design fundamentals cover the core concepts needed for every architecture discussion: the CAP theorem, horizontal vs vertical scaling, latency vs throughput trade-offs, availability calculations, and designing for failure.

### Syntax

| Concept | Summary |
|---------|---------|
| CAP Theorem | Consistency, Availability, Partition Tolerance — pick two |
| Horizontal scaling | Add more machines |
| Vertical scaling | Add more resources to one machine |
| Latency | Time to complete a single request |
| Throughput | Requests processed per unit time |
| Availability | Uptime percentage, measured in "nines" |

### Description

#### CAP Theorem

In a distributed system experiencing a network partition (P), you must choose between consistency (C) and availability (A). Partition tolerance is mandatory in any distributed system, so the real choice is CP or AP.

| System type | Behavior during partition | Examples |
|-------------|--------------------------|----------|
| CP | Rejects requests to stay consistent | MongoDB, HBase, Redis |
| AP | Serves requests with potentially stale data | Cassandra, DynamoDB, CouchDB |
| CA | Not partition-tolerant (single-node only) | Traditional RDBMS |

> **Note:** Most modern systems use eventual consistency (AP) with tunable consistency levels. Banking systems choose CP; social media systems choose AP.

#### Horizontal vs vertical scaling

| Aspect | Vertical (scale up) | Horizontal (scale out) |
|--------|---------------------|------------------------|
| Approach | Bigger machine | More machines |
| Limit | Hardware ceiling | Nearly infinite |
| Fault tolerance | Single point of failure | Redundancy built in |
| Complexity | Simple, no code changes | Load balancer, consistency challenges |
| Cost | Expensive at high end | Cost-effective (commodity hardware) |
| Downtime | Required for upgrades | Rolling updates, zero downtime |
| Best for | Databases, legacy systems | Web servers, APIs, microservices |

#### Latency vs throughput

| Priority | Strategy | Use case |
|----------|----------|----------|
| Low latency | Cache aggressively, CDN, read replicas, optimized queries | Real-time gaming, trading platforms |
| High throughput | Batch processing, async operations, message queues, horizontal scaling | Log processing, analytics, batch jobs |
| Both | Expensive — caching, CDN, many servers | Large-scale production systems |

#### Availability

| Nines | Uptime % | Downtime per year | Downtime per month |
|-------|----------|--------------------|--------------------|
| Two nines | 99% | 87h 36m | 7h 18m |
| Three nines | 99.9% | 8h 45m | 43m |
| Four nines | 99.99% | 52m | 4m 23s |
| Five nines | 99.999% | 5m 15s | 26s |

### Examples

**CP system — banking transaction with locks:**

```typescript
interface BankTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

class ConsistentBankingSystem {
  private balances = new Map<string, number>();
  private locks = new Map<string, boolean>();

  async transfer(from: string, to: string, amount: number): Promise<boolean> {
    await this.acquireLocks([from, to]);
    try {
      const balance = this.balances.get(from) || 0;
      if (balance < amount) return false; // Consistent — reject insufficient funds
      this.balances.set(from, balance - amount);
      this.balances.set(to, (this.balances.get(to) || 0) + amount);
      return true;
    } finally {
      this.releaseLocks([from, to]);
    }
  }

  private async acquireLocks(accounts: string[]): Promise<void> {
    for (const acct of accounts.sort()) { // Sort to prevent deadlock
      while (this.locks.get(acct)) {
        await new Promise(r => setTimeout(r, 10));
      }
      this.locks.set(acct, true);
    }
  }

  private releaseLocks(accounts: string[]): void {
    accounts.forEach(a => this.locks.delete(a));
  }
}
```

**AP system — social media likes (eventual consistency):**

```typescript
class AvailableSocialSystem {
  private likes = new Map<string, Set<string>>(); // postId -> userIds

  async like(userId: string, postId: string): Promise<void> {
    // Always available — accept write immediately (AP)
    if (!this.likes.has(postId)) this.likes.set(postId, new Set());
    this.likes.get(postId)!.add(userId);

    // Async replication — don't block the client
    this.replicateAsync({ userId, postId, timestamp: Date.now() });
  }

  getLikeCount(postId: string): number {
    return this.likes.get(postId)?.size || 0; // May return stale data
  }

  private async replicateAsync(like: {
    userId: string; postId: string; timestamp: number;
  }): Promise<void> {
    setTimeout(() => {
      console.log(`Replicated to nodes: ${like.postId}`);
    }, 0);
  }
}
```

**Load balancer with round-robin:**

```typescript
class LoadBalancer {
  private servers: string[] = [];
  private currentIndex = 0;

  addServer(url: string): void {
    this.servers.push(url);
  }

  getNextServer(): string {
    const server = this.servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.servers.length;
    return server;
  }

  async handleRequest(request: any): Promise<any> {
    const server = this.getNextServer();
    return fetch(server, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

const lb = new LoadBalancer();
lb.addServer('http://server1:3000');
lb.addServer('http://server2:3000');
lb.addServer('http://server3:3000');
```

**Latency percentile tracker:**

```typescript
class PerformanceMetrics {
  private requestTimes: number[] = [];

  async measure<T>(op: () => Promise<T>): Promise<{ result: T; latency: number }> {
    const start = performance.now();
    const result = await op();
    const latency = performance.now() - start;
    this.requestTimes.push(latency);
    return { result, latency };
  }

  getPercentile(p: number): number {
    const sorted = [...this.requestTimes].sort((a, b) => a - b);
    const idx = Math.floor((p / 100) * sorted.length);
    return sorted[idx] || 0;
  }

  getP50(): number { return this.getPercentile(50); }
  getP95(): number { return this.getPercentile(95); }
  getP99(): number { return this.getPercentile(99); }
}
```

**Availability calculator:**

```typescript
class AvailabilityCalculator {
  getDowntimeAllowance(nines: number) {
    const percent = 100 - parseFloat('9'.repeat(nines));
    const yearlyMin = 365.25 * 24 * 60 * (percent / 100);
    const monthlyMin = 30 * 24 * 60 * (percent / 100);
    return {
      yearly: `${Math.floor(yearlyMin / 60)}h ${Math.floor(yearlyMin % 60)}m`,
      monthly: `${Math.floor(monthlyMin / 60)}h ${Math.floor(monthlyMin % 60)}m`,
    };
  }
}
```

**High availability with failover:**

```typescript
class HighAvailabilitySystem {
  private primaryDB = 'db-primary';
  private replicas = ['db-replica-1', 'db-replica-2'];

  async executeQuery(query: string): Promise<any> {
    if (await this.checkHealth(this.primaryDB)) {
      return this.queryDatabase(this.primaryDB, query);
    }
    // Failover to replicas
    for (const replica of this.replicas) {
      if (await this.checkHealth(replica)) {
        console.warn(`Primary down, using replica: ${replica}`);
        return this.queryDatabase(replica, query);
      }
    }
    throw new Error('All databases unavailable');
  }

  private async checkHealth(service: string): Promise<boolean> {
    try {
      await fetch(`http://${service}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      return true;
    } catch { return false; }
  }

  private async queryDatabase(db: string, query: string) {
    return { success: true, data: [] };
  }
}
```

**Capacity estimation example — Twitter:**

```
DAU: 200 million

Writes:
- Tweets/day: 200M * 2 = 400M
- TPS: 400M / 86400 ≈ 4.6K
- Peak (3x): ~14K TPS

Reads:
- Timeline views: 200M * 50 = 10B/day
- RPS: 10B / 86400 ≈ 115K
- Peak: ~350K RPS

Storage (5 years):
- Tweets: 400M/day * 365 * 5 = 730B tweets
- Size: 730B * 1KB = 730TB

Bandwidth:
- Write: 4.6K TPS * 1KB = 4.6 MB/s
- Read: 115K RPS * 1KB = 115 MB/s
```

### Comparison

| Principle | Guideline |
|-----------|-----------|
| Design for failure | Assume everything fails. Use retries with exponential backoff, circuit breakers, and fallback mechanisms |
| Loose coupling | Services should be independent. Use message queues for async communication and versioned API contracts |
| Stateless design | Store state in databases/caches. Enables horizontal scaling and easy server replacement |

### Interview guidance

**How to explain it:**

> "System design is about creating scalable, reliable, and maintainable architectures. The core concepts are CAP theorem, horizontal vs vertical scaling, latency vs throughput trade-offs, and designing for failure. Modern systems balance these trade-offs based on business requirements."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| How do you design for high availability? | Multi-region active-active deployment, health checks every 30s, automatic failover via load balancer, database replication with read replicas, circuit breakers, comprehensive monitoring, target 99.99% uptime |
| CAP theorem in practice? | Network partitions are inevitable (P is mandatory). Banking chooses CP — better to reject than show wrong balance. Social media chooses AP — better to show stale data than be unavailable. Most systems use eventual consistency |

**Difficulty:** Beginner

---

## Q2: Load Balancing and Reverse Proxy

A load balancer distributes incoming traffic across multiple servers so no single server is overwhelmed. A reverse proxy sits in front of backend servers to provide caching, SSL termination, rate limiting, and request routing.

### Syntax

| Component | Role |
|-----------|------|
| Load balancer | Distributes requests to healthy backend servers |
| Reverse proxy | Adds caching, SSL termination, compression, rate limiting |
| Health check | Periodic probe to verify server is responsive |
| Layer 4 (L4) | Routes by IP/port (TCP/UDP level) — fast, no content inspection |
| Layer 7 (L7) | Routes by URL, headers, cookies (HTTP level) — smart routing |

| Algorithm | Mechanism | Best for |
|-----------|-----------|----------|
| Round Robin | Rotate through servers sequentially | Stateless apps, equal servers |
| Least Connections | Pick server with fewest active connections | Long-lived connections |
| IP Hash | Hash client IP to select server | Session affinity |
| Weighted Round Robin | Servers with higher weight get more requests | Heterogeneous servers |

### Description

Load balancers are deployed at the network edge between clients and backend servers. They perform health checks (typically every 30 seconds) and automatically remove unhealthy servers from rotation. When a failed server recovers, it is re-added.

A reverse proxy is typically the same component (Nginx, HAProxy) and handles:
- **SSL termination** — decrypts HTTPS, forwards HTTP internally
- **Response caching** — caches GET responses to reduce backend load
- **Compression** — gzip/brotli responses before sending to clients
- **Rate limiting** — rejects excessive requests per client IP

> **Note:** In production, Layer 7 is used more often than Layer 4 because it enables content-based routing, SSL termination, and caching. Layer 4 is preferred when raw throughput matters and no HTTP inspection is needed.

### Examples

**Load balancer implementation:**

```typescript
type Algorithm = 'round-robin' | 'least-connections' | 'ip-hash' | 'weighted';

interface Server {
  id: string;
  url: string;
  weight: number;
  activeConnections: number;
  healthy: boolean;
}

class LoadBalancer {
  private servers = new Map<string, Server>();
  private currentIndex = 0;
  private algorithm: Algorithm;

  constructor(algorithm: Algorithm = 'round-robin') {
    this.algorithm = algorithm;
    this.startHealthChecks();
  }

  addServer(id: string, url: string, weight = 1): void {
    this.servers.set(id, {
      id, url, weight, activeConnections: 0, healthy: true,
    });
  }

  private selectServer(clientIp: string): Server | null {
    const healthy = [...this.servers.values()].filter(s => s.healthy);
    if (healthy.length === 0) return null;

    switch (this.algorithm) {
      case 'round-robin': return this.roundRobin(healthy);
      case 'least-connections': return this.leastConnections(healthy);
      case 'ip-hash': return this.ipHash(clientIp, healthy);
      case 'weighted': return this.weightedRR(healthy);
      default: return healthy[0];
    }
  }
```

**Algorithm implementations:**

```typescript
  // continued from LoadBalancer class

  private roundRobin(servers: Server[]): Server {
    const s = servers[this.currentIndex % servers.length];
    this.currentIndex++;
    return s;
  }

  private leastConnections(servers: Server[]): Server {
    return servers.reduce((prev, curr) =>
      curr.activeConnections < prev.activeConnections ? curr : prev
    );
  }

  private ipHash(ip: string, servers: Server[]): Server {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash = ((hash << 5) - hash) + ip.charCodeAt(i);
      hash = hash & hash;
    }
    return servers[Math.abs(hash) % servers.length];
  }

  private weightedRR(servers: Server[]): Server {
    const total = servers.reduce((sum, s) => sum + s.weight, 0);
    let rand = Math.floor(Math.random() * total);
    for (const s of servers) {
      rand -= s.weight;
      if (rand < 0) return s;
    }
    return servers[0];
  }
```

**Request routing with health checks:**

```typescript
  // continued from LoadBalancer class

  async handleRequest(clientIp: string, request: any): Promise<any> {
    const server = this.selectServer(clientIp);
    if (!server) throw new Error('No healthy servers available');

    server.activeConnections++;
    try {
      const res = await fetch(server.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': clientIp,
        },
        body: JSON.stringify(request),
      });
      return await res.json();
    } finally {
      server.activeConnections--;
    }
  }

  private startHealthChecks(): void {
    setInterval(async () => {
      for (const server of this.servers.values()) {
        try {
          const res = await fetch(`${server.url}/health`, {
            signal: AbortSignal.timeout(5000),
          });
          server.healthy = res.ok;
        } catch {
          server.healthy = false;
        }
      }
    }, 30000); // Every 30 seconds
  }
}
```

**Reverse proxy with caching and rate limiting:**

```typescript
class ReverseProxy {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private rateLimits = new Map<string, number[]>();
  private loadBalancer: LoadBalancer;

  constructor() {
    this.loadBalancer = new LoadBalancer('least-connections');
  }

  async handleRequest(
    method: string, path: string, clientIp: string, body?: any
  ): Promise<any> {
    // Cache check for GET requests
    if (method === 'GET') {
      const cached = this.checkCache(path);
      if (cached) return cached;
    }

    // Rate limiting
    if (!this.checkRateLimit(clientIp)) {
      throw new Error('Rate limit exceeded');
    }

    // Forward to backend
    const response = await this.loadBalancer.handleRequest(clientIp, {
      method, path, body,
    });

    // Cache successful GETs
    if (method === 'GET' && response) {
      this.setCache(path, response, 300000); // 5 min TTL
    }
    return response;
  }
```

**Rate limiting logic:**

```typescript
  // continued from ReverseProxy class

  private checkRateLimit(clientIp: string): boolean {
    const now = Date.now();
    const window = 60000; // 1 minute
    const maxRequests = 100;

    let requests = this.rateLimits.get(clientIp) || [];
    requests = requests.filter(t => now - t < window);

    if (requests.length >= maxRequests) return false;
    requests.push(now);
    this.rateLimits.set(clientIp, requests);
    return true;
  }

  private checkCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
    if (this.cache.size > 10000) {
      this.cache.delete(this.cache.keys().next().value); // LRU eviction
    }
  }
}
```

**Frontend retry logic with exponential backoff:**

```typescript
class APIClient {
  private baseURL: string;
  private maxRetries = 3;

  constructor(baseURL: string) {
    this.baseURL = baseURL; // Load balancer URL
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const res = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: { 'Content-Type': 'application/json', ...options.headers },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (error) {
        lastError = error as Error;
        const delay = Math.pow(2, attempt) * 100; // 100ms, 200ms, 400ms
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw new Error(`Failed after ${this.maxRetries} retries: ${lastError!.message}`);
  }
}
```

**Production Nginx configuration:**

```nginx
upstream backend {
    least_conn;
    server api1.example.com:3000 weight=5 max_fails=3 fail_timeout=30s;
    server api2.example.com:3000 weight=3 max_fails=3 fail_timeout=30s;
    server api3.example.com:3000 weight=2 max_fails=3 fail_timeout=30s;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate     /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    proxy_cache my_cache;
    proxy_cache_valid 200 5m;

    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }
}
```

**Architecture diagram:**

```
Users / CDN
     │ HTTPS (443)
     ▼
┌──────────────────────────┐
│  Reverse Proxy / LB      │  SSL Termination
│  (Nginx / HAProxy)       │  Caching, Rate Limiting
│  Health checks, Compression│
└────────────┬─────────────┘
             │ HTTP (internal)
    ┌────────┼────────┬────────┐
    ▼        ▼        ▼        ▼
 Server 1  Server 2  Server 3  Server 4
 (Node.js) (Node.js) (Node.js) (Node.js)
    └────────┴────────┴────────┘
             │
             ▼
      Database (replicated)
```

### Comparison

| Algorithm | Pros | Cons |
|-----------|------|------|
| Round Robin | Simple, fair distribution | Ignores actual server load |
| Least Connections | Balances real load | More complex tracking |
| IP Hash | Sticky sessions | Uneven distribution |
| Weighted | Honors server capacity | Requires configuration tuning |

| Aspect | Layer 4 (Transport) | Layer 7 (Application) |
|--------|---------------------|-----------------------|
| Level | TCP/UDP | HTTP/HTTPS |
| Speed | Faster — no content inspection | Slower — parses headers/body |
| Routing | IP and port based | URL, headers, cookies, content |
| Features | Basic forwarding | SSL termination, caching, routing |
| Use case | Raw throughput | Smart routing, HTTP features |

### Interview guidance

**How to explain it:**

> "A load balancer distributes incoming traffic across multiple servers to prevent overload. It performs health checks to route only to healthy servers. A reverse proxy adds caching, SSL termination, rate limiting, and compression. Algorithms include round-robin, least connections, IP hash, and weighted round-robin."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| How do you handle server failures? | Health checks every 30s, automatic removal from rotation, circuit breakers, frontend retry with exponential backoff, auto re-add on recovery |
| Layer 4 vs Layer 7? | L4 works at TCP level — fast, no inspection. L7 works at HTTP level — enables content-based routing, SSL termination, caching. Use L4 for throughput, L7 for HTTP features |
| Session affinity trade-offs? | IP hash or cookie-based sticky sessions keep user on same server. Downside: uneven distribution, harder scaling. Prefer stateless design with external session store (Redis) |

**Difficulty:** Beginner

---

## Q3: Caching Strategies

Caching stores frequently accessed data in fast storage to reduce latency and database load. A multi-layer caching strategy uses browser cache, CDN, application cache (Redis/Memcached), and database query cache. Cache invalidation is the hardest problem — use TTL, write-through, or event-based invalidation.

### Syntax

| Cache layer | Latency | What to cache | TTL guidance |
|-------------|---------|---------------|--------------|
| Browser (memory/disk) | ~0-5 ms | Static assets, preferences | Static: 1 year (versioned URLs). Dynamic: 1-5 min |
| CDN edge | ~50 ms | JS, CSS, images, fonts | `Cache-Control: public, max-age=31536000` |
| Application (Redis) | ~1-2 ms | Hot data, sessions | Hot data: 1-5 min. Sessions: 30 min |
| Database query cache | ~5-10 ms | Frequent queries | Built-in, varies by engine |
| Database (primary) | ~20-50 ms | Source of truth | N/A |

| Invalidation strategy | Mechanism | Best for |
|-----------------------|-----------|----------|
| TTL (Time To Live) | Auto-expire after duration | News feeds, public content |
| Write-through | Update cache on every write | User profiles, settings |
| Event-based | Invalidate on specific events | Related data updates |
| Cache tags | Group and bulk-invalidate | Category pages, lists |

### Description

Caching follows a hierarchy — requests hit the fastest layer first and fall through to slower layers on cache misses. The cache-aside (lazy loading) pattern fetches from cache first, loads from database on miss, then populates cache.

> **Warning:** Cache stampede (thundering herd) occurs when many requests hit the same expired key simultaneously. All requests bypass cache and hit the database. Prevent this by coalescing concurrent requests — only one request loads the data while others wait for the result.

> **Note:** Cache sizing follows the 80/20 rule: 20% of items account for 80% of accesses. Cache the working set, not the entire dataset.

### Examples

**Browser cache manager:**

```typescript
class BrowserCacheManager {
  static registerServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }

  async getCachedResponse(url: string): Promise<Response | null> {
    const cache = await caches.open('api-cache-v1');
    const cached = await cache.match(url);
    if (!cached) return null;

    const age = Date.now() - new Date(cached.headers.get('date') || '').getTime();
    if (age < 5 * 60 * 1000) return cached; // 5 min max age
    return null;
  }

  setPreference(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify({
      value, timestamp: Date.now(),
    }));
  }

  getPreference<T>(key: string, maxAge = 86400000): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const { value, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    return value;
  }
}
```

**Application-level cache with TTL and tags:**

```typescript
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  tags: string[];
}

class ApplicationCache {
  private cache = new Map<string, CacheEntry<any>>();
  private stats = { hits: 0, misses: 0, sets: 0, evictions: 0 };

  set<T>(key: string, value: T, ttlMs: number, tags: string[] = []): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs, tags });
    this.stats.sets++;
    if (this.cache.size > 10000) {
      this.cache.delete(this.cache.keys().next().value); // LRU
      this.stats.evictions++;
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) { this.stats.misses++; return null; }
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    this.stats.hits++;
    return entry.value;
  }
```

**Cache-aside pattern and tag invalidation:**

```typescript
  // continued from ApplicationCache class

  async getOrLoad<T>(
    key: string, loader: () => Promise<T>, ttlMs: number, tags: string[] = []
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;
    const value = await loader();
    this.set(key, value, ttlMs, tags);
    return value;
  }

  invalidateByTag(tag: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) this.cache.delete(key);
    }
  }

  delete(key: string): void { this.cache.delete(key); }

  getStats() {
    const rate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0;
    return { ...this.stats, size: this.cache.size, hitRate: (rate * 100).toFixed(2) + '%' };
  }
}
```

**Write-through cache:**

```typescript
class WriteThroughCache {
  constructor(private cache: ApplicationCache, private database: any) {}

  async set(key: string, value: any): Promise<void> {
    await this.database.save(key, value);          // Write to DB first
    this.cache.set(key, value, 3600000, ['user']); // Then update cache
  }

  async get(key: string): Promise<any> {
    return this.cache.getOrLoad(
      key,
      () => this.database.load(key),  // Fallback to DB on miss
      3600000,
      ['user']
    );
  }
}
```

**Stampede prevention (request coalescing):**

```typescript
class StampedeProtection {
  private loading = new Map<string, Promise<any>>();

  constructor(private cache: ApplicationCache) {}

  async get<T>(key: string, loader: () => Promise<T>, ttlMs: number): Promise<T> {
    const cached = this.cache.get<T>(key);
    if (cached !== null) return cached;

    // Coalesce: reuse in-flight request
    const inflight = this.loading.get(key);
    if (inflight) return inflight;

    const promise = loader().then(value => {
      this.cache.set(key, value, ttlMs);
      this.loading.delete(key);
      return value;
    }).catch(err => {
      this.loading.delete(key);
      throw err;
    });

    this.loading.set(key, promise);
    return promise;
  }
}
```

**React component with multi-layer caching:**

```typescript
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      // Layer 1: browser sessionStorage
      const cached = sessionStorage.getItem(`user:${userId}`);
      if (cached) {
        const { value, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 60000) return value;
      }
      // Layer 2: fetch from server (which has Redis cache)
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      sessionStorage.setItem(`user:${userId}`, JSON.stringify({
        value: data, timestamp: Date.now(),
      }));
      return data;
    },
    staleTime: 60000,   // Fresh for 1 min
    gcTime: 300000,      // Keep in memory 5 min
  });

  if (isLoading) return <div>Loading...</div>;
  return <div><h1>{data.name}</h1></div>;
}
```

**Service Worker for offline-first caching:**

```javascript
const CACHE_NAME = 'app-v1';
const urlsToCache = ['/', '/static/js/main.js', '/static/css/main.css'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response; // Cache hit
      return fetch(event.request.clone()).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const toCache = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return res;
      });
    })
  );
});
```

**Cache sizing estimation:**

```
E-commerce product catalog:

Active products:    100,000
Average size:       2 KB (JSON)
Working set (80/20): 20,000 products
Cache needed:       20,000 * 2 KB = 40 MB

User sessions:      10,000 * 5 KB = 50 MB
Popular searches:   1,000 * 10 KB = 10 MB
Total Redis memory: 100 MB (with 2x headroom = 200 MB)

Eviction policy:    allkeys-lru (Least Recently Used)
```

**Architecture diagram:**

```
┌──────────────── Browser ─────────────────┐
│ Memory Cache │ Disk Cache │ LocalStorage  │
│   0 ms       │  ~5 ms     │   ~1 ms      │
└──────────────────┬───────────────────────┘
                   │ cache miss
┌──────────────── CDN Edge ────────────────┐
│ Static assets: JS, CSS, Images, Fonts    │
│ Cache-Control: public, max-age=31536000  │
│ ~50 ms latency (nearest edge)            │
└──────────────────┬───────────────────────┘
                   │ cache miss / dynamic
┌──────────── Application Servers ─────────┐
│ Redis: hot data (1-5 min), sessions      │
│ ~1-2 ms latency                          │
└──────────────────┬───────────────────────┘
                   │ cache miss
┌──────────── Database Layer ──────────────┐
│ Query cache (~5-10 ms)                   │
│ Read replicas (~10-20 ms)                │
│ Primary DB (~20-50 ms)                   │
└──────────────────────────────────────────┘
```

### Comparison

| Strategy | Consistency | Complexity | Best for |
|----------|-------------|------------|----------|
| TTL | May serve stale data | Low | Public content, news feeds |
| Write-through | Always consistent | Medium | User profiles, settings |
| Event-based | Flexible, near-real-time | High | Related data updates |
| Cache tags | Bulk invalidation | Medium | Category pages, lists |

### Interview guidance

**How to explain it:**

> "Caching stores frequently accessed data in fast storage to reduce latency and database load. A multi-layer strategy includes browser cache, CDN, application cache (Redis), and database cache. The hardest problem is invalidation — TTL, write-through, and event-based are the main strategies."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| How do you decide cache TTL? | Based on data change frequency and staleness tolerance. User profiles: 5 min. Prices: 1 min. Static content: 1 year (versioned URLs). News feed: 30s. Popular items cached longer (adaptive TTL) |
| Cache consistency across multiple servers? | Redis pub/sub for invalidation messages — when server A updates, all servers clear local caches. Or use Redis as single source of truth with no local cache. Trade-off: consistency vs latency |
| What is cache stampede and how to prevent it? | Many requests hit same expired key, all bypass cache and hit DB. Prevention: request coalescing (only one loads, others wait), probabilistic early recomputation, locking |

**Difficulty:** Intermediate

---

## Q4: Database Design

Database design covers choosing between SQL and NoSQL, designing schemas, sharding data across servers, replicating for reads, and indexing for performance.

### Syntax

| Concept | Description |
|---------|-------------|
| SQL (relational) | Fixed schema, ACID transactions, JOINs, foreign keys |
| NoSQL (document) | Flexible schema, horizontal scaling, eventual consistency |
| Sharding | Split data across servers by shard key (e.g., `user_id % N`) |
| Replication | Master-slave (reads), multi-master (writes) |
| B-tree index | Range queries, ORDER BY |
| Hash index | Equality lookups |
| Full-text index | Text search |
| Covering index | Query satisfied entirely from index |

### Description

Choose SQL for structured data with complex relationships and ACID transactions (banking, e-commerce orders). Choose NoSQL for flexible schemas, horizontal scalability, and when eventual consistency is acceptable (social media, logs, analytics).

| Criteria | SQL (PostgreSQL) | NoSQL (MongoDB) |
|----------|------------------|-----------------|
| Schema | Fixed, predefined | Flexible, dynamic |
| Transactions | ACID, multi-row | Limited (single document) |
| Relationships | JOINs, foreign keys | Embedded documents or references |
| Scaling | Vertical (harder to shard) | Horizontal (built-in sharding) |
| Query language | SQL (powerful, standardized) | JSON-like queries |
| Consistency | Strong | Eventual |
| Best for | Banking, e-commerce | Social media, logs, IoT |

> **Note:** Denormalize for read-heavy workloads where JOIN cost is high. For example, store the user name in a posts table to avoid a JOIN on every feed query. Trade-off: faster reads, slower writes, data duplication.

### Examples

**SQL schema — e-commerce with ACID transactions:**

```typescript
// Schema interfaces
interface User { id: number; email: string; name: string; created_at: Date; }
interface Product { id: number; name: string; price: number; stock: number; }
interface Order {
  id: number; user_id: number; total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}
interface OrderItem {
  id: number; order_id: number; product_id: number;
  quantity: number; price: number;
}
```

**ACID transaction — creating an order:**

```typescript
class SQLDatabaseLayer {
  private db: any; // PostgreSQL connection

  async createOrder(
    userId: number, items: { productId: number; quantity: number }[]
  ): Promise<any> {
    await this.db.query('BEGIN');
    try {
      let total = 0;
      for (const item of items) {
        const product = await this.db.query(
          'SELECT price, stock FROM products WHERE id = $1 FOR UPDATE',
          [item.productId]
        );
        if (product.stock < item.quantity) throw new Error('Insufficient stock');
        total += product.price * item.quantity;
      }

      const order = await this.db.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
        [userId, total, 'pending']
      );

      for (const item of items) {
        await this.db.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, (SELECT price FROM products WHERE id = $2))`,
          [order.id, item.productId, item.quantity]
        );
        await this.db.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.productId]
        );
      }
      await this.db.query('COMMIT');
      return order;
    } catch (error) {
      await this.db.query('ROLLBACK');
      throw error;
    }
  }
```

**Complex JOIN query with indexes:**

```typescript
  // continued from SQLDatabaseLayer

  async getUserOrders(userId: number): Promise<any[]> {
    // Requires: CREATE INDEX idx_orders_user_id ON orders(user_id);
    //           CREATE INDEX idx_order_items_order_id ON order_items(order_id);
    return this.db.query(`
      SELECT o.id, o.total_amount, o.status, o.created_at,
        json_agg(json_build_object(
          'product_name', p.name, 'quantity', oi.quantity, 'price', oi.price
        )) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 20
    `, [userId]);
  }
}
```

**NoSQL document design — social media posts:**

```typescript
class NoSQLDatabaseLayer {
  private db: any; // MongoDB connection

  async createPost(userId: string, content: string, tags: string[]) {
    const post = {
      id: this.generateId(), userId, content,
      likes: 0, comments: [], tags, createdAt: Date.now(),
    };
    await this.db.collection('posts').insertOne(post);
    // Eventual consistency: update user's post count async
    this.db.collection('users').updateOne(
      { id: userId }, { $inc: { postCount: 1 } }
    );
    return post;
  }

  async addComment(postId: string, userId: string, content: string) {
    // Atomic push into embedded array
    await this.db.collection('posts').updateOne(
      { id: postId },
      {
        $push: { comments: { id: this.generateId(), userId, content, createdAt: Date.now() } },
        $inc: { commentCount: 1 },
      }
    );
  }

  async getPostsByTag(tag: string, limit = 20) {
    // Requires: db.posts.createIndex({ tags: 1, createdAt: -1 })
    return this.db.collection('posts')
      .find({ tags: tag }).sort({ createdAt: -1 }).limit(limit).toArray();
  }

  private generateId() { return Math.random().toString(36).substring(2, 15); }
}
```

**Sharding strategy:**

```typescript
class ShardedDatabase {
  private shards = new Map<number, any>();

  constructor(private numShards: number) {
    for (let i = 0; i < numShards; i++) {
      this.shards.set(i, { id: i, host: `shard-${i}.db.example.com` });
    }
  }

  private getShardId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % this.numShards;
  }

  async getUser(userId: string) {
    const shard = this.shards.get(this.getShardId(userId));
    return shard.query('SELECT * FROM users WHERE id = ?', [userId]);
  }

  async getAllUsers() {
    // Scatter-gather across all shards
    const results = await Promise.all(
      [...this.shards.values()].map(s => s.query('SELECT * FROM users'))
    );
    return results.flat();
  }
}
```

**Master-slave replication:**

```typescript
class ReplicatedDatabase {
  private master: any;
  private slaves: any[];
  private currentSlaveIndex = 0;

  constructor(masterHost: string, slaveHosts: string[]) {
    this.master = { host: masterHost };
    this.slaves = slaveHosts.map(host => ({ host }));
  }

  async write(query: string, params: any[]) {
    return this.master.query(query, params); // Writes always to master
  }

  async read(query: string, params: any[]) {
    const slave = this.slaves[this.currentSlaveIndex];
    this.currentSlaveIndex = (this.currentSlaveIndex + 1) % this.slaves.length;
    return slave.query(query, params); // Round-robin reads from slaves
  }

  async readConsistent(query: string, params: any[]) {
    return this.master.query(query, params); // Strong consistency reads
  }
}
```

**Indexing strategies:**

```sql
-- B-Tree: range queries, ORDER BY
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Composite: multiple filter columns
CREATE INDEX idx_orders_user_status ON orders(user_id, status, created_at);

-- Hash: equality lookups
CREATE INDEX idx_users_email USING HASH ON users(email);

-- Full-text search
CREATE INDEX idx_products_search ON products
  USING GIN(to_tsvector('english', name || ' ' || description));

-- Covering index: query answered entirely from index
CREATE INDEX idx_orders_covering ON orders(user_id)
  INCLUDE (total_amount, status, created_at);
```

**React pagination with optimistic updates:**

```typescript
function ProductList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['products', page],
    queryFn: async () => {
      const res = await fetch(`/api/products?page=${page}&size=20`);
      return res.json();
    },
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      {data?.products.map((p: any) => <ProductCard key={p.id} product={p} />)}
      <Pagination current={page} total={data?.total} onChange={setPage} />
    </div>
  );
}
```

**React optimistic like button:**

```typescript
function LikeButton({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => fetch(`/api/posts/${postId}/like`, { method: 'POST' }),
    onMutate: async () => {
      await queryClient.cancelQueries(['post', postId]);
      const prev = queryClient.getQueryData(['post', postId]);
      queryClient.setQueryData(['post', postId], (old: any) => ({
        ...old, likes: old.likes + 1, isLiked: true,
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['post', postId], ctx?.prev);
    },
    onSettled: () => queryClient.invalidateQueries(['post', postId]),
  });

  return <button onClick={() => mutation.mutate()}>Like</button>;
}
```

**Architecture diagrams:**

```
Master-Slave Replication:

              ┌──────────────┐
              │   Master DB  │  (Write)
              └──────┬───────┘
                     │ Async replication (10-100 ms lag)
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Slave 1 │ │ Slave 2 │ │ Slave 3 │  (Read)
   └─────────┘ └─────────┘ └─────────┘
   If master fails: promote a slave to master

Database Sharding:

   Application Layer
        │
   ┌────┼────┬────┬────┐
   ▼    ▼    ▼    ▼    ▼
Shard 0  Shard 1  Shard 2  Shard 3
Users    Users    Users    Users
0-25M    25-50M   50-75M   75-100M

Shard key: user_id % 4
```

**Capacity estimation — Instagram-like app:**

```
500M users

Writes per day:
- Posts: 500M * 0.5 = 250M
- Comments: 250M * 5 = 1.25B
- Likes: 250M * 20 = 5B
- Total: 6.5B/day = 75K WPS (peak 3x = 225K)

Storage (5 years):
- Posts: 250M/day * 365 * 5 * 1KB = 456 TB
- Images: 250M/day * 365 * 5 * 2MB = 912 PB (object storage)
- Comments: 1.25B/day * 365 * 5 * 200B = 456 TB
- Total DB: ~1 PB (excluding images)

Sharding: 1000 shards * 1TB each
Shard by user_id for data locality
Cross-shard queries via Elasticsearch
```

### Comparison

| Aspect | SQL (PostgreSQL) | NoSQL (MongoDB) |
|--------|------------------|-----------------|
| Schema | Fixed, predefined | Flexible, dynamic |
| Transactions | Full ACID, multi-row | Single-document atomic ops |
| Relationships | JOINs, foreign keys | Embedded documents or references |
| Scaling | Vertical first, sharding harder | Horizontal, built-in sharding |
| Consistency | Strong | Eventual (tunable) |
| Best for | Banking, e-commerce, complex queries | Social media, logs, IoT, rapid iteration |

### Interview guidance

**How to explain it:**

> "Choose SQL for structured data with complex relationships and ACID transactions. Choose NoSQL for flexible schemas and horizontal scalability when eventual consistency is acceptable. Sharding splits data across servers by key. Replication creates copies for read scaling and failover."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| When to denormalize in SQL? | Read-heavy workloads where JOIN cost is high. Store user name in posts table to avoid JOIN on every feed query. Trade-off: faster reads, slower writes, data duplication. Use materialized views or cache instead if consistency is critical |
| Zero-downtime database migration? | (1) Add new column as nullable. (2) Deploy code writing to both old and new. (3) Backfill data. (4) Deploy code reading from new. (5) Remove old column. Use feature flags. Keep both schemas compatible during transition |
| Sharding challenges? | Cross-shard queries are expensive (scatter-gather). Rebalancing when adding shards. Hot spots if shard key distribution is uneven. Solution: consistent hashing, virtual shards |

**Difficulty:** Intermediate

---

## Q5: API Design

API design covers REST, GraphQL, and gRPC paradigms, along with versioning strategies, rate limiting, pagination, and response formatting standards.

### Syntax

| Paradigm | Protocol | Data format | Key feature |
|----------|----------|-------------|-------------|
| REST | HTTP/JSON | JSON | Resource-based URLs, HTTP verbs |
| GraphQL | HTTP/JSON | JSON | Client-specified queries, single endpoint |
| gRPC | HTTP/2 | Protocol Buffers | High-performance RPC, streaming |

| HTTP verb | Action | Response code |
|-----------|--------|---------------|
| GET | Read resource(s) | 200 OK |
| POST | Create resource | 201 Created |
| PUT | Full update | 200 OK |
| PATCH | Partial update | 200 OK |
| DELETE | Delete resource | 204 No Content |

| Versioning strategy | Example | Pros / Cons |
|---------------------|---------|-------------|
| URL path | `/api/v1/users` | Clear, easy to route. Duplicates code |
| Header | `API-Version: 2` | Clean URLs. Hidden from clients |
| Content negotiation | `Accept: application/vnd.api.v2+json` | Standards-based. Complex |

### Description

RESTful APIs use HTTP verbs with resource-based URLs. Always include pagination, filtering, and sorting for list endpoints. Use proper status codes and consistent response envelopes.

GraphQL lets clients request exactly the data needed, solving over-fetching common in REST. A single endpoint serves all queries.

gRPC uses Protocol Buffers for high-performance inter-service RPC with streaming support.

> **Note:** Use REST for public APIs with wide compatibility. Use GraphQL for mobile apps and frontend-driven development. Use gRPC for microservice-to-microservice communication where performance is critical.

### Examples

**RESTful API routes:**

```typescript
class RESTfulAPI {
  private app: any; // Express app

  setupRoutes(): void {
    // GET /api/users — list with pagination, filtering, sorting
    this.app.get('/api/users', async (req: any, res: any) => {
      const { page = 1, limit = 20, sort = 'created_at', order = 'desc', search, role } = req.query;
      if (limit > 100) return res.status(400).json({ error: 'Limit max 100' });

      const users = await this.userService.getUsers({
        page: +page, limit: +limit, sort, order, filters: { search, role },
      });

      res.json({
        data: users.items,
        meta: { page: users.page, limit: users.limit, total: users.total,
                totalPages: Math.ceil(users.total / users.limit) },
        links: {
          self: `/api/users?page=${page}&limit=${limit}`,
          next: +page < users.totalPages ? `/api/users?page=${+page + 1}&limit=${limit}` : null,
          prev: +page > 1 ? `/api/users?page=${+page - 1}&limit=${limit}` : null,
        },
      });
    });
  }
```

**REST CRUD operations:**

```typescript
    // continued from setupRoutes

    // GET /api/users/:id
    this.app.get('/api/users/:id', async (req: any, res: any) => {
      const user = await this.userService.getUser(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ data: user });
    });

    // POST /api/users — 201 with Location header
    this.app.post('/api/users', async (req: any, res: any) => {
      const errors = this.validateUser(req.body);
      if (errors.length) return res.status(400).json({ errors });
      const user = await this.userService.createUser(req.body);
      res.status(201).header('Location', `/api/users/${user.id}`).json({ data: user });
    });

    // PUT /api/users/:id — full update
    this.app.put('/api/users/:id', async (req: any, res: any) => {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.json({ data: user });
    });

    // DELETE /api/users/:id — 204 No Content
    this.app.delete('/api/users/:id', async (req: any, res: any) => {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    });
  }
}
```

**GraphQL schema and query:**

```typescript
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user) => postService.getUserPosts(user.id),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve: (_parent, args) => userService.getUser(args.id),
    },
    users: {
      type: new GraphQLList(UserType),
      args: {
        limit: { type: GraphQLInt, defaultValue: 20 },
        offset: { type: GraphQLInt, defaultValue: 0 },
      },
      resolve: (_parent, args) => userService.getUsers(args.limit, args.offset),
    },
  },
});
```

**GraphQL client query:**

```graphql
query GetUserWithPosts($userId: String!) {
  user(id: $userId) {
    id
    name
    email
    posts {
      id
      title
      content
      comments {
        id
        content
      }
    }
  }
}
```

**gRPC Protocol Buffers definition:**

```protobuf
syntax = "proto3";
package user;

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (UserList);
  rpc CreateUser (CreateUserRequest) returns (User);
  rpc StreamUsers (StreamUsersRequest) returns (stream User);
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int64 created_at = 4;
}

message GetUserRequest { string id = 1; }
message ListUsersRequest { int32 page = 1; int32 limit = 2; }
message UserList { repeated User users = 1; int32 total = 2; }
```

**gRPC server implementation:**

```typescript
class GRPCUserService {
  async GetUser(call: any, callback: any) {
    const user = await this.userService.getUser(call.request.id);
    callback(null, user);
  }

  async ListUsers(call: any, callback: any) {
    const users = await this.userService.getUsers(call.request.page, call.request.limit);
    callback(null, { users: users.items, total: users.total });
  }

  // Server streaming — sends multiple responses
  async StreamUsers(call: any) {
    const users = await this.userService.getAllUsers();
    for (const user of users) {
      call.write(user);
      await new Promise(r => setTimeout(r, 100));
    }
    call.end();
  }
}
```

**API versioning strategies:**

```typescript
class VersionedAPI {
  setupRoutes(): void {
    // Strategy 1: URL versioning (most common)
    this.app.use('/api/v1', this.v1Routes());
    this.app.use('/api/v2', this.v2Routes());

    // Strategy 2: Header versioning
    this.app.get('/api/users', (req: any, res: any) => {
      const version = req.header('API-Version') || '1';
      if (version === '2') return this.getUsersV2(req, res);
      return this.getUsersV1(req, res);
    });
  }

  private v1Routes() {
    const router = express.Router();
    router.get('/users', (_req: any, res: any) => {
      res.json([{ id: 1, name: 'John' }]); // V1: simple array
    });
    return router;
  }

  private v2Routes() {
    const router = express.Router();
    router.get('/users', (_req: any, res: any) => {
      res.json({ // V2: envelope with metadata
        data: [{ id: 1, name: 'John', email: 'john@example.com' }],
        meta: { version: 2, total: 1 },
      });
    });
    return router;
  }
}
```

**Token bucket rate limiter:**

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>();

  async check(clientId: string, max: number, windowMs: number) {
    const now = Date.now();
    let reqs = this.requests.get(clientId) || [];
    reqs = reqs.filter(t => t > now - windowMs);

    if (reqs.length >= max) {
      return { allowed: false, remaining: 0, resetAt: reqs[0] + windowMs };
    }
    reqs.push(now);
    this.requests.set(clientId, reqs);
    return { allowed: true, remaining: max - reqs.length, resetAt: now + windowMs };
  }

  middleware(max = 100, windowMs = 60000) {
    return async (req: any, res: any, next: any) => {
      const result = await this.check(req.ip, max, windowMs);
      res.header('X-RateLimit-Limit', String(max));
      res.header('X-RateLimit-Remaining', String(result.remaining));
      if (!result.allowed) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
        });
      }
      next();
    };
  }
}
```

**Standard API response format:**

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  meta?: { timestamp: number; requestId: string; version: string };
}

class APIResponseFormatter {
  success<T>(data: T, extra?: any): APIResponse<T> {
    return {
      success: true, data,
      meta: { timestamp: Date.now(), requestId: crypto.randomUUID(), version: '2.0', ...extra },
    };
  }

  error(code: string, message: string, details?: any): APIResponse<never> {
    return {
      success: false,
      error: { code, message, details },
      meta: { timestamp: Date.now(), requestId: crypto.randomUUID(), version: '2.0' },
    };
  }
}
```

**React with REST (React Query):**

```typescript
function UserList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      const res = await fetch(`/api/v2/users?page=${page}&limit=20`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    keepPreviousData: true,
    staleTime: 30000,
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      {data.data.map((u: any) => <UserCard key={u.id} user={u} />)}
      <Pagination current={page} total={data.meta.totalPages} onChange={setPage} />
    </div>
  );
}
```

**React with GraphQL (Apollo):**

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(id: $userId) { id, name, email, posts { id, title } }
  }
`;

function UserProfile({ userId }: { userId: string }) {
  const { data, loading } = useQuery(GET_USER, { variables: { userId } });
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1>{data.user.name}</h1>
      {data.user.posts.map((p: any) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
```

**API client with rate-limit retry:**

```typescript
class APIClientWithRetry {
  constructor(private baseURL: string) {}

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(`${this.baseURL}${endpoint}`, options);
        if (res.status === 429) {
          const retryAfter = parseInt(res.headers.get('Retry-After') || '60');
          await new Promise(r => setTimeout(r, retryAfter * 1000));
          continue;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (error) {
        if (attempt === 2) throw error;
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
    throw new Error('Request failed after 3 attempts');
  }
}
```

### Comparison

| Feature | REST | GraphQL | gRPC |
|---------|------|---------|------|
| Protocol | HTTP/JSON | HTTP/JSON | HTTP/2 + Protobuf |
| Client control | Fixed endpoints | Flexible queries | Fixed contracts |
| Over-fetching | Common | Solved | Optimized |
| Caching | HTTP cache works natively | Complex (custom) | Custom needed |
| Performance | Good | Good | Excellent |
| Learning curve | Easy | Medium | Hard |
| Web browser support | Native | Native | Requires gRPC-Web |
| Microservices | Good | Complex | Excellent |

| Use case | Recommended |
|----------|-------------|
| Public API, wide compatibility | REST |
| Mobile apps, reduce over-fetching | GraphQL |
| Frontend-driven development | GraphQL |
| Microservice-to-microservice | gRPC |
| Streaming data | gRPC |
| Type safety across services | gRPC |

### Interview guidance

**How to explain it:**

> "REST uses HTTP verbs with resource-based URLs and is best for public APIs. GraphQL lets clients request exactly the data they need, solving over-fetching. gRPC uses Protocol Buffers for high-performance inter-service communication. Always include pagination, rate limiting, and proper error handling."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| How to design APIs for mobile with poor connectivity? | GraphQL to minimize payload. Batch requests. Offline-first with service workers. Delta sync — only changed data. Compress with gzip/brotli. Resume capability for uploads |
| How to handle breaking API changes? | Version APIs (v1, v2). Support old versions 6-12 months with deprecation headers (`Sunset`, `Deprecation`). Add new fields as optional, never remove. Monitor usage before retiring. Stripe maintains 3 years of versions |
| REST vs GraphQL trade-offs? | REST: simpler, HTTP caching, well-tooled. GraphQL: flexible queries, reduces round trips, but complex caching and potential N+1 query problems. Use DataLoader to batch GraphQL resolvers |

**Difficulty:** Intermediate

**API design checklist:**

| Category | Requirements |
|----------|-------------|
| Endpoints | RESTful URLs (`/resources/:id`), proper HTTP verbs, nested resources |
| Request/Response | Consistent JSON envelope, metadata (pagination, timestamps), proper status codes |
| Pagination | Cursor-based for large datasets, offset-based for small, include total count |
| Filtering and sorting | Query params (`?sort=created_at&order=desc`), full-text search |
| Security | JWT/OAuth2 auth, RBAC, rate limiting (100 req/min), input validation |
| Performance | gzip compression, ETag/Cache-Control headers, batch endpoints, field selection |
| Documentation | OpenAPI/Swagger spec, example requests/responses, error codes, changelog |

---

## See also

- [JavaScript Interview Mastery Guide](./javascript-interview-mastery-guide.md) — JavaScript fundamentals, async patterns, and runtime behavior
- [TypeScript Interview Mastery Guide](./typescript-interview-mastery-guide.md) — Type system, generics, and advanced types
- [React Interview Mastery Guide](./react-interview-mastery-guide.md) — Component patterns, hooks, state management
- [Design Patterns Interview Mastery Guide](./design-patterns-interview-mastery-guide.md) — GoF patterns and modern JavaScript patterns
- [DSA Interview Mastery Guide](./dsa-interview-mastery-guide.md) — Data structures and algorithms
