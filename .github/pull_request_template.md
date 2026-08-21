# PR概要

## 対象Task

`docs/BUILD_PLAN.md` の対象Taskを書いてください。

```text
Task:
```

## 実装内容

- 
- 
- 

## 主な変更File

- 
- 
- 

## 自動Check

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm test`

Production設定へ触れたPRでは追加で:

- [ ] `npm run release:check`

未実行のものがある場合は理由を書いてください。

## Simulator / Emulator確認

UI / GameView / Layout / Navigationへ変更がある場合は `docs/LOCAL_DEVICE_TESTING.md` に沿って確認してください。

- [ ] iPhone SE (3rd generation)
- [ ] iPhone 16
- [ ] Pixel 8

該当しない場合:

```text
端末確認不要の理由:
```

## UI / Flow確認

該当する項目だけ確認してください。

- [ ] Safe Area
- [ ] 日本語
- [ ] 英語
- [ ] 初回Tutorial
- [ ] `?` からTutorial再表示
- [ ] Tutorial中のGame入力Block
- [ ] Game
- [ ] Game途中のHome離脱確認
- [ ] Exit: Homeへ戻る
- [ ] Exit: 最初からやり直す
- [ ] Exit: ゲームを続ける
- [ ] Android Back
- [ ] Result
- [ ] Retry
- [ ] Share画像 + 文章 + URL
- [ ] Settings / Privacy

## 実機確認

このPRで必要な場合のみ。

- [ ] iOS実機
- [ ] Android実機
- [ ] Haptics
- [ ] Share Sheet
- [ ] Ads / UMP
- [ ] Offline / 広告失敗Fallback

## 未確認事項

- 

## 別Task候補

Scope外で見つけた改善やBugをここへ書きます。今回のPRへ無理に混ぜません。

- 

## Templateへ戻す候補

複数のCasual Gameでそのまま再利用できそうな改善だけ書きます。

- 
