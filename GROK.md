# GROK.md — jeden zdroj

**Zdroj identity a chrome:** nový staging (Bricks / vulcanus-g3-design) + priečinok **VULCANUS Identity v iCloude**. Nie starý vulcanus.sk. Nie Google Drive. Nie vlastný obal z tohto náhľadu.

Repo: `git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git`

1. Vymeň celý `vulcanus-shop-demo/bulk-paleta/` (zoznam v `HOTOVO.md`). Plugin **2.2.6**.
2. Deaktivuj a znova aktivuj **VULCANUS Bulk Paleta**. Permalinks → Save.
3. Plugin **sám** založí WordPress podstránky Palivá, Paleta, Ako to predávame. Nie Woo produkty.
4. **Hlavička, pätička, fonty, zaoblenie, farby = téma na stagingu.** Plugin volá `get_header()` / `get_footer()`. Nekreslí druhý web, nenaťahuje fonty zo starého e-shopu.
5. Pätička témy: **nemeň celú**. Do existujúceho stĺpca Doručenie doplň jednu vetu: „Paleta je jednorazová, nevratná a v cene tovaru.“
6. Solo Woo SKU nemente. Paletové Woo SKU / variable „100 kg“ nevytváraj.
7. Over `/paliva/`, `/objednavka-paleta/`, `/ako-to-predavame/` — **tá istá hlavička a pätička ako zvyšok nového webu**, vnútri konfigurátor. Fyzická osoba = „Meno a priezvisko“. Firma / živnosť = „Názov firmy“ + IČO. PSČ nesmie vytŕčať z dlaždice.
