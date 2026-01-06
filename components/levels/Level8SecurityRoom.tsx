
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { soundManager } from '../SoundManager';

interface Level8Props {
  language: Language;
  hour: number;
  onWin: () => void;
  onLose: (reason: string) => void;
}

const Level8SecurityRoom: React.FC<Level8Props> = ({ language, hour, onWin, onLose }) => {
  const [view, setView] = useState<'FRONT' | 'LEFT' | 'RIGHT' | 'BACK'>('FRONT');
  const [leftDoorClosed, setLeftDoorClosed] = useState(false);
  const [rightDoorClosed, setRightDoorClosed] = useState(false);
  const [leftLight, setLeftLight] = useState(false);
  const [rightLight, setRightLight] = useState(false);
  const [backFlashlight, setBackFlashlight] = useState(false);
  
  const [mustafaAtDoor, setMustafaAtDoor] = useState(false);
  const [fireEntityAtDoor, setFireEntityAtDoor] = useState(false);
  const [pipeMonsterNear, setPipeMonsterNear] = useState(false);
  const [lavaSoundActive, setLavaSoundActive] = useState(false);

  // Entities AI and Audio triggers
  useEffect(() => {
    const aiInterval = setInterval(() => {
      // Mustafa (Right)
      if (!mustafaAtDoor && Math.random() < 0.25) {
        setMustafaAtDoor(true);
      }

      // Fire Entity (Left)
      if (!fireEntityAtDoor && Math.random() < 0.2) {
        setFireEntityAtDoor(true);
      }

      // Pipe Monster (Back - Monitor)
      if (!pipeMonsterNear && Math.random() < 0.15) {
        setPipeMonsterNear(true);
        setLavaSoundActive(true);
        soundManager.playLavaSound();
      }
    }, 5000);

    return () => clearInterval(aiInterval);
  }, [mustafaAtDoor, fireEntityAtDoor, pipeMonsterNear]);

  // Handle Mustafa Voice Line
  useEffect(() => {
    if (mustafaAtDoor && rightLight && view === 'RIGHT') {
      soundManager.speakHuman("Torunum aç kapıyı", "tr");
    }
  }, [mustafaAtDoor, rightLight, view]);

  // Kill Logic
  useEffect(() => {
    const killCheck = setInterval(() => {
      // Mustafa jumpscare if door is open too long while he is there
      if (mustafaAtDoor && !rightDoorClosed) {
        // Probability to die increases
        if (Math.random() > 0.5) {
          onLose(language === 'tr' ? "Mustafa Amca içeri girdi: 'Sana aç demiştim torunum...'" : "Uncle Mustafa entered: 'I told you to open, grandson...'");
        }
      }
      
      if (fireEntityAtDoor && !leftDoorClosed) {
        if (Math.random() > 0.5) {
          onLose(language === 'tr' ? "Ateşli Varlık fabrikayı kül etti!" : "Fire Entity burned down the factory!");
        }
      }

      // Pipe Monster is only countered by monitor and light
      if (pipeMonsterNear && view !== 'BACK') {
        // Warning stage (lav sesi)
      }
    }, 4000);

    return () => clearInterval(killCheck);
  }, [mustafaAtDoor, rightDoorClosed, fireEntityAtDoor, leftDoorClosed, pipeMonsterNear, view, language, onLose]);

  // Pipe Monster Flashlight Mechanic
  useEffect(() => {
    if (view === 'BACK' && backFlashlight && pipeMonsterNear) {
      setTimeout(() => {
        setPipeMonsterNear(false);
        setLavaSoundActive(false);
        soundManager.speakHuman(language === 'tr' ? "Geri çekildi." : "It retreated.", language);
      }, 1500);
    }
  }, [view, backFlashlight, pipeMonsterNear, language]);

  // Win condition
  useEffect(() => {
    if (hour === 6) onWin();
  }, [hour, onWin]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden font-mono cursor-default">
      {/* Lava Visual Glitch */}
      {lavaSoundActive && (
        <div className="absolute inset-0 bg-red-900/5 animate-pulse pointer-events-none z-0"></div>
      )}

      {/* Office Surroundings */}
      <div className="w-full h-full relative flex items-center justify-center z-10">
        
        {/* FRONT VIEW */}
        {view === 'FRONT' && (
          <div className="flex gap-48 items-center justify-center animate-in fade-in duration-500">
            {/* Left Corridor Portal */}
            <div 
              onClick={() => setView('LEFT')}
              className="group w-72 h-[500px] border-4 border-zinc-900 bg-zinc-950 cursor-pointer hover:border-zinc-700 transition-all flex flex-col items-center justify-center relative shadow-2xl"
            >
              <div className="text-zinc-800 text-[10px] uppercase font-black mb-4">SOL_KORİDOR</div>
              <div className="w-1 h-20 bg-zinc-800 group-hover:bg-zinc-600"></div>
              {leftDoorClosed && <div className="absolute inset-0 bg-zinc-900 border-b-8 border-zinc-800 z-20 animate-in slide-in-from-top-full"></div>}
            </div>
            
            <div className="flex flex-col items-center gap-12">
               <div className="text-6xl text-white font-black animate-pulse tracking-tighter">{hour} AM</div>
               <div className="flex flex-col gap-4">
                  <div className="w-40 h-40 bg-zinc-900 border-4 border-zinc-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800 transition-all group"
                       onClick={() => setView('BACK')}>
                     <div className="text-[10px] text-zinc-600 uppercase font-black mb-2 group-hover:text-red-500">MONİTÖR</div>
                     <div className="w-20 h-12 bg-black border-2 border-zinc-800 relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                     </div>
                  </div>
                  <p className="text-zinc-700 text-[8px] text-center uppercase tracking-widest">ARKA_BORU_SİSTEMİ</p>
               </div>
            </div>

            {/* Right Corridor Portal */}
            <div 
              onClick={() => setView('RIGHT')}
              className="group w-72 h-[500px] border-4 border-zinc-900 bg-zinc-950 cursor-pointer hover:border-zinc-700 transition-all flex flex-col items-center justify-center relative shadow-2xl"
            >
              <div className="text-zinc-800 text-[10px] uppercase font-black mb-4">SAĞ_KORİDOR</div>
              <div className="w-1 h-20 bg-zinc-800 group-hover:bg-zinc-600"></div>
              {rightDoorClosed && <div className="absolute inset-0 bg-zinc-900 border-b-8 border-zinc-800 z-20 animate-in slide-in-from-top-full"></div>}
            </div>
          </div>
        )}

        {/* LEFT VIEW */}
        {view === 'LEFT' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 animate-in fade-in duration-300">
             <div className={`relative w-2/3 h-4/5 border-[30px] border-zinc-900 transition-colors duration-200 shadow-[0_0_100px_black] ${leftLight ? 'bg-zinc-800' : 'bg-black'}`}>
                {leftLight && fireEntityAtDoor && (
                  <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                     <div className="text-[15rem] filter blur-xl opacity-30 text-orange-600">🔥</div>
                     <div className="text-orange-500 text-9xl font-black italic absolute bottom-20">ATEŞLİ_VARLIK</div>
                  </div>
                )}
                {leftDoorClosed && <div className="absolute inset-0 bg-zinc-900 border-x-[15px] border-zinc-800 z-30 animate-in slide-in-from-top-full"></div>}
             </div>

             <div className="mt-12 flex gap-10">
                <button 
                   onMouseDown={() => setLeftLight(true)} onMouseUp={() => setLeftLight(false)}
                   className={`px-12 py-6 border-4 font-black uppercase transition-all ${leftLight ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}
                >
                   IŞIK (TIKLA)
                </button>
                <button 
                   onClick={() => setLeftDoorClosed(!leftDoorClosed)}
                   className={`px-12 py-6 border-4 font-black uppercase transition-all ${leftDoorClosed ? 'bg-red-600 text-white border-white animate-pulse' : 'bg-zinc-900 text-red-700 border-red-900'}`}
                >
                   {leftDoorClosed ? 'AÇ' : 'KAPAT'}
                </button>
                <button onClick={() => setView('FRONT')} className="px-12 py-6 bg-zinc-200 text-black font-black uppercase">Geri Dön</button>
             </div>
          </div>
        )}

        {/* RIGHT VIEW */}
        {view === 'RIGHT' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 animate-in fade-in duration-300">
             <div className={`relative w-2/3 h-4/5 border-[30px] border-zinc-900 transition-colors duration-200 shadow-[0_0_100px_black] ${rightLight ? 'bg-zinc-800' : 'bg-black'}`}>
                {rightLight && mustafaAtDoor && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <div className="text-zinc-200 text-[18rem] opacity-20 filter grayscale blur-sm">👤</div>
                     <div className="bg-black/80 px-8 py-4 border-2 border-white animate-bounce">
                        <p className="text-white font-black text-2xl uppercase italic tracking-tighter">"Torunum aç kapıyı..."</p>
                     </div>
                  </div>
                )}
                {rightDoorClosed && <div className="absolute inset-0 bg-zinc-900 border-x-[15px] border-zinc-800 z-30 animate-in slide-in-from-top-full"></div>}
             </div>

             <div className="mt-12 flex gap-10">
                <button 
                   onMouseDown={() => setRightLight(true)} onMouseUp={() => setRightLight(false)}
                   className={`px-12 py-6 border-4 font-black uppercase transition-all ${rightLight ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}
                >
                   IŞIK (TIKLA)
                </button>
                <button 
                   onClick={() => setRightDoorClosed(!rightDoorClosed)}
                   className={`px-12 py-6 border-4 font-black uppercase transition-all ${rightDoorClosed ? 'bg-red-600 text-white border-white animate-pulse' : 'bg-zinc-900 text-red-700 border-red-900'}`}
                >
                   {rightDoorClosed ? 'AÇ' : 'KAPAT'}
                </button>
                <button onClick={() => setView('FRONT')} className="px-12 py-6 bg-zinc-200 text-black font-black uppercase">Geri Dön</button>
             </div>
          </div>
        )}

        {/* BACK VIEW (Monitor) */}
        {view === 'BACK' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black animate-in fade-in duration-300">
             <div className="absolute top-10 left-1/2 -translate-x-1/2 text-red-600 font-black tracking-widest text-xs uppercase animate-pulse">MONİTÖR: ARKA_BORU_HATTI</div>
             
             <div className="relative w-4/5 h-2/3 border-[15px] border-zinc-900 bg-zinc-950 shadow-[inset_0_0_100px_black] overflow-hidden">
                {/* CRT Effect Overlay */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] pointer-events-none z-40"></div>
                
                {/* Pipe Monster Shadow */}
                {pipeMonsterNear && (
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${backFlashlight ? 'opacity-100 scale-100' : 'opacity-5 scale-90 blur-sm'}`}>
                     <div className="w-96 h-96 rounded-full border-[30px] border-amber-950 bg-black flex items-center justify-center">
                        <div className="text-red-700 text-[10rem] animate-ping opacity-80">👁️</div>
                     </div>
                     <div className="absolute bottom-10 text-red-600 font-black italic tracking-widest text-xl uppercase">BORU_CANAVARI_TESPİT_EDİLDİ</div>
                  </div>
                )}

                {/* Darkness filter */}
                {!backFlashlight && <div className="absolute inset-0 bg-black/90 z-10 pointer-events-none"></div>}
             </div>

             <div className="mt-12 flex gap-10">
                <button 
                   onMouseDown={() => setBackFlashlight(true)} onMouseUp={() => setBackFlashlight(false)}
                   className={`px-20 py-8 border-4 font-black text-2xl uppercase tracking-widest transition-all shadow-2xl ${backFlashlight ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}
                >
                   FENER (TUT)
                </button>
                <button onClick={() => setView('FRONT')} className="px-20 py-8 bg-zinc-100 text-black font-black text-2xl uppercase">Öne Dön</button>
             </div>

             {lavaSoundActive && (
               <div className="mt-6 text-orange-500 font-black animate-bounce text-sm uppercase tracking-[0.5em] italic">
                  * LAV SESİ (FOKURDAMA) GELİYOR! *
               </div>
             )}
          </div>
        )}

      </div>

      {/* Warning indicators for Front View */}
      {view === 'FRONT' && (
        <div className="absolute bottom-10 flex gap-4">
           {mustafaAtDoor && <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>}
           {fireEntityAtDoor && <div className="w-3 h-3 bg-orange-600 rounded-full animate-ping"></div>}
           {pipeMonsterNear && <div className="w-3 h-3 bg-amber-600 rounded-full animate-ping"></div>}
        </div>
      )}
    </div>
  );
};

export default Level8SecurityRoom;
