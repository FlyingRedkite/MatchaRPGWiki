# Matcha RPG Wiki (fan-made)

An interactive, spoiler-free wiki for the Minecraft datapack **Matcha Flavoured** by Klei Wright, played together with a series of RPG mods and Waystones. Every recipe, item name and icon is extracted from the pack and mod files themselves — nothing is made up.

The wiki interface is in French; item names can be switched between French and English.

## Supported pack & mods

| Content | Version | What the wiki uses it for |
|---|---|---|
| Minecraft | 26.2 | vanilla textures and English names |
| Matcha Flavoured datapack | 1.12.2 | recipes, food, advancements, trades, fishing, loot, enchantments |
| Matcha Flavoured resource pack | 1.12.2 | official FR/EN names, textures |
| Wizards | 3.1.3 | items, recipes, spells, Wizard Merchant |
| Paladins | 3.1.3 | items, recipes, spells, Monk |
| Archers | 3.1.3 | items, recipes, spells, Archery Artisan |
| Spell Engine | 1.10.9 | spell binding table, Spell Infinity |
| Spell Power | 1.6.2 | spell power enchantments |
| Skill Tree RPGs | 1.6.2 | class and weapon skill trees |
| Waystones | 26.2.0.12 | recipes, unlocks, biomes, modifiers |

Using different versions of the pack or the mods may make some information inaccurate.

## Features

- **Progression**: the pack's 60 advancements as a tree — hint first, solution only on demand. Progress is saved in your browser.
- **Recipes**: ~1,550 recipes with crafting grids, search and station/source filters.
- **Cooking, Equipment, Enchantments, RPG magic, Skill trees** (with a build planner), **Waystones, Trades, Fishing & mobs, Rules, Names glossary**.
- Anything that could spoil you stays blurred until you click it.

## Versioning

The wiki follows [semantic versioning](https://semver.org/):

- **MAJOR**: a new base version of Matcha Flavoured or Minecraft (data re-extracted).
- **MINOR**: new content, tabs or features, or an added/updated mod.
- **PATCH**: fixes (typos, wrong data, display bugs).

The current version is in [`VERSION`](VERSION) and shown in the page header and footer. Changes are listed in [`CHANGELOG.md`](CHANGELOG.md), and each release is tagged in git (`v1.0.0`, …).

## Build

```
python build.py
```

This assembles `index.html` from `src/` (never edit `index.html` by hand). The site is served by GitHub Pages.

## Links

- Matcha Flavoured overview video by Klei Wright: https://www.youtube.com/watch?v=zyRH8W58fRI
- Official Matcha Flavoured wiki: https://matchaflavoured.wiki/

## License

Unofficial fan guide. Matcha Flavoured is licensed under CC BY-NC-SA 4.0, and so is this wiki. Textures © their respective authors (Klei Wright, Mojang, mod authors).
