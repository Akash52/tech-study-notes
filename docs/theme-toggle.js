/**
 * Theme switcher for the Tech Study Notes portal.
 *
 * Three states: Light / System / Dark. "System" is the default and simply
 * removes the `data-theme` attribute, letting the `prefers-color-scheme`
 * media queries in custom.css and command-palette.css take over.
 *
 * Design notes worth knowing before editing:
 *
 * 1. FIRST PAINT HAPPENS WITHOUT THIS FILE. The stored preference is applied
 *    by a tiny inline script in index.html's <head>, because anything loaded
 *    with a <script src> runs after the stylesheets have already painted -
 *    which would show a flash of the wrong theme on every single page load.
 *    This module only builds the UI and keeps it in sync. The storage key and
 *    the accepted values are therefore duplicated in index.html; if you change
 *    either, change both.
 *
 * 2. REAL RADIO INPUTS. The segmented control is three <input type="radio">
 *    sharing a name, so arrow-key navigation, grouping and screen-reader
 *    semantics all come from the browser rather than being re-implemented.
 *
 * 3. NO WRITE FOR "SYSTEM". Choosing System removes the key entirely rather
 *    than storing the string, so a reader who never touches the switcher and
 *    one who explicitly picks System end up in the same state.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tsn.theme';           // must match the inline script in index.html
  var VALUES = ['light', 'system', 'dark'];

  var ICONS = {
    light:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4' +
      'M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/></svg>',
    system:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8.5 20.5h7M12 17v3.5"/></svg>',
    dark:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7z"/></svg>'
  };

  var LABELS = {
    light: 'Light theme',
    system: 'Match system theme',
    dark: 'Dark theme'
  };

  /* ------------------------------------------------------------------ *
   * State
   * ------------------------------------------------------------------ */

  function readStored() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      return (v === 'light' || v === 'dark') ? v : 'system';
    } catch (e) { return 'system'; }
  }

  function apply(value) {
    var root = document.documentElement;
    if (value === 'light' || value === 'dark') {
      root.setAttribute('data-theme', value);
    } else {
      // System: drop the attribute so prefers-color-scheme decides.
      root.removeAttribute('data-theme');
    }
    try {
      if (value === 'light' || value === 'dark') {
        window.localStorage.setItem(STORAGE_KEY, value);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) { /* private mode - the choice just will not persist */ }
  }

  /* ------------------------------------------------------------------ *
   * UI
   * ------------------------------------------------------------------ */

  function build() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.querySelector('.theme-switch')) return;

    var current = readStored();

    var wrap = document.createElement('div');
    wrap.className = 'theme-switch-wrap';

    var group = document.createElement('div');
    group.className = 'theme-switch';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Colour theme');

    var html = '';
    for (var i = 0; i < VALUES.length; i++) {
      var v = VALUES[i];
      html +=
        '<label class="theme-opt" title="' + LABELS[v] + '">' +
          '<input type="radio" name="tsn-theme" value="' + v + '"' +
            (v === current ? ' checked' : '') +
            ' aria-label="' + LABELS[v] + '">' +
          '<span class="theme-opt-icon">' + ICONS[v] + '</span>' +
        '</label>';
    }
    group.innerHTML = html;
    wrap.appendChild(group);
    sidebar.appendChild(wrap);

    group.addEventListener('change', function (e) {
      var input = e.target;
      if (input && input.name === 'tsn-theme') apply(input.value);
    });
  }

  /** Re-checks the right radio, e.g. after Docsify re-renders the sidebar. */
  function sync() {
    var current = readStored();
    var inputs = document.querySelectorAll('.theme-switch input[name="tsn-theme"]');
    Array.prototype.forEach.call(inputs, function (input) {
      input.checked = input.value === current;
    });
  }

  /* ------------------------------------------------------------------ *
   * Docsify plugin registration
   * ------------------------------------------------------------------ */

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.mounted(function () {
      build();
      sync();
    });
    hook.doneEach(function () {
      // The sidebar is re-rendered on navigation, so the control is re-added.
      build();
      sync();
    });
  });
})();
