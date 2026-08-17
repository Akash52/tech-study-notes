/**
 * Theme picker UI.
 *
 * All theme data, derivation, persistence and pre-paint application live in
 * themes.js. This file only renders the control and talks to that API, so
 * adding a theme never requires touching this file.
 *
 * Notes:
 *
 * 1. The trigger lives in the sidebar's flex footer (see `.sidebar` in
 *    custom.css) so it stays reachable while the note list scrolls.
 *
 * 2. The menu is a `role="listbox"` of `role="option"` buttons with a roving
 *    tabindex: arrows move, Enter/Space choose, Escape closes and returns
 *    focus to the trigger, and a click outside dismisses it. A native <select>
 *    would give that for free but cannot show colour swatches, which are the
 *    whole point of picking a theme.
 *
 * 3. The sidebar is re-rendered on navigation, so the control is rebuilt in
 *    `doneEach` and the build is idempotent.
 */
(function () {
  'use strict';

  var API = window.TSNThemes;
  if (!API) return;                  // themes.js failed to load; stay silent

  var SYSTEM = { id: 'system', name: 'System', blurb: 'Follow OS setting', mode: 'auto' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function options() { return [SYSTEM].concat(API.palettes); }

  function find(id) {
    var all = options();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return SYSTEM;
  }

  /** Four dots: page, surface, accent, text. */
  function swatch(p) {
    if (p.id === 'system') {
      return '<span class="theme-swatch theme-swatch-system" aria-hidden="true"></span>';
    }
    var cols = API.swatch(p);
    var dots = '';
    for (var i = 0; i < cols.length; i++) {
      dots += '<i style="background:' + cols[i] + '"></i>';
    }
    return '<span class="theme-swatch" aria-hidden="true">' + dots + '</span>';
  }

  var els = null;
  var open = false;

  function close(refocus) {
    if (!open || !els) return;
    open = false;
    els.menu.hidden = true;
    els.trigger.setAttribute('aria-expanded', 'false');
    if (refocus) els.trigger.focus();
  }

  function openMenu() {
    if (open || !els) return;
    open = true;
    els.menu.hidden = false;
    els.trigger.setAttribute('aria-expanded', 'true');
    var sel = els.menu.querySelector('[aria-selected="true"]') || els.menu.firstElementChild;
    if (sel) {
      sel.focus();
      sel.scrollIntoView({ block: 'nearest' });
    }
  }

  function select(id) {
    var applied = API.apply(id);
    API.save(applied);
    render();
    close(true);
  }

  function onMenuKeydown(e) {
    var items = Array.prototype.slice.call(els.menu.querySelectorAll('[role="option"]'));
    var idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var next = idx + (e.key === 'ArrowDown' ? 1 : -1);
      if (next < 0) next = items.length - 1;
      if (next >= items.length) next = 0;
      items[next].focus();
      items[next].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Home') {
      e.preventDefault(); items[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault(); items[items.length - 1].focus();
    } else if (e.key === 'Escape') {
      e.preventDefault(); close(true);
    } else if (e.key === 'Tab') {
      close(false);
    }
  }

  function render() {
    if (!els) return;
    var current = find(API.read());
    els.trigger.innerHTML =
      swatch(current) +
      '<span class="theme-trigger-name">' + esc(current.name) + '</span>' +
      '<svg class="theme-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M6 15l6-6 6 6"/></svg>';
    els.trigger.setAttribute('aria-label', 'Colour theme: ' + current.name + '. Change theme');

    var html = '';
    options().forEach(function (p) {
      var on = p.id === current.id;
      html +=
        '<button type="button" role="option" class="theme-option' + (on ? ' is-on' : '') + '" ' +
          'data-theme-id="' + esc(p.id) + '" aria-selected="' + (on ? 'true' : 'false') + '" ' +
          'tabindex="' + (on ? '0' : '-1') + '">' +
          swatch(p) +
          '<span class="theme-option-text">' +
            '<span class="theme-option-name">' + esc(p.name) + '</span>' +
            '<span class="theme-option-blurb">' + esc(p.blurb) + '</span>' +
          '</span>' +
          '<svg class="theme-tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' +
        '</button>';
    });
    els.menu.innerHTML = html;
  }

  function build() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.querySelector('.theme-picker')) {
      render();
      return;
    }

    var wrap = document.createElement('div');
    wrap.className = 'theme-switch-wrap';       // the sidebar's flex footer slot

    var picker = document.createElement('div');
    picker.className = 'theme-picker';

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'theme-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    var menu = document.createElement('div');
    menu.className = 'theme-menu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', 'Colour theme');
    menu.hidden = true;

    picker.appendChild(trigger);
    picker.appendChild(menu);
    wrap.appendChild(picker);
    sidebar.appendChild(wrap);

    els = { wrap: wrap, picker: picker, trigger: trigger, menu: menu };

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (open) close(false); else openMenu();
    });
    menu.addEventListener('click', function (e) {
      var opt = e.target.closest('[data-theme-id]');
      if (opt) select(opt.getAttribute('data-theme-id'));
    });
    menu.addEventListener('keydown', onMenuKeydown);
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        if (!open) { e.preventDefault(); openMenu(); }
      }
    });

    render();
  }

  // Dismiss on outside click / Escape from anywhere.
  document.addEventListener('click', function (e) {
    if (open && els && !els.picker.contains(e.target)) close(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) close(true);
  });

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.mounted(build);
    hook.doneEach(build);          // the sidebar is re-rendered on navigation
  });
})();
