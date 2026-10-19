/* Cena złota dziś + kalkulator wartości złota - eupersonalfinance.eu, tylko PL.
   Układ: cena na górze, wykres, kalkulator pod spodem. Na żywo: gold-api.com (XAU/USD) x średni kurs USD z NBP. Historia: NBP, ceny złota (próba 1000). */
(function () {
  'use strict';
  var OZ = 31.1034768, NB = ' ';
  var PROBY = [
    { v: '999.9', f: 0.9999, l: '999,9', k: '24 karaty' },
    { v: '999', f: 0.999, l: '999', k: '24 karaty' },
    { v: '960', f: 0.960, l: '960', k: '23 karaty' },
    { v: '916', f: 0.916, l: '916', k: '22 karaty' },
    { v: '750', f: 0.750, l: '750', k: '18 karatów' },
    { v: '585', f: 0.585, l: '585', k: '14 karatów' },
    { v: '500', f: 0.500, l: '500', k: '12 karatów' },
    { v: '375', f: 0.375, l: '375', k: '9 karatów' },
    { v: '333', f: 0.333, l: '333', k: '8 karatów' }
  ];
  var PRODUKTY = [['1 g', 1], ['5 g', 5], ['10 g', 10], ['20 g', 20], ['1 uncja (31,1 g)', OZ], ['50 g', 50], ['100 g', 100], ['250 g', 250], ['1 kg', 1000]];
  var MIES = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
  var D = { g: null, live: false, hist: [], full: false, usd: null, at: null };

  function money(v, dec) {
    if (!isFinite(v)) return '-';
    var d = dec == null ? 2 : dec, parts = Math.abs(v).toFixed(d).split('.');
    return (v < 0 ? '-' : '') + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, NB) + (d ? ',' + parts[1] : '') + NB + 'zł';
  }
  function num(v, d) { var p = v.toFixed(d).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, NB) + (d ? ',' + p[1] : ''); }
  function pct(v) { return (v >= 0 ? '+' : '') + (v * 100).toFixed(2).replace('.', ',') + '%'; }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function kr(s) { var p = s.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  function dlugo(s) { var p = s.split('-'); return parseInt(p[2], 10) + ' ' + MIES[+p[1] - 1] + ' ' + p[0]; }
  function $(id) { return document.getElementById(id); }
  function setText(id, v) { var e = $(id); if (e) e.textContent = v; }
  function row(id, v, cls) { var r = $(id); if (!r) return; var e = r.querySelector('.lfc-dp-row-val'); if (e) { e.textContent = v; e.classList.remove('zl-up', 'zl-down'); if (cls) e.classList.add(cls); } }
  function parseWaga() {
    var el = document.querySelector('[data-type="zl-waga"]'); if (!el) return NaN;
    var raw = String(el.value).replace(/[\s ]/g, ''); if (!raw) return NaN;
    var m = raw.match(/^(.*)[.,](\d{1,3})$/);
    return m ? parseFloat(m[1].replace(/[.,]/g, '') + '.' + m[2]) : parseFloat(raw.replace(/[.,]/g, ''));
  }
  function proba() { var s = document.querySelector('select[data-type="zl-proba"]'), v = s ? s.value : '585'; for (var i = 0; i < PROBY.length; i++) if (PROBY[i].v === v) return PROBY[i]; return PROBY[5]; }

  function fetchJson(url) {
    return new Promise(function (res) {
      var ctl = window.AbortController ? new AbortController() : null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); res(null); }, 9000);
      fetch(url, { cache: 'no-store', signal: ctl ? ctl.signal : undefined })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { clearTimeout(t); res(j); })
        .catch(function () { clearTimeout(t); res(null); });
    });
  }
  function nbpRange(days) {
    var end = new Date(), urls = [], start = new Date(Date.now() - days * 86400000);
    while (start < end) {
      var e = new Date(Math.min(end.getTime(), start.getTime() + 360 * 86400000));
      urls.push('https://api.nbp.pl/api/cenyzlota/' + iso(start) + '/' + iso(e) + '/?format=json');
      start = new Date(e.getTime() + 86400000);
    }
    return Promise.all(urls.map(fetchJson)).then(function (arr) {
      var out = [];
      arr.forEach(function (a) { if (Array.isArray(a)) a.forEach(function (q) { if (q && typeof q.cena === 'number' && q.cena > 50 && q.cena < 5000) out.push({ d: q.data, v: q.cena }); }); });
      return out;
    });
  }

  /* ── Wynik kalkulatora (pod formularzem) ── */
  function run(scroll) {
    if (!D.g) return;
    var w = parseWaga(); if (!(w > 0)) { setText('zl-info', 'Wpisz wagę większą od zera.'); return; }
    var p = proba(), czyste = w * p.f, wart = czyste * D.g, box = $('zl-calc-res');
    if (box) box.style.display = '';
    setText('zl-info', '');
    setText('zl-hl', money(wart));
    setText('zl-r-czyste', num(czyste, 2) + NB + 'g');
    setText('zl-r-gp', money(p.f * D.g));
    setText('zl-calc-note', num(w, w % 1 ? 2 : 0) + NB + 'g złota próby ' + p.l + ' (' + p.k + ') to kruszec wart ' + money(wart) + ' po dzisiejszej cenie. W skupie dostaniesz mniej, bo skup dolicza swoją marżę. Porównaj 2 lub 3 oferty.');
    if (scroll && box) scrollTo(box);
  }

  function scrollTo(t) {
    var n = document.querySelector('.nav_fixed'), h = 80;
    if (n) h = Math.max(n.offsetHeight, n.firstElementChild ? n.firstElementChild.offsetHeight : 0) || 80;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      var r = t.getBoundingClientRect();
      if (r.top >= h && r.bottom <= window.innerHeight) return;
      window.scrollTo({ top: Math.max(0, r.top + window.pageYOffset - h - 24), behavior: 'smooth' });
    }); });
  }

  /* ── Ceny dziś i tabele ── */
  function renderPrices() {
    var g = D.g, h = D.hist, last = h.length ? h[h.length - 1] : null;
    setText('zl-k-g', money(g)); setText('zl-k-585', money(g * 0.585));
    row('zl-r-oz', money(g * OZ)); row('zl-r-kg', money(g * 1000, 0));
    var ks = $('zl-k-g-s');
    if (last) {
      row('zl-r-nbp', money(last.v) + ' (' + kr(last.d) + ')');
      if (ks && h.length > 1) { var c = last.v / h[h.length - 2].v - 1; ks.innerHTML = '<span class="' + (c >= 0 ? 'zl-up' : 'zl-down') + '">' + pct(c) + '</span> od poprzedniego notowania NBP'; }
      var yr = String(new Date().getFullYear()), y0 = null;
      for (var i = 0; i < h.length; i++) { if (h[i].d.slice(0, 4) === yr) break; y0 = h[i]; }
      if (y0) { var cy = last.v / y0.v - 1; row('zl-r-rok', pct(cy), cy >= 0 ? 'zl-up' : 'zl-down'); }
      var r365 = null, lim = iso(new Date(Date.now() - 365 * 86400000));
      for (var j = 0; j < h.length; j++) { if (h[j].d >= lim) { r365 = h[j]; break; } }
      if (r365) { var c1 = last.v / r365.v - 1; row('zl-r-12m', pct(c1), c1 >= 0 ? 'zl-up' : 'zl-down'); }
    } else if (ks) ks.textContent = 'Notowanie na żywo';
    var tp = $('zl-proby'); if (tp) tp.innerHTML = PROBY.map(function (p) { return '<tr><td>' + p.l + '</td><td>' + p.k + '</td><td>' + money(g * p.f) + '</td></tr>'; }).join('');
    var tw = $('zl-produkty'); if (tw) tw.innerHTML = PRODUKTY.map(function (p) { return '<tr><td>' + p[0] + '</td><td>' + money(g * 0.9999 * p[1], p[1] >= 100 ? 0 : 2) + '</td></tr>'; }).join('');
    var now = D.at || new Date(), dot = document.querySelector('#lfc-dp .zl-dot');
    if (dot) dot.classList.toggle('is-live', D.live);
    setText('zl-upd-t', D.live
      ? 'Na żywo, ' + dlugo(iso(now)) + ', ' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + '. Cena spot XAU/USD przeliczona po średnim kursie dolara NBP (' + num(D.usd, 4) + NB + 'zł).'
      : 'Cena złota NBP z ' + dlugo(last.d) + '. Notowanie na żywo jest chwilowo niedostępne.');
  }

  /* ── Wykres historyczny w karcie wykresu ── */
  var chart = null, days = 365;
  function loadChart() { return new Promise(function (ok) { if (window.Chart) return ok(); var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js'; s.onload = ok; document.head.appendChild(s); }); }
  function setupChartCard() {
    var c = $('lfc-dp-chart'); if (!c || c.getAttribute('data-zl')) return;
    c.setAttribute('data-zl', '1');
    var t = c.querySelector('.lfc-dp-chart-title'); if (t) t.textContent = 'Cena złota w złotówkach (za 1 g)';
    var wrap = c.querySelector('.lfc-dp-chart-wrap');
    var html = '<div class="zl-zakres" role="group" aria-label="Zakres wykresu">' +
      [['30', '1 mies.'], ['91', '3 mies.'], ['365', '1 rok'], ['1826', '5 lat']].map(function (z) { return '<button type="button" class="zl-btn' + (z[0] === '365' ? ' is-active' : '') + '" data-dni="' + z[0] + '">' + z[1] + '</button>'; }).join('') +
      '</div><div class="zl-line"><canvas id="lfc-dp-donut"></canvas></div><p class="zl-sub">Ostatnie notowania NBP</p><div class="zl-scroll"><table class="zl-table"><thead><tr><th>Data</th><th>Cena za 1 g</th><th>Zmiana</th></tr></thead><tbody id="zl-hist"></tbody></table></div><p class="zl-src">Źródło: Narodowy Bank Polski, ceny złota obliczane z fixingu LBMA (próba 1000).</p>';
    if (wrap) wrap.outerHTML = '<div class="zl-chart-wrap">' + html + '</div>';
    var wm = c.querySelector('.align-center'); if (wm && wm.querySelector('.table-watermark')) wm.style.display = 'none';
  }
  function renderChart() {
    var from = iso(new Date(Date.now() - days * 86400000));
    var s = D.hist.filter(function (x) { return x.d >= from; });
    setText('lfc-dp-chart-subtitle', s.length ? 'NBP, od ' + kr(s[0].d) + ' do ' + kr(s[s.length - 1].d) : 'NBP');
    var th = $('zl-hist');
    if (th && D.hist.length > 1) {
      var hh = D.hist.slice(-11).reverse(), out = '';
      for (var k = 0; k < hh.length - 1; k++) { var c = hh[k].v / hh[k + 1].v - 1; out += '<tr><td>' + kr(hh[k].d) + '</td><td>' + money(hh[k].v) + '</td><td class="' + (c >= 0 ? 'zl-up' : 'zl-down') + '">' + pct(c) + '</td></tr>'; }
      th.innerHTML = out;
    }
    if (s.length < 2) return;
    loadChart().then(function () {
      var cv = $('lfc-dp-donut'); if (!cv) return;
      if (chart) chart.destroy();
      var ctx = cv.getContext('2d'), grad = ctx.createLinearGradient(0, 0, 0, 280);
      grad.addColorStop(0, 'rgba(247,144,9,0.25)'); grad.addColorStop(1, 'rgba(247,144,9,0)');
      chart = new Chart(ctx, {
        type: 'line',
        data: { labels: s.map(function (x) { return kr(x.d); }), datasets: [{ label: 'Cena za 1 g', data: s.map(function (x) { return x.v; }), borderColor: '#F79009', backgroundColor: grad, fill: true, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: 0.2 }] },
        options: {
          responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false },
          scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 5, maxRotation: 0, color: '#697386', font: { size: 12 } } }, y: { grid: { color: '#E9ECF1' }, ticks: { color: '#697386', font: { size: 12 }, callback: function (v) { return num(v, 0) + NB + 'zł'; } } } },
          plugins: { legend: { display: false }, tooltip: { backgroundColor: '#121721', cornerRadius: 8, padding: 12, callbacks: { label: function (x) { return 'Cena za 1 g: ' + money(x.raw); } } } }
        }
      });
    });
  }

  /* ── Zdarzenia ── */
  document.addEventListener('click', function (e) {
    var z = e.target.closest && e.target.closest('.zl-btn');
    if (z) {
      e.preventDefault(); days = parseInt(z.getAttribute('data-dni'), 10) || 365;
      document.querySelectorAll('.zl-btn').forEach(function (x) { x.classList.toggle('is-active', x === z); });
      if (days > 400 && !D.full) nbpRange(days).then(function (h) { if (h.length) { D.hist = h; D.full = true; } renderChart(); });
      else renderChart();
    }
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#calcular');
    if (b) { e.preventDefault(); e.stopPropagation(); run(true); }
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target && e.target.matches && e.target.matches('[data-type="zl-waga"]')) { e.preventDefault(); run(true); } });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[share-url]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var el = document.querySelector('[data-type="zl-waga"]'), p = new URLSearchParams();
    if (el) p.set('waga', el.value); p.set('proba', proba().v);
    var si = b.querySelector('[share-icon]'), ci = b.querySelector('[copied-icon]'), ct = b.querySelector('[copied-text]');
    navigator.clipboard.writeText(location.origin + location.pathname + '?' + p.toString()).then(function () {
      if (si) si.style.display = 'none'; if (ci) ci.style.display = 'block'; if (ct) ct.textContent = 'Link skopiowany';
      setTimeout(function () { if (si) si.style.display = 'block'; if (ci) ci.style.display = 'none'; if (ct) ct.textContent = 'Udostępnij wynik'; }, 1500);
    });
  }, true);
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[download-graph-image-button]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var cv = $('lfc-dp-donut'); if (!cv) return;
    var a = document.createElement('a'); a.href = cv.toDataURL('image/png', 1.0); a.download = 'cena-zlota.png'; a.click();
  }, true);

  function dedupe() {
    document.querySelectorAll('.dropdown-list-caulculadora').forEach(function (nav) {
      var seen = {}, links = nav.querySelectorAll('a.dropdown-calculadora');
      for (var i = links.length - 1; i >= 0; i--) { var t = links[i].textContent.trim(); if (seen[t]) links[i].remove(); else seen[t] = 1; }
    });
  }
  function applyUrl() {
    var q = new URLSearchParams(location.search);
    if (q.has('waga')) { var el = document.querySelector('[data-type="zl-waga"]'); if (el) el.value = q.get('waga'); }
    var s = document.querySelector('select[data-type="zl-proba"]');
    if (s && q.has('proba') && s.querySelector('option[value="' + q.get('proba') + '"]')) {
      s.value = q.get('proba');
      var txt = s.options[s.selectedIndex].textContent, w = s.closest('[fs-selectcustom-element="dropdown"]');
      if (w) { var tg = w.querySelector('.dropdown-toggle > div'); if (tg) tg.textContent = txt; w.querySelectorAll('.dropdown-calculadora').forEach(function (l) { var on = l.textContent.trim() === txt; l.classList.toggle('w--current', on); l.setAttribute('aria-selected', on ? 'true' : 'false'); }); }
    }
  }

  function boot() {
    dedupe();
    document.querySelectorAll('.dropdown-list-caulculadora').forEach(function (nav) { new MutationObserver(dedupe).observe(nav, { childList: true }); });
    applyUrl(); setupChartCard();
    var resW = document.querySelector('.all-results_wrapper'); if (resW) resW.style.display = 'flex';
    Promise.all([
      fetchJson('https://api.gold-api.com/price/XAU'),
      fetchJson('https://api.nbp.pl/api/exchangerates/rates/a/usd/?format=json'),
      nbpRange(400)
    ]).then(function (r) {
      var spot = r[0] && typeof r[0].price === 'number' && r[0].price > 500 && r[0].price < 50000 ? r[0].price : null;
      var usd = r[1] && r[1].rates && r[1].rates[0] && r[1].rates[0].mid > 1 && r[1].rates[0].mid < 10 ? r[1].rates[0].mid : null;
      D.hist = r[2] || [];
      var last = D.hist.length ? D.hist[D.hist.length - 1] : null;
      if (spot && usd) { D.g = spot * usd / OZ; D.live = true; D.usd = usd; D.at = new Date(); }
      else if (last) { D.g = last.v; D.live = false; }
      else { setText('zl-upd-t', 'Nie udało się pobrać notowań złota. Odśwież stronę za chwilę.'); return; }
      renderPrices(); run(false); renderChart();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
