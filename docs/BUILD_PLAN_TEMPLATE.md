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
- [ ] Share URLの方針が決まっている
- [ ] Tutorialのページ構成が決まっている

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
そのGame固有のHome / HUD / Tutorial / Exit / Resultを作る。
```

実装:

- [ ] HomeVisual
- [ ] GameVisual / HUD
- [ ] Tutorial carouselの見た目
- [ ] `?` Tutorial入口
- [ ] Game exit confirmationの見た目
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
- Tutorial / ExitのBehaviorはController側の共通Flowを利用する

完了条件:

- [ ] HomeからPlayが分かる
- [ ] Play中に必要な情報だけ見える
- [ ] Tutorialがページ単位で理解できる
- [ ] Exit確認の3択が分かる
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
- [ ] Result画像 + Message + URL Share
- [ ] Tutorial persistence
- [ ] Tutorial reopen via `?`
- [ ] Game exit confirmation
- [ ] Android Back
- [ ] Haptics setting
- [ ] Language
- [ ] Ads / cadence
- [ ] UMP consent debug
- [ ] Privacy / Settings導線

完了条件:

- [ ] App再起動後もBESTが残る
- [ ] Retryで新しいRunが始まる
- [ ] Home / Restart / Continueの離脱Flowが動く
- [ ] Pixel 8のBackがGame / Settings / Privacyで正しく動く
- [ ] Share画像 + 文章 + URLが実機で動く
- [ ] Adsが想定通り動く
- [ ] Offline / 広告失敗でもGameが止まらない

## Task 5 — QA / Polish

目的:

```text
リリース前に壊れや違和感を減らす。
```

起動手順は `docs/LOCAL_DEVICE_TESTING.md`、確認項目は `docs/QA_CHECKLIST.md` を使います。

### Simulator / Emulator

- [ ] iPhone SE (3rd generation)
- [ ] iPhone 16
- [ ] Pixel 8

### 各端末で確認

- [ ] Home
- [ ] 初回Tutorial
- [ ] Tutorial再表示
- [ ] Game
- [ ] Game exit confirmation
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
- [ ] Pixel 8 Android Back
- [ ] Performance

### Share / Ads / UMP

- [ ] Share cancel / success
- [ ] Share画像 + Message + URL
- [ ] Adsあり / fallback
- [ ] UMP EEA debug
- [ ] Offline

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

`docs/RELEASE_CHECKLIST_TEMPLATE.md` をゲーム側の `docs/RELEASE_CHECKLIST.md` にコピーして使用します。

- [ ] `expo.name`
- [ ] `expo.slug`
- [ ] `expo.scheme`
- [ ] `ios.bundleIdentifier`
- [ ] `android.package`
- [ ] icon
- [ ] splash
- [ ] Production AdMob App IDs
- [ ] Production Interstitial IDs
- [ ] Production Test Ads disabled
- [ ] Production UMP debug disabled
- [ ] UMP / Consent message
- [ ] Privacy Policy
- [ ] Store privacy / Data Safety
- [ ] app-ads.txt関連
- [ ] Store screenshots
- [ ] Store copy
- [ ] `docs/STORE_LISTING_TEMPLATE.md` を埋めた
- [ ] `docs/STORE_PRIVACY_TEMPLATE.md` を埋めた
- [ ] iOS実機確認
- [ ] Android実機確認
- [ ] Internal testing

Production gate:

```bash
npm run release:check
```

- [ ] release:check pass

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

- [ ] 
- [ ] 
- [ ] 

## Templateへ戻す候補

このGame固有ではなく、他のCasual Gameでもそのまま使えそうな改善だけ記録する。

- [ ] 
