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
- Tutorialで何ページに分けて何を説明するか
- MVPで入れる機能 / 入れない機能
- 見た目の方向性

`docs/GAME_SPEC_TEMPLATE.md` をコピーして、新しいゲーム側に `docs/GAME_SPEC.md` として置きます。

## 3. 実装タスクへ分解する

`docs/BUILD_PLAN_TEMPLATE.md` を元に `docs/BUILD_PLAN.md` を作ります。

例:

```text
Task 1: Game engine / mechanics
Task 2: GameView / input
Task 3: Home / Game / Result design
Task 4: Share / haptics / common integration
Task 5: QA / release preparation
```

1つのTaskで関係ない領域をまとめて変更しません。

## 4. Templateから新しいRepositoryを作る

GitHubの **Use this template** から、新しいゲーム用Repositoryを作ります。

その後、最低限以下を変更します。

### app.json

- `expo.name`
- `expo.slug`
- `expo.scheme`
- `ios.bundleIdentifier`
- `android.package`
- AdMob iOS / Android App ID

### eas.json

- Production iOS Interstitial ID
- Production Android Interstitial ID
- 必要ならEAS project情報

### src/config/game.ts

- `GAME_META.id`
- `GAME_META.title`
- subtitle
- tutorial slides
- score label
- share message
- share URL

### assets

- App icon
- Splash
- Game assets

## 5. 共通Behaviorは基本的に残す

Template側ですでに共通化しているBehavior:

```text
Local BEST
Initial tutorial state
Tutorial carousel
Tutorial reopen via ?
Retry
Game exit confirmation
Android Back
Share image + text + URL
Haptics setting
Language setting
Settings / Privacy
AdMob / UMP
Interstitial cadence
EAS profiles
Release config check
```

ゲーム固有の理由がない限り、これらをGame側へ再実装しません。

### Game途中の離脱

共通Flow:

```text
Homeへ戻る
最初からやり直す
ゲームを続ける
```

Android BackもGame中は同じ確認Flowへ接続されます。

### Tutorial

`GAME_META.tutorialSlides` の内容だけゲーム固有化します。

```ts
{
  eyebrow: 'STEP 1',
  title: '最初の操作',
  body: 'プレイヤーが最初に知る必要がある内容',
}
```

初回自動表示、ページ送り、`?` からの再表示、表示中のGame入力Blockは共通Behaviorです。

## 6. 実際のゲームを置き換える

ゲーム本体の主な差し替えポイントは `src/game/GameView.tsx` です。

共通Controllerとの基本契約:

```ts
interface GameViewProps {
  runId: number;
  hapticsEnabled: boolean;
  language: 'ja' | 'en';
  onScoreChange: (score: number) => void;
  onRunEnd: (result: GameResult) => void;
}
```

- Score変化 → `onScoreChange`
- Run終了 → `onRunEnd` を1回
- Retry Reset → `runId`
- High Score保存はGame側へ重複実装しない
- Ad表示をGame側へ直接書かない
- NavigationをGame Engineへ持ち込まない

## 7. デザインはゲームごとに自由に作る

主な差し替え場所:

- `src/design/HomeVisual.tsx` — Home
- `src/design/GameVisual.tsx` — HUD / Tutorial / Exit / Result / Share Card
- `src/design/TutorialCarousel.tsx` — 共通Carouselの見た目を変えたい場合
- `src/game/GameView.tsx` — Game Area
- `src/ui/theme.ts` — Color / Space等
- `assets/` — Game固有素材

Behaviorは共通でも、見た目を他作品へ寄せる必要はありません。

## 8. Shareを設定する

`GAME_META` で設定します。

```ts
shareUrl: 'https://example.com/your-game',
shareMessage: {
  ja: (score) => `...${score}...`,
  en: (score) => `...${score}...`,
},
```

NativeではResult画像 + Message + URLをShare Sheetへ渡します。

Release前にiOS / Android実機で共有先を確認してください。

## 9. AdMob / UMP

Development / Preview:

```text
Test Ads = true
Consent debug geography = EEA
```

Production:

```text
Test Ads = false
Consent debug geography = DISABLED
```

`react-native-google-mobile-ads` はTemplateで既知動作versionへ固定しています。Versionを更新する場合はiOS / Pixel 8のnative buildを確認してからTemplateへ戻します。

## 10. CodexにはTask単位で依頼する

基本は `docs/GAME_SPEC.md` と `docs/BUILD_PLAN.md` を読ませて、Task単位で実装を依頼します。

例:

```text
AGENTS.md、docs/GAME_SPEC.md、docs/BUILD_PLAN.mdを読んでください。
今回はBUILD_PLANのTask 1だけ実装してください。
Homeや広告には触らないでください。
必要なテストを追加し、typecheck / lint / testを実行してください。
完了したら変更点と未確認事項をまとめてください。
```

## 11. Local QA

起動方法:

- `docs/LOCAL_DEVICE_TESTING.md`

確認項目:

- `docs/QA_CHECKLIST.md`

標準端末:

```text
iPhone SE (3rd generation)
iPhone 16
Pixel 8
```

UIは端末名Hardcodeではなく `width / height / safe area` でResponsiveに調整します。

通常の自動Check:

```bash
npm run typecheck
npm run lint
npm test
```

## 12. Release準備

`docs/RELEASE_CHECKLIST_TEMPLATE.md` をコピーしてゲーム側の `docs/RELEASE_CHECKLIST.md` にします。

Store用:

- `docs/STORE_LISTING_TEMPLATE.md`
- `docs/STORE_PRIVACY_TEMPLATE.md`

Production提出前:

```bash
npm run release:check
```

Template初期状態ではProduction用IDがPlaceholderなので失敗します。各ゲーム固有のBundle ID / Package / AdMob ID / EAS Production設定へ置き換えた後に成功させてください。

## 13. Phase 1を標準とする

```text
Phase 1
- game
- local best score
- retry
- share
- ads
- settings / tutorial
```

目的は機能を増やすことではなく、コアゲームが繰り返し遊ばれるかを早く確認することです。

## 14. Phase 1.5で計測する

必要になったらAnalyticsを追加します。

候補:

- game start / end
- retry
- score
- share
- play frequency
- retentionに関係する行動

## 15. Phase 2は当たったゲームだけ

- leaderboard
- daily challenge / same seed
- friend-record challenge

永続化、匿名identity、score validationなどが必要になれば、その段階でSupabase等のBackendを検討します。

プロフィール、フォロー、シーズン、リアルタイム対戦などを標準機能として追加しません。

## 16. Module方針

現時点ではModule用の別Repositoryは作りません。

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

実際に同じPatternが複数タイトルで繰り返されてから整理します。

## 17. Templateへ戻す

新作で共通改善が見つかったら、まずGame側で完成させます。

```text
Game固有 → Game側に残す
複数Gameでそのまま使える → TemplateへBackport
```

今回のように、実際のゲームで有効だったNavigation / Tutorial / Test / Release patternをTemplateへ戻して育てます。
