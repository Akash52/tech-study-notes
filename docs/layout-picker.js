/**
 * Reading-layout panel.
 *
 * All layout data, persistence and pre-paint application live in layouts.js;
 * this file only renders the "Aa" control beside the theme picker and talks to
 * that API, so adding a preset never requires touching this file.
 *
 * Notes:
 *
 * 1. Every control is a native radio group (presets, font, size, spacing,
 *    width) or checkbox (focus), visually restyled. Arrow keys, Space, and the
 *    screen-reader announcements therefore behave exactly as the platform
 *    does, with no roving-tabindex code to get wrong.
 *
 * 2. Presets and the fine-tuning rows are one model. Choosing a preset sets
 *    the rows; changing a row leaves no preset checked, which reads as a
 *    custom layout. The preset thumbnails are drawn from the preset's own
 *    values rather than hand-made, so they cannot drift out of date.
 *
 * 3. Built in `doneEach` after theme-picker.js, whose footer slot it joins,
 *    and the build is idempotent because Docsify re-renders the sidebar.
 */
(function () {
  'use strict';

  var API = window.TSNLayouts;
  if (!API) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function byId(axis, id) {
    var list = API.axes[axis];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  }

  /* ------------------------------------------------------------------ *
   * Thumbnails
   * ------------------------------------------------------------------ */

  var COL = { narrow: 0.5, standard: 0.66, wide: 0.86, full: 1 };
  var GAP = { compact: 3, normal: 3.7, relaxed: 4.6 };
  var INK = { s: 1.2, m: 1.5, l: 1.8, xl: 2.2 };

  /** A 34x24 sketch of the page: sidebar (unless focus), column width, line rhythm. */
  function preview(p) {
    var left = p.focus ? 3 : 10;
    var avail = 34 - left - 3;
    var w = avail * COL[p.width];
    var x = left + (avail - w) / 2;
    var gap = GAP[p.spacing], ink = INK[p.size];
    var svg = '<svg class="lp-preview" viewBox="0 0 34 24" aria-hidden="true">';
    if (!p.focus) svg += '<rect x="0" y="0" width="7" height="24" fill="currentColor" opacity="0.18"/>';
    for (var y = 4, n = 0; y < 21; y += gap, n++) {
      var lw = n % 3 === 2 ? w * 0.7 : w;      // ragged last line of each "paragraph"
      svg += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + lw.toFixed(1) +
        '" height="' + ink + '" rx="0.6" fill="currentColor"' +
        (p.font === 'serif' ? ' opacity="0.85"' : '') + '/>';
    }
    return svg + '</svg>';
  }

  var LINES = {
    compact: '<svg viewBox="0 0 18 14" aria-hidden="true"><path d="M2 3h14M2 6h14M2 9h14M2 12h9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    normal: '<svg viewBox="0 0 18 14" aria-hidden="true"><path d="M2 2.5h14M2 7h14M2 11.5h9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    relaxed: '<svg viewBox="0 0 18 14" aria-hidden="true"><path d="M2 2h14M2 12h9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M2 7h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
  };
  var WIDTHS = {
    narrow: '<svg viewBox="0 0 18 14" aria-hidden="true"><rect x="1" y="1" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/><path d="M6.5 5h5M6.5 9h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    standard: '<svg viewBox="0 0 18 14" aria-hidden="true"><rect x="1" y="1" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/><path d="M4.5 5h9M4.5 9h9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    wide: '<svg viewBox="0 0 18 14" aria-hidden="true"><rect x="1" y="1" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/><path d="M3 5h12M3 9h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    full: '<svg viewBox="0 0 18 14" aria-hidden="true"><rect x="1" y="1" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/><path d="M1 7h16M3.5 5L1 7l2.5 2M14.5 5L17 7l-2.5 2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var FONT_FACE = {
    sans: "'Inter', sans-serif",
    serif: "'Literata', Georgia, serif",
    mono: "'JetBrains Mono', monospace",
    legible: "'Atkinson Hyperlegible', sans-serif"
  };
  var SIZE_GLYPH = { s: 11, m: 13, l: 15.5, xl: 18 };

  /* ------------------------------------------------------------------ *
   * Markup
   * ------------------------------------------------------------------ */

  function segment(axis, label, ids, cell) {
    var html = '<fieldset class="lp-row"><legend>' + esc(label) + '</legend><div class="lp-seg">';
    ids.forEach(function (id) {
      var v = byId(axis, id);
      html += '<label title="' + esc(v.blurb || v.name) + '">' +
        '<input type="radio" name="lp-' + axis + '" value="' + esc(id) + '" data-axis="' + axis + '">' +
        cell(v) + '</label>';
    });
    return html + '</div></fieldset>';
  }

  function panelHtml() {
    var html =
      '<div class="lp-head"><span class="lp-title" id="lp-title">Reading layout</span>' +
      '<button type="button" class="lp-reset">Reset</button></div>' +
      '<fieldset class="lp-presets" aria-label="Presets">';
    API.presets.forEach(function (p) {
      html += '<label class="lp-preset">' +
        '<input type="radio" name="lp-preset" value="' + esc(p.id) + '">' +
        preview(p) +
        '<span class="lp-preset-text"><span class="lp-preset-name">' + esc(p.name) + '</span>' +
        '<span class="lp-preset-blurb">' + esc(p.blurb) + '</span></span></label>';
    });
    html += '</fieldset>';

    html += segment('font', 'Font', API.axes.font.map(function (f) { return f.id; }), function (v) {
      return '<span class="lp-glyph" style="font-family:' + FONT_FACE[v.id] + '">Aa</span>' +
        '<span class="lp-cap">' + esc(v.name) + '</span>';
    });
    html += segment('size', 'Text size', API.order.size, function (v) {
      return '<span class="lp-glyph" style="font-size:' + SIZE_GLYPH[v.id] + 'px">A</span>' +
        '<span class="lp-cap">' + esc(v.name) + '</span>';
    });
    html += segment('spacing', 'Line spacing', API.order.spacing, function (v) {
      return LINES[v.id] + '<span class="lp-cap">' + esc(v.name) + '</span>';
    });
    html += segment('width', 'Column width', API.order.width, function (v) {
      return WIDTHS[v.id] + '<span class="lp-cap">' + esc(v.name) + '</span>';
    });

    html += '<label class="lp-switch"><input type="checkbox" role="switch" data-axis="focus">' +
      '<span class="lp-switch-text">Focus mode' +
      '<small>Hides the sidebar. The &#9776; button brings it back.</small></span>' +
      '<span class="lp-track" aria-hidden="true"></span></label>';
    return html;
  }

  /* ------------------------------------------------------------------ *
   * Behaviour
   * ------------------------------------------------------------------ */

  /* Two triggers share one panel: the "Aa" button in the sidebar footer, and
     a floating copy shown whenever the sidebar is out of view (collapsed on
     desktop, shut on a phone, or in focus mode) - otherwise hiding the sidebar
     would also hide the only way to change the text size. The panel therefore
     lives on <body> and is anchored to whichever trigger opened it. */
  var els = null;
  var open = false;
  var opener = null;

  /** On screen at all? (`offsetParent` is always null for fixed elements, and a
      collapsed sidebar is translated off-screen rather than hidden.) */
  function shown(el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.right > 0 && r.left < window.innerWidth;
  }

  function triggers() {
    return els ? [els.trigger, els.float].filter(Boolean) : [];
  }

  function sync() {
    if (!els) return;
    var l = API.read();
    var preset = API.presetOf(l);
    Array.prototype.forEach.call(els.panel.querySelectorAll('input'), function (input) {
      if (input.name === 'lp-preset') input.checked = !!preset && preset.id === input.value;
      else if (input.dataset.axis === 'focus') input.checked = l.focus;
      else input.checked = l[input.dataset.axis] === input.value;
    });
    els.panel.querySelector('.lp-reset').disabled = preset === API.presets[0];
    var name = preset ? preset.name : 'Custom';
    triggers().forEach(function (t) {
      t.setAttribute('aria-label', 'Reading layout: ' + name + '. Change layout');
      t.title = 'Reading layout: ' + name;
    });
  }

  /** Above a trigger near the bottom of the window, below one near the top. */
  function place() {
    if (!open || !opener) return;
    var r = opener.getBoundingClientRect();
    var st = els.panel.style;
    var gap = 8, edge = 12;
    var up = r.top > window.innerHeight / 2;
    // Upward (sidebar footer, where "Aa" is the rightmost control): right
    // edges align so the panel stays over the sidebar. Downward (top-left
    // floating button): left edges align.
    var left = up ? r.right - els.panel.offsetWidth : r.left;
    left = Math.min(left, window.innerWidth - els.panel.offsetWidth - edge);
    st.left = Math.max(edge, left) + 'px';
    if (up) {
      st.top = 'auto';
      st.bottom = (window.innerHeight - r.top + gap) + 'px';
      st.maxHeight = (r.top - gap - edge) + 'px';
    } else {
      st.bottom = 'auto';
      st.top = (r.bottom + gap) + 'px';
      st.maxHeight = (window.innerHeight - r.bottom - gap - edge) + 'px';
    }
  }

  function commit(next) {
    var before = API.read();
    var l = API.apply(next);
    API.save(l);
    if (before.focus !== l.focus) {
      // `body.close` means opposite things in and out of focus mode (see
      // layout.css), so it is reset on every switch to start from the
      // default for the new mode: sidebar shown normally, drawer closed in focus.
      document.body.classList.remove('close');
      // The sidebar may have just slid away under its own trigger.
      if (opener === els.trigger) closePanel(false);
    }
    sync();
    // The drawer's inert state and the reading-progress bar both measure layout.
    window.dispatchEvent(new Event('resize'));
  }

  function onChange(e) {
    var input = e.target;
    var l = API.read();
    if (input.name === 'lp-preset') {
      var p = API.presets.filter(function (x) { return x.id === input.value; })[0];
      if (p) l = { font: p.font, size: p.size, spacing: p.spacing, width: p.width, focus: p.focus };
    } else if (input.dataset.axis === 'focus') {
      l.focus = input.checked;
    } else {
      l[input.dataset.axis] = input.value;
    }
    commit(l);
  }

  function openPanel(from) {
    if (!els) return;
    if (open) closePanel(false);
    open = true;
    opener = from;
    els.panel.hidden = false;
    from.setAttribute('aria-expanded', 'true');
    place();
    var first = els.panel.querySelector('input:checked') || els.panel.querySelector('input');
    if (first) first.focus({ preventScroll: true });
  }

  function closePanel(refocus) {
    if (!open || !els) return;
    open = false;
    els.panel.hidden = true;
    triggers().forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
    if (refocus && opener && shown(opener)) opener.focus();
    opener = null;
  }

  function makeTrigger(cls) {
    var t = document.createElement('button');
    t.type = 'button';
    t.className = cls;
    t.setAttribute('aria-haspopup', 'dialog');
    t.setAttribute('aria-expanded', 'false');
    t.innerHTML = 'A<small>a</small>';
    t.addEventListener('click', function (e) {
      e.stopPropagation();
      if (open && opener === t) closePanel(false); else openPanel(t);
    });
    return t;
  }

  function build() {
    var wrap = document.querySelector('.sidebar .theme-switch-wrap');
    if (!wrap) return;

    if (!els) {
      var panel = document.createElement('div');
      panel.className = 'layout-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-labelledby', 'lp-title');
      panel.hidden = true;
      panel.innerHTML = panelHtml();
      document.body.appendChild(panel);

      var float = makeTrigger('layout-trigger layout-float');
      document.body.appendChild(float);

      els = { panel: panel, float: float, trigger: null };

      panel.addEventListener('change', onChange);
      panel.querySelector('.lp-reset').addEventListener('click', function () {
        commit(API.defaults());
      });
      panel.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePanel(true); }
      });
    }

    // The sidebar footer can be rebuilt by Docsify; re-attach if so.
    if (!wrap.querySelector('.layout-trigger')) {
      els.trigger = makeTrigger('layout-trigger');
      wrap.appendChild(els.trigger);
    }
    sync();
  }

  document.addEventListener('click', function (e) {
    if (!open || !els) return;
    if (els.panel.contains(e.target)) return;
    if (triggers().some(function (t) { return t.contains(e.target); })) return;
    closePanel(false);
  });
  window.addEventListener('resize', function () {
    // A trigger that has just been hidden (sidebar collapsed) cannot anchor.
    if (open && opener && !shown(opener)) closePanel(false);
    else place();
  }, { passive: true });
  // Another tab changed the layout: follow it.
  window.addEventListener('storage', function (e) {
    if (e.key === API.STORAGE_KEY) { API.apply(API.read()); sync(); }
  });

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.mounted(build);
    hook.doneEach(function () {
      build();
      // In focus mode the sidebar is a drawer; following a link from it
      // should land on the page with the drawer shut, as on a phone.
      if (document.documentElement.getAttribute('data-focus') === 'on') {
        document.body.classList.remove('close');
      }
    });
  });
})();
