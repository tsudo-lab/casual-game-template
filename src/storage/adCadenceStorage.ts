import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_META } from '../config/game';

const KEY = `@tsudolab/${GAME_META.id}/completed-runs-since-ad/v1`;
export const RUNS_PER_INTERSTITIAL = 3;

async function loadCompletedRuns(): Promise<number> {
  try {
    const value = Number(await AsyncStorage.getItem(KEY));
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
  } catch {
    return 0;
  }
}

export async function recordCompletedRunForAds(): Promise<number> {
  const nextCount = (await loadCompletedRuns()) + 1;
  try {
    await AsyncStorage.setItem(KEY, String(nextCount));
  } catch {}
  return nextCount;
}

export async function shouldShowInterstitial(): Promise<boolean> {
  return (await loadCompletedRuns()) >= RUNS_PER_INTERSTITIAL;
}

export async function markInterstitialShown(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, '0');
  } catch {}
}
