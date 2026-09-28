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
  atomicHalo?: boolean;
  atomicFlash?: boolean;
  mugetsuBlink?: "out" | "in" | null;
  levelUpParticles?: boolean;
}
