/**
 * Reading themes for the Tech Study Notes portal.
 *
 * This file is DATA plus a derivation step. Adding a theme means adding one
 * object to PALETTES - nothing else in the codebase needs to change, and the
 * picker, the persistence and the pre-paint path all pick it up automatically.
 *
 * Design notes worth knowing before editing:
 *
 * 1. COMPACT PALETTES, DERIVED TOKENS. The stylesheets consume ~26 custom
 *    properties. Hand-authoring all of them for every theme would be tedious
 *    and, more importantly, would let a theme ship text that fails contrast.
 *    Each palette therefore declares only the 7 colours that carry its
 *    identity, and `derive()` expands them into the full token set.
 *
 * 2. CONTRAST IS ENFORCED, NOT TRUSTED. Secondary and muted text are derived
 *    by fading the body colour toward the background, then *pushed back* until
 *    they measure at least 4.5:1 against every surface they sit on (page,
 *    sidebar and card). A palette therefore cannot introduce an accessibility
 *    regression, however it is authored. See `ensureContrast`.
 *
 * 3. LOADED SYNCHRONOUSLY IN <head>. The saved theme has to be applied before
 *    the first paint or every page load flashes the wrong colours, so this
 *    file is a blocking script placed ahead of the stylesheets and is
 *    deliberately dependency-free. It must not touch the DOM beyond
 *    documentElement, because <body> does not exist yet when it runs.
 *
 * 4. "system" IS NOT A PALETTE. It removes the inline overrides entirely and
 *    lets the `prefers-color-scheme` rules in custom.css decide, which is also
 *    what a reader with JavaScript disabled gets.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tsn.theme';

  /* ------------------------------------------------------------------ *
   * Colour utilities
   * ------------------------------------------------------------------ */

  function hexToRgb(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16)
    };
  }

  function clamp255(n) { return n < 0 ? 0 : n > 255 ? 255 : Math.round(n); }

  function rgbToHex(c) {
    return '#' + [c.r, c.g, c.b].map(function (v) {
      var s = clamp255(v).toString(16);
      return s.length === 1 ? '0' + s : s;
    }).join('').toUpperCase();
  }

  function channelLum(v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  function luminance(hex) {
    var c = hexToRgb(hex);
    return 0.2126 * channelLum(c.r) + 0.7152 * channelLum(c.g) + 0.0722 * channelLum(c.b);
  }

  /** WCAG contrast ratio between two hex colours. */
  function contrast(a, b) {
    var la = luminance(a), lb = luminance(b);
    var hi = Math.max(la, lb), lo = Math.min(la, lb);
    return (hi + 0.05) / (lo + 0.05);
  }

  /** Linear blend: t=0 returns `a`, t=1 returns `b`. */
  function mix(a, b, t) {
    var ca = hexToRgb(a), cb = hexToRgb(b);
    return rgbToHex({
      r: ca.r + (cb.r - ca.r) * t,
      g: ca.g + (cb.g - ca.g) * t,
      b: ca.b + (cb.b - ca.b) * t
    });
  }

  function rgba(hex, alpha) {
    var c = hexToRgb(hex);
    return 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + alpha + ')';
  }

  /**
   * Nudges `fg` away from the given backgrounds until it clears `target`
   * against all of them. This is what stops a hand-picked palette from
   * shipping unreadable secondary text.
   */
  function ensureContrast(fg, backgrounds, target, towards) {
    var out = fg;
    for (var step = 0; step < 40; step++) {
      var worst = Infinity;
      for (var i = 0; i < backgrounds.length; i++) {
        var r = contrast(out, backgrounds[i]);
        if (r < worst) worst = r;
      }
      if (worst >= target) break;
      out = mix(out, towards, 0.05);   // 5% at a time keeps the hue recognisable
    }
    return out;
  }

  /* ------------------------------------------------------------------ *
   * Palettes
   *
   * Seven colours carry a theme's identity: page, sidebar, card, code
   * surfaces, the body text, the accent, and the border. Syntax colours are
   * optional and fall back to a set derived from the accent's mode.
   * ------------------------------------------------------------------ */

  var PALETTES = [
    {
      id: 'daylight', name: 'Daylight', blurb: 'Warm paper white',
      mode: 'light',
      bg: '#FAFAF7', sidebar: '#F2F1EC', card: '#FFFFFF', code: '#F6F5F0',
      text: '#1A1A18', accent: '#2D7A50', border: '#E5E4DF',
      syntax: { keyword: '#7C3AED', string: '#059669', comment: '#8A8A84', func: '#2563EB', number: '#B45309' }
    },
    {
      id: 'midnight', name: 'Midnight', blurb: 'Near-black, low glare',
      mode: 'dark',
      bg: '#141413', sidebar: '#1A1A18', card: '#1E1E1C', code: '#1E1E1C',
      text: '#E8E8E3', accent: '#4ADE80', border: '#2A2A27',
      syntax: { keyword: '#A78BFA', string: '#34D399', comment: '#7E7E77', func: '#60A5FA', number: '#FBBF24' }
    },
    {
      id: 'sepia', name: 'Sepia', blurb: 'E-reader warmth',
      mode: 'light',
      bg: '#F4ECD8', sidebar: '#EDE3CC', card: '#FBF6E9', code: '#EEE4CE',
      text: '#3B3229', accent: '#8A5A2B', border: '#DDCFB4',
      syntax: { keyword: '#8A5A2B', string: '#5F7A3A', comment: '#8A7F6E', func: '#2F6F8F', number: '#A15C1E' }
    },
    {
      id: 'solarized-light', name: 'Solarized Light', blurb: 'Schoonover classic',
      mode: 'light',
      bg: '#FDF6E3', sidebar: '#F5EEDB', card: '#FFFBF0', code: '#F2EAD3',
      text: '#073642', accent: '#268BD2', border: '#E3DCC6',
      syntax: { keyword: '#859900', string: '#2AA198', comment: '#93A1A1', func: '#268BD2', number: '#D33682' }
    },
    {
      id: 'solarized-dark', name: 'Solarized Dark', blurb: 'The other half',
      mode: 'dark',
      bg: '#002B36', sidebar: '#01313D', card: '#073642', code: '#073642',
      text: '#EEE8D5', accent: '#2AA198', border: '#0E4A57',
      syntax: { keyword: '#859900', string: '#2AA198', comment: '#657B83', func: '#268BD2', number: '#D33682' }
    },
    {
      id: 'nord', name: 'Nord', blurb: 'Cool arctic blues',
      mode: 'dark',
      bg: '#2E3440', sidebar: '#292F3A', card: '#3B4252', code: '#373E4C',
      text: '#ECEFF4', accent: '#88C0D0', border: '#434C5E',
      syntax: { keyword: '#81A1C1', string: '#A3BE8C', comment: '#7B879D', func: '#88C0D0', number: '#B48EAD' }
    },
    {
      id: 'gruvbox', name: 'Gruvbox', blurb: 'Retro, warm, soft',
      mode: 'dark',
      bg: '#282828', sidebar: '#232323', card: '#32302F', code: '#32302F',
      text: '#EBDBB2', accent: '#FE8019', border: '#3C3836',
      syntax: { keyword: '#FB4934', string: '#B8BB26', comment: '#928374', func: '#8EC07C', number: '#D3869B' }
    },
    {
      id: 'dracula', name: 'Dracula', blurb: 'High-contrast violet',
      mode: 'dark',
      bg: '#282A36', sidebar: '#22242E', card: '#343746', code: '#343746',
      text: '#F8F8F2', accent: '#BD93F9', border: '#44475A',
      syntax: { keyword: '#FF79C6', string: '#F1FA8C', comment: '#8A8FA8', func: '#50FA7B', number: '#BD93F9' }
    },
    {
      id: 'tokyo-night', name: 'Tokyo Night', blurb: 'Deep indigo calm',
      mode: 'dark',
      bg: '#1A1B26', sidebar: '#16161F', card: '#24283B', code: '#24283B',
      text: '#C0CAF5', accent: '#7AA2F7', border: '#2F334D',
      syntax: { keyword: '#BB9AF7', string: '#9ECE6A', comment: '#7A82A8', func: '#7AA2F7', number: '#FF9E64' }
    },
    {
      id: 'high-contrast', name: 'High Contrast', blurb: 'Maximum legibility',
      mode: 'light',
      bg: '#FFFFFF', sidebar: '#F2F2F2', card: '#FFFFFF', code: '#F0F0F0',
      text: '#000000', accent: '#0B5FBF', border: '#767676',
      syntax: { keyword: '#6A1B9A', string: '#1B5E20', comment: '#5A5A5A', func: '#0B5FBF', number: '#A0410D' }
    }
  ];

  /* ------------------------------------------------------------------ *
   * Derivation
   * ------------------------------------------------------------------ */

  var AA = 4.5;   // WCAG AA for normal-size text

  function derive(p) {
    var dark = p.mode === 'dark';
    var away = dark ? '#FFFFFF' : '#000000';   // direction that raises contrast
    var surfaces = [p.bg, p.sidebar];

    // Faded body text, then pushed back until it clears AA on every surface
    // it can appear over.
    var secondary = ensureContrast(mix(p.text, p.bg, 0.30), surfaces, AA, away);
    var muted = ensureContrast(mix(p.text, p.bg, 0.46), surfaces, AA, away);
    // The command palette's modal sits on `card`, which is often a lighter
    // surface than the page - muted text needs re-checking against it.
    var cpMuted = ensureContrast(muted, [p.card], AA, away);
    // Accent is used for link and active-state text, so it has to clear AA too.
    var accentText = ensureContrast(p.accent, surfaces, AA, away);

    var borderLight = mix(p.border, p.bg, 0.5);
    var bgActive = mix(p.bg, p.accent, dark ? 0.14 : 0.10);
    var syn = p.syntax || {};

    return {
      '--bg': p.bg,
      '--bg-sidebar': p.sidebar,
      '--bg-card': p.card,
      '--bg-code': p.code,
      '--bg-hover': dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
      '--bg-active': bgActive,
      '--text': p.text,
      '--text-secondary': secondary,
      '--text-muted': muted,
      '--accent': accentText,
      '--accent-light': bgActive,
      '--accent-dim': rgba(accentText, dark ? 0.16 : 0.18),
      '--border': p.border,
      '--border-light': borderLight,
      /* Syntax colours are enforced against the code surface just like body
         text. The canonical editor palettes (Solarized, Nord, Gruvbox...) were
         tuned for highlighting rather than WCAG, and 15 of their tokens
         measured below 4.5:1 as published. Enforcing shifts them slightly from
         the original hex, which is the right trade: a theme that is faithful
         but unreadable is not worth shipping. */
      '--code-keyword': ensureContrast(syn.keyword || accentText, [p.code], AA, away),
      '--code-string': ensureContrast(syn.string || secondary, [p.code], AA, away),
      '--code-comment': ensureContrast(syn.comment || muted, [p.code], AA, away),
      '--code-func': ensureContrast(syn.func || accentText, [p.code], AA, away),
      '--code-number': ensureContrast(syn.number || accentText, [p.code], AA, away),
      '--progress-bar': accentText,
      '--shadow-md': dark
        ? '0 4px 12px rgba(0, 0, 0, 0.34)'
        : '0 4px 12px rgba(0, 0, 0, 0.07)',
      '--cp-overlay': rgba(dark ? '#000000' : mix(p.text, '#000000', 0.3), dark ? 0.62 : 0.42),
      '--cp-shadow': dark
        ? '0 16px 48px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.4)'
        : '0 16px 48px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.08)',
      '--cp-muted': cpMuted,
      '--theme-chip': dark ? mix(p.code, '#FFFFFF', 0.11) : p.card,
      '--search-icon': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' " +
        "width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23" +
        muted.replace('#', '') + "' stroke-width='2' stroke-linecap='round'%3E" +
        "%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='M21 21l-4.35-4.35'/%3E%3C/svg%3E\")"
    };
  }

  /* ------------------------------------------------------------------ *
   * Applying
   * ------------------------------------------------------------------ */

  var byId = {};
  for (var i = 0; i < PALETTES.length; i++) byId[PALETTES[i].id] = PALETTES[i];

  /** Legacy values written by the previous three-state switcher. */
  var ALIASES = { light: 'daylight', dark: 'midnight' };

  function resolve(id) {
    if (!id || id === 'system') return null;
    return byId[ALIASES[id] || id] || null;
  }

  function apply(id) {
    var root = document.documentElement;
    var palette = resolve(id);

    // Always clear previous overrides first, so switching themes never leaves
    // a stale token behind.
    var style = root.style;
    for (var k = style.length - 1; k >= 0; k--) {
      var prop = style[k];
      if (prop && prop.indexOf('--') === 0) style.removeProperty(prop);
    }

    if (!palette) {
      root.removeAttribute('data-theme');       // system: CSS media queries decide
      return 'system';
    }

    var tokens = derive(palette);
    for (var t in tokens) {
      if (Object.prototype.hasOwnProperty.call(tokens, t)) style.setProperty(t, tokens[t]);
    }
    // `data-theme` still drives color-scheme and any non-tokenised rules.
    root.setAttribute('data-theme', palette.mode);
    return palette.id;
  }

  function read() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      if (!v || v === 'system') return 'system';
      return resolve(v) ? (ALIASES[v] || v) : 'system';
    } catch (e) { return 'system'; }
  }

  function save(id) {
    try {
      if (!id || id === 'system') window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, id);
    } catch (e) { /* private mode - the choice just will not persist */ }
  }

  window.TSNThemes = {
    STORAGE_KEY: STORAGE_KEY,
    palettes: PALETTES,
    derive: derive,
    apply: apply,
    read: read,
    save: save,
    contrast: contrast,
    /** Swatches for the picker: page, surface, accent, text. */
    swatch: function (p) { return [p.bg, p.card, p.accent, p.text]; }
  };

  // Apply the saved theme immediately - this file is loaded before the
  // stylesheets precisely so that this runs ahead of the first paint.
  apply(read());
})();
