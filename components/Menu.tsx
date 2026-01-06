
import React from 'react';
import { GameSettings, Language } from '../types';
import { soundManager } from './SoundManager';

interface MenuProps {
  night: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStartClassic: () => void;
  onStartNewGame: () => void;
  onStartUnderground: () => void;
  onOpenMods: () => void;
  onOpenModRoom: () => void;
  onStartHelpWanted: () => void;
  onOpenCustomNight: () => void;
  onStartPipeGame: () => void;
  onOpenAILounge: () => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const Menu: React.FC<MenuProps> = ({ language, onStartClassic, onStartNewGame, onStartUnderground, onOpenMods, onOpenModRoom, onStartHelpWanted, onStartPipeGame, onOpenAILounge, settings, setSettings }) => {
  
  const MOD_ROOM_PRICE = 500000;
  const ENTITY_MODE_PRICE = 250000;
  const PIPE_MONSTER_PRICE = 90000000000000000; 

  const handleBuyModRoom = () => {
    if (settings.balance >= MOD_ROOM_PRICE) {
      setSettings(prev => ({ 
        ...prev, 
        balance: prev.balance - MOD_ROOM_PRICE, 
        modRoomUnlocked: true,
        entityModeUnlocked: true 
      }));
      soundManager.speakHuman(language === 'tr' ? "Hile Akademisi açıldı. Varlık Modu artık bedava!" : "Cheat Academy unlocked. Entity Mode is now free!", language);
    } else {
      soundManager.speakHuman(language === 'tr' ? "Maddi durumun yetersiz!" : "Insufficient funds!", language);
    }
  };

  const handleBuyEntityMode = () => {
    if (settings.modRoomUnlocked || settings.entityModeUnlocked) return;
    if (settings.balance >= ENTITY_MODE_PRICE) {
      setSettings(prev => ({ ...prev, balance: prev.balance - ENTITY_MODE_PRICE, entityModeUnlocked: true }));
      soundManager.speakHuman(language === 'tr' ? "Varlık Modu satın alındı." : "Entity Mode purchased.", language);
    } else {
      soundManager.speakHuman(language === 'tr' ? "Paran yetmiyor!" : "Not enough money!", language);
    }
  };

  const handleBuyPipeMonster = () => {
    if (settings.pipeMonsterUnlocked) {
      onStartPipeGame();
      return;
    }
    if (settings.balance >= PIPE_MONSTER_PRICE) {
      setSettings(prev => ({ ...prev, balance: prev.balance - PIPE_MONSTER_PRICE, pipeMonsterUnlocked: true }));
      soundManager.speakHuman("JACKPOT!", language);
    } else {
      soundManager.speakHuman(language === 'tr' ? "Bu parayı rüyanda görürsün. Help Wanted'ı bitir!" : "You'll see this money in your dreams. Finish Help Wanted!", language);
    }
  };

  const toggleEntityMode = () => {
    if (!settings.entityModeUnlocked && !settings.modRoomUnlocked) {
      handleBuyEntityMode();
      return;
    }
    setSettings(prev => ({ ...prev, entityModeActive: !prev.entityModeActive }));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-white bg-zinc-950 p-6 overflow-y-auto scrollbar-hide">
      <div className="absolute top-6 left-6 bg-zinc-900 border-2 border-zinc-800 p-4 rounded-xl flex flex-col gap-2 shadow-2xl">
         <div className="text-amber-500 font-black text-3xl tabular-nums">$ {settings.balance.toLocaleString()}</div>
         <div className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase border-t border-zinc-800 pt-1">Bakiye Durumu</div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-8xl font-black tracking-tighter text-zinc-300 mb-2 drop-shadow-2xl">PAŞABAHÇE</h1>
        <p className="text-xl text-zinc-600 uppercase tracking-[0.5em] font-bold">Lethal Overlord Update</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl mb-8">
        <button onClick={onStartClassic} className="p-8 border-4 border-zinc-800 bg-zinc-900 hover:border-zinc-400 font-black text-2xl transition-all shadow-xl group">
          <div className="text-zinc-600 group-hover:text-white uppercase tracking-tighter">KLASİK NÖBET</div>
        </button>
        <button onClick={onStartNewGame} className="p-8 border-4 border-blue-900 bg-zinc-900 hover:border-blue-400 font-black text-2xl text-blue-400 shadow-xl uppercase">
          Full Varlık
        </button>
        <button onClick={onStartHelpWanted} className="p-8 border-4 border-red-900 bg-zinc-900 hover:border-red-400 font-black text-2xl text-red-500 shadow-xl animate-pulse uppercase">
          Help Wanted
        </button>
        <button onClick={onOpenAILounge} className="p-8 border-4 border-cyan-700 bg-zinc-900 hover:border-cyan-400 font-black text-2xl text-cyan-500 shadow-xl uppercase transition-all hover:scale-105">
          AI ASİSTAN & TASARIM
        </button>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <button 
             onClick={settings.modRoomUnlocked ? onOpenModRoom : handleBuyModRoom}
             className={`p-6 border-4 font-black text-xl uppercase transition-all shadow-2xl ${settings.modRoomUnlocked ? 'border-purple-600 bg-purple-950/20 text-purple-400' : 'border-amber-600 bg-zinc-900 text-amber-500 animate-pulse hover:bg-amber-900 hover:text-white'}`}
           >
             {settings.modRoomUnlocked ? 'HİLE AKADEMİSİ (AÇIK)' : `MOD ROOM SATIN AL ($${MOD_ROOM_PRICE.toLocaleString()})`}
           </button>

           <div className="flex flex-col gap-2">
             <button 
               onClick={toggleEntityMode}
               className={`p-6 border-4 font-black text-xl uppercase transition-all shadow-2xl flex-1 ${settings.entityModeUnlocked || settings.modRoomUnlocked ? (settings.entityModeActive ? 'border-blue-500 bg-blue-600 text-white' : 'border-zinc-800 bg-zinc-900 text-zinc-500') : 'border-zinc-800 bg-zinc-900 text-zinc-700 hover:text-white'}`}
             >
               {settings.entityModeUnlocked || settings.modRoomUnlocked 
                 ? (settings.entityModeActive ? 'VARLIK MODU: AKTİF' : 'VARLIK MODU: KAPALI') 
                 : `VARLIK MODU AL ($${ENTITY_MODE_PRICE.toLocaleString()})`}
             </button>
             
             {(settings.entityModeUnlocked || settings.modRoomUnlocked) && settings.entityModeActive && (
               <div className="grid grid-cols-5 gap-1 p-2 bg-zinc-900 border-2 border-zinc-800 rounded-lg">
                 {Array.from({length: 10}).map((_, i) => (
                   <button 
                     key={i}
                     onClick={() => setSettings(prev => ({ ...prev, selectedEntityId: i }))}
                     className={`py-2 text-[10px] font-black border-2 transition-all ${settings.selectedEntityId === i ? 'bg-red-600 border-white text-white scale-110 z-10' : 'bg-black border-zinc-800 text-zinc-600 hover:border-zinc-500'}`}
                   >
                     V{i+1}
                   </button>
                 ))}
               </div>
             )}
           </div>
        </div>

        <button 
          onClick={handleBuyPipeMonster}
          className={`w-full p-8 border-4 font-black text-2xl uppercase tracking-widest transition-all ${settings.pipeMonsterUnlocked ? 'border-green-600 bg-green-950/20 text-green-500 animate-bounce' : 'border-zinc-900 bg-zinc-900 text-zinc-800 hover:text-red-900'}`}
        >
          {settings.pipeMonsterUnlocked ? 'BORU CANAVARI OL (ÜCRETSİZ)' : `BORU CANAVARI OL ($${PIPE_MONSTER_PRICE.toLocaleString()})`}
        </button>
      </div>

      <div className="mt-12 text-zinc-800 font-mono text-[10px] tracking-[1em] animate-pulse">
        PAŞABAHÇE_ECONOMY_V3.1_PIPE_LORD
      </div>
    </div>
  );
};

export default Menu;
