import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import { EASTER_EGGS } from '../data/roasts';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestInput: (code: string) => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({
  isOpen,
  onClose,
  onTestInput,
}) => {
  if (!isOpen) return null;

  // Filter unique keys to display
  const secretEntries = Object.entries(EASTER_EGGS).filter(
    ([key]) => !['1+1', '2+2', '0+0'].includes(key)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-sunset-card border border-sunset-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-sunset-border flex items-center justify-between bg-sunset-dark/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sunset-gold" />
            <h2 className="font-bold text-sunset-peach text-base">Classified Easter Eggs 🤫</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-sunset-surface text-sunset-peach/70 hover:text-white transition text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          <p className="text-xs text-sunset-peach/70 mb-3">
            Hidden inputs that trigger special sarcastic reactions from Mr. SarCalc-tic:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {secretEntries.map(([code, response]) => (
              <div
                key={code}
                onClick={() => {
                  onTestInput(code);
                  onClose();
                }}
                className="group flex flex-col p-2.5 rounded-xl bg-sunset-surface/60 hover:bg-sunset-surface border border-white/5 hover:border-sunset-coral/50 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sunset-gold text-sm group-hover:underline flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-sunset-coral" />
                    {code}
                  </span>
                  <span className="text-[10px] text-sunset-peach/40 uppercase tracking-wider group-hover:text-sunset-peach/80 transition">
                    Insert ↵
                  </span>
                </div>
                <span className="text-xs italic text-sunset-peach/80 mt-1 line-clamp-1">
                  "{response}"
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-sunset-dark/80 border-t border-sunset-border text-center text-[11px] text-sunset-peach/50">
          Click any secret code to paste it into the calculator.
        </div>
      </div>
    </div>
  );
};
