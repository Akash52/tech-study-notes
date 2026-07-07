(function () {
  function initSearchShortcut() {
    document.addEventListener('keydown', function (e) {
      var input = document.querySelector('.search input');
      if (!input) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        input.focus();
      }
      if (e.key === 'Escape' && document.activeElement === input) {
        input.blur();
      }
    });
  }

  function initProgressBar() {
    if (document.getElementById('reading-progress')) return;

    var bar = document.createElement('div');
    bar.id = 'reading-progress';
    var fill = document.createElement('div');
    bar.appendChild(fill);
    document.body.appendChild(bar);

    function update() {
      var content = document.querySelector('.content');
      if (!content) return;
      var scrollable = content.scrollHeight - content.clientHeight;
      var progress = scrollable <= 0 ? 0 : content.scrollTop / scrollable;
      fill.style.width = (Math.min(1, Math.max(0, progress)) * 100) + '%';
    }

    document.addEventListener('scroll', function (e) {
      if (e.target.classList && e.target.classList.contains('content')) update();
    }, true);

    update();
  }

  function initToc() {
    var existing = document.getElementById('page-toc');
    if (existing) existing.remove();

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

    var content = document.querySelector('.content');
    function highlight() {
      var current = 0;
      headings.forEach(function (h, i) {
        if (h.offsetTop - content.scrollTop < 140) current = i;
      });
      links.forEach(function (a, i) {
        a.classList.toggle('active', i === current);
      });
    }
    if (content) {
      content.addEventListener('scroll', highlight, { passive: true });
      highlight();
    }
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.mounted(function () {
      initSearchShortcut();
      initProgressBar();
    });
    hook.doneEach(function () {
      initToc();
    });
  });
})();
