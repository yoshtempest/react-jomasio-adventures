import type { ChargeParticle } from "@/utils/types/battle/charge";
import styles from "./styles.module.css";
import { ProjectileConstants } from "@/data/projectile";

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

const FLAME_SPIKE_ANGLES = [-70, -50, -35, -20, -10, 0, 10, 20, 35, 50, 70];

export function ChargeParticles({
  particles,
  playerX,
  playerY,
  chargeReady,
  isCharging,
}: Props) {
  if (!isCharging || particles.length === 0) return null;

  const scaleX = window.innerWidth / ProjectileConstants.MAP_WIDTH;
  const scaleY = window.innerHeight / ProjectileConstants.MAP_HEIGHT;
  const DANTIAN_OFFSET = 40;

  const glowColor = chargeReady ? AURA_COLORS.glowReady : AURA_COLORS.glow;
  const spikeColors = chargeReady
    ? ["#ff6600", "#ff8800", "#ffcc00"]
    : ["#ff2200", "#ff4400", "#ff6600"];

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
          background: `radial-gradient(ellipse at 50% 55%, ${AURA_COLORS.innerGlow}33 0%, ${glowColor}55 35%, ${glowColor}33 60%, transparent 100%)`,
        }}
      />

      <div
        className={styles.auraFlameOutline}
        style={{
          border: `2px solid ${glowColor}`,
          background: `radial-gradient(ellipse at 50% 55%, ${glowColor}22 0%, transparent 70%)`,
        }}
      />

      <div className={styles.auraInnerFlame} />

      {FLAME_SPIKE_ANGLES.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const height = 25 + Math.random() * 15;
        const colorIdx = i % spikeColors.length;
        return (
          <div
            key={`spike-${i}`}
            className={styles.flameSpike}
            style={{
              left: `calc(50% + ${Math.sin(rad) * 20}px)`,
              bottom: `calc(50% - ${Math.cos(rad) * 10}px)`,
              height: `${height}px`,
              background: `linear-gradient(to top, ${glowColor}, ${spikeColors[colorIdx]}, transparent)`,
              transform: `rotate(${angle}deg)`,
              animation: `spikeFlicker ${(0.25 + Math.random() * 0.15).toFixed(2)}s ease-in-out ${(i * 0.08).toFixed(2)}s infinite alternate`,
            }}
          />
        );
      })}

      {chargeReady &&
        Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`streamer-${i}`}
            className={styles.streamer}
            style={{
              left: `${-35 + i * 10}px`,
              height: 50 + i * 12,
              background: `linear-gradient(to top, ${glowColor}, ${spikeColors[i % spikeColors.length]}, transparent)`,
              opacity: 0.3 + Math.random() * 0.3,
              animation: `kaiokenStreamer ${0.6 + Math.random() * 0.3}s ease-in-out ${i * 0.08}s infinite`,
            }}
          />
        ))}

      {particles.map((p) => {
        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);
        const yOffset = p.offsetY - progress * 80;
        const particleSize = p.size * (chargeReady ? 1.5 : 1);
        const color = chargeReady
          ? AURA_COLORS.particleReady
          : AURA_COLORS.particle;

        return (
          <div
            key={p.id}
            className={styles.sparkParticle}
            style={{
              width: particleSize,
              height: particleSize * 2,
              left: p.offsetX,
              top: yOffset,
              background: `linear-gradient(to bottom, ${color}, transparent)`,
              opacity: alpha,
            }}
          />
        );
      })}

      {chargeReady && (
        <div
          className={styles.auraGlow}
          style={{
            width: 70,
            height: 100,
            background: `radial-gradient(ellipse at 50% 55%, #ffcc0044 0%, #ff660066 30%, transparent 70%)`,
            animation: `chargePulse 0.4s ease-in-out infinite alternate`,
          }}
        />
      )}
    </div>
  );
}
