import type { Player } from '../types/game';

const PREFIXES = [
  'Grand',
  'Iron',
  'Crimson',
  'Apex',
  'Solar',
  'Obsidian',
  'Vanguard',
  'Cyber',
  'Celestial',
  'Imperial',
  'Aegis',
  'Nova',
  'Titanium',
  'Shadow',
  'Phoenix',
  'Sovereign',
  'Starlight',
  'Quantum',
  'Neptune',
  'Valiant',
  'Onyx',
  'Vortex',
];

const CORES = [
  'Syndicate',
  'Dominion',
  'Empire',
  'Legion',
  'Union',
  'Coalition',
  'Republic',
  'Dynasty',
  'Imperium',
  'Federation',
  'Order',
  'Hegemony',
  'Realm',
  'Alliance',
  'Enclave',
  'Protectorate',
  'Reich',
  'Conclave',
  'Command',
  'Armada',
];

/**
 * Generates a random thematic empire name (e.g., "Obsidian Dominion", "Crimson Imperium")
 */
export function generateRandomEmpireName(): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const core = CORES[Math.floor(Math.random() * CORES.length)];
  return `${prefix} ${core}`;
}

/**
 * Returns the effective Empire Name for a player.
 * Falls back to historical country name or Commander's Empire if empty.
 */
export function getEmpireName(player?: Player | null, fallbackCountryName?: string): string {
  if (!player) {
    return fallbackCountryName || 'Neutral Forces';
  }
  if (player.empireName && player.empireName.trim().length > 0) {
    return player.empireName.trim();
  }
  if (fallbackCountryName) {
    return fallbackCountryName;
  }
  return `${player.name}'s Empire`;
}
