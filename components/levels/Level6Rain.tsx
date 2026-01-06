
import React, { useState, useEffect } from 'react';
import { Language } from '../../types';

const Level6Rain: React.FC<{ language: Language, onWin: () => void, onLose: (r: string) => void }> = ({ language, onWin, onLose }) => {
  const [bossHp, setBossHp] = useState(100);
  const [isFiring, setIsFiring] = useState(false);
  const [rain, setRain] = useState<number[]>(Array.from({length: 50}));

  const handleShock = () => {
    setIsFiring(true);
    setBossHp(hp => {
      if (hp <= 1) { onWin(); return 0; }
      return hp - 1;
    });
    setTimeout(() => setIsFiring(false), 50);
  };

  return (
    <div className="w-full h-full bg-zinc-950 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Rain Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {rain.map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-blue-400/20 w-[1px] h-8 animate-bounce"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 0.5 + 0.2}s` }}
          ></div>
        ))}
      </div>

      {/* Fire Entity Boss */}
      <div className={`relative transition-all ${isFiring ? 'scale-95 blur-sm' : 'scale-100'}`}>
        <div className="w-64 h-96 bg-gradient-to-t from-red-600 via-orange-500 to-transparent rounded-t-full shadow-[0_0_100px_red] animate-pulse"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-12">
          <div className="w-8 h-8 bg-white rounded-full shadow-[0_0_20px_white]"></div>
          <div className="w-8 h-8 bg-white rounded-full shadow-[0_0_20px_white]"></div>
        </div>
      </div>

      {/* Electric Bolt */}
      {isFiring && (
        <div className="absolute bottom-40 w-1 h-96 bg-blue-400 shadow-[0_0_50px_blue] animate-pulse"></div>
      )}

      <div className="absolute bottom-20 z-50">
        <button 
          onClick={handleShock}
          className="px-12 py-8 bg-blue-900 border-4 border-blue-400 text-white font-black text-2xl hover:bg-blue-800 active:bg-white active:text-blue-900"
        >
          {language === 'tr' ? 'ŞOK TABANCASI (TIKLA!)' : 'STUN GUN (CLICK!)'}
        </button>
      </div>

      <div className="absolute top-10 w-full flex flex-col items-center">
        <div className="text-red-500 font-black text-4xl mb-2">{language === 'tr' ? 'ATEŞLİ VARLIK' : 'FIRE ENTITY'}</div>
        <div className="w-96 h-4 bg-zinc-800 border-2 border-zinc-700 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 transition-all duration-75" style={{ width: `${bossHp}%` }}></div>
        </div>
        <div className="text-white mt-2">{language === 'tr' ? 'GÜÇ' : 'POWER'}: %{bossHp}</div>
      </div>
    </div>
  );
};

export default Level6Rain;