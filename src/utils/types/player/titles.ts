import type { ElementType } from "../battle/element";

export type TitleCondition =
  | { type: "killNpcType"; npcTypePrefix: string }
  | { type: "killNpcClass"; npcClass: NPCClass }
  | { type: "killTotal" }
  | { type: "consecutiveWins" }
  | { type: "blockCount" }
  | { type: "damageTaken" }
  | { type: "damageDealt" }
  | { type: "dodgeCount" }
  | { type: "petDrop" }
  | { type: "killAlfa" }
  | { type: "killElement"; element: ElementType }
  | { type: "killAllElements" };

export type TitleBonusStat = {
  stat:
    | "hp"
    | "strength"
    | "intelligence"
    | "damage"
    | "shield"
    | "armor"
    | "enemyMissChance"
    | "percentAllStats";
  value: number;
};

export type TitleLevel = {
  count: number;
  bonus: TitleBonusStat[];
};

export type TitleDef = {
  id: string;
  name: string;
  description: string | ((level: number) => string);
  icon: string;
  condition: TitleCondition;
  levels: TitleLevel[];
};

export type TitleProgress = {
  current: number;
  level: number;
};

export type TitlesData = {
  equippedId: string | null;
  totalKills: number;
  progress: Record<string, TitleProgress>;
};

export type TitleBonusMap = {
  damage: number;
  hp: number;
  strength: number;
  intelligence: number;
  shield: number;
  armor: number;
  enemyMissChance: number;
  percentAllStats: number;
};
