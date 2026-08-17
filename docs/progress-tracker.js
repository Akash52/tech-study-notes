/**
 * Study progress tracking for the Tech Study Notes portal.
 *
 * Adds a completion checkbox beside every H2, progress rings in the sidebar,
 * and per-page bulk controls. Everything persists in localStorage; there is no
 * backend and no build step.
 *
 * Design notes worth knowing before editing:
 *
 * 1. H2 IS THE UNIT. H3s are sub-points inside an H2's topic, so only H2s get
 *    a checkbox. Slugs come straight from the rendered `h2.id`, which Docsify
 *    has already computed - no slugify call is needed here, and using the live
 *    id means anchors and progress keys can never drift apart.
 *
 * 2. TOTALS ARE LEARNED, NOT SCANNED. A ring needs "done / total", but knowing
 *    the total for a page means knowing its H2 count, and scanning all 38 files
 *    on load would undo the lazy-index work done for search. Instead each page
 *    records its own H2 count into `studyProgressMeta` when it renders. Pages
 *    you have never opened simply show an empty ring.
 *
 *    Category counters sidestep the problem entirely: they count *notes*
 *    completed out of notes listed in the sidebar, both of which are known
 *    without fetching anything.
 *
 * 3. INDEPENDENT OF SEARCH. This file shares no state with command-palette.js.
 *    The palette's "Continue where you left off" row reads localStorage on its
 *    own rather than reaching in here.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Storage
   * ------------------------------------------------------------------ */

  var STORE_PREFIX = 'studyProgress:';   // studyProgress:{route} -> { slug: true }
  var META_KEY = 'studyProgressMeta';    // { route: h2Count }
  var RING_C = 50.27;                    // circumference of an r=8 circle

  function readPage(route) {
    try {
      var raw = window.localStorage.getItem(STORE_PREFIX + route);
      var parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === 'object' && !(parsed instanceof Array)) ? parsed : {};
    } catch (e) { return {}; }
  }

  function writePage(route, data) {
    try {
      var keys = Object.keys(data);
      if (!keys.length) window.localStorage.removeItem(STORE_PREFIX + route);
      else window.localStorage.setItem(STORE_PREFIX + route, JSON.stringify(data));
    } catch (e) { /* quota or private mode - progress is best-effort */ }
  }

  function readMeta() {
    try {
      var raw = window.localStorage.getItem(META_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === 'object' && !(parsed instanceof Array)) ? parsed : {};
    } catch (e) { return {}; }
  }

  function writeMeta(meta) {
    try { window.localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch (e) {}
  }

  function countDone(data) {
    var n = 0;
    for (var k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k) && data[k]) n++;
    }
    return n;
  }

  /* ------------------------------------------------------------------ *
   * In-memory cache
   *
   * Built once from localStorage and mutated on toggle, so navigating between
   * pages never re-reads every key.
   * ------------------------------------------------------------------ */

  var cache = null;   // { route: { done: n, total: n } }

  function buildCache() {
    cache = {};
    var meta = readMeta();
    try {
      for (var i = 0; i < window.localStorage.length; i++) {
        var key = window.localStorage.key(i);
        if (!key || key.indexOf(STORE_PREFIX) !== 0) continue;
        var route = key.slice(STORE_PREFIX.length);
        cache[route] = { done: countDone(readPage(route)), total: meta[route] || 0 };
      }
    } catch (e) { /* localStorage unavailable */ }
    // Pages with a known H2 count but nothing checked yet still need an entry.
    for (var r in meta) {
      if (!Object.prototype.hasOwnProperty.call(meta, r)) continue;
      if (!cache[r]) cache[r] = { done: 0, total: meta[r] };
      else cache[r].total = meta[r];
    }
  }

  function entryFor(route) {
    if (!cache) buildCache();
    return cache[route] || { done: 0, total: 0 };
  }

  function setTotal(route, total) {
    if (!cache) buildCache();
    var meta = readMeta();
    if (meta[route] !== total) {
      meta[route] = total;
      writeMeta(meta);
    }
    if (!cache[route]) cache[route] = { done: countDone(readPage(route)), total: total };
    else cache[route].total = total;
  }

  function setDone(route, done) {
    if (!cache) buildCache();
    if (!cache[route]) cache[route] = { done: done, total: 0 };
    else cache[route].done = done;
  }

  /* ------------------------------------------------------------------ *
   * Checkboxes beside each H2
   * ------------------------------------------------------------------ */

  var currentRoute = '/';

  /* The index page is a table of contents, not study material. Offering
     "0 / 6 sections complete - Mark all complete" for a list of links reads as
     a bug, so the index is excluded from tracking entirely: no checkboxes, no
     bulk bar, no ring, and it is not counted among the notes. */
  function isIndex(route) { return route === '/' || route === ''; }

  function injectCheckboxes(route) {
    if (isIndex(route)) return 0;
    var section = document.querySelector('.markdown-section');
    if (!section) return 0;
    var headings = section.querySelectorAll('h2');
    var state = readPage(route);
    var count = 0;

    Array.prototype.forEach.call(headings, function (h2) {
      count++;
      if (h2.querySelector('.pt-check-wrap')) return;   // already injected
      var slug = h2.id;
      if (!slug) return;

      // Read the text before inserting anything, so the label never leaks in.
      var text = h2.textContent.trim();

      var label = document.createElement('label');
      label.className = 'pt-check-wrap';

      var input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'pt-check';
      input.checked = !!state[slug];
      input.setAttribute('aria-label', 'Mark “' + text + '” as complete');

      label.appendChild(input);
      // Inserted as the FIRST child, ahead of Docsify's .anchor link, so a
      // click on the box never triggers the heading's anchor navigation.
      h2.insertBefore(label, h2.firstChild);
      h2.classList.add('pt-h2');
      if (input.checked) h2.classList.add('pt-done');

      input.addEventListener('change', function () {
        toggleSection(route, slug, input.checked, h2);
      });
    });

    return count;
  }

  function toggleSection(route, slug, checked, h2) {
    var state = readPage(route);
    if (checked) state[slug] = true;
    else delete state[slug];
    writePage(route, state);

    if (h2) h2.classList.toggle('pt-done', checked);
    setDone(route, countDone(state));
    refreshSidebar();
    refreshBulkCount(route);
  }

  /* ------------------------------------------------------------------ *
   * Bulk controls
   * ------------------------------------------------------------------ */

  function injectBulkControls(route, total) {
    if (isIndex(route)) return;
    var section = document.querySelector('.markdown-section');
    if (!section || !total) return;
    if (section.querySelector('.pt-bulk')) return;

    var bar = document.createElement('div');
    bar.className = 'pt-bulk';
    bar.innerHTML =
      '<span class="pt-bulk-count" data-pt-count></span>' +
      '<span class="pt-bulk-actions">' +
        '<button type="button" class="pt-bulk-btn" data-pt-act="all">Mark all complete</button>' +
        '<span class="pt-bulk-sep" aria-hidden="true">·</span>' +
        '<button type="button" class="pt-bulk-btn" data-pt-act="reset">Reset progress</button>' +
      '</span>';

    // Sits below the H1 and above the first H2.
    var h1 = section.querySelector('h1');
    if (h1 && h1.nextSibling) section.insertBefore(bar, h1.nextSibling);
    else if (h1) section.appendChild(bar);
    else section.insertBefore(bar, section.firstChild);

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-pt-act]');
      if (!btn) return;
      setAll(route, btn.getAttribute('data-pt-act') === 'all');
    });

    refreshBulkCount(route);
  }

  function setAll(route, done) {
    var section = document.querySelector('.markdown-section');
    if (!section) return;
    var state = {};
    Array.prototype.forEach.call(section.querySelectorAll('h2'), function (h2) {
      var box = h2.querySelector('.pt-check');
      if (!box) return;
      box.checked = done;
      h2.classList.toggle('pt-done', done);
      if (done && h2.id) state[h2.id] = true;
    });
    writePage(route, state);
    setDone(route, countDone(state));
    refreshSidebar();
    refreshBulkCount(route);
  }

  function refreshBulkCount(route) {
    var el = document.querySelector('.pt-bulk [data-pt-count]');
    if (!el) return;
    var e = entryFor(route);
    el.textContent = e.total
      ? e.done + ' / ' + e.total + ' sections complete'
      : '';
  }

  /* ------------------------------------------------------------------ *
   * Sidebar rings
   * ------------------------------------------------------------------ */

  function ringMarkup(done, total) {
    var complete = total > 0 && done >= total;
    var frac = total > 0 ? Math.min(1, done / total) : 0;
    var offset = (RING_C * (1 - frac)).toFixed(2);
    var cls = 'pt-ring' + (complete ? ' is-complete' : '') + (done > 0 ? ' has-progress' : '');
    var label = total
      ? (complete ? 'All ' + total + ' sections complete' : done + ' of ' + total + ' sections complete')
      : 'Not started';

    return '<span class="pt-ring-wrap" role="img" aria-label="' + label + '">' +
      '<svg class="' + cls + '" viewBox="0 0 20 20" focusable="false" aria-hidden="true">' +
        '<circle class="pt-ring-track" cx="10" cy="10" r="8"/>' +
        '<circle class="pt-ring-fill" cx="10" cy="10" r="8" ' +
          'stroke-dasharray="' + RING_C + '" stroke-dashoffset="' + offset + '"/>' +
        (complete ? '<path class="pt-ring-check" d="M6.4 10.1l2.4 2.4 4.8-5"/>' : '') +
      '</svg></span>';
  }

  /** Turns a sidebar href into the route key used by storage. */
  function hrefToRoute(href) {
    if (!href) return null;
    var hash = href.indexOf('#');
    if (hash < 0) return null;
    var route = href.slice(hash + 1).split('?')[0];
    return route || null;
  }

  function refreshSidebar() {
    var nav = document.querySelector('.sidebar-nav');
    if (!nav) return;

    // --- per-page rings ---
    // `.section-link` items are the current page's H2/H3 sub-nav, not pages.
    var links = nav.querySelectorAll('a:not(.section-link)');
    var completeByCategory = [];

    Array.prototype.forEach.call(links, function (a) {
      if (a.closest('.app-sub-sidebar')) return;
      var route = hrefToRoute(a.getAttribute('href'));
      if (!route || isIndex(route)) return;

      var e = entryFor(route);
      var existing = a.querySelector('.pt-ring-wrap');
      if (existing) existing.remove();
      a.classList.add('pt-has-ring');
      a.insertAdjacentHTML('beforeend', ringMarkup(e.done, e.total));
    });

    // --- per-category counters ---
    Array.prototype.forEach.call(nav.querySelectorAll('strong'), function (strong) {
      var li = strong.closest('li');
      if (!li) return;
      var pages = li.querySelectorAll('a:not(.section-link)');
      var total = 0, done = 0;
      Array.prototype.forEach.call(pages, function (a) {
        if (a.closest('.app-sub-sidebar')) return;
        var route = hrefToRoute(a.getAttribute('href'));
        if (!route || isIndex(route)) return;
        total++;
        var e = entryFor(route);
        if (e.total > 0 && e.done >= e.total) done++;
      });
      if (!total) return;

      var old = strong.querySelector('.pt-cat-count');
      if (old) old.remove();
      strong.classList.add('pt-has-count');
      var span = document.createElement('span');
      span.className = 'pt-cat-count' + (done >= total ? ' is-complete' : '');
      span.textContent = done + '/' + total;
      span.setAttribute('aria-label', done + ' of ' + total + ' notes complete');
      strong.appendChild(span);
      completeByCategory.push([done, total]);
    });

    refreshOverall(nav);
  }

  /** One compact line under the search trigger: "N / 38 notes complete". */
  function refreshOverall(nav) {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    var total = 0, done = 0;
    var seen = {};
    Array.prototype.forEach.call(nav.querySelectorAll('a:not(.section-link)'), function (a) {
      if (a.closest('.app-sub-sidebar')) return;
      var route = hrefToRoute(a.getAttribute('href'));
      if (!route || isIndex(route) || seen[route]) return;
      seen[route] = true;
      total++;
      var e = entryFor(route);
      if (e.total > 0 && e.done >= e.total) done++;
    });
    if (!total) return;

    var el = sidebar.querySelector('.pt-overall');
    if (!el) {
      el = document.createElement('div');
      el.className = 'pt-overall';
      var anchorEl = sidebar.querySelector('.cp-trigger-wrap');
      if (anchorEl && anchorEl.nextSibling) sidebar.insertBefore(el, anchorEl.nextSibling);
      else sidebar.insertBefore(el, nav);
    }
    el.textContent = done + ' / ' + total + ' notes complete';
    el.classList.toggle('is-complete', done >= total);
  }

  /* ------------------------------------------------------------------ *
   * Docsify plugin registration
   * ------------------------------------------------------------------ */

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    hook.doneEach(function () {
      currentRoute = (vm && vm.route && vm.route.path) || '/';
      if (!cache) buildCache();

      var total = injectCheckboxes(currentRoute);
      if (total) setTotal(currentRoute, total);
      injectBulkControls(currentRoute, total);
      refreshSidebar();
    });
  });
})();
