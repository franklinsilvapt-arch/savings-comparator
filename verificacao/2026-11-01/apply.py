#!/usr/bin/env python3
"""Applies the approved 2026-11-01 verification changes to data/accounts.json.

Every change carries a guard on the current value. If any field is not what the
patch expects, nothing is written and the script exits 1. That stops a patch
written from stale data from silently overwriting a newer edit.

Sources and reasoning in verificacao/2026-11-01/relatorio.md and addendum.md.
BluOr stays at 2.5 by Franklin's decision.

Usage:  python3 verificacao/2026-11-01/apply.py
        python3 verificacao/2026-11-01/apply.py --dry-run

After applying, run scripts/build.py to regenerate savings-comparator.js
(the gerar-js workflow also does this on push).
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

# 1. IBKR: IBKR Ireland rates table, EUR above 10,000, BM minus 0.5pp, read 2026-11-01
setf("ibkr-cash", "rate", 1.968, 2.049)
setf("ibkr-cash", "rate_note",
     "Benchmark minus 0.5%, as of 20 October 2026. Variable",
     "Benchmark minus 0.5%, as of 1 November 2026. Variable")
setf("ibkr-cash", "rate_note",
     "Benchmark minus 0.5%, as of 20 October 2026. Variable. On złoty balances IBKR pays nothing on the first 400,000 PLN and 1.795% above that",
     "Benchmark minus 0.5%, as of 1 November 2026. Variable. On złoty balances IBKR pays nothing on the first 400,000 PLN and 1.904% above that",
     where=A["ibkr-cash"]["by_country"]["PL"])

# 2. Bigbank DE: best rate is now 12 months at 3.60%
setf("bigbank-de", "rate", 3.5, 3.6)
setf("bigbank-de", "terms", {"3": 2.7, "6": 3.0, "12": 3.4, "24": 3.5},
     {"3": 3.0, "6": 3.15, "12": 3.6, "24": 3.5})

# 3. Revolut: ceiling down to 2.50 generally, Netherlands up to 3.50,
#    and both pages cap the eligible balance at 100,000
setf("revolut-savings", "rate", 2.75, 2.5)
setf("revolut-savings", "rate_note",
     "1.50% to 2.75% depending on your plan, 2.75% on Ultra. Standard and Plus unlock 1.50% on the first 5,000€. Variable",
     "1% to 2.50% depending on your plan, 2.50% on Ultra. Variable")
setf("revolut-savings", "max", 5000000, 100000)
setf("revolut-savings", "rate", 2.5, 3.5, where=A["revolut-savings"]["by_country"]["NL"])
setf("revolut-savings", "rate_note",
     "Up to 2.50% depending on your plan. Once a boosted rate ends, Standard, Plus and Premium get 2% on the first 2,500€. Variable",
     "2% to 3.50% depending on your plan. Standard pays 2%. Variable",
     where=A["revolut-savings"]["by_country"]["NL"])

# 4. N26: the official Instant Savings list includes Austria and Belgium
setf("n26-savings", "countries",
     ["NL", "IE", "PT", "SI", "GR", "FI", "SK", "LU", "EE", "LV", "LT"],
     ["AT", "BE", "NL", "IE", "PT", "SI", "GR", "FI", "SK", "LU", "EE", "LV", "LT"])

# 5. Wise: the eligibility page carries neither figure; the rate page does
setf("wise-interest", "source_url",
     "https://wise.com/help/articles/4yTOVZoBSKOYyXrbnYRk5K/who-can-use-interest-and-stocks",
     "https://wise.com/gb/interest/")

setf("meta", "verified", "2026-10-16", "2026-11-01", where=d["meta"])

# max_note sits next to max, so the field order stays readable
if not fails:
    for i, a in enumerate(d["accounts"]):
        if a["id"] == "revolut-savings" and "max_note" not in a:
            new = collections.OrderedDict()
            for k, v in a.items():
                new[k] = v
                if k == "max":
                    new["max_note"] = "The maximum eligible deposit amount is 100,000€"
            d["accounts"][i] = new
            done.append("%-18s %-14s added" % ("revolut-savings", "max_note"))

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
