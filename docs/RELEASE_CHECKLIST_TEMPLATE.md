# Release checklist template

各ゲームでこのファイルを `docs/RELEASE_CHECKLIST.md` としてコピーし、ゲーム固有項目へ調整します。P0がすべて完了したら初回リリース可能です。P1/P2は初回リリースのブロッカーではありません。

## P0: 初回リリースまでに必須

### 1. Production設定

- [ ] `app.json` のname / slug / scheme / iOS bundle identifier / Android packageをゲーム固有値へ変更した
- [ ] Icon / Splashをゲーム固有素材へ変更した
- [ ] AdMob iOS / Android App IDを本番値へ変更した
- [ ] `eas.json` productionのInterstitial IDを本番値へ変更した
- [ ] productionで `EXPO_PUBLIC_ADMOB_FORCE_TEST_ADS=false`
- [ ] productionで `EXPO_PUBLIC_ADMOB_CONSENT_DEBUG_GEOGRAPHY=DISABLED`
- [ ] `npm run release:check` が成功する

### 2. 外部サービス

- [ ] AdMob Privacy & messagingで必要なUMP同意メッセージを公開した
- [ ] App Store Connectへアプリ登録した
- [ ] Google Play Consoleへアプリ登録した
- [ ] Developer Website / Privacy Policy URLを設定した
- [ ] App Privacy / Data safetyを実装に合わせて回答した
- [ ] 「広告を含む」等の申告を実装に合わせた
- [ ] 配布用署名 / Android signing keyを確認した

### 3. Development build

- [ ] iOS development buildを実機へ入れた
- [ ] Android development buildを実機へ入れた
- [ ] UMP同意表示を確認した
- [ ] Settingsから広告Privacy optionsを開けることを確認した
- [ ] 規定Run数まで広告が出ないことを確認した
- [ ] 対象Run後のRetryでInterstitialが出ることを確認した
- [ ] 広告を閉じた後にRetryできる
- [ ] 広告未ロード / 通信失敗 / Offlineでもゲームが止まらない

### 4. 標準端末QA

`docs/QA_CHECKLIST.md` に従い、最低限以下を確認します。

| Device | Complete |
|---|---|
| iPhone SE (3rd generation) | [ ] |
| iPhone 16 | [ ] |
| Pixel 8 | [ ] |

- [ ] Home / Tutorial / Game / Result / Settingsが収まる
- [ ] Safe Areaに干渉しない
- [ ] 日本語 / Englishで文字切れしない
- [ ] 初回Tutorialが自動表示される
- [ ] `?` からTutorialを再表示できる
- [ ] Home離脱確認の「Home / Restart / Continue」が正しい
- [ ] Android Backが画面状態に合わせて正しく動く
- [ ] Game Over / Retry / NEW BESTが動く
- [ ] Share画像 + 文章 + URLを確認した

### 5. 初見理解 / バランス

- [ ] 初見プレイヤーが操作を理解できる
- [ ] ゲーム目的をTutorialだけで理解できる
- [ ] 1Runの長さを確認した
- [ ] Retryしたくなるテンポか確認した
- [ ] 運だけで決まらず、操作や判断で記録差が出るか確認した

### 6. Store準備

- [ ] `docs/STORE_LISTING_TEMPLATE.md` をゲーム用に埋めた
- [ ] `docs/STORE_PRIVACY_TEMPLATE.md` をゲーム用に埋めた
- [ ] Store title / subtitle / descriptionを確定した
- [ ] Screenshotsを作成した
- [ ] 年齢区分 / Content ratingを回答した
- [ ] Privacy Policyが公開されている
- [ ] app-ads.txtを必要に応じて公開した

### 7. Production / Internal testing

- [ ] iOS production buildを作成した
- [ ] Android production buildを作成した
- [ ] App Store / Google Playの内部テストへ配信した
- [ ] 内部テスト経由で実際にインストールした
- [ ] 主要導線を再確認した
- [ ] Store申告とProduction buildの実装が一致している
- [ ] iOS審査へ提出した
- [ ] Android審査へ提出した

## P1: リリース後に品質を上げる

- [ ] 最小Analyticsを追加する
- [ ] Crash monitoringを追加する
- [ ] Share先ごとの表示を確認する
- [ ] Accessibilityを確認する
- [ ] `npm audit --omit=dev` を互換性を壊さない範囲で確認する
- [ ] Player feedbackをまとめる

## P2: 当たったゲームだけ追加

- [ ] Leaderboard
- [ ] Daily challenge
- [ ] Friend challenge / Deep link
- [ ] Skins / Purchase
- [ ] Rewarded ads

## Release判定

```text
[ ] P0 unfinished = 0
[ ] release:check pass
[ ] iOS internal test blockerなし
[ ] Android internal test blockerなし
[ ] Store申告とProduction build一致
```
