export type NPCState = "idle" | "walk";

export type NPCBattleState = {
  x: number;
  y: number;
  state: NPCState;
};