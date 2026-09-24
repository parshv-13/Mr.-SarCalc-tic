export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface CalculationRecord {
  id: string;
  expression: string;
  answer: string;
  difficulty: DifficultyLevel;
  roast: string;
  timestamp: number;
  isError?: boolean;
}

export interface CalculatorState {
  expression: string;
  display: string;
  previousAnswer: string | null;
  history: CalculationRecord[];
  easyStreak: number;
  totalCalculations: number;
  lastDifficulty: DifficultyLevel | null;
  currentRoast: string;
  brainDamagePercent: number; // 0 to 100%
  soundEnabled: boolean;
  angleMode: 'DEG' | 'RAD';
}
