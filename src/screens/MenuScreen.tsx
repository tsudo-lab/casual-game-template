import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppLanguage, COMMON_COPY, GAME_META } from '../config/game';
import { useResponsiveLayout } from '../ui/layout';
import { layout, palette } from '../ui/theme';

interface FrameProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

function Frame({ title, onBack, children }: FrameProps) {
  const responsive = useResponsiveLayout();
  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.shell, { width: responsive.shellWidth, padding: responsive.shellPadding }]}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={onBack}><Text style={styles.backText}>←</Text></Pressable>
            <View>
              <Text style={styles.eyebrow}>{GAME_META.title}</Text>
              <Text style={styles.title}>{title}</Text>
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface SettingsProps {
  language: AppLanguage;
  hapticsEnabled: boolean;
  showAdPrivacy: boolean;
  onBack: () => void;
  onChangeLanguage: (language: AppLanguage) => void;
  onToggleHaptics: () => void;
  onPrivacy: () => void;
  onAdPrivacy: () => void;
}

export function SettingsScreen({ language, hapticsEnabled, showAdPrivacy, onBack, onChangeLanguage, onToggleHaptics, onPrivacy, onAdPrivacy }: SettingsProps) {
  const copy = COMMON_COPY[language];
  return (
    <Frame title={copy.settings} onBack={onBack}>
      <View style={styles.sheet}>
        <Pressable style={styles.row} onPress={onToggleHaptics}>
          <Text style={styles.rowLabel}>{copy.haptics}</Text>
          <View style={[styles.toggle, !hapticsEnabled && styles.toggleOff]}>
            <View style={[styles.knob, !hapticsEnabled && styles.knobOff]} />
          </View>
        </Pressable>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{copy.language}</Text>
          <View style={styles.segment}>
            {(['ja', 'en'] as const).map((option) => (
              <Pressable key={option} style={[styles.segmentButton, language === option && styles.segmentActive]} onPress={() => onChangeLanguage(option)}>
                <Text style={[styles.segmentText, language === option && styles.segmentTextActive]}>{option === 'ja' ? '日本語' : 'English'}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <Pressable style={styles.link} onPress={onPrivacy}><Text style={styles.rowLabel}>{copy.privacy}</Text><Text style={styles.chevron}>›</Text></Pressable>
      {showAdPrivacy ? <Pressable style={styles.link} onPress={onAdPrivacy}><Text style={styles.rowLabel}>Ad privacy</Text><Text style={styles.chevron}>›</Text></Pressable> : null}
    </Frame>
  );
}

interface PrivacyProps { language: AppLanguage; onBack: () => void; }

export function PrivacyScreen({ language, onBack }: PrivacyProps) {
  const copy = COMMON_COPY[language];
  return (
    <Frame title={copy.privacy} onBack={onBack}>
      <View style={styles.privacyCard}>
        <Text style={styles.privacyTitle}>{language === 'ja' ? 'テンプレート用プライバシー文面' : 'Template privacy copy'}</Text>
        <Text style={styles.privacyBody}>{language === 'ja'
          ? '新しいゲームを作るときは、広告・端末内保存・共有機能・分析SDKなど実際に使う機能に合わせて、この画面と公開プライバシーポリシーを必ず更新してください。'
          : 'Before release, replace this text and the public privacy policy so they match the ads, local storage, sharing, analytics, and other SDKs actually used by the game.'}</Text>
      </View>
    </Frame>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', backgroundColor: palette.paper },
  shell: { flex: 1, padding: layout.side },
  card: { flex: 1, overflow: 'hidden', borderRadius: layout.radius, borderWidth: 1, borderColor: palette.faint, backgroundColor: palette.card },
  header: { height: 92, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: palette.faint },
  backButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.faint, backgroundColor: palette.white },
  backText: { color: palette.ink, fontSize: 22, fontWeight: '700' },
  eyebrow: { color: palette.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  title: { marginTop: 2, color: palette.ink, fontSize: 24, fontWeight: '900' },
  content: { padding: 18, gap: 16 },
  sheet: { overflow: 'hidden', borderRadius: 18, borderWidth: 1, borderColor: palette.faint, backgroundColor: palette.white },
  row: { minHeight: 68, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: palette.faint },
  rowLabel: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  toggle: { width: 46, height: 28, padding: 3, borderRadius: 14, alignItems: 'flex-end', backgroundColor: palette.accent },
  toggleOff: { alignItems: 'flex-start', backgroundColor: palette.faint },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: palette.white },
  knobOff: {},
  segment: { flexDirection: 'row', padding: 3, borderRadius: 12, backgroundColor: palette.paper },
  segmentButton: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 9 },
  segmentActive: { backgroundColor: palette.ink },
  segmentText: { color: palette.muted, fontSize: 11, fontWeight: '800' },
  segmentTextActive: { color: palette.white },
  link: { minHeight: 60, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, borderWidth: 1, borderColor: palette.faint, backgroundColor: palette.white },
  chevron: { color: palette.muted, fontSize: 26 },
  privacyCard: { padding: 20, borderRadius: 18, borderWidth: 1, borderColor: palette.faint, backgroundColor: palette.white },
  privacyTitle: { color: palette.ink, fontSize: 17, fontWeight: '900' },
  privacyBody: { marginTop: 12, color: palette.muted, fontSize: 13, lineHeight: 21, fontWeight: '600' },
});
