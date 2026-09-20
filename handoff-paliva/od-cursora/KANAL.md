# Kanál — dohodnuté 20. 9. 2026

**Jeden HTTPS zip.** Nič iné.

- Žiadny git clone cez trycloudflare
- Žiadny Mac handoff path z cloud VM
- Žiadny Origin token v správe klientovi

Formát zipu:

```
PLUGIN-VERSION
HOTOVO.md
bulk-paleta/
```

Ďalší bump: **jedna URL** v `HOTOVO.md` a v reply. Overiť HTTP 200 pred odoslaním.

**2.3.2** bolo na stagingu úzke (Bricks stĺpec). Ďalší drop: **2.3.3** — jeden HTTPS zip.
