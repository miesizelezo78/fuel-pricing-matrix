# Kováčske palivá

E-shopový náhľad predaja kováčskeho uhlia, antracitu a koksu.

- **Solo vrecia** — e-shopový košík, kuriér SDS, doprava v cene.
- **Od 100 kg** — záväzná paletová objednávka (nie košík), cenník podľa kíl, doklad do SuperFaktúry.

## Čo je v katalógu

| Tovar | Vrece | Solo (SDS, doprava v cene) | Paleta 110 × 120 cm |
| --- | --- | --- | --- |
| Kováčske uhlie | 25 kg | max. 3 vrecia | 40 vriec = 1 000 kg |
| Kováčsky antracit | 25 kg | max. 3 vrecia | 40 vriec = 1 000 kg |
| Kováčsky koks | 20 kg | max. 4 vrecia | 50 vriec = 1 000 kg |

- Solo ceny už obsahujú balné a doručenie. Dobierka je zvlášť.
- Od 100 kg je to záväzná objednávka, nie košík. Cena/kg klesá na 100 / 250 (uhlie, antracit) resp. 200 (koks) / 500 / 1 000 kg.
- Paletovú dopravu naceníte podľa adresy, alebo osobný odber. Do SuperFaktúry ide najprv tovar.

Ceny upravíte v [`lib/catalog.ts`](lib/catalog.ts). Sú označené ako vzorové.

## SuperFaktúra

Skopírujte [`.env.example`](.env.example) na `.env.local` a doplňte e-mail a API kľúč. Bez nich formulár objednávku uloží ako náhľad. Ostrý doklad ide `POST /invoices/create` s `Invoice.type = order`.

## Spustenie

```bash
npm install
npm run build
npm run start
```

Vývoj: `npm run dev` (port 43147). Obchod: [http://127.0.0.1:43147](http://127.0.0.1:43147)

Objednávka sola je lokálny košík. Paletová objednávka ide na `/objednavka-paleta` a do SuperFaktúry (alebo náhľad bez kľúčov).

## WooCommerce

WooCommerce nemá natívne množstevné ceny. Postup, ktorý tento shop predvádza:

1. Dve kategórie / dopravné triedy: kuriér vs. paleta.
2. Solo = simple product, max. 3–4 ks, doprava 0 €.
3. Palivo = jeden produkt. Buď variácie 100/250/500/1000 kg, alebo predaj po vreciach + plugin na tiered pricing, ktorý berie súčet v košíku.
4. Nedávajte simple product „100 kg“, ktorý sa násobí — desať stoviek nedostane tonovú cenu.

Viac na stránke **Ako to predávame**.

## Grok Bot → WooCommerce

Balík na nahratie tohto katalógu do WooCommerce je v [`handoff/`](handoff/):

- [`katalog.json`](handoff/katalog.json) — kanonický katalóg, ceny, paleta, dobierka a zákazy
- [`woocommerce-produkty.csv`](handoff/woocommerce-produkty.csv) — import (koncepty, `Published = -1`)
- [`grokbot-prompt.md`](handoff/grokbot-prompt.md) — prompt, ktorý vložíte Botovi spolu s prílohami

Ceny sú dohodnuté vzorové sumy z [`lib/catalog.ts`](lib/catalog.ts). Pred ostrým spustením ich ešte môžete upraviť. Bot má čakať na schválenie, kým dá produkty live.
