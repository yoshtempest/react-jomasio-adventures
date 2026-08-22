import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import type { CSSProperties } from "react";
import styles from "./styles.module.css";

type SeenState = {
  value: number;
  level: number;
};

/** Último valor visto de cada barra (por animationId), gravado ao desmontar. */
const lastSeenByBar = new Map<string, SeenState>();

type Segment = {
  from: number;
  to: number;
  duration: number;
};

const VIEW_ANIMATION_MS = 1200;
const LEVEL_UP_FILL_MS = 800;
const LEVEL_UP_LOOP_MS = 400;

function clampPct(pct: number) {
  return Math.min(100, Math.max(0, pct));
}

type ProgressBarProps = {
  value: number;
  max: number;
  height?: number | string;
  color?: string;
  label?: string;
  showText?: boolean;
  className?: string;
  fillClassName?: string;
  barStyle?: CSSProperties;
  /**
   * Identidade da barra: ao ser visualizada, anima do último valor visto
   * até o atual em 2s. Se `level` tiver subido desde a última visualização,
   * toca a sequência de level up (chega em 100%, zera, seta ↑, sobe ao atual).
   */
  animationId?: string;
  /** Nível atual associado à barra (para detectar level up entre visualizações). */
  level?: number;
};

export function ProgressBar({
  value,
  max,
  height = 6,
  color,
  label,
  showText = false,
  className,
  fillClassName,
  barStyle,
  animationId,
  level = 0,
}: ProgressBarProps) {
  const pct = max > 0 ? clampPct((value / max) * 100) : 0;

  const [animPct, setAnimPct] = useState<number | null>(null);
  const [showArrow, setShowArrow] = useState(false);
  const animRef = useRef(0);

  const valueRef = useRef(value);
  valueRef.current = value;
  const maxRef = useRef(max);
  maxRef.current = max;
  const levelRef = useRef(level);
  levelRef.current = level;

  // Snapshot capturado uma única vez na montagem: o StrictMode roda o
  // cleanup (que grava o lastSeen com o valor atual) antes do segundo
  // effect, então a leitura precisa sobreviver ao re-run.
  const [seenAtMount] = useState<SeenState | null>(() =>
    animationId ? (lastSeenByBar.get(animationId) ?? null) : null,
  );

  useEffect(() => {
    if (!animationId) return;

    const saveLastSeen = () => {
      lastSeenByBar.set(animationId, {
        value: valueRef.current,
        level: levelRef.current,
      });
    };

    const seen = seenAtMount;
    if (!seen) return saveLastSeen;

    const levelsGained = Math.max(0, levelRef.current - seen.level);
    const fromPct =
      maxRef.current > 0 ? clampPct((seen.value / maxRef.current) * 100) : 0;
    const toPct =
      maxRef.current > 0
        ? clampPct((valueRef.current / maxRef.current) * 100)
        : 0;

    if (levelsGained === 0 && fromPct === toPct) {
      setAnimPct(null);
      setShowArrow(false);
      return saveLastSeen;
    }

    const segments: Segment[] = [];

    if (levelsGained === 0) {
      segments.push({ from: fromPct, to: toPct, duration: VIEW_ANIMATION_MS });
    } else {
      segments.push({ from: fromPct, to: 100, duration: LEVEL_UP_FILL_MS });
      for (let i = 1; i < levelsGained; i++) {
        segments.push({ from: 0, to: 100, duration: LEVEL_UP_LOOP_MS });
      }
      segments.push({ from: 0, to: toPct, duration: VIEW_ANIMATION_MS });
    }

    setShowArrow(levelsGained > 0);
    setAnimPct(segments[0]!.from);

    let segIdx = 0;
    let segStart = 0;

    function tick(ts: number) {
      if (segStart === 0) segStart = ts;

      const seg = segments[segIdx];
      if (!seg) {
        setAnimPct(null);
        setShowArrow(false);
        return;
      }

      const elapsed = ts - segStart;
      const t = Math.min(elapsed / seg.duration, 1);
      const eased = 1 - (1 - t) * (1 - t) * (1 - t);

      setAnimPct(seg.from + (seg.to - seg.from) * eased);

      if (t >= 1) {
        segIdx++;
        segStart = ts;
        if (segIdx >= segments.length) {
          setAnimPct(null);
          setShowArrow(false);
          return;
        }
      }

      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      saveLastSeen();
    };
  }, [animationId, seenAtMount]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      className={`${styles.bar} ${className ?? ""}`}
      style={{ height, ...barStyle }}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={`${styles.fill} ${animPct !== null ? styles.animating : ""} ${fillClassName ?? ""}`}
        style={{ width: `${animPct ?? pct}%`, backgroundColor: color }}
      />
      {showText && (
        <span className={styles.text}>
          {value}/{max}
        </span>
      )}
      {showArrow && (
        <span className={styles.arrow}>
          <ArrowUp size={14} />
        </span>
      )}
    </div>
  );
}
