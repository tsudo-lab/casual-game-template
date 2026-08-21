# GAME_SPEC_TEMPLATE

このファイルを新しいゲームRepositoryへコピーし、`docs/GAME_SPEC.md` として使います。

実装方法を書くのではなく、**何を作るか**を決めるための仕様です。

---

# ゲーム名

## 1. 一言コンセプト

8〜20文字程度で説明できる一文。

```text

```

## 2. プレイヤーがやること

基本操作を1〜3個に絞る。

```text
- 
- 
```

## 3. Core Loop

```text
操作
↓
盤面 / 状態が変化
↓
Score / Progressが増える
↓
もう一度操作したくなる
```

このゲーム固有のLoop:

```text

```

## 4. ルール

### 基本ルール

- 
- 
- 

### 禁止 / 例外ルール

- 
- 

## 5. 1プレイの開始

開始時の状態:

```text

```

プレイヤーが最初にできること:

```text

```

## 6. 1プレイの終了条件

```text

```

## 7. Score / BEST

### 主Score

```text

```

### BESTの比較方法

```text
higher-is-better / lower-is-better
```

### 補助的に表示したいもの

- 
- 

MVPではPrimary Metricを増やしすぎない。

## 8. 難易度 / Progression

プレイ中に何が難しくなるか:

```text

```

長く遊ぶほど何が伸びるか:

```text

```

## 9. Home

Homeで必要なもの:

- Game Title
- Play
- BEST
- Settings
- その他:

Visual Direction:

```text

```

## 10. Game Screen

表示するもの:

- 
- 
- 

表示しないもの:

- 
- 

## 11. Result

必ず見せるもの:

- Score
- BEST / NEW BEST
- Retry
- Share

ゲーム固有で見せるもの:

- 
- 

## 12. Share

Shareした時に1秒で伝わってほしいこと:

```text

```

Share Cardに入れるもの:

- 
- 

Share message:

```text
JA:
EN:
```

Share URL:

```text
https://
```

Template標準は **Result画像 + Message + URL**。変更する理由がある場合:

```text

```

Challenge Link / Replay等はMVPで必要か:

```text
必要 / 不要
```

## 13. Tutorial

Template標準は、初回Playで自動表示する複数ページCarousel + Game中 `?` からの再表示です。

何ページにするか:

```text

```

各ページ:

```text
STEP 1
- eyebrow:
- title:
- body:

STEP 2
- eyebrow:
- title:
- body:

STEP 3
- eyebrow:
- title:
- body:
```

初見ユーザーがTutorialだけで最初の成功状態まで進めるかを確認する。

## 14. Game途中の離脱

Template標準:

```text
Homeへ戻る
最初からやり直す
ゲームを続ける
```

Android BackもGame中は同じ確認Flowへ接続する。

このゲームで標準を変える必要があるか:

```text
不要 / 必要（理由: ）
```

## 15. 操作感 / Juice

必要なFeedback:

```text
- haptics:
- sound:
- animation:
- squash / stretch:
- particles:
```

MVPで優先するもの:

```text

```

## 16. Visual Direction

### 雰囲気

```text

```

### Color

```text

```

### UI

```text

```

### 参考にするもの

```text

```

参考作品のMechanicsやArtworkをそのままコピーするのではなく、参考にするProduct Qualityを言語化する。

## 17. Phase 1 MVP

### 入れる

- Game
- Local BEST
- Retry
- Result image + text + URL Share
- Ads / UMP
- Settings
- Tutorial carousel / reopen
- Game exit confirmation
- Android Back
- 

### 入れない

- Login
- Ranking
- Daily Challenge
- Friend Challenge
- Backend
- 

## 18. Analytics（Phase 1.5候補）

```text
- game_start
- game_end
- retry
- score
- share
- 
```

## 19. Phase 2候補

コアが当たった場合だけ検討するもの:

```text
- leaderboard:
- dailyChallenge:
- friendChallenge:
- その他:
```

## 20. 未決事項

実装開始前に決める必要があること:

- [ ] 
- [ ] 

実装しながら決めてもよいこと:

- [ ] 
- [ ] 

## 21. MVP完成条件

- [ ] Core Loopが成立している
- [ ] Start → Play → Result → Retryが通る
- [ ] BESTが保存される
- [ ] 初回Tutorialが自動表示される
- [ ] `?` からTutorialを再表示できる
- [ ] Game途中のHome / Restart / Continueが動く
- [ ] Pixel 8でAndroid Backが正しく動く
- [ ] Share画像 + Message + URLが動く
- [ ] Adsが想定Cadenceで動く
- [ ] Offline / 広告失敗でGameが止まらない
- [ ] Typecheck / Lint / Testが通る
- [ ] iPhone SE (3rd generation)確認
- [ ] iPhone 16確認
- [ ] Pixel 8確認
- [ ] iOS実機でShare / Haptics / Ads / UMP確認
- [ ] Android実機でShare / Haptics / Ads / UMP確認
- [ ] Production前に `npm run release:check` が通る
