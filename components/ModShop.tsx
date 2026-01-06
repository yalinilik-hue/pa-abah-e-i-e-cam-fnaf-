
import React from 'react';
import { Language, GameSettings } from '../types';
import { soundManager } from './SoundManager';

interface ModShopProps {
  language: Language;
  onBack: () => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const ModShop: React.FC<ModShopProps> = ({ language, onBack, settings, setSettings }) => {
  const handleActivate = (id: string) => {
    const isActive = settings.activeMods.includes(id);
    let newMods = [...settings.activeMods];
    if (isActive) {
      newMods = newMods.filter(m => m !== id);
    } else {
      newMods.push(id);
    }
    setSettings(prev => ({ ...prev, activeMods: newMods }));
  };

  const activateAll = () => {
    const all = Array.from({length: 100}, (_, i) => `MOD_${1000000 - i}`);
    setSettings(prev => ({ ...prev, activeMods: all }));
    soundManager.speakHuman(language === 'tr' ? "Tüm modlar aktif edildi. Mod Room açıldı!" : "All mods activated. Mod Room unlocked!", language);
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col p-12 overflow-hidden">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-amber-500 tracking-tighter">MOD MAĞAZASI</h1>
        <div className="flex gap-4">
           <button onClick={activateAll} className="px-6 py-2 bg-green-900 text-white font-bold text-[10px] uppercase border border-green-500">Hepsini Aç (Developer Debug)</button>
           <button onClick={onBack} className="px-8 py-3 bg-amber-950 border-2 border-amber-600 text-amber-500 font-bold uppercase">GERİ DÖN</button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 overflow-y-auto pr-4 scrollbar-hide">
        {Array.from({length: 100}).map((_, i) => {
          const modId = `MOD_${1000000 - i}`;
          const isActive = settings.activeMods.includes(modId);
          return (
            <div key={i} className={`bg-zinc-900 border p-6 ${isActive ? 'border-amber-500 bg-amber-950/10' : 'border-zinc-800'}`}>
              <div className="text-[10px] text-zinc-500 mb-2 font-mono">#{modId}</div>
              <h3 className="text-sm font-bold text-zinc-300">CUSTOM MOD V.{i}</h3>
              <button onClick={() => handleActivate(modId)} className={`mt-4 w-full py-2 text-[10px] font-bold ${isActive ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                {isActive ? 'DEVRE DIŞI' : 'AKTİF ET'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModShop;
