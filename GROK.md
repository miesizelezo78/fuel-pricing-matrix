# Dohoda s Grokom — kováčske palivá, mapa ciest

Grok, **nekresli nový katalóg a nesahej na G3 chrome.** Staging, ktorý už máš, je zdroj. Tento súbor je zmluva, nie zoznam otázok. Podrobnosti a odôvodnenie: [`UX-MAPA.md`](UX-MAPA.md).

Klient povedal: najprv mapa, potom diskusia, **potom** zmeny. Kým napíše „kreslite“, **nič na stagingu neprepisuj.** Keď povie kreslite, robíš body nižšie. Cursor medzitým nedáva `/paliva/` ako ostrý obchod.

## Tri miestnosti (hotové = toto, nič navyše)

1. **Sprievodca** [`/kovacske-paliva/`](https://staging.vulcanus.sk/kovacske-paliva/)  
   Video, tri charaktery ohňa. **Nie** druhý e-shop. Už to máš — nechaj. Portréty odkazujú na Woo produkty. CTA do obchodu: „Vrecia s doručením“ → `/?ukazka=obchod&rodina=kovacske-paliva`. Generický skok rovno na `/objednavka-paleta/` z landingu **nepridávaj ako druhý obchod**; jedna veta + odkaz do obchodu stačí.

2. **Obchod** [`/?ukazka=obchod&rodina=kovacske-paliva`](https://staging.vulcanus.sk/?ukazka=obchod&rodina=kovacske-paliva)  
   Tu žijú nákupné dlaždice. Tri Woo `vd-card` (vrecia s doručením) **nemente** — fotky, popisy, Do košíka, SKU `VUL-PAL-*-25`.  
   **Pridaj tri karty v tom istom `vd-card` jazyku**, nie Woo produkt:

   | Názov | href | Košík |
   | --- | --- | --- |
   | Kováčske čierne uhlie – od 100 kg | `/objednavka-paleta/?palivo=uhlie` | nie |
   | Kováčsky antracit – od 100 kg | `/objednavka-paleta/?palivo=antracit` | nie |
   | Kováčsky koks – od 100 kg | `/objednavka-paleta/?palivo=koks` | nie |

   Rovnaká fotka ako sesterské vrece. Eyebrow `Kováčske palivá`. Pack `Na objednávku · od 100 kg`. Tlačidlo **K objednávke**. Cenu €/kg na kartu nedávaj (Woo 40 € a vzorový paletový cenník sa bijú).  
   `?rodina=kovacske-paliva` musí hneď zapnúť filter, nie ostávať na „Všetky produkty“.

3. **Paleta** `/objednavka-paleta/`  
   Konfigurátor **v `get_header()` / `get_footer()`**. Žiadna druhá lišta Palivá · Paleta · Ako. Žiadny Figtree/Fraunces. Žiadna pätička z náhľadu. Plugin z tohto repa kreslí **len** `<main>`.

## Zmaž ostrovy (redirect, nemaž Woo)

| Odkiaľ | Kam |
| --- | --- |
| `/paliva/` | `/?ukazka=obchod&rodina=kovacske-paliva` |
| `/palivo/uhlie-25kg` | `/produkt/kovacske-cierne-uhlie-25-kg` |
| `/palivo/antracit-25kg` | `/produkt/kovacsky-antracit-25-kg` |
| `/palivo/koks-20kg` | `/produkt/kovacsky-koks-20-kg` |
| `/ako-to-predavame/` | `/kovacske-paliva/` |

Na detaile vreca **nechaj** dlaždicu OD 100 KG s `?palivo=` — to už máš správne. Sprievodca z obchodu / z produktu → `/kovacske-paliva/` ostáva.

## Slovo „solo“

V UI nikdy. Zákazník vidí **vrecia s doručením**. Woo názvy `… s doručením` nemente.

## Čo nemente

- Woo SKU vrecí, ceny 40 / 42 / 39, Do košíka
- G3 hlavička, pätička Žilina + Bytča, zaoblenia, fonty Identity
- Paletu do Woo košíka nedávaj (žiadne simple 100 kg)

## Kde to máš ty

Plugin obchodu: `wp-content/plugins/vulcanus-shop-demo/` (store.css 1.6.8.27, karty `.vd-card`).  
Identita: `wp-content/plugins/vulcanus-g3-design/`.  
Konfigurátor z tohto repa: priečinok `bulk-paleta/` — **vlož do shop-demo len `<main>`, nie celý obal.**

Ak leží inde, napíš cestu **pred** výmenou súborov. Chrome neprepisuj.

## Cursor

Repo logiky (nie chrome):

```
git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git
```

Plugin v `bulk-paleta/` vie kg, mix, zlomky, SuperFaktúru. Po schválení mapy Cursor z neho zoberie **obal** (žiadna vlastná hlavička). Ty ho posadíš do G3.

## Pätička

Nemení sa. Jedna veta do existujúceho stĺpca Obchod / Nákup, až keď to budeš kresliť: „Paleta je jednorazová, nevratná a v cene tovaru“ + odkaz na paletovú objednávku. Nič iné.
