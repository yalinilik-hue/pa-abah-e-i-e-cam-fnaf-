
import React, { useState } from 'react';
import { Language } from '../../types';

const Level3Repair: React.FC<{ language: Language, onWin: () => void, onLose: (r: string) => void }> = ({ language, onWin, onLose }) => {
  const [repairs, setRepairs] = useState(0);
  const [activeBottle, setActiveBottle] = useState(true);
  const [clicksNeeded, setClicksNeeded] = useState(5);

  const handleRepair = () => {
    if (clicksNeeded <= 1) {
      setRepairs(r => {
        if (r + 1 >= 5) onWin();
        return r + 1;
      });
      setClicksNeeded(5);
    } else {
      setClicksNeeded(c => c - 1);
    }
  };

  return (
    <div className="w-full h-full bg-zinc-300 flex flex-col items-center justify-center p-12">
      <div className="text-zinc-800 text-2xl font-bold mb-12 uppercase tracking-widest">{language === 'tr' ? 'ARKA TARAF: CAM ONARIM HATTI' : 'BACKSTAGE: GLASS REPAIR LINE'}</div>
      
      <div className="w-full max-w-2xl h-96 bg-zinc-400 border-8 border-zinc-500 rounded-lg flex items-center justify-center relative">
        <div 
          onClick={handleRepair}
          className={`w-32 h-64 bg-zinc-200 border-4 border-zinc-300 rounded shadow-xl cursor-pointer hover:bg-white active:scale-95 transition-all flex flex-col items-center justify-center`}
        >
          <div className="text-zinc-400 text-6xl">{clicksNeeded}</div>
          <div className="text-[10px] text-zinc-500">{language === 'tr' ? 'TIKLA VE ONAR' : 'CLICK AND REPAIR'}</div>
        </div>

        {/* Entity Waiting Visual */}
        <div className="absolute -right-20 top-20 w-16 h-48 bg-zinc-900 rounded-l-full animate-pulse"></div>
      </div>

      <div className="mt-12 flex gap-4">
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} className={`w-8 h-8 rounded-full border-2 ${i < repairs ? 'bg-green-500 border-green-700' : 'bg-zinc-400 border-zinc-500'}`}></div>
        ))}
      </div>
      <div className="mt-4 text-zinc-600 font-bold">{language === 'tr' ? 'TESLİM EDİLEN' : 'DELIVERED'}: {repairs}/5</div>
    </div>
  );
};

export default Level3Repair;