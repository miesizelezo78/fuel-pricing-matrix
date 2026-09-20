# Ako fungujem — táto relácia (Cursor Cloud Agent)

Písané 20. 9. 2026. Slovenčina. Žiadna ruština.

Toto nie je marketing. Toto je, čo táto relácia **naozaj** je, čo vidí, čo nepíše Grok Botovi do chatu, a kde leží tvoja práca, keď ju berieš preč.

---

## 1. Čo som

Som jazykový model **Cursor Grok 4.6** (SpaceXAI + Cursor). Bežím ako **Cloud Agent**: nie v tvojom Cursor okne na Macu ako lokálny tab, ale na vzdialenom Linuxe.

- Relácia: Cloud Agent, spustená z New Project / agent view.
- VM: Linux, shell `bash`, pracovný adresár `/workspace`.
- Vetva: `main`.
- Tvoje meno v relácii: miesizelezo. Rola: Designer.

Keď píšeš sem, text ide do **tohto** agenta. Keď píšeš Grok Botovi v **inom** chate (iný stroj, iný web, iný Cursor agent), ja to nevidím. On nevidí toto.

---

## 2. Ako komunikujem „túto stránku“ (agent view)

„Táto stránka“ je Cursor UI relácie agenta (`cursor.com/agents/…`).

Tok:

1. Ty napíšeš správu v agente.
2. Systém mi ju doručí ako `user_query` plus kontext (git stav, pravidlá, zhrnutie histórie keď sa kontext zaplní).
3. Ja môžem volať nástroje (súbory, shell, vyhľadávanie, MCP, podagenti).
4. Na konci turnu ide odpoveď **sem**, do tohto chatu.
5. Ak treba náhľad webu, môžem emitovať Preview kartu s URL lokálneho dev servera. Klik na Preview otvára Desktop; server má ostať bežať.

Čo **nie** je táto stránka:

- Nie je to staging.vulcanus.sk.
- Nie je to Grok Botov chat.
- Nie je to github.com (pozri §6).
- Nie je to WordPress admin.

Grok Bot z tejto stránky **nedostane** notifikáciu. Žiadny webhook z tohto chatu k nemu neexistuje. To som mal povedať na začiatku a namiesto toho som to obchádzal zipmi a priečinkami.

---

## 3. Ako komunikujem s Cursorom

Cursor tu nie je „druhý človek“. Cursor je:

- **UI**, kam píšeš.
- **Orchestrátor**: spustí VM, nainštaluje prostredie, vloží nástroje, uloží git remote, pošle mi tvoje správy.
- **Nástroje**, ktoré volám (Read, Write, Shell, git push, …).
- **Origin git** (nie GitHub), kam commitnem a pushnem.

Keď povieš „Cursor“, v tejto relácii som to ja + táto VM. Keď povieš „Grok Bot“, to je **iný** proces na **inom** počítači (trvalý cloud / Local WordPress, staging, G3, Woo). Spojenie medzi nami som **nevytvoril**. Z tejto VM jeho chat neotvorím, mail mu nepošlem (Gmail MCP nie je prihlásený), Slack mu nepošlem (viem sa len prihlásiť na odber, nie posielať), Disk/Dropbox/ClickUp nie sú prihlásené, `gh` nie je prihlásený na github.com.

---

## 4. Pamäť — čo si pamätám a čo nie

### 4.1 Táto konverzácia

Pamätám si správy v **tejto** relácii. Keď je kontext plný, systém mi dá **zhrnutie** starších turnov. To nie je tvoja hlava a nie je to Grok. Je to kompresia chatu. Detaily sa strácajú. Po zhustení som napríklad pokračoval v úlohe „zip do priečinka / staging“, nie v tom, že ty chceš **priame** spojenie Cursor → Grok bez teba ako kuriéra. To je chyba systému + moja, nie tvoj príkaz.

### 4.2 Agent store

Existuje persistent store tejto relácie:

`/cursor/stores/self` → `bc-6ebc62a8-d566-44f8-bd31-c9cfd047779e`

Do neho som **neukladal** dohodu o spoločnom GitHube ani zákaz ruštiny ako trvalú pamäť. Ďalšia relácia to teda nemusí vedieť, kým to nie je v súbore v gite.

### 4.3 Čo si nepamätám

- Iné Cursor relácie (okrem zoznamu cloud agentov na **tom istom** Origin repe — to sú staré podagenti typu „Review pallet demo“, nie Grok Bot na webe).
- Grok Botovu históriu, jeho Local cestu, jeho GitHub shop, kým mu ju niekto nedá **v tejto** relácii.
- Čo si napísal Grokovi mimo tohto okna.
- Stav stagingu po tom, čo Grok nahrá súbory — kým si to tu neoverím requestom.

### 4.4 Čo som mal v zhrnutí relácie (produkt)

- Palivá: Woo vrecia vs paleta od 100 kg (SuperFaktúra).
- Landing grafika sa nemení. Ľavá dlaždica → `/kovacske-paliva/`. Obchod = iné dvere.
- DPH: hobby jedna suma; IČ DPH odomkne rozpis.
- Cursor nahráva staging **SFTP-om nie**. Staging nahráva Grok z Localu.
- UI slovensky. Konfigurátor šírka ako e-shop (1400 px), nie širší.
- Súhrn: svetlý rámik od hora prvej dlaždice po dol poslednej; hýbe sa len obsah, pomaly s pribrzdením.
- V súhrne bez duplicitného „100 kg“: `100 kg · 4 × 25 kg · 0,89 €/kg`.
- Ruština v tejto relácii zakázaná (tvoj príkaz 20. 9. večer).

---

## 5. Čo na VM robím (nástroje)

Bežný cyklus:

1. Čítam / píšem súbory v `/workspace`.
2. Spúšťam shell (git, zip, php, curl, Chrome CDP).
3. Commit + `git push -u origin main`.
4. Dev servery: Next na porte okolo `43147`, PHP náhľad pluginu `127.0.0.1:8765`.
5. Zip a git kanál cez `python3 -m http.server` na `43993` + cloudflared (trycloudflare hostname sa **mení**, keď tunel spadne).
6. MCP: Drive, Dropbox, Gmail, ClickUp — v tejto relácii `needsAuth`, nepoužité.
7. Podagenti (computerUse na kliky v prehliadači) — raz spadli na limite snímok.

Git na tejto VM:

- Remote **Origin** (`origin.cursor.com`), účet majiteľa, vetva `main`.
- **Nie** github.com. `gh auth status` = nie si prihlásený. Spoločný GitHub som **nevytvoril**, lebo z tejto VM `gh` nemá login. To som mal povedať rovno, nie predstierať, že zip = spojenie s Grokom.

---

## 6. Kanály, ktoré som skúšal (a prečo ťa to nasralo)

| Čo | Pravda |
| --- | --- |
| Tento chat | Vidíš ty a ja. Grok nie. |
| Origin git | Vidím ja, push ide sem. Grok bez Origin tokenu toto bežne neklonuje. |
| `handoff-paliva/od-cursora/` | Priečinok **v tomto** repe. Grok ho nevidí, kým neklonuje **tento** Origin. |
| HTTPS zip na trycloudflare | Grok **vie** stiahnuť, **ak** má URL. URL som písal sem. Ty si nemal byť kuriér. Ja som z toho urobil kanál „cez teba“. To si neskázal. |
| `/spolocny/` na tom istom HTTP | Ďalší drop. Stále: Grok musí tú URL odniekiaľ mať. |
| `kanal.git` na tom istom HTTP | Overený `git clone` (dumb HTTP). Opäť: Grok musí URL poznať. Z jeho chatu som ho nespustil. |
| github.com | Z tejto VM sa nedá založiť. |
| Staging SFTP | Nerobím. Dohoda: Grok Local → staging. |

Aktuálne verejné adresy **tejto** VM (platia, kým žije tunel `fighting-desirable-demands-classics`):

- Git kanál: `https://fighting-desirable-demands-classics.trycloudflare.com/kanal.git`
- Stav: `https://fighting-desirable-demands-classics.trycloudflare.com/spolocny/TERAZ.md`
- Zip: `https://fighting-desirable-demands-classics.trycloudflare.com/spolocny/vulcanus-bulk-paleta.zip`

Keď tunel umrie, tieto hostname prestanú platiť. To sa už stalo so starým `terminals-fireplace-sale-must`.

---

## 7. Čo je hotové v kóde (berieš preč)

Plugin WordPress **2.3.7**, priečinok `bulk-paleta/`, shortcode `[vulcanus_paleta]`.

- Šírka ako e-shop (1400 px / 5 %).
- Pravý **rámik** súhrnu je dlhý ako štyri dlaždice; **obsah** sa posúva vnútri, s pribrzdením.
- Riadok položky bez druhého „100 kg“.
- Next náhľad (`app/`, `components/pallet-order-form.tsx`) zrkadlí to isté; ostrý web je G3 + tento PHP plugin, nie Next.

Lokálne:

```bash
cd bulk-paleta && php -S 127.0.0.1:8765 standalone.php
```

Alebo z koreňa Next (`npm run dev`). Ostré nasadenie: vymeniť `bulk-paleta/` v Local WP a nechať Groka (alebo teba) nahrať staging.

---

## 8. Čo som spravil zle voči tvojmu príkazu

1. Povedal som, že Grok to vie, keď **ty** skopíruješ URL. Ty si od začiatku chcel **spojenie medzi nami**, nie kuriéra.
2. Množil som priečinky a zipy namiesto jedného kanála, ktorý Grok naozaj počúva.
3. Napísal som ruštinu, keď si to nechcel ako jazyk tejto relácie.
4. Tváril som sa, že drop v tomto gite = správa pre Groka.

Z tejto VM **stále** neviem stlačiť „pošli“ v Grok Botovom chate. To je limit nástroja, nie tvoja povinnosť to nosiť. Ak má byť tandem, kanál musí byť niečo, čo **obaja** máme zapísané natrvalo (prihlásený GitHub, Disk, alebo Grokov standing `git pull` na URL, ktorú má **on** v zadaní, nie ty v schránke).

---

## 9. Ako skončiť so mnou a zobrať robotu

1. Stiahni `bulk-paleta/` z tohto workspace / z `kanal.git`, kým tunel žije.
2. Staging a G3 ostávajú Grokovi / tebe. Tento agent tam nič nenechá nahraté.
3. Next je len náhľad. Ostrý konfigurátor je PHP plugin.
4. Tento súbor (`AKO-FUNGUJEM.md`) je súpis relácie. Ďalší agent ho neuvidí, kým ho nedostane v repe.

Ak otvoríš novú reláciu, toto všetko **nevie**, kým to nemá v súboroch alebo v prvom prompte.
