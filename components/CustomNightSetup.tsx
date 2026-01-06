
import React from 'react';
import { GameSettings, Language } from '../types';

interface CustomNightSetupProps {
  language: Language;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onStart: () => void;
  onBack: () => void;
}

const CustomNightSetup: React.FC<CustomNightSetupProps> = ({ language, settings, setSettings, onStart, onBack }) => {
  const handleAIChange = (index: number, val: number) => {
    const newAI = [...settings.customNightAI];
    newAI[index] = val;
    setSettings(prev => ({ ...prev, customNightAI: newAI }));
  };

  const setAll = (val: number) => {
    setSettings(prev => ({ ...prev, customNightAI: Array(10).fill(val) }));
  };

  const totalAI = settings.customNightAI.reduce((a, b) => a + b, 0);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center p-12 overflow-y-auto scrollbar-hide">
      <div className="w-full max-w-6xl flex justify-between items-center mb-12 border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-widest italic uppercase">PAŞABAHÇE CUSTOM NIGHT</h1>
          <p className="text-xs text-zinc-600 font-mono mt-1">SİSTEM ÖZELLEŞTİRME MODÜLÜ</p>
        </div>
        <button onClick={onBack} className="px-10 py-4 bg-zinc-900 border-2 border-zinc-700 text-zinc-500 hover:text-white transition-all font-black text-xs uppercase">GERİ DÖN</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full max-w-6xl">
        {settings.customNightAI.map((ai, i) => (
          <div key={i} className="bg-zinc-900 border-4 border-zinc-800 p-6 flex flex-col items-center group hover:border-zinc-500 transition-all">
             <div className="w-24 h-32 bg-zinc-800 border-2 border-zinc-700 mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <span className="text-zinc-600 text-4xl">👤</span>
                <div className="absolute top-2 left-2 text-[8px] text-zinc-500">ENTITY_{i+1}</div>
             </div>
             <input 
               type="range" 
               min="0" max="20" 
               value={ai} 
               onChange={(e) => handleAIChange(i, parseInt(e.target.value))}
               className="w-full accent-red-600 h-1 bg-zinc-800 appearance-none cursor-pointer"
             />
             <div className="text-3xl font-black mt-4 text-white group-hover:text-red-500 transition-colors">{ai}</div>
          </div>
        ))}
      </div>

      <div className="mt-16 w-full max-w-3xl bg-zinc-900 border-4 border-zinc-800 p-8 flex flex-col items-center gap-8">
         <div className="flex gap-4">
            <button onClick={() => setAll(0)} className="px-6 py-2 bg-zinc-800 text-xs font-bold hover:bg-zinc-700 uppercase">HEPSİNİ 0 YAP</button>
            <button onClick={() => setAll(20)} className="px-6 py-2 bg-red-950 text-xs font-bold text-red-500 border border-red-900 hover:bg-red-900 hover:text-white uppercase tracking-widest">HEPSİNİ 20 YAP (LETHAL)</button>
         </div>
         
         <div className="text-center">
            <div className="text-zinc-600 text-[10px] mb-2 font-mono uppercase">Toplam Zorluk Derecesi</div>
            <div className={`text-6xl font-black ${totalAI > 150 ? 'text-red-600 animate-pulse' : 'text-white'}`}>{totalAI}</div>
         </div>

         <button 
           onClick={onStart}
           className="w-full py-6 bg-white text-black font-black text-2xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(255,255,255,0.2)]"
         >
           VARDİYAYI BAŞLAT
         </button>
      </div>
    </div>
  );
};

export default CustomNightSetup;
