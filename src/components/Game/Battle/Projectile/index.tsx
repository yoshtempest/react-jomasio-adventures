import { asset } from "@/utils/asset";
import { spriteMap } from "@/data/battle/projectileSprites";

type Props = {
  projectile: Projectile;
  scaleX: number;
  scaleY: number;
};

function getSpriteKey(projectile: Projectile): string {
  if (projectile.variant === "rain") return projectile.sprite ?? "spear";

  const sprite = projectile.sprite;
  if (sprite === "goat") {
    return projectile.state === "idle" ? "goat-idle" : "goat-walk";
  }

  return sprite && spriteMap[sprite] ? sprite : "staff";
}

export function ProjectileSprite({ projectile, scaleX, scaleY }: Props) {
  const spriteKey = getSpriteKey(projectile);
  const src = spriteMap[spriteKey];

  if (projectile.variant === "rain") {
    const now = Date.now();
    const elapsed = now - projectile.warningStartTime;
    const isWarning = elapsed < projectile.warningDuration;

    if (isWarning) {
      return (
        <>
          {projectile.spears.map((spear, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: spear.x * scaleX,
                top: 600 * scaleY - 10,
                width: 16,
                height: 10,
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderRadius: 2,
                zIndex: 9999,
                pointerEvents: "none",
              }}
            />
          ))}
        </>
      );
    }

    return (
      <>
        {projectile.spears.map((spear, i) => (
          <img
            key={i}
            src={asset(src)}
            style={{
              position: "absolute",
              left: spear.x * scaleX,
              top: spear.y * scaleY,
              width: 60,
              transform: "scaleY(-1)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          />
        ))}
      </>
    );
  }

  return (
    <img
      src={asset(src)}
      style={{
        position: "absolute",
        left: projectile.x * scaleX,
        top: projectile.y * scaleY,
        width: 100,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
