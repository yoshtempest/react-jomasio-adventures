import { asset } from "@/utils/asset";
import { bossScales, npcSpriteYOffset } from "@/data/npc/bossScales";

export function getSpritePath(
  npcType: string,
  state: string,
  npcPhase: number = 1,
): string {
  if (npcType === "deise") {
    if (npcPhase === 2) {
      return asset(`assets/npcs/deise/phase2/${state}.svg`);
    }
    return asset(`assets/npcs/deise/${state}.svg`);
  }

  if (npcType === "slimita") {
    if (npcPhase === 2) {
      return asset(`assets/npcs/slimita/phase2/${state}.svg`);
    }
    return asset(`assets/npcs/slimita/${state}.svg`);
  }

  if (npcType === "hungryKing" && npcPhase === 2 && state === "pitch") {
    return asset("assets/npcs/hungryKing/invoking.svg");
  }

  return asset(`assets/npcs/${npcType}/${state}.svg`);
}

export function getBossSizeMultiplier(
  npcType: string,
  npcPhase: number = 1,
): number {
  const config = bossScales[npcType];
  if (config) {
    return npcPhase === 2 ? config.phase2 : config.base;
  }
  return 1.4;
}

export function getNpcSpriteYOffset(npcType: string): number {
  return npcSpriteYOffset[npcType] ?? 0;
}
