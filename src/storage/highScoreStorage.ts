import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_META } from '../config/game';

export interface HighScoreRecord {
  score: number;
  achievedAt: string;
}

const KEY = `@tsudolab/${GAME_META.id}/high-score/v1`;

function isHighScoreRecord(value: unknown): value is HighScoreRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return Number.isFinite(record.score)
    && typeof record.score === 'number'
    && record.score >= 0
    && typeof record.achievedAt === 'string'
    && !Number.isNaN(Date.parse(record.achievedAt));
}

export async function loadHighScore(): Promise<HighScoreRecord | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isHighScoreRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveHighScore(score: number): Promise<HighScoreRecord> {
  const normalizedScore = Number.isFinite(score) ? Math.max(0, score) : 0;
  const current = await loadHighScore();
  if (current && current.score >= normalizedScore) return current;

  const next = { score: normalizedScore, achievedAt: new Date().toISOString() };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage failure must not block gameplay.
  }
  return next;
}
