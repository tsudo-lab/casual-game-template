# つどラボ ゲーム開発アーキテクチャ・ロードマップ

このドキュメントでは、**事業 / ゲームのライン**、**Template Repository**、**Optional Module**を分けて整理します。

目的は、将来を考えすぎて今のコードを過度に抽象化しないことです。

## 1. つどラボの開発ライン

つどラボでは、技術基盤を無理に1つへ統一せず、大きく3つの開発ラインを想定します。

```text
Tsudo Lab
├─ Casual
├─ Pochi-style long-running games
└─ Steam / Switch / party-oriented titles
```

### Casual

短時間で遊べるモバイルゲームを高速に試し、頻繁にリリースするラインです。

現時点でTemplate化しているのはこのラインだけです。

### Pochi-style

育成、経済、コミュニティ、Persistent Worldなどを軸に、長期間遊んでもらうゲームです。

まずは各ゲームを個別Productとして作ります。複数作品で同じ実装が繰り返されるようになってから共通化します。

### Steam / Switch / Party-oriented

Multiplayer、配信映え、観戦、Controller、PC / Console配信などが重要になるゲームです。

React NativeのMobile Casual Templateへ無理に合わせず、必要なEngineや構成をそのタイトルごとに選びます。

## 2. Template family

現在あるのは以下だけです。

```text
casual-game-template
└─ 役割: Casual Game Template
```

将来、実際に必要になったら以下を作る可能性があります。

```text
stage-game-template
└─ stage select
   stage unlock / progression
   clear state
   next-stage flow
   stage records / stars

party-game-template
└─ player setup
   room / round setup
   prompts / turns
   shared result flow
```

「将来必要そう」という理由だけでは作りません。

## 3. Casual TemplateのPhase

### Phase 1 — まず出す

すべての新規Casual Gameの標準です。

```text
core game
local best
retry
share
ads
settings / tutorial
```

目的は、追加機能ではなく**ゲームのコア自体が繰り返し遊ばれるか**を確認することです。

### Phase 1.5 — 計測する

タイトル間で比較できるAnalyticsを追加します。

見るべきものはInstall数だけではなく、「どのゲームがRetryや再訪を生むか」です。

候補Event:

```text
game_start
game_end
score
retry
share
ad_shown
```

### Phase 2 — 当たったゲームだけ伸ばす

行動データが良いタイトルだけ、Network / Growth機能を追加します。

候補Module:

```text
leaderboard
dailyChallenge
friendChallenge
```

永続化、匿名identity、score validationなどが必要になった段階で、Supabase等のBackendを導入します。

Casual Gameに自動的なPhase 3〜5はありません。重いSocial / Live Serviceは、そのProductに必要かどうかで判断します。

## 4. Module architecture

Moduleは現時点ではCasual Template内に置きます。

将来の整理先:

```text
src/modules/
├─ core/
│  ├─ ads/
│  ├─ analytics/
│  ├─ share/
│  └─ settings/
│
├─ growth/
│  ├─ leaderboard/
│  ├─ dailyChallenge/
│  └─ friendChallenge/
│
└─ liveops/
   ├─ remoteConfig/
   ├─ events/
   └─ notifications/
```

### Core

多くのタイトルで使い、早い段階から入れてよい機能です。

### Growth

ゲームの価値が確認できた後に追加するOptional機能です。

### LiveOps

継続的な運用コントロールが本当に必要なゲームだけに追加します。

Casual Gameの標準機能ではありません。

## 5. Moduleを別Repositoryへ切り出す条件

**今は別Module Repositoryを作りません。**

以下が揃った時だけShared Package / Repository化を検討します。

1. 2つ以上のTemplate family、または複数のActive Gameで同じ実装を使っている
2. Project間へ同じ修正をコピーすることが実際の保守問題になっている
3. APIがある程度安定し、Version管理する方が楽になっている

その段階では `tsudo-lab-mobile-core` のような構成が候補になります。

## 6. 共通化の判断ルール

仮説上の再利用ではなく、今あるProductを優先します。

```text
初回登場                  → まずそのGame / Template内で実装
同じPatternが繰り返された  → Moduleとして整理
複数Templateで繰り返された → Shared Package化を検討
```

これによりCasualラインの速度を落とさず、Stage、Party、Pochi、Steam / Consoleをそれぞれ独立して育てられます。

## 7. 開発フローとの関係

Templateはコードだけを配るものではなく、**開発の始め方も揃える**ために使います。

新しいCasual Gameでは、基本的に以下を用意します。

```text
AGENTS.md

docs/
├─ GAME_SPEC.md
└─ BUILD_PLAN.md
```

- `AGENTS.md` = Codexが毎回守る開発ルール
- `GAME_SPEC.md` = 何を作るか
- `BUILD_PLAN.md` = どの順番で実装するか

企画・仕様はChatGPT Chatで詰め、実装はCodexへTask単位で渡し、確定内容はGitHubへ残す運用を標準とします。
