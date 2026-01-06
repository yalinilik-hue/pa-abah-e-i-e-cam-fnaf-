
import React, { useEffect, useState } from 'react';
import { soundManager } from './SoundManager';
import { Language } from '../types';

interface JumpscareProps {
  // Add language to props to fix TypeScript error in App.tsx
  language: Language;
  reason?: string;
}

const Jumpscare: React.FC<JumpscareProps> = ({ language, reason }) => {
  const [flicker, setFlicker] = useState(true);
  const [stage, setStage] = useState<'SCREAM' | 'QUESTION' | 'REASON'>('SCREAM');

  useEffect(() => {
    soundManager.playScream();
    
    const itv = setInterval(() => setFlicker(f => !f), 50);
    const t1 = setTimeout(() => setStage('QUESTION'), 1500);
    const t2 = setTimeout(() => setStage('REASON'), 3500);

    return () => {
      clearInterval(itv);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center transition-colors duration-1000 ${flicker ? 'bg-red-950' : 'bg-black'}`}>
        {stage === 'SCREAM' && (
            <div className="relative animate-ping">
                <div className="text-9xl font-black text-white scale-150 transform rotate-12 blur-sm">{language === 'tr' ? 'ÖLDÜN' : 'YOU DIED'}</div>
            </div>
        )}

        {stage === 'QUESTION' && (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <p className="text-zinc-500 text-xs uppercase tracking-[1em] mb-4">{language === 'tr' ? 'SİSTEM ANALİZİ' : 'SYSTEM ANALYSIS'}</p>
                <h2 className="text-4xl font-bold text-zinc-300">{language === 'tr' ? 'Niye öldüğünü biliyor musun?' : 'Do you know why you died?'}</h2>
            </div>
        )}

        {stage === 'REASON' && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-red-600 text-6xl font-black tracking-tighter uppercase italic">
                    {reason || (language === 'tr' ? "Bilinmeyen bir hata oluştu." : "An unknown error occurred.")}
                </div>
                <p className="text-zinc-600 text-xs mt-8">{language === 'tr' ? 'TEKRAR DENE...' : 'TRY AGAIN...'}</p>
            </div>
        )}

        <div className="fixed inset-0 pointer-events-none opacity-20">
            <div className="w-full h-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)]"></div>
        </div>
    </div>
  );
};

export default Jumpscare;