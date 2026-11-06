(function () {
  'use strict';
  var BM = window.BM, root = document.documentElement;
  var cfg = BM.config;

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

  function money(n) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  // Pricing: BetterMe's own price and the four separate subscriptions, all from config.js.
  function renderPricing(l) {
    var rows = BM.strings.rows[l], list = document.getElementById('others'), total = 0;
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
    document.querySelectorAll('.js-price').forEach(function (el) { el.textContent = money(cfg.price.monthly); });
    document.querySelectorAll('.js-trial').forEach(function (el) { el.textContent = String(cfg.price.trialDays); });
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
    document.title = l === 'ar' ? arabic.title : en['meta.title'];
    if (descMeta) descMeta.content = l === 'ar' ? arabic.desc : en['meta.description'];
    // The app's own screens, captured in each language.
    document.querySelectorAll('img[data-shot]').forEach(function (img) {
      var src = 'assets/app-' + img.getAttribute('data-shot') + '-' + l + '.webp';
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
    // Clips recorded in the app, in each language (their source is set once they come near the screen).
    document.querySelectorAll('video[data-clip]').forEach(function (v) {
      var base = 'assets/clip-' + v.getAttribute('data-clip') + '-' + l;
      v.poster = base + '.webp';
      if (v.dataset.src && v.dataset.src !== base + '.mp4') { v.dataset.src = base + '.mp4'; v.src = v.dataset.src; v.load(); playIfShown(v); }
      else v.dataset.src = base + '.mp4';
    });
    document.querySelectorAll('.js-badge').forEach(function (img) {
      img.dataset.fallback = '';
      img.src = cfg.badge[l];
    });
    document.querySelectorAll('.js-legal').forEach(function (a) {
      a.href = cfg.legal[a.getAttribute('data-doc')][l];
    });
    renderPricing(l);
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
  }

  // ---------- header ----------
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- start ----------
  applyLanguage(lang());
  BM.initMotion();
  document.getElementById('lang-toggle').addEventListener('click', function () {
    setLanguage(lang() === 'ar' ? 'en' : 'ar');
  });

  // The sideways track measures itself: measure again when the width changes or the fonts arrive.
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
