export type PetDropInfo = {
  npcType: string;
  npcLabel: string;
  chance: number;
};

export const PET_DROPS: Record<string, PetDropInfo> = {
  pet_goat: { npcType: "goat", npcLabel: "Bode", chance: 0.01 },
  pet_hungryDeath: {
    npcType: "hungryDeath",
    npcLabel: "Morto de Fome",
    chance: 0.05,
  },
  pet_piupiu: { npcType: "piupiu", npcLabel: "Piupiu", chance: 0.03 },
  pet_hungryKing: {
    npcType: "hungryKing",
    npcLabel: "Rei dos Mortos de Fome",
    chance: 0.01,
  },
  pet_dog: { npcType: "lupita", npcLabel: "Lupita", chance: 0.01 },
  pet_fishKing: { npcType: "mobyDick", npcLabel: "Moby Dick", chance: 0.005 },
};
