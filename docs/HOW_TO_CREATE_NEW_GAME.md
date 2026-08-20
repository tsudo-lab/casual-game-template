# How to create a new Tsudo Lab game

The goal of this repository is to make the app shell reusable so each release mainly changes the **game rule and visual design**.

## 1. Copy the template

Create a new repository from this codebase, then change the app identifiers in `app.json`.

At minimum update:

- `expo.name`
- `expo.slug`
- `expo.scheme`
- `ios.bundleIdentifier`
- `android.package`
- AdMob app IDs before production

## 2. Change the game metadata

Edit `src/config/game.ts`.

Set:

- game id
- title
- one-line subtitle
- one-line tutorial
- score label
- share message

Keep the tutorial short enough that a first-time player can understand the whole game in a few seconds.

## 3. Replace the actual game

The main mechanics replacement point is:

`src/game/GameView.tsx`

The common controller passes these props:

```ts
interface GameViewProps {
  runId: number;
  hapticsEnabled: boolean;
  language: 'ja' | 'en';
  onScoreChange: (score: number) => void;
  onRunEnd: (result: GameResult) => void;
}
```

Rules:

- keep game-specific state and logic under `src/game/`
- call `onScoreChange` whenever the displayed score changes
- call `onRunEnd` exactly once when a run ends
- use `runId` to reset game state after retry
- do not move common score persistence, retry, sharing, ads or navigation into the game

For a larger game, split `src/game/` into `engine.ts`, `GameView.tsx`, components, and tests.

## 4. Design the title freely

The template deliberately separates **behavior from presentation**.

Use these files as the primary visual replacement points:

- `src/design/HomeVisual.tsx` — entire home-screen layout and art direction
- `src/design/GameVisual.tsx` — play-screen frame/HUD, tutorial, result UI and share-card look
- `src/game/GameView.tsx` — the interactive stage itself
- `src/ui/theme.ts` — optional shared colors/tokens for that title

You may completely replace the JSX and styles in `HomeVisual.tsx` and `GameVisual.tsx`. The new title does **not** need to resemble the template or other Tsudo Lab games.

Keep these behavioral contracts intact:

- `HomeVisual` must still expose Play and Settings actions
- `GameVisual` must still expose Home, tutorial-close, Share and Retry actions
- the hidden share-card ref must remain available somewhere in `GameVisual` if image sharing is used
- game mechanics still report score/run-end through `GameView`

The controller files under `src/screens/` should normally need no design edits.

Example: for PON, `HomeVisual` could be a white full-screen scene with floating glossy balls and no visible card structure, while another game could use typography, illustrations or a completely different composition. Both still use the same navigation, storage and ad behavior.

## 5. What is already common

The template already includes:

- Home controller
- Game-session controller
- Best-score persistence
- One-time tutorial state
- Retry flow
- Share-card image generation behavior
- Haptics setting
- Japanese / English setting
- Settings screen
- Privacy screen placeholder
- AdMob initialization and interstitial flow
- Three-completed-runs ad cadence
- Web / Expo Go safe ad fallback

## 6. Before production

Do not ship the template identifiers or privacy text.

Replace test/sample configuration with the new game's production configuration, then verify:

- iOS / Android identifiers
- icons and splash assets
- production AdMob app IDs and interstitial IDs
- UMP message
- privacy policy URL and in-app copy
- store privacy / data-safety answers
- app-ads.txt relationship
- real-device ad cadence
- sharing on real devices
- safe-area layouts on small and large devices

## Recommended weekly workflow

For the 3-releases-per-week strategy, aim to spend almost all game-specific work in:

1. `src/config/game.ts`
2. `src/game/`
3. `src/design/`
4. title-specific assets / `src/ui/theme.ts`

If a new game repeatedly requires edits to controller, storage, service or navigation files, consider whether that feature belongs in the shared template instead.
