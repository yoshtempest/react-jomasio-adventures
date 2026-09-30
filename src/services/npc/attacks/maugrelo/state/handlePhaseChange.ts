import type { MaugreloAI } from "./types";

export function handlePhaseChange(ai: MaugreloAI, npcPhase: number): void {
  ai.knownPhase = npcPhase;
  ai.phase2State = "rising";
  ai.orbitPapers = [];
  ai.lastPaperFire = 0;
  ai.actionState = "idle";
  ai.currentAction = null;
  ai.flyingPaper = null;
  ai.groundPapers = [];
  ai.landedPapers = [];
  ai.stuckPapers = [];
  ai.laser = null;
  ai.lastLaserDamage = 0;
  ai.appliedDebuff = null;
  ai.papersThrownCount = 0;
  ai.lastPaperThrow = 0;
  ai.pushHitTriggered = false;
}
