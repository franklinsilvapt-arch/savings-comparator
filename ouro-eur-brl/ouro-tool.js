(function () {
  /* Preço do ouro com o lf-kit. Configuração em window.OG_CFG (moeda, textos, fontes).
     Usado em eupersonalfinance.eu/nl/goudprijs (EUR) e educacaofinanceirabrasil.com.br/preco-do-ouro (BRL).
     Ao vivo: gold-api.com (XAU/USD) x taxa de referência do BCE (frankfurter).
     Histórico: preço do ouro do NBP (PLN/g, a partir do fixing LBMA) x taxa do BCE PLN->moeda do mesmo dia. */
  var C = window.OG_CFG, OZ = 31.1034768, D = { g: null, live: false, hist: [], at: null }, days = 92;
  function $(id) { return document.getElementById(id); }
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function dLong(s) { var p = s.split("-"); return parseInt(p[2], 10) + C.de + C.meses[+p[1] - 1] + C.de + p[0]; }
  function dShort(s) { var p = s.split("-"); return p[2] + "/" + p[1]; }
  function dTab(s) { var p = s.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function pct(v) { return (v > 0 ? "+" : "") + LFK.fmt(v * 100, { currency: false }) + "%"; }
  function set(id, v) { var e = $(id); if (e) e.textContent = v; }
  function json(url) {
    return new Promise(function (ok) {
      var ctl = window.AbortController ? new AbortController() : null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); ok(null); }, 9000);
      fetch(url, { cache: "no-store", signal: ctl ? ctl.signal : undefined })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { clearTimeout(t); ok(j); })
        .catch(function () { clearTimeout(t); ok(null); });
    });
  }
  function historico(nbp, fx) {
    if (!Array.isArray(nbp) || !fx || !fx.rates) return [];
    var datas = Object.keys(fx.rates).sort(), out = [], j = 0, ref = null;
    nbp.forEach(function (q) {
      if (!q || typeof q.cena !== "number" || q.cena < 50 || q.cena > 5000) return;
      while (j < datas.length && datas[j] <= q.data) { ref = datas[j]; j++; }
      var r = ref && fx.rates[ref] && fx.rates[ref][C.cur];
      if (r && r > C.plnMin && r < C.plnMax) out.push({ d: q.data, v: q.cena * r });
    });
    return out;
  }
  function antes(dias) {
    var lim = iso(new Date(Date.now() - dias * 86400000)), h = D.hist;
    for (var i = 0; i < h.length; i++) if (h[i].d >= lim) return h[i];
    return null;
  }
  function inicioAno() {
    var ano = String(new Date().getFullYear()), y0 = null;
    for (var i = 0; i < D.hist.length; i++) { if (D.hist[i].d.slice(0, 4) === ano) break; y0 = D.hist[i]; }
    return y0;
  }

  function precos() {
    var g = D.g;
    set("og-g", LFK.fmt(g));
    set("og-18", LFK.fmt(g * C.f2));
    set("og-oz", LFK.fmt(g * OZ));
    var r12 = antes(365), y0 = inicioAno(), s = [];
    if (y0) s.push(C.tNoAno + " " + pct(g / y0.v - 1));
    if (r12 && D.hist.length > 200) s.push(C.t12m + " " + pct(g / r12.v - 1));
    set("og-g-s", s.join(" · "));
    var tag = $("og-tag");
    if (tag) { tag.className = "lfk-tag is-sm " + (D.live ? "is-ok" : "is-warn"); tag.textContent = D.live ? C.tAoVivo : C.tUltimo; }
    var now = D.at || new Date();
    set("og-upd", D.live
      ? C.tAtualizado + " " + dLong(iso(now)) + ", " + ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ". " + C.tFonteLive
      : C.tDadosDe + " " + dLong(D.data) + ". " + C.tFonteOff);
    var tb = $("og-quilates");
    if (tb) tb.innerHTML = C.quilates.map(function (q) { return "<tr><td>" + q[0] + "</td><td>" + q[1] + "</td><td class=\"is-num\">" + LFK.fmt(g * q[2]) + "</td></tr>"; }).join("");
    var gp = $("og-pesos");
    if (gp) gp.innerHTML = C.pesos.map(function (p) { return "<tr><td>" + p[0] + "</td><td class=\"is-num\">" + LFK.fmt(g * p[1], { decimals: p[1] >= 100 ? 0 : 2 }) + "</td></tr>"; }).join("");
    var h = $("og-frase");
    if (h) h.innerHTML = C.frase(LFK.fmt(g), LFK.fmt(g * C.f2), D.live ? dLong(iso(now)) : dLong(D.data));
  }

  function grafico() {
    var card = $("og-evol");
    if (D.hist.length < 2) { if (card) card.hidden = true; return; }
    var from = iso(new Date(Date.now() - days * 86400000)), s = D.hist.filter(function (x) { return x.d >= from; });
    if (s.length < 2) s = D.hist.slice(-22);
    set("og-sub", C.tPeriodo(dTab(s[0].d), dTab(s[s.length - 1].d)));
    LFK.line($("og-chart"), { labels: s.map(function (x) { return dShort(x.d); }), maxTicks: 8, datasets: [{ label: C.tSerie, data: s.map(function (x) { return Math.round(x.v * 100) / 100; }) }] });
    var rows = [];
    for (var i = s.length - 1; i >= 1; i--) rows.push([dTab(s[i].d), LFK.fmt(s[i].v), pct(s[i].v / s[i - 1].v - 1)]);
    LFK.table($("og-table"), { head: C.tHead, num: [false, true, true], rows: rows, more: C.tMais, less: C.tMenos });
  }

  function calcular() {
    if (!D.g) return false;
    var peso = LFK.num($("og-peso").value), sel = $("og-quilate"), f = parseFloat(sel.value);
    if (!(peso > 0)) { $("og-peso").closest(".lfk-field").classList.add("is-error"); return false; }
    $("og-peso").closest(".lfk-field").classList.remove("is-error");
    var puro = peso * f, valor = puro * D.g, nome = sel.options[sel.selectedIndex].textContent;
    set("og-r-valor", LFK.fmt(valor));
    set("og-r-grama", LFK.fmt(D.g * f));
    set("og-r-puro", LFK.fmt(puro, { currency: false }) + " g");
    set("og-r-frase", C.fraseCalc(LFK.fmt(peso, { currency: false, decimals: peso % 1 ? 2 : 0 }), nome, LFK.fmt(valor)));
  }

  function eventos() {
    LFK.views($("og-evol"));
    var seg = $("og-range");
    if (seg) seg.addEventListener("change", function () {
      var b = seg.querySelector('button[aria-pressed="true"]');
      days = parseInt(b && b.getAttribute("data-dias"), 10) || 92;
      grafico();
    });
    LFK.calc($("og-calcular"), { results: "#og-resultados", empty: "#og-placeholder", run: calcular });
  }

  function boot() {
    eventos();
    var hoje = iso(new Date()), ini = iso(new Date(Date.now() - 400 * 86400000));
    Promise.all([
      json("https://api.gold-api.com/price/XAU"),
      json("https://api.frankfurter.dev/v1/latest?base=USD&symbols=" + C.cur),
      json("https://api.nbp.pl/api/cenyzlota/last/255/?format=json"),
      json("https://api.frankfurter.dev/v1/" + ini + "..?base=PLN&symbols=" + C.cur),
      C.reserva ? json(C.reserva) : Promise.resolve(null)
    ]).then(function (r) {
      var spot = r[0] && typeof r[0].price === "number" && r[0].price > 500 && r[0].price < 50000 ? r[0].price : null;
      var fx = r[1] && r[1].rates && r[1].rates[C.cur];
      if (!(fx > C.usdMin && fx < C.usdMax)) fx = null;
      D.hist = historico(r[2], r[3]);
      var rez = r[4] && C.reservaCampo && typeof r[4][C.reservaCampo] === "number" ? r[4] : null;
      var last = D.hist.length ? D.hist[D.hist.length - 1] : null;
      if (spot && fx) { D.g = spot * fx / OZ; D.live = true; D.at = new Date(); D.data = hoje; }
      else if (rez && (!last || rez.data >= last.d)) { D.g = rez[C.reservaCampo]; D.data = rez.data; }
      else if (last) { D.g = last.v; D.data = last.d; }
      else { set("og-upd", C.tErro); var t = $("og-tag"); if (t) t.hidden = true; return; }
      precos(); grafico();
      if (LFK.restore("#og-form")) $("og-calcular").click();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
