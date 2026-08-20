export type AppLanguage = 'ja' | 'en';

export const GAME_META = {
  id: 'replace-me',
  title: 'NEW GAME',
  subtitle: {
    ja: 'ゲーム固有の一言コピー',
    en: 'One-line game hook',
  },
  howTo: {
    ja: 'ここに3秒で理解できる遊び方を書く。',
    en: 'Explain the whole game in one sentence.',
  },
  scoreLabel: {
    ja: 'スコア',
    en: 'SCORE',
  },
  shareMessage: {
    ja: (score: number) => `NEW GAMEで${score.toLocaleString()}点！`,
    en: (score: number) => `I scored ${score.toLocaleString()} in NEW GAME!`,
  },
} as const;

export const COMMON_COPY = {
  ja: {
    play: 'PLAY',
    best: 'BEST',
    settings: '設定',
    back: '戻る',
    retry: 'もう一回',
    share: 'シェア',
    home: 'ホーム',
    gameOver: 'GAME OVER',
    newBest: 'NEW BEST!',
    haptics: '振動',
    language: '言語',
    privacy: 'プライバシー',
    howTo: '遊び方',
  },
  en: {
    play: 'PLAY',
    best: 'BEST',
    settings: 'Settings',
    back: 'Back',
    retry: 'Retry',
    share: 'Share',
    home: 'Home',
    gameOver: 'GAME OVER',
    newBest: 'NEW BEST!',
    haptics: 'Haptics',
    language: 'Language',
    privacy: 'Privacy',
    howTo: 'How to play',
  },
} as const;
