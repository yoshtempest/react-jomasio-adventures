import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import styles from "./styles.module.css";

type Segment = {
  from: number;
  to: number;
  duration: number;
  level: number;
};

const HIDE_DELAY = 1800;

export function XPBarNotification() {
  const { player } = usePlayer();
  const { progress, getXPToNextLevel } = useCharacterProgress();

  const charProgress = progress[player.character];

  // XP/nível anteriores vêm junto do personagem a que pertencem: trocar de
  // personagem troca os dois números sem que ele tenha ganhado XP.
  const prevRef = useRef({
    character: player.character,
    xp: charProgress.xp,
    level: charProgress.level,
  });

  const [visible, setVisible] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(charProgress.level);
  const [showArrow, setShowArrow] = useState(false);

  const animRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const prev = prevRef.current;
    const newXP = charProgress.xp;
    const newLevel = charProgress.level;

    // Reancora sempre — inclusive na troca de personagem, que só reconstroi a
    // referencia sem animar nada.
    prevRef.current = {
      character: player.character,
      xp: newXP,
      level: newLevel,
    };

    function stopAnim() {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }

    // Trocar de personagem não é ganho de XP: descarta a barra em andamento em
    // vez de animar do personagem anterior para o novo.
    if (player.character !== prev.character) {
      stopAnim();
      setVisible(false);
      setShowArrow(false);
      return;
    }

    const oldXP = prev.xp;
    const oldLevel = prev.level;

    if (oldXP === newXP && oldLevel === newLevel) return;

    stopAnim();

    const segments: Segment[] = [];
    const levelsGained = newLevel - oldLevel;

    if (levelsGained === 0) {
      const xpNeeded = getXPToNextLevel(oldLevel);
      segments.push({
        from: xpNeeded > 0 ? (oldXP / xpNeeded) * 100 : 0,
        to: xpNeeded > 0 ? (newXP / xpNeeded) * 100 : 0,
        duration: 1500,
        level: newLevel,
      });
    } else {
      const firstXpNeeded = getXPToNextLevel(oldLevel);
      segments.push({
        from: firstXpNeeded > 0 ? (oldXP / firstXpNeeded) * 100 : 0,
        to: 100,
        duration: 800,
        level: oldLevel,
      });

      for (let i = 1; i < levelsGained; i++) {
        segments.push({
          from: 0,
          to: 100,
          duration: 400,
          level: oldLevel + i,
        });
      }

      const lastXpNeeded = getXPToNextLevel(newLevel);
      segments.push({
        from: 0,
        to: lastXpNeeded > 0 ? (newXP / lastXpNeeded) * 100 : 0,
        duration: 800,
        level: newLevel,
      });
    }

    let segIdx = 0;
    let segStart = 0;

    setVisible(true);
    setShowArrow(levelsGained > 0);
    setDisplayLevel(segments[0]!.level);
    setDisplayPct(segments[0]!.from);

    function tick(ts: number) {
      if (segStart === 0) segStart = ts;

      const seg = segments[segIdx];
      if (!seg) {
        hideTimerRef.current = setTimeout(() => {
          setVisible(false);
          setShowArrow(false);
        }, HIDE_DELAY);
        return;
      }

      const elapsed = ts - segStart;
      const t = Math.min(elapsed / seg.duration, 1);
      const eased = 1 - (1 - t) * (1 - t) * (1 - t);

      setDisplayPct(seg.from + (seg.to - seg.from) * eased);
      setDisplayLevel(seg.level);

      if (t >= 1) {
        segIdx++;
        segStart = ts;
        if (segIdx >= segments.length) {
          hideTimerRef.current = setTimeout(() => {
            setVisible(false);
            setShowArrow(false);
          }, HIDE_DELAY);
          return;
        }
      }

      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
  }, [player.character, charProgress.xp, charProgress.level, getXPToNextLevel]);

  if (!visible) return null;

  const xpNeeded = getXPToNextLevel(displayLevel);

  return (
    <div className={styles.container}>
      <div className="barNotification">
        <div
          className={styles.fill}
          style={{ width: `${Math.min(100, displayPct)}%` }}
        />
        <span className="labelNotification">
          Nv.{displayLevel} —{" "}
          {Math.round(xpNeeded > 0 ? (displayPct / 100) * xpNeeded : 0)}/
          {xpNeeded} XP
        </span>
      </div>
      {showArrow && (
        <div className={styles.arrow}>
          <ArrowUp size={20} />
        </div>
      )}
    </div>
  );
}
