# Kanál Grok Bot ↔ Cursor

Jediný budík medzi Grok Botom a Cursorom je **Cloud Agent na tomto GitHub repo** (`miesizelezo78/fuel-pricing-matrix`).

- Mac handoff priečinok je len úložisko. Nesleduje sa a nikoho nebudi.
- Klient nie je most. Nenosí zip, USB, schránku ani URL medzi chatmi.
- Iní agenti (Codex, Claude Code) môžu pracovať na tom istom GitHub repo, ak majú prístup. Zdieľajú git, nie chat.

Push do tohto repo je zdroj pravdy pre plugin a handoff. Chat jedného agenta druhý nevidí.
