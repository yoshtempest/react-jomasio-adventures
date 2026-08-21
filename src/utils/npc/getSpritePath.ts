import { npcPath } from "@/utils/paths";
import { bossScales, npcSpriteYOffset } from "@/data/npc/bossScales";

export function getSpritePath(
  npcType: string,
  state: string,
  npcPhase: number = 1,
): string {
  if (npcType === "deise") {
    if (npcPhase === 2) {
      return npcPath(`/deise/phase2/${state}.svg`);
    }
    return npcPath(`/deise/${state}.svg`);
  }

  if (npcType === "slimita") {
    if (npcPhase === 2) {
      if (state === "jumping") {
        return npcPath("/slimita/phase2/air.svg");
      }
      return npcPath(`/slimita/phase2/${state}.svg`);
    }
    return npcPath(`/slimita/${state}.svg`);
  }

  if (npcType === "hungryKing" && npcPhase === 2 && state === "pitch") {
    return npcPath("/hungryKing/invoking.svg");
  }

  if (npcType === "maurao") {
    if (npcPhase === 2) {
      return npcPath(`/maurao/phase2/${state}.svg`);
    }
    return npcPath(`/maurao/${state}.svg`);
  }

  return npcPath(`/${npcType}/${state}.svg`);
}

export function getBossSizeMultiplier(
  npcType: string,
  npcPhase: number = 1,
  isAlfa: boolean = false,
): number {
  const config = bossScales[npcType];
  let base = config
    ? npcPhase === 2
      ? config.phase2
      : config.base
    : 1.4 / 1.5;
  if (isAlfa) base *= 1.5;
  return base;
}

export function getNpcSpriteYOffset(npcType: string): number {
  return npcSpriteYOffset[npcType] ?? 0;
}
