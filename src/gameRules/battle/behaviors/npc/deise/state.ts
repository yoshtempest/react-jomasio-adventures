export const STAFF_COOLDOWN = 500;
export const SUMMON_COOLDOWN = 7000;
export const MIN_ACTION_GAP = 100;
export const CLOSE_RANGE = 200;

export type DeiseAI = {
  knownPhase: number;
  phase2OpeningDone: boolean;
  phase2PitchEnd: number;
  lastStaffThrow: number;
  lastSummon: number;
  lastAction: number;
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
  };
}

export function handlePhaseChange(ai: DeiseAI, npcPhase: number): DeiseAI {
  ai.knownPhase = npcPhase;
  ai.lastStaffThrow = 0;
  ai.lastSummon = 0;
  ai.lastAction = 0;
  ai.phase2OpeningDone = false;
  return ai;
}
