# Tsudo Lab Casual Game Template

This repository is the reusable **casual-game foundation** for Tsudo Lab mobile titles.

The purpose is to reuse app infrastructure while keeping each game's mechanic and visual identity free. PON, a 2048-style score game, a timing game, a physics game, or a simple puzzle can all use the same base even when their screens look completely different.

> Repository name remains `tsudo-lab-game-template` for now. Conceptually this is the **Casual Game Template**.

## Current scope

For now, Tsudo Lab maintains **only this Casual Game Template**.

Do not create Stage / Party templates in advance. Create them only after a real game needs a substantially different application flow.

Future template family:

```text
tsudo-lab
├─ casual-game-template      # NOW: short-session solo casual / score attack
├─ stage-game-template       # FUTURE: stage select / clear / progression
└─ party-game-template       # FUTURE: lightweight mobile party games
```

Steam / Switch party titles and long-running Pochi-style games are outside this React Native template family and should be developed independently until repeated common patterns actually appear.

See `docs/ARCHITECTURE_ROADMAP.md` for the longer-term structure.

## Shared by default

The shared layer owns behavior, not art direction:

- navigation
- best-score persistence
- one-time tutorial state
- retry flow
- result sharing as an image
- haptics setting
- Japanese / English setting
- settings / privacy behavior
- AdMob initialization / UMP hook
- interstitial cadence after completed runs
- Web / Expo Go ad-safe fallback

## Freely replaceable per game

```text
src/design/HomeVisual.tsx   # entire home-screen presentation
src/design/GameVisual.tsx   # HUD, tutorial/result UI, share card
src/game/GameView.tsx       # actual interactive game
src/ui/theme.ts             # game-specific visual tokens when useful
assets/                     # game-specific art/assets
```

`HomeScreen.tsx` and `GameScreen.tsx` are controllers. They load/save data and expose actions to visual components. A redesign should normally change `src/design/` without moving persistence, ads, sharing, navigation, or retry logic into the design layer.

## Module strategy

Modules are **not separate repositories right now**.

The intended structure is:

```text
src/modules/
├─ core/       # used by most casual games
├─ growth/     # add only to games worth growing
└─ liveops/    # add only when ongoing operation becomes necessary
```

Conceptually:

```text
core/
  ads
  analytics
  share
  settings

growth/
  leaderboard
  dailyChallenge
  friendChallenge

liveops/
  remoteConfig
  events
  notifications
```

Do not add empty implementations just to match this diagram. Existing shared code may remain in `services/` and `storage/` until a real refactor is useful. The module boundary is documented now so future functionality has a clear home.

If the same module is eventually shared by multiple template repositories, only then consider extracting a package/repository such as `tsudo-lab-mobile-core`.

## Product phases

The casual-game line should stay lightweight:

```text
Phase 1   Release fast
          game + local best + retry + share + ads

Phase 1.5 Measure
          analytics / replay / retention / share behavior

Phase 2   Grow winners only
          leaderboard / daily challenge / friend challenge as needed
```

There is no default Phase 3-5 feature stack. Profiles, social graphs, real-time multiplayer, seasons, and heavy live operations should be added only when a specific successful title clearly needs them.

## Game-specific surface

Most new-game work should stay in:

```text
src/config/game.ts
src/design/
src/game/
src/ui/theme.ts
assets/
```

## Current structure

```text
App.tsx
src/
├─ config/
│  └─ game.ts
├─ design/
│  ├─ HomeVisual.tsx
│  └─ GameVisual.tsx
├─ game/
│  ├─ GameView.tsx
│  └─ types.ts
├─ screens/
│  ├─ HomeScreen.tsx
│  ├─ GameScreen.tsx
│  └─ MenuScreen.tsx
├─ services/
├─ storage/
├─ modules/
│  └─ README.md
└─ ui/
   └─ theme.ts
```

## Creating a new game

See:

- `docs/HOW_TO_CREATE_NEW_GAME.md`
- `docs/ARCHITECTURE_ROADMAP.md`

The included game and visual components are intentionally simple placeholders. Replace the mechanic and art direction rather than rebuilding the common app behavior.

## Before release

The template intentionally contains generic identifiers, test/sample ad configuration, and placeholder privacy copy. Every production title must replace those and pass install / typecheck / lint / test / real-device checks.
