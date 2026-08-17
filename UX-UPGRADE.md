# UX Upgrades

Two features, built in order of the UX audit's ranked gaps:

1. **[Command Palette Search](#1--command-palette-search)** — replaces the
   `docsify-search` plugin with a centered, keyboard-driven palette.
2. **[Study Progress Tracking](#2--study-progress-tracking)** — per-section
   checkboxes, sidebar progress rings, and "continue where you left off".
3. **[Theme Switcher](#3--theme-switcher)** — Light / System / Dark with
   persistence and no flash of the wrong theme.

**There is no new build step, no new dependency, and no config to set.** The
site is still plain Docsify loaded from CDN — open `docs/index.html` through any
static server and it works. All state is `localStorage` / `sessionStorage`;
there is no backend.

---

# 1 — Command Palette Search

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

## Content issues found and fixed

Both were repaired in a separate commit (`fix: broken unicode heading + add
missing H1`):

1. **Literal U+FFFD replacement characters** left by an earlier emoji strip,
   in 6 places across 3 files (not 1, as first reported). Fixing the React
   guide's heading also cleaned its anchor, which had been embedding the
   replacement character. `js-es2024-guide.md:1272` was deliberately left
   alone — its replacement character is intentional prose about U+FFFD.

2. **One file genuinely lacked an H1**: `Protocol/internet_protocol.md`.
   The five `tools/0*.md` files reported earlier *do* have H1s — on line 3,
   after a leading `---` divider. The original audit checked only line 1 and
   was wrong; adding titles there would have produced duplicate H1s.


---

# 2 — Study Progress Tracking

Lightweight completion tracking for a 38-note study corpus: a checkbox beside
every H2, progress rings in the sidebar, per-page bulk controls, and a
"Continue" row in the command palette.

## What changed

| Action | File | Notes |
|---|---|---|
| Added | `docs/progress-tracker.js` | Checkbox injection, rings, bulk controls |
| Added | `docs/progress-tracker.css` | Styling; consumes the existing custom properties |
| Modified | `docs/index.html` | Added two tags |
| Modified | `docs/command-palette.js` | "Continue where you left off" row in the empty state |

No content file, `_sidebar.md`, or CI workflow was touched.

## Usage

- **Checkbox beside each H2.** Appears on hover, on keyboard focus, and
  whenever the section is complete; always visible on touch devices. Completed
  headings are deliberately **not** dimmed or struck through — this is study
  material that gets re-read.
- **Bulk controls** below the H1: `N / M sections complete`, *Mark all
  complete*, *Reset progress*. There is no global reset; per-page only.
- **Sidebar rings** on every note link: empty track when unstarted, a
  proportional accent arc when partial, a filled ring with a tick at 100%.
- **Category counters** such as `2/16` beside each sidebar heading, counting
  *notes* completed. Backend Engineering aggregates its nested Protocol
  sub-list, hence 16 rather than 10.
- **Overall line** under the search trigger: `N / 38 notes complete`.
- **Palette "Continue" row** above Recent when the query is empty, pointing at
  the first unchecked H2 of the most recent unfinished note.

## Storage schema

```
studyProgress:{route}   ->  { "heading-slug": true, ... }
studyProgressMeta       ->  { "{route}": h2Count, ... }
```

Example: `studyProgress:/backend-engineering/04_Short_Polling` →
`{ "_1-the-gist": true }`. Removing every check deletes the key rather than
leaving an empty object. Both keys are `localStorage`, so progress survives a
browser restart; the palette's recents remain in `sessionStorage`.

## Maintenance notes

**H2 is the unit.** H3s are sub-points within an H2's topic, so only H2s get a
checkbox — 372 across the corpus. Slugs come straight from the rendered
`h2.id`, so progress keys and anchors can never drift apart, and none of the
slugify subtleties documented above apply here.

**Totals are learned, not scanned.** A ring needs `done / total`, but computing
the total means knowing a page's H2 count. Scanning all 38 files on load would
undo the lazy-index work done for search, so each page records its own H2 count
into `studyProgressMeta` as it renders. Pages never opened simply show an empty
ring. Category counters sidestep the problem entirely by counting *notes*
complete out of notes listed in the sidebar — both known without fetching.

**The checkbox is injected as the H2's first child**, ahead of Docsify's
`.anchor` link, so clicking it never triggers anchor navigation. It carries no
text, so `custom.js`'s "On this page" TOC — which reads `h2.textContent` — is
unaffected.

**The tick is a `background-image`, not a `::after`.** `<input>` is a replaced
element and pseudo-elements on replaced elements are not reliably rendered
across browsers.

**The 44px touch target is anchored to the checkbox's right edge**, not centred
on it. Centring pushed the hit area 3px past the start of the heading text, so
tapping the first characters of a heading toggled the checkbox instead of
following its anchor. Growing leftwards puts the extra area in the page's left
padding, where nothing else is clickable.

**The palette reads this feature's `localStorage` directly** rather than
touching `progress-tracker.js`'s state, so neither module depends on the other
being loaded. If the tracker is absent, the Continue row simply never renders.

## Verification

- **32/32 assertions pass** in headless Chrome — checkboxes on all three
  content shapes; persistence across navigation and in `localStorage`; rings
  present, labelled, and updating live without reload; category aggregation
  including nested Protocol; bulk mark/reset; the palette Continue row ranked
  above Recent and targeting the first *unchecked* H2; search unaffected.
- **38/38 pages** render with exact H2-to-checkbox parity (**372** checkboxes),
  38 rings, 7 category counters, **0 console errors**. TOC, pagination and the
  reading-progress bar all still work.
- **WCAG AA in both themes** — 4.51:1 to 6.68:1 for every piece of secondary
  text the feature adds.
- **375×812**: 44px touch targets with 11px clearance from the heading anchor,
  38/38 rings on-screen in the open drawer, no horizontal scroll.

> Testing note: CSS transitions do not advance under Chrome's
> `--virtual-time-budget`, so computed `transform` / `background-color` /
> `color` can be sampled mid-flight and look wrong. This produced three
> separate phantom bugs during this work — a checkbox that looked unstyled, a
> drawer that looked stuck shut, and an accent colour that looked like it did
> not swap on theme change. Measure end state with
> `* { transition: none !important }` injected, or you will chase them too.

---

# 3 — Theme Switcher

The site was already fully themed in both modes, but followed
`prefers-color-scheme` **only** — there was no way to read dark at noon, or
light at night, without changing an OS setting.

## What changed

| Action | File | Notes |
|---|---|---|
| Added | `docs/theme-toggle.js` | Three-state control, persistence |
| Added | `docs/theme-toggle.css` | Segmented control styling |
| Modified | `docs/custom.css` | Token plumbing for `[data-theme]` |
| Modified | `docs/command-palette.css` | Same, for its three palette-only tokens |
| Modified | `docs/index.html` | Inline pre-paint script + two tags |

## Usage

A segmented **Light / System / Dark** control pinned to the bottom of the
sidebar (`position: sticky`, so it stays reachable without scrolling past 38
nav links). **System is the default** and simply removes `data-theme`, letting
the media queries decide. Stored under `tsn.theme` in `localStorage`; choosing
System removes the key rather than storing the string, so a reader who never
touches the control and one who explicitly picks System end up identical.

## Maintenance notes

**The theme is applied by an inline script in `index.html`'s `<head>`, not by
`theme-toggle.js`.** This is not optional: anything loaded via `<script src>`
runs *after* the stylesheets have painted, which shows a flash of the wrong
theme on every single page load. The storage key and accepted values are
therefore duplicated between the inline script and `theme-toggle.js` — change
one, change the other.

**Tokens are declared once, mapped twice.** Dark values live as `--dark-*` on
`:root`; two rules map them onto the real tokens, because a dark theme can be
activated two ways and CSS cannot merge a media query with a plain selector:

```css
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }
:root[data-theme="dark"] { … }
```

The `:not([data-theme="light"])` guard is what lets an explicit light choice
beat a dark OS. Only the *mapping* is duplicated, so colours cannot drift.
Adding a token means adding it to both mapping rules — in `custom.css`,
`command-palette.css`, and `theme-toggle.css`, which all follow this pattern.

**`color-scheme` is set alongside** so native scrollbars, form controls and the
canvas behind the page match the chosen theme.

**The selected segment uses its own `--theme-chip` token.** `--bg-card` reads
well in light (a white pill on the off-white track) but collapses in dark,
where `--bg-card` and `--bg-code` are both `#1E1E1C` — the chip would be
invisible and selection would be signalled by icon colour alone, which is a
WCAG 1.4.1 problem.

**Real radio inputs**, three of them sharing a name, so arrow-key navigation,
grouping and screen-reader semantics come from the browser.

## Verification

- **25/25 assertions pass under a light OS *and* 25/25 under a dark OS** — all
  six combinations of OS preference × explicit choice. Default follows the OS;
  explicit Dark beats a light OS; explicit Light beats a dark OS; System clears
  the key and returns to the OS.
- **Applied before paint** — after a reload the page is already the stored
  theme, confirming the inline script beats the stylesheets.
- **Tokens fully swap**: `--accent` `#2D7A50 ⇄ #4ADE80`, backgrounds, sidebar,
  `color-scheme`, and the palette modal all follow.
- **38/38 pages**, 372 checkboxes, 38 rings, exactly one switcher (no duplicate
  injection across navigations), **0 console errors**.

---

## Next gap

**Interactive Learning (still 1.0)** — see the auto-`<details>` sketch in the
handover notes.
