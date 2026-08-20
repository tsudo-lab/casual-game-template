# AGENTS.md

このRepositoryは、つどラボの **Casual Game Template** です。

Codexなどの実装Agentは、作業開始前にこのファイルと、対象ゲーム側の `docs/GAME_SPEC.md` / `docs/BUILD_PLAN.md` を確認してください。

## 1. このTemplateの目的

短時間で遊べるMobile Casual Gameを素早く作るための共通基盤です。

共通化の目的は、各タイトルで以下へ集中することです。

- ゲームのルール
- 操作感
- Visual Design
- Animation / Juice
- Result / Shareの見せ方

Templateの都合にゲームを合わせるのではなく、**共通化できるBehaviorだけを再利用します。**

## 2. Architecture

基本的な責務は以下です。

```text
src/game/      = ゲーム固有のMechanics / State / Engine / GameView
src/design/    = タイトル固有のHome / HUD / Tutorial / Result / Share Card
src/screens/   = 共通Controller
src/storage/   = Local persistence
src/services/  = 共通Service
src/modules/   = 必要になったReusable Capabilityの整理先
src/config/    = Game metadata / configuration
```

### ControllerとVisualを混ぜない

- `src/screens/HomeScreen.tsx` はHomeの共通Behaviorを担当する
- `src/design/HomeVisual.tsx` はHomeの見た目を担当する
- `src/screens/GameScreen.tsx` はRun / Score保存 / Retry / Share / Ads等を担当する
- `src/design/GameVisual.tsx` はGame HUD / Tutorial / Result / Share Cardの見た目を担当する
- `src/game/GameView.tsx` は実際のゲームを担当する

デザイン変更のためにStorage、Ads、Navigation、Retryなどを `src/design/` へ移さないでください。

## 3. GameViewの基本契約

原則としてゲーム固有処理は `src/game/` に閉じ込めます。

現在の基本Contract:

```ts
interface GameViewProps {
  runId: number;
  hapticsEnabled: boolean;
  language: 'ja' | 'en';
  onScoreChange: (score: number) => void;
  onRunEnd: (result: GameResult) => void;
}
```

- Scoreが変化したら `onScoreChange` を呼ぶ
- 1 Runの終了時に `onRunEnd` を1回だけ呼ぶ
- Retry時のResetには `runId` を利用する
- High Score保存をGame側へ重複実装しない
- Ad表示をGame側へ直接書かない
- NavigationをGame Engineへ持ち込まない

## 4. 実装Taskの進め方

`docs/BUILD_PLAN.md` が存在する場合は、原則として**指定されたTaskだけ**実装してください。

例:

```text
Task 1: Game Engine
```

と指定された場合、必要がない限りHome Design、Ads、Settingsなどへ変更範囲を広げないでください。

Scope外の問題を発見した場合は、勝手に大きく修正せず、完了報告の「別Task候補」に記載してください。

## 5. 変更は小さく保つ

1つのPRでは、できるだけ1つの目的に集中します。

避けること:

- Mechanics実装と大規模Refactorを同じPRで行う
- Design変更のついでに共通Controllerを書き換える
- 頼まれていないBackend / Login / Rankingを追加する
- 将来使いそうという理由だけで抽象化する
- 空のModuleや未使用Interfaceを大量に追加する

## 6. Product Phase

### Phase 1

新作は原則ここから始めます。

```text
game
local best
retry
share
ads
settings / tutorial
```

### Phase 1.5

必要に応じてAnalyticsを追加します。

### Phase 2

当たったGameだけ、明示的な依頼がある場合に追加します。

```text
leaderboard
dailyChallenge
friendChallenge
```

以下は、明示的に依頼されない限り追加しないでください。

- Login / Account
- Profile
- Follow
- Real-time multiplayer
- Season
- Heavy LiveOps
- Backend

## 7. Module方針

`src/modules/` は将来の整理先です。

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

図を完成させるためだけの空実装は禁止です。

まず実際のProduct内で実装し、同じPatternが繰り返された時だけ共通化してください。

## 8. Design方針

各GameのVisual Identityは自由です。

TemplateのPlaceholder Designへ寄せる必要はありません。

- Layout
- Typography
- Background
- Color
- Button shape
- HUD position
- Result composition
- Share Card
- Animation

はタイトルごとに変更して構いません。

共通化するのは見た目ではなくBehaviorです。

## 9. 仕様との優先順位

判断が衝突した場合は、基本的に以下の順で優先します。

1. 現在のUserからの明示的な依頼
2. `docs/GAME_SPEC.md`
3. `docs/BUILD_PLAN.md` の対象Task
4. この `AGENTS.md`
5. 既存実装のPattern

仕様に矛盾や不足がある場合は、推測で大きなProduct判断をせず、必要な確認事項として報告してください。

## 10. Test / Check

作業完了前に、可能な範囲で以下を実行してください。

```bash
npm run typecheck
npm run lint
npm test
```

Game Engineの重要なRuleは、可能ならUnit Testを追加してください。

実行できないCheckがある場合は「実行済み」と書かず、未実行理由を明記してください。

## 11. 完了報告

Task完了時は、最低限以下を簡潔に報告してください。

```text
実装したこと
変更した主なFile
実行したTest / Check
未確認事項
別Taskに回した方がよいこと
```

## 12. Templateへ戻すべき変更

Game開発中に共通改善が見つかっても、その場でCasual Templateまで勝手に変更しません。

まずGame側Taskを完了し、その変更が本当に複数タイトル共通かを判断します。

```text
Game固有 → Game側に残す
複数Gameでそのまま使える → TemplateへのBackport候補
```
