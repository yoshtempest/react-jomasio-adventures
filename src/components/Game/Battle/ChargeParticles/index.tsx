import type { ChargeParticle } from "@/hooks/battle/charge/useAttack";

type Props = {
  particles: ChargeParticle[];
  playerX: number;
  playerY: number;
  chargeReady: boolean;
  isCharging: boolean;
};

export function ChargeParticles({
  particles,
  playerX,
  playerY,
  chargeReady,
  isCharging,
}: Props) {
  if (!isCharging || particles.length === 0) return null;

  const glowColor = chargeReady ? "#00d4ff" : "#0088ff";

  return (
    <div
      style={{
        position: "absolute",
        left: playerX,
        top: playerY,
        pointerEvents: "none",
        zIndex: 11,
      }}
    >
      {particles.map((p) => {
        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);
        const yOffset = p.offsetY - progress * 50;
        const particleSize = p.size * (chargeReady ? 1.5 : 1);

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              width: particleSize,
              height: particleSize,
              left: p.offsetX,
              top: yOffset,
              borderRadius: "50%",
              background: glowColor,
              opacity: alpha,
              boxShadow: `0 0 ${particleSize * 3}px ${glowColor}`,
              transition: "top 0.1s linear, opacity 0.1s linear",
            }}
          />
        );
      })}

      {chargeReady && (
        <>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 60,
              height: 60,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `3px solid ${glowColor}`,
              opacity: 0.6,
              animation: "chargePulse 0.8s ease-in-out infinite alternate",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 80,
              height: 80,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `2px solid ${glowColor}`,
              opacity: 0.3,
              animation: "chargePulse 1.2s ease-in-out infinite alternate",
            }}
          />
        </>
      )}

      <style>{`
        @keyframes chargePulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
