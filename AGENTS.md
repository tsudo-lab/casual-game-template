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

```text
src/game/      = ゲーム固有のMechanics / State / Engine / GameView
src/design/    = タイトル固有のHome / HUD / Tutorial / Exit / Result / Share Card
src/screens/   = 共通Controller
src/storage/   = Local persistence
src/services/  = 共通Service
src/modules/   = 必要になったReusable Capabilityの整理先
src/config/    = Game metadata / tutorial / share configuration
```

### ControllerとVisualを混ぜない

- `src/screens/HomeScreen.tsx` はHomeの共通Behavior
- `src/design/HomeVisual.tsx` はHomeの見た目
- `src/screens/GameScreen.tsx` はRun / BEST / Retry / Share / Ads / Tutorial lifecycle / Exit flow / Android Back
- `src/design/GameVisual.tsx` はGame HUD / Tutorial / Exit / Result / Share Cardの見た目
- `src/game/GameView.tsx` は実際のゲーム

デザイン変更のためにStorage、Ads、Navigation、Retry、Tutorial状態、Exit flowを `src/design/` へ移さないでください。

## 3. GameViewの基本契約

```ts
interface GameViewProps {
  runId: number;
  hapticsEnabled: boolean;
  language: 'ja' | 'en';
  onScoreChange: (score: number) => void;
  onRunEnd: (result: GameResult) => void;
}
```

- Score変化時に `onScoreChange`
- 1 Run終了時に `onRunEnd` を1回だけ
- Retry Resetには `runId`
- High Score保存をGame側へ重複実装しない
- Ad表示をGame側へ直接書かない
- NavigationをGame Engineへ持ち込まない

## 4. 共通Behaviorを壊さない

ゲーム固有要件がない限り、以下はTemplate標準を維持します。

```text
Local BEST
Initial tutorial state
Tutorial carousel
Tutorial reopen via ?
Game exit confirmation
Android Back
Retry
Share image + text + URL
Haptics persistence
Language setting
Settings / Privacy
AdMob / UMP
Interstitial cadence
Offline / ad failure fallback
EAS profiles
release:check
```

### Tutorial

- 初回Playで自動表示
- `GAME_META.tutorialSlides` の内容をゲーム固有化
- Game中 `?` から再表示
- Tutorial表示中はGame入力をBlock

### Game exit confirmation

Game途中のHome操作:

```text
Homeへ戻る
最初からやり直す
ゲームを続ける
```

Modal表示中はGame入力をBlockします。

### Android Back

```text
Home       → OS標準挙動
Settings   → Home
Privacy    → Settings
Game中     → Exit confirmation
Exit表示中 → Exit confirmationを閉じる
Tutorial中 → Tutorialを閉じる
```

### Share

標準はResult画像 + `GAME_META.shareMessage` + `GAME_META.shareUrl` です。Shareの見た目は自由ですが、Controller側の画像生成 / Native Share処理を重複実装しません。

## 5. 実装Taskの進め方

`docs/BUILD_PLAN.md` が存在する場合は、原則として指定されたTaskだけ実装してください。

Scope外の問題は、勝手に大きく修正せず「別Task候補」に記載してください。

## 6. 変更は小さく保つ

避けること:

- Mechanics実装と大規模Refactorを同じPRで行う
- Design変更のついでに共通Controllerを書き換える
- 頼まれていないBackend / Login / Rankingを追加する
- 将来使いそうという理由だけで抽象化する
- 空のModuleや未使用Interfaceを大量に追加する

## 7. Product Phase

### Phase 1

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

明示的に依頼されない限り追加しないもの:

- Login / Account
- Profile
- Follow
- Real-time multiplayer
- Season
- Heavy LiveOps
- Backend

## 8. Module方針

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

## 9. Design方針

各GameのVisual Identityは自由です。

- Layout
- Typography
- Background
- Color
- Button shape
- HUD position
- Result composition
- Tutorial presentation
- Exit modal presentation
- Share Card
- Animation

はタイトルごとに変更して構いません。

共通化するのは見た目ではなくBehaviorです。

## 10. 仕様との優先順位

1. 現在のUserからの明示的な依頼
2. `docs/GAME_SPEC.md`
3. `docs/BUILD_PLAN.md` の対象Task
4. この `AGENTS.md`
5. 既存実装のPattern

## 11. Test / Check

作業完了前に可能な範囲で:

```bash
npm run typecheck
npm run lint
npm test
```

Production設定を変更した場合:

```bash
npm run release:check
```

Template初期状態ではProduction IDがPlaceholderなので `release:check` は失敗します。Game側で本番設定を完了した後のGateとして使います。

実行できないCheckを「実行済み」と書かないでください。

## 12. 端末別Layout / QA

標準確認端末:

```text
iPhone SE (3rd generation)
iPhone 16
Pixel 8
```

- 起動方法: `docs/LOCAL_DEVICE_TESTING.md`
- 確認項目: `docs/QA_CHECKLIST.md`

```text
検証単位 = 実際のDevice Profile
Layout判断 = width / height / safe area
```

端末名HardcodeによるLayout分岐は避けてください。

## 13. Native dependency / Ads

`react-native-google-mobile-ads` は既知動作versionへ固定しています。根拠なくversion rangeへ戻さないでください。

依存更新時は最低限:

- iOS native build
- Pixel 8 native build
- UMP
- Test Interstitial

を再確認します。

Development / PreviewではTest Adsを維持し、ProductionではTest Ads / Consent debugを必ず無効化します。

## 14. Release docs

Release作業では以下を使用します。

- `docs/RELEASE_CHECKLIST_TEMPLATE.md`
- `docs/STORE_LISTING_TEMPLATE.md`
- `docs/STORE_PRIVACY_TEMPLATE.md`

Store申告は推測で埋めず、Production実装と第三者SDKの現行Disclosureを確認してください。

## 15. 完了報告

最低限:

```text
実装したこと
変更した主なFile
実行したTest / Check
端末確認
未確認事項
別Taskに回した方がよいこと
```

## 16. Templateへ戻すべき変更

```text
Game固有 → Game側に残す
複数Gameでそのまま使える → TemplateへのBackport候補
```

実際のGameで有効性を確認してからTemplateへ戻します。
