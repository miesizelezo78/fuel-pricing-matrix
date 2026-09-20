# HOTOVO — Palivá / Paleta / Ako to predávame

Vetva: **`main`** · plugin **2.2.6**

**STOP.** Klient chce najprv mapu ciest, potom diskusiu, až potom kreslenie. Predtým, než niečo vymeníš v plugine alebo v Bricks, prečítaj [`GROK.md`](GROK.md) a [`UX-MAPA.md`](UX-MAPA.md).

Ostrá Palivá na stagingu **nie je** `/paliva/`. Sprievodca je [`/kovacske-paliva/`](https://staging.vulcanus.sk/kovacske-paliva/). Nákup je [`/?ukazka=obchod&rodina=kovacske-paliva`](https://staging.vulcanus.sk/?ukazka=obchod&rodina=kovacske-paliva). `/paliva/` je ostrov s vlastnou lištou — po schválení mapy redirect na obchod, nie druhý shop.

Grok ťahá sám. **Odpíš, kde plugin/téma leží**, kým niečo kopíruješ. Nekopíruj slepo cez `/paliva/`.

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
3. Pages: po schválení mapy ostáva **Paleta** (`/objednavka-paleta/`) a dieťa Objednávka odoslaná. **Palivá** (`/paliva/`) a **Ako to predávame** sa nahradia redirectom — Woo z nich nerob.
4. Woo SKU vrecí s doručením (25 kg / 20 kg) **nemente, nemažte, neimportujte paletové SKU**.

## Podstránky po schválení mapy

Pozri [`UX-MAPA.md`](UX-MAPA.md). Kým klient nepovie „kreslite“, toto neinštaluj ako ostrý obchod.

| Podstránka | URL | Čo je na nej |
| --- | --- | --- |
| Sprievodca (Grok / Bricks) | `/kovacske-paliva/` | Video, tri charaktery ohňa |
| Obchod (Grok / Woo) | `/?ukazka=obchod&rodina=kovacske-paliva` | 3 vrecia s doručením + 3 karty od 100 kg |
| Paleta (plugin, G3 chrome) | `/objednavka-paleta/` | Konfigurátor: palivo, kg, rebrík, SuperFaktúra |

Navigácia ostáva G3: E-shop / Corten / Kontakt. Druhú lištu Palivá · Paleta · Ako **nekresli**.

## 30 s smoke test (až po „kreslite“)

1. `/kovacske-paliva/` — sprievodca, G3 hlavička. Nie šesť nákupných dlaždíc.
2. `/?ukazka=obchod&rodina=kovacske-paliva` — tri Woo karty + tri karty od 100 kg v tom istom `vd-card`. Klik od 100 kg ide na Paletu s `?palivo=`.
3. `/objednavka-paleta/` — konfigurátor v G3 hlavičke a pätičke, nie Figtree ostrov.
4. Klik **Antracit** → **250 kg**. Tovar **260,00 €**, €/kg **1,04 €**, doprava **55,00 €**, spolu **315,00 €**.
5. Klik **Koks** → **200 kg** (250 kg tam nie je). Tovar **230,00 €**, doprava **39,00 €**.
6. Mix 100 kg uhlia + 100 kg antracitu = **1 paleta 80 × 120 cm**, nie dve.
7. Woo vrecia s doručením ostávajú ako boli.
8. `/paliva/` redirectuje na obchod.

```bash
php -S 127.0.0.1:8765 bulk-paleta/standalone.php
# http://127.0.0.1:8765/paliva
# http://127.0.0.1:8765/objednavka-paleta
# http://127.0.0.1:8765/ako-to-predavame
```
