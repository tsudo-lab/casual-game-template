import { ReactNode, RefObject } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLanguage, COMMON_COPY, GAME_META } from '../config/game';
import { GameResult } from '../game/types';
import { layout, palette } from '../ui/theme';
import { TutorialCarousel } from './TutorialCarousel';

interface GameVisualProps {
  language: AppLanguage;
  score: number;
  bestScore: number;
  result: GameResult | null;
  isNewBest: boolean;
  isSharing: boolean;
  isRestarting: boolean;
  tutorialVisible: boolean;
  exitConfirmVisible: boolean;
  gameContent: ReactNode;
  shareCardRef: RefObject<View | null>;
  onRequestHome: () => void;
  onConfirmHome: () => void;
  onRestartFromExit: () => void;
  onResumeGame: () => void;
  onOpenTutorial: () => void;
  onCloseTutorial: () => void;
  onShare: () => void;
  onRetry: () => void;
}

/**
 * Title-specific presentation for the play screen.
 *
 * Feel free to replace this component completely for each game. It receives
 * only data/actions from the common controller; ad cadence, persistence,
 * sharing behavior, tutorial lifecycle and exit behavior stay outside this file.
 */
export function GameVisual({
  language,
  score,
  bestScore,
  result,
  isNewBest,
  isSharing,
  isRestarting,
  tutorialVisible,
  exitConfirmVisible,
  gameContent,
  shareCardRef,
  onRequestHome,
  onConfirmHome,
  onRestartFromExit,
  onResumeGame,
  onOpenTutorial,
  onCloseTutorial,
  onShare,
  onRetry,
}: GameVisualProps) {
  const { width } = useWindowDimensions();
  const copy = COMMON_COPY[language];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.shell, { width: Math.min(width, layout.maxWidth) }]}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Pressable style={styles.roundButton} onPress={onRequestHome} accessibilityRole="button" accessibilityLabel={copy.home}>
              <Text style={styles.homeText}>←</Text>
            </Pressable>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>{GAME_META.title}</Text>
              <Text style={styles.subtitle}>{GAME_META.subtitle[language]}</Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>{GAME_META.scoreLabel[language]}</Text>
              <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
              <Text style={styles.bestValue}>{copy.best} {bestScore.toLocaleString()}</Text>
            </View>
            <Pressable style={styles.roundButton} onPress={onOpenTutorial} accessibilityRole="button" accessibilityLabel={copy.howTo}>
              <Text style={styles.helpText}>?</Text>
            </Pressable>
          </View>

          <View style={styles.gameArea} pointerEvents={result || tutorialVisible || exitConfirmVisible ? 'none' : 'auto'}>
            {gameContent}
          </View>

          {tutorialVisible ? (
            <View style={styles.overlay}>
              <TutorialCarousel
                backLabel={copy.back}
                nextLabel={copy.next}
                playLabel={copy.play}
                slides={GAME_META.tutorialSlides[language]}
                onComplete={onCloseTutorial}
              />
            </View>
          ) : null}

          {exitConfirmVisible ? (
            <View style={styles.overlay}>
              <View style={styles.exitCard}>
                <Text style={styles.exitTitle}>{copy.exit.title}</Text>
                <Text style={styles.exitDescription}>{copy.exit.description}</Text>
                <Pressable style={styles.primaryButton} onPress={onConfirmHome} accessibilityRole="button">
                  <Text style={styles.primaryText}>{copy.exit.home}</Text>
                </Pressable>
                <Pressable style={[styles.secondaryButton, styles.exitButtonSpacing]} onPress={onRestartFromExit} accessibilityRole="button">
                  <Text style={styles.secondaryText}>{copy.exit.restart}</Text>
                </Pressable>
                <Pressable style={styles.resumeButton} onPress={onResumeGame} accessibilityRole="button">
                  <Text style={styles.resumeText}>{copy.exit.resume}</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {result ? (
            <View style={styles.overlay}>
              <View style={styles.resultCard}>
                <Text style={styles.overlayEyebrow}>{isNewBest ? copy.newBest : copy.gameOver}</Text>
                <Text style={styles.resultScore}>{result.score.toLocaleString()}</Text>
                {result.shareDetail ? <Text style={styles.detail}>{result.shareDetail}</Text> : null}
                <View style={styles.actions}>
                  <Pressable style={styles.secondaryButton} onPress={onShare} disabled={isSharing}><Text style={styles.secondaryText}>{copy.share}</Text></Pressable>
                  <Pressable style={styles.primaryButton} onPress={onRetry} disabled={isRestarting}><Text style={styles.primaryText}>{copy.retry}</Text></Pressable>
                </View>
                <Pressable onPress={onRequestHome}><Text style={styles.homeLink}>{copy.home}</Text></Pressable>
              </View>
            </View>
          ) : null}

          <View ref={shareCardRef} collapsable={false} style={styles.shareCard} pointerEvents="none">
            <Text style={styles.shareTitle}>{GAME_META.title}</Text>
            <Text style={styles.shareScore}>{(result?.score ?? score).toLocaleString()}</Text>
            <Text style={styles.shareSubtitle}>{GAME_META.subtitle[language]}</Text>
            <Text style={styles.shareUrl}>{GAME_META.shareUrl}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: palette.paper },
  shell: { flex: 1, padding: layout.side },
  card: { flex: 1, overflow: 'hidden', borderRadius: layout.radius, borderWidth: 1, borderColor: palette.faint, backgroundColor: palette.card },
  header: { minHeight: 94, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: palette.faint },
  roundButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.faint, backgroundColor: palette.white },
  homeText: { color: palette.ink, fontSize: 21, fontWeight: '800' },
  helpText: { color: palette.ink, fontSize: 18, fontWeight: '900' },
  titleBlock: { flex: 1 },
  title: { color: palette.ink, fontSize: 22, fontWeight: '900', letterSpacing: -0.7 },
  subtitle: { marginTop: 2, color: palette.muted, fontSize: 8, fontWeight: '700' },
  scoreCard: { minWidth: 78, alignItems: 'flex-end' },
  scoreLabel: { color: palette.muted, fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  scoreValue: { color: palette.ink, fontSize: 21, fontWeight: '900', fontVariant: ['tabular-nums'] },
  bestValue: { color: palette.muted, fontSize: 8, fontWeight: '800' },
  gameArea: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 10, alignItems: 'center', justifyContent: 'center', padding: 26, backgroundColor: 'rgba(47,42,37,0.38)' },
  resultCard: { width: '100%', padding: 24, borderRadius: 24, alignItems: 'center', backgroundColor: palette.card },
  exitCard: { width: '100%', maxWidth: 340, padding: 24, borderRadius: 24, backgroundColor: palette.card },
  exitTitle: { color: palette.ink, textAlign: 'center', fontSize: 24, lineHeight: 30, fontWeight: '900' },
  exitDescription: { marginTop: 8, marginBottom: 20, color: palette.muted, textAlign: 'center', fontSize: 13, lineHeight: 20, fontWeight: '700' },
  exitButtonSpacing: { marginTop: 10 },
  resumeButton: { minHeight: 46, marginTop: 8, alignItems: 'center', justifyContent: 'center' },
  resumeText: { color: palette.accent, fontSize: 14, fontWeight: '900' },
  overlayEyebrow: { color: palette.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  resultScore: { marginTop: 8, color: palette.ink, fontSize: 54, lineHeight: 60, fontWeight: '900', fontVariant: ['tabular-nums'] },
  detail: { marginTop: 6, color: palette.muted, fontSize: 12, fontWeight: '700' },
  actions: { width: '100%', marginTop: 22, flexDirection: 'row', gap: 10 },
  primaryButton: { flex: 1, minHeight: 52, paddingHorizontal: 20, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.accent },
  primaryText: { color: palette.white, fontSize: 15, fontWeight: '900' },
  secondaryButton: { flex: 1, minHeight: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.faint, backgroundColor: palette.white },
  secondaryText: { color: palette.ink, fontSize: 15, fontWeight: '900', textAlign: 'center' },
  homeLink: { marginTop: 18, color: palette.muted, fontSize: 12, fontWeight: '800', textDecorationLine: 'underline' },
  shareCard: { position: 'absolute', left: -2000, top: 0, width: 360, height: 480, padding: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.stage },
  shareTitle: { color: palette.ink, fontSize: 32, fontWeight: '900' },
  shareScore: { marginTop: 28, color: palette.accent, fontSize: 72, fontWeight: '900', fontVariant: ['tabular-nums'] },
  shareSubtitle: { marginTop: 20, color: palette.muted, textAlign: 'center', fontSize: 15, lineHeight: 22, fontWeight: '700' },
  shareUrl: { marginTop: 22, color: palette.muted, fontSize: 11, fontWeight: '800' },
});
