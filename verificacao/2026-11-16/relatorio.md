# Verificação do savings comparator - 2026-11-16

Verificação quinzenal de `data/accounts.json`, `meta.verified` a "2026-11-01", 19 entradas.
Nada foi alterado nos dados e nada foi tocado no Webflow. Isto é só o relatório.

## Taxa de facilidade de depósito do BCE

Em vigor a 2,50%, com efeito a 16 de setembro de 2026, vinda de 2,25% com efeito a 17 de junho de 2026. A última
conferência de imprensa de política monetária foi a 29 de outubro de 2026 e a tabela do BCE não tem nenhuma entrada
posterior a 16 de setembro. O calendário não mostra reunião de política monetária entre 29 de outubro e 16 de dezembro
de 2026.

Não houve movimento do BCE desde a última verificação. As subidas encontradas abaixo são decisões comerciais dos
próprios bancos, não arrasto da taxa diretora.

## Mudou

Quatro entradas. Todas confirmadas na página do próprio fornecedor, lidas a 2026-11-16.

- **BluOr Bank, Term deposit**: subiu em todos os quatro prazos da grelha. 3 months from 1.75% to 2.00%, 6 months from
  2.30% to 2.50%, 12 months from 2.50% to 2.70%, 24 months from 2.50% to 2.80%. O campo `rate`, que segue o melhor
  prazo da grelha, passa de 2.5 to 2.8. O mínimo de €500 continua certo, e a página continua a mostrar prazos acima
  dos 24 meses que não listamos (36 months 2.90%, 60 months 3.00%), mais um prazo de 9 months a 2.60%
  (bluorbank.lv/en/deposit).
- **Revolut, Instant Access Savings**: o inglês está atrasado. O ficheiro tem `rate` 2.5 e a nota "1% to 2.50%
  depending on your plan, 2.50% on Ultra". A página mostra hoje "Get from 2,5% to 2,75% interest p.a." com a nota de
  pé de página "from 1,5% per annum on the Standard Plan to 2,75% per annum on the Ultra plan". Ou seja Ultra passa de
  2.50% to 2.75% e o piso do Standard de 1% to 1.50%. Notar que as duas traduções já têm os valores novos, "Od 1,50%
  do 2,75%" e "1,50% tot 2,75%", por isso quem lê em polaco ou em neerlandês já vê o número certo e quem lê em inglês
  não (revolut.com/en-LT/instant-access-savings).
- **Lightyear, Savings Vaults**: de 2.46% to 2.48% APY. A página mostra "2.48" com "%APY", e a meta-descrição diz o
  mesmo. A nota do ficheiro está datada de 21 de outubro de 2026 (lightyear.com/en-eu/vaults). A mesma correção é
  precisa no campo `interest.s` da entrada do Lightyear em `eu/data/brokers.json`, no repo corretoras-comparator.
- **Klarna, Fixed-term savings account**: os prazos curtos da tabela portuguesa subiram. 3 months from 1.84% to 2.29%,
  6 months from 2.15% to 2.42%, 9 months from 2.46% to 2.54%. De 12 months para cima está igual: 12 months 2.95%,
  18 months 3.11%, 24 months 3.15%, 36 months 3.19%, 48 months 3.24%. O campo `rate`, que segue os 48 months,
  não muda (klarna.com/pt/conta-poupanca).
  Ressalva: a própria página tem uma nota de pé de página que continua a dizer que as taxas garantidas vão de
  "1,84% e 3.24%" para 3 a 48 meses, o que é exatamente o nosso valor antigo a 3 meses. A tabela é o que o cliente
  subscreve, mas isto merece um olhar antes de entrar. A mesma entrada existe no comparador de depósitos português,
  por isso a correção tem de ir aos dois sítios.

## Provavelmente errado, não é uma mudança de taxa

- **Bigbank, Festgeld**: os prazos de 12 e 24 meses parecem estar trocados no nosso ficheiro. Temos `terms` com
  12 months 3.6% and 24 months 3.5%. A página mostra "12-23 Monate 3,50 %" and "24-120 Monate 3,60 %", com os juros
  pagos no vencimento. Os de 3 e 6 meses batem certo (3-5 Monate 3,00%, 6-11 Monate 3,15%) e o `rate` de 3.6 também,
  porque segue a linha dos 24 meses. Parece transposição na entrada e não alteração do banco
  (bigbank.de/festgeld). A entrada só serve a Alemanha.

## Confirmado sem alteração

- bunq, Easy Savings: 3.11% de bónus acima do limiar pessoal, até €100,000, variável, em vigor desde "October 15, 2026
  at 09:30 CEST". A escada abaixo do limiar também bate certo com a nota, 1.61% até €10,000 and 1.51% acima
  (help.bunq.com).
- bunq, Term Deposits: 3 months 1.76%, 6 months 1.86%, 12 months 2.11%, 24 months 1.91%, mínimo de €1,000, máximo de
  €100,000. A grelha inteira igual (bunq.com).
- Scalable Capital, instant: 2,60% p.a., sem limite de saldo, sem mínimo, variável, creditados mensalmente
  (de.scalable.capital/tagesgeld).
- Scalable Capital, Festgeld: 12 months 3,00% and 24 months 3,25%, a partir de €1, sem máximo. A página publica também
  um prazo de 6 months a 2,75% que não listamos, candidato a acrescentar (de.scalable.capital/festgeld).
- Wise, Interest: 2.25% em euros, depois da taxa anual de 0.26%. A própria página diz "The rate was last updated
  23/09/2026" (wise.com/gb/interest).
- MeDirect, Fixed Term Deposit: 3 months 1.00%, 6 months 1.90%, 1 Year 2.35%, 2 years 2.40%. A grelha inteira bate
  certo. A folha de taxas tem data de entrada em vigor de "12th February 2026", nove meses atrás, e não indica mínimo,
  por isso os €100 do nosso campo `min` não se confirmam neste documento
  (medirect.com.mt, Retail-Banking-Interest-Rate-Sheet.pdf).
- Openbank, Depósito Open 6 meses: "3,25% TAE" com domiciliação de pelo menos €900 por mês mantida quatro meses, e
  "2,75 % TAE" sem ela. Bate certo com o `rate` de 3.25 e com `terms` de 6 months 2.75%, e a nota já explica a
  condição (openbank.es).
- BUX, Interest on cash: "Earn up to 2.00%* interest on uninvested cash", com a nota de que depende do tipo de conta.
  O headline bate certo com o nosso `rate` de 2.0 (bux.com/interest-on-cash).

## Desapareceu

Nada. As 19 entradas continuam todas a existir no fornecedor.

## Contagens das páginas por país

**Sem alteração.** Nenhuma entrada entra ou sai, e nenhuma lista `countries` nem nenhum `by_country` muda a
disponibilidade. O número de contas abertas a residentes de cada país continua igual em todos os 30 países do EEE,
e as descrições SEO dos itens da coleção Savings Countries do Webflow continuam a bater certo.

Para registo, o número de entradas por país tal como está hoje: AT 14, BE 9, BG 9, CY 9, CZ 8, DE 15, DK 9, EE 11,
ES 14, FI 12, FR 13, GR 11, HR 9, HU 9, IE 13, IS 7, IT 12, LI 5, LT 11, LU 11, LV 11, MT 9, NL 14, NO 8, PL 10,
PT 12, RO 8, SE 9, SI 11, SK 11.

## Resumos estáticos por país

Aqui sim há impacto, e é largo. As três melhores taxas mudam em **20 dos 30 países** se as alterações do BluOr, da
Revolut e do Lightyear entrarem. O campo Summary desses itens da coleção Savings Countries fica a mostrar números que
já não batem com o JSON.

Boa notícia do lado das traduções: a Holanda e a Polónia **não** estão entre os 20, por isso os resumos em neerlandês
do item Netherlands e em polaco do item Poland não precisam de ser regenerados nos respetivos locais.

Países afetados, com o terceiro lugar antes e depois:

| País | Antes | Depois |
|---|---|---|
| BE | BluOr 2.5% | BluOr 2.8% |
| BG | BluOr 2.5%, Revolut 2.5% | BluOr 2.8%, Revolut 2.75% |
| CY | BluOr 2.5%, Revolut 2.5% | BluOr 2.8%, Revolut 2.75% |
| CZ | BluOr 2.5%, Revolut 2.5% | BluOr 2.8%, Revolut 2.75% |
| DK | BluOr 2.5% | BluOr 2.8% |
| EE | BluOr 2.5% | BluOr 2.8% |
| GR | BluOr 2.5% | BluOr 2.8% |
| HR | BluOr 2.5%, Revolut 2.5% | BluOr 2.8%, Revolut 2.75% |
| HU | BluOr 2.5%, Revolut 2.5% | BluOr 2.8%, Revolut 2.75% |
| IS | Revolut 2.5% | Revolut 2.75% |
| IT | Scalable 2.6% em terceiro | BluOr 2.8% em terceiro, troca de fornecedor |
| LI | Revolut 2.5% | Revolut 2.75% |
| LT | BluOr 2.5% | BluOr 2.8% |
| LV | BluOr 2.5% | BluOr 2.8% |
| MT | BluOr 2.5%, Revolut 2.5% | BluOr 2.8%, Revolut 2.75% |
| NO | Revolut 2.5% | Revolut 2.75% |
| RO | BluOr 2.5%, Revolut 2.5% | BluOr 2.8%, Revolut 2.75% |
| SE | BluOr 2.5% | BluOr 2.8% |
| SI | BluOr 2.5% | BluOr 2.8% |
| SK | BluOr 2.5% | BluOr 2.8% |

Países sem alteração no top três: AT, DE, ES, FI, FR, IE, LU, NL, PL e PT. Nos dez casos as três primeiras posições
são ocupadas por Raisin, Trading 212, Trade Republic, bunq, Bigbank ou Klarna, todas acima dos valores que mudam.

Dois avisos sobre esta tabela:

- A Itália é o único caso em que muda o fornecedor e não só o número, porque o BluOr a 2.8% passa à frente do
  Scalable a 2.6%.
- Portugal não aparece porque o top três é Trading 212 4.2%, Trade Republic 4.0% e Klarna 3.24%, e nenhum deles muda.
  Mas se o resumo português incluir a grelha de prazos da Klarna, as linhas de 3, 6 e 9 meses passam a estar erradas.
  Vale a pena confirmar o que o Summary de Portugal mostra.

A regeneração fica para depois da aprovação. Nada foi escrito no Webflow.

## Traduções

As duas traduções têm `translated_from` a 2026-10-21, contra o `verified` de 2026-11-01 do `accounts.json`.

Caso ao contrário do habitual, e que vale a pena olhar primeiro: na **Revolut** as traduções estão à frente do inglês
e não atrás. As duas já dizem "Od 1,50% do 2,75%" e "1,50% tot 2,75%" com Ultra a 2,75%, que é o valor certo da
página, enquanto o `accounts.json` ainda diz "1% to 2.50%". Quando o inglês for corrigido, estas duas linhas passam a
estar certas sem precisarem de tradução nova.

Há porém uma divergência que precisa de decisão, no `by_country` da Revolut para a Holanda:

- `accounts.json`: `rate` 3.5 e nota "2% to 3.50% depending on your plan. Standard pays 2%".
- `i18n.nl.json` e `i18n.pl.json`: "Tot 2,50%" e "Do 2,50%", com Standard, Plus e Premium a 2% sobre os primeiros
  €2,500.

Um dos dois está errado e a diferença é de um ponto percentual inteiro no país que tem página própria em neerlandês.
Confirmar em revolut.com/en-NL/instant-access-savings, que é o `source_url` que a própria entrada já declara.

Linhas de i18n que ficam desatualizadas se as alterações propostas entrarem:

- `accounts.lightyear-vaults.rate_note` em nl e pl: as duas dizem "stand op 21 oktober 2026" e "stan na 21 października
  2026". A data passa a estar errada com a subida para 2.48%.
- `accounts.bluor-fixed.rate_note` em nl e pl: o texto é genérico ("Oprocentowanie stałe przez cały okres",
  "Rente vast voor de looptijd") e não cita números, por isso sobrevive à mudança de taxas. Não precisa de tradução
  nova.
- `accounts.klarna-fixed` em nl e pl: o `rate_note` é genérico e sobrevive, mas a última nota de cada um cita a tabela
  alemã com cinco prazos. Essa nota não é afetada pela correção portuguesa. Nada a fazer.
- `accounts.revolut-savings.rate_note` em nl e pl: já têm o valor novo, como dito acima. Nada a fazer.
- `accounts.ibkr-cash.rate_note` em nl e pl: já estão atrasadas hoje, as duas datadas de 20 de outubro de 2026 contra
  1 de novembro de 2026 no inglês. Independente desta ronda.

Não foi traduzido nem corrigido nada.

## Afiliados e ofertas

Os mapas `AFF` e `OFFER` vivem em `scripts/template.js` e entram no `savings-comparator.js` pelo `scripts/build.py`.
Foi o template que se leu, não o ficheiro gerado.

### Ofertas confirmadas no artigo

- `trading212-eu` e `trading212-cy`: "Free fractional share worth up to €100", código IITW, artigo de 3 de novembro
  de 2026. Bate certo nos dois.
- `revolut-savings`: "€10 to €30 in welcome rewards", sem código, artigo de 14 de novembro de 2026. Bate certo. O
  artigo acrescenta que as ofertas de Espanha e Portugal têm de ser usadas antes de 31/12/2026.
- `n26-savings`: "Up to €35 welcome bonus", código nunodanm36988c, artigo de 31 de agosto de 2026. Bate certo, com a
  nota de que os €35 só se aplicam ao plano Metal, sendo €5 no Standard, €10 no Smart e €20 no Go, e que os planos
  pagos têm de ser mantidos três meses.
- `lightyear-vaults`: "Free fractional share worth up to €100", código INVESTINGINTHEWEB, artigo de 14 de novembro
  de 2026. Bate certo.

Nenhuma das cinco ofertas do mapa `OFFER` tem data de fim marcada.

### Links de afiliado

Dos dez links do mapa `AFF`, foi possível testar um:

- `https://www.interactivebrokers.ie/mkt/?src=iitww1&url=%2Fen%2Fwhyib%2Foverview.php` (`ibkr-cash`): 200, cai na
  página certa da IBKR Irlanda. Funciona. Mostra um aviso de jurisdição a pedir que o visitante escolha entre o site
  dos EUA e o da Irlanda, o que é normal mas acrescenta um passo.

Nenhum link devolveu 404 nem página de erro. Os restantes nove estão na secção final.

As nove entradas sem afiliado no mapa `AFF` continuam assim: `bunq-savings`, `bunq-term`, `medirect-fixed`,
`bluor-fixed`, `raisin`, `bux-cash`, `openbank-es`, `bigbank-de` e `klarna-fixed`. Não há nada a propor sobre elas.

## Não consegui confirmar

- **N26, Instant Savings**: a página de apoio que temos como `source_url` não publica taxa nenhuma. Os únicos números
  são exemplos de demonstração ("1,3%" e "1,7% p.a.") que a própria página diz poderem não ser a taxa real. Os nossos
  0.30% Standard e Smart, 0.50% Go e 1.50% Metal não se confirmam ali. O `source_url` desta entrada não serve para
  confirmar uma taxa e vale a pena trocá-lo por uma página que a publique.
- **Raisin, 4.25%**: o `source_url` é `raisin.com/en/select-country/`, que é só um seletor de país e não mostra taxa
  nenhuma. A nota do ficheiro diz que é a melhor taxa da plataforma alemã a 120 meses, o que é plausível, mas não se
  confirma neste URL. Mesmo problema de fonte: é preciso apontar para a página de taxas do mercado alemão. Isto
  importa porque a Raisin é a primeira posição em oito países (AT, DE, ES, FI, FR, IE, NL e PL) e é o número que o
  resumo desses países mostra em primeiro lugar.
- **Interactive Brokers, 2.049%**: a única página da IBKR Irlanda que abriu diz "Rates as of March 20, 2024" e mostra
  na linha do EUR "3.423% (BM - 0.5%)". É um retrato de março de 2024, não serve para confirmar nem para contrariar os
  nossos 2.049%. As páginas de benchmark e de saldos em dinheiro não abriram. Confirmar à mão. Os 2.049% são coerentes
  com um benchmark pouco acima de 2,50%, os 3.423% não.
- **BUX, taxas por plano**: a página mostra só o headline de "up to 2.00%" e não publica os valores por plano. Os
  nossos 2.00% no Prime e 1.75% no Plus, e o `max_note` com 1.65% e 0% acima de €100,000, não se confirmam ali.
- **MeDirect, mínimo de €100**: não aparece na folha de taxas. E a folha tem data de fevereiro de 2026, por isso vale
  a pena ver se existe uma versão mais recente.
- **Trade Republic, 4.00% até €20,000 para novos clientes até 1 de março de 2027**: traderepublic.com/en-de/interest
  devolveu erro de cliente e a página de apoio redirecionou para o suporte genérico. A página portuguesa só traz
  "Recebe 4 % TANB sobre o seu dinheiro" na meta-descrição, sem limite nem data. As notas do ficheiro dizem que foi
  confirmado a 12 e 13 de novembro de 2026, o que é recente, por isso não há sinal de ter mudado. Fica por confirmar
  hoje. Isto importa porque a Trade Republic está no top três de catorze países.
- **Trading 212, 4.20% promocional**: trading212.com/terms/invest e trading212.com/interest-on-cash não abriram. A
  nota do ficheiro diz que as condições foram confirmadas a 2026-11-03 nos Invest Promo Rate Terms do próprio
  Trading 212, com a fórmula do BCE mais 1,70 pontos percentuais. Com o BCE a 2,50% dá 4,20% e o BCE não mexeu, por
  isso a aritmética fecha. Atenção que a promoção fecha a 30 de novembro de 2026, dentro de duas semanas, e nessa data
  o `rate` tem de passar a 2.5 e o top três de nove países muda outra vez.
- Links de afiliado do mapa `AFF` que não se conseguiram testar. Nenhum deu sinal de estar partido, simplesmente não
  foi possível obter o estado:
  - `https://www.eupersonalfinance.eu/visit/trade-republic`, erro de cliente sem código HTTP.
  - `https://www.eupersonalfinance.eu/visit/trading212`, usado por `trading212-eu` e `trading212-cy`, erro de cliente
    sem código HTTP.
  - `https://www.eupersonalfinance.eu/visit/lightyear`, bloqueado por robots.txt.
  - `https://www.eupersonalfinance.eu/visit/wise`, bloqueado por robots.txt.
  - `https://revolut.ngih.net/mOAZg7`, bloqueado por robots.txt.
  - `https://partner.scalable-capital.de/go.cgi?...`, usado por `scalable-instant` e `scalable-fixed`, bloqueado por
    robots.txt.
  - `https://n26-eu.c2nwa3.net/jRBRGb`, bloqueado por robots.txt.
  Os quatro redirecionamentos do próprio site são os que mais importam, porque se um tiver desaparecido o botão deixa
  de levar a sítio nenhum. Um `curl -sIL` a partir da máquina do Franklin dá o código de estado em segundos.

## Próximo passo

Rever e decidir. Prontas a entrar, com fonte primária de hoje: BluOr nos quatro prazos, Revolut de 2.5 para 2.75,
Lightyear de 2.46 para 2.48 e a Klarna nos prazos curtos, esta última com a ressalva da nota de pé de página. Mais a
troca aparente dos prazos de 12 e 24 meses do Bigbank, que é correção de erro e não mudança de taxa. Se tudo entrar,
há 20 resumos estáticos por país a regenerar, nenhum deles em neerlandês ou em polaco, e nenhuma contagem a mexer.
A divergência da Revolut na Holanda precisa de ser resolvida antes, porque é um ponto percentual inteiro.
