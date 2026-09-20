# HOTOVO — paletový konfigurátor pre Grok Bot

Vetva: **`main`**

Grok ťahá sám. Klient nič nekopíruje.

## Clone URL (bez Origin credentials)

```bash
git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git vulcanus-bulk-paleta
cd vulcanus-bulk-paleta
```

Toto je ostré, verejné git repo (dumb HTTP). Žiadny token, žiadny GitHub login.

Záloha na tom istom Cursor účte (ak Grok má Origin CLI):

```bash
origin repo clone miesizelezo/tmp-3f6e5b2c21c09414
```

Origin HTTPS bez tokenu zlyhá. Použi verejné URL vyššie.

## Čo skopírovať do `vulcanus-shop-demo/bulk-paleta/`

Vymeň **celý** priečinok pluginu týmito súbormi. Solo Woo produkty **nesiahaj**.

```
bulk-paleta/bulk-paleta.php
bulk-paleta/standalone.php
bulk-paleta/README.md
bulk-paleta/includes/catalog.json
bulk-paleta/includes/pricing.php
bulk-paleta/includes/order.php
bulk-paleta/assets/configurator.css
bulk-paleta/assets/configurator.js
bulk-paleta/templates/configurator.php
```

Potom: wp-admin → Plugins → aktivuj **VULCANUS Bulk Paleta**. Settings → Permalinks → Save (rewrite `/objednavka-paleta/`).

## 30 s smoke test konfigurátora

1. Otvor `/objednavka-paleta/` (Local aj staging).
2. Hneď vidíš živý box: **€/kg, tovar s DPH, odhad dopravy, spolu** — nie prázdny formulár.
3. Klik **Antracit** → **250 kg**. Tovar **260,00 €**, €/kg **1,04 €**, doprava **55,00 €**, spolu **315,00 €**.
4. Klik **Koks** → stupne kg. **250 kg tam nie je** (20 kg vrecia). Klik **200 kg**. Tovar **230,00 €**, doprava **39,00 €**, spolu **269,00 €**.
5. Klik **Prídem osobne**. Doprava **0 €**, spolu = tovar.
6. Solo Woo (25 kg vrecia) ostávajú ako boli. Žiadny paletový produkt v košíku.

Bez WordPressu:

```bash
php -S 127.0.0.1:8765 bulk-paleta/standalone.php
# otvor http://127.0.0.1:8765/objednavka-paleta
```
