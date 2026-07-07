# TLS: Transport Layer Security — Full Breakdown

---

## 1. THE GIST

This lecture covers TLS — the encryption layer that sits on top of TCP and makes HTTPS possible. The core problem is simple: TCP sends plaintext, and anyone between you and the server (ISPs, routers, that sketchy Starbucks router) can read it. TLS solves this by establishing a **shared symmetric key** that only the client and server ever know, so all traffic is encrypted in transit. The tricky part is *exchanging* that key securely over a public network — which is where RSA and Diffie-Hellman come in. TLS 1.2 uses RSA for key exchange (fast to set up, but vulnerable if the server's private key is ever leaked). TLS 1.3 drops RSA for Diffie-Hellman by default, achieving **perfect forward secrecy** and cutting the handshake to a single round trip. The lecture also touches on certificates, PKI, and why symmetric encryption is always the end goal — asymmetric is just the secure delivery mechanism for the key.

---

## 2. THE BREAKDOWN

### The Fundamental Problem

HTTP is plaintext. Every router, ISP, and man-in-the-middle sees everything. TLS wraps that communication in encryption. But encryption requires a shared key — and you can't just send the key in plaintext either. That's the core puzzle TLS solves.

---

### Symmetric vs. Asymmetric Encryption

This distinction is *everything* in TLS.

| Property | Symmetric | Asymmetric |
|---|---|---|
| Keys | Same key encrypts & decrypts | Public key encrypts, private key decrypts |
| Speed | Very fast (XOR-based, e.g., AES, ChaCha20) | Slow (exponential math, e.g., RSA, ECDH) |
| Problem | How do you share the key securely? | CPU-expensive for bulk data |
| Used for | Actual data encryption | Key exchange only |

**The rule:** TLS always ends up using symmetric encryption for data. Asymmetric is only used to *bootstrap* the symmetric key exchange.

---

### TLS 1.2 Handshake (RSA Key Exchange)

```
Client                          Server
  │                               │
  │──── TCP Handshake ───────────►│
  │                               │
  │──── ClientHello ─────────────►│  "I want TLS. Here's what I support."
  │◄─── ServerHello + Certificate─│  "Use RSA. Here's my public key."
  │                               │
  │  [Client generates pre-master secret]
  │  [Encrypts it with server's public key]
  │──── ClientKeyExchange ───────►│  "Here's the key, encrypted."
  │──── ChangeCipherSpec ─────────►│  "Switching to encrypted mode."
  │──── Finished ────────────────►│
  │                               │
  │◄─── ChangeCipherSpec ─────────│
  │◄─── Finished ─────────────────│
  │                               │
  │════ Encrypted Data ═══════════│  (symmetric key from here on)
```

**2 round trips** before data flows. The server's private key decrypts the pre-master secret, both sides derive the symmetric key independently — and now they share it without ever sending it in plaintext.

---

### The Fatal Flaw: No Perfect Forward Secrecy

Here's the RSA attack scenario:

1. A malicious ISP records *all* encrypted TLS traffic for a year
2. A year later, they exploit Heartbleed (or any server vulnerability) and steal the server's private key
3. They now loop through every recorded session, decrypt the pre-master secret from each `ClientKeyExchange`, derive the symmetric key, and decrypt a year's worth of traffic

**One leaked private key → all past sessions compromised.** This is the fundamental weakness of RSA as a key exchange mechanism.

---

### Diffie-Hellman Key Exchange (The Fix)

DH solves this with mathematical elegance. Both parties generate a shared secret *without ever sending it*, using public values that can't be reverse-engineered.

**The math (simplified):**

```
Public values (shared openly): G (generator, prime), N (large prime modulus)

Client generates private: X  (never shared)
Server generates private: Y  (never shared)

Client sends: G^X mod N  → anyone can see this, can't extract X
Server sends: G^Y mod N  → anyone can see this, can't extract Y

Client computes: (G^Y mod N)^X mod N = G^(XY) mod N  ✓ symmetric key
Server computes: (G^X mod N)^Y mod N = G^(XY) mod N  ✓ same symmetric key
```

Both arrived at `G^(XY) mod N` — the same number — without ever sending it. An eavesdropper who sees `G^X mod N` and `G^Y mod N` *cannot* compute `G^(XY) mod N` without X or Y.

**The critical property:** X and Y are generated fresh for *every session*. Even if a server is compromised tomorrow, past sessions used different X and Y values. Past traffic stays safe. This is **Perfect Forward Secrecy (PFS)**.

**ECDH (Elliptic Curve Diffie-Hellman)** is the modern variant — same concept, harder math, smaller key sizes, more efficient.

---

### TLS 1.3: What Changed

| Feature | TLS 1.2 | TLS 1.3 |
|---|---|---|
| Key Exchange | RSA or DH (negotiated) | DH/ECDH only (mandatory) |
| Round trips | 2 RTT | 1 RTT |
| Forward secrecy | Optional | Mandatory |
| Cipher negotiation | Client proposes, server picks | Removed — DH params sent immediately |
| 0-RTT | No | Yes (with pre-shared key) |
| Weak algorithms | Supported for compatibility | Removed entirely |

**TLS 1.3's key insight:** Skip the negotiation round trip. The client just sends its DH parameters immediately in the first message. The server replies with its DH params + certificate + encrypted Finished — all in one shot.

---

### Certificates and PKI (Brief)

The certificate solves *authentication* — how do you know you're talking to the *real* server and not an attacker?

```
Certificate contains:
- Server's public key
- Domain name
- Signed by: Certificate Authority (CA)

Chain of trust:
Server cert → Intermediate CA → Root CA (trusted by your OS/browser)
```

Your browser/OS ships with a list of trusted root CAs. If the chain validates, you trust the server's public key is genuine.

---

### 0-RTT (Zero Round-Trip)

If the client has connected before, it can store a **pre-shared key (PSK)** from the previous session. On reconnect, it encrypts data immediately in the first message — no handshake latency. Risk: **replay attacks** (a recorded request could be replayed). 0-RTT data should only be used for idempotent operations (e.g., GET requests, not POST payments).

---

## 3. ENGINEER'S NOTEBOOK

**Core idea:** TLS = TCP connection + key exchange handshake + symmetric encryption for all subsequent data. The handshake solves key distribution. Everything after that is fast symmetric crypto.

**Key moving parts:**
- Asymmetric crypto (RSA/ECDH) → used *once* during handshake to exchange keys
- Symmetric crypto (AES-GCM, ChaCha20) → used for *all data* after handshake
- Certificate → proves server identity via chain of trust (PKI)
- Session keys → ephemeral, derived fresh per connection (in TLS 1.3)

**Gotchas, edge cases, trip-ups:**
- **RSA key exchange ≠ forward secrecy** — if you still support RSA key exchange for backward compatibility, you're vulnerable to retroactive decryption
- **Certificate expiry** — short-lived certs (Cloudflare: 2 weeks, Let's Encrypt: 90 days) limit blast radius of a key leak. Automate renewal with ACME/certbot or you will get paged at 3am
- **TLS termination placement** — if you terminate TLS at a load balancer, traffic between the LB and backend is plaintext. In zero-trust environments, you need mTLS end-to-end
- **0-RTT replay risk** — never use 0-RTT for non-idempotent operations. A replayed POST with 0-RTT data could double-charge a payment, double-submit a form, etc.
- **Certificate pinning** — mobile apps sometimes pin specific certs. When you rotate certs, pinned clients break until they're updated
- **Heartbleed** — the canonical example of why private key hygiene matters. One memory bug exposed private keys from OpenSSL's implementation
- **Mixed content** — one HTTP asset on an HTTPS page breaks the security guarantee. Browsers warn or block
- **SNI in plaintext** — even with TLS 1.3, the server name (SNI) in ClientHello is visible to eavesdroppers. ESNI/ECH (Encrypted ClientHello) fixes this but isn't universally deployed

**Key terms:**
- **Symmetric encryption** — same key encrypts and decrypts (AES, ChaCha20). Fast.
- **Asymmetric encryption** — public key encrypts, private key decrypts (RSA, ECDH). Slow.
- **Pre-master secret** — the value from which both sides independently derive the actual session key
- **Perfect Forward Secrecy (PFS)** — past sessions stay safe even if the server's long-term private key is compromised later
- **Diffie-Hellman (DH/ECDH)** — the key exchange algorithm that enables PFS
- **Certificate Authority (CA)** — trusted third party that signs server certificates
- **SNI (Server Name Indication)** — TLS extension that tells the server which domain the client is connecting to (for multi-tenant servers)
- **mTLS** — mutual TLS, where *both* client and server authenticate via certificates
- **0-RTT / PSK** — resumption mechanism that skips the handshake for returning clients

**Don't forget this:**
> Symmetric encryption is always the destination. Asymmetric is just the armored car that delivers the key. Never use asymmetric for bulk data — it's 100–1000× slower than AES.

---

## 4. QUICK REFERENCE CARD

```
TLS AT A GLANCE
───────────────────────────────────────────────
Sits at:        Layer 5 (session) logically; wraps Layer 4 (TCP)
Goal:           Encrypt TCP data + authenticate server
Handshake:      TLS 1.2 = 2 RTT │ TLS 1.3 = 1 RTT │ 0-RTT = 0 RTT
Key exchange:   DH / ECDH (TLS 1.3 mandatory) or RSA (TLS 1.2)
Data encryption: AES-GCM or ChaCha20 (symmetric, fast)
Auth:           X.509 certificate → CA chain → root trust

TLS 1.2 vs 1.3
───────────────────────────────────────────────
1.2:  Negotiate first, then exchange keys   (2 RTT)
1.3:  Send DH params in first message       (1 RTT)
1.3:  PFS mandatory, weak ciphers removed
1.3:  0-RTT available (careful with replay)

THE KEY EXCHANGE LADDER
───────────────────────────────────────────────
RSA        → Fast setup, NO forward secrecy ❌
DH         → Forward secrecy ✓, bigger keys
ECDH       → Forward secrecy ✓, smaller+faster ✅ (recommended)

RULES OF THUMB
───────────────────────────────────────────────
• Symmetric  = AES/ChaCha → for DATA (fast)
• Asymmetric = RSA/ECDH   → for KEY EXCHANGE only (slow)
• Always prefer ECDH over RSA for key exchange
• Short cert lifetimes = smaller breach window
• Terminate TLS as close to the app as makes sense
• 0-RTT = idempotent operations only (GET, not POST)
• mTLS for service-to-service in zero-trust networks
```

---

## 5. THE "AHA" MOMENT

**The trickiest concept: How can two people agree on a secret without an eavesdropper learning it?**

Here's a paint-mixing analogy that actually works:

Imagine you and a friend want to agree on a secret paint color, but you're communicating in public — anyone can watch.

1. You both agree on a **public starting color**: say, yellow. (This is G and N — public, fine to share.)
2. You secretly pick your own **private color**: red. You mix yellow + red → orange. You send the orange to your friend. (This is `G^X mod N`.)
3. Your friend secretly picks their own **private color**: blue. They mix yellow + blue → green. They send the green to you. (This is `G^Y mod N`.)
4. You take the green you received and add your private red → brown.
5. Your friend takes the orange they received and adds their private blue → the **same brown**.

The eavesdropper saw yellow, orange, and green. But they **cannot figure out the final brown** without knowing either the red or the blue — the private colors that were never sent.

That final brown is your symmetric encryption key. The math of Diffie-Hellman makes this "mixing" operation one-way: you can combine, but you can't un-combine to extract the private inputs. Even if someone recorded every packet and stole the server's keys years later, they still can't get the brown — because the red and blue were generated fresh for that session and then discarded.

**That's perfect forward secrecy.** Each session's private values are ephemeral, and the past stays safe forever.

---

## 6. SHOW ME THE CODE

```javascript
import https from 'https';
import fs from 'fs';
import tls from 'tls';

// --- SERVER SIDE ---
// TLS termination: the server holds the private key + certificate.
// The TLS layer handles all handshake complexity before your app sees a byte.
const serverOptions = {
  key: fs.readFileSync('./server.key'),   // Private key — NEVER expose this
  cert: fs.readFileSync('./server.crt'),  // Public certificate — fine to share

  // Force TLS 1.3 only. TLS 1.2 is acceptable for backward compat,
  // but 1.3 gives you mandatory PFS + 1 RTT instead of 2.
  minVersion: 'TLSv1.3',

  // Only allow ciphers with forward secrecy (ECDHE prefix = ephemeral DH).
  // Reject RSA key exchange ciphers — they lack PFS.
  ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256',
};

const server = https.createServer(serverOptions, (req, res) => {
  // By the time this callback fires, the TLS handshake is DONE.
  // The connection is encrypted. req/res speak plaintext to your app;
  // the TLS layer transparently handles encrypt/decrypt below.

  // Inspect what was negotiated — useful for debugging or enforcing policies
  const tlsSocket = req.socket;
  console.log('TLS version:', tlsSocket.getProtocol());        // e.g., TLSv1.3
  console.log('Cipher:', tlsSocket.getCipher().name);           // e.g., TLS_AES_256_GCM_SHA384
  console.log('Forward secrecy:', tlsSocket.getEphemeralKeyInfo()); // Confirms DH was used

  res.writeHead(200);
  res.end('Hello over TLS!\n');
});

server.listen(8443, () => {
  console.log('HTTPS server on port 8443');
});


// --- CLIENT SIDE ---
// Connecting to a TLS server — verify the certificate chain.
const clientOptions = {
  hostname: 'example.com',
  port: 443,
  path: '/',
  method: 'GET',

  // In production: always validate certificates. Never set this to true in prod.
  // rejectUnauthorized: false  ← NEVER do this in production

  // Optional: pin a specific CA for added security (e.g., internal services)
  // ca: fs.readFileSync('./internal-ca.crt'),
};

const req = https.request(clientOptions, (res) => {
  console.log('Status:', res.statusCode);

  // Inspect negotiated TLS on the client side too
  const tlsInfo = res.socket.getCipher();
  console.log('Negotiated cipher:', tlsInfo.name);
  console.log('Protocol:', res.socket.getProtocol());

  res.on('data', (chunk) => process.stdout.write(chunk));
});

req.on('error', (e) => {
  // Common errors:
  // CERT_HAS_EXPIRED    → cert expired, renew it
  // UNABLE_TO_VERIFY_LEAF_SIGNATURE → untrusted CA (self-signed in dev?)
  // ECONNREFUSED        → server isn't listening
  console.error('TLS error:', e.message);
});

req.end();


// --- mTLS (Mutual TLS) ---
// Both sides authenticate. Used in service-to-service (zero trust, k8s, gRPC).
// The server verifies the CLIENT's certificate too.
const mtlsServerOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt'),
  ca: fs.readFileSync('./client-ca.crt'),  // CA that signed client certs
  requestCert: true,      // Ask the client for a certificate
  rejectUnauthorized: true // Reject if client cert doesn't validate
};

https.createServer(mtlsServerOptions, (req, res) => {
  // Check the client's certificate identity
  const clientCert = req.socket.getPeerCertificate();
  if (!clientCert || !req.socket.authorized) {
    res.writeHead(401);
    return res.end('Client certificate required\n');
  }

  console.log('Authenticated client:', clientCert.subject.CN);
  res.writeHead(200);
  res.end(`Hello, ${clientCert.subject.CN}!\n`);
});
```

---

## 7. IN THE WILD

**HTTPS Everywhere:** Every browser connection to any `https://` site goes through TLS. Cloudflare, AWS CloudFront, and nginx all terminate TLS at the edge/load balancer. The cert rotation cadence has moved toward 90 days (Let's Encrypt) or even shorter — automated by ACME protocol. If you forget to automate renewal, your cert expires, your site shows a big red warning, and your on-call rotation gets very unhappy.

**Service Meshes (Istio, Linkerd):** In Kubernetes, mTLS between every pod is the zero-trust standard. Istio's sidecar proxies automatically handle TLS handshakes and cert rotation between services — your application code doesn't even know it's using mTLS. Each service gets a SPIFFE identity certificate. Compromising one service doesn't give you the keys to the whole cluster.

**gRPC:** Built on HTTP/2 over TLS. Long-lived connections with multiplexed streams. The TLS session stays alive across many RPC calls. `grpc.ssl_channel_credentials()` is your friend — never use `grpc.insecure_channel()` in production.

**Database connections:** PostgreSQL, MySQL, and Redis all support TLS for client connections (`sslmode=require` in Postgres connection strings). Without it, your DB credentials and query results are plaintext on the wire. In AWS RDS, you can enforce SSL-only connections via a parameter group.

**Heartbleed (CVE-2014-0160):** The real-world example from the lecture. OpenSSL's `HEARTBEAT` extension had a bounds-check bug. An attacker could ask the server to echo back 64KB of memory when only 1 byte was sent — leaking private keys, session tokens, and passwords from server RAM. Millions of servers were affected. It's the single best argument for short certificate lifetimes and frequent key rotation.

**Certificate Transparency (CT):** Every publicly trusted certificate must be logged in a public CT log. Browsers verify CT proofs. If your CA mis-issues a cert for your domain, you'll see it in the logs. This is how researchers catch rogue certificates before they cause damage.

**QUIC / HTTP/3:** TCP has a head-of-line blocking problem — one lost segment stalls all streams. QUIC rebuilds TCP's reliability on UDP and integrates TLS 1.3 directly into the protocol. The TLS handshake and transport layer are merged — you get 1-RTT (or 0-RTT) for *both* connection and encryption, combined. This is the future of web transport.

---

## 8. EXPLAIN IT TO A NON-TECH FRIEND

Imagine you and a friend want to pass secret notes in class. The problem: the teacher (and everyone else in the room) can read anything you write.

So you come up with a plan. You're going to write your notes in a secret code — but first you need to agree on the codebook. And here's the problem: how do you share the codebook without the teacher reading *that* too?

Here's the clever trick you come up with:

You both have a padlock with two keys — a public key (you give copies to anyone) and a private key (you never let it leave your pocket).

Your friend writes down the secret codebook, puts it in a box, and snaps *your* padlock on it. Now anyone can see the box, but only *you* can open it — because only you have the private key. You open the box, get the codebook, and now you both have it. Nobody else does.

**That's TLS.** The "box" is your encrypted message. The "padlock" is the server's public key. The "secret codebook" is the symmetric encryption key you'll use for all future messages.

From that point on, every note you pass is scrambled with that codebook. The teacher sees gibberish. The ISP sees gibberish. Even the person sitting next to you sees gibberish. Only you and your friend — the two people who have the codebook — can read it.

The little padlock icon in your browser's address bar? That's it telling you: *"We successfully exchanged a codebook in secret. Everything from here is scrambled. You're safe."*
