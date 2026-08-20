# GAME_SPEC_TEMPLATE

このファイルを新しいゲームRepositoryへコピーし、`docs/GAME_SPEC.md` として使います。

実装方法を書くのではなく、**何を作るか**を決めるための仕様です。

---

# ゲーム名

## 1. 一言コンセプト

8〜20文字程度で説明できる一文。

例:

```text
同じ色の玉をぶつけて進化させる
```

## 2. プレイヤーがやること

プレイヤーの基本操作を1〜3個に絞る。

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

Challenge Link / Replay等はMVPで必要か:

```text
必要 / 不要
```

## 13. Tutorial

最初の数秒で理解させる内容:

```text

```

Tutorial文言:

```text

```

## 14. 操作感 / Juice

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

## 15. Visual Direction

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

## 16. Phase 1 MVP

### 入れる

- Game
- Local BEST
- Retry
- Share
- Ads
- Settings / Tutorial
- 

### 入れない

- Login
- Ranking
- Daily Challenge
- Friend Challenge
- Backend
- 

## 17. Analytics（Phase 1.5候補）

```text
- game_start
- game_end
- retry
- score
- share
- 
```

## 18. Phase 2候補

コアが当たった場合だけ検討するもの:

```text
- leaderboard:
- dailyChallenge:
- friendChallenge:
- その他:
```

## 19. 未決事項

実装開始前に決める必要があること:

- [ ] 
- [ ] 

実装しながら決めてもよいこと:

- [ ] 
- [ ] 

## 20. MVP完成条件

この状態になったら「まず出せる」と判断する条件:

- [ ] Core Loopが成立している
- [ ] Start → Play → Result → Retryが通る
- [ ] BESTが保存される
- [ ] Shareが動く
- [ ] Adsが想定Cadenceで動く
- [ ] Tutorialで初見Playできる
- [ ] Typecheck / Lint / Testが通る
- [ ] iOS実機で確認した
- [ ] Android実機で確認した
