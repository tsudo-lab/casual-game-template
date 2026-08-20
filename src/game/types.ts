import { AppLanguage } from '../config/game';

export interface GameResult {
  score: number;
  shareDetail?: string;
}

export interface GameViewProps {
  runId: number;
  hapticsEnabled: boolean;
  language: AppLanguage;
  onScoreChange: (score: number) => void;
  onRunEnd: (result: GameResult) => void;
}
