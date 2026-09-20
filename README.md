# Kováčske palivá — logika + PHP modul pre VULCANUS

Vetva: **main**

**Clone URL (Grok, bez Origin tokenu):**

```
git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git
```

Ostré podstránky pre existujúci web sú v **`bulk-paleta/`** (plugin 2.2.6). **Najprv mapa ciest:** [`UX-MAPA.md`](UX-MAPA.md) a zmluva [`GROK.md`](GROK.md). Sprievodca je `/kovacske-paliva/`, nákup je Woo filter Kováčske palivá, paleta je konfigurátor v G3 chrome. `/paliva/` nie je ostrý obchod. Woo vrecia s doručením **nemeniť**. Názov v UI: **vrecia s doručením**, nie solo.

Inštalácia a smoke test: [`HOTOVO.md`](HOTOVO.md).

## Clone

```bash
git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git vulcanus-bulk-paleta
cd vulcanus-bulk-paleta
```

Na Cursor účte majiteľa ide aj:

```
origin repo clone miesizelezo/tmp-3f6e5b2c21c09414
```

Origin HTTPS `https://origin.cursor.com/git/miesizelezo/tmp-3f6e5b2c21c09414.git` bez credentials zlyhá — preto je vyššie verejné URL.

Potom vymeň `vulcanus-shop-demo/bulk-paleta/` súbormi z `bulk-paleta/` (pozri HOTOVO.md).

## E-shopový náhľad (Next.js)

- **Vrecia s doručením** — e-shopový košík, kuriér SDS, doprava v cene.
- **Od 100 kg** — záväzná paletová objednávka (nie košík), cenník podľa kíl, doklad do SuperFaktúry.

## Čo je v katalógu

| Tovar | Vrece | S doručením (1 zásielka SDS) | Paleta 110 × 120 cm |
| --- | --- | --- | --- |
| Kováčske uhlie | 25 kg | max. 3 vrecia | 40 vriec = 1 000 kg |
| Kováčsky antracit | 25 kg | max. 3 vrecia | 40 vriec = 1 000 kg |
| Kováčsky koks | 20 kg | max. 4 vrecia | 50 vriec = 1 000 kg |

- Solo ceny už obsahujú balné a doručenie. Jedna zásielka má 3 vrecia uhlia/antracitu alebo 4 vrecia koksu — nie že kuriér viac neunesie, ale že ďalšie vrecia by kuriérom vyšli draho. Dobierka je zvlášť.
- Od 100 kg je to záväzná objednávka, nie košík. Cena/kg klesá na 100 / 250 (uhlie, antracit) resp. 200 (koks) / 500 / 1 000 kg.
- Paletovú dopravu naceníte podľa adresy, alebo osobný odber. Do SuperFaktúry ide najprv tovar. Paleta je jednorazová, nevratná a v cene tovaru.

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

Woo košík je **len pre vrecia s doručením**. Paleta od 100 kg do Woo nepatrí.

1. Jedna kategória / dopravná trieda: kuriér SDS, 0 €, doprava v cene vreca.
2. Solo = simple product, max. 3–4 ks.
3. Palivo od 100 kg = záväzná objednávka mimo Woo (`/objednavka-paleta` → SuperFaktúra `type=order`). Nie variable produkt, nie simple „100 kg“ v košíku.
4. Nedávajte simple product „100 kg“, ktorý sa násobí — desať stoviek nedostane tonovú cenu.

Viac na stránke **Ako to predávame**.

## Grok Bot (existujúci web)

Tento Next náhľad **nie je** ostrý web. Mapa ciest: [`UX-MAPA.md`](UX-MAPA.md). Ostrý / staging stavia Grok Bot. Mechanický postup: [`HOTOVO.md`](HOTOVO.md). Kým klient nepovie „kreslite“, staging sa neprepisuje.
