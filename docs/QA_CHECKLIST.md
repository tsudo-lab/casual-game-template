# 端末別QAチェックリスト

このTemplateを使ったCasual Gameでは、`Small screen / Large screen` のような曖昧な分類だけで確認せず、**実際の端末Profileごとに確認する**ことを標準にします。

実際の起動手順は `docs/LOCAL_DEVICE_TESTING.md` を参照してください。

## 標準Simulator / Emulator Matrix

最低限、以下の4端末で確認します。

| Platform | Device | 主な役割 |
|---|---|---|
| iOS | iPhone SE (3rd generation) | 小さいiPhoneでの崩れ確認 |
| iOS | iPhone 17 | 標準的な現行iPhoneでの確認 |
| iOS | iPad 11-inch（縦持ち） | iPadの余白・最大幅・Safe Area確認 |
| Android | Pixel 8 | 標準Androidでの確認 |

参考として、iOSのLayoutは以下のLogical Sizeを基準に確認できます。

```text
iPhone SE (3rd generation): 375 x 667 pt
iPhone 17:                  実際のSimulator Window Sizeで確認
iPad 11-inch（縦持ち）:    実際のSimulator Window Sizeで確認
```

Pixel 8は物理Display SizeとReact Native上のLogical Sizeが異なるため、Raw Pixel値だけでLayout判断しません。Android Studioの `Pixel 8` Device Profileを使い、実際のWindow Size / Safe Areaで確認してください。

## Responsive Layoutの原則

**端末名そのものでは分岐しません。**

避ける例:

```ts
if (deviceName === 'iPhone 16') {
  // ...
}
```

代わりに、React Nativeの実際の表示領域を使ってLayoutを決めます。

```ts
const { width, height } = useWindowDimensions();
```

必要に応じてSafe Area Insetsも利用します。

```text
検証単位 = 実際の端末Profile
Layout判断 = width / height / safe area
```

## 4端末すべてで確認する項目

### Home

- [ ] Title / Logoが切れない
- [ ] Play Buttonが押しやすい位置にある
- [ ] Settings ButtonがSafe Areaへ入り込まない
- [ ] Hero / Character / Illustrationが意図したSizeで表示される
- [ ] 縦方向に窮屈すぎない / 間延びしすぎない

### Tutorial

- [ ] 初回Playで自動表示される
- [ ] 複数ページを1ページずつ進められる
- [ ] Back / Next / Playが正しく動く
- [ ] Textが切れない
- [ ] 日本語 / 英語ともに収まる
- [ ] Game中の `?` から再表示できる
- [ ] Tutorial表示中に背後のGame入力が入らない

### Game

- [ ] Core Game Areaが十分な大きさを確保できている
- [ ] HUDがGame操作を邪魔しない
- [ ] Score / BESTが切れない
- [ ] 上下Safe Areaを侵食しない
- [ ] Gesture / Tap Areaが端末ごとに不自然にならない
- [ ] 小さい画面でもGame Ruleが成立する
- [ ] 大きい画面でGame Objectが小さくなりすぎない

### Game exit confirmation

Game途中でHomeを押して確認します。

- [ ] `ホームへ戻る` → Homeへ戻る
- [ ] `最初からやり直す` → Runがリセットされる
- [ ] `ゲームを続ける` → 元のRun状態が残る
- [ ] Modal表示中に背後のGame入力が入らない
- [ ] Game Over後のHomeは不要な離脱確認を挟まない

### Android Back

Pixel 8で確認します。

- [ ] Game中のBack → 離脱確認
- [ ] 離脱確認中のBack → 確認を閉じてGameへ戻る
- [ ] Tutorial中のBack → Tutorialを閉じる
- [ ] SettingsのBack → Home
- [ ] PrivacyのBack → Settings
- [ ] HomeのBack → OS標準挙動

### Result

- [ ] Score / BEST / NEW BESTが一目で分かる
- [ ] Retry Buttonが押しやすい
- [ ] Share Buttonが押しやすい
- [ ] Modal / Cardが画面外へ出ない

### Share

- [ ] Result画像が生成される
- [ ] 共有文が付く
- [ ] `GAME_META.shareUrl` が付く
- [ ] Share Cancel後にAppへ戻れる
- [ ] iOS Share Sheetで確認した
- [ ] Android Share Sheetで確認した

### Settings / Privacy

- [ ] 全項目がScrollまたは表示できる
- [ ] Toggle / Buttonが押せる
- [ ] 長いTextが切れない
- [ ] Haptics設定が再起動後も残る
- [ ] 必要時にAd privacy optionsを開ける

### Ads / UMP

- [ ] Development / PreviewはTest Ads固定
- [ ] UMP EEA debugをDevelopmentで確認できる
- [ ] 規定Run数まではInterstitialが出ない
- [ ] 対象Run後のRetryでInterstitialが出る
- [ ] 広告を閉じた後にRetryできる
- [ ] Offline / 広告未ロード / 広告失敗でもGameが止まらない

### 状態変化

- [ ] 初回Tutorial
- [ ] Tutorial再表示
- [ ] 通常Play
- [ ] Game途中のExit / Restart / Resume
- [ ] Game Over
- [ ] NEW BEST
- [ ] 連続Retry
- [ ] Share Cancel
- [ ] Share Success
- [ ] Haptics ON / OFF
- [ ] 日本語
- [ ] 英語

## 端末ごとの観点

### iPhone SE (3rd generation)

- [ ] 縦Space不足
- [ ] Button / HUDの重なり
- [ ] Text折り返し
- [ ] Tutorial / Exit / Result Modalの高さ
- [ ] Game Areaが小さくなりすぎない

### iPhone 17

- [ ] 標準Designとして意図した見え方
- [ ] Dynamic Island側のSafe Area
- [ ] Home / Gameの余白Balance
- [ ] Share Cardとの見た目差が大きすぎない

### iPad 11-inch（縦持ち）

- [ ] Game領域が横に広がりすぎず、中央で読みやすく収まる
- [ ] Home / Tutorial / Result / Settingsが大きな余白に対して小さすぎない
- [ ] 1/2 Split View相当の狭い幅では、Phone向けLayoutへ自然に戻る
- [ ] Safe Areaと操作領域が干渉しない

### Pixel 8

- [ ] Android側Safe Area / Status Bar
- [ ] Back Gestureとの干渉
- [ ] Font Rendering差
- [ ] Button Size / Touch Area
- [ ] iOSだけを前提にしたLayoutになっていない

## 実機でしか確認しにくいもの

Simulator / Emulatorだけで完了扱いにしない項目:

- [ ] Hapticsの体感
- [ ] Share Sheet
- [ ] Production / Test Ads
- [ ] UMP / Consent
- [ ] App起動 / 復帰
- [ ] Performance / 発熱

Release前にはiOS / Androidそれぞれ最低1台の実機確認を行います。

## QA完了条件

```text
[ ] iPhone SE (3rd generation) 確認済み
[ ] iPhone 17 確認済み
[ ] iPad 11-inch（縦持ち）確認済み
[ ] Pixel 8 確認済み
[ ] Tutorial / Exit / Android Back確認済み
[ ] Share画像 + Text + URL確認済み
[ ] 日本語確認済み
[ ] 英語確認済み
[ ] typecheck pass
[ ] lint pass
[ ] test pass
[ ] 実機でShare / Haptics / Ads / UMP確認
```

端末固有の調整を行った場合も、可能な限り端末名Hardcodeではなく `width / height / safe area` によるResponsive Layoutとして実装してください。
