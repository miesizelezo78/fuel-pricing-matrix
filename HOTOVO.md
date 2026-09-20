# HOTOVO — Palivá / Paleta / Ako to predávame

Vetva: **`main`** · plugin **2.2.6**

Grok ťahá sám. **Najprv si prečítaj `GROK.md` a odpíš, kde plugin/téma leží a do ktorej stránky to ide.** Nekopíruj slepo cez `/paliva/`, kým to Grok nepovie — ostrá Palivá na stagingu je `/kovacske-paliva/` v Bricks.

Toto **nie sú Woo produkty**. Plugin pri aktivácii založí tri **WordPress podstránky**. Na WordPresse idú **do hlavičky a pätičky nového staging webu** (`get_header` / `get_footer`). Identity je iCloud / Bricks, nie starý vulcanus.sk.

## Clone

```bash
git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git vulcanus-bulk-paleta
cd vulcanus-bulk-paleta
```

## Čo vymeniť v `vulcanus-shop-demo/bulk-paleta/`

Vymeň **celý** priečinok pluginu. Ak tam už je starý shortcode / polovičný formulár, aj tak ho vymeň — 2.2.6 stránku prekreslí. Plugin na WordPresse **neprepisuje hlavičku ani pätičku** — volá `get_header()` / `get_footer()`.

```
bulk-paleta/bulk-paleta.php
bulk-paleta/standalone.php
bulk-paleta/README.md
bulk-paleta/includes/catalog.json
bulk-paleta/includes/pricing.php
bulk-paleta/includes/order.php
bulk-paleta/includes/html.php
bulk-paleta/includes/pages.php
bulk-paleta/assets/site.css
bulk-paleta/assets/configurator.js
bulk-paleta/templates/paliva.php
bulk-paleta/templates/paleta.php
bulk-paleta/templates/ako.php
bulk-paleta/templates/palivo.php
bulk-paleta/templates/hotovo.php
```

1. wp-admin → Plugins → deaktivuj a znova aktivuj **VULCANUS Bulk Paleta** (alebo nahraj 2.2.6 a daj Activate).
2. Settings → Permalinks → Save.
3. Pages: musia tam byť **Palivá**, **Paleta**, **Ako to predávame** (a dieťa Palety: Objednávka odoslaná). Ak Grok predtým spravil Woo produkt / polovičný formulár na tých istých slugoch, podstránky plugin preberie — **Woo z nich nerob**.
4. Solo Woo SKU (25 kg / 20 kg vrecia) **nemente, nemažte, neimportujte paletové SKU**.

## Podstránky (nie Woo)

| Podstránka | URL | Čo je na nej |
| --- | --- | --- |
| Palivá | `/paliva/` | Hero + 3 solo dlaždice + 3 dlaždice od 100 kg |
| Paleta | `/objednavka-paleta/` | Celý konfigurátor: palivo, kg, rebrík, meter, živý box, SuperFaktúra |
| Ako to predávame | `/ako-to-predavame/` | Kde sa predaj láme |

Navigácia **Palivá · Paleta · Ako to predávame** má ísť do **existujúceho** menu webu. Téma / e-shopová hlavička ostáva.

## 30 s smoke test

1. `/paliva/` — **tá istá hlavička a pätička ako na novom stagingu**. Dole tri solo + tri „od 100 kg“. Klik „Kováčske uhlie od 100 kg“ ide na Paletu, **nie** do košíka.
2. `/objednavka-paleta/` — celý konfigurátor, nie útržok formulára v téme Woo.
3. Klik **Antracit** → **250 kg**. Tovar **260,00 €**, €/kg **1,04 €**, doprava **55,00 €**, spolu **315,00 €**.
4. Klik **Koks** → **200 kg** (250 kg tam nie je). Tovar **230,00 €**, doprava **39,00 €**.
5. `/ako-to-predavame/` — text „Kde sa predaj láme“. Paleta jednorazová, nevratná a v cene tovaru. Bez slova Europaleta.
6. Na Palete: 750 kg uhlia (koks 800 kg). Mix 100 kg uhlia + 100 kg antracitu = **1 paleta 80 × 120 cm**, nie dve.
7. Solo Woo (25 kg vrecia) ostávajú ako boli.

```bash
php -S 127.0.0.1:8765 bulk-paleta/standalone.php
# http://127.0.0.1:8765/paliva
# http://127.0.0.1:8765/objednavka-paleta
# http://127.0.0.1:8765/ako-to-predavame
```
