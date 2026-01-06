
import React, { useState, useEffect } from 'react';
import { GameSettings, Language } from '../types';
import { soundManager } from './SoundManager';

interface UndergroundProps {
  language: Language;
  settings: GameSettings;
  onWin: () => void;
  onLose: (r: string) => void;
}

const Underground: React.FC<UndergroundProps> = ({ language, settings, onWin, onLose }) => {
  const [distance, setDistance] = useState(0);
  const [isCrouching, setIsCrouching] = useState(false);
  const [threatLevel, setThreatLevel] = useState(0);
  const goal = 1000;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') setIsCrouching(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') setIsCrouching(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      // Hareket mantığı
      if (isCrouching) {
        setDistance(prev => Math.min(goal, prev + 2));
        setThreatLevel(prev => Math.max(0, prev - 1));
      } else {
        setDistance(prev => Math.min(goal, prev + 5));
        setThreatLevel(prev => prev + 2);
      }

      // Yakalanma mantığı
      if (threatLevel > 100) {
        onLose(language === 'tr' ? "Çok ses çıkardın ve yakalandın!" : "You made too much noise and got caught!");
      }

      // Kazanma mantığı
      if (distance >= goal) {
        onWin();
      }
    }, 100);

    return () => clearInterval(gameLoop);
  }, [isCrouching, distance, threatLevel, onWin, onLose, language]);

  return (
    <div className="w-full h-full bg-stone-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_80%)] z-10"></div>
      
      {/* Harita UI (Toprak Map aktifse) */}
      {settings.toprakMapActive && (
        <div className="absolute top-10 right-10 w-64 h-32 bg-amber-900/40 border-2 border-amber-600 p-4 z-20">
           <div className="text-[10px] text-amber-500 font-bold mb-2 uppercase font-mono">Toprak Map (Yeraltı Verisi)</div>
           <div className="w-full h-4 bg-zinc-950 rounded-full relative overflow-hidden border border-amber-800">
              <div className="h-full bg-amber-500 transition-all" style={{ width: `${(distance / goal) * 100}%` }}></div>
           </div>
           <div className="flex justify-between mt-2 text-[8px] text-amber-300 font-mono">
              <span>GİRİŞ</span>
              <span>BORU</span>
           </div>
        </div>
      )}

      {/* Karakter Görünümü */}
      <div className={`transition-all duration-300 ${isCrouching ? 'translate-y-40' : 'translate-y-0'}`}>
         <div className="w-40 h-80 bg-zinc-800/20 border-x-4 border-zinc-700/50 flex flex-col items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 shadow-[0_0_20px_blue] rounded-full mb-4 animate-pulse"></div>
            <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest italic rotate-90">PAŞABAHÇE_OPERATOR</div>
         </div>
      </div>

      <div className="absolute bottom-20 flex flex-col items-center z-20">
        <div className="w-96 h-2 bg-zinc-900 border border-zinc-700 rounded-full mb-4 overflow-hidden">
           <div className="h-full bg-red-600 transition-all" style={{ width: `${threatLevel}%` }}></div>
        </div>
        <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">{language === 'tr' ? 'TESPİT_SEVİYESİ' : 'DETECTION_LEVEL'}</div>
        <div className="mt-4 text-white font-mono text-xs">{language === 'tr' ? '[CTRL] Tuşuna Basarak Eğil' : 'Press [CTRL] to Crouch'}</div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
         <h1 className="text-[20rem] font-black text-zinc-900">TUNNEL</h1>
      </div>
    </div>
  );
};

export default Underground;
