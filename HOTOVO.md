# HOTOVO — Palivá / Paleta

**PLUGIN-VERSION: 2.3.10** (pravda tohto GitHub repo)

Plugin: `bulk-paleta/`  
Shortcode na `/objednavka-paleta/`: `[vulcanus_paleta]`  
Karty od 100 kg: `[vulcanus_paleta_karty]`

Plugin kreslí **iba** shortcody. Žiadny vlastný dokument, menu, Figtree, druhá pätička. `/paliva/` na webe nie je ostrý obchod (redirect do Woo filtra). Woo vrecia s doručením **nemeniť**.

Po nasadení musí platiť:

- `site.css?ver=2.3.10` a `configurator.js?ver=2.3.10`
- šírka konfigurátora = e-shop (1400 px, padding 70px 5 %)
- desktop súhrn: klasický CSS `position: sticky` na aside/live — **bez** magnetického JS, **bez** `translate` follow
- riadok: `100 kg · 4 × 25 kg · 0,89 €/kg` — **bez** druhého „100 kg“

Mapa ciest: [`UX-MAPA.md`](UX-MAPA.md). Kanál: [`KANAL.md`](KANAL.md).
