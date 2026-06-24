export const STAFF_COOLDOWN = 500;
export const SUMMON_COOLDOWN = 7000;
export const MIN_ACTION_GAP = 100;
export const CLOSE_RANGE = 200;

export const SPEAR_RAIN_COOLDOWN = 4000;
export const SPEAR_RAIN_WARNING_DURATION = 1000;
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
