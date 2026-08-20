# BUILD_PLAN_TEMPLATE

このファイルを新しいゲームRepositoryへコピーし、`docs/BUILD_PLAN.md` として使います。

`GAME_SPEC.md` が「何を作るか」なら、こちらは**どの順番で実装するか**を管理するファイルです。

Codexには原則としてTask単位で依頼します。

---

# Build Plan

## 0. 開始前チェック

- [ ] `docs/GAME_SPEC.md` がある
- [ ] 未決事項のうち、実装を止めるものが解消されている
- [ ] Game名 / app identifiersの方針が決まっている
- [ ] MVPで「入れない機能」が明確になっている

## Task 1 — Game Engine / Core Mechanics

目的:

```text
GameのルールだけでCore Loopが成立する状態にする。
```

実装:

- [ ] Game state
- [ ] Core rule
- [ ] Score calculation
- [ ] Start / Reset
- [ ] End condition
- [ ] Random / Seedが必要ならその設計
- [ ] Game EngineのUnit Test

触ってよい主な範囲:

```text
src/game/
```

原則触らない:

```text
src/design/
src/services/
src/storage/
Ads / Settings
```

完了条件:

- [ ] Rule通りにGameが進む
- [ ] End conditionが成立する
- [ ] Retry用にStateをResetできる
- [ ] 重要RuleのTestがある

## Task 2 — GameView / Input / Feel

目的:

```text
実際に触って遊べる状態にする。
```

実装:

- [ ] Input
- [ ] Game rendering
- [ ] Animation
- [ ] Haptics連携
- [ ] Score通知
- [ ] Run終了通知

触ってよい主な範囲:

```text
src/game/
```

完了条件:

- [ ] 最初の操作まで迷わない
- [ ] Game Engineと表示が同期している
- [ ] `onScoreChange` が正しく呼ばれる
- [ ] `onRunEnd` が1回だけ呼ばれる

## Task 3 — Visual Design

目的:

```text
そのGame固有のHome / HUD / Tutorial / Resultを作る。
```

実装:

- [ ] HomeVisual
- [ ] GameVisual / HUD
- [ ] Tutorial
- [ ] Result
- [ ] Share Card
- [ ] Theme / Assets

触ってよい主な範囲:

```text
src/design/
src/ui/theme.ts
assets/
```

原則:

- ControllerへVisual固有処理を入れない
- TemplateのPlaceholder Designへ寄せる必要はない
- 端末名をHardcodeしてLayout分岐しない
- 必要な調整は `width / height / safe area` を基準にResponsiveに行う

完了条件:

- [ ] HomeからPlayが分かる
- [ ] Play中に必要な情報だけ見える
- [ ] Resultが一目で理解できる
- [ ] Share Cardだけ見ても結果が伝わる

## Task 4 — Common Integration

目的:

```text
Templateの共通機能とGameを接続する。
```

確認 / 実装:

- [ ] Local BEST
- [ ] Retry
- [ ] Share
- [ ] Tutorial persistence
- [ ] Haptics setting
- [ ] Language
- [ ] Ads / cadence
- [ ] Privacy / Settings導線

完了条件:

- [ ] App再起動後もBESTが残る
- [ ] Retryで新しいRunが始まる
- [ ] Shareが実機で動く
- [ ] Adsが想定通り動く

## Task 5 — QA / Polish

目的:

```text
リリース前に壊れや違和感を減らす。
```

`Small screen / Large screen` のような曖昧な確認ではなく、標準Device Matrixを実際に起動して確認します。

### Simulator / Emulator

- [ ] iPhone SE (3rd generation)
- [ ] iPhone 16
- [ ] Pixel 8

### 各端末で確認

- [ ] Home
- [ ] Tutorial
- [ ] Game
- [ ] Result
- [ ] Settings / Privacy
- [ ] Safe Area
- [ ] 文字切れ / 折り返し
- [ ] Button / Touch Area
- [ ] Core Loopを複数回Play
- [ ] Game Over直前 / 直後
- [ ] 連続Retry
- [ ] NEW BEST
- [ ] 日本語
- [ ] 英語
- [ ] Haptics ON / OFF
- [ ] Performance

### Share / Ads

- [ ] Share cancel / success
- [ ] Adsあり / fallback

詳細は `docs/QA_CHECKLIST.md` を使います。

Check:

```bash
npm run typecheck
npm run lint
npm test
```

- [ ] typecheck pass
- [ ] lint pass
- [ ] tests pass

## Task 6 — Release Preparation

- [ ] `expo.name`
- [ ] `expo.slug`
- [ ] `expo.scheme`
- [ ] `ios.bundleIdentifier`
- [ ] `android.package`
- [ ] icon
- [ ] splash
- [ ] Production AdMob IDs
- [ ] UMP / Consent
- [ ] Privacy Policy
- [ ] Store privacy / Data Safety
- [ ] app-ads.txt関連
- [ ] Store screenshots
- [ ] Store copy
- [ ] iOS実機確認
- [ ] Android実機確認

## Phase 1.5 — Analytics（必要になったら）

このTaskはMVPリリースを止めない。

候補:

- [ ] game_start
- [ ] game_end
- [ ] score
- [ ] retry
- [ ] share
- [ ] ad_shown

## Phase 2 — Growth（当たったら）

MVP時点では実装しない。

- [ ] leaderboard
- [ ] dailyChallenge
- [ ] friendChallenge

## Backlog / 今回やらない

ここには、実装中に気づいたが現在のTaskへ混ぜないものを書く。

- [ ] 
- [ ] 
- [ ] 

## Templateへ戻す候補

このGame固有ではなく、他のCasual Gameでもそのまま使えそうな改善だけ記録する。

- [ ] 
- [ ] 

## Codexへの依頼例

```text
AGENTS.md、docs/GAME_SPEC.md、docs/BUILD_PLAN.mdを読んでください。
今回はTask 1だけ実装してください。
Task 1と無関係なUI、Ads、Settingsには変更を広げないでください。
必要なUnit Testを追加し、typecheck / lint / testを実行してください。
実行できなかったCheckは未実行と明記してください。
完了時に、実装内容・主な変更File・Test結果・未確認事項・別Task候補をまとめてください。
```
