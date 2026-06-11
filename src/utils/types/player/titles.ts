export type TitleCondition =
  | { type: "killNpcType"; npcTypePrefix: string }
  | { type: "killNpcClass"; npcClass: string }
  | { type: "killTotal" };

export type TitleBonusStat = {
  stat: "hp" | "strength" | "intelligence" | "damage";
  value: number;
};

export type TitleLevel = {
  count: number;
  bonus: TitleBonusStat[];
};

export type TitleDef = {
  id: string;
  name: string;
  description: string;
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
};
