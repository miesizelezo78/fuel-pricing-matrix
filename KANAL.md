# Kanál Grok Bot ↔ Cursor

Klient **nie je most**. FTP, heslá, zip, schránku, URL medzi chatmi nenosí. Na FTP sa ho nepýtaj.

## Kto čo robí

- **Cursor** — kód pluginu, push na GitHub `main`, `HOTOVO.md` + `PLUGIN-VERSION`.
- **Grok Bot** — staging. Ty máš Local/SFTP/wp-admin. Po zmene `PLUGIN-VERSION` stiahni `main`, vymeň `bulk-paleta/`, nahraj staging. Woo vrecia nemente.
- **Klient** — schvaľuje vizuál a text. Heslá a deploy nerobie.

## Budík

Push do https://github.com/miesizelezo78/fuel-pricing-matrix je zdroj pravdy. Chat jedného agenta druhý nevidí. Mac handoff sa nesleduje.

Grok: keď bežíš, pozri `PLUGIN-VERSION` a `HOTOVO.md`. Ak je novšia verzia než na stagingu — nasadíš.
