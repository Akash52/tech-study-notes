/**
 * E-reader behaviours: the things Kindle and Apple Books do that a web page
 * does not do by itself.
 *
 * 1. RESUME. Reopening a note puts you back where you stopped, the way a
 *    reader reopens a book at your page. A browser only does this within one
 *    session; a reload or a new visit started the 2,800-line SQL guide from
 *    the top. Positions are stored per note as "heading + distance past it"
 *    rather than a raw scroll offset, so they survive a font or width change
 *    that reflows the page. An explicit `?id=` link always wins.
 *
 * 2. TIME LEFT. "12 min left in this note", from the words still below the
 *    reading line - Kindle's "time left in chapter".
 *
 * 3. THE SIDEBAR FOLLOWS YOU. The sidebar is the table of contents; Docsify
 *    marks the current heading there but never scrolls it into view, so on a
 *    long note the highlighted entry was usually off-screen.
 *
 * 4. ARROW KEYS TURN THE "PAGE": Left/Right go to the previous/next note, as
 *    in every e-reader. Ignored while typing, with modifiers, while the
 *    search palette is open, or when focus is in something that scrolls
 *    sideways (a code block or wide table), where the arrows already mean
 *    "scroll".
 */
(function () {
  'use strict';

  var STORE = 'tsn.positions';
  var MAX_NOTES = 60;          // oldest positions are dropped beyond this
  var WPM = 230;               // typical adult reading speed for technical prose
  var READ_LINE = 120;         // px from the top treated as "where I am reading"
  var TOP_MARGIN = (window.$docsify && window.$docsify.topMargin) || 72;   // index.html

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function writeStore(all) {
    try { localStorage.setItem(STORE, JSON.stringify(all)); } catch (e) { /* private mode */ }
  }

  function route() { return location.hash.replace(/^#\/?/, '').split('?')[0]; }
  function hasAnchor() { return /[?&]id=/.test(location.hash); }
  function section() { return document.querySelector('.markdown-section'); }
  function headings() {
    var s = section();
    return s ? Array.prototype.slice.call(s.querySelectorAll('h1[id], h2[id], h3[id]')) : [];
  }
  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ------------------------------------------------------------------ *
   * 1. Resume
   * ------------------------------------------------------------------ */

  var restoring = false;       // don't save the position we are restoring to

  /** The last heading above the reading line, and how far past it we are. */
  function currentPlace() {
    var hs = headings(), best = null;
    for (var i = 0; i < hs.length; i++) {
      var top = hs[i].getBoundingClientRect().top;
      if (top <= READ_LINE) best = { id: hs[i].id, past: READ_LINE - top, text: hs[i].textContent.trim() };
      else break;
    }
    return best;
  }

  var saveTimer = 0;
  function savePosition() {
    if (restoring) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      var r = route(), place = currentPlace(), all = readStore();
      // Near the top there is nothing worth resuming to.
      if (!place || window.scrollY < 400) delete all[r];
      else all[r] = { id: place.id, past: Math.round(place.past), text: place.text.slice(0, 80), t: Date.now() };
      var keys = Object.keys(all);
      if (keys.length > MAX_NOTES) {
        keys.sort(function (a, b) { return all[a].t - all[b].t; });
        keys.slice(0, keys.length - MAX_NOTES).forEach(function (k) { delete all[k]; });
      }
      writeStore(all);
    }, 400);
  }

  function scrollToPlace(p) {
    var h = document.getElementById(p.id);
    if (!h) return false;
    var y = h.getBoundingClientRect().top + window.scrollY - READ_LINE + p.past;
    window.scrollTo(0, Math.max(0, y));
    return true;
  }

  var toast = null, toastTimer = 0;
  function showToast(p) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'reader-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
      toast.addEventListener('click', function (e) {
        if (!e.target.closest('.reader-toast-top')) return;
        window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
        hideToast();
      });
    }
    toast.innerHTML = '<span>Resumed at <strong></strong></span>' +
      '<button type="button" class="reader-toast-top">Start from the top</button>';
    toast.querySelector('strong').textContent = p.text;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 6000);
  }
  function hideToast() { if (toast) toast.classList.remove('is-on'); }

  /* A shared link to a section (`?id=`) opened ~300px off: Docsify scrolls to
     the heading straight away, then late fonts, syntax highlighting and table
     wrapping push it down. Re-settle once they are done - unless the reader
     has started scrolling, in which case their position wins. */
  var userMoved = false;
  ['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(function (ev) {
    window.addEventListener(ev, function () { userMoved = true; }, { passive: true });
  });

  function settleAnchor() {
    var m = location.hash.match(/[?&]id=([^&]+)/);
    if (!m) return;
    var h = document.getElementById(decodeURIComponent(m[1]));
    if (!h) return;
    userMoved = false;
    var place = function () {
      if (userMoved) return;
      var y = h.getBoundingClientRect().top + window.scrollY - TOP_MARGIN;
      if (Math.abs(h.getBoundingClientRect().top - TOP_MARGIN) > 4) window.scrollTo(0, Math.max(0, y));
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(place, 60); });
    setTimeout(place, 700);
  }

  function resume() {
    if (hasAnchor()) { settleAnchor(); return; }   // an explicit link wins
    var p = readStore()[route()];
    if (!p) return;
    restoring = true;
    // Late fonts and syntax highlighting move headings, so place twice: now,
    // and again once fonts have settled.
    var ok = scrollToPlace(p);
    var settle = function () { scrollToPlace(p); restoring = false; };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(settle, 60); });
    else setTimeout(settle, 300);
    if (ok) showToast(p);
  }

  /* ------------------------------------------------------------------ *
   * 2. Time left
   * ------------------------------------------------------------------ */

  var chip = null, blocks = [], totalWords = 0;

  function countWords(el) {
    var t = el.textContent;
    var m = t.match(/\S+/g);
    return m ? m.length : 0;
  }

  function indexWords() {
    var s = section();
    blocks = [];
    totalWords = 0;
    if (!s) return;
    Array.prototype.forEach.call(s.children, function (el) {
      var w = countWords(el);
      if (!w) return;
      // Code is scanned, not read word by word.
      if (el.tagName === 'PRE') w = Math.round(w * 0.5);
      blocks.push({ el: el, words: w });
      totalWords += w;
    });
  }

  function updateChip() {
    if (!chip) return;
    if (totalWords < WPM * 3) { chip.hidden = true; return; }   // short notes need no estimate
    var left = 0;
    for (var i = 0; i < blocks.length; i++) {
      var r = blocks[i].el.getBoundingClientRect();
      if (r.bottom <= READ_LINE) continue;
      if (r.top >= READ_LINE) { left += blocks[i].words; continue; }
      left += blocks[i].words * (r.bottom - READ_LINE) / Math.max(1, r.height);
    }
    var min = Math.ceil(left / WPM);
    chip.hidden = false;
    chip.textContent = min <= 0 ? 'End of note' : min + ' min left in this note';
  }

  function initChip() {
    if (!chip) {
      chip = document.createElement('div');
      chip.className = 'reader-time';
      chip.setAttribute('aria-hidden', 'true');   // visual aid; the page itself is the content
      document.body.appendChild(chip);
    }
    indexWords();
    updateChip();
  }

  /* ------------------------------------------------------------------ *
   * 3. Keep the current section visible in the sidebar
   * ------------------------------------------------------------------ */

  function followInSidebar() {
    var nav = document.querySelector('.sidebar-nav');
    if (!nav) return;
    var active = nav.querySelector('.app-sub-sidebar li.active > a, .app-sub-sidebar a.active');
    if (!active) return;
    var n = nav.getBoundingClientRect(), a = active.getBoundingClientRect();
    var pad = 48;
    // Scroll the sidebar only - scrollIntoView would move the page as well.
    if (a.top < n.top + pad) nav.scrollTop -= (n.top + pad - a.top);
    else if (a.bottom > n.bottom - pad) nav.scrollTop += (a.bottom - (n.bottom - pad));
  }

  /* ------------------------------------------------------------------ *
   * 4. Arrow keys
   * ------------------------------------------------------------------ */

  function scrollsSideways(el) {
    for (; el && el !== document.body; el = el.parentElement) {
      if (el.scrollWidth > el.clientWidth + 1) {
        var ox = getComputedStyle(el).overflowX;
        if (ox === 'auto' || ox === 'scroll') return true;
      }
    }
    return false;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (document.body.classList.contains('cp-open')) return;     // search palette
    if (document.querySelector('.layout-panel:not([hidden]), .theme-menu:not([hidden])')) return;
    if (scrollsSideways(t)) return;
    var which = e.key === 'ArrowLeft' ? '.pagination-item--previous a' : '.pagination-item--next a';
    var link = document.querySelector(which);
    if (link) { e.preventDefault(); link.click(); }
  });

  /* ------------------------------------------------------------------ */

  var ticking = false;
  window.addEventListener('scroll', function () {
    savePosition();
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      updateChip();
      followInSidebar();
    });
  }, { passive: true });
  window.addEventListener('resize', function () { updateChip(); }, { passive: true });

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.doneEach(function () {
      hideToast();
      initChip();
      // After Docsify's own scroll-to-top / scroll-to-anchor has run.
      setTimeout(function () { resume(); followInSidebar(); updateChip(); }, 0);
    });
  });
})();
