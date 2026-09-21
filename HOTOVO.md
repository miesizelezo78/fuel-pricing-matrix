# HOTOVO — Palivá / Paleta

**PLUGIN-VERSION: 2.3.11**

GitHub: https://github.com/miesizelezo78/fuel-pricing-matrix

**browser_download_url:**
https://github.com/miesizelezo78/fuel-pricing-matrix/releases/download/v2.3.11/vulcanus-bulk-paleta-2.3.11.zip

Release: https://github.com/miesizelezo78/fuel-pricing-matrix/releases/tag/v2.3.11

Unzipnuté súbory: [`dist/vulcanus-bulk-paleta/`](dist/vulcanus-bulk-paleta/)

Grok: vymeň celý `wp-content/plugins/vulcanus-bulk-paleta/` (nie `bulk-paleta/`). Woo vrecia nemente. Repo je private — zip sťahuj prihlásený (`gh release download v2.3.11 --repo miesizelezo78/fuel-pricing-matrix`).

Po nasadení musí platiť:

- `site.css?ver=2.3.11` a `configurator.js?ver=2.3.11`
- šírka = e-shop (1400 px, padding 70px 5 %)
- pravý rámik súhrnu **pevná výška** = štyri dlaždice; rámik sa nehýbe a nerastie s obsahom
- hýbe sa len obsah k aktívnemu oknu (bližšie k stredu)
- **nie** CSS sticky z 2.3.10
- riadok: `100 kg · 4 × 25 kg · 0,89 €/kg` — bez druhého „100 kg“
