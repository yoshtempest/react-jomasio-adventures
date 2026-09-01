import type { NPCBattleState } from "@/utils/types/npc/npc";
import type {
  GroundPaper,
  FlyingPaper,
  StuckPaper,
  LaserBeam,
} from "@/services/npc/attacks/maugrelo/state";

export type BattleEntitiesBattle = {
  piercings: { id: number; x: number; y: number }[];
  isExploding: boolean;
  npcPhase: number;
  isNpcDying: boolean;
};

export type BattleEntityPositioning = {
  battleScaleX: number;
  battleScaleY: number;
};

export type MainNpcState = NPCBattleState & {
  projectile: Projectile | null;
  projectiles: Projectile[];
  groundPapers: GroundPaper[];
  stuckPapers: StuckPaper[];
  flyingPaper: FlyingPaper | null;
  laser: LaserBeam | null;
};
