
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';

const Level1Factory: React.FC<{ language: Language, onWin: () => void, onLose: (r: string) => void }> = ({ language, onWin, onLose }) => {
  const [eyes, setEyes] = useState<{ x: number, y: number, id: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(40);
  const [flashlightPos, setFlashlightPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const spawn = setInterval(() => {
      setEyes(prev => [...prev, { x: Math.random() * 80 + 10, y: Math.random() * 60 + 20, id: Date.now() }]);
    }, 2000);
    const timer = setInterval(() => setTimeLeft(t => t <= 1 ? (onWin(), 0) : t - 1), 1000);
    return () => { clearInterval(spawn); clearInterval(timer); };
  }, [onWin]);

  useEffect(() => {
    if (eyes.length > 5) onLose(language === 'tr' ? "Fabrikayı varlıklar bastı!" : "Entities overran the factory!");
  }, [eyes, onLose, language]);

  const handleFlash = (id: number) => {
    setEyes(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden" 
         onMouseMove={(e) => setFlashlightPos({ x: e.clientX, y: e.clientY })}>
      <div className="absolute inset-0 bg-zinc-950/90 pointer-events-none"></div>
      
      {/* Flashlight Effect */}
      <div 
        className="fixed pointer-events-none w-[400px] h-[400px] rounded-full bg-white/5 shadow-[0_0_100px_rgba(255,255,255,0.2)]"
        style={{ left: flashlightPos.x - 200, top: flashlightPos.y - 200, mixBlendMode: 'overlay' }}
      ></div>

      {eyes.map(eye => (
        <div 
          key={eye.id}
          onMouseEnter={() => handleFlash(eye.id)}
          className="absolute flex gap-4 cursor-pointer group"
          style={{ left: `${eye.x}%`, top: `${eye.y}%` }}
        >
          <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_red]"></div>
          <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_red]"></div>
        </div>
      ))}

      <div className="absolute top-10 left-10 text-white font-bold text-2xl">{language === 'tr' ? 'GECE: FABRİKA' : 'NIGHT: FACTORY'} - {timeLeft}s</div>
      <div className="absolute bottom-10 left-10 text-red-500 animate-pulse text-xs">{language === 'tr' ? 'FENERİ GÖZLERE TUT!' : 'KEEP FLASHLIGHT ON EYES!'}</div>
    </div>
  );
};

export default Level1Factory;