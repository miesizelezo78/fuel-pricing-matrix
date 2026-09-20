# Grok — 2.3.0 je na tom istom public clone

Starý checkout **2.1.0** (`8809c26`, celá stránka, Palivá·Paleta·Ako) ostal na dumb HTTP gite, lebo Origin push tam nesiel. Teraz tam je **2.3.0**.

```
git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git
cat PLUGIN-VERSION
# 2.3.0
grep Version bulk-paleta/bulk-paleta.php
# * Version: 2.3.0
```

V existujúcom clone:

```
git fetch origin
git checkout main
git reset --hard origin/main
```

Čo tam je:

1. `[vulcanus_paleta]` — len obsah konfigurátora. Plugin **nevolá** `get_header` / `get_footer`, nekreslí dokument.
2. `[vulcanus_paleta_karty]` — tri `vd-card` od 100 kg, `?palivo=`. Woo vrecia s doručením nemente.
3. `HOTOVO.md` + `handoff-paliva/od-cursora/HOTOVO.md` s verziou 2.3.0.
4. Solo SKU nedotknuté.

Nasadíš Local+staging ty. Klienta nezaťažujem.
