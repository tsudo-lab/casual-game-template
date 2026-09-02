import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, Share, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { AppLanguage, GAME_META } from '../config/game';
import { GameVisual } from '../design/GameVisual';
import { GameView } from '../game/GameView';
import { GameResult } from '../game/types';
import adMobService from '../services/adMob';
import { markInterstitialShown, recordCompletedRunForAds, shouldShowInterstitial } from '../storage/adCadenceStorage';
import { HighScoreRecord, loadHighScore, saveHighScore } from '../storage/highScoreStorage';
import { hasSeenTutorial, markTutorialSeen } from '../storage/tutorialStorage';

interface Props {
  language: AppLanguage;
  hapticsEnabled: boolean;
  onHome: () => void;
}

type TutorialState = 'loading' | 'visible' | 'hidden';

/**
 * Common play-session controller.
 *
 * Keep persistence, ads, retry, sharing, tutorial lifecycle and exit behavior
 * here. Visual layout belongs in design/GameVisual.tsx and game mechanics in
 * game/GameView.tsx.
 */
export function GameScreen({ language, hapticsEnabled, onHome }: Props) {
  const [runId, setRunId] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [best, setBest] = useState<HighScoreRecord | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [tutorial, setTutorial] = useState<TutorialState>('loading');
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);
  const shareCardRef = useRef<View>(null);

  useEffect(() => {
    void loadHighScore().then(setBest);
    void hasSeenTutorial().then((seen) => setTutorial(seen ? 'hidden' : 'visible'));
  }, []);

  const finishRun = useCallback((next: GameResult) => {
    setResult((current) => {
      if (current) return current;
      setScore(next.score);
      const newBest = next.score > (best?.score ?? 0);
      setIsNewBest(newBest);
      void saveHighScore(next.score).then(setBest);
      void recordCompletedRunForAds();
      if (hapticsEnabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return next;
    });
  }, [best?.score, hapticsEnabled]);

  const resetRun = useCallback(() => {
    setScore(0);
    setResult(null);
    setIsNewBest(false);
    setRunId((value) => value + 1);
  }, []);

  const restart = useCallback(async () => {
    if (isRestarting) return;
    setIsRestarting(true);
    try {
      if (await shouldShowInterstitial()) {
        const shown = await adMobService.showInterstitialIfReady();
        if (shown) await markInterstitialShown();
      }
      resetRun();
    } finally {
      setIsRestarting(false);
    }
  }, [isRestarting, resetRun]);

  const closeTutorial = useCallback(() => {
    setTutorial('hidden');
    void markTutorialSeen();
  }, []);

  const requestHome = useCallback(() => {
    if (result) {
      onHome();
      return;
    }
    setExitConfirmVisible(true);
  }, [onHome, result]);

  const confirmHome = useCallback(() => {
    setExitConfirmVisible(false);
    onHome();
  }, [onHome]);

  const restartFromExit = useCallback(() => {
    setExitConfirmVisible(false);
    if (result) {
      void restart();
      return;
    }
    resetRun();
  }, [resetRun, restart, result]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (tutorial === 'visible') {
        closeTutorial();
        return true;
      }
      if (exitConfirmVisible) {
        setExitConfirmVisible(false);
        return true;
      }
      if (result) {
        onHome();
        return true;
      }
      setExitConfirmVisible(true);
      return true;
    });

    return () => subscription.remove();
  }, [closeTutorial, exitConfirmVisible, onHome, result, tutorial]);

  const shareResult = async () => {
    if (!result || isSharing) return;
    setIsSharing(true);
    const baseMessage = GAME_META.shareMessage[language](result.score);
    const message = GAME_META.shareUrl ? `${baseMessage}\n\n${GAME_META.shareUrl}` : baseMessage;
    try {
      if (Platform.OS !== 'web' && shareCardRef.current) {
        // Native-only modules are loaded lazily so the Web prototype can boot
        // without evaluating native bindings from react-native-share/view-shot.
        const [{ captureRef }, { default: NativeShare }] = await Promise.all([
          import('react-native-view-shot'),
          import('react-native-share'),
        ]);
        const uri = await captureRef(shareCardRef, { format: 'png', quality: 1, result: 'tmpfile' });
        await NativeShare.open({
          title: GAME_META.title,
          message,
          url: uri,
          type: 'image/png',
          failOnCancel: false,
        });
      } else {
        await Share.share({ message, title: GAME_META.title });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <GameVisual
      language={language}
      score={score}
      bestScore={best?.score ?? 0}
      result={result}
      isNewBest={isNewBest}
      isSharing={isSharing}
      isRestarting={isRestarting}
      tutorialVisible={tutorial === 'visible'}
      exitConfirmVisible={exitConfirmVisible}
      shareCardRef={shareCardRef}
      onRequestHome={requestHome}
      onConfirmHome={confirmHome}
      onRestartFromExit={restartFromExit}
      onResumeGame={() => setExitConfirmVisible(false)}
      onOpenTutorial={() => setTutorial('visible')}
      onCloseTutorial={closeTutorial}
      onShare={shareResult}
      onRetry={restart}
      gameContent={(
        <GameView
          key={runId}
          runId={runId}
          hapticsEnabled={hapticsEnabled}
          language={language}
          onScoreChange={setScore}
          onRunEnd={finishRun}
        />
      )}
    />
  );
}
