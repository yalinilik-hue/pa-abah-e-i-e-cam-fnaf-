
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { soundManager } from './SoundManager';

interface PipeMonsterGameProps {
  language: Language;
  onWin: () => void;
  onLose: (r: string) => void;
}

const PipeMonsterGame: React.FC<PipeMonsterGameProps> = ({ language, onWin, onLose }) => {
  const [nightguardStatus, setNightguardStatus] = useState<'CAM_OPEN' | 'CAM_CLOSED'>('CAM_CLOSED');
  const [guardMessage, setGuardMessage] = useState("");
  const [bottleSpun, setBottleSpun] = useState(true);
  const [attackAvailable, setAttackAvailable] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      // Gardiyan davranışlarını simüle et
      const rand = Math.random();
      
      // Kamera durum değişimi
      if (rand > 0.75) {
        const newStatus = nightguardStatus === 'CAM_OPEN' ? 'CAM_CLOSED' : 'CAM_OPEN';
        setNightguardStatus(newStatus);
        const msg = newStatus === 'CAM_OPEN' ? 
          (language === 'tr' ? "Kamera açık..." : "Camera on...") : 
          (language === 'tr' ? "Kamera kapalı." : "Camera off.");
        
        setGuardMessage(msg);
        addLog(msg);
        
        // Sesli bildirim (Gardiyanın sesi gibi)
        if (newStatus === 'CAM_OPEN') {
           soundManager.speakHuman(language === 'tr' ? "Kameralar aktif." : "Cameras active.", language);
        }
        
        // Mesajı bir süre sonra temizle
        setTimeout(() => setGuardMessage(""), 3000);
      }

      // Şişe mekaniği: Gardiyan "fazla fazla" (sıkça) şişeyi çevirmeyi unutur
      if (Math.random() > 0.85 && bottleSpun) {
        setBottleSpun(false);
        setAttackAvailable(true);
        const msg = language === 'tr' ? "Şişeyi çevirmeyi unuttu!" : "Forgot to spin the bottle!";
        addLog(msg);
        
        // Gardiyan bazen fark eder
        setTimeout(() => {
          if (Math.random() > 0.5) {
            setBottleSpun(true);
            setAttackAvailable(false);
            addLog(language === 'tr' ? "Gardiyan fark etti ve çevirdi!" : "Guard noticed and spun it!");
          }
        }, 4000);
      }
    }, 2500);

    return () => clearInterval(gameInterval);
  }, [nightguardStatus, bottleSpun, language]);

  const addLog = (msg: string) => {
    setLog(prev => [msg, ...prev].slice(0, 5));
  };

  const handleAttack = () => {
    if (attackAvailable) {
      setIsVictory(true);
      soundManager.playScream();
      soundManager.speakHuman(language === 'tr' ? "GÜVENLİK GÖREVLİSİ YOK EDİLDİ. BORU CANAVARI KAZANDI!" : "NIGHTGUARD ELIMINATED. PIPE MONSTER WINS!", language);
      setTimeout(onWin, 5000);
    }
  };

  if (isVictory) {
    return (
      <div className="w-full h-full bg-red-950 flex flex-col items-center justify-center p-12 overflow-hidden relative">
        <div className="absolute inset-0 bg-black opacity-40 animate-pulse"></div>
        <div className="z-50 text-center space-y-8">
          <h1 className="text-9xl font-black text-red-600 italic tracking-tighter drop-shadow-[0_0_50px_rgba(255,0,0,0.8)] animate-bounce uppercase">ÖLDÜRDÜN</h1>
          <p className="text-4xl font-bold text-white tracking-[1em] uppercase">{language === 'tr' ? 'BORU DOYDU' : 'PIPE IS FED'}</p>
          <div className="h-2 w-96 bg-zinc-800 mx-auto rounded-full overflow-hidden">
             <div className="h-full bg-green-500 animate-[progress_5s_linear]"></div>
          </div>
        </div>
        <style>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 font-mono overflow-hidden relative">
      {/* Karanlık Ortam Efekti */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.9)_100%)] z-10 pointer-events-none"></div>
      
      <div className="z-20 text-center mb-8 border-b-2 border-zinc-900 pb-4 w-full max-w-xl">
        <h1 className="text-4xl font-black text-amber-600 animate-pulse uppercase tracking-[0.2em] italic">BORU SİMÜLATÖRÜ</h1>
        <p className="text-[10px] text-zinc-700 mt-2 uppercase tracking-widest">Karanlıktan Gözlem Yapılıyor...</p>
      </div>

      <div className="z-20 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Gardiyan Gözlem Alanı */}
        <div className="relative aspect-video bg-zinc-900 border-[10px] border-zinc-800 rounded-2xl shadow-[inset_0_0_100px_black] overflow-hidden flex flex-col items-center justify-center group">
           {/* Scanline Effect */}
           <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] pointer-events-none"></div>
           
           <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
              <div className="text-[10px] text-red-500 font-bold uppercase">CANLI_AKTARIM</div>
           </div>

           {/* Gardiyan Görseli (Loş Işık) */}
           <div className={`transition-all duration-1000 flex flex-col items-center ${nightguardStatus === 'CAM_OPEN' ? 'brightness-50' : 'brightness-100'}`}>
              <div className="text-9xl mb-4 drop-shadow-2xl">👤</div>
              <div className="text-zinc-500 text-sm font-black uppercase tracking-widest">
                 {language === 'tr' ? 'GÜVENLİK GÖREVLİSİ' : 'NIGHTGUARD'}
              </div>
              
              {/* Konuşma Balonu */}
              {guardMessage && (
                <div className="absolute top-10 bg-white text-black px-6 py-2 rounded-full font-bold text-xs animate-in fade-in zoom-in duration-300 shadow-xl border-2 border-zinc-300">
                  {guardMessage}
                </div>
              )}
           </div>

           {/* Kamera Monitörü Efekti */}
           {nightguardStatus === 'CAM_OPEN' && (
             <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay pointer-events-none flex items-center justify-center">
                <div className="border-4 border-blue-400 p-10 rotate-12 opacity-20">
                   <div className="text-blue-400 text-6xl font-black">WATCHING</div>
                </div>
             </div>
           )}

           {/* Şişe Uyarı Efekti */}
           {!bottleSpun && (
             <div className="absolute inset-0 border-[15px] border-red-600/30 animate-pulse pointer-events-none"></div>
           )}
        </div>

        {/* Durum Paneli ve Aksiyonlar */}
        <div className="flex flex-col gap-6">
           <div className="bg-zinc-900/80 border-4 border-zinc-800 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-amber-500 text-xs font-black mb-6 uppercase border-b border-zinc-800 pb-2">Sinyal Takip Günlüğü</h3>
              <div className="space-y-3 h-40 overflow-hidden font-mono">
                 {log.length === 0 && <div className="text-zinc-800 italic uppercase text-[10px]">Sinyal bekleniyor...</div>}
                 {log.map((m, i) => (
                   <div key={i} className="text-[11px] text-zinc-400 border-l-4 border-amber-900 pl-3 py-1 animate-in slide-in-from-left-4">
                      <span className="text-zinc-700 mr-2">[{new Date().toLocaleTimeString()}]</span> {m}
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex flex-col gap-6">
              <div className={`p-6 border-4 rounded-2xl text-center transition-all duration-500 ${!bottleSpun ? 'bg-red-950/40 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                 <div className="text-sm font-black uppercase tracking-[0.2em]">
                    {bottleSpun ? 
                      (language === 'tr' ? 'ŞİŞE KONTROLÜ: TAMAM' : 'BOTTLE CONTROL: OK') : 
                      (language === 'tr' ? 'KRİTİK HATA: ŞİŞE UNUTULDU!' : 'CRITICAL ERROR: BOTTLE FORGOTTEN!')}
                 </div>
                 {!bottleSpun && <div className="text-[10px] mt-2 animate-pulse">{language === 'tr' ? 'SALDIRI İÇİN MÜKEMMEL AN' : 'PERFECT MOMENT TO STRIKE'}</div>}
              </div>

              <button 
                onClick={handleAttack}
                disabled={!attackAvailable}
                className={`py-12 text-6xl font-black italic uppercase transition-all shadow-[0_0_50px_black] border-[10px] relative overflow-hidden group
                  ${attackAvailable 
                    ? 'bg-red-600 border-white text-white animate-pulse hover:scale-105 active:scale-95' 
                    : 'bg-zinc-950 border-zinc-900 text-zinc-800 cursor-not-allowed'}`}
              >
                {attackAvailable && (
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
                )}
                {attackAvailable ? (language === 'tr' ? 'SALDIR' : 'ATTACK') : (language === 'tr' ? 'PUSUDA BEKLE' : 'WAIT IN AMBUSH')}
              </button>
              
              <p className="text-zinc-600 text-center text-[10px] uppercase tracking-widest italic font-bold">
                 {attackAvailable ? 
                   (language === 'tr' ? 'Gardiyan şu an savunmasız!' : 'The guard is defenseless now!') : 
                   (language === 'tr' ? 'Doğru anı bekle, şişeyi unutmasını kolla...' : 'Wait for the right moment, watch for the forgotten bottle...')}
              </p>
           </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-[9px] text-zinc-800 tracking-[1.5em] uppercase font-black opacity-30">
        PIPE_SYSTEM_OVERLORD_ACTIVE_V4.0
      </div>
    </div>
  );
};

export default PipeMonsterGame;
