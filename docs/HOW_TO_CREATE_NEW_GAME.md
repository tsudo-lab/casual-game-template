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

The main replacement point is:

`src/game/GameView.tsx`

The common shell passes these props:

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
- do not move common score, retry, share, ad, settings, or high-score logic into the game

For a larger game, split `src/game/` into `engine.ts`, `GameView.tsx`, components, and tests.

## 4. Change the game visual design

Shared neutral tokens are in `src/ui/theme.ts`.

For each title, it is fine to replace the stage design heavily. The reusable boundary is behavior, not visual sameness. Home and result screens can also receive title-specific art while keeping their common actions intact.

## 5. What is already common

The template already includes:

- Home screen
- Game shell
- Best-score persistence
- One-time tutorial overlay
- Retry flow
- Share-card generation
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
3. title-specific visual assets / theme overrides

If a new game repeatedly requires edits elsewhere, consider whether that feature belongs in the shared template instead.
