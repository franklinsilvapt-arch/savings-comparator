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

  var SRC = (document.currentScript && document.currentScript.src) || "";
  var LANG = (function(){
    var p = location.pathname;
    if (/^\/nl(\/|$)/.test(p)) return "nl";
    if (/^\/pl(\/|$)/.test(p)) return "pl";
    var l = (document.documentElement.lang || "").toLowerCase();
    if (l.indexOf("nl") === 0) return "nl";
    if (l.indexOf("pl") === 0) return "pl";
    return "en";
  })();
  var LOC = {en:"en-GB", nl:"nl-NL", pl:"pl-PL"}[LANG];
  function shell(){ host.innerHTML = `<div class="sc-wrap">
  <p class="sc-verified" id="eupf-verified"></p>

  <div class="sc-controls">
    <div class="sc-field">
      <label for="eupf-country">${T.liveIn}</label>
      <select class="sc-inp" id="eupf-country"></select>
    </div>
    <div class="sc-field">
      <label for="eupf-amount">${T.wantSave}</label>
      <div class="sc-amt">
        <span class="sc-cur">€</span>
        <input class="sc-inp" id="eupf-amount" type="text" inputmode="numeric" value="${(10000).toLocaleString(LOC)}">
      </div>
    </div>
  </div>

  <div class="sc-bar" id="eupf-bar">
    <button class="sc-chip" type="button" data-f="dgs" aria-pressed="false">${T.fDgs}</button>
    <button class="sc-chip" type="button" data-f="fixed" aria-pressed="false">${T.fFixed}</button>
    <button class="sc-chip" type="button" data-f="instant" aria-pressed="false">${T.fInstant}</button>
    <div class="sc-bar-end">
      <span class="sc-count" id="eupf-count"></span>
      <select class="sc-sort" id="eupf-sort" aria-label="${T.sortLabel}">
        <option value="rate">${T.sortRate}</option>
        <option value="interest">${T.sortInterest}</option>
        <option value="min">${T.sortMin}</option>
      </select>
    </div>
  </div>

  <div id="eupf-results"></div>

  <div class="sc-legend">
    <span><i class="sc-dot sc-dgs"></i> ${T.legDgs}</span>
    <span><i class="sc-dot sc-investor"></i> ${T.legInv}</span>
    <span><i class="sc-dot sc-none"></i> ${T.legNone}</span>
  </div>

  <p class="sc-foot" id="eupf-foot"></p>
</div>`; }

const DATA = {"meta":{"verified":"2026-10-02","source_article":"https://www.eupersonalfinance.eu/articles/best-savings-accounts-europe","note":"Source of truth. Every rate confirmed on the provider's own site on the date in `verified`. Third-party comparison sites are used to find candidates only, never as the source of a rate.","cadence":"fortnightly: 1st and 16th","inclusion_rule":"EUR interest on cash for retail clients in the EEA. Each entry states its protection type: `dgs` (national deposit guarantee scheme), `investor` (investor compensation, not a deposit guarantee) or `none` (capital at risk). Countries are only listed where the provider itself publishes them.","eea":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"]},"accounts":[{"id":"trade-republic","provider":"Trade Republic","kind":"broker","product":"Interest on cash","type":"instant","rate":3.0,"rate_note":"3.00% for new clients; 2.50% standard","min":0,"max":50000,"max_note":"Unlimited balance earns interest on German, French and Italian IBANs; elsewhere capped at 50,000€","protection":"dgs","protection_scheme":"Germany","protection_amount":100000,"countries":["DE","AT","FR","ES","IT","NL","BE","LU","FI","IE","GR","PT","EE","LV","LT","SI","SK"],"countries_source":"official list","paid":"Daily accrual, paid monthly","url":"https://traderepublic.com/","source_url":"https://support.traderepublic.com/en-de/1533-What-do-I-need-to-know-about-interest","notes":["Cash sits in an omnibus account at partner banks and is covered by that bank's deposit guarantee scheme up to 100,000€.","In some countries part of the balance is placed in a money market fund rather than a bank deposit."]},{"id":"trading212-eu","provider":"Trading 212","kind":"broker","product":"Interest on cash (Trading 212 EU GmbH)","type":"instant","rate":4.2,"rate_note":"4.20% promotional for accounts opened 16 Sep to 2 Nov 2026, for 4 months; 2.80% standard afterwards","min":0,"max":null,"protection":"dgs","protection_scheme":"Germany","protection_amount":100000,"countries":["AT","DK","FI","FR","DE","IS","IE","LI","LU","NL","NO","PT","ES","SE"],"countries_source":"official list by legal entity","paid":"Accrued and paid daily","url":"https://www.trading212.com/","source_url":"https://helpcentre.trading212.com/hc/en-us/articles/12933782261917-What-are-the-supported-countries","notes":["Only for clients of Trading 212 EU GmbH, which is supervised by BaFin. Clients of the Cypriot entity get a different, weaker protection: see the separate entry.","If you switch interest on, part of your cash goes into qualifying money market funds, which are not covered by the deposit guarantee.","Promotional terms confirmed on 2026-10-02 in Trading 212's own Invest Promo Rate Terms: campaign period 16 September to 2 November 2026, ECB deposit facility rate plus 1.70 percentage points, for four months. With the ECB at 2.50% that is 4.20%."]},{"id":"trading212-cy","provider":"Trading 212","kind":"broker","product":"Interest on cash (Trading 212 Markets Ltd)","type":"instant","rate":2.5,"rate_note":"AER, tracks the ECB deposit rate","min":0,"max":null,"protection":"investor","protection_scheme":"Cyprus ICF","protection_amount":20000,"countries":["BG","HR","CZ","EE","GR","HU","IT","LV","LT","MT","PL","CY","RO","SK","SI"],"countries_source":"official list by legal entity","paid":"Accrued and paid daily","url":"https://www.trading212.com/","source_url":"https://helpcentre.trading212.com/hc/en-us/articles/10745031931165-Trading-212-Markets-Ltd-Funds-and-assets-protection","notes":["This is investor compensation of up to 20,000€, not a deposit guarantee. It is not the 120,000 GBP FSCS cover, which applies only to UK clients.","The Cash ISA is a UK-only product and does not exist in the EU."]},{"id":"scalable-instant","provider":"Scalable Capital","kind":"broker","product":"Interest on cash","type":"instant","rate":2.6,"rate_note":"Variable, reviewed monthly, no balance cap","min":0,"max":null,"protection":"dgs","protection_scheme":"Germany","protection_amount":100000,"countries":["DE","AT","IT","ES","FR","NL"],"countries_source":"official list","paid":"Credited monthly","url":"https://de.scalable.capital/","source_url":"https://de.scalable.capital/tagesgeld","notes":["With PRIME+ the money is spread across up to five banks, so cover can reach 5 x 100,000€.","Without PRIME+ part of the balance may sit in money market funds instead of bank deposits, and that part has no deposit guarantee."]},{"id":"scalable-fixed","provider":"Scalable Capital","kind":"broker","product":"Fixed-term account","type":"fixed","rate":3.25,"terms":{"12":3.0,"24":3.25},"rate_note":"Rate locked for the whole term","min":1,"max":null,"protection":"dgs","protection_scheme":"Germany","protection_amount":100000,"countries":["DE"],"countries_source":"official page, Germany only","paid":"At maturity","url":"https://de.scalable.capital/festgeld","source_url":"https://de.scalable.capital/festgeld","notes":["Requires an existing Broker or Overnight account. Up to five fixed-term accounts per user.","Availability outside Germany is not published by Scalable Capital."]},{"id":"bunq-savings","provider":"bunq","kind":"bank","product":"Easy Savings","type":"instant","rate":3.01,"rate_note":"Base rate 1.51%; bonus rate 3.01% above your personal threshold. Both variable","min":0,"max":100000,"max_note":"No interest is paid on balances above 100,000€","protection":"dgs","protection_scheme":"Netherlands","protection_amount":100000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"rule: bunq accepts applications from EEA countries, no per-country list published","paid":"Compounded weekly","url":"https://www.bunq.com/","source_url":"https://help.bunq.com/articles/update-to-bonus-interest-rate","notes":["200,000€ of cover on a joint account."]},{"id":"bunq-term","provider":"bunq","kind":"bank","product":"Term Deposits","type":"fixed","rate":2.11,"terms":{"3":1.76,"6":1.86,"12":2.11,"24":1.91},"rate_note":"Rate guaranteed for the whole term","min":1000,"max":100000,"protection":"dgs","protection_scheme":"Netherlands","protection_amount":100000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"rule: EEA, no per-country list published","paid":"At maturity","url":"https://www.bunq.com/","source_url":"https://www.bunq.com/en-us/personal-account/banking-features/term-deposits","notes":["Leaving early costs 1% for each year still to run."]},{"id":"revolut-savings","provider":"Revolut","kind":"bank","product":"Instant Access Savings","type":"instant","rate":2.5,"rate_note":"1.00% to 2.50% depending on your plan. Variable","min":0,"max":5000000,"protection":"dgs","protection_scheme":"Lithuania","protection_amount":100000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"official list of supported countries","paid":"Paid daily","url":"https://www.revolut.com/","source_url":"https://www.revolut.com/en-LT/instant-access-savings/","notes":["Held at Revolut Bank UAB and covered by the Lithuanian deposit guarantee scheme.","The rate and the terms differ by country and by plan: check your own market before opening.","Revolut's Flexible Accounts are a different product: a money market fund with no deposit guarantee."]},{"id":"n26-savings","provider":"N26","kind":"bank","product":"Instant Savings","type":"instant","rate":1.5,"rate_note":"0.30% Standard and Smart, 0.50% Go, 1.50% Metal. Tracks the ECB rate","min":0,"max":null,"protection":"dgs","protection_scheme":"Germany","protection_amount":100000,"countries":["AT","NL","IE","PT","SI","GR","BE","FI","SK","LU","EE","LV","LT"],"countries_source":"official Instant Savings list","paid":"Credited monthly","url":"https://n26.com/","source_url":"https://support.n26.com/en-eu/app-and-features/savings-and-invest/n26-instant-savings-faq-rest-of-europe","notes":["N26 holds the money on its own balance sheet as a licensed bank, with no sweeping into funds or third parties.","N26's Flexible Cash Fund is a different product: a money market fund with no deposit guarantee."]},{"id":"lightyear-vaults","provider":"Lightyear","kind":"broker","product":"Savings Vaults","type":"mmf","rate":2.47,"rate_note":"APY, tracks the ECB overnight rate. Variable","min":1,"max":null,"protection":"investor","protection_scheme":"Estonia, investor protection","protection_amount":20000,"countries":["AT","BG","HR","CY","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","NO","PT","SK","SI","ES","SE"],"countries_source":"official list, minus Belgium where the funds are not offered","paid":"Accrued daily","url":"https://lightyear.com/","source_url":"https://lightyear.com/en-eu/vaults","notes":["This is a BlackRock money market fund, not a deposit. Capital is at risk and there is no deposit guarantee."]},{"id":"wise-interest","provider":"Wise","kind":"bank","product":"Interest","type":"mmf","rate":2.25,"rate_note":"Net of the 0.26% yearly cost. Variable","min":0,"max":null,"protection":"investor","protection_scheme":"Estonia, investor protection","protection_amount":20000,"countries":["AT","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"official list, minus Belgium and Liechtenstein where Interest is not offered","paid":"Accrued daily","url":"https://wise.com/","source_url":"https://wise.com/help/articles/4yTOVZoBSKOYyXrbnYRk5K/who-can-use-interest-and-stocks","notes":["This is a money market fund, not a deposit. Capital is at risk and there is no deposit guarantee.","The fund manager differs by country: BlackRock in most, J.P. Morgan in several central and eastern European markets."]},{"id":"ibkr-cash","provider":"Interactive Brokers","kind":"broker","product":"Interest on cash (IBKR Pro)","type":"instant","rate":1.273,"rate_note":"Benchmark minus 0.5%. Variable","min":10000,"min_note":"No interest on the first 10,000€","max":null,"protection":"investor","protection_scheme":"Ireland, investor compensation","protection_amount":20000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"official list of available countries","paid":"Accrued daily, paid monthly","url":"https://www.interactivebrokers.ie/","source_url":"https://www.interactivebrokers.ie/en/accounts/fees/pricing-interest-rates.php","notes":["Segregated client money, not a deposit in your name, so there is no deposit guarantee.","Accounts below 100,000 USD of net asset value get a proportionally reduced rate."]},{"id":"medirect-fixed","provider":"MeDirect","kind":"bank","product":"Fixed Term Deposit","type":"fixed","rate":2.4,"terms":{"3":1.0,"6":1.9,"12":2.35,"24":2.4},"rate_note":"Rate fixed for the term","min":100,"max":null,"protection":"dgs","protection_scheme":"Malta","protection_amount":100000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"rule: \"Be a resident of an EEA country, Switzerland, or the UK\"","paid":"At maturity","url":"https://www.medirect.com.mt/save/fixed-term-deposit/","source_url":"https://www.medirect.com.mt/wp-content/uploads/Retail-Banking-Interest-Rate-Sheet.pdf","notes":["One of only two banks found that state in writing they accept residents from across the EEA.","No early withdrawal."]},{"id":"bluor-fixed","provider":"BluOr Bank","kind":"bank","product":"Term deposit","type":"fixed","rate":2.5,"terms":{"3":1.75,"6":2.3,"12":2.5,"24":2.5},"rate_note":"Rate fixed for the term","min":500,"max":null,"protection":"dgs","protection_scheme":"Latvia","protection_amount":100000,"countries":["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"],"countries_source":"rule: \"service available to EU residents\"","paid":"At maturity","url":"https://www.bluorbank.lv/en/deposit","source_url":"https://www.bluorbank.lv/en/deposit","notes":["You can place the deposit remotely without opening a current account."]},{"id":"raisin","provider":"Raisin","kind":"marketplace","product":"Deposit marketplace","type":"fixed","rate":4.25,"rate_note":"Top rate on the German platform, at 120 months. Varies by market and partner bank","min":0,"max":null,"protection":"dgs","protection_scheme":"the partner bank's national scheme","protection_amount":100000,"countries":["DE","AT","NL","FR","ES","IE","FI","PL"],"countries_source":"official country selector, EU markets only","paid":"Depends on the partner bank","url":"https://www.raisin.com/","source_url":"https://www.raisin.com/en/select-country/","notes":["One sign-up gives access to term deposits at many banks across Europe, each covered by its own national scheme up to 100,000€.","Only open to tax residents of the markets where Raisin runs a platform. Portugal, Italy and Belgium are not among them."]},{"id":"bux-cash","provider":"BUX","kind":"broker","product":"Interest on cash","type":"instant","rate":2.0,"rate_note":"2.00% on BUX Prime and 1.75% on BUX Plus. BUX basic pays nothing","min":0,"max":100000,"max_note":"Above 100,000€ BUX Prime pays 1.65% and BUX Plus pays 0%","protection":"dgs","protection_scheme":"Netherlands","protection_amount":100000,"countries":["NL","BE","FR","DE","ES","IT","AT","IE"],"countries_source":"official list","paid":"Paid monthly","url":"https://bux.com/","source_url":"https://bux.com/interest-on-cash/","notes":["Cash is held at ABN AMRO Clearing Bank and covered by the Dutch scheme."]},{"id":"openbank-es","provider":"Openbank","kind":"bank","product":"Depósito Open 6 meses","type":"fixed","rate":2.75,"terms":{"6":2.75},"rate_note":"2.75% with a salary of 900€ a month paid in; 1.25% without","min":1,"max":null,"protection":"dgs","protection_scheme":"Spain","protection_amount":100000,"countries":["ES"],"countries_source":"Spanish site; Openbank publishes no cross-border residence list","paid":"At maturity","url":"https://www.openbank.es/deposito-a-plazo-fijo","source_url":"https://www.openbank.es/deposito-a-plazo-fijo","notes":["Early cancellation is paid at 0.20%."]},{"id":"bigbank-de","provider":"Bigbank","kind":"bank","product":"Festgeld","type":"fixed","rate":3.5,"terms":{"3":2.7,"6":3.0,"12":3.4,"24":3.5},"rate_note":"Rate fixed for the term","min":1000,"max":100000,"protection":"dgs","protection_scheme":"Estonia","protection_amount":100000,"countries":["DE"],"countries_source":"German market requires permanent residence in Germany; Bigbank runs separate markets in EE, LV, LT, FI, SE, BG, AT and NL","paid":"At maturity","url":"https://www.bigbank.de/festgeld/","source_url":"https://www.bigbank.de/festgeld/","notes":["Bigbank operates in nine markets and each one requires local residence, so the rate you get depends on where you live."]},{"id":"klarna-fixed","provider":"Klarna","kind":"bank","product":"Fixed-term savings account","type":"fixed","rate":3.24,"terms":{"3":1.84,"6":2.59,"9":2.46,"12":3.0,"18":3.11,"24":3.15,"36":3.19,"48":3.24},"rate_note":"Rate locked for the whole term. This is the Portuguese table","min":0,"max":null,"protection":"dgs","protection_scheme":"Sweden","protection_amount":100000,"countries":["PT"],"countries_source":"Portuguese savings page. Klarna also runs this product in Germany with a different and shorter table, so the German and Austrian markets are not covered by this entry","paid":"At maturity; yearly for terms of 12 months or more","url":"https://www.klarna.com/pt/conta-poupanca/","source_url":"https://www.klarna.com/pt/conta-poupanca/","notes":["Swedish bank. Deposits are covered by Sweden's guarantee scheme, stated in kronor, which is worth roughly 100,000€.","Klarna does not withhold tax at source, so you declare the interest yourself.","No minimum and no maximum. Early withdrawal only within 14 days of opening. Does not roll over.","The German page publishes five terms at different rates (6 months 1.65%, 12 months 2.76%, 24 and 36 months 2.67%, 48 months 2.82%), so it is a separate market and is not represented here."]}]};

const CN = {AT:"Austria",BE:"Belgium",BG:"Bulgaria",HR:"Croatia",CY:"Cyprus",CZ:"Czechia",DK:"Denmark",
EE:"Estonia",FI:"Finland",FR:"France",DE:"Germany",GR:"Greece",HU:"Hungary",IS:"Iceland",IE:"Ireland",
IT:"Italy",LV:"Latvia",LI:"Liechtenstein",LT:"Lithuania",LU:"Luxembourg",MT:"Malta",NL:"Netherlands",
NO:"Norway",PL:"Poland",PT:"Portugal",RO:"Romania",SK:"Slovakia",SI:"Slovenia",ES:"Spain",SE:"Sweden"};

const LOGO = {
"trade-republic":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abacb1254941d0915568be9_logo-trade-republic.png",
"trading212-eu":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa075fc792ee729382296_logo-trading212.png",
"trading212-cy":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa075fc792ee729382296_logo-trading212.png",
"scalable-instant":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa07aa3abd369895dfd60_logo-scalable-capital.png",
"scalable-fixed":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa07aa3abd369895dfd60_logo-scalable-capital.png",
"bunq-savings":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa0881caa3a3d390c4291_logo-bunq.png",
"bunq-term":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa0881caa3a3d390c4291_logo-bunq.png",
"revolut-savings":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa08d2b1c712b5c1882c6_logo-revolut.png",
"n26-savings":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abacb0367b849937c128e72_logo-n26.png",
"lightyear-vaults":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa09373d0a98ce68dec40_logo-lightyear.png",
"wise-interest":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa095d4237aefb4df878f_logo-wise.png",
"ibkr-cash":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa0b0d64c0b19d90acc6f_logo-interactive-brokers.png",
"medirect-fixed":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abacb0fb82b220bd4d2be89_logo-medirect.png",
"bluor-fixed":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa0b4671568efde374863_logo-bluor-bank.png",
"raisin":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abacb1d5c30d1de89b2ed60_logo-raisin.png",
"bux-cash":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa0b8128777da2039054b_logo-bux.png",
"openbank-es":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abacb2706972d08697df423_logo-openbank.png",
"bigbank-de":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa0bc7b694573d575667b_logo-bigbank.png",
"klarna-fixed":"https://cdn.prod.website-files.com/67b3586be7527f75ff1f014c/6abaa0c27cca13164b1a8ac6_logo-klarna.png"};

const AFF = {
"trade-republic":"https://www.eupersonalfinance.eu/visit/trade-republic",
"trading212-eu":"https://www.eupersonalfinance.eu/visit/trading212",
"trading212-cy":"https://www.eupersonalfinance.eu/visit/trading212",
"scalable-instant":"https://partner.scalable-capital.de/go.cgi?pid=312&wmid=349&cpid=7&prid=32&subid=&target=Broker-Online",
"scalable-fixed":"https://partner.scalable-capital.de/go.cgi?pid=312&wmid=349&cpid=7&prid=32&subid=&target=Broker-Online",
"revolut-savings":"https://revolut.ngih.net/mOAZg7",
"n26-savings":"https://n26-eu.c2nwa3.net/jRBRGb",
"lightyear-vaults":"https://www.eupersonalfinance.eu/visit/lightyear",
"wise-interest":"https://www.eupersonalfinance.eu/visit/wise",
"ibkr-cash":"https://www.interactivebrokers.ie/mkt/?src=iitww1&url=%2Fen%2Fwhyib%2Foverview.php"};

const OFFER = {
"trading212-eu":{t:"Free fractional share worth up to €100",c:"IITW",a:"/articles/trading-212-promo-code"},
"trading212-cy":{t:"Free fractional share worth up to €100",c:"IITW",a:"/articles/trading-212-promo-code"},
"revolut-savings":{t:"€10 to €30 in welcome rewards",a:"/articles/revolut-welcome-promo-bonus"},
"n26-savings":{t:"Up to €35 welcome bonus",c:"nunodanm36988c",a:"/articles/n26-promo-code"},
"lightyear-vaults":{t:"Free fractional share worth up to €100",c:"INVESTINGINTHEWEB",a:"/articles/lightyear-promo-code"}};

const STR = {
en:{liveIn:"I live in",wantSave:"I want to save",fDgs:"Deposit guarantee only",fFixed:"Fixed term",fInstant:"Instant access",
sortLabel:"Sort by",sortRate:"Highest rate",sortInterest:"Most interest on your amount",sortMin:"Lowest minimum",
legDgs:"National deposit guarantee scheme, limits and conditions vary",legInv:"Investor compensation, not a deposit guarantee",legNone:"No protection, capital at risk",
checked1:"Rates checked on ",checked2:" on each provider's own site.",
typeInstant:"Instant access",typeFixed:"Fixed term",typeMmf:"Money market fund",
protDgs:"Deposit guarantee scheme",protInv:"Investor compensation, not a deposit",protNone:"No protection, capital at risk",
kRate:"Rate",kTerm:"Term",kInt:"Interest, 1st year",kMin:"Minimum",gross:"gross",variable:"variable",fixedTxt:"fixed",noLock:"No lock-in",
noMin:"No minimum",noMax:"No maximum",maxPre:"max ",visit:"Visit ",marketplace:"Marketplace",
offerBadge:"Sign-up offer",useCode:"Use code",howItWorks:"How it works",
ratesByTerm:"Rates by term",interestOn:"Interest on ",whereOffered:"Where it is offered",countries:"Countries",ofEea:" of ",eeaCountries:" EEA countries",
howWeKnow:"How we know",conditions:"Conditions",kType:"Type",kProt:"Protection",kMax:"Maximum",kPaid:"Interest paid",
srcLink:"Where we checked this rate ↗",currentRate:"Current rate",detail:"Detail",
schemePre:"",schemeMid:". Statutory limit ",perPerson:" per person, per bank",investorUpTo:", up to ",notDeposit:", not a deposit guarantee",protNoneLine:"None. Capital at risk",
less:"Less detail",seeTerms1:"See rates for other terms (",seeTerms2:")",seeFull:"See full details",
empty1:"Nothing on our list is open to residents of ",empty2:". Try clearing a filter, or check the providers' own sites: availability changes often.",
footLinks:'<a href="/articles/best-savings-accounts-europe">Read the full write-up on these accounts</a>, or work out the interest on a single deposit with the <a href="/term-deposit-calculator">term deposit calculator</a>.',
foot:"Interest shown is gross, before tax, for the first year on the amount you entered, capped at each provider's limit. "
    + "Withholding on interest differs by country, so check your own rules. "
    + "Rates on instant-access accounts are variable and can change at any time; promotional rates run for a limited period. "
    + "A deposit guarantee protects your money if the bank fails, up to €100,000 per person per bank. "
    + "Investor compensation is a different, weaker protection, and money market funds carry no guarantee at all: your capital is at risk. "
    + "Always confirm on the provider's own site before opening an account. "},
nl:{liveIn:"Ik woon in",wantSave:"Ik wil sparen",fDgs:"Alleen met depositogarantie",fFixed:"Vaste looptijd",fInstant:"Direct opneembaar",
sortLabel:"Sorteren op",sortRate:"Hoogste rente",sortInterest:"Meeste rente op jouw bedrag",sortMin:"Laagste minimum",
legDgs:"Nationaal depositogarantiestelsel, limieten en voorwaarden verschillen",legInv:"Beleggerscompensatie, geen depositogarantie",legNone:"Geen bescherming, risico op verlies",
checked1:"Rentes gecontroleerd op ",checked2:" op de eigen site van elke aanbieder.",
typeInstant:"Direct opneembaar",typeFixed:"Vaste looptijd",typeMmf:"Geldmarktfonds",
protDgs:"Depositogarantiestelsel",protInv:"Beleggerscompensatie, geen deposito",protNone:"Geen bescherming, risico op verlies",
kRate:"Rente",kTerm:"Looptijd",kInt:"Rente, 1e jaar",kMin:"Minimum",gross:"bruto",variable:"variabel",fixedTxt:"vast",noLock:"Vrij opneembaar",
noMin:"Geen minimum",noMax:"Geen maximum",maxPre:"max. ",visit:"Naar ",marketplace:"Marktplaats",
offerBadge:"Welkomstbonus",useCode:"Gebruik code",howItWorks:"Hoe het werkt",
ratesByTerm:"Rente per looptijd",interestOn:"Rente op ",whereOffered:"Waar het wordt aangeboden",countries:"Landen",ofEea:" van ",eeaCountries:" EER-landen",
howWeKnow:"Hoe we dit weten",conditions:"Voorwaarden",kType:"Soort",kProt:"Bescherming",kMax:"Maximum",kPaid:"Rente uitbetaald",
srcLink:"Waar we deze rente hebben gecontroleerd ↗",currentRate:"Huidige rente",detail:"Toelichting",
schemePre:"Stelsel van ",schemeMid:". Wettelijke limiet ",perPerson:" per persoon, per bank",investorUpTo:", tot ",notDeposit:", geen depositogarantie",protNoneLine:"Geen. Risico op verlies",
less:"Minder details",seeTerms1:"Bekijk rentes voor andere looptijden (",seeTerms2:")",seeFull:"Bekijk alle details",
empty1:"Niets op onze lijst staat open voor inwoners van ",empty2:". Wis een filter, of kijk op de sites van de aanbieders zelf: het aanbod verandert vaak.",
footLinks:'<a href="/articles/best-savings-accounts-europe">Lees de volledige analyse van deze rekeningen</a>, of reken de rente op een enkele inleg uit met de <a href="/term-deposit-calculator">depositocalculator</a>.',
foot:"De getoonde rente is bruto, vóór belasting, over het eerste jaar op het bedrag dat je invult, tot de limiet van elke aanbieder. "
+ "Hoe rente wordt belast verschilt per land, dus kijk naar je eigen regels. "
+ "Rentes op direct opneembare rekeningen zijn variabel en kunnen op elk moment veranderen. Actietarieven lopen een beperkte periode. "
+ "Een depositogarantie beschermt je geld als de bank omvalt, tot €100.000 per persoon per bank. "
+ "Beleggerscompensatie is een andere, zwakkere bescherming, en geldmarktfondsen hebben helemaal geen garantie: je loopt risico op verlies. "
+ "Controleer altijd de site van de aanbieder zelf voordat je een rekening opent. "},
pl:{liveIn:"Mieszkam w",wantSave:"Chcę oszczędzać",fDgs:"Tylko z gwarancją depozytów",fFixed:"Lokata terminowa",fInstant:"Dostęp natychmiastowy",
sortLabel:"Sortuj według",sortRate:"Najwyższe oprocentowanie",sortInterest:"Najwyższe odsetki od Twojej kwoty",sortMin:"Najniższa kwota minimalna",
legDgs:"Krajowy system gwarantowania depozytów, limity i warunki się różnią",legInv:"Rekompensata dla inwestorów, a nie gwarancja depozytów",legNone:"Brak ochrony, ryzyko utraty kapitału",
checked1:"Oprocentowanie sprawdzone ",checked2:" na stronach samych dostawców.",
typeInstant:"Dostęp natychmiastowy",typeFixed:"Lokata terminowa",typeMmf:"Fundusz rynku pieniężnego",
protDgs:"System gwarantowania depozytów",protInv:"Rekompensata dla inwestorów, nie depozyt",protNone:"Brak ochrony, ryzyko utraty kapitału",
kRate:"Oprocentowanie",kTerm:"Okres",kInt:"Odsetki, 1. rok",kMin:"Minimum",gross:"brutto",variable:"zmienne",fixedTxt:"stałe",noLock:"Bez blokady",
noMin:"Bez minimum",noMax:"Bez maksimum",maxPre:"maks. ",visit:"Przejdź do ",marketplace:"Platforma",
offerBadge:"Bonus powitalny",useCode:"Użyj kodu",howItWorks:"Jak to działa",
ratesByTerm:"Oprocentowanie według okresu",interestOn:"Odsetki od ",whereOffered:"Gdzie jest dostępne",countries:"Kraje",ofEea:" z ",eeaCountries:" krajów EOG",
howWeKnow:"Skąd to wiemy",conditions:"Warunki",kType:"Rodzaj",kProt:"Ochrona",kMax:"Maksimum",kPaid:"Wypłata odsetek",
srcLink:"Gdzie sprawdziliśmy to oprocentowanie ↗",currentRate:"Aktualne oprocentowanie",detail:"Szczegóły",
schemePre:"System gwarancji: ",schemeMid:". Ustawowy limit ",perPerson:" na osobę, na bank",investorUpTo:", do ",notDeposit:", to nie jest gwarancja depozytów",protNoneLine:"Brak. Ryzyko utraty kapitału",
less:"Mniej szczegółów",seeTerms1:"Zobacz oprocentowanie dla innych okresów (",seeTerms2:")",seeFull:"Zobacz pełne szczegóły",
empty1:"Nic z naszej listy nie jest dostępne dla mieszkańców kraju: ",empty2:". Wyczyść filtr lub sprawdź strony samych dostawców: dostępność często się zmienia.",
footLinks:'<a href="/articles/best-savings-accounts-europe">Przeczytaj pełną analizę tych kont</a> lub oblicz odsetki od pojedynczej wpłaty w <a href="/term-deposit-calculator">kalkulatorze lokat</a>.',
foot:"Pokazane oprocentowanie jest brutto, przed opodatkowaniem, za pierwszy rok od wpisanej kwoty, do limitu każdego dostawcy. "
+ "Opodatkowanie odsetek różni się w zależności od kraju, więc sprawdź własne przepisy. "
+ "Oprocentowanie kont z dostępem natychmiastowym jest zmienne i może się zmienić w każdej chwili. Stawki promocyjne obowiązują przez ograniczony czas. "
+ "Gwarancja depozytów chroni Twoje pieniądze w razie upadłości banku, do €100 000 na osobę i na bank. "
+ "Rekompensata dla inwestorów to inna, słabsza ochrona, a fundusze rynku pieniężnego nie mają żadnej gwarancji: ryzykujesz utratę kapitału. "
+ "Zawsze potwierdź na stronie samego dostawcy, zanim otworzysz konto. "}
};
const T = STR[LANG] || STR.en;

function nResults(n){
  if (LANG === "nl") return n + (n === 1 ? " resultaat" : " resultaten");
  if (LANG === "pl"){
    var d = n % 10, h = n % 100;
    if (n === 1) return n + " wynik";
    if (d >= 2 && d <= 4 && !(h >= 12 && h <= 14)) return n + " wyniki";
    return n + " wyników";
  }
  return n + (n === 1 ? " result" : " results");
}

const TYPE = {instant:T.typeInstant, fixed:T.typeFixed, mmf:T.typeMmf};
const PROTSHORT = {dgs:T.protDgs, investor:T.protInv, none:T.protNone};

const TZ = {"Europe/Lisbon":"PT","Atlantic/Madeira":"PT","Atlantic/Azores":"PT",
"Europe/Madrid":"ES","Atlantic/Canary":"ES","Europe/Berlin":"DE","Europe/Busingen":"DE",
"Europe/Vienna":"AT","Europe/Paris":"FR","Europe/Rome":"IT","Europe/Amsterdam":"NL",
"Europe/Brussels":"BE","Europe/Dublin":"IE","Europe/Helsinki":"FI","Europe/Stockholm":"SE",
"Europe/Oslo":"NO","Europe/Copenhagen":"DK","Europe/Warsaw":"PL","Europe/Prague":"CZ",
"Europe/Budapest":"HU","Europe/Bucharest":"RO","Europe/Sofia":"BG","Europe/Athens":"GR",
"Europe/Zagreb":"HR","Europe/Ljubljana":"SI","Europe/Bratislava":"SK","Europe/Tallinn":"EE",
"Europe/Riga":"LV","Europe/Vilnius":"LT","Europe/Luxembourg":"LU","Europe/Malta":"MT",
"Europe/Nicosia":"CY","Asia/Nicosia":"CY","Atlantic/Reykjavik":"IS","Europe/Vaduz":"LI"};

function guessCountry(){
  /* A country page can pin the list with data-country on the mount div. */
  try {
    const el = document.getElementById("eupf-sc");
    const fixed = el && (el.getAttribute("data-country") || "").toUpperCase();
    if (fixed && CN[fixed]) return fixed;
  } catch (e) {}
  try {
    const saved = localStorage.getItem("eupf-sc-country");
    if (saved && CN[saved]) return saved;
  } catch (e) {}
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TZ[tz]) return TZ[tz];
  } catch (e) {}
  try {
    const langs = [navigator.language].concat(navigator.languages || []);
    for (const l of langs) {
      const m = /-([A-Z]{2})$/.exec(l || "");
      if (m && CN[m[1]]) return m[1];
    }
  } catch (e) {}
  return "DE";
}

const state = {country:guessCountry(), amount:10000, filters:new Set(), sort:"rate", open:null};

const ini = n => { const p = String(n).trim().split(/\s+/);
  return (p.length > 1 ? p[0][0] + p[1][0] : String(n).slice(0,2)).toUpperCase(); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const eur = n => "€" + Math.round(n).toLocaleString(LOC);
const eur2 = n => "€" + n.toLocaleString(LOC,{minimumFractionDigits:2,maximumFractionDigits:2});
const pct = n => n.toLocaleString(LOC,{minimumFractionDigits:2,maximumFractionDigits:2}) + "%";
const months = m => {
  const y = m / 12;
  if (Number.isInteger(y)) {
    if (LANG === "nl") return y + " jaar";
    if (LANG === "pl") return y === 1 ? "1 rok" : (y >= 2 && y <= 4 ? y + " lata" : y + " lat");
    return y === 1 ? "1 year" : y + " years";
  }
  if (LANG === "nl") return m + " maanden";
  if (LANG === "pl") { const d = m % 10, h = m % 100;
    return m + ((d >= 2 && d <= 4 && !(h >= 12 && h <= 14)) ? " miesiące" : " miesięcy"); }
  return m + " months";
};

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
    ? (termKeys.length ? months(termKeys[termKeys.length-1]) : T.typeFixed)
    : T.noLock;

  let detail = "";
  if (open){
    let termsTable = "";
    if (termKeys.length > 1){
      termsTable = '<table class="sc-terms"><thead><tr><th>' + T.kTerm + '</th><th class="sc-n">' + T.kRate + '</th>'
        + '<th class="sc-n">' + T.interestOn + eur(state.amount) + '</th></tr></thead><tbody>'
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
      ? T.schemePre + esc(a.protection_scheme) + T.schemeMid + eur(a.protection_amount) + T.perPerson
      : a.protection === "investor"
        ? esc(a.protection_scheme) + T.investorUpTo + eur(a.protection_amount) + T.notDeposit
        : T.protNoneLine;
    detail = '<div class="sc-detail"><div class="sc-grid2"><div>'
      + (termsTable ? '<p class="sc-h">' + T.ratesByTerm + '</p>' + termsTable : '<p class="sc-h">' + T.kRate + '</p>'
          + kv(T.currentRate, pct(a.rate)) + (a.rate_note ? kv(T.detail, esc(a.rate_note)) : ""))
      + '<p class="sc-h" style="margin-top:18px">' + T.whereOffered + '</p>'
      + kv(T.countries, a.countries.length + T.ofEea + DATA.meta.eea.length + T.eeaCountries)
      + kv(T.howWeKnow, esc(a.countries_source))
      + '</div><div><p class="sc-h">' + T.conditions + '</p>'
      + kv(T.kType, TYPE[a.type])
      + kv(T.kProt, protLine)
      + kv(T.kMin, a.min ? eur(a.min) + (a.min_note ? " - " + esc(a.min_note) : "") : T.noMin)
      + kv(T.kMax, a.max ? eur(a.max) + (a.max_note ? " - " + esc(a.max_note) : "") : T.noMax)
      + kv(T.kPaid, esc(a.paid))
      + (a.notes && a.notes.length ? '<ul class="sc-notes"><li>' + a.notes.map(esc).join("</li><li>") + "</li></ul>" : "")
      + '<a class="sc-src" href="' + esc(a.source_url) + '" target="_blank" rel="noopener nofollow">' + T.srcLink + '</a>'
      + "</div></div></div>";
  }

  const minLabel = a.min ? eur(a.min) : T.noMin;
  const maxLabel = a.max ? T.maxPre + eur(a.max) : "&nbsp;";

  return '<div class="sc-card' + (open ? " sc-open" : "") + '">'
    + '<div class="sc-row"><div class="sc-rank">' + (i+1) + "</div>"
    + '<div class="sc-who">'
    + '<span class="sc-logo"><span class="sc-ini">' + esc(ini(a.provider)) + "</span>"
    + (LOGO[a.id] ? '<img src="' + esc(LOGO[a.id]) + '" alt="" loading="lazy" decoding="async" onload="this.classList.add(\\'is-on\\')" onerror="this.remove()">' : "")
    + "</span>"
    + '<div class="sc-whotext"><div class="sc-name">' + esc(a.provider) + "</div>"
    + '<div class="sc-prod">' + esc(a.product) + "</div>"
    + '<div class="sc-tags"><span class="sc-tag">' + TYPE[a.type] + "</span>"
    + (a.kind === "marketplace" ? '<span class="sc-tag">' + T.marketplace + '</span>' : "") + "</div></div></div>"
    + '<div class="sc-kpis">'
    + '<div class="sc-kpi"><div class="sc-k">' + T.kRate + '</div><div class="sc-v">' + pct(a.rate) + "</div>"
    + '<div class="sc-s">' + (a.type === "fixed" ? T.fixedTxt : T.variable) + "</div></div>"
    + '<div class="sc-kpi"><div class="sc-k">' + T.kTerm + '</div><div class="sc-v sc-sm">' + termLabel + '</div><div class="sc-s">&nbsp;</div></div>'
    + '<div class="sc-kpi"><div class="sc-k">' + T.kInt + '</div><div class="sc-v">' + eur2(interest(a)) + "</div>"
    + '<div class="sc-s">' + T.gross + '</div></div>'
    + '<div class="sc-kpi"><div class="sc-k">' + T.kMin + '</div><div class="sc-v sc-sm">' + minLabel + "</div>"
    + '<div class="sc-s">' + maxLabel + "</div></div>"
    + "</div>"
    + '<div class="sc-cta"><a class="sc-btn" href="' + esc(AFF[a.id] || a.url) + '" target="_blank" rel="noopener nofollow sponsored">' + T.visit + esc(a.provider) + "</a>"
    + '<span class="sc-prot sc-' + a.protection + '"><i class="sc-dot sc-' + a.protection + '"></i>' + PROTSHORT[a.protection]
    + "</span></div>"
    + "</div>"
    + (OFFER[a.id]
        ? '<div class="sc-offer"><span class="sc-offer-b">' + T.offerBadge + '</span> '
          + esc(OFFER[a.id].t) + "."
          + (OFFER[a.id].c ? " " + T.useCode + " <b>" + esc(OFFER[a.id].c) + "</b>." : "")
          + ' <a href="' + esc(OFFER[a.id].a) + '">' + T.howItWorks + '</a></div>'
        : "")
    + detail
    + '<button class="sc-toggle" type="button" data-id="' + a.id + '">'
    + (open ? T.less : (termKeys.length > 1 ? T.seeTerms1 + (termKeys.length-1) + T.seeTerms2 : T.seeFull))
    + '<svg class="sc-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'
    + "</button></div>";
}

function render(){
  const list = visible();
  host.querySelector("#eupf-count").textContent = nResults(list.length);
  host.querySelector("#eupf-results").innerHTML = list.length
    ? '<div class="sc-cards">' + list.map(card).join("") + "</div>"
    : '<div class="sc-empty">' + T.empty1 + esc(CN[state.country]) + T.empty2 + "</div>";

  const d = new Date(DATA.meta.verified + "T00:00:00Z");
  host.querySelector("#eupf-verified").textContent =
    T.checked1 + d.toLocaleDateString(LOC,{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}) + T.checked2;
  host.querySelector("#eupf-foot").innerHTML = T.foot + T.footLinks;
}

function init(){
  const sel = host.querySelector("#eupf-country");
  const served = new Set();
  DATA.accounts.forEach(a => a.countries.forEach(c => served.add(c)));
  sel.innerHTML = DATA.meta.eea.filter(c => served.has(c))
    .map(c => [c, CN[c]]).sort((a,b) => a[1].localeCompare(b[1]))
    .map(([c,n]) => '<option value="' + c + '"' + (c === state.country ? " selected" : "") + ">" + n + "</option>")
    .join("");

  sel.addEventListener("change", e => { state.country = e.target.value; state.open = null;
    try { localStorage.setItem("eupf-sc-country", state.country); } catch (err) {}
    render(); });

  const amt = host.querySelector("#eupf-amount");
  amt.addEventListener("input", e => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    state.amount = Math.min(Number(raw || 0), 10000000);
    const pos = e.target.selectionStart, before = e.target.value.length;
    e.target.value = state.amount ? state.amount.toLocaleString(LOC) : "";
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

function applyI18n(tr){
  const F = ["product","rate_note","min_note","max_note","paid","countries_source","protection_scheme"];
  if (tr.accounts) DATA.accounts.forEach(a => {
    const t = tr.accounts[a.id];
    if (!t) return;
    F.forEach(k => { if (typeof t[k] === "string") a[k] = t[k]; });
    if (Array.isArray(t.notes)) a.notes = t.notes;
  });
  if (tr.offers) Object.keys(tr.offers).forEach(id => {
    if (OFFER[id] && typeof tr.offers[id].t === "string") OFFER[id].t = tr.offers[id].t;
  });
}

function boot(){
  const go = () => { shell(); init(); };
  if (LANG === "en" || !SRC) { go(); return; }
  const url = SRC.replace(/[^/?#]*(\?.*)?$/, "") + "data/i18n." + LANG + ".json";
  fetch(url, {cache:"no-cache"})
    .then(r => r.ok ? r.json() : null)
    .then(tr => { if (tr) applyI18n(tr); })
    .catch(() => null)
    .then(go);
}
boot();
})();
