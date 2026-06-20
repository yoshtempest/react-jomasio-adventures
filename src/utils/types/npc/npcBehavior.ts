import type { NPCBattleState } from "@/utils/types/npc/npc";

export type BehaviorContext = {
  npc: NPCBattleState;
  playerX: number;
  playerY: number;
  projectile: Projectile | null;
  setProjectile: (p: Projectile | null) => void;
  lastAttackRef: { current: number };
  onMeleeHit: () => void;
  onProjectileHit: () => void;
  setForceIdle: (v: boolean) => void;
  npcPhase: number;
  onSummon?: (npcType: string) => void;
  onPullPlayer?: (x: number) => void;
  summonTimerRef?: { current: number };
};
