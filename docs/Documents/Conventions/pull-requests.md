---
tags:
  - conventions
---

# Pull Requests

## Conventions

We recommend referring to Wizard's Den's [Conventions](https://docs.spacestation14.com/en/general-development/codebase-info/conventions.html) and the documentation of Microcosms in additions to the standards stated here.

### Content should be tested in Microcosms before being brought to Macrocosm

Pull requests made to Macrocosm will be treated with increased scrutiny and with the expectation that the pull request is a full-fledged, feature-complete addition to the project. Due to the bureaucracy involved with accepting changes to Macrocosm, we want to avoid small iterative bugfixes and microbalance changes as much as possible. 

We highly recommend playtesting and finalizing content in a Microcosm first and upstreaming it when the content is stable.

### Content brought to Macrocosm must match our license

Our codebase is under the [MIT License](https://github.com/syndicate-ss14/macrocosm/blob/master/LICENSE.TXT). While other codebases are free to use any license that suits them, we require that all code brought to Macrocosm be licensed under MIT as well. **It is the responsibility of the Pull Request creator to ensure that they are following the license of all code involved. If we believe that a PR has not received appropriate permission to be relicensed to MIT, it will be closed.**

### Original content goes in `_MACRO`

As we are downstream of Wizard's Den, namespacing content unique to Macrocosm is important for easing the difficulty of upstream merges.

A "namespace" is a subfolder in the game's directories that represents original content not added by Wizard's Den. Conventionally, the Space Station 14 community uses underscores (`_`) as a prefix for namespace folders, such as `_DEN`, `_Funkystation`, or `_Impstation`. Namespace folders are found under C# assembly folders (e.g. `/Content.Shared/_MACRO/`) or within Resources subfolders (e.g. `/Resources/Prototypes/_MACRO/`.)

All content original to Macrocosm **must be in the `_MACRO`** namespace. This includes all new **prototypes**, **audio**, **textures**, **locale strings**, and **C# code**. When a Microcosm ports their own features to Macrocosm ("upstreaming"), the ported feature should be moved from the Microcosm's namespace (if any) into the `_MACRO` namespace.

:::note[C# Namespaces]

When declaring a namespace in a C# file, there are times when it is more efficient not to use `_MACRO`. If you're writing an extension of an existing `partial` system, you should declare the namespace as the existing system's namespace. Doing this means you don't have to go into all the files that use the existing system and add new `using`s.

For fully original classes / interfaces / etc. you should use `_MACRO` in the namespace declaration.

This only affects the namespace *declaration*. All files should still be in `_MACRO` subfolders.

:::

### Macrocosm CVars should begin with `macrocosm`

When adding a new CVar, it should be defined in the `Content.Shared/_MACRO/CCVar/` folder and include `macrocosm` at the start of the name, like so:

```cs
public static readonly CVarDef<int> ConsumptionGibThreshold =
    CVarDef.Create("macrocosm.consumption.gib_threshold", 12, CVar.NOTIFY | CVar.REPLICATED | CVar.SERVER);
```

In a server's configuration `.toml` file, this would look something like this.

```toml
[macrocosm.consumption]
gib_threshold = 12
```

This makes it clear to downstreams that a CVar comes from us, and futureproofs against possible incompatibility with a Wizard's Den CVar during upmerges.

### Content should be easy for a downstream to disable

Macrocosm prides itself on its customizability as a base for downstreams. All features should have some way to "opt out" if feasible, ideally via cvars or minimal YML edits. **If a PR introducing a new feature does not provide a way to disable that feature, it may be rejected.**

An example of an easily removable feature would be ensuring that downstreams can comment out the means by which the feature would impact a round, such as the entry in a vendor's inventory or where the gamerule would be in an event scheduler.

### Comment changes made outside of `_MACRO`

If you alter code, you need to leave a comment to indicate that the code was altered, and how it was altered. This is to prevent confusion and accidental erasure of your changes in the future.

Additionally, changes to a YAML prototype that add components should be added to the end of the prototype.

#### Some examples of appropriate comments in a YML file:

{/* code from impstation#2744 w/ comments changed */}
```yml
- type: entityTable
  id: LetterRareEntityTable
  table: !type:GroupSelector
    children:
    - id: ResearchDisk5000
    - id: JointRainbow
    - id: StrangePill
      amount: !type:RangeNumberSelector
        range: 1, 3
    - !type:GroupSelector
      children:
      - id: Brutepack
      - id: Ointment
      - id: Gauze
      - id: Bloodpack
      # macrocosm start
      - id: SimpleSuture
      - id: Tincture
      # macrocosm end
    - id: SyndicateBusinessCard
      weight: 0.5
    # macrocosm start
    - !type:NestedSelector
      tableId: LetterImpRareEntityTable
```
This prefix and suffix format is preferable if a large amount of additions are made to the prototype; a suffix is only necessary if the prototype continues after the additions.

{/* code from impstation#3319 with comments changed. TODO: solutions refactor, this code should be updated */}
```yml
- type: reagent
  id: Egg
  name: reagent-name-raw-egg
  group: Foods
  desc: reagent-desc-raw-egg
  physicalDesc: reagent-physical-desc-mucus-like
  flavor: raw-egg
  color: white
  recognizable: true
  metabolisms:
    Food:
      effects:
      - !type:AdjustReagent
        reagent: UncookedAnimalProteins
        amount: 0.5
      - !type:AdjustReagent # macrocosm
        conditions:
          - !type:OrganType
            type: Kodepiia
        reagent: UncookedAnimalProteins
        amount: 1
```
Note that there is just one comment here, on the line with the effect type; even though everything after it alters the prototype, it's considered all one addition, so just one comment suffices.


#### Some examples of appropriate comments in a CS file:

{/* code from impstation#4024 w/ comments changed */}
```csharp
[DataField("damage")] public DamageSpecifier Damage = new()
{
    DamageDict = new ()
    {
        { "Cellular", 0.3 }, // macro "Poison", 0.3 > cellular 0.3
    }
};
```
This inline comment is preferable for very small, single line changes. Note how the comment also indicates what change was made, preserving the original intent for quick reference.

{/* code from funky-station#368 w/ comments changed */}
```csharp
// BEGIN Macrocosm
// Smoking in bed is dangerous!
if (HasComp<SleepingComponent>(containerManager.Owner)
    && HasComp<BuckleComponent>(containerManager.Owner))
{
    // 25% chance over the lifetime of a cigarette (66 times)
    if (_random.Prob(0.03f))
        _flammableSystem.AdjustFireStacks(containerManager.Owner, 0.5f, null, true);
}
// END Macrocosm
```
This prefix and suffix format is preferable for multi-line blocks of code added to a file.

### Use comments to describe what your code is doing

This is helpful both for maintainers to vet the code and ensure that it works as intended, and for future contributors to more easily understand code and be able to iterate on it.

Code should at minimum come with summary comments on Functions, Classes and Variables with exceptions for variables that are `EntitySystem` or `IEntitySystem` Dependencies within Systems. These comments should give a brief rundown of the Class/Function/Variables purpose in order to aid anyone who needs to work on that code in the future. Having comments on variables will help YAML users as well.

Here is a sample of a well-summarized, fully explained piece of code:

{/* code from impstation#3946 i picked this one because its funny sorry fan */}
```csharp
    /// <summary>
    /// Our function for handling the breeding action once all checks are finished and the
    /// animal has approached its partner.
    /// </summary>
    /// <param name="approacher"></param>
    /// <param name="approached"></param>
    /// <returns></returns>
    public bool TryBreedWithTarget(EntityUid approacher, EntityUid approached)
    {
        // Realistically this should never return false but it's just here for the moment
        if (!_entManager.TryGetComponent<ImpReproductiveComponent>(approacher, out var component))
            return false;

        // Same with this one but i'm paranoid
        if (!_entManager.TryGetComponent<ImpReproductiveComponent>(approached, out var partnerComp))
            return false;

        // Just being 100% sure we aren't trying to self breed.
        if (approacher == approached)
            return false;

        // The one giving birth needs to have options
        if (partnerComp.PossibleInfants == null)
            return false;

        // one last check in case someone beat us to the cow or bred us on the way there
        // It's dumb but unless I make the system assign pairings this is the best i can think of for the moment
        if (!CanYouBreed((approacher, component)) || !CanYouBreed((approached, partnerComp)))
            return false;

        // Ready up for birth
        partnerComp.Pregnant = true;
        partnerComp.EndPregnancy = partnerComp.PregnancyLength;

        // Add them to our list of pregnant NPCs to be tracked
        _mobsWaiting.Add(approached, partnerComp);

        // Picks which offspring to give birth to based on the mob we bred with
        var ctx = new EntityTableContext(new Dictionary<string, object>
        {
            { ValidPartnerCondition.PartnerContextKey, component.MobType },
        });
        partnerComp.MobToBirth = _entTable.GetSpawns(partnerComp.PossibleInfants, ctx: ctx).ElementAt(0);

        if (TryComp<InteractionPopupComponent>(approached, out var interactionPopup))
            Spawn(interactionPopup.InteractSuccessSpawn, _transform.GetMapCoordinates(approached));

        partnerComp.PreviousPartner = approacher;

        // GET HUNGRY GET THIRSTY
        _hunger.ModifyHunger(approacher, -component.HungerPerBirth);
        _hunger.ModifyHunger(approached, -partnerComp.HungerPerBirth);

        _thirst.ModifyThirst(approached, -component.HungerPerBirth);
        _thirst.ModifyThirst(approached, -partnerComp.HungerPerBirth);

        _adminLog.Add(LogType.Action, $"{ToPrettyString(approacher)} (carrier) and {ToPrettyString(approached)} (partner) successfully bred.");
        return true;
    }
```

### Recommended Reading

[The Robust Book](https://docs.spacestation14.com/) - Space Wizards Development Wiki

[Quick Guide to Space Station 14 Codebase Setup](https://gist.github.com/portfiend/6529ca0b1a5f98747e99ec2beea6a741) by portfiend

[Mutual Aid: A Factor of Evolution](https://theanarchistlibrary.org/library/petr-kropotkin-mutual-aid-a-factor-of-evolution) by Pëtr Kropotkin

[To Change Everything](https://crimethinc.com/tce) by Crimethinc

[Refactoring Guru](https://refactoring.guru/) - Refactoring and Design Patterns

[Beck's Robust ECS For Dummies](https://docs.google.com/document/d/1GCzkuWUqCNcl4WrmQQMbWgB5q8o0k6LYI46hqSt5cPY/) by widgetbeck

[The Slarti Guide](https://hackmd.io/@Slart/S1hsoGFm1l) by Slartibartfast
