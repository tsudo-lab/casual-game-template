# Tsudo Lab Casual Game Template

つどラボの**短時間で遊べるモバイルカジュアルゲーム向け共通テンプレート**です。

目的は、アプリ基盤を使い回しながら、各タイトルでは**ゲームのルールと見た目に集中すること**です。PONのような物理ゲーム、2048系のスコアゲーム、タイミングゲーム、スワイプゲーム、軽いパズルなど、画面デザインがまったく違うゲームでも同じ基盤を利用できます。

## 現在の位置づけ

現時点で管理するテンプレートは、この **Casual Game Template だけ**です。

Stage / Party 用テンプレートは先に作りません。実際のゲームでアプリの流れが大きく異なり、共通化する価値が出た時点で作ります。

将来の想定は以下です。

```text
tsudo-lab
├─ casual-game-template      # 現在: 短時間・1人用・スコアアタック中心
├─ stage-game-template       # 将来: ステージ選択 / クリア / 進行管理
└─ party-game-template       # 将来: 軽量なモバイルパーティゲーム
```

ポチゲー系の長期運営ゲームや Steam / Switch 向けタイトルは、この React Native テンプレート群に無理に含めず、別ラインとして個別開発します。

詳しくは `docs/ARCHITECTURE_ROADMAP.md` を参照してください。

## 新しいゲームを作る標準フロー

```text
1. casual-game-ideaで企画を固め、ゲーム専用の開発プロンプトを作る
2. このTemplateをコピーして、新しいゲーム用の独立Repositoryを作る
3. 開発プロンプトを意図のソースとして、必要に応じてGAME_SPEC / BUILD_PLANへ実装内容を分ける
4. Codexにゲーム側のTask単位で実装を依頼する
5. PRごとにCI・レビュー・修正する
6. 端末別QAと実機確認をしてリリースする
7. 本当に複数ゲームで再利用できる改善だけTemplateへ戻す
```

役割分担の基本は次の通りです。

- **casual-game-idea**: 企画、比較、ゲーム専用の開発プロンプト作成
- **Codex**: 開発プロンプトを意図のソースにした実装、テスト、技術的な修正、PR作成
- **GitHub**: 独立したゲーム側のコード、必要な実装計画、PR、CIの置き場
- **Template**: 新作をコピーして始めるための共通実装基盤

詳細は `docs/DEVELOPMENT_WORKFLOW.md` を参照してください。

## 共通基盤とゲーム固有部分の境界

このTemplateのホーム、設定、広告、ゲーム画面シェル、保存、共有などをゲームごとに再実装・破壊しません。ゲーム側ではルール、操作、ゲームフィール、タイトル固有のビジュアルと演出を中心に実装します。

意味のある判断（ゲーム性、操作、難易度・バランス、UI/UX、アニメーション、アーキテクチャ、templateへの影響）は、原則としておおむね3案を比較します。小さな実装上の判断では比較を強制しません。

ゲーム固有機能はゲーム側に残します。templateに戻す候補は、複数ゲームで再利用できるものに限り、次を比べて決めます。

1. ゲーム側だけで実装する
2. templateで設定可能な機能にする
3. より汎用的な共通抽象にする

つどラボのゲームは、シンプルで、すぐ理解でき、繰り返したくなることを大切にします。集って遊べること、または記録・結果共有から会話や挑戦が生まれることを、ゲーム固有の実装でも共通基盤の拡張でも判断基準にします。

## 共通化しているもの

共通層は**ゲーム固有の見た目ではなく、毎回必要になる振る舞いとリリース基盤**を担当します。

- 画面遷移
- ローカルBEST保存
- 初回Tutorial状態
- 複数ページTutorial carousel
- ゲーム中 `?` からのTutorial再表示
- ゲーム途中の離脱確認
  - Homeへ戻る
  - 最初からやり直す
  - ゲームを続ける
- Android Backの標準挙動
- Retryフロー
- 結果画像 + 共有文 + URLのShare
- Haptics設定と永続化
- 日本語 / 英語設定
- Settings / Privacyの基本動作
- AdMob初期化 / UMP連携
- DevelopmentでのEEA consent debug
- 規定回数プレイ後のInterstitial Ads
- Web / Expo Goで広告処理を安全にスキップするFallback
- EAS development / preview / production profile
- Production設定を検査する `release:check`
- iOS Simulator / Pixel 8 Emulatorの標準テスト手順
- Release / Store listing / Privacy declarationのDocument template

## ゲームごとに自由に変える場所

```text
src/config/game.ts                 # title / copy / tutorial / share URL
src/design/HomeVisual.tsx          # Home全体の見た目
src/design/GameVisual.tsx          # HUD / Tutorial / Exit / Result / Share Cardの見た目
src/game/GameView.tsx              # 実際のGame Mechanics
src/ui/theme.ts                    # ゲーム固有の色・余白など
assets/                             # ゲーム固有素材
```

`HomeScreen.tsx` と `GameScreen.tsx` は共通Controllerです。デザイン変更のために、保存・広告・Share・画面遷移・Retry・Tutorial lifecycle・Exit flowなどの処理を `src/design/` 側へ移さないことを基本ルールとします。

## Tutorialの共通構造

`src/config/game.ts` の `GAME_META.tutorialSlides` をゲームごとに書き換えます。

```ts
{
  eyebrow: 'STEP 1',
  title: '最初の操作',
  body: '3秒で必要な操作を書く',
}
```

共通Controllerが以下を担当します。

```text
初回Play → 自動表示
Game中 ? → 再表示
Back / Next / Play → Carousel操作
Tutorial表示中 → Game入力Block
```

## Game exit / Android Back

Game途中のHome操作は即離脱せず、共通の確認Flowを通します。

```text
Homeへ戻る
最初からやり直す
ゲームを続ける
```

Androidでは、Game中のBackも同じ離脱確認へ接続します。SettingsはHome、PrivacyはSettingsへ戻し、HomeではOS標準Back挙動へ任せます。

## Share

ResultのShareは以下を共通化しています。

```text
Result画像
+ GAME_META.shareMessage
+ GAME_META.shareUrl
```

画像生成は `react-native-view-shot`、native Share Sheetは `react-native-share` を使います。

## AdMob / UMP / EAS

Development / PreviewではTest Adsを強制し、必要に応じてEEA consent debugを有効にできます。ProductionではTest AdsとConsent debugを無効化します。

`react-native-google-mobile-ads` は、現在のExpo SDK 57 / Android構成で確認した既知動作版として `16.3.4` に固定しています。依存を更新する場合はiOS / Pixel 8のnative buildを再確認してからTemplate側も更新します。

EAS profile:

```text
development
development-simulator
preview
preview-simulator
production
```

## 端末別Layout / QA

標準Simulator / Emulator Matrix:

```text
iPhone SE (3rd generation)
iPhone 16
Pixel 8
```

Layoutは端末名をHardcodeして分岐するのではなく、実際の `width / height / safe area` を基準にResponsiveに調整します。

```text
検証単位 = 実際のDevice Profile
Layout判断 = width / height / safe area
```

- 何を確認するか: `docs/QA_CHECKLIST.md`
- どう起動するか: `docs/LOCAL_DEVICE_TESTING.md`

## 自動Check

Pull Requestと `main` へのPushではGitHub Actionsが通常以下を実行します。

```bash
npm run typecheck
npm run lint
npm test
```

Production提出前は追加で以下を実行します。

```bash
npm run release:check
```

`release:check` は通常のCode Checkに加え、以下を検査します。

- TemplateのBundle ID / Packageが残っていない
- EAS productionがStore distribution
- Build number auto increment
- ProductionでTest Adsが無効
- ProductionでUMP debug geographyが無効
- AdMob App ID / Interstitial ID形式
- ProductionにGoogle公式Test IDが残っていない
- `delayAppMeasurementInit` が有効

Template初期状態ではProduction IDが未設定なので `release:check` は失敗します。新しいGame用Repositoryで本番設定を完了した後に成功させます。

## モジュール方針

モジュールは**今は別Repositoryにしません**。

将来的な整理先は次の通りです。

```text
src/modules/
├─ core/       # 多くのカジュアルゲームで使う機能
├─ growth/     # 伸びたゲームだけ追加する機能
└─ liveops/    # 継続運営が必要になった時だけ追加する機能
```

想定している機能は以下です。

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

この図を埋めるためだけに空実装は作りません。現在の共通コードは `services/` や `storage/` に置いたままで問題ありません。実際に整理するメリットが出た時点で `modules/` に寄せます。

複数のテンプレートで同じ実装を本当に共有するようになったら、その時点で `tsudo-lab-mobile-core` のような共通package / repository化を検討します。

## Casual GameのPhase

```text
Phase 1   まず出す
          game + local best + retry + share + ads

Phase 1.5 計測する
          analytics / replay / retention / share behavior

Phase 2   当たったゲームだけ伸ばす
          leaderboard / daily challenge / friend challenge
```

Phase 3〜5を最初から想定しません。プロフィール、フォロー、リアルタイム対戦、シーズン、重いLiveOpsなどは、そのゲームに本当に必要になった時だけ追加します。

## 新作で主に変更する場所

```text
src/config/game.ts
src/design/
src/game/
src/ui/theme.ts
assets/
app.json
eas.json
```

## 現在の構成

```text
App.tsx
AGENTS.md
eas.json
.github/
├─ pull_request_template.md
└─ workflows/
   └─ ci.yml
scripts/
└─ check-release-config.mjs
src/
├─ config/
│  └─ game.ts
├─ design/
│  ├─ HomeVisual.tsx
│  ├─ GameVisual.tsx
│  └─ TutorialCarousel.tsx
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

docs/
├─ HOW_TO_CREATE_NEW_GAME.md
├─ DEVELOPMENT_WORKFLOW.md
├─ GAME_SPEC_TEMPLATE.md
├─ BUILD_PLAN_TEMPLATE.md
├─ QA_CHECKLIST.md
├─ LOCAL_DEVICE_TESTING.md
├─ RELEASE_CHECKLIST_TEMPLATE.md
├─ STORE_LISTING_TEMPLATE.md
├─ STORE_PRIVACY_TEMPLATE.md
└─ ARCHITECTURE_ROADMAP.md
```

## 新しいゲームを作る時

最低限以下を確認します。

- `docs/HOW_TO_CREATE_NEW_GAME.md`
- `docs/GAME_SPEC_TEMPLATE.md`
- `docs/BUILD_PLAN_TEMPLATE.md`
- `docs/QA_CHECKLIST.md`
- `docs/LOCAL_DEVICE_TESTING.md`
- `docs/RELEASE_CHECKLIST_TEMPLATE.md`
- `docs/STORE_LISTING_TEMPLATE.md`
- `docs/STORE_PRIVACY_TEMPLATE.md`

テンプレート内のゲームとデザインは、あえて簡単なPlaceholderにしています。共通基盤を作り直すのではなく、ゲーム部分と見た目を差し替えて使います。

## リリース前

Templateには汎用ID、Google公式Test App ID、仮のProduction広告ID、仮のShare URLなどが含まれます。Productionリリース前に必ず各ゲーム用へ置き換え、`npm run release:check`、3端末QA、iOS・Android実機確認、Store privacy declarationの照合を完了してください。
