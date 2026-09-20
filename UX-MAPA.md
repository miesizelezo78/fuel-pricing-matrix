# Mapa ciest — kováčske palivá

**Stav: schválené.** Landing homepage sa graficky nemení. Ľavá dlaždica „Kováčske palivá“ ostáva vizuálne ako je a posiela na sprievodcu `/kovacske-paliva/`. Odtiaľ sa cesty rozdelia.

Pozreté naostro 20. 9. 2026:

- [Sprievodca](https://staging.vulcanus.sk/kovacske-paliva/)
- [Obchod / Kováčske palivá](https://staging.vulcanus.sk/?ukazka=obchod&rodina=kovacske-paliva)
- Woo produkty: [uhlie](https://staging.vulcanus.sk/produkt/kovacske-cierne-uhlie-25-kg), [antracit](https://staging.vulcanus.sk/produkt/kovacsky-antracit-25-kg), [koks](https://staging.vulcanus.sk/produkt/kovacsky-koks-20-kg)
- [Paletová objednávka](https://staging.vulcanus.sk/objednavka-paleta/) — dnes **iný web** (vlastná hlavička Figtree / Fraunces)
- [`/paliva/`](https://staging.vulcanus.sk/paliva/) — **tretí katalóg**, ktorý nikto v G3 menu nechce

---

## Od homepage (landing)

Homepage (`/`) sa **nekreslí znova**. Tri veľké dlaždice 01 / 02 / 03, hero, sortiment dole — ostávajú.

Ľavá dlaždica **01 / PRE REMESLO · Kováčske palivá** už ide na `/kovacske-paliva/` (sprievodca). To je správny vstup do tejto cesty. **Nepresmerúvať ju na e-shopový filter** s troma vrecami — tam by človek obišiel video a charaktery ohňa.

Dole na homepage je celý obchod (Pantarol, Owatrol, tri vrecia…). To nie je tá cesta z ľavej dlaždice. Kto chce rovno košík, ide cez E-shop / filter. Kto klikne Kováčske palivá, ide **najprv čítať**, potom sa rozhodne.

Klik na ľavú dlaždicu **nie je** vstup do troch Woo dlaždíc, sprievodcu a 100 kg v jednom gride. To by bolo obídenie videa. Tri vrecia + tri karty od 100 kg + sprievodca dole sú **v obchode**, iné dvere.

```
Homepage ──ľavá dlaždica Kováčske palivá──► Sprievodca /kovacske-paliva/
                                              │
                                              ├── Pozrieť uhlie / antracit / koks → Woo vrece → košík
                                              ├── Vrecia s doručením → obchod, filter Kováčske palivá
                                              └── Od 100 kg → konfigurátor (?palivo=)
```

---

## Tri miestnosti

Zákazník potrebuje tri veci, nie štyri obchody.

| Miestnosť | URL | Čo tam je | Čo tam nie je |
| --- | --- | --- | --- |
| **Sprievodca** | `/kovacske-paliva/` | Video z vyhne, tri charaktery ohňa, prečo uhlie ≠ antracit ≠ koks | Cenník, košík, šesť nákupných dlaždíc |
| **Obchod** | `/?ukazka=obchod&rodina=kovacske-paliva` | G3 dlaždice `vd-card`: 3× vrece s doručením (Woo) + 3× od 100 kg (nie Woo) | Vlastný katalóg `/paliva/`, kreslené vrecia namiesto fotiek |
| **Paleta** | `/objednavka-paleta/?palivo=uhlie` | Konfigurátor kg / mix / SuperFaktúra **v G3 hlavičke a pätičke** | Druhá lišta Palivá · Paleta · Ako to predávame |

```
Sprievodca ──chcem vrece──► Obchod ──Do košíka──► Woo produkt ──► košík
    │                         │
    │                         └──od 100 kg──► Paleta (konfigurátor)
    │                                            ▲
    └──chcem pochopiť oheň◄── sprievodca z obchodu / z produktu
```

Žiadna štvrtá izba. `/paliva/`, `/palivo/uhlie-25kg` a `/ako-to-predavame/` ako ostrov s vlastnou témou **zrušiť** (redirect, nie druhý shop).

---

## Cesty, ktoré zákazník má prejsť

### 1. „Aké palivo do vyhne?“

Landing homepage **nekreslí** nové palivové karty. Ľavá dlaždica ostáva sprievodcom.

Na **sprievodcovi** `/kovacske-paliva/` sú tri portréty (Uhlie / Antracit / Koks), nie cenník.  
Tlačidlo na portréte: **Pozrieť vrece** → Woo produkt.  
Dole: **Vrecia s doručením** → obchod s filtrom Kováčske palivá. Jedna cesta **od 100 kg** na konfigurátor.

### 2. „Chcem 1–4 vrecia kuriérom.“

E-shop → filter **Kováčske palivá** → G3 karta (fotka, názov, zrnitosť, Vrece · 25 kg, cena s/bez DPH, **Do košíka**, **Pozrieť produkt**) → Woo detail so skutočným produktom.

Klik z landingu „Pozrieť uhlie“ ide **na ten istý** `/produkt/kovacske-cierne-uhlie-25-kg`, nie na `/palivo/uhlie-25kg`.

### 3. „Chcem od 100 kg.“

V obchode (filter Kováčske palivá) je poradie **nákup hore, čítanie dole**:

1. tri Woo vrecia s doručením  
2. tri karty od 100 kg (ten istý `vd-card`)  
3. až potom dlaždica sprievodcu — kto už kupuje, sprievodcu hľadá ako druhú vec  

| Ako vyzerá Woo karta dnes | Ako vyzerá karta od 100 kg |
| --- | --- |
| fotka paliva | tá istá fotka |
| eyebrow `Kováčske palivá` | `Kováčske palivá` |
| `Kováčske čierne uhlie – 25 kg s doručením` | `Kováčske čierne uhlie – od 100 kg` |
| `Vrece · 25 kg` | `Na objednávku · od 100 kg` |
| `Do košíka` + `Pozrieť produkt` | **K objednávke** (žiadny košík) |
| Woo SKU `VUL-PAL-UHL-25` | **nie je produkt** — `href=/objednavka-paleta/?palivo=uhlie` |

Na detaile vreca ostáva Grokova dlaždica **OD 100 KG** s `?palivo=` pre to palivo. To je správny skratka, nie slučka.

---

## Čo je teraz slučka / slepá ulička

1. **Tretí katalóg.** `/paliva/` kreslí šesť vlastných dlaždíc, SVG vrecia, ceny 28,90 €. Woo má 40 / 42 / 39 € a G3 karty. Zákazník nevie, ktorý obchod je pravý. G3 menu na `/paliva/` ani neukazuje — ostrov.
2. **Falošný detail.** Klik na „uhlie 25 kg“ z `/paliva/` ide na `/palivo/uhlie-25kg`, nie do Woo. Košík tam nie je ten istý.
3. **Paleta je iný web.** `/objednavka-paleta/` má vlastnú hlavičku „Kováčske palivá / Palivá / Paleta / Ako to predávame“ a inú pätičku. Z G3 webu človek vypadne.
4. **Jedna dlaždica namiesto troch.** V obchode aj na landingu je jeden pruh „OD 100 KG“. Chýbajú tri karty v dizajne Woo, klikateľné na konkrétne palivo.
5. **Názov „solo / Solovrecia“.** Nikde v G3 sa tak nevolá. Woo hovorí **s doručením**. Landing hovorí **Vyberte vrece s doručením v SR.**

Slučka, ktorú **necháme** (je v poriadku):

Obchod ↔ Sprievodca. Učiť sa a nakupovať sú dve miestnosti. Z košíka sa do sprievodcu nevracia.

---

## Názov namiesto „solo“

V UI sa slovo **solo** nepoužíva.

| Namiesto | Použiť |
| --- | --- |
| Solo vrecia / Solovrecia | **Vrecia s doručením** |
| E-shop · kuriér | **s doručením** (už je v názve Woo produktu) |
| Solo nákup | **Košík** / **Vrece s doručením** |

Interný kód (`channel: "solo"`) môže ostať. Zákazník ho nesmie vidieť.

---

## Čo ostane na landingu

Už tam je správna kostra. Len ju nezahlcovať druhým obchodom.

- Hero + video (strih z vyhne — Grok, keď bude Final Cut)
- Tri portréty palív (fotka, krátky charakter, odkaz na Woo vrece)
- Jeden odkaz do obchodu: **Vrecia s doručením**
- Jedna veta o 100 kg s odkazom **do obchodu** (kde uvidí tri karty od 100 kg), nie druhý konfigurátor
- G3 hlavička E-shop / Corten / Kontakt, pätička Žilina + Bytča — nesahej

---

## Čo ostane v obchode

Filter **Kováčske palivá** už existuje (`data-kind="kovacske-paliva"`). Pri `?rodina=kovacske-paliva` sa má hneď zapnúť, nie ostávať na „Všetky produkty“.

Poradie v gride:

1. Kováčske čierne uhlie – 25 kg s doručením  
2. Kováčsky antracit – 25 kg s doručením  
3. Kováčsky koks – 20 kg s doručením  
4. Kováčske čierne uhlie – od 100 kg  
5. Kováčsky antracit – od 100 kg  
6. Kováčsky koks – od 100 kg  

Karty 4–6 **nie sú** Woo simple product. Žiadne SKU `KP-UHLIE-100`. Žiadne Do košíka.

Dole ostáva dlaždica **Sprievodca palivami** → `/kovacske-paliva/`. Generický pruh „Objednávka od 100 kg“ môže zmiznúť, keď budú tri karty.

Na detaile vreca: fotka, popis, množstvo, **Pridať do košíka**, súvisiace dve vrecia, sprievodca, **Od 100 kg** tohto paliva.

---

## Ceny na susedných kartách

Woo na stagingu berie referenciu z vulcanus.sk (12. 9. 2026): uhlie 40 €, antracit 42 €, koks 39 €.  
Cursorov cenník palety (0,89 €/kg …) je **vzorový** a nesedí vedľa 40 € vreca.

Na kartách od 100 kg **nedávať** zatiaľ číslo €/kg. Text: **Cena podľa množstva** / **K objednávke**. Čísla žijú v konfigurátore, kým sa cenník nezjednotí.

---

## Kto čo kreslí

| Grok Bot (staging, G3, Woo) | Cursor (tento repo, konfigurátor) |
| --- | --- |
| Landing ostáva sprievodca | Logika kg, rebrík, mix, SuperFaktúra |
| 3 Woo karty vrecí — nemeň SKU, fotky, popisy, Do košíka | Plugin **bez** vlastnej hlavičky/pätičky |
| 3 nové G3 karty od 100 kg v tom istom gride | `?palivo=uhlie\|antracit\|koks` už konfigurátor vie |
| Konfigurátor vsunúť do `get_header()` / `get_footer()` | Po schválení mapy prispôsobí markup, nie druhý shop |
| Redirect `/paliva/` a `/palivo/…` preč | `/paliva/` v Next náhľade už nie je ostrý obchod |
| Menu: žiadne Palivá · Paleta · Ako ako druhá lišta | Neťahá Figtree/Fraunces do G3 |

Identita, zaoblenia, fonty, pätička Žilina/Bytča — **len Grok**. Cursor ich nekreslí.

---

## Redirecty po schválení

| Odkiaľ | Kam |
| --- | --- |
| `/paliva/` | `/?ukazka=obchod&rodina=kovacske-paliva` |
| `/palivo/uhlie-25kg` | `/produkt/kovacske-cierne-uhlie-25-kg` |
| `/palivo/antracit-25kg` | `/produkt/kovacsky-antracit-25-kg` |
| `/palivo/koks-20kg` | `/produkt/kovacsky-koks-20-kg` |
| `/ako-to-predavame/` | `/kovacske-paliva/` (krátky odstavec o dvoch režimoch môže žiť na landingu) |

---

## Čo neschvaľujeme týmto dokumentom

- Zmenu Woo cien 40 / 42 / 39
- Import paletových SKU do košíka
- Novú podstránku `/paliva/` v Bricks
- Druhú hlavičku na konfigurátore
