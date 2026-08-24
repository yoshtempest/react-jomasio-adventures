import type { NpcType } from "@/data/npc/npc";

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

export type PendingTombstoneSpawn = TombstoneSpawnPosition & {
  locationId: string;
};

/** Lápides ativas por local (só as não coletadas são persistidas). */
export type TombstonesSaveData = Record<string, Tombstone[]>;
