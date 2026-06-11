import type { TitleDef } from "@/utils/types/player/titles";

export const TITLES: Record<string, TitleDef> = {
  matadorDeMortos: {
    id: "matadorDeMortos",
    name: "Matador de Mortos",
    description: "Elimine NPCs do tipo hungry",
    icon: "skull",
    condition: { type: "killNpcType", npcTypePrefix: "hungry" },
    levels: [
      { count: 20, bonus: [{ stat: "damage", value: 2 }] },
      { count: 50, bonus: [{ stat: "damage", value: 4 }] },
      { count: 100, bonus: [{ stat: "damage", value: 6 }] },
      { count: 200, bonus: [{ stat: "damage", value: 8 }] },
      { count: 400, bonus: [{ stat: "damage", value: 12 }] },
    ],
  },
  acertadorDeCabras: {
    id: "acertadorDeCabras",
    name: "Acertador de Cabras",
    description: "Elimine cabras",
    icon: "goat",
    condition: { type: "killNpcType", npcTypePrefix: "goat" },
    levels: [
      { count: 10, bonus: [{ stat: "damage", value: 2 }] },
      { count: 25, bonus: [{ stat: "damage", value: 3 }] },
      { count: 50, bonus: [{ stat: "damage", value: 5 }] },
      { count: 100, bonus: [{ stat: "damage", value: 8 }] },
      { count: 200, bonus: [{ stat: "damage", value: 12 }] },
    ],
  },
  exterminadorDeFigurantes: {
    id: "exterminadorDeFigurantes",
    name: "Exterminador de Figurantes",
    description: "Elimine figurantes de cultos",
    icon: "cultist",
    condition: { type: "killNpcType", npcTypePrefix: "figurant" },
    levels: [
      { count: 10, bonus: [{ stat: "strength", value: 1 }] },
      { count: 25, bonus: [{ stat: "strength", value: 2 }] },
      { count: 50, bonus: [{ stat: "strength", value: 3 }] },
      { count: 100, bonus: [{ stat: "strength", value: 5 }] },
      { count: 200, bonus: [{ stat: "strength", value: 8 }] },
    ],
  },
  cacadorDeRaros: {
    id: "cacadorDeRaros",
    name: "Caçador de Raros",
    description: "Elimine NPCs raros",
    icon: "rare",
    condition: { type: "killNpcClass", npcClass: "rare" },
    levels: [
      { count: 5, bonus: [{ stat: "intelligence", value: 1 }] },
      { count: 10, bonus: [{ stat: "intelligence", value: 2 }] },
      { count: 20, bonus: [{ stat: "intelligence", value: 3 }] },
      { count: 40, bonus: [{ stat: "intelligence", value: 5 }] },
      { count: 80, bonus: [{ stat: "intelligence", value: 8 }] },
    ],
  },
  matadorDeChefes: {
    id: "matadorDeChefes",
    name: "Matador de Chefões",
    description: "Elimine chefes",
    icon: "boss",
    condition: { type: "killNpcClass", npcClass: "boss" },
    levels: [
      { count: 2, bonus: [{ stat: "hp", value: 5 }] },
      { count: 5, bonus: [{ stat: "hp", value: 10 }] },
      { count: 10, bonus: [{ stat: "hp", value: 20 }] },
      { count: 20, bonus: [{ stat: "hp", value: 35 }] },
      { count: 40, bonus: [{ stat: "hp", value: 50 }] },
    ],
  },
  lendario: {
    id: "lendario",
    name: "Lendário",
    description: "Elimine NPCs lendários",
    icon: "legendary",
    condition: { type: "killNpcClass", npcClass: "legendary" },
    levels: [
      { count: 1, bonus: [{ stat: "strength", value: 1 }, { stat: "intelligence", value: 1 }, { stat: "hp", value: 5 }] },
      { count: 3, bonus: [{ stat: "strength", value: 2 }, { stat: "intelligence", value: 2 }, { stat: "hp", value: 10 }] },
      { count: 6, bonus: [{ stat: "strength", value: 3 }, { stat: "intelligence", value: 3 }, { stat: "hp", value: 15 }] },
      { count: 12, bonus: [{ stat: "strength", value: 5 }, { stat: "intelligence", value: 5 }, { stat: "hp", value: 25 }] },
      { count: 25, bonus: [{ stat: "strength", value: 8 }, { stat: "intelligence", value: 8 }, { stat: "hp", value: 40 }] },
    ],
  },
  batalhador: {
    id: "batalhador",
    name: "Batalhador",
    description: "Elimine NPCs no total",
    icon: "warrior",
    condition: { type: "killTotal" },
    levels: [
      { count: 50, bonus: [{ stat: "strength", value: 1 }] },
      { count: 100, bonus: [{ stat: "strength", value: 1 }, { stat: "intelligence", value: 1 }] },
      { count: 200, bonus: [{ stat: "strength", value: 2 }, { stat: "intelligence", value: 2 }] },
      { count: 500, bonus: [{ stat: "strength", value: 3 }, { stat: "intelligence", value: 3 }] },
      { count: 1000, bonus: [{ stat: "strength", value: 5 }, { stat: "intelligence", value: 5 }] },
    ],
  },
};

export const TITLE_IDS = Object.keys(TITLES);

export function getTitleById(id: string): TitleDef | undefined {
  return TITLES[id];
}
