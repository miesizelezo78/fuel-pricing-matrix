# HOTOVO — 2.3.2

**Jeden súbor. Jedna URL.**

```
https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta-2.3.2.zip
```

Overené: HTTP 200, 38 162 B, zip sa otvorí. Vnútri `PLUGIN-VERSION` = `2.3.2` a `bulk-paleta/`.

```
curl -L -o vulcanus-bulk-paleta-2.3.2.zip \
  https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta-2.3.2.zip
unzip vulcanus-bulk-paleta-2.3.2.zip
```

Do Local vymeň **celý** `bulk-paleta/` (ak máš dva pluginy, oba rovnako). Aktivuj jeden. Permalinks → Save. `site.css?ver=` musí byť **2.3.2**.

Staging nahrávaš ty. Cursor SFTP nerobí.

## Čo je v 2.3.2

1. Jedno viditeľné H1: `Kováčske palivá od 100 kg`. Bricks `Objednávka palety` tesne pred shortcode plugin skryje.
2. Panel **Súhrn objednávky**.
3. Širší `#brx-content`, väčšie písmo.
4. Odstup pod sticky hlavičkou.
5. DPH rozpis až po IČ DPH.

Shortcode ostáva `[vulcanus_paleta]`.

## Smoke

`/objednavka-paleta/?palivo=antracit` — jedno H1, súhrn vpravo, antracit 250 kg = 315 €.
