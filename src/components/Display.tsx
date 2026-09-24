import React from 'react';
import { Skull, Sparkles, Flame, ShieldAlert } from 'lucide-react';
import type { DifficultyLevel } from '../types';

interface DisplayProps {
  expression: string;
  display: string;
  difficulty: DifficultyLevel | null;
  easyStreak: number;
  brainDamagePercent: number;
  isError?: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  display,
  difficulty,
  easyStreak,
  brainDamagePercent,
  isError = false,
}) => {
  const getDifficultyBadge = () => {
    if (!difficulty) return null;

    switch (difficulty) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/80 border border-red-500/50 text-red-300">
            <Skull className="w-3 h-3 text-red-400" />
            LVL 1: Ridiculously Easy
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/50 text-amber-300">
            😏 LVL 2: Easy
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 border border-purple-400/50 text-purple-200">
            🧠 LVL 3: Medium
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-950/80 border border-pink-500/50 text-pink-300">
            <Flame className="w-3 h-3 text-pink-400" />
            LVL 4: Hard
          </span>
        );
      case 5:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-600/30 to-pink-600/30 border border-amber-400/60 text-amber-200 animate-pulse">
            <Sparkles className="w-3 h-3 text-gold" />
            💀 LVL 5: Very Hard (Respected)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Brain Damage & Streak Bar */}
      <div className="flex items-center justify-between gap-3 px-1 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-sunset-coral" />
          <span>Brain Damage:</span>
          <span className="font-mono font-bold text-sunset-gold">{Math.round(brainDamagePercent)}%</span>
        </div>
        
        <div className="flex items-center gap-2">
          {easyStreak > 0 && (
            <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold transition-all ${
              easyStreak >= 5 
                ? 'bg-red-500/25 text-red-300 border border-red-500/50 animate-pulse' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              🔥 {easyStreak} Easy Streak
            </span>
          )}
          {getDifficultyBadge()}
        </div>
      </div>

      {/* Progress Bar for Brain Damage */}
      <div className="w-full bg-sunset-dark/90 h-2.5 rounded-full overflow-hidden border border-sunset-border relative shadow-inner">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            brainDamagePercent >= 75
              ? 'bg-gradient-to-r from-amber-500 via-pink-500 to-red-600 animate-pulse'
              : brainDamagePercent >= 40
              ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500'
              : 'bg-gradient-to-r from-sunset-cyan to-sunset-peach'
          }`}
          style={{ width: `${Math.min(100, Math.max(2, brainDamagePercent))}%` }}
        />
      </div>

      {/* Main Screen Glass Panel */}
      <div className="relative glass-sunset rounded-2xl p-5 border border-sunset-border overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-sunset-amber/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-sunset-coral/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Expression trace */}
        <div className="min-h-[1.75rem] text-right font-mono text-sm tracking-wide text-sunset-peach/80 overflow-x-auto whitespace-nowrap scrollbar-none">
          {expression || <span className="opacity-30">0</span>}
        </div>

        {/* Current Value / Result Display */}
        <div className="mt-1 text-right">
          <span
            className={`font-mono font-bold tracking-tight text-4xl sm:text-5xl transition-all block overflow-x-auto whitespace-nowrap scrollbar-none ${
              isError
                ? 'text-red-400 drop-shadow-[0_0_14px_rgba(248,113,113,0.6)]'
                : 'text-amber-100 drop-shadow-[0_0_10px_rgba(251,133,0,0.3)]'
            }`}
          >
            {display}
          </span>
        </div>
      </div>
    </div>
  );
};
