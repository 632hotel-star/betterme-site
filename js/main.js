(function () {
  'use strict';
  var BM = window.BM, root = document.documentElement;
  var cfg = BM.config;

  // Inside TikTok, Instagram and the like a video can only play full screen, so there each clip is an animated image
  // that plays inside the phone (its still first, the animation once it comes near the screen).
  if (root.classList.contains('inapp')) {
    document.querySelectorAll('video[data-clip]').forEach(function (v) {
      var img = document.createElement('img');
      img.setAttribute('data-clip', v.getAttribute('data-clip'));
      img.src = v.getAttribute('poster');
      img.width = 540; img.height = 1174;
      img.alt = v.getAttribute('aria-label');
      img.setAttribute('data-i18n-attr', v.getAttribute('data-i18n-attr').replace('aria-label:', 'alt:'));
      v.replaceWith(img);
    });
  }

  // ---------- language ----------
  // Arabic is the page's own text; the first time we switch away we keep it so we can switch back.
  var arabic = { text: new Map(), attr: new Map(), title: document.title, desc: '' };
  var descMeta = document.querySelector('meta[name="description"]');
  arabic.desc = descMeta ? descMeta.content : '';
  document.querySelectorAll('[data-i18n]').forEach(function (el) { arabic.text.set(el, el.textContent); });
  document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
    var saved = {};
    el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
      var attr = pair.split(':')[0];
      saved[attr] = el.getAttribute(attr);
    });
    arabic.attr.set(el, saved);
  });

  function lang() { return root.lang === 'en' ? 'en' : 'ar'; }
  function rtl() { return root.dir === 'rtl'; }
  function ui(key) { return BM.strings.ui[lang()][key]; }

  function money(n) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  // Pricing: BetterMe's own price and the four separate subscriptions, all from config.js.
  function renderPricing(l) {
    document.querySelectorAll('.js-price').forEach(function (el) { el.textContent = money(cfg.price.monthly); });
    document.querySelectorAll('.js-trial').forEach(function (el) { el.textContent = String(cfg.price.trialDays); });
    var rows = BM.strings.rows[l], list = document.getElementById('others'), total = 0;
    if (!list) return; // the affiliates and coaches pages have no comparison
    list.textContent = '';
    cfg.comparison.rows.forEach(function (row) {
      total += row.monthly;
      var li = document.createElement('li');
      var img = document.createElement('img');
      img.src = 'assets/cmp-' + row.key + '.webp'; img.width = 96; img.height = 96; img.alt = ''; img.loading = 'lazy';
      var name = document.createElement('span'); name.className = 'name'; name.textContent = rows[row.key];
      var price = document.createElement('s');
      var b = document.createElement('bdi'); b.dir = 'ltr'; b.textContent = money(row.monthly);
      price.append(b, ' ' + (l === 'ar' ? 'ريال' : 'SAR'));
      li.append(img, name, price);
      list.append(li);
    });
    document.querySelectorAll('.js-total').forEach(function (el) { el.textContent = money(total); });
  }

  function applyLanguage(l) {
    var en = BM.strings.static.en;
    root.lang = l;
    root.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = l === 'ar' ? arabic.text.get(el) : (en[key] != null ? en[key] : arabic.text.get(el));
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'), attr = p[0], key = p[1];
        el.setAttribute(attr, l === 'ar' ? arabic.attr.get(el)[attr] : en[key]);
      });
    });
    var toggle = document.getElementById('lang-toggle');
    toggle.setAttribute('lang', l === 'ar' ? 'en' : 'ar');
    // The home page's title and description; the other pages translate theirs through data-i18n.
    if (!document.querySelector('title[data-i18n]')) {
      document.title = l === 'ar' ? arabic.title : en['meta.title'];
      if (descMeta) descMeta.content = l === 'ar' ? arabic.desc : en['meta.description'];
    }
    // The app's own screens (dark mode), captured in each language.
    document.querySelectorAll('img[data-shot]').forEach(function (img) {
      var src = 'assets/app-' + img.getAttribute('data-shot') + '-' + l + '.webp';
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
    document.querySelectorAll('img[data-hero]').forEach(function (img) {
      var src = 'assets/hero-' + l + '.webp';
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
    // Clips recorded in the app, in each language (their source is set once they come near the screen).
    document.querySelectorAll('video[data-clip]').forEach(function (v) {
      var base = 'assets/clip-' + v.getAttribute('data-clip') + '-' + l;
      v.poster = base + '.webp';
      if (v.dataset.src && v.dataset.src !== base + '.mp4') { v.dataset.src = base + '.mp4'; v.src = v.dataset.src; v.load(); playIfShown(v); }
      else v.dataset.src = base + '.mp4';
    });
    document.querySelectorAll('img[data-clip]').forEach(function (img) {
      var src = 'assets/clip-' + img.getAttribute('data-clip') + '-' + l + (img.dataset.live ? '-anim.webp' : '.webp');
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
    document.querySelectorAll('.js-badge').forEach(function (img) {
      img.dataset.fallback = '';
      img.src = cfg.badge[l];
    });
    document.querySelectorAll('.js-legal').forEach(function (a) {
      a.href = cfg.legal[a.getAttribute('data-doc')][l];
    });
    // WhatsApp buttons open customer service with a first message in the page's language.
    document.querySelectorAll('.js-wa').forEach(function (a) {
      a.href = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(BM.strings.wa[l][a.getAttribute('data-wa')]);
    });
    renderPricing(l);
    if (highlights) highlights.relabel();
    root.classList.remove('i18n-pending');
  }

  function setLanguage(l) {
    try { localStorage.setItem('bm-lang', l); } catch (e) {}
    try {
      var url = new URL(location.href);
      if (l === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    } catch (e) {}
    applyLanguage(l);
    if (highlights) highlights.go(0);
    BM.relayout();
  }

  // ---------- links from the central config ----------
  document.querySelectorAll('.js-store').forEach(function (a) { a.href = cfg.appStoreUrl; });
  document.querySelectorAll('.js-social').forEach(function (a) { a.href = cfg.social[a.getAttribute('data-net')]; });
  document.querySelectorAll('.js-badge').forEach(function (img) {
    img.addEventListener('error', function () {
      // Arabic badge unavailable: use Apple's English badge rather than a broken image.
      if (img.dataset.fallback) return;
      img.dataset.fallback = '1';
      img.src = cfg.badge.en;
    });
  });

  // ---------- TikTok on an iPhone ----------
  // TikTok refuses App Store links from a tap («Action can't be completed»; its rule for personal accounts since 2023) and
  // refuses Safari too (x-safari-, tried 2026-11-12). Pressing and holding a link still gives iOS's own menu, whose «Open
  // Link» opens it in Safari. So there a download button opens a sheet with one button to press and hold.
  var ua = navigator.userAgent, holdSheet = document.getElementById('hold');
  if (holdSheet && /musical_ly|Bytedance|TikTok/i.test(ua) && /iPhone|iPad|iPod/.test(ua)) {
    root.classList.add('tiktok');
    var holdLink = holdSheet.querySelector('.js-hold-link'), holdOpener = null;
    holdLink.href = cfg.appStoreUrl;
    var openHold = function (from) {
      holdOpener = from;
      root.classList.add('hold-open');
      holdSheet.classList.add('open');
      holdSheet.querySelector('.hold-sheet').focus({ preventScroll: true });
    };
    var closeHold = function () {
      root.classList.remove('hold-open');
      holdSheet.classList.remove('open');
      if (holdOpener) holdOpener.focus({ preventScroll: true });
    };
    document.querySelectorAll('.js-store').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); openHold(a); });
    });
    holdSheet.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closeHold); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && holdSheet.classList.contains('open')) closeHold(); });
    // A plain tap would be refused again, so it shakes the button instead.
    holdLink.addEventListener('click', function (e) {
      e.preventDefault();
      holdLink.classList.remove('nudge');
      void holdLink.offsetWidth;
      holdLink.classList.add('nudge');
    });
  }

  // ---------- clips: load near the screen, play only while on it (never with Reduce Motion) ----------
  var shown = new WeakMap();
  function playIfShown(v) {
    if (!shown.get(v) || BM.reduced()) return;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        shown.set(v, en.isIntersecting);
        if (en.isIntersecting) {
          if (!v.getAttribute('src') && v.dataset.src) { v.src = v.dataset.src; v.preload = 'auto'; }
          playIfShown(v);
        } else if (!v.paused) v.pause();
      });
    }, { rootMargin: '200px 0px' });
    document.querySelectorAll('video[data-clip]').forEach(function (v) { io.observe(v); });
    // The animated clips (in-app browsers) all start as their row comes near, so the next tile is already moving.
    var clipImgs = document.querySelectorAll('img[data-clip]');
    if (clipImgs.length && !BM.reduced()) {
      var ioImg = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        ioImg.disconnect();
        clipImgs.forEach(function (img) {
          img.dataset.live = '1';
          img.src = 'assets/clip-' + img.getAttribute('data-clip') + '-' + lang() + '-anim.webp';
        });
      }, { rootMargin: '300px 0px' });
      ioImg.observe(clipImgs[0].closest('section') || clipImgs[0]);
    }
  }

  // ---------- highlights: a swipeable row that moves on by itself while it is on screen ----------
  // Each dot fills over a few seconds and then the next tile slides in; the button pauses it. Never with Reduce Motion.
  var highlights = (function () {
    var sec = document.querySelector('.highlights');
    if (!sec) return null;
    var trackEl = sec.querySelector('.hl-track'), tiles = Array.prototype.slice.call(trackEl.children);
    var dotsEl = sec.querySelector('.hl-dots'), btn = sec.querySelector('.hl-play');
    var current = -1, inView = false, paused = false, auto = !BM.reduced(), quietUntil = 0;
    if (!auto) sec.classList.add('static');

    var dots = tiles.map(function (tile, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.appendChild(document.createElement('i'));
      b.addEventListener('click', function () { go(i); });
      b.firstChild.addEventListener('animationend', function () { if (i === current) go((current + 1) % tiles.length); });
      dotsEl.appendChild(b);
      return b;
    });

    function setActive(i) {
      if (i === current) return;
      current = i;
      dots.forEach(function (d, k) {
        var on = k === i;
        d.classList.toggle('on', on);
        d.setAttribute('aria-current', on ? 'true' : 'false');
        // Restart the fill of the dot that just became current.
        var bar = d.firstChild;
        bar.style.animation = 'none';
        void bar.offsetWidth;
        bar.style.animation = '';
      });
    }

    function edgeDistance(tile) {
      var tr = trackEl.getBoundingClientRect(), r = tile.getBoundingClientRect();
      var pad = parseFloat(getComputedStyle(trackEl).scrollPaddingInlineStart) || 0;
      return rtl() ? r.right - (tr.right - pad) : r.left - (tr.left + pad);
    }

    // A tap on a dot shows that tile (and keeps the row paused if it was).
    function go(i) {
      quietUntil = Date.now() + 900;
      trackEl.scrollBy({ left: edgeDistance(tiles[i]), behavior: BM.reduced() || !inView ? 'auto' : 'smooth' });
      setActive(i);
    }

    // Swiping by hand: the dot follows the tile nearest the start edge (at the far end, keep the one chosen).
    var raf = 0;
    trackEl.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        if (Date.now() < quietUntil) return;
        var best = 0, bd = Infinity;
        tiles.forEach(function (t, k) { var d = Math.abs(edgeDistance(t)); if (d < bd) { bd = d; best = k; } });
        var atEnd = Math.abs(Math.abs(trackEl.scrollLeft) - (trackEl.scrollWidth - trackEl.clientWidth)) < 2;
        if (atEnd && current > best) return;
        setActive(best);
      });
    }, { passive: true });

    function sync() {
      var on = auto && inView && !paused && !document.hidden;
      sec.classList.toggle('playing', on);
      sec.classList.toggle('paused', paused);
    }
    btn.addEventListener('click', function () {
      paused = !paused;
      relabel();
      sync();
    });
    function relabel() {
      btn.setAttribute('aria-label', paused ? ui('play') : ui('pause'));
      dots.forEach(function (d, k) { d.setAttribute('aria-label', ui('dot') + ' ' + (k + 1)); });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.4 }).observe(trackEl);
    }
    document.addEventListener('visibilitychange', sync);
    setActive(0);
    relabel();
    sync();
    return { go: go, relabel: relabel };
  })();

  // ---------- start ----------
  applyLanguage(lang());
  BM.initMotion();
  document.getElementById('lang-toggle').addEventListener('click', function () {
    setLanguage(lang() === 'ar' ? 'en' : 'ar');
  });

  var lastW = window.innerWidth, timer = null;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (Math.abs(window.innerWidth - lastW) < 2) return;
      lastW = window.innerWidth;
      BM.relayout();
    }, 150);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { BM.relayout(); });
})();
