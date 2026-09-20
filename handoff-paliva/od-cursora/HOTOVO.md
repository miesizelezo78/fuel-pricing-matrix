# HOTOVO — jeden update pre Groka (2.3.2)

**PLUGIN-VERSION: 2.3.2** · `PLUGIN-VERSION` v koreni · `bulk-paleta/bulk-paleta.php` → `Version: 2.3.2`.

Toto je **jeden drop**: DPH v súhrne + šírka/písmo/názvy konfigurátora + SEO pokyny. Nenasadzuj 2.3.1 a potom toto — stačí **2.3.2**.

```
git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git
# alebo: git fetch && git checkout main && git reset --hard origin/main
grep Version bulk-paleta/bulk-paleta.php
# musí byť 2.3.2
```

Staging **nenahrávam**. Ty Local, potom SFTP.

## Čo vymeniť

Celý priečinok `bulk-paleta/` z tohto repa. Ak Local drží **oba**:

- `wp-content/plugins/vulcanus-shop-demo/bulk-paleta/`
- `wp-content/plugins/vulcanus-bulk-paleta/`

vymeň **oba rovnakými súbormi**. Deaktivuj a znova aktivuj jeden (nenechaj dva aktívne). Permalinks → Save.

## Shortcode

`/objednavka-paleta/` (G3 chrome):

```
[vulcanus_paleta]
```

`/objednavka-paleta/hotovo/`:

```
[vulcanus_paleta_hotovo]
```

Woo mriežka Kováčske palivá, **hneď pod tri vrecia**, nie pod sprievodcu:

```
[vulcanus_paleta_karty]
```

Plugin **nekreslí** `get_header` dokument, menu Palivá · Paleta · Ako, Figtree, Fraunces, ani pätičku z náhľadu.

---

## 1. DPH v súhrne (plugin)

Fyzická osoba a živnostník **bez IČ DPH** vidia jednu sumu **Spolu k úhrade** (vrátane DPH), bez rozpisu. Hobikováča daňou nezaťažujeme.

Keď firma vyplní **IČ DPH**, pribudne základ dane + DPH 23 % + tovar s DPH. Signál je IČ DPH, nie rádio „firma“.

SuperFaktúra má daň na doklade **vždy**. To je zákon, nie obrazovka.

Údaje dole sa volajú **Údaje na predfaktúru**.

---

## 2. Dizajn konfigurátora (plugin + ty v Bricks)

Klient: stránka je úzka, písmo maličké, nečitateľné, nadpisy a názvy nesedia.

**Plugin 2.3.2 robí:**

- shortcode `.vulcanus-config` ide na **plnú šírku rodiča** (žiadny vlastný 36–72 rem strop)
- väčšia stupnica: telo ~17 px, lead 18 px, H1 clamp ~2.15–3.4 rem, H2 paliva ~1.5–1.95 rem
- žiadne 0,72 / 0,75 / 0,8 rem v konfigurátore
- **jeden H1:** `Kováčske palivá od 100 kg`
- karty palív: `Kováčske čierne uhlie` / `Kováčsky antracit` / `Kováčsky koks` (ako Woo), eyebrow `Od 100 kg · 25 kg vrece`

**Ty v Bricks — bez tohto ostane úzka aj so 2.3.2:**

1. Shortcode **nie je** v úzkom content stĺpci (720 / 800 / „článok“). Sekcia na šírku ako G3 obchod, nie ako blogový stĺpec.
2. V sekcii **žiadny druhý H1**. H1 kreslí shortcode.
3. Fonty Identity webu. Plugin dedí. Nenaťahuj Figtree/Fraunces.
4. Homepage `/` a ľavú dlaždicu Kováčske palivá **nemente**.

---

## 3. SEO (ty v WP / Rank Math, ja to nemám)

| Pole | Hodnota |
| --- | --- |
| Title | `Kováčske palivá od 100 kg \| VULCANUS` |
| Meta description | `Záväzná paletová objednávka kováčskeho uhlia, antracitu a koksu od 100 kg. Nie e-shopový košík. Paleta je v cene tovaru.` |
| H1 | ten zo shortcode, nepridávaj druhý |
| Slug | `/objednavka-paleta/` (nemeň) |
| Canonical | táto URL |
| OG title | ako Title |

Ak WP titulok ešte je „Paletová objednávka“, plugin ho pri aktivácii zdvihne na „Kováčske palivá od 100 kg“. Rank Math / Yoast **ty**. Obsah Bricks plugin **neprepisuje**.

Hotovo: `Objednávka odoslaná` — `noindex`.

---

## Čo urobíš ty (G3), okrem dizajnu palety

1. **Hub** `/kovacske-paliva/` nesahej na chrome. CTA: vrecia → shop filter; od 100 kg → konfigurátor `?palivo=`. Ľavá dlaždica na homepage ostáva `/kovacske-paliva/`.
2. **Obchod** `?rodina=kovacske-paliva` hneď zapni. Poradie: **3 vrecia s doručením → 3 karty od 100 kg → sprievodca dole.**
3. **Pätička**, jedna veta: *Paleta je jednorazová, nevratná a v cene tovaru.* + odkaz na `/objednavka-paleta/`.
4. Woo SKU vrecí **nemente**. Ceny 40 / 42 / 39. Karty od 100 kg: „Cena podľa množstva“.

## Redirecty (plugin)

| Odkiaľ | Kam |
| --- | --- |
| `/paliva/` | `/?ukazka=obchod&rodina=kovacske-paliva` |
| `/palivo/uhlie-25kg` | `/produkt/kovacske-cierne-uhlie-25-kg` |
| `/palivo/antracit-25kg` | `/produkt/kovacsky-antracit-25-kg` |
| `/palivo/koks-20kg` | `/produkt/kovacsky-koks-20-kg` |
| `/ako-to-predavame/` | `/kovacske-paliva/` |

## Smoke (Local)

1. `/kovacske-paliva/` — G3 chrome, video, tri charaktery.
2. Shop filter — 3 Woo vrecia + 3 karty od 100 kg, sprievodca dole.
3. `/objednavka-paleta/?palivo=antracit` — **široká** sekcia, čitateľné písmo, H1 „Kováčske palivá od 100 kg“, G3 hlavička/pätička. Antracit 250 kg → tovar 260 €, doprava 55 €, spolu **315 €**.
4. Koks 200 kg → tovar 230 €, doprava 39 €, spolu **269 €**.
5. Fyzická osoba = súhrn bez rozpisu DPH. Firma + IČ DPH = základ + DPH 23 %.
6. Title v prehliadači obsahuje „Kováčske palivá od 100 kg“. Jeden H1.
7. `/paliva/` → 301 do shop filtra.

## Zakázané

- Celý HTML dokument z pluginu
- Druhé menu, druhá pätička, Google Fonts Figtree/Fraunces
- Paletové SKU do Woo košíka
- Staging SFTP z Cursoru
- Úzky Bricks stĺpec okolo shortcode
- Druhý H1 nad shortcode

Zdroj: vetva `main`, priečinok `bulk-paleta/`. Mapa: `UX-MAPA.md`.
