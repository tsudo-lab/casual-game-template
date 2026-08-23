# Local simulator / emulator testing

このTemplateから作ったゲームを、iOS Simulator / Android Emulatorで確認する標準手順です。

## 0. 共通準備

```bash
npm install
git branch --show-current
```

PRの変更を確認するときは、対象PRのbranchへcheckoutしてから起動します。

`app.json` の以下をゲーム固有値へ変更してから使います。

- `expo.ios.bundleIdentifier`
- `expo.android.package`
- `expo.scheme`

---

## 1. iOS Simulator

### Xcode / Swift確認

```bash
xcodebuild -version
swift --version
xcode-select -p
```

Xcode更新後は必要に応じて以下を実行します。

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
sudo xcodebuild -runFirstLaunch
```

### Simulator runtime確認

```bash
xcrun simctl list devices available
```

削除済みruntimeのSimulatorが残っている場合は掃除します。

```bash
xcrun simctl delete unavailable
```

Simulatorを起動します。

```bash
open -a Simulator
```

### Native buildを起動

端末選択式:

```bash
npx expo run:ios --device
```

端末名またはUDIDを直接指定しても構いません。

```bash
npx expo run:ios --device "<SIMULATOR_NAME>"
npx expo run:ios --device <SIMULATOR_UDID>
```

一度native buildが入った後、JS変更だけ確認する場合:

```bash
npx expo start --dev-client
```

### 初回チュートリアルを再確認する

初回状態へ戻したい場合は、`app.json` のbundle identifierを使ってアンインストールします。

```bash
xcrun simctl uninstall booted <IOS_BUNDLE_IDENTIFIER>
npx expo run:ios --device
```

---

## 2. Android / Pixel 8 Emulator

Android Studioの Device Manager で `Pixel_8` Device Profileを作成して起動します。

### Android SDKパス

```bash
ls ~/Library/Android/sdk
```

GradleがSDKを見つけられない場合、ローカル専用の `android/local.properties` を作成します。

```bash
printf 'sdk.dir=%s\n' "$HOME/Library/Android/sdk" > android/local.properties
cat android/local.properties
```

`local.properties` はマシン固有設定なのでコミットしません。

必要ならshellにもAndroid SDKを設定します。

```bash
echo 'export ANDROID_HOME="$HOME/Library/Android/sdk"' >> ~/.zshrc
echo 'export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"' >> ~/.zshrc
source ~/.zshrc
```

### Emulator確認

```bash
adb devices
```

### Native buildを起動

```bash
npx expo run:android --device
```

一覧から `Pixel_8` を選択します。

### 初回状態へ戻す

`app.json` のAndroid packageを使います。

```bash
adb shell pm clear <ANDROID_PACKAGE>
```

---

## 3. 共通UX確認

### Tutorial

- 初回Play時に自動表示される
- 1ページずつ進む
- 戻る / 次へ / ゲーム開始が動く
- 日本語 / Englishの両方で崩れない
- ゲーム中の `?` から再表示できる
- Tutorial表示中に背後のゲーム操作が入らない

### Game exit confirmation

ゲーム途中でHome操作を行い、以下を確認します。

- `ホームへ戻る` → Homeへ戻る
- `最初からやり直す` → 現在Runだけリセットされる
- `ゲームを続ける` → 確認前の状態が残る
- 確認中に背後のゲーム操作が入らない
- Android Backでも同じ離脱確認が開く
- Android Backで確認画面を閉じられる

### Share

- Result画像が生成される
- 共有文が付く
- `GAME_META.shareUrl` が付く
- Share Cancel後にゲームへ戻れる
- iOS / AndroidのShare Sheetで確認する

### Ads / UMP

- development / previewではTest Ads固定
- EEA debugでUMP consentを確認できる
- productionではConsent debugが無効
- 広告未ロード・通信失敗でもRetryを止めない

---

## 4. 標準端末QA

最低限、以下で確認します。

- iPhone SE (3rd generation)
- iPhone 17
- iPad 11-inch（縦持ち）
- Pixel 8

iPadは通常の縦持ちに加えて、1/2 Split View相当の狭い幅でも確認します。端末名で分岐させず、実際のwindow sizeとSafe AreaによってPhone layoutへ戻ることを確認してください。

詳細な項目は `docs/QA_CHECKLIST.md` を使います。

---

## 5. コード側の検証

通常のPR確認:

```bash
npm run typecheck
npm run lint
npm test
```

Production提出前:

```bash
npm run release:check
```

`release:check` は型検査 / Lint / Testに加え、Bundle ID / Package / EAS production profile / AdMob本番ID / Test Ads / UMP debug設定を確認します。

Templateの初期値ではProduction用IDが未設定なので、`release:check` が失敗するのが正常です。各ゲーム用に置き換えた後に成功させます。

---

## 6. よくあるトラブル

### iOS: Google-Mobile-Ads-SDKのPodfile.lock不一致

```text
Podfile.lock: Google-Mobile-Ads-SDK <old>
RNGoogleMobileAds requires Google-Mobile-Ads-SDK <new>
```

```bash
cd ios
pod update Google-Mobile-Ads-SDK
cd ..
npx expo run:ios --device
```

### iOS: Simulator runtimeが見つからない

```text
Unable to boot device because we cannot determine the runtime bundle
```

```bash
xcrun simctl delete unavailable
xcrun simctl list devices available
```

必要なruntimeは Xcode > Settings > Components から入れます。

### Android: SDK location not found

```text
SDK location not found
```

```bash
printf 'sdk.dir=%s\n' "$HOME/Library/Android/sdk" > android/local.properties
```

### Android: Google Mobile Ads / Kotlin metadata mismatch

```text
Module was compiled with an incompatible version of Kotlin.
```

このTemplateでは、現行Expo SDK 57との既知動作構成として `react-native-google-mobile-ads` を `16.3.4` に固定しています。依存を更新するときはPixel 8でnative buildを再確認し、問題がなければTemplate側の固定versionも更新します。

```bash
cd android
./gradlew clean
cd ..
npx expo run:android --device
```
