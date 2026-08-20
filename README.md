# tsudo-lab-game-template

Reusable Expo / React Native base for small Tsudo Lab mobile games.

The purpose of this repository is simple: **reuse the app infrastructure and spend each new release on the game mechanic and visual design.**

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

Each title can look completely different. The intended visual replacement points are:

```text
src/design/HomeVisual.tsx   # entire home-screen presentation
src/design/GameVisual.tsx   # game chrome, HUD, tutorial/result UI, share card
src/game/GameView.tsx       # actual interactive game
src/ui/theme.ts             # colors/tokens when useful
```

`HomeScreen.tsx` and `GameScreen.tsx` are controllers. They load/save data and expose actions to the visual components. A redesign should normally change files under `src/design/` without moving storage, ads, sharing, navigation or retry logic into them.

So PON, a timing game and a swipe puzzle can share the same infrastructure while having unrelated home screens and play-screen art direction.

## Game-specific surface

Most new-game work should stay in:

```text
src/config/game.ts
src/design/
src/game/
src/ui/theme.ts
```

`src/game/GameView.tsx` reports score and game-over events to the reusable controller. `src/design/` determines how those states look.

## Structure

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
│  ├─ HomeScreen.tsx       # common controller
│  ├─ GameScreen.tsx       # common controller
│  └─ MenuScreen.tsx
├─ services/
│  ├─ adMob.ts
│  └─ adMob.native.ts
├─ storage/
│  ├─ adCadenceStorage.ts
│  ├─ highScoreStorage.ts
│  ├─ settingsStorage.ts
│  └─ tutorialStorage.ts
└─ ui/
   └─ theme.ts
```

## Start

```bash
npm install
npm start
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm test
```

## Creating a new game

See [`docs/HOW_TO_CREATE_NEW_GAME.md`](docs/HOW_TO_CREATE_NEW_GAME.md).

The included `GameView` and visual components are intentionally simple placeholders. Replace their game-specific content and visual direction rather than rebuilding common app behavior.

## Important before release

The template intentionally contains generic identifiers, test/sample ad configuration, and placeholder privacy copy. Every new title must replace those before production.
