(function () {
  function initMobileDrawerA11y() {
    // NOTE: .sidebar-toggle is a child of <main>, sibling to .content - so the
    // inert target must be .content specifically, not <main> itself, or the
    // toggle button becomes unclickable while the drawer is open.
    var main = document.querySelector('.content');
    var sidebar = document.querySelector('.sidebar');
    if (!main || !sidebar) return;

    function sync() {
      // Focus mode (layout.css) turns the desktop sidebar into a drawer too.
      var isDrawer = window.innerWidth <= 768 ||
        document.documentElement.getAttribute('data-focus') === 'on';
      var isOpen = document.body.classList.contains('close');
      // As a drawer (mobile, or focus mode), body.close means OPEN.
      // Otherwise body.close means the sidebar is CLOSED (off-canvas).
      var sidebarHidden = isDrawer ? !isOpen : isOpen;
      var contentObscured = isDrawer && isOpen;

      if (sidebarHidden) sidebar.setAttribute('inert', '');
      else sidebar.removeAttribute('inert');

      if (contentObscured) main.setAttribute('inert', '');
      else main.removeAttribute('inert');

      // The toggle renders as a hamburger or an X depending on state, so its
      // accessible name has to follow.
      var toggle = document.querySelector('.sidebar-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', sidebarHidden ? 'false' : 'true');
        toggle.setAttribute('aria-label', sidebarHidden ? 'Open navigation' : 'Close navigation');
      }
    }

    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  }

  function initProgressBar() {
    if (document.getElementById('reading-progress')) return;

    var bar = document.createElement('div');
    bar.id = 'reading-progress';
    var fill = document.createElement('div');
    bar.appendChild(fill);
    document.body.appendChild(bar);

    function update() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var progress = scrollable <= 0 ? 0 : window.scrollY / scrollable;
      fill.style.width = (Math.min(1, Math.max(0, progress)) * 100) + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Tables. Two problems with the bare <table> Docsify emits:
     - A wide table cannot scroll on its own, so on a phone it pushes the whole
       page sideways. Each one is wrapped in a scroll container instead.
     - Auto table layout squeezes columns down to their longest word, so short
       labels broke mid-value ("Weeks 1–" / "4", "3." / "Performance") while a
       prose column took the room. Short cells are marked to stay on one line,
       and long ones get a floor width so they do not become a tall thin strip. */
  var SHORT_CELL = 18;
  var LONG_CELL = 60;

  function initTables() {
    var tables = document.querySelectorAll('.markdown-section table');
    Array.prototype.forEach.call(tables, function (table) {
      if (table.parentNode.classList.contains('table-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      // Focusable so keyboard users can scroll an overflowing table.
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('aria-label', 'Table');
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);

      Array.prototype.forEach.call(table.querySelectorAll('td'), function (td) {
        var len = td.textContent.trim().length;
        if (len <= SHORT_CELL) td.classList.add('cell-short');
        else if (len >= LONG_CELL) td.classList.add('cell-long');
      });
    });
  }

  /* In-page links. Hand-written tables of contents use GitHub's heading slugs,
     which Docsify does not generate: "1. Introduction & Philosophy" is
     `1-introduction--philosophy` on GitHub but `_1-introduction-amp-philosophy`
     here, so 37 contents links scrolled nowhere. Rather than rewrite the
     sources (and break them on GitHub), links whose target is missing are
     pointed at the heading whose slug matches once both are normalised. */
  function slugKey(id) {
    return decodeURIComponent(id).toLowerCase()
      .replace(/^_+/, '')
      .replace(/(^|-)amp(-|$)/g, '-')
      .replace(/[^a-z0-9]+/g, '');
  }

  /* Links between notes. Sources use "./other-note.md" and "../folder/note.md",
     which is correct on GitHub, but Docsify resolves them from the site root
     ("#/./other-note") and they 404. Docsify's `relativePath` option fixes those
     but breaks every sidebar link, so they are resolved here against the
     current note's folder instead. */
  function fixRelativeLinks(section) {
    var dir = location.hash.replace(/^#\//, '').split('?')[0].split('/').slice(0, -1);
    Array.prototype.forEach.call(section.querySelectorAll('a[href^="#/./"], a[href^="#/../"]'), function (a) {
      var parts = dir.slice();
      a.getAttribute('href').slice(2).split('/').forEach(function (seg) {
        if (seg === '..') parts.pop();
        else if (seg !== '.') parts.push(seg);
      });
      a.setAttribute('href', '#/' + parts.join('/'));
    });
  }

  function fixAnchorLinks() {
    var section = document.querySelector('.markdown-section');
    if (!section) return;
    fixRelativeLinks(section);
    var byKey = {};
    Array.prototype.forEach.call(section.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]'), function (h) {
      var k = slugKey(h.id);
      if (!(k in byKey)) byKey[k] = h.id;
    });
    var route = location.hash.split('?')[0];
    Array.prototype.forEach.call(section.querySelectorAll('a[href*="?id="]'), function (a) {
      var parts = a.getAttribute('href').split('?id=');
      if (parts[0] !== route) return;
      if (document.getElementById(decodeURIComponent(parts[1]))) return;
      var match = byKey[slugKey(parts[1])];
      if (match) a.setAttribute('href', parts[0] + '?id=' + encodeURIComponent(match));
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.mounted(function () {
      initProgressBar();
      initMobileDrawerA11y();
    });
    hook.doneEach(function () {
      initTables();
      fixAnchorLinks();
    });
  });
})();
