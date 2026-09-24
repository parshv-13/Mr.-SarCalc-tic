import {
  LEVEL_1_LINES,
  LEVEL_2_LINES,
  LEVEL_3_LINES,
  LEVEL_4_LINES,
  LEVEL_5_LINES,
  REPEATED_EASY_LINES,
  STREAK_MILESTONES,
  COMEBACK_LINES,
  INVALID_MATH_LINES,
  DIV_ZERO_LINES,
  RANDOM_ONE_LINERS,
  EASTER_EGGS
} from '../data/roasts';
import type { CalculationRecord, DifficultyLevel } from '../types';

/**
 * Returns a random item from an array ensuring it isn't in recentRoasts
 */
function pickRandomExcluding(pool: string[], recentRoasts: string[]): string {
  const filtered = pool.filter(line => !recentRoasts.includes(line));
  const choices = filtered.length > 0 ? filtered : pool;
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

/**
 * AI Hook Architecture:
 * Signature formatted as required:
 * generateRoast(expression, answer, difficulty, streak, history, error)
 * Formatted to allow local fallback or an LLM API override (max 2 sentences).
 */
export function generateRoast(
  expression: string,
  answer: string,
  difficulty: DifficultyLevel,
  streak: number,
  history: CalculationRecord[] = [],
  error?: string
): string {
  // Collect recent roasts from the last 10 calculations to ensure no repetition within 10
  const recentRoasts = history.slice(0, 10).map(h => h.roast);

  const cleanExpr = expression.replace(/\s+/g, ' ').trim();
  const rawNoSpaces = expression.replace(/\s+/g, '');

  // 1. Check Easter Eggs first (by expression or answer)
  if (EASTER_EGGS[cleanExpr]) {
    return EASTER_EGGS[cleanExpr];
  }
  if (EASTER_EGGS[rawNoSpaces]) {
    return EASTER_EGGS[rawNoSpaces];
  }
  if (EASTER_EGGS[answer]) {
    return EASTER_EGGS[answer];
  }

  // 2. Check Invalid / Impossible Math
  if (error) {
    if (error === 'DIV_BY_ZERO' || answer === 'Infinity' || answer === '-Infinity') {
      return pickRandomExcluding(DIV_ZERO_LINES, recentRoasts);
    }
    return pickRandomExcluding(INVALID_MATH_LINES, recentRoasts);
  }

  // 3. Comeback System: User solves a difficult problem (Level 4 or 5) immediately after an easy streak (>= 3)
  const previousStreak = streak; // before reset or from previous history
  const lastCalculation = history[0];
  const hadPreviousEasyStreak = lastCalculation && (lastCalculation.difficulty === 1 || lastCalculation.difficulty === 2) && previousStreak >= 3;
  
  if ((difficulty === 4 || difficulty === 5) && hadPreviousEasyStreak) {
    return pickRandomExcluding(COMEBACK_LINES, recentRoasts);
  }

  // 4. Streak Milestones (consecutive easy calculations at exact thresholds: 3, 5, 7, 10, 15, 20, 25, 50)
  if ((difficulty === 1 || difficulty === 2) && STREAK_MILESTONES[streak]) {
    return STREAK_MILESTONES[streak];
  }

  // 5. Special Repeated Easy Calculations (back-to-back easy)
  // Occurs randomly 45% of the time when streak >= 2 and difficulty <= 2
  if ((difficulty === 1 || difficulty === 2) && streak >= 2) {
    const triggerRepeated = Math.random() < 0.45;
    if (triggerRepeated) {
      return pickRandomExcluding(REPEATED_EASY_LINES, recentRoasts);
    }
  }

  // 6. Random One-Liner (10% chance on successful calculation)
  if (Math.random() < 0.10) {
    return pickRandomExcluding(RANDOM_ONE_LINERS, recentRoasts);
  }

  // 7. Standard 5 Difficulty Levels
  switch (difficulty) {
    case 1:
      return pickRandomExcluding(LEVEL_1_LINES, recentRoasts);
    case 2:
      return pickRandomExcluding(LEVEL_2_LINES, recentRoasts);
    case 3:
      return pickRandomExcluding(LEVEL_3_LINES, recentRoasts);
    case 4:
      return pickRandomExcluding(LEVEL_4_LINES, recentRoasts);
    case 5:
      return pickRandomExcluding(LEVEL_5_LINES, recentRoasts);
    default:
      return pickRandomExcluding(LEVEL_1_LINES, recentRoasts);
  }
}
