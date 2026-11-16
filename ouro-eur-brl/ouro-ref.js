/* Preço do ouro com a estrutura de literaciafinanceira.pt/preco-do-ouro (e eupersonalfinance.eu/pl/cena-zlota).
   Usado em eupersonalfinance.eu/nl/goudprijs (EUR) e educacaofinanceirabrasil.com.br/preco-do-ouro (BRL).
   Textos, moeda e quilates em window.OURO_CFG (no embed da página).
   Dados em cada visita, de APIs gratuitas sem chave:
   - cotação spot (XAU/USD): api.gold-api.com
   - USD para a moeda da página: taxa de referência do BCE (api.frankfurter.dev)
   - histórico: preço do ouro do NBP (PLN por grama, a partir do fixing LBMA) x taxa do BCE PLN para a moeda do mesmo dia
   Se a cotação ao vivo falhar, usa a reserva (JSON atualizado por GitHub Action) e depois o último ponto do histórico. */
(function () {
  var C = window.OURO_CFG; if (!C) return;
  var UNCJA = 31.1034768, NB = ' ';
  var RANGES = { '1m': 31, '3m': 92, '1a': 4000 };
  var rangeAtivo = '3m';
  var D = null;

  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dataLonga(s) { var p = s.split('-'); return parseInt(p[2], 10) + C.de + C.meses[parseInt(p[1], 10) - 1] + C.de + p[0]; }
  function dataCurta(s) { var p = s.split('-'); return parseInt(p[2], 10) + ' ' + C.mesesCurtos[parseInt(p[1], 10) - 1]; }
  function dataTab(s) { var p = s.split('-'); return p[2] + C.sepData + p[1] + C.sepData + p[0]; }
  function num(v, dec) { var p = v.toFixed(dec).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); return dec > 0 ? p[0] + ',' + p[1] : p[0]; }
  function moeda(v, dec) { return C.simbolo + C.espaco + num(v, dec == null ? 2 : dec); }
  function usd(v) { return num(v, 2) + NB + 'USD'; }
  function pct(v) { if (Math.abs(v) < 0.0005) return '0,0%'; return (v >= 0 ? '+' : '-') + Math.abs(v * 100).toFixed(1).replace('.', ',') + '%'; }
  function hora(d) { return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function peso(v) { return (v % 1 === 0 ? String(v) : v.toFixed(2).replace(/0$/, '').replace('.', ',')) + NB + 'g'; }

  function teorAtivo() {
    var b = document.querySelector('#lfc-ouro-seg .lfc-ouro-seg-btn.is-active');
    var id = b ? b.getAttribute('data-toque') : C.teorPadrao;
    for (var i = 0; i < C.teores.length; i++) if (C.teores[i].id === id) return C.teores[i];
    return C.teores[0];
  }
  function teorCartao() { for (var i = 0; i < C.teores.length; i++) if (C.teores[i].id === C.teorCartao) return C.teores[i]; return C.teores[0]; }
  function setVar(el, v) {
    if (!el) return;
    el.classList.remove('is-up', 'is-down', 'is-flat');
    el.classList.add(v >= 0.0005 ? 'is-up' : (v <= -0.0005 ? 'is-down' : 'is-flat'));
    el.textContent = pct(v);
  }

  function syncTitulo() {
    var recente = D.aoVivo || (Date.now() - new Date(D.data + 'T00:00:00').getTime()) < 12 * 86400000;
    var h1 = document.querySelector('h1');
    if (h1 && C.h1Teste.test(h1.textContent)) h1.innerHTML = recente ? C.h1 + '<span class="lfc-ouro-h1-data">(' + dataLonga(D.data) + ')</span>' : C.h1;
    document.title = recente ? C.h1 + ' (' + dataLonga(D.data) + ')' : C.h1 + C.tituloSemData;
  }

  function renderCartoes() {
    var t = teorCartao();
    var fino = document.querySelector('#lfc-ouro-card-fino [data-fino]');
    var pt = document.querySelector('#lfc-ouro-card-pt [data-pt]');
    if (fino) fino.textContent = moeda(D.g);
    if (pt) pt.textContent = moeda(D.g * t.f);
    var segDia = document.querySelector('[data-seg-dia]'), sep = document.querySelector('[data-sep-dia]'), segAno = document.querySelector('[data-seg-ano]');
    var mostraDia = typeof D.varDia === 'number', mostraAno = typeof D.varAno === 'number';
    if (mostraDia) setVar(document.querySelector('[data-var-dia]'), D.varDia); else { if (segDia) segDia.style.display = 'none'; if (sep) sep.style.display = 'none'; }
    if (mostraAno) setVar(document.querySelector('[data-var-ano]'), D.varAno); else { if (segAno) segAno.style.display = 'none'; if (sep) sep.style.display = 'none'; }
    if (!mostraDia && !mostraAno) {
      var chips = document.getElementById('lfc-ouro-chips');
      if (chips) chips.textContent = D.xauUsd ? C.tOnca + ' ' + usd(D.xauUsd) : C.tFonteHist;
    }
  }

  function renderHeadline() {
    var el = document.getElementById('lfc-ouro-headline'); if (!el) return;
    el.innerHTML = C.headline({ data: dataLonga(D.data), g: moeda(D.g), g2: moeda(D.g * teorCartao().f), xau: D.aoVivo && D.xauUsd ? usd(D.xauUsd) : null, varDia: typeof D.varDia === 'number' && Math.abs(D.varDia) >= 0.0005 ? D.varDia : null, pct: pct });
  }

  function renderStatus() {
    var dataEl = document.getElementById('lfc-ouro-data-atualizado'), fonteEl = document.getElementById('lfc-ouro-status-fonte'), dot = document.getElementById('lfc-ouro-dot');
    if (dataEl) dataEl.textContent = dataLonga(D.data) + (D.aoVivo ? ', ' + hora(new Date()) : '');
    if (D.aoVivo) { if (fonteEl) fonteEl.textContent = C.tFonteVivo; if (dot) dot.classList.remove('is-off'); }
    else { if (fonteEl) fonteEl.textContent = D.fonte || C.tFonteHist; if (dot) dot.classList.add('is-off'); }
  }

  function renderTeores() {
    var tb = document.getElementById('lfc-ouro-toques-tbody'); if (!tb) return;
    tb.innerHTML = C.teores.map(function (p) {
      return '<div class="lfc-ouro-tq-row"><div class="lfc-ouro-tq-cell">' + p.id + (p.sub ? ' <span class="lfc-ouro-tq-sub">· ' + p.sub + '</span>' : '') + '</div><div class="lfc-ouro-tq-cell">' + p.k + '</div><div class="lfc-ouro-tq-cell is-valor">' + moeda(D.g * p.f) + '</div></div>';
    }).join('');
  }

  function renderCalc() {
    var out = document.getElementById('lfc-ouro-result'); if (!out) return;
    var el = document.getElementById('lfc-ouro-peso');
    var w = parseFloat((el ? el.value : '10').replace(/\./g, '').replace(',', '.')) || 0;
    if (w <= 0) { out.innerHTML = C.tSemPeso; return; }
    if (w > 99999) w = 99999;
    var p = teorAtivo(), valor = w * p.f * D.g;
    out.innerHTML = C.resultado({ peso: peso(w), teor: p.id, k: p.k, valor: moeda(valor), porGrama: moeda(D.g * p.f) });
  }

  function bindCalc() {
    var seg = document.getElementById('lfc-ouro-seg');
    if (seg && !seg.__b) { seg.__b = true; seg.addEventListener('click', function (e) { var b = e.target.closest('.lfc-ouro-seg-btn'); if (!b) return; seg.querySelectorAll('.lfc-ouro-seg-btn').forEach(function (x) { x.classList.toggle('is-active', x === b); }); renderCalc(); }); }
    var el = document.getElementById('lfc-ouro-peso');
    if (el && !el.__b) { el.__b = true; el.addEventListener('input', function () { var c = el.value.replace(/[^\d,.]/g, '').replace('.', ','); var p = c.split(','); if (p.length > 2) c = p[0] + ',' + p.slice(1).join(''); if (el.value !== c) el.value = c; renderCalc(); }); }
  }

  var grafico = null;
  function serie() { var dias = RANGES[rangeAtivo] || 92, desde = Date.now() - dias * 86400000; return D.hist.filter(function (h) { return new Date(h.d + 'T00:00:00').getTime() >= desde; }); }
  function loadChart() { return new Promise(function (ok) { if (window.Chart) return ok(); var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js'; s.onload = ok; document.head.appendChild(s); }); }
  function loadH2C() { return new Promise(function (ok) { if (window.html2canvas) return ok(); var s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'; s.onload = ok; document.head.appendChild(s); }); }
  function renderGrafico() {
    loadChart().then(function () {
      var cv = document.getElementById('lfc-ouro-chart'); if (!cv || D.hist.length < 2) return;
      if (grafico) grafico.destroy();
      var s = serie();
      grafico = new Chart(cv.getContext('2d'), {
        type: 'line',
        data: { labels: s.map(function (h) { return dataCurta(h.d); }), datasets: [{ label: C.tSerie, data: s.map(function (h) { return Math.round(h.v * 100) / 100; }), borderColor: '#F79009', backgroundColor: 'rgba(247,144,9,0.06)', borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: '#F79009', fill: true, tension: 0.25 }] },
        options: {
          responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false },
          plugins: { legend: { display: false }, tooltip: { backgroundColor: '#121721', cornerRadius: 8, padding: 12, titleFont: { family: 'Inter', size: 11, weight: '600' }, bodyFont: { family: 'Inter', size: 11, weight: '500' }, callbacks: { title: function (t) { return dataLonga(s[t[0].dataIndex].d); }, label: function (c) { return moeda(s[c.dataIndex].v) + C.tTooltip; } } } },
          scales: { x: { grid: { display: false }, ticks: { color: '#4F5969', font: { family: 'Inter', size: 10, weight: '500' }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } }, y: { grid: { color: '#E5E7EB' }, ticks: { color: '#4F5969', font: { family: 'Inter', size: 10, weight: '500' }, callback: function (v) { return C.simbolo + C.espaco + num(v, 0); } } } }
        }
      });
    });
  }
  function renderTabela() {
    var tb = document.getElementById('lfc-ouro-tabela-tbody'); if (!tb || D.hist.length < 2) return;
    var s = D.hist.slice(-16), h = '';
    for (var i = s.length - 1; i >= 1; i--) {
      var v = s[i].v / s[i - 1].v - 1, cls = v >= 0.0005 ? 'is-up' : (v <= -0.0005 ? 'is-down' : '');
      h += '<div class="lfc-ouro-tabela-row"><div class="lfc-ouro-tabela-cell">' + dataTab(s[i].d) + '</div><div class="lfc-ouro-tabela-cell">' + moeda(s[i].v) + '</div><div class="lfc-ouro-tabela-cell"><span class="lfc-ouro-tabela-var ' + cls + '">' + pct(v) + '</span></div></div>';
    }
    tb.innerHTML = h;
  }
  function secaoGrafico() {
    if (D.hist.length >= 2) { renderGrafico(); renderTabela(); return; }
    var p = document.getElementById('lfc-ouro-chart-panel'), sec = p ? p.closest('.table-results_padding') : null;
    if (sec) sec.style.display = 'none';
  }

  document.addEventListener('click', function (e) {
    var g = e.target.closest('[graphic-button]'), t = e.target.closest('[table-button]');
    if (!g && !t) return;
    e.preventDefault();
    var cp = document.getElementById('lfc-ouro-chart-panel'), tp = document.getElementById('lfc-ouro-tabela-panel');
    if (!cp || !tp) return;
    document.querySelectorAll('[graphic-button]').forEach(function (b) { b.classList.toggle('is-active', !!g); });
    document.querySelectorAll('[table-button]').forEach(function (b) { b.classList.toggle('is-active', !!t); });
    cp.style.display = g ? 'block' : 'none'; tp.style.display = t ? 'block' : 'none';
    if (g && grafico) setTimeout(function () { grafico.resize(); }, 80);
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.lfc-ouro-range-btn'); if (!b) return;
    rangeAtivo = b.getAttribute('data-range') || '3m';
    document.querySelectorAll('.lfc-ouro-range-btn').forEach(function (x) { x.classList.toggle('is-active', x === b); });
    renderGrafico();
  });
  function capture(sel, ficheiro) {
    loadH2C().then(function () { var p = document.querySelector(sel); if (!p) return; html2canvas(p, { backgroundColor: '#ffffff', scale: 2 }).then(function (c) { var a = document.createElement('a'); a.download = ficheiro; a.href = c.toDataURL('image/png'); a.click(); }); });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[download-graph-image-button]'); if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    capture('#lfc-ouro-chart-panel', C.ficheiro + '-grafico.png');
  }, true);
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[download-table-image-button]'); if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var p = document.getElementById('lfc-ouro-tabela-panel'), estava = p && p.style.display === 'block';
    if (p && !estava) p.style.display = 'block';
    capture('#lfc-ouro-tabela-panel', C.ficheiro + '-tabela.png');
    if (p && !estava) setTimeout(function () { p.style.display = 'none'; }, 400);
  }, true);
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[share-url]'); if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    navigator.clipboard.writeText(location.origin + location.pathname).then(function () {
      var ci = b.querySelector('[copied-icon]'), si = b.querySelector('[share-icon]'), ct = b.querySelector('[copied-text]');
      var antes = ct ? ct.textContent : '';
      if (ci) ci.style.display = 'block'; if (si) si.style.display = 'none'; if (ct) ct.textContent = C.tCopiado;
      setTimeout(function () { if (ci) ci.style.display = 'none'; if (si) si.style.display = 'block'; if (ct) ct.textContent = antes; }, 2000);
    });
  }, true);

  function schema() {
    var faq = [];
    document.querySelectorAll('.faq-calculators-H3, .faq-calculators-h3').forEach(function (h3) {
      var bloco = h3.closest('.text-weight-semibold'), el = bloco ? bloco.nextElementSibling : null;
      while (el && !el.classList.contains('text-color-secondary')) el = el.nextElementSibling;
      var resp = el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
      if (resp && !C.semSchema.test(h3.textContent)) faq.push({ '@type': 'Question', name: h3.textContent.trim(), acceptedAnswer: { '@type': 'Answer', text: resp } });
    });
    var g = [{ '@type': 'Article', headline: C.h1 + ' (' + dataLonga(D.data) + ')', inLanguage: C.lang, datePublished: C.publicado, dateModified: D.data, author: { '@type': 'Organization', name: C.org, url: C.orgUrl }, publisher: { '@type': 'Organization', name: C.org, url: C.orgUrl }, mainEntityOfPage: location.origin + location.pathname }];
    if (faq.length) g.push({ '@type': 'FAQPage', mainEntity: faq });
    var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': g }); document.head.appendChild(s);
  }

  function render() {
    syncTitulo(); renderCartoes(); renderHeadline(); renderStatus(); renderTeores(); renderCalc(); bindCalc(); secaoGrafico();
    document.querySelectorAll('.all-results_wrapper').forEach(function (w) { w.style.display = 'flex'; });
    if (C.schema) schema();
  }

  function fetchJson(url) {
    return new Promise(function (ok) {
      var ctl = ('AbortController' in window) ? new AbortController() : null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); ok(null); }, 8000);
      fetch(url, { cache: 'no-store', signal: ctl ? ctl.signal : undefined }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { clearTimeout(t); ok(j); }).catch(function () { clearTimeout(t); ok(null); });
    });
  }
  function historico(nbp, fx) {
    if (!Array.isArray(nbp) || !fx || !fx.rates) return [];
    var datas = Object.keys(fx.rates).sort(), out = [], j = 0, ref = null;
    nbp.forEach(function (q) {
      if (!q || typeof q.cena !== 'number' || q.cena < 50 || q.cena > 5000 || !q.data) return;
      while (j < datas.length && datas[j] <= q.data) { ref = datas[j]; j++; }
      var r = ref && fx.rates[ref] && fx.rates[ref][C.moeda];
      if (r && r > C.plnMin && r < C.plnMax) out.push({ d: q.data, v: q.cena * r });
    });
    return out;
  }
  function variacaoAno(h, ref) {
    var ano = String(new Date().getFullYear()), y0 = null;
    for (var i = 0; i < h.length; i++) { if (h[i].d.slice(0, 4) === ano) break; y0 = h[i]; }
    return y0 && y0.d.slice(0, 4) !== ano ? ref / y0.v - 1 : null;
  }
  function boot() {
    var ini = iso(new Date(Date.now() - 400 * 86400000));
    Promise.all([
      fetchJson('https://api.gold-api.com/price/XAU'),
      fetchJson('https://api.frankfurter.dev/v1/latest?base=USD&symbols=' + C.moeda),
      fetchJson('https://api.nbp.pl/api/cenyzlota/last/255/?format=json'),
      fetchJson('https://api.frankfurter.dev/v1/' + ini + '..?base=PLN&symbols=' + C.moeda),
      C.reserva ? fetchJson(C.reserva) : Promise.resolve(null)
    ]).then(function (r) {
      var spot = r[0] && typeof r[0].price === 'number' && r[0].price > 500 && r[0].price < 50000 ? r[0].price : null;
      var fx = r[1] && r[1].rates && r[1].rates[C.moeda];
      if (!(fx > C.usdMin && fx < C.usdMax)) fx = null;
      var hist = historico(r[2], r[3]);
      var rez = r[4] && typeof r[4][C.reservaCampo] === 'number' && r[4][C.reservaCampo] > 0 && typeof r[4].data === 'string' ? r[4] : null;
      if (hist.length < 2 && rez && Array.isArray(rez.hist)) hist = rez.hist.map(function (x) { return { d: x.d, v: x[C.reservaHist] }; }).filter(function (x) { return x.d && x.v > 0; });
      if (spot && fx) D = { g: spot * fx / UNCJA, xauUsd: spot, data: iso(new Date()), aoVivo: true };
      else if (rez) D = { g: rez[C.reservaCampo], xauUsd: rez.xauUsd || null, data: rez.data, aoVivo: false, fonte: C.tReserva(dataLonga(rez.data)) };
      else if (hist.length) D = { g: hist[hist.length - 1].v, data: hist[hist.length - 1].d, aoVivo: false, fonte: C.tFonteHist };
      else {
        var st = document.getElementById('lfc-ouro-status-fonte'); if (st) st.textContent = C.tErro;
        return;
      }
      D.hist = hist;
      if (hist.length >= 2) { D.varDia = hist[hist.length - 1].v / hist[hist.length - 2].v - 1; D.varAno = variacaoAno(hist, D.g); }
      render();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
