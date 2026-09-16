---
tags:
  - conventions
---

# Voting

Macrocosm utilizes consensus decision-making, where any contributor may create a pull request, and each Microcosm must vote on that pull request before it is merged.

All pull requests fall under one of four categories:

* Category A: Universally Desired
* Category B: Universally Agreed-on
* Category C: Extreme Maintenance Burden
* Category D: Intended Behavior

The categorization of each Pull Request is done by the triage team.

### Category A: Universally Desired

This is a pull request where all Microcosms agree that they want this content and are happy to have it in their codebase. 

Category A pull requests require unanimous agreement, **with no abstains or blocking votes**. Blocking votes are expected to have a written explanation behind the block, ideally with suggested course of action on what would be needed to change their vote.

Even if a pull request is under Category A, the policy regarding customization still applies: there should always be a simple way to disable the content.

### Category B: Universally Agreed-on

This is a pull request where all Microcosms are fine if not completely enthusiastic with the content. This is also where pull requests regarding altering a Wizard's Den upstream merge will land.

Category B pull requests require agreement **with no blocking votes**; abstentions are allowed. Blocking votes are expected to have a written explanation behind the block, ideally with suggested course of action on what would be needed to change their vote.

### Category C: Extreme Maintenance Burden

This is a pull request that represents the collaborative effort between multiple Microcosms on a project that is better handled on the shared platform rather than in their respective downstreams. Potential examples of a Category C pull request would be a mechanically complex major antagonist, a complete UI rework, or other large-scale gameplay overhaul.

Category C pull requests require agreement **with no blocking votes**; abstentions are allowed. Category C pull requests will receive the highest scrutiny out of anything as they represent the largest risk to the overall stability of the project.

### Category D: Intended Behavior

This is a pull request that fixes an unintended issue with a feature to bring it closer to its original design intent. These pull requests are considered "pre-approved", as the feature's correct design intent has already been voted on and approved in the past. Because of this, Category D pull requests can only change features added by Macrocosm.

Category D pull requests **do not require a vote**, only a passing code review, but any Microcosm representative may flag the pull request to be retriaged to a different category, even if they are not a code reviewer or a member of the triage team.

Category D does **not** apply to "subjective" changes, such as balance tweaks, unless the original value in question is blatantly contradictory to the intended design. 

- ***Applicable:*** The metabolism delay of a species is meant to be `0.5x` as long, but was written as `2x` instead.
- ***Not Applicable:*** The metabolism delay of a species is `2x` as long, but a contributor thinks this is too much and wants to make it `1.5x` instead. This would likely be Category A.
