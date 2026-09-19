import type { NpcType } from "@/data/npc";

/** Sprite da lápide relativo à direção que o jogador olhava na batalha. */
export type TombstoneVariant = "front" | "back" | "side";

export type Tombstone = {
  id: string;
  locationId: string;
  x: number;
  y: number;
  variant: TombstoneVariant;
  npcType: NpcType;
};

/** Posição/direção do jogador no momento em que a batalha começou. */
export type TombstoneSpawnPosition = {
  gridX: number;
  gridY: number;
  direction: Direction;
};

/**
 * Alvo da lápide: pode vir da posição do jogador (tile em frente) ou de um
 * tile fixo — usado quando o NPC derrotado está preso a um lugar do mapa
 * (ex: cães mortos de fome do football court).
 */
export type TombstoneTarget = TombstoneSpawnPosition | { x: number; y: number };

export type PendingTombstoneSpawn = TombstoneTarget & {
  locationId: string;
};

/** Lápides ativas por local (só as não coletadas são persistidas). */
export type TombstonesSaveData = Record<string, Tombstone[]>;
