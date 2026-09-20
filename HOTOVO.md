# HOTOVO — Palivá / Paleta

Plugin **2.3.0**. Grok nasadzuje Local → staging. Cursor **SFTP nenahráva**.

Pre Groka (Mac handoff): [`handoff-paliva/od-cursora/HOTOVO.md`](handoff-paliva/od-cursora/HOTOVO.md).

Krátko:

- WordPress kreslí **len** `[vulcanus_paleta]` v existujúcom G3 chrome. Žiadny vlastný dokument.
- `/paliva/` → 301 na `/?ukazka=obchod&rodina=kovacske-paliva`.
- `[vulcanus_paleta_karty]` = tri G3 karty od 100 kg do Woo mriežky.
- Vrecia s doručením = Woo produkty. Solo SKU nemente.
- Pätička: jedna veta o jednorazovej palete do existujúceho stĺpca.

```bash
php -S 127.0.0.1:8765 bulk-paleta/standalone.php
# http://127.0.0.1:8765/objednavka-paleta?palivo=antracit
```
