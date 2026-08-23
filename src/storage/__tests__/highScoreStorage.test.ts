import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadHighScore, saveHighScore } from '../highScoreStorage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('high score storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ignores malformed persisted values', async () => {
    storage.getItem.mockResolvedValue(JSON.stringify({ score: '100', achievedAt: 'not-a-date' }));

    await expect(loadHighScore()).resolves.toBeNull();
  });

  it('preserves a valid existing best score', async () => {
    const saved = { score: 100, achievedAt: '2026-08-23T00:00:00.000Z' };
    storage.getItem.mockResolvedValue(JSON.stringify(saved));

    await expect(saveHighScore(90)).resolves.toEqual(saved);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('normalizes an invalid incoming score without blocking the run', async () => {
    storage.getItem.mockResolvedValue(null);

    await expect(saveHighScore(Number.NaN)).resolves.toMatchObject({ score: 0 });
    expect(storage.setItem).toHaveBeenCalled();
  });
});
