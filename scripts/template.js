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

const DATA = __DATA__;

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
+ "Gwarancja depozytów chroni Twoje pieniądze w razie upadłości banku, do €100 000 na osobę i na bank. "
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
    + (LOGO[a.id] ? '<img src="' + esc(LOGO[a.id]) + '" alt="" loading="lazy" decoding="async" onload="this.classList.add(\'is-on\')" onerror="this.remove()">' : "")
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
