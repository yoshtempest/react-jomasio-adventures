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
      baseY: number;
      targetX: number;
    };
  };
};