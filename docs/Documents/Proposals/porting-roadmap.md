---
tags:
- proposals
---

# Porting Roadmap

Backporting PRs from our microcosms to the Macrocosm repository can happen for many reasons, but are usually one of two:

1. The feature is desired by multiple microcosms
2. The feature is an extreme maintenance burden

*(You can read more about these reasons on our [Voting](../Conventions/voting.md) page.)*

This page exists to streamline the process of backporting by creating a list of PRs that exist on microcosms which fit one of these two criteria. It serves as a reference for:

- The kinds of PRs that Macrocosm would like to see backported / that players and developers are interested in
- Whether PRs that are desired on Macrocosm have existing licensing or conceptual approval in advance
- A to-do list of PRs people can work on
- A showcase of the cool features created by our microcosms!

**This is not a formal voting page.** Not every PR in this list has implicit conceptual or code approval from all microcosms. Even if a PR is listed as being approved by all microcosms, it will still require a formal vote before being merged.

If you wish to add a PR to this list, please open a PR on our [docs repository](https://github.com/syndicate-ss14/docs)!
{/* mq note: might be cool to set up a little bot or something that can also auto-open issues for this. having that done could even be used AS a formal vote. thats a whole process. but really anything to streamline devstuffs ya know */}

## PR Categories
| Category | Description |
|-|-|
| Accessibility | Designed to ease the physical, real-life burden of playing the game.
| Admin Tooling | For in-game administration and moderation.
| Atmospherics | Anything to do with the 'atmospheric simulator' gameplay loop.
| Cargo / Salvage | Shuttles, shipbuilding, economy, mail.
| Character / Species | Character customization, markings, loadouts.
| Combat | PvP and PvE.
| Core Tech | Backend modifications to the game that have no / minimal player-facing impact.
| Discord Integration | Using Discord to relay in-game occurences to a community server.
| Engineering | Power, construction.
| Integration Tests | Modifications to `Content.IntegrationTests`.
| Localization | Language, guidebook, description changes and the like.
| Mapping | Props for mappers to play with, or tools to make their lives easier.
| Medical | Health, damage, death.
| Roundflow / Antag | Gamerules and the general balance of each individual round.
| Science | Research, artifacts, anomalies.
| Security | Security.
| Service | Kitchen, botany, housekeeping.
| Silicon | Borgs.
| UI | Modifications to user interfaces or in-game menus.
| Visual | Resprites, shaders, anything else that has to do with how the game looks.

## Roadmap
| Feature Name | Description | Category | Microcosm PR(s) | Notes |
|-|-|-|-|-|
| Pronouns on Crew Manifest	| Adds pronouns to the crew manifest. | UI | [Impstation #87](https://github.com/impstation/imp-station-14/pull/87)
Last Message before Death Webhook | Discord webhook which will, at the end of a round, relay the last message sent by all players who died | Discord Integration | [Impstation #3045](https://github.com/impstation/imp-station-14/pull/3045)
Old & New Xenoarch | Combines upstream's new & old xenoarcheology systems, where an artifact randomly selects one of the two systems. | Science | [Impstation #2894](https://github.com/impstation/imp-station-14/pull/2894)
Tourists | Midrounds with the job of being annoying. | Roundflow/Antag | [Impstation #3189](https://github.com/impstation/imp-station-14/pull/3189)
Mech QOL | Makes mobs pathfind to mechs, and gives mechs the ability to wideswing. | Combat | [Impstation #2082](https://github.com/impstation/imp-station-14/pull/2082)
Visitor Species | adds a toggle to a species to enable them to be selected by RandomHumanoidSystem, letting you have species be playable but not roundstart via ghost roles | Character/Species | [Impstation #3522](https://github.com/impstation/imp-station-14/pull/3522)
all of imps gun shit | all of imps gun shit. dvd player is insane. | Combat | Impstation | side note would be so fucking funny to UN fork these
Reagent Fires | It makes heat an actual issue on the station in a good way. | Atmospherics | [Funkystation #2295](https://github.com/funky-station/funky-station/pull/2295), [#2331](https://github.com/funky-station/funky-station/pull/2331), [#2429](https://github.com/funky-station/funky-station/pull/2429), [#2360](https://github.com/funky-station/funky-station/pull/2360), [#2446](https://github.com/funky-station/funky-station/pull/2446), [#2363](https://github.com/funky-station/funky-station/pull/2363) | Make it a cvar like spacewind. Has a few bugfixes that makes it function correctly too. Last PR in the chain needs mostly just the visual stuff and can skip the structural damage
Washing Machine content | They work now. | Service | [Funkystation #2703](https://github.com/funky-station/funky-station/pull/2703), [#2841](https://github.com/funky-station/funky-station/pull/2841), [#2844](https://github.com/funky-station/funky-station/pull/2844) | Imp people seemed interested in more integration with the system
Holo doorbell | Little holographic doorbell for mail deliveries. | Cargo/Salvage | [Impstation #1357](https://github.com/impstation/imp-station-14/pull/1357) | Already shared by Imp and Funky
End screen medals | Inscribe a medal with a description and award it to someone, and they'll show up on the round end screen. | | [Funkystation #2236](https://github.com/funky-station/funky-station/pull/2236) | Already shared by Imp and Funky
Spray paint | An item that allows you to recolor the sprites of entities. Also a generic entity system to handle entity recoloring in general. It's used in Den (prebase) for recoloring loadout items, too. | | [The Den PREBASE #1872](https://github.com/TheDenSS14/TheDen/pull/1872), [#1909](https://github.com/TheDenSS14/TheDen/pull/1909), [#2328](https://github.com/TheDenSS14/TheDen/pull/2328), [The Den REBASE #51](https://github.com/TheDenSS14/TheDenTwo/pull/51)
Supermatter | Big radioactive crystal engine that kills you badly. | Engineering | | all member servers have this i think? so more unifying the implementation
DenTraits / Entity Traits | A replacement of WizDen's trait system.  Instead of traits being entirely based on profile preferences, EntityTraits work sort of like status effects. | Core Tech | [The Den #53](https://github.com/TheDenSS14/TheDenTwo/pull/53)
Courier | New job for the Cargo department whose job is to deliver mail to crew. | Cargo/Salvage
Microwave Separation / Frontier Cooking / TG-ish Cooking | 	Microwaves are split into four appliances - microwave, oven, assembler, med. assembler. All cooking recipes are recategorized accordingly. | Service | [Impstation #1935](https://github.com/new-frontiers-14/frontier-station-14/pull/1935), [#2571](https://github.com/impstation/imp-station-14/pull/2571) | relevant devs have given permission to port this to MIT codebases so it should be chill
Den Character Requirements | Refactor of job requirement system. Makes it easier to add new job/character requirements. Also makes it possible to write requirement-related integration tests. | Core Tech | [The Den #1581](https://github.com/TheDenSS14/TheDen/pull/1581) | pending rewrite for den2 
Toys | combine our toys / plushies | | | be sure to not spread server-specific plushies through the cosm
Food rebalance | rebalances reagent inventories of every single craftable edible item in the game so it at minimum matches the ingredients. huge for food being filling | Service | [Impstation #2021](https://github.com/impstation/imp-station-14/pull/2021)
cosmic cult | bring back coscult | Roundflow/Antag | Funkystation
Food Sequence Burger Tweaks | visual tweaks to foodsequence burgers to make ingredients layer slightly better, tofu slices, chanterelle mushrooms, carp added to ingredient list, new ingredient sprites for all cutlets, tofu slices, chanterelle, chilis, and tomatoes | Service | [The Den #1289](https://github.com/TheDenSS14/TheDen/pull/1289), [Impstation #471](https://github.com/impstation/imp-station-14/pull/471) | note: DEN added cooked carp and carp cutlets for this. do we want that? note: imp also has quite a few new food sequence burger ingredients. can compare notes
Species TLC (Arachnid, Lizard, Moth) | Adds unique sounds to Arachnids and Moths, and new emotes to Lizards. Additionally adds new organs for insect blood and blue blood species respectively. | Character/Species | [Impstation #3539](https://github.com/impstation/imp-station-14/pull/3539), [#3626](https://github.com/impstation/imp-station-14/pull/3626), [#3571](https://github.com/impstation/imp-station-14/pull/3571)
Paperwork Form Fields | allows you to add fields to sheet of paper for quick user input with out a pen - signature fields, free text, check boxes, etc. | Core Tech | The Den | i think they're an RMC feature?
Pool-Themed Decorations | lounge chairs, beach umbrellas, swim rings, pool tile, and pool water - for all your mapping and indoor beach/pool-themed fun | Mapping | [The Den #2071](https://github.com/TheDenSS14/TheDen/pull/2071)
Singularity Warping Toggle | allows people to disable the singularity's screen warping effects. | Accessibility | [Impstation #27](https://github.com/impstation/imp-station-14/pull/27)	
Weather Toggle | allows people to disable weather effects. | Accessibility | [Impstation #3986](https://github.com/impstation/imp-station-14/pull/3986), [#4077](https://github.com/impstation/imp-station-14/pull/4077) | honestly weather effects need to be made more pleasant in general, but a weather toggle is pretty commonplace anyways!
Gas Resprites | visually easier on the eyes compared to the original texture, which is kind of flashy. | Visual | [Impstation #1111](https://github.com/impstation/imp-station-14/pull/1111) | needs to be atomized out, PR contains unrelated resprites (god bless old imp you messy bitch)
Improved Flash Visuals + Flash Reduced Motion Toggle | more toggles for reduced motion! also adjusts the base flash effect in a way that keeps the flash's combat use in tact. | Accessibility | [Impstation #3722](https://github.com/impstation/imp-station-14/pull/3722)
Glasses Lens Slot | eyewear has a "lens slot" for inserting lenses, allowing you to have special eyewear that supports prescriptions | | [Impstation #304](https://github.com/impstation/imp-station-14/pull/304), [#2441](https://github.com/impstation/imp-station-14/pull/2441), [#3104](https://github.com/impstation/imp-station-14/pull/3104), [#3116](https://github.com/impstation/imp-station-14/pull/3166),  [#3505](https://github.com/impstation/imp-station-14/pull/3505)
Round status / emote panel | ss13-style panel that allows you to see the current round time and gamemode, plus a tab for quick-using emotes. | UI | The Den | ss13 inspired. den ported it from goob i think? i (portfiend) want to recode it
Toggle Self Ghost Action | do you know how sucks it is trying to take a screenshot, toggling ghosts and then still seeing your ghost ass in frame? exactly. | Accessibility | [Funkystation #906](https://github.com/funky-station/funky-station/pull/906)
Breeding System | ever wanted to crossbreed a cow and a slime? | Service | [Impstation #3946](https://github.com/impstation/imp-station-14/pull/3946) | It's almost done!
Obvious Examine | Accessories that will show up on a character's examine text, such as pins, badges, and medals. | UI | Impstation
Go Woke with Descriptions and such | lists PRs that adjust culturally insensitive content. i think it is good to be sensitive and aware and to keep macrocosm upstream tidy as well. | | [Impstation #1494](https://github.com/impstation/imp-station-14/pull/1494), [#3928](https://github.com/impstation/imp-station-14/pull/3928) | currently just listing impstation PRs but if other forks have related PRs please include
Ghosts Seeing Damage and Solutions on Examine | Ghosts having the ability to be informed during observing? Sign me up buster! | Core Tech | [Impstation #1318](https://github.com/impstation/imp-station-14/pull/1318)
Reagent Color Text Contrast | Adds contrast to the color of a reagent's text to make readable against the dark text background. | Accessibility | [Impstation #1439](https://github.com/impstation/imp-station-14/pull/1439)
Un-Shrinkwrapping Moths | Layers moth wings behind clothing so they dont clip into clothing sprites | Visual | [Impstation #3396](https://github.com/impstation/imp-station-14/pull/3396) | Will require more `HumanoidVisualLayers`, might be worth looking into getting more robust directionals. Will 9/11 moth wing colours

## Completed Features
| Feature Name | Description | Category | Microcosm PR(s) | Macrocosm PR(s) | Notes |
|-|-|-|-|-|-|
Costume Bundles	Bags | used to hold clothing and costume parts. Mostly used to reduce the inventory length of the AutoDrobe by condensing all the gimmicky costumes into bundles. | Service | [The Den #1903](https://github.com/TheDenSS14/TheDen/pull/1903) | [Macrocosm #7](https://github.com/syndicate-ss14/macrocosm/pull/7)