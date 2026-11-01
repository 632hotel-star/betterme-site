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

  function applyLanguage(lang) {
    var en = BM.strings.static.en;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = lang === 'ar' ? arabic.text.get(el) : (en[key] != null ? en[key] : arabic.text.get(el));
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'), attr = p[0], key = p[1];
        el.setAttribute(attr, lang === 'ar' ? arabic.attr.get(el)[attr] : en[key]);
      });
    });
    var toggle = document.getElementById('lang-toggle');
    toggle.setAttribute('lang', lang === 'ar' ? 'en' : 'ar');
    document.title = lang === 'ar' ? arabic.title : en['meta.title'];
    if (descMeta) descMeta.content = lang === 'ar' ? arabic.desc : en['meta.description'];
    document.querySelectorAll('.js-badge').forEach(function (img) {
      img.dataset.fallback = '';
      img.src = cfg.badge[lang];
    });
    document.querySelectorAll('.js-legal').forEach(function (a) {
      a.href = cfg.legal[a.getAttribute('data-doc')][lang];
    });
    root.classList.remove('i18n-pending');
  }

  function setLanguage(lang) {
    try { localStorage.setItem('bm-lang', lang); } catch (e) {}
    try {
      var url = new URL(location.href);
      if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    } catch (e) {}
    applyLanguage(lang);
    BM.rebuildScenes();
    requestAnimationFrame(refreshIndicators);
  }

  // ---------- links from the central config ----------
  document.querySelectorAll('.js-store').forEach(function (a) { a.href = cfg.appStoreUrl; });
  document.querySelectorAll('.js-badge').forEach(function (img) {
    img.addEventListener('error', function () {
      // Arabic badge unavailable: use Apple's English badge rather than a broken image.
      if (img.dataset.fallback) return;
      img.dataset.fallback = '1';
      img.src = cfg.badge.en;
    });
  });

  // ---------- header ----------
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- segmented controls keep their pill under the selected item ----------
  function refreshIndicators() {
    document.querySelectorAll('.seg').forEach(function (g) { BM.moveIndicator(g); });
  }

  // ---------- start ----------
  applyLanguage(BM.lang());
  BM.initScenes();
  document.getElementById('lang-toggle').addEventListener('click', function () {
    setLanguage(BM.lang() === 'ar' ? 'en' : 'ar');
  });

  // Examples measure their layout (chart size, photo stack, panel heights): rebuild them when the width changes.
  var lastW = window.innerWidth, timer = null;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      refreshIndicators();
      if (Math.abs(window.innerWidth - lastW) < 40) return;
      lastW = window.innerWidth;
      BM.rebuildScenes();
    }, 180);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshIndicators);
})();
