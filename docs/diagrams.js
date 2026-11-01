/**
 * Mermaid diagrams.
 *
 * A ```mermaid block renders as a diagram instead of showing its source.
 *
 * 1. LOADED ON DEMAND. Mermaid is ~3.5 MB, and at the time of writing one note
 *    in the corpus has a diagram. The library is fetched the first time a page
 *    with a diagram is opened, so every other page pays nothing.
 *
 * 2. DRAWN IN THE READER'S THEME. Colours are read from the live theme tokens
 *    (--bg-card, --text, --border...) at render time, and every diagram is
 *    redrawn when the theme changes, so a diagram never sits as a white box
 *    in Midnight or Nord.
 *
 * 3. SAFE. securityLevel "strict": labels cannot carry script or click
 *    handlers, so a diagram is only ever a picture.
 */
(function () {
  'use strict';

  var SRC = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
  var loading = null;
  var seq = 0;

  function load() {
    if (window.mermaid) return Promise.resolve(window.mermaid);
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = SRC;
      s.onload = function () { resolve(window.mermaid); };
      s.onerror = function () { loading = null; reject(new Error('mermaid failed to load')); };
      document.head.appendChild(s);
    });
    return loading;
  }

  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function configure(mermaid) {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') &&
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      fontFamily: 'Inter, -apple-system, sans-serif',
      flowchart: { curve: 'basis', padding: 12 },
      themeVariables: {
        darkMode: dark,
        fontSize: '14px',
        background: token('--bg-card', '#FFFFFF'),
        mainBkg: token('--bg-code', '#F6F5F0'),
        primaryColor: token('--bg-code', '#F6F5F0'),
        primaryTextColor: token('--text', '#1A1A18'),
        primaryBorderColor: token('--border', '#E5E4DF'),
        nodeBorder: token('--border', '#E5E4DF'),
        lineColor: token('--text-muted', '#6E6E68'),
        textColor: token('--text', '#1A1A18'),
        secondaryColor: token('--bg-active', '#EBF5EE'),
        tertiaryColor: token('--bg-card', '#FFFFFF'),
        clusterBkg: token('--bg-sidebar', '#F2F1EC'),
        clusterBorder: token('--border', '#E5E4DF'),
        edgeLabelBackground: token('--bg-card', '#FFFFFF')
      }
    });
  }

  function draw(box) {
    return load().then(function (mermaid) {
      configure(mermaid);
      var id = 'mmd-' + (++seq);
      return mermaid.render(id, box.getAttribute('data-src')).then(function (out) {
        box.innerHTML = out.svg;
        box.classList.remove('is-error');
      });
    }).catch(function () {
      // Fall back to the source, which is still readable.
      box.classList.add('is-error');
      box.textContent = box.getAttribute('data-src');
    });
  }

  function drawAll() {
    var boxes = document.querySelectorAll('.markdown-section .mermaid-diagram');
    Array.prototype.forEach.call(boxes, draw);
  }

  function convert() {
    var codes = document.querySelectorAll('.markdown-section pre > code.lang-mermaid, .markdown-section pre[data-lang="mermaid"] > code');
    Array.prototype.forEach.call(codes, function (code) {
      var pre = code.parentNode;
      var box = document.createElement('div');
      box.className = 'mermaid-diagram';
      box.setAttribute('role', 'img');
      box.setAttribute('aria-label', 'Diagram');
      box.setAttribute('data-src', code.textContent);
      box.textContent = 'Loading diagram…';
      pre.parentNode.replaceChild(box, pre);
    });
    if (codes.length) drawAll();
  }

  // Redraw in the new colours when the reader switches theme (themes.js
  // rewrites <html>'s inline tokens and data-theme).
  var redrawTimer = 0;
  new MutationObserver(function () {
    if (!document.querySelector('.markdown-section .mermaid-diagram')) return;
    clearTimeout(redrawTimer);
    redrawTimer = setTimeout(drawAll, 50);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-theme'] });

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.doneEach(convert);
  });
})();
