/* =========================================================================
   うちの子の星 — main.js
   ========================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------------
     1. header
     ------------------------------------------------------------------- */
  var hdr = document.getElementById('hdr');
  if (hdr) {
    var heroEl = document.querySelector('.hero3');
    var solid = function () {
      hdr.classList.toggle('solid', window.scrollY > 40);
      if (heroEl) {
        var over = window.scrollY < heroEl.offsetHeight - 90;
        hdr.classList.toggle('over', over);
      }
    };
    window.addEventListener('scroll', solid, { passive: true });
    solid();
  }

  /* -------------------------------------------------------------------
     2. mobile nav
     ------------------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    var scrollY = 0;
    var lastFocus = null;
    /* CSS のブレークポイント（860px）と同じ基準 */
    var mq = window.matchMedia('(max-width:860px)');
    function isMobileNav() { return mq.matches; }

    /* iOS Safari は body{overflow:hidden} を無視するため、
       位置を保存して body を fixed にする方式で固定する */
    function lockScroll() {
      scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      document.body.style.top = (-scrollY) + 'px';
      document.body.classList.add('nav-lock');
    }
    function unlockScroll() {
      document.body.classList.remove('nav-lock');
      document.body.style.top = '';
      /* html{scroll-behavior:smooth} が効いていると元の位置へ戻るのに
         時間がかかり「止まった」ように見えるので、一時的に即ジャンプさせる */
      var html = document.documentElement;
      var prev = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      try { window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' }); }
      catch (e) { window.scrollTo(0, scrollY); }
      /* レイアウト復帰後のズレを next frame でもう一度そろえる */
      requestAnimationFrame(function () { window.scrollTo(0, scrollY); });
      setTimeout(function () { html.style.scrollBehavior = prev; }, 60);
    }

    function openNav() {
      if (nav.classList.contains('open')) return;
      lastFocus = document.activeElement;
      lockScroll();
      nav.classList.add('open');
      burger.classList.add('on');
      burger.setAttribute('aria-expanded', 'true');
      if (isMobileNav()) nav.removeAttribute('aria-hidden');
      /* 最初のリンクにフォーカスを移す（読み上げ・キーボード操作のため） */
      var first = nav.querySelector('a');
      if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
    }

    function closeNav(returnFocus) {
      if (!nav.classList.contains('open')) return;
      nav.classList.remove('open');
      burger.classList.remove('on');
      burger.setAttribute('aria-expanded', 'false');
      if (isMobileNav()) nav.setAttribute('aria-hidden', 'true');
      unlockScroll();
      if (returnFocus !== false) {
        try { (lastFocus || burger).focus({ preventScroll: true }); }
        catch (e) { /* 古いブラウザは無視 */ }
      }
      lastFocus = null;
    }

    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (nav.classList.contains('open')) closeNav(); else openNav();
    });

    /* リンクを押したら閉じる（#anchor でも通常通り遷移させる） */
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav(false);
    });

    /* 背景（ナビの何もない部分）をタップしたら閉じる —— 以前は何も起きず固まって見えた */
    nav.addEventListener('click', function (e) {
      if (e.target === nav) closeNav();
    });

    /* ESC キーで閉じる */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') closeNav();
    });

    /* タブでメニュー外に出ないようにする（フォーカストラップ） */
    nav.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = nav.querySelectorAll('a, button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* 画面を横に広げてメニューが不要になったら閉じる */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && nav.classList.contains('open')) closeNav(false);
    });

    /* 初期状態：モバイルのときだけ「閉じている」ことを支援技術へ伝える。
       デスクトップでは nav は常に見えているので aria-hidden を付けてはいけない。 */
    if (isMobileNav()) nav.setAttribute('aria-hidden', 'true');
    mq.addEventListener ? mq.addEventListener('change', onMq)
                        : mq.addListener && mq.addListener(onMq);
    function onMq(e) {
      if (e.matches) { if (!nav.classList.contains('open')) nav.setAttribute('aria-hidden', 'true'); }
      else nav.removeAttribute('aria-hidden');
    }
  }

  /* -------------------------------------------------------------------
     3. reveal on scroll
     ------------------------------------------------------------------- */
  var rvEls = document.querySelectorAll('[data-rv]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -8% 0px' });
    rvEls.forEach(function (el) { io.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* failsafe: 画面内なのに reveal されない要素を必ず表示する */
  setTimeout(function () {
    var vh = window.innerHeight || 800;
    rvEls.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 1.25 && r.bottom > -200) el.classList.add('in');
    });
  }, 2200);

  /* -------------------------------------------------------------------
     4. year
     ------------------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* -------------------------------------------------------------------
     5. starfield
     ------------------------------------------------------------------- */
  (function starfield() {
    var cv = document.getElementById('starfield');
    if (!cv || reduceMotion) return;
    var ctx = cv.getContext('2d');
    var stars = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      var r = cv.parentElement.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      var n = Math.round(Math.min(180, (w * h) / 11000));
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.92,
          r: Math.random() * 1.25 + 0.25,
          a: Math.random() * 0.55 + 0.14,
          sp: Math.random() * 0.9 + 0.25,
          ph: Math.random() * Math.PI * 2,
          gold: Math.random() > 0.78
        });
      }
    }

    var t = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = reduceMotion ? 1 : (0.66 + 0.34 * Math.sin(t * s.sp + s.ph));
        ctx.globalAlpha = s.a * tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? '#B99A5B' : '#3A3630';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t += 0.016;
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    draw();
  })();

  /* -------------------------------------------------------------------
     6. moon phase (簡易計算) + SVG
     ------------------------------------------------------------------- */
  var SYNODIC = 29.530588853;
  var REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);
  var RAD = Math.PI / 180, DEG = 180 / Math.PI;

  /* 太陽黄経（Meeus 25.2 / 誤差 約0.01°） */
  function sunLon(T) {
    var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    var M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * RAD)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M * RAD)
          + 0.000289 * Math.sin(3 * M * RAD);
    return (L0 + C + 360) % 360;
  }

  /* 月黄経・黄緯（Meeus 47 の主要項。/ 誤差 約0.05°） */
  function moonLon(T) {
    var Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
    var D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
    var M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
    var Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
    var F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
    var dl =
        6.288774 * Math.sin(Mp * RAD)
      + 1.274027 * Math.sin((2 * D - Mp) * RAD)
      + 0.658314 * Math.sin(2 * D * RAD)
      + 0.213618 * Math.sin(2 * Mp * RAD)
      - 0.185116 * Math.sin(M * RAD)
      - 0.114332 * Math.sin(2 * F * RAD)
      + 0.058793 * Math.sin((2 * D - 2 * Mp) * RAD)
      + 0.057066 * Math.sin((2 * D - M - Mp) * RAD)
      + 0.053322 * Math.sin((2 * D + Mp) * RAD)
      + 0.045758 * Math.sin((2 * D - M) * RAD)
      - 0.040923 * Math.sin((M - Mp) * RAD)
      - 0.034720 * Math.sin(D * RAD)
      - 0.030383 * Math.sin((M + Mp) * RAD)
      + 0.015327 * Math.sin((2 * D - 2 * F) * RAD)
      - 0.012528 * Math.sin((Mp + 2 * F) * RAD);
    var db =
        5.128122 * Math.sin(F * RAD)
      + 0.280602 * Math.sin((Mp + F) * RAD)
      + 0.277693 * Math.sin((Mp - F) * RAD);
    return { lon: (Lp + dl + 360) % 360, lat: db };
  }

  /* 月齢・照度・月相角（実際の天文計算 / サーバー不要） */
  function moonOf(date) {
    var jd = date.getTime() / 86400000 + 2440587.5;
    var T  = (jd - 2451545.0) / 36525;
    var ls = sunLon(T);
    var mm = moonLon(T);

    /* 太陽と月の角距離（離角） */
    var cosPsi = Math.cos(mm.lat * RAD) * Math.cos((mm.lon - ls) * RAD);
    var psi = Math.acos(Math.max(-1, Math.min(1, cosPsi))) * DEG;

    /* 位相角 i → 照度 k = (1 + cos i) / 2 */
    var delta = 385000.6 / 1.495978707e8;              /* 月までの距離 / 1AU */
    var i = Math.atan2(Math.sin(psi * RAD), delta - Math.cos(psi * RAD)) * DEG;
    var k = (1 + Math.cos(i * RAD)) / 2;               /* 0=新月, 1=満月 */

    /* 月齢（平均朔望月で換算） */
    var age = ((date.getTime() - REF_NEW_MOON) / 86400000) % SYNODIC;
    if (age < 0) age += SYNODIC;

    var norm = age / SYNODIC;                          /* 0..1 */
    var cosK = Math.cos(2 * Math.PI * norm);           /* SVG 用（1=新月） */
    return { norm: norm, k: cosK, illum: k, age: age, psi: psi, phaseAngle: i };
  }

  function moonName(norm) {
    if (norm < 0.033 || norm > 0.967) return '新月';
    if (norm < 0.21) return '三日月';
    if (norm < 0.29) return '上弦の月';
    if (norm < 0.46) return '満ちていく月';
    if (norm < 0.54) return '満月';
    if (norm < 0.71) return '欠けていく月';
    if (norm < 0.79) return '下弦の月';
    return '有明月';
  }

  /* 月の形を SVG で描く（地の色は CSS 側で渡す） */
  function moonSVG(r, k, isWaxing, dark, light) {
    var rx = Math.abs(k) * r;
    var path;
    if (rx < 0.6) {
      path = 'M0,-' + r + ' A' + r + ',' + r + ' 0 0 1 0,' + r +
             ' L0,-' + r + ' Z';
    } else {
      var sweep = k > 0 ? 0 : 1;
      path = 'M0,-' + r +
             ' A' + r + ',' + r + ' 0 0 1 0,' + r +
             ' A' + rx.toFixed(2) + ',' + r + ' 0 0 ' + sweep + ' 0,-' + r + ' Z';
    }
    var g = isWaxing ? '' : ' transform="scale(-1,1)"';
    return '<svg viewBox="' + (-r - 2) + ' ' + (-r - 2) + ' ' + (r * 2 + 4) + ' ' + (r * 2 + 4) +
      '" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="0" cy="0" r="' + r + '" fill="' + dark + '"/>' +
      '<g' + g + '><path d="' + path + '" fill="' + light + '"/></g>' +
      '<circle cx="0" cy="0" r="' + r + '" fill="none" stroke="' + light +
      '" stroke-opacity=".22" stroke-width=".8"/>' +
      '</svg>';
  }

  (function moonWidget() {
    var input = document.getElementById('moonDate');
    var face = document.getElementById('moonFace');
    var pct = document.getElementById('moonPct');
    var nm = document.getElementById('moonName');
    if (!input || !face) return;

    var today = new Date();
    var iso = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');
    input.value = iso;

    function render() {
      var d = input.value ? new Date(input.value + 'T21:00:00+09:00') : new Date();
      if (isNaN(d.getTime())) return;
      var m = moonOf(d);
      face.innerHTML = moonSVG(20, m.k, m.norm <= 0.5, '#1E242E', '#E8D9B4');
      pct.textContent = Math.round(m.illum * 100) + '%';
      nm.textContent = moonName(m.norm) + '・月齢 ' + m.age.toFixed(1);
    }
    input.addEventListener('change', render);
    input.addEventListener('input', render);
    render();
  })();

  /* -------------------------------------------------------------------
     7. certificate star chart（実測の高度・方位から作図）
     ------------------------------------------------------------------- */
  (function certSky() {
    var host = document.getElementById('certSky');
    if (!host) return;

    /* 2026-11-03 21:00 JST / 東京 における実際の計算値 */
    var stars = [
      { name: 'ベガ',     alt: 26.2, az: 300 },
      { name: 'デネブ',   alt: 50.1, az: 300 },
      { name: 'カペラ',   alt: 33.0, az: 54  },
      { name: 'アルタイル', alt: 25.8, az: 262 }
    ];

    /* 方位・高度 → 平面（天頂から見た図） */
    var pts = stars.map(function (s) {
      var a = s.az * Math.PI / 180;
      var r = (90 - s.alt); /* 天頂からの距離 */
      return {
        name: s.name,
        x: r * Math.sin(a) * -1,
        y: r * Math.cos(a) * -1
      };
    });

    var W = 260, H = 150, pad = 26;
    var xs = pts.map(function (p) { return p.x; });
    var ys = pts.map(function (p) { return p.y; });
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
    var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);

    function nx(v) { return pad + (v - minX) / (maxX - minX) * (W - pad * 2); }
    function ny(v) { return pad + (v - minY) / (maxY - minY) * (H - pad * 2); }

    var g = [];
    /* 薄いグリッド */
    for (var i = 1; i < 4; i++) {
      g.push('<line x1="' + (W / 4 * i) + '" y1="0" x2="' + (W / 4 * i) + '" y2="' + H +
        '" stroke="#A8894F" stroke-opacity=".10" stroke-width=".6"/>');
    }
    g.push('<line x1="0" y1="' + (H / 2) + '" x2="' + W + '" y2="' + (H / 2) +
      '" stroke="#A8894F" stroke-opacity=".10" stroke-width=".6"/>');

    /* 星座線（ゆるい結び） */
    var order = [0, 1, 2];
    var d = 'M' + nx(pts[order[0]].x) + ',' + ny(pts[order[0]].y);
    for (var j = 1; j < order.length; j++) {
      d += ' L' + nx(pts[order[j]].x) + ',' + ny(pts[order[j]].y);
    }
    g.push('<path d="' + d + '" fill="none" stroke="#A8894F" stroke-opacity=".30" ' +
      'stroke-width=".7" stroke-dasharray="2 3"/>');

    /* 星 */
    pts.forEach(function (p) {
      var x = nx(p.x), y = ny(p.y);
      g.push('<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
        '" r="3.4" fill="none" stroke="#A8894F" stroke-opacity=".34" stroke-width=".6"/>');
      g.push('<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
        '" r="1.5" fill="#A8894F" fill-opacity=".85"/>');
      g.push('<text x="' + (x + 7).toFixed(1) + '" y="' + (y + 3).toFixed(1) +
        '" font-size="9.5" letter-spacing="1" fill="#4A453C" fill-opacity=".8" ' +
        'font-family="serif">' + p.name + '</text>');
    });

    host.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="width:100%;height:auto">' + g.join('') + '</svg>';
  })();

  /* -------------------------------------------------------------------
     8. Japan map (シルエット + 都道府県ドット + 沖縄の別枠)
     ------------------------------------------------------------------- */
  (function jpMap() {
    var host = document.getElementById('jpMap');
    var grid = document.getElementById('regionGrid');
    var totalEl = document.getElementById('mapTotal');
    if (!host || !window.PREFECTURES) return;

    var P = window.PREFECTURES;
    var REG = window.REGIONS;
    var GEO = window.JAPAN_GEO || {};

    var MAIN_KEYS = ['hokkaido', 'honshu', 'shikoku', 'kyushu',
                     'sado', 'awaji', 'tanegashima', 'yakushima'];
    var INSET_KEYS = ['okinawa'];

    /* 夜空の実写の上に載るので、暗い地面向けの色にする */
    var INK_LAND = '#FFFFFF';
    var INK_LAND_OP = '.075';
    var INK_EDGE = '#E8D9B4';
    var GOLD = '#E8D9B4';
    var DIM = '#E8D9B4';
    var DIM_OP = '.30';

    /* ---------- 投影を作る ---------- */
    function makeProj(keys, box, pad) {
      var pts = [];
      keys.forEach(function (k) {
        (GEO[k] || []).forEach(function (d) { pts.push(d); });
      });
      if (!pts.length) return null;
      var minLon = 1e9, maxLon = -1e9, minLat = 1e9, maxLat = -1e9;
      pts.forEach(function (d) {
        minLon = Math.min(minLon, d[0]); maxLon = Math.max(maxLon, d[0]);
        minLat = Math.min(minLat, d[1]); maxLat = Math.max(maxLat, d[1]);
      });
      var midLat = (minLat + maxLat) / 2;
      var kx = Math.cos(midLat * Math.PI / 180);
      var wSpan = (maxLon - minLon) * kx;
      var hSpan = maxLat - minLat;
      var k = Math.min((box.w - pad * 2) / wSpan, (box.h - pad * 2) / hSpan);
      var ox = box.x + (box.w - wSpan * k) / 2;
      var oy = box.y + (box.h - hSpan * k) / 2;
      return {
        kx: kx, k: k, ox: ox, oy: oy, maxLat: maxLat, minLon: minLon,
        x: function (lon) { return ox + (lon - minLon) * kx * k; },
        y: function (lat) { return oy + (maxLat - lat) * k; }
      };
    }

    function pathOf(keys, pr) {
      var d = '';
      keys.forEach(function (key) {
        var pts = GEO[key];
        if (!pts || !pts.length) return;
        d += pts.map(function (p, i) {
          return (i ? 'L' : 'M') + pr.x(p[0]).toFixed(1) + ',' + pr.y(p[1]).toFixed(1);
        }).join('') + 'Z';
      });
      return d;
    }

    /* ---------- レイアウト ---------- */
    var VW = 320;
    var VH = 470;
    var MAP_BOX = { x: 0, y: 0, w: VW, h: 400 };
    var INSET = { x: 6, y: 398, w: 96, h: 66 };

    var prMain = makeProj(MAIN_KEYS, MAP_BOX, 20);
    var prInset = makeProj(INSET_KEYS, INSET, 10);
    if (!prMain) return;

    var counts = {};

    /* tools/build_memorial.py が書き出す entries.js（public のみ）を読む */
    function seedFromEntries() {
      var src = window.ENTRIES;
      if (!src) return false;
      Object.keys(src).forEach(function (k) {
        counts[k] = (src[k] || []).length;
      });
      return true;
    }

    function dotFor(p, pr, r) {
      var c = counts[p.name] || 0;
      var x = pr.x(p.lon), y = pr.y(p.lat);
      var lit = c > 0;
      var g = '';
      if (lit) {
        g += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
          '" r="' + (r * 2.7).toFixed(1) + '" fill="' + GOLD + '" fill-opacity=".13"/>';
        g += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
          '" r="' + (r * 1.75).toFixed(1) + '" fill="none" stroke="' + GOLD +
          '" stroke-opacity=".42" stroke-width=".65"/>';
      }
      g += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
        '" r="' + (lit ? r : r * 0.6).toFixed(1) + '" fill="' + (lit ? GOLD : DIM) +
        '" fill-opacity="' + (lit ? '.98' : DIM_OP) + '"/>';
      return g;
    }

    function draw() {
      var g = [];

      /* ===== 本土 ===== */
      var mainPath = pathOf(MAIN_KEYS, prMain);

      g.push('<path d="' + mainPath + '" fill="' + INK_LAND +
        '" fill-opacity="' + INK_LAND_OP + '" stroke="' + INK_EDGE +
        '" stroke-opacity=".72" stroke-width=".8" stroke-linejoin="round"/>');

      /* 内陸に薄いハッチ（等高線風） */
      g.push('<clipPath id="jpClip"><path d="' + mainPath + '"/></clipPath>');
      g.push('<g clip-path="url(#jpClip)" opacity=".5">');
      for (var yy = 0; yy < 400; yy += 11) {
        g.push('<line x1="0" y1="' + yy + '" x2="' + VW + '" y2="' + (yy + 5) +
          '" stroke="' + INK_EDGE + '" stroke-width=".4" stroke-opacity=".09"/>');
      }
      g.push('</g>');

      /* ===== 沖縄の別枠 ===== */
      g.push('<rect x="' + INSET.x + '" y="' + INSET.y + '" width="' + INSET.w +
        '" height="' + INSET.h + '" fill="none" stroke="' + INK_EDGE +
        '" stroke-width=".7" stroke-dasharray="3 3" opacity=".7"/>');
      g.push('<text x="' + (INSET.x + 6) + '" y="' + (INSET.y + 11) +
        '" font-size="14" letter-spacing=".8" fill="' + INK_EDGE +
        '" fill-opacity=".8" font-family="serif">冲縄</text>');

      if (prInset) {
        var insetPath = pathOf(INSET_KEYS, prInset);
        g.push('<path d="' + insetPath + '" fill="' + INK_LAND +
          '" fill-opacity="' + INK_LAND_OP + '" stroke="' + INK_EDGE +
          '" stroke-opacity=".72" stroke-width=".7" stroke-linejoin="round"/>');
      }

      /* ===== ドット ===== */
      P.forEach(function (p) {
        if (INSET_KEYS && p.lon > 126 && p.lon < 131 && p.lat < 28) {
          if (prInset) g.push(dotFor(p, prInset, 1.9));
        } else {
          g.push(dotFor(p, prMain, 2.4));
        }
      });

      /* ===== ラベル ===== */
      [['北海道', 141.35, 43.06, 'start', 7, 13],
       ['東京',   139.69, 35.69, 'start', 7, 12],
       ['大阪',   135.50, 34.69, 'end',  -6, 12],
       ['福岡',   130.42, 33.61, 'end',  -6, 11],
       ['仙台',   140.87, 38.27, 'start', 7, 3],
       ['那覇',   127.68, 26.21, 'start', 6, 10]].forEach(function (L) {
        var pr = (L[0] === '那覇') ? prInset : prMain;
        if (!pr) return;
        g.push('<text x="' + (pr.x(L[1]) + L[4]).toFixed(1) +
          '" y="' + (pr.y(L[2]) + L[5]).toFixed(1) +
          '" font-size="15" letter-spacing=".4" fill="#F2E7CE" fill-opacity=".88" ' +
          'text-anchor="' + L[3] + '" font-family="serif">' + L[0] + '</text>');
      });

      /* ===== 方位 ===== */
      g.push('<g opacity=".42" transform="translate(' + (VW - 22) + ',24)">' +
        '<circle r="9" fill="none" stroke="' + GOLD + '" stroke-width=".55"/>' +
        '<path d="M0,-11.5 l2.8,8 -2.8,-2 -2.8,2 z" fill="' + GOLD + '"/>' +
        '<text y="21" font-size="14" fill="' + GOLD + '" text-anchor="middle" ' +
        'letter-spacing=".8">N</text></g>');

      /* ===== 縮尺バー（雰囲気） ===== */
      g.push('<g opacity=".4" transform="translate(' + (VW - 76) + ',' + (VH - 14) + ')">' +
        '<line x1="0" y1="0" x2="52" y2="0" stroke="' + GOLD + '" stroke-width=".7"/>' +
        '<line x1="0" y1="-3" x2="0" y2="3" stroke="' + GOLD + '" stroke-width=".7"/>' +
        '<line x1="52" y1="-3" x2="52" y2="3" stroke="' + GOLD + '" stroke-width=".7"/>' +
        '<text x="26" y="-6" font-size="11" fill="' + GOLD + '" text-anchor="middle" ' +
        'letter-spacing=".6">1,000 km</text></g>');

      host.innerHTML = '<svg viewBox="0 0 ' + VW + ' ' + VH + '" xmlns="http://www.w3.org/2000/svg" ' +
        'style="width:100%;height:auto" role="img" aria-label="日本地図">' + g.join('') + '</svg>';

      /* ===== 地方グリッド ===== */
      if (grid) {
        grid.innerHTML = REG.map(function (r) {
          var sum = P.filter(function (p) { return p.region === r.key; })
            .reduce(function (a, p) { return a + (counts[p.name] || 0); }, 0);
          return '<button type="button" class="' + (sum === 0 ? 'zero' : '') + '" ' +
            'onclick="location.href=\'map.html\'">' +
            '<span>' + r.name + '</span><b>' + sum + '</b></button>';
        }).join('');
      }

      var total = Object.keys(counts).reduce(function (a, kk) { return a + counts[kk]; }, 0);

      /* 0 件のときは数字を出さない。「1」すら出すと、まだ何もないことが
         かえって強調されるため。10 件を超えたら件数を出す。 */
      if (totalEl) {
        if (total >= 10) {
          totalEl.hidden = false;
          totalEl.textContent = total + ' の想い';
        } else {
          totalEl.hidden = true;
        }
      }

      /* トップの一文。1件以上あれば出す（10件未満は「いま、Nの星が灯っています」のまま） */
      var lineEl = document.getElementById('mapCountLine');
      var numEl = document.getElementById('mapCountNum');
      if (lineEl && numEl) {
        if (total > 0) {
          numEl.textContent = total;
          lineEl.hidden = false;
        } else {
          lineEl.hidden = true;
        }
      }
    }

    if (seedFromEntries()) {
      draw();
    } else {
      var sc = document.createElement('script');
      sc.src = 'entries.js';
      sc.onload = function () {
        if (seedFromEntries()) draw();
        else draw();
      };
      sc.onerror = function () { draw(); };
      document.head.appendChild(sc);
    }

    /* 集計APIは任意。無い環境（GitHub Pages）では静かに諦める */
    if (window.SITE_CONFIG && window.SITE_CONFIG.mapApi) {
      fetch(window.SITE_CONFIG.mapApi)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { if (d && d.counts) { counts = d.counts; draw(); } })
        .catch(function () {});
    }
  })();

  /* -------------------------------------------------------------------
     9. scroll progress
     ------------------------------------------------------------------- */
  (function progress() {
    var bar = document.getElementById('progress');
    if (!bar) return;
    var tick = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      bar.style.width = (p * 100).toFixed(2) + '%';
    };
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });
    tick();
  })();

  /* -------------------------------------------------------------------
     10. parallax（記念証だけ、ごく弱く）
     ------------------------------------------------------------------- */
  (function parallax() {
    if (reduceMotion) return;
    var el = document.getElementById('cert');
    if (!el) return;
    var sec = document.getElementById('sky');
    if (!sec) return;
    var onScroll = function () {
      var r = sec.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      var t = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      var shift = (t - 0.5) * -34;
      el.style.transform = 'translateY(' + shift.toFixed(1) + 'px)';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

})();
