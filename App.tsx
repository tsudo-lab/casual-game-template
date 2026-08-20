import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppLanguage } from './src/config/game';
import { GameScreen } from './src/screens/GameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { PrivacyScreen, SettingsScreen } from './src/screens/MenuScreen';
import adMobService from './src/services/adMob';
import { loadHapticsEnabled, loadLanguage, saveHapticsEnabled, saveLanguage } from './src/storage/settingsStorage';

type Screen = 'home' | 'game' | 'settings' | 'privacy';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [language, setLanguage] = useState<AppLanguage>('ja');
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [adPrivacyRequired, setAdPrivacyRequired] = useState(false);

  useEffect(() => {
    void loadLanguage().then(setLanguage);
    void loadHapticsEnabled().then(setHapticsEnabled);
    void adMobService.initialize().then(() => setAdPrivacyRequired(adMobService.isPrivacyOptionsRequired()));
  }, []);

  const changeLanguage = (next: AppLanguage) => {
    setLanguage(next);
    void saveLanguage(next);
  };

  const toggleHaptics = () => {
    setHapticsEnabled((current) => {
      const next = !current;
      void saveHapticsEnabled(next);
      return next;
    });
  };

  const openAdPrivacy = async () => {
    const shown = await adMobService.showPrivacyOptionsForm();
    setAdPrivacyRequired(adMobService.isPrivacyOptionsRequired());
    if (!shown) Alert.alert('Ad privacy', language === 'ja' ? '現在は表示できません。' : 'Privacy options are not available right now.');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {screen === 'home' ? <HomeScreen language={language} onPlay={() => setScreen('game')} onSettings={() => setScreen('settings')} /> : null}
      {screen === 'game' ? <GameScreen language={language} hapticsEnabled={hapticsEnabled} onHome={() => setScreen('home')} /> : null}
      {screen === 'settings' ? (
        <SettingsScreen
          language={language}
          hapticsEnabled={hapticsEnabled}
          showAdPrivacy={adPrivacyRequired}
          onBack={() => setScreen('home')}
          onChangeLanguage={changeLanguage}
          onToggleHaptics={toggleHaptics}
          onPrivacy={() => setScreen('privacy')}
          onAdPrivacy={openAdPrivacy}
        />
      ) : null}
      {screen === 'privacy' ? <PrivacyScreen language={language} onBack={() => setScreen('settings')} /> : null}
    </SafeAreaProvider>
  );
}
