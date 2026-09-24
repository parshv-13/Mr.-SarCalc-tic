import React from 'react';
import { History, Trash2, ArrowUpRight, Skull, Flame } from 'lucide-react';
import type { CalculationRecord } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationRecord[];
  onSelect: (record: CalculationRecord) => void;
  onClear: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-sunset-card border border-sunset-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-sunset-border flex items-center justify-between bg-sunset-dark/80">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-sunset-gold" />
            <h2 className="font-bold text-sunset-peach text-base">Audit Log of Shame</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sunset-surface text-sunset-gold font-mono">
              {history.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                title="Wipe Evidence"
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-sunset-peach/60 hover:text-red-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-sunset-surface text-sunset-peach/70 hover:text-white transition text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-sunset-peach/40 flex flex-col items-center gap-2">
              <Skull className="w-8 h-8 opacity-40 text-sunset-coral" />
              <p className="text-sm font-medium">No calculations recorded.</p>
              <p className="text-xs text-sunset-peach/30">Your dignity remains miraculously intact.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="group relative p-3 rounded-xl bg-sunset-surface/60 hover:bg-sunset-surface border border-white/5 hover:border-sunset-amber/50 transition cursor-pointer"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-mono text-xs text-sunset-peach/70 break-all">
                    {item.expression} =
                  </span>
                  <span className="text-[10px] text-sunset-peach/50 shrink-0">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono font-bold text-lg text-slate-100 group-hover:text-sunset-gold transition">
                    {item.answer}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    {item.difficulty <= 2 ? (
                      <span className="text-sunset-amber flex items-center gap-0.5">
                        <Skull className="w-3 h-3" /> L{item.difficulty}
                      </span>
                    ) : item.difficulty >= 4 ? (
                      <span className="text-sunset-coral flex items-center gap-0.5">
                        <Flame className="w-3 h-3" /> L{item.difficulty}
                      </span>
                    ) : (
                      <span className="text-sunset-cyan">L{item.difficulty}</span>
                    )}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>

                <div className="mt-2 text-xs italic text-sunset-peach/90 border-t border-sunset-border/50 pt-2">
                  "{item.roast}"
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-sunset-dark/80 border-t border-sunset-border text-center text-[11px] text-sunset-peach/50">
          Click any entry to restore expression & answer to the calculator.
        </div>
      </div>
    </div>
  );
};
