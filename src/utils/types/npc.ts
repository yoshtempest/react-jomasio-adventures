export type NPCDirection = "right" | "left";

export type NPCBattleState = {
  x: number;
  y: number;
  state: "idle" | "walk" | "hit";
  direction: NPCDirection;
};