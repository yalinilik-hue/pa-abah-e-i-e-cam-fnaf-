
import React, { useState, useEffect, useRef } from 'react';
import CameraSystem from './CameraSystem';
import { Entity, Language } from '../types';
import { soundManager } from './SoundManager';

interface DayOfficeProps {
  language: Language;
  onWorkComplete: () => void;
}

interface Intruder {
  id: number;
  pos: number;
}

const DayOffice: React.FC<DayOfficeProps> = ({ language, onWorkComplete }) => {
  const [camOpen, setCamOpen] = useState(false);
  const [intruders, setIntruders] = useState<Intruder[]>([]);
  const [time, setTime] = useState({ h: 8, m: 0 });
  const [warningsSent, setWarningsSent] = useState(0);
  const [arrests, setArrests] = useState(0);
  const [activeCam] = useState(1);
  const [broadcastCooldown, setBroadcastCooldown] = useState(0);

  const nextId = useRef(0);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(prev => {
        let newM = prev.m + 15;
        let newH = prev.h;
        if (newM >= 60) {
          newM = 0;
          newH += 1;
        }
        if (newH >= 18) {
          clearInterval(clockInterval);
          setTimeout(() => onWorkComplete(), 1000);
          return { h: 18, m: 0 };
        }
        return { h: newH, m: newM };
      });
    }, 4000);
    return () => clearInterval(clockInterval);
  }, [onWorkComplete]);

  useEffect(() => {
    const spawnRate = time.h >= 17 ? 1500 : 5000;
    const spawnInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        setIntruders(prev => [
          ...prev, 
          { id: nextId.current++, pos: Math.floor(Math.random() * 2) + 1 }
        ]);
      }
    }, spawnRate);

    const moveInterval = setInterval(() => {
      setIntruders(prev => prev.map(intruder => {
        if (Math.random() > 0.7 && intruder.pos < 5) {
          return { ...intruder, pos: intruder.pos + 1 };
        }
        return intruder;
      }));
    }, 3000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [time.h]);

  useEffect(() => {
    if (broadcastCooldown > 0) {
      const timer = setTimeout(() => setBroadcastCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [broadcastCooldown]);

  const handleWarning = (id: number) => {
    setIntruders(prev => prev.filter(i => i.id !== id));
    setWarningsSent(w => w + 1);
    soundManager.speakHuman(language === 'tr' ? "Lütfen alanı terk edin!" : "Please leave the area!", language);
  };

  const handleGlobalWarning = () => {
    if (broadcastCooldown > 0) return;
    const inCams = intruders.filter(i => i.pos < 5);
    if (inCams.length > 0) {
      setIntruders(prev => prev.filter(i => i.pos === 5));
      setWarningsSent(w => w + inCams.length);
      soundManager.speakHuman(language === 'tr' ? "DİKKAT! YETKİSİZ ŞAHISLAR TERK ETSİN!" : "ATTENTION! UNAUTHORIZED PERSONNEL MUST LEAVE!", language);
      setBroadcastCooldown(5);
    }
  };

  const handlePolice = () => {
    const atDoor = intruders.find(i => i.pos === 5);
    if (atDoor) {
      setIntruders(prev => prev.filter(i => i.id !== atDoor.id));
      setArrests(a => a + 1);
      soundManager.playPoliceSiren();
      soundManager.speakHuman(language === 'tr' ? "Polis geliyor!" : "Police is coming!", language);
    }
  };

  const dummyEntities: Entity[] = intruders
    .filter(i => i.pos === activeCam)
    .map(i => ({
      id: i.id,
      name: "Personnel",
      position: i.pos,
      aggressive: 0,
      isVisible: true
    }));

  const personAtDoor = intruders.some(i => i.pos === 5);
  const peopleInCams = intruders.filter(i => i.pos < 5).length;

  return (
    <div className="relative w-full h-screen bg-zinc-200 overflow-hidden flex flex-col items-center justify-center font-sans">
      <div className="absolute top-10 flex justify-between w-full px-20 z-10">
        <div className="bg-white/80 p-4 border-2 border-zinc-400 rounded shadow-sm">
          <div className="text-4xl font-black text-zinc-800">
            {time.h.toString().padStart(2, '0')}:{time.m.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">{language === 'tr' ? 'Gündüz Vardiyası' : 'Day Shift'}</div>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-600 text-white p-4 rounded shadow-lg text-center">
            <div className="text-2xl font-bold">{warningsSent}</div>
            <div className="text-[8px] uppercase">{language === 'tr' ? 'Uyarılar' : 'Warnings'}</div>
          </div>
          <div className="bg-red-700 text-white p-4 rounded shadow-lg text-center">
            <div className="text-2xl font-bold">{arrests}</div>
            <div className="text-[8px] uppercase">{language === 'tr' ? 'Gözaltılar' : 'Arrests'}</div>
          </div>
        </div>
      </div>

      <div className="relative w-3/4 h-2/3 border-x-[40px] border-t-[40px] border-zinc-500 bg-zinc-300 shadow-inner flex flex-col items-center justify-center">
        {personAtDoor ? (
          <div className="flex flex-col items-center animate-in slide-in-from-bottom-20 duration-500">
            <div className="text-8xl mb-4">👤</div>
            <button 
              onClick={handlePolice}
              className="px-12 py-6 bg-red-600 hover:bg-red-800 text-white font-black text-2xl border-4 border-red-400 animate-bounce shadow-2xl uppercase"
            >
              {language === 'tr' ? 'POLİSİ ARA!' : 'CALL POLICE!'}
            </button>
            <p className="text-red-600 font-bold mt-2 uppercase text-xs">{language === 'tr' ? 'KAPIDA YETKİSİZ ŞAHIS VAR!' : 'UNAUTHORIZED PERSON AT DOOR!'}</p>
          </div>
        ) : (
          <div className="text-zinc-400 opacity-20 text-8xl font-black select-none uppercase">{language === 'tr' ? 'PAŞABAHÇE' : 'PASABAHCE'}</div>
        )}
      </div>

      <div className="z-10 w-full h-1/3 bg-zinc-400 border-t-8 border-zinc-500 shadow-2xl flex items-center justify-center gap-12 p-8">
        <div onClick={() => setCamOpen(true)} className="w-48 h-32 bg-zinc-800 border-4 border-zinc-600 rounded cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center relative">
          {peopleInCams > 0 && (
            <div className="absolute -top-4 -right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold animate-pulse border-2 border-white">
              {peopleInCams}
            </div>
          )}
          <div className="text-blue-400 font-bold text-sm uppercase">{language === 'tr' ? 'KAMERALAR' : 'CAMERAS'}</div>
          <div className="text-[8px] text-zinc-500 uppercase">{language === 'tr' ? 'SİNYAL: %100' : 'SIGNAL: 100%'}</div>
        </div>
        <div className="flex flex-col items-center">
          <button 
            disabled={broadcastCooldown > 0}
            onClick={handleGlobalWarning}
            className={`w-64 py-6 rounded-lg border-4 font-black text-lg transition-all shadow-xl uppercase
              ${broadcastCooldown > 0 ? 'bg-zinc-500 border-zinc-600 text-zinc-400' : 'bg-orange-600 border-orange-400 text-white hover:bg-orange-500'}`}
          >
            {broadcastCooldown > 0 ? `${language === 'tr' ? 'HAZIRLANIYOR' : 'READYING'} (${broadcastCooldown})` : (language === 'tr' ? 'GENEL UYARI' : 'GLOBAL WARNING')}
          </button>
        </div>
      </div>

      {camOpen && (
        <div className="absolute inset-0 z-50 bg-white p-8 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-zinc-800 font-black tracking-tighter text-2xl uppercase">{language === 'tr' ? 'GÜVENLİK MONİTÖRÜ' : 'SECURITY MONITOR'}</h2>
            <button onClick={() => setCamOpen(false)} className="px-8 py-3 bg-zinc-800 text-white font-bold rounded uppercase">{language === 'tr' ? 'KAPAT' : 'CLOSE'}</button>
          </div>
          <div className="relative flex-1 bg-zinc-200 border-8 border-zinc-300 overflow-hidden">
             <CameraSystem 
               entities={dummyEntities}
               onClose={() => setCamOpen(false)}
               onPipeView={() => {}}
               onBottleSound={() => {}}
             />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
                {intruders.filter(i => i.pos === activeCam).map(intruder => (
                  <button 
                    key={intruder.id}
                    onClick={() => handleWarning(intruder.id)}
                    className="bg-orange-500 text-white px-6 py-3 font-bold border-b-4 border-orange-700 shadow-lg hover:bg-orange-400 transition-all uppercase"
                  >
                    {language === 'tr' ? `ŞAHIS #${intruder.id}: UYAR!` : `PERSON #${intruder.id}: WARN!`}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {time.h === 18 && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in duration-1000">
           <div className="text-blue-600 text-8xl font-black mb-4">18:00</div>
           <h2 className="text-4xl font-bold text-zinc-800 uppercase tracking-widest">{language === 'tr' ? 'MESAİ BİTTİ' : 'SHIFT OVER'}</h2>
           <p className="text-zinc-500 mt-4 uppercase text-xs">{language === 'tr' ? 'Geceye hazırlanılıyor...' : 'Preparing for night...'}</p>
        </div>
      )}
    </div>
  );
};

export default DayOffice;
