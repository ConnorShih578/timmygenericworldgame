export interface Player {
  id: string;
  name: string;
  empireName?: string;
  color: string; // Hex color for Phosphor themes
  isHost: boolean;
  isBot: boolean;
  isAlive: boolean;
  posture: Posture | null;
  starsAssigned: number | null; // 1, 2, or 3 stars based on RPS placement
  selectedCountryId: string | null;
}

export type Posture = 'rock' | 'paper' | 'scissors';

export interface CountryNode {
  id: string;
  name: string;
  countryId: string; // Belongs to historical country
  countryName: string;
  stars: number; // 1 (Guerrilla), 2 (Regional), 3 (Superpower)
  x: number; // 0 to 1000 map coordinates
  y: number; // 0 to 700 map coordinates
  type: 'capital' | 'military_base' | 'city';
  ownerId: string | null; // null if neutral
  troops: number;
  isFortified: boolean;
  vulnerableUntil: number | null; // ms timestamp
  scoutedBy: Record<string, number>; // playerId -> expiry timestamp
}

export interface BorderConnection {
  from: string; // Node ID
  to: string; // Node ID
  barrierName?: string | null; // e.g. "Great Wall of China", "Rhine River", "Andes"
  defenseMultiplier: number; // e.g. 2.0x defense multiplier for Great Wall
}

export interface TransitTroops {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  count: number;
  ownerId: string;
  progress: number; // 0 to 1
  isExplorer: boolean;
  speed: number; // Increment per animation tick
}

export interface Alliance {
  id: string;
  members: string[]; // Player IDs
  status: 'active' | 'pending' | 'truce';
  proposedBy: string; // Player ID
  truceUntil: number | null; // ms timestamp
}

export interface GameLog {
  id: string;
  message: string;
  timestamp: string; // "HH:MM:SS"
}

export interface CombatResult {
  id: string;
  type: 'conquer' | 'repelled' | 'scout_success' | 'scout_failed';
  text: string;
  timestamp: number;
}

export interface Era {
  id: string;
  name: string;
  period?: string;
  preamble: string;
  countries?: { id: string; name: string; stars: number }[];
  nodes: CountryNode[];
  connections: BorderConnection[];
}

export interface GameState {
  roomId: string;
  roomCode: string;
  eraId: string;
  phase: 'lobby' | 'preamble' | 'rps' | 'selection' | 'game' | 'gameover';
  players: Player[];
  nodes: CountryNode[];
  connections: BorderConnection[];
  transits: TransitTroops[];
  alliances: Alliance[];
  logs: GameLog[];
  winnerId: string | string[] | null; // Can be a coalition of players
  lastCombatResult?: CombatResult | null;
}
