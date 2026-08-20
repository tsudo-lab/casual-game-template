import { useCallback, useEffect, useState } from 'react';

import { AppLanguage } from '../config/game';
import { HomeVisual } from '../design/HomeVisual';
import { loadHighScore } from '../storage/highScoreStorage';

interface Props {
  language: AppLanguage;
  onPlay: () => void;
  onSettings: () => void;
}

/** Common home-screen behavior. Title-specific presentation lives in design/HomeVisual.tsx. */
export function HomeScreen({ language, onPlay, onSettings }: Props) {
  const [best, setBest] = useState(0);
  const refresh = useCallback(() => {
    void loadHighScore().then((record) => setBest(record?.score ?? 0));
  }, []);

  useEffect(refresh, [refresh]);

  return (
    <HomeVisual
      language={language}
      bestScore={best}
      onPlay={onPlay}
      onSettings={onSettings}
    />
  );
}
