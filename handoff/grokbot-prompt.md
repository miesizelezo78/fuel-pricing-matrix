# Prompt pre Grok Bot — WooCommerce katalóg

Pripojte k správe súbory `katalog.json` a `woocommerce-produkty.csv` (prípadne aj tento prompt, ak ho nelepíte celý). V desktopovom composerovi Grok Botu je max. **6 príloh**. Potom vložte text **od čiary nižšie až do konca súboru**.

---

Ahoj. Si môj AI tímak na trvalom cloudovom počítači. Mám WooCommerce e-shop a chcem doň nahráť katalóg kováčskych palív (uhlie, antracit, koks). Nič nepublikuj naostro, kým to výslovne neschválim.

## Čo som pripojil

- `katalog.json` — jediný zdroj pravdy: tovar, vrecia, paleta, ceny, dopravné triedy, dobierka, zákazy. Ceny sú **dohodnuté vzorové sumy s DPH**; štruktúru nemeň, sumy bez opýtania nemeň (ešte ich môžem upraviť pred ostrej prevádzkou).
- `woocommerce-produkty.csv` — UTF-8 CSV v schéme WooCommerce Product Importer. `Published = -1` (koncept). Použi ho na vytvorenie produktov, alebo ho importuj cez Produkty → Import.

Ak súbory nie sú v prílohe, hľadaj ich na zdieľanom počítači v `/workspace/handoff/`.

## Cieľ (hotové = koncepty na schválenie, nie live)

1. Prihlás sa do wp-admin tohto WooCommerce. URL e-shopu sa ťa spýtaj, ak ju nemáš. Ak treba login, **zastav sa a nechaj mňa prihlásiť** na tvojom počítači — heslá nehádaj, obchádzanie loginu neskúšaj.
2. Vytvor **dve kategórie**:
   - Vzorky a hobby (kuriér)
   - Palivá od 100 kg (paleta)
3. Vytvor **dve dopravné triedy**:
   - Kuriér SDS — 0 € (doprava je v cene solo vreca)
   - Paleta — paletová doprava **zvlášť**, nie v cene tovaru. Vzorový odhad je v `katalog.json` → `odhadDopravyPaleta` (100 kg ≈ 39 €, 250 kg ≈ 55 €, 500 kg ≈ 72 €, 1 t ≈ 89 €, Slovensko). Označ to ako odhad na výmenu za tarifu dopravcu.
4. Vytvor **3 simple produkty** (solo vrecia, kuriér):
   - Kováčske uhlie 25 kg — 28,90 € — max. 3 ks — SKU `KP-UHLIE-SOLO`
   - Kováčsky antracit 25 kg — 34,90 € — max. 3 ks — SKU `KP-ANTRACIT-SOLO`
   - Kováčsky koks 20 kg — 32,90 € — max. 4 ks — SKU `KP-KOKS-SOLO`  
   Cena už obsahuje balné + SDS. Hmotnosť = kg vreca.
5. Vytvor **3 variable produkty** (paleta od 100 kg), každý s variáciami zostáv — **nie** štyri samostatné dlaždice a **nie** simple SKU „100 kg“, ktoré sa v košíku násobí:
   - Uhlie: 100 / 250 / 500 / 1 000 kg (4 / 10 / 20 / 40 × 25 kg)
   - Antracit: 100 / 250 / 500 / 1 000 kg
   - Koks: 100 / **200** / 500 / 1 000 kg (5 / 10 / 25 / 50 × 20 kg). **Koks 250 kg neexistuje** — 250 sa nedelí 20 kg vrecom.
   Ceny tovaru (s DPH, bez paletovej dopravy) sú v JSON aj v CSV, napr. uhlie 100 kg = 89,00 €, tona = 680,00 €.
6. **Max. množstvo** Woo samo nemá. Na solo daj min. 1 a max. 3 / 4 (plugin Min/Max Quantities, alebo malý snippet). Na variable bulk nech zákazník berie 1 kus vybranej zostavy.
7. **Dobierka 2,90 €** = poplatok platobnej metódy (Cash on delivery + fee plugin / checkout fee). **Nie** položka v katalógu, **nie** pripočítaná do 28,90 / 34,90 / 32,90 ani do €/kg.
8. Texty ber zo JSON (slovenčina, skloňovanie vriec). Fotky zatiaľ nedávaj, kým ti nedám obrázky.
9. Produkty nechaj **koncept / draft**. Katalog, košík, checkout naostro nespúšťaj.

## Čo nesmieš urobiť

- Simple product „100 kg“ (alebo „vrece palety“), ktorý sa násobí — desať stoviek by nestálo ako tona.
- 250 kg koksu.
- Miešať kuriér a paletu v jednej dopravnej triede.
- Publikuť, mazať cudí tovar, meniť platobnú bránu, objednávať dopravcu.
- Pridávať dobierku do regular price.

## Ak by si chcel radšej plugin namiesto variácií

Lepší model (ako náhľadový shop): bulk sa predáva **po vreciach** (min. 4×25 kg alebo 5×20 kg) a plugin *Tiered Price Table* / *Dynamic Pricing* / *Wholesale Prices* berie sadzbu z **celkových kíl v košíku**. Vtedy 300 kg uhlia správne spadne do stupňa od 250 kg. **Nerob oba modely naraz.** Teraz preferujem CSV variácie (bez nového pluginu, rýchle na schválenie). Plugin navrhnúť môžeš, ale nainštaluj ho len po mojom súhlase.

## Ako pracuj

1. Najprv zisti stav e-shopu (už existujúce kategórie, produkty, dopravu, COD). Nič prepisuj bez súpisu.
2. Fakt zo shopu vs. predpoklad vs. hotové vs. čaká na mňa vs. otázky — píš oddelene.
3. Import: Produkty → Import → CSV, **Update existing products** len ak SKU `KP-…` už existujú. Skontroluj mapovanie stĺpcov.
4. Po importe over: 3 simple + 3 variable + správne variácie koksu (200, nie 250), triedy, kategórie, ceny ako v JSON, draft.
5. Max. ks a COD doplň v adminovi (CSV meta stĺpce môžu plugin nenaplniť).
6. Daj mi screenshoty: zoznam produktov (koncepty), jeden solo, jeden bulk s variáciami, dopravné triedy, platba dobierkou s 2,90 €.
7. **Zastav sa.** Naostro až po mojom „publikuj“.

Ak niečo v JSON a CSV nesedí, vyhraj JSON a CSV oprav podľa neho, potom pokračuj.
