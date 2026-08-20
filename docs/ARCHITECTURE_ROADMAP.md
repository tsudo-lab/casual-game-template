# Tsudo Lab game architecture roadmap

This document separates **business/game lines**, **template repositories**, and **optional modules** so the codebase does not become over-generalized too early.

## 1. Tsudo Lab game lines

Tsudo Lab can explore three broad development lines without forcing them onto one technical foundation.

```text
Tsudo Lab
├─ Casual
├─ Pochi-style long-running games
└─ Steam / Switch / party-oriented titles
```

### Casual

Short-session mobile games designed for rapid experimentation and frequent releases. This is the only line currently being standardized with a template.

### Pochi-style

Long-running games built around repeated progression, economy, community, or persistent worlds. These should be developed as individual products first. Common infrastructure should be extracted only after repeated patterns actually emerge.

### Steam / Switch / party-oriented

Games where the core appeal may be multiplayer, streaming, spectatorship, controllers, PC/console distribution, or stronger bespoke content. These should not be forced into the React Native mobile template family.

## 2. Template family

Current implementation:

```text
tsudo-lab-game-template
└─ role: Casual Game Template
```

Possible future repositories, created only when needed:

```text
stage-game-template
└─ stage select
   stage unlock/progression
   clear state
   next-stage flow
   stage records / stars

party-game-template
└─ player setup
   room/round setup
   prompts/turns
   shared result flow
```

Do not build either repository in advance merely for completeness.

## 3. Casual template phases

### Phase 1 — release fast

Default for every new casual title.

```text
core game
local best
retry
share
ads
settings/tutorial
```

Goal: determine whether the mechanic itself earns repeated play.

### Phase 1.5 — measure

Add comparable analytics across titles. The important question is not only “how many installs?” but “which games create replay and return behavior?”

Candidate shared events:

```text
game_start
game_end
score
retry
share
ad_shown
```

### Phase 2 — grow winners

Only titles with promising behavior receive optional network/growth features.

Candidate modules:

```text
leaderboard
dailyChallenge
friendChallenge
```

A backend such as Supabase may be introduced here when the feature actually needs persistence, identity, or server-side validation.

No automatic Phase 3-5 exists. Heavy social/live-service systems are product decisions, not default maturity milestones.

## 4. Module architecture

Modules stay in the casual-template repository for now.

Destination grouping:

```text
src/modules/
├─ core/
│  ├─ ads/
│  ├─ analytics/
│  ├─ share/
│  └─ settings/
│
├─ growth/
│  ├─ leaderboard/
│  ├─ dailyChallenge/
│  └─ friendChallenge/
│
└─ liveops/
   ├─ remoteConfig/
   ├─ events/
   └─ notifications/
```

### Core

Features useful to most titles and appropriate to ship early.

### Growth

Optional features for titles that have demonstrated enough value to justify backend/product complexity.

### Liveops

Only add when a title genuinely requires ongoing operational control. These are not default casual-game features.

## 5. When to extract modules into another repository

Do **not** create a separate modules repository now.

Consider a shared package/repository only when all of the following are true:

1. At least two template families or several active games need the same implementation.
2. Copying changes between projects has become a real maintenance problem.
3. The API is stable enough that versioning it saves more time than it costs.

At that point a structure such as `tsudo-lab-mobile-core` may make sense.

## 6. Architecture rule of thumb

Optimize for the current product, not hypothetical reuse.

```text
first occurrence  → implement locally
repeated pattern  → organize as a module
cross-template repeated pattern → consider package extraction
```

This keeps the Casual line fast while leaving room for Stage, Party, Pochi, and Steam/console development to evolve independently.
