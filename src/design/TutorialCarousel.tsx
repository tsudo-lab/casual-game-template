import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TutorialSlide } from '../config/game';
import { palette } from '../ui/theme';

interface Props {
  backLabel: string;
  nextLabel: string;
  playLabel: string;
  slides: readonly TutorialSlide[];
  onComplete: () => void;
}

export function TutorialCarousel({ backLabel, nextLabel, playLabel, slides, onComplete }: Props) {
  const [page, setPage] = useState(0);
  const safeSlides = slides.length > 0 ? slides : [{ title: 'HOW TO PLAY', body: '' }];
  const slide = safeSlides[Math.min(page, safeSlides.length - 1)];
  const lastPage = page === safeSlides.length - 1;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.howTo}>HOW TO PLAY</Text>
        <Text style={styles.pageCount}>{page + 1} / {safeSlides.length}</Text>
      </View>

      <View style={styles.content}>
        {slide.eyebrow ? <Text style={styles.eyebrow}>{slide.eyebrow}</Text> : null}
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      <View style={styles.pagination}>
        {safeSlides.map((_, index) => (
          <View key={index} style={[styles.dot, index === page && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.actions}>
        {page > 0 ? (
          <Pressable style={styles.secondaryButton} onPress={() => setPage((current) => current - 1)} accessibilityRole="button">
            <Text style={styles.secondaryText}>{backLabel}</Text>
          </Pressable>
        ) : <View style={styles.secondaryPlaceholder} />}

        <Pressable
          style={styles.primaryButton}
          onPress={() => lastPage ? onComplete() : setPage((current) => current + 1)}
          accessibilityRole="button"
        >
          <Text style={styles.primaryText}>{lastPage ? playLabel : nextLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', maxWidth: 360, minHeight: 390, padding: 24, borderRadius: 24, backgroundColor: palette.card },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  howTo: { color: palette.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  pageCount: { color: palette.muted, fontSize: 10, fontWeight: '800', fontVariant: ['tabular-nums'] },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  eyebrow: { color: palette.accent, textAlign: 'center', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  title: { marginTop: 10, color: palette.ink, textAlign: 'center', fontSize: 24, lineHeight: 30, fontWeight: '900' },
  body: { marginTop: 18, color: palette.ink, textAlign: 'center', fontSize: 15, lineHeight: 23, fontWeight: '700' },
  pagination: { height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.faint },
  dotActive: { width: 22, backgroundColor: palette.accent },
  actions: { marginTop: 8, flexDirection: 'row', gap: 10 },
  secondaryPlaceholder: { flex: 1 },
  secondaryButton: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: palette.faint, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.white },
  secondaryText: { color: palette.ink, fontSize: 13, fontWeight: '900' },
  primaryButton: { flex: 1.35, minHeight: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.accent },
  primaryText: { color: palette.white, fontSize: 13, fontWeight: '900' },
});
