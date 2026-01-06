
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

const Ending: React.FC<{ language: Language, onFinish: () => void }> = ({ language, onFinish }) => {
  const [phase, setPhase] = useState<'PRAYER' | 'ATATURK' | 'FINISH'>('PRAYER');
  const [progress, setProgress] = useState(0);

  // Fix: Move the call to onFinish() to a useEffect to avoid returning 'void' as a ReactNode during render.
  useEffect(() => {
    if (phase === 'FINISH') {
      onFinish();
    }
  }, [phase, onFinish]);

  useEffect(() => {
    if (phase === 'PRAYER') {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            setPhase('ATATURK');
            return 100;
          }
          return p + 1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [phase]);

  return (
    <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      {phase === 'PRAYER' && (
        <div className="text-center p-12 space-y-8 animate-pulse">
            <h2 className="text-4xl font-bold tracking-widest text-blue-400">{language === 'tr' ? 'SON GECE: KURTULUŞ' : 'FINAL NIGHT: SALVATION'}</h2>
            <p className="text-xl text-zinc-400 italic">{language === 'tr' ? "Allah'a dua edip bütün varlıkları yok et..." : "Pray and destroy all entities..."}</p>
            <div className="w-96 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-zinc-600 tracking-tighter">{language === 'tr' ? 'İnanç her şeyin üstesindedir.' : 'Faith overcomes everything.'}</p>
        </div>
      )}

      {phase === 'ATATURK' && (
        <div className="w-full max-w-4xl p-8 flex flex-col items-center text-center space-y-12 animate-in fade-in duration-1000">
          <div className="w-48 h-64 bg-zinc-800 border-2 border-zinc-600 relative overflow-hidden flex items-center justify-center">
             <span className="text-zinc-500 text-xs italic opacity-20">MUSTAFA KEMAL ATATÜRK</span>
             <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-amber-500">{language === 'tr' ? '"Geldikleri Gibi Giderler!"' : '"They will leave as they came!"'}</h1>
            <p className="text-xl leading-relaxed text-zinc-300 italic">
              {language === 'tr' ? 
                '"Ey Türk Gençliği! Birinci vazifen, Türk istiklâlini, Türk Cumhuriyetini, ilelebet, muhafaza ve müdafaa etmektir... Mevcudiyetinin ve istikbalinin yegâne temeli budur."' :
                '"O Turkish Youth! Your first duty is to preserve and defend Turkish Independence and the Turkish Republic forever... This is the sole foundation of your existence and your future."'
              }
            </p>
            <div className="pt-8 text-zinc-500 uppercase tracking-[0.3em] text-sm">{language === 'tr' ? 'Varlıklar temizlendi. Fabrika huzura erdi.' : 'Entities cleared. The factory is at peace.'}</div>
          </div>

          <button 
            onClick={() => setPhase('FINISH')}
            className="px-12 py-4 border border-zinc-700 hover:bg-zinc-800 transition-all text-sm tracking-widest"
          >
            {language === 'tr' ? 'MENÜYE DÖN' : 'BACK TO MENU'}
          </button>
        </div>
      )}

      {/* Fix: Avoid rendering the result of a void function call. The side effect is now in useEffect. */}
      {phase === 'FINISH' && null}
    </div>
  );
};

export default Ending;