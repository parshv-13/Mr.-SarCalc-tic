import React from 'react';
import { Skull, Sparkles, AlertTriangle, Flame, ShieldAlert, Quote } from 'lucide-react';
import type { DifficultyLevel } from '../types';

interface PersonalityPanelProps {
  roast: string;
  difficulty: DifficultyLevel | null;
  isError: boolean;
  totalCalculations: number;
  easyStreak: number;
  brainDamagePercent: number;
  onHealBrain: () => void;
}

export const PersonalityPanel: React.FC<PersonalityPanelProps> = ({
  roast,
  difficulty,
  isError,
  totalCalculations,
  easyStreak,
  brainDamagePercent,
  onHealBrain,
}) => {
  // Determine avatar icon and style
  const getAvatar = () => {
    if (isError) {
      return {
        icon: <AlertTriangle className="w-10 h-10 text-red-400" />,
        bg: 'bg-red-500/20 border-red-500/40',
        label: 'Offended / Disgusted',
      };
    }
    if (difficulty === 5) {
      return {
        icon: <Sparkles className="w-10 h-10 text-sunset-gold" />,
        bg: 'bg-sunset-gold/20 border-sunset-gold/50',
        label: 'Genuinely Impressed',
      };
    }
    if (difficulty === 4) {
      return {
        icon: <Flame className="w-10 h-10 text-sunset-coral" />,
        bg: 'bg-sunset-coral/20 border-sunset-coral/40',
        label: 'Respectful Pause',
      };
    }
    if (easyStreak >= 5) {
      return {
        icon: <Skull className="w-10 h-10 text-sunset-amber animate-bounce" />,
        bg: 'bg-sunset-amber/20 border-sunset-amber/40',
        label: 'Losing Will to Compute',
      };
    }
    return {
      icon: <Skull className="w-10 h-10 text-sunset-peach" />,
      bg: 'bg-sunset-surface border-sunset-border',
      label: 'Judging In Silence',
    };
  };

  const avatar = getAvatar();

  return (
    <div className="glass-sunset rounded-3xl p-6 border border-sunset-border shadow-2xl flex flex-col justify-between h-full relative overflow-hidden">
      {/* Decorative background sun & glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-sunset-amber/20 to-sunset-coral/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-sunset-sky/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header of the Persona */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-sunset-border/60">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${avatar.bg} transition-all duration-300`}>
              {avatar.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-sunset-gold font-sans">
                  Mr. SarCalc-tic
                </h2>
                <span className="w-2 h-2 rounded-full bg-sunset-gold animate-pulse" />
              </div>
              <span className="text-xs font-mono text-sunset-peach/80">
                Status: {avatar.label}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider text-sunset-peach/60">
              Audit Index
            </div>
            <div className="font-mono font-bold text-base text-slate-100">
              #{totalCalculations}
            </div>
          </div>
        </div>

        {/* Large Prominent Speech Bubble */}
        <div className="mt-6 relative">
          <Quote className="w-8 h-8 text-sunset-amber/30 absolute -top-3 -left-2 -z-0" />
          <div className="relative z-10 p-5 rounded-2xl bg-sunset-surface/80 border border-sunset-border/80 shadow-inner">
            <div className="text-[11px] font-mono uppercase tracking-wider text-sunset-coral font-bold mb-1.5 flex items-center gap-1.5">
              <span>Live AI Verdict</span>
              <span className="text-xs">💬</span>
            </div>
            <p className="text-lg sm:text-xl font-medium text-amber-100/95 leading-relaxed italic tracking-wide">
              "{roast}"
            </p>
          </div>
        </div>
      </div>

      {/* Persona Stats Card */}
      <div className="mt-6 pt-5 border-t border-sunset-border/60 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-sunset-surface/60 border border-white/5">
            <div className="text-[11px] text-sunset-peach/70">Mental Fatigue</div>
            <div className="font-mono font-bold text-lg text-sunset-gold mt-0.5">
              {Math.round(brainDamagePercent)}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-sunset-surface/60 border border-white/5">
            <div className="text-[11px] text-sunset-peach/70">Sloth Streak</div>
            <div className="font-mono font-bold text-lg text-sunset-coral mt-0.5">
              {easyStreak} {easyStreak === 1 ? 'eq' : 'eqs'}
            </div>
          </div>
        </div>

        {brainDamagePercent > 0 && (
          <button
            onClick={onHealBrain}
            className="w-full py-2.5 rounded-xl border border-sunset-coral/50 bg-sunset-coral/20 hover:bg-sunset-coral/30 text-sunset-peach hover:text-white text-xs font-semibold tracking-wide transition flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-sunset-coral" />
            <span>Emergency Dignity Restore (Heal Brain)</span>
          </button>
        )}
      </div>
    </div>
  );
};
