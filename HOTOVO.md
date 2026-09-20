# HOTOVO — Palivá / Paleta / Ako to predávame

Vetva: **`main`**

Grok ťahá sám. Klient nič nekopíruje. Solo Woo produkty **nemeniť**.

## Clone

```bash
git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git vulcanus-bulk-paleta
cd vulcanus-bulk-paleta
```

## Čo skopírovať do `vulcanus-shop-demo/bulk-paleta/`

Vymeň **celý** priečinok pluginu (nie Woo produkty):

```
bulk-paleta/bulk-paleta.php
bulk-paleta/standalone.php
bulk-paleta/README.md
bulk-paleta/includes/catalog.json
bulk-paleta/includes/pricing.php
bulk-paleta/includes/order.php
bulk-paleta/includes/html.php
bulk-paleta/assets/site.css
bulk-paleta/assets/configurator.js
bulk-paleta/templates/paliva.php
bulk-paleta/templates/paleta.php
bulk-paleta/templates/ako.php
bulk-paleta/templates/palivo.php
bulk-paleta/templates/hotovo.php
```

wp-admin → Plugins → aktivuj **VULCANUS Bulk Paleta**. Settings → Permalinks → Save.

Plugin sám otvorí tri podstránky (**nie Woo**):

| Podstránka | URL |
| --- | --- |
| Palivá | `/paliva/` |
| Paleta | `/objednavka-paleta/` |
| Ako to predávame | `/ako-to-predavame/` |

Navigácia Palivá · Paleta · Ako to predávame je v hlavičke týchto stránok. Téma Woo sa na ne neviaže — plugin kreslí celú stránku.

## 30 s smoke test

1. `/paliva/` — hero, tri solo dlaždice, tri dlaždice „od 100 kg“. Klik na „Kováčske uhlie od 100 kg“ ide na Paletu, nie do košíka.
2. `/objednavka-paleta/` — konfigurátor: palivo, kg, rebrík cien, meter palety, živý box €/kg + tovar + doprava + spolu.
3. Klik **Antracit** → **250 kg**. Tovar **260,00 €**, €/kg **1,04 €**, doprava **55,00 €**, spolu **315,00 €**.
4. Klik **Koks** → **200 kg** (250 kg tam nie je). Tovar **230,00 €**, doprava **39,00 €**.
5. `/ako-to-predavame/` — text „Kde sa predaj láme“, nie Woo produkt.
6. Solo Woo (25 kg vrecia) ostávajú ako boli.

```bash
php -S 127.0.0.1:8765 bulk-paleta/standalone.php
# http://127.0.0.1:8765/paliva
# http://127.0.0.1:8765/objednavka-paleta
# http://127.0.0.1:8765/ako-to-predavame
```
