# Addendum to the 2026-11-01 report

Second pass, after Franklin confirmed some things by hand and asked for a retry on what had failed.
This closes four of the open items in `relatorio.md`. Still no data file changed and nothing touched
in Webflow.

## Closed: Trading 212 is correct, the urgency drops

The report called this the urgent item and said the live figure might already be wrong. It is not.
Franklin opened `trading212.com/pt/interest-on-cash` today and the euro tile reads **4.2%**, with
"Pagos diariamente. Sem mínimos ou limites" and the note that 4.2% is a variable promotional rate
for four months from activation, for new Invest clients only.

So `trading212-eu` at 4.2 is right as displayed. Nothing to fix in a hurry.

The same page gives the full currency table, worth recording: EUR 4.2%, USD 3.3%, GBP 3.55%,
HUF 3%, **PLN 2.25%**, CZK 3%, RON 3.5%, DKK 0.25%, NOK 0.25%. The PLN figure **confirms the
`trading212-cy` Polish override at 2.25**, which the report had down as unconfirmed.

Still unconfirmed, and none of it is visible on the comparator:

- the **standard rate** after the four months. Our note says 3.50% falling to 2.80% on 1 November.
  The page prints only the promotional rate
- the **promotional window dates**, which we have as 16 September to 2 November 2026. The page says
  only "four months from activation" and "new Invest clients"
- the euro rate for **Trading 212 Markets Ltd**, which we have at 2.50%

Note for next time: the URL that works has a locale, `trading212.com/pt/interest-on-cash`. Our
`source_url` for `trading212-eu` is the help centre supported-countries article, which is the right
source for countries but not for the rate. Worth adding the locale rate page as the rate source.
Seven `/pt/` variants all failed from this session, so the block is the reading tool rather than the
site: it opens fine in a normal browser.

## Closed: Wise, the figures are right but the source is the wrong page

`wise.com/gb/interest/` prints **"2.25% on EUR"** with **"After 0.26% annual fee"**. Both our
figures are correct.

Two things to record:

- The page says "The rate was last updated 23/09/2026" and "Variable rate is based on 7 day
  performance as of 23/09/2026". That is about five weeks old, so the rate is published but not
  freshly dated.
- Our `source_url` points at `wise.com/help/articles/4yTOVZoBSKOYyXrbnYRk5K/who-can-use-interest-and-stocks`,
  which is an eligibility-by-country page and carries neither figure. It should point at
  `wise.com/gb/interest/`.
- The fee article breaks the cost down differently: an annual Wise fee of 0.16% for the BlackRock
  Premier Acc T0 (EUR) fund, plus a 0.10% fund manager fee, which is where the 0.26% comes from. The
  JPMorgan EUR Government CNAV route used in several central and eastern European markets has a
  0.13% Wise fee and a 0.16% manager fee instead. So 0.26% is right for the BlackRock fund but not
  universal.

## Closed: BUX, our per-plan split is right

The report flagged a contradiction, because `bux.com/interest-on-cash/` says "Every BUX customer
earns interest on uninvested cash". The pricing and fees pages settle it. The "Account costs &
benefits" table prints the Interest row as: Basic **0%**; Plus **1.75% up to €100k** and **0% above
€100k**; Prime **2.00% up to €100k** and **1.65% above €100k**.

So `bux-cash` and its `max_note` are both correct as they stand, including the above-€100k tiers
already carried in the Dutch translation. **No change needed.** The contradiction is BUX's own,
between its marketing page and its fees table, and the fees table is the one to trust.

## Closed: Raisin, the 120 months is right

`raisin.com/de-de/festgeld/` ties the headline to a term in its table: the row reads 120 months at
**4.25%**, so our `rate_note` is correct. **No change needed.**

The rest of the printed table, for context: 3m 3.18%, 6m 3.35%, 9m 3.42%, 12m 3.52%, 24m 3.55%,
36m 3.70%, 48m 3.90%, 60m 4.00%. The table is stamped "Stand: Oktober 2026" while the page header
says "Zuletzt aktualisiert: November 2026", so the page is internally inconsistent on its own date.
No partner bank is named for the 120-month row, which is worth knowing if a reader asks where the
4.25% actually is.

## Still open: DEGIRO is not in this file, but the related check failed

For the record, since the brokers report covers it: `degiro.ie/data/pdf/ie/IE_Feeschedule.pdf` is
blocked by robots.txt to this session, so DEGIRO's 0% interest still has no primary source.

## Unchanged from the report

Everything else stands: IBKR 1.968 to **2.049** (and the PLN override 1.795 to **1.904**), Bigbank
3.5 to **3.6**, Revolut **2.75 to 2.50** generally and **2.50 to 3.50** in the Netherlands with a
€100,000 eligible cap, N26 missing **AT** and **BE**, and the BluOr best-rate question. The country
count impact is also unchanged: Austria 13 to 14 and Belgium 8 to 9.
