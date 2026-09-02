import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { GameViewProps } from './types';
import { palette } from '../ui/theme';

type Mode = 'trace' | 'chain' | 'mission';
type Point = { x: number; y: number };
type Direction = 'up' | 'down' | 'left' | 'right';

const GRID = 7;
const START: Point = { x: 3, y: 5 };
const SCROLL: Point = { x: 5, y: 1 };
const EXIT: Point = { x: 1, y: 0 };
const MISSION_WALLS = new Set(['2,2', '3,2', '4,2', '1,4', '5,4']);

const MODE_COPY: Record<Mode, { label: string; hook: string; detail: string }> = {
  trace: {
    label: 'TRACE',
    hook: '過去の自分から逃げ続けろ',
    detail: '2・4・6手前の自分が影分身になる。自分が影に重なったら失敗。',
  },
  chain: {
    label: 'CHAIN',
    hook: '過去の動線をなぞって倍率を伸ばせ',
    detail: '影分身が通ったマスを自分が踏むとCHAIN。連続でなぞるほど得点倍率UP。',
  },
  mission: {
    label: 'MISSION',
    hook: '巻物を奪って出口まで忍べ',
    detail: '巻物を取ってから出口へ。壁と影分身を避けて最短クリアを狙う。',
  },
};

function keyOf(point: Point) {
  return `${point.x},${point.y}`;
}

function samePoint(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

function move(point: Point, direction: Direction): Point {
  const delta = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  }[direction];

  return {
    x: Math.max(0, Math.min(GRID - 1, point.x + delta.x)),
    y: Math.max(0, Math.min(GRID - 1, point.y + delta.y)),
  };
}

export function GameView({ hapticsEnabled, onScoreChange }: GameViewProps) {
  const [mode, setMode] = useState<Mode>('trace');
  const [player, setPlayer] = useState<Point>(START);
  const [history, setHistory] = useState<Point[]>([START]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [collectedScroll, setCollectedScroll] = useState(false);
  const [status, setStatus] = useState<'playing' | 'failed' | 'cleared'>('playing');
  const [message, setMessage] = useState('');

  const shadows = useMemo(() => {
    const delays = [2, 4, 6];
    return delays
      .map((delay) => history[history.length - 1 - delay])
      .filter((point): point is Point => Boolean(point));
  }, [history]);

  const shadowTrail = useMemo(() => {
    const trail = new Set<string>();
    for (let i = 0; i < Math.max(0, history.length - 2); i += 1) {
      trail.add(keyOf(history[i]));
    }
    return trail;
  }, [history]);

  const reset = (nextMode = mode) => {
    setMode(nextMode);
    setPlayer(START);
    setHistory([START]);
    setScore(0);
    setCombo(0);
    setCollectedScroll(false);
    setStatus('playing');
    setMessage('');
    onScoreChange(0);
  };

  const chooseMode = (nextMode: Mode) => {
    reset(nextMode);
  };

  const act = (direction: Direction) => {
    if (status !== 'playing') return;

    const next = move(player, direction);
    if (samePoint(next, player)) {
      setMessage('端だ。別の方向へ。');
      return;
    }

    if (mode === 'mission' && MISSION_WALLS.has(keyOf(next))) {
      setMessage('壁。別ルートを探せ。');
      return;
    }

    const nextHistory = [...history, next];
    const nextShadows = [2, 4, 6]
      .map((delay) => nextHistory[nextHistory.length - 1 - delay])
      .filter((point): point is Point => Boolean(point));

    const collidedWithShadow = nextShadows.some((shadow) => samePoint(shadow, next));
    if (collidedWithShadow) {
      setPlayer(next);
      setHistory(nextHistory);
      setStatus('failed');
      setMessage('影に読まれた。');
      if (hapticsEnabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    let nextScore = score;
    let nextCombo = combo;
    let nextCollectedScroll = collectedScroll;

    if (mode === 'trace') {
      nextScore += 1 + nextShadows.length;
      setMessage(nextShadows.length === 0 ? '影が生まれるまで動け。' : `影 ${nextShadows.length}体`);
    }

    if (mode === 'chain') {
      const traced = shadowTrail.has(keyOf(next));
      nextCombo = traced ? combo + 1 : 0;
      nextScore += traced ? 5 * Math.max(1, nextCombo) : 1;
      setMessage(traced ? `CHAIN ×${nextCombo}` : '影の軌跡を踏め。');
    }

    if (mode === 'mission') {
      nextScore += 1;
      if (!nextCollectedScroll && samePoint(next, SCROLL)) {
        nextCollectedScroll = true;
        nextScore += 20;
        setMessage('巻物入手。出口へ。');
      } else if (nextCollectedScroll && samePoint(next, EXIT)) {
        nextScore += 50;
        setStatus('cleared');
        setMessage('MISSION CLEAR');
        if (hapticsEnabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setMessage(nextCollectedScroll ? '出口へ忍べ。' : '巻物を奪え。');
      }
    }

    setPlayer(next);
    setHistory(nextHistory);
    setScore(nextScore);
    setCombo(nextCombo);
    setCollectedScroll(nextCollectedScroll);
    onScoreChange(nextScore);
    if (hapticsEnabled) void Haptics.selectionAsync();
  };

  const modeCopy = MODE_COPY[mode];

  return (
    <View style={styles.stage}>
      <View style={styles.modeRow}>
        {(Object.keys(MODE_COPY) as Mode[]).map((item) => (
          <Pressable
            key={item}
            onPress={() => chooseMode(item)}
            style={[styles.modeButton, mode === item && styles.modeButtonActive]}
          >
            <Text style={[styles.modeText, mode === item && styles.modeTextActive]}>{MODE_COPY[item].label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.copyBlock}>
        <Text style={styles.hook}>{modeCopy.hook}</Text>
        <Text style={styles.detail}>{modeCopy.detail}</Text>
      </View>

      <View style={styles.board}>
        {Array.from({ length: GRID * GRID }).map((_, index) => {
          const x = index % GRID;
          const y = Math.floor(index / GRID);
          const point = { x, y };
          const isPlayer = samePoint(point, player);
          const shadowIndex = shadows.findIndex((shadow) => samePoint(shadow, point));
          const isShadow = shadowIndex >= 0;
          const isTrail = mode === 'chain' && shadowTrail.has(keyOf(point));
          const isWall = mode === 'mission' && MISSION_WALLS.has(keyOf(point));
          const isScroll = mode === 'mission' && !collectedScroll && samePoint(point, SCROLL);
          const isExit = mode === 'mission' && samePoint(point, EXIT);

          return (
            <View
              key={`${x}-${y}`}
              style={[
                styles.cell,
                isTrail && styles.trailCell,
                isWall && styles.wallCell,
                isExit && styles.exitCell,
              ]}
            >
              {isScroll ? <Text style={styles.scroll}>巻</Text> : null}
              {isExit ? <Text style={styles.exitText}>出</Text> : null}
              {isShadow ? <View style={[styles.ninja, styles.shadowNinja, { opacity: 0.34 + shadowIndex * 0.16 }]} /> : null}
              {isPlayer ? <View style={[styles.ninja, styles.playerNinja]} /> : null}
            </View>
          );
        })}
      </View>

      <View style={styles.statsRow}>
        <View>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.centerStat}>
          <Text style={styles.statLabel}>{mode === 'chain' ? 'CHAIN' : mode === 'mission' ? 'SCROLL' : 'KAGE'}</Text>
          <Text style={styles.statValue}>{mode === 'chain' ? combo : mode === 'mission' ? (collectedScroll ? 'GET' : '—') : shadows.length}</Text>
        </View>
        <View style={styles.messageBox}>
          <Text style={styles.message}>{message || '方向を選べ。'}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable style={[styles.control, styles.controlUp]} onPress={() => act('up')}><Text style={styles.controlText}>↑</Text></Pressable>
        <View style={styles.controlMiddle}>
          <Pressable style={styles.control} onPress={() => act('left')}><Text style={styles.controlText}>←</Text></Pressable>
          <Pressable style={styles.resetButton} onPress={() => reset()}><Text style={styles.resetText}>{status === 'playing' ? 'RESET' : 'RETRY'}</Text></Pressable>
          <Pressable style={styles.control} onPress={() => act('right')}><Text style={styles.controlText}>→</Text></Pressable>
        </View>
        <Pressable style={styles.control} onPress={() => act('down')}><Text style={styles.controlText}>↓</Text></Pressable>
      </View>

      {status !== 'playing' ? (
        <View style={styles.stateBanner}>
          <Text style={styles.stateText}>{status === 'cleared' ? 'MISSION CLEAR' : 'CAUGHT BY KAGE'}</Text>
          <Text style={styles.stateSub}>RETRYして同じ案をもう一度試すか、上のタブで別案へ。</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F4F2EC',
  },
  modeRow: { width: '100%', maxWidth: 390, flexDirection: 'row', gap: 8 },
  modeButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CFCBC2',
    backgroundColor: '#FFFFFF',
  },
  modeButtonActive: { backgroundColor: '#191816', borderColor: '#191816' },
  modeText: { color: '#6E6961', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  modeTextActive: { color: '#FFFFFF' },
  copyBlock: { width: '100%', maxWidth: 390, marginTop: 12, marginBottom: 10 },
  hook: { color: '#191816', fontSize: 18, fontWeight: '900', letterSpacing: -0.4 },
  detail: { marginTop: 3, color: '#777168', fontSize: 10, lineHeight: 15, fontWeight: '700' },
  board: {
    width: '100%',
    maxWidth: 390,
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#191816',
    backgroundColor: '#FCFBF7',
  },
  cell: {
    width: `${100 / GRID}%`,
    height: `${100 / GRID}%`,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#D8D4CB',
  },
  trailCell: { backgroundColor: '#ECE8DF' },
  wallCell: { backgroundColor: '#2D2A26' },
  exitCell: { backgroundColor: '#E7E2D8' },
  ninja: { position: 'absolute', width: '46%', aspectRatio: 1, borderRadius: 999 },
  playerNinja: { backgroundColor: '#161513' },
  shadowNinja: { backgroundColor: '#6B655E' },
  scroll: { color: '#B23A32', fontSize: 18, fontWeight: '900' },
  exitText: { color: '#191816', fontSize: 14, fontWeight: '900' },
  statsRow: { width: '100%', maxWidth: 390, minHeight: 52, marginTop: 10, flexDirection: 'row', alignItems: 'center' },
  centerStat: { marginLeft: 18 },
  statLabel: { color: '#817B72', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  statValue: { color: '#191816', fontSize: 20, fontWeight: '900' },
  messageBox: { flex: 1, marginLeft: 18, alignItems: 'flex-end' },
  message: { color: '#5F5A53', textAlign: 'right', fontSize: 10, lineHeight: 14, fontWeight: '800' },
  controls: { marginTop: 4, alignItems: 'center', gap: 7 },
  controlMiddle: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  control: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBC6BC',
  },
  controlUp: {},
  controlText: { color: '#191816', fontSize: 20, fontWeight: '900' },
  resetButton: {
    minWidth: 78,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accent,
  },
  resetText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  stateBanner: { width: '100%', maxWidth: 390, marginTop: 8, alignItems: 'center' },
  stateText: { color: '#B23A32', fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  stateSub: { marginTop: 2, color: '#817B72', fontSize: 9, fontWeight: '700' },
});
