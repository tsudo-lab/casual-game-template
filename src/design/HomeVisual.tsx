import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLanguage, COMMON_COPY, GAME_META } from '../config/game';
import { layout, palette } from '../ui/theme';

interface HomeVisualProps {
  language: AppLanguage;
  bestScore: number;
  onPlay: () => void;
  onSettings: () => void;
}

/**
 * Title-specific home-screen presentation.
 *
 * This component owns layout, art direction, colors, decorative elements and
 * button shapes. The screen controller only supplies data and actions, so a
 * new game can redesign this file freely without touching navigation/storage.
 */
export function HomeVisual({ language, bestScore, onPlay, onSettings }: HomeVisualProps) {
  const { width } = useWindowDimensions();
  const copy = COMMON_COPY[language];
  const heroCopy = GAME_META.tutorialSlides[language][0]?.body ?? GAME_META.subtitle[language];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.shell, { width: Math.min(width, layout.maxWidth) }]}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{GAME_META.title}</Text>
              <Text style={styles.subtitle}>{GAME_META.subtitle[language]}</Text>
            </View>
            <View style={styles.bestCard}>
              <Text style={styles.bestLabel}>{copy.best}</Text>
              <Text style={styles.bestValue}>{bestScore.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroMark}>●</Text>
            <Text style={styles.heroCopy}>{heroCopy}</Text>
          </View>

          <View style={styles.footer}>
            <Pressable style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]} onPress={onSettings}>
              <Text style={styles.smallButtonText}>⚙</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.playButton, pressed && styles.playPressed]} onPress={onPlay}>
              <Text style={styles.playText}>{copy.play}</Text>
            </Pressable>
            <View style={styles.smallSpacer} />
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
  header: { height: 98, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: palette.ink, fontSize: 30, lineHeight: 32, fontWeight: '900', letterSpacing: -1.2 },
  subtitle: { marginTop: 4, maxWidth: 220, color: palette.muted, fontSize: 10, fontWeight: '700' },
  bestCard: { minWidth: 92, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 14, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.faint, alignItems: 'center' },
  bestLabel: { color: palette.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  bestValue: { marginTop: 2, color: palette.ink, fontSize: 20, fontWeight: '900', fontVariant: ['tabular-nums'] },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, backgroundColor: palette.stage },
  heroMark: { color: palette.accent, fontSize: 128, lineHeight: 138 },
  heroCopy: { marginTop: 18, color: palette.ink, textAlign: 'center', fontSize: 16, lineHeight: 23, fontWeight: '800' },
  footer: { height: 104, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  smallButton: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.white, borderWidth: 1, borderColor: palette.faint },
  smallButtonText: { color: palette.ink, fontSize: 22 },
  smallSpacer: { width: 52 },
  playButton: { flex: 1, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.accent },
  playText: { color: palette.white, fontSize: 18, fontWeight: '900', letterSpacing: 1.5 },
  pressed: { opacity: 0.7 },
  playPressed: { backgroundColor: palette.accentPressed, transform: [{ scale: 0.98 }] },
});
