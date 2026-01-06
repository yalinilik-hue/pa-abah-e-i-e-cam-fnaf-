
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Entity, GameSettings, Language } from './types';
import Menu from './components/Menu';
import Hub from './components/Hub';
import Office from './components/Office';
import NewOffice from './components/NewOffice';
import DayOffice from './components/DayOffice';
import CustomNightSetup from './components/CustomNightSetup';
import Jumpscare from './components/Jumpscare';
import Ending from './components/Ending';
import ModShop from './components/ModShop';
import ModRoom from './components/ModRoom';
import Underground from './components/Underground';
import AILounge from './components/AILounge';
import Level1Factory from './components/levels/Level1Factory';
import Level2Store from './components/levels/Level2Store';
import Level3Repair from './components/levels/Level3Repair';
import Level4Pipe from './components/levels/Level4Pipe';
import Level5Forest from './components/levels/Level5Forest';
import Level6Rain from './components/levels/Level6Rain';
import Level7PipeRitual from './components/levels/Level7PipeRitual';
import Level8SecurityRoom from './components/levels/Level8SecurityRoom';
import PipeMonsterGame from './components/PipeMonsterGame';
import LoadingScreen from './components/LoadingScreen';
import { soundManager } from './components/SoundManager';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [nextState, setNextState] = useState<GameState>('MENU');
  const [language, setLanguage] = useState<Language>('tr');
  const [night, setNight] = useState(1);
  const [hour, setHour] = useState(0); 
  const [entities, setEntities] = useState<Entity[]>([]);
  const [deathReason, setDeathReason] = useState('');
  const [skipNotification, setSkipNotification] = useState(false);
  const [cheatMessage, setCheatMessage] = useState('');
  
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: 10,
    unlockedSettings: true,
    unlockedCustomNight: false,
    unlockedEntityConfig: false,
    entityConfigActive: false,
    entityAI: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    balance: 1000000,
    cheatMenuPurchased: false,
    activeMods: [],
    customNightAI: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    toprakMapActive: false,
    entityPresence: true,
    entityModeActive: false,
    entityModeUnlocked: false,
    modRoomUnlocked: false,
    selectedEntityId: 0,
    pipeMonsterUnlocked: false,
    completedClassic: false,
    completedHelpWanted: false,
    completedNewOffice: false,
    isPasaGold: false,
    isVipSecurity: false,
    isLethalElite: false
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const transitionTo = (state: GameState) => {
    setNextState(state);
    setGameState('LOADING');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (e.shiftKey && key === 'a') {
        if ((gameState === 'NIGHT' || gameState === 'CUSTOM_NIGHT') && hour === 6) {
          handleWinClassic();
        }
      }

      if (e.altKey && key === 'q' && gameState === 'DAY') {
        setCheatMessage('>> ZAMAN BÜKÜLDÜ <<');
        setSkipNotification(true);
        transitionTo('NIGHT');
        setTimeout(() => setSkipNotification(false), 1500);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, hour, settings.cheatMenuPurchased]);

  const initEntities = (difficulty: number, isCustom: boolean = false) => {
    if (!settings.entityPresence) {
      setEntities([]);
      return;
    }
    let baseDifficulty = isCustom ? settings.customNightAI : (settings.entityConfigActive ? settings.entityAI : Array(10).fill(difficulty));
    
    // VIP Abonelik varlıkları yavaşlatır
    if (settings.isVipSecurity) {
      baseDifficulty = baseDifficulty.map((val: number) => Math.max(0, val - 3));
    }

    const newEntities: Entity[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: `Varlık ${i + 1}`,
      position: 0,
      aggressive: (baseDifficulty[i]),
      isVisible: false
    }));
    setEntities(newEntities);
  };

  useEffect(() => {
    if (['NIGHT', 'CUSTOM_NIGHT', 'NEW_OFFICE', 'PIPE_MONSTER_GAME', 'LEVEL8'].includes(gameState)) {
      initEntities(night + settings.difficulty, gameState === 'CUSTOM_NIGHT');
      setHour(0);
      const intervalTime = 20000;
      
      timerRef.current = setInterval(() => {
        setHour(prev => {
          if (prev >= 5) {
            clearInterval(timerRef.current!);
            return 6;
          }
          return prev + 1;
        });
      }, intervalTime); 
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, night, settings.entityPresence, settings.isVipSecurity]);

  const handleWinClassic = () => {
    setGameState('MENU');
    let reward = 50000;
    if (settings.isLethalElite) reward *= 5; // Lethal Elite 5 kat maaş
    setSettings(prev => ({ ...prev, balance: prev.balance + reward }));
    soundManager.speakHuman(language === 'tr' ? `Mesai bitti. $${reward} maaş yattı.` : `Shift over. $${reward} salary paid.`, language);
  };

  const handleGameOver = (reason: string) => {
    setDeathReason(reason);
    setGameState('JUMPSCARE');
    setTimeout(() => setGameState('MENU'), 6000);
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden select-none">
      {skipNotification && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
          <div className="bg-red-600/30 px-12 py-6 border-4 border-red-500 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.5)] rounded-2xl">
            <span className="text-white text-4xl font-black italic tracking-tighter uppercase">{cheatMessage}</span>
          </div>
        </div>
      )}

      {gameState === 'LOADING' && (
        <LoadingScreen 
          language={language} 
          targetState={nextState} 
          onComplete={() => setGameState(nextState)} 
        />
      )}

      {gameState === 'MENU' && (
        <Menu 
          night={night} language={language} onLanguageChange={setLanguage}
          onStartClassic={() => transitionTo('DAY')} 
          onStartNewGame={() => transitionTo('NEW_OFFICE')}
          onStartUnderground={() => transitionTo('UNDERGROUND')}
          onOpenMods={() => transitionTo('MOD_SHOP')}
          onOpenModRoom={() => transitionTo('MOD_ROOM')}
          onStartHelpWanted={() => transitionTo('HUB')}
          onOpenCustomNight={() => transitionTo('CUSTOM_NIGHT_SETUP')}
          onStartPipeGame={() => transitionTo('PIPE_MONSTER_GAME')}
          onOpenAILounge={() => transitionTo('AI_LOUNGE')}
          settings={settings} setSettings={setSettings} 
        />
      )}
      
      {gameState === 'MOD_SHOP' && <ModShop language={language} settings={settings} setSettings={setSettings} onBack={() => setGameState('MENU')} />}
      {gameState === 'MOD_ROOM' && <ModRoom language={language} settings={settings} setSettings={setSettings} onBack={() => setGameState('MENU')} />}
      {gameState === 'UNDERGROUND' && <Underground language={language} settings={settings} onWin={handleWinClassic} onLose={handleGameOver} />}
      {gameState === 'HUB' && <Hub language={language} onSelectLevel={(lvl) => transitionTo(lvl)} onBack={() => setGameState('MENU')} entityConfigActive={settings.entityConfigActive} settings={settings} setSettings={setSettings} />}
      {gameState === 'DAY' && <DayOffice language={language} onWorkComplete={() => transitionTo('NIGHT')} />}
      {gameState === 'PIPE_MONSTER_GAME' && <PipeMonsterGame language={language} onWin={() => setGameState('MENU')} onLose={handleGameOver} />}
      {gameState === 'AI_LOUNGE' && <AILounge language={language} onBack={() => setGameState('MENU')} />}
      
      {(gameState === 'NIGHT' || gameState === 'CUSTOM_NIGHT') && (
        <Office 
          language={language} 
          night={night} 
          hour={hour} 
          entities={entities} 
          setEntities={setEntities} 
          onGameOver={handleGameOver} 
          onWin={() => setGameState('MENU')}
          cheatActive={settings.entityConfigActive} 
          entityMode={settings.entityModeActive} 
          selectedEntityId={settings.selectedEntityId} 
        />
      )}
      
      {gameState === 'NEW_OFFICE' && <NewOffice language={language} night={night} hour={hour} entities={entities} onGameOver={handleGameOver} setEntities={setEntities} cheatActive={settings.entityConfigActive} />}
      
      {gameState === 'LEVEL1' && <Level1Factory language={language} onWin={() => transitionTo('HUB')} onLose={handleGameOver} />}
      {gameState === 'LEVEL2' && <Level2Store language={language} onWin={() => transitionTo('HUB')} onLose={handleGameOver} />}
      {gameState === 'LEVEL3' && <Level3Repair language={language} onWin={() => transitionTo('HUB')} onLose={handleGameOver} />}
      {gameState === 'LEVEL4' && <Level4Pipe language={language} onWin={() => transitionTo('HUB')} onLose={handleGameOver} />}
      {gameState === 'LEVEL5' && <Level5Forest language={language} onWin={() => transitionTo('HUB')} onLose={handleGameOver} />}
      {gameState === 'LEVEL6' && <Level6Rain language={language} onWin={() => transitionTo('HUB')} onLose={handleGameOver} />}
      {gameState === 'LEVEL7' && <Level7PipeRitual language={language} onWin={() => { setSettings(s => ({ ...s, pipeMonsterUnlocked: true })); transitionTo('HUB'); }} onLose={handleGameOver} />}
      {gameState === 'LEVEL8' && <Level8SecurityRoom language={language} hour={hour} onWin={() => transitionTo('HUB')} onLose={handleGameOver} />}

      {gameState === 'JUMPSCARE' && <Jumpscare language={language} reason={deathReason} />}
      {gameState === 'ENDING' && <Ending language={language} onFinish={() => setGameState('MENU')} />}
    </div>
  );
};

export default App;
