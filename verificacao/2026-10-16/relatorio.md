# Savings comparator verification - 2026-10-16

Fortnightly check for the 16th. Base: `data/accounts.json`, verified 2026-10-02, 19 accounts.

**Nothing was changed.** Not `data/accounts.json`, not `scripts/template.js`, not Webflow.
This file is the report only.

Four entries the automated pass could not read were resolved from screenshots Franklin took in
his own browser on 2026-10-16: N26, Wise, Klarna and Trading 212. They are marked below. One of
them, N26, turns out to have **dropped two countries**, which does change a page count.

## Reference rate

ECB deposit facility rate: **2.50%, unchanged since 16 September 2026** (ECB key interest rates
table, read 2026-10-16). Everything below is a provider's own decision, not an ECB move.

## Changed

- **bunq, Easy Savings**: the bonus rate went from 3.01% to **3.11%**, effective
  **15 October 2026 at 09:30 CEST**, i.e. yesterday. The structure also changed: bunq now
  publishes **1.61% on your first €10,000** and **1.51% above €10,000** as the base, where we
  store a single base of 1.51%. The €100,000 cap is unchanged
  (help.bunq.com/articles/update-to-bonus-interest-rate, 2026-10-16)
- **Revolut, Instant Access Savings**: the top rate went from 2.50% to **2.75%** on the Ultra
  plan. The page's own range text is internally inconsistent, saying "from 1% to 2,75%" in one
  place and "from 1,5% per annum on the Standard Plan to 2,75% per annum on the Ultra plan" in
  the footnote, so the floor is unclear. Standard and Plus "can unlock 1,5% p.a. on the first
  €5,000". The €5,000,000 maximum is unchanged (revolut.com/en-LT/instant-access-savings/, 2026-10-16)
- **Lightyear, Savings Vaults**: 2.47% APY to **2.45% APY** in euros. Confirmed on both the
  vaults page and the pricing page, which states "Interest rates shown are what you get after
  fees" (lightyear.com/en-eu/vaults, 2026-10-16)
- **Interactive Brokers, interest on cash**: we store a flat 1.273%. The EUR row of the global
  interest rates table publishes **0% on 0 to 10,000 and 1.985% (BM - 0.5%) above 10,000**.
  Both the rate and the shape are wrong in the file: we have `min: 10000` but no 0% band, and
  1.273% is not a number the page carries anywhere. The page says "Rates as of September 18,
  2026" (interactivebrokers.ie/en/accounts/fees/pricing-interest-rates.php, 2026-10-16)
- **Openbank ES, Depósito Open 6 meses**: the conditional rate went up and the unconditional
  one changed meaning. The page publishes **3.25% TAE (3.22% TIN) with a qualifying income of
  at least €900 a month** held for four months or more, and **2.75% TAE (2.73% TIN) without**.
  We store 2.75% as the with-salary rate and 1.25% as the without. The 2.75% we show is now the
  without-salary rate, and the 1.25% no longer appears anywhere on the page
  (openbank.es/deposito-a-plazo-fijo, 2026-10-16)
- **BluOr Bank, term deposit**: the stored 2.50% is correct but is only the 6-month rate. The
  published EUR ladder is 3 months 2.00%, 6 months 2.50%, 9 months 2.60%, 12 months 2.70%,
  24 months 2.80%, 36 months 2.90%, **60 months 3.00%**. Since every other entry in the file
  carries the provider's best rate, this one is understating BluOr by 50 basis points. Minimum
  €500 confirmed (bluorbank.lv/en/deposit, 2026-10-16)
- **N26, countries**, confirmed by screenshot, and this is the one that moves a count.
  The savings page footnote now reads: "This offer is available at no extra cost in the N26 app
  in **Estonia, Finland, Greece, Ireland, Latvia, Lithuania, Luxembourg, the Netherlands,
  Portugal, Slovakia, and Slovenia**." That is **11 countries**. We store **13**: the same 11
  plus **Austria and Belgium**. Those two have to come out
  (n26.com/en-eu/savings-account, 2026-10-16)

## Confirmed unchanged

- **N26, the plan rates**, confirmed by screenshot. The footnote states: "from 11/06/2025
  onwards, **0.30% p.a. for Standard and Smart, 0.50% p.a. for N26 Go, and 1.50% p.a. for
  Metal** (before taxes)." That matches our stored 1.50% headline and the rate note exactly.
  The automated pass had read a different page, a support FAQ whose percentages are labelled
  "for demonstration reasons only", and wrongly concluded the rates were unpublished. They are
  published, just on the product page. Protection also confirmed: "protected up to €100,000 by
  the German Deposit Guarantee Scheme". Separately, the page mentions a **flexible cash fund at
  2.57% net, managed by Fidelity International** — that is a different product and does not
  belong in this entry (n26.com/en-eu/savings-account, 2026-10-16)
- **Wise, Interest**, confirmed by screenshot: **EUR 2.25%**, shown on wise.com/gb/interest
  alongside GBP 3.29% and USD 3.61%. Our stored 2.25% is right. The "net of the 0.26% yearly
  cost" wording in the note is still not something the page states as a single figure, but the
  headline rate itself is now confirmed (wise.com/gb/interest, 2026-10-16)
- **Klarna, fixed-term savings**, confirmed by screenshot: the Portuguese table gives 3 months
  1.84%, 6 months 2.15%, 9 months 2.46%, 12 months 2.95%, 18 months 3.11%, 24 months 3.15%,
  36 months 3.19% and **48 months 3.24%**. Our stored 3.24% is the 48-month rate and is
  unchanged. Note for the deposits comparator, which uses the same table: two of the four rates
  on its 3/6/12/24 grid did move (klarna.com/pt/conta-poupanca/, 2026-10-16)
- Scalable Capital instant 2.60% with no cap, bunq Term Deposits (3 months 1.76%, 6 months
  1.86%, 12 months 2.11%, 24 months 1.91%, €1,000 to €100,000), Raisin 4.25% at 120 months on
  the German platform.

On Raisin, one caveat: the German platform's own figures are internally inconsistent, with the
term table showing up to 3.50% at 12 and 24 months while the named bank offers below it show
3.45% and "up to 3.12%", and the page dates its rates to both September and October 2026. The
4.25% headline at 120 months is solid; the shorter terms are not worth quoting from that page.

### Detail missing from the stored record, not an error

- **Scalable Capital fixed term**: the stored 3.25% is the 24-month rate and is correct. The
  full ladder is 6 months 2.75%, 12 months 3.00%, 24 months 3.25%. Minimum €1, no maximum
  (de.scalable.capital/festgeld, 2026-10-16)
- **Bigbank DE**: the stored 3.50% is correct from 24 months. The ladder is 1-2 months 2.35%,
  3-5 months 2.70%, 6-8 months 3.00%, 9-11 months 3.05%, 12-23 months 3.40%, 24-35 months
  3.50%, 36-120 months 3.50%. Minimum €1,000 and maximum €100,000 confirmed
  (bigbank.de/festgeld/, 2026-10-16)
- **MeDirect**: the stored 2.40% is correct and is the top EUR rate, paid from 2 years out to
  5 years. The ladder is 3 months 1.00%, 6 months 1.90%, 1 year 2.35%, 2 to 5 years 2.40%.
  Two things worth noting: the rate sheet **states no minimum deposit anywhere**, so the stored
  `min: 100` is unsourced, and the sheet is **dated 12 February 2026**, so it may itself be
  stale (medirect.com.mt rate sheet PDF, 2026-10-16)
- **BUX**: Prime 2.00% and the €100,000 cap confirmed. The 1.75% Plus rate is not on
  bux.com/interest-on-cash or bux.com/prime, but the fees page does publish it, along with what
  happens above €100,000: Plus drops to 0% and Prime to 1.65% (bux.com/fees/, 2026-10-16)

## Affiliate links and sign-up offers

The `AFF` and `OFFER` maps were read from `scripts/template.js`, not from the generated
`savings-comparator.js`.

### Offers against their articles

- **Trading 212, code IITW**: matches. The article confirms "Free fractional share worth up to
  €100" and the IITW code (/articles/trading-212-promo-code, 2026-10-16)
- **Lightyear, code INVESTINGINTHEWEB**: matches (/articles/lightyear-promo-code, 2026-10-16)
- **N26, code nunodanm36988c**: matches. The article says "pocket up to €35 signup bonus after
  your first card purchase" (/articles/n26-promo-code, 2026-10-16)
- **Revolut**: the value "€10 to €30 in welcome rewards" matches the article. But the article's
  own "Promo code" field has a copy button and **renders no code at all**, and the button is
  labelled "Copiar", in Portuguese, on an English page
  (/articles/revolut-welcome-promo-bonus, 2026-10-16)

No offer in the `OFFER` map carries an end date, so there is nothing expiring on this side.

### Affiliate links

- `interactivebrokers.ie/mkt/?src=iitww1...` opens directly, no redirect, no 404
- `www.eupersonalfinance.eu/visit/trade-republic` redirects to traderepublic.com/en-ie with
  tracking. One thing to check: the redirect carries `ad_name=pedrofintech_`, which is not an
  eupersonalfinance tag. Worth confirming the attribution is the intended one

Not readable by the fetcher, all ROBOTS_DISALLOWED after three attempts:
`/visit/trading212`, `/visit/lightyear`, `/visit/wise`, `revolut.ngih.net/mOAZg7`,
`n26-eu.c2nwa3.net/jRBRGb` and `partner.scalable-capital.de/go.cgi?...`. On the brokers side
Franklin confirmed that a link flagged the same way (Freedom24) was in fact working and the
error was a bot block, so the likeliest reading is that these are all fine too. None of them
is a 404.

## Country availability

One list changed, the rest did not.

- **N26: 13 countries to 11.** Austria and Belgium are no longer in the published list. Details
  in "Changed" above
- **Trading 212 EU GmbH**: official list is DE, AT, DK, FI, FR, IS, IE, LI, LU, NL, NO, PT, ES,
  SE plus Switzerland. Stored: the same 14 EEA countries. Switzerland is outside the EEA and
  correctly left out
- **Trading 212 Markets Ltd**: BG, HR, CZ, EE, GR, HU, IT, LV, LT, MT, PL, CY, RO, SK, SI.
  Matches the stored 15 exactly
- **Wise**: the EEA subset of the official list matches the stored 28, with Belgium and
  Liechtenstein correctly absent
- **BluOr Bank**: "residents of Latvia, the EU, the EEA, the United Kingdom, and Switzerland",
  consistent with the stored 27
- **Bigbank DE**: still requires "einen permanenten deutschen Wohnsitz" and a German reference
  account, consistent with the stored single country
- **Raisin**: platforms in Austria, Finland, France, Germany, Ireland, Netherlands, Poland,
  Spain. Matches the stored 8

Providers that publish no list at all, where the stored arrays rest on a documented rule rather
than an official page: Scalable Capital, bunq, Revolut, Interactive Brokers (says "40 countries"
without naming them), MeDirect, BUX, Openbank, Trade Republic. Lightyear publishes a FAQ entry
"What countries is Savings available in?" but the answer did not render, so its 24-country list
could not be re-confirmed this round.

## Country pages and counts

**Two counts change, both because of N26.**

- **Austria**: loses N26 Instant Savings. The count in the Savings Countries SEO description
  goes **down by one**
- **Belgium**: loses N26 Instant Savings. The count goes **down by one**

I am deliberately not writing the resulting numbers here. The count comes from how the build
filters `accounts.json` against each country, and I did not run the build, so quoting a figure
would be guessing. Running `scripts/build.py` after the data edit gives the exact numbers.

Every other country keeps the same count.

## Static country summaries

The Summary field of the Savings Countries items carries the three best rates, the protection
and the counts, generated from `accounts.json`. Rates moved, so **if you approve the changes
above, the Summary goes stale on every one of the 30 EEA country pages**, including the Dutch
Netherlands item and the Polish Poland item in their locales.

The reason it is all 30 and not a subset: bunq Easy Savings and Revolut Instant Access Savings
are both available in all 30, Interactive Brokers in 29, and the `verified` date shown in the
summary changes for everyone anyway.

Where the top three are most likely to actually reorder, rather than just shift a number:

- **Austria and Belgium**: N26 comes out of the list entirely, so both the count and, if N26
  was in the top three, the ranking change
- **Spain**: Openbank moves from 2.75% to 3.25% with the income condition, which may push it
  into the top three
- **The 24 Lightyear countries**: a small move down, 2.47% to 2.45%, which can drop Lightyear
  out of a third place
- **The 27 BluOr countries**: if you decide to show BluOr's 3.00% at 60 months instead of the
  6-month 2.50%, BluOr enters the top three in a lot of places

Nothing was written to Webflow.

## Translations

If you approve the changes, these lines in `data/i18n.nl.json` and `data/i18n.pl.json` go stale.
Both files share the same structure, so it is the same keys in each. Nothing was translated or
corrected.

- `accounts.bunq-savings.rate_note`, today "Basisrente 1,51%, bonusrente 3,01% boven je
  persoonlijke drempel. Beide variabel" in NL. Both numbers change and the first-€10,000 tier
  is new
- `accounts.revolut-savings.rate_note`, today "1,00% tot 2,50%, afhankelijk van je abonnement.
  Variabel" in NL
- `accounts.openbank-es.rate_note`, today "2,75% met een maandelijkse salarisstorting van 900€,
  1,25% zonder" in NL. Both numbers change
- `accounts.n26-savings.countries_source`, today "officiële Instant Savings-lijst" in NL. The
  wording still holds, but the list behind it shrank, so it is worth a look when the data edit
  happens. The `rate_note` itself ("0,30% Standard en Smart, 0,50% Go, 1,50% Metal") is
  **confirmed correct** and needs no change
- `accounts.bluor-fixed.rate_note` and `accounts.medirect-fixed.rate_note` carry no figures, so
  they only need touching if you decide to spell out the term ladders

`accounts.ibkr-cash.rate_note` is "Benchmark min 0,5%" and `min_note` is "Geen rente over de
eerste 10.000€". Both are still accurate even after the rate change, because neither carries
the number. `accounts.wise-interest.rate_note` and `accounts.klarna-fixed.rate_note` are also
unaffected, since both entries were confirmed unchanged.

The `translated_from` field of both files says "2026-09-28" and needs updating too.

## Could not confirm

- **Trading 212, the promotional window and the step-down.** The rate itself is now
  **confirmed**: the Portuguese page publishes **4.2% in EUR**, "paid daily, no minimums or
  limits", described as "a variable promotional rate for 4 months from activation, for new
  Invest clients only". Two stored claims are **not supported by that page**: the
  **2 November 2026 deadline** (the page frames the 4 months as running from each client's own
  activation, with no campaign end date) and the **2.80% standard rate from 1 November 2026**
  (not mentioned anywhere). Our `rate` of 4.2 is right; the `rate_note` around it is not.
  The Markets Ltd entity's 2.50% also remains unconfirmed: Trading 212 still publishes no
  entity-by-entity rates in fetchable HTML (trading212.com/pt/interest-on-cash, 2026-10-16)
- **Trade Republic, the €50,000 cap and the 3.00% new-client rate**: Franklin confirmed the
  shape, **3% for new clients and 2.50% for existing ones**, which is what the entry stores.
  What is still unconfirmed from a page is the **€50,000 cap** and the `max_note` about German,
  French and Italian IBANs being uncapped. The Italian page supports a €50,000 cap for new
  customers, the German page says "unlimited cash" at 2.5%, and the Portuguese page contradicts
  itself. The entry is probably right; the per-country detail is what I could not pin down
- **MeDirect minimum of €100**: not stated on the rate sheet, which is also dated 12 February 2026
- **Lightyear country list**: the FAQ answer did not render
- **Wise, the 0.26% yearly cost** as a single published figure: the fees article publishes only
  the components, a Wise fee of 0.13% or 0.16% and a fund manager fee of 0.10% or 0.16%
  depending on the fund. The 2.25% headline is confirmed; the cost wording is not

## Next step

Review this report. Only after your ok does `data/accounts.json` get edited, including
`meta.verified` and the N26 country list, do the country summaries get regenerated and do the
translations get updated. The N26 change is the one that needs `scripts/build.py` re-run to get
the new Austria and Belgium counts.
