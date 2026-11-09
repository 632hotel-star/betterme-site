/*
 * Scroll-driven motion (no library). Everything moves with the scroll and plays backwards when you scroll back:
 * nothing waits on a timer and nothing hides content from people who use Reduce Motion (they get the finished page).
 * A track is read(vh) → a target from 0 to 1, and write(p) → styles; a light follow keeps touch scrolls smooth.
 */
(function () {
  'use strict';
  var BM = window.BM, root = document.documentElement;

  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  BM.reduced = function () { return reduceQuery.matches; };
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function seg(p, a, b) { return clamp((p - a) / (b - a)); }
  function out(t) { return 1 - Math.pow(1 - t, 3); }
  // Progress of an element's top through [start, end] (fractions of the screen height, start below end).
  function through(el, vh, start, end) {
    var top = el.getBoundingClientRect().top;
    return clamp((vh * start - top) / (vh * (start - end)));
  }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function smooth(t) { return t * t * (3 - 2 * t); }
  function rtl() { return root.dir === 'rtl'; }

  var tracks = [], layouts = [];
  function track(read, write) { tracks.push({ read: read, write: write, cur: null, last: null }); }

  var ticking = false;
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  // Read every position first, then write, so a frame never forces layout twice.
  function frame() {
    ticking = false;
    var vh = root.clientHeight || window.innerHeight;
    var targets = tracks.map(function (t) { return t.read(vh); });
    var moving = false;
    tracks.forEach(function (t, i) {
      var tg = targets[i];
      if (t.cur == null || Math.abs(tg - t.cur) < 0.001) t.cur = tg;
      else { t.cur += (tg - t.cur) * 0.22; moving = true; }
      if (t.cur !== t.last) { t.last = t.cur; t.write(t.cur); }
    });
    if (moving) schedule();
  }

  // ---------- the page's motion ----------
  // The headline lifts away and the phone settles back a little as the page starts to move.
  function hero() {
    var copy = document.querySelector('.hero-copy'), phone = document.querySelector('.hero-phone');
    if (!copy || !phone) return;
    track(function (vh) { return clamp(window.scrollY / vh); }, function (p) {
      copy.style.opacity = p ? String(clamp(1 - p * 1.8)) : '';
      copy.style.transform = p ? 'translate3d(0,' + (-p * 60).toFixed(1) + 'px,0)' : '';
      phone.style.transform = p ? 'translate3d(0,' + (-p * 6).toFixed(2) + 'vh,0) scale(' + (1 - p * 0.07).toFixed(4) + ')' : '';
    });
  }

  // Headlines and panels rise into place as they come up the screen.
  function reveals() {
    each('[data-reveal]', function (el) {
      var d = (Number(el.getAttribute('data-delay')) || 0) * 0.05;
      track(function (vh) { return through(el, vh, 0.98 - d, 0.7 - d); }, function (p) {
        var e = out(p);
        el.style.opacity = p >= 1 ? '' : String(e);
        el.style.transform = p >= 1 ? '' : 'translate3d(0,' + ((1 - e) * 40).toFixed(1) + 'px,0)';
      });
    });
  }

  // The app's screens grow up into place, the way a product rises onto an Apple page.
  function rises() {
    each('[data-rise]', function (fig) {
      var dev = fig.querySelector('.device');
      track(function (vh) { return through(fig, vh, 1.02, 0.42); }, function (p) {
        var e = out(p);
        dev.style.opacity = p >= 1 ? '' : String(0.2 + 0.8 * e);
        dev.style.transform = p >= 1 ? '' : 'translate3d(0,' + ((1 - e) * 110).toFixed(1) + 'px,0) scale(' + (0.86 + 0.14 * e).toFixed(4) + ')';
      });
    });
  }

  // Icon rows: each icon comes in after the one before it.
  function staggers() {
    each('[data-stagger]', function (list) {
      var items = Array.prototype.slice.call(list.children), n = items.length;
      track(function (vh) { return through(list, vh, 0.98, 0.7); }, function (p) {
        items.forEach(function (li, k) {
          var a = (k / n) * 0.6, t = out(seg(p, a, a + 0.4));
          li.style.opacity = t >= 1 ? '' : String(t);
          li.style.transform = t >= 1 ? '' : 'translate3d(0,' + ((1 - t) * 22).toFixed(1) + 'px,0) scale(' + (0.8 + 0.2 * t).toFixed(4) + ')';
        });
      });
    });
  }

  // 0 → 566 videos. Last week's set and today's: today's bar grows past it, 80 → 82.5 kg, then the +2.5 kg shows.
  function counters() {
    var count = document.querySelector('.js-count');
    if (count) {
      var to = Number(count.getAttribute('data-to'));
      track(function (vh) { return through(count, vh, 0.98, 0.6); }, function (p) {
        count.textContent = String(Math.round(lerp(0, to, out(p))));
      });
    }
    var log = document.querySelector('.lift-log');
    if (log) {
      var now = log.querySelector('.lift-row.now'), kg = log.querySelector('.js-lift');
      track(function (vh) { return through(log, vh, 0.95, 0.5); }, function (p) {
        var e = out(p);
        now.style.setProperty('--grow', lerp(0.68, 0.86, e).toFixed(4));
        kg.textContent = (Math.round(lerp(80, 82.5, e) * 2) / 2).toFixed(1);
        log.style.setProperty('--up', seg(p, 0.8, 1).toFixed(3));
      });
    }
  }

  // Progress: the weight line draws itself while the number moves from the first weigh-in to today's.
  function journey() {
    var cell = document.querySelector('.cell-weight');
    if (!cell) return;
    var num = cell.querySelector('.js-weight'), chart = cell.querySelector('.growth');
    var from = Number(num.getAttribute('data-from')), to = Number(num.getAttribute('data-to'));
    track(function (vh) { return through(cell, vh, 0.92, 0.42); }, function (p) {
      num.textContent = lerp(from, to, out(p)).toFixed(1);
      chart.style.setProperty('--draw', (1 - p).toFixed(4));
    });
  }

  // The app's streak coins light up one after another.
  function levels() {
    var row = document.querySelector('.streak-row');
    if (row) {
      var coins = row.querySelectorAll('.sk'), n = coins.length;
      track(function (vh) { return through(row, vh, 0.92, 0.55); }, function (p) {
        coins.forEach(function (li, k) { li.classList.toggle('lit', p >= (k + 1) / n - 0.001); });
      });
    }
  }

  // The four levels. Phones: the scene pins and the row slides sideways with the scroll; the level in the middle is
  // full size and the others shrink and fade, with a short rest on each one. Wide screens: they rise in turn.
  function lineup() {
    var stage = document.querySelector('.lineup-stage'), row = stage && stage.querySelector('.lineup');
    if (!row) return;
    var people = Array.prototype.slice.call(row.children), m = people.length;
    var phone = window.matchMedia('(max-width: 899px)'), slot = 0, dist = 1;
    layouts.push(function () {
      row.style.transform = '';
      people.forEach(function (li) { li.style.transform = ''; li.style.opacity = ''; });
      slot = 0;
      if (!phone.matches) { stage.style.removeProperty('--dist'); return; }
      slot = Math.abs(people[1].getBoundingClientRect().left - people[0].getBoundingClientRect().left);
      dist = (m - 1) * (root.clientHeight || window.innerHeight) * 0.75;
      stage.style.setProperty('--dist', dist + 'px');
    });
    track(function (vh) {
      return slot ? clamp(-stage.getBoundingClientRect().top / dist) : through(row, vh, 1, 0.45);
    }, function (p) {
      if (slot) {
        var raw = p * (m - 1), k = Math.min(m - 2, Math.floor(raw));
        var pos = k + smooth(clamp((raw - k - 0.2) / 0.6));
        row.style.transform = 'translate3d(' + (pos * slot * (rtl() ? 1 : -1)).toFixed(1) + 'px,0,0)';
        people.forEach(function (li, i) {
          var d = Math.min(1, Math.abs(i - pos));
          li.style.transform = 'scale(' + (1 - d * 0.42).toFixed(4) + ')';
          li.style.opacity = String((1 - d * 0.6).toFixed(3));
        });
        return;
      }
      people.forEach(function (li, i) {
        var a = (i / m) * 0.55, t = out(seg(p, a, a + 0.45));
        li.style.opacity = t >= 1 ? '' : String(t);
        li.style.transform = t >= 1 ? '' : 'translate3d(0,' + ((1 - t) * 70).toFixed(1) + 'px,0)';
      });
    });
  }

  // Steps: the line fills as you read and each step lights when the line reaches it.
  function steps() {
    each('.steps', function (list) {
      var items = list.querySelectorAll('.step'), fill = list.querySelector('.steps-fill'), n = items.length;
      track(function (vh) { return through(list, vh, 0.75, 0.3); }, function (p) {
        fill.style.setProperty('--p', p.toFixed(4));
        items.forEach(function (li, k) { li.classList.toggle('on', p >= k / Math.max(1, n - 1) - 0.001); });
      });
    });
  }

  // Two weeks: the fourteen days fill one by one, then the payout.
  function period() {
    var box = document.querySelector('.period');
    if (!box) return;
    var days = box.querySelectorAll('i'), n = days.length;
    track(function (vh) { return through(box, vh, 0.95, 0.5); }, function (p) {
      days.forEach(function (d, k) { d.classList.toggle('on', p >= (k + 1) / n - 0.001); });
    });
  }

  // The affiliate link's journey: the scene pins and the scroll plays its five scenes in turn (link, tap, download,
  // subscription, dashboard). The scenes sit in one row that slides to the next scene in the reading direction; the rail
  // fills to the current one, and each scene plays its own movement (--t, read by the CSS) before the row moves on.
  function flow() {
    var stage = document.querySelector('.flow');
    if (!stage) return;
    var row = stage.querySelector('.flow-scenes'), scenes = Array.prototype.slice.call(row.children), n = scenes.length;
    var nodes = stage.querySelectorAll('.flow-rail > li:not(.flow-fill)'), fill = stage.querySelector('.flow-fill');
    var counts = stage.querySelectorAll('.js-fv-n'), dist = 1, slot = 0;
    layouts.push(function () {
      row.style.transform = '';
      slot = Math.abs(scenes[1].getBoundingClientRect().left - scenes[0].getBoundingClientRect().left);
      dist = n * 0.75 * (root.clientHeight || window.innerHeight);
      stage.style.setProperty('--dist', dist + 'px');
    });
    track(function () { return clamp(-stage.getBoundingClientRect().top / dist); }, function (p) {
      var raw = p * n, k = Math.min(n - 1, Math.floor(raw));
      var pos = k >= n - 1 ? n - 1 : k + smooth(seg(raw - k, 0.8, 1));
      row.style.transform = 'translate3d(' + (pos * slot * (rtl() ? 1 : -1)).toFixed(1) + 'px,0,0)';
      fill.style.setProperty('--p', (pos / (n - 1)).toFixed(4));
      nodes.forEach(function (li, i) { li.classList.toggle('on', pos >= i - 0.5); });
      scenes.forEach(function (sc, i) {
        var d = Math.min(1, Math.abs(i - pos));
        sc.style.opacity = (1 - d * 0.8).toFixed(3);
        sc.style.transform = d ? 'scale(' + (1 - d * 0.08).toFixed(4) + ')' : '';
        sc.style.setProperty('--t', seg(raw - i, 0.04, 0.7).toFixed(4));
      });
      var last = seg(raw - (n - 1), 0.04, 0.7);
      counts.forEach(function (b) { b.textContent = b.getAttribute(last >= 0.55 ? 'data-to' : 'data-from'); });
    });
  }

  // Measure, then move everything to the current scroll position at once.
  BM.relayout = function () {
    layouts.forEach(function (fn) { fn(); });
    tracks.forEach(function (t) { t.cur = null; t.last = null; });
    frame();
  };

  BM.initMotion = function () {
    if (!BM.reduced()) {
      hero(); reveals(); rises(); staggers(); counters(); journey(); levels(); lineup(); steps(); period(); flow();
    }
    window.addEventListener('scroll', schedule, { passive: true });
    BM.relayout();
    // Reduce Motion switched on or off while the page is open: start again from a clean page.
    if (reduceQuery.addEventListener) reduceQuery.addEventListener('change', function () { location.reload(); });
  };
})();
