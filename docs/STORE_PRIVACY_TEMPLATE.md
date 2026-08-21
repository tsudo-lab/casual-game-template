# Store privacy / data safety template

各ゲームで実装に合わせて埋め、App Store ConnectのApp Privacy / Google Play ConsoleのData safety / 広告申告を揃えるための作業メモです。

このファイルの初期値をそのまま提出せず、実装・SDK・Storeの最新質問項目を確認してください。

## App behavior inventory

### Local storage

- Local BEST:
- Tutorial seen flag:
- Language:
- Haptics:
- Other local settings:

### Network / backend

- Backend used: Yes / No
- Account / login: Yes / No
- Leaderboard: Yes / No
- Remote config: Yes / No
- Analytics: Yes / No
- Crash reporting: Yes / No

### Sharing

- Result image generated locally: Yes / No
- Share sheet used: Yes / No
- Share URL:

### Advertising

- AdMob used: Yes / No
- Interstitial ads: Yes / No
- Rewarded ads: Yes / No
- UMP consent flow: Yes / No
- Privacy options entry in Settings: Yes / No
- Development builds force Test Ads: Yes / No
- Production disables consent debug geography: Yes / No

## SDK inventory

| SDK | Purpose | Data / privacy notes |
|---|---|---|
| react-native-google-mobile-ads | Advertising / UMP | Check current Google Mobile Ads SDK disclosure requirements |
| AsyncStorage | Local persistence | Device-local app state |
| react-native-share | OS share sheet | User-initiated sharing |
| react-native-view-shot | Result image generation | Image is generated locally before sharing |
| <Analytics SDK> | | |
| <Crash SDK> | | |

## App Store Connect: App Privacy work memo

For each data type asked by App Store Connect, record:

- Collected: Yes / No
- Linked to identity: Yes / No
- Used for tracking: Yes / No
- Purpose
- Which SDK / feature causes it

Do not answer from memory. Check the current implementation and each third-party SDK's disclosure documentation at submission time.

## Google Play: Data safety work memo

For each data type asked by Google Play:

- Collected: Yes / No
- Shared: Yes / No
- Required / Optional
- Purpose
- Encrypted in transit where applicable
- Deletion handling where applicable
- Which SDK / feature causes it

## Advertising declaration

- [ ] Google Play「広告を含む」の回答が実装と一致
- [ ] App Storeの広告・Tracking関連回答が実装と一致
- [ ] UMP messageが必要地域向けに公開されている
- [ ] SettingsからPrivacy optionsを再表示できる
- [ ] app-ads.txtを使用する場合はDeveloper Website配下で公開済み

## Privacy policy checklist

Privacy Policyに最低限、実装している範囲で以下を反映します。

- [ ] Local dataの扱い
- [ ] Advertising SDKの利用
- [ ] Consent / Privacy options
- [ ] Analytics / Crash SDK（導入している場合）
- [ ] External sharing
- [ ] Contact / Support
- [ ] Policy URLがStoreからアクセス可能

## Final consistency check

リリース直前に以下4つを照合します。

```text
Production app implementation
= Privacy Policy
= App Store App Privacy
= Google Play Data safety / Ads declaration
```

- [ ] 4つが一致
- [ ] Development用Test Ads / UMP debug設定をProductionの申告根拠にしていない
- [ ] `npm run release:check` pass
