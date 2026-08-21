import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppLanguage, GAME_META } from '../config/game';

const LANGUAGE_KEY = `@tsudolab/${GAME_META.id}/language/v1`;
const HAPTICS_KEY = `@tsudolab/${GAME_META.id}/haptics/v1`;

export async function loadLanguage(): Promise<AppLanguage> {
  try {
    const value = await AsyncStorage.getItem(LANGUAGE_KEY);
    return value === 'en' ? 'en' : 'ja';
  } catch {
    return 'ja';
  }
}

export async function saveLanguage(language: AppLanguage): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch {}
}

export async function loadHapticsEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(HAPTICS_KEY)) !== 'false';
  } catch {
    return true;
  }
}

export async function saveHapticsEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(HAPTICS_KEY, String(enabled));
  } catch {}
}
