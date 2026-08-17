# UX Upgrades

Two features, built in order of the UX audit's ranked gaps:

1. **[Command Palette Search](#1--command-palette-search)** — replaces the
   `docsify-search` plugin with a centered, keyboard-driven palette.
2. **[Study Progress Tracking](#2--study-progress-tracking)** — per-section
   checkboxes, sidebar progress rings, and "continue where you left off".
3. **[Reading themes](#3--reading-themes)** — System plus 10 curated palettes,
   contrast-enforced, with no flash of the wrong theme.
4. **[Wide-screen layout](#4--wide-screen-layout)** — the article and its
   "On this page" rail are laid out as one unit.
5. **[Home page + sidebar](#5--home-page--sidebar)** — the index is scannable
   lists instead of dense tables, and sidebar labels fit on one line.
6. **["On this page"](#6--on-this-page)** — covers H3s, with an accordion so the
   biggest pages stay scannable.

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

On mobile that floating button is hidden while the drawer is open — the drawer
carries its own pinned search field, so the button would be both redundant and
sitting on top of it. The hamburger becomes an X at the same time and moves to
the drawer's own top-right corner, opposite the logo, which is where a panel's
close control is expected. `aria-expanded` and the accessible name follow the
state.

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

# 3 — Reading themes

The site followed `prefers-color-scheme` **only** — no way to read dark at
noon, light at night, or in a palette that suits your eyes.

## What changed

| Action | File | Notes |
|---|---|---|
| Added | `docs/themes.js` | Palette data, token derivation, persistence, pre-paint apply |
| Added | `docs/theme-picker.js` | The picker UI |
| Added | `docs/theme-picker.css` | Picker styling |
| Modified | `docs/custom.css` | Token plumbing for `[data-theme]` |
| Modified | `docs/command-palette.css` | Same, for its palette-only tokens |
| Modified | `docs/index.html` | `themes.js` in `<head>` + two tags |

## Usage

A picker in the sidebar footer: **System** plus **10 curated reading palettes** —
Daylight, Midnight, Sepia, Solarized Light, Solarized Dark, Nord, Gruvbox,
Dracula, Tokyo Night and High Contrast. Each option shows a four-colour swatch
(page, surface, accent, text) and a one-line blurb. Arrows move, Enter chooses,
Escape closes, clicking outside dismisses.

**System is the default**: it removes every override and lets the media queries
decide, which is also what a reader with JavaScript disabled gets. Stored under
`tsn.theme`; picking System removes the key. The previous three-state values
(`light` / `dark`) still resolve, to Daylight and Midnight.

## Adding a theme

Add one object to `PALETTES` in `themes.js`. Nothing else changes — the picker,
persistence and pre-paint path all pick it up:

```js
{ id: 'my-theme', name: 'My Theme', blurb: 'Short description',
  mode: 'dark',
  bg: '#101014', sidebar: '#0C0C10', card: '#191921', code: '#191921',
  text: '#E6E6EE', accent: '#7FD1B9', border: '#2A2A34',
  syntax: { keyword: '…', string: '…', comment: '…', func: '…', number: '…' } }
```

Seven colours carry the identity; `derive()` expands them into the ~26 custom
properties the stylesheets consume.

## Contrast is enforced, not trusted

Secondary text, muted text, the accent and every syntax colour are pushed away
from their background in 5% steps until they clear **4.5:1** against every
surface they can appear on. A palette therefore cannot introduce an
accessibility regression however it is authored.

This is not theoretical. The canonical editor palettes were tuned for
highlighting rather than WCAG, and **15 of their published syntax colours
measured below 4.5:1** on their own code background — Solarized Light's string
green at 2.63:1, Solarized Dark's magenta at 2.86:1, Nord's purple at 3.79:1.
Enforcement shifts them slightly from the original hex, which is the right
trade: a theme that is faithful but unreadable is not worth shipping.

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

- **All 10 themes pass WCAG AA** on all 10 text roles — body, secondary, muted,
  palette-muted, accent and the five syntax colours. Worst measured ratio across
  the whole set is 4.50:1.
- **17/17 browser assertions**: every theme applies and sets its mode; the
  choice survives a reload and is already painted at load; System clears the
  attribute, the inline tokens and the storage key; legacy `dark` maps to
  Midnight; listbox semantics, arrow keys and Escape all work.
- **38/38 pages** sweep cleanly *under a custom theme* with no TOC overlap,
  one picker, the sidebar header still pinned, search still working, and
  **0 console errors**.

---

# 4 — Wide-screen layout

## The problem

`.markdown-section` centred itself inside `.content`, while `#page-toc` was
`position: fixed` against the **viewport's** right edge. Two independent
positioning systems for two things that must sit next to each other, which
failed in opposite directions depending on window width:

| Viewport | Gap left of article | Article ↔ TOC | Article uses |
|---|--:|--:|--:|
| 1280px | 414px | **−73px — TOC on top of the text** | 56% |
| 1440px | 494px | 7px | 50% |
| 1857px | 702px | 216px | 39% |
| 2200px | 874px | 387px | 33% |

So the TOC physically overlapped article text between roughly 1200px and
1425px, and above that the two drifted apart leaving a ~700px empty gutter.

## The fix

`[article + 56px gutter + TOC]` is treated as a single reading region, capped
and centred in the space beside the sidebar. The article is left-aligned in
that region and always reserves the TOC rail, so the gap between them is a
constant 56px and cannot collapse. `#page-toc` is offset by the same
expression as the content padding, so it lands on the region's right edge
rather than the window's.

On screens ≥1600px the article column widens to 920px but **prose does not** —
paragraphs, lists and headings stay at `--prose-max` (740px ≈ 74ch), while
code blocks and tables use the extra width. This corpus is code-heavy, so that
is where the space is worth spending.

| Viewport | Left gutter | Article ↔ TOC | Article uses |
|---|--:|--:|--:|
| 1280px | 48px | 56px | 51% |
| 1440px | 86px | 56px | 51% |
| 1857px | **205px** (was 702) | 56px | **49%** (was 39) |
| 2200px | 376px | 56px | 42% |

## Maintenance notes

**The wide-screen block is `min-width: 1201px`, not 1200.** The rule hiding
the TOC is `max-width: 1200px`, which *includes* 1200 — so at exactly 1200px
both matched, and the article reserved a 256px rail for a TOC that was not
being rendered, shrinking to 571px beside empty space. If you change one
breakpoint, change the other.

**`--layout-offset` follows the sidebar.** It is `--sidebar-width` normally and
`0px` under `body.close`, so the centring maths stays correct when the sidebar
is collapsed.

## Verification

- Measured at 375 / 768 / 1024 / 1199 / 1200 / 1440 / 1857 / 2200px: the
  article↔TOC gap is a constant 56px wherever the TOC renders, gutters are
  symmetric to within the scrollbar width, and 1200px is back to a full 720px
  article.
- **38/38 pages** at both 1440px and 1857px: no TOC/article overlap anywhere,
  no horizontal scroll, 0 console errors, all other features intact.

---

# 5 — Home page + sidebar

## The problems

**The index was three markdown tables, 33 rows.** Long note titles were squeezed
into a narrow "Note" column and wrapped badly, while the "Topics" column was an
unreadable comma list. Nothing indicated where to start or that Backend
Engineering was a sequence.

**35 of 38 sidebar labels were over 28 characters**, so nearly every entry
wrapped onto two or three lines. 26 of them carried pure boilerplate:
`— Lecture Breakdown` (×12), `Interview Mastery Guide` (×6), `— Quick Notes`
(×4), `— Full Breakdown` (×2). The longest was 69 characters.

**The sidebar showed the same name twice meaning different things.** On the
index, `.app-sub-sidebar` renders the current page's H2 anchors — so "Backend
Engineering" appeared once as a heading anchor and again as a real category,
styled almost identically.

**Progress tracking ran on the index**, offering "0 / 6 sections complete —
Mark all complete" for what is only a table of contents.

## What changed

| Action | File | Notes |
|---|---|---|
| Rewritten | `docs/README.md` | Tables → lists with descriptions; "New here?" callout; ordered series |
| Added | `docs/nav.js` | Sidebar label shortening, series numbers, home marker class |
| Added | `docs/nav.css` | Home presentation + sidebar refinements |
| Modified | `docs/progress-tracker.js` | Index excluded from tracking |
| Modified | `docs/index.html` | Two tags |

## Results

| | Before | After |
|---|--:|--:|
| Sidebar links fitting one line | 3 / 38 | **37 / 38** |
| Homepage table rows | 33 | **0** |
| Notes counted for progress | 38 (incl. index) | **37** |

## Sidebar is a flex column, not a scroll box

`.sidebar` used to be the scroll container (`overflow-y: auto`), so the logo,
the search trigger and the progress line all scrolled away once you were a few
notes into a 38-item list — losing the fastest route to any of 1,152 sections
exactly when you were deepest in the nav.

It is now `display: flex; flex-direction: column; overflow: hidden`, with
`.sidebar-nav` as the only scrolling region:

```
.app-name          flex: 0 0 auto     pinned header
.cp-trigger-wrap   flex: 0 0 auto
.pt-overall        flex: 0 0 auto
.sidebar-nav       flex: 1 1 auto     the only scroller
.theme-switch-wrap flex: 0 0 auto     pinned footer
```

Two things to know if you touch this:

- **`min-height: 0` on `.sidebar-nav` is required, not cosmetic.** Flex items
  default to `min-height: auto`, which refuses to shrink below content height —
  the list would push the footer off-screen instead of scrolling.
- **The flex item is `.app-name`, not `.app-name-link`.** Docsify wraps the
  title in a `.app-name` div; targeting the inner `<a>` leaves the actual flex
  child free to shrink.

The theme switcher no longer needs `position: sticky` — it is a flex footer now.

## Maintenance notes

**Sidebar labels are shortened for DISPLAY ONLY.** `_sidebar.md` is regenerated
by CI from each note's H1, so editing it would be overwritten — and editing the
H1s would change the page titles and the search index. `nav.js` rewrites the
rendered link text instead, keeps the full title in the `title` attribute, and
leaves everything else untouched. Rules are a list of regex suffix trims plus a
small explicit rename map keyed by the post-trim string.

**Series numbers come from the filename**, not a hardcoded list:
`04_Short_Polling` → "4". Add a numbered file and it is picked up automatically.

**`nav.js` preserves the progress ring** when it rewrites a link's innerHTML.
The two modules touch the same element from different `doneEach` hooks, in
either order, so each has to tolerate the other having run first.

**Home-only styles are scoped to `.markdown-section.is-home`**, a class applied
by `nav.js` on route `/`. Do not style bare `.markdown-section li` for the index
— it would hit every note page.

## Verification

- **38/38 pages** render, **0 console errors**, no TOC overlap.
- Index has **0 checkboxes** and no bulk bar; note pages keep exact H2-to-checkbox
  parity (**366** checkboxes = 372 − the index's 6).
- Sidebar shows **37 rings** and the overall line reads **0 / 37** — the index is
  no longer counted as a note.
- All **37 notes are linked** from the rewritten index and every link resolves.
- Descriptions pass WCAG AA in both themes (5.12:1 light, 6.68:1 dark).
- Search still finds both note text (`usefect` → useEffect) and homepage text.
- Sidebar header and footer stay fixed while the nav scrolls 0 → 3050px, on
  desktop and inside the mobile drawer.

---

# 6 — "On this page"

## The problem

The rail listed **H2s only**. Measured across the corpus that was **372 of
1,098 sections** — and since every interview question is an H3, none of them
were reachable from it:

| Page | In the rail | Total sections |
|---|--:|--:|
| javascript-interview-bible | 39 | 163 |
| angular-interview-questions | 22 | 115 |
| dsa-interview-mastery-guide | 15 | 88 |
| react-interview-mastery-guide | 10 | 55 |

Under a fifth on the largest pages — exactly where a table of contents earns
its keep.

## The fix

H3s are included, but not all at once: the JavaScript Bible alone has 163
sections against a rail that was already at its 740px maximum with 39. H3s sit
in a group that **opens only under the section being read**, so the rail shows
about 40 rows instead of 163 while every section stays one click away.

Clicking a row scrolls to it, `aria-current` tracks the active row, and the
rail auto-scrolls to keep that row visible — by setting its own `scrollTop`
rather than calling `scrollIntoView`, which would drag the page along with it.

## The scroll handler was also a performance problem

The previous implementation called `getBoundingClientRect()` on **every heading
on every scroll event, unthrottled** — a forced layout per heading per event,
which including H3s would have made three times worse. Offsets are now measured
once, re-measured only when `document.documentElement.scrollHeight` changes
(late-loading fonts and syntax highlighting shift the page), and the handler is
throttled to one animation frame.

## Mobile was already covered

An earlier note in this document claimed mobile had no TOC. That was wrong:
Docsify's `subMaxLevel: 3` renders the current page's H2 **and** H3 anchors into
the sidebar, so the drawer already carries a full table of contents — 175
section links on the JavaScript Bible. `#page-toc` is hidden below 1200px by
design; the drawer is the mobile equivalent.

## Verification

- TOC rows exactly equal article sections on every page checked by direct DOM
  dump: JavaScript Bible 39/124, DSA 15/73, Pub/Sub 8/7, Docker 11/0.
- **38/38 pages** render, no TOC/article overlap, never more than one group
  open, **0 console errors**.
- Clicking H2 and H3 rows lands the heading at the top of the viewport
  (`top=24`, the `scroll-margin-top`).

> A second testing note to go with the transitions one: iframe-based harnesses
> are unreliable under `--virtual-time-budget` — several runs reported an
> entirely unrendered page, and one reported a TOC/section mismatch that was
> just the previous page's rail measured mid-swap. Direct `--dump-dom` against
> the real page was consistent every time. Prefer it.

---

## Ideas not taken

**Interactive Learning** — collapsing each interview answer behind a
`<details>` so a Q&A page can be used as a self-test. This was built and then
removed by choice: it works, but folding the answers changes these pages from
reference material into a quiz, and they are used as reference.

Worth knowing if it is ever revisited: detection has to be **per question, not
per file**. The corpus has 134 questions across 6 files in three different
shapes, mixed *within* files — the DSA guide has 45 questions of which only 15
use a `#### Strong Answer:` heading, and `ts-interview-qa` writes
`**Strong Answer:**` as bold text instead. Leading context also has to stay
outside the fold: in `tools/06_SDLC_Copilot.md` the `**Scenario:**` blockquote
*is* the question.

---

## Remaining ideas

Ranked by measured gap, from the audit:

1. **Accessibility** — no skip-to-content link; `.sidebar-toggle` is 34×34px,
   below the 44px touch target; a `:focus-visible` sweep is worth doing.
2. **Related notes** — only 4 of 38 files have a "Related" section; sidebar
   adjacency and folder membership could generate the rest.
3. **Back-to-top** on very long pages — the largest note is 164KB.
4. **Search match highlighting** — the last thing holding search below 5.0.
5. **Prism languages** — 9 code blocks across `json`, `sql`, `nginx`,
   `protobuf` and `graphql` render unhighlighted. Smaller than the original
   audit implied: the Docker cheatsheet uses `bash`, which is loaded.
6. **Duplicate table of contents** — now that the right rail covers H3s, it
   overlaps heavily with the sidebar's own per-page anchor list
   (`subMaxLevel: 3`). Worth deciding which one earns its place.
