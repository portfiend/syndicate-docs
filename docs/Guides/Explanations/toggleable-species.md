---
authors: [portfiend]
tags:
- guides
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Making Species Toggleable

According to [Macrocosm's pull request conventions](https://docs.macrocosm.cool/Documents/Conventions/pull-requests#content-should-be-easy-for-a-downstream-to-disable), new content added to Macrocosm should easy for  downstreams to enable or disable, such as through configuration changes or minor YML tweaks.

When designing content to be toggleable, your goals are to ensure that:
- The feature can be enabled and fully-usable with as little modification to the code as possible.
- The feature has **no impact** on the game whatsoever if disabled, or as close to it as possible. It should be as if the feature doesn't exist at all.

In the latter case, cosmetic / information / non-mechanical "impact" may slip by and be allowed (like guidebook changes), but ultimately the goal is "zero impact", even if it needs to be implemented at a later date.

This article uses our species as an example of making a feature toggleable by downstreams, more specifically the refactors made to species in [syndicate-ss14/macrocosm#64](https://github.com/syndicate-ss14/macrocosm/pull/64) in order to facilitate this system.

## How species were enabled before

Before #64, you had to edit three files per Macrocosm species to enable them as a roundstart species properly:
- Changing the `roundstart` field in the species prototype defined at `Resources/Prototypes/_MACRO/Species/`.
- Uncommenting the guidebook entry defined in `Resources/Prototypes/_MACRO/Guidebook/`. This had to be commented unless enabled, because a guidebook entry could not be defined *and* hidden from the guide list.
- Adding the species' guidebook entry as a child to the "Species" guide in `Resources/Prototypes/Guidebook/species.yml`, an upstream (Wizard's Den) file.

This is luckily not very many steps, but it wasn't ideal, as editing prototype fields in their original definition risks causing **merge conflicts**. A merge conflict happens when the changes between an "upstream" branch conflicts with changes made to a "downstream" branch - for example, between Wizard's Den's master branch and Macrocosm's master branch, or between Macrocosm and a downstream's pre-existing changes.

In addition, some species have their own "metabolizer types", which are a property of that species' organs that defines how they metabolize chemicals differently. For example, Vox can breathe nitrogen and take poison damage from oxygen due to their unique "Vox" metabolizer type.

Metabolizer types appear in the guidebook as "conditions" attached to a reagent's effects. Even when a species was disabled and unplayable, these metabolizer types would appear in the guidebook entry, which can be confusing for players.

![Reagent guide for table salt, which causes poison damage if the mob has the "Gastropoid" metabolizer type.](/img/docs/guides/toggleable-species-salt.png)

## The new system for enabling species

Macrocosm has a new folder `_MACRO/_Features`, which is used to provide ways to easily toggle a feature on or off. Each species gets their own YML file in the `/_Features/Species/` folder, which allows you to enable a species in a single line change.

Here is an example Feature file for Allulalo:

```yml
# Resources/Prototypes/_MACRO/_Features/Species/allulalo.yml

- type: !PartialOnly species
  id: Allulalo
  roundStart: &speciesEnabled false # Set this to "true" to enable.

- type: !PartialOnly guideEntry
  id: Allulalo
  showInGuidebook: *speciesEnabled
  includeAsChild: *speciesEnabled

- type: !PartialOnly metabolizerType
  id: Allulalo
  showInGuidebook: *speciesEnabled
```

This uses a niche feature of YAML known as [anchors](https://yaml.org/spec/1.2.2/#692-node-anchors), which allow you to define a property once and then repeat that value in multiple places. A species can be completely enabled or disabled by changing the value of `&speciesEnabled`.

```yml
- type: !PartialOnly species
  id: Allulalo
  roundStart: &speciesEnabled true
```

When you enable a species this way:
- It becomes selectable in the character editor. (`species.roundstart`)
- Its guide entry becomes visible in the guidebook table of contents. (`guideEntry.showInGuidebook`)
- Its guide entry will show up in other contexts in which the "child entries" of the Species guidebook are included, such as in "guidebook" items. (`guideEntry.includeAsChild`)
- Its metabolizer type will become visible in the guidebook under reagents that require it. (`metabolizerType.showInGuidebook`)

You do not need to manually add the entry to the children of the Species guide, as this has already been handled.

## How does this work?

When a species is enabled "properly", it affects players in these ways:

- The species is selectable in the character editor, which means that players can make characters of that species.
- The species may show up as random visitor ghostroles (as a side-effect of being roundstart-enabled).
- The species has its own guidebook entry under the "Species" section.
- If the species has its own metabolizer types, they will likely show up in the guidebook under certain Chemical effects.
- The server may add miscellaneous features obtainable through the species, specialized equipment, blood reagents, and so on.

The goal here is to ensure that when the species is **not enabled**, these things are no longer accessible or visible to players. The species needs to be removed from the character editor, its guidebook entry should be inaccessible, and its metabolizer types should not be visible under reagent effects.

We do not need to **remove** anything from the game to do all of this - just hide them. For example, Decapoids have special internals equipment unique to them that cannot be obtained through any other means, so by disabling Decapoids as a roundstart species, this equipment also becomes unobtainable unless spawned by an admin.

:::note
Making something "only accessible to admins and developers" is a perfectly fine way to disable a feature from the game, and well within the scope of Macrocosm's conventions. In fact, we encourage letting admins and developers have additional tools for creating events and surprises for players!
:::

Implementing a system like this involves defining a few new `DataField`s for some prototypes so that they can be hidden from the player via YAML. In this case, it's easiest to use "boolean" values (true/false) for this, as the `roundstart` property of species is also a boolean, and YAML anchors can only copy values that are the same type.

The rest was accomplished via the use of **partial prototypes**, a means of modifying fields of YAML-defined prototypes selectively. We do not need to re-define the entire species; we just need to change the value of `roundstart`, and the rest should take care of itself.

### Guide entry fields

Two new `DataField`s were added to guidebook entries:

```csharp
// Content.Shared/_MACRO/Guidebook/GuideEntry.MACRO.cs

namespace Content.Shared.Guidebook;

public partial class GuideEntry
{
    /// <summary>
    ///     Determines whether or not this entry will show up in the "main" guidebook.
    /// </summary>
    /// </remarks>
    ///     Even if this is disabled, you can still make this guide entry accessible via book item,
    ///     UI button, etc. by passing it into the "guides" parameter in GuidebookUIController.OpenGuidebook().
    /// </remarks>
    [DataField]
    public bool ShowInGuidebook = true;

    /// <summary>
    ///     Determines whether or not this entry will show up when "includeChildren" is enabled
    ///     in GuidebookUIController.OpenGuidebook().
    /// </summary>
    /// <remarks>
    ///     This guide will still show up if included directly, including the "main" guidebook
    ///     with all entries if <see cref="ShowInGuidebook"/> is enabled.
    /// </remarks>
    [DataField]
    public bool IncludeAsChild = true;
}
```

Hiding an entry from the player in the guidebook is as simple as locating the function in which the guidebook's entry list is assembled, and excluding guides with `ShowInGuidebook` disabled if the "guides" list isn't pre-defined.

```csharp
// Content.Client/UserInterface/Systems/Guidebook/GuidebookUIController.cs

public void OpenGuidebook(
    Dictionary<ProtoId<GuideEntryPrototype>, GuideEntry>? guides = null,
    List<ProtoId<GuideEntryPrototype>>? rootEntries = null,
    ProtoId<GuideEntryPrototype>? forceRoot = null,
    bool includeChildren = true,
    ProtoId<GuideEntryPrototype>? selected = null)
{
    // [...]
    if (guides == null)
    {
        guides = _prototypeManager.EnumeratePrototypes<GuideEntryPrototype>()
            .Where(g => g.ShowInGuidebook) // MACRO: Exclude entries not enabled for "main" guidebook.
            .ToDictionary(x => new ProtoId<GuideEntryPrototype>(x.ID), x => (GuideEntry)x);
    }
    else if (includeChildren)
    {
        var oldGuides = guides;
        guides = new(oldGuides);
        foreach (var guide in oldGuides.Values)
        {
            RecursivelyAddChildren(guide, guides);
        }
    }
    // [...]
}

private void RecursivelyAddChildren(
    GuideEntry guide, 
    Dictionary<ProtoId<GuideEntryPrototype>, GuideEntry> guides)
{
    foreach (var childId in guide.Children)
    {
        if (guides.ContainsKey(childId))
            continue;

        if (!_prototypeManager.TryIndex(childId, out var child))
            continue;

        // MACRO: Exclude this entry as a child if this field is disabled.
        if (!child.IncludeAsChild)
            continue;

        guides.Add(childId, child);
        RecursivelyAddChildren(child, guides);
    }
}
```

In the "open guidebook" function, the `guides` parameter is *nullable*. If you provide a list of guides, the assumption is that these guides are being opened "directly", and should be included even if they're hidden from the main ("complete") guidebook. Otherwise, the function will populate this list on its own.

This function also has an `includeChildren` parameter, which determines whether *child entries* of the specified guides should also be included in the table of contents. This is used often in the job tutorial books.

```yml
- type: entity
  id: BookEngineersHandbook
  parent: BaseGuidebook
  name: engineer's handbook
  description: A handbook about engineering written by Nanotrasen.
  components:
  - type: Sprite
    layers:
    - state: paper
    - state: cover_base
      color: "#6c4718"
    - state: decor_wingette
      color: "#b5913c"
    - state: icon_wrench
    - state: icon_corner
      color: gold
  - type: GuideHelp
    guides:
    - Engineering
    # GuideHelp includes children by default, so this also includes
    # the "Construction", "Power", "Atmospherics", and "Shuttlecraft" entries.
```

Let's say we had a handbook that listed `Species` and its child entries. We'd want to exclude disabled species from the list as well - hence why `includeAsChild` is disabled for these guide entries.

### Metabolizer type field

For some context: every chemical in the game is a *reagent*, reagents can have *effects*, and effects can have *conditions*. One such condition is `MetabolizerTypeCondition`, which causes certain effects only if your organs are of a certain metabolizer type.

For instance, Gastropoids have a unique metabolizer type on their organs that make them take damage from salt. In the guidebook, the text appears like so:

> _Deals **4** Poison when the metabolizing organ is a **Gastropoid** organ._

In this case, `Deals 4 Poison` is the effect, and `when the metabolizing organ is a Gastropoid organ` is the condition. An effect can have multiple conditions, and `MetabolizerTypeCondition` can have multiple listed metabolizer types, like so:

> _Deals **0.06** Poison when there is at least **1u** of Honk and the metabolizing organ is an **Animal** or **Arachnid** organ._

Similar to guide entries, we added a new `DataField` to metabolizer types for guidebook display.

```csharp
// Content.Shared/_MACRO/Metabolism/MetabolizerTypePrototype.MACRO.cs

using Content.Shared.EntityConditions.Conditions.Body;

namespace Content.Shared.Metabolism;

public sealed partial class MetabolizerTypePrototype
{
    /// <summary>
    ///     Whether or not this metabolizer type will show up in the guidebook
    ///     when included in a <seealso cref="MetabolizerTypeCondition"/>.
    /// </summary>
    [DataField]
    public bool ShowInGuidebook = true;
}
```

:::note
The `showInGuidebook` field is defined on both guide entries *and* metabolizer types as an "enabled-if-true" boolean value. This is for parity with `SpeciesPrototype`'s `roundstart` field, which is also "enabled-if-true".

One *could've* defined these fields as "disabled-if-true"; e.g. a boolean called `hideFromGuidebook` with inverted logic, but this would've made the prototypes slightly obnoxious to write.
:::

Unlike guide entries, the handling for hiding metabolizer types from the guidebook is a little more involved. The idea is that if the metabolizer type is hidden from the guidebook, the conditional text should pretend as if the metabolizer type *does not exist*.

This means we need to handle cases like "empty" or "supposed-to-be-nonexistent" metabolizer conditions, which the system is not designed to do. We have to implement this logic ourselves.

```csharp
// Content.Shared/EntityConditions/Conditions/Body/MetabolizerTypeEntityConditionSystem.cs

public sealed partial class MetabolizerTypeCondition : EntityConditionBase<MetabolizerTypeCondition>
{
    public override string EntityConditionGuidebookText(IPrototypeManager prototype)
    {
        var typeList = new List<string>();
        // MACRO: Keep track if all metabolizers are hidden from the guidebook
        var allHidden = Type.Length > 0; 

        foreach (var type in Type)
        {
            if (!prototype.Resolve(type, out var proto))
                continue;

            // MACRO: Do not show this metabolizer type if it's hidden from the guidebook.
            allHidden = allHidden && !proto.ShowInGuidebook;
            if (!proto.ShowInGuidebook)
                continue;

            typeList.Add(proto.LocalizedName);
        }

        // Begin MACRO: This requirement gets hidden entirely if all metabolizers are hidden.
        if (allHidden)
        {
            if (Inverted)
                return string.Empty;
            else
                return EntityEffect.HideEffectTag;
        }
        // End MACRO

        var names = ContentLocalizationManager.FormatListToOr(typeList);

        return Loc.GetString("entity-condition-guidebook-organ-type",
            ("name", names),
            ("shouldhave", !Inverted));
    }
}
```

Two things are happening here:
- This function assembles a list of player-friendly names for metabolizer types, `typeList`. We're skipping over all metabolizer types that are meant to be hidden from the guidebook.
- We're also keeping track of if *all* metabolizer types get skipped over. If they are, then we hide the requirement (if it is inverted), or hide the effect (if it is not inverted).

:::note
Why do we handle it like this? The idea is that metabolizer types that are hidden from the guidebook are *non-existent* - they should not be relevant to gameplay at all unless an admin wills it. Consider the Gastropoid salt condition again:

> _Deals **4** Poison when the metabolizing organ is a **Gastropoid** organ._

If Gastropoids and their metabolizer do not exist, then this effect is unachievable - thus the **effect and condition** are both hidden. Consider an inverted case:

> _Satiates hunger at **0.5x** the average rate when the metabolizing organ is not a Kodepiia organ._

If Kodepiia do not exist, then this condition will never be *unmet*. We can pretend the condition does not exist at all, but the effect will still happen.


<Tabs>
  <TabItem value="Kodepiia Enabled">
![The "protein" reagent satiating non-Kodepiia and poisoning Kodepiia when metabolized.](/img/docs/guides/toggleable-species-protein-before.png)
  </TabItem>
  <TabItem value="Kodepiia Disabled">
![The "protein" reagent satiating mobs when metabolized. Kodepiia are not mentioned at all.](/img/docs/guides/toggleable-species-protein-after.png)
  </TabItem>
</Tabs>



:::

You might notice the `EntityEffect.HideEffectTag` variable. This is my tragically "probably not a good idea" means of hiding effects from the guidebook with minimal breaking changes.

For the sake of reusability, I've defined a function that gets the *condition* text of a reagent's effects. This also handles both empty conditions *and* effects that should be hidden entirely.

```csharp
// Content.Shared/_MACRO/EntityEffects/EntityEffect.MACRO.cs

public abstract partial class EntityEffect
{
    /// <summary>
    ///     This text provided by a condition acts as a flag to indicate that a metabolism effect
    ///     should be hidden from the guidebook entirely.
    /// </summary>
    public const string HideEffectTag = "!HIDEME!";

    /// <summary>
    ///     Get a localized string representation of this effect's conditions.
    /// </summary>
    /// <param name="count">The number of valid conditions.</param>
    /// <param name="showEntry">Whether or not this effect should be shown in the guidebook.</param>
    public string GetConditions(IPrototypeManager prototype, out int count, out bool showEntry)
    {
        showEntry = true;
        var conditions = Conditions?
            .Select(x => x.EntityConditionGuidebookText(prototype))
            .Where(x => x != string.Empty) // Properly handle empty conditions
            .ToList() ?? new();

        count = conditions.Count;

        // Hide this entry if any of the conditions indicates it should be hidden.
        if (conditions.Contains(HideEffectTag))
        {
            showEntry = false;
            return string.Empty;
        }

        return ContentLocalizationManager.FormatList(conditions);
    }
}
```

Then, when we get the guidebook text for a reagent's effects, we rely on this function to resolve its conditions.

```csharp
// Content.Shared/Chemistry/Reagent/ReagentPrototype.cs

public sealed partial class ReagentPrototype
{
    public string? GuidebookReagentEffectDescription(
        IPrototypeManager prototype, 
        IEntitySystemManager entSys, 
        EntityEffect effect, 
        FixedPoint2 metabolism)
    {
        if (effect.EntityEffectGuidebookText(prototype, entSys) is not { } description)
            return null;

        var quantity = (double)(effect.MinScale * metabolism);

        // Begin MACRO: Add the ability to hide conditions from the guidebook.
        var conditions = effect.GetConditions(prototype, out int count, out var showEntry);
        if (!showEntry)
            return null;
        // End MACRO

        return Loc.GetString(
            "guidebook-reagent-effect-description",
            ("reagent", LocalizedName),
            ("quantity", quantity),
            ("effect", description),
            ("chance", effect.Probability),
            ("conditionCount", count), // MACRO: Use provided valid condition count
            ("conditions", conditions)); // MACRO: Use condition string function
    }
}
```

### Partial prototypes

As of Robust Toolbox version [289.0.0](https://github.com/space-wizards/RobustToolbox/blob/master/RELEASE-NOTES.md#28900), it is now possible to **define prototypes partially** in YAML. Prior to this update, you had to define a prototype *and* all of its fields in a single place; writing two prototypes with the same `type` and `id` would break the prototypes. Now, however, it's possible to write the prototype in one place, and then replace *some* of its fields in another.

Macrocosm has two "partial prototype" folders: `_Features` and `_Partials`. These directories are made into partial prototype folders through this file specified at `Resources/PartialPrototypes/_macrocosm.yml`:

```yml
# Represents changes to upstream files made by Macrocosm.
- /Prototypes/_MACRO/_Partials

# Represents prototypes used to enable/disable features easily.
# https://docs.macrocosm.cool/Documents/Conventions/pull-requests
- /Prototypes/_MACRO/_Features
```

A partial prototype is written exactly like a normal prototype, but with only the fields you want to modify included. A partial prototype only needs to be identified by its `type` and `id` fields in combination. This would be a very minimal example of a partial prototype:

```yml
- type: species
  id: Allulalo
  roundStart: true
```

However, do note that "partial prototype" files do not exclusively have to be "partial" prototypes; you can define "full" prototypes like normally. These files simply have the *capability* to partially replace fields. One could hypothetically make *every* file capable of partialization!

As a result, however, if there was no `species` prototype called `Allulalo` in the codebase, this would add a **brand new** species called "Allulalo" with almost none of its fields defined, only the fact that it's enabled round-start. 

If your goal is just to *enable* a pre-existing Allulalo species, you probably do not want to do this. The `!PartialOnly` tag applied to the `type` allows you to *only* modify the prototype if it is already defined elsewhere.

```yml
- type: !PartialOnly species
  id: Allulalo
  roundStart: true  
# If there was no "Allulalo" species already, this prototype
# would simply be ignored.
```

:::info
I also like to use `!PartialOnly` in my partial prototype definitions to explicitly distinguish between a partial prototype and a full prototype. This could be relevant in the future, for example, if a `_Features` file had a mix of both "partial" and "full" prototypes - like if a "full" prototype needed to be uncommented to enable the feature.

*- [portfiend](/blog/authors/portfiend)*
:::

### Guidebook entries

Before, you had to manually uncomment and add the species guidebook entries to the guidebook. This is already handled now; all entries are uncommented by default.

```yml
# Resources/Prototypes/_MACRO/Guidebook/species.yml

# Guidebook entries are enabled and disabled alongside the species in this folder:
# Resources/Prototypes/_MACRO/_Features/Species/

- type: guideEntry
  id: Allulalo
  name: species-name-allulalo
  text: "/ServerInfo/_MACRO/Guidebook/Mobs/Allulalo.xml"

- type: guideEntry
  id: Ant
  name: species-name-ant
  text: "/ServerInfo/_MACRO/Guidebook/Mobs/Ant.xml"

# etc.
```

Guidebook entry order is defined in `Resources/Prototypes/_MACRO/_Partials/Guidebook/species.yml` alphabetically. A comment is included explaining why it's now fine to do things in this way.

```yml
# Resources/Prototypes/_MACRO/_Partials/Guidebook/species.yml

# Note that these entries will not show up in the guidebook if "showInGuidebook" and "includeAsChild"
# are disabled in the guidebook entry prototypes. You can enable or disable individual entries from
# the guidebook within the individual species' _Features file.

- type: !PartialOnly guideEntry
  id: Species
  children:
  # Above "Arachnid"
  - !Index:0 Allulalo
  - !Index:0 Ant
  - !Index:0 Apid
  # Above "Diona"
  - !Index:1 Decapoid
  # Above "Human"
  - !Index:3 Gastropoid
  - !Index:3 Gray
  # Above "Moth"
  - !Index:4 Kodepiia
  # Above "Reptilian"
  - !Index:5 Ovinia
  # Above "Vox"
  - !Index:7 Ungu
```

:::note
If you know how "adding items to lists at specific indices" works, this prototype might seem alarming - wouldn't adding an item at `Index:0` move everything else up by one index?

Through conventional logic, you'd want to add the items in *reverse* order, which would not affect the list indices for "earlier" items in the list. However, the partial prototype insertion logic already handles this; it's actually fine to add items to lists in this way.
:::

Thanks to the `showInGuidebook` field, we can hide the species guide entry from the player without needing to delete the entry entirely.

```yml
- type: !PartialOnly guideEntry
  id: Allulalo
  showInGuidebook: false # This would hide the entry from the list.
```

## Tips to making features toggleable

All of this is a bit of work to set up, but it makes it *much* easier for a downstream server to easily toggle features, which is what we're looking for. It also helps our maintainers play-testing your feature.

Ideally, features should use *configuration over code* to toggle a feature, especially if the feature is C#-based. This is usually accomplished via CVars defined in `Content.Shared/_MACRO/CCVar/`. 

However, enabling or disabling *content* is a bit of a different story, and in that case, using partial prototypes is one of the cleaner ways to make a feature configurable and toggleable. The `Resources/Prototypes/_MACRO/_Features/` folder is allocated for this purpose.

Again, you do not need to **remove content** in order to make a feature toggleable - all you need to do is *hide* its impact from the player. If you make a change to the underlying logic of a system, but it's possible to configure that system in a way to work identically as before, this is acceptable. If disabling a feature (like a species) makes an item unobtainable, you do not need to add specialized "toggles" for that item, and so on.

It's also perfectly acceptable to add logic and systems to the game without implementing content that uses it - these features are still nice for giving developers and admins tools to work with. This is considered sufficiently "toggleable", as if a downstream does not want to use that system, all they have to do is not use it.

The ultimate goal of a "toggleable" feature is that, if a server chooses to keep a certain feature disabled, that feature will have no impact on the game compared to before the feature was added, or as close to it as possible.
