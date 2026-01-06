
import React, { useState, useEffect, useRef } from 'react';
import { Entity, Language } from '../types';
import CameraSystem from './CameraSystem';
import { soundManager } from './SoundManager';
import AILounge from './AILounge';

interface OfficeProps {
  language: Language;
  night: number;
  hour: number;
  entities: Entity[];
  setEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  onGameOver: (reason: string) => void;
  onWin: () => void;
  cheatActive?: boolean;
  entityMode?: boolean;
  selectedEntityId?: number;
}

const Office: React.FC<OfficeProps> = ({ language, night, hour, entities, setEntities, onGameOver, onWin, cheatActive, entityMode, selectedEntityId }) => {
  const [doorOpen, setDoorOpen] = useState(true);
  const [camOpen, setCamOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [pipeTimer, setPipeTimer] = useState(15);
  const [lookingAtPipe, setLookingAtPipe] = useState(false);
  const [activeCam, setActiveCam] = useState(1);
  const [entityVictory, setEntityVictory] = useState(false);
  
  const moveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const threatAtDoor = entities.some(e => e.position === 7);

  useEffect(() => {
    if (threatAtDoor && camOpen) {
      setCamOpen(false);
      soundManager.speakHuman(language === 'tr' ? "SİSTEM KESİLDİ: YAKIN TEMAS" : "SYSTEM INTERRUPTED: CLOSE CONTACT", language);
    }
  }, [threatAtDoor, camOpen, language]);

  useEffect(() => {
    moveIntervalRef.current = setInterval(() => {
      setEntities(prev => prev.map(entity => {
        if (entityMode && entity.id === selectedEntityId) return entity;
        if (Math.random() * 20 < entity.aggressive) {
          const nextPos = entity.position + 1;
          if (nextPos === 7) {
             soundManager.playEntityWhisper(language);
             return { ...entity, position: 7 };
          }
          if (entity.position === 7 && doorOpen) {
            onGameOver(language === 'tr' ? `Varlık ${entity.id + 1} seni yakaladı!` : `Entity ${entity.id + 1} caught you!`);
          }
          if (entity.position === 7 && !doorOpen) {
            return { ...entity, position: 1 };
          }
          return { ...entity, position: Math.min(7, nextPos) };
        }
        return entity;
      }));
    }, 4000);
    return () => { if (moveIntervalRef.current) clearInterval(moveIntervalRef.current); };
  }, [doorOpen, onGameOver, setEntities, language, entityMode, selectedEntityId]);

  const handleEntityAttackAction = () => {
    setEntityVictory(true);
    soundManager.playScream();
    // Varlık kazandığında ödül (negatif ödül veya sadece başarı ekranı)
    setTimeout(onWin, 5000);
  };

  const isFinalHour = hour === 6;

  if (entityVictory) {
    return (
      <div className="w-full h-full bg-red-600 flex flex-col items-center justify-center animate-pulse overflow-hidden">
        <div className="text-[15rem] font-black text-black opacity-30 absolute inset-0 flex items-center justify-center select-none uppercase">VICTORY</div>
        <div className="z-10 bg-black text-red-600 p-20 border-8 border-red-500 shadow-[0_0_100px_rgba(255,0,0,1)] rotate-3">
           <h1 className="text-8xl font-black mb-4 italic uppercase tracking-tighter">VARLIK BAŞARISI</h1>
           <p className="text-white font-black text-center text-xl tracking-widest">{language === 'tr' ? 'FABRİKA ARTIK SENİN' : 'FACTORY IS YOURS'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden transition-colors duration-1000 ${isFinalHour ? 'bg-red-950/20' : 'bg-zinc-900'}`}>
      
      {/* P.A.S.A Assistant Button */}
      <div className="absolute top-10 right-10 z-50">
        <button 
          onClick={() => setAiOpen(true)}
          className="w-16 h-16 bg-cyan-600 border-4 border-cyan-400 rounded-full flex items-center justify-center text-white font-black shadow-[0_0_20px_cyan] animate-pulse hover:scale-110 transition-all"
        >
          AI
        </button>
      </div>

      <div className={`absolute inset-0 flex transition-all duration-700 ${doorOpen ? 'bg-zinc-800' : 'bg-zinc-950 border-r-8 border-zinc-900'}`}>
        <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-1/2 h-2/3 border-8 border-zinc-700 rounded-xl bg-zinc-900 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
                <div className="text-zinc-600 mb-6 font-black tracking-widest text-xl italic uppercase font-mono">GÜVENLİK TERMİNALİ</div>
                <div className="bg-black w-4/5 h-1/2 border-4 border-zinc-800 flex items-center justify-center relative overflow-hidden shadow-inner">
                   <div className="text-center">
                     <p className="text-[12px] text-blue-500 font-mono tracking-widest animate-pulse uppercase">{threatAtDoor ? 'TEHLİKE KAPIDA!' : (isFinalHour ? 'KAPATMAYA HAZIR' : 'SİSTEM_AKTİF')}</p>
                   </div>
                </div>
            </div>
        </div>
      </div>

      <div className="absolute left-16 top-1/2 -translate-y-1/2 flex flex-col gap-8">
        <button onClick={() => setDoorOpen(!doorOpen)} className={`px-12 py-10 border-8 font-black text-xl transition-all shadow-2xl ${doorOpen ? 'border-zinc-700 text-zinc-600' : 'border-red-600 bg-red-950 text-red-500 animate-pulse'}`}>
          {doorOpen ? 'KAPIYI KİLİTLE' : 'KAPI KİLİTLİ'}
        </button>
      </div>

      <div className="absolute top-12 left-12 space-y-4 font-black p-6 bg-black/40 border-l-4 border-green-500">
        <div className={`text-6xl ${isFinalHour ? 'text-red-500 animate-bounce' : 'text-white'} tracking-tighter`}>{hour} AM</div>
        <div className="text-2xl text-zinc-500 uppercase tracking-widest">GECE NÖBETİ</div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-12 bg-zinc-800 border-t-4 border-zinc-600 rounded-t-3xl flex items-center justify-center cursor-pointer hover:h-16 transition-all group"
           onClick={() => !threatAtDoor && setCamOpen(true)}>
          <span className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">{threatAtDoor ? 'SİSTEM HATASI' : 'MONİTÖR'}</span>
      </div>

      {camOpen && (
        <CameraSystem 
          entities={entities} 
          setEntities={setEntities} 
          onClose={() => setCamOpen(false)} 
          onPipeView={(active) => setLookingAtPipe(active)} 
          onBottleSound={() => {}} 
          onCamChange={setActiveCam} 
          pipeTimer={pipeTimer} 
          entityMode={entityMode} 
          selectedEntityId={selectedEntityId} 
          onEntityAttackGuard={handleEntityAttackAction}
        />
      )}
      
      {aiOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-12">
           <AILounge language={language} onBack={() => setAiOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Office;
