# AGENTS.md

このRepositoryは、つどラボの **Casual Game Template** です。

Codexなどの実装Agentは、作業開始前にこのファイルと、`casual-game-idea` で作成されたゲーム固有の開発プロンプトを確認してください。ゲーム側に `docs/GAME_SPEC.md` / `docs/BUILD_PLAN.md` がある場合は補助資料として確認しますが、開発プロンプトをゲームの意図のソースとして扱います。

## 1. このTemplateの目的

短時間で遊べるMobile Casual Gameを素早く作るための共通基盤です。

`casual-game-idea` と連携し、企画で固めたゲーム専用の開発プロンプトを実装へつなぐ基盤です。新しいゲームはこのリポジトリをcloneして履歴を共有するのではなく、**コピーして独立リポジトリ**として開発します。

新しいゲームを始めるときは、Template上で作業ブランチを切って実装しません。現在のTemplateの状態を確認したうえで、親ディレクトリにゲーム名の独立Repositoryを作成し、そこで作業します。コピー元のTemplateは変更しません。

標準手順と、最初のプレイ可能なモックをローカルで確認するまでの進め方は [`docs/HOW_TO_CREATE_NEW_GAME.md`](docs/HOW_TO_CREATE_NEW_GAME.md) を使います。

## 1.0 新しいゲームの初回実装

新しいゲーム用の開発プロンプトを受け取ったら、計画やファイル一覧だけで初回の応答を終わらせません。次の初回確認単位まで進めます。

1. Templateのブランチ、Git status、Remoteを確認する
2. `.git`、`node_modules`、生成物を除外して、ゲーム名の独立Repositoryへコピーする
3. コピー先で新しく `git init -b main` し、Templateと履歴を共有しない
4. コピー先で `npm install` を実行する
5. 開発プロンプトに従って、最小のプレイ可能なモックを実装する
6. `npm run typecheck`、`npm run lint`、`npm test` を実行する
7. `npm run web` でローカルサーバーを起動する
8. 表示されたURLを使ってHomeから最初のプレイまで確認する

コピー先がすでに存在する場合は上書きせず、状態を報告して停止します。GitHub Remoteの追加、Push、Templateへの変更は、明示的に依頼されるまで行いません。

初回の報告には、実行したコマンド、成功・失敗、ローカルサーバーのURL、実際に確認できた画面、未確認の範囲を含めます。サーバーを起動できても画面を確認できなかった場合は、その境界を明記します。

## 1.1 アイデア検討時のインタラクティブモック

Template上で新しいゲーム案、コアルール、操作、リスクと報酬を比較・検討する依頼を受けた場合、3案の文章比較だけで完了扱いにしません。文章は判断軸を整理するために使い、触って違いを確認できる最小モックまで進めます。

1. 重要な違いがある3案を短く比較する
2. Templateを変更せず、`casual-game-mock-<slug>` の独立コピーを作る
3. 3案を同じ画面で切り替えられるか、少なくとも推奨案を操作できるモックを作る
4. `npm run typecheck`、`npm run lint`、`npm test` を実行する
5. `npm run web` でローカルサーバーを起動する
6. 起動ログのURLを最初の報告に出す
7. URLを開き、最初の操作と結果まで確認する

ユーザーが「アイデアを揉む」「比較する」「モックで見たい」と依頼した場合、計画や3案の文章だけで止まりません。モックを起動できない場合は、原因、試したコマンド、代替確認方法、未確認の範囲を報告します。サーバーが起動したことを、ゲームが面白いことの証拠として扱いません。

共通化の目的は、各タイトルで以下へ集中することです。

- ゲームのルール
- 操作感
- Visual Design
- Animation / Juice
- Result / Shareの見せ方

Templateの都合にゲームを合わせるのではなく、**共通化できるBehaviorだけを再利用します。**

ゲーム固有の実装はゲーム側に残します。複数ゲームで再利用できることが確認できた機能だけを、template改修候補として扱います。

## 1.1 重要な判断の進め方

ゲーム性、操作、ゲームフィール、難易度・バランス、UI/UX、アニメーション、アーキテクチャ、templateへの影響のようにプレイ体験や保守性を左右する判断は、原則としておおむね3案を比較します。各案の体験、影響範囲、懸念を短く示し、推奨案を明確にします。

ただし、局所的な命名、明白な修正、既存パターンに沿う些末な実装まで3案比較を強制しません。

template改修候補は、少なくとも次を比較してから進めます。

1. ゲーム側だけで実装する
2. templateで設定可能な機能にする
3. 複数ゲームで使える汎用的な共通抽象にする

「将来使うかもしれない」だけではtemplateを変更しません。

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

### Game logic

- ゲーム固有のルール・乱数・得点計算は、画面から分離した純粋な `engine` / `rules` に置きます。
- 仕様変更時は、成功・失敗・境界条件・seed付き乱数・先読み表示との一致をユニットテストで確認します。
- 詳細は `docs/GAME_LOGIC_TESTING.md` を参照してください。

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

## 17. Store build guard

- Production buildとストア提出は、対象Productの最新 `develop` 上のリリース候補コミットからのみ行います。
- 開始前に必ず `git branch --show-current`、`git status --short --branch`、`origin/develop` との差分を確認します。
- `develop` 以外、未コミット変更あり、または対象コミットが `origin/develop` と異なる場合は停止し、差分と例外ビルドになることを報告します。ユーザーが明示的に許可するまでbuildしません。
- EASの表示コミットだけでソースがcleanだったと判断しません。Production buildは必ずcleanな作業ツリーで実行します。
