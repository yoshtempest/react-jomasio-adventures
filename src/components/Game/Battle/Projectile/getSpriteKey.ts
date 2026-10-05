import { spriteMap } from "@/data/battle/projectileSprites";

export function getSpriteKey(projectile: Projectile): string {
  if (projectile.variant === "rain") return projectile.sprite ?? "spear";
  if (projectile.variant === "cut") {
    if (projectile.sprite === "goat") {
      return projectile.state === "idle" ? "goat-idle" : "goat-walk";
    }
    return projectile.sprite && spriteMap[projectile.sprite]
      ? projectile.sprite
      : "spoon";
  }

  const sprite = projectile.sprite;
  // `goat` só é usado por `common`/`cut`, que têm estado de caminhada; o
  // projétil terrestre não tem — ele é fixo rente ao chão.
  if (sprite === "goat" && projectile.variant !== "ground") {
    return projectile.state === "idle" ? "goat-idle" : "goat-walk";
  }

  return sprite && spriteMap[sprite] ? sprite : "spoon";
}