(function () {
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

  /* ---------- "On this page" ----------
     Covers H3s as well as H2s. Measured across the corpus the rail was showing
     372 of 1,098 sections - under a fifth on the largest pages - and since
     every interview question is an H3, none of them were reachable from it.

     All H3s at once would be a wall: the JavaScript Bible alone has 163
     sections against a rail that was already at its 740px maximum with 39.
     So H3s sit in a group that opens only under the section being read.

     The previous scroll handler called getBoundingClientRect() on every
     heading on every scroll event, unthrottled - a forced layout per heading
     per event, which would have got three times worse with H3s included.
     Offsets are now measured once, re-measured only when the document height
     changes (late-loading fonts and syntax highlighting shift the page), and
     the handler is throttled to one animation frame. */

  var tocState = null;

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function destroyToc() {
    if (tocState) {
      window.removeEventListener('scroll', tocState.onScroll);
      window.removeEventListener('resize', tocState.onResize);
      tocState = null;
    }
    var existing = document.getElementById('page-toc');
    if (existing) existing.remove();
  }

  function initToc() {
    destroyToc();

    var section = document.querySelector('.markdown-section');
    if (!section) return;
    var nodes = section.querySelectorAll('h2, h3');
    if (!nodes.length) return;

    var nav = document.createElement('nav');
    nav.id = 'page-toc';
    nav.setAttribute('aria-label', 'On this page');
    nav.innerHTML = '<div class="toc-heading">On this page</div>';

    var list = document.createElement('ul');
    list.className = 'toc-list';
    nav.appendChild(list);

    var entries = [];      // flat, in document order
    var groupItem = null;  // <li> of the H2 currently being filled
    var groupSub = null;   // its <ul> of H3 children

    Array.prototype.forEach.call(nodes, function (h, i) {
      if (!h.id) h.id = 'section-' + i;
      var isSub = h.tagName === 'H3';

      var a = document.createElement('a');
      a.className = 'toc-link ' + (isSub ? 'toc-l3' : 'toc-l2');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      a.addEventListener('click', function (e) {
        e.preventDefault();
        h.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      });

      var li = document.createElement('li');
      li.appendChild(a);

      if (isSub && groupSub) {
        groupSub.appendChild(li);
        entries.push({ el: h, link: a, item: groupItem, offset: 0 });
        return;
      }

      // An H2, or an H3 appearing before any H2 - either way a top-level row.
      li.className = 'toc-item';
      list.appendChild(li);
      if (isSub) {
        groupItem = li; groupSub = null;
      } else {
        groupSub = document.createElement('ul');
        groupSub.className = 'toc-sub';
        li.appendChild(groupSub);
        groupItem = li;
      }
      entries.push({ el: h, link: a, item: li, offset: 0 });
    });

    document.body.appendChild(nav);

    var items = list.querySelectorAll('.toc-item');
    var docHeight = 0;
    var activeIdx = -1;
    var ticking = false;

    function measure() {
      var top = window.pageYOffset || document.documentElement.scrollTop || 0;
      for (var i = 0; i < entries.length; i++) {
        entries[i].offset = entries[i].el.getBoundingClientRect().top + top;
      }
      docHeight = document.documentElement.scrollHeight;
    }

    function apply(idx) {
      for (var i = 0; i < entries.length; i++) {
        var on = i === idx;
        entries[i].link.classList.toggle('active', on);
        if (on) entries[i].link.setAttribute('aria-current', 'true');
        else entries[i].link.removeAttribute('aria-current');
      }

      // Accordion: only the section being read is expanded.
      var openItem = entries[idx] ? entries[idx].item : null;
      Array.prototype.forEach.call(items, function (li) {
        li.classList.toggle('is-open', li === openItem);
      });

      // Keep the active row visible *inside the rail* - scrollIntoView would
      // scroll the page as well, fighting the reader.
      var link = entries[idx] && entries[idx].link;
      if (!link) return;
      var y = link.offsetTop, h = link.offsetHeight;
      if (y < nav.scrollTop + 8) nav.scrollTop = y - 8;
      else if (y + h > nav.scrollTop + nav.clientHeight - 8) {
        nav.scrollTop = y + h - nav.clientHeight + 8;
      }
    }

    function update() {
      if (document.documentElement.scrollHeight !== docHeight) measure();
      var y = (window.pageYOffset || document.documentElement.scrollTop || 0) + 130;
      var idx = 0;
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].offset <= y) idx = i; else break;
      }
      if (idx !== activeIdx) { activeIdx = idx; apply(idx); }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; update(); });
    }
    function onResize() { measure(); activeIdx = -1; update(); }

    measure();
    activeIdx = -1;
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    tocState = { onScroll: onScroll, onResize: onResize };
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.mounted(function () {
      initProgressBar();
      initMobileDrawerA11y();
    });
    hook.doneEach(function () {
      initToc();
    });
  });
})();
