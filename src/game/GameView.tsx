import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { GameViewProps } from './types';
import { palette } from '../ui/theme';

/**
 * Replace this file for each new game.
 *
 * Contract:
 * - keep all game-specific state and rules inside src/game/
 * - report live score through onScoreChange
 * - call onRunEnd once when the run finishes
 * - the common controller remounts GameView when runId changes
 */
export function GameView({ hapticsEnabled, onScoreChange, onRunEnd }: GameViewProps) {
  const [score, setScore] = useState(0);

  const tap = () => {
    const next = score + 1;
    setScore(next);
    onScoreChange(next);
    if (hapticsEnabled) void Haptics.selectionAsync();

    // Placeholder rule only. Replace with the real game's game-over condition.
    if (next >= 20) onRunEnd({ score: next });
  };

  return (
    <View style={styles.stage}>
      <Text style={styles.helper}>REPLACE src/game/GameView.tsx</Text>
      <Pressable style={({ pressed }) => [styles.target, pressed && styles.targetPressed]} onPress={tap}>
        <Text style={styles.targetText}>TAP</Text>
      </Pressable>
      <Text style={styles.note}>Sample only · 20 taps ends the run</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    backgroundColor: palette.stage,
  },
  helper: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  target: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accent,
    shadowColor: palette.ink,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  targetPressed: { transform: [{ scale: 0.96 }], backgroundColor: palette.accentPressed },
  targetText: { color: palette.white, fontSize: 30, fontWeight: '900', letterSpacing: 1.5 },
  note: { color: palette.muted, fontSize: 11, fontWeight: '700' },
});
