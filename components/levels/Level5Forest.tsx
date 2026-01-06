
import React, { useState, useEffect } from 'react';
import { Language } from '../../types';

const Level5Forest: React.FC<{ language: Language, onWin: () => void, onLose: (r: string) => void }> = ({ language, onWin, onLose }) => {
  const [targets, setTargets] = useState<{id: number, x: number, y: number}[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const spawn = setInterval(() => {
      setTargets(prev => [...prev, { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 }]);
    }, 1500);
    return () => clearInterval(spawn);
  }, []);

  useEffect(() => {
    if (targets.length > 6) onLose(language === 'tr' ? "Ormanı kaybettik!" : "We lost the forest!");
  }, [targets, onLose, language]);

  const handleShoot = (id: number) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    setScore(s => {
      if (s + 1 >= 15) onWin();
      return s + 1;
    });
  };

  return (
    <div className="w-full h-full bg-black relative cursor-crosshair">
      {/* Night Vision Overlay */}
      <div className="absolute inset-0 bg-green-500/20 pointer-events-none z-10 border-[50px] border-black/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-20"></div>

      {targets.map(t => (
        <div 
          key={t.id}
          onClick={() => handleShoot(t.id)}
          className="absolute z-30 group"
          style={{ left: `${t.x}%`, top: `${t.y}%` }}
        >
          <div className="w-12 h-20 bg-green-900 border-2 border-green-400 opacity-60 hover:opacity-100 transition-opacity"></div>
          <div className="absolute -top-2 -left-2 w-16 h-24 border-2 border-red-500 opacity-0 group-hover:opacity-100"></div>
        </div>
      ))}

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 text-green-500 font-mono text-xl">
        {language === 'tr' ? 'GECE GÖRÜŞÜ AKTİF | HEDEFLER' : 'NIGHT VISION ACTIVE | TARGETS'}: {score}/15
      </div>
    </div>
  );
};

export default Level5Forest;