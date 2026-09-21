# VULCANUS — kováčske palivá

GitHub repo pre WordPress plugin **bulk-paleta**: konfigurátor paletovej objednávky od 100 kg na existujúci VULCANUS e-shop (`/objednavka-paleta/`).

**Verzia tohto repo: 2.3.11** — jedna pravda v `PLUGIN-VERSION` a v hlavičke `bulk-paleta/bulk-paleta.php`. Pravý rámik súhrnu má pevnú výšku ako štyri dlaždice. Hýbe sa len obsah.

## Plugin

Priečinok `bulk-paleta/` skopíruj do `wp-content/plugins/bulk-paleta/` a aktivuj.

| Shortcode | Účel |
| --- | --- |
| `[vulcanus_paleta]` | konfigurátor (`?palivo=uhlie\|antracit\|koks`) |
| `[vulcanus_paleta_karty]` | tri karty od 100 kg v jazyku `vd-card` |
| `[vulcanus_paleta_hotovo]` | ďakovacia stránka |

Lokálny náhľad bez WordPress:

```bash
cd bulk-paleta
php -S 127.0.0.1:8765 standalone.php
```

Kontrola verzie a vzhľadu: [`HOTOVO.md`](HOTOVO.md). Mapa ciest: [`UX-MAPA.md`](UX-MAPA.md). Kanál medzi agentmi: [`KANAL.md`](KANAL.md).

Cenník a Woo CSV (len vrecia s doručením): [`handoff/`](handoff/). Woo SKU vriec **nemeniť**. Paleta od 100 kg do Woo košíka nepatrí.

## Čo je v katalógu

| Tovar | Vrece | S doručením | Paleta 110 × 120 cm |
| --- | --- | --- | --- |
| Kováčske uhlie | 25 kg | max. 3 vrecia | 40 vriec = 1 000 kg |
| Kováčsky antracit | 25 kg | max. 3 vrecia | 40 vriec = 1 000 kg |
| Kováčsky koks | 20 kg | max. 4 vrecia | 50 vriec = 1 000 kg |
