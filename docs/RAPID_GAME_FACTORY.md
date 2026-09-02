# Rapid Game Factory

このTemplateで新しいカジュアルゲームを作るときの標準フローです。

目的は、静止画モックを別実装へ「再現」する工程をなくし、最初から実装可能なReact Native/Webモックを育ててそのまま製品化することです。

## 基本原則

1. **静止画モックを正解実装として扱わない**
   - 画像は雰囲気・アート方向の参考に限定する。
   - Layout、Typography、Spacing、Color、Button shape、HUD位置はコード上の値を正とする。
2. **最初のモックは本番コード上で作る**
   - `npm run web` で触れる最小ゲームを作る。
   - OKになったモックを捨てず、そのままNative対応・演出追加へ進める。
3. **共通Behaviorは触らない**
   - Home遷移、BEST、Retry、Share、Ads、Settings、Tutorial lifecycle、Exit flowはTemplateを利用する。
4. **ゲーム固有領域を狭く保つ**
   - 原則として変更対象は `src/game/`、`src/design/`、`src/config/game.ts`。
   - Controller / Storage / Ads / Navigationはゲームごとに作り直さない。
5. **確認単位を小さくする**
   - まず1画面・1操作・1結果までを成立させる。
   - その後に演出、チュートリアル、Result、Shareを詰める。

## 標準フロー

### Phase 0: Intent

`casual-game-idea` 側の開発プロンプトから次だけを抜き出す。

- 1文ゲーム説明
- コアループ
- 入力方法
- 成功 / 失敗条件
- スコア原理
- Visual direction
- 1プレイの目安

### Phase 1: Playable Prototype

最初に実装するのは以下だけ。

- `src/config/game.ts`
- `src/game/GameView.tsx`
- 必要な `src/game/engine/*`
- 最低限の `src/design/HomeVisual.tsx`
- 最低限の `src/design/GameVisual.tsx`

この時点ではStore品質にしない。重要なのは、Web上で実際に触ってゲーム性と画面構成を判断できること。

完了条件:

- HomeからPlayできる
- 最初の操作ができる
- スコアが変わる
- Game Over / Run Endまで到達できる
- Retryできる
- `npm run typecheck`
- `npm run lint`
- `npm test`

### Phase 2: Visual Freeze

ゲーム性が採用されたら `docs/VISUAL_ACCEPTANCE.md` を作り、見た目を文章ではなく具体値で固定する。

最低限:

- Target device
- Screen background
- Main surface
- Header height
- Main game area bounds
- Typography size / weight
- Primary / secondary colors
- Border radius
- Major spacing
- HUD位置
- Result構成

見た目の修正依頼は「もっと下」「少し大きく」ではなく、可能な限りこのファイルの値を更新する。

### Phase 3: Polish

Visual Freeze後にのみ追加する。

- Animation / Juice
- Haptics tuning
- Sound
- Tutorial polish
- Result polish
- Share card
- Device-specific adjustment

## 変更範囲

通常の新規ゲームで編集してよい場所:

```text
src/config/game.ts
src/game/**
src/design/HomeVisual.tsx
src/design/GameVisual.tsx
src/design/TutorialCarousel.tsx  # 必要時のみ
docs/VISUAL_ACCEPTANCE.md
```

原則編集しない場所:

```text
src/screens/**
src/services/**
src/storage/**
App.tsx
```

ここを触る必要が出た場合は、ゲーム固有要件なのかTemplate不足なのかを先に切り分ける。

## 画像モックを受け取った場合

画像モックは参考資料として使用してよいが、Agentは推測で大量実装しない。

1. 画像から推測した主要値を `docs/VISUAL_ACCEPTANCE.md` に明文化する
2. Web実装へ反映する
3. 実装画面を確認する
4. 差分がある場合は値を修正する

「画像を一度見て一発で完全再現」を完了条件にしない。正解は、確認済みの動く画面とVisual Acceptanceの値である。

## 完了報告

各イテレーションの報告は短く、次を含める。

- 触れるURL
- 今回確認できる操作
- 変更したゲーム固有ファイル
- Visual Acceptanceで確定した点
- まだ未確定の点

計画だけ、ファイル一覧だけで終わらせない。
