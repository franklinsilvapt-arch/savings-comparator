/* Kalkulator obligacji skarbowych - eupersonalfinance.eu (EN + PL locales)
   Data: bonds/data.json (monthly emission terms from obligacjeskarbowe.pl). */
(function () {
  'use strict';
  var BASE = 'https://franklinsilvapt-arch.github.io/savings-comparator/pl-bonds/';
  var LANG = (document.documentElement.lang || 'en').toLowerCase().indexOf('pl') === 0 ? 'pl' : 'en';
  var D = null;

  var T = {
    pl: {
      names: { OTS: 'OTS 3-miesięczne', ROR: 'ROR roczne', DOR: 'DOR 2-letnie', TOS: 'TOS 3-letnie', COI: 'COI 4-letnie', EDO: 'EDO 10-letnie', ROS: 'ROS 6-letnie rodzinne', ROD: 'ROD 12-letnie rodzinne' },
      months: function (m) { return m + ' ' + plMonths(m); }, years: function (m) { return m % 12 === 0 ? (m / 12) + ' ' + plYears(m / 12) : m + ' ' + plMonths(m); },
      year: 'Rok', monthP: 'Miesiąc', family: 'tylko 800+',
      offer: function (d) { return 'Oprocentowanie z emisji: ' + d.emissionLabel.pl + '. Sprawdzono ' + fmtDate(d.checked) + '.'; },
      ike: ' (IKE)', none: 'brak',
      summary: function (o) {
        var s = 'Kupujesz <strong>' + o.n + '</strong> ' + plBonds(o.n) + ' <strong>' + o.code + '</strong> za <strong>' + o.inv + '</strong>';
        s += o.early ? ' i sprzedajesz je przed terminem wykupu (okres inwestycji: <strong>' + o.hold + '</strong>).' : ' i trzymasz je do wykupu (<strong>' + o.hold + '</strong>).';
        s += ' Na koniec dostajesz około <strong>' + o.fin + '</strong>, czyli <strong>' + o.net + '</strong> zysku netto';
        s += o.cpiUsed ? ' przy założeniu inflacji <strong>' + o.cpi + '</strong> rocznie.' : '.';
        if (o.early && o.fee) s += ' Opłata za przedterminowy wykup wynosi <strong>' + o.fee + '</strong>.';
        if (o.ikeNo) s += ' Obligacji ' + o.code + ' nie można trzymać na IKE (IKE-Obligacje obejmuje tylko ROR, DOR, TOS, COI i EDO), więc kalkulator liczy podatek Belki.';
        return s;
      }
    },
    en: {
      names: { OTS: 'OTS 3-month', ROR: 'ROR 1-year', DOR: 'DOR 2-year', TOS: 'TOS 3-year', COI: 'COI 4-year', EDO: 'EDO 10-year', ROS: 'ROS 6-year family', ROD: 'ROD 12-year family' },
      months: function (m) { return m + ' months'; }, years: function (m) { return m % 12 === 0 ? (m / 12) + (m === 12 ? ' year' : ' years') : m + ' months'; },
      year: 'Year', monthP: 'Month', family: '800+ only',
      offer: function (d) { return 'Rates from the ' + d.emissionLabel.en + ' issue. Checked on ' + fmtDate(d.checked) + '.'; },
      ike: ' (IKE)', none: 'none',
      summary: function (o) {
        var s = 'You buy <strong>' + o.n + '</strong> <strong>' + o.name + '</strong> bond' + (o.n === 1 ? '' : 's') + ' for <strong>' + o.inv + '</strong>';
        s += o.early ? ' and redeem them before maturity, after <strong>' + o.hold + '</strong>.' : ' and hold them to maturity (<strong>' + o.hold + '</strong>).';
        s += ' At the end you get about <strong>' + o.fin + '</strong>, which is <strong>' + o.net + '</strong> of net profit';
        s += o.cpiUsed ? ', assuming <strong>' + o.cpi + '</strong> annual inflation.' : '.';
        if (o.early && o.fee) s += ' The early redemption fee is <strong>' + o.fee + '</strong>.';
        if (o.ikeNo) s += ' ' + o.code + ' bonds cannot be held in an IKE (IKE-Obligacje only covers ROR, DOR, TOS, COI and EDO), so the calculator applies the Belka tax.';
        return s;
      }
    }
  }[LANG];

  function plYears(y) { if (y === 1) return 'rok'; var l = y % 10, h = y % 100; return (l >= 2 && l <= 4 && (h < 12 || h > 14)) ? 'lata' : 'lat'; }
  function plMonths(m) { if (m === 1) return 'miesiąc'; var l = m % 10, h = m % 100; return (l >= 2 && l <= 4 && (h < 12 || h > 14)) ? 'miesiące' : 'miesięcy'; }
  function plBonds(n) { if (n === 1) return 'obligację'; var l = n % 10, h = n % 100; return (l >= 2 && l <= 4 && (h < 12 || h > 14)) ? 'obligacje' : 'obligacji'; }
  function fmtDate(iso) { var p = iso.split('-'); return LANG === 'pl' ? p[2] + '.' + p[1] + '.' + p[0] : p[2] + '/' + p[1] + '/' + p[0]; }

  /* ── Formatting ── */
  function fmtMoney(v) {
    if (!isFinite(v)) return '-';
    var neg = v < 0, parts = Math.abs(v).toFixed(2).split('.');
    var s = LANG === 'pl' ? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + parts[1] + ' zł'
                          : 'PLN ' + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
    return (neg ? '-' : '') + s;
  }
  function fmtPct(v) { if (!isFinite(v)) return '-'; var s = v.toFixed(2); return (LANG === 'pl' ? s.replace('.', ',') : s) + '%'; }

  function parseNum(type) {
    var el = document.querySelector('[data-type="' + type + '"]');
    if (!el) return NaN;
    var raw = String(el.value).replace(/[\s ]/g, '');
    if (!raw) return NaN;
    if (type === 'obl-kwota' || type === 'obl-okres') return parseFloat(raw.replace(/[.,]/g, ''));
    var last = Math.max(raw.lastIndexOf('.'), raw.lastIndexOf(','));
    if (last === -1) return parseFloat(raw);
    return parseFloat(raw.slice(0, last).replace(/[.,]/g, '') + '.' + raw.slice(last + 1));
  }
  function selected() { var s = document.querySelector('select[data-type="obl-typ"]'); return s && D.bonds[s.value] ? s.value : 'EDO'; }

  /* ── Engine (per 100 zł bond, rounded to the grosz as in the listy emisyjne) ── */
  var r2 = function (x) { return Math.round((x + 1e-9) * 100) / 100; };
  function rateFor(b, k, a) {
    if (k === 0 || b.idx === 'fixed') return b.first;
    if (b.idx === 'nbp') return Math.max(0, a.nbp) + b.margin;
    return Math.max(0, a.cpi) + b.margin; /* negative inflation counts as 0 */
  }
  function simulate(code, n, hold, a, tax) {
    var b = D.bonds[code];
    hold = Math.max(1, Math.min(hold, b.months));
    var early = hold < b.months;
    var res = { code: code, n: n, hold: hold, early: early, invested: n * 100, gross: 0, fee: 0, tax: 0, rows: [], unit: (b.pay === 'monthly' ? 'm' : 'y') };
    if (b.pay === 'end') {
      res.gross = early ? 0 : r2(100 * b.first / 100 * b.months / 12) * n;
      res.tax = r2(res.gross * tax);
      res.final = r2(res.invested + res.gross - res.tax);
      res.rows.push({ p: 1, rate: b.first, gross: res.gross, partial: early ? hold : 0 });
      res.unit = 'all';
      return finish(res, a);
    }
    if (b.pay === 'monthly' || b.pay === 'yearly') {
      var len = b.pay === 'monthly' ? 1 : 12;
      var full = early ? Math.floor(hold / len) : b.months / len, part = early ? hold - full * len : 0;
      if (early && part === 0) { full -= 1; part = len; } /* redeemed inside the last period, before its payout */
      var gPaid = 0, tPaid = 0;
      for (var k = 0; k < full; k++) {
        var r = rateFor(b, k, a), g = r2(100 * r / 100 * len / 12) * n;
        gPaid += g; tPaid += r2(g * tax);
        res.rows.push({ p: k + 1, rate: r, gross: r2(g) });
      }
      var acc = 0, fee = 0;
      if (early) {
        var rc = rateFor(b, full, a);
        acc = r2(100 * rc / 100 * part / 12);
        fee = (b.cap === 'all' || full === 0) ? Math.min(b.fee, acc) : b.fee;
        if (part > 0) res.rows.push({ p: full + 1, rate: rc, gross: r2(acc * n), partial: part });
      }
      res.gross = r2(gPaid + acc * n);
      res.fee = r2(fee * n);
      res.tax = r2(tPaid + r2(Math.max(0, acc * n - fee * n) * tax));
      res.final = r2(res.invested + res.gross - res.fee - res.tax);
      return finish(res, a);
    }
    var v = 100, years = early ? Math.floor(hold / 12) : b.months / 12, rem = early ? hold - years * 12 : 0;
    for (var y = 0; y < years; y++) {
      var ry = rateFor(b, y, a), nv = r2(v * (1 + ry / 100));
      res.rows.push({ p: y + 1, rate: ry, gross: r2((nv - v) * n) });
      v = nv;
    }
    if (rem > 0) {
      var rr = rateFor(b, years, a), add = r2(v * rr / 100 * rem / 12);
      res.rows.push({ p: years + 1, rate: rr, gross: r2(add * n), partial: rem });
      v = r2(v + add);
    }
    var accB = r2(v - 100), feeB = early ? Math.min(b.fee, accB) : 0;
    res.gross = r2(accB * n);
    res.fee = r2(feeB * n);
    res.tax = r2(Math.max(0, res.gross - res.fee) * tax);
    res.final = r2(res.invested + res.gross - res.fee - res.tax);
    return finish(res, a);
  }
  function finish(res, a) {
    res.net = r2(res.final - res.invested);
    var yrs = res.hold / 12;
    res.annual = (Math.pow(res.final / res.invested, 1 / yrs) - 1) * 100;
    res.real = r2(res.final / Math.pow(1 + Math.max(0, a.cpi) / 100, yrs));
    return res;
  }

  /* ── UI helpers ── */
  function $(id) { return document.getElementById(id); }
  function setText(id, v) { var e = $(id); if (e) e.textContent = v; }
  function setVal(type, v) { var e = document.querySelector('input[data-type="' + type + '"]'); if (e) e.value = v; }

  function syncFields() {
    if (!D) return;
    var b = D.bonds[selected()];
    document.querySelectorAll('[data-obl-show]').forEach(function (w) {
      var show = w.getAttribute('data-obl-show') === b.idx;
      w.style.display = show ? '' : 'none';
      var sp = w.nextElementSibling;
      if (sp && sp.classList.contains('spacer-1-5')) sp.style.display = show ? '' : 'none';
    });
    var mat = $('obl-maturity');
    if (mat) mat.textContent = (LANG === 'pl' ? 'Termin wykupu: ' : 'Maturity: ') + T.months(b.months);
    var okres = document.querySelector('input[data-type="obl-okres"]');
    if (okres) okres.setAttribute('max-value', String(b.months));
  }
  var lastType = null;
  function onTypeChange() {
    if (!D) return;
    var c = selected();
    if (c === lastType) return;
    lastType = c;
    setVal('obl-okres', String(D.bonds[c].months));
    syncFields();
  }

  var chart = null;
  function loadChart() {
    return new Promise(function (ok) {
      if (window.Chart) return ok();
      var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/chart.js'; s.onload = ok; document.head.appendChild(s);
    });
  }

  function run() {
    if (!D) return;
    var code = selected(), b = D.bonds[code];
    var amount = parseNum('obl-kwota'), n = Math.floor(amount / 100);
    var hold = Math.round(parseNum('obl-okres'));
    if (!isFinite(hold) || hold <= 0) hold = b.months;
    var cpi = parseNum('obl-inflacja'); if (!isFinite(cpi)) cpi = 2.5;
    var nbp = parseNum('obl-nbp'); if (!isFinite(nbp)) nbp = D.nbp.rate;
    var ikeEl = $('obl-ike'), ike = !!(ikeEl && ikeEl.checked);
    var a = { cpi: cpi, nbp: nbp };
    var wrap = $('lfc-dp');
    if (!(n >= 1)) { if (wrap) wrap.classList.add('is-hidden'); return; }
    if (wrap) wrap.classList.remove('is-hidden');
    var resW = document.querySelector('.all-results_wrapper');
    if (resW) {
      var wasHidden = getComputedStyle(resW).display === 'none';
      resW.style.display = 'flex';
      if (wasHidden || resW.getBoundingClientRect().top > window.innerHeight * 0.6) setTimeout(function () { resW.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
    }
    var ikeOk = ike && b.ike !== false;
    var r = simulate(code, n, hold, a, ikeOk ? 0 : 0.19);

    setText('obl-final', fmtMoney(r.final));
    setText('obl-n', String(n) + ' × 100' + (LANG === 'pl' ? ' zł' : ' PLN'));
    setText('obl-gross', fmtMoney(r.gross));
    setText('obl-fee', r.fee > 0 ? '-' + fmtMoney(r.fee) : fmtMoney(0));
    setText('obl-tax', r.tax > 0 ? '-' + fmtMoney(r.tax) : fmtMoney(0) + (ikeOk ? T.ike : ''));
    setText('obl-net', fmtMoney(r.net));
    setText('obl-annual', fmtPct(r.annual));
    setText('obl-real', fmtMoney(r.real));
    var netEl = $('obl-net'); if (netEl) netEl.classList.toggle('is-negative', r.net < 0);

    var sum = $('lfc-dp-summary');
    if (sum) sum.innerHTML = T.summary({ n: n, code: code, name: T.names[code], inv: fmtMoney(r.invested), early: r.early, hold: T.years(r.hold), fin: fmtMoney(r.final), net: fmtMoney(r.net), cpiUsed: b.idx === 'cpi', cpi: fmtPct(cpi), fee: r.fee > 0 ? fmtMoney(r.fee) : '', ikeNo: ike && !ikeOk });

    /* Period table */
    var tb = $('obl-years');
    if (tb) {
      var head = r.unit === 'm' ? T.monthP : T.year;
      var html = '';
      r.rows.forEach(function (row) {
        var label = r.unit === 'all' ? T.months(b.months) : head + ' ' + row.p + (row.partial && r.unit === 'y' ? ' (' + T.months(row.partial) + ')' : '');
        html += '<tr><td>' + label + '</td><td>' + fmtPct(row.rate) + '</td><td>' + fmtMoney(row.gross) + '</td></tr>';
      });
      tb.innerHTML = html;
      setText('obl-years-h1', head);
    }

    /* All bonds held to maturity */
    var cb = $('obl-compare');
    if (cb) {
      var rows = Object.keys(D.bonds).map(function (c) { return { c: c, r: simulate(c, n, D.bonds[c].months, a, (ike && D.bonds[c].ike !== false) ? 0 : 0.19) }; });
      rows.sort(function (x, y) { return y.r.annual - x.r.annual; });
      cb.innerHTML = rows.map(function (o) {
        var fam = (o.c === 'ROS' || o.c === 'ROD') ? ' <span class="obl-tag">' + T.family + '</span>' : '';
        return '<tr' + (o.c === code ? ' class="is-current"' : '') + '><td>' + T.names[o.c] + fam + '</td><td>' + fmtPct(o.r.annual) + '</td><td>' + fmtMoney(o.r.net) + '</td></tr>';
      }).join('');
    }

    /* Donut */
    loadChart().then(function () {
      var cv = $('lfc-dp-donut'); if (!cv) return;
      if (chart) chart.destroy();
      var profit = Math.max(0, r.net), cap = r.invested + Math.min(0, r.net);
      var labels = LANG === 'pl' ? ['Zainwestowany kapitał', 'Zysk netto'] : ['Invested capital', 'Net profit'];
      chart = new Chart(cv.getContext('2d'), {
        type: 'doughnut',
        data: { labels: labels, datasets: [{ data: [cap, profit], backgroundColor: ['#F79009', '#2E90FA'], borderWidth: 0, cutout: '80%' }] },
        options: { responsive: true, maintainAspectRatio: true, animation: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#121721', cornerRadius: 8, padding: 12, callbacks: { label: function (c) { return c.label + ': ' + fmtMoney(c.raw); } } } } }
      });
      setText('lfc-dp-chart-subtitle', fmtMoney(r.invested) + ' · ' + T.names[code] + ' · ' + T.years(r.hold));
      setText('lfc-dp-donut-val', fmtMoney(r.final));
      var tot = cap + profit;
      setText('lfc-dp-leg-capital', fmtMoney(cap)); setText('lfc-dp-leg-capital-pct', (cap / tot * 100).toFixed(1).replace('.', LANG === 'pl' ? ',' : '.') + '%');
      setText('lfc-dp-leg-juros', fmtMoney(profit)); setText('lfc-dp-leg-juros-pct', (profit / tot * 100).toFixed(1).replace('.', LANG === 'pl' ? ',' : '.') + '%');
    });
  }

  /* ── Events ── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('#calcular');
    if (btn) { e.preventDefault(); run(); return; }
    if (e.target.closest && e.target.closest('.dropdown-calculadora')) setTimeout(onTypeChange, 60);
    var ikeL = e.target.closest && e.target.closest('#obl-ike-label');
    if (ikeL) setTimeout(function () { var cbx = $('obl-ike'), vis = $('obl-ike-visual'); if (vis && cbx) vis.classList.toggle('w--redirected-checked', cbx.checked); }, 0);
  });
  var sel = document.querySelector('select[data-type="obl-typ"]');
  if (sel) {
    sel.addEventListener('change', onTypeChange);
    new MutationObserver(onTypeChange).observe(sel, { attributes: true, childList: true });
  }

  /* Remove duplicate dropdown links (Finsweet select duplicates them) */
  function dedupe() {
    document.querySelectorAll('.dropdown-list-caulculadora').forEach(function (nav) {
      var seen = {}, links = nav.querySelectorAll('a.dropdown-calculadora');
      for (var i = links.length - 1; i >= 0; i--) { var t = links[i].textContent.trim(); if (seen[t]) links[i].remove(); else seen[t] = 1; }
    });
  }
  dedupe();
  document.querySelectorAll('.dropdown-list-caulculadora').forEach(function (nav) { new MutationObserver(dedupe).observe(nav, { childList: true }); });

  /* ── Share results (copy URL with inputs) ── */
  function getIn(t) { var e = document.querySelector('[data-type="' + t + '"]'); return e ? e.value : ''; }
  function setSelect(v) {
    var s = document.querySelector('select[data-type="obl-typ"]'); if (!s || !s.querySelector('option[value="' + v + '"]')) return;
    s.value = v;
    var w = s.closest('[fs-selectcustom-element="dropdown"]'), txt = s.querySelector('option[value="' + v + '"]').textContent;
    if (w) {
      var tg = w.querySelector('.dropdown-toggle > div'); if (tg) tg.textContent = txt;
      w.querySelectorAll('.dropdown-calculadora').forEach(function (l) { var on = l.textContent.trim() === txt; l.classList.toggle('w--current', on); l.setAttribute('aria-selected', on ? 'true' : 'false'); });
    }
  }
  function shareUrl() {
    var p = new URLSearchParams();
    p.set('typ', selected()); p.set('kwota', getIn('obl-kwota')); p.set('okres', getIn('obl-okres'));
    p.set('inflacja', getIn('obl-inflacja')); p.set('nbp', getIn('obl-nbp'));
    var ik = $('obl-ike'); if (ik && ik.checked) p.set('ike', '1');
    return location.origin + location.pathname + '?' + p.toString();
  }
  function applyUrl() {
    var q = new URLSearchParams(location.search); if (!q.has('typ')) return;
    setSelect(q.get('typ')); lastType = selected(); syncFields();
    if (q.has('kwota')) setVal('obl-kwota', q.get('kwota'));
    if (q.has('okres')) setVal('obl-okres', q.get('okres'));
    if (q.has('inflacja')) setVal('obl-inflacja', q.get('inflacja'));
    if (q.has('nbp')) setVal('obl-nbp', q.get('nbp'));
    if (q.get('ike') === '1') { var ik = $('obl-ike'), vis = $('obl-ike-visual'); if (ik) ik.checked = true; if (vis) vis.classList.add('w--redirected-checked'); }
    setTimeout(run, 200);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[share-url]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var si = b.querySelector('[share-icon]'), ci = b.querySelector('[copied-icon]'), ct = b.querySelector('[copied-text]');
    var done = LANG === 'pl' ? 'Link skopiowany' : 'Link copied', idle = LANG === 'pl' ? 'Udostępnij wynik' : 'Share results';
    navigator.clipboard.writeText(shareUrl()).then(function () {
      if (si) si.style.display = 'none'; if (ci) ci.style.display = 'block'; if (ct) ct.textContent = done;
      setTimeout(function () { if (si) si.style.display = 'block'; if (ci) ci.style.display = 'none'; if (ct) ct.textContent = idle; }, 1500);
    });
  }, true);

  /* ── Download donut as PNG ── */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[download-graph-image-button]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var cv = $('lfc-dp-donut'); if (!cv) return;
    var a = document.createElement('a'); a.href = cv.toDataURL('image/png', 1.0);
    a.download = LANG === 'pl' ? 'kalkulator-obligacji-skarbowych.png' : 'polish-treasury-bonds-chart.png'; a.click();
  }, true);

  /* Localize the shared (bilingual) form: dropdown texts and number formats */
  (function () {
    var s = document.querySelector('select[data-type="obl-typ"]'); if (!s) return;
    var opts = s.querySelectorAll('option');
    opts.forEach(function (o) { if (T.names[o.value]) o.textContent = T.names[o.value]; });
    var w = s.closest('[fs-selectcustom-element="dropdown"]');
    if (w) {
      var links = w.querySelectorAll('a.dropdown-calculadora');
      links.forEach(function (l, i) { if (opts[i]) l.textContent = opts[i].textContent; });
      var tg = w.querySelector('.dropdown-toggle > div'); if (tg && T.names[s.value]) tg.textContent = T.names[s.value];
    }
    if (LANG === 'pl') { setVal('obl-kwota', '10 000'); setVal('obl-inflacja', '2,5'); }
    else { setVal('obl-kwota', '10,000'); }
  })();

  (function () { var st = document.createElement('style'); st.textContent = 'body #lfc-dp .obl-scroll{max-height:none;overflow:visible}'; document.head.appendChild(st); })();

  /* Chart card labels (the chart embed is shared with the deposit calculator layout) */
  (function () {
    var L2 = LANG === 'pl' ? ['Podział kwoty końcowej', 'Kwota końcowa', 'Zainwestowany kapitał', 'Zysk netto'] : ['End amount breakdown', 'End amount', 'Invested capital', 'Net profit'];
    var q = function (s) { return document.querySelector('#lfc-dp-chart ' + s); };
    if (q('.lfc-dp-chart-title')) q('.lfc-dp-chart-title').textContent = L2[0];
    if (q('.lfc-dp-donut-label')) q('.lfc-dp-donut-label').textContent = L2[1];
    var lt = document.querySelectorAll('#lfc-dp-chart .lfc-dp-legend-text');
    if (lt[0]) lt[0].textContent = L2[2];
    if (lt[1]) lt[1].textContent = L2[3];
  })();

  /* ── Data ── */
  fetch(BASE + 'data.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
    D = d;
    setText('obl-offer', T.offer(d));
    var nb = String(d.nbp.rate), sp = d.nbp.since.split('-'), cp = String(d.cpi.latest);
    if (LANG === 'pl') { nb = nb.replace('.', ','); cp = cp.replace('.', ','); }
    var mPL = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'], mEN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var since = LANG === 'pl' ? (+sp[2]) + ' ' + mPL[+sp[1] - 1] + ' ' + sp[0] : (+sp[2]) + ' ' + mEN[+sp[1] - 1] + ' ' + sp[0];
    document.querySelectorAll('.obl-nbp-now').forEach(function (e) { e.textContent = LANG === 'pl' ? 'Obecnie wynosi ' + nb + '% (od ' + since + ').' : 'It is currently ' + nb + '% (since ' + since + ').'; });
    document.querySelectorAll('.obl-cpi-now').forEach(function (e) { e.textContent = LANG === 'pl' ? ' Ostatni odczyt GUS: ' + cp + '% (' + d.cpi.month.pl + ').' : ' Latest GUS reading: ' + cp + '% (' + d.cpi.month.en + ').'; });
    var nbpIn = document.querySelector('input[data-type="obl-nbp"]');
    if (nbpIn && !nbpIn.value) nbpIn.value = LANG === 'pl' ? String(d.nbp.rate).replace('.', ',') : String(d.nbp.rate);
    lastType = selected();
    syncFields();
    applyUrl();
  }).catch(function () { setText('obl-offer', LANG === 'pl' ? 'Nie udało się wczytać danych. Odśwież stronę.' : 'Could not load the data. Please refresh the page.'); });

  window.__oblSimulate = function (c, n, h, a, t) { return simulate(c, n, h, a, t); };
})();
