/* Savings comparator - eupersonalfinance.eu
   Monta-se em #eupf-sc. Se esse elemento nao existir na pagina, e criado a seguir ao primeiro h1.
   Os dados vem de data/accounts.json e sao injetados por scripts/build.py. Nao editar a mao. */
(function(){
  var host = document.getElementById("eupf-sc");
  if (host && host.dataset.built) return;
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

const DATA = {"meta":{"verified":"2026-09-28","source_article":"https://www.eupersonalfinance.eu/articles/best-savings-accounts-europe","note":"Source of truth. Every rate confirmed on the provider's own site on the date in `verified`. Third-party comparison sites are used to find candidates only, never as the source of a rate.","cadence":"fortnightly: 1st and 16th","inclusion_rule":"EUR interest on cash for retail clients in the EEA. Each entry states its protection type: `dgs` (national deposit guarantee scheme), `investor` (investor compensation, not a deposit guarantee) or `none` (capital at risk). Countries are only listed where the provider itself publishes them.","eea":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"]},"accounts":[{"id":"trade-republic","provider":"Trade Republic","kind":"broker","product":"Interest on cash","type":"instant","rate":3.0,"rate_note":"3.00% for new clients; 2.50% standard","min":0,"max":50000,"max_note":"Unlimited balance earns interest on German, French and Italian IBANs; elsewhere capped at 50,000€","protection":"dgs","protection_scheme":"Germany","protection_amount":100000,"countries":["DE","AT","FR","ES","IT","NL","BE","LU","FI","IE","GR","PT","EE","LV","LT","SI","SK"],"countries_source":"official list","paid":"Daily accrual, paid monthly","url":"https://traderepublic.com/","source_url":"https://support.traderepublic.com/en-de/1533-What-do-I-need-to-know-about-interest","notes":["Cash sits in an omnibus account at partner banks and is covered by that bank's deposit guarantee scheme up to 100,000€.","In some countries part of the balance is placed in a money market fund rather than a bank deposit."]},{"id":"trading212-eu","provider":"Trading 212","kind":"broker","product":"Interest on cash (Trading 212 EU GmbH)","type":"instant","rate":4.2,"rate_note":"4.20% promotional for accounts opened 16 Sep to 2 Nov 2026, for 4 months; 2.80% standard afterwards","min":0,"max":null,"protection":"dgs","protection_scheme":"Germany","protection_amount":100000,"countries":["AT","DK","FI","FR","DE","IS","IE","LI","LU","NL","NO","PT","ES","SE"],"countries_source":"official list by legal entity","paid":"Accrued and paid daily","url":"https://www.trading212.com/","source_url":"https://helpcentre.trading212.com/hc/en-us/articles/12933782261917-What-are-the-supported-countries","notes":["Only for clients of Trading 212 EU GmbH, which is supervised by BaFin. Clients of the Cypriot entity get a different, weaker protection: see the separate entry.","If you switch interest on, part of your cash goes into qualifying money market funds, which are not covered by the deposit guarantee."]},{"id":"trading212-cy","provider":"Trading 212","kind":"broker","product":"Interest on cash (Trading 212 Markets Ltd)","type":"instant","rate":2.5,"rate_note":"AER, tracks the ECB deposit rate","min":0,"max":null,"protection":"investor","protection_scheme":"Cyprus ICF","protection_amount":20000,"countries":["BG","HR","CZ","EE","GR","HU","IT","LV","LT","MT","PL","CY","RO","SK","SI"],"countries_source":"official list by legal entity","paid":"Accrued and paid daily","url":"https://www.trading212.com/","source_url":"https://helpcentre.trading212.com/hc/en-us/articles/10745031931165-Trading-212-Markets-Ltd-Funds-and-assets-protection","notes":["This is investor compensation of up to 20,000€, not a deposit guarantee. It is not the 120,000 GBP FSCS cover, which applies only to UK clients.","The Cash ISA is a UK-only product and does not exist in the EU."]},{"id":"scalable-instant","provider":"Scalable Capital","kind":"broker","product":"Interest on cash","type":"instant","rate":2.6,"rate_note":"Variable, reviewed monthly, no balance cap","min":0,"max":null,"protection":"dgs","protection_scheme":"Germany","protection_amount":100000,"countries":["DE","AT","IT","ES","FR","NL"],"countries_source":"official list","paid":"Credited monthly","url":"https://de.scalable.capital/","source_url":"https://de.scalable.capital/tagesgeld","notes":["With PRIME+ the money is spread across up to five banks, so cover can reach 5 x 100,000€.","Without PRIME+ part of the balance may sit in money market funds instead of bank deposits, and that part has no deposit guarantee."]},{"id":"scalable-fixed","provider":"Scalable Capital","kind":"broker","product":"Fixed-term account","type":"fixed","rate":3.25,"terms":{"12":3.0,"24":3.25},"rate_note":"Rate locked for the whole term","min":1,"max":null,"protection":"dgs","protection_scheme":"Germany","protection_amount":100000,"countries":["DE"],"countries_source":"official page, Germany only","paid":"At maturity","url":"https://de.scalable.capital/festgeld","source_url":"https://de.scalable.capital/festgeld","notes":["Requires an existing Broker or Overnight account. Up to five fixed-term accounts per user.","Availability outside Germany is not published by Scalable Capital."]},{"id":"bunq-savings","provider":"bunq","kind":"bank","product":"Easy Savings","type":"instant","rate":3.01,"rate_note":"Base rate 1.51%; bonus rate 3.01% above your personal threshold. Both variable","min":0,"max":100000,"max_note":"No interest is paid on balances above 100,000€","protection":"dgs","protection_scheme":"Netherlands","protection_amount":100000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"rule: bunq accepts applications from EEA countries, no per-country list published","paid":"Compounded weekly","url":"https://www.bunq.com/","source_url":"https://help.bunq.com/articles/update-to-bonus-interest-rate","notes":["200,000€ of cover on a joint account."]},{"id":"bunq-term","provider":"bunq","kind":"bank","product":"Term Deposits","type":"fixed","rate":2.11,"terms":{"3":1.76,"6":1.86,"12":2.11,"24":1.91},"rate_note":"Rate guaranteed for the whole term","min":1000,"max":100000,"protection":"dgs","protection_scheme":"Netherlands","protection_amount":100000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"rule: EEA, no per-country list published","paid":"At maturity","url":"https://www.bunq.com/","source_url":"https://www.bunq.com/en-us/personal-account/banking-features/term-deposits","notes":["Leaving early costs 1% for each year still to run."]},{"id":"revolut-savings","provider":"Revolut","kind":"bank","product":"Instant Access Savings","type":"instant","rate":2.5,"rate_note":"1.00% to 2.50% depending on your plan. Variable","min":0,"max":5000000,"protection":"dgs","protection_scheme":"Lithuania","protection_amount":100000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"official list of supported countries","paid":"Paid daily","url":"https://www.revolut.com/","source_url":"https://www.revolut.com/en-LT/instant-access-savings/","notes":["Held at Revolut Bank UAB and covered by the Lithuanian deposit guarantee scheme.","The rate and the terms differ by country and by plan: check your own market before opening.","Revolut's Flexible Accounts are a different product: a money market fund with no deposit guarantee."]},{"id":"n26-savings","provider":"N26","kind":"bank","product":"Instant Savings","type":"instant","rate":1.5,"rate_note":"0.30% Standard and Smart, 0.50% Go, 1.50% Metal. Tracks the ECB rate","min":0,"max":null,"protection":"dgs","protection_scheme":"Germany","protection_amount":100000,"countries":["AT","NL","IE","PT","SI","GR","BE","FI","SK","LU","EE","LV","LT"],"countries_source":"official Instant Savings list","paid":"Credited monthly","url":"https://n26.com/","source_url":"https://support.n26.com/en-eu/app-and-features/savings-and-invest/n26-instant-savings-faq-rest-of-europe","notes":["N26 holds the money on its own balance sheet as a licensed bank, with no sweeping into funds or third parties.","N26's Flexible Cash Fund is a different product: a money market fund with no deposit guarantee."]},{"id":"lightyear-vaults","provider":"Lightyear","kind":"broker","product":"Savings Vaults","type":"mmf","rate":2.42,"rate_note":"APY, tracks the ECB overnight rate. Variable","min":1,"max":null,"protection":"investor","protection_scheme":"Estonia, investor protection","protection_amount":20000,"countries":["AT","BG","HR","CY","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","NO","PT","SK","SI","ES","SE"],"countries_source":"official list, minus Belgium where the funds are not offered","paid":"Accrued daily","url":"https://lightyear.com/","source_url":"https://lightyear.com/en-eu/vaults","notes":["This is a BlackRock money market fund, not a deposit. Capital is at risk and there is no deposit guarantee."]},{"id":"wise-interest","provider":"Wise","kind":"bank","product":"Interest","type":"mmf","rate":2.25,"rate_note":"Net of the 0.26% yearly cost. Variable","min":0,"max":null,"protection":"investor","protection_scheme":"Estonia, investor protection","protection_amount":20000,"countries":["AT","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"official list, minus Belgium and Liechtenstein where Interest is not offered","paid":"Accrued daily","url":"https://wise.com/","source_url":"https://wise.com/help/articles/4yTOVZoBSKOYyXrbnYRk5K/who-can-use-interest-and-stocks","notes":["This is a money market fund, not a deposit. Capital is at risk and there is no deposit guarantee.","The fund manager differs by country: BlackRock in most, J.P. Morgan in several central and eastern European markets."]},{"id":"ibkr-cash","provider":"Interactive Brokers","kind":"broker","product":"Interest on cash (IBKR Pro)","type":"instant","rate":1.931,"rate_note":"Benchmark minus 0.5%. Variable","min":10000,"min_note":"No interest on the first 10,000€","max":null,"protection":"investor","protection_scheme":"Ireland, investor compensation","protection_amount":20000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"official list of available countries","paid":"Accrued daily, paid monthly","url":"https://www.interactivebrokers.ie/","source_url":"https://www.interactivebrokers.ie/en/accounts/fees/pricing-interest-rates.php","notes":["Segregated client money, not a deposit in your name, so there is no deposit guarantee.","Accounts below 100,000 USD of net asset value get a proportionally reduced rate."]},{"id":"medirect-fixed","provider":"MeDirect","kind":"bank","product":"Fixed Term Deposit","type":"fixed","rate":2.4,"terms":{"3":1.0,"6":1.9,"12":2.35,"24":2.4},"rate_note":"Rate fixed for the term","min":100,"max":null,"protection":"dgs","protection_scheme":"Malta","protection_amount":100000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"rule: \"Be a resident of an EEA country, Switzerland, or the UK\"","paid":"At maturity","url":"https://www.medirect.com.mt/save/fixed-term-deposit/","source_url":"https://www.medirect.com.mt/wp-content/uploads/Retail-Banking-Interest-Rate-Sheet.pdf","notes":["One of only two banks found that state in writing they accept residents from across the EEA.","No early withdrawal."]},{"id":"bluor-fixed","provider":"BluOr Bank","kind":"bank","product":"Term deposit","type":"fixed","rate":2.5,"terms":{"3":1.75,"6":2.3,"12":2.5,"24":2.5},"rate_note":"Rate fixed for the term","min":500,"max":null,"protection":"dgs","protection_scheme":"Latvia","protection_amount":100000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"rule: \"service available to EU residents\"","paid":"At maturity","url":"https://www.bluorbank.lv/en/deposit","source_url":"https://www.bluorbank.lv/en/deposit","notes":["You can place the deposit remotely without opening a current account."]},{"id":"raisin","provider":"Raisin","kind":"marketplace","product":"Deposit marketplace","type":"fixed","rate":4.25,"rate_note":"Top rate on the German platform, at 120 months. Varies by market and partner bank","min":0,"max":null,"protection":"dgs","protection_scheme":"the partner bank's national scheme","protection_amount":100000,"countries":["DE","AT","NL","FR","ES","IE","FI","PL"],"countries_source":"official country selector, EU markets only","paid":"Depends on the partner bank","url":"https://www.raisin.com/","source_url":"https://www.raisin.com/en/select-country/","notes":["One sign-up gives access to term deposits at many banks across Europe, each covered by its own national scheme up to 100,000€.","Only open to tax residents of the markets where Raisin runs a platform. Portugal, Italy and Belgium are not among them."]},{"id":"bux-cash","provider":"BUX","kind":"broker","product":"Interest on cash","type":"instant","rate":2.0,"rate_note":"1.75% on BUX Plus, up to 2.00% on BUX Prime. Variable","min":0,"max":100000,"protection":"dgs","protection_scheme":"Netherlands","protection_amount":100000,"countries":["NL","BE","FR","DE","ES","IT","AT","IE"],"countries_source":"official list","paid":"Paid monthly","url":"https://bux.com/","source_url":"https://bux.com/interest-on-cash/","notes":["Cash is held at ABN AMRO Clearing Bank and covered by the Dutch scheme."]},{"id":"openbank-es","provider":"Openbank","kind":"bank","product":"Depósito Open 6 meses","type":"fixed","rate":2.75,"terms":{"6":2.75},"rate_note":"2.75% with a salary of 900€ a month paid in; 1.25% without","min":1,"max":null,"protection":"dgs","protection_scheme":"Spain","protection_amount":100000,"countries":["ES"],"countries_source":"Spanish site; Openbank publishes no cross-border residence list","paid":"At maturity","url":"https://www.openbank.es/deposito-a-plazo-fijo","source_url":"https://www.openbank.es/deposito-a-plazo-fijo","notes":["Early cancellation is paid at 0.20%."]},{"id":"bigbank-de","provider":"Bigbank","kind":"bank","product":"Festgeld","type":"fixed","rate":3.5,"terms":{"3":2.7,"6":3.0,"12":3.4,"24":3.5},"rate_note":"Rate fixed for the term","min":1000,"max":100000,"protection":"dgs","protection_scheme":"Estonia","protection_amount":100000,"countries":["DE"],"countries_source":"German market requires permanent residence in Germany; Bigbank runs separate markets in EE, LV, LT, FI, SE, BG, AT and NL","paid":"At maturity","url":"https://www.bigbank.de/festgeld/","source_url":"https://www.bigbank.de/festgeld/","notes":["Bigbank operates in nine markets and each one requires local residence, so the rate you get depends on where you live."]},{"id":"klarna-fixed","provider":"Klarna","kind":"bank","product":"Fixed-term savings account","type":"fixed","rate":3.24,"terms":{"3":1.84,"6":2.59,"9":2.46,"12":3.0,"18":3.11,"24":3.15,"36":3.19,"48":3.24},"rate_note":"Rate locked for the whole term. The same table is published in Portugal, Germany and Austria","min":0,"max":null,"protection":"dgs","protection_scheme":"Sweden","protection_amount":100000,"countries":["PT","DE","AT"],"countries_source":"fixed-savings page confirmed on Klarna's Portuguese, German and Austrian sites; Klarna publishes no list of markets for this product","paid":"At maturity; yearly for terms of 12 months or more","url":"https://www.klarna.com/","source_url":"https://www.klarna.com/de/klarna-festgeld/","notes":["Swedish bank. Deposits are covered by Sweden's guarantee scheme, stated in kronor, which is worth roughly 100,000€.","Klarna does not withhold tax at source, so you declare the interest yourself.","No minimum and no maximum. Early withdrawal only within 14 days of opening. Does not roll over.","Klarna says it runs savings in more European markets but does not publish the list, so this tool shows only the three where we could confirm the page."]}]};

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
    + '<span class="sc-prot sc-' + a.protection + '">' + PROT[a.protection]
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
