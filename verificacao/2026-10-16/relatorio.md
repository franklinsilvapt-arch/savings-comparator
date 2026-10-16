# Savings comparator verification - 2026-10-16

Fortnightly check for the 16th. Base: `data/accounts.json`, verified 2026-10-02, 19 accounts.

**Nothing was changed.** Not `data/accounts.json`, not `scripts/template.js`, not Webflow.
This file is the report only.

## Reference rate

ECB deposit facility rate: **2.50%, unchanged since 16 September 2026** (ECB key interest rates
table, read 2026-10-16). Everything below is a provider's own decision, not an ECB move. Four
providers repriced upwards in the two weeks since the last check.

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
- **BUX**: Prime 2.00% and the €100,000 cap confirmed. The **1.75% Plus rate is not published**
  on either bux.com/interest-on-cash or bux.com/prime, which only say "up to 2.00%" and "Your
  interest rate depends on your account type". The figure may still be right, it is just not
  sourceable from those two pages today. The fees page does publish it, along with what happens
  above €100,000: Plus drops to 0% and Prime to 1.65% (bux.com/fees/, 2026-10-16)

### Confirmed unchanged

Scalable Capital instant 2.60% with no cap, bunq Term Deposits (3 months 1.76%, 6 months 1.86%,
12 months 2.11%, 24 months 1.91%, €1,000 to €100,000), Raisin 4.25% at 120 months on the German
platform.

On Raisin, one caveat: the German platform's own figures are internally inconsistent, with the
term table showing up to 3.50% at 12 and 24 months while the named bank offers below it show
3.45% and "up to 3.12%", and the page dates its rates to both September and October 2026. The
4.25% headline at 120 months is solid; the shorter terms are not worth quoting from that page.

## Affiliate links and sign-up offers

The `AFF` and `OFFER` maps were read from `scripts/template.js`, not from the generated
`savings-comparator.js`.

### Offers against their articles

- **Trading 212, code IITW**: matches. The article confirms "Free fractional share worth up to
  €100" and the IITW code (/articles/trading-212-promo-code, 2026-10-16)
- **Lightyear, code INVESTINGINTHEWEB**: matches (/articles/lightyear-promo-code, 2026-10-16)
- **N26, code nunodanm36988c**: matches. The article says "pocket up to €35 signup bonus after
  your first card purchase" (/articles/n26-promo-code, 2026-10-16)
- **Revolut**: the value "€10 to €30 in welcome rewards" matches the article's "claim €10-€30
  in rewards". But the article's own "Promo code" field has a copy button and **renders no code
  at all**, and the button is labelled "Copiar", in Portuguese, on an English page
  (/articles/revolut-welcome-promo-bonus, 2026-10-16)

No offer in the `OFFER` map carries an end date, so there is nothing expiring on this side.

### Affiliate links

- `interactivebrokers.ie/mkt/?src=iitww1...` opens directly, no redirect, no 404
- `www.eupersonalfinance.eu/visit/trade-republic` redirects to traderepublic.com/en-ie with
  tracking. One thing to check: the redirect carries `ad_name=pedrofintech_`, which is not an
  eupersonalfinance tag. Worth confirming the attribution is the intended one

Could not be read, all with ROBOTS_DISALLOWED after three attempts each:
`/visit/trading212`, `/visit/lightyear`, `/visit/wise`, `revolut.ngih.net/mOAZg7`,
`n26-eu.c2nwa3.net/jRBRGb` and `partner.scalable-capital.de/go.cgi?...`. The
eupersonalfinance.eu `robots.txt` has no Disallow rules and other `/visit/` paths on the same
host answered normally in the same batch, so the block comes from the destination hosts. None
of these is a 404; they are simply unreadable this way and need a click.

## Country availability

**No published list changed.** Every stored `countries` array still matches what the provider
publishes today, where it publishes one at all. Checked in detail:

- **Trading 212 EU GmbH**: official list is DE, AT, DK, FI, FR, IS, IE, LI, LU, NL, NO, PT, ES,
  SE plus Switzerland. Stored: the same 14 EEA countries. Switzerland is outside the EEA and
  correctly left out
- **Trading 212 Markets Ltd**: BG, HR, CZ, EE, GR, HU, IT, LV, LT, MT, PL, CY, RO, SK, SI.
  Matches the stored 15 exactly
- **N26**: AT, NL, IE, PT, SI, GR, BE, FI, SK, LU, EE, LV, LT. Matches the stored 13 exactly.
  The page adds two conditions worth noting, a German IBAN and a Standard or Premium membership
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

**The counts do not change.** No availability moved, so the number of accounts open to residents
of each country stays as it is, and the SEO descriptions of the Savings Countries items remain
correct.

## Static country summaries

The Summary field of the Savings Countries items carries the three best rates, the protection
and the counts, generated from `accounts.json`. Rates moved, so **if you approve the changes
above, the Summary goes stale on every one of the 30 EEA country pages**, including the Dutch
Netherlands item and the Polish Poland item in their locales.

The reason it is all 30 and not a subset: bunq Easy Savings and Revolut Instant Access Savings
are both available in all 30, Interactive Brokers in 29, and the `verified` date shown in the
summary changes for everyone anyway.

Where the top three are most likely to actually reorder, rather than just shift a number:

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
- `accounts.trade-republic.rate_note`, today "3,00% voor nieuwe klanten, 2,50% standaard" in NL,
  only if the Trade Republic new-client rate turns out to have changed, which is unconfirmed
- `accounts.bluor-fixed.rate_note` and `accounts.medirect-fixed.rate_note` carry no figures, so
  they only need touching if you decide to spell out the term ladders

`accounts.ibkr-cash.rate_note` is "Benchmark min 0,5%" and `min_note` is "Geen rente over de
eerste 10.000€". Both are still accurate even after the rate change, because neither carries
the number. No translation work needed there.

The `translated_from` field of both files says "2026-09-28" and needs updating too.

## Could not confirm

- **Trading 212, both entities**: the 4.20% promotional rate, the 2 November 2026 deadline, the
  2.80% standard rate and the 2.50% Markets Ltd rate. **Trading 212 publishes no numeric rate
  in fetchable HTML anywhere.** The terms pages are JavaScript shells, trading212.com/terms/invest
  returning 4,445 characters of header, nav and footer with no body. The interest page says
  outright "In the app, tap on 'Earn Interest on cash', and you will find the current interest
  rates", and the help centre sends existing clients to the app. The help article on the EUR
  promotional rate describes the structure but states **no rate, no duration and no deadline**.
  Targeted searches for 2.80%, 1 November 2026 and 2 November 2026 across both domains returned
  nothing. This matters because **the 2 November deadline is about two weeks away** and the
  comparator is advertising it. It needs checking inside the app, or against the "Invest Promo
  Rate Terms" PDF that the help article references but does not expose
- **Klarna PT, fixed-term savings, 3.24%**: klarna.com returned ROBOTS_DISALLOWED on both
  attempts. Same block as in the deposits check. Third round running without a reading
- **N26, all plan rates**: the FAQ now says its percentages are "used for demonstration reasons
  only and may not be the actual rate", and the examples it gives (1.3% and 1.7%) are not the
  stored figures. No plan-specific rate is published anywhere on the page. The stored 1.50%
  Metal, 0.50% Go and 0.30% Standard/Smart are unsourceable today
- **Wise, 2.25% net and the 0.26% yearly cost**: the eligibility article carries no figures. The
  fees article publishes only the components, a Wise fee of 0.13% or 0.16% and a fund manager
  fee of 0.10% or 0.16% depending on the fund. No net or gross yield is published and I did not
  add the components together
- **Trade Republic, the €50,000 cap and the 3.00% new-client rate**: the stored source article
  publishes no figure at all, only "the annual interest rate". The product page says
  "2.5 % interest on your unlimited cash", with no cap and no new-client condition, and the rate
  appears only in the page title and metadata, not in the body. The Italian page does show 3%
  for new customers up to €50,000, and the Portuguese page contradicts itself between 2.5% and
  3%. The stored shape may well be right, but neither fetched page supports it as written
- **MeDirect minimum of €100**: not stated on the rate sheet
- **BUX Plus 1.75%**: not on the two pages the file points at, though the fees page has it
- **Lightyear country list**: the FAQ answer did not render

## Next step

Review this report. Only after your ok does `data/accounts.json` get edited, including
`meta.verified`, do the country summaries get regenerated and do the translations get updated.
