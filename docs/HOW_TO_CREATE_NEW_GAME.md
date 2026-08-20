# 新しいつどラボのカジュアルゲームを作る方法

このRepositoryは、つどラボの **Casual Game Template** です。短時間で遊べるモバイルゲームを素早く作りつつ、各タイトルのゲーム性と見た目は独立して作れるようにしています。

## 1. このTemplateを使うゲームか確認する

おおむね次の流れなら、このTemplateが向いています。

```text
Home
→ Play
→ 1プレイ中にscore / progressが進む
→ Result
→ Retry / Share
```

例:

- スコアアタック
- 2048系のカジュアルパズル
- タイミングゲーム
- 反射神経ゲーム
- 物理ゲーム
- Merge系
- Swipe系
- その他の短時間1人用ゲーム

ステージ選択や進行管理が中心のゲーム、複数人のセットアップやターン進行が中心のパーティゲームなど、アプリの流れそのものが違う場合は無理にこのTemplateへ合わせません。

## 2. まずChatGPT Chatで仕様を固める

実装前に、ゲームとしての重要な判断を先に決めます。

最低限、以下を決めます。

- 一言で説明できるゲームコンセプト
- プレイヤーの基本操作
- ルール
- 1プレイの開始条件 / 終了条件
- Score / BESTの定義
- Result画面で見せる内容
- Shareする内容
- MVPで入れる機能 / 入れない機能
- 見た目の方向性

`docs/GAME_SPEC_TEMPLATE.md` をコピーして、新しいゲーム側に `docs/GAME_SPEC.md` として置く想定です。

## 3. 実装タスクへ分解する

仕様が固まったら、`docs/BUILD_PLAN_TEMPLATE.md` を元に `docs/BUILD_PLAN.md` を作ります。

1つの巨大タスクにせず、Codexへ渡しやすい単位に分けます。

例:

```text
Task 1: Game engine / mechanics
Task 2: GameView / input
Task 3: Home / Game / Result design
Task 4: Share / haptics / common integration
Task 5: QA / release preparation
```

原則として、1つのTaskで関係ない領域をまとめて変更しません。

## 4. Templateから新しいRepositoryを作る

GitHubの **Use this template** から、新しいゲーム用Repositoryを作ります。

その後、`app.json` の識別子を各ゲーム用へ変更します。

最低限確認するもの:

- `expo.name`
- `expo.slug`
- `expo.scheme`
- `ios.bundleIdentifier`
- `android.package`
- Productionリリース前のAdMob設定

## 5. ゲーム固有情報を変更する

`src/config/game.ts` を編集し、ゲームID、タイトル、サブタイトル、Tutorial文言、Scoreラベル、Share文言などを設定します。

## 6. 実際のゲームを置き換える

ゲーム本体の主な差し替えポイントは以下です。

`src/game/GameView.tsx`

共通Controllerとの契約は小さく保ちます。

```ts
interface GameViewProps {
  runId: number;
  hapticsEnabled: boolean;
  language: 'ja' | 'en';
  onScoreChange: (score: number) => void;
  onRunEnd: (result: GameResult) => void;
}
```

ゲーム固有のstate / logicは `src/game/` に置きます。

Score変化とRun終了だけ共通Controllerへ通知し、保存・広告・Share・Navigationなどの共通処理をゲーム本体へ持ち込まないことを基本とします。

## 7. デザインはゲームごとに自由に作る

Templateは、BehaviorとPresentationを分離しています。

主な見た目の差し替え場所:

- `src/design/HomeVisual.tsx` — Home画面全体
- `src/design/GameVisual.tsx` — HUD / Tutorial / Result / Share Card
- `src/game/GameView.tsx` — 実際のゲーム領域
- `src/ui/theme.ts` — 必要に応じたゲーム固有token
- `assets/` — ゲーム固有の画像等

新しいゲームは、他のつどラボ作品と似た見た目にする必要はありません。

## 8. CodexにはTask単位で依頼する

基本は `docs/GAME_SPEC.md` と `docs/BUILD_PLAN.md` を読ませて、Task単位で実装を依頼します。

例:

```text
AGENTS.md、docs/GAME_SPEC.md、docs/BUILD_PLAN.mdを読んでください。
今回はBUILD_PLANのTask 1だけ実装してください。
Homeや広告には触らないでください。
必要なテストを追加し、typecheck / lint / testを実行してください。
完了したら変更点と未確認事項をまとめてください。
```

最初から「ゲームを全部完成させて」と依頼するより、PRごとに範囲を絞ります。

## 9. Phase 1を標準とする

すべての新規カジュアルゲームは、まず軽量なPhase 1から始めます。

```text
Phase 1
- game
- local best score
- retry
- share
- ads
- settings / tutorial
```

目的は、機能を増やすことではなく、コアゲームが繰り返し遊ばれるかを早く確認することです。

## 10. Phase 1.5で計測する

必要になったらAnalyticsを追加し、各ゲームで比較できる指標を取ります。

候補:

- game start / end
- retry
- score
- share
- play frequency
- retentionに関係する行動

Install数だけで勝ち負けを決めません。Installが少なくてもRetryや再訪が強いゲームは、Phase 2候補になり得ます。

## 11. Phase 2は当たったゲームだけ

伸びたゲームにだけ、必要に応じてGrowth機能を追加します。

例:

- leaderboard
- daily challenge / same seed
- friend-record challenge

これらは概念上 `src/modules/growth/` に置きます。永続化、匿名identity、score validationなどが必要になれば、その段階でSupabase等のBackendを検討します。

プロフィール、フォロー、シーズン、リアルタイム対戦などを標準機能として追加しません。

## 12. モジュール方針

現時点では、Module用の別Repositoryは作りません。

将来的な整理先:

```text
src/modules/
├─ core/
│  ├─ ads
│  ├─ analytics
│  ├─ share
│  └─ settings
├─ growth/
│  ├─ leaderboard
│  ├─ dailyChallenge
│  └─ friendChallenge
└─ liveops/
   ├─ remoteConfig
   ├─ events
   └─ notifications
```

これは将来の整理先であり、空実装を作るための設計図ではありません。

複数のTemplateで本当に同じ実装を使うようになってから、共通Package / Repositoryへの切り出しを検討します。

## 13. 将来のTemplate

今は作りませんが、境界だけは明確にしておきます。

```text
casual-game-template      = 現在の短時間カジュアル向け
stage-game-template       = 将来のStage選択 / Clear / Progression向け
party-game-template       = 将来の軽量Mobile Party向け
```

ポチゲー系長期運営ゲームやSteam / Switch向けタイトルは、Casual Templateの拡張ではなく別の開発ラインとして扱います。

## 14. ゲーム開発中にTemplateへ戻すもの

新しいゲームを作っていて、複数タイトルでもそのまま使える改善が見つかった場合だけTemplateへ戻します。

```text
ゲーム固有の処理 → そのゲームに残す
複数ゲームで共通になる処理 → Templateへ戻す候補
```

例:

- PON固有のBall physics → PON側
- Share画像生成の共通改善 → Template側
- 広告制御の共通Bug修正 → Template側

Templateは「すべてを抽象化する場所」ではなく、「新作を作るたびに本当に共通だったものだけ学習する基盤」として扱います。

## リリース前

以下を確認してください。

- iOS / Android identifiers
- icon / splash / assets
- Production AdMob IDs
- UMP / consent
- Privacy Policy
- Store privacy / Data Safety
- Share実機確認
- Safe Area
- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- iOS実機
- Android実機
