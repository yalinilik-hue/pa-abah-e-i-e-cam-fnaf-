
import React, { useState, useEffect } from 'react';
import { Entity } from '../types';

interface CameraSystemProps {
  entities: Entity[];
  onClose: () => void;
  onPipeView: (active: boolean) => void;
  onBottleSound: () => void;
  onCamChange?: (id: number) => void;
  pipeTimer?: number;
  entityMode?: boolean;
  selectedEntityId?: number;
  setEntities?: React.Dispatch<React.SetStateAction<Entity[]>>;
}

const CameraSystem: React.FC<CameraSystemProps> = ({ entities, onClose, onPipeView, onBottleSound, onCamChange, pipeTimer = 10, entityMode, selectedEntityId, setEntities }) => {
  const [activeCam, setActiveCam] = useState(1);
  const [vModeActive, setVModeActive] = useState(false);

  const cams = [
    { id: 1, name: "Ana Hol", x: 180, y: 150 },
    { id: 2, name: "Eritme Bölümü", x: 100, y: 120 },
    { id: 3, name: "Paketleme", x: 100, y: 200 },
    { id: 4, name: "Terk Edilmiş Yapı", x: 20, y: 100 },
    { id: 5, name: "BÜYÜK BORU", x: 180, y: 230 },
    { id: 6, name: "Ofis Koridoru", x: 240, y: 110 },
    { id: 7, name: "Kat", x: 240, y: 180 },
    { id: 8, name: "OFİS ÖNÜ", x: 260, y: 220 },
  ];

  const handleCamClick = (id: number) => {
    if (entityMode && setEntities && selectedEntityId !== undefined) {
      // VARLIK IŞINLAMA: Seçili varlığı o kameraya taşı
      setEntities(prev => prev.map(e => {
        if (e.id === selectedEntityId) {
          // Pozisyon 7 ofis kapısıdır
          let targetPos = id;
          if (id === 4) targetPos = 3;
          if (id === 6) targetPos = 4;
          if (id === 7) targetPos = 5;
          if (id === 8) targetPos = 7; // Ofis önü -> Kapı
          return { ...e, position: targetPos };
        }
        return e;
      }));
      setActiveCam(id);
    } else {
      setActiveCam(id);
      onPipeView(id === 5);
      if (onCamChange) onCamChange(id);
    }
  };

  const entitiesInCam = entities.filter(e => {
    if (vModeActive) return true;
    if (activeCam === 4) return e.position === 3; 
    if (activeCam === 6) return e.position === 4; 
    if (activeCam === 7) return e.position === 5; 
    if (activeCam === 8) return e.position === 7; // Ofis önü kamerası 7. pozisyonu gösterir
    return e.position === activeCam;
  });

  return (
    <div className={`absolute inset-0 z-[60] flex flex-col p-6 ${entityMode ? 'bg-red-950/40 backdrop-blur-sm' : 'bg-black/95'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`text-2xl font-black uppercase tracking-tighter ${entityMode ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
          {entityMode ? `KONTROL: VARLIK ${selectedEntityId! + 1}` : `CAM ${activeCam}: ${cams.find(c => c.id === activeCam)?.name}`}
        </div>
        <div className="flex gap-4">
           <button onClick={onClose} className="px-6 py-2 bg-red-600 text-white font-black hover:bg-red-500 uppercase italic">SİSTEMDEN ÇIK</button>
        </div>
      </div>

      <div className={`flex-1 relative border-4 overflow-hidden ${entityMode ? 'border-red-900' : 'border-zinc-800 bg-zinc-900 shadow-inner'}`}>
        {entityMode && <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none z-10"></div>}
        
        <div className="w-full h-full p-10 overflow-y-auto">
          {entitiesInCam.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {entitiesInCam.map(e => (
                <div key={e.id} className={`flex flex-col items-center p-4 border-2 bg-black/40 group relative ${e.id === selectedEntityId && entityMode ? 'border-blue-500 shadow-[0_0_15px_blue]' : 'border-zinc-800'}`}>
                  <div className="w-20 h-40 border-4 border-zinc-700 bg-zinc-800 rounded-t-full relative">
                      <div className="absolute top-8 flex justify-between w-full px-4">
                        <div className={`w-2 h-2 rounded-full ${entityMode && e.id === selectedEntityId ? 'bg-blue-400 animate-ping' : 'bg-red-600 shadow-[0_0_100px_red]'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${entityMode && e.id === selectedEntityId ? 'bg-blue-400 animate-ping' : 'bg-red-600 shadow-[0_0_100px_red]'}`}></div>
                      </div>
                  </div>
                  <div className="mt-3 text-[9px] text-zinc-500 font-mono">VARLIK_{e.id+1} | {e.id === selectedEntityId && "(SENSİN)"}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center italic text-4xl font-black text-zinc-800/20 uppercase tracking-[1em]">TEMİZ_BÖLGE</div>
          )}
        </div>

        <div className="absolute bottom-6 right-6 w-72 h-72 bg-black/80 border-2 border-zinc-800 p-4 shadow-2xl">
           <div className="relative w-full h-full">
              <svg className="absolute inset-0 w-full h-full stroke-zinc-800 stroke-2 fill-none opacity-40">
                <line x1="180" y1="150" x2="100" y2="120" /><line x1="100" y1="120" x2="20" y2="100" /><line x1="100" y1="120" x2="100" y2="200" />
                <line x1="180" y1="150" x2="180" y2="230" /><line x1="180" y1="150" x2="240" y2="110" /><line x1="240" y1="110" x2="240" y2="180" />
                <line x1="240" y1="180" x2="260" y2="220" />
              </svg>
              {cams.map(cam => (
                <button
                  key={cam.id}
                  onClick={() => handleCamClick(cam.id)}
                  className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 border-2 flex items-center justify-center font-black text-[8px] transition-all
                    ${activeCam === cam.id ? 'bg-red-600 border-white text-white' : 'bg-black border-zinc-700 text-zinc-500 hover:border-blue-500'}`}
                  style={{ left: cam.x, top: cam.y }}
                >
                  C{cam.id}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 md:grid-cols-8 gap-2">
         {cams.map(cam => (
           <button 
             key={cam.id} 
             onClick={() => handleCamClick(cam.id)}
             className={`py-3 font-black text-[8px] border-2 uppercase transition-all
               ${activeCam === cam.id ? 'bg-red-700 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
           >
             {entityMode ? `IŞINLAN: CAM ${cam.id}` : `IZLE: CAM ${cam.id}`}
           </button>
         ))}
      </div>
    </div>
  );
};

export default CameraSystem;
