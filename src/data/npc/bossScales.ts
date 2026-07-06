export const bossScales: Record<string, { base: number; phase2: number }> = {
  deise: { base: 1.8, phase2: 3 },
  slimita: { base: 1.6, phase2: 4 },
  hungryKing: { base: 3, phase2: 5 },
  maurao: { base: 2.2, phase2: 3 },
};

/** Fração do container que fica abaixo dos pés do personagem (letterboxing). */
export const npcSpriteYOffset: Record<string, number> = {
  hungryKing: 0.20,
};
