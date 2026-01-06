
import React from 'react';
import { GameSettings, Language } from '../types';

interface ControlMenuProps {
  // Add language to props to fix TypeScript error in App.tsx
  language: Language;
  onClose: () => void;
  onQuit: () => void;
  onBackToHub: () => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const ControlMenu: React.FC<ControlMenuProps> = ({ language, onClose, onQuit, onBackToHub, settings, setSettings }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-zinc-900 border-4 border-blue-900 p-8 shadow-[0_0_50px_rgba(30,58,138,0.5)]">
        <div className="flex justify-between items-center border-b-2 border-blue-900 pb-4 mb-6">
          <h2 className="text-2xl font-black text-blue-500 tracking-tighter uppercase italic">
            Paşabahçe Terminal V5.2
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white font-bold text-xl">✕</button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-950/20 p-4 border border-blue-900/30">
            <h3 className="text-xs text-blue-400 mb-4 font-bold uppercase tracking-widest">{language === 'tr' ? 'Sistem Ayarları' : 'System Settings'}</h3>
            <div className="space-y-4">
               <div>
                  <label className="flex justify-between text-[10px] text-zinc-400 mb-2 uppercase">
                    {language === 'tr' ? 'Mekanik Hassasiyet' : 'Mechanical Sensitivity'} <span>{settings.difficulty}</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={settings.difficulty} 
                    onChange={(e) => setSettings(s => ({ ...s, difficulty: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-zinc-800 accent-blue-500 appearance-none cursor-pointer"
                  />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={onClose}
              className="py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] transition-all"
            >
              {language === 'tr' ? 'Devam Et (S)' : 'Continue (S)'}
            </button>
            <button 
              onClick={onBackToHub}
              className="py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold uppercase text-xs"
            >
              {language === 'tr' ? 'Laboratuvara Dön (HUB)' : 'Return to Hub'}
            </button>
            <button 
              onClick={onQuit}
              className="py-3 border border-red-900/50 hover:bg-red-950/50 text-red-500 font-bold uppercase text-xs"
            >
              {language === 'tr' ? 'Ana Menüye Çık' : 'Quit to Menu'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-[8px] text-zinc-600 text-center font-mono">
          STATUS: PAUSED | ENCRYPTION: ACTIVE | FACILITY: PAŞABAHÇE_01
        </div>
      </div>
    </div>
  );
};

export default ControlMenu;