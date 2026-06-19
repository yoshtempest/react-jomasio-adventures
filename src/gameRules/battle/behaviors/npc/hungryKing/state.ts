export type HungryKingAI = {
  knownPhase: number;
  hasSummoned: boolean;
};

export function initHungryKingAi(phase: number): HungryKingAI {
  return {
    knownPhase: phase,
    hasSummoned: false,
  };
}

export function handlePhaseChange(ai: HungryKingAI, newPhase: number) {
  ai.knownPhase = newPhase;
  ai.hasSummoned = false;
}
