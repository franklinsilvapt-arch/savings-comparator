#!/usr/bin/env python3
"""Gera savings-comparator.js a partir de data/accounts.json e scripts/template.js.
Só se edita o JSON: o JS é sempre gerado."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "data/accounts.json").read_text(encoding="utf-8"))

# validação: nada entra sem país, proteção e tipo válidos
eea = set(data["meta"]["eea"])
for a in data["accounts"]:
    assert a["protection"] in ("dgs", "investor", "none"), a["id"]
    assert a["type"] in ("instant", "fixed", "mmf"), a["id"]
    assert a["countries"], f'{a["id"]}: sem países, não pode entrar no filtro'
    bad = [c for c in a["countries"] if c not in eea]
    assert not bad, f'{a["id"]}: países fora do EEE {bad}'
    assert a.get("source_url", "").startswith("http"), f'{a["id"]}: sem fonte'

tpl = (ROOT / "scripts/template.js").read_text(encoding="utf-8")
blob = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
out = tpl.replace("__DATA__", blob)
(ROOT / "savings-comparator.js").write_text(out, encoding="utf-8")

countries = {}
for c in sorted(eea):
    countries[c] = sum(1 for a in data["accounts"] if c in a["countries"])
print(f'savings-comparator.js gerado: {len(out)} caracteres, {len(data["accounts"])} contas')
print("resultados por país:", ", ".join(f"{c} {n}" for c, n in countries.items() if n))
