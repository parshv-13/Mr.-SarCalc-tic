import * as math from 'mathjs';
import type { DifficultyLevel } from '../types';

export interface EvaluatedResult {
  answer: string;
  difficulty: DifficultyLevel;
  error?: string;
  isEasterEgg?: boolean;
  easterEggMatch?: string;
}

/**
 * Normalizes expression strings before mathjs parsing
 * Handles × -> *, ÷ -> /, percentages, π, e, deg/rad trig
 */
export function preprocessExpression(expr: string): string {
  return expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√\(/g, 'sqrt(')
    .replace(/√([0-9.]+)/g, 'sqrt($1)');
}

/**
 * Accurately determines difficulty level (1 to 5) based on expression & components
 */
export function evaluateDifficulty(rawExpr: string): DifficultyLevel {
  const expr = rawExpr.trim().toLowerCase();

  // Level 5: Nested advanced formulas, combinations of logs/trig/exponents, calculus/matrix syntax or deep nesting
  const hasNestedParens = /\([^()]*\([^()]*\)/.test(expr);
  const advOpsCount = (expr.match(/(sin|cos|tan|asin|acos|atan|log|ln|sqrt|\^|\!)/g) || []).length;
  
  if (hasNestedParens && advOpsCount >= 2) return 5;
  if (advOpsCount >= 3) return 5;

  // Level 4: Trigonometry, logarithms, exponents, scientific notation, large numbers, factorials
  const hasTrig = /(sin|cos|tan|asin|acos|atan)/i.test(expr);
  const hasLog = /(log|ln)/i.test(expr);
  const hasPower = /\^|pow|exp/.test(expr);
  const hasScientific = /[0-9]+(\.[0-9]+)?e[+-]?[0-9]+/i.test(expr);
  const hasLargeNumbers = /\b\d{6,}\b/.test(expr); // numbers with 6+ digits
  const hasFactorial = /!/.test(expr);

  if (hasTrig || hasLog || hasPower || hasScientific || hasLargeNumbers || hasFactorial) {
    return 4;
  }

  // Level 3: Multi-step arithmetic, multiple percentages, complex decimals, parentheses
  const parensCount = (expr.match(/\(/g) || []).length;
  const operatorMatches = expr.match(/[+\-*/×÷]/g) || [];
  const hasComplexDecimals = /\d+\.\d{3,}/.test(expr);
  const hasPercentage = /%/.test(expr);

  if (operatorMatches.length >= 2 || parensCount > 0 || hasComplexDecimals || (hasPercentage && operatorMatches.length >= 1)) {
    return 3;
  }

  // Level 2 vs Level 1:
  // Examples Level 1: 1 + 1, 2 + 2, 10 - 5, 5 × 5, 100 ÷ 10, 50 + 50, 18 × 100
  // Level 2: 500 ÷ 10, 25% of 200, simple decimals, basic two-step expressions
  if (hasPercentage) return 2;
  if (/\d+\.\d+/.test(expr)) return 2; // contains decimals like 2.5 + 3.1

  // Single operator check
  if (operatorMatches.length === 1) {
    const parts = expr.split(/[+\-*/×÷]/).map(s => s.trim());
    if (parts.length === 2) {
      const num1 = parseFloat(parts[0]);
      const num2 = parseFloat(parts[1]);

      if (!isNaN(num1) && !isNaN(num2)) {
        // Ridiculously easy patterns: single digit arithmetic, multiplying/dividing by 10/100, powers of 10
        if (num1 <= 20 && num2 <= 20) return 1;
        if ((num2 === 10 || num2 === 100 || num1 === 10 || num1 === 100) && (expr.includes('*') || expr.includes('×') || expr.includes('/') || expr.includes('÷'))) return 1;
        if (num1 === num2 && (expr.includes('+') || expr.includes('-'))) return 1; // 50+50, 10-10
        if (num1 <= 100 && num2 <= 100 && (num1 % 10 === 0 && num2 % 10 === 0)) return 1; // 100 - 50, etc
      }
    }
    return 2;
  }

  // If it's just a single number
  if (/^\d+$/.test(expr)) {
    return 1;
  }

  return 2;
}

/**
 * Custom mathjs evaluator with DEG/RAD support and precision formatting
 */
export function evaluateSafeExpression(rawExpr: string, angleMode: 'DEG' | 'RAD' = 'DEG'): EvaluatedResult {
  const trimmed = rawExpr.trim();
  if (!trimmed) {
    return { answer: '0', difficulty: 1 };
  }

  // Check direct division by 0 in string patterns
  if (/\/ *0(?!\d|\.)|÷ *0(?!\d|\.)/.test(trimmed)) {
    // Check if it's 0 / 0
    if (/0 *(\/|÷) *0/.test(trimmed)) {
      return { answer: 'NaN', difficulty: 1, error: '0/0' };
    }
    return { answer: 'Infinity', difficulty: 1, error: 'DIV_BY_ZERO' };
  }

  try {
    // Configure mathjs trigonometry for DEG if selected
    const mathInstance = math.create(math.all);
    
    if (angleMode === 'DEG') {
      const degToRad = (x: number) => (x * Math.PI) / 180;
      const radToDeg = (x: number) => (x * 180) / Math.PI;

      mathInstance.import({
        sin: (x: number) => Math.sin(degToRad(x)),
        cos: (x: number) => Math.cos(degToRad(x)),
        tan: (x: number) => Math.tan(degToRad(x)),
        asin: (x: number) => radToDeg(Math.asin(x)),
        acos: (x: number) => radToDeg(Math.acos(x)),
        atan: (x: number) => radToDeg(Math.atan(x)),
      }, { override: true });
    }

    // Process percentage: e.g., "25% * 200" or "50%" -> / 100
    // Replace standalone % with /100
    let parsedExpr = trimmed
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/(\d+(\.\d+)?)%/g, '($1 / 100)');

    const result = mathInstance.evaluate(parsedExpr);

    if (result === undefined || result === null) {
      throw new Error('Invalid math expression');
    }

    if (typeof result === 'object' && (result as { isComplex?: boolean }).isComplex) {
      return {
        answer: result.toString(),
        difficulty: 4
      };
    }

    const numResult = Number(result);
    if (isNaN(numResult)) {
      return {
        answer: 'NaN',
        difficulty: 1,
        error: '0/0'
      };
    }

    if (!isFinite(numResult)) {
      return {
        answer: numResult > 0 ? 'Infinity' : '-Infinity',
        difficulty: 1,
        error: 'DIV_BY_ZERO'
      };
    }

    // Format number nicely to avoid floating point imprecisions like 0.30000000000000004
    let formattedAnswer = math.format(result, { precision: 12 });
    // Remove quotes if any
    formattedAnswer = formattedAnswer.replace(/"/g, '');

    const difficulty = evaluateDifficulty(rawExpr);

    return {
      answer: formattedAnswer,
      difficulty
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid Math';
    return {
      answer: 'Error',
      difficulty: 1,
      error: errorMsg
    };
  }
}
