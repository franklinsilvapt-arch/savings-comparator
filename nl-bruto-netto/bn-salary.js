/* Bruto netto berekenen 2026 (Nederland, onder de AOW-leeftijd) - eupersonalfinance.eu/nl/bruto-netto-berekenen.
   Zelfde structuur als pl-wynagrodzenia/salary.js (formulier, resultaten en donut van de site).
   Bron: Belastingdienst, "Voorlopige aanslag 2026: gebruikte tarieven en heffingskortingen". */
(function () {
  'use strict';
  var R = {
    rok: 2026,
    schijven: [[38883, 0.3575], [78426, 0.3756], [Infinity, 0.4950]],
    ahkMax: 3115, ahkVanaf: 29736, ahkAfbouw: 0.06398, ahkNul: 78426,
    akMax: 5685, akTop: 45592, akAfbouw: 0.06510, akNul: 132920
  };
  function heffing(x) {
    var t = 0, onder = 0;
    for (var i = 0; i < R.schijven.length; i++) { var top = R.schijven[i][0]; if (x > onder) t += (Math.min(x, top) - onder) * R.schijven[i][1]; onder = top; }
    return t;
  }
  function ahk(x) { if (x <= R.ahkVanaf) return R.ahkMax; if (x >= R.ahkNul) return 0; return Math.max(0, R.ahkMax - R.ahkAfbouw * (x - R.ahkVanaf)); }
  function ak(x) {
    if (x <= 0) return 0;
    if (x < 11965) return 0.08324 * x;
    if (x < 25845) return 996 + 0.31009 * (x - 11965);
    if (x < R.akTop) return 5300 + 0.01950 * (x - 25845);
    if (x < R.akNul) return Math.max(0, R.akMax - R.akAfbouw * (x - R.akTop));
    return 0;
  }
  function calc(bruto, periode, vgPct, pensioenMaand, dertiende, korting) {
    var maand = periode === 'jaar' ? bruto / 12 : bruto;
    var basis = maand * 12, vg = basis * vgPct, d13 = dertiende ? maand : 0;
    var totaal = basis + vg + d13, pensioen = Math.min(pensioenMaand * 12, totaal);
    var belastbaar = Math.max(0, totaal - pensioen);
    var h = heffing(belastbaar), k1 = korting ? Math.min(ahk(belastbaar), h) : 0, k2 = korting ? Math.min(ak(belastbaar), h - k1) : 0;
    var lh = h - k1 - k2, netto = totaal - pensioen - lh;
    var aandeel = function (deel) { return totaal > 0 ? deel / totaal : 0; };
    return {
      maand: maand, totaal: totaal, pensioen: pensioen, belastbaar: belastbaar, heffing: h, ahk: k1, ak: k2, lh: lh, netto: netto,
      nettoMaand: netto * aandeel(basis) / 12, nettoVg: netto * aandeel(vg), netto13: netto * aandeel(d13)
    };
  }
  window.BN_CALC = calc;

  /* Opmaak: €3.500,00 (zonder spatie, zoals op de rest van de NL-pagina's) */
  function fmt(v) {
    if (!isFinite(v)) return '-';
    var neg = v < -0.004, p = Math.abs(v).toFixed(2).split('.');
    return (neg ? '-' : '') + '€' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1];
  }
  function minus(v) { return v > 0.004 ? '-' + fmt(v) : fmt(0); }
  function pct(x, tot) { return (tot > 0 ? x / tot * 100 : 0).toFixed(1).replace('.', ',') + '%'; }
  function $(id) { return document.getElementById(id); }
  function setText(id, v) { var e = $(id); if (e) e.textContent = v; }
  function num(type) {
    var el = document.querySelector('[data-type="' + type + '"]'); if (!el) return NaN;
    var raw = String(el.value).replace(/[\s €]/g, ''); if (!raw) return 0;
    var m = raw.match(/^(.*),(\d{1,2})$/);
    return m ? parseFloat(m[1].replace(/\./g, '') + '.' + m[2]) : parseFloat(raw.replace(/[.,]/g, ''));
  }
  function selVal(type, def) { var s = document.querySelector('select[data-type="' + type + '"]'); return s ? s.value : def; }
  function isOn(id) { var c = $(id); return !!(c && c.checked); }
  function row(id, v, show) { var r = $(id); if (!r) return; r.style.display = show ? '' : 'none'; var val = r.querySelector('.lfc-dp-row-val'); if (val) val.textContent = v; }

  function syncChecks() {
    document.querySelectorAll('.wyn-check').forEach(function (lab) {
      var cb = lab.querySelector('input[type=checkbox]'), vis = lab.querySelector('.w-checkbox-input');
      if (cb && vis) vis.classList.toggle('w--redirected-checked', cb.checked);
    });
  }

  var chart = null;
  function loadChart() { return new Promise(function (ok) { if (window.Chart) return ok(); var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js'; s.onload = ok; document.head.appendChild(s); }); }

  function run(scroll) {
    var bruto = num('bn-bruto');
    if (!(bruto > 0)) { setText('bn-info', 'Vul een brutosalaris in dat hoger is dan 0.'); return; }
    var pens = num('bn-pensioen'); if (!(pens >= 0)) pens = 0;
    var periode = selVal('bn-periode', 'maand'), vgPct = parseFloat(selVal('bn-vg', '0.08')) || 0;
    var d13 = isOn('bn-13'), korting = isOn('bn-korting');
    var r = calc(bruto, periode, vgPct, pens, d13, korting);

    var resW = document.querySelector('.all-results_wrapper');
    if (resW) resW.style.display = 'flex';
    if (scroll) scrollToResults();

    setText('bn-hl', fmt(r.nettoMaand));
    row('bn-r-bruto', fmt(r.maand), true);
    row('bn-r-vg', fmt(r.nettoVg), vgPct > 0);
    row('bn-r-13', fmt(r.netto13), d13);
    row('bn-r-jaar', fmt(r.netto), true);
    row('bn-d-bruto', fmt(r.totaal), true);
    row('bn-d-pensioen', minus(r.pensioen), r.pensioen > 0);
    row('bn-d-belastbaar', fmt(r.belastbaar), true);
    row('bn-d-heffing', fmt(r.heffing), true);
    row('bn-d-ahk', minus(r.ahk), korting);
    row('bn-d-ak', minus(r.ak), korting);
    row('bn-d-lh', fmt(r.lh), true);

    var sum = $('lfc-dp-summary');
    if (sum) {
      var t = 'Met <strong>' + fmt(r.maand) + ' bruto per maand</strong> houd je ongeveer <strong>' + fmt(r.nettoMaand) + ' netto per maand</strong> over. ';
      t += 'Over het hele jaar is dat <strong>' + fmt(r.netto) + '</strong> netto' + (vgPct > 0 ? ', inclusief ' + fmt(r.nettoVg) + ' netto vakantiegeld' : '') + '. ';
      t += 'Van elke euro die je bruto verdient, houd je gemiddeld ' + pct(r.netto, r.totaal) + ' over.';
      if (!korting) t += ' Zonder loonheffingskorting houdt je werkgever meer loonheffing in. Die krijg je meestal terug via je aangifte inkomstenbelasting.';
      sum.innerHTML = t;
    }
    setText('bn-info', info());

    loadChart().then(function () {
      var cv = $('lfc-dp-donut'); if (!cv) return;
      if (chart) chart.destroy();
      var parts = [
        { l: 'Netto', v: r.netto, c: '#2E90FA' },
        { l: 'Loonheffing', v: r.lh, c: '#F04438' },
        { l: 'Pensioenpremie', v: r.pensioen, c: '#F79009' }
      ].filter(function (p) { return p.v > 0.004; });
      chart = new Chart(cv.getContext('2d'), {
        type: 'doughnut',
        data: { labels: parts.map(function (p) { return p.l; }), datasets: [{ data: parts.map(function (p) { return Math.round(p.v * 100) / 100; }), backgroundColor: parts.map(function (p) { return p.c; }), borderWidth: 0, cutout: '80%' }] },
        options: { responsive: true, maintainAspectRatio: true, animation: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#121721', cornerRadius: 8, padding: 12, callbacks: { label: function (c) { return c.label + ': ' + fmt(c.raw); } } } } }
      });
      setText('lfc-dp-chart-subtitle', fmt(r.totaal) + ' bruto per jaar · ' + R.rok);
      setText('lfc-dp-donut-val', fmt(r.netto));
      var lg = $('bn-legend');
      if (lg) lg.innerHTML = parts.map(function (p) {
        return '<div class="lfc-dp-legend-item"><div class="lfc-dp-legend-left"><div class="lfc-dp-legend-dot" style="background:' + p.c + '"></div><span class="lfc-dp-legend-text">' + p.l + '</span></div>' +
          '<div class="lfc-dp-legend-right"><span class="lfc-dp-legend-val">' + fmt(p.v) + '</span><span class="lfc-dp-legend-pct">' + pct(p.v, r.totaal) + '</span></div></div>';
      }).join('');
    });
  }

  function scrollToResults() {
    var t = document.querySelector('[results-anchor]') || document.querySelector('.all-results_wrapper'); if (!t) return;
    var n = document.querySelector('.nav_fixed'), h = 80;
    if (n) h = Math.max(n.offsetHeight, n.firstElementChild ? n.firstElementChild.offsetHeight : 0) || 80;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      window.scrollTo({ top: Math.max(0, t.getBoundingClientRect().top + window.pageYOffset - h - 24), behavior: 'smooth' });
    }); });
  }
  function info() { return 'Tarieven ' + R.rok + ': 35,75% tot ' + fmt(38883).replace(',00', '') + ', 37,56% tot ' + fmt(78426).replace(',00', '') + ' en 49,50% daarboven. Bron: Belastingdienst.'; }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('#calcular');
    if (btn) { e.preventDefault(); e.stopPropagation(); run(true); }
  }, true);
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.wyn-check')) setTimeout(syncChecks, 0); });
  document.addEventListener('change', function (e) { if (e.target && e.target.type === 'checkbox') syncChecks(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target && e.target.matches && e.target.matches('[data-type="bn-bruto"], [data-type="bn-pensioen"]')) { e.preventDefault(); run(true); } });

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[share-url]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var p = new URLSearchParams(), el = document.querySelector('[data-type="bn-bruto"]'), pe = document.querySelector('[data-type="bn-pensioen"]');
    if (el) p.set('bruto', el.value); if (pe) p.set('pensioen', pe.value);
    p.set('per', selVal('bn-periode', 'maand')); p.set('vg', selVal('bn-vg', '0.08'));
    p.set('d13', isOn('bn-13') ? '1' : '0'); p.set('lhk', isOn('bn-korting') ? '1' : '0');
    var si = b.querySelector('[share-icon]'), ci = b.querySelector('[copied-icon]'), ct = b.querySelector('[copied-text]'), antes = ct ? ct.textContent : '';
    navigator.clipboard.writeText(location.origin + location.pathname + '?' + p.toString()).then(function () {
      if (si) si.style.display = 'none'; if (ci) ci.style.display = 'block'; if (ct) ct.textContent = 'Link gekopieerd';
      setTimeout(function () { if (si) si.style.display = 'block'; if (ci) ci.style.display = 'none'; if (ct) ct.textContent = antes; }, 1500);
    });
  }, true);
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[download-graph-image-button]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var cv = $('lfc-dp-donut'); if (!cv) return;
    var a = document.createElement('a'); a.href = cv.toDataURL('image/png', 1.0); a.download = 'bruto-netto-2026.png'; a.click();
  }, true);

  function dedupe() {
    document.querySelectorAll('.dropdown-list-caulculadora').forEach(function (nav) {
      var seen = {}, links = nav.querySelectorAll('a.dropdown-calculadora');
      for (var i = links.length - 1; i >= 0; i--) { var t = links[i].textContent.trim(); if (seen[t]) links[i].remove(); else seen[t] = 1; }
    });
  }
  function setSelect(type, v) {
    var s = document.querySelector('select[data-type="' + type + '"]'); if (!s || !s.querySelector('option[value="' + v + '"]')) return;
    s.value = v;
    var txt = s.options[s.selectedIndex].textContent, w = s.closest('[fs-selectcustom-element="dropdown"]');
    if (w) { var tg = w.querySelector('.dropdown-toggle > div'); if (tg) tg.textContent = txt; w.querySelectorAll('.dropdown-calculadora').forEach(function (l) { var on = l.textContent.trim() === txt; l.classList.toggle('w--current', on); l.setAttribute('aria-selected', on ? 'true' : 'false'); }); }
  }
  function applyUrl() {
    var q = new URLSearchParams(location.search); if (!q.has('bruto')) return;
    var el = document.querySelector('[data-type="bn-bruto"]'); if (el) el.value = q.get('bruto');
    var pe = document.querySelector('[data-type="bn-pensioen"]'); if (pe && q.has('pensioen')) pe.value = q.get('pensioen');
    if (q.has('per')) setSelect('bn-periode', q.get('per'));
    if (q.has('vg')) setSelect('bn-vg', q.get('vg'));
    if ($('bn-13') && q.has('d13')) $('bn-13').checked = q.get('d13') === '1';
    if ($('bn-korting') && q.has('lhk')) $('bn-korting').checked = q.get('lhk') === '1';
    syncChecks();
    setTimeout(function () { run(false); }, 200);
  }
  function chartLabels() {
    var c = $('lfc-dp-chart'); if (!c) return;
    var t = c.querySelector('.lfc-dp-chart-title'); if (t) t.textContent = 'Waar gaat je brutoloon naartoe';
    var l = c.querySelector('.lfc-dp-donut-label'); if (l) l.textContent = 'Netto per jaar';
    var g = c.querySelector('.lfc-dp-legend'); if (g) { g.id = 'bn-legend'; g.innerHTML = ''; }
  }
  function init() {
    dedupe(); chartLabels();
    document.querySelectorAll('.dropdown-list-caulculadora').forEach(function (nav) { new MutationObserver(dedupe).observe(nav, { childList: true }); });
    document.querySelectorAll('#calc-wyn .lfc-dp-toggle-wrapper').forEach(function (w) { w.classList.add('is-visible'); });
    syncChecks(); setText('bn-info', info()); applyUrl();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
