import { useMemo } from "react";
import styles from "./styles.module.css";

type Particle = {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
  hue: number;
};

type Props = {
  count?: number;
};

export function ParticlesBackground({ count = 30 }: Props) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 4,
        left: Math.random() * 100,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.7,
        hue: Math.floor(Math.random() * 60) + 20,
      })),
    [count],
  );

  return (
    <div className={styles.layer} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={
            {
              "--p-size": `${p.size}px`,
              "--p-left": p.left,
              "--p-duration": `${p.duration}s`,
              "--p-delay": `${p.delay}s`,
              "--p-opacity": p.opacity,
              "--p-hue": p.hue,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
