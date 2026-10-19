/* Kalkulator wynagrodzeń 2026 (Polska) - eupersonalfinance.eu, tylko PL.
   Umowa o pracę, zlecenie i o dzieło. Brutto na netto i netto na brutto, rozbicie miesiąc po miesiącu. */
(function () {
  'use strict';
  var PLW = (function () {
  var R = {
    rok: 2026,
    limit30: 282600,      /* obwieszczenie MRPiPS z 19.11.2025, M.P. 2025 poz. 1206 */
    minWage: 4806,        /* rozporządzenie RM, Dz.U. 2025 poz. 1242 */
    prog: 120000,         /* art. 27 ust. 1 ustawy o PIT */
    zmniejszenie: 300,    /* 3 600 zł rocznie / 12 */
    kup: 250, kupPodw: 300,
    mlodzi: 85528,        /* art. 21 ust. 1 pkt 148 */
    kup50Limit: 120000,
    em: 0.0976, ren: 0.015, chor: 0.0245, zdr: 0.09,
    renPrac: 0.065, wyp: 0.0167, fp: 0.0245, fgsp: 0.001,
    ppkPrac: 0.02, ppkPracod: 0.015
  };
  function r2(x) { return Math.round((x + 1e-9) * 100) / 100; }
  function r0(x) { return Math.round(x + 1e-9); }

  /* o: {brutto, umowa:'praca'|'zlecenie'|'dzielo', mlody, student, dojazd, pit2, ppk, chorobowa, autorskie} */
  function rok(o) {
    var G = o.brutto, m, out = [];
    var cumZ = 0, cumRev = 0, cumKup50 = 0, cumBase = 0;
    for (m = 1; m <= 12; m++) {
      var x = { m: m, brutto: G, em: 0, ren: 0, chor: 0, zdr: 0, pit: 0, ppk: 0, ppkPracod: 0, koszt: G };
      var capBase = Math.min(G, Math.max(0, R.limit30 - cumZ));
      var zusOn = o.umowa === 'praca' || (o.umowa === 'zlecenie' && !o.student);
      if (zusOn) {
        x.em = r2(R.em * capBase);
        x.ren = r2(R.ren * capBase);
        x.chor = (o.umowa === 'praca' || o.chorobowa) ? r2(R.chor * G) : 0;
        cumZ += G;
      }
      var soc = r2(x.em + x.ren + x.chor);
      x.zus = soc;
      if (zusOn) x.zdr = r2(R.zdr * (G - soc));
      if (o.umowa === 'praca' && o.ppk) { x.ppk = r2(R.ppkPrac * G); x.ppkPracod = r2(R.ppkPracod * G); }

      var rev = G + x.ppkPracod;
      var exempt = 0;
      var ulgaOk = o.mlody && (o.umowa === 'praca' || o.umowa === 'zlecenie');
      if (ulgaOk) { exempt = Math.min(rev, Math.max(0, R.mlodzi - cumRev)); cumRev += rev; }
      var taxRev = rev - exempt;
      var base = 0, kup = 0;
      if (taxRev > 0) {
        var socDed = rev > 0 ? soc * taxRev / rev : 0;
        if (o.umowa === 'praca') kup = o.dojazd ? R.kupPodw : R.kup;
        else if (o.umowa === 'zlecenie') kup = r2(0.2 * (taxRev - socDed));
        else {
          if (o.autorskie) { kup = r2(Math.min(0.5 * taxRev, Math.max(0, R.kup50Limit - cumKup50))); cumKup50 += kup; }
          else kup = r2(0.2 * taxRev);
        }
        base = Math.max(0, r0(taxRev - socDed - kup));
        var podatek;
        if (o.umowa === 'praca') {
          var below = Math.min(base, Math.max(0, R.prog - cumBase));
          podatek = 0.12 * below + 0.32 * (base - below);
        } else {
          podatek = 0.12 * base;   /* zaliczki z umów cywilnych zawsze wg 12% */
        }
        cumBase += base;
        if (o.pit2) podatek -= R.zmniejszenie;
        x.pit = Math.max(0, r0(podatek));
      }
      x.kupKwota = kup; x.podstawa = base; x.zwolnione = exempt;
      x.netto = r2(G - soc - x.zdr - x.pit - x.ppk);

      /* koszt pracodawcy */
      if (zusOn) {
        var fp = G >= R.minWage ? r2(R.fp * G) : 0;
        x.pracodawca = r2(r2(R.em * capBase) + r2(R.renPrac * capBase) + r2(R.wyp * G) + fp + r2(R.fgsp * G) + x.ppkPracod);
      } else x.pracodawca = 0;
      x.koszt = r2(G + x.pracodawca);
      out.push(x);
    }
    var sum = { brutto: 0, zus: 0, zdr: 0, pit: 0, ppk: 0, netto: 0, koszt: 0 };
    out.forEach(function (x) { for (var k in sum) sum[k] = r2(sum[k] + x[k]); });
    return { miesiace: out, suma: sum };
  }

  /* netto -> brutto: szuka brutto, przy którym netto w pierwszym miesiącu = cel */
  function bruttoZNetto(netto, o) {
    var lo = 0, hi = Math.max(1000, netto * 3), i, c;
    for (i = 0; i < 60; i++) {
      var mid = (lo + hi) / 2;
      c = rok(Object.assign({}, o, { brutto: mid })).miesiace[0].netto;
      if (c < netto) lo = mid; else hi = mid;
    }
    /* zaokrąglenie zaliczki do pełnych złotych robi „schodki”, więc sprawdzamy okno
       co 1 gr i bierzemy najmniejsze brutto, które daje co najmniej podane netto */
    var g0 = Math.round(hi * 100), best = null, exact = null, k, n;
    for (k = Math.max(1, g0 - 3000); k <= g0 + 300; k++) {
      n = rok(Object.assign({}, o, { brutto: k / 100 })).miesiace[0].netto;
      if (best === null && n >= netto) best = k;
      if (Math.abs(n - netto) < 0.005 && (exact === null || (k % 100 === 0 && exact % 100 !== 0))) exact = k;
      if (exact !== null && exact % 100 === 0) break;
    }
    return (exact !== null ? exact : (best !== null ? best : g0)) / 100;
  }

  return { R: R, rok: rok, bruttoZNetto: bruttoZNetto };
})();

  /* ── Formatowanie ── */
  var NB = ' ';
  function fmtMoney(v) {
    if (!isFinite(v)) return '-';
    var neg = v < -0.004, parts = Math.abs(v).toFixed(2).split('.');
    return (neg ? '-' : '') + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, NB) + ',' + parts[1] + NB + 'zł';
  }
  function fmtWhole(v) { return fmtMoney(Math.round(v)).replace(',00' + NB, NB); }
  function fmt0(v) { return fmtMoney(v).replace(',00' + NB, NB); }
  function minus(v) { return v > 0.004 ? '-' + fmtMoney(v) : fmtMoney(0); }
  function pct(x, tot) { return (tot > 0 ? x / tot * 100 : 0).toFixed(1).replace('.', ',') + '%'; }
  function $(id) { return document.getElementById(id); }
  function setText(id, v) { var e = $(id); if (e) e.textContent = v; }
  function parseKwota() {
    var el = document.querySelector('[data-type="wyn-kwota"]'); if (!el) return NaN;
    var raw = String(el.value).replace(/[\s ]/g, ''); if (!raw) return NaN;
    var m = raw.match(/^(.*)[.,](\d{1,2})$/);
    return m ? parseFloat(m[1].replace(/[.,]/g, '') + '.' + m[2]) : parseFloat(raw.replace(/[.,]/g, ''));
  }
  function selVal(type, def) { var s = document.querySelector('select[data-type="' + type + '"]'); return s ? s.value : def; }
  function isOn(id) { var c = $(id); return !!(c && c.checked); }

  var MIES = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
  var MIES_DOP = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
  var UMOWA = { praca: 'umowie o pracę', zlecenie: 'umowie zlecenie', dzielo: 'umowie o dzieło' };
  var UMOWA_NOM = { praca: 'Umowa o pracę', zlecenie: 'Umowa zlecenie', dzielo: 'Umowa o dzieło' };
  var FLAGS = { mlody: 'wyn-mlody', dojazd: 'wyn-dojazd', ppk: 'wyn-ppk', pit2: 'wyn-pit2', student: 'wyn-student', chorobowa: 'wyn-chor', autorskie: 'wyn-autor' };

  /* ── Pokazuj tylko opcje pasujące do rodzaju umowy ── */
  function syncOptions() {
    var u = selVal('wyn-umowa', 'praca');
    document.querySelectorAll('[data-umowa]').forEach(function (w) {
      w.classList.toggle('is-visible', (' ' + w.getAttribute('data-umowa') + ' ').indexOf(' ' + u + ' ') > -1);
    });
  }
  function syncChecks() {
    document.querySelectorAll('.wyn-check').forEach(function (lab) {
      var cb = lab.querySelector('input[type=checkbox]'), vis = lab.querySelector('.w-checkbox-input');
      if (cb && vis) vis.classList.toggle('w--redirected-checked', cb.checked);
    });
  }

  function options() {
    var o = { umowa: selVal('wyn-umowa', 'praca') };
    Object.keys(FLAGS).forEach(function (k) { o[k] = isOn(FLAGS[k]); });
    if (o.umowa !== 'praca') { o.dojazd = false; o.ppk = false; }
    if (o.umowa !== 'zlecenie') { o.student = false; o.chorobowa = false; }
    if (o.umowa === 'dzielo') { o.mlody = false; o.pit2 = false; }
    if (o.umowa !== 'dzielo') o.autorskie = false;
    return o;
  }

  var chart = null;
  function loadChart() { return new Promise(function (ok) { if (window.Chart) return ok(); var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js'; s.onload = ok; document.head.appendChild(s); }); }

  function row(id, v, show) { var r = $(id); if (!r) return; r.style.display = show ? '' : 'none'; var val = r.querySelector('.lfc-dp-row-val'); if (val) val.textContent = v; }

  function run() {
    var kw = parseKwota();
    if (!(kw > 0)) { setText('wyn-info', 'Wpisz kwotę większą od zera.'); return; }
    var o = options(), kier = selVal('wyn-kierunek', 'brutto');
    var brutto = kier === 'netto' ? PLW.bruttoZNetto(kw, o) : kw;
    var res = PLW.rok(Object.assign({}, o, { brutto: brutto })), m = res.miesiace, x = m[0], R = PLW.R;

    var resW = document.querySelector('.all-results_wrapper');
    if (resW) {
      var wasHidden = getComputedStyle(resW).display === 'none';
      resW.style.display = 'flex';
      if (wasHidden || resW.getBoundingClientRect().top > window.innerHeight * 0.6) setTimeout(function () { resW.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
    }

    /* Wiersz główny */
    if (kier === 'netto') { setText('wyn-hl-label', 'Potrzebne brutto (miesięcznie)'); setText('wyn-hl', fmtMoney(brutto)); }
    else { setText('wyn-hl-label', 'Na rękę (miesięcznie)'); setText('wyn-hl', fmtMoney(x.netto)); }

    /* Rozbicie pierwszego miesiąca */
    row('wyn-r-brutto', fmtMoney(x.brutto), true);
    row('wyn-r-em', minus(x.em), x.em > 0);
    row('wyn-r-ren', minus(x.ren), x.ren > 0);
    row('wyn-r-chor', minus(x.chor), x.chor > 0);
    row('wyn-r-zdr', minus(x.zdr), o.umowa !== 'dzielo' && !(o.umowa === 'zlecenie' && o.student));
    row('wyn-r-pit', minus(x.pit), true);
    row('wyn-r-ppk', minus(x.ppk), x.ppk > 0);
    row('wyn-r-netto', fmtMoney(x.netto), true);
    var emp = $('wyn-pracodawca'); if (emp) emp.style.display = x.pracodawca > 0 ? '' : 'none';
    row('wyn-r-skl', fmtMoney(x.pracodawca), x.pracodawca > 0);
    row('wyn-r-koszt', fmtMoney(x.koszt), x.pracodawca > 0);

    /* Tabela miesięczna */
    var f = window.innerWidth < 600 ? fmtWhole : fmtMoney, tb = $('wyn-mies');
    if (tb) {
      var h = '';
      m.forEach(function (y, i) { h += '<tr><td>' + MIES[i] + '</td><td>' + f(y.brutto) + '</td><td>' + f(y.zus) + '</td><td>' + f(y.zdr) + '</td><td>' + f(y.pit) + '</td><td>' + f(y.netto) + '</td></tr>'; });
      var s = res.suma;
      h += '<tr class="wyn-total"><td>Razem</td><td>' + f(s.brutto) + '</td><td>' + f(s.zus) + '</td><td>' + f(s.zdr) + '</td><td>' + f(s.pit) + '</td><td>' + f(s.netto) + '</td></tr>';
      tb.innerHTML = h;
    }

    /* Uwagi: zmiany w ciągu roku */
    var notes = [], cum = 0, i, prog = -1, lim = -1, ulga = -1, zusOn = o.umowa === 'praca' || (o.umowa === 'zlecenie' && !o.student);
    for (i = 0; i < 12; i++) {
      if (o.umowa === 'praca' && prog < 0 && cum + m[i].podstawa > R.prog) prog = i;
      cum += m[i].podstawa;
      if (lim < 0 && zusOn && m[i].em < Math.round(R.em * brutto * 100) / 100 - 0.01) lim = i;
      if (o.mlody && ulga < 0 && m[i].zwolnione < m[i].brutto + m[i].ppkPracod - 0.01) ulga = i;
    }
    if (ulga > 0) notes.push('Od ' + MIES_DOP[ulga] + ' przekraczasz limit ulgi dla młodych (' + fmt0(R.mlodzi) + ' w roku) i zaczynasz płacić PIT.');
    if (prog > -1) notes.push('Od ' + MIES_DOP[prog] + ' Twój dochód od początku roku przekracza ' + fmt0(R.prog) + ', więc część pensji jest opodatkowana stawką 32% i netto spada.');
    if (lim > -1) notes.push('Od ' + MIES_DOP[lim] + ' przekraczasz limit ' + fmt0(R.limit30) + ' (30-krotność) i przestajesz płacić składkę emerytalną i rentową, więc netto rośnie.');
    if (o.umowa === 'praca' && brutto < R.minWage) notes.push('Na pełnym etacie pensja nie może być niższa niż płaca minimalna: ' + fmt0(R.minWage) + ' brutto w 2026 roku.');
    var nt = $('wyn-notes'); if (nt) { nt.textContent = notes.join(' '); nt.style.display = notes.length ? '' : 'none'; }

    /* Podsumowanie */
    var sum = $('lfc-dp-summary');
    if (sum) {
      var t = 'Na ' + UMOWA[o.umowa] + ' z <strong>' + fmtMoney(brutto) + ' brutto</strong> dostajesz <strong>' + fmtMoney(x.netto) + ' na rękę</strong>' + (notes.length && (prog > -1 || lim > -1 || ulga > 0) ? ' w styczniu' : ' co miesiąc') + '. ';
      t += 'W całym roku to <strong>' + fmtMoney(res.suma.netto) + '</strong> netto.';
      if (x.pracodawca > 0) t += ' Pracodawcę kosztujesz <strong>' + fmtMoney(x.koszt) + '</strong> miesięcznie.';
      sum.innerHTML = t;
    }
    setText('wyn-info', info());

    /* Wykres: na co idzie brutto (pierwszy miesiąc) */
    loadChart().then(function () {
      var cv = $('lfc-dp-donut'); if (!cv) return;
      if (chart) chart.destroy();
      var parts = [
        { l: 'Na rękę', v: x.netto, c: '#2E90FA' },
        { l: 'Składki ZUS', v: x.zus, c: '#F79009' },
        { l: 'Składka zdrowotna', v: x.zdr, c: '#7A5AF8' },
        { l: 'Zaliczka na PIT', v: x.pit, c: '#F04438' },
        { l: 'PPK', v: x.ppk, c: '#12B76A' }
      ].filter(function (p) { return p.v > 0.004; });
      chart = new Chart(cv.getContext('2d'), {
        type: 'doughnut',
        data: { labels: parts.map(function (p) { return p.l; }), datasets: [{ data: parts.map(function (p) { return p.v; }), backgroundColor: parts.map(function (p) { return p.c; }), borderWidth: 0, cutout: '80%' }] },
        options: { responsive: true, maintainAspectRatio: true, animation: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#121721', cornerRadius: 8, padding: 12, callbacks: { label: function (c) { return c.label + ': ' + fmtMoney(c.raw); } } } } }
      });
      setText('lfc-dp-chart-subtitle', UMOWA_NOM[o.umowa] + ' · ' + fmtMoney(brutto) + ' brutto · styczeń ' + R.rok);
      setText('lfc-dp-donut-val', fmtMoney(x.netto));
      var lg = $('wyn-legend');
      if (lg) lg.innerHTML = parts.map(function (p) {
        return '<div class="lfc-dp-legend-item"><div class="lfc-dp-legend-left"><div class="lfc-dp-legend-dot" style="background:' + p.c + '"></div><span class="lfc-dp-legend-text">' + p.l + '</span></div>' +
          '<div class="lfc-dp-legend-right"><span class="lfc-dp-legend-val">' + fmtMoney(p.v) + '</span><span class="lfc-dp-legend-pct">' + pct(p.v, brutto) + '</span></div></div>';
      }).join('');
    });
  }

  function info() { var R = PLW.R; return 'Zasady na ' + R.rok + ' rok: płaca minimalna ' + fmt0(R.minWage) + ', próg podatkowy ' + fmt0(R.prog) + ', limit składek ' + fmt0(R.limit30) + '. Sprawdzono 19.10.2026.'; }

  /* ── Zdarzenia ── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('#calcular');
    if (btn) { e.preventDefault(); run(); return; }
    if (e.target.closest && e.target.closest('.wyn-check')) setTimeout(syncChecks, 0);
    if (e.target.closest && e.target.closest('.dropdown-calculadora')) setTimeout(syncOptions, 50);
  });
  document.addEventListener('change', function (e) { if (e.target && e.target.matches && e.target.matches('select[data-type]')) syncOptions(); if (e.target && e.target.type === 'checkbox') syncChecks(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target && e.target.matches && e.target.matches('[data-type="wyn-kwota"]')) { e.preventDefault(); run(); } });

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[share-url]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var p = new URLSearchParams(), el = document.querySelector('[data-type="wyn-kwota"]');
    if (el) p.set('kwota', el.value);
    p.set('kier', selVal('wyn-kierunek', 'brutto')); p.set('umowa', selVal('wyn-umowa', 'praca'));
    Object.keys(FLAGS).forEach(function (k) { p.set(k, isOn(FLAGS[k]) ? '1' : '0'); });
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
    var a = document.createElement('a'); a.href = cv.toDataURL('image/png', 1.0); a.download = 'kalkulator-wynagrodzen.png'; a.click();
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
    var q = new URLSearchParams(location.search); if (!q.has('kwota')) return;
    var el = document.querySelector('[data-type="wyn-kwota"]'); if (el) el.value = q.get('kwota');
    if (q.has('kier')) setSelect('wyn-kierunek', q.get('kier'));
    if (q.has('umowa')) setSelect('wyn-umowa', q.get('umowa'));
    Object.keys(FLAGS).forEach(function (k) { var c = $(FLAGS[k]); if (c && q.has(k)) c.checked = q.get(k) === '1'; });
    syncOptions(); syncChecks();
    setTimeout(run, 200);
  }

  function init() {
    dedupe();
    document.querySelectorAll('.dropdown-list-caulculadora').forEach(function (nav) { new MutationObserver(dedupe).observe(nav, { childList: true }); });
    syncOptions(); syncChecks(); setText('wyn-info', info()); applyUrl();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.__wynCalc = function (o) { return PLW.rok(o); };
})();
