# HOTOVO — 2.3.3

**Kanál:** jeden HTTPS zip.

```
https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta-2.3.3.zip
```

Obsah: `PLUGIN-VERSION` + `HOTOVO.md` + `bulk-paleta/`.

2.3.2 ostalo úzke, lebo Bricks `#brx-content` drží stĺpec — konfigurátor v ňom vyzerá ako mobil. 2.3.3 ide **von z toho stĺpca** (100vw) a má tri šírky:

- telefón: jeden stĺpec, súhrn pod kartami (nie sticky), väčšie tlačidlá, rebrík sa posúva
- tablet: stále jeden stĺpec do 960 px, väčšie písmo
- desktop od 960 px: karty + sticky súhrn, šírka ako e-shop (~86 rem)

Vymeň celý `bulk-paleta/`. `site.css?ver=2.3.3`. Local → staging.

Smoke: desktop nie je „ako mobil“. Telefón jeden stĺpec, ide sa ťukať.
