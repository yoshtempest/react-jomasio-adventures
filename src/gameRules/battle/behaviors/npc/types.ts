import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { Projectile } from "@/utils/types/projectile";

export type BehaviorContext = {
  npc: NPCBattleState;
  playerX: number;
  playerY: number;
  projectile: Projectile | null;
  setProjectile: (p: Projectile | null) => void;
  lastAttackRef: { current: number };
  attack: () => void;
  setForceIdle: (v: boolean) => void;
};