import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Share, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

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
 * Keep persistence, ads, retry, sharing and tutorial lifecycle here. Visual
 * layout belongs in design/GameVisual.tsx and game mechanics in game/GameView.tsx.
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

  const restart = async () => {
    if (isRestarting) return;
    setIsRestarting(true);
    try {
      if (await shouldShowInterstitial()) {
        const shown = await adMobService.showInterstitialIfReady();
        if (shown) await markInterstitialShown();
      }
      setScore(0);
      setResult(null);
      setIsNewBest(false);
      setRunId((value) => value + 1);
    } finally {
      setIsRestarting(false);
    }
  };

  const shareResult = async () => {
    if (!result || isSharing) return;
    setIsSharing(true);
    try {
      const message = GAME_META.shareMessage[language](result.score);
      if (Platform.OS !== 'web' && shareCardRef.current && await Sharing.isAvailableAsync()) {
        const uri = await captureRef(shareCardRef, { format: 'png', quality: 1, result: 'tmpfile' });
        await Sharing.shareAsync(uri, { dialogTitle: GAME_META.title, mimeType: 'image/png', UTI: 'public.png' });
      } else {
        await Share.share({ message, title: GAME_META.title });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const closeTutorial = () => {
    setTutorial('hidden');
    void markTutorialSeen();
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
      shareCardRef={shareCardRef}
      onHome={onHome}
      onCloseTutorial={closeTutorial}
      onShare={shareResult}
      onRetry={restart}
      gameContent={(
        <GameView
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
