/**
 * Command palette search for the Tech Study Notes portal.
 *
 * Replaces the docsify-search plugin with a centered, keyboard-driven command
 * palette in the style of VS Code's Cmd+P or Linear's Cmd+K.
 *
 * Why the old plugin was replaced:
 *   - it matched with a literal substring regex, so `usefect` found nothing;
 *   - it shipped zero keyboard handlers, so results were mouse-only;
 *   - it rendered results inside the 272px sidebar rail;
 *   - it persisted a ~3.1 MB JSON index into localStorage on every visit.
 *
 * Design notes worth knowing before editing:
 *
 * 1. ANCHORS. Docsify derives heading ids by HTML-escaping the heading text
 *    and *then* slugifying it. That is not a detail you can skip: `'` becomes
 *    `&#39;`, and slugify strips `&`/`#`/`;`, so `## 3. ENGINEER'S NOTEBOOK`
 *    renders as id="_3-engineer39s-notebook". Likewise `&` leaves a literal
 *    "amp", `"` leaves "quot", and a leading digit gets an `_` prefix. This
 *    was verified by rendering pages in a real browser and diffing the DOM.
 *
 * 2. PRIVATE SLUGIFY. We deliberately do NOT call window.Docsify.slugify even
 *    though it is public API. It keeps a module-level duplicate-heading
 *    counter that Docsify's own renderer shares, and correct indexing needs
 *    to reset that counter per file. Calling .clear() on the shared instance
 *    while a page is rendering would corrupt the anchors of the page on
 *    screen. The port below reproduces Docsify 4.13.1's output exactly
 *    (validated: 173/173 headings across the four most awkward files).
 *
 * 3. MEMORY ONLY. The index lives in a module-level array and is rebuilt on
 *    reload. Nothing is written to localStorage.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Configuration
   * ------------------------------------------------------------------ */

  var MAX_RESULTS = 20;         // top-N shown; ranking quality over quantity
  var RECENT_LIMIT = 5;         // pages listed when the query is empty
  var FETCH_CONCURRENCY = 8;    // parallel markdown fetches while indexing
  var SNIPPET_CHARS = 60;       // preview length shown under each result
  var BODY_CHARS = 1500;        // prose per section kept for full-text recall
  var INDEXING_NOTICE_MS = 200; // delay before showing the "Indexing…" state
  var RERENDER_MS = 120;        // throttle for live re-render while indexing
  var RECENT_KEY = 'tsn.recentPages';

  /* Field weights. A hit in the heading is worth far more than one buried
     in prose. */
  var W_HEADING = 3.0;
  var W_FILE = 1.5;
  var W_PARENT = 1.2;
  var W_BODY = 0.6;

  /* Scoring tiers, strongest first. */
  var S_EQUAL = 100;   // query === whole field
  var S_PREFIX = 85;   // field starts with query
  var S_WORD = 72;     // substring starting at a word boundary
  var S_MID = 62;      // substring mid-word
  var S_ACRONYM = 55;  // matches the initials of successive words
  var S_FUZZY = 40;    // subsequence match (usefect -> useEffect)

  /* ------------------------------------------------------------------ *
   * Small utilities
   * ------------------------------------------------------------------ */

  var ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /**
   * Mirrors the HTML escaping marked applies before Docsify slugifies.
   * Also used for escaping text we inject via innerHTML.
   */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) { return ESCAPE_MAP[c]; });
  }

  /* Punctuation class copied verbatim from Docsify 4.13.1's slugify. Note it
     does NOT contain `-` or `_`, so hyphens in headings survive. */
  var SLUG_PUNCT = /[ -⁯⸀-⹿\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;

  /** Private port of Docsify's slugify, with its own duplicate counter. */
  function makeSlugifier() {
    var seen = {};
    function slugify(text) {
      if (typeof text !== 'string') return '';
      var key = text.trim()
        .replace(/[A-Z]+/g, function (s) { return s.toLowerCase(); })
        .replace(/<[^>]+>/g, '')
        .replace(SLUG_PUNCT, '')
        .replace(/\s/g, '-')
        .replace(/-+/g, '-')
        .replace(/^(\d)/, '_$1');
      var count = Object.prototype.hasOwnProperty.call(seen, key) ? seen[key] + 1 : 0;
      seen[key] = count;
      return count ? key + '-' + count : key;
    }
    return slugify;
  }

  /**
   * Strips inline markdown so headings/snippets read as plain prose.
   *
   * Emphasis markers are matched as delimiter PAIRS rather than stripped
   * blanket-style. Removing every `_` would corrupt snake_case identifiers -
   * `io_uring` became `iouring` and was then unfindable - and the same applies
   * to MAX_RETRIES, __init__, and similar. Underscore emphasis is therefore
   * only unwrapped at word boundaries.
   */
  function cleanInline(text) {
    return String(text)
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')        // images
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')     // links -> label
      .replace(/`+/g, '')                           // inline code ticks
      .replace(/\*\*\*([^*\n]+?)\*\*\*/g, '$1')     // ***both***
      .replace(/\*\*([^*\n]+?)\*\*/g, '$1')         // **strong**
      .replace(/\*([^\s*][^*\n]*?)\*/g, '$1')       // *emphasis* (not "2 * 3")
      .replace(/~~([^~\n]+?)~~/g, '$1')             // ~~strike~~
      .replace(/(^|[\s([{])_{1,2}([^_\n]+?)_{1,2}(?=[\s)\]}.,;:!?]|$)/g, '$1$2')
      .replace(/<[^>]+>/g, '')                      // inline html
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Resolves a repo-relative path against the site root, honouring basePath. */
  function resolveUrl(rel) {
    var base = (window.$docsify && window.$docsify.basePath) || '';
    var root = base ? new URL(base, window.location.href).href : window.location.href;
    return new URL(String(rel).replace(/^\//, ''), root).href;
  }

  function isTypingTarget(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  /* ------------------------------------------------------------------ *
   * Index construction
   * ------------------------------------------------------------------ */

  var index = [];            // flat array of section records, memory only
  var indexState = 'idle';   // idle | building | ready
  var filesDone = 0;
  var filesTotal = 0;

  /**
   * Extracts H1-H3 records from one markdown document.
   *
   * Fenced code blocks are removed before scanning, otherwise a `# comment`
   * inside a bash fence registers as a heading - the same trap the sidebar
   * generation workflow already guards against.
   */
  function parseMarkdown(routePath, fileTitleFallback, markdown) {
    var slugify = makeSlugifier();
    var lines = markdown.split('\n');
    var records = [];
    var fenceChar = null;
    var fileTitle = fileTitleFallback;
    var currentH2 = '';
    var pending = null;   // record awaiting its snippet text
    var buffer = '';

    function flush() {
      if (!pending) return;
      var text = cleanInline(buffer);
      // Keep the prose for matching (the old plugin indexed full section
      // bodies; dropping that would lose recall for anything not in a
      // heading). Only the first SNIPPET_CHARS are ever displayed.
      pending.bl = text.toLowerCase();
      if (text.length > SNIPPET_CHARS) {
        // Trim back to a word boundary so previews do not cut mid-word.
        var cut = text.slice(0, SNIPPET_CHARS);
        var space = cut.lastIndexOf(' ');
        if (space > SNIPPET_CHARS * 0.6) cut = cut.slice(0, space);
        // Never end on a lone high surrogate: slicing by UTF-16 code unit can
        // split an emoji in half, which renders as a replacement glyph. Some
        // headings in this corpus do use astral characters.
        var lastCode = cut.charCodeAt(cut.length - 1);
        if (lastCode >= 0xD800 && lastCode <= 0xDBFF) cut = cut.slice(0, -1);
        text = cut.replace(/[\s,.;:—-]+$/, '') + '…';
      }
      pending.snippet = text;
      pending = null;
      buffer = '';
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      // Track fenced blocks; skip everything inside them.
      var fence = line.match(/^\s{0,3}(`{3,}|~{3,})/);
      if (fence) {
        if (fenceChar === null) fenceChar = fence[1].charAt(0);
        else if (fence[1].charAt(0) === fenceChar) fenceChar = null;
        continue;
      }
      if (fenceChar !== null) continue;

      var heading = line.match(/^(#{1,3})\s+(.+?)\s*#*\s*$/);
      if (heading) {
        flush();
        var level = heading[1].length;
        var raw = heading[2].replace(/\{docsify-ignore(-all)?\}/g, '').trim();
        var display = cleanInline(raw);
        if (!display) continue;

        // Anchor must come from the ESCAPED raw text (see note 1 in header).
        var anchor = slugify(esc(raw));

        if (level === 1 && fileTitle === fileTitleFallback) fileTitle = display;
        if (level === 2) currentH2 = display;

        /* `hl`/`fl`/`pl`/`sl` are lowercased copies of the searchable fields.
           Scoring runs over every record on every keystroke, so lowercasing
           here once (38 files) instead of in scoreField (4 fields x 1152
           records x tokens, per keystroke) is what keeps typing smooth. */
        var record = {
          route: routePath,
          fileTitle: fileTitle,
          heading: display,
          level: level,
          parent: level === 3 ? currentH2 : '',
          snippet: '',
          anchor: anchor,
          hl: display.toLowerCase(),
          fl: '',
          pl: level === 3 ? currentH2.toLowerCase() : '',
          bl: ''
        };
        records.push(record);
        pending = record;
        continue;
      }

      // Accumulate prose for the pending heading's preview snippet.
      if (pending && buffer.length < BODY_CHARS) {
        var t = line.trim();
        // Skip table rules and bare list bullets - they make noisy previews.
        if (t && !/^\|?[\s:|-]+\|?$/.test(t)) {
          buffer += (buffer ? ' ' : '') + t;
        }
      }
    }
    flush();

    // Back-fill the file title onto records parsed before the H1 was seen.
    var fileTitleLower = fileTitle.toLowerCase();
    for (var j = 0; j < records.length; j++) {
      records[j].fileTitle = fileTitle;
      records[j].fl = fileTitleLower;
    }
    return records;
  }

  /**
   * Determines which documents to index.
   *
   * Parses _sidebar.md rather than scraping `.sidebar-nav` links: the sidebar
   * is generated by CI so it is always current, and custom.css already
   * documents that Docsify's sidebar DOM shape is inconsistent between the
   * first category and the rest. Falls back to the DOM if the fetch fails.
   */
  function loadFileList() {
    return fetch(resolveUrl('_sidebar.md'))
      .then(function (r) {
        if (!r.ok) throw new Error('sidebar ' + r.status);
        return r.text();
      })
      .then(function (text) {
        var seen = {};
        var out = [];
        var re = /\[([^\]]+)\]\(([^)]+)\)/g;
        var m;
        while ((m = re.exec(text)) !== null) {
          var label = cleanInline(m[1]);
          var target = m[2].trim();
          if (/^(https?:)?\/\//i.test(target)) continue;   // external link
          var route = target.charAt(0) === '/' ? target : '/' + target;
          route = route.replace(/\.md$/, '');
          if (seen[route]) continue;
          seen[route] = true;
          out.push({ route: route, title: label });
        }
        return out;
      })
      .catch(function () {
        // Fallback: read whatever the rendered sidebar is showing.
        var out = [];
        var seen = {};
        var links = document.querySelectorAll('.sidebar-nav a');
        for (var i = 0; i < links.length; i++) {
          var href = links[i].getAttribute('href') || '';
          var hash = href.indexOf('#');
          if (hash < 0) continue;
          var route = href.slice(hash + 1).split('?')[0];
          if (!route || seen[route]) continue;
          seen[route] = true;
          out.push({ route: route, title: links[i].textContent.trim() });
        }
        return out;
      });
  }

  /** Maps a Docsify route to the markdown file that backs it. */
  function routeToFile(route) {
    if (route === '/' || route === '') return 'README.md';
    return route.replace(/^\//, '') + '.md';
  }

  /** Runs tasks with bounded parallelism, so we do not fire 40 requests at once. */
  function runPool(tasks, limit, onEach) {
    return new Promise(function (resolve) {
      var next = 0;
      var active = 0;
      function step() {
        if (next >= tasks.length && active === 0) return resolve();
        while (active < limit && next < tasks.length) {
          var task = tasks[next++];
          active++;
          task().then(function () {
            active--;
            if (onEach) onEach();
            step();
          });
        }
      }
      step();
    });
  }

  /** Builds the index once, lazily. Safe to call repeatedly. */
  var buildPromise = null;
  function buildIndex(onProgress) {
    if (buildPromise) return buildPromise;
    indexState = 'building';
    buildPromise = loadFileList().then(function (files) {
      filesTotal = files.length;
      filesDone = 0;
      var tasks = files.map(function (file) {
        return function () {
          return fetch(resolveUrl(routeToFile(file.route)))
            .then(function (r) { return r.ok ? r.text() : null; })
            .then(function (text) {
              if (text) {
                var records = parseMarkdown(file.route, file.title, text);
                for (var i = 0; i < records.length; i++) index.push(records[i]);
              }
            })
            .catch(function () { /* a missing file simply is not indexed */ });
        };
      });
      return runPool(tasks, FETCH_CONCURRENCY, function () {
        filesDone++;
        if (onProgress) onProgress();
      });
    }).then(function () {
      indexState = 'ready';
      if (onProgress) onProgress();
    });
    return buildPromise;
  }

  /* ------------------------------------------------------------------ *
   * Fuzzy scoring
   * ------------------------------------------------------------------ */

  /* Scoring runs over the whole index on every keystroke, so the helpers below
     work on character codes rather than regexes or single-char strings. Inputs
     are already lowercase (see the `hl`/`fl`/`pl`/`sl` fields), so only a-z
     and 0-9 need testing. */
  function isWordCode(code) {
    return (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
  }

  /** Longer fields are slightly penalised so concise headings win ties. */
  function lengthPenalty(len) { return len < 144 ? len / 12 : 12; }

  /** Matches the initials of successive words. */
  function acronymScore(query, text) {
    var initials = '';
    var prevWord = false;
    for (var i = 0; i < text.length; i++) {
      var isWord = isWordCode(text.charCodeAt(i));
      if (isWord && !prevWord) initials += text.charAt(i);
      prevWord = isWord;
    }
    if (!initials) return 0;
    var at = initials.indexOf(query);
    if (at < 0) return 0;
    var score = S_ACRONYM - at * 2 - lengthPenalty(text.length);
    return score > 0 ? score : 0;
  }

  /**
   * Subsequence match with run/boundary bonuses and gap penalties.
   * This is the tier that makes `usefect` find `useEffect`.
   */
  function fuzzyScore(query, text) {
    var qlen = query.length;
    var tlen = text.length;
    var qi = 0, run = 0, bonus = 0, first = -1, last = -1, gaps = 0;
    var qc = query.charCodeAt(0);
    for (var si = 0; si < tlen; si++) {
      if (text.charCodeAt(si) === qc) {
        if (first < 0) first = si;
        last = si;
        run++;
        if (run > 1) bonus += run * 2;                                    // consecutive chars
        if (si === 0 || !isWordCode(text.charCodeAt(si - 1))) bonus += 6;  // word boundary
        qi++;
        if (qi === qlen) break;
        qc = query.charCodeAt(qi);
      } else {
        if (first >= 0) gaps++;
        run = 0;
      }
    }
    if (qi < qlen) return 0;                           // not every query char matched
    var density = qlen / (last - first + 1);           // tight matches beat scattered ones
    var score = S_FUZZY * density + bonus * 0.5 - gaps * 0.4 - lengthPenalty(tlen);
    return score > 0 ? score : 0;
  }

  /**
   * Best score for one query token against one field. Returns 0 for no match.
   * `lower` must already be lowercase - callers pass the cached hl/fl/pl/sl.
   */
  function scoreField(query, lower) {
    if (!lower) return 0;
    if (lower === query) return S_EQUAL;
    var at = lower.indexOf(query);
    if (at === 0) return S_PREFIX - lengthPenalty(lower.length);
    if (at > 0) {
      var boundary = !isWordCode(lower.charCodeAt(at - 1));
      return (boundary ? S_WORD : S_MID) - lengthPenalty(lower.length);
    }
    var acro = acronymScore(query, lower);
    if (acro > 0) return acro;
    return fuzzyScore(query, lower);
  }

  /**
   * Prose match. Substring only, deliberately: section bodies run to ~1500
   * chars and running the fuzzy subsequence scan over them would dominate the
   * per-keystroke cost. Headings keep full fuzzy matching; prose gives exact
   * recall, which is what the old plugin provided.
   */
  function scoreBody(query, body) {
    if (!body) return 0;
    var at = body.indexOf(query);
    if (at < 0) return 0;
    return (at === 0 || !isWordCode(body.charCodeAt(at - 1))) ? S_WORD : S_MID;
  }

  /**
   * Scores one record against all query tokens.
   * Every token must hit some field, otherwise the record is discarded.
   */
  function scoreRecord(tokens, fullQuery, record) {
    var total = 0;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      // Heading is by far the likeliest hit, so score it first and skip the
      // remaining fields once nothing else could beat it.
      var best = W_HEADING * scoreField(token, record.hl);
      if (best < W_FILE * S_EQUAL) {
        var f = W_FILE * scoreField(token, record.fl);
        if (f > best) best = f;
      }
      if (best < W_PARENT * S_EQUAL) {
        var p = W_PARENT * scoreField(token, record.pl);
        if (p > best) best = p;
      }
      if (best < W_BODY * S_WORD) {
        var b = W_BODY * scoreBody(token, record.bl);
        if (b > best) best = b;
      }
      if (best <= 0) return 0;   // AND semantics across tokens
      total += best;
    }

    // A file's own H1 is the "jump to this note" result. Float it above that
    // file's subsections, and float it hard when the query names the file.
    if (record.level === 1) {
      total += 15;
      if (record.fl.indexOf(fullQuery) === 0) total += 80;
    } else if (record.level === 2) {
      total += 4;
    }
    return total;
  }

  function search(query) {
    var trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    var tokens = trimmed.split(/\s+/);
    var scored = [];
    for (var i = 0; i < index.length; i++) {
      var score = scoreRecord(tokens, trimmed, index[i]);
      if (score > 0) scored.push({ record: index[i], score: score });
    }
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      if (a.record.level !== b.record.level) return a.record.level - b.record.level;
      return a.record.heading.length - b.record.heading.length;
    });
    var top = scored.slice(0, MAX_RESULTS);

    // Cluster same-file results together while keeping the best file first,
    // so grouping never demotes a strong match.
    var order = [];
    var buckets = {};
    for (var j = 0; j < top.length; j++) {
      var key = top[j].record.route;
      if (!buckets[key]) { buckets[key] = []; order.push(key); }
      buckets[key].push(top[j]);
    }
    var out = [];
    for (var k = 0; k < order.length; k++) out = out.concat(buckets[order[k]]);
    return out;
  }

  /* ------------------------------------------------------------------ *
   * Recently visited pages (sessionStorage - never the search index)
   * ------------------------------------------------------------------ */

  function readRecents() {
    try {
      var raw = window.sessionStorage.getItem(RECENT_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Object.prototype.toString.call(parsed) === '[object Array]' ? parsed : [];
    } catch (e) { return []; }
  }

  function recordRecent(route, title) {
    if (!route) return;
    try {
      var list = readRecents().filter(function (r) { return r.route !== route; });
      list.unshift({ route: route, title: title || route });
      window.sessionStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_LIMIT)));
    } catch (e) { /* private mode - recents are optional */ }
  }

  /* ---- "Continue where you left off" -----------------------------------
     Reads progress-tracker.js's localStorage schema directly rather than
     touching that module's state, so neither feature depends on the other
     being loaded. If the progress tracker is absent, nothing is found and the
     row simply does not render. */

  var PROGRESS_PREFIX = 'studyProgress:';

  function readProgress(route) {
    try {
      var raw = window.localStorage.getItem(PROGRESS_PREFIX + route);
      var parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === 'object' && !(parsed instanceof Array)) ? parsed : {};
    } catch (e) { return {}; }
  }

  /**
   * The first unchecked H2 on the most recently visited page that still has
   * unfinished sections. Needs the index, so it yields nothing until the
   * first build completes - at which point the palette re-renders anyway.
   */
  function findContinue() {
    if (!index.length) return null;
    var recents = readRecents();
    for (var i = 0; i < recents.length; i++) {
      var route = recents[i].route;
      var done = readProgress(route);
      var fileTitle = recents[i].title;
      for (var j = 0; j < index.length; j++) {
        var rec = index[j];
        if (rec.route !== route || rec.level !== 2) continue;
        if (rec.fileTitle) fileTitle = rec.fileTitle;
        if (!done[rec.anchor]) {
          return { route: route, fileTitle: fileTitle, heading: rec.heading, anchor: rec.anchor };
        }
      }
    }
    return null;   // everything visited is complete, or nothing tracked yet
  }

  /* ------------------------------------------------------------------ *
   * Palette UI
   * ------------------------------------------------------------------ */

  var els = null;
  var isOpen = false;
  var activeIndex = 0;
  var currentRows = [];      // rendered selectable rows
  var inertSaved = [];
  var lastFocused = null;
  var indexingTimer = null;
  var rerenderTimer = null;

  var SEARCH_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" aria-hidden="true" focusable="false">' +
    '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';

  function buildDom() {
    if (els) return els;

    var root = document.createElement('div');
    root.className = 'cp-root';
    root.id = 'cp-root';
    root.hidden = true;
    root.innerHTML =
      '<div class="cp-backdrop" data-cp-close></div>' +
      '<div class="cp-modal" role="dialog" aria-modal="true" aria-label="Search documentation">' +
        '<div class="cp-input-row">' +
          '<span class="cp-input-icon">' + SEARCH_ICON + '</span>' +
          '<input class="cp-input" id="cp-input" type="text" autocomplete="off" ' +
            'autocorrect="off" autocapitalize="off" spellcheck="false" ' +
            'placeholder="Search notes and sections…" role="combobox" ' +
            'aria-expanded="true" aria-controls="cp-list" aria-autocomplete="list" ' +
            'aria-label="Search documentation">' +
          '<button class="cp-close" type="button" data-cp-close aria-label="Close search">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" aria-hidden="true" focusable="false">' +
            '<path d="M18 6L6 18M6 6l12 12"/></svg>' +
          '</button>' +
        '</div>' +
        '<ul class="cp-list" id="cp-list" role="listbox" aria-label="Search results"></ul>' +
        '<div class="cp-footer">' +
          '<span class="cp-hints">' +
            '<kbd>↑</kbd><kbd>↓</kbd><span>navigate</span>' +
            '<kbd>↵</kbd><span>open</span>' +
            '<kbd>esc</kbd><span>close</span>' +
          '</span>' +
          '<span class="cp-status" id="cp-status" role="status" aria-live="polite"></span>' +
        '</div>' +
      '</div>';

    document.body.appendChild(root);

    els = {
      root: root,
      modal: root.querySelector('.cp-modal'),
      input: root.querySelector('.cp-input'),
      list: root.querySelector('.cp-list'),
      status: root.querySelector('.cp-status')
    };

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-cp-close]')) close();
    });

    els.input.addEventListener('input', function () { render(); });
    els.input.addEventListener('keydown', onInputKeydown);

    // Mouse hover adopts the keyboard highlight rather than competing with it.
    els.list.addEventListener('mousemove', function (e) {
      var row = e.target.closest('.cp-result');
      if (!row) return;
      var idx = currentRows.indexOf(row);
      if (idx >= 0 && idx !== activeIndex) setActive(idx, false);
    });

    els.list.addEventListener('click', function (e) {
      var row = e.target.closest('.cp-result');
      if (!row) return;
      var idx = currentRows.indexOf(row);
      if (idx >= 0) activate(idx);
    });

    return els;
  }

  function updateStatus() {
    if (!els) return;
    els.status.textContent = indexState === 'building'
      ? 'Indexing… ' + filesDone + '/' + (filesTotal || '…')
      : '';
  }

  function rowHtml(record, id) {
    /* Results are grouped under a file-title header, so repeating the file
       title in every row's crumb is pure noise - with six hits in one file it
       printed the same string six times, and for an H1 row it duplicated the
       row's own title. The visible crumb therefore carries only the parent
       H2, and the group header above supplies the file. The full path still
       reaches screen readers through aria-label. */
    var visibleCrumb = (record.parent && record.parent !== record.heading)
      ? record.parent
      : '';
    var fullPath = record.fileTitle + (visibleCrumb ? ' › ' + visibleCrumb : '');

    var crumb = visibleCrumb
      ? '<div class="cp-result-crumb">' + esc(visibleCrumb) + '</div>'
      : '';
    var snippet = record.snippet
      ? '<div class="cp-result-snippet">' + esc(record.snippet) + '</div>'
      : '';
    return (
      '<li class="cp-result" role="option" id="' + id + '" aria-selected="false" ' +
        'aria-label="' + esc(record.heading + ', in ' + fullPath) + '" ' +
        'data-route="' + esc(record.route) + '" data-anchor="' + esc(record.anchor) + '">' +
        '<div class="cp-result-main">' +
          '<span class="cp-result-title">' + esc(record.heading) + '</span>' +
          '<span class="cp-badge">H' + record.level + '</span>' +
        '</div>' +
        crumb +
        snippet +
      '</li>'
    );
  }

  function render() {
    if (!els) return;
    var query = els.input.value;
    var html = '';

    if (!query.trim()) {
      var recents = readRecents();
      var cont = findContinue();
      var idx = 0;

      if (cont) {
        html +=
          '<li class="cp-group" role="presentation">Continue</li>' +
          '<li class="cp-result cp-continue" role="option" id="cp-opt-' + idx + '" ' +
            'aria-selected="false" ' +
            'aria-label="' + esc('Continue ' + cont.fileTitle + ', next section ' + cont.heading) + '" ' +
            'data-route="' + esc(cont.route) + '" data-anchor="' + esc(cont.anchor) + '">' +
            '<div class="cp-result-main">' +
              '<span class="cp-continue-icon" aria-hidden="true">→</span>' +
              '<span class="cp-result-title">' + esc(cont.heading) + '</span>' +
            '</div>' +
            '<div class="cp-result-crumb">' + esc(cont.fileTitle) + '</div>' +
          '</li>';
        idx++;
      }

      if (recents.length) {
        html += '<li class="cp-group" role="presentation">Recent</li>';
        for (var r = 0; r < recents.length; r++, idx++) {
          html +=
            '<li class="cp-result" role="option" id="cp-opt-' + idx + '" aria-selected="false" ' +
              'data-route="' + esc(recents[r].route) + '" data-anchor="">' +
              '<div class="cp-result-main">' +
                '<span class="cp-result-title">' + esc(recents[r].title) + '</span>' +
              '</div>' +
            '</li>';
        }
      } else if (!cont) {
        html = '<li class="cp-empty" role="presentation">' +
          (index.length
            ? 'Type to search ' + index.length.toLocaleString() + ' sections.'
            : 'Type to search the notes.') +
          '</li>';
      }
    } else {
      var results = search(query);
      if (!results.length) {
        html = '<li class="cp-empty" role="presentation">' +
          (indexState === 'building'
            ? 'Still indexing… no matches yet for “' + esc(query.trim()) + '”'
            : 'No matches for “' + esc(query.trim()) + '”') +
          '</li>';
      } else {
        var lastRoute = null;
        for (var i = 0; i < results.length; i++) {
          var rec = results[i].record;
          if (rec.route !== lastRoute) {
            html += '<li class="cp-group" role="presentation">' + esc(rec.fileTitle) + '</li>';
            lastRoute = rec.route;
          }
          html += rowHtml(rec, 'cp-opt-' + i);
        }
      }
    }

    els.list.innerHTML = html;
    currentRows = Array.prototype.slice.call(els.list.querySelectorAll('.cp-result'));
    activeIndex = 0;
    if (currentRows.length) setActive(0, false);
    else els.input.removeAttribute('aria-activedescendant');
    updateStatus();
  }

  function setActive(idx, scroll) {
    if (!currentRows.length) return;
    if (idx < 0) idx = currentRows.length - 1;
    if (idx >= currentRows.length) idx = 0;
    if (currentRows[activeIndex]) {
      currentRows[activeIndex].classList.remove('is-active');
      currentRows[activeIndex].setAttribute('aria-selected', 'false');
    }
    activeIndex = idx;
    var row = currentRows[activeIndex];
    row.classList.add('is-active');
    row.setAttribute('aria-selected', 'true');
    els.input.setAttribute('aria-activedescendant', row.id);
    // `nearest` keeps the list from jumping when the row is already visible.
    if (scroll !== false) row.scrollIntoView({ block: 'nearest' });
  }

  function activate(idx) {
    var row = currentRows[idx];
    if (!row) return;
    var route = row.getAttribute('data-route');
    var anchor = row.getAttribute('data-anchor');
    close();
    window.location.hash = '#' + route + (anchor ? '?id=' + anchor : '');
  }

  function onInputKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(activeIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(activeIndex - 1);
    } else if (e.key === 'Home' && currentRows.length) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End' && currentRows.length) {
      e.preventDefault();
      setActive(currentRows.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(activeIndex);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  /* ---- focus trap + inert ---------------------------------------------- */

  /* Two components write `inert` to the same elements, so this needs care.
     custom.js runs a MutationObserver on body[class] whose sync() sets AND
     unconditionally clears `inert` on .sidebar/.content for the mobile
     drawer. Adding our own body class therefore causes it to wipe the inert
     we just applied, one microtask later - and Docsify itself toggles a
     `sticky` body class on scroll, so this can fire at any time.

     So we do two things: restore each element's PRIOR inert state on close
     (never blindly remove, or we would corrupt the drawer's desktop state),
     and keep a guard observer that re-asserts inert while the palette is
     open. The guard only acts when the attribute is missing, so it settles
     after one round instead of looping. */
  var INERT_TARGETS = [
    '.sidebar', '.content', '.sidebar-toggle', '.github-corner', '#cp-mobile-trigger'
  ];
  var inertGuard = null;

  function applyInert() {
    inertSaved = [];
    var targets = [];
    for (var i = 0; i < INERT_TARGETS.length; i++) {
      var el = document.querySelector(INERT_TARGETS[i]);
      if (!el) continue;
      inertSaved.push({ el: el, had: el.hasAttribute('inert') });
      el.setAttribute('inert', '');
      targets.push(el);
    }

    if (inertGuard) inertGuard.disconnect();
    inertGuard = new MutationObserver(function () {
      if (!isOpen) return;
      for (var j = 0; j < targets.length; j++) {
        if (!targets[j].hasAttribute('inert')) targets[j].setAttribute('inert', '');
      }
    });
    for (var k = 0; k < targets.length; k++) {
      inertGuard.observe(targets[k], { attributes: true, attributeFilter: ['inert'] });
    }
  }

  function restoreInert() {
    if (inertGuard) {
      inertGuard.disconnect();
      inertGuard = null;
    }
    for (var i = 0; i < inertSaved.length; i++) {
      if (!inertSaved[i].had) inertSaved[i].el.removeAttribute('inert');
    }
    inertSaved = [];
  }

  function onTrapKeydown(e) {
    if (e.key !== 'Tab' || !isOpen || !els) return;
    var focusable = els.modal.querySelectorAll('input, button');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---- open / close ---------------------------------------------------- */

  /** Re-runs the query, preserving the highlighted row where possible. */
  function refreshPreservingActive() {
    if (!isOpen) return;
    var keep = activeIndex;
    render();
    if (currentRows.length) setActive(Math.min(keep, currentRows.length - 1), false);
  }

  function open() {
    if (isOpen) return;
    buildDom();
    isOpen = true;
    lastFocused = document.activeElement;
    els.root.hidden = false;
    // Force a style flush so the CSS transition has a start state to animate
    // from. requestAnimationFrame would also work, but it is throttled in
    // background tabs and idle/headless environments - and if the callback
    // never runs, `.is-open` is never added and the modal sits at opacity 0
    // while still trapping focus. A reflow read is synchronous and cannot
    // fail that way.
    void els.root.offsetHeight;
    els.root.classList.add('is-open');
    applyInert();
    document.body.classList.add('cp-open');
    els.input.value = '';
    render();
    els.input.focus();

    // Kick off indexing on first open only.
    if (indexState === 'idle') {
      indexingTimer = window.setTimeout(updateStatus, INDEXING_NOTICE_MS);
      buildIndex(function () {
        updateStatus();
        // Re-run the query as files land, so typing is never blocked on the
        // full index. Throttled so a burst of completions is not a burst of
        // re-renders.
        if (isOpen && !rerenderTimer) {
          rerenderTimer = window.setTimeout(function () {
            rerenderTimer = null;
            refreshPreservingActive();
          }, RERENDER_MS);
        }
      }).then(function () {
        window.clearTimeout(indexingTimer);
        refreshPreservingActive();
      });
    }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    els.root.classList.remove('is-open');
    restoreInert();
    document.body.classList.remove('cp-open');
    window.clearTimeout(rerenderTimer);
    rerenderTimer = null;

    // Wait out the transition before hiding, unless motion is reduced.
    var reduce = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hide = function () { if (!isOpen) els.root.hidden = true; };
    if (reduce) hide();
    else window.setTimeout(hide, 150);

    if (lastFocused && typeof lastFocused.focus === 'function' && document.contains(lastFocused)) {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  function toggle() { if (isOpen) { close(); } else { open(); } }

  /* ------------------------------------------------------------------ *
   * Triggers: keyboard shortcuts and buttons
   * ------------------------------------------------------------------ */

  function initShortcuts() {
    document.addEventListener('keydown', function (e) {
      // Cmd/Ctrl+K from anywhere.
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
        return;
      }
      // `/` opens the palette, but not while the user is typing somewhere
      // else, and never with a modifier held (so Ctrl+/ etc. pass through).
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isOpen) {
        if (isTypingTarget(e.target)) return;
        e.preventDefault();   // suppress Firefox quick-find
        open();
        return;
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        close();
      }
    });

    // Capture phase so the trap sees Tab before anything else.
    document.addEventListener('keydown', onTrapKeydown, true);
  }

  /** Sidebar trigger, occupying the slot the old search box used to fill. */
  function initSidebarTrigger() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.querySelector('.cp-trigger')) return;
    var nav = sidebar.querySelector('.sidebar-nav');
    var isMac = /Mac|iPhone|iPad|iPod/i.test(window.navigator.platform || '');

    var wrap = document.createElement('div');
    wrap.className = 'cp-trigger-wrap';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cp-trigger';
    btn.setAttribute('aria-label', 'Search documentation');
    btn.innerHTML =
      '<span class="cp-trigger-icon">' + SEARCH_ICON + '</span>' +
      '<span class="cp-trigger-label">Search…</span>' +
      '<kbd class="cp-trigger-kbd">' + (isMac ? '⌘K' : 'Ctrl K') + '</kbd>';
    btn.addEventListener('click', open);
    wrap.appendChild(btn);

    if (nav) sidebar.insertBefore(wrap, nav);
    else sidebar.appendChild(wrap);
  }

  /** Fixed search button for mobile, opposite corner from the hamburger. */
  function initMobileTrigger() {
    if (document.getElementById('cp-mobile-trigger')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'cp-mobile-trigger';
    btn.className = 'cp-mobile-trigger';
    btn.setAttribute('aria-label', 'Search documentation');
    btn.innerHTML = SEARCH_ICON;
    btn.addEventListener('click', open);
    document.body.appendChild(btn);
  }

  /* ------------------------------------------------------------------ *
   * Docsify plugin registration
   * ------------------------------------------------------------------ */

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    hook.mounted(function () {
      buildDom();
      initShortcuts();
      initSidebarTrigger();
      initMobileTrigger();
    });

    hook.doneEach(function () {
      // The sidebar is re-rendered on navigation, so the trigger is re-added.
      initSidebarTrigger();

      var route = (vm && vm.route && vm.route.path) || '/';
      var h1 = document.querySelector('.markdown-section h1');
      var title = h1 ? h1.textContent.trim() : route;
      recordRecent(route, title);
    });
  });
})();
