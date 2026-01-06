
import React, { useState } from 'react';
import { Language, GameSettings } from '../types';
import { soundManager } from './SoundManager';

interface ModShopProps {
  language: Language;
  onBack: () => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const ModShop: React.FC<ModShopProps> = ({ language, onBack, settings, setSettings }) => {
  const [activeCategory, setActiveCategory] = useState<'MODS' | 'SUBS'>('MODS');

  const mods = [
    { id: 'MOD_X_RAY', name: 'X-Ray Cam', price: 150000, desc: 'Varlıkları duvarların arkasından gör.', category: 'Mekanik' },
    { id: 'MOD_NEON_OFFICE', name: 'Neon Ofis', price: 50000, desc: 'Ofis arayüzünü neon siberpunk yapar.', category: 'Görsel' },
    { id: 'MOD_SILENT_PIPES', name: 'Sessiz Borular', price: 200000, desc: 'Boru canavarının sesini %50 azaltır.', category: 'Mekanik' },
    { id: 'MOD_AUTO_SPIN', name: 'Oto-Şişe', price: 450000, desc: 'Şişe her 10 saniyede otomatik döner.', category: 'Sistem' },
  ];

  const subscriptions = [
    { id: 'SUB_PASA_GOLD', name: 'P.A.S.A Gold', price: 500000, desc: 'Sınırsız AI Görseli + Oyun içi AI asistanı.', key: 'isPasaGold' },
    { id: 'SUB_VIP_SEC', name: 'VIP Güvenlik', price: 750000, desc: 'Kapılar enerji harcamaz, varlıklar yavaşlar.', key: 'isVipSecurity' },
    { id: 'SUB_LETHAL_ELITE', name: 'Lethal Elite', price: 1000000, desc: 'Maaş 5 kat artar, zorluk tavan yapar.', key: 'isLethalElite' },
  ];

  const handleBuyMod = (mod: any) => {
    if (settings.activeMods.includes(mod.id)) {
      setSettings(prev => ({ ...prev, activeMods: prev.activeMods.filter(m => m !== mod.id) }));
      return;
    }
    if (settings.balance >= mod.price) {
      setSettings(prev => ({ 
        ...prev, 
        balance: prev.balance - mod.price, 
        activeMods: [...prev.activeMods, mod.id] 
      }));
      soundManager.speakHuman(`${mod.name} aktif edildi!`, language);
    } else {
      soundManager.speakHuman(language === 'tr' ? "Bakiye yetersiz!" : "Insufficient balance!", language);
    }
  };

  const handleBuySub = (sub: any) => {
    if ((settings as any)[sub.key]) return;
    if (settings.balance >= sub.price) {
      setSettings(prev => ({ 
        ...prev, 
        balance: prev.balance - sub.price, 
        [sub.key]: true 
      }));
      soundManager.speakHuman(`${sub.name} aboneliği başlatıldı!`, language);
    } else {
      soundManager.speakHuman("Paran yetmiyor!", language);
    }
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col p-8 font-mono overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none"></div>
      
      {/* Header */}
      <div className="flex justify-between items-end mb-10 border-b-4 border-amber-900 pb-6 relative z-10">
        <div>
          <h1 className="text-6xl font-black text-amber-500 italic tracking-tighter">PAŞABAHÇE PREMIUM STORE</h1>
          <p className="text-zinc-500 uppercase tracking-[0.5em] text-[10px] mt-2">Geleceğin Cam Teknolojisi ve Modifikasyonları</p>
        </div>
        <div className="flex flex-col items-end gap-4">
           <div className="bg-amber-500 text-black px-6 py-2 font-black text-2xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
             $ {settings.balance.toLocaleString()}
           </div>
           <button onClick={onBack} className="px-10 py-3 bg-zinc-900 border-2 border-amber-600 text-amber-500 font-black hover:bg-amber-950 transition-all uppercase italic">ÇIKIŞ YAP</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 relative z-10">
        <button 
          onClick={() => setActiveCategory('MODS')}
          className={`px-12 py-4 font-black text-sm transition-all skew-x-[-12deg] border-2 ${activeCategory === 'MODS' ? 'bg-amber-600 border-white text-white shadow-[0_0_30px_amber]' : 'bg-zinc-900 border-amber-900 text-amber-900'}`}
        >
          SİSTEM MODLARI
        </button>
        <button 
          onClick={() => setActiveCategory('SUBS')}
          className={`px-12 py-4 font-black text-sm transition-all skew-x-[-12deg] border-2 ${activeCategory === 'SUBS' ? 'bg-purple-600 border-white text-white shadow-[0_0_30px_purple]' : 'bg-zinc-900 border-purple-900 text-purple-900'}`}
        >
          PREMIUM ABONELİKLER
        </button>
      </div>

      {/* Shop Grid */}
      <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide relative z-10">
        {activeCategory === 'MODS' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mods.map(mod => {
              const isActive = settings.activeMods.includes(mod.id);
              return (
                <div key={mod.id} className={`group relative bg-zinc-900 border-4 p-6 transition-all hover:scale-105 ${isActive ? 'border-amber-500 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-zinc-800'}`}>
                   <div className="text-[10px] text-amber-700 font-bold mb-2 uppercase">{mod.category}</div>
                   <h3 className="text-xl font-black text-white mb-2">{mod.name}</h3>
                   <p className="text-xs text-zinc-500 mb-6 h-10 leading-relaxed">{mod.desc}</p>
                   <button 
                     onClick={() => handleBuyMod(mod)}
                     className={`w-full py-4 font-black text-sm transition-all ${isActive ? 'bg-zinc-800 text-zinc-400' : 'bg-amber-600 text-white hover:bg-amber-500 shadow-xl'}`}
                   >
                     {isActive ? 'DEVRE DIŞI BIRAK' : `$ ${mod.price.toLocaleString()}`}
                   </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptions.map(sub => {
              const isOwned = (settings as any)[sub.key];
              return (
                <div key={sub.id} className={`relative p-10 border-8 overflow-hidden transition-all ${isOwned ? 'border-purple-500 bg-purple-950/30' : 'border-zinc-800 bg-zinc-900/50 hover:border-purple-900'}`}>
                   {isOwned && <div className="absolute top-4 right-4 bg-purple-500 text-white text-[10px] px-3 py-1 font-black animate-pulse">AKTİF ABONELİK</div>}
                   <div className="text-purple-500 text-5xl mb-6">💎</div>
                   <h3 className="text-3xl font-black text-white mb-4 uppercase italic">{sub.name}</h3>
                   <p className="text-sm text-zinc-400 mb-10 leading-loose">{sub.desc}</p>
                   <button 
                     onClick={() => handleBuySub(sub)}
                     className={`w-full py-6 font-black text-xl transition-all border-4 ${isOwned ? 'bg-zinc-800 border-zinc-700 text-zinc-600' : 'bg-purple-600 border-purple-400 text-white hover:scale-110 shadow-[0_0_50px_purple]'}`}
                   >
                     {isOwned ? 'SAHİPSİN' : `$ ${sub.price.toLocaleString()}`}
                   </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="mt-8 flex justify-between items-center text-zinc-800 text-[10px] font-black uppercase tracking-[1em] italic">
        <span>PASABAHCE_TRADING_STATION_V9</span>
        <span className="animate-pulse">Sinyal Gücü: Mükemmel</span>
      </div>
    </div>
  );
};

export default ModShop;
