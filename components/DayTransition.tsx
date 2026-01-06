
import React from 'react';

const DayTransition: React.FC<{ night: number }> = ({ night }) => {
  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center animate-pulse">
      <div className="text-zinc-600 uppercase tracking-widest text-sm mb-4">Paşabahçe Fabrikası</div>
      <h2 className="text-6xl font-black text-white mb-2 uppercase tracking-tighter">ÇOK GEÇ OLDU</h2>
      <p className="text-red-600 font-bold uppercase tracking-widest">Mesai başlıyor...</p>
      
      <div className="mt-12 text-zinc-700 text-xs">
        Vardiya Değişimi: Gece {night}
      </div>
    </div>
  );
};

export default DayTransition;
