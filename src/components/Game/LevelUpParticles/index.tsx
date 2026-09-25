import { useEffect, useRef, useState } from "react";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import styles from "./styles.module.css";

/** Duração da animação de partículas do level up (2s). */
export const LEVEL_UP_PARTICLES_MS = 2000;

type Props = {
  character: CharacterId;
  /** Área (px) do sprite: as partículas orbitam ao redor do centro dela. */
  size: number;
};

const PARTICLES_PER_BURST = 18;
const PARTICLE_COLORS = ["#ffd700", "#ffffff", "#ffb347", "#fff59d"];

type Particle = {
  key: number;
  dx: number;
  dy: number;
  delay: number;
  scale: number;
  color: string;
  size: number;
};

function makeParticles(size: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLES_PER_BURST; i++) {
    const angle = (i / PARTICLES_PER_BURST) * Math.PI * 2 + Math.random() * 0.45;
    const radius = size * (0.38 + Math.random() * 0.3);
    particles.push({
      key: i,
      dx: Math.cos(angle) * radius,
      dy: Math.sin(angle) * radius - size * 0.12,
      delay: Math.random() * 0.15,
      scale: 0.6 + Math.random() * 0.9,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length] ?? "#ffd700",
      size: 5 + Math.random() * 7,
    });
  }
  return particles;
}

/**
 * Partículas de level up ao redor do sprite do personagem: surgem (uma vez)
 * sempre que o nível do personagem sobe e duram 2s. Funciona em qualquer modo
 * que monte o sprite do jogador (battle e explore).
 */
export function LevelUpParticles({ character, size }: Props) {
  const { progress } = useCharacterProgress();
  const level = progress[character]?.level ?? 1;

  const prevLevelRef = useRef(level);
  const particlesRef = useRef<Particle[]>([]);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (level > prevLevelRef.current) {
      prevLevelRef.current = level;
      particlesRef.current = makeParticles(size);
      setBurstKey((key) => key + 1);
    } else {
      prevLevelRef.current = level;
    }
  }, [level, size]);

  if (burstKey === 0) return null;

  return (
    <div
      key={burstKey}
      className={styles.burst}
      style={{ width: size, height: size }}
    >
      {particlesRef.current.map((particle) => {
        const particleStyle = {
          width: particle.size,
          height: particle.size,
          background: `radial-gradient(circle, ${particle.color} 0%, ${particle.color}55 55%, transparent 100%)`,
          boxShadow: `0 0 ${particle.size}px ${particle.color}66`,
          animationDelay: `${particle.delay}s`,
          "--dx": `${particle.dx}px`,
          "--dy": `${particle.dy}px`,
          "--scale": particle.scale,
        } as React.CSSProperties & {
          "--dx": string;
          "--dy": string;
          "--scale": number;
        };
        return (
          <span
            key={particle.key}
            className={styles.particle}
            style={particleStyle}
          />
        );
      })}
      <span className={styles.ring} style={{ animationDelay: "0.02s" }} />
      <span className={styles.ring} style={{ animationDelay: "0.18s" }} />
    </div>
  );
}