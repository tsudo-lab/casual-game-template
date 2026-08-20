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
1. ChatGPT Chatで企画・仕様を固める
2. docs/GAME_SPEC.md を作る
3. docs/BUILD_PLAN.md に実装タスクを分割する
4. このTemplateから新しいゲーム用Repositoryを作る
5. CodexにBUILD_PLANのTask単位で実装を依頼する
6. PRごとにレビュー・修正する
7. 実機確認してリリースする
8. 本当に共通化できる改善だけTemplateへ戻す
```

役割分担の基本は次の通りです。

- **ChatGPT Chat**: 企画、仕様、優先順位、ゲームとしての判断
- **Codex**: 実装、テスト、技術的な修正、PR作成
- **GitHub**: 確定した仕様、実装計画、コード、PRの置き場
- **Template**: 新作を始めるための初期基盤

詳細は `docs/DEVELOPMENT_WORKFLOW.md` を参照してください。

## 共通化しているもの

共通層は**見た目ではなく振る舞い**を担当します。

- 画面遷移
- ローカルBEST保存
- 初回チュートリアル状態
- Retryフロー
- 結果画像のShare
- Haptics設定
- 日本語 / 英語設定
- Settings / Privacyの基本動作
- AdMob初期化 / UMP連携ポイント
- 規定回数プレイ後のインタースティシャル広告
- Web / Expo Goで広告処理を安全にスキップするフォールバック

## ゲームごとに自由に変える場所

```text
src/design/HomeVisual.tsx   # ホーム画面全体の見た目
src/design/GameVisual.tsx   # HUD / Tutorial / Result / Share Card
src/game/GameView.tsx       # 実際のゲーム部分
src/ui/theme.ts             # 必要ならゲーム固有の色・余白など
assets/                     # ゲーム固有素材
```

`HomeScreen.tsx` と `GameScreen.tsx` は共通Controllerです。デザイン変更のために、保存・広告・Share・画面遷移・Retryなどの処理を `src/design/` 側へ移さないことを基本ルールとします。

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
```

## 現在の構成

```text
App.tsx
AGENTS.md
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
└─ ARCHITECTURE_ROADMAP.md
```

## 新しいゲームを作る時

- `docs/HOW_TO_CREATE_NEW_GAME.md`
- `docs/DEVELOPMENT_WORKFLOW.md`
- `docs/GAME_SPEC_TEMPLATE.md`
- `docs/BUILD_PLAN_TEMPLATE.md`

を参照してください。

テンプレート内のゲームとデザインは、あえて簡単なPlaceholderにしています。共通基盤を作り直すのではなく、ゲーム部分と見た目を差し替えて使います。

## リリース前

Templateには汎用ID、サンプル広告設定、仮のPrivacy文言などが含まれます。Productionリリース前に必ず各ゲーム用へ置き換え、`install / typecheck / lint / test / 実機確認` を行ってください。
