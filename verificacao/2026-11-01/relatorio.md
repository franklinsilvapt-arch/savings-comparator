# Savings comparator verification - 2026-11-01

Fortnightly check run by a scheduled cloud session. Base: `data/accounts.json`
(`meta.verified: 2026-10-16`, 19 entries). No data file was changed and nothing was touched in
Webflow.

## Context: the ECB rate

The ECB deposit facility rate stands at 2.50% and was left unchanged at the 29 October 2026 meeting.
It has not moved since the last verification, so the entries that track it should be stable, and
most are. What moved this fortnight is provider pricing, not the policy rate.

## Changed

- **Interactive Brokers, `ibkr-cash`, rate 1.968 to 2.049.** The IBKR Ireland "Global Interest
  Rates by Currency" table publishes today, for EUR, 0% up to 10,000 and **2.049% (BM - 0.5%)**
  above. The Polish override is also stale: the table shows 0% up to 400,000 PLN and **1.904%
  (BM - 2%)** above, where we have 1.795%
  (interactivebrokers.ie/en/accounts/fees/pricing-interest-rates.php, 2026-11-01). The page carries
  no "as of" date for that table. The only nearby date, "Rates as of September 18, 2026", belongs to
  the peer comparison tables, not to the IBKR rate itself, so the "20 October 2026" in our
  `rate_note` has no source on the page.
- **Bigbank Germany, `bigbank-de`, rate 3.5 to 3.6.** The Festgeld table now reads 12 months
  **3.60%**, 13 to 23 months 3.40%, 24 to 35 months 3.50%, 36 to 120 months 3.50%, with shorter
  terms from 2.50% at 1 to 2 months up to 3.30% at 4 months. Our 3.50% is the 24 to 120 month rate,
  no longer the best one. Minimum 1,000 and maximum 100,000 per contract, which matches
  (bigbank.de/festgeld, 2026-11-01). One caveat: the 3.60% table sits under both the "bei
  Fälligkeit" and "jedes Jahr" payout headings, so the page does not make clear which payout
  schedule it belongs to. A separate annual-interest table shows 3.45% at 2 years and at 3 to 10
  years. Worth a look before picking the figure.
- **Revolut, `revolut-savings`, rate 2.75 and the NL override 2.5, both wrong in opposite
  directions.** The general page now reads "Get from 1% to 2.5% (per annum) variable interest",
  with the worked example labelled as the Ultra plan at 2.5%. So the ceiling is **2.50%**, not
  2.75%, and the floor is **1%**, not 1.50%
  (revolut.com/en-LT/instant-access-savings, 2026-11-01). The Dutch page moved the other way and now
  reads "get from 2% - 3,5% per annum" and "Get up to 3.50% p.a. interest in EUR", against our
  `by_country.NL` note of up to 2.50%
  (revolut.com/en-NL/instant-access-savings, 2026-11-01). Both pages also state "The maximum
  eligible deposit amount is €100,000", where our `max` field says 5000000. Neither page publishes a
  per-plan table any more, so the plan breakdown in our `rate_note` has lost its source.
- **N26, `n26-savings`, the country list is short by two.** The Instant Savings FAQ lists Austria,
  Netherlands, Ireland, Portugal, Slovenia, Greece, **Belgium**, Finland, Slovakia, Luxembourg,
  Estonia, Latvia and Lithuania, thirteen countries. We have eleven, missing **AT** and **BE**
  (support.n26.com, Instant Savings FAQ rest of Europe, 2026-11-01). The page also requires a German
  IBAN. This one changes the country page counts, see below.

## Likely wrong, your call on the convention

- **BluOr Bank, `bluor-fixed`, rate 2.5.** The EUR table reads 3 months 2.00%, 6 months 2.50%,
  9 months 2.60%, 12 months 2.70%, 24 months 2.80%, 36 months 2.90%, 60 months **3.00%**
  (bluorbank.lv/en/deposit, 2026-11-01). Our 2.5 is the 6-month rate. Every other fixed entry in the
  file carries the best rate on the provider's table: MeDirect 2.40% is its 2 to 5 year rate, Klarna
  3.24% is its 48-month rate, Scalable 3.25% is its 24-month rate. By that convention BluOr should
  read 3.00%. Minimum 500 confirmed, under "Remote deposit placement", which the page says is open
  to residents of Latvia, the EU, the EEA, the UK and Switzerland.

## New

Nothing to add. No provider outside the current nineteen came up as a candidate this fortnight.

## Gone

Nothing. Every provider in the list still operates and still publishes its rates.

## Confirmed unchanged

- **Trade Republic**, 2.50% standard on euro cash, German page, unlimited balance. The 6% on up to
  200,000 PLN is confirmed on the Polish page. But the Portuguese page now advertises only "Recebe
  3% ao ano sobre o seu dinheiro", with **no €50,000 cap and no duration printed**, so the cap in
  our `max` and `max_note` has lost its published source even if the terms still say it.
- **Scalable Capital**, 2.60% on Tagesgeld, variable, no cap, interest accrued daily and paid
  monthly. Festgeld confirmed at 6 months 2.75%, 12 months 3.00%, 24 months **3.25%**, so our 3.25
  is right and is the 24-month rate.
- **bunq Easy Savings**, starting 1.61% on the first 10,000, 1.51% above, bonus **3.11%** up to
  100,000, raised on 15 October 2026 at 09:30 CEST, all variable. One note: the help article calls
  the product "bunq Savings Account", not "Easy Savings". It also explains the personal threshold,
  set from the highest balance of the previous half-year and recalculated on 1 January and 1 July,
  and that a missing threshold means 0 and the whole balance earns the bonus rate.
- **bunq Term Deposits**, 3 months 1.76%, 6 months 1.86%, 12 months **2.11%**, 24 months 1.91%. Our
  2.11 is right and is the 12-month rate. Note the 24-month rate is lower than the 12-month one.
- **MeDirect**, best EUR 2.40% at 2 to 5 years, matching our figure. The rate sheet PDF is dated
  **12 February 2026**, nine months old, which is worth knowing when quoting it as current. The
  sheet states no minimum deposit, so our `min: 100` has no source on it.
- **Openbank Spain**, 3.25% TAE at 6 months with at least 900 a month paid in from outside the bank
  and held four months in a linked account, 2.75% TAE without, 3.22% and 2.73% TIN respectively,
  minimum 1 with no maximum, early withdrawal at 0.20% TAE. All matches. The page adds a detail we
  do not record: the rate applies to money that increases the customer's Openbank balance as of
  **30 September 2026**.
- **Klarna Portugal**, 3 months 1.84%, 6 months 2.15%, 9 months 2.46%, 12 months 2.95%, 18 months
  3.11%, 24 months 3.15%, 36 months 3.19%, 48 months **3.24%**. Our 3.24 is right. No minimum or
  maximum, early withdrawal only within 14 days of opening. All matches.
- **Lightyear Savings Vaults**, **2.46% APY** on euros, confirmed on both the vaults page and the
  pricing page, whose title reads "Up to 2.46% APY on your Euros". The pricing page says under Money
  Market Funds that "Interest rates shown are what you get after fees", with a fee of "0.15% or
  less", which supports our net-of-fees wording, though it is stated for money market funds in
  general rather than for the vault specifically. Neither page carries an "as of" date, so the
  "21 October 2026" in our `rate_note` has no source on the page. The Belgium exclusion in our
  `countries_source` could not be checked, because that FAQ answer is collapsed and did not render.

## Could not confirm

- **Trading 212, both entries, and this one is urgent.** Our `trading212-eu` note says the 4.20%
  promotional rate runs for accounts opened 16 September to 2 November 2026, and that the standard
  rate was 3.50% and **falls to 2.80% on 1 November 2026**, which is today. The standard rate
  changes today and the promotional window closes tomorrow, and I could not confirm either.
  Every Trading 212 rate page returned a client error to this session:
  `trading212.com/terms/invest`, `trading212.com/interest-on-cash`,
  `trading212.com/legal/interest`, the help centre article on the interest rate and the "Interest on
  cash" section. The homepage loaded but shows only "Earn 4.9% AER on GBP" and keeps the euro rate
  table inside an image. The Markets Ltd asset protection page loaded and carries no rate, so
  `trading212-cy` at 2.50% is also unconfirmed. The number live on the comparator today may already
  be wrong and I have no primary source either to fix it or to stand it up. This needs checking in
  the app or in a logged-in session, today if you can.
- **Trading 212 entity country lists.** The help centre page did load and lists for EU GmbH:
  Germany, Austria, Denmark, Finland, France and overseas departments, Iceland, Ireland,
  Liechtenstein, Luxembourg, Netherlands, Norway, Portugal, Spain, Sweden and **Switzerland**. For
  Markets Ltd: Bulgaria, Croatia, Czech Republic, Estonia, Greece, Hungary, Italy, Latvia,
  Lithuania, Malta, Poland, Cyprus, Romania, Slovakia and Slovenia. Both match our `countries`
  arrays for the EEA, so no change. Switzerland is outside the EEA and correctly absent from ours.
- **N26 per-plan rates.** The FAQ no longer prints them. The only figure on the page is an
  illustrative example using 1.3%, explicitly flagged as "used for demonstration reasons only and
  may not be the actual rate". Our 0.30% Standard and Smart, 0.50% Go and 1.50% Metal are
  unconfirmed, and the Go plan is not mentioned on the page at all. The page says rates "may vary
  depending on the promotional campaign".
- **Wise, `wise-interest`, 2.25% and the 0.26% yearly cost.** The page we use as `source_url` is an
  eligibility-by-country page and carries neither figure. The fee is probably on
  `wise.com/help/articles/10HD8UtqMLH89OPpjdVuu2/what-fees-do-i-pay-when-i-use-wise-interest`,
  which was not read. The `source_url` for this entry looks like it points at the wrong page.
- **BUX, `bux-cash`, the per-plan split.** The page reads "Earn up to 2.00%* interest on uninvested
  cash" with the footnote "Your interest rate depends on your account type", and does not name
  Prime, Plus or Basic or give any per-plan rate. More to the point, it states **"Every BUX customer
  earns interest on uninvested cash"**, which contradicts our note that BUX basic pays nothing. The
  100,000 cap is confirmed, as both an interest eligibility limit and the DGS limit. This entry
  needs a proper check with BUX (bux.com/interest-on-cash, page modified 2026-06-18).
- **Raisin, the 120-month term.** The German platform advertises "Attraktive Zinsen bis 4,25 % p. a."
  with **no term attached**. The only term-linked figures on the page are featured offers, such as
  Brocc Finance AB at 3.86% over 7 years. So 4.25% is advertised but our "at 120 months" could not
  be stood up. The country selector lists Austria, Finland, France, Germany, Ireland, Netherlands,
  Poland, Spain, the UK and the US, which matches our eight EU markets.

## Affiliate links and sign-up offers

The AFF and OFFER maps were read from `scripts/template.js`, not from the generated
`savings-comparator.js`.

### Links

- `interactivebrokers.ie/mkt/?src=iitww1&...` loads at 200 on the IBKR Ireland "Why IBKR" page, as
  intended.
- `eupersonalfinance.eu/visit/trade-republic` redirects (302) and works, but lands on
  `traderepublic.com/en-ie`, the Trade Republic Ireland country homepage rather than a product page.
  Working but generic.
- `eupersonalfinance.eu/visit/trading212` returned a client error with nothing retrieved. I cannot
  tell a 404 from bot protection, so this is the one I would click first.
- Blocked by robots.txt, which is the reading tool's policy and not a site failure, so these are not
  broken links, just untested: `eupersonalfinance.eu/visit/lightyear`,
  `eupersonalfinance.eu/visit/wise`, `revolut.ngih.net/mOAZg7`, `n26-eu.c2nwa3.net/jRBRGb` and
  `partner.scalable-capital.de/go.cgi?pid=312&...`.

### Offers against their articles

- **trading212-eu and trading212-cy**: "Free fractional share worth up to €100" and code **IITW**
  both match `/articles/trading-212-promo-code` (dated 20 October 2026). The article adds the
  mechanics, a random share worth 8 to 100 euros with a 10 euro deposit inside 10 calendar days, and
  no end date for the share offer.
- **lightyear-vaults**: "Free fractional share worth up to €100" and code **INVESTINGINTHEWEB**
  match `/articles/lightyear-promo-code`. The article adds a per-user 30 day window to fund and a
  100 euro minimum.
- **revolut-savings**: "€10 to €30 in welcome rewards" matches, and having no code is correct. The
  article (29 October 2026) adds a date we do not carry: the Spanish and Portuguese offers run
  **until 31/12/2026**. Worth recording so it does not go stale in January.
- **n26-savings**: "Up to €35 welcome bonus" and code **nunodanm36988c** both match
  `/articles/n26-promo-code`. One nuance, the 35 euros is the Metal plan only, with Standard at 5,
  Smart at 10 and Go at 20, paid after a first card purchase of 5 euros or more and, on paid plans,
  three months of subscription. Our one-line wording does not say that.
- No offer in the OFFER map carries an end date, and none of the offers above has expired.

## Translations

If you approve the changes above, these lines go stale and need retranslating in
`data/i18n.nl.json` and `data/i18n.pl.json`. Both files carry the same keys, so the list is the same
for each. I translated nothing and corrected nothing.

- `ibkr-cash`: `rate_note` and `by_country.PL.rate_note`, both of which name the figure and the
  20 October 2026 date.
- `revolut-savings`: `rate_note` and `by_country.NL.rate_note`.
- `bigbank-de`: only if you change the `rate_note`, which today says just "Rate fixed for the term"
  and does not name a figure, in which case it may well stand as it is.
- `bluor-fixed`: same situation, the note names no figure.
- `raisin`: `rate_note` says "Highest rate on the German platform, at 120 months", and the Dutch
  file repeats the 120 months. If the term cannot be stood up, both translations change with the
  English.
- `bux-cash`: `rate_note` and `max_note`, which both carry the per-plan split that the page no
  longer supports.
- `n26-savings`: `rate_note`, which carries the per-plan rates that the page no longer prints.
- `trade-republic`: `max_note`, if you decide to reword the 50,000 cap.
- `wise-interest`: `rate_note`, if the 0.26% cost gets a different source or figure.

Also note `data/i18n.nl.json` has `translated_from: 2026-10-21`, which is already behind
`meta.verified: 2026-10-16`. It will need the date bumped whenever the English is updated.

## Country page counts

Only one confirmed change touches availability: adding **AT** and **BE** to `n26-savings`. That
moves two counts in the **Savings Countries** collection:

- **Austria**: 13 savings accounts, becomes **14**
- **Belgium**: 8 savings accounts, becomes **9**

Every other country count is unchanged. For reference, the counts the file gives today: AT 13,
BE 8, BG 9, CY 9, CZ 8, DE 15, DK 9, EE 11, ES 14, FI 12, FR 13, GR 11, HR 9, HU 9, IE 13, IS 7,
IT 12, LI 5, LT 11, LU 11, LV 11, MT 9, NL 14, NO 8, PL 10, PT 12, RO 8, SE 9, SI 11, SK 11.

Nothing was changed in Webflow.

## Static per-country summaries

The Summary and Summary heading fields are generated from `accounts.json`, so they stop matching the
data the moment any of the above is approved. The affected countries, by change:

- **Austria and Belgium**: both the count and the list change, because N26 is added. These two need
  the Summary rewritten whatever else you decide.
- **IBKR rate 1.968 to 2.049**: IBKR appears in 29 countries, all the EEA except Liechtenstein, so
  the Summary of each of those is affected wherever the rate is quoted or wherever IBKR sits in the
  top three.
- **Revolut 2.75 to 2.50**: Revolut appears in all 30 countries, and a drop of 0.25 points can push
  it out of a top three, so every country is in scope here.
- **Revolut NL 2.50 to 3.50**: the **Netherlands** item in particular, where a rise of a full point
  very likely reorders the top three. The Dutch-language version of that item needs the same
  treatment.
- **Bigbank 3.5 to 3.6**: **Germany** only, since Bigbank's German market requires German residence.
- **BluOr 2.5 to 3.00**, if you take that decision: BluOr is in 27 countries, so a jump of half a
  point reorders a lot of top threes.
- **The verification date itself**: every country Summary that prints it, which is all of them.

In practice, if you approve the IBKR and Revolut changes, all 30 country Summaries need
regenerating, plus the Dutch version on the Netherlands item and the Polish version on the Poland
item. The Poland item is also directly affected through the IBKR and Revolut PLN overrides.

Nothing was written to Webflow. Regeneration waits for your approval of the data changes.

## Next step

Nothing changes without your ok. In order of urgency: confirm the Trading 212 rate today, settle the
BluOr best-rate convention, update IBKR, Revolut and Bigbank, add AT and BE to N26, and sort out the
source pages for Wise and BUX, whose `source_url` fields are pointing at pages that no longer carry
the figures.
