export type AppLanguage = 'ja' | 'en';

export interface TutorialSlide {
  eyebrow?: string;
  title: string;
  body: string;
}

export const GAME_META = {
  id: 'replace-me',
  title: 'NEW GAME',
  subtitle: {
    ja: 'ゲーム固有の一言コピー',
    en: 'One-line game hook',
  },
  tutorialSlides: {
    ja: [
      {
        eyebrow: 'STEP 1',
        title: '最初の操作を説明する',
        body: '最初の数秒で必要な操作だけを書く。',
      },
      {
        eyebrow: 'STEP 2',
        title: '成立条件を説明する',
        body: '成功条件やゲームの目的を短く説明する。',
      },
      {
        eyebrow: 'STEP 3',
        title: '記録更新のコツを説明する',
        body: '連鎖・倍率・失敗条件など、もう一度遊びたくなる要素を書く。',
      },
    ],
    en: [
      {
        eyebrow: 'STEP 1',
        title: 'EXPLAIN THE FIRST ACTION',
        body: 'Describe only the action the player needs in the first few seconds.',
      },
      {
        eyebrow: 'STEP 2',
        title: 'EXPLAIN THE GOAL',
        body: 'Describe the success condition and the objective in one short step.',
      },
      {
        eyebrow: 'STEP 3',
        title: 'EXPLAIN THE SCORE CHASE',
        body: 'Describe chains, multipliers, failure conditions, or the main replay hook.',
      },
    ],
  } satisfies Record<AppLanguage, TutorialSlide[]>,
  scoreLabel: {
    ja: 'スコア',
    en: 'SCORE',
  },
  shareUrl: 'https://example.com/replace-me',
  shareMessage: {
    ja: (score: number) => `NEW GAMEで${score.toLocaleString()}点！`,
    en: (score: number) => `I scored ${score.toLocaleString()} in NEW GAME!`,
  },
} as const;

export const COMMON_COPY = {
  ja: {
    play: 'ゲーム開始',
    best: 'BEST',
    settings: '設定',
    back: '戻る',
    next: '次へ',
    retry: 'もう一回',
    share: 'シェア',
    home: 'ホーム',
    gameOver: 'GAME OVER',
    newBest: 'NEW BEST!',
    haptics: '振動',
    language: '言語',
    privacy: 'プライバシー',
    howTo: '遊び方',
    exit: {
      title: 'ゲームをどうしますか？',
      description: '現在のプレイを中断します。',
      home: 'ホームへ戻る',
      restart: '最初からやり直す',
      resume: 'ゲームを続ける',
    },
  },
  en: {
    play: 'PLAY',
    best: 'BEST',
    settings: 'Settings',
    back: 'Back',
    next: 'Next',
    retry: 'Retry',
    share: 'Share',
    home: 'Home',
    gameOver: 'GAME OVER',
    newBest: 'NEW BEST!',
    haptics: 'Haptics',
    language: 'Language',
    privacy: 'Privacy',
    howTo: 'How to play',
    exit: {
      title: 'WHAT DO YOU WANT TO DO?',
      description: 'Your current run is paused while this menu is open.',
      home: 'BACK TO HOME',
      restart: 'RESTART FROM THE BEGINNING',
      resume: 'CONTINUE GAME',
    },
  },
} as const;
