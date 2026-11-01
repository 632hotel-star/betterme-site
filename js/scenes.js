/*
 * The examples. Each re-enacts one real BetterMe action with plain HTML/SVG (no screenshots).
 * render() is the finished state; timeline() moves it with the scroll (see motion.js).
 * Progress values below are fractions of the scene's scroll range (0 = entering, 1 = fully in view).
 */
(function () {
  'use strict';
  var BM = window.BM, h = BM.h, t = BM.t, E = BM.ease, seg = BM.seg, lerp = BM.lerp;
  var S = BM.scenes;

  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="ck" d="M7 12.5l3.2 3.2L17 9" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function label(text) { return h('p', { class: 'd-label', text: text }); }
  // A button press: a small dip in scale over [a, b].
  function press(T, el, a, b) {
    T.fn(a, b, function (k) { el.style.transform = k > 0 && k < 1 ? 'scale(' + (1 - 0.06 * Math.sin(Math.PI * k)) + ')' : ''; });
  }
  function clearStyles(root) {
    root.querySelectorAll('[style]').forEach(function (el) { if (!el.hasAttribute('data-keep-style')) el.removeAttribute('style'); });
  }
  function moveIndicator(group) {
    var on = group.querySelector('.on'), ind = group.querySelector('.ind');
    if (!on || !ind) return;
    var g = group.getBoundingClientRect(), r = on.getBoundingClientRect();
    if (!g.width) return;
    ind.style.width = r.width + 'px';
    ind.style.transform = 'translateX(' + (r.left - g.left) + 'px)';
  }
  BM.moveIndicator = moveIndicator;
  function macroCell(key, value, unit) {
    return h('span', { class: 'mc mc-' + key },
      h('span', { class: 'mc-l' }, h('i', { class: 'dot dot-' + key }), t(key === 'p' ? 'protein' : key === 'c' ? 'carbs' : 'fat')),
      h('span', { class: 'mc-v' }, h('b', { class: 'num', text: String(value) }), unit ? ' ' + unit : ''));
  }

  // ================================================================ I. Workouts
  var SETS = [
    { prevKg: '60', prevReps: '10', kg: '60', reps: '10' },
    { prevKg: '60', prevReps: '8', kg: '62.5', reps: '8' },
    { prevKg: '60', prevReps: '8', kg: '62.5', reps: '8' }
  ];

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

  S.workouts = {
    render: function (st) {
      st.className = 'stage wk';
      st.textContent = '';
      var cols = t('wkCols');
      var head = h('div', { class: 'wk-row wk-cols', 'aria-hidden': 'true' },
        cols.map(function (c) { return h('span', { text: c }); }), h('span'));
      var rows = SETS.map(function (s, i) {
        return h('div', { class: 'wk-row is-done', 'data-i': i },
          h('span', { class: 'c-set num', text: String(i + 1) }),
          h('span', { class: 'c-prev num', html: '<bdi>' + s.prevKg + ' × ' + s.prevReps + '</bdi>' }),
          h('span', { class: 'c-kg num', text: s.kg }),
          h('span', { class: 'c-reps num', text: s.reps }),
          h('span', { class: 'c-check', html: CHECK }));
      });
      var best = h('div', { class: 'wk-best' },
        h('span', { class: 'wk-best-label', text: t('wkBest') }),
        h('span', { class: 'wk-best-val' },
          h('span', { class: 'wk-from num' }, '60', h('i', { class: 'wk-strike' })),
          h('span', { class: 'wk-arrow', 'aria-hidden': 'true', text: BM.dir() < 0 ? '←' : '→' }),
          h('span', { class: 'wk-to num', text: '62.5' }),
          h('span', { class: 'wk-unit', text: t('kg') + ' × 8' })),
        h('span', { class: 'wk-pr', text: t('wkPR') }));
      var log = h('div', { class: 'wk-log' },
        h('div', { class: 'wk-head' },
          h('p', { class: 'wk-name' }, h('bdi', { text: 'Bench Press (Barbell)' })),
          h('p', { class: 'wk-meta', text: t('wkMeta') })),
        h('div', { class: 'wk-table' }, head, rows),
        best,
        h('p', { class: 'wk-delta', text: t('wkDelta') }),
        h('p', { class: 'wk-hint', text: t('wkHint') }));
      var fig = benchFigure();
      var figure = h('figure', { class: 'wk-fig' }, fig.svg,
        h('figcaption', null, h('span', { class: 'wk-play', 'aria-hidden': 'true' }), h('span', { text: t('wkFig') })),
        h('p', { class: 'wk-cue', text: '«' + t('wkCue') + '»' }));
      st.append(log, figure);
      benchPose = fig.frame;
      fig.frame(window.scrollY / 260);
    },
    timeline: function (st, T) {
      st.querySelectorAll('.wk-row[data-i]').forEach(function (r, i) {
        var s = SETS[i], a = 0.04 + i * 0.19;
        var kg = r.querySelector('.c-kg'), reps = r.querySelector('.c-reps');
        T.fn(a, a + 0.17, function (k) { r.classList.toggle('is-active', k > 0 && k < 1); });
        T.cls(kg, 'ph', a + 0.04, true);
        if (s.kg !== s.prevKg) T.swap(kg, a + 0.07, s.prevKg, s.kg);
        T.cls(reps, 'ph', a + 0.1, true);
        T.cls(r, 'is-done', a + 0.13);
        T.draw(r.querySelector('.ck'), a + 0.13, a + 0.17);
      });
      var strike = st.querySelector('.wk-strike');
      T.cls(st.querySelector('.wk-best'), 'before', 0.64, true);
      T.fn(0.64, 0.7, function (k) { strike.style.transform = 'scaleX(' + k + ')'; });
      T.fade(st.querySelector('.wk-arrow'), 0.66, 0.72, { y: 0, x: 6 * BM.dir() });
      T.count(st.querySelector('.wk-to'), 0.68, 0.8, 60, 62.5, 1);
      T.fade(st.querySelector('.wk-pr'), 0.79, 0.86, { y: 0, scale: 0.85 });
      T.fade(st.querySelector('.wk-delta'), 0.85, 0.92, { y: 6 });
      T.fade(st.querySelector('.wk-hint'), 0.9, 0.97, { y: 6 });
    }
  };

  // ================================================================ II. Nutrition
  var OATS = { kcal: 389, p: 16.9, c: 66.3, f: 6.9 };
  function oats(g) {
    return { kcal: OATS.kcal * g / 100, p: OATS.p * g / 100, c: OATS.c * g / 100, f: OATS.f * g / 100 };
  }
  // Homemade smash burger (2 × 80 g beef patties, cheddar, brioche bun, sauce): an AI-style estimate.
  var MEAL = { kcal: 840, p: 44, c: 42, f: 55 };
  var DAY0 = { kcal: 640, p: 38, c: 80, f: 14 }, GOAL = { kcal: 2200, p: 150, c: 250, f: 75 };
  function addM(a, b) { return { kcal: a.kcal + b.kcal, p: a.p + b.p, c: a.c + b.c, f: a.f + b.f }; }
  function mixM(a, b, k) { return { kcal: lerp(a.kcal, b.kcal, k), p: lerp(a.p, b.p, k), c: lerp(a.c, b.c, k), f: lerp(a.f, b.f, k) }; }
  var DAY1 = addM(DAY0, MEAL), DAY2 = addM(DAY1, oats(60));
  DAY2 = { kcal: Math.round(DAY2.kcal), p: Math.round(DAY2.p), c: Math.round(DAY2.c), f: Math.round(DAY2.f) };

  function setDay(st, d) {
    st.querySelector('.day-kcal').textContent = BM.fmt(d.kcal);
    st.querySelector('.day-fill').style.transform = 'scaleX(' + (d.kcal / GOAL.kcal) + ')';
    ['p', 'c', 'f'].forEach(function (k) {
      st.querySelector('.dm-' + k + ' b').textContent = BM.fmt(d[k]);
      st.querySelector('.dm-' + k + ' .dm-fill').style.transform = 'scaleX(' + Math.min(1, d[k] / GOAL[k]) + ')';
    });
  }
  function setOats(st, v) {
    st.querySelector('.pv-kcal').textContent = BM.fmt(v.kcal);
    st.querySelector('.pv .mc-p b').textContent = BM.fmt(v.p);
    st.querySelector('.pv .mc-c b').textContent = BM.fmt(v.c);
    st.querySelector('.pv .mc-f b').textContent = BM.fmt(v.f);
  }

  S.nutrition = {
    render: function (st) {
      st.className = 'stage nu';
      st.textContent = '';
      var g = t('g'), v = oats(60), units = t('nuUnits');
      var ai = h('div', { class: 'nu-ai' },
        label(t('nuDescribe')),
        h('div', { class: 'nu-field' },
          h('span', { class: 'nu-text', text: t('nuMeal') }),
          h('span', { class: 'nu-caret', 'aria-hidden': 'true' }),
          h('span', { class: 'nu-go', text: t('nuEstimate') })),
        h('div', { class: 'nu-thinking', 'aria-hidden': 'true' }, h('i'), h('span', { text: t('nuThinking') })),
        h('div', { class: 'nu-result' },
          h('p', { class: 'nu-rlabel', text: t('nuResult') }),
          h('p', { class: 'nu-kcal' },
            h('span', { class: 'nu-most', text: t('nuMost') }), ' ',
            h('b', { class: 'num nu-kv', text: String(MEAL.kcal) }), ' ',
            h('span', { class: 'nu-unit', text: t('kcal') }),
            h('span', { class: 'nu-range', text: t('nuRange') })),
          h('div', { class: 'nu-macros' }, macroCell('p', MEAL.p, g), macroCell('c', MEAL.c, g), macroCell('f', MEAL.f, g))));
      var prod = h('div', { class: 'nu-prod' },
        label(t('nuLibrary')),
        h('div', { class: 'nu-prow' },
          h('p', { class: 'nu-pname', text: t('nuProduct') }),
          h('div', { class: 'nu-step', 'aria-hidden': 'true' },
            h('span', { class: 'st-minus', text: '−' }),
            h('span', { class: 'nu-amount' }, h('b', { class: 'num nu-g', text: '60' }), ' ', h('span', { text: g })),
            h('span', { class: 'st-plus', text: '+' }))),
        h('div', { class: 'nu-units', 'aria-hidden': 'true' }, units.map(function (u, i) { return h('span', { class: i === 0 ? 'on' : '', text: u }); })),
        h('div', { class: 'pv' },
          h('span', { class: 'pv-k' }, h('b', { class: 'num pv-kcal', text: BM.fmt(v.kcal) }), ' ', t('kcal')),
          macroCell('p', BM.fmt(v.p), g), macroCell('c', BM.fmt(v.c), g), macroCell('f', BM.fmt(v.f), g)));
      var day = h('div', { class: 'nu-day' },
        h('div', { class: 'day-top' },
          h('span', { class: 'd-label', text: t('nuToday') }),
          h('span', { class: 'day-num' }, h('b', { class: 'num day-kcal' }), ' ' + t('nuOf') + ' ' + BM.fmt(GOAL.kcal) + ' ' + t('kcal'))),
        h('div', { class: 'day-bar' }, h('i', { class: 'day-fill' })),
        h('div', { class: 'day-macros' }, ['p', 'c', 'f'].map(function (k) {
          return h('div', { class: 'dm dm-' + k },
            h('span', { class: 'dm-l' }, h('i', { class: 'dot dot-' + k }), t(k === 'p' ? 'protein' : k === 'c' ? 'carbs' : 'fat')),
            h('span', { class: 'dm-v' }, h('b', { class: 'num' }), ' / ' + GOAL[k] + ' ' + g),
            h('span', { class: 'dm-bar' }, h('i', { class: 'dm-fill' })));
        })));
      st.append(ai, prod, day);
      setDay(st, DAY2);
    },
    timeline: function (st, T) {
      var go = st.querySelector('.nu-go'), think = st.querySelector('.nu-thinking'), plus = st.querySelector('.st-plus');
      var grams = st.querySelector('.nu-g');
      T.type(st.querySelector('.nu-text'), 0.02, 0.26, t('nuMeal'));
      T.cls(st, 'typing', 0.26, true);
      T.fn(0.27, 0.37, function (k) { go.classList.toggle('on', k > 0 && k < 1); });
      T.fn(0.29, 0.37, function (k) { think.classList.toggle('on', k > 0 && k < 1); });
      T.fade(st.querySelector('.nu-result'), 0.37, 0.44, { y: 8 });
      T.count(st.querySelector('.nu-kv'), 0.37, 0.48, 0, MEAL.kcal);
      ['p', 'c', 'f'].forEach(function (k) {
        T.count(st.querySelector('.nu-result .mc-' + k + ' b'), 0.37, 0.48, 0, MEAL[k]);
      });
      // Adding 40 → 50 → 60 g of a library product updates its values live.
      T.fn(0.6, 0.78, function (k) { plus.classList.toggle('on', k > 0 && k < 1); });
      T.fn(0, 1, function (k, p) {
        var a = seg(p, 0.62, 0.68), b = seg(p, 0.7, 0.76);
        grams.textContent = p < 0.62 ? '40' : p < 0.7 ? '50' : '60';
        setOats(st, b > 0 ? mixM(oats(50), oats(60), E.out(b)) : mixM(oats(40), oats(50), E.out(a)));
        // Today's totals take the meal, then the product.
        var d1 = seg(p, 0.46, 0.58), d2 = seg(p, 0.8, 0.92);
        setDay(st, d2 > 0 ? mixM(DAY1, DAY2, E.out(d2)) : mixM(DAY0, DAY1, E.out(d1)));
      });
    }
  };

  // ================================================================ III. Stores
  var RECIPE = { kcal: 536, p: 42, c: 76, f: 9 };
  function swapBtn(cls, a, b) {
    return h('span', { class: 'st-btn done ' + cls },
      h('span', { class: 'l-a', text: a }),
      h('span', { class: 'l-b' }, h('span', { class: 'mini-ck', html: CHECK }), b));
  }
  function panelPad(space) {
    var cs = getComputedStyle(space);
    return parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  }
  function setTab(st, which) {
    if (st._tab === which) return;
    st._tab = which;
    st.querySelectorAll('.tab').forEach(function (b) {
      var on = b.getAttribute('data-p') === which;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    st.querySelector('.st-meal').classList.toggle('shown', which === 'meal');
    st.querySelector('.st-plan').classList.toggle('shown', which === 'plan');
    moveIndicator(st.querySelector('.st-tabs'));
  }

  S.stores = {
    render: function (st) {
      st.className = 'stage st';
      st.textContent = '';
      st._tab = null;
      var tabs = t('stTabs');
      var tabbar = h('div', { class: 'st-tabs seg', role: 'tablist' },
        h('i', { class: 'ind', 'aria-hidden': 'true', 'data-keep-style': '' }),
        h('button', { class: 'tab', type: 'button', role: 'tab', 'data-p': 'meal', text: tabs[0] }),
        h('button', { class: 'tab', type: 'button', role: 'tab', 'data-p': 'plan', text: tabs[1] }));
      var meal = h('div', { class: 'st-panel st-meal', role: 'tabpanel' },
        h('p', { class: 'st-title', text: t('stMealName') }),
        h('p', { class: 'st-by', text: t('stMealBy') }),
        h('ul', { class: 'st-ing' }, t('stIngredients').map(function (x) {
          return h('li', null, h('span', { text: x[0] }), h('span', { class: 'num', text: x[1] }));
        })),
        h('p', { class: 'st-macros' },
          h('span', { class: 'st-k' }, h('b', { class: 'num', text: String(RECIPE.kcal) }), ' ' + t('kcal')),
          macroCell('p', RECIPE.p, t('g')), macroCell('c', RECIPE.c, t('g')), macroCell('f', RECIPE.f, t('g'))),
        h('div', { class: 'st-actions' }, swapBtn('primary st-pub', t('stPublish'), t('stPublished'))),
        h('div', { class: 'st-other' },
          h('span', { class: 'av', 'aria-hidden': 'true', text: 'R' }),
          h('span', { class: 'st-handle' }, h('bdi', { text: t('stOther') })),
          swapBtn('st-save', t('stSave'), t('stSaved'))));
      var plan = h('div', { class: 'st-panel st-plan', role: 'tabpanel' },
        h('p', { class: 'st-title', text: t('stPlanName') }),
        h('p', { class: 'st-by' }, t('stPlanBy')[0] + ' ', h('bdi', { text: t('stPlanBy')[1] }), ' · ' + t('stPlanBy')[2]),
        h('ol', { class: 'st-days' }, t('stDays').map(function (d) {
          return h('li', null, h('span', { class: 'sd-day', text: d[0] }), h('span', { class: 'sd-name', text: d[1] }), h('span', { class: 'sd-mus', text: d[2] }));
        })),
        h('div', { class: 'st-actions' }, swapBtn('primary st-add', t('stAdd'), t('stAdded'))));
      var space = h('div', { class: 'st-space' }, meal, plan);
      st.append(tabbar, space);
      setTab(st, 'plan');
      space.style.height = (plan.offsetHeight + panelPad(space)) + 'px';
      requestAnimationFrame(function () { moveIndicator(tabbar); });
      // After the example, the tabs switch between the two (the space eases to the new height).
      tabbar.addEventListener('click', function (e) {
        var b = e.target.closest('.tab');
        if (!b) return;
        var which = b.getAttribute('data-p'), panel = which === 'meal' ? meal : plan;
        space.classList.add('manual');
        [meal, plan].forEach(function (x) { x.style.opacity = ''; x.style.visibility = ''; });
        setTab(st, which);
        space.style.height = (panel.offsetHeight + panelPad(space)) + 'px';
        clearTimeout(st._manualTimer);
        st._manualTimer = setTimeout(function () { space.classList.remove('manual'); }, 500);
      });
    },
    timeline: function (st, T) {
      var meal = st.querySelector('.st-meal'), plan = st.querySelector('.st-plan'), space = st.querySelector('.st-space');
      var pad = panelPad(space), hMeal = meal.offsetHeight, hPlan = plan.offsetHeight;
      var pub = st.querySelector('.st-pub'), save = st.querySelector('.st-save'), add = st.querySelector('.st-add');
      st.querySelectorAll('.st-ing li').forEach(function (li, i) { T.fade(li, 0.04 + i * 0.05, 0.11 + i * 0.05, { y: 6 }); });
      T.fade(st.querySelector('.st-macros'), 0.24, 0.3, { y: 6 });
      T.count(st.querySelector('.st-k b'), 0.24, 0.34, 0, RECIPE.kcal);
      press(T, pub, 0.34, 0.38);
      T.cls(pub, 'done', 0.37);
      T.draw(pub.querySelector('.ck'), 0.37, 0.41);
      T.fade(st.querySelector('.st-other'), 0.42, 0.5, { y: 0, x: -24 * BM.dir() });
      press(T, save, 0.5, 0.54);
      T.cls(save, 'done', 0.53);
      T.draw(save.querySelector('.ck'), 0.53, 0.57);
      // The same space turns into a weekly program.
      T.fn(0, 1, function (k, p) {
        setTab(st, p < 0.62 ? 'meal' : 'plan');
        var out = seg(p, 0.58, 0.62), inn = seg(p, 0.62, 0.67);
        meal.style.opacity = p < 0.62 ? String(1 - out) : '0';
        meal.style.visibility = p < 0.62 ? 'visible' : 'hidden';
        meal.style.transform = out > 0 && p < 0.62 ? 'translateY(' + (-8 * out) + 'px)' : '';
        plan.style.opacity = p >= 0.62 ? String(inn) : '0';
        plan.style.visibility = p >= 0.62 ? 'visible' : 'hidden';
        space.style.height = (lerp(hMeal, hPlan, E.inOut(seg(p, 0.58, 0.66))) + pad) + 'px';
      });
      T.fade(plan.querySelector('.st-title'), 0.63, 0.68, { y: 6 });
      st.querySelectorAll('.st-days li').forEach(function (li, i) { T.fade(li, 0.66 + i * 0.05, 0.73 + i * 0.05, { y: 6 }); });
      press(T, add, 0.82, 0.86);
      T.cls(add, 'done', 0.86);
      T.draw(add.querySelector('.ck'), 0.86, 0.9);
    }
  };

  // ================================================================ IV. Progress
  // October weigh-ins (kg): a calm, realistic 2 kg drop with day-to-day noise.
  var WEIGHTS = [84.2, 84.3, 84.0, 83.9, 84.1, 83.8, 83.7, 83.9, 83.6, 83.5, 83.6, 83.3, 83.4, 83.1, 83.2,
    83.0, 82.9, 83.1, 82.8, 82.7, 82.9, 82.6, 82.5, 82.4, 82.3, 82.0, 82.1, 81.9, 82.1];
  function avg7() { var s = WEIGHTS.slice(-7); return s.reduce(function (a, b) { return a + b; }, 0) / s.length; }
  function silhouette(cls) {
    var sv = BM.svg, g = sv('g', { class: cls });
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
      var change = WEIGHTS[WEIGHTS.length - 1] - WEIGHTS[0];
      var head = h('div', { class: 'pg-head' },
        label(t('pgWeight')),
        h('div', { class: 'pg-stats' },
          h('span', { class: 'pg-avg-l', text: t('pgAvg') }),
          h('span', { class: 'pg-avg' }, h('b', { class: 'num', text: BM.fmt(avg7(), 1) }), ' ' + t('kg')),
          h('span', { class: 'pg-change num' }, h('bdi', { text: '−' + BM.fmt(Math.abs(change), 1) + ' ' + t('kg') }), ' ' + t('pgMonth'))));
      // Drawn at the box's real pixel size so dots and lines stay crisp; time runs in the reading direction.
      var box = h('div', { class: 'pg-plot' });
      st.append(head, box);
      var W = Math.max(280, Math.round(box.clientWidth || st.clientWidth || 640));
      var H = Math.round(Math.max(150, Math.min(230, W * 0.3)));
      var rtl = BM.dir() < 0, gutter = 28, padEnd = 8, padT = 14, padB = 10, lo = 81.5, hi = 84.6;
      function x(i) { var d = (W - gutter - padEnd) * i / (WEIGHTS.length - 1); return rtl ? W - gutter - d : gutter + d; }
      function y(v) { return padT + (H - padT - padB) * (hi - v) / (hi - lo); }
      var sv = BM.svg;
      var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, class: 'pg-svg', 'aria-hidden': 'true' });
      [82, 83, 84].forEach(function (v) { svg.append(sv('line', { x1: 0, x2: W, y1: y(v), y2: y(v), class: 'pg-grid' })); });
      svg.append(sv('path', { d: WEIGHTS.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' '), class: 'pg-line' }));
      var dots = sv('g', { class: 'pg-dots' });
      WEIGHTS.forEach(function (v, i) {
        var last = i === WEIGHTS.length - 1;
        dots.append(sv('circle', { cx: x(i), cy: y(v), r: last ? 4.5 : 2.6, class: last ? 'last' : '' }));
      });
      svg.append(dots);
      box.append(svg);
      var axis = h('div', { class: 'pg-axis', dir: 'ltr', 'aria-hidden': 'true' });
      t('pgAxis').forEach(function (lab, k) {
        axis.append(h('span', { style: 'left:' + (x([0, 7, 14, 21, 28][k]) / W * 100).toFixed(2) + '%', 'data-keep-style': '', text: lab }));
      });
      var ylab = h('div', { class: 'pg-ylab', dir: 'ltr', 'aria-hidden': 'true' });
      [82, 83, 84].forEach(function (v) {
        ylab.append(h('span', { style: 'top:' + y(v) + 'px;' + (rtl ? 'right:0;left:auto' : 'left:0'), 'data-keep-style': '', text: String(v) }));
      });
      box.append(axis, ylab);

      var dates = t('pgDates');
      var frames = h('div', { class: 'pg-frames' }, dates.map(function (dt, i) {
        var s = sv('svg', { viewBox: '0 0 100 130', 'aria-hidden': 'true' }, silhouette('sil'));
        if (i === dates.length - 1) s.append(silhouette('ghost'));
        return h('figure', { class: 'frame' }, s, h('figcaption', { text: dt }));
      }));
      var film = h('div', { class: 'pg-film' },
        h('div', { class: 'pg-track', 'aria-hidden': 'true' }, h('i', { class: 'pg-head-line' })),
        h('div', { class: 'pg-film-row' },
          h('span', { class: 'pg-video' }, h('span', { class: 'wk-play', 'aria-hidden': 'true' }), t('pgVideo')),
          h('span', { class: 'pg-private' }, h('span', { class: 'lock', 'aria-hidden': 'true' }), t('pgPrivate'))));
      st.append(h('div', { class: 'pg-photos' }, frames, h('p', { class: 'pg-ghost-note', text: t('pgGhost') }), film));
      // Finished state: the play head has crossed the month.
      var trackW = st.querySelector('.pg-track').getBoundingClientRect().width;
      st.querySelector('.pg-head-line').style.transform = 'translateX(' + (BM.dir() * Math.max(0, trackW - 2)) + 'px)';
    },
    timeline: function (st, T) {
      var line = st.querySelector('.pg-line'), len = line.getTotalLength();
      line.style.strokeDasharray = String(len);
      T.fn(0.04, 0.36, function (k) { line.style.strokeDashoffset = String(len * (1 - E.inOut(k))); });
      var dots = st.querySelectorAll('.pg-dots circle'), n = dots.length;
      dots.forEach(function (c, i) {
        var a = 0.03 + i * (0.32 / n);
        T.fn(a, a + 0.04, function (k) { c.style.opacity = k >= 1 ? '' : String(k); c.style.transform = k >= 1 ? '' : 'scale(' + E.out(k) + ')'; });
      });
      T.count(st.querySelector('.pg-avg b'), 0.04, 0.36, WEIGHTS[0], avg7(), 1);
      T.fade(st.querySelector('.pg-change'), 0.34, 0.4, { y: 4 });

      // The newest photo sits on top of the stack and lines up with its ghost; then the month spreads out.
      var frames = Array.prototype.slice.call(st.querySelectorAll('.frame')), last = frames.length - 1;
      var top = frames[last].getBoundingClientRect();
      frames.forEach(function (f, i) {
        var r = f.getBoundingClientRect();
        var dx = top.left - r.left - (last - i) * 3 * BM.dir(), dy = -(last - i) * 3;
        f.style.zIndex = String(10 + i);
        if (i === last) return;
        var a = 0.52 + (last - 1 - i) * 0.05;
        T.fn(a, a + 0.08, function (k) {
          var e = E.out(k);
          f.style.transform = k >= 1 ? '' : 'translate(' + (dx * (1 - e)) + 'px,' + (dy * (1 - e)) + 'px)';
        });
      });
      T.fade(frames[last], 0.4, 0.44, { y: 0, scale: 0.96 });
      var ghost = frames[last].querySelector('.ghost');
      T.fn(0.44, 0.52, function (k) {
        var e = E.out(k);
        ghost.style.opacity = k >= 1 ? '' : String(k);
        ghost.style.transform = k >= 1 ? '' : 'translate(' + (6 * (1 - e)) + 'px,' + (-5 * (1 - e)) + 'px) scale(' + (1.04 - 0.04 * e) + ')';
      });
      T.fade(st.querySelector('.pg-ghost-note'), 0.46, 0.52, { y: 4 });
      T.fade(st.querySelector('.pg-film'), 0.78, 0.83, { y: 6 });
      var head = st.querySelector('.pg-head-line'), trackW = st.querySelector('.pg-track').getBoundingClientRect().width;
      T.fn(0.82, 1, function (k) {
        head.style.transform = 'translateX(' + (BM.dir() * Math.max(0, trackW - 2) * k) + 'px)';
        frames.forEach(function (f, i) { f.classList.toggle('lit', k > 0 && k < 1 && Math.abs(k - i / last) < 0.12); });
      });
    }
  };

  // ================================================================ V. AI
  function setLit(st, k) {
    st.querySelectorAll('.fact').forEach(function (f, i) { f.classList.toggle('lit', i === k); });
    st.querySelectorAll('.ans').forEach(function (s) { s.classList.toggle('lit', +s.getAttribute('data-k') === k); });
  }
  S.ai = {
    render: function (st) {
      st.className = 'stage ai';
      st.textContent = '';
      var facts = h('div', { class: 'ai-facts' }, t('aiFacts').map(function (f, i) {
        return h('div', { class: 'fact', 'data-k': i },
          h('span', { class: 'ref', 'aria-hidden': 'true', text: String(i + 1) }),
          h('p', { class: 'fact-label' }, h('bdi', { text: f.label })),
          h('p', { class: 'fact-val' }, h('b', { class: 'num', text: f.value }), ' ', h('span', { class: 'fact-unit', text: f.unit })),
          h('p', { class: 'fact-sub', text: f.sub }));
      }));
      // The answer: one short line, then one point per finding, each marked with the number of the data it uses.
      var answer = h('div', { class: 'ai-a-body' },
        h('p', { class: 'ai-lead', text: t('aiLead') }),
        h('ul', { class: 'ai-points' }, t('aiAnswer').map(function (s) {
          return h('li', { class: 'ans', 'data-k': s.k },
            h('span', { class: 'ref', 'aria-hidden': 'true', text: String(s.k + 1) }),
            h('span', { text: s.text }));
        })));
      var convo = h('div', { class: 'ai-convo' },
        h('div', { class: 'ai-q' }, h('span', { text: t('aiQuestion') })),
        h('p', { class: 'ai-reads', 'aria-hidden': 'true' }, h('span', { class: 'pulse' }), t('aiReads')),
        h('div', { class: 'ai-a' }, h('img', { class: 'ai-av', src: 'assets/mark.png', alt: '', width: 28, height: 28 }), answer));
      st.append(facts, convo);
      // Once the example is done, hovering a sentence lights the data it is based on (and the other way round).
      st.addEventListener('pointerover', function (e) {
        if (st._p != null && st._p < 1) return;
        var el = e.target.closest('.ans, .fact');
        setLit(st, el ? +el.getAttribute('data-k') : -1);
      });
      st.addEventListener('pointerleave', function () { if (st._p == null || st._p >= 1) setLit(st, -1); });
    },
    timeline: function (st, T) {
      var facts = st.querySelectorAll('.fact'), data = t('aiFacts'), segs = st.querySelectorAll('.ans');
      var reads = st.querySelector('.ai-reads');
      facts.forEach(function (f, i) {
        var a = 0.02 + i * 0.06;
        T.fade(f, a, a + 0.1, { y: 10 });
        T.count(f.querySelector('.fact-val b'), a, a + 0.12, 0, parseFloat(data[i].value), data[i].value.indexOf('.') >= 0 ? 1 : 0);
      });
      T.fade(st.querySelector('.ai-q'), 0.22, 0.3, { y: 0, x: -18 * BM.dir() });
      T.fade(st.querySelector('.ai-av'), 0.44, 0.48, { y: 0 });
      T.fade(st.querySelector('.ai-lead'), 0.44, 0.5, { y: 6 });
      segs.forEach(function (s, j) { T.fade(s, 0.46 + j * 0.15, 0.54 + j * 0.15, { y: 6 }); });
      // The coach reads the data the question is about, then each sentence lights the number it uses.
      T.fn(0, 1, function (k, p) {
        var scanning = p >= 0.31 && p < 0.45;
        reads.classList.toggle('on', scanning);
        facts.forEach(function (f, i) { f.classList.toggle('scan', scanning && p >= 0.31 + i * 0.04); });
        var lit = -1;
        if (p >= 0.46 && p < 0.92) {
          var j = Math.min(segs.length - 1, Math.floor((p - 0.46) / 0.15));
          lit = +segs[j].getAttribute('data-k');
        }
        setLit(st, lit);
      });
    }
  };

  // ================================================================ VI. Consistency
  var ICONS = { water: 'streakWater', supplements: 'streakSupplements', training: 'streakTraining' };
  S.consistency = {
    render: function (st) {
      st.className = 'stage cm';
      st.textContent = '';
      var tasks = h('div', { class: 'cm-tasks' },
        label(t('cmToday')),
        t('cmTasks').map(function (k) {
          return h('div', { class: 'task done', 'data-k': k.key },
            h('span', { class: 'task-ic', 'aria-hidden': 'true' },
              h('img', { src: 'assets/icon-' + ICONS[k.key] + 'L.png', alt: '', width: 40, height: 40 }),
              h('img', { class: 'gold', src: 'assets/icon-' + ICONS[k.key] + 'LGold.png', alt: '', width: 40, height: 40 })),
            h('span', { class: 'task-txt' }, h('b', { text: k.name }), h('span', { text: k.sub })),
            h('span', { class: 'streak' }, h('b', { class: 'num', text: String(k.from + 1) }), h('small', { text: t('cmStreak') })),
            h('span', { class: 'tick', html: CHECK }));
        }),
        h('div', { class: 'cm-star' },
          h('img', { src: 'assets/icon-starLGold.png', alt: '', width: 30, height: 30 }),
          h('span', { text: t('cmStar') }),
          h('b', { text: t('cmStarGain') })));
      var ch = h('div', { class: 'cm-char' },
        h('div', { class: 'char-stage' },
          h('img', { class: 'c-from', src: 'assets/char-beginner.webp', alt: '', width: 640, height: 640 }),
          h('img', { class: 'c-to', src: 'assets/char-strong.webp', alt: '', width: 640, height: 640 })),
        h('div', { class: 'lvl' },
          h('span', { class: 'lvl-l', text: t('cmLevel') }),
          h('b', { class: 'lvl-name', text: t('cmLevelTo') }),
          h('span', { class: 'lvl-stars' }, h('img', { src: 'assets/icon-starLGold.png', alt: '', width: 14, height: 14 }), h('b', { class: 'num', text: '7' }), ' ' + t('cmStars'))),
        h('div', { class: 'lvl-bar', 'aria-hidden': 'true' }, h('i', { class: 'lvl-fill' })),
        h('p', { class: 'lvl-cap', text: t('cmNext') }));
      st.append(tasks, ch);
      st.querySelector('.lvl-fill').style.transform = 'scaleX(' + (7 / 30) + ')';
    },
    timeline: function (st, T) {
      var data = t('cmTasks');
      st.querySelectorAll('.task').forEach(function (el, i) {
        var a = 0.04 + i * 0.15, gold = el.querySelector('.gold');
        T.cls(el, 'done', a + 0.05);
        T.draw(el.querySelector('.tick .ck'), a + 0.05, a + 0.09);
        T.fn(a + 0.02, a + 0.09, function (k) { gold.style.opacity = String(k); });
        T.swap(el.querySelector('.streak b'), a + 0.08, String(data[i].from), String(data[i].from + 1));
      });
      // All of today's streaks done → one star → 7 stars is the Strong level.
      var star = st.querySelector('.cm-star'), starImg = star.querySelector('img');
      T.fade(star, 0.52, 0.58, { y: 6 });
      T.fn(0.53, 0.62, function (k) {
        var e = E.out(k);
        starImg.style.transform = k >= 1 ? '' : 'scale(' + (0.5 + 0.5 * e) + ') rotate(' + (-25 * (1 - e)) + 'deg)';
      });
      T.swap(st.querySelector('.lvl-stars b'), 0.64, '6', '7');
      var fill = st.querySelector('.lvl-fill');
      T.fn(0, 1, function (k, p) {
        var f = p < 0.64 ? 6 / 7 : p < 0.76 ? lerp(6 / 7, 1, seg(p, 0.64, 0.7)) : lerp(1, 7 / 30, E.inOut(seg(p, 0.76, 0.84)));
        fill.style.transform = 'scaleX(' + f + ')';
      });
      var from = st.querySelector('.c-from'), to = st.querySelector('.c-to');
      T.fn(0.7, 0.8, function (k) {
        var e = E.out(k);
        from.style.opacity = String(1 - k);
        to.style.opacity = String(k);
        to.style.transform = k >= 1 ? '' : 'translateY(' + (10 * (1 - e)) + 'px) scale(' + (0.98 + 0.02 * e) + ')';
      });
      T.swap(st.querySelector('.lvl-name'), 0.74, t('cmLevelFrom'), t('cmLevelTo'));
      T.fade(st.querySelector('.lvl-cap'), 0.84, 0.92, { y: 4 });
    }
  };

  // ================================================================ VII. Competition
  // Rows sit on a fixed grid (--row) so a re-ranking can follow the scroll smoothly in both directions.
  var USERS = ['fahad', 'you', 'khalid'];
  var LIFTS = { khalid: 1.45, fahad: 1.3, you: 1.2 };
  var BOARD = { commitment: { fahad: 22, you: 23, khalid: 18 }, lifts: LIFTS, weight: { you: 64, khalid: 52, fahad: 41 } };
  function fmtScore(crit, v) {
    if (crit === 'lifts') return BM.fmt(v, 2) + '×';
    if (crit === 'weight') return v + '%';
    return String(v);
  }
  function orderOf(vals) {
    var pos = {};
    Object.keys(vals).sort(function (a, b) { return vals[b] - vals[a]; }).forEach(function (u, i) { pos[u] = i; });
    return pos;
  }
  function placeRows(st, pos) {
    st.querySelectorAll('.cp-list li').forEach(function (li) {
      var u = li.getAttribute('data-u'), r = Math.round(pos[u]);
      li.style.transform = 'translateY(calc(var(--row) * ' + pos[u].toFixed(4) + '))';
      li.querySelector('.rank').textContent = String(r + 1);
      li.classList.toggle('first', r === 0);
    });
  }
  function paintScores(st, crit, vals) {
    st.querySelectorAll('.cp-list li').forEach(function (li) {
      var u = li.getAttribute('data-u');
      li.querySelector('.score b').textContent = fmtScore(crit, vals[u]);
      li.querySelector('.star-u').style.display = crit === 'commitment' ? '' : 'none';
    });
  }
  function setCrit(st, crit) {
    if (st._crit === crit) return;
    st._crit = crit;
    st.querySelectorAll('.crit').forEach(function (b) {
      var on = b.getAttribute('data-c') === crit;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    st.querySelector('.cp-note').textContent = t('cpCrit').filter(function (x) { return x.key === crit; })[0].note;
    moveIndicator(st.querySelector('.cp-crit'));
  }
  function mixPos(a, b, k) { var o = {}; USERS.forEach(function (u) { o[u] = lerp(a[u], b[u], k); }); return o; }

  S.competition = {
    render: function (st) {
      st.className = 'stage cp';
      st.textContent = '';
      st._crit = null;
      var names = t('cpUsers');
      var chips = h('div', { class: 'cp-crit seg', role: 'tablist' },
        h('i', { class: 'ind', 'aria-hidden': 'true', 'data-keep-style': '' }),
        t('cpCrit').map(function (c) { return h('button', { class: 'crit', type: 'button', role: 'tab', 'data-c': c.key, text: c.name }); }));
      var list = h('ol', { class: 'cp-list' }, USERS.map(function (u) {
        return h('li', { 'data-u': u, class: u === 'you' ? 'you' : '' },
          h('span', { class: 'rank num' }),
          h('span', { class: 'av', 'aria-hidden': 'true', text: names[u].charAt(0) }),
          h('span', { class: 'cp-name', text: names[u] }),
          h('span', { class: 'score' },
            h('span', { class: 'gain', 'aria-hidden': 'true', text: '+2' }),
            h('b', { class: 'num', dir: 'ltr' }),
            h('img', { class: 'star-u', src: 'assets/icon-starLGold.png', alt: '', width: 16, height: 16 })));
      }));
      st.append(h('div', { class: 'cp-head' }, h('b', { text: t('cpGroup') }), h('span', { text: t('cpBy') })), chips, h('p', { class: 'cp-note' }), list);
      setCrit(st, 'lifts');
      paintScores(st, 'lifts', LIFTS);
      placeRows(st, orderOf(LIFTS));
      requestAnimationFrame(function () { moveIndicator(chips); });
      // After the example, any criterion can be picked and the ranking moves to match.
      chips.addEventListener('click', function (e) {
        var b = e.target.closest('.crit');
        if (!b || (st._p != null && st._p < 1)) return;
        var crit = b.getAttribute('data-c');
        list.classList.add('manual');
        setCrit(st, crit);
        paintScores(st, crit, BOARD[crit]);
        placeRows(st, orderOf(BOARD[crit]));
        clearTimeout(st._manualTimer);
        st._manualTimer = setTimeout(function () { list.classList.remove('manual'); }, 700);
      });
    },
    timeline: function (st, T) {
      var before = { fahad: 22, you: 21, khalid: 18 };
      var P0 = orderOf(before), P1 = orderOf(BOARD.commitment), P2 = orderOf(LIFTS);
      var you = st.querySelector('[data-u="you"]'), gain = you.querySelector('.gain');
      var scores = st.querySelectorAll('.score b');
      T.fn(0, 1, function (k, p) {
        var crit = p < 0.55 ? 'commitment' : 'lifts';
        setCrit(st, crit);
        // You earn two stars and pass Fahad; then the group is ranked by lifts instead.
        var mine = Math.round(lerp(21, 23, seg(p, 0.15, 0.3)));
        paintScores(st, crit, crit === 'commitment' ? { fahad: 22, you: mine, khalid: 18 } : LIFTS);
        var dip = Math.sin(Math.PI * seg(p, 0.52, 0.58));
        scores.forEach(function (s) { s.style.opacity = dip ? String(1 - 0.8 * dip) : ''; });
        gain.style.opacity = String(Math.min(seg(p, 0.15, 0.2), 1 - seg(p, 0.3, 0.36)));
        var pos = p < 0.6 ? mixPos(P0, P1, E.inOut(seg(p, 0.3, 0.45))) : mixPos(P1, P2, E.inOut(seg(p, 0.6, 0.78)));
        placeRows(st, pos);
      });
    }
  };

  // ================================================================ Gather (markup lives in index.html)
  var SCATTER = [[-0.30, -2.4], [0.26, -1.5], [-0.38, 0.9], [0.34, 1.9], [-0.06, 2.8], [0.12, -3.1]];
  S.gather = {
    render: function (st) { clearStyles(st); },
    timeline: function (st, T) {
      var w = st.getBoundingClientRect().width;
      st.querySelectorAll('.w').forEach(function (el, i) {
        var s = SCATTER[i % SCATTER.length], sx = s[0] * w * 0.9, sy = s[1] * 1.2;
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
      var cfg = BM.config, rowsT = t('prRows');
      var total = cfg.comparison.rows.reduce(function (s, r) { return s + r.monthly; }, 0);
      var list = h('ul', { class: 'pr-list' }, cfg.comparison.rows.map(function (r) {
        var tx = rowsT[r.key];
        return h('li', { class: 'pr-row struck' },
          h('img', { class: 'pr-ic', src: 'assets/cmp-' + r.key + '.webp', alt: '', width: 40, height: 40 }),
          h('div', { class: 'pr-cat' },
            h('p', null, h('b', { text: tx.cat })),
            h('p', { class: 'pr-quip', text: tx.quip })),
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
