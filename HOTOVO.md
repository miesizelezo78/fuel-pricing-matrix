# HOTOVO — Palivá / Paleta

**PLUGIN-VERSION: 2.3.2** (`PLUGIN-VERSION` v koreni, `bulk-paleta/bulk-paleta.php`).

Grok nasadzuje Local → staging. Cursor **SFTP nenahráva**.

Jeden drop pre Groka: [`handoff-paliva/od-cursora/HOTOVO.md`](handoff-paliva/od-cursora/HOTOVO.md).

- Shortcode `[vulcanus_paleta]` v G3 chrome. Žiadny vlastný HTML dokument.
- DPH: hobikováč vidí jednu sumu (vrátane DPH). Rozpis až po IČ DPH.
- Konfigurátor: plná šírka rodiča, čitateľné písmo, H1 „Kováčske palivá od 100 kg“.
- `/paliva/` → 301 na Woo filter. Solo SKU nemente.

```bash
php -S 127.0.0.1:8765 bulk-paleta/standalone.php
# http://127.0.0.1:8765/objednavka-paleta?palivo=antracit
```
