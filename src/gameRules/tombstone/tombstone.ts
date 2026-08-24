import { npcPath } from "@/utils/paths";
import { isNpcType } from "@/data/npc/npc";
import type {
  Tombstone,
  TombstoneSpawnPosition,
  TombstoneVariant,
} from "@/utils/types/npc/tombstone";

export const TOMBSTONE_FADE_MS = 1000;

export const MAP_GRID_COLS = 17;
export const MAP_GRID_ROWS = 13;

/**
 * A lápide nasce no tile em frente ao jogador (onde o NPC estava):
 * olhando para cima vê-se a frente da pedra, para baixo o verso,
 * e de lado a lateral.
 */
export function getTombstoneSpawn(
  position: TombstoneSpawnPosition,
): { x: number; y: number; variant: TombstoneVariant } {
  const { gridX, gridY, direction } = position;

  switch (direction) {
    case "up":
      return { x: gridX, y: gridY - 1, variant: "front" };
    case "down":
      return { x: gridX, y: gridY + 1, variant: "back" };
    case "left":
      return { x: gridX - 1, y: gridY, variant: "side" };
    case "right":
      return { x: gridX + 1, y: gridY, variant: "side" };
  }
}

export function getTombstoneSrc(variant: TombstoneVariant) {
  return npcPath(`/tombstone/${variant}.svg`);
}

function clampToGrid(value: number, max: number) {
  return Math.max(0, Math.min(max - 1, value));
}

/** Cria a lápide de um NPC derrotado; null se npcType inválido. */
export function createTombstone(
  locationId: string,
  position: TombstoneSpawnPosition,
  npcType: string,
): Tombstone | null {
  if (!isNpcType(npcType)) return null;

  const spawn = getTombstoneSpawn(position);
  const x = clampToGrid(spawn.x, MAP_GRID_COLS);
  const y = clampToGrid(spawn.y, MAP_GRID_ROWS);

  return {
    id: `${locationId}:${x}:${y}`,
    locationId,
    x,
    y,
    variant: spawn.variant,
    npcType,
  };
}
