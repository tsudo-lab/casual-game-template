# 端末別QAチェックリスト

このTemplateを使ったCasual Gameでは、`Small screen / Large screen` のような曖昧な分類だけで確認せず、**実際の端末Profileごとに確認する**ことを標準にします。

## 標準Simulator / Emulator Matrix

最低限、以下の3端末で確認します。

| Platform | Device | 主な役割 |
|---|---|---|
| iOS | iPhone SE (3rd generation) | 小さいiPhoneでの崩れ確認 |
| iOS | iPhone 16 | 標準的な現行iPhoneでの確認 |
| Android | Pixel 8 | 標準Androidでの確認 |

参考として、iOSのLayoutは以下のLogical Sizeを基準に確認できます。

```text
iPhone SE (3rd generation): 375 x 667 pt
iPhone 16:                  393 x 852 pt
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

つまり、

```text
検証単位 = 実際の端末Profile
Layout判断 = width / height / safe area
```

です。

同じUIを全端末で無理に同じ比率にする必要はありません。ゲームごとに、各Viewportで見た目が最適になるよう余白・Game Area・HUD位置・文字Size等を調整して構いません。

## 3端末すべてで確認する項目

### Home

- [ ] Title / Logoが切れない
- [ ] Play Buttonが押しやすい位置にある
- [ ] Settings ButtonがSafe Areaへ入り込まない
- [ ] Hero / Character / Illustrationが意図したSizeで表示される
- [ ] 縦方向に窮屈すぎない / 間延びしすぎない

### Tutorial

- [ ] Textが切れない
- [ ] 日本語 / 英語ともに収まる
- [ ] 閉じる操作が押せる
- [ ] Game Areaを必要以上に隠さない

### Game

- [ ] Core Game Areaが十分な大きさを確保できている
- [ ] HUDがGame操作を邪魔しない
- [ ] Score / BESTが切れない
- [ ] 上下Safe Areaを侵食しない
- [ ] Gesture / Tap Areaが端末ごとに不自然にならない
- [ ] 小さい画面でもGame Ruleが成立する
- [ ] 大きい画面でGame Objectが小さくなりすぎない

### Result

- [ ] Score / BEST / NEW BESTが一目で分かる
- [ ] Retry Buttonが押しやすい
- [ ] Share Buttonが押しやすい
- [ ] Modal / Cardが画面外へ出ない

### Settings / Privacy

- [ ] 全項目がScrollまたは表示できる
- [ ] Toggle / Buttonが押せる
- [ ] 長いTextが切れない

### 状態変化

- [ ] 初回Tutorial
- [ ] 通常Play
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

特に確認すること:

- [ ] 縦Space不足
- [ ] Button / HUDの重なり
- [ ] Text折り返し
- [ ] Result Modalの高さ
- [ ] Game Areaが小さくなりすぎない

### iPhone 16

特に確認すること:

- [ ] 標準Designとして意図した見え方になっている
- [ ] Dynamic Island側のSafe Area
- [ ] Home / Gameの余白Balance
- [ ] Share Cardとの見た目差が大きすぎない

### Pixel 8

特に確認すること:

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

以下を満たしたら端末QA完了とします。

```text
[ ] iPhone SE (3rd generation) 確認済み
[ ] iPhone 16 確認済み
[ ] Pixel 8 確認済み
[ ] 日本語確認済み
[ ] 英語確認済み
[ ] typecheck pass
[ ] lint pass
[ ] test pass
[ ] 実機でShare / Haptics / Ads系を確認
```

端末固有の調整を行った場合も、可能な限り端末名Hardcodeではなく `width / height / safe area` によるResponsive Layoutとして実装してください。
