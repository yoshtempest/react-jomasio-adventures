import type { MaugreloAI } from "./types";

export function initMaugreloAi(npcPhase: number = 1): MaugreloAI {
  return {
    knownPhase: npcPhase,
    actionState: "idle",
    actionStart: 0,
    currentAction: null,
    meleeHitTriggered: false,
    lastThrow: 0,
    lastSlap: 0,
    lastPush: 0,
    flyingPaper: null,
    groundPapers: [],
    landedPapers: [],
    stuckPapers: [],
    paperIdCounter: 0,
    lastPaperHitId: 0,
    meditationArmorBonus: 0,
    lastArmorBuff: 0,
    walkingStartTime: 0,
    phase2State: "rising",
    riseStartY: 0,
    orbitPapers: [],
    lastPaperFire: 0,
    phase2StageStart: 0,
    laser: null,
    lastLaserDamage: 0,
    appliedDebuff: null,
    papersThrownCount: 0,
    lastPaperThrow: 0,
    pushHitTriggered: false,
  };
}
