/**
 * Reading layouts for the Tech Study Notes portal.
 *
 * The theme system (themes.js) decides colour; this file decides the shape of
 * the page: typeface, text size, line spacing, column width, and whether the
 * sidebar is shown at all.
 *
 * Design notes worth knowing before editing:
 *
 * 1. FOUR AXES, NOT ONE LIST. Every reading app worth copying (Kindle, Apple
 *    Books, Safari Reader, iA Writer, Readwise Reader) exposes the same few
 *    controls: font, size, spacing, width. A layout here is just a value on
 *    each axis plus a focus flag, so presets and fine-tuning are the same
 *    data - picking a preset sets the axes, nudging an axis makes it "Custom".
 *
 * 2. ATTRIBUTES, NOT INLINE TOKENS. Each axis is written as a `data-read-*`
 *    attribute on <html>, and layout.css maps the values onto custom
 *    properties. That keeps every size in CSS (where it can be reviewed in one
 *    place) and means a reader without JavaScript gets the defaults.
 *
 * 3. LOADED SYNCHRONOUSLY IN <head>, for the same reason as themes.js: the
 *    saved layout must apply before the first paint, or a reader who chose a
 *    serif 19px column watches the page reflow on every load.
 *
 * 4. FONTS ARE FETCHED ON DEMAND. Inter and JetBrains Mono are already on the
 *    page; Literata and Atkinson Hyperlegible are only requested once a reader
 *    picks them, so the default page pays nothing for the option.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tsn.layout';

  /* ------------------------------------------------------------------ *
   * Axes. The first value of each is the site default.
   * ------------------------------------------------------------------ */

  var AXES = {
    font: [
      { id: 'sans', name: 'Sans', blurb: 'Inter, the site default' },
      { id: 'serif', name: 'Serif', blurb: 'Literata, the Kindle and Play Books face' },
      { id: 'mono', name: 'Mono', blurb: 'Typewriter rhythm, like iA Writer' },
      { id: 'legible', name: 'Legible', blurb: 'Atkinson Hyperlegible, for low vision' }
    ],
    size: [
      { id: 'm', name: 'M' },
      { id: 's', name: 'S' },
      { id: 'l', name: 'L' },
      { id: 'xl', name: 'XL' }
    ],
    spacing: [
      { id: 'normal', name: 'Normal' },
      { id: 'compact', name: 'Compact' },
      { id: 'relaxed', name: 'Relaxed' }
    ],
    width: [
      { id: 'standard', name: 'Standard' },
      { id: 'narrow', name: 'Narrow' },
      { id: 'wide', name: 'Wide' },
      { id: 'full', name: 'Full', blurb: 'Fill the window' }
    ]
  };

  /* Display order for the controls (the AXES order puts defaults first). */
  var ORDER = {
    size: ['s', 'm', 'l', 'xl'],
    spacing: ['compact', 'normal', 'relaxed'],
    width: ['narrow', 'standard', 'wide', 'full']
  };

  /* ------------------------------------------------------------------ *
   * Presets, each modelled on a reading app people already trust.
   * ------------------------------------------------------------------ */

  var PRESETS = [
    {
      id: 'standard', name: 'Standard', blurb: 'The site default',
      font: 'sans', size: 'm', spacing: 'normal', width: 'standard', focus: false
    },
    {
      id: 'book', name: 'Book', blurb: 'Serif, like Apple Books',
      font: 'serif', size: 'l', spacing: 'relaxed', width: 'narrow', focus: false
    },
    {
      id: 'focus', name: 'Focus', blurb: 'Just the text, like Reader',
      font: 'sans', size: 'l', spacing: 'relaxed', width: 'narrow', focus: true
    },
    {
      id: 'reference', name: 'Reference', blurb: 'Dense, wide, for code',
      font: 'sans', size: 's', spacing: 'compact', width: 'wide', focus: false
    },
    {
      id: 'legible', name: 'Legible', blurb: 'Large, easy-to-read type',
      font: 'legible', size: 'xl', spacing: 'relaxed', width: 'standard', focus: false
    }
  ];

  var FONT_URLS = {
    serif: 'https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap',
    legible: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap'
  };

  /* ------------------------------------------------------------------ *
   * State
   * ------------------------------------------------------------------ */

  var KEYS = ['font', 'size', 'spacing', 'width'];

  function valid(axis, v) {
    var list = AXES[axis];
    for (var i = 0; i < list.length; i++) if (list[i].id === v) return true;
    return false;
  }

  function defaults() {
    var p = PRESETS[0];
    return { font: p.font, size: p.size, spacing: p.spacing, width: p.width, focus: p.focus };
  }

  /** Any stored object, however old or hand-edited, becomes a valid layout. */
  function normalise(raw) {
    var out = defaults();
    if (raw && typeof raw === 'object') {
      KEYS.forEach(function (k) { if (valid(k, raw[k])) out[k] = raw[k]; });
      out.focus = raw.focus === true;
    }
    return out;
  }

  /** The preset this layout matches exactly, or null for a custom mix. */
  function presetOf(layout) {
    for (var i = 0; i < PRESETS.length; i++) {
      var p = PRESETS[i], same = p.focus === layout.focus;
      for (var k = 0; same && k < KEYS.length; k++) same = p[KEYS[k]] === layout[KEYS[k]];
      if (same) return p;
    }
    return null;
  }

  function loadFont(font) {
    var url = FONT_URLS[font];
    if (!url || document.querySelector('link[data-layout-font="' + font + '"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.setAttribute('data-layout-font', font);
    (document.head || document.documentElement).appendChild(link);
  }

  function apply(layout) {
    var l = normalise(layout);
    var root = document.documentElement;
    KEYS.forEach(function (k) { root.setAttribute('data-read-' + k, l[k]); });
    if (l.focus) root.setAttribute('data-focus', 'on');
    else root.removeAttribute('data-focus');
    loadFont(l.font);
    return l;
  }

  function read() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      return normalise(v ? JSON.parse(v) : null);
    } catch (e) { return defaults(); }
  }

  function save(layout) {
    try {
      var l = normalise(layout);
      if (presetOf(l) === PRESETS[0]) window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(l));
    } catch (e) { /* private mode - the choice just will not persist */ }
  }

  window.TSNLayouts = {
    STORAGE_KEY: STORAGE_KEY,
    axes: AXES,
    order: ORDER,
    presets: PRESETS,
    defaults: defaults,
    presetOf: presetOf,
    apply: apply,
    read: read,
    save: save
  };

  // Apply the saved layout before the first paint.
  apply(read());
})();
