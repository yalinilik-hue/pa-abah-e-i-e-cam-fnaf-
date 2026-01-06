
import React, { useState, useEffect } from 'react';
import { Entity, Language } from '../types';
import { soundManager } from './SoundManager';
import CameraSystem from './CameraSystem';
import AILounge from './AILounge';

interface NewOfficeProps {
  language: Language;
  night: number;
  hour: number;
  entities: Entity[];
  setEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  onGameOver: (r: string) => void;
  cheatActive?: boolean;
}

const NewOffice: React.FC<NewOfficeProps> = ({ language, night, hour, entities, onGameOver, setEntities, cheatActive }) => {
  const [maskActive, setMaskActive] = useState(false);
  const [camOpen, setCamOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [threatInOffice, setThreatInOffice] = useState(false);
  const [pipeTimer, setPipeTimer] = useState(20);
  const [activeCam, setActiveCam] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (threatInOffice && camOpen) setCamOpen(false);
  }, [threatInOffice, camOpen]);

  useEffect(() => {
    const moveEntities = setInterval(() => {
      setEntities(prev => prev.map(entity => {
        if (Math.random() * 20 < entity.aggressive) {
          const nextPos = entity.position + 1;
          if (nextPos >= 5) {
             setThreatInOffice(true);
             soundManager.playEntityWhisper(language);
             return { ...entity, position: 5 };
          }
          return { ...entity, position: nextPos };
        }
        return entity;
      }));
    }, 5000);

    const checkDeath = setInterval(() => {
      if (threatInOffice && !maskActive) onGameOver(language === 'tr' ? "Varlık ofise girdi!" : "Entity entered the office!");
      else if (threatInOffice && maskActive) {
          setThreatInOffice(false);
          setEntities(prev => prev.map(e => e.position === 5 ? { ...e, position: 1 } : e));
      }
    }, 2000);

    const pipeCountdown = setInterval(() => {
      setPipeTimer(prev => {
        if (prev <= 0) { onGameOver(language === 'tr' ? "BORU PATLADI!" : "PIPE EXPLODED!"); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => { clearInterval(moveEntities); clearInterval(checkDeath); clearInterval(pipeCountdown); };
  }, [maskActive, threatInOffice, language, onGameOver, setEntities]);

  const handleSpinBottle = () => {
    setIsSpinning(true);
    setPipeTimer(20);
    soundManager.playLavaSound();
    setTimeout(() => setIsSpinning(false), 500);
  };

  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden flex flex-col items-center justify-center">
      {/* AI Assistant Button */}
      <div className="absolute top-10 right-32 z-50">
        <button 
          onClick={() => setAiOpen(true)}
          className="w-12 h-12 bg-cyan-700 border-2 border-cyan-500 rounded-full flex items-center justify-center text-white font-black shadow-[0_0_15px_cyan] animate-pulse"
        >
          AI
        </button>
      </div>

      <div className="absolute top-10 left-10 text-white font-black p-4 border-l-4 border-blue-500 bg-black/50 z-20">
        <div className={`text-6xl tracking-tighter ${hour === 6 ? 'text-green-500 animate-pulse' : 'text-white'}`}>{hour} AM</div>
        <div className="text-xs text-blue-400 mt-1 uppercase font-mono tracking-widest italic">FULL_VARLIK_MODE_V2</div>
      </div>

      <div className="absolute top-10 right-10 flex flex-col items-end z-20">
         <div className="text-[10px] text-red-500 font-black uppercase mb-2 tracking-widest">BORU BASINCI</div>
         <div className="w-64 h-4 bg-zinc-900 border-2 border-zinc-800 rounded-full overflow-hidden shadow-2xl">
            <div className={`h-full transition-all duration-1000 ${pipeTimer < 5 ? 'bg-red-600 animate-pulse' : 'bg-amber-500'}`} style={{ width: `${(pipeTimer / 20) * 100}%` }}></div>
         </div>
      </div>

      <div className="w-4/5 h-2/3 border-8 border-zinc-800 bg-zinc-900 shadow-[inset_0_0_100px_black] relative flex items-center justify-center overflow-hidden">
         {threatInOffice && <div className="absolute bottom-0 w-32 h-[80%] bg-zinc-950 border-x-4 border-zinc-800 animate-in slide-in-from-bottom-full z-10"></div>}
         <div className="relative flex flex-col items-center group" onClick={handleSpinBottle}>
            <div className={`w-24 h-48 bg-amber-900 border-4 border-amber-700 rounded-t-full cursor-pointer transition-transform duration-500 hover:scale-110 relative shadow-2xl ${isSpinning ? 'rotate-[360deg]' : ''} ${pipeTimer < 5 ? 'animate-bounce border-red-500 shadow-[0_0_30px_red]' : ''}`}>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-[10px] text-center uppercase pointer-events-none">ÇEVİR</div>
            </div>
         </div>
      </div>

      <div className="absolute bottom-0 w-full h-32 bg-zinc-900 border-t-4 border-zinc-800 flex justify-center items-center gap-12 px-12 z-40">
         <button onMouseDown={() => setMaskActive(true)} onMouseUp={() => setMaskActive(false)} className={`px-16 py-5 border-4 font-black uppercase transition-all shadow-xl ${maskActive ? 'bg-zinc-100 text-black border-white' : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-white'}`}>MASKE</button>
         <button onClick={() => !threatInOffice && setCamOpen(true)} className={`px-16 py-5 border-4 font-black uppercase transition-all shadow-xl ${threatInOffice ? 'bg-zinc-800 border-zinc-700 text-zinc-600' : 'bg-blue-700 border-blue-400 text-white hover:bg-blue-600'}`}>KAMERALAR</button>
      </div>

      {camOpen && <CameraSystem entities={entities} onClose={() => setCamOpen(false)} onPipeView={() => {}} onBottleSound={() => setPipeTimer(20)} onCamChange={setActiveCam} />}
      {aiOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-12">
           <AILounge language={language} onBack={() => setAiOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default NewOffice;
