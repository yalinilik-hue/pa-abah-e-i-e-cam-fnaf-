
import React, { useState, useEffect } from 'react';
import { Language } from '../../types';

const Level4Pipe: React.FC<{ language: Language, onWin: () => void, onLose: (r: string) => void }> = ({ language, onWin, onLose }) => {
  const requestsTR = ["CAM", "ATEŞ", "SU", "KUM"];
  const requestsEN = ["GLASS", "FIRE", "WATER", "SAND"];
  const requests = language === 'tr' ? requestsTR : requestsEN;
  
  const [currentRequest, setCurrentRequest] = useState(requests[0]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    const t = setInterval(() => setTimer(v => {
      if (v <= 1) { onLose(language === 'tr' ? "Boru canavarı bekletilmeyi sevmez!" : "The pipe monster doesn't like waiting!"); return 0; }
      return v - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [onLose, language]);

  const handleGive = (item: string) => {
    if (item === currentRequest) {
      if (score + 1 >= 8) onWin();
      setScore(s => s + 1);
      setTimer(10);
      setCurrentRequest(requests[Math.floor(Math.random() * requests.length)]);
    } else {
      onLose(language === 'tr' ? "Yanlış eşya verdin!" : "Wrong item!");
    }
  };

  return (
    <div className="w-full h-full bg-amber-950/20 flex flex-col items-center justify-center">
      <div className="w-64 h-64 bg-amber-900 rounded-full border-[20px] border-amber-950 flex flex-col items-center justify-center shadow-[inset_0_0_50px_black]">
        <div className="text-white font-bold text-center animate-pulse">
            {language === 'tr' ? 'BANA' : 'GIVE ME'} <br/>
            <span className="text-4xl text-amber-500">{currentRequest}</span> <br/>
            {language === 'tr' ? 'VER!' : 'NOW!'}
        </div>
      </div>

      <div className="mt-24 grid grid-cols-2 gap-4">
        {requests.map(req => (
          <button 
            key={req}
            onClick={() => handleGive(req)}
            className="w-32 py-4 bg-zinc-800 text-white border-2 border-zinc-700 hover:bg-zinc-700"
          >
            {req}
          </button>
        ))}
      </div>

      <div className="absolute top-10 left-10 text-amber-600 font-bold">{language === 'tr' ? 'BORU MEMNUNİYETİ' : 'PIPE SATISFACTION'}: {score}/8</div>
      <div className="absolute top-10 right-10 text-red-500 font-bold">{language === 'tr' ? 'SÜRE' : 'TIME'}: {timer}s</div>
    </div>
  );
};

export default Level4Pipe;