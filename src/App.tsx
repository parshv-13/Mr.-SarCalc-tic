import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  History,
  Calculator as CalcIcon,
  HelpCircle,
} from 'lucide-react';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryModal } from './components/HistoryModal';
import { EasterEggModal } from './components/EasterEggModal';
import { PersonalityPanel } from './components/PersonalityPanel';
import { evaluateSafeExpression } from './utils/mathEngine';
import { generateRoast } from './utils/roastEngine';
import type { CalculationRecord, DifficultyLevel } from './types';

const INITIAL_ROAST = "Go ahead, ask me something. I promise I won't judge (I will).";

export const App: React.FC = () => {
  // State
  const [expression, setExpression] = useState<string>('');
  const [display, setDisplay] = useState<string>('0');
  const [currentRoast, setCurrentRoast] = useState<string>(INITIAL_ROAST);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [easyStreak, setEasyStreak] = useState<number>(0);
  const [totalCalculations, setTotalCalculations] = useState<number>(0);
  const [brainDamagePercent, setBrainDamagePercent] = useState<number>(0);
  const [isError, setIsError] = useState<boolean>(false);
  const [isScientificExpanded, setIsScientificExpanded] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isEasterEggsOpen, setIsEasterEggsOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  // Load persistence from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('sarcalc_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const savedStreak = localStorage.getItem('sarcalc_easy_streak');
      if (savedStreak) setEasyStreak(parseInt(savedStreak, 10) || 0);

      const savedTotal = localStorage.getItem('sarcalc_total_calcs');
      if (savedTotal) setTotalCalculations(parseInt(savedTotal, 10) || 0);

      const savedBrainDamage = localStorage.getItem('sarcalc_brain_damage');
      if (savedBrainDamage) setBrainDamagePercent(parseFloat(savedBrainDamage) || 0);
    } catch {
      // LocalStorage errors ignored
    }
  }, []);

  // Save changes to persistence
  const updatePersistence = (
    newHistory: CalculationRecord[],
    newStreak: number,
    newTotal: number,
    newBrainDamage: number
  ) => {
    setHistory(newHistory);
    setEasyStreak(newStreak);
    setTotalCalculations(newTotal);
    setBrainDamagePercent(newBrainDamage);

    try {
      localStorage.setItem('sarcalc_history', JSON.stringify(newHistory));
      localStorage.setItem('sarcalc_easy_streak', newStreak.toString());
      localStorage.setItem('sarcalc_total_calcs', newTotal.toString());
      localStorage.setItem('sarcalc_brain_damage', newBrainDamage.toString());
    } catch {
      // ignore
    }
  };

  // Input Handlers
  const handleDigit = useCallback((d: string) => {
    setIsError(false);

    if (hasEvaluated) {
      setExpression(d);
      setDisplay(d);
      setHasEvaluated(false);
      return;
    }

    if (display === '0' && d !== '.') {
      setExpression(prev => (prev === '0' ? d : prev + d));
      setDisplay(d);
    } else {
      setExpression(prev => prev + d);
      setDisplay(prev => (prev === '0' ? d : prev + d));
    }
  }, [hasEvaluated, display]);

  const handleOperator = useCallback((op: string) => {
    setIsError(false);

    if (hasEvaluated) {
      setExpression(display + ' ' + op + ' ');
      setDisplay('0');
      setHasEvaluated(false);
      return;
    }

    setExpression(prev => {
      if (!prev) return '0 ' + op + ' ';
      return prev + ' ' + op + ' ';
    });
    setDisplay('0');
  }, [hasEvaluated, display]);

  const handleScientific = useCallback((fn: string) => {
    setIsError(false);

    if (hasEvaluated) {
      setExpression(fn);
      setDisplay('0');
      setHasEvaluated(false);
      return;
    }

    setExpression(prev => prev + fn);
  }, [hasEvaluated]);

  const handleBackspace = useCallback(() => {
    setIsError(false);

    if (hasEvaluated) {
      setExpression('');
      setDisplay('0');
      setHasEvaluated(false);
      return;
    }

    setExpression(prev => prev.slice(0, -1));
    setDisplay(prev => {
      const next = prev.slice(0, -1);
      return next === '' ? '0' : next;
    });
  }, [hasEvaluated]);

  const handleClear = useCallback(() => {
    setExpression('');
    setDisplay('0');
    setIsError(false);
    setHasEvaluated(false);
  }, []);

  // Main Evaluation Logic
  const handleEquals = useCallback(() => {
    const rawExpr = expression || display;
    if (!rawExpr || rawExpr === '0') return;

    // Fixed to DEG mode by default (deg/rad switcher removed as requested)
    const evaluated = evaluateSafeExpression(rawExpr, 'DEG');
    const hasMathError = !!evaluated.error || evaluated.answer === 'Error' || evaluated.answer === 'NaN';

    setIsError(hasMathError);
    setDisplay(evaluated.answer);
    setDifficulty(evaluated.difficulty);
    setHasEvaluated(true);

    // Calculate Streak & Brain Damage Mechanics
    let newStreak = easyStreak;
    let newBrainDamage = brainDamagePercent;

    if (evaluated.difficulty <= 2) {
      newStreak += 1;
      newBrainDamage = Math.min(100, newBrainDamage + 4);
    } else if (evaluated.difficulty >= 4) {
      newStreak = 0;
      newBrainDamage = Math.max(0, newBrainDamage - 25);

      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.8 },
        colors: ['#fb8500', '#f72585', '#ffb703', '#4cc9f0']
      });
    } else {
      newStreak = Math.max(0, newStreak - 1);
    }

    // Generate Roast using AI Hook signature
    const roast = generateRoast(
      rawExpr,
      evaluated.answer,
      evaluated.difficulty,
      newStreak,
      history,
      evaluated.error
    );

    setCurrentRoast(roast);

    // New History Record
    const newRecord: CalculationRecord = {
      id: Math.random().toString(36).substring(2, 9),
      expression: rawExpr,
      answer: evaluated.answer,
      difficulty: evaluated.difficulty,
      roast,
      timestamp: Date.now(),
      isError: hasMathError,
    };

    const updatedHistory = [newRecord, ...history].slice(0, 50);
    const updatedTotal = totalCalculations + 1;

    updatePersistence(updatedHistory, newStreak, updatedTotal, newBrainDamage);
  }, [expression, display, easyStreak, brainDamagePercent, history, totalCalculations]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHistoryOpen || isEasterEggsOpen) {
        if (e.key === 'Escape') {
          setIsHistoryOpen(false);
          setIsEasterEggsOpen(false);
        }
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDigit('.');
      } else if (e.key === '+' || e.key === '-') {
        handleOperator(e.key === '-' ? '−' : '+');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '%') {
        handleOperator('%');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      } else if (e.key === '(' || e.key === ')') {
        handleScientific(e.key);
      } else if (e.key === '^') {
        handleScientific('^');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleScientific, handleEquals, handleBackspace, handleClear, isHistoryOpen, isEasterEggsOpen]);

  // Restore calculation from history
  const handleRestoreRecord = (rec: CalculationRecord) => {
    setExpression(rec.expression);
    setDisplay(rec.answer);
    setDifficulty(rec.difficulty);
    setCurrentRoast(rec.roast);
    setIsError(!!rec.isError);
    setHasEvaluated(true);
  };

  // Wipe history
  const handleClearHistory = () => {
    updatePersistence([], easyStreak, totalCalculations, brainDamagePercent);
  };

  // Reset brain damage
  const handleResetBrain = () => {
    updatePersistence(history, 0, totalCalculations, 0);
    setCurrentRoast("Brain rebooted. Let's see how long that lasts. 💀");
  };

  // Insert secret code from Easter Egg modal
  const handleTestEasterEgg = (code: string) => {
    setExpression(code);
    setDisplay(code);
    setHasEvaluated(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center px-4 py-8 relative retro-scanlines">
      {/* Retro Sunset Horizon Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-t from-sunset-coral/15 via-sunset-amber/15 to-transparent rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between z-20 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sunset-amber via-sunset-coral to-sunset-sky flex items-center justify-center shadow-lg shadow-sunset-coral/30 text-white font-bold">
            <CalcIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-2xl tracking-tight text-sunset-gold flex items-center gap-2">
              <span>Mr. SarCalc-tic</span>
              <span className="text-xl">🧮💀</span>
            </h1>
            <p className="text-xs text-sunset-peach/80">
              The calculator that calculates your answer... and judges you for asking.
            </p>
          </div>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex items-center gap-2">
          {/* Hidden Easter Egg vault modal trigger */}
          <button
            onClick={() => setIsEasterEggsOpen(true)}
            title="Classified Vault (Easter Eggs)"
            className="p-2.5 rounded-xl bg-sunset-surface hover:bg-sunset-border text-sunset-peach/70 hover:text-sunset-gold border border-sunset-border transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* History modal toggle */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            title="View Audit Log of Shame"
            className="p-2.5 rounded-xl bg-sunset-surface hover:bg-sunset-border text-sunset-peach/70 hover:text-sunset-gold border border-sunset-border transition relative"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-sunset-coral text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {history.length > 9 ? '9+' : history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Two-Column Responsive Layout: Calculator on Left, Expanded Personality on Right */}
      <main className="w-full max-w-4xl z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        {/* Left Column: Calculator Screen & Keypad */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Display
            expression={expression}
            display={display}
            difficulty={difficulty}
            easyStreak={easyStreak}
            brainDamagePercent={brainDamagePercent}
            isError={isError}
          />

          <div className="glass-sunset p-4 rounded-2xl border border-sunset-border shadow-2xl">
            <Keypad
              onDigit={handleDigit}
              onOperator={handleOperator}
              onScientific={handleScientific}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onEquals={handleEquals}
              isScientificExpanded={isScientificExpanded}
              toggleScientific={() => setIsScientificExpanded(prev => !prev)}
            />
          </div>
        </div>

        {/* Right Column: Expanded Prominent Mr. SarCalc-tic Speech Bubble & Personality Section */}
        <div className="lg:col-span-5 flex flex-col">
          <PersonalityPanel
            roast={currentRoast}
            difficulty={difficulty}
            isError={isError}
            totalCalculations={totalCalculations}
            easyStreak={easyStreak}
            brainDamagePercent={brainDamagePercent}
            onHealBrain={handleResetBrain}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mt-6 pt-4 border-t border-sunset-border/40 text-center text-xs text-sunset-peach/60 z-20 flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <span>Mathematical Accuracy Guaranteed</span>
          <span>•</span>
          <span>Judgment Guaranteed</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-sunset-peach/40">
          <span>Full keyboard support active (Enter, Esc, 0-9, +, -, *, /, ^)</span>
        </div>
      </footer>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleRestoreRecord}
        onClear={handleClearHistory}
      />

      {/* Easter Egg Vault Modal */}
      <EasterEggModal
        isOpen={isEasterEggsOpen}
        onClose={() => setIsEasterEggsOpen(false)}
        onTestInput={handleTestEasterEgg}
      />
    </div>
  );
};

export default App;
