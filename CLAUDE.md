# Guide Matcha Flavoured — notes pour Claude Code

Site statique d'une seule page (GitHub Pages). **Ne jamais modifier `index.html` à la main** : il est généré.

## Structure
- `src/shell.html` : HTML + CSS. Contient trois marqueurs remplacés au build : `/*DATA*/null`, `/*ADV*/`, `/*APP*/`.
- `src/app.js` : toute la logique (onglets, recettes, équipement, arbre de progression, compétences, waystones). Vanilla JS, pas de framework.
- `src/adv.js` : textes FR de l'arbre de progression (`window.__ADVFR__` : emoji, titre de secours, indice, noms de recettes liées, solution).
- `src/data.json` : données extraites des jars/datapack (recettes, noms FR/EN `NT`, icônes base64 `ICONS`, échanges, sorts, compétences…). Gros fichier : le lire par morceaux / avec jq, ne pas le réécrire en entier.
- `tools/extract/` : scripts Python qui ont produit `data.json` à partir des jars (chemins absolus à adapter, jars non versionnés).
- `build.py` : assemble `index.html`.

## Workflow
1. Modifier `src/…`
2. `python build.py`
3. Ouvrir `index.html` dans un navigateur pour vérifier
4. `git add -A && git commit -m "…" && git push` → GitHub Pages se met à jour.

## Conventions
- Interface en français ; les noms d'objets passent par `nm(i)` / `nmi(i)` (bascule FR/EN).
- Les spoilers utilisent `.spoil` (flou) et `.veil` (cartes de recette) : garder ce principe.
- Pas de `confirm()`/`alert()` (bloqués dans certains contextes) : utiliser une confirmation en deux clics.
- La sauvegarde utilise `localStorage` clé `matcha-guide-v3` (entourer de try/catch).
