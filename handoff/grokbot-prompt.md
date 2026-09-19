# Prompt pre Grok Bot — WooCommerce katalóg

Pripojte k správe súbory `katalog.json` a `woocommerce-produkty.csv` (prípadne aj tento prompt, ak ho nelepíte celý). V desktopovom composerovi Grok Botu je max. **6 príloh**. Potom vložte text **od čiary nižšie až do konca súboru**.

---

Ahoj. Si môj AI tímak na trvalom cloudovom počítači. Mám WooCommerce e-shop a chcem doň nahráť katalóg kováčskych palív (uhlie, antracit, koks). Nič nepublikuj naostro, kým to výslovne neschválim.

## Čo som pripojil

- `katalog.json` — jediný zdroj pravdy: tovar, vrecia, paleta, ceny, dopravné triedy, dobierka, zákazy. Ceny sú **dohodnuté vzorové sumy s DPH**; štruktúru nemeň, sumy bez opýtania nemeň (ešte ich môžem upraviť pred ostrej prevádzkou).
- `woocommerce-produkty.csv` — UTF-8 CSV v schéme WooCommerce Product Importer. `Published = -1` (koncept). Importuj **len solo vrecia**. Paletové riadky sú cenník, nie košík.

Ak súbory nie sú v prílohe, hľadaj ich na zdieľanom počítači v `/workspace/handoff/`.

## Cieľ (hotové = koncepty na schválenie, nie live)

1. Prihlás sa do wp-admin tohto WooCommerce. URL e-shopu sa ťa spýtaj, ak ju nemáš. Ak treba login, **zastav sa a nechaj mňa prihlásiť** na tvojom počítači — heslá nehádaj, obchádzanie loginu neskúšaj.
2. Vytvor kategóriu **Vzorky a hobby (kuriér)**. Kategóriu paliet do Woo košíka nerob ako predajnú.
3. Vytvor dopravnú triedu **Kuriér SDS — 0 €** (doprava je v cene solo vreca).
4. Vytvor **3 simple produkty** (solo vrecia, kuriér):
   - Kováčske uhlie 25 kg — 28,90 € — max. 3 ks — SKU `KP-UHLIE-SOLO`
   - Kováčsky antracit 25 kg — 34,90 € — max. 3 ks — SKU `KP-ANTRACIT-SOLO`
   - Kováčsky koks 20 kg — 32,90 € — max. 4 ks — SKU `KP-KOKS-SOLO`
   Cena už obsahuje balné + SDS. Hmotnosť = kg vreca.
5. **Paletu do Woo košíka nedávaj.** Od 100 kg to nie je e-shopový produkt, ale tovar na objednávku (konfigurátor + záväzná objednávka do SuperFaktúry). CSV riadky `KP-…-100` atď. sú **cenník na referenciu**, nie položky na import. Nerob variable product ani simple SKU „100 kg“.
6. **Max. množstvo** Woo samo nemá. Na solo daj min. 1 a max. 3 / 4 (plugin Min/Max Quantities, alebo malý snippet). Na každom solo produkte daj v detaile dlaždicu / tlačidlo „Od 100 kg na objednávku“.
7. **Dobierka 2,90 €** = poplatok platobnej metódy (Cash on delivery + fee plugin / checkout fee). **Nie** položka v katalógu, **nie** pripočítaná do 28,90 / 34,90 / 32,90 ani do €/kg.
8. Texty ber zo JSON (slovenčina, skloňovanie vriec). Fotky zatiaľ nedávaj, kým ti nedám obrázky.
9. Produkty nechaj **koncept / draft**. Katalóg, košík, checkout naostro nespúšťaj.

## Čo nesmieš urobiť

- Importovať paletové zostavy ako Woo produkty do košíka.
- Simple product „100 kg“ (alebo „vrece palety“), ktorý sa násobí — desať stoviek by nestálo ako tona.
- 250 kg koksu.
- Miešať kuriér a paletu v jednej dopravnej triede.
- Publikuť, mazať cudzí tovar, meniť platobnú bránu, objednávať dopravcu.
- Pridávať dobierku do regular price.

## Paleta (mimo Woo košíka)

Cenník ostáva v JSON: uhlie/antracit 100 / 250 / 500 / 1 000 kg, koks 100 / **200** / 500 / 1 000 kg. Zákazník ide na objednávkovú podstránku s konfigurátorom, nie do košíka. Ostrý doklad = SuperFaktúra `type: order`.

## Ako pracuj

1. Najprv zisti stav e-shopu (už existujúce kategórie, produkty, dopravu, COD). Nič prepisuj bez súpisu.
2. Fakt zo shopu vs. predpoklad vs. hotové vs. čaká na mňa vs. otázky — píš oddelene.
3. Import: Produkty → Import → CSV, **len solo riadky** (`KP-…-SOLO`). **Update existing products** len ak SKU `KP-…` už existujú. Skontroluj mapovanie stĺpcov.
4. Po importe over: 3 simple solo, max. ks, dopravná trieda kuriér 0 €, ceny ako v JSON, draft. Paletové SKU v košíku nemajú byť.
5. Max. ks, COD a dlaždicu „od 100 kg“ na detaile sola doplň v adminovi.
6. Daj mi screenshoty: zoznam produktov (koncepty), jeden solo s dlaždicou na objednávku, dopravné triedy, platba dobierkou s 2,90 €.
7. **Zastav sa.** Naostro až po mojom „publikuj“.

Ak niečo v JSON a CSV nesedí, vyhraj JSON a CSV oprav podľa neho, potom pokračuj.
