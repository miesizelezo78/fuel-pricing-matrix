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

0. Prečítaj `UX-MAPA.md` v koreni. Kým klient nepovie „kreslite“, **nič na stagingu neprepisuj**. Kanál: [`../KANAL.md`](../KANAL.md).
1. Nezačínaj nový projekt. Otvor **už existujúci** staging webu.
2. Vrecia s doručením (25 kg / 20 kg) ostávajú v e-shopovom košíku. Jedna zásielka = 3 vrecia uhlia/antracitu alebo 4 vrecia koksu. Woo SKU nemente.
3. Od 100 kg **nie je** produkt košíka. V obchode (`?rodina=kovacske-paliva`) tri G3 karty v dizajne `vd-card` s odkazom na `/objednavka-paleta/?palivo=…`. Paletové SKU do košíka nevytváraj.
4. `/paliva/` a `/palivo/…` po schválení redirectni preč. Cudzí tovar a tému nemaž.
5. Keď treba login, zastav sa: *Prihláste sa, prosím. Potom napíšte „som vnútri“.*

## Čo Cursor bude robiť nabudúce

Zmeny výpočtov, cenníka, textu režimov. Opäť sem do `handoff/`. Ty to znovu zapojíš do svojho webu. Klient to nenosí ako USB.
