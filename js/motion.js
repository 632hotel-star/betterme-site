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
  function out(t) { return 1 - Math.pow(1 - t, 3); }
  // Progress of an element's top through [start, end] (fractions of the screen height, start below end).
  function through(el, vh, start, end) {
    var top = el.getBoundingClientRect().top;
    return clamp((vh * start - top) / (vh * (start - end)));
  }
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
    root.classList.toggle('scrolled-down', window.scrollY > 40);
    if (moving) schedule();
  }

  // ---------- the page's motion ----------
  function hero() {
    var statue = document.querySelector('.hero-statue'), copy = document.querySelector('.hero-copy');
    if (!statue || !copy) return;
    track(function (vh) { return clamp(window.scrollY / vh); }, function (p) {
      statue.style.transform = p ? 'translate3d(0,' + (p * 16).toFixed(2) + 'vh,0) scale(' + (1 + p * 0.06).toFixed(4) + ')' : '';
      copy.style.opacity = p ? String(clamp(1 - p * 1.6)) : '';
      copy.style.transform = p ? 'translate3d(0,' + (-p * 64).toFixed(1) + 'px,0)' : '';
    });
  }

  // The five tabs: the band pins for as long as the track needs to pan from the first screen to the last.
  function tour() {
    var section = document.querySelector('.tour'), trackEl = section && section.querySelector('.tour-track');
    if (!trackEl) return;
    var shots = Array.prototype.slice.call(trackEl.children), travel = 0, step = 1;
    layouts.push(function () {
      trackEl.style.transform = '';
      var a = shots[0].getBoundingClientRect(), b = shots[shots.length - 1].getBoundingClientRect();
      travel = Math.abs(b.left - a.left);
      step = travel / Math.max(1, shots.length - 1);
      section.style.setProperty('--travel', travel + 'px');
    });
    track(function () { return travel ? clamp(-section.getBoundingClientRect().top / travel) : 0; }, function (p) {
      var x = p * travel * (rtl() ? 1 : -1);
      trackEl.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      shots.forEach(function (s, i) {
        var d = Math.min(1, Math.abs(i * step - p * travel) / step);
        s.style.transform = 'scale(' + (1 - d * 0.08).toFixed(4) + ')';
        s.style.opacity = String(1 - d * 0.5);
      });
    });
  }

  // Headlines, tiles and panels rise into place as they come up the screen.
  function reveals() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      var d = (Number(el.getAttribute('data-delay')) || 0) * 0.05;
      track(function (vh) { return through(el, vh, 0.98 - d, 0.66 - d); }, function (p) {
        var e = out(p);
        el.style.opacity = p >= 1 ? '' : String(e);
        el.style.transform = p >= 1 ? '' : 'translate3d(0,' + ((1 - e) * 36).toFixed(1) + 'px,0)';
      });
    });
    // Screens inside the tiles slide up a little later than their tile.
    document.querySelectorAll('.peek').forEach(function (el) {
      var tile = el.closest('.tile');
      track(function (vh) { return through(tile, vh, 0.9, 0.4); }, function (p) {
        el.style.transform = p >= 1 ? '' : 'translate3d(0,' + ((1 - out(p)) * 70).toFixed(1) + 'px,0)';
      });
    });
  }

  // 0 → 566 clips, and the rest timer running from 3:00 down to 2:19, as their tiles come in.
  function counters() {
    var count = document.querySelector('.js-count'), timer = document.querySelector('.js-timer');
    if (count) {
      var to = Number(count.getAttribute('data-to'));
      track(function (vh) { return through(count, vh, 0.98, 0.74); }, function (p) {
        count.textContent = String(Math.round(lerp(0, to, out(p))));
      });
    }
    if (timer) {
      track(function (vh) { return through(timer, vh, 0.95, 0.45); }, function (p) {
        var s = Math.round(lerp(180, 139, p));
        timer.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
      });
    }
  }

  // The gold line climbs the four levels; the statue in flames drifts the way he is running.
  function levels() {
    var ladder = document.querySelector('.ladder'), statue = document.querySelector('.levels-statue');
    var section = document.querySelector('.levels');
    if (ladder) {
      var steps = ladder.querySelectorAll('li');
      track(function (vh) { return through(ladder, vh, 0.9, 0.5); }, function (p) {
        ladder.style.setProperty('--fill', p.toFixed(4));
        steps.forEach(function (li, i) { li.classList.toggle('on', p > 0.02 && p >= i / (steps.length - 1) - 0.001); });
      });
    }
    if (statue && section) {
      track(function (vh) {
        var r = section.getBoundingClientRect();
        return clamp((vh - r.top) / (vh + r.height));
      }, function (p) {
        statue.style.transform = 'translate3d(' + ((p - 0.5) * 120 * (rtl() ? 1 : -1)).toFixed(1) + 'px,0,0)';
      });
    }
  }

  function ending() {
    var statue = document.querySelector('.end-statue'), art = document.querySelector('.end-art');
    if (!statue) return;
    track(function (vh) { return through(art, vh, 1, 0.55); }, function (p) {
      var e = out(p);
      statue.style.transform = p >= 1 ? '' : 'translate3d(0,' + ((1 - e) * 90).toFixed(1) + 'px,0)';
      statue.style.opacity = p >= 1 ? '' : String(0.25 + 0.75 * e);
    });
  }

  // Measure (track widths), then move everything to the current scroll position at once.
  BM.relayout = function () {
    layouts.forEach(function (fn) { fn(); });
    tracks.forEach(function (t) { t.cur = null; t.last = null; });
    frame();
  };

  BM.initMotion = function () {
    if (!BM.reduced()) {
      hero(); tour(); reveals(); counters(); levels(); ending();
    }
    window.addEventListener('scroll', schedule, { passive: true });
    BM.relayout();
    // Reduce Motion switched on or off while the page is open: start again from a clean page.
    if (reduceQuery.addEventListener) reduceQuery.addEventListener('change', function () { location.reload(); });
  };
})();
