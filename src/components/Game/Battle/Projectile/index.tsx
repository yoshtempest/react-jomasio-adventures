import { spriteMap } from "@/data/battle/projectileSprites";
import { ProjectileConstants } from "@/data/projectile";
import { getViewportSize } from "@/utils/viewport";

type Props = {
  projectile: Projectile;
  groundY?: number;
};

function getSpriteKey(projectile: Projectile): string {
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
  if (sprite === "goat") {
    return projectile.state === "idle" ? "goat-idle" : "goat-walk";
  }

  return sprite && spriteMap[sprite] ? sprite : "spoon";
}

export function ProjectileSprite({ projectile, groundY = 600 }: Props) {
  const scaleX = getViewportSize().width / ProjectileConstants.MAP_WIDTH;
  const scaleY = getViewportSize().height / ProjectileConstants.MAP_HEIGHT;
  const spriteKey = getSpriteKey(projectile);
  const src = spriteMap[spriteKey];
  const isBurst = projectile.variant === "burst";
  const spriteWidth = isBurst ? 250 : 100;
  // A burst viaja com o centro do sprite alinhado à linha de voo, subindo o
  // visual até o centro do jogador (outros projéteis seguem âncora top-left).
  const spriteTransform = isBurst ? "translateY(-50%)" : undefined;

  if (projectile.variant === "cut") {
    return (
      <>
        <img
          src={src}
          style={{
            position: "absolute",
            left: projectile.upper.x * scaleX,
            top: projectile.upper.y * scaleY,
            width: 50,
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
        <img
          src={src}
          style={{
            position: "absolute",
            left: projectile.lower.x * scaleX,
            top: projectile.lower.y * scaleY,
            width: 50,
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      </>
    );
  }

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
        width: spriteWidth,
        transform: spriteTransform,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
