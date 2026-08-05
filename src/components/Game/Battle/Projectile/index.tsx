import { spriteMap } from "@/data/battle/projectileSprites";

type Props = {
  projectile: Projectile;
  scaleX: number;
  scaleY: number;
  groundY?: number;
};

function getSpriteKey(projectile: Projectile): string {
  if (projectile.variant === "rain") return projectile.sprite ?? "spear";

  const sprite = projectile.sprite;
  if (sprite === "goat") {
    return projectile.state === "idle" ? "goat-idle" : "goat-walk";
  }

  return sprite && spriteMap[sprite] ? sprite : "spoon";
}

export function ProjectileSprite({
  projectile,
  scaleX,
  scaleY,
  groundY = 600,
}: Props) {
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
                left: (spear.x - 30) * scaleX,
                top: groundY * scaleY,
                width: 60 * scaleX,
                height: 10 * scaleY,
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderRadius: 100,
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
            src={src}
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
      src={src}
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
