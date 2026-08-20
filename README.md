# tsudo-lab-game-template

Reusable Expo / React Native base for small Tsudo Lab mobile games.

The purpose of this repository is simple: **reuse the app infrastructure and spend each new release on the game mechanic and visual design.**

## Shared by default

- Home screen
- Game shell
- Best-score persistence
- One-time tutorial
- Retry flow
- Result sharing as an image
- Haptics setting
- Japanese / English setting
- Settings screen
- Privacy placeholder
- AdMob initialization / UMP hook
- Interstitial cadence after completed runs
- Web / Expo Go ad-safe fallback

## Game-specific surface

Most new-game work should stay in:

```text
src/config/game.ts
src/game/
src/ui/theme.ts   # only when the title needs a different visual system
```

`src/game/GameView.tsx` is the primary replacement point. It reports score and game-over events to the reusable `GameScreen` shell.

## Structure

```text
App.tsx
src/
├─ config/
│  └─ game.ts
├─ game/
│  ├─ GameView.tsx
│  └─ types.ts
├─ screens/
│  ├─ HomeScreen.tsx
│  ├─ GameScreen.tsx
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

The included `GameView` is intentionally a tiny placeholder game so the common shell can be exercised immediately. Replace it rather than building new app infrastructure around it.

## Important before release

The template intentionally contains generic identifiers, test/sample ad configuration, and placeholder privacy copy. Every new title must replace those before production.
