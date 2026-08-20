export type BattleObstacleType = "wall" | "platform";

export type BattleObstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: BattleObstacleType;
};

export type BattleMapConfig = {
  obstacles: BattleObstacle[];
};
