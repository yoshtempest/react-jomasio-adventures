export type NPCDirection = "right" | "left";

export type NPCBattleState = {
  x: number;
  y: number;
  state: "idle" | "walk" | "hit" | "jumping";
  direction: NPCDirection;

  ai?: {
    slimita?: {
      state: "idle" | "air" | "resting";
      startTime: number;
      targetX: number;
    };
  };
};

export type SummonedNpc = {
  id: string;
  npcType: string;
  x: number;
  y: number;
  direction: NPCDirection;
  state: "idle" | "walk";
  hp: number;
  maxHp: number;
  isDying: boolean;
};