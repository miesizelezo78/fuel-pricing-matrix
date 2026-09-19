# Kováčske palivá

E-shopový náhľad predaja kováčskeho uhlia, antracitu a koksu.

- **Solo vrecia** — e-shopový košík, kuriér SDS, doprava v cene.
- **Od 100 kg** — záväzná paletová objednávka (nie košík), cenník podľa kíl, doklad do SuperFaktúry.

## Čo je v katalógu

| Tovar | Vrece | Solo (1 zásielka SDS) | Paleta 110 × 120 cm |
| --- | --- | --- | --- |
| Kováčske uhlie | 25 kg | max. 3 vrecia | 40 vriec = 1 000 kg |
| Kováčsky antracit | 25 kg | max. 3 vrecia | 40 vriec = 1 000 kg |
| Kováčsky koks | 20 kg | max. 4 vrecia | 50 vriec = 1 000 kg |

- Solo ceny už obsahujú balné a doručenie. Jedna zásielka má 3 vrecia uhlia/antracitu alebo 4 vrecia koksu — nie že kuriér viac neunesie, ale že ďalšie vrecia by kuriérom vyšli draho. Dobierka je zvlášť.
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

Woo košík je **len pre solo vrecia**. Paleta od 100 kg do Woo nepatrí.

1. Jedna kategória / dopravná trieda: kuriér SDS, 0 €, doprava v cene vreca.
2. Solo = simple product, max. 3–4 ks.
3. Palivo od 100 kg = záväzná objednávka mimo Woo (`/objednavka-paleta` → SuperFaktúra `type=order`). Nie variable produkt, nie simple „100 kg“ v košíku.
4. Nedávajte simple product „100 kg“, ktorý sa násobí — desať stoviek nedostane tonovú cenu.

Viac na stránke **Ako to predávame**.

## Grok Bot (existujúci web)

Tento Next náhľad **nie je** ostrý web. Ostrý / staging stavia Grok Bot. Tu je len logika palív. Balík pre neho: [`handoff/SPOLUPRACA.md`](handoff/SPOLUPRACA.md), [`katalog.json`](handoff/katalog.json), [`woocommerce-produkty.csv`](handoff/woocommerce-produkty.csv).
