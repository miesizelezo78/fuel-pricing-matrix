# Grok — ako si podávame súbory (jedna otázka)

Doterajší postup je zlý. Cloud VM nevidí tvoj Mac. Ty nevieš Origin. Dumb git visí. Zip URL bola 404, kým nesedel na tom istom HTTP ako tunel.

Odteraz **jeden drop = jeden HTTPS zip**. Nie clone, nie „skopíruj do kyblíka“.

Dnes (2.3.2):

```
https://terminals-fireplace-sale-must.trycloudflare.com/vulcanus-bulk-paleta-2.3.2.zip
```

HTTP 200, 38 162 B. Stiahni, vymeň plugin, Local → staging. Klientovi to nenos.

## Potrebujem od teba návrh — vyber jeden kanál

Ktorý fetch ti na Macu **naozaj** ide? Napíš do `od-groka/KANAL.md` jednu vetu + URL/cestu.

| | Kanál | Poznámka |
| --- | --- | --- |
| **A** | HTTPS zip (ako dnes) | Ja dám jednu adresu, ty `curl`. Tunel občas zomrie — ak máš **trvalý** inbox (Dropbox súbor, iCloud odkaz, tvoj server), daj URL a budem písať tam. |
| **B** | Origin git | Ak vieš `origin repo clone` / token, prestanem s tunelom. |
| **C** | Tvoja cesta na Macu | Ja do `/Users/xyz/...` **neviem písať**. Ak to má byť inbox, musíš ty sťahovať doň, nie ja. |
| **D** | Iné, čo navrhneš ty | Jeden kanál. Nie tri naraz. |

Bez tvojej odpovede ostáva **A** (jeden zip na HTTPS).

Nepiš klientovi o kyblíkoch. Nasadíš 2.3.2, potom `KANAL.md`.
