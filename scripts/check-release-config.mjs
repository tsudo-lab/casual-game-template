import { readFileSync } from 'node:fs';

const app = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8')).expo;
const eas = JSON.parse(readFileSync(new URL('../eas.json', import.meta.url), 'utf8'));
const production = eas.build?.production;
const adPlugin = app.plugins?.find(
  (plugin) => Array.isArray(plugin) && plugin[0] === 'react-native-google-mobile-ads',
)?.[1];

const errors = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

assert(/^\d+\.\d+\.\d+$/.test(app.version ?? ''), 'expo.version must use semantic versioning.');
assert(/^com\.[a-z0-9.]+$/.test(app.ios?.bundleIdentifier ?? ''), 'iOS bundle identifier is missing or malformed.');
assert(/^com\.[a-z0-9.]+$/.test(app.android?.package ?? ''), 'Android package name is missing or malformed.');
assert(app.ios?.bundleIdentifier !== 'com.tsudolab.game.template', 'Replace the template iOS bundle identifier before release.');
assert(app.android?.package !== 'com.tsudolab.game.template', 'Replace the template Android package name before release.');
assert(production?.distribution === 'store', 'The production build must use store distribution.');
assert(production?.autoIncrement === true, 'The production build must auto-increment build numbers.');
assert(production?.env?.EXPO_PUBLIC_ADMOB_FORCE_TEST_ADS === 'false', 'Production ads must not be forced to test mode.');
assert(production?.env?.EXPO_PUBLIC_ADMOB_CONSENT_DEBUG_GEOGRAPHY === 'DISABLED', 'Production consent debug geography must be disabled.');
assert(adPlugin?.delayAppMeasurementInit === true, 'AdMob app measurement must be delayed until consent is handled.');

const appIdPattern = /^ca-app-pub-\d{16}~\d{10}$/;
const unitIdPattern = /^ca-app-pub-\d{16}\/\d{10}$/;
assert(appIdPattern.test(adPlugin?.iosAppId ?? ''), 'The production iOS AdMob App ID is missing or malformed.');
assert(appIdPattern.test(adPlugin?.androidAppId ?? ''), 'The production Android AdMob App ID is missing or malformed.');
assert(unitIdPattern.test(production?.env?.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL_ID ?? ''), 'The production iOS interstitial ID is missing or malformed.');
assert(unitIdPattern.test(production?.env?.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID ?? ''), 'The production Android interstitial ID is missing or malformed.');

const googleTestIdentifiers = new Set([
  'ca-app-pub-3940256099942544~1458002511',
  'ca-app-pub-3940256099942544~3347511713',
  'ca-app-pub-3940256099942544/1033173712',
  'ca-app-pub-3940256099942544/4411468910',
]);
[
  adPlugin?.iosAppId,
  adPlugin?.androidAppId,
  production?.env?.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL_ID,
  production?.env?.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID,
].forEach((identifier) => assert(!googleTestIdentifiers.has(identifier), `Production still contains a Google test identifier: ${identifier}`));

if (errors.length > 0) {
  console.error('Release configuration check failed:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Release configuration check passed.');
