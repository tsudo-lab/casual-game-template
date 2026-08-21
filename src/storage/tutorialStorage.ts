import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_META } from '../config/game';

const KEY = `@tsudolab/${GAME_META.id}/tutorial-seen/v1`;

export async function hasSeenTutorial(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === 'true';
  } catch {
    return false;
  }
}

export async function markTutorialSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, 'true');
  } catch {}
}
