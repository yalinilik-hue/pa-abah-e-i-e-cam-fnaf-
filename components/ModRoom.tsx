
import React from 'react';
import { GameSettings, Language } from '../types';
import { soundManager } from './SoundManager';

interface ModRoomProps {
  language: Language;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onBack: () => void;
}

const ModRoom: React.FC<ModRoomProps> = ({ language, settings, setSettings, onBack }) => {
  const cheats = [
    { key: "SHIFT + A", desc: language === 'tr' ? "Saat 6'da sistemi manuel kapatır." : "Manually shuts down system at 6 AM." },
    { key: "ALT + Q", desc: language === 'tr' ? "Gündüzden geceye anında geçer." : "Skips day to night instantly." },
    { key: "H TUŞU", desc: language === 'tr' ? "Admin terminalini açar/kapatır (Satın alınmışsa)." : "Toggles admin terminal (if purchased)." },
    { key: "V TUŞU", desc: language === 'tr' ? "Kameralarda fener modunu açar." : "Toggles flashlight in cameras." },
    { key: "9 TUŞU", desc: language === 'tr' ? "Admin terminali açıkken geceyi bitirir." : "Skips night while admin terminal is active." },
  ];

  return (
    <div className="w-full h-full bg-zinc-950 p-12 flex flex-col overflow-y-auto scrollbar-hide font-mono">
      <div className="flex justify-between items-center mb-12 border-b-4 border-purple-900 pb-8">
        <div className="animate-pulse">
          <h1 className="text-6xl font-black text-purple-500 italic tracking-tighter">HİLE AKADEMİSİ</h1>
          <p className="text-xs text-purple-800 uppercase tracking-widest mt-2">Paşabahçe Gizli Operasyonlar Merkezi</p>
        </div>
        <button onClick={onBack} className="px-12 py-4 bg-purple-900 text-white font-black hover:bg-purple-600 transition-all border-b-4 border-purple-950">
          SAHAYA DÖN
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Cheat Tutorials */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white border-l-8 border-purple-600 pl-4 mb-8 uppercase">SİSTEM AÇIKLARI (TUTORIAL)</h2>
          {cheats.map((cheat, i) => (
            <div key={i} className="bg-zinc-900 border-2 border-zinc-800 p-6 flex justify-between items-center hover:border-purple-600 transition-colors group">
               <div className="bg-purple-900 px-4 py-2 text-white font-black group-hover:scale-110 transition-transform">{cheat.key}</div>
               <div className="text-sm text-zinc-400 text-right w-2/3">{cheat.desc}</div>
            </div>
          ))}
        </div>

        {/* Cheat Actions */}
        <div className="space-y-8">
          <div className="bg-purple-900/10 p-8 border-4 border-purple-900/40 rounded-3xl">
             <h2 className="text-xl font-bold text-purple-400 mb-6 uppercase text-center">Deney Kontrolü</h2>
             <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setSettings(prev => ({ ...prev, pipeMonsterUnlocked: true }))}
                  className="w-full py-8 bg-gradient-to-r from-amber-600 to-amber-900 text-white font-black text-xl border-4 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-bounce"
                >
                  BORU CANAVARI BYPASS
                </button>
                <button 
                  onClick={() => setSettings(prev => ({ ...prev, balance: prev.balance + 1000000 }))}
                  className="w-full py-6 bg-green-900 text-green-400 border-2 border-green-600 font-bold hover:bg-green-600 hover:text-white transition-all"
                >
                  KASAYA 1.000.000$ EKLE
                </button>
                <button 
                  onClick={() => setSettings(prev => ({ ...prev, difficulty: 20 }))}
                  className="w-full py-6 bg-red-950 text-red-500 border-2 border-red-900 font-bold hover:bg-red-600 hover:text-white"
                >
                  MAKSİMUM ZORLUK (AI 20)
                </button>
             </div>
          </div>

          <div className="p-8 border-2 border-zinc-800 bg-zinc-900 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-3xl">🌍</div>
               <div>
                  <div className="text-white font-bold uppercase">Toprak Map Verisi</div>
                  <div className="text-[10px] text-zinc-500">Yeraltı tünellerini görselleştirir</div>
               </div>
             </div>
             <button 
               onClick={() => setSettings(prev => ({ ...prev, toprakMapActive: !prev.toprakMapActive }))}
               className={`px-8 py-3 font-black text-xs border-2 ${settings.toprakMapActive ? 'bg-amber-600 border-white text-white' : 'bg-black border-zinc-700 text-zinc-600'}`}
             >
               {settings.toprakMapActive ? 'AKTİF' : 'DEVRE DIŞI'}
             </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-12 text-center text-purple-900 text-[10px] tracking-[2em]">
        CHEAT_ACADEMY_RESTRICTED_ACCESS
      </div>
    </div>
  );
};

export default ModRoom;
