import {
  STAFF_COOLDOWN,
  SUMMON_COOLDOWN,
  MIN_ACTION_GAP,
  SPEAR_RAIN_COOLDOWN,
} from "@/data/cooldowns";
import { ONE_THOUSAND_MS } from "@/data/ms";

export { STAFF_COOLDOWN, SUMMON_COOLDOWN, MIN_ACTION_GAP, SPEAR_RAIN_COOLDOWN };

export const CLOSE_RANGE = 200;
export const SPEAR_RAIN_WARNING_DURATION = ONE_THOUSAND_MS;
export const SPEAR_RAIN_COUNT = 5;

export type DeiseAI = {
  knownPhase: number;
  phase2OpeningDone: boolean;
  phase2PitchEnd: number;
  lastStaffThrow: number;
  lastSummon: number;
  lastAction: number;
  lastSpearRain: number;
};

export function initDeiseAi(npcPhase: number): DeiseAI {
  const now = Date.now();
  return {
    knownPhase: npcPhase,
    phase2OpeningDone: false,
    phase2PitchEnd: 0,
    lastStaffThrow: now - STAFF_COOLDOWN,
    lastSummon: now,
    lastAction: now - MIN_ACTION_GAP,
    lastSpearRain: 0,
  };
}

export function handlePhaseChange(ai: DeiseAI, npcPhase: number): DeiseAI {
  ai.knownPhase = npcPhase;
  ai.lastStaffThrow = 0;
  ai.lastSummon = 0;
  ai.lastAction = 0;
  ai.phase2OpeningDone = false;
  ai.lastSpearRain = 0;
  return ai;
}

export function generateSpearPositions(playerX: number): number[] {
  const positions: number[] = [];
  for (let i = 0; i < SPEAR_RAIN_COUNT; i++) {
    const offset = (i - Math.floor(SPEAR_RAIN_COUNT / 2)) * 100;
    positions.push(playerX + offset + (Math.random() - 0.5) * 24);
  }
  return positions;
}
