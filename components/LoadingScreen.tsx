
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface LoadingScreenProps {
  language: Language;
  onComplete: () => void;
  targetState: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ language, onComplete, targetState }) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = language === 'tr' ? [
    "Fırınlar 1500 dereceye ısıtılıyor...",
    "Varlıklar gölgelerde bekliyor...",
    "Mustafa Amca kapıyı çalabilir, dikkat et.",
    "Boru canavarını beslemeyi unutma.",
    "Camlar çok hassas, kırılma sesini dinle.",
    "Güvenlik kulübesi kilitleniyor..."
  ] : [
    "Heating furnaces to 1500 degrees...",
    "Entities are waiting in the shadows...",
    "Uncle Mustafa might knock, be careful.",
    "Don't forget to feed the pipe monster.",
    "Glass is fragile, listen for the breaking sound.",
    "Security booth is locking down..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + (Math.random() * 15);
      });
    }, 400);

    const tipInterval = setInterval(() => {
      setTipIndex(i => (i + 1) % tips.length);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_2px,white_4px)]"></div>
      </div>
      
      <div className="z-10 text-center mb-16">
        <h2 className="text-zinc-600 font-mono text-xs tracking-[1em] mb-4 uppercase">SİSTEM YÜKLENİYOR</h2>
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          {targetState} HAZIRLANIYOR...
        </h1>
      </div>

      <div className="w-full max-w-2xl relative">
        <div className="flex justify-between mb-4">
           <span className="text-orange-500 font-black text-xs uppercase tracking-widest animate-pulse">Erimiş Cam Akışı</span>
           <span className="text-white font-mono text-xs">%{Math.floor(progress)}</span>
        </div>
        
        {/* Molten Glass Progress Bar */}
        <div className="h-4 w-full bg-zinc-900 rounded-full border-2 border-zinc-800 p-0.5 overflow-hidden shadow-[0_0_20px_black]">
          <div 
            className="h-full bg-gradient-to-r from-orange-600 via-red-500 to-yellow-400 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] relative"
            style={{ width: `${progress}%` }}
          >
            {/* Gloss Effect */}
            <div className="absolute inset-0 bg-white/20 animate-[pulse_1s_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="mt-12 h-6 flex items-center justify-center">
        <p className="text-zinc-400 font-mono text-sm italic animate-in fade-in slide-in-from-bottom-2 duration-500" key={tipIndex}>
          "{tips[tipIndex]}"
        </p>
      </div>

      <div className="absolute bottom-10 text-[8px] text-zinc-800 tracking-[2em] font-black uppercase">
        PASABAHCE_OS_LOADING_V4
      </div>
    </div>
  );
};

export default LoadingScreen;
