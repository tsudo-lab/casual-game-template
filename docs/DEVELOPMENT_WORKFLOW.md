# Casual Game 標準開発フロー

このドキュメントは、`casual-game-template` を使って新しいゲームを作る時の標準運用です。

目的は、**企画と実装を分け、毎回の迷いを減らすこと**です。

## 役割分担

### ChatGPT Chat

担当:

- ゲーム企画
- ルール整理
- MVP範囲
- UI / UXの方向性
- Shareの見せ方
- 優先順位
- 仕様変更の判断
- PRを見た時のProduct観点レビュー

基本的に「何を作るか」を決めます。

### Codex

担当:

- Repositoryを読む
- 指定Taskの実装
- Refactor
- Unit Test
- Typecheck / Lint / Test
- 技術的なBug修正
- PR作成
- PR指摘への修正

基本的に「決まったものをどう実装するか」を担当します。

### GitHub

確定した情報の置き場です。

```text
AGENTS.md

docs/
├─ GAME_SPEC.md
├─ BUILD_PLAN.md
└─ QA_CHECKLIST.md

Pull Requests
Source Code
CI
```

Chatの会話だけを正式仕様にしません。実装に入る内容はGitHub側へ残します。

## 新作の開始

### Step 1 — Chatで企画する

まずゲームの面白さを詰めます。

この段階ではCodeを書かなくても構いません。

確認すること:

- 一言で説明できるか
- Core Actionは何か
- 何度もやりたくなる理由は何か
- Score / BESTは何か
- Game Overは何か
- Shareした時に面白さが伝わるか
- MVPに不要なものは何か

### Step 2 — GAME_SPECを確定する

`docs/GAME_SPEC_TEMPLATE.md` を元に、ゲーム側へ以下を作ります。

```text
docs/GAME_SPEC.md
```

ここに書いた内容を実装の基準にします。

仕様が変わった場合は、必要に応じてChatで再検討した後、`GAME_SPEC.md` も更新します。

### Step 3 — BUILD_PLANへ分ける

`docs/BUILD_PLAN_TEMPLATE.md` を元に以下を作ります。

```text
docs/BUILD_PLAN.md
```

Codexへ一気に全部実装させるのではなく、Task単位にします。

目安:

```text
Task 1  Game Engine / Rule
Task 2  GameView / Input / Feel
Task 3  Visual Design
Task 4  Common Integration
Task 5  QA / Polish
Task 6  Release Preparation
```

ゲームによって統合・分割して構いません。

## TemplateからRepositoryを作る

Template上で作業ブランチを切らず、Templateをローカルコピーして独立したゲームRepositoryを作ります。具体的なコピー手順、`.git`と生成物の除外、初期ブランチ、Remoteの扱いは [`HOW_TO_CREATE_NEW_GAME.md`](HOW_TO_CREATE_NEW_GAME.md) に従います。

例:

```text
casual-game-template
        ↓ コピー
casual-game-<game-repo-name>
```

新しいRepositoryはTemplateとは独立したProjectとして扱います。GitHub Remoteの追加とPushは、明示的に依頼されるまで行いません。

その後、最低限以下を変更します。

```text
app.json
src/config/game.ts
docs/GAME_SPEC.md
docs/BUILD_PLAN.md
```

## Codexへ最初のTaskを渡す

基本Prompt:

```text
AGENTS.md、docs/GAME_SPEC.md、docs/BUILD_PLAN.mdを読んでください。
今回はBUILD_PLANのTask 1だけ実装してください。
Scope外の変更は広げず、必要なら別Task候補として報告してください。
必要なTestを追加し、typecheck / lint / testを実行してください。
実行できないものは未実行と明記してください。
```

新しいゲームを最初に作るPromptでは、上記に加えて、コピー先の作成、`npm install`、最小のプレイ可能なモック、`npm run web` によるローカルサーバー起動、Homeから最初のプレイまでの確認、実行コマンドと結果の報告を同じ初回Taskの完了条件にします。計画だけ、またはコード変更だけで初回報告を終えません。

Codexには毎回すべての背景を長文で再説明するより、Repository内のDocumentを読ませます。

## PR単位で進める

標準:

```text
Task
↓
Codex実装
↓
PR
↓
CI
↓
Review
↓
修正
↓
Merge
↓
次Task
```

PR作成時は `.github/pull_request_template.md` のCheck項目を埋めます。

GitHub Actionsでは自動で以下を実行します。

```bash
npm run typecheck
npm run lint
npm test
```

### Codex / 技術レビューで見るもの

- Bug
- Type error
- Test不足
- 重複Code
- 既存Architecture違反
- Performance
- Edge Case

### ChatGPT Chat / Productレビューで見るもの

- GAME_SPEC通りか
- 操作が分かりやすいか
- 余計な機能を足していないか
- Casual Gameとして重くなっていないか
- UI / Result / Shareが狙い通りか
- Gameとして面白くなる方向か

## Device QA

UI / GameView / Layoutを触るTaskでは、`Small screen / Large screen` のような抽象分類だけで済ませません。

標準のSimulator / Emulator Matrixは以下です。

```text
iPhone SE (3rd generation)
iPhone 16
Pixel 8
```

この3端末を実際に起動して確認します。

Layoutは端末名でHardcodeせず、実際の `width / height / safe area` を基準にResponsiveに調整します。

```text
検証単位 = 実際のDevice Profile
Layout判断 = width / height / safe area
```

つまり、iPhone SEでは余白を詰め、iPhone 16では少し広く見せ、Pixel 8ではAndroid側のSafe AreaやFont Renderingを確認する、といった端末別の最適化は行って構いません。ただし `if iPhone16` のような端末名分岐は避けます。

詳細は `docs/QA_CHECKLIST.md` を使用します。

## 仕様変更が起きた場合

開発中に仕様を変えたくなったら、Codeだけ先に変えないようにします。

```text
仕様変更案
↓
Chatで判断
↓
GAME_SPEC更新
↓
BUILD_PLAN更新
↓
Codexへ実装依頼
```

小さなBug修正や明らかな実装ミスはこの限りではありません。

## TODOの扱い

巨大なTODO一覧を別に増やさず、基本は `BUILD_PLAN.md` を進捗管理に使います。

実装中に見つかったScope外項目は以下へ置きます。

```text
## Backlog / 今回やらない
```

これにより、現在のTaskへ余計な変更を混ぜません。

## Templateの更新

各Game RepositoryからTemplateへ自動同期はしません。

Game開発中に改善が見つかったら、以下で判断します。

```text
そのGameだけ必要
→ Game側に残す

他のCasual Gameでもほぼそのまま使える
→ casual-game-templateへ戻す候補
```

Templateへ戻したい内容は、Game側の `BUILD_PLAN.md` の「Templateへ戻す候補」に記録します。

例:

```text
PONのPhysics Logic
→ PON固有なので戻さない

Share Card生成の共通Bug Fix
→ Templateへ戻す

Ads cadenceの共通改善
→ Templateへ戻す
```

## Phaseの進め方

### Phase 1

まずReleaseできるCoreを作ります。

```text
game
local best
retry
share
ads
settings / tutorial
```

### Phase 1.5

必要になったらAnalyticsを追加します。

### Phase 2

数字が良いGameだけGrowth機能を追加します。

```text
leaderboard
daily challenge
friend challenge
```

新作開始時からPhase 2機能を入れません。

## 1本のゲームの理想的な流れ

```text
Chatで企画
↓
GAME_SPEC.md
↓
BUILD_PLAN.md
↓
Templateをコピーして独立Repositoryを作成
↓
Codex Task 1
↓
PR / CI / Review / Merge
↓
Codex Task 2
↓
PR / CI / Review / Merge
↓
...
↓
3端末Simulator / Emulator QA
↓
iOS / Android実機QA
↓
Release
↓
数字を見る
↓
当たればPhase 1.5 / 2
↓
共通改善だけTemplateへBackport
```

この流れを標準にしつつ、非常に小さいゲームではTask数を減らして構いません。重要なのは、**企画・仕様・実装を混ぜず、実装TaskのScopeを小さく保つこと**です。
