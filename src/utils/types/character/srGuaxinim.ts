export type EnemyTarget = {
    id: string;
    x: number;
    y: number;
};

export type KillerQueenOverlay = {
  active: boolean;
  x: number;
  y: number;
  sprite: "idle" | "touch" | "prePalm" | "palm";
  opacity: number;
  flip: boolean;
};

export type ExtraPunchVisual = {
  id: number;
  x: number;
  y: number;
};

export type OraPunch = ExtraPunchVisual & {
  targetX: number;
  targetY: number;
  born: number;
};

/** Resultado do hit do punch: posição do alvo atingido + se era o NPC principal. */
export type PunchHitResult = { x: number; y: number; isMain: boolean } | null;