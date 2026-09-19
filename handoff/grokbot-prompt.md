# Prompt pre Grok Bot — WooCommerce len pre solo vrecia

Pripojte k správe súbory `katalog.json` a `woocommerce-produkty.csv` (prípadne aj tento prompt, ak ho nelepíte celý). V desktopovom composerovi Grok Botu je max. **6 príloh**. Potom vložte text **od čiary nižšie až do konca súboru**.

---

Ahoj. Si môj AI tímak na trvalom cloudovom počítači. Mám WooCommerce e-shop a chcem doň nahráť **len solo vrecia** kováčskych palív (uhlie, antracit, koks). Paletové objemy od 100 kg **do Woo košíka nedávaj**. Nič nepublikuj naostro, kým to výslovne neschválim.

## Čo som pripojil

- `katalog.json` — jediný zdroj pravdy: tovar, vrecia, paleta, ceny, dva režimy predaja. Ceny sú **dohodnuté vzorové sumy s DPH**; štruktúru nemeň, sumy bez opýtania nemeň.
- `woocommerce-produkty.csv` — UTF-8 CSV v schéme WooCommerce Product Importer. Obsahuje **iba 3 simple solo produkty**. `Published = -1` (koncept). Paletové SKU v ňom **nie sú**.

Ak súbory nie sú v prílohe, hľadaj ich na zdieľanom počítači v `/workspace/handoff/`.

## Dva režimy (toto je jadro)

1. **Solo vrecia = Woo / e-shopový košík.** Kuriér SDS, doprava v cene vreca, max. 3 / 4 ks. Toto importuj.
2. **Od 100 kg = nie Woo košík.** Záväzná paletová objednávka s rovnakým cenníkom (€/kg z celkových kíl), údaje mapované na SuperFaktúru (`Invoice.type = order`). Osobný odber vs. paletová preprava; dopravu nacení predajca neskôr, nie checkout Woo. Tento režim žije v náhľadovom shope na `/objednavka-paleta`. **Nevytváraj z neho Woo produkt, variáciu, grouped product ani položku košíka.**

Cenník paliet v JSON je na kontrolu sadzieb a zákaz 250 kg koksu — nie návod na import do košíka.

## Cieľ (hotové = koncepty sola na schválenie, nie live)

1. Prihlás sa do wp-admin tohto WooCommerce. URL e-shopu sa ťa spýtaj, ak ju nemáš. Ak treba login, **zastav sa a nechaj mňa prihlásiť** na tvojom počítači — heslá nehádaj, obchádzanie loginu neskúšaj.
2. Vytvor **jednu predajnú kategóriu**:
   - Vzorky a hobby (kuriér)
   - Kategóriu „Palivá od 100 kg“ ako tovar v katalógu **nevytváraj**. Ak chceš informačnú stránku, daj do nej text, že paleta ide záväznou objednávkou mimo Woo košíka (SuperFaktúra) — **bez Add to cart**.
3. Vytvor **jednu dopravnú triedu**:
   - Kuriér SDS — 0 € (doprava je v cene solo vreca)
   - Paletovú triedu **nenapojuj na Woo checkout**. Paletovú prepravu nacení predajca podľa adresy, mimo košíka.
4. Vytvor **3 simple produkty** (solo vrecia, kuriér):
   - Kováčske uhlie 25 kg — 28,90 € — max. 3 ks — SKU `KP-UHLIE-SOLO`
   - Kováčsky antracit 25 kg — 34,90 € — max. 3 ks — SKU `KP-ANTRACIT-SOLO`
   - Kováčsky koks 20 kg — 32,90 € — max. 4 ks — SKU `KP-KOKS-SOLO`
   Cena už obsahuje balné + SDS. Hmotnosť = kg vreca.
   V popise uveď: viac ako limit kuriéra = paletová objednávka mimo tohto košíka, nie piate vrece.
5. **NEVYTVÁRAJ** variable / simple paletové produkty. **NEIMPORTUJ** SKU `KP-*-PALETA`, `KP-UHLIE-100`, `KP-UHLIE-250`, `KP-KOKS-200` a podobné, aj keby sa objavili v starom CSV. Paleta nie je riadok košíka.
6. **Max. množstvo** Woo samo nemá. Na solo daj min. 1 a max. 3 / 4 (plugin Min/Max Quantities, alebo malý snippet).
7. **Dobierka 2,90 €** = poplatok platobnej metódy (Cash on delivery + fee plugin / checkout fee) **len pre solo checkout**. **Nie** položka v katalógu, **nie** pripočítaná do 28,90 / 34,90 / 32,90.
8. Texty ber zo JSON (slovenčina, skloňovanie vriec). Fotky zatiaľ nedávaj, kým ti nedám obrázky.
9. Produkty nechaj **koncept / draft**. Katalog, košík, checkout naostro nespúšťaj.

## Čo nesmieš urobiť

- Dávať paletu (100 kg+) do Woo košíka — ani ako variáciu, ani ako simple „100 kg“, ani ako „vrece palety“, ktoré sa násobí.
- Simple product „100 kg“, ktorý sa násobí — desať stoviek by nestálo ako tona.
- 250 kg koksu (20 kg vrecia; 250 sa nedelí).
- Miešať kuriér a paletu v jednej dopravnej triede / v jednom checkout.
- Publikuť, mazať cudí tovar, meniť platobnú bránu, objednávať dopravcu.
- Pridávať dobierku do regular price.
- Zapínať Woo predaj paliet „kým nebude SuperFaktúra“ — paleta má iný právny a logistický režim, nie je dočasný košík.

## Ako pracuj

1. Najprv zisti stav e-shopu (už existujúce kategórie, produkty, dopravu, COD). Nič prepisuj bez súpisu. Ak už v shope sú paletové variable produkty z predchádzajúceho pokusu, **daj ich do draftu / vyrad z katalógu** a napíš mi zoznam — nemaž cudí tovar mimo SKU `KP-…` bez opýtania.
2. Fakt zo shopu vs. predpoklad vs. hotové vs. čaká na mňa vs. otázky — píš oddelene.
3. Import: Produkty → Import → CSV, **Update existing products** len ak SKU `KP-…-SOLO` už existujú. Paletové riadky v CSV nie sú. Skontroluj mapovanie stĺpcov.
4. Po importe over: 3 simple solo, žiadny paletový produkt v košíku, trieda kuriér 0 €, ceny ako v JSON, draft.
5. Max. ks a COD doplň v adminovi (CSV meta stĺpce môžu plugin nenaplniť).
6. Daj mi screenshoty: zoznam produktov (koncepty), jeden solo, dopravná trieda kuriér, platba dobierkou s 2,90 €. Paletový produkt na screenshote **nesmie byť**.
7. **Zastav sa.** Naostro až po mojom „publikuj“.

Ak niečo v JSON a CSV nesedí, vyhraj JSON a CSV oprav podľa neho, potom pokračuj. Paletový cenník v JSON nemeň na Woo import.
