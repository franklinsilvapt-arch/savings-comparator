# Savings comparator verification - 2026-10-02

Fortnightly check for the 1st, run on 2 October 2026. Base: `data/accounts.json`,
`meta.verified: 2026-09-28`, 19 accounts. Affiliate and offer maps read from
`scripts/template.js` (objects `AFF` and `OFFER`), never from the generated
`savings-comparator.js`.

**Nothing was changed.** Not the JSON, not the template, not the i18n files, not Webflow. This
file is the report only.

## Reference rate

ECB deposit facility rate: **2.50% with effect from 16 September 2026**, up from 2.25% (ECB key
interest rates). `meta.verified` is 2026-09-28, after the move, so most providers had already
repriced. The two changes below are later adjustments.

## Changed

- **lightyear-vaults**: `rate` 2.42% becomes **2.47%**. The source reads "Up to 2.47% APY on your
  Euros", BlackRock ICS Euro Liquidity Fund (Premier), yield earned daily and paid monthly, 20,000€
  Estonian investor protection. `rate_note` carries no figure and stays correct
  (https://lightyear.com/en-eu/vaults)
- **ibkr-cash**: `rate` 1.931% becomes **1.273%** as published today, from an EUR benchmark of
  1.773% minus 0.5%, table dated 18 September 2026. The stored 1.931% cannot be reproduced from
  this page at any point, so this one needs a human decision rather than a straight edit: either
  the stored figure came from elsewhere, or the published benchmark has not caught up with the ECB
  move. `rate_note` "Benchmark minus 0.5%. Variable" stays accurate either way
  (https://www.interactivebrokers.ie/en/accounts/fees/pricing-interest-rates.php)
- **bux-cash, max modelling**: `max` of 100,000€ with no `max_note` reads as no interest above
  100,000€. The source shows BUX Prime paying **1.65% above 100,000€** and only BUX Plus dropping
  to 0%. BUX basic pays 0% throughout. A `max_note` is needed and `rate_note` could say so
  (https://bux.com/pricing/)
- **trading212-eu, promo window**: the stored `rate_note` window "16 Sep to 2 Nov 2026" contradicts
  the site's own linked article, which says the 4.20% applies to new clients who open an account by
  **15 September 2026**, with 2.80% afterwards. 15 September 2026 has passed. One of the two is
  wrong and no primary source confirms either, because Trading 212 publishes no percentages outside
  the app (https://www.eupersonalfinance.eu/articles/trading-212-promo-code)

Confirmed unchanged against the provider's own page: trade-republic, trading212-cy protection,
scalable-instant, scalable-fixed, bunq-savings, bunq-term, revolut-savings, n26-savings,
wise-interest, medirect-fixed, bluor-fixed, raisin, openbank-es and bigbank-de.

## New

- **Trade Republic has launched in Poland** and runs a Polish market page offering 6% interest on
  cash up to 200,000 PLN. That is a PLN rate, so it falls outside the tool's "EUR interest on cash"
  inclusion rule and `countries` was left untouched. Worth a decision on whether PLN markets belong
  in the tool at all (https://traderepublic.com/en-pl/interest)
- Terms the providers publish but the data does not carry, all optional: MeDirect 36 and 60 months
  at 2.40%, BluOr 9 months at 2.40% and 36 and 60 months at 2.50%, Bigbank 1 to 2 months at 2.35%
  and 9 to 11 months at 3.05%
- Details absent from existing entries, also optional: Revolut pays a boosted 1.5% on the first
  5,000€ for Standard and Plus, N26 Metal accounts opened between 19 February 2025 and 11 June 2026
  keep a fixed 2.25% from 17 June 2026, and the openbank-es 2.75% is TAE with a TIN of 2.73% and
  requires the 900€ income to be kept for at least 4 months

## Gone

Nothing removed. All 19 entries still exist as products on their providers' sites.

Two stored `source_url` values open but no longer evidence the stored rate, so they are weak as a
source of truth: `trade-republic` points at a support article that explains only the day-count
convention, and `raisin` points at the country selector. `trading212-eu` points at a
supported-countries page, which was never a rate source.

## Affiliates and offers

Read from `scripts/template.js`.

### Affiliate links confirmed

- `AFF["trade-republic"]`: `eupersonalfinance.eu/visit/trade-republic` resolves, 302 to
  `traderepublic.com/en-ie` with Impact Radius tracking. It lands on the Irish market page for
  every visitor, and the German, Dutch and Irish pages quote different rates. Worth a look for a
  pan-EU comparator
- `AFF["ibkr-cash"]`: `interactivebrokers.ie/mkt/?src=iitww1&url=%2Fen%2Fwhyib%2Foverview.php`
  returns 200 and lands on "Why Trade Globally with IBKR?". Correct

### Offers against the article they point to

- `OFFER["trading212-eu"]` and `OFFER["trading212-cy"]`: "Free fractional share worth up to 100€"
  with code **IITW** matches the article, which describes a share valued between 8€ and 100€ with a
  10€ minimum deposit within 10 calendar days. No end date on the share offer. The same article is
  where the 4.20% interest deadline of 15 September 2026 comes from, which is the contradiction
  flagged under "Changed" (https://www.eupersonalfinance.eu/articles/trading-212-promo-code)
- `OFFER["revolut-savings"]`: "10€ to 30€ in welcome rewards" matches. No code, and the article
  confirms none is needed, registration must start through the link. The article gives **31
  December 2026** as the end date for the Spanish, Portuguese and Italian offers, so this needs a
  recheck before year end (https://www.eupersonalfinance.eu/articles/revolut-welcome-promo-bonus)
- `OFFER["n26-savings"]`: "Up to 35€ welcome bonus" with code **nunodanm36988c** matches, 35€ on
  Metal down to 5€ on Standard, first purchase of at least 5€, paid plans kept 3 months. No end
  date (https://www.eupersonalfinance.eu/articles/n26-promo-code)
- `OFFER["lightyear-vaults"]`: "Free fractional share worth up to 100€" with code
  **INVESTINGINTHEWEB** matches, 100€ deposit within 30 days, share locked 6 months. No end date
  (https://www.eupersonalfinance.eu/articles/lightyear-promo-code)

All four offer articles return 200. No promo code is out of date.

The source article `eupersonalfinance.eu/articles/best-savings-accounts-europe` opens and says
"Rates as of 16 September 2026", with Interactive Brokers and Scalable Capital fixed terms as of
28 September 2026. That is 12 days behind `meta.verified` for most entries and will need the same
updates as the JSON.

Entries with no `AFF` key fall back to `a.url` by design in `card()`. That is not a defect and is
left alone.

## Country availability and counts

**No `countries` list needs changing**, so no count on any Savings Countries page moves.

Checked against a list the provider itself publishes and found exact: trading212-eu 14 (the
official per-entity list minus Switzerland as non-EEA), trading212-cy 15, revolut-savings 30,
n26-savings 13, lightyear-vaults 24 (the 25 EEA countries on the eligibility page minus Belgium,
which the money market funds exclude), wise-interest 28 (Belgium and Liechtenstein absent, as
`countries_source` says), raisin 8 and bux-cash 8.

Left alone because the provider publishes no list, as `countries_source` records: trade-republic,
bunq-savings, bunq-term, scalable-instant, scalable-fixed, medirect-fixed, bluor-fixed,
openbank-es, bigbank-de and klarna-fixed. One wording point: BluOr's page today says residents of
Latvia, the EU, the EEA, the UK and Switzerland, which is wider than the "service available to EU
residents" quote in `countries_source`. No list is published, so nothing to change in `countries`,
but the quote is out of date against the page.

`ibkr-cash` with 29 codes was not re-checked against a published list this round. Unverified, not
contradicted.

Current count per country, for reference: DE 16, AT 15, NL 14, ES 14, FR 13, IE 13, FI 12, IT 12,
PT 12, EE 11, GR 11, LV 11, LT 11, LU 11, SK 11, SI 11, BE 9, BG 9, HR 9, CY 9, DK 9, HU 9, MT 9,
PL 9, SE 9, CZ 8, NO 8, RO 8, IS 7, LI 5.

## Static per-country summaries

Checked the effect of both rate changes on the three best rates of every one of the 30 countries.
**No country's top three changes.** Lightyear at 2.47% and Interactive Brokers at 1.273% are not in
any country's top three, and no availability moves, so no list, no protection line and no count in
any Summary field goes wrong on those grounds.

What does go wrong is the verification date. If `meta.verified` is bumped from 2026-09-28 to the
date of this round, **all 30 items of the Savings Countries collection** carry the old date in
their Summary, plus the Dutch version of the Netherlands item and the Polish version of the Poland
item in their respective locales.

If the owner also decides to write the `bux-cash` `max_note` or `rate_note`, the eight countries
where BUX is available see their Summary text change: NL, BE, FR, DE, ES, IT, AT and IE.

Regeneration comes after approval. Nothing was written to Webflow.

## Translations

- **lightyear-vaults**: only `rate` changes, from 2.42% to 2.47%. The English `rate_note` carries
  no figure, and the displayed rate comes from `DATA.accounts[].rate`, which `applyI18n` never
  overrides. **No line of `data/i18n.nl.json` or `data/i18n.pl.json` goes stale**
- **ibkr-cash**: same situation. `rate` only, `rate_note` is "Benchmark minus 0.5%. Variable" and
  stays valid. No translated lines affected

Conditional, only if the owner decides to change the English:

- if the **bux-cash** `rate_note` is reworded or a `max_note` is added, line 190 of
  `data/i18n.nl.json` and line 190 of `data/i18n.pl.json` go stale, and a new `max_note` key would
  be missing from both files
- if the **trading212-eu** `rate_note` window is corrected, line 37 of both files goes stale. Both
  currently spell out "16 september" and "2 november" in Dutch and "16 września" and "2 listopada
  2026" in Polish
- if the **openbank-es** `rate_note` is extended to say TAE or to add the 4-month income condition,
  line 200 of both files goes stale

Both translation files carry `translated_from: 2026-09-28`, which needs bumping with any of the
above. Nothing was translated or corrected.

## Could not confirm

- **klarna-fixed, every stored rate.** `klarna.com/de/klarna-festgeld` and
  `klarna.com/pt/poupanca-a-prazo` both refused, robots.txt could not be fetched or parsed. The
  whole `www.klarna.com` domain is unreadable from here, so the 8-term table is unverified. It is
  the only entry in the file with nothing checked today. Worth noting that the Klarna entry in the
  Portuguese deposits comparator is blocked the same way
- **trading212-eu rate (4.20% promotional and 2.80% standard) and trading212-cy rate (2.50%).**
  Trading 212 publishes no percentage anywhere on its own site. The product page says the current
  rates are in the app, and the help article on the EUR promotion gives only the ECB deposit
  facility rate plus a fixed markup. Primary confirmation needs an app reading or the Invest Promo
  Rate Terms document, which was not reachable
- **Affiliate links blocked by robots.txt**, neither confirmed working nor broken:
  `eupersonalfinance.eu/visit/trading212`, `eupersonalfinance.eu/visit/lightyear`,
  `eupersonalfinance.eu/visit/wise`, `partner.scalable-capital.de/go.cgi`, `revolut.ngih.net/mOAZg7`
  and `n26-eu.c2nwa3.net/jRBRGb`. `/visit/trade-republic` did resolve, so the `/visit/` redirects
  are very likely intact. They need a manual click
- **ibkr-cash country list.** Interactive Brokers' published list of available countries was not
  located this round, so the 29 stored codes were not re-checked
- **bux-cash, tier structure above 100,000€ for BUX basic.** The pricing page gives 0% for basic
  without stating a tier structure

## Next step

Review this report. Only after the owner's go-ahead does `data/accounts.json` get edited, along
with `scripts/template.js` if any affiliate or offer changes, the i18n files, and the static
summaries and SEO descriptions in Webflow.
