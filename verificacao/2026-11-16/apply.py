#!/usr/bin/env python3
"""Applies the approved 2026-11-16 verification changes to data/accounts.json.

Approved by Franklin on 2026-11-16. Every change carries a guard on the current
value. If any field is not what the patch expects, nothing is written and the
script exits 1.

Sources and reasoning in verificacao/2026-11-16/relatorio.md. All figures read
on the provider's own page on 2026-11-16.

Note on BluOr: on 2026-11-01 the decision was to keep rate at 2.5. This patch
updates the term grid to the page and moves rate to the best in-grid term
(24 months, 2.80%). Drop the two bluor lines to keep the earlier decision.

Usage:  python3 verificacao/2026-11-16/apply.py
        python3 verificacao/2026-11-16/apply.py --dry-run
"""
import collections, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data/accounts.json"
DRY = "--dry-run" in sys.argv

d = json.loads(DATA.read_text(encoding="utf-8"), object_pairs_hook=collections.OrderedDict)
A = {a["id"]: a for a in d["accounts"]}
fails, done = [], []

def guard(cond, msg):
    if not cond:
        fails.append(msg)
    return cond

def setf(aid, field, old, new, where=None):
    t = A.get(aid) if where is None else where
    if not guard(t is not None, "%s: unknown id" % aid):
        return
    cur = t.get(field)
    if not guard(cur == old, "%s.%s is %r, patch expected %r" % (aid, field, cur, old)):
        return
    t[field] = new
    done.append("%-18s %-14s %r -> %r" % (aid, field, old, new))

# 1. BluOr: bluorbank.lv/en/deposit, EUR table
setf("bluor-fixed", "terms", {"3": 1.75, "6": 2.3, "12": 2.5, "24": 2.5},
     {"3": 2.0, "6": 2.5, "12": 2.7, "24": 2.8})
setf("bluor-fixed", "rate", 2.5, 2.8)

# 2. Revolut: revolut.com/en-LT/instant-access-savings, "Up to 2,75% per annum",
#    "from 1,5% per annum on the Standard Plan to 2,75% per annum on the Ultra plan".
#    The Dutch override (2% to 3.50%) was re-read the same day and stands.
setf("revolut-savings", "rate", 2.5, 2.75)
setf("revolut-savings", "rate_note",
     "1% to 2.50% depending on your plan, 2.50% on Ultra. Variable",
     "1.50% to 2.75% depending on your plan, 2.75% on Ultra. Standard and Plus unlock 1.50% on the first 5,000€. Variable")

# 3. IBKR: EUR tier above 10,000 reads "1.985% (BM - 0.5%)" for IBKR Pro.
#    The PLN override is left alone: the złoty figure was not re-read.
setf("ibkr-cash", "rate", 2.049, 1.985)
setf("ibkr-cash", "rate_note",
     "Benchmark minus 0.5%, as of 1 November 2026. Variable",
     "Benchmark minus 0.5%, as of 16 November 2026. Variable")

# 4. Lightyear: lightyear.com/en-eu/vaults shows 2.48% APY
setf("lightyear-vaults", "rate", 2.46, 2.48)
setf("lightyear-vaults", "rate_note",
     "APY, tracks the ECB overnight rate, as of 21 October 2026. Variable",
     "APY, tracks the ECB overnight rate, as of 16 November 2026. Variable")

# 5. Klarna: klarna.com/pt/conta-poupanca table, short terms moved up
setf("klarna-fixed", "terms",
     {"3": 1.84, "6": 2.15, "9": 2.46, "12": 2.95, "18": 3.11, "24": 3.15, "36": 3.19, "48": 3.24},
     {"3": 2.29, "6": 2.42, "9": 2.54, "12": 2.95, "18": 3.11, "24": 3.15, "36": 3.19, "48": 3.24})

# 6. Bigbank DE: bigbank.de/festgeld, paid at maturity:
#    12-23 Monate 3,50 %, 24-120 Monate 3,60 %. Best rate stays 3.6.
setf("bigbank-de", "terms", {"3": 3.0, "6": 3.15, "12": 3.6, "24": 3.5},
     {"3": 3.0, "6": 3.15, "12": 3.5, "24": 3.6})

setf("meta", "verified", "2026-11-01", "2026-11-16", where=d["meta"])

for x in done:
    print("  ", x)
print("\n%d changes." % len(done))

if fails:
    print("\nNOTHING WAS WRITTEN. %d problems:" % len(fails))
    for f in fails:
        print("  ", f)
    sys.exit(1)

if DRY:
    print("\n--dry-run: nothing written.")
    sys.exit(0)

DATA.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("\nwrote %s. Now run scripts/build.py." % DATA.relative_to(ROOT))
