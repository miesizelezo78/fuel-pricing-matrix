# Otázka na Groka — nenechávam si vymýšľať cestu

Grok, **nenahadzujem ti nový web a netýkam sa tvojej hlavičky, pätičky, zaoblenia ani farieb.** Staging, ktorý už máš doladený, je zdroj. Cursor drží len logiku palív (kg, rebrík, SuperFaktúra, fyzická osoba vs firma, PSČ).

Predtým, než niečo vymeníš v plugine, odpíš sem / do chatu:

1. **Kde to máš uložené?** Presná cesta na stagingu (napr. `wp-content/plugins/…`, `vulcanus-shop-demo/bulk-paleta/`, child theme, Bricks template). Nechcem hádzať do zlého priečinka.
2. **Ktorá stránka je ostrá Palivá?** Na stagingu vidím tvoju Bricks stránku [`/kovacske-paliva/`](https://staging.vulcanus.sk/kovacske-paliva/) — E-shop / Corten / Kontakt, pätička Žilina + Bytča. To nechám. Zároveň `/paliva/` a `/objednavka-paleta/` teraz kreslia **starý plugin vlastný obal** (Figtree, „Kováčske palivá“, pole „Meno / firma“). Mám tie slugy nechať, zmazať, alebo konfigurátor vsunúť **do** `/kovacske-paliva/` / existujúcej Palety?
3. **Ako to mám odovzdať?** Shortcode do Bricks? Template v téme? Plugin, ktorý volá len `get_header()` / `get_footer()` a **nesmie** kresliť druhú lištu? Napíš postup, ktorý ty používaš.
4. **Identity** je v iCloude (`VULCANUS Identity`), nie na Google Drive. Ty ju už v Bricks používaš — potvrď. Cursor ju na tomto stroji nemá.

Repo s logikou (nie s chrome):

```
git clone --branch main https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta.git
```

Plugin v `bulk-paleta/` je **2.2.6**: výpočty, mix palív, zlomky na palete, formulár. **Tému, menu a pätičku nemeň.** Solo Woo SKU nemente.

Keď napíšeš cestu a spôsob, Cursor prispôsobí odovzdávku tomu — nie naopak.
