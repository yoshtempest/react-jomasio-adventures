export type Projectile = {
  x: number;
  y: number;

  startX: number;
  startY: number;
  
  dirX: number;
  dirY: number;
  sprite?: string;
  createdAt: number;
  state: "walk" | "idle";
};