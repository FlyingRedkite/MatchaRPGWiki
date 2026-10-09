# Contexte du projet — Matcha RPG Wiki (ex « Guide Matcha Flavoured »)

Résumé de la conversation avec Claude (claude.ai) qui a produit ce guide, pour reprendre le travail dans Claude Code. À lire avec `CLAUDE.md` (structure technique et workflow).

## Objectif

Un guide web **interactif et sans spoil** pour le datapack Minecraft **Matcha Flavoured** (Klei Wright, version 1.12.2 pour Minecraft 26.2), joué avec des mods RPG et Waystones. Le guide aide le joueur à progresser petit à petit, façon succès Minecraft : les étapes se révèlent au fur et à mesure et les solutions restent cachées tant qu'on ne les demande pas.

- Langue : interface en français, noms d'objets basculables FR/EN (bouton « Noms »).
- Hébergement : GitHub Pages (`index.html` à la racine du dépôt).
- Une version publiée existe aussi sur claude.ai : https://claude.ai/artifact/WZbvEj7VAFGtLPkjdGAuma

## Sources utilisées (toutes les données viennent des fichiers, pas d'invention)

| Source | Version | Apport |
|---|---|---|
| Datapack Matcha Flavoured (`MF_datapack.zip`) | 1.12.2 | recettes, nourriture, succès, échanges, pêche, butin, enchantements |
| Resource pack Matcha Flavoured (`MF_resourcepack.zip`) | 1.12.2 | noms officiels FR/EN (`lang/fr_fr.json`), textures |
| Wizards | 3.1.3 | objets, recettes, sorts, Marchand-Sorcier |
| Paladins | 3.1.3 | objets, recettes, sorts, Moine |
| Archers | 3.1.3 | objets, recettes, sorts, Artisan archer |
| Spell Engine | 1.10.9 | table de liaison des sorts, Spell Infinity |
| Spell Power | 1.6.2 | 8 enchantements de puissance des sorts |
| Skill Tree RPGs | 1.6.2 | arbres de compétences (classe et armes) |
| Waystones | 26.2.0.12 | 54 recettes, déblocages, biomes, modificateurs |
| Minecraft 26.2 (jar client) | 26.2 | textures et noms anglais vanilla |

Les jars ne sont pas dans le dépôt (exclus par `.gitignore`). Liens utiles : vidéo de Klei Wright https://www.youtube.com/watch?v=zyRH8W58fRI&t=1007s et wiki https://matchaflavoured.wiki/

## Contenu actuel du guide (onglets)

1. **Progression** — les 60 vrais succès du pack en arbre (titres et objectifs officiels, vraies icônes). Indice d'abord, solution avec recettes ensuite. Les 7 jalons ♥ baissent le minimum de cœurs. Bouton « Recommencer » à double clic (confirmation sans `confirm()`).
2. **Recettes** — environ 1 550 recettes avec grilles et icônes, recherche, filtres par station (établi, petit bois, four en terre cuite, four, haut fourneau, forge, tailleur) et par source (Matcha / RPG / Waystones), case « masquer les recettes impossibles ».
3. **Cuisine** — plats, soins (❤) et effets, floutés.
4. **Équipement** — 3 sous-onglets **Outils / Armes / Armures**, groupés par matériau puis par classe RPG (stats, effets intégrés, réparation).
5. **Enchantements** — enchantements Matcha, prières (blessings), Spell Power, Spell Infinity.
6. **Magie RPG** — Sorcier, Paladin & Prêtre, Archer : objets (rang et recette), sorts par école, succès, effets, et notes de compatibilité avec Matcha.
7. **Compétences** — les deux arbres Skill Tree, dessinés avec leur disposition d'origine, avec un planificateur de build (13 points en classe, 6 en armes, une seule racine, choix exclusifs). La branche Voleur (mod Rogues) est masquée car ce mod n'est pas installé.
8. **Waystones** — recettes par type, objet à ramasser pour débloquer chaque recette, biomes des waystones sauvages, modificateurs de la plaque.
9. **Échanges**, **Pêche & mobs**, **Règles**, **Noms** (glossaire des objets renommés).

## Points de compatibilité à garder en tête (Matcha + mods)

- Matcha renomme des objets vanilla, et les recettes des mods héritent de ces noms : poudre de blaze → Estus brut, ender pearl → Vide stable, éclat de prismarine → Argent brut, netherite → Adamant, émeraude → Obole…
- La table d'enchantement existe encore dans Matcha mais n'est plus craftable ni au cœur du jeu (les prières à l'enclume la remplacent), donc les enchantements Spell Power et Spell Infinity s'obtiennent surtout en butin.
- Les villages sont abandonnés et rares avec Matcha : Marchand-Sorcier, Moine, Artisan archer et waystones de village sont à vérifier en jeu.
- Les plats de Matcha sont des « pommes de terre empoisonnées » techniquement, ils compteraient probablement comme modificateur « Empoisonne » sur une plaque de téléportation (non vérifié).
- 18 recettes RPG demandent des mods absents (BetterEnd, BetterNether, The Aether) : elles sont marquées ⚠️ et grisées.

## Limites connues

- Les stats des armes et armures RPG sont dans le code des mods, pas dans les données : elles ne sont pas affichées.
- Quelques descriptions de compétences gardent « … » (valeurs calculées en jeu).
- Environ 90 objets n'ont pas d'icône, surtout ceux des mods absents.
- Les objets vanilla de déco peu utilisés restent en anglais.
- La progression est sauvegardée dans le navigateur (`localStorage`, clé `matcha-guide-v3`), séparément pour chaque adresse.

## Idées de suite possibles

- Ajouter le mod Rogues (branche Voleur) si installé un jour.
- Afficher les stats RPG à la main si on les relève en jeu.
- Mettre à jour les données quand Matcha passe en 26.3 : relancer les scripts de `tools/extract/` après avoir adapté leurs chemins.
