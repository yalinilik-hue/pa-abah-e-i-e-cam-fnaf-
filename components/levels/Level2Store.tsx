
import React, { useState, useEffect } from 'react';
import { Language } from '../../types';

const Level2Store: React.FC<{ language: Language, onWin: () => void, onLose: (r: string) => void }> = ({ language, onWin, onLose }) => {
  const [maskActive, setMaskActive] = useState(false);
  const [bottleEntity, setBottleEntity] = useState(false);
  const [timeLeft, setTimeLeft] = useState(50);
  const [dangerLevel, setDangerLevel] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t <= 1 ? (onWin(), 0) : t - 1), 1000);
    const bottleSpawn = setInterval(() => { if(Math.random() > 0.7) setBottleEntity(true); }, 4000);
    
    const danger = setInterval(() => {
      setDangerLevel(prev => {
        if (!maskActive && !bottleEntity) {
            const next = prev + 5;
            if (next >= 100) onLose(language === 'tr' ? "Maskeyi takmadın, yakalandın!" : "Didn't wear the mask, caught!");
            return next;
        }
        return Math.max(0, prev - 10);
      });
    }, 1000);

    return () => { clearInterval(timer); clearInterval(bottleSpawn); clearInterval(danger); };
  }, [maskActive, bottleEntity, onWin, onLose, language]);

  const flashBottle = () => setBottleEntity(false);

  return (
    <div className="relative w-full h-full bg-zinc-900 flex flex-col items-center justify-center">
      {/* Iron Exit Door Visual */}
      <div className="absolute inset-0 border-[40px] border-zinc-800 pointer-events-none"></div>
      
      {/* Store Shelf Visual */}
      <div className="w-3/4 h-2/3 border-4 border-zinc-700 bg-zinc-800 rounded flex flex-wrap p-4 content-start">
        {Array.from({length: 20}).map((_, i) => (
          <div key={i} className="w-12 h-20 m-2 bg-blue-900/20 border border-blue-500/20 rounded"></div>
        ))}
      </div>

      {bottleEntity && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <div className="w-24 h-48 bg-amber-900 border-4 border-amber-600 rounded-t-full flex items-center justify-center cursor-pointer"
                 onClick={flashBottle}>
                <span className="text-white font-black text-center text-xs">{language === 'tr' ? 'ŞİŞE VARLIK' : 'BOTTLE ENTITY'}<br/>{language === 'tr' ? 'FENERLE TIKLA!' : 'CLICK WITH LIGHT!'}</span>
            </div>
        </div>
      )}

      {/* Mask UI Overlay */}
      {maskActive && (
        <div className="absolute inset-0 bg-black/60 z-40 border-[100px] border-black flex items-center justify-center">
           <div className="text-white text-4xl font-bold opacity-20">{language === 'tr' ? 'MASKE TAKILI' : 'MASK ON'}</div>
        </div>
      )}

      <div className="absolute bottom-20 flex gap-4 z-50">
        <button 
          onMouseDown={() => setMaskActive(true)} 
          onMouseUp={() => setMaskActive(false)}
          className="px-12 py-6 bg-zinc-800 border-4 border-zinc-600 text-white font-bold"
        >
          {language === 'tr' ? 'MASKE TAK (BASILI TUT)' : 'WEAR MASK (HOLD)'}
        </button>
      </div>

      <div className="absolute top-10 left-10 text-white">{language === 'tr' ? 'MAĞAZA' : 'STORE'}: {timeLeft}s</div>
      <div className="absolute top-10 right-10 text-red-500">{language === 'tr' ? 'TEHLİKE' : 'DANGER'}: %{dangerLevel}</div>
    </div>
  );
};

export default Level2Store;