/*
 * Scroll-driven motion (no library). Each example ("scene") is a timeline from 0 to 1 that follows the scroll:
 * it starts as the example's top enters the screen and is finished once the whole example is in view. Scrolling
 * back plays it backwards. Nothing is pinned and nothing waits on a timer, so the page scrolls normally.
 *   render(stage)       builds the finished state (also what Reduce Motion shows);
 *   timeline(stage, T)  adds tracks: small functions of progress that move the example between its first frame
 *                       (progress 0) and the finished state (progress 1).
 */
(function () {
  'use strict';
  var BM = window.BM;

  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  BM.reduced = function () { return reduceQuery.matches; };

  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  BM.clamp = clamp;
  BM.lerp = function (a, b, t) { return a + (b - a) * t; };
  // Progress of `p` through the slice [a, b].
  BM.seg = function (p, a, b) { return a === b ? (p >= a ? 1 : 0) : clamp((p - a) / (b - a)); };
  BM.ease = {
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    inOut: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  };

  // ---------- small DOM helpers ----------
  BM.h = function (tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null) continue;
        if (k === 'class') el.className = attrs[k];
        else if (k === 'text') el.textContent = attrs[k];
        else if (k === 'html') el.innerHTML = attrs[k];
        else el.setAttribute(k, attrs[k]);
      }
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x != null) el.append(x); });
      else el.append(c);
    }
    return el;
  };
  BM.svg = function (tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, attrs[k]);
    for (var i = 2; i < arguments.length; i++) if (arguments[i]) el.append(arguments[i]);
    return el;
  };
  BM.fmt = function (n, decimals) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals || 0, maximumFractionDigits: decimals || 0 });
  };
  BM.lang = function () { return document.documentElement.lang === 'en' ? 'en' : 'ar'; };
  BM.t = function (key) { return BM.strings.demo[BM.lang()][key]; };
  BM.dir = function () { return document.documentElement.dir === 'rtl' ? -1 : 1; };

  // ---------- timeline ----------
  function Timeline() { this.tracks = []; }
  // Raw track: fn(t, p) with t = progress through [a, b] (0..1) and p = the scene's progress.
  Timeline.prototype.fn = function (a, b, fn) { this.tracks.push({ a: a, b: b, fn: fn }); return this; };
  // Fades in while sliding/scaling into place.
  Timeline.prototype.fade = function (el, a, b, o) {
    o = o || {};
    var x = o.x || 0, y = o.y == null ? 12 : o.y, s = o.scale == null ? 1 : o.scale;
    return this.fn(a, b, function (t) {
      var e = BM.ease.out(t);
      el.style.opacity = t >= 1 ? '' : String(t);
      el.style.transform = t >= 1 ? '' : 'translate(' + (x * (1 - e)) + 'px,' + (y * (1 - e)) + 'px) scale(' + (s + (1 - s) * e) + ')';
    });
  };
  Timeline.prototype.count = function (el, a, b, from, to, decimals, suffix) {
    return this.fn(a, b, function (t) {
      el.textContent = BM.fmt(BM.lerp(from, to, BM.ease.out(t)), decimals || 0) + (suffix || '');
    });
  };
  // Text entered the way a person types it (by grapheme, so Arabic shaping stays right).
  Timeline.prototype.type = function (el, a, b, text) {
    var chars = Array.from(text);
    return this.fn(a, b, function (t) { el.textContent = chars.slice(0, Math.round(chars.length * t)).join(''); });
  };
  // Class on from `at` onwards (or until `at` when `before` is true).
  Timeline.prototype.cls = function (el, cls, at, before) {
    return this.fn(at, at, function (t) { el.classList.toggle(cls, before ? t < 1 : t >= 1); });
  };
  // Swaps a value with a short vertical roll around `at`.
  Timeline.prototype.swap = function (el, at, before, after, w) {
    w = w || 0.025;
    return this.fn(at - w, at + w, function (t) {
      var k;
      if (t < 0.5) {
        k = t / 0.5;
        el.textContent = before;
        el.style.transform = k ? 'translateY(' + (-40 * k) + '%)' : '';
        el.style.opacity = k ? String(1 - k) : '';
      } else {
        k = (t - 0.5) / 0.5;
        el.textContent = after;
        el.style.transform = k < 1 ? 'translateY(' + (40 * (1 - k)) + '%)' : '';
        el.style.opacity = k < 1 ? String(k) : '';
      }
    });
  };
  // Draws a check-mark path.
  Timeline.prototype.draw = function (path, a, b) {
    return this.fn(a, b, function (t) { path.style.strokeDashoffset = String(16 * (1 - t)); });
  };
  Timeline.prototype.apply = function (p) {
    for (var i = 0; i < this.tracks.length; i++) {
      var k = this.tracks[i];
      k.fn(BM.seg(p, k.a, k.b), p);
    }
  };
  BM.Timeline = Timeline;

  // ---------- scenes ----------
  var scenes = [];
  BM.scenes = BM.scenes || {};
  BM.onScroll = [];

  function Scene(el, def) {
    this.el = el;
    this.def = def;
    this.stage = el.querySelector('.stage');
    if (!this.stage) { this.stage = BM.h('div', { class: 'stage' }); el.append(this.stage); }
    this.build();
  }
  Scene.prototype.build = function () {
    this.def.render(this.stage);
    this.tl = null;
    if (!BM.reduced() && this.def.timeline) {
      this.tl = new Timeline();
      this.def.timeline(this.stage, this.tl);
    }
    this.p = null;
    this.cur = null;
  };
  // 0 when the example's top is near the bottom of the screen, 1 once all of it is in view.
  Scene.prototype.target = function (vh) {
    var r = this.el.getBoundingClientRect();
    var start = vh * 0.88;
    var end = Math.min(vh * 0.92 - r.height, start - vh * 0.45);
    return clamp((start - r.top) / (start - end));
  };
  Scene.prototype.set = function (p) {
    if (!this.tl || p === this.p) return;
    this.p = p;
    this.stage._p = p;
    this.tl.apply(p);
  };

  var ticking = false;
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  // Read every position first, then write, so a frame never forces layout twice.
  function frame() {
    ticking = false;
    var vh = document.documentElement.clientHeight || window.innerHeight;
    var targets = scenes.map(function (s) { return s.tl ? s.target(vh) : 1; });
    var moving = false;
    scenes.forEach(function (s, i) {
      if (!s.tl) return;
      var tg = targets[i];
      // A light follow so a trackpad flick or a touch scroll still reads as smooth motion.
      if (s.cur == null || Math.abs(tg - s.cur) < 0.002) s.cur = tg;
      else { s.cur += (tg - s.cur) * 0.24; moving = true; }
      s.set(s.cur);
    });
    var y = window.scrollY;
    BM.onScroll.forEach(function (fn) { fn(y); });
    if (moving) schedule();
  }

  // Recompute every example now (also handy from the console).
  BM.refresh = frame;

  BM.initScenes = function () {
    document.querySelectorAll('[data-scene]').forEach(function (el) {
      var def = BM.scenes[el.getAttribute('data-scene')];
      if (def) scenes.push(new Scene(el, def));
    });
    window.addEventListener('scroll', schedule, { passive: true });
    reduceQuery.addEventListener && reduceQuery.addEventListener('change', BM.rebuildScenes);
    frame();
  };

  // Language switch or a real width change: rebuild every example and jump straight to the scroll position.
  BM.rebuildScenes = function () {
    scenes.forEach(function (s) { s.build(); });
    frame();
  };
})();
