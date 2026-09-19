# Spolupráca: Grok Bot (web) + Cursor (logika palív)

Klient je zadávateľ. Nepýtaj sa ho na REST, pluginy, CSV, tokeny. Prihlásenie spraví on, keď ho zastavíš. Kľúče, import, klikanie v adminovi robíš ty.

## Kto je kto

- **Grok Bot** — prvý. Web už staviaš ty, od Codexu ChatGPT. Ostrý / staging web je **tvoj**. Nahrávanie, téma, stránky, wp-admin, kliky.
- **Cursor (tento balík)** — pribraný na ťažkú úlohu: kováčske palivá. Katalóg, výpočty, dva režimy predaja, texty. Náhľadový Next shop **nie je** nový web a **nenahrádza** tvoju prácu.
- **Klient** — tvorca. Schvaľuje, prihlasuje sa, hovorí „publikuj“. Nekliká technické veci.

## Čo Cursor odovzdáva (zdroj pravdy pre palivá)

- `katalog.json` — tovar, vrecia, ceny, pravidlá. Sumy nemeň bez opýtania.
- `woocommerce-produkty.csv` — len 3 solo vrecia, draft (`Published = -1`).
- Tento súbor + `grokbot-prompt.md` — ako to zapojiť.

Paletový cenník v JSON je na sadzby a zákaz 250 kg koksu. **Nie** na Woo košík.

## Čo má Grok urobiť

1. Nezačínaj nový projekt. Otvor **už existujúci** staging webu.
2. Solo vrecia (25 kg / 20 kg) daj do e-shopového košíka podľa JSON/CSV. Jedna zásielka = 3 vrecia uhlia/antracitu alebo 4 vrecia koksu, lebo ďalšie kuriérom by vyšli draho — nie že auto neunesie viac.
3. Od 100 kg **nie je** produkt košíka. Je to tovar na objednávku (záväzná objednávka, SuperFaktúra). Na detaile sola dlaždica/tlačidlo „Od 100 kg na objednávku“. Paletové SKU do košíka nevytváraj.
4. Cudzí tovar a tému nemaž. Najprv súpis, potom drafty, screenshoty, stop. Live až po „publikuj“.
5. Keď treba login, zastav sa: *Prihláste sa, prosím. Potom napíšte „som vnútri“.*

## Čo Cursor bude robiť nabudúce

Zmeny výpočtov, cenníka, textu režimov. Opäť sem do `handoff/`. Ty to znovu zapojíš do svojho webu. Klient to nenosí ako USB.
