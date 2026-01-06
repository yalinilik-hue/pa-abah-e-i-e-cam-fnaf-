
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

  const [mustafaKnocking, setMustafaKnocking] = useState(false);
  const [fireKnocking, setFireKnocking] = useState(false);

  // Mustafa AI logic
  useEffect(() => {
    if (mustafaAtDoor) {
      const knockInterval = setInterval(() => {
        setMustafaKnocking(true);
        soundManager.playKnock(); // Yeni ses efekti
        setTimeout(() => setMustafaKnocking(false), 300);
      }, 3000);

      const departureTimer = setTimeout(() => {
        if (rightDoorClosed) {
          setMustafaAtDoor(false);
          soundManager.speakHuman(language === 'tr' ? "Gidiyorum torunum..." : "I'm leaving, grandson...", language);
        }
      }, 8000);

      return () => {
        clearInterval(knockInterval);
        clearTimeout(departureTimer);
      };
    }
  }, [mustafaAtDoor, rightDoorClosed, language]);

  // Fire Entity AI logic
  useEffect(() => {
    if (fireEntityAtDoor) {
      const heatInterval = setInterval(() => {
        setFireKnocking(true);
        soundManager.playMetalStress(); // Yeni ses efekti
        setTimeout(() => setFireKnocking(false), 500);
      }, 2500);

      const departureTimer = setTimeout(() => {
        if (leftDoorClosed) {
          setFireEntityAtDoor(false);
        }
      }, 7000);

      return () => {
        clearInterval(heatInterval);
        clearTimeout(departureTimer);
      };
    }
  }, [fireEntityAtDoor, leftDoorClosed]);

  // General AI spawner
  useEffect(() => {
    const aiInterval = setInterval(() => {
      if (!mustafaAtDoor && Math.random() < 0.2) setMustafaAtDoor(true);
      if (!fireEntityAtDoor && Math.random() < 0.15) setFireEntityAtDoor(true);
      if (!pipeMonsterNear && Math.random() < 0.1) {
        setPipeMonsterNear(true);
        setLavaSoundActive(true);
        soundManager.playLavaSound();
      }
    }, 4500);
    return () => clearInterval(aiInterval);
  }, [mustafaAtDoor, fireEntityAtDoor, pipeMonsterNear]);

  // Kill Logic
  useEffect(() => {
    const killCheck = setInterval(() => {
      if (mustafaAtDoor && !rightDoorClosed && view !== 'RIGHT') {
         if (Math.random() > 0.4) onLose(language === 'tr' ? "Mustafa Amca sessizce içeri sızdı!" : "Uncle Mustafa sneaked in silently!");
      }
      if (mustafaAtDoor && !rightDoorClosed && view === 'RIGHT' && !rightLight) {
         if (Math.random() > 0.7) onLose(language === 'tr' ? "Karanlıkta Mustafa Amca'ya yakalandın!" : "Caught by Uncle Mustafa in the dark!");
      }
      if (fireEntityAtDoor && !leftDoorClosed && view !== 'LEFT') {
         if (Math.random() > 0.5) onLose(language === 'tr' ? "Sol kapıdan giren ateşli varlık odayı eritti!" : "Fire Entity melted the room from the left door!");
      }
    }, 3000);
    return () => clearInterval(killCheck);
  }, [mustafaAtDoor, rightDoorClosed, fireEntityAtDoor, leftDoorClosed, view, language, onLose]);

  // Pipe Monster Flashlight Mechanic
  useEffect(() => {
    if (view === 'BACK' && backFlashlight && pipeMonsterNear) {
      setTimeout(() => {
        setPipeMonsterNear(false);
        setLavaSoundActive(false);
      }, 1500);
    }
  }, [view, backFlashlight, pipeMonsterNear]);

  useEffect(() => { if (hour === 6) onWin(); }, [hour, onWin]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden font-mono">
      {/* Ambience Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,black_100%)] z-50 pointer-events-none"></div>
      {fireEntityAtDoor && <div className="absolute inset-0 bg-orange-950/20 animate-pulse pointer-events-none z-40"></div>}
      
      {/* Main Office View */}
      <div className="w-full h-full relative flex items-center justify-center z-10">
        
        {view === 'FRONT' && (
          <div className="flex gap-48 items-center justify-center animate-in fade-in duration-500 scale-110">
            {/* Left Corridor Portal */}
            <div 
              onClick={() => setView('LEFT')}
              className={`group w-72 h-[500px] border-4 bg-zinc-950 cursor-pointer transition-all flex flex-col items-center justify-center relative shadow-2xl
                ${fireEntityAtDoor ? 'border-orange-600 shadow-[0_0_30px_orange]' : 'border-zinc-900'}`}
            >
              {fireKnocking && <div className="absolute inset-0 bg-orange-500/10 animate-ping"></div>}
              <div className="text-zinc-800 text-[10px] uppercase font-black mb-4">SOL_KORİDOR</div>
              {leftDoorClosed && <div className="absolute inset-0 bg-zinc-900 border-b-8 border-zinc-800 z-20 animate-in slide-in-from-top-full flex items-center justify-center">
                 <div className="w-1 h-32 bg-zinc-800"></div>
              </div>}
            </div>
            
            <div className="flex flex-col items-center gap-12">
               <div className="text-8xl text-red-600 font-black animate-pulse tracking-tighter drop-shadow-[0_0_20px_red]">{hour} AM</div>
               <div className="w-40 h-40 bg-zinc-900 border-4 border-zinc-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800 transition-all group"
                    onClick={() => setView('BACK')}>
                  <div className="text-[10px] text-zinc-600 uppercase font-black mb-2 group-hover:text-red-500">MONİTÖR</div>
                  <div className={`w-20 h-12 bg-black border-2 relative overflow-hidden ${pipeMonsterNear ? 'border-amber-500 shadow-[0_0_10px_amber]' : 'border-zinc-800'}`}>
                     <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                  </div>
               </div>
            </div>

            {/* Right Corridor Portal */}
            <div 
              onClick={() => setView('RIGHT')}
              className={`group w-72 h-[500px] border-4 bg-zinc-950 cursor-pointer transition-all flex flex-col items-center justify-center relative shadow-2xl
                ${mustafaAtDoor ? 'border-red-600 shadow-[0_0_30px_red]' : 'border-zinc-900'}`}
            >
              {mustafaKnocking && <div className="absolute inset-0 bg-red-500/10 animate-ping"></div>}
              <div className="text-zinc-800 text-[10px] uppercase font-black mb-4">SAĞ_KORİDOR</div>
              {rightDoorClosed && <div className="absolute inset-0 bg-zinc-900 border-b-8 border-zinc-800 z-20 animate-in slide-in-from-top-full flex items-center justify-center">
                 <div className="w-1 h-32 bg-zinc-800"></div>
              </div>}
            </div>
          </div>
        )}

        {view === 'LEFT' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 animate-in fade-in duration-300">
             <div className={`relative w-2/3 h-4/5 border-[30px] border-zinc-900 transition-colors duration-200 shadow-[0_0_150px_black] ${leftLight ? 'bg-zinc-800/50' : 'bg-black'} ${fireKnocking ? 'translate-x-1' : ''}`}>
                {leftLight && fireEntityAtDoor && (
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="text-orange-500 text-[15rem] filter blur-2xl opacity-40 animate-pulse">🔥</div>
                  </div>
                )}
                {leftDoorClosed && <div className="absolute inset-0 bg-zinc-900 border-x-[15px] border-zinc-800 z-30 animate-in slide-in-from-top-full"></div>}
             </div>
             <div className="mt-12 flex gap-10 z-[60]">
                <button onMouseDown={() => setLeftLight(true)} onMouseUp={() => setLeftLight(false)} className={`px-12 py-6 border-4 font-black uppercase ${leftLight ? 'bg-white text-black border-white shadow-[0_0_30px_white]' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>IŞIK</button>
                <button onClick={() => setLeftDoorClosed(!leftDoorClosed)} className={`px-12 py-6 border-4 font-black uppercase ${leftDoorClosed ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-900 text-red-700 border-red-900'}`}>{leftDoorClosed ? 'AÇ' : 'KAPAT'}</button>
                <button onClick={() => setView('FRONT')} className="px-12 py-6 bg-zinc-100 text-black font-black uppercase">Geri Dön</button>
             </div>
          </div>
        )}

        {view === 'RIGHT' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 animate-in fade-in duration-300">
             <div className={`relative w-2/3 h-4/5 border-[30px] border-zinc-900 transition-colors duration-200 shadow-[0_0_150px_black] ${rightLight ? 'bg-zinc-800/50' : 'bg-black'} ${mustafaKnocking ? 'translate-x-1' : ''}`}>
                {rightLight && mustafaAtDoor && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <div className="text-zinc-600 text-[20rem] opacity-30 filter grayscale blur-sm">👤</div>
                     <div className="bg-black/80 px-8 py-4 border-2 border-white animate-bounce">
                        <p className="text-white font-black text-2xl uppercase italic tracking-tighter">"Torunum tık tık tık..."</p>
                     </div>
                  </div>
                )}
                {rightDoorClosed && <div className="absolute inset-0 bg-zinc-900 border-x-[15px] border-zinc-800 z-30 animate-in slide-in-from-top-full"></div>}
             </div>
             <div className="mt-12 flex gap-10 z-[60]">
                <button onMouseDown={() => setRightLight(true)} onMouseUp={() => setRightLight(false)} className={`px-12 py-6 border-4 font-black uppercase ${rightLight ? 'bg-white text-black border-white shadow-[0_0_30px_white]' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>IŞIK</button>
                <button onClick={() => setRightDoorClosed(!rightDoorClosed)} className={`px-12 py-6 border-4 font-black uppercase ${rightDoorClosed ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-900 text-red-700 border-red-900'}`}>{rightDoorClosed ? 'AÇ' : 'KAPAT'}</button>
                <button onClick={() => setView('FRONT')} className="px-12 py-6 bg-zinc-100 text-black font-black uppercase">Geri Dön</button>
             </div>
          </div>
        )}

        {view === 'BACK' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black animate-in fade-in duration-300">
             <div className="relative w-4/5 h-2/3 border-[15px] border-zinc-900 bg-zinc-950 shadow-[inset_0_0_100px_black] overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] pointer-events-none z-40"></div>
                {pipeMonsterNear && (
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${backFlashlight ? 'opacity-100' : 'opacity-0'}`}>
                     <div className="w-96 h-96 rounded-full border-[30px] border-amber-950 bg-black flex items-center justify-center">
                        <div className="text-red-700 text-[10rem] animate-ping opacity-80">👁️</div>
                     </div>
                  </div>
                )}
                {!backFlashlight && <div className="absolute inset-0 bg-black/95 z-10 pointer-events-none"></div>}
             </div>
             <div className="mt-12 flex gap-10 z-[60]">
                <button onMouseDown={() => setBackFlashlight(true)} onMouseUp={() => setBackFlashlight(false)} className={`px-20 py-8 border-4 font-black text-2xl uppercase ${backFlashlight ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>FENER (TUT)</button>
                <button onClick={() => setView('FRONT')} className="px-20 py-8 bg-zinc-100 text-black font-black text-2xl uppercase">Öne Dön</button>
             </div>
          </div>
        )}

      </div>

      {/* Warning indicators for Front View */}
      {view === 'FRONT' && (
        <div className="absolute bottom-10 flex gap-10">
           <div className={`flex flex-col items-center ${mustafaAtDoor ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`w-4 h-4 rounded-full ${mustafaKnocking ? 'bg-red-500 animate-ping' : 'bg-red-900'}`}></div>
              <div className="text-[8px] text-zinc-600 mt-2 font-black uppercase tracking-widest">MUSTAFA</div>
           </div>
           <div className={`flex flex-col items-center ${fireEntityAtDoor ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`w-4 h-4 rounded-full ${fireKnocking ? 'bg-orange-500 animate-ping' : 'bg-orange-900'}`}></div>
              <div className="text-[8px] text-zinc-600 mt-2 font-black uppercase tracking-widest">ATEŞLİ</div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Level8SecurityRoom;
