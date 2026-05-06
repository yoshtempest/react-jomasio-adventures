export type Projectile = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  sprite?: string;
  createdAt: number;
  state: "walk" | "idle";
};