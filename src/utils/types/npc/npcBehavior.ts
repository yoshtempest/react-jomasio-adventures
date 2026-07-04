import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { SoundId } from "@/contexts/SoundEffectsContext";

export type BehaviorContext = {
  npc: NPCBattleState;
  playerX: number;
  playerY: number;
  targetX: number;
  targetY: number;
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
  playSound?: (sound: SoundId, loop?: boolean) => void;
  npcHp?: number;
  npcMaxHp?: number;
  onGrabPlayer?: () => void;
  onThrowPlayer?: (damageMultiplier: number) => void;
};

export type BehaviorResult = {
  x: number;
  y?: number;
  state?: NPCBattleState["state"];
};
