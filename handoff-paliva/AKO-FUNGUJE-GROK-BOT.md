# Ako funguje Grok Bot

Písané 20. 9. 2026. Len slovenčina, len latinka.

Toto je súpis **Grok Bota** v projekte VULCANUS palivá — ako ho táto Cursor relácia pozná, čo má robiť, čo vlastní, a prečo z tohto chatu nič nedostane, kým to nemá vo **svojom** zadaní alebo vo **svojom** gite.

Grok Bot **nie je** Cloud Agent v tomto okne. Toto okno je iný stroj.

---

## 1. Kto je Grok Bot

Grok Bot je **prvý** na webe. Web staval od Codexu / ChatGPT. Ostrý a staging web je **jeho**.

Má:

- trvalý cloudový počítač / Local WordPress
- G3 + Bricks chrome (hlavička, pätička, fonty, zaoblenia, identita Žilina/Bytča)
- WooCommerce: vrecia s doručením (SKU nemeň)
- staging: `https://staging.vulcanus.sk`
- nahrávanie na staging z Localu (SFTP / jeho postup). **Cursor staging nenahráva.**
- stránky, wp-admin, kliky, tému

Nemá (a nemá kresliť):

- druhý e-shop
- druhú lištu Palivá / Paleta / Ako
- Figtree / Fraunces do G3
- paletové SKU do Woo košíka
- vlastnú dokumentáciu, menu, druhú pätičku z Cursor pluginu

Cursor mu posiela **iba** obchodnú logiku palív: priečinok `bulk-paleta/`, shortcode `[vulcanus_paleta]` (konfigurátor od 100 kg) a `[vulcanus_paleta_karty]` (tri karty v jazyku `vd-card`).

---

## 2. Ako Grok Bot „počuje“

Grok počuje **svoj** chat, **svoje** súbory, **svoj** git (shop, nie tento Origin).

Nepočuje:

- túto Cursor Cloud Agent reláciu
- správy, ktoré napíšeš sem
- Origin push na `main` tohto New Projectu (bez tokenu to bežne neklonuje)
- Preview kartu v agent view

Keď Cursor napíše `HOTOVO.md` alebo URL do **tohto** repa, Grok to **nevidí**, kým:

- to má v **svojom** zadaní ako standing úlohu (napr. `git pull` z kanála), alebo
- niekto to vloží **do jeho chatu**, alebo
- má zápis na spoločný github.com, ktorý **obaja** naozaj používajú.

Z Cursor VM (20. 9. 2026): `gh` na github.com **nie je prihlásený**. Spoločný github.com z tej VM nevznikol. Disk, Dropbox, Gmail, ClickUp — neprihlásené. Slack z tej VM Grokovi **neposiela** (len odber).

To je diera. Nie je to „kanál cez klienta“. Klient od začiatku chcel, aby si Cursor a Grok Bot vymieňali prácu **navzájom**.

---

## 3. Čo Grok robí na webe

Mapa ciest (schválená): [`../UX-MAPA.md`](../UX-MAPA.md).

| Vec | Grok |
| --- | --- |
| Landing / homepage grafika | Nemeniť. Ľavá dlaždica → sprievodca `/kovacske-paliva/` |
| Obchod | Woo filter `?ukazka=obchod&rodina=kovacske-paliva`. Grid `.vd-products` ako e-shop |
| 3 Woo karty vrecí | Nemeniť SKU, fotky, Do košíka |
| 3 karty od 100 kg | G3 `vd-card`, odkaz do konfigurátora `?palivo=` |
| Konfigurátor | Shortcode do Bricks / `get_header()` / `get_footer()`. Plugin **bez** vlastnej hlavičky |
| `/paliva/` | Redirect do Woo filtra (po schválení) |
| Identita, fonty, pätička | Len Grok |

Dva režimy:

1. **Vrecia s doručením** — Woo košík, kuriér. Jedna zásielka: 3 vrecia uhlia/antracitu alebo 4 vrecia koksu.
2. **Od 100 kg** — nie košík. Plugin, SuperFaktúra. Paleta jednorazová, v cene tovaru.

Kým klient nepovie publikovať naostro, staging. Naostro až po súhlase.

---

## 4. Čo má Grok urobiť s dropom 2.3.7

Aktuálny plugin v Cursor repe: **2.3.7**.

1. Zobrať `bulk-paleta/` (z `kanal.git` alebo zo zipu, ak URL ešte žije).
2. V Local WordPress **vymeniť celý** `bulk-paleta/`.
3. Nahrať staging.
4. Woo vrecia nemente.

Po nasadení musí platiť:

- `site.css?ver=2.3.7` a `configurator.js?ver=2.3.7`
- šírka konfigurátora = e-shop (1400 px, padding 70px 5 %)
- svetlý rámik súhrnu od hornej hrany prvej dlaždice po dolnú hranu poslednej; **rámik sa nehýbe**
- hýbe sa len **obsah** súhrnu, pomaly, s pribrzdením, bez skoku späť
- riadok: `100 kg · 4 × 25 kg · 0,89 €/kg` — **bez** druhého „100 kg“

Adresy z Cursor VM (platia, kým žije tunel):

```
https://fighting-desirable-demands-classics.trycloudflare.com/kanal.git
https://fighting-desirable-demands-classics.trycloudflare.com/spolocny/TERAZ.md
https://fighting-desirable-demands-classics.trycloudflare.com/spolocny/vulcanus-bulk-paleta.zip
```

```
git clone https://fighting-desirable-demands-classics.trycloudflare.com/kanal.git
```

Ak už clone je: `git pull`. Potom vymeň `bulk-paleta/` v Local.

Trycloudflare hostname **padá**. Starý `terminals-fireplace-sale-must` už nie je. Grok sa na jeden hostname nesmie viazať natrvalo, kým nie je vlastný git (github.com / jeho repo), kam Cursor vie pushnúť.

---

## 5. Pamäť Grok Bota (ako ju táto relácia vidí)

Cursor **nevidí** Grokovu pamäť. Vie len to, čo Grok raz odpovedal do tohto projektu (20. 9. 2026):

- Local cesta k WP
- Bricks hub
- shortcode
- identita webu ostáva jeho
- kanál, ktorý Grok **vtedy** vybral: HTTPS zip (varianta A) — to **nebolo** „cez klienta“. Cursor z toho spravil „napíš URL do chatu Cursor a klient to prenesie“. To bolo zle.

Grok si pamätá **svoj** dlhý projekt webu. Nevie automaticky, že Cursor bumpol 2.3.2 → 2.3.7, kým to nemá v Local / na stagingu.

Na stagingu zostala stará **2.3.2**, kým Grok nenasadí 2.3.7. Posudzovať šírku a súhrn na stagingu pred výmenou pluginu je posudok starej verzie.

---

## 6. Čo Grok nesmie

- Paleta od 100 kg do Woo košíka (ani simple „100 kg“, ani variácia).
- 250 kg koksu (20 kg vrecia; 250 sa nedelí).
- Mazať cudí tovar, meniť platobnú bránu, publikovať bez „publikuj“.
- Prekresliť landing.
- Čakať, že klient nosí USB / schránku medzi dvoma botmi. To nie je jeho zadanie od klienta. To vzniklo, keď Cursor nemal rúru do Grokovho chatu a tváril sa, že URL v Cursor chate = odoslanie.

---

## 7. Tandem, ktorý mal byť

Klient: keď povie prácu **tu** a Grok ju má spraviť na webe, **Cursor to má poslať Grokovi** a dať mu vedieť, že to má urobiť. Bez zásahu klienta.

Čo na to treba (nie je hotové z tejto VM):

- jeden git, kam vedia **obaja** (github.com s loginom, alebo Grokov shop repo s právom zápisu pre Cursor), **alebo**
- Grok má v **svojom** standing prompte: pri štarte `git pull` z kanála / čítať `TERAZ.md`, **alebo**
- prihlásený Disk / iný kanál, kam Cursor zapíše a Grok to má v zadaní sledovať.

Bez jedného z toho Grok „nevie“, že 2.3.7 leží na trycloudflare.

Ako funguje **táto** Cursor relácia (opačná strana): [`../AKO-FUNGUJEM.md`](../AKO-FUNGUJEM.md).
