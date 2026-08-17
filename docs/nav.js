/**
 * Navigation and home-page presentation.
 *
 * Two problems this solves, both measured against the real sidebar:
 *
 * 1. LABEL LENGTH. 35 of 38 sidebar labels were over 28 characters, so almost
 *    every entry wrapped onto two or three lines and the list became very hard
 *    to scan. 26 of them carried pure boilerplate: " — Lecture Breakdown"
 *    (x12), " Interview Mastery Guide" (x6), " — Quick Notes" (x4) and so on.
 *    Those suffixes are stripped for DISPLAY ONLY - the page's own H1 and the
 *    search index are untouched, and the full title is kept in the link's
 *    `title` attribute so hovering still shows it.
 *
 *    Labels are never edited in _sidebar.md, because that file is regenerated
 *    by CI from each note's H1 and any edit there would be overwritten.
 *
 * 2. SERIES POSITION. The Backend Engineering notes are a numbered sequence,
 *    but the sidebar gave no hint of order. The number is recovered from the
 *    filename (`04_Short_Polling` -> 4) and shown as a muted prefix, so "where
 *    am I in the series" is answerable at a glance.
 *
 * It also tags the index page so home-specific styling can be scoped without
 * leaking into note pages.
 */
(function () {
  'use strict';

  /* Boilerplate suffixes, stripped in order. */
  var TRIM_RULES = [
    / — Lecture Breakdown$/,
    / — Quick Notes$/,
    / — Full Breakdown$/,
    /: The Full Breakdown$/,
    / — For Everyday Use$/,
    / Interview Mastery Guide$/,
    / Interview Questions and Answers$/,
    /:\s*Your Practical Guide.*$/,
    / — "Smoosh Mode"$/,
    / — “Smoosh Mode”$/
  ];

  /* Titles that stay long after trimming, shortened by hand. Keyed by the
     POST-TRIM string. */
  var RENAME = {
    'Multiplexing, Demultiplexing & Connection Pooling': 'Multiplexing & Pooling',
    'Publish-Subscribe (Pub/Sub)': 'Pub/Sub',
    'Synchronous vs Asynchronous': 'Sync vs Async',
    'Server-Sent Events (SSE)': 'Server-Sent Events',
    'The Sidecar Pattern': 'Sidecar Pattern',
    'The OSI Model': 'OSI Model',
    'TCP: Transmission Control Protocol': 'TCP',
    'TLS: Transport Layer Security': 'TLS',
    'React Fiber Internals Deep Dive': 'React Fiber Internals',
    'Docker Cheatsheet': 'Docker',
    'TypeScript Interview Questions & Answers': 'TypeScript Q&A',
    'GitHub Copilot Cloud Agent': 'Copilot Cloud Agent',
    'Asking Copilot to Create a Pull Request': 'Creating a PR',
    'Asking Copilot to Make Changes to an Existing PR': 'Changing an Existing PR',
    'Reviewing a Pull Request Created by Copilot': 'Reviewing Copilot’s PR',
    'Tracking GitHub Copilot Sessions': 'Tracking Copilot Sessions',
    'Complete Interview Preparation — GitHub Copilot Features': 'Copilot Interview Prep',
    'Git Day-to-Day Tricks & Scenarios': 'Git Tricks'
  };

  function shorten(label) {
    var out = label.trim();
    for (var i = 0; i < TRIM_RULES.length; i++) out = out.replace(TRIM_RULES[i], '');
    out = out.trim();
    return RENAME[out] || out;
  }

  /** `#/backend-engineering/04_Short_Polling` -> "4". Empty when unnumbered. */
  function seriesNumber(href) {
    if (!href) return '';
    var file = href.split('/').pop() || '';
    var m = file.match(/^(\d+)[_-]/);
    return m ? String(parseInt(m[1], 10)) : '';
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function tidySidebar() {
    var nav = document.querySelector('.sidebar-nav');
    if (!nav) return;

    var links = nav.querySelectorAll('a:not(.section-link)');
    Array.prototype.forEach.call(links, function (a) {
      if (a.getAttribute('data-nav-tidy')) return;      // idempotent
      if (a.closest('.app-sub-sidebar')) return;        // in-page anchors, not notes

      var full = (a.getAttribute('title') || a.textContent || '').trim();
      if (!full) return;
      var short = shorten(full);
      var num = seriesNumber(a.getAttribute('href'));

      // Progress rings are appended by progress-tracker.js; keep whatever
      // markup is already there and only rewrite the label text node.
      var ring = a.querySelector('.pt-ring-wrap');
      a.innerHTML =
        (num ? '<span class="nav-num" aria-hidden="true">' + num + '</span>' : '') +
        '<span class="nav-label">' + esc(short) + '</span>';
      if (ring) a.appendChild(ring);

      // Hovering still reveals the untruncated title.
      a.setAttribute('title', full);
      a.setAttribute('data-nav-tidy', '1');
    });
  }

  /** Marks the index page so home-only styles can be scoped to it. */
  function markHome(route) {
    var section = document.querySelector('.markdown-section');
    if (!section) return;
    var isHome = route === '/' || route === '';
    section.classList.toggle('is-home', isHome);
    document.body.classList.toggle('on-home', isHome);
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    hook.doneEach(function () {
      markHome((vm && vm.route && vm.route.path) || '/');
      tidySidebar();
    });
  });
})();
