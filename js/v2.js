/*
 * The 2026-11-19 look: gives every 3-D phone its edge (thin titanium copies stacked behind the front, and the side
 * buttons) and moves the hero trio with the scroll. Reduce Motion keeps them still.
 */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  // ---------- the phones' edge ----------
  function edges() {
    document.querySelectorAll('.iph:not(.flat)').forEach(function (ph) {
      ph.querySelectorAll('.iph-l').forEach(function (l) { l.remove(); });
      var w = ph.offsetWidth, depth = w * 0.085, n = Math.max(6, Math.round(depth / 1.6));
      var front = ph.querySelector('.iph-front');
      for (var k = n; k >= 1; k--) {
        var l = document.createElement('i');
        l.className = 'iph-l' + (k > n * 0.7 ? ' deep' : '');
        l.style.transform = 'translateZ(' + (-k * depth / n).toFixed(2) + 'px)';
        if (k === Math.round(n / 2)) {
          ['r1', 'l1', 'l2', 'l3'].forEach(function (c) { var b = document.createElement('i'); b.className = 'iph-btn ' + c; l.appendChild(b); });
        }
        ph.insertBefore(l, front);
      }
    });
  }

  // ---------- scroll ----------
  var ticking = false;
  function frame() {
    ticking = false;
    var still = reduce.matches;
    document.querySelectorAll('.trio').forEach(function (t) {
      var p = still ? 0 : clamp(window.scrollY / (window.innerHeight * 0.9));
      t.style.setProperty('--lift', (p * 60).toFixed(1));
    });
    // the food row: the side phones slide out from behind the middle one as the row comes up (2026-11-23)
    var vh = window.innerHeight;
    document.querySelectorAll('.row3').forEach(function (row) {
      var mid = row.querySelector('.r3-mid'), sides = row.querySelectorAll('.r3-a, .r3-b');
      if (still) { sides.forEach(function (el) { el.style.transform = ''; }); mid.style.transform = ''; return; }
      var r = row.getBoundingClientRect(), p = clamp((vh * 0.95 - r.top) / (vh * 0.5)), e = 1 - Math.pow(1 - p, 3);
      var mc = mid.offsetLeft + mid.offsetWidth / 2;
      sides.forEach(function (el) {
        var dx = mc - (el.offsetLeft + el.offsetWidth / 2);
        el.style.transform = 'translate3d(' + (dx * (1 - e) * 0.75).toFixed(1) + 'px,' + ((1 - e) * 24).toFixed(1) + 'px,0) scale(' + (0.9 + 0.1 * e).toFixed(4) + ')';
      });
      mid.style.transform = 'translate3d(0,' + ((1 - e) * 40).toFixed(1) + 'px,0)';
    });
  }
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  function build() { edges(); frame(); }
  var lastW = window.innerWidth;
  window.addEventListener('resize', function () { if (Math.abs(window.innerWidth - lastW) > 2) { lastW = window.innerWidth; build(); } });
  window.addEventListener('scroll', schedule, { passive: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
