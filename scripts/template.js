/* Savings comparator - eupersonalfinance.eu
   Monta-se em #eupf-sc. Se esse elemento nao existir na pagina, e criado a seguir ao primeiro h1.
   Os dados vem de data/accounts.json e sao injetados por scripts/build.py. Nao editar a mao. */
(function(){
  if (document.getElementById("eupf-sc") && document.getElementById("eupf-sc").dataset.built) return;
  var host = document.getElementById("eupf-sc");
  if (!host) {
    host = document.createElement("div");
    host.id = "eupf-sc";
    var h1 = document.querySelector("h1");
    if (h1 && h1.parentNode) h1.parentNode.insertBefore(host, h1.nextSibling);
    else document.body.appendChild(host);
  }
  host.dataset.built = "1";
  host.innerHTML = `<div class="sc-wrap">
  <p class="sc-verified" id="eupf-verified"></p>

  <div class="sc-controls">
    <div class="sc-field">
      <label for="eupf-country">I live in</label>
      <select class="sc-inp" id="eupf-country"></select>
    </div>
    <div class="sc-field">
      <label for="eupf-amount">I want to save</label>
      <div class="sc-amt">
        <span class="sc-cur">€</span>
        <input class="sc-inp" id="eupf-amount" type="text" inputmode="numeric" value="10,000">
      </div>
    </div>
  </div>

  <div class="sc-bar" id="eupf-bar">
    <button class="sc-chip" type="button" data-f="dgs" aria-pressed="false">Deposit guarantee only</button>
    <button class="sc-chip" type="button" data-f="fixed" aria-pressed="false">Fixed term</button>
    <button class="sc-chip" type="button" data-f="instant" aria-pressed="false">Instant access</button>
    <div class="sc-bar-end">
      <span class="sc-count" id="eupf-count"></span>
      <select class="sc-sort" id="eupf-sort" aria-label="Sort by">
        <option value="rate">Highest rate</option>
        <option value="interest">Most interest on your amount</option>
        <option value="min">Lowest minimum</option>
      </select>
    </div>
  </div>

  <div id="eupf-results"></div>

  <div class="sc-legend">
    <span><i class="sc-dot sc-dgs"></i> Deposit guarantee, up to €100,000</span>
    <span><i class="sc-dot sc-investor"></i> Investor compensation, not a deposit guarantee</span>
    <span><i class="sc-dot sc-none"></i> No protection, capital at risk</span>
  </div>

  <p class="sc-foot" id="eupf-foot"></p>
</div>`;

const DATA = __DATA__;

const CN = {AT:"Austria",BE:"Belgium",BG:"Bulgaria",HR:"Croatia",CY:"Cyprus",CZ:"Czechia",DK:"Denmark",
EE:"Estonia",FI:"Finland",FR:"France",DE:"Germany",GR:"Greece",HU:"Hungary",IS:"Iceland",IE:"Ireland",
IT:"Italy",LV:"Latvia",LI:"Liechtenstein",LT:"Lithuania",LU:"Luxembourg",MT:"Malta",NL:"Netherlands",
NO:"Norway",PL:"Poland",PT:"Portugal",RO:"Romania",SK:"Slovakia",SI:"Slovenia",ES:"Spain",SE:"Sweden"};

const TYPE = {instant:"Instant access", fixed:"Fixed term", mmf:"Money market fund"};
const PROT = {dgs:"Deposit guarantee", investor:"Investor compensation", none:"No protection"};

const state = {country:"PT", amount:10000, filters:new Set(), sort:"rate", open:null};

const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const eur = n => "€" + Math.round(n).toLocaleString("en-GB");
const eur2 = n => "€" + n.toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2});
const pct = n => n.toFixed(2) + "%";
const months = m => m == 12 ? "1 year" : m == 24 ? "2 years" : m + " months";

function interest(a){
  const cap = a.max == null ? state.amount : Math.min(state.amount, a.max);
  return cap * a.rate / 100;
}
function eligible(a){ return a.countries.includes(state.country); }

function visible(){
  let list = DATA.accounts.filter(eligible);
  const f = state.filters;
  if (f.has("dgs")) list = list.filter(a => a.protection === "dgs");
  if (f.has("fixed")) list = list.filter(a => a.type === "fixed");
  if (f.has("instant")) list = list.filter(a => a.type === "instant");
  const by = {
    rate: (x,y) => y.rate - x.rate,
    interest: (x,y) => interest(y) - interest(x),
    min: (x,y) => (x.min||0) - (y.min||0)
  }[state.sort];
  return list.sort(by);
}

function card(a, i){
  const open = state.open === a.id;
  const termKeys = a.terms ? Object.keys(a.terms).map(Number).sort((p,q)=>p-q) : [];
  const termLabel = a.type === "fixed"
    ? (termKeys.length ? months(termKeys[termKeys.length-1]) : "Fixed")
    : "No lock-in";

  let detail = "";
  if (open){
    let termsTable = "";
    if (termKeys.length > 1){
      termsTable = '<table class="sc-terms"><thead><tr><th>Term</th><th class="sc-n">Rate</th>'
        + '<th class="sc-n">Interest on ' + eur(state.amount) + '</th></tr></thead><tbody>'
        + termKeys.map(m => {
            const r = a.terms[m];
            const cap = a.max == null ? state.amount : Math.min(state.amount, a.max);
            return "<tr><td>" + months(m) + '</td><td class="sc-n">' + pct(r)
              + '</td><td class="sc-n">' + eur2(cap * r/100 * m/12) + "</td></tr>";
          }).join("")
        + "</tbody></table>";
    }
    const kv = (k,v) => '<div class="sc-kv"><span>' + k + "</span><span>" + v + "</span></div>";
    const protLine = a.protection === "dgs"
      ? esc(a.protection_scheme) + " scheme, up to " + eur(a.protection_amount)
      : a.protection === "investor"
        ? esc(a.protection_scheme) + ", up to " + eur(a.protection_amount) + " — not a deposit guarantee"
        : "None. Capital at risk";
    detail = '<div class="sc-detail"><div class="sc-grid2"><div>'
      + (termsTable ? '<p class="sc-h">Rates by term</p>' + termsTable : '<p class="sc-h">Rate</p>'
          + kv("Current rate", pct(a.rate)) + (a.rate_note ? kv("Detail", esc(a.rate_note)) : ""))
      + '<p class="sc-h" style="margin-top:18px">Where it is offered</p>'
      + kv("Countries", a.countries.length + " of " + DATA.meta.eea.length + " EEA countries")
      + kv("How we know", esc(a.countries_source))
      + '</div><div><p class="sc-h">Conditions</p>'
      + kv("Type", TYPE[a.type])
      + kv("Protection", protLine)
      + kv("Minimum", a.min ? eur(a.min) + (a.min_note ? " — " + esc(a.min_note) : "") : "No minimum")
      + kv("Maximum", a.max ? eur(a.max) + (a.max_note ? " — " + esc(a.max_note) : "") : "No maximum")
      + kv("Interest paid", esc(a.paid))
      + (a.notes && a.notes.length ? '<ul class="sc-notes"><li>' + a.notes.map(esc).join("</li><li>") + "</li></ul>" : "")
      + '<a class="sc-src" href="' + esc(a.source_url) + '" target="_blank" rel="noopener nofollow">Where we checked this rate ↗</a>'
      + "</div></div></div>";
  }

  const minLabel = a.min ? eur(a.min) : "No minimum";
  const maxLabel = a.max ? "max " + eur(a.max) : "&nbsp;";

  return '<div class="sc-card' + (open ? " sc-open" : "") + '">'
    + '<div class="sc-row"><div class="sc-rank">' + (i+1) + "</div>"
    + '<div class="sc-who"><div class="sc-name">' + esc(a.provider) + "</div>"
    + '<div class="sc-prod">' + esc(a.product) + "</div>"
    + '<div class="sc-tags"><span class="sc-tag">' + TYPE[a.type] + "</span>"
    + (a.kind === "marketplace" ? '<span class="sc-tag">Marketplace</span>' : "") + "</div></div>"
    + '<div class="sc-kpis">'
    + '<div class="sc-kpi"><div class="sc-k">Rate</div><div class="sc-v">' + pct(a.rate) + "</div>"
    + '<div class="sc-s">' + (a.type === "fixed" ? "fixed" : "variable") + "</div></div>"
    + '<div class="sc-kpi"><div class="sc-k">Term</div><div class="sc-v sc-sm">' + termLabel + '</div><div class="sc-s">&nbsp;</div></div>'
    + '<div class="sc-kpi"><div class="sc-k">Interest, 1st year</div><div class="sc-v">' + eur2(interest(a)) + "</div>"
    + '<div class="sc-s">gross</div></div>'
    + '<div class="sc-kpi"><div class="sc-k">Minimum</div><div class="sc-v sc-sm">' + minLabel + "</div>"
    + '<div class="sc-s">' + maxLabel + "</div></div>"
    + "</div>"
    + '<div class="sc-cta"><a class="sc-btn" href="' + esc(a.url) + '" target="_blank" rel="noopener nofollow sponsored">Visit ' + esc(a.provider) + "</a>"
    + '<span class="sc-prot' + a.protection + '">' + PROT[a.protection]
    + (a.protection === "none" ? "" : " " + eur(a.protection_amount)) + "</span></div>"
    + "</div>"
    + detail
    + '<button class="sc-toggle" type="button" data-id="' + a.id + '">'
    + (open ? "Less detail" : (termKeys.length > 1 ? "See rates for other terms (" + (termKeys.length-1) + ")" : "See full details"))
    + '<svg class="sc-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'
    + "</button></div>";
}

function render(){
  const list = visible();
  host.querySelector("#eupf-count").textContent =
    list.length + (list.length === 1 ? " result" : " results");
  host.querySelector("#eupf-results").innerHTML = list.length
    ? '<div class="sc-cards">' + list.map(card).join("") + "</div>"
    : '<div class="sc-empty">Nothing on our list is open to residents of ' + esc(CN[state.country])
      + ". Try clearing a filter, or check the providers' own sites: availability changes often.</div>";

  const d = new Date(DATA.meta.verified + "T00:00:00Z");
  host.querySelector("#eupf-verified").textContent =
    "Rates checked on " + d.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})
    + " on each provider's own site.";
  host.querySelector("#eupf-foot").innerHTML =
    "Interest shown is gross, before tax, for the first year on the amount you entered, capped at each provider's limit. "
    + "Withholding on interest differs by country, so check your own rules. "
    + "Rates on instant-access accounts are variable and can change at any time; promotional rates run for a limited period. "
    + "A deposit guarantee protects your money if the bank fails, up to €100,000 per person per bank. "
    + "Investor compensation is a different, weaker protection, and money market funds carry no guarantee at all: your capital is at risk. "
    + "Always confirm on the provider's own site before opening an account.";
}

function init(){
  const sel = host.querySelector("#eupf-country");
  const served = new Set();
  DATA.accounts.forEach(a => a.countries.forEach(c => served.add(c)));
  sel.innerHTML = DATA.meta.eea.filter(c => served.has(c))
    .map(c => [c, CN[c]]).sort((a,b) => a[1].localeCompare(b[1]))
    .map(([c,n]) => '<option value="' + c + '"' + (c === state.country ? " selected" : "") + ">" + n + "</option>")
    .join("");

  sel.addEventListener("change", e => { state.country = e.target.value; state.open = null; render(); });

  const amt = host.querySelector("#eupf-amount");
  amt.addEventListener("input", e => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    state.amount = Math.min(Number(raw || 0), 10000000);
    const pos = e.target.selectionStart, before = e.target.value.length;
    e.target.value = state.amount ? state.amount.toLocaleString("en-GB") : "";
    const after = e.target.value.length;
    try { e.target.setSelectionRange(pos + (after - before), pos + (after - before)); } catch (err) {}
    render();
  });

  host.querySelector("#eupf-bar").addEventListener("click", e => {
    const b = e.target.closest("[data-f]");
    if (!b) return;
    const f = b.dataset.f;
    if (state.filters.has(f)) state.filters.delete(f); else state.filters.add(f);
    if (f === "fixed") state.filters.delete("instant");
    if (f === "instant") state.filters.delete("fixed");
    host.querySelectorAll("[data-f]").forEach(x =>
      x.setAttribute("aria-pressed", state.filters.has(x.dataset.f) ? "true" : "false"));
    state.open = null;
    render();
  });

  host.querySelector("#eupf-sort").addEventListener("change", e => { state.sort = e.target.value; render(); });

  host.querySelector("#eupf-results").addEventListener("click", e => {
    const t = e.target.closest("[data-id]");
    if (!t) return;
    state.open = state.open === t.dataset.id ? null : t.dataset.id;
    render();
  });

  render();
}
init();
})();
