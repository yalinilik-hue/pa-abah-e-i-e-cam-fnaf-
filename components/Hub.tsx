
import React from 'react';
import { GameState, Language, GameSettings } from '../types';

interface HubProps {
  language: Language;
  onSelectLevel: (level: GameState) => void;
  onBack: () => void;
  entityConfigActive?: boolean;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const Hub: React.FC<HubProps> = ({ language, onSelectLevel, onBack, entityConfigActive, settings, setSettings }) => {
  const levels = [
    { id: 'LEVEL1', title: language === 'tr' ? 'FABRİKA: Ölümcül Takip' : 'FACTORY: Lethal Pursuit', desc: language === 'tr' ? 'Hızlandırılmış göz takibi (AI 20)' : 'Accelerated eye tracking (AI 20)' },
    { id: 'LEVEL2', title: language === 'tr' ? 'MAĞAZA: Hiper Maske' : 'STORE: Hyper Mask', desc: language === 'tr' ? 'Daha hızlı varlıklar, daha az süre' : 'Faster entities, less time' },
    { id: 'LEVEL3', title: language === 'tr' ? 'ARKA TARAF: Kaos Onarımı' : 'BACKSTAGE: Chaos Repair', desc: language === 'tr' ? 'Camlar daha hızlı kırılıyor' : 'Glass breaks much faster' },
    { id: 'LEVEL4', title: language === 'tr' ? 'BORU: Aç Canavar' : 'PIPE: Hungry Monster', desc: language === 'tr' ? 'Süre %50 azaltıldı' : 'Time reduced by 50%' },
    { id: 'LEVEL5', title: language === 'tr' ? 'ORMAN: Gece Kabusu' : 'FOREST: Night Nightmare', desc: language === 'tr' ? 'Maksimum hedef sayısı' : 'Maximum target count' },
    { id: 'LEVEL6', title: language === 'tr' ? 'DİŞARISI: Şok ve Dehşet' : 'OUTSIDE: Shock & Awe', desc: language === 'tr' ? 'Final: Çılgın Ateş Varlığı' : 'Final: Raging Fire Entity' },
    { id: 'LEVEL7', title: language === 'tr' ? 'RİTÜEL: Boru Fısıltısı' : 'RITUAL: Pipe Whisper', desc: language === 'tr' ? 'Boru Canavarı kilidini açan gizli aşama' : 'Secret stage unlocking Pipe Monster' },
    { id: 'LEVEL8', title: language === 'tr' ? 'KABUS ODASI: Çift Kapı' : 'NIGHTMARE: Double Door', desc: language === 'tr' ? 'Mustafa Amca ve Ateşli Varlık kapıda!' : 'Mustafa and Fire Entity at the doors!' },
  ];

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="animate-pulse">
          <h1 className="text-4xl font-black text-red-600 tracking-[0.5em] uppercase italic">HELP WANTED: RITUAL EDITION</h1>
          <p className="text-[10px] text-red-500 font-mono">Boru Canavarı kilidi için Seviye 7'yi tamamla</p>
        </div>
        <button onClick={onBack} className="px-10 py-4 bg-zinc-900 border-2 border-red-900 text-red-500 hover:bg-red-900 hover:text-white transition-all font-black text-xs uppercase tracking-widest">
          {language === 'tr' ? 'ANA MENÜ' : 'MAIN MENU'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl overflow-y-auto max-h-[60vh] pr-4 scrollbar-hide">
        {levels.map((lvl) => (
          <div 
            key={lvl.id}
            onClick={() => onSelectLevel(lvl.id as GameState)}
            className={`group relative bg-zinc-900 border-4 p-8 cursor-pointer transition-all shadow-2xl ${lvl.id === 'LEVEL8' ? 'border-purple-600 hover:bg-purple-950/20' : lvl.id === 'LEVEL7' ? 'border-amber-600 hover:bg-amber-950/20' : 'border-red-900 hover:border-red-500 hover:bg-red-950/20'}`}
          >
            <div className={`text-[10px] mb-4 font-mono tracking-widest ${lvl.id === 'LEVEL8' ? 'text-purple-500' : lvl.id === 'LEVEL7' ? 'text-amber-500' : 'text-red-900'}`}>
              {lvl.id === 'LEVEL8' ? 'HARDCORE_CHALLENGE' : lvl.id === 'LEVEL7' ? 'LEGENDARY_REWARD' : 'DANGER_LEVEL: HIGH'}
            </div>
            <h3 className={`text-2xl font-black mb-3 transition-colors uppercase italic ${lvl.id === 'LEVEL8' ? 'text-purple-400' : lvl.id === 'LEVEL7' ? 'text-amber-400' : 'text-white group-hover:text-red-400'}`}>{lvl.title}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-mono">{lvl.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-zinc-800 text-[10px] font-mono tracking-[0.4em] animate-bounce">
        İŞARETİ TAKİP ET...
      </div>
    </div>
  );
};

export default Hub;
