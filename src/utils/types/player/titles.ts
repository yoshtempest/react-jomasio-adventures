export type TitleCondition =
  | { type: "killNpcType"; npcTypePrefix: string; count: number }
  | { type: "killNpcClass"; npcClass: string; count: number }
  | { type: "killTotal"; count: number };

export type TitleBonusStat = {
  stat: "hp" | "strength" | "intelligence" | "damage";
  value: number;
};

export type TitleDef = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: TitleCondition;
  bonus: TitleBonusStat[];
};

export type TitleProgress = {
  current: number;
  unlocked: boolean;
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
