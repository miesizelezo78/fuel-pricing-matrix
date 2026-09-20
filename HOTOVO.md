# HOTOVO — paletový konfigurátor pre Grok Bot

Vetva: `main`

## Clone (Grok ťahá sám, klient nič nekopíruje)

```bash
git clone --branch main https://origin.cursor.com/git/miesizelezo/tmp-3f6e5b2c21c09414.git vulcanus-bulk-paleta
cd vulcanus-bulk-paleta
```

Ak Origin HTTPS bez tokenu zlyhá (Grok nemá Origin git credentials), na Cursor účte majiteľa:

```bash
origin repo clone miesizelezo/tmp-3f6e5b2c21c09414
```

## Čo skopírovať do `vulcanus-shop-demo/bulk-paleta/`

Vymeň obsah priečinka pluginu týmito súbormi (solo Woo produkty **nesiahaj**):

```
bulk-paleta/bulk-paleta.php
bulk-paleta/standalone.php
bulk-paleta/includes/catalog.json
bulk-paleta/includes/pricing.php
bulk-paleta/includes/order.php
bulk-paleta/assets/configurator.css
bulk-paleta/assets/configurator.js
bulk-paleta/templates/configurator.php
```

Potom v wp-admin: Plugins → aktivuj **VULCANUS Bulk Paleta**. Settings → Permalinks → Save (rewrite `/objednavka-paleta/`).

## 30 s smoke test konfigurátora

1. Otvor `/objednavka-paleta/` (Local aj staging).
2. Musíš hneď vidieť živý box: **€/kg, tovar s DPH, odhad dopravy, spolu** — nie prázdny formulár bez cien.
3. Klik **Antracit** → **250 kg**. Tovar **260,00 €**, €/kg **1,04 €**, doprava **55,00 €**, spolu **315,00 €**.
4. Klik **Koks** → **250 kg**. Musí spadnúť na **200 kg** (nie 250). Tovar **230,00 €**, doprava **39,00 €**.
5. Klik **Prídem osobne**. Doprava **0 €**, spolu = tovar.
6. Solo Woo (25 kg vrecia) ostávajú ako boli. Žiadny paletový produkt v košíku.

Bez WordPressu, rýchly náhľad:

```bash
php -S 127.0.0.1:8765 bulk-paleta/standalone.php
# otvor http://127.0.0.1:8765/objednavka-paleta
```
