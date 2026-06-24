import type { ChargeParticle } from "@/hooks/battle/charge/useAttack";
import styles from "./styles.module.css";

type Props = {
  particles: ChargeParticle[];
  playerX: number;
  playerY: number;
  chargeReady: boolean;
  isCharging: boolean;
};

const AURA_COLORS = {
  glow: "#ff2200",
  glowReady: "#ff6600",
  innerGlow: "#ffcc00",
  particle: "#ff4400",
  particleReady: "#ff8800",
} as const;

export function ChargeParticles({
  particles,
  playerX,
  playerY,
  chargeReady,
  isCharging,
}: Props) {
  if (!isCharging || particles.length === 0) return null;

  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;
  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;
  const DANTIAN_OFFSET = 40;

  const glowColor = chargeReady ? AURA_COLORS.glowReady : AURA_COLORS.glow;

  return (
    <div
      className={styles.container}
      style={{
        left: playerX * scaleX,
        top: (playerY - DANTIAN_OFFSET) * scaleY,
      }}
    >
      <div
        className={styles.auraGlow}
        style={{
          background: `radial-gradient(circle, ${AURA_COLORS.innerGlow}22 0%, ${glowColor}44 40%, ${glowColor}22 70%, transparent 100%)`,
        }}
      />

      <div
        className={styles.auraFlameOutline}
        style={{
          border: `3px solid ${glowColor}`,
        }}
      />

      <div className={styles.auraInnerFlame} />

      {chargeReady &&
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`streamer-${i}`}
            className={styles.streamer}
            style={{
              left: `${-30 + i * 12}px`,
              height: 60 + i * 10,
              background: `linear-gradient(to top, ${glowColor}, transparent)`,
              opacity: 0.5 + Math.random() * 0.3,
              animation: `kaiokenStreamer ${0.8 + Math.random() * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}

      {particles.map((p) => {
        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);
        const yOffset = p.offsetY - progress * 60;
        const particleSize = p.size * (chargeReady ? 1.5 : 1);
        const color = chargeReady ? AURA_COLORS.particleReady : AURA_COLORS.particle;

        return (
          <div
            key={p.id}
            className={styles.sparkParticle}
            style={{
              width: particleSize,
              height: particleSize,
              left: p.offsetX,
              top: yOffset,
              background: color,
              opacity: alpha,
              boxShadow: `0 0 ${particleSize * 4}px ${color}`,
            }}
          />
        );
      })}

      {chargeReady && (
        <>
          <div
            className={styles.pulsingRingOuter}
            style={{
              border: `3px solid ${glowColor}`,
            }}
          />
          <div className={styles.pulsingRingInner} />
        </>
      )}
    </div>
  );
}
