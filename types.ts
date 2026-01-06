
export type GameState = 'MENU' | 'HUB' | 'DAY' | 'NIGHT' | 'LEVEL1' | 'LEVEL2' | 'LEVEL3' | 'LEVEL4' | 'LEVEL5' | 'LEVEL6' | 'LEVEL7' | 'LEVEL8' | 'JUMPSCARE' | 'ENDING' | 'PRAYER' | 'ATATURK' | 'CUSTOM_NIGHT' | 'MOD_SHOP' | 'NEW_OFFICE' | 'CUSTOM_NIGHT_SETUP' | 'UNDERGROUND' | 'MOD_ROOM' | 'PIPE_MONSTER_GAME' | 'AI_LOUNGE';

export type Language = 'tr' | 'en';

export interface Entity {
  id: number;
  name: string;
  position: number;
  aggressive: number;
  isVisible: boolean;
}

export interface GameSettings {
  difficulty: number;
  unlockedSettings: boolean;
  unlockedCustomNight?: boolean;
  modsEnabled?: boolean;
  unlockedEntityConfig?: boolean;
  entityConfigActive?: boolean;
  entityAI?: number[]; 
  balance: number; 
  cheatMenuPurchased: boolean; 
  activeMods: string[]; 
  customNightAI: number[];
  toprakMapActive: boolean; 
  entityPresence: boolean;
  entityModeActive: boolean; 
  entityModeUnlocked: boolean;
  modRoomUnlocked: boolean;
  selectedEntityId: number; 
  pipeMonsterUnlocked: boolean; 
  completedClassic: boolean;
  completedHelpWanted: boolean;
  completedNewOffice: boolean;
  // Yeni Abonelikler
  isPasaGold: boolean;
  isVipSecurity: boolean;
  isLethalElite: boolean;
}
