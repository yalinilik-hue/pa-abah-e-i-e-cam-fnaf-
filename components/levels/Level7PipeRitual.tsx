
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { soundManager } from '../SoundManager';

const Level7PipeRitual: React.FC<{ language: Language, onWin: () => void, onLose: (r: string) => void }> = ({ language, onWin, onLose }) => {
  const employeeData = [
    { name: "MUSTAFA TOPAL", location: "Boru Kanalları / Alt Kat (TEHLİKELİ)" },
    { name: "AHMET YILMAZ", location: "Fırın Hattı A-12" },
    { name: "MEHMET KAYA", location: "Paketleme Servisi" },
    { name: "ZEYNEP DEMİR", location: "Kalite Kontrol Lab" },
    { name: "AYŞE ÖZTÜRK", location: "Depo Yönetimi" },
    { name: "HASAN ŞAHİN", location: "Cam Kesim Atölyesi" }
  ];
  
  const [currentName, setCurrentName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [stage, setStage] = useState(0);
  const [timer, setTimer] = useState(30); 
  const [showLocations, setShowLocations] = useState(false);
  const [feedback, setFeedback] = useState<'NONE' | 'SUCCESS' | 'TIMEOUT'>('NONE');
  const totalStages = 3; 
  const inputRef = useRef<HTMLInputElement>(null);
  const nextStageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    startNewStage(0);
    return () => {
      if (nextStageTimeoutRef.current) clearTimeout(nextStageTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (timer <= 0 && !showLocations && feedback === 'NONE') {
      handleNextStep('TIMEOUT');
    }
    const t = setInterval(() => {
      if (!showLocations && feedback === 'NONE') {
        setTimer(prev => Math.max(0, prev - 1));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [timer, showLocations, feedback]);

  const handleNextStep = (type: 'SUCCESS' | 'TIMEOUT') => {
    setFeedback(type);
    
    if (type === 'SUCCESS') {
      soundManager.speakHuman(language === 'tr' ? "VERİ DOĞRULANDI." : "DATA VERIFIED.", language);
    } else {
      soundManager.speakHuman(language === 'tr' ? "SÜRE DOLDU. GEÇİLİYOR." : "TIME EXPIRED. PROCEEDING.", language);
    }

    nextStageTimeoutRef.current = setTimeout(() => {
      if (stage + 1 >= totalStages) {
        setShowLocations(true);
      } else {
        const nextStage = stage + 1;
        setStage(nextStage);
        startNewStage(nextStage);
      }
      setFeedback('NONE');
    }, 1500);
  };

  const startNewStage = (currentStage: number) => {
    let fullName = "";
    if (currentStage === totalStages - 1) {
      fullName = "MUSTAFA TOPAL"; 
    } else {
      const pool = employeeData.filter(e => e.name !== "MUSTAFA TOPAL");
      fullName = pool[Math.floor(Math.random() * pool.length)].name;
    }
    
    setCurrentName(fullName);
    setUserInput("");
    setTimer(30);
    
    const utterance = new SpeechSynthesisUtterance(fullName);
    utterance.pitch = 0.1;
    utterance.rate = 0.4;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (feedback !== 'NONE') return;
    const val = e.target.value.toUpperCase();
    setUserInput(val);
    
    if (val === currentName) {
      handleNextStep('SUCCESS');
    }
  };

  if (showLocations) {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        
        <div className="z-20 text-center mb-10">
          <h2 className="text-green-500 text-5xl font-black italic tracking-widest uppercase mb-2">ERİŞİM ONAYLANDI</h2>
          <p className="text-zinc-500 font-mono text-xs">ÇALIŞAN YERLEŞİM VERİ TABANI (GİZLİ)</p>
        </div>

        <div className="z-20 w-full max-w-4xl bg-zinc-900 border-4 border-zinc-800 p-8 rounded-2xl shadow-2xl space-y-4">
          <div className="grid grid-cols-2 border-b-2 border-zinc-700 pb-2 text-zinc-500 font-bold text-xs">
             <span>AD SOYAD</span>
             <span>İKAMETGAH / KONUM</span>
          </div>
          {employeeData.map((emp, i) => (
            <div key={i} className={`grid grid-cols-2 py-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${emp.name === "MUSTAFA TOPAL" ? 'text-red-500 font-black' : 'text-zinc-300'}`}>
               <span className="font-mono">{emp.name}</span>
               <span className="italic">{emp.location}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={onWin}
          className="mt-12 px-20 py-6 bg-red-600 border-4 border-white text-white font-black text-2xl animate-pulse hover:bg-red-700 transition-all uppercase italic"
        >
          BORU SENİ BEKLİYOR
        </button>

        <div className="absolute bottom-4 text-[8px] text-zinc-800 font-mono tracking-[2em]">DATABASE_ENTRY_SUCCESS</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-12 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_90%)] z-10 pointer-events-none"></div>
      
      <div className="z-20 text-center mb-12">
        <h2 className="text-red-600 text-7xl font-black italic tracking-tighter animate-pulse mb-4 uppercase">BORU FISILTISI</h2>
        <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase italic">Gerçek isimleri fısıldanırken yaz...</p>
      </div>

      <div className={`z-20 w-full max-w-2xl bg-zinc-900 border-[10px] p-10 shadow-[0_0_150px_rgba(255,0,0,0.1)] rounded-[3rem] relative transition-all duration-300 
        ${feedback === 'SUCCESS' ? 'border-green-600 shadow-[0_0_50px_rgba(34,197,94,0.3)]' : feedback === 'TIMEOUT' ? 'border-amber-600 shadow-[0_0_50px_rgba(245,158,11,0.3)]' : 'border-zinc-800'}`}>
        
        <div className="absolute top-4 left-6 flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full animate-ping ${feedback === 'SUCCESS' ? 'bg-green-500' : feedback === 'TIMEOUT' ? 'bg-amber-500' : 'bg-red-600'}`}></div>
           <div className={`text-[10px] font-mono uppercase tracking-widest ${feedback === 'SUCCESS' ? 'text-green-500' : feedback === 'TIMEOUT' ? 'text-amber-500' : 'text-zinc-600'}`}>
             {feedback === 'SUCCESS' ? 'VERI_AKTARILIYOR' : feedback === 'TIMEOUT' ? 'OTOMATIK_GECIS' : 'DINLENIYOR...'}
           </div>
        </div>

        <div className="flex justify-between items-center mb-10">
           <div className="text-zinc-500 font-black text-xl border-l-4 border-red-600 pl-4 uppercase italic">AŞAMA: {stage + 1}/{totalStages}</div>
           <div className={`font-black text-5xl tabular-nums ${timer < 10 ? 'text-red-600 animate-bounce' : 'text-zinc-400'}`}>
              {feedback === 'NONE' ? `${timer}s` : '...'}
           </div>
        </div>

        <div className="relative">
          <input 
            ref={inputRef}
            autoFocus
            type="text"
            disabled={feedback !== 'NONE'}
            value={userInput}
            onChange={handleInputChange}
            className={`w-full bg-black border-4 p-8 text-center text-4xl font-black transition-all uppercase tracking-widest rounded-xl shadow-inner focus:outline-none
              ${feedback === 'SUCCESS' ? 'border-green-500 text-green-400' : feedback === 'TIMEOUT' ? 'border-amber-500 text-amber-400' : 'border-zinc-800 text-white focus:border-red-600'}`}
            placeholder={feedback === 'NONE' ? "İSMİ YAZIN..." : "İŞLENİYOR..."}
          />
        </div>

        <div className="mt-16 grid grid-cols-3 gap-3 opacity-10 pointer-events-none">
           {Array.from({length: 3}).map((_, i) => (
             <div key={i} className={`h-3 rounded-full transition-all ${i <= stage ? (feedback === 'SUCCESS' || i < stage ? 'bg-green-600' : 'bg-red-600') : 'bg-zinc-800'}`}></div>
           ))}
        </div>
      </div>

      <div className="mt-16 text-zinc-800 text-xs font-mono tracking-[1.5em] animate-pulse z-20 uppercase font-black italic">
        {stage === totalStages - 1 ? 'MUSTAFA TOPAL FISILDANIYOR...' : 'SIRADAKİ ÇALIŞANI DİNLE'}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-red-950/20 to-transparent z-0"></div>
    </div>
  );
};

export default Level7PipeRitual;
