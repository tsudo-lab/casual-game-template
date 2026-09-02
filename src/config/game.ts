export type AppLanguage = 'ja' | 'en';

export interface TutorialSlide {
  eyebrow?: string;
  title: string;
  body: string;
}

export const GAME_META = {
  id: 'kage-prototype',
  title: 'KAGE',
  subtitle: {
    ja: '過去の自分が、未来の自分を追い詰める。',
    en: 'Your past self closes in on your future.',
  },
  tutorialSlides: {
    ja: [
      {
        eyebrow: 'STEP 1',
        title: '3案を切り替えて遊ぶ',
        body: 'TRACE / CHAIN / MISSION のタブを切り替えて、同じ操作感で比較します。',
      },
      {
        eyebrow: 'STEP 2',
        title: '影分身は過去の自分',
        body: '数手前の自分の位置が影分身として残ります。過去の選択が次の判断を難しくします。',
      },
      {
        eyebrow: 'STEP 3',
        title: '一番もう一回したい案を選ぶ',
        body: 'ルール説明の分かりやすさより、実際に触ってまた遊びたくなる案を優先します。',
      },
    ],
    en: [
      {
        eyebrow: 'STEP 1',
        title: 'PLAY ALL THREE',
        body: 'Switch between TRACE, CHAIN and MISSION with the same controls.',
      },
      {
        eyebrow: 'STEP 2',
        title: 'SHADOWS ARE YOUR PAST',
        body: 'Your previous positions return as shadows and constrain your next move.',
      },
      {
        eyebrow: 'STEP 3',
        title: 'PICK THE REPLAYABLE ONE',
        body: 'Choose the version that makes you want another run, not just the easiest one to explain.',
      },
    ],
  } satisfies Record<AppLanguage, TutorialSlide[]>,
  scoreLabel: {
    ja: 'スコア',
    en: 'SCORE',
  },
  shareUrl: 'https://tsudo-lab.com',
  shareMessage: {
    ja: (score: number) => `KAGEで${score.toLocaleString()}点！`,
    en: (score: number) => `I scored ${score.toLocaleString()} in KAGE!`,
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
