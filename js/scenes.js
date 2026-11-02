/*
 * The examples. Each one shows a single BetterMe idea with plain HTML/SVG (no screenshots), in the section's colour.
 * render() is the finished state; timeline() moves it with the scroll (see motion.js).
 * Progress values below are fractions of the scene's scroll range (0 = entering, 1 = fully in view).
 */
(function () {
  'use strict';
  var BM = window.BM, h = BM.h, t = BM.t, E = BM.ease, seg = BM.seg, lerp = BM.lerp;
  var S = BM.scenes;

  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="ck" d="M7 12.5l3.2 3.2L17 9" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function label(text) { return h('p', { class: 'd-label', text: text }); }
  function clearStyles(root) {
    root.querySelectorAll('[style]').forEach(function (el) { if (!el.hasAttribute('data-keep-style')) el.removeAttribute('style'); });
  }

  // ================================================================ I. Workouts
  // The bench-press figure moves with the scroll too: about one rep per 780px scrolled.
  var benchPose = null;
  BM.onScroll.push(function (y) { if (benchPose && !BM.reduced()) benchPose(y / 260); });

  function benchFigure() {
    var sv = BM.svg;
    var svg = sv('svg', { viewBox: '0 0 260 196', class: 'wk-svg', 'aria-hidden': 'true' });
    var SH = { x: 64, y: 111 }, L = 31;
    svg.append(
      sv('line', { x1: 10, y1: 178, x2: 250, y2: 178, class: 'f-floor' }),
      sv('rect', { x: 48, y: 119, width: 130, height: 8, rx: 4, class: 'f-bench' }),
      sv('line', { x1: 74, y1: 127, x2: 74, y2: 178, class: 'f-bench-leg' }),
      sv('line', { x1: 154, y1: 127, x2: 154, y2: 178, class: 'f-bench-leg' }),
      sv('line', { x1: 64, y1: 46, x2: 64, y2: 94, class: 'f-guide' }),
      sv('circle', { cx: 40, cy: 107, r: 10.5, class: 'f-head' }),
      sv('line', { x1: SH.x, y1: SH.y, x2: 148, y2: 113, class: 'f-body f-torso' }),
      sv('line', { x1: 148, y1: 113, x2: 188, y2: 111, class: 'f-body f-thigh' }),
      sv('line', { x1: 188, y1: 111, x2: 197, y2: 168, class: 'f-body f-shin' }),
      sv('line', { x1: 197, y1: 171, x2: 211, y2: 171, class: 'f-body f-foot' })
    );
    var upper = sv('line', { class: 'f-body f-arm' });
    var fore = sv('line', { class: 'f-body f-fore' });
    var plate = sv('circle', { r: 17, class: 'f-plate' });
    var hub = sv('circle', { r: 3.6, class: 'f-hub' });
    svg.append(upper, fore, plate, hub);

    function pose(y) {
      var bx = SH.x, by = y;
      var d = Math.min(Math.hypot(bx - SH.x, by - SH.y), 2 * L - 0.01);
      var th = Math.atan2(by - SH.y, bx - SH.x), a = Math.acos(d / (2 * L));
      var ex = SH.x + L * Math.cos(th + a), ey = SH.y + L * Math.sin(th + a);
      upper.setAttribute('x1', SH.x); upper.setAttribute('y1', SH.y); upper.setAttribute('x2', ex); upper.setAttribute('y2', ey);
      fore.setAttribute('x1', ex); fore.setAttribute('y1', ey); fore.setAttribute('x2', bx); fore.setAttribute('y2', by);
      plate.setAttribute('cx', bx); plate.setAttribute('cy', by); hub.setAttribute('cx', bx); hub.setAttribute('cy', by);
    }
    // One rep: lockout, lower under control, brief pause, press up.
    function frame(sec) {
      var T = 3.0, p = ((sec % T) + T) % T / T, top = 51, bottom = 91, y;
      function io(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
      if (p < 0.12) y = top;
      else if (p < 0.6) y = top + (bottom - top) * io((p - 0.12) / 0.48);
      else if (p < 0.68) y = bottom;
      else y = bottom - (bottom - top) * (1 - Math.pow(1 - (p - 0.68) / 0.32, 3));
      pose(y);
    }
    return { svg: svg, frame: frame };
  }

  // Three sets tick off, then the best set climbs past last week's 60 kg.
  S.workouts = {
    render: function (st) {
      st.className = 'stage wk';
      st.textContent = '';
      var fig = benchFigure();
      st.append(
        h('figure', { class: 'wk-fig' }, fig.svg,
          h('figcaption', null, h('span', { class: 'wk-play', 'aria-hidden': 'true' }), h('span', { text: t('wkFig') }))),
        h('div', { class: 'wk-card' },
          h('p', { class: 'wk-name' }, h('bdi', { text: 'Bench Press' })),
          h('div', { class: 'wk-sets', 'aria-hidden': 'true' }, [1, 2, 3].map(function (n) {
            return h('span', { class: 'wk-set done' }, h('span', { class: 'wk-set-n num', text: String(n) }), h('span', { class: 'wk-set-ck', html: CHECK }));
          })),
          h('p', { class: 'wk-best' }, h('b', { class: 'num wk-to', text: '62.5' }), h('span', { class: 'wk-unit', text: t('kg') + ' × 8' })),
          h('p', { class: 'wk-pr' }, t('wkPR') + ' · ', h('bdi', { dir: 'ltr', text: '+2.5' }), ' ' + t('kg'))));
      benchPose = fig.frame;
      fig.frame(window.scrollY / 260);
    },
    timeline: function (st, T) {
      st.querySelectorAll('.wk-set').forEach(function (s, i) {
        var a = 0.1 + i * 0.13;
        T.cls(s, 'done', a);
        T.draw(s.querySelector('.ck'), a, a + 0.07);
      });
      var to = st.querySelector('.wk-to');
      T.fn(0.5, 0.7, function (k) { to.textContent = k <= 0 ? '60' : BM.fmt(lerp(60, 62.5, E.out(k)), 1); });
      T.fade(st.querySelector('.wk-pr'), 0.72, 0.82, { y: 0, scale: 0.85 });
    }
  };

  // ================================================================ II. Nutrition
  // Homemade smash burger (2 × 80 g beef patties, cheddar, brioche bun): an AI-style estimate, against a 2,200 kcal day.
  var MEAL = { kcal: 840, p: 44, c: 42, f: 55 }, DAY = 2200, RING = 2 * Math.PI * 52;
  S.nutrition = {
    render: function (st) {
      st.className = 'stage nu';
      st.textContent = '';
      var sv = BM.svg;
      var ring = sv('svg', { viewBox: '0 0 120 120', class: 'nu-ring-svg', 'aria-hidden': 'true' },
        sv('circle', { cx: 60, cy: 60, r: 52, class: 'nu-ring-bg' }),
        sv('circle', { cx: 60, cy: 60, r: 52, class: 'nu-ring-arc', transform: 'rotate(-90 60 60)', 'stroke-dasharray': RING.toFixed(2), 'stroke-dashoffset': (RING * (1 - MEAL.kcal / DAY)).toFixed(2) }));
      st.append(
        h('div', { class: 'nu-field' }, h('span', { class: 'nu-text', text: t('nuMeal') }), h('span', { class: 'nu-caret', 'aria-hidden': 'true' })),
        h('div', { class: 'nu-out' },
          h('div', { class: 'nu-ring' }, ring,
            h('p', { class: 'nu-center' }, h('b', { class: 'num nu-kv', text: String(MEAL.kcal) }), h('span', { text: t('kcal') }))),
          h('div', { class: 'nu-macros' }, ['p', 'c', 'f'].map(function (k) {
            return h('div', { class: 'nm nm-' + k },
              h('span', { class: 'nm-l', text: t(k === 'p' ? 'protein' : k === 'c' ? 'carbs' : 'fat') }),
              h('span', { class: 'nm-bar' }, h('i', { style: 'transform:scaleX(' + (MEAL[k] / 60) + ')' })),
              h('span', { class: 'nm-v' }, h('b', { class: 'num', text: String(MEAL[k]) }), ' ' + t('g')));
          }))));
    },
    timeline: function (st, T) {
      var arc = st.querySelector('.nu-ring-arc');
      T.type(st.querySelector('.nu-text'), 0.02, 0.3, t('nuMeal'));
      T.cls(st, 'typing', 0.3, true);
      T.fn(0.32, 0.68, function (k) { arc.style.strokeDashoffset = String(RING * (1 - (MEAL.kcal / DAY) * E.out(k))); });
      T.count(st.querySelector('.nu-kv'), 0.32, 0.68, 0, MEAL.kcal);
      ['p', 'c', 'f'].forEach(function (k, i) {
        var row = st.querySelector('.nm-' + k), bar = row.querySelector('.nm-bar i'), a = 0.44 + i * 0.08;
        T.fn(a, a + 0.2, function (x) { bar.style.transform = 'scaleX(' + (MEAL[k] / 60) * E.out(x) + ')'; });
        T.count(row.querySelector('b'), a, a + 0.2, 0, MEAL[k]);
      });
    }
  };

  // ================================================================ III. Stores
  // Your meal goes down to the store, and someone's program comes up to you. Each is a copy: the original stays put.
  // Your box sits on top so the first card leaves from the part already on screen.
  function stCard(kind) {
    var d = t('stCards')[kind];
    return h('div', { class: 'st-card st-' + kind },
      h('span', { class: 'st-tag', text: d.tag }),
      h('p', { class: 'st-title', text: d.title }),
      h('p', { class: 'st-sub', text: d.sub }));
  }
  S.stores = {
    render: function (st) {
      st.className = 'stage st';
      st.textContent = '';
      var boxes = t('stBoxes');
      st.append(
        h('div', { class: 'st-box st-mine' }, label(boxes[1]), h('div', { class: 'st-grid' }, stCard('meal'), stCard('plan'))),
        h('div', { class: 'st-acts', 'aria-hidden': 'true' },
          h('span', { class: 'st-act st-act-pub', text: '↓ ' + t('stPublish') }),
          h('span', { class: 'st-act st-act-save', text: '↑ ' + t('stSave') })),
        h('div', { class: 'st-box st-store' }, label(boxes[0]), h('div', { class: 'st-grid' }, stCard('plan'), stCard('meal'))));
    },
    timeline: function (st, T) {
      function fly(card, from, a, b) {
        var r = card.getBoundingClientRect(), f = from.getBoundingClientRect();
        var dx = f.left - r.left, dy = f.top - r.top;
        T.fn(0, 1, function (k, p) {
          var m = E.inOut(seg(p, a, b));
          card.style.opacity = p < a ? '0' : '';
          card.style.transform = m >= 1 ? '' : 'translate(' + (dx * (1 - m)) + 'px,' + (dy * (1 - m)) + 'px)';
          card.classList.toggle('moving', p >= a && m < 1);
        });
      }
      var store = st.querySelector('.st-store'), mine = st.querySelector('.st-mine');
      T.fade(mine.querySelector('.st-meal'), 0.02, 0.12, { y: 8 });
      T.fade(store.querySelector('.st-plan'), 0.1, 0.2, { y: 8 });
      fly(store.querySelector('.st-meal'), mine.querySelector('.st-meal'), 0.22, 0.48);
      fly(mine.querySelector('.st-plan'), store.querySelector('.st-plan'), 0.6, 0.86);
      var pub = st.querySelector('.st-act-pub'), save = st.querySelector('.st-act-save');
      T.fn(0.18, 0.52, function (k) { pub.classList.toggle('on', k > 0 && k < 1); });
      T.fn(0.56, 0.9, function (k) { save.classList.toggle('on', k > 0 && k < 1); });
    }
  };

  // ================================================================ IV. Progress
  // October weigh-ins (kg): a calm, realistic 2 kg drop with day-to-day noise.
  var WEIGHTS = [84.2, 84.3, 84.0, 83.9, 84.1, 83.8, 83.7, 83.9, 83.6, 83.5, 83.6, 83.3, 83.4, 83.1, 83.2,
    83.0, 82.9, 83.1, 82.8, 82.7, 82.9, 82.6, 82.5, 82.4, 82.3, 82.0, 82.1, 81.9, 82.1];
  function silhouette() {
    var sv = BM.svg, g = sv('g', { class: 'sil' });
    g.append(
      sv('circle', { cx: 50, cy: 20, r: 10 }),
      sv('path', { d: 'M36 36 Q50 31 64 36 L66 80 Q50 84 34 80 Z' }),
      sv('line', { x1: 36, y1: 39, x2: 27, y2: 76 }),
      sv('line', { x1: 64, y1: 39, x2: 73, y2: 76 }),
      sv('line', { x1: 43, y1: 82, x2: 41, y2: 122 }),
      sv('line', { x1: 57, y1: 82, x2: 59, y2: 122 }));
    return g;
  }

  S.progress = {
    render: function (st) {
      st.className = 'stage pg';
      st.textContent = '';
      var first = WEIGHTS[0], last = WEIGHTS[WEIGHTS.length - 1], dates = t('pgDates');
      st.append(
        h('div', { class: 'pg-w' },
          label(t('pgWeight')),
          h('p', { class: 'pg-big' },
            h('b', { class: 'num pg-kg', text: BM.fmt(last, 1) }), h('span', { text: t('kg') }),
            h('span', { class: 'pg-delta num' }, h('bdi', { dir: 'ltr', text: '−' + BM.fmt(first - last, 1) }))),
          h('div', { class: 'pg-plot' })),
        h('div', { class: 'pg-v' },
          label(t('pgVideo')),
          h('figure', { class: 'pg-frame' },
            BM.svg('svg', { viewBox: '0 0 100 130', 'aria-hidden': 'true' }, silhouette()),
            h('span', { class: 'pg-play wk-play', 'aria-hidden': 'true' }),
            h('figcaption', { class: 'pg-date', text: dates[dates.length - 1] })),
          h('div', { class: 'pg-bar', 'aria-hidden': 'true' }, h('i', { class: 'pg-fill' })),
          h('p', { class: 'pg-private' }, h('span', { class: 'lock', 'aria-hidden': 'true' }), t('pgPrivate'))));
      // Drawn at the box's real pixel size so the line stays crisp; time runs in the reading direction.
      var box = st.querySelector('.pg-plot');
      var W = Math.max(240, Math.round(box.clientWidth || 320)), H = 110, rtl = BM.dir() < 0, pad = 6, lo = 81.6, hi = 84.5;
      function x(i) { var d = pad + (W - 2 * pad) * i / (WEIGHTS.length - 1); return rtl ? W - d : d; }
      function y(v) { return pad + (H - 2 * pad) * (hi - v) / (hi - lo); }
      var sv = BM.svg;
      var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, class: 'pg-svg', 'aria-hidden': 'true' });
      svg.append(
        sv('path', { d: WEIGHTS.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' '), class: 'pg-line' }),
        sv('circle', { cx: x(WEIGHTS.length - 1), cy: y(last), r: 5, class: 'pg-end' }));
      box.append(svg);
    },
    timeline: function (st, T) {
      var line = st.querySelector('.pg-line'), len = line.getTotalLength(), end = st.querySelector('.pg-end');
      line.style.strokeDasharray = String(len);
      T.fn(0.04, 0.46, function (k) { line.style.strokeDashoffset = String(len * (1 - E.inOut(k))); });
      T.count(st.querySelector('.pg-kg'), 0.04, 0.46, WEIGHTS[0], WEIGHTS[WEIGHTS.length - 1], 1);
      T.fade(end, 0.44, 0.5, { y: 0, scale: 0.4 });
      T.fade(st.querySelector('.pg-delta'), 0.46, 0.54, { y: 4 });
      // The month plays as a video: the play head runs, the date moves on and the body slims a little.
      var dates = t('pgDates'), date = st.querySelector('.pg-date'), fill = st.querySelector('.pg-fill');
      var body = st.querySelector('.sil'), play = st.querySelector('.pg-play');
      T.fn(0.5, 0.94, function (k) {
        fill.style.transform = 'scaleX(' + k + ')';
        date.textContent = dates[Math.min(dates.length - 1, Math.floor(k * dates.length))];
        body.style.transform = k >= 1 ? '' : 'scaleX(' + (1.12 - 0.12 * k) + ')';
        play.style.opacity = k > 0 && k < 1 ? '0' : '';
      });
    }
  };

  // ================================================================ V. AI
  // A question, the three numbers the coach reads, then a short answer. Each point lights the number it uses.
  function setLit(st, k) {
    st.querySelectorAll('.ai-chip').forEach(function (c, i) { c.classList.toggle('lit', i === k); });
  }
  S.ai = {
    render: function (st) {
      st.className = 'stage ai';
      st.textContent = '';
      st.append(
        h('div', { class: 'ai-q' }, h('span', { text: t('aiQuestion') })),
        h('div', { class: 'ai-data' }, t('aiFacts').map(function (f) {
          return h('span', { class: 'ai-chip' },
            h('span', { class: 'ai-chip-l' }, h('bdi', { text: f.label })),
            h('b', { class: 'num', text: f.value }),
            h('span', { class: 'ai-chip-u', text: f.unit }));
        })),
        h('div', { class: 'ai-a' },
          h('img', { class: 'ai-av', src: 'assets/mark.png', alt: '', width: 32, height: 32 }),
          h('ul', { class: 'ai-points' }, t('aiAnswer').map(function (s) {
            return h('li', { class: 'ans' + (s.warn ? ' warn' : ''), 'data-k': s.k },
              h('span', { class: 'ans-ic', 'aria-hidden': 'true', html: s.warn ? '!' : CHECK }),
              h('span', { text: s.text }));
          }))));
    },
    timeline: function (st, T) {
      var data = t('aiFacts'), chips = st.querySelectorAll('.ai-chip'), points = st.querySelectorAll('.ans');
      var av = st.querySelector('.ai-av');
      T.fade(st.querySelector('.ai-q'), 0.02, 0.12, { y: 0, x: -18 * BM.dir() });
      chips.forEach(function (c, i) {
        var a = 0.12 + i * 0.06;
        T.fade(c, a, a + 0.1, { y: 10 });
        T.count(c.querySelector('b'), a, a + 0.12, 0, parseFloat(data[i].value), data[i].value.indexOf('.') >= 0 ? 1 : 0);
      });
      T.fade(av, 0.34, 0.4, { y: 0, scale: 0.7 });
      points.forEach(function (li, j) { T.fade(li, 0.44 + j * 0.14, 0.52 + j * 0.14, { y: 8 }); });
      T.fn(0, 1, function (k, p) {
        av.classList.toggle('reading', p >= 0.34 && p < 0.46);
        var lit = -1;
        if (p >= 0.44 && p < 0.92) lit = +points[Math.min(points.length - 1, Math.floor((p - 0.44) / 0.14))].getAttribute('data-k');
        setLit(st, lit);
      });
    }
  };

  // ================================================================ VI. Consistency
  // Today's three streaks turn gold → one star → the 30th star makes the Strong character a Beast (the app's own step).
  var ICONS = { water: 'streakWater', supplements: 'streakSupplements', training: 'streakTraining' };
  S.consistency = {
    render: function (st) {
      st.className = 'stage cm';
      st.textContent = '';
      st.append(
        h('div', { class: 'cm-row' }, t('cmTasks').map(function (k) {
          return h('div', { class: 'cm-task done' },
            h('span', { class: 'task-ic', 'aria-hidden': 'true' },
              h('img', { src: 'assets/icon-' + ICONS[k.key] + 'L.png', alt: '', width: 40, height: 40 }),
              h('img', { class: 'gold', src: 'assets/icon-' + ICONS[k.key] + 'LGold.png', alt: '', width: 40, height: 40 })),
            h('span', { class: 'cm-name', text: k.name }));
        })),
        h('p', { class: 'cm-star' }, h('img', { src: 'assets/icon-starLGold.png', alt: '', width: 34, height: 34 }), h('b', { text: t('cmStarGain') })),
        h('div', { class: 'cm-char' },
          h('div', { class: 'char-stage' },
            h('img', { class: 'c-from', src: 'assets/char-strong.webp', alt: '', width: 800, height: 800 }),
            h('img', { class: 'c-to', src: 'assets/char-beast.webp', alt: '', width: 800, height: 800 })),
          h('p', { class: 'lvl' },
            h('b', { class: 'lvl-name', text: t('cmLevelTo') }),
            h('span', { class: 'lvl-stars' }, h('img', { src: 'assets/icon-starLGold.png', alt: '', width: 16, height: 16 }), h('b', { class: 'num', text: '30' })))));
    },
    timeline: function (st, T) {
      st.querySelectorAll('.cm-task').forEach(function (el, i) {
        var a = 0.06 + i * 0.1, ic = el.querySelector('.task-ic');
        T.cls(el, 'done', a + 0.03);
        T.fn(a, a + 0.08, function (k) { ic.style.transform = k > 0 && k < 1 ? 'scale(' + (1 + 0.12 * Math.sin(Math.PI * k)) + ')' : ''; });
      });
      var star = st.querySelector('.cm-star'), starImg = star.querySelector('img');
      T.fade(star, 0.38, 0.46, { y: 10 });
      T.fn(0.38, 0.5, function (k) {
        var e = E.out(k);
        starImg.style.transform = k >= 1 ? '' : 'scale(' + (0.4 + 0.6 * e) + ') rotate(' + (-40 * (1 - e)) + 'deg)';
      });
      T.swap(st.querySelector('.lvl-stars b'), 0.54, '29', '30');
      var from = st.querySelector('.c-from'), to = st.querySelector('.c-to');
      T.fn(0.58, 0.74, function (k) {
        var e = E.out(k);
        from.style.opacity = String(1 - k);
        to.style.opacity = String(k);
        to.style.transform = k >= 1 ? '' : 'translateY(' + (10 * (1 - e)) + 'px) scale(' + (0.97 + 0.03 * e) + ')';
      });
      T.swap(st.querySelector('.lvl-name'), 0.66, t('cmLevelFrom'), t('cmLevelTo'));
    }
  };

  // ================================================================ VII. Competition
  // Three friends, three ways to rank them: you pass Fahad on stars, Khalid wins on lifts, you win on weight change.
  var USERS = ['fahad', 'you', 'khalid'];
  var BOARD = { commitment: { fahad: 22, you: 23, khalid: 18 }, lifts: { khalid: 1.45, fahad: 1.3, you: 1.2 }, weight: { you: 64, khalid: 52, fahad: 41 } };
  function fmtScore(crit, v) {
    if (crit === 'lifts') return BM.fmt(v, 2) + '×';
    if (crit === 'weight') return Math.round(v) + '%';
    return String(Math.round(v));
  }
  function shares(vals) {
    var m = Math.max.apply(null, USERS.map(function (u) { return vals[u]; })), o = {};
    USERS.forEach(function (u) { o[u] = vals[u] / m; });
    return o;
  }
  function leader(vals) { return USERS.reduce(function (a, u) { return vals[u] > vals[a] ? u : a; }, USERS[0]); }
  function paintBoard(st, crit, vals, hs) {
    var lead = leader(vals);
    st.querySelectorAll('.cp-crit span').forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-c') === crit); });
    st.querySelectorAll('.cp-col').forEach(function (col) {
      var u = col.getAttribute('data-u');
      col.style.setProperty('--h', hs[u].toFixed(4));
      col.querySelector('.cp-val b').textContent = fmtScore(crit, vals[u]);
      col.querySelector('.cp-star').style.display = crit === 'commitment' ? '' : 'none';
      col.classList.toggle('lead', u === lead);
    });
  }
  function mix(a, b, k) { var o = {}; USERS.forEach(function (u) { o[u] = lerp(a[u], b[u], k); }); return o; }

  S.competition = {
    render: function (st) {
      st.className = 'stage cp';
      st.textContent = '';
      var names = t('cpUsers');
      st.append(
        h('div', { class: 'cp-crit', 'aria-hidden': 'true' }, t('cpCrit').map(function (c) { return h('span', { 'data-c': c.key, text: c.name }); })),
        h('div', { class: 'cp-bars' }, USERS.map(function (u) {
          return h('div', { class: 'cp-col' + (u === 'you' ? ' you' : ''), 'data-u': u, 'data-keep-style': '' },
            h('div', { class: 'cp-area' },
              h('i', { class: 'cp-fill' }),
              h('p', { class: 'cp-val' },
                h('img', { class: 'cp-crown', src: 'assets/icon-starLGold.png', alt: '', width: 18, height: 18 }),
                h('span', { class: 'cp-score' }, h('b', { class: 'num', dir: 'ltr' }),
                  h('img', { class: 'cp-star', src: 'assets/icon-starLGold.png', alt: '', width: 13, height: 13 })))),
            h('span', { class: 'av', 'aria-hidden': 'true', text: names[u].charAt(0) }),
            h('span', { class: 'cp-name', text: names[u] }));
        })));
      paintBoard(st, 'weight', BOARD.weight, shares(BOARD.weight));
    },
    timeline: function (st, T) {
      var c = BOARD.commitment, H1 = shares(c), H2 = shares(BOARD.lifts), H3 = shares(BOARD.weight);
      T.fn(0, 1, function (k, p) {
        if (p < 0.46) {
          // Two more stars this week: 21 → 23, past Fahad's 22.
          var vals = { fahad: c.fahad, you: lerp(21, 23, E.inOut(seg(p, 0.12, 0.36))), khalid: c.khalid };
          paintBoard(st, 'commitment', vals, { fahad: c.fahad / 23, you: vals.you / 23, khalid: c.khalid / 23 });
        } else if (p < 0.72) {
          paintBoard(st, 'lifts', BOARD.lifts, mix(H1, H2, E.inOut(seg(p, 0.46, 0.6))));
        } else {
          paintBoard(st, 'weight', BOARD.weight, mix(H2, H3, E.inOut(seg(p, 0.72, 0.86))));
        }
      });
    }
  };

  // ================================================================ Gather (markup lives in index.html)
  var SCATTER = [[-0.30, -2.4], [0.26, -1.5], [-0.38, 0.9], [0.34, 1.9], [-0.06, 2.8], [0.12, -3.1], [0.3, 0.4]];
  S.gather = {
    render: function (st) { clearStyles(st); },
    timeline: function (st, T) {
      var box = st.getBoundingClientRect(), w = box.width;
      st.querySelectorAll('.w').forEach(function (el, i) {
        // Each word starts scattered but never past the stage edge, so a phone never gets wider than its screen.
        var s = SCATTER[i % SCATTER.length], r = el.getBoundingClientRect(), sy = s[1] * 1.2;
        var sx = Math.max(box.left - r.left, Math.min(box.right - r.right, s[0] * w * 0.9));
        T.fn(0, 1, function (k, p) {
          var o = seg(p, i * 0.04, i * 0.04 + 0.12), m = E.inOut(seg(p, 0.24, 0.58));
          el.style.opacity = o >= 1 ? '' : String(o);
          el.style.transform = m >= 1 ? '' : 'translate(' + (sx * (1 - m)) + 'px,' + (sy * (1 - m)) + 'em)';
        });
      });
      T.fade(st.querySelector('.ga-brand'), 0.58, 0.7, { y: 0, scale: 0.92 });
      st.querySelectorAll('.ga-title .line').forEach(function (l, i) { T.fade(l, 0.66 + i * 0.06, 0.78 + i * 0.06, { y: 14 }); });
    }
  };

  // ================================================================ Pricing
  S.pricing = {
    render: function (st) {
      st.className = 'stage pr';
      st.textContent = '';
      var cfg = BM.config, names = t('prRows');
      var total = cfg.comparison.rows.reduce(function (s, r) { return s + r.monthly; }, 0);
      var list = h('ul', { class: 'pr-list' }, cfg.comparison.rows.map(function (r) {
        return h('li', { class: 'pr-row struck' },
          h('img', { class: 'pr-ic', src: 'assets/cmp-' + r.key + '.webp', alt: '', width: 40, height: 40 }),
          h('p', { class: 'pr-cat' }, h('b', { text: names[r.key] })),
          h('p', { class: 'pr-price' }, h('b', { class: 'num', text: BM.fmt(r.monthly, 2) }), h('span', { text: t('prPerMonth') })),
          h('i', { class: 'strike', 'aria-hidden': 'true' }));
      }),
        h('li', { class: 'pr-total struck' },
          h('span', { text: t('prTotal') }),
          h('p', { class: 'pr-price' }, h('b', { class: 'num pr-sum', text: BM.fmt(total, 2) }), h('span', { text: t('prCurrency') })),
          h('i', { class: 'strike', 'aria-hidden': 'true' })));
      var one = h('div', { class: 'pr-one' },
        h('img', { class: 'pr-mark', src: 'assets/mark.png', alt: '', width: 56, height: 56 }),
        h('p', { class: 'pr-name', text: 'BetterMe' }),
        h('p', { class: 'pr-big' }, h('b', { class: 'num', text: BM.fmt(cfg.price.monthly, 2) }), h('span', { text: t('prPerMonth') })),
        h('p', { class: 'pr-tag', text: t('prOne') }));
      st.append(list, one);
    },
    timeline: function (st, T) {
      var rows = Array.prototype.slice.call(st.querySelectorAll('.pr-row')), total = st.querySelector('.pr-total');
      var sum = BM.config.comparison.rows.reduce(function (s, r) { return s + r.monthly; }, 0);
      rows.forEach(function (r, i) { T.fade(r, 0.02 + i * 0.06, 0.1 + i * 0.06, { y: 8 }); });
      T.fade(total, 0.26, 0.32, { y: 8 });
      T.count(st.querySelector('.pr-sum'), 0.26, 0.4, 0, sum, 2);
      // One by one, a thin line strikes each separate subscription.
      rows.concat([total]).forEach(function (r, k) {
        var a = 0.44 + k * 0.07, strike = r.querySelector('.strike');
        T.fn(a, a + 0.06, function (x) { strike.style.transform = 'scaleX(' + x + ')'; });
        T.cls(r, 'struck', a + 0.06);
      });
      T.fade(st.querySelector('.pr-one'), 0.82, 0.94, { y: 16 });
    }
  };
})();
