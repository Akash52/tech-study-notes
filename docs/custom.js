(function () {
  function initSearchShortcut() {
    document.addEventListener('keydown', function (e) {
      var input = document.querySelector('.search input');
      if (!input) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // On mobile the sidebar (and search box inside it) is hidden off-canvas
        // by default; focusing it without opening the sidebar first would put
        // keyboard focus on an invisible input the user can't see or use.
        if (window.innerWidth <= 768 && !document.body.classList.contains('close')) {
          document.body.classList.add('close');
        }
        input.focus();
      }
      if (e.key === 'Escape' && document.activeElement === input) {
        input.blur();
        var panel = document.querySelector('.results-panel');
        if (panel) panel.classList.remove('show');
      }
    });

    // Clicking a result navigates via its href, but the plugin never hides
    // its own results panel afterward, leaving a stale dropdown open over
    // the newly-loaded page.
    document.addEventListener('click', function (e) {
      if (e.target.closest('.results-panel a')) {
        var panel = document.querySelector('.results-panel');
        if (panel) panel.classList.remove('show');
      }
    });
  }

  function initMobileDrawerA11y() {
    // NOTE: .sidebar-toggle is a child of <main>, sibling to .content - so the
    // inert target must be .content specifically, not <main> itself, or the
    // toggle button becomes unclickable while the drawer is open.
    var main = document.querySelector('.content');
    var sidebar = document.querySelector('.sidebar');
    if (!main || !sidebar) return;

    function sync() {
      var isMobile = window.innerWidth <= 768;
      var isOpen = document.body.classList.contains('close');
      // On mobile, body.close means the drawer is OPEN (overlays content).
      // On desktop, body.close means the sidebar is CLOSED (off-canvas).
      var sidebarHidden = isMobile ? !isOpen : isOpen;
      var contentObscured = isMobile && isOpen;

      if (sidebarHidden) sidebar.setAttribute('inert', '');
      else sidebar.removeAttribute('inert');

      if (contentObscured) main.setAttribute('inert', '');
      else main.removeAttribute('inert');
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

  var tocHighlightHandler = null;

  function initToc() {
    var existing = document.getElementById('page-toc');
    if (existing) existing.remove();
    if (tocHighlightHandler) {
      window.removeEventListener('scroll', tocHighlightHandler);
      tocHighlightHandler = null;
    }

    var headings = document.querySelectorAll('.markdown-section h2');
    if (!headings.length) return;

    var panel = document.createElement('div');
    panel.id = 'page-toc';

    var heading = document.createElement('div');
    heading.className = 'toc-heading';
    heading.textContent = 'On this page';
    panel.appendChild(heading);

    var links = [];
    headings.forEach(function (h, i) {
      if (!h.id) h.id = 'section-' + i;
      var a = document.createElement('a');
      a.textContent = h.textContent;
      a.href = '#' + h.id;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      panel.appendChild(a);
      links.push(a);
    });

    document.body.appendChild(panel);

    function highlight() {
      var current = 0;
      headings.forEach(function (h, i) {
        if (h.getBoundingClientRect().top < 140) current = i;
      });
      links.forEach(function (a, i) {
        a.classList.toggle('active', i === current);
      });
    }
    tocHighlightHandler = highlight;
    window.addEventListener('scroll', tocHighlightHandler, { passive: true });
    highlight();
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.mounted(function () {
      initSearchShortcut();
      initProgressBar();
      initMobileDrawerA11y();
    });
    hook.doneEach(function () {
      initToc();
    });
  });
})();
