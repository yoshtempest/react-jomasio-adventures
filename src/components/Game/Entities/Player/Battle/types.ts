import type { LucauaAttackVariant } from "@/utils/types/character/lucaua";

export interface PlayerBattleProps {
  x: number;
  y: number;
  PLAYER_SIZE: number;
  state: PlayerState;
  direction: Direction;
  character: CharacterId;
  weapon?: LucasWeapon;
  grabbedUntil?: number;
  grabFlipped?: boolean;
  form?: "vastolordForm";
  transformationFrame?: number | null;
  blinkSilhouette?: "black" | "white" | null;
  teleportSprite?: boolean;
  preAtomic?: boolean;
  /** Vitória/derrota: sprite na arena vira expressions/<tipo>.svg. */
  outroExpression?: "victory" | "defeat" | null;
  atomicHalo?: boolean;
  atomicFlash?: boolean;
  mugetsuBlink?: "out" | "in" | null;
  levelUpParticles?: boolean;
  /** Pose de mão do sprite do ataque básico do lucaua. */
  lucauaAttackVariant?: LucauaAttackVariant;
}
