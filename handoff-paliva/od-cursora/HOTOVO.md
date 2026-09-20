# HOTOVO — 2.3.2 pre staging `/objednavka-paleta/`

**PLUGIN-VERSION: 2.3.2**

Cloud VM **nevidí** Mac cestu  
`/Users/xyz/Documents/ChatGPT/VULCANUS Eshop/Správa e-shopu/handoff-paliva/od-cursora/`  
Skopíruj sem z clone (alebo rozbaľ zip).

## Odkiaľ vziať súbory

**A. Git (hlavný zdroj)**

```
git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git
cd vulcanus-bulk-paleta
cat PLUGIN-VERSION
# 2.3.2
grep Version bulk-paleta/bulk-paleta.php
# * Version: 2.3.2
```

Do Mac handoffu skopíruj:

```
handoff-paliva/od-cursora/HOTOVO.md
handoff-paliva/od-cursora/PLUGIN-VERSION
handoff-paliva/od-cursora/vulcanus-bulk-paleta-2.3.2.zip
```

a celý priečinok `bulk-paleta/` z clone.

**B. Zip (ak git nejde)**  
V clone: `handoff-paliva/od-cursora/vulcanus-bulk-paleta-2.3.2.zip`  
Obsah: `PLUGIN-VERSION` + `HOTOVO.md` + `bulk-paleta/`.

Staging **nenahrávam**. Ty Local → SFTP.

## Čo vymeniť

Celý `bulk-paleta/` z tohto balíka. Ak Local drží **oba**:

- `wp-content/plugins/vulcanus-shop-demo/bulk-paleta/`
- `wp-content/plugins/vulcanus-bulk-paleta/`

vymeň **oba**. Deaktivuj a znova aktivuj jeden. Permalinks → Save.  
Staging dnes ťahá `site.css?ver=2.3.0` — po výmene musí byť `?ver=2.3.2`.

Shortcode ostáva `[vulcanus_paleta]` v G3 chrome. Plugin nekreslí dokument, menu Palivá·Paleta·Ako, Figtree.

## 4 body oproti 2.3.0 (hotové v plugine)

Na stagingu 20. 9. 2026 boli **dve H1** hneď za sebou:

```
<article id="brx-content">
  <h1>Objednávka palety</h1>          ← Bricks / WP titulok
  <div class="vulcanus-config">
    <h1>Paletový predaj od 100 kg</h1> ← starý plugin
```

**2.3.2:**

1. **Jedno viditeľné H1.** Plugin kreslí `Kováčske palivá od 100 kg`. Súrodenecké `h1` tesne pred `.vulcanus-config` skryje CSS + JS (`hidden`). V Bricks ten H1 aj tak zmaž, keď môžeš.
2. Panel **Súhrn objednávky** (nie Živý prepočet).
3. Šírka: `#brx-content:has(.vulcanus-config)` → `max-width: 86rem`, bez Bricks 15 % paddingu. Desktop písmo ~18 px.
4. Odstup pod sticky G3 hlavičkou: padding `#brx-content` 2.5–3 rem; sticky súhrn `top: 6.75rem`. Spacer `.vd-site-spacer` nesahe.

Plus z 2.3.1/2.3.2: DPH rozpis až po IČ DPH; názvy palív ako Woo.

## Ty v Bricks (odporúčané, plugin to obíde)

- Zmaž Heading „Objednávka palety“ na stránke 226.
- Shortcode nie v úzkom stĺpci.
- Rank Math title: `Kováčske palivá od 100 kg | VULCANUS`.
- Homepage a Woo vrecia nemente.

## Smoke

1. `/objednavka-paleta/?palivo=antracit` — **jedno** H1 „Kováčske palivá od 100 kg“. Žiadne „Objednávka palety“ ani „Paletový predaj“.
2. Široká sekcia, čitateľné písmo, obsah nesedí pod hlavičkou.
3. Pravý panel: **Súhrn objednávky**.
4. Antracit 250 kg → tovar 260 €, doprava 55 €, spolu 315 €.
5. Fyzická osoba = jedna suma. Firma + IČ DPH = základ + DPH 23 %.
6. `site.css?ver=2.3.2`.

## Zakázané

- Celý HTML dokument z pluginu
- Figtree / Fraunces / druhá lišta
- Paletové SKU do Woo
- Staging SFTP z Cursoru
- Písať klientovi — nasadíš ty
