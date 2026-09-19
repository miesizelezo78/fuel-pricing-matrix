# Kováčske palivá

E-shopový náhľad predaja kováčskeho uhlia, antracitu a koksu. Rieši to, čo WooCommerce samo od seba nechce: **solo vrecia s kuriérom** vs. **paletové zostavy od 100 kg s cenou podľa celkových kíl**.

## Čo je v katalógu

| Tovar | Vrece | Solo (SDS, doprava v cene) | Paleta 110 × 120 cm |
| --- | --- | --- | --- |
| Kováčske uhlie | 25 kg | max. 3 vrecia | 40 vriec = 1 000 kg |
| Kováčsky antracit | 25 kg | max. 3 vrecia | 40 vriec = 1 000 kg |
| Kováčsky koks | 20 kg | max. 4 vrecia | 50 vriec = 1 000 kg |

- Solo ceny už obsahujú balné a doručenie. Dobierka je zvlášť.
- Od 100 kg sa predáva ako zostava. Cena/kg klesá na 100 / 250 (uhlie, antracit) resp. 200 (koks) / 500 / 1 000 kg.
- 250 kg koksu v katalógu nie je — 250 sa nedelí 20 kg vrecom.

Ceny upravíte v [`lib/catalog.ts`](lib/catalog.ts). Sú označené ako vzorové.

## Spustenie

```bash
npm install
npm run build
npm run start
```

Vývoj: `npm run dev` (port 43147). Obchod: [http://127.0.0.1:43147](http://127.0.0.1:43147)

Objednávka je lokálna (košík v `localStorage`), bez platobnej brány a bez účtu.

## WooCommerce

WooCommerce nemá natívne množstevné ceny. Postup, ktorý tento shop predvádza:

1. Dve kategórie / dopravné triedy: kuriér vs. paleta.
2. Solo = simple product, max. 3–4 ks, doprava 0 €.
3. Palivo = jeden produkt. Buď variácie 100/250/500/1000 kg, alebo predaj po vreciach + plugin na tiered pricing, ktorý berie súčet v košíku.
4. Nedávajte simple product „100 kg“, ktorý sa násobí — desať stoviek nedostane tonovú cenu.

Viac na stránke **Ako to predávame**.
