import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { SoundId } from "@/contexts/SoundEffectsContext";
import type { NewPlayerStatus } from "@/gameRules/battle/status/statusEffects";

export type BehaviorContext = {
  npc: NPCBattleState;
  playerX: number;
  playerY: number;
  playerState: PlayerState;
  playerDirection: Direction;
  targetX: number;
  targetY: number;
  projectile: Projectile | null;
  setProjectile: (p: Projectile | null) => void;
  lastAttackRef: { current: number };
  onMeleeHit: (multiplier?: number) => void;
  onProjectileHit: () => void;
  setForceIdle: (v: boolean) => void;
  npcPhase: number;
  onSummon?: (npcType: string) => void;
  onPullPlayer?: (x: number) => void;
  summonTimerRef?: { current: number };
  playSound?: (sound: SoundId, loop?: boolean, volumeOverride?: number) => void;
  npcHp?: number;
  npcMaxHp?: number;
  onGrabPlayer?: (flipped: boolean) => void;
  onThrowStart?: (npcX: number, npcDirection: "left" | "right") => void;
  onThrowPlayer?: (damageMultiplier: number) => void;
  onPushPlayer?: (npcX: number) => void;
  onGroundPaperHit?: () => void;
  onPaperExplode?: () => void;
  onArmorBuff?: (x: number, y: number) => void;
  onLaserHit?: () => void;
  onStuckPaperExplode?: () => void;
  onApplyDebuff?: (status: NewPlayerStatus) => void;
};

export type BehaviorResult = {
  x: number;
  y?: number;
  state?: NPCBattleState["state"];
};
