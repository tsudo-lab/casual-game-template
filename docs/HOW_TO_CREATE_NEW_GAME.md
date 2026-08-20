# How to create a new Tsudo Lab casual game

This repository is the current **Casual Game Template**. Its job is to make short-session mobile games fast to build while keeping each title's mechanic and visual identity independent.

## 1. Decide whether this template fits

Use this template when the app is roughly:

```text
Home
→ Play
→ score / progress during one run
→ result
→ retry / share
```

Good fits include score attack, 2048-style casual puzzle, timing, reflex, physics, merge, swipe, and other short-session solo games.

Do not force a game into this template if it fundamentally needs stage select/progression or a party-game setup flow. Those may become separate templates later when a real title requires them.

## 2. Copy the template

Create a new repository from this codebase, then change app identifiers in `app.json`.

At minimum update:

- `expo.name`
- `expo.slug`
- `expo.scheme`
- `ios.bundleIdentifier`
- `android.package`
- production AdMob configuration before release

## 3. Change game metadata

Edit `src/config/game.ts` and set the game id, title, subtitle, tutorial copy, score label, and share message.

## 4. Replace the actual game

The main mechanics replacement point is:

`src/game/GameView.tsx`

The common controller passes a small contract:

```ts
interface GameViewProps {
  runId: number;
  hapticsEnabled: boolean;
  language: 'ja' | 'en';
  onScoreChange: (score: number) => void;
  onRunEnd: (result: GameResult) => void;
}
```

Keep game-specific state and logic under `src/game/`. Report score changes and run completion to the controller rather than moving persistence, ads, sharing, or navigation into the game implementation.

## 5. Design the title freely

The template separates behavior from presentation.

Primary visual replacement points:

- `src/design/HomeVisual.tsx` — entire home-screen composition
- `src/design/GameVisual.tsx` — HUD, result/tutorial UI, share-card look
- `src/game/GameView.tsx` — interactive stage itself
- `src/ui/theme.ts` — optional title-specific tokens
- `assets/` — title-specific visuals

The new game does not need to resemble any other Tsudo Lab title.

## 6. Phase 1 is the default

Every new casual game starts lightweight:

```text
Phase 1
- game
- local best score
- retry
- share
- ads
- settings/tutorial
```

The purpose is to release quickly and determine whether the core loop is worth growing.

## 7. Phase 1.5: measure before adding features

Analytics should eventually provide comparable signals across titles, such as game start/end, retry, score, share, play frequency, and retention-related behavior.

Do not judge a title only by installs. A smaller game with strong replay may be a better Phase 2 candidate than a larger game people open once.

## 8. Phase 2: grow winners only

Only successful titles should receive optional growth features such as:

- leaderboard
- daily challenge / common seed
- friend-record challenge

These belong conceptually under `src/modules/growth/` and may use services such as Supabase when needed.

Do not automatically add profiles, follower systems, seasons, real-time multiplayer, or other heavy live-service features to casual games.

## 9. Module policy

Modules stay inside this repository for now. Do not create a separate modules repository prematurely.

Planned conceptual groups:

```text
src/modules/
├─ core/
│  ├─ ads
│  ├─ analytics
│  ├─ share
│  └─ settings
├─ growth/
│  ├─ leaderboard
│  ├─ dailyChallenge
│  └─ friendChallenge
└─ liveops/
   ├─ remoteConfig
   ├─ events
   └─ notifications
```

This is a destination architecture, not a requirement to create empty code. Extract shared packages only after multiple templates genuinely reuse the same implementation.

## 10. Future template family

Do not build these now, but keep the boundary clear:

```text
tsudo-lab-game-template      = Casual Game Template (current)
future stage-game-template   = stage select / clear / progression
future party-game-template   = lightweight mobile party games
```

Long-running Pochi-style games and Steam / Switch titles are separate development lines rather than extensions of this React Native casual template.

## Before production

Verify identifiers, assets, production ads/consent, privacy/data-safety declarations, sharing, safe areas, typecheck/lint/tests, and real-device behavior before shipping.
