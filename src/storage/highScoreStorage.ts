import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_META } from '../config/game';

export interface HighScoreRecord {
  score: number;
  achievedAt: string;
}

const KEY = `@tsudolab/${GAME_META.id}/high-score/v1`;

export async function loadHighScore(): Promise<HighScoreRecord | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HighScoreRecord;
    return Number.isFinite(parsed.score) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveHighScore(score: number): Promise<HighScoreRecord> {
  const current = await loadHighScore();
  if (current && current.score >= score) return current;

  const next = { score, achievedAt: new Date().toISOString() };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage failure must not block gameplay.
  }
  return next;
}
