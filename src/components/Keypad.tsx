import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onScientific: (fn: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  isScientificExpanded: boolean;
  toggleScientific: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onOperator,
  onScientific,
  onClear,
  onBackspace,
  onEquals,
  isScientificExpanded,
  toggleScientific,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Scientific Toggle */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          onClick={toggleScientific}
          className="text-xs px-3.5 py-1.5 rounded-lg border border-sunset-amber/40 bg-sunset-card hover:bg-sunset-surface text-sunset-gold hover:border-sunset-gold transition font-medium flex items-center gap-1.5 shadow-sm"
        >
          <span>{isScientificExpanded ? '▲ Compact Mode' : '▼ Scientific Mode'}</span>
        </button>

        <span className="text-[11px] font-mono text-sunset-peach/60">
          Retro Synthpad
        </span>
      </div>

      {/* Scientific Function Grid (Collapsible/Expandable) */}
      {isScientificExpanded && (
        <div className="grid grid-cols-5 gap-2 p-3 rounded-xl bg-sunset-surface/80 border border-sunset-border shadow-inner animate-fade-in">
          {[
            { label: 'sin', val: 'sin(' },
            { label: 'cos', val: 'cos(' },
            { label: 'tan', val: 'tan(' },
            { label: 'π', val: 'π' },
            { label: 'e', val: 'e' },
            { label: 'ln', val: 'log(' },
            { label: 'log', val: 'log10(' },
            { label: '√', val: 'sqrt(' },
            { label: 'xʸ', val: '^' },
            { label: 'x!', val: '!' },
            { label: '(', val: '(' },
            { label: ')', val: ')' },
            { label: 'abs', val: 'abs(' },
            { label: '%', val: '%' },
            { label: '1/x', val: '^(-1)' },
          ].map((fn) => (
            <button
              key={fn.label}
              onClick={() => onScientific(fn.val)}
              className="btn-key py-2 rounded-lg bg-sunset-card hover:bg-sunset-sky/40 border border-sunset-border hover:border-sunset-coral/50 text-sunset-peach font-mono text-xs font-semibold shadow-sm transition"
            >
              {fn.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Standard Keypad Grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* Row 1 */}
        <button
          onClick={onClear}
          className="btn-key py-3.5 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 text-red-200 font-bold text-base transition flex items-center justify-center gap-1 shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>AC</span>
        </button>

        <button
          onClick={onBackspace}
          className="btn-key py-3.5 rounded-xl bg-sunset-surface/90 hover:bg-sunset-border border border-white/5 text-sunset-peach font-bold text-base transition flex items-center justify-center shadow-sm"
        >
          <Delete className="w-5 h-5" />
        </button>

        <button
          onClick={() => onOperator('%')}
          className="btn-key py-3.5 rounded-xl bg-sunset-surface/90 hover:bg-sunset-border border border-white/5 text-sunset-cyan font-mono font-bold text-lg transition shadow-sm"
        >
          %
        </button>

        <button
          onClick={() => onOperator('÷')}
          className="btn-key py-3.5 rounded-xl bg-gradient-to-br from-amber-600/40 to-sunset-amber/50 hover:from-amber-600/60 hover:to-sunset-amber/70 border border-sunset-amber/60 text-sunset-gold font-mono font-bold text-2xl transition shadow-sm"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => onDigit('7')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-semibold text-xl transition shadow-sm"
        >
          7
        </button>
        <button
          onClick={() => onDigit('8')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-semibold text-xl transition shadow-sm"
        >
          8
        </button>
        <button
          onClick={() => onDigit('9')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-semibold text-xl transition shadow-sm"
        >
          9
        </button>
        <button
          onClick={() => onOperator('×')}
          className="btn-key py-3.5 rounded-xl bg-gradient-to-br from-amber-600/40 to-sunset-amber/50 hover:from-amber-600/60 hover:to-sunset-amber/70 border border-sunset-amber/60 text-sunset-gold font-mono font-bold text-2xl transition shadow-sm"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => onDigit('4')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-semibold text-xl transition shadow-sm"
        >
          4
        </button>
        <button
          onClick={() => onDigit('5')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-semibold text-xl transition shadow-sm"
        >
          5
        </button>
        <button
          onClick={() => onDigit('6')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-semibold text-xl transition shadow-sm"
        >
          6
        </button>
        <button
          onClick={() => onOperator('−')}
          className="btn-key py-3.5 rounded-xl bg-gradient-to-br from-amber-600/40 to-sunset-amber/50 hover:from-amber-600/60 hover:to-sunset-amber/70 border border-sunset-amber/60 text-sunset-gold font-mono font-bold text-2xl transition shadow-sm"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          onClick={() => onDigit('1')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-semibold text-xl transition shadow-sm"
        >
          1
        </button>
        <button
          onClick={() => onDigit('2')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-semibold text-xl transition shadow-sm"
        >
          2
        </button>
        <button
          onClick={() => onDigit('3')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-semibold text-xl transition shadow-sm"
        >
          3
        </button>
        <button
          onClick={() => onOperator('+')}
          className="btn-key py-3.5 rounded-xl bg-gradient-to-br from-amber-600/40 to-sunset-amber/50 hover:from-amber-600/60 hover:to-sunset-amber/70 border border-sunset-amber/60 text-sunset-gold font-mono font-bold text-2xl transition shadow-sm"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => onDigit('0')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-semibold text-xl transition col-span-2 shadow-sm"
        >
          0
        </button>
        <button
          onClick={() => onDigit('.')}
          className="btn-key py-3.5 rounded-xl bg-sunset-card hover:bg-sunset-surface border border-white/5 text-slate-100 font-mono font-bold text-xl transition shadow-sm"
        >
          .
        </button>
        <button
          onClick={onEquals}
          className="btn-key py-3.5 rounded-xl bg-gradient-to-r from-sunset-amber via-sunset-coral to-sunset-sky hover:brightness-110 border border-sunset-peach/50 text-white font-mono font-bold text-2xl shadow-lg shadow-sunset-coral/30 transition"
        >
          =
        </button>
      </div>
    </div>
  );
};
