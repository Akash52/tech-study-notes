# UX Upgrade — Command Palette Search

Replaces the `docsify-search` plugin with a centered, keyboard-driven command
palette (VS Code `Cmd+P` / Linear `Cmd+K` style).

**There is no new build step, no new dependency, and no config to set.** The
site is still plain Docsify loaded from CDN — open `docs/index.html` through any
static server and it works.

---

## Why

Search was the site's primary access path and the weakest part of it. The
sidebar exposes 38 links; the corpus has **1,152 addressable H1–H3 sections**.
Search is the only route to the rest, and the old plugin:

| Problem | Evidence |
|---|---|
| Literal substring matching only | `new RegExp(escaped, 'gi')` + `.search()` in the plugin source — a typo returned nothing |
| No keyboard navigation | Zero `keydown` / `ArrowUp` / `ArrowDown` / `Enter` handlers in the plugin |
| Results confined to the sidebar | Rendered inside the 272px rail (~240px usable) |
| Wasted storage | Persisted a ~3.1 MB JSON index into `localStorage` on every visit |
| Broken documented shortcut | `docs/README.md` said "hit `/`", but only `Cmd+K` was bound — to the plugin's input |

---

## What changed

| Action | File | Notes |
|---|---|---|
| Added | `docs/command-palette.js` | Indexer, fuzzy scorer, modal UI, keyboard + a11y |
| Added | `docs/command-palette.css` | Styling; consumes the existing custom properties |
| Modified | `docs/index.html` | Removed the `search.min.js` script and the `search: {}` config; added two tags |
| Modified | `docs/custom.css` | Deleted the now-dead `.sidebar .search` rules (49 lines) |
| Modified | `docs/custom.js` | Removed `initSearchShortcut()` (33 lines of dead code) |

No content file, `_sidebar.md`, or CI workflow was touched. No URL changed.

### `custom.js` removal

`initSearchShortcut()` queried `.search input` and `.results-panel`, which the
removed plugin injected. It failed safe (an early `return` before
`preventDefault`), but referenced a plugin that no longer exists. The mobile
drawer `inert` logic and the reading-progress bar in that file are untouched.

---

## Usage

| Key | Action |
|---|---|
| `/` or `Cmd/Ctrl+K` | Open the palette |
| `↑` / `↓` | Move the highlight (scrolls into view) |
| `Home` / `End` | Jump to first / last result |
| `Enter` | Open the highlighted section |
| `Esc`, backdrop click, or `✕` | Close |

`/` is ignored while typing in an input and when any modifier is held.
Mouse hover adopts the keyboard highlight rather than competing with it.

There is also a **`Search… ⌘K` button in the sidebar** (occupying the slot the
old search box used to fill) and a **fixed search button beside the hamburger**
on viewports under 768px, and on desktop whenever the sidebar is collapsed.

---

## How it works

**Lazy index, memory only.** Nothing is fetched on page load. On the first
palette open, `_sidebar.md` is parsed for the file list, then all 38 markdown
files are fetched through an 8-way concurrency pool. Results stream in as files
land, so typing is never blocked, and an `Indexing… n/38` counter shows in the
footer. The index is a flat in-memory array — **nothing is written to
`localStorage`**. Only recently-visited page titles go to `sessionStorage`
(key `tsn.recentPages`), shown when the query is empty.

**Scoring** is tiered, strongest first — exact (100) → prefix (85) → word-boundary
substring (72) → mid-word substring (62) → acronym (55) → subsequence fuzzy (40) —
adjusted by consecutive-run and word-boundary bonuses and by gap/length
penalties. Fields are weighted: heading ×3.0, file title ×1.5, parent H2 ×1.2,
prose body ×0.6. Multi-word queries use AND semantics. A file's own H1 is boosted
so typing a file name offers "jump to this note" before its subsections.

Section prose (up to 1,500 chars per section) is kept for **full-text recall**,
matched by substring only — running the fuzzy subsequence scan across bodies
that long would dominate the per-keystroke cost. Headings keep full fuzzy
matching. Without this, terms appearing only mid-paragraph (`io_uring`,
`PgBouncer`, `Envoy`) would have become unfindable, which the old plugin did
support; dropping it would have been a recall regression.

Measured on the real 1,152-record index: **1.8 ms per query** (~550 queries/sec).

---

## Maintenance notes

### Anchors are not obvious — read this before changing the indexer

Docsify HTML-escapes heading text **before** slugifying it. The consequences
are not intuitive, and they are load-bearing:

| Heading | Actual DOM id |
|---|---|
| `## 1. THE GIST` | `_1-the-gist` — leading digit gets `_` |
| `## 3. ENGINEER'S NOTEBOOK` | `_3-engineer39s-notebook` — `'` → `&#39;` → digits survive |
| `## 5. THE "AHA" MOMENT` | `_5-the-quotahaquot-moment` — `"` → `&quot;` |
| `## 5. Type Guards & Narrowing` | `_5-type-guards-amp-narrowing` — `&` → `&amp;` |

237 headings in this corpus start with a digit and 141 contain escaping-sensitive
characters, so slugifying the raw text instead would break roughly a third of all
anchors. The implementation escapes first, then slugifies, and was verified by
rendering pages in a real browser and diffing every generated id (173/173 match
across the four most awkward files).

**`command-palette.js` uses a private port of Docsify's slugify rather than
`window.Docsify.slugify`.** The public one keeps a module-level duplicate-heading
counter that Docsify's own renderer shares; correct indexing needs to reset that
counter per file, and calling `.clear()` on the shared instance mid-render would
corrupt the anchors of the page on screen.

### The `inert` handshake with `custom.js`

`custom.js` runs a `MutationObserver` on `body[class]` whose `sync()` both sets
and unconditionally *clears* `inert` on `.sidebar` / `.content` for the mobile
drawer. Docsify also toggles a `sticky` body class on scroll, so that can fire
at any moment. The palette therefore:

1. records each element's prior `inert` state and restores it exactly on close
   (never blindly removing it, which would corrupt the drawer's desktop state), and
2. runs a guard observer that re-asserts `inert` while the palette is open. The
   guard only acts when the attribute is missing, so it settles after one round
   rather than looping.

If you ever refactor the drawer logic, keep this in mind — the two components
share those attributes.

### Contrast

`custom.css` tunes `--text-muted` to 4.5:1 against `--bg` and `--bg-sidebar`.
The modal sits on `--bg-card`, which is lighter in dark mode, where that colour
measures only **4.32:1** and fails WCAG AA. `command-palette.css` defines
`--cp-muted` for secondary text inside the palette: it inherits `--text-muted`
in light mode (5.13:1) and overrides to `#8B8B85` in dark (4.87:1). Do not
substitute `--text-muted` back in, and do not add `opacity` to muted text —
that blends it toward the background and breaks AA in both themes.

---

## Verification

Verified by driving the real site in headless Chrome (no new dependency — the
harnesses were temporary and have been removed):

- **51 browser assertions pass, 0 fail** — `/` and `Cmd+K` open; `Esc`, backdrop
  and result-click close; `usefect` → `useEffect`; `reqres` → `Request-Response`;
  arrow navigation with `aria-activedescendant`; `Enter` lands on a heading that
  exists in the rendered DOM; focus trap wraps both directions; hover/keyboard
  cooperation; empty state; recents.
- **38/38 pages** render with content and headings, **0 console errors or warnings**.
- **Lazy index confirmed**: 2 markdown requests on load (both Docsify's own),
  41 after opening the palette.
- **`localStorage` stays clean** — no search index key is written.
- **WCAG AA passes in both themes** (light 4.69–17.43:1, dark 4.87–13.58:1).
- **Full-text recall**: prose-only terms resolve — `io_uring` 3 hits, `PgBouncer` 3,
  `Envoy` 5, `epoll` 18. `cleanInline` passes 10/10 unit checks, including
  snake_case preservation (`MAX_RETRIES_COUNT`, `__init__`).
- **375×812 viewport**: modal fits at 351px, no horizontal scroll, 16px input
  (no iOS zoom), 68px rows, and the hamburger/search 44px touch targets do not overlap.

---

## Known issues found along the way (not fixed — out of scope)

1. **Corrupted characters in one heading.**
   `docs/interview-prep/react-interview-mastery-guide.md:3211` contains literal
   U+FFFD replacement bytes (`## �� PRACTICAL CODING QUESTIONS (Q16-20)`),
   left over from an earlier emoji removal. It renders as broken glyphs on the
   page itself, not only in search. Fixing it means editing a content file.

2. **Six files have no H1**, so the sidebar and search fall back to a
   filename-derived title: the five `tools/0*.md` Copilot notes and
   `backend-engineering/Protocol/internet_protocol.md`.
