import { createTitles } from "@/utils/titles/createTitles";
import type { TitleDef } from "@/utils/types/player/titles";
import type { ElementType } from "@/utils/types/battle/element";

function createElementTitle(element: ElementType) {
  return {
    name: `${element} Killer`,
    description: (level: number) => {
      const bonus = [0, 1, 2, 3, 5, 10][level] ?? 0;
      return `Aumenta dano em ${bonus}% contra NPCs do elemento ${element}`;
    },
    icon: `/assets/elementsBadges/${element.toLowerCase()}.svg`,
    condition: { type: "killElement" as const, element },
    levels: [
      { count: 10, bonus: [] },
      { count: 25, bonus: [] },
      { count: 50, bonus: [] },
      { count: 100, bonus: [] },
      { count: 200, bonus: [] },
    ],
  };
}

const ELEMENT_TITLES = Object.fromEntries(
  (Object.keys({ Aquos: true, Pyrus: true, Subterra: true, Ventus: true, Darkus: true, Electricus: true, Haos: true, Metallum: true, Natura: true, Psychicus: true, Nympha: true, Draco: true, Umbra: true, Normalis: true }) as ElementType[]).map((el) => [`kill${el}`, createElementTitle(el)]),
) as Record<string, Omit<TitleDef, "id">>;

export const TITLES = createTitles({
  ...ELEMENT_TITLES,
  colecaoDePets: {
    name: "Colecionador de Pets",
    description: (level: number) => {
      const bonus = [0, 1, 2, 3, 5, 10][level] ?? 0;
      return `Aumenta chance de drop de pets em ${bonus}%`;
    },
    icon: "/assets/titlesBadges/defeatNpcs.svg",
    condition: { type: "petDrop" },
    levels: [
      { count: 1, bonus: [] },
      { count: 2, bonus: [] },
      { count: 4, bonus: [] },
      { count: 8, bonus: [] },
      { count: 16, bonus: [] },
    ],
  },
  cacadorDeAlfas: {
    name: "Caçador de Alfas",
    description: (level: number) => {
      const bonus = [0, 1, 2, 3, 5, 10][level] ?? 0;
      return `Aumenta chance de encontrar um alfa em ${bonus}%`;
    },
    icon: "/assets/titlesBadges/huntBosses.svg",
    condition: { type: "killAlfa" },
    levels: [
      { count: 1, bonus: [] },
      { count: 5, bonus: [] },
      { count: 10, bonus: [] },
      { count: 20, bonus: [] },
      { count: 40, bonus: [] },
      { count: 80, bonus: [] },
    ],
  },
  mestreDosElementos: {
    name: "Mestre dos Elementos",
    description: "Elimine NPCs de todos os elementos",
    icon: "/assets/titlesBadges/dragonSlayer.svg",
    condition: { type: "killAllElements" },
    levels: [
      { count: 5, bonus: [{ stat: "percentAllStats", value: 1 }] },
      { count: 8, bonus: [{ stat: "percentAllStats", value: 2 }] },
      { count: 10, bonus: [{ stat: "percentAllStats", value: 3 }] },
      { count: 12, bonus: [{ stat: "percentAllStats", value: 4 }] },
      { count: 14, bonus: [{ stat: "percentAllStats", value: 5 }] },
    ],
  },
  matadorDeMortos: {
    name: "Matador de Mortos",
    description: "Elimine NPCs do tipo hungry",
    icon: "/assets/titlesBadges/killHungrys.svg",
    condition: { type: "killNpcType", npcTypePrefix: "hungry" },
    levels: [
      { count: 20, bonus: [{ stat: "damage", value: 2 }] },
      { count: 50, bonus: [{ stat: "damage", value: 4 }] },
      { count: 100, bonus: [{ stat: "damage", value: 6 }] },
      { count: 200, bonus: [{ stat: "damage", value: 8 }] },
      { count: 400, bonus: [{ stat: "damage", value: 12 }] },
    ],
  },
  invicto: {
    name: "Invicto",
    description: "Vença batalhas consecutivamente sem perder",
    icon: "/assets/titlesBadges/invict.svg",
    condition: { type: "consecutiveWins" },
    levels: [
      { count: 20, bonus: [{ stat: "damage", value: 4 }] },
      { count: 50, bonus: [{ stat: "damage", value: 8 }] },
      { count: 100, bonus: [{ stat: "damage", value: 16 }] },
      { count: 200, bonus: [{ stat: "damage", value: 32 }] },
      { count: 400, bonus: [{ stat: "damage", value: 64 }] },
    ],
  },
  defensor: {
    name: "Defensor",
    description: "Bloqueie ataques",
    icon: "/assets/titlesBadges/blockAttacks.svg",
    condition: { type: "blockCount" },
    levels: [
      { count: 25, bonus: [{ stat: "shield", value: 5 }] },
      { count: 75, bonus: [{ stat: "shield", value: 10 }] },
      { count: 150, bonus: [{ stat: "shield", value: 20 }] },
      { count: 300, bonus: [{ stat: "shield", value: 35 }] },
      { count: 500, bonus: [{ stat: "shield", value: 50 }] },
      { count: 750, bonus: [{ stat: "shield", value: 75 }] },
      { count: 1000, bonus: [{ stat: "shield", value: 100 }] },
      { count: 2500, bonus: [{ stat: "shield", value: 200 }] },
      { count: 5000, bonus: [{ stat: "shield", value: 350 }] },
      { count: 10000, bonus: [{ stat: "shield", value: 500 }] },
      { count: 25000, bonus: [{ stat: "shield", value: 1250 }] },
      { count: 50000, bonus: [{ stat: "shield", value: 2500 }] },
      { count: 100000, bonus: [{ stat: "shield", value: 50000 }] },
    ],
  },
  acertadorDeCabras: {
    name: "Caçador de bodes",
    description: "Elimine bodes",
    icon: "/assets/titlesBadges/goat.svg",
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
    name: "Exterminador de Figurantes",
    description: "Elimine figurantes de cultos",
    icon: "/assets/titlesBadges/slainFigurants.svg",
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
    name: "Caçador de Raros",
    description: "Elimine NPCs raros",
    icon: "/assets/titlesBadges/huntRaresNpcs.svg",
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
    name: "Matador de Chefões",
    description: "Elimine chefes",
    icon: "/assets/titlesBadges/huntBosses.svg",
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
    name: "Lendário",
    description: "Elimine NPCs lendários",
    icon: "/assets/titlesBadges/huntLegendaryNpcs.svg",
    condition: { type: "killNpcClass", npcClass: "legendary" },
    levels: [
      {
        count: 1,
        bonus: [
          { stat: "strength", value: 1 },
          { stat: "intelligence", value: 1 },
          { stat: "hp", value: 5 },
        ],
      },
      {
        count: 3,
        bonus: [
          { stat: "strength", value: 2 },
          { stat: "intelligence", value: 2 },
          { stat: "hp", value: 10 },
        ],
      },
      {
        count: 6,
        bonus: [
          { stat: "strength", value: 3 },
          { stat: "intelligence", value: 3 },
          { stat: "hp", value: 15 },
        ],
      },
      {
        count: 12,
        bonus: [
          { stat: "strength", value: 5 },
          { stat: "intelligence", value: 5 },
          { stat: "hp", value: 25 },
        ],
      },
      {
        count: 25,
        bonus: [
          { stat: "strength", value: 8 },
          { stat: "intelligence", value: 8 },
          { stat: "hp", value: 40 },
        ],
      },
    ],
  },
  batalhador: {
    name: "Batalhador",
    description: "Elimine NPCs no total",
    icon: "/assets/titlesBadges/defeatNpcs.svg",
    condition: { type: "killTotal" },
    levels: [
      { count: 50, bonus: [{ stat: "strength", value: 1 }] },
      {
        count: 100,
        bonus: [
          { stat: "strength", value: 1 },
          { stat: "intelligence", value: 1 },
        ],
      },
      {
        count: 200,
        bonus: [
          { stat: "strength", value: 2 },
          { stat: "intelligence", value: 2 },
        ],
      },
      {
        count: 500,
        bonus: [
          { stat: "strength", value: 3 },
          { stat: "intelligence", value: 3 },
        ],
      },
      {
        count: 1000,
        bonus: [
          { stat: "strength", value: 5 },
          { stat: "intelligence", value: 5 },
        ],
      },
    ],
  },
  masoquista: {
    name: "Masoquista",
    description: "Receba dano em batalhas",
    icon: "/assets/titlesBadges/masoquist.svg",
    condition: { type: "damageTaken" },
    levels: [
      { count: 500, bonus: [{ stat: "armor", value: 2 }] },
      { count: 1500, bonus: [{ stat: "armor", value: 5 }] },
      { count: 3000, bonus: [{ stat: "armor", value: 10 }] },
      { count: 6000, bonus: [{ stat: "armor", value: 18 }] },
      { count: 10000, bonus: [{ stat: "armor", value: 30 }] },
      { count: 15000, bonus: [{ stat: "armor", value: 45 }] },
      { count: 20000, bonus: [{ stat: "armor", value: 60 }] },
      { count: 30000, bonus: [{ stat: "armor", value: 90 }] },
      { count: 45000, bonus: [{ stat: "armor", value: 135 }] },
      { count: 75000, bonus: [{ stat: "armor", value: 210 }] },
      { count: 150000, bonus: [{ stat: "armor", value: 300 }] },
      { count: 500000, bonus: [{ stat: "armor", value: 500 }] },
      { count: 1000000, bonus: [{ stat: "armor", value: 1000 }] },
      { count: 10000000, bonus: [{ stat: "armor", value: 5000 }] },
    ],
  },
  atacante: {
    name: "Atacante",
    description: "Cause dano em batalhas",
    icon: "/assets/titlesBadges/causesDamage.svg",
    condition: { type: "damageDealt" },
    levels: [
      { count: 500, bonus: [{ stat: "damage", value: 2 }] },
      { count: 1500, bonus: [{ stat: "damage", value: 5 }] },
      { count: 4000, bonus: [{ stat: "damage", value: 10 }] },
      { count: 8000, bonus: [{ stat: "damage", value: 18 }] },
      { count: 15000, bonus: [{ stat: "damage", value: 30 }] },
      { count: 25000, bonus: [{ stat: "damage", value: 45 }] },
      { count: 50000, bonus: [{ stat: "damage", value: 75 }] },
      { count: 100000, bonus: [{ stat: "damage", value: 100 }] },
      { count: 150000, bonus: [{ stat: "damage", value: 120 }] },
      { count: 300000, bonus: [{ stat: "damage", value: 150 }] },
      { count: 500000, bonus: [{ stat: "damage", value: 210 }] },
      { count: 1000000, bonus: [{ stat: "damage", value: 300 }] },
      { count: 5000000, bonus: [{ stat: "damage", value: 400 }] },
      { count: 10000000, bonus: [{ stat: "damage", value: 500 }] },
    ],
  },
  dragonSlayer: {
    name: "Dragon Slayer",
    description: "Derrote o Rei Dragão",
    icon: "/assets/titlesBadges/dragonSlayer.svg",
    condition: { type: "killNpcType", npcTypePrefix: "dragon" },
    levels: [
      { count: 1, bonus: [{ stat: "percentAllStats", value: 1 }] },
      { count: 5, bonus: [{ stat: "percentAllStats", value: 2 }] },
      { count: 10, bonus: [{ stat: "percentAllStats", value: 3 }] },
      { count: 25, bonus: [{ stat: "percentAllStats", value: 4 }] },
      { count: 50, bonus: [{ stat: "percentAllStats", value: 5 }] },
      { count: 100, bonus: [{ stat: "percentAllStats", value: 8 }] },
      { count: 250, bonus: [{ stat: "percentAllStats", value: 12 }] },
      { count: 500, bonus: [{ stat: "percentAllStats", value: 16 }] },
      { count: 750, bonus: [{ stat: "percentAllStats", value: 20 }] },
      { count: 1000, bonus: [{ stat: "percentAllStats", value: 25 }] },
    ],
  },
  ghostPlayer: {
    name: "Ghost Player",
    description: "Evite ataques em batalhas",
    icon: "/assets/titlesBadges/enemyMissAttacks.svg",
    condition: { type: "dodgeCount" },
    levels: [
      { count: 50, bonus: [{ stat: "enemyMissChance", value: 1 }] },
      { count: 150, bonus: [{ stat: "enemyMissChance", value: 3 }] },
      { count: 400, bonus: [{ stat: "enemyMissChance", value: 5 }] },
      { count: 800, bonus: [{ stat: "enemyMissChance", value: 8 }] },
      { count: 1500, bonus: [{ stat: "enemyMissChance", value: 12 }] },
      { count: 2500, bonus: [{ stat: "enemyMissChance", value: 15 }] },
      { count: 5000, bonus: [{ stat: "enemyMissChance", value: 20 }] },
      { count: 10000, bonus: [{ stat: "enemyMissChance", value: 50 }] },
    ],
  },
});

export const TITLE_IDS = Object.keys(TITLES);

export function getTitleById(id: string): TitleDef | undefined {
  return TITLES[id];
}
