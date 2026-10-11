# Matcha RPG Wiki — notes pour Claude Code

Site statique d'une seule page (GitHub Pages). **Ne jamais modifier `index.html` à la main** : il est généré.

## Structure
- `src/shell.html` : squelette HTML. Contient des marqueurs remplacés au build : `/*CSS*/`, `/*DATA*/ null`, `/*ADV*/`, `/*APP*/`, `{{VERSION}}`, `{{DATE}}`. `build.py` s'arrête si un marqueur manque.
- `src/style.css` : tout le CSS (variables de couleur sur `:root`, thème sombre).
- `src/app.js` : toute la logique (onglets, recettes, équipement, arbre de progression, compétences, waystones). Vanilla JS, pas de framework.
- `src/adv.js` : textes FR de l'arbre de progression (`window.__ADVFR__` : emoji, titre de secours, indice, noms de recettes liées, solution).
- `src/data.json` : données extraites des jars/datapack (recettes, noms FR/EN `NT`, icônes base64 `ICONS`, échanges, sorts, compétences…). Gros fichier : le lire par morceaux / avec jq, ne pas le réécrire en entier.
- `tools/extract/` : scripts Python qui ont produit `data.json` à partir des jars (chemins absolus à adapter, jars non versionnés).
- `build.py` : assemble `index.html`.
- `VERSION` : version du wiki (semver). `CHANGELOG.md` : historique des versions.
- `README.md` : en anglais.

## Workflow
0. **Toujours travailler sur la branche `work`** (`git checkout work`), jamais directement sur `main`.
1. Modifier `src/…`
2. `python build.py`
3. Ouvrir `index.html` dans un navigateur pour vérifier
4. Versionner : incrémenter `VERSION` (MAJOR = nouvelle version de Matcha/Minecraft, MINOR = contenu ou mod ajouté/mis à jour, PATCH = correctif) et ajouter une entrée dans `CHANGELOG.md` (avec les versions des mods si elles changent), puis relancer `python build.py`.
5. `git add -A && git commit -m "…" && git push` sur `work`, puis fusionner dans `main` → GitHub Pages se met à jour. Taguer la release (`git tag vX.Y.Z && git push --tags`).

## Conventions
- Le code source sert aussi de démo : il doit rester lisible. Formater avant de commiter avec Prettier (config `.prettierrc.json`, largeur 100) pour `src/*.js`, `src/style.css`, `src/shell.html`, et Black pour le Python : `npx prettier --write src/app.js src/adv.js src/style.css src/shell.html` puis `black build.py tools/extract`. Ne jamais formater `src/data.json` ni `index.html` (générés). Attention : Prettier écrit `/*DATA*/ null` avec une espace, c'est ce que `build.py` attend.
- Interface en français ; les noms d'objets passent par `nm(i)` / `nmi(i)` (bascule FR/EN).
- Les spoilers utilisent `.spoil` (flou) et `.veil` (cartes de recette) : garder ce principe.
- Pas de `confirm()`/`alert()` (bloqués dans certains contextes) : utiliser une confirmation en deux clics.
- La sauvegarde utilise `localStorage` clé `matcha-guide-v3` (entourer de try/catch). Ne pas renommer cette clé (même après le changement de nom du wiki) : les joueurs perdraient leur progression.
