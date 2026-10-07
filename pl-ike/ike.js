/* Kalkulator IKE i IKZE - eupersonalfinance.eu (EN + PL locales). Data: pl-ike/data.json (yearly limits). */
(function () {
  'use strict';
  var BASE = 'https://franklinsilvapt-arch.github.io/savings-comparator/pl-ike/';
  var LANG = (document.documentElement.lang || 'en').toLowerCase().indexOf('pl') === 0 ? 'pl' : 'en';
  var D = null;

  var T = {
    pl: {
      pit: { '12': '12% (skala podatkowa)', '32': '32% (skala, drugi próg)', '19': '19% (podatek liniowy)' },
      cols: ['IKE', 'IKZE', 'Zwykłe konto'],
      best: function (n) { return 'Najwięcej zostaje Ci w: ' + n; },
      yrs: function (n) { if (n === 1) return '1 rok'; var l = n % 10, h = n % 100; return n + ((l >= 2 && l <= 4 && (h < 12 || h > 14)) ? ' lata' : ' lat'); },
      limitIke: function (l) { return 'Wpłata przekracza roczny limit IKE (' + l + '). W IKE liczymy tylko limit.'; },
      limitIkze: function (l) { return 'Wpłata przekracza roczny limit IKZE (' + l + '). W IKZE liczymy tylko limit.'; },
      info: function (d) { return 'Limity wpłat na ' + d.year + ' rok: IKE ' + fmt0(d.limits.ike) + ', IKZE ' + fmt0(d.limits.ikze) + ' (' + fmt0(d.limits.ikzeSelfEmployed) + ' dla prowadzących działalność). Sprawdzono ' + fmtDate(d.checked) + '.'; },
      summary: function (o) {
        return 'Wpłacasz <strong>' + o.c + '</strong> rocznie przez <strong>' + o.n + '</strong> przy zysku <strong>' + o.r + '</strong> rocznie. ' +
          'Po wypłacie zostaje Ci <strong>' + o.ike + '</strong> z IKE, <strong>' + o.ikze + '</strong> z IKZE (razem ze zwrotem podatku) i <strong>' + o.reg + '</strong> ze zwykłego konta.';
      },
      chart: ['Wynik najlepszej opcji', 'Kwota netto', 'Wpłaty', 'Zysk netto']
    },
    en: {
      pit: { '12': '12% (tax scale)', '32': '32% (tax scale, upper band)', '19': '19% (flat tax)' },
      cols: ['IKE', 'IKZE', 'Regular account'],
      best: function (n) { return 'You keep the most with: ' + n; },
      yrs: function (n) { return n + (n === 1 ? ' year' : ' years'); },
      limitIke: function (l) { return 'Your contribution is above the yearly IKE limit (' + l + '). For IKE we only count the limit.'; },
      limitIkze: function (l) { return 'Your contribution is above the yearly IKZE limit (' + l + '). For IKZE we only count the limit.'; },
      info: function (d) { return d.year + ' contribution limits: IKE ' + fmt0(d.limits.ike) + ', IKZE ' + fmt0(d.limits.ikze) + ' (' + fmt0(d.limits.ikzeSelfEmployed) + ' for the self-employed). Checked on ' + fmtDate(d.checked) + '.'; },
      summary: function (o) {
        return 'You pay in <strong>' + o.c + '</strong> a year for <strong>' + o.n + '</strong> with a <strong>' + o.r + '</strong> yearly return. ' +
          'After withdrawal you keep <strong>' + o.ike + '</strong> from IKE, <strong>' + o.ikze + '</strong> from IKZE (including the tax refunds) and <strong>' + o.reg + '</strong> from a regular account.';
      },
      chart: ['Best option result', 'Net amount', 'Contributions', 'Net profit']
    }
  }[LANG];

  function fmtDate(iso) { var p = iso.split('-'); return LANG === 'pl' ? p[2] + '.' + p[1] + '.' + p[0] : p[2] + '/' + p[1] + '/' + p[0]; }
  function fmtMoney(v) {
    if (!isFinite(v)) return '-';
    var neg = v < 0, parts = Math.abs(v).toFixed(2).split('.');
    var s = LANG === 'pl' ? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + parts[1] + ' zł'
                          : 'PLN ' + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
    return (neg ? '-' : '') + s;
  }
  function fmt0(v) { return fmtMoney(v).replace(/[.,]00(?=\u00a0zł|$)/, ''); }
  function fmtPct(v) { var s = v.toFixed(2); return (LANG === 'pl' ? s.replace('.', ',') : s) + '%'; }
  function parseNum(type) {
    var el = document.querySelector('[data-type="' + type + '"]'); if (!el) return NaN;
    var raw = String(el.value).replace(/[\s ]/g, ''); if (!raw) return NaN;
    if (type === 'ike-wplata' || type === 'ike-lata') return parseFloat(raw.replace(/[.,]/g, ''));
    var last = Math.max(raw.lastIndexOf('.'), raw.lastIndexOf(','));
    if (last === -1) return parseFloat(raw);
    return parseFloat(raw.slice(0, last).replace(/[.,]/g, '') + '.' + raw.slice(last + 1));
  }
  function $(id) { return document.getElementById(id); }
  function setText(id, v) { var e = $(id); if (e) e.textContent = v; }
  function setVal(type, v) { var e = document.querySelector('input[data-type="' + type + '"]'); if (e) e.value = v; }
  var r2 = function (x) { return Math.round((x + 1e-9) * 100) / 100; };

  /* ── Engine: contributions at the start of each year, yearly compounding ── */
  function fv(c, r, n) { var v = 0; for (var k = 0; k < n; k++) v = (v + c) * (1 + r); return v; }
  function compute(o) {
    var L = D.limits, t = D.taxes;
    var cIke = Math.min(o.c, L.ike), cIkze = Math.min(o.c, o.self ? L.ikzeSelfEmployed : L.ikze);
    var res = {};
    var g = fv(cIke, o.r, o.n);
    res.ike = { paid: cIke * o.n, gross: g, tax: 0, refund: 0, net: g };
    var gz = fv(cIkze, o.r, o.n), taxz = r2(gz * t.ikzeWithdrawal);
    var refund = cIkze * o.pit, refTot = refund * o.n, refNet = refTot;
    if (o.reinvest) { /* each refund arrives a year after the contribution and is invested in a regular (taxed) account */
      var v = 0; for (var j = 1; j < o.n; j++) v = (v + refund) * (1 + o.r);
      v += refund; /* last refund arrives at the end, not invested */
      refNet = v - Math.max(0, v - refTot) * t.belka;
    }
    res.ikze = { paid: cIkze * o.n, gross: gz, tax: taxz, refund: refNet, refundNominal: refTot, net: gz - taxz + refNet };
    var gr = fv(o.c, o.r, o.n), taxr = r2(Math.max(0, gr - o.c * o.n) * t.belka);
    res.reg = { paid: o.c * o.n, gross: gr, tax: taxr, refund: 0, net: gr - taxr };
    return res;
  }

  /* ── Localize the shared bilingual form ── */
  (function () {
    var s = document.querySelector('select[data-type="ike-pit"]'); if (!s) return;
    var opts = s.querySelectorAll('option');
    opts.forEach(function (o) { if (T.pit[o.value]) o.textContent = T.pit[o.value]; });
    var w = s.closest('[fs-selectcustom-element="dropdown"]');
    if (w) {
      w.querySelectorAll('a.dropdown-calculadora').forEach(function (l, i) { if (opts[i]) l.textContent = opts[i].textContent; });
      var tg = w.querySelector('.dropdown-toggle > div'); if (tg) tg.textContent = T.pit[s.value];
    }
    if (LANG === 'pl') { setVal('ike-wplata', '6 000'); setVal('ike-zwrot', '5'); } else { setVal('ike-wplata', '6,000'); }
    var st = document.createElement('style'); st.textContent = '#lfc-dp .obl-scroll{max-height:none;overflow:visible}'; document.head.appendChild(st);
  })();

  var chart = null;
  function loadChart() { return new Promise(function (ok) { if (window.Chart) return ok(); var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/chart.js'; s.onload = ok; document.head.appendChild(s); }); }

  function run() {
    if (!D) return;
    var c = parseNum('ike-wplata'), n = Math.round(parseNum('ike-lata')), rp = parseNum('ike-zwrot');
    var ps = document.querySelector('select[data-type="ike-pit"]'), pit = (ps ? parseFloat(ps.value) : 12) / 100;
    var self = !!($('ike-dg') && $('ike-dg').checked), reinvest = !!($('ike-rein') && $('ike-rein').checked);
    if (!(c > 0) || !(n > 0) || !isFinite(rp)) return;
    var res = compute({ c: c, n: n, r: rp / 100, pit: pit, self: self, reinvest: reinvest });
    var resW = document.querySelector('.all-results_wrapper');
    if (resW) {
      var wasHidden = getComputedStyle(resW).display === 'none';
      resW.style.display = 'flex';
      if (wasHidden || resW.getBoundingClientRect().top > window.innerHeight * 0.6) setTimeout(function () { resW.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
    }
    var keys = ['ike', 'ikze', 'reg'], best = keys.reduce(function (a, b) { return res[b].net > res[a].net ? b : a; });
    setText('ike-best-label', T.best(T.cols[keys.indexOf(best)]));
    setText('ike-best', fmtMoney(res[best].net));
    var rows = { paid: 'ike-r-paid', gross: 'ike-r-gross', tax: 'ike-r-tax', refund: 'ike-r-refund', net: 'ike-r-net' };
    Object.keys(rows).forEach(function (k) {
      keys.forEach(function (v, i) {
        var val = res[v][k];
        var txt = (k === 'tax' && val > 0) ? '-' + fmtMoney(val) : (k === 'refund' && v !== 'ikze') ? '-' : fmtMoney(val);
        setText(rows[k] + '-' + i, txt);
      });
    });
    document.querySelectorAll('#lfc-dp .ike-col').forEach(function (td) { td.classList.toggle('is-best', td.getAttribute('data-col') === best); });
    var notes = [];
    if (c > D.limits.ike) notes.push(T.limitIke(fmt0(D.limits.ike)));
    var lz = self ? D.limits.ikzeSelfEmployed : D.limits.ikze;
    if (c > lz) notes.push(T.limitIkze(fmt0(lz)));
    var nt = $('ike-notes'); if (nt) { nt.textContent = notes.join(' '); nt.style.display = notes.length ? '' : 'none'; }
    var sum = $('lfc-dp-summary');
    if (sum) sum.innerHTML = T.summary({ c: fmtMoney(c), n: T.yrs(n), r: fmtPct(rp), ike: fmtMoney(res.ike.net), ikze: fmtMoney(res.ikze.net), reg: fmtMoney(res.reg.net) });

    loadChart().then(function () {
      var cv = $('lfc-dp-donut'); if (!cv) return;
      if (chart) chart.destroy();
      var b = res[best], paid = b.paid, prof = Math.max(0, b.net - paid);
      chart = new Chart(cv.getContext('2d'), {
        type: 'doughnut',
        data: { labels: [T.chart[2], T.chart[3]], datasets: [{ data: [paid, prof], backgroundColor: ['#F79009', '#2E90FA'], borderWidth: 0, cutout: '80%' }] },
        options: { responsive: true, maintainAspectRatio: true, animation: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#121721', cornerRadius: 8, padding: 12, callbacks: { label: function (x) { return x.label + ': ' + fmtMoney(x.raw); } } } } }
      });
      var q = function (s) { return document.querySelector('#lfc-dp-chart ' + s); };
      if (q('.lfc-dp-chart-title')) q('.lfc-dp-chart-title').textContent = T.chart[0];
      if (q('.lfc-dp-donut-label')) q('.lfc-dp-donut-label').textContent = T.chart[1];
      var lt = document.querySelectorAll('#lfc-dp-chart .lfc-dp-legend-text'); if (lt[0]) lt[0].textContent = T.chart[2]; if (lt[1]) lt[1].textContent = T.chart[3];
      setText('lfc-dp-chart-subtitle', T.cols[keys.indexOf(best)] + ' · ' + T.yrs(n) + ' · ' + fmtPct(rp));
      setText('lfc-dp-donut-val', fmtMoney(b.net));
      var tot = paid + prof, pct = function (x) { return (x / tot * 100).toFixed(1).replace('.', LANG === 'pl' ? ',' : '.') + '%'; };
      setText('lfc-dp-leg-capital', fmtMoney(paid)); setText('lfc-dp-leg-capital-pct', pct(paid));
      setText('lfc-dp-leg-juros', fmtMoney(prof)); setText('lfc-dp-leg-juros-pct', pct(prof));
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('#calcular');
    if (btn) { e.preventDefault(); run(); return; }
    var lab = e.target.closest && e.target.closest('.ike-check');
    if (lab) setTimeout(function () { lab.querySelectorAll('input[type=checkbox]').forEach(function (cb) { var vis = lab.querySelector('.w-checkbox-input'); if (vis) vis.classList.toggle('w--redirected-checked', cb.checked); }); }, 0);
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[share-url]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var p = new URLSearchParams();
    ['ike-wplata', 'ike-lata', 'ike-zwrot'].forEach(function (k) { var el = document.querySelector('[data-type="' + k + '"]'); if (el) p.set(k, el.value); });
    var ps = document.querySelector('select[data-type="ike-pit"]'); if (ps) p.set('ike-pit', ps.value);
    if ($('ike-dg') && $('ike-dg').checked) p.set('dg', '1');
    if ($('ike-rein') && $('ike-rein').checked) p.set('rein', '1');
    var si = b.querySelector('[share-icon]'), ci = b.querySelector('[copied-icon]'), ct = b.querySelector('[copied-text]');
    navigator.clipboard.writeText(location.origin + location.pathname + '?' + p.toString()).then(function () {
      if (si) si.style.display = 'none'; if (ci) ci.style.display = 'block'; if (ct) ct.textContent = LANG === 'pl' ? 'Link skopiowany' : 'Link copied';
      setTimeout(function () { if (si) si.style.display = 'block'; if (ci) ci.style.display = 'none'; if (ct) ct.textContent = LANG === 'pl' ? 'Udostępnij wynik' : 'Share results'; }, 1500);
    });
  }, true);
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[download-graph-image-button]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var cv = $('lfc-dp-donut'); if (!cv) return;
    var a = document.createElement('a'); a.href = cv.toDataURL('image/png', 1.0); a.download = LANG === 'pl' ? 'kalkulator-ike-ikze.png' : 'ike-ikze-calculator.png'; a.click();
  }, true);
  function dedupe() {
    document.querySelectorAll('.dropdown-list-caulculadora').forEach(function (nav) {
      var seen = {}, links = nav.querySelectorAll('a.dropdown-calculadora');
      for (var i = links.length - 1; i >= 0; i--) { var t = links[i].textContent.trim(); if (seen[t]) links[i].remove(); else seen[t] = 1; }
    });
  }
  dedupe();
  document.querySelectorAll('.dropdown-list-caulculadora').forEach(function (nav) { new MutationObserver(dedupe).observe(nav, { childList: true }); });

  function applyUrl() {
    var q = new URLSearchParams(location.search); if (!q.has('ike-wplata')) return;
    ['ike-wplata', 'ike-lata', 'ike-zwrot'].forEach(function (k) { if (q.has(k)) setVal(k, q.get(k)); });
    var s = document.querySelector('select[data-type="ike-pit"]');
    if (s && q.has('ike-pit') && s.querySelector('option[value="' + q.get('ike-pit') + '"]')) {
      s.value = q.get('ike-pit');
      var w = s.closest('[fs-selectcustom-element="dropdown"]'), txt = T.pit[s.value];
      if (w) { var tg = w.querySelector('.dropdown-toggle > div'); if (tg) tg.textContent = txt; w.querySelectorAll('.dropdown-calculadora').forEach(function (l) { var on = l.textContent.trim() === txt; l.classList.toggle('w--current', on); l.setAttribute('aria-selected', on ? 'true' : 'false'); }); }
    }
    [['dg', 'ike-dg'], ['rein', 'ike-rein']].forEach(function (p) { if (q.get(p[0]) === '1' && $(p[1])) { $(p[1]).checked = true; var v = $(p[1]).closest('.ike-check').querySelector('.w-checkbox-input'); if (v) v.classList.add('w--redirected-checked'); } });
    setTimeout(run, 200);
  }

  fetch(BASE + 'data.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
    D = d; setText('ike-info', T.info(d)); applyUrl();
  }).catch(function () { setText('ike-info', LANG === 'pl' ? 'Nie udało się wczytać danych. Odśwież stronę.' : 'Could not load the data. Please refresh the page.'); });

  window.__ikeCompute = function (o) { return compute(o); };
})();
