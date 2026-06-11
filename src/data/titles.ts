import type { TitleDef } from "@/utils/types/player/titles";

export const TITLES: Record<string, TitleDef> = {
  matadorDeMortos: {
    id: "matadorDeMortos",
    name: "Matador de Mortos",
    description: "Elimine 100 NPCs do tipo hungry",
    icon: "skull",
    condition: { type: "killNpcType", npcTypePrefix: "hungry", count: 100 },
    bonus: [{ stat: "damage", value: 5 }],
  },
  acertadorDeCabras: {
    id: "acertadorDeCabras",
    name: "Acertador de Cabras",
    description: "Elimine 50 cabras",
    icon: "goat",
    condition: { type: "killNpcType", npcTypePrefix: "goat", count: 50 },
    bonus: [{ stat: "damage", value: 3 }],
  },
  exterminadorDeFigurantes: {
    id: "exterminadorDeFigurantes",
    name: "Exterminador de Figurantes",
    description: "Elimine 50 figurantes de cultos",
    icon: "cultist",
    condition: { type: "killNpcType", npcTypePrefix: "figurant", count: 50 },
    bonus: [{ stat: "strength", value: 2 }],
  },
  cacadorDeRaros: {
    id: "cacadorDeRaros",
    name: "Caçador de Raros",
    description: "Elimine 30 NPCs raros",
    icon: "rare",
    condition: { type: "killNpcClass", npcClass: "rare", count: 30 },
    bonus: [{ stat: "intelligence", value: 2 }],
  },
  matadorDeChefes: {
    id: "matadorDeChefes",
    name: "Matador de Chefões",
    description: "Elimine 10 chefes",
    icon: "boss",
    condition: { type: "killNpcClass", npcClass: "boss", count: 10 },
    bonus: [{ stat: "hp", value: 20 }],
  },
  lendario: {
    id: "lendario",
    name: "Lendário",
    description: "Elimine 3 NPCs lendários",
    icon: "legendary",
    condition: { type: "killNpcClass", npcClass: "legendary", count: 3 },
    bonus: [
      { stat: "strength", value: 2 },
      { stat: "intelligence", value: 2 },
      { stat: "hp", value: 10 },
    ],
  },
  batalhador: {
    id: "batalhador",
    name: "Batalhador",
    description: "Elimine 200 NPCs no total",
    icon: "warrior",
    condition: { type: "killTotal", count: 200 },
    bonus: [
      { stat: "strength", value: 1 },
      { stat: "intelligence", value: 1 },
    ],
  },
};

export const TITLE_IDS = Object.keys(TITLES);

export function getTitleById(id: string): TitleDef | undefined {
  return TITLES[id];
}
