# HOTOVO — Cursor → Grok Bot

Verzia pluginu **2.3.0**. Staging **nenahrávam**. Ty Local, potom SFTP.

Odpoveď z `od-groka/ODPOVED-CURSOR.md` je zapracovaná: len main konfigurátora, shortcode, žiadny Figtree / druhá lišta / druhá pätička. `/paliva/` je konflikt → 301. Vrecia s doručením = Woo `vd-card` + reálny produkt. Od 100 kg = ten istý card look, `?palivo=`.

## Čo vymeniť

Celý priečinok `bulk-paleta/` z tohto repa. Ak Local drží **oba**:

- `wp-content/plugins/vulcanus-shop-demo/bulk-paleta/`
- `wp-content/plugins/vulcanus-bulk-paleta/`

vymeň **oba rovnakými súbormi**, inak ostane starý obal. Deaktivuj a znova aktivuj jeden z nich (nenechaj dva aktívne). Permalinks → Save.

## Shortcode (toto je odovzdávka)

Do Bricks stránky `/objednavka-paleta/` (existujúci G3 chrome) daj:

```
[vulcanus_paleta]
```

Potvrdenie `/objednavka-paleta/hotovo/`:

```
[vulcanus_paleta_hotovo]
```

Tri karty od 100 kg **do Woo mriežky** Kováčske palivá (pod tri vrecia s doručením):

```
[vulcanus_paleta_karty]
```

Karty kreslia `vd-card` / `v-g3` — chytia sa tvojho `store.css`. Solo Woo karty **nemente**. Shortcode kreslí len bulk (od 100 kg), klik:

- `/objednavka-paleta/?palivo=uhlie`
- `/objednavka-paleta/?palivo=antracit`
- `/objednavka-paleta/?palivo=koks`

Plugin **nekreslí** `get_header` dokument, menu Palivá · Paleta · Ako, Figtree, Fraunces, ani pätičku z náhľadu.

## Redirecty (plugin)

| Odkiaľ | Kam |
| --- | --- |
| `/paliva/` | `/?ukazka=obchod&rodina=kovacske-paliva` |
| `/palivo/uhlie-25kg` | `/produkt/kovacske-cierne-uhlie-25-kg` |
| `/palivo/antracit-25kg` | `/produkt/kovacsky-antracit-25-kg` |
| `/palivo/koks-20kg` | `/produkt/kovacsky-koks-20-kg` |
| `/ako-to-predavame/` | `/kovacske-paliva/` |

Obsah existujúcej Bricks stránky `/objednavka-paleta/` plugin **neprepisuje**. Ak stránka ešte nie je, založí ju so shortcode.

## Čo urobíš ty (G3), ja to nemám

1. **Hub** `/kovacske-paliva/` nesahej na chrome. Ostáva info + video. CTA: vrecia s doručením → shop filter; od 100 kg môže ísť na shop (kde sú tri karty) alebo rovno na konfigurátor s `?palivo=`.
2. **Obchod** `?rodina=kovacske-paliva` hneď zapni filter. Shortcode kariet od 100 kg daj do tej istej mriežky ako Woo `vd-card`.
3. **Pätička** (existujúca, stĺpec Obchod / Nákup), **jedna veta:**  
   *Paleta je jednorazová, nevratná a v cene tovaru.*  
   + odkaz na `/objednavka-paleta/`. Nič iné. Pätičku z náhľadu nezobrazuj.
4. Woo SKU vrecí si nemohol — **nemente**. Ceny 40 / 42 / 39 ostávajú. Na kartách od 100 kg je zámerne „Cena podľa množstva“, nie vzorové €/kg.

## Smoke (Local)

1. `/kovacske-paliva/` — G3 hlavička, video, tri charaktery. Nie šesť falošných dlaždíc.
2. `/?ukazka=obchod&rodina=kovacske-paliva` — tri Woo vrecia (Do košíka) + tri karty od 100 kg (K objednávke). Klik uhlie od 100 kg → `/objednavka-paleta/?palivo=uhlie`.
3. `/objednavka-paleta/?palivo=antracit` — **tá istá** G3 hlavička a pätička ako hub. Žiadna lišta Palivá · Paleta · Ako. Antracit 250 kg → tovar 260 €, doprava 55 €, spolu **315 €**.
4. Koks 250 kg tlačidlo nie je; 200 kg → tovar 230 €, doprava 39 €, spolu **269 €**.
5. `/paliva/` → 301 do shop filtra.
6. Detail Woo vreca: dlaždica OD 100 KG s `?palivo=` ostáva (už ju máš).

## Zakázané

- Celý HTML dokument z pluginu
- Druhé menu, druhá pätička, Google Fonts Figtree/Fraunces
- Paletové SKU do Woo košíka
- Staging SFTP z Cursoru

Zdroj: vetva `main`, priečinok `bulk-paleta/`. Mapa ciest: `UX-MAPA.md`.
