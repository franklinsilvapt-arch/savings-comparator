# savings-comparator

Comparador de contas de poupança, depósitos a prazo e fundos do mercado monetário do EEE, para
[eupersonalfinance.eu](https://www.eupersonalfinance.eu/compare-savings-accounts-europe).
O CSS e o JS são servidos por GitHub Pages e carregados pelo custom code da página no Webflow.

## Como se atualiza

Só se edita `data/accounts.json`. O JS é sempre gerado a partir dele:

```bash
python3 scripts/build.py
```

Isso lê `data/accounts.json` e `scripts/template.js` e escreve `savings-comparator.js`.
Nunca editar o `savings-comparator.js` à mão.

## Regras dos dados

- **Nenhuma taxa entra sem estar confirmada no site do próprio fornecedor.** Comparadores e artigos
  de terceiros servem para descobrir candidatos, nunca como fonte. Cada entrada tem `source_url`.
- **`countries` é a lista de países onde o fornecedor aceita clientes**, e é o que alimenta o filtro.
  Nunca inventar esta lista: se o fornecedor não a publica, ou se usa uma regra ("residentes do EEE")
  em vez de uma lista, isso fica registado em `countries_source`. Uma lista errada aqui diz a alguém
  que pode abrir uma conta que na verdade não lhe está aberta.
- **`protection`** distingue os três casos que o leitor confunde:
  - `dgs`: fundo de garantia de depósitos nacional, normalmente até 100.000€
  - `investor`: compensação ao investidor, que é mais fraca e não é garantia de depósitos
  - `none`: sem proteção, capital em risco (fundos do mercado monetário)
- **`type`**: `fixed` (prazo fixo, taxa garantida), `instant` (à ordem, taxa variável) ou `mmf`
  (fundo do mercado monetário).
- O `build.py` recusa gerar se faltar país, fonte, tipo ou proteção válidos.

## Cadência

Quinzenal, dias 1 e 16, como o comparador de depósitos da Literacia Financeira.
Verificar taxas e, sobretudo, disponibilidade por país, que muda sem aviso.

## Ficheiros

| Ficheiro | O que é |
|---|---|
| `data/accounts.json` | Fonte de verdade. O único que se edita à mão. |
| `scripts/template.js` | Lógica e marcação. Tem o marcador `__DATA__`. |
| `scripts/build.py` | Injeta o JSON no template e valida os dados. |
| `savings-comparator.js` | Gerado. Servido por GitHub Pages. |
| `savings-comparator.css` | Estilos, com os tokens do eupersonalfinance.eu. |

## Onde monta

O JS procura um `<div id="eupf-sc">` na página. Se não existir, cria-o a seguir ao primeiro `<h1>`.
No Webflow convém colocar esse div no sítio certo, pelo Designer.

## pl-bonds

Kalkulator obligacji skarbowych (Polish treasury bonds calculator) for eupersonalfinance.eu (EN page and PL locale). `pl-bonds/data.json` holds the monthly emission terms from obligacjeskarbowe.pl and must be updated when each new emission starts (around the 21st to 25th of the previous month): series names, first-period rates, margins, fees, NBP reference rate and latest GUS CPI.
