export const STAFF_COOLDOWN = 500;
export const SUMMON_COOLDOWN = 7000;
export const MIN_ACTION_GAP = 100;
export const CLOSE_RANGE = 200;

export const SPEAR_RAIN_COOLDOWN = 4000;
export const SPEAR_RAIN_WARNING_DURATION = 1000;
export const SPEAR_RAIN_COUNT = 5;
export const SPEAR_FALL_SPEED = 18;

const MAP_HEIGHT = 600;
export const OFFSCREEN_BOTTOM = 800;

export type DeiseAI = {
  knownPhase: number;
  phase2OpeningDone: boolean;
  phase2PitchEnd: number;
  lastStaffThrow: number;
  lastSummon: number;
  lastAction: number;
  spearRainPhase: "idle" | "warning" | "falling";
  lastSpearRain: number;
  spearRainWarningStart: number;
  spearRainPositions: number[];
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
    spearRainPhase: "idle",
    lastSpearRain: 0,
    spearRainWarningStart: 0,
    spearRainPositions: [],
  };
}

export function handlePhaseChange(ai: DeiseAI, npcPhase: number): DeiseAI {
  ai.knownPhase = npcPhase;
  ai.lastStaffThrow = 0;
  ai.lastSummon = 0;
  ai.lastAction = 0;
  ai.phase2OpeningDone = false;
  ai.spearRainPhase = "idle";
  ai.lastSpearRain = 0;
  ai.spearRainWarningStart = 0;
  ai.spearRainPositions = [];
  return ai;
}

export function generateSpearPositions(playerX: number): number[] {
  const positions: number[] = [];
  for (let i = 0; i < SPEAR_RAIN_COUNT; i++) {
    const offset = (i - Math.floor(SPEAR_RAIN_COUNT / 2)) * 100;
    positions.push(playerX + offset + (Math.random() - 0.5) * 60);
  }
  return positions;
}

export function overlapDamage(
  spearY: number,
  playerX: number,
  spearX: number,
  onHit: () => void,
  alreadyHit: boolean,
): boolean {
  if (alreadyHit) return true;
  if (spearY >= MAP_HEIGHT - 50 && spearY <= OFFSCREEN_BOTTOM) {
    const dx = Math.abs(playerX - spearX);
    if (dx < 60) {
      onHit();
      return true;
    }
  }
  return false;
}
