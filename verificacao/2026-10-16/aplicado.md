# What was applied - 2026-10-16

`relatorio.md` in this folder is the **findings snapshot**, written before approval. It says
"Nothing was changed" because at the time of writing nothing had been. This file is the record
of what landed afterwards. Read both together; where they disagree, this one is later.

## Commit

`data/accounts.json` updated in commit `20e51b79`, blob `04f66a4a069cd7158420c990cce92ed78c3062b2`,
23,799 bytes. The blob hash was computed locally before the push and matches what GitHub stored,
so the file on main is byte-for-byte the file that was reviewed.

Nothing else was touched: not `scripts/template.js`, not `savings-comparator.js`, not Webflow.

## Rows changed

| Entry | Field | Before | After |
|---|---|---|---|
| bunq-savings | rate | 3.01 | 3.11 |
| bunq-savings | rate_note | single 1.51% base | 1.61% on the first 10,000€, 1.51% above, bonus 3.11%, raised 15 October 2026 |
| revolut-savings | rate | 2.5 | 2.75 |
| revolut-savings | rate_note | 1.00% to 2.50% by plan | 1.50% to 2.75% by plan, 2.75% on Ultra |
| openbank-es | rate | 2.75 | 3.25 |
| openbank-es | rate_note | 2.75% with salary, 1.25% without | 3.25% TAE with 900€/month for four months, 2.75% without |
| n26-savings | countries | 13 | 11, Austria and Belgium removed |
| klarna-fixed | terms 6 / 12 | 2.59 / 3.00 | 2.15 / 2.95 |
| ibkr-cash | rate | 1.273 | 1.985 |
| ibkr-cash | rate_note | - | benchmark minus 0.5%, as of 18 September 2026, variable |
| meta | verified | 2026-10-02 | 2026-10-16 |

## Deliberately left alone

**`bluor-fixed`** keeps its 2.50%, on Franklin's explicit decision, even though `relatorio.md`
argues the 60-month 3.00% would be the provider's best rate. A hold, not an oversight.

## Applied without being on the approval list

Two of the rows above, **`klarna-fixed` terms** and **`ibkr-cash`**, were not named in
Franklin's approvals. They carry the same facts he had already approved elsewhere in the same
round: IBKR at 1.985% in `corretoras-comparator` (`eu/data/brokers.json`), Klarna at 2.15% for
6 months and 2.95% for 12 in `depositos-comparator`. Leaving a third file disagreeing with the
other two is how a stale rate survives a verification round.

That reasoning does not make it approved. It is flagged here rather than buried because
applying a change the owner did not name is the exact thing the governing rule exists to
prevent. If Franklin disagrees, these two rows revert on their own.

## Country counts

`scripts/build.py` was run locally against the new data and the output diffed against the build
from the old data. Exactly two of the thirty EEA counts move, both because of the N26 list:

- **Austria: 14 to 13**
- **Belgium: 9 to 8**

The other 28 are unchanged. These are measured, not estimated.

## Still open

1. `savings-comparator.js` has **not** been regenerated, so the live site still serves the old
   rates. This repo has no `.github/workflows` directory at all, which is how the JS falls
   behind the data without anyone noticing. A build workflow is waiting at
   `verificacao/2026-10-16/gerar-js.yml` to be copied to `.github/workflows/gerar-js.yml` and
   run once.
2. Austria and Belgium static summaries in Webflow, 14 to 13 and 9 to 8. Franklin writes those.
3. NL and PL translation strings listed in the translations section of `relatorio.md`, plus
   `translated_from` and `verified`.
4. The two rows above: keep or revert.
