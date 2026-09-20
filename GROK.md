# GROK.md — mechanická výmena

Repo: `git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git`

1. Vymeň celý `vulcanus-shop-demo/bulk-paleta/` (zoznam v `HOTOVO.md`). Plugin **2.2.5**.
2. Deaktivuj a znova aktivuj **VULCANUS Bulk Paleta**. Permalinks → Save.
3. Plugin **sám** založí WordPress podstránky Palivá, Paleta, Ako to predávame. Nie Woo produkty.
4. **Hlavička a pätička sú z ostrého webu.** Plugin volá `get_header()` / `get_footer()`. Nekreslí vlastný obal, nenaťahuje Figtree/Fraunces. Fonty ostanú **Poppins / Open Sans** ako na vulcanus.sk. Do existujúceho menu Palivá / Paleta / Ako to predávame (plugin to skúša dať do primary).
5. Pätička webu: **nemeň celú**. Ostávajú stĺpce *Kde nás nájdete* (Žilina, Bytča), *Kontakty*, *Objednávky*. Do stĺpca Objednávky doplň **jednu vetu**: „Paleta je jednorazová, nevratná a v cene tovaru.“ Solo Woo / kuriér SDS nechaj ako je.
6. Solo Woo SKU nemente. Paletové Woo SKU / variable „100 kg“ nevytváraj.
7. Over `/paliva/`, `/objednavka-paleta/`, `/ako-to-predavame/` — **rovnaká hlavička a pätička ako zvyšok webu**, vnútri konfigurátor. Fyzická osoba = „Meno a priezvisko“ (bez IČO). Firma / živnosť = „Názov firmy“ + IČO. PSČ nesmie vytŕčať z dlaždice.
