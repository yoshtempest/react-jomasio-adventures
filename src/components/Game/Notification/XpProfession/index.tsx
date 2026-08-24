import { useEffect, useRef, useState } from "react";
import { ArrowUp, Medal } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useProfessionProgress } from "@/contexts/ProfessionProgressContext";
import { PROFESSIONS } from "@/data/professions";
import {
  DEFAULT_PROFESSION_PROFICIENCY,
  getProfessionXPToNextLevel,
} from "@/gameRules/professions/proficiency";
import type {
  CharacterProficiencies,
  ProfessionId,
} from "@/utils/types/player/profession";
import styles from "./styles.module.css";

type Segment = {
  from: number;
  to: number;
  duration: number;
  level: number;
};

const HIDE_DELAY = 1800;

function getProfessionName(professionId: ProfessionId) {
  return (
    PROFESSIONS.find((p) => p.id === professionId)?.name ?? professionId
  );
}

export function XpProfessionNotification() {
  const { player } = usePlayer();
  const { proficiency } = useProfessionProgress();

  const charProficiencies = proficiency[player.character];

  const prevProficienciesRef = useRef<CharacterProficiencies | null>(null);
  const prevCharacterRef = useRef(player.character);

  const [visible, setVisible] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [professionName, setProfessionName] = useState("");
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
    if (prevCharacterRef.current !== player.character) {
      prevCharacterRef.current = player.character;
      prevProficienciesRef.current = charProficiencies;
      return;
    }

    const prev = prevProficienciesRef.current;
    if (!prev) {
      prevProficienciesRef.current = charProficiencies;
      return;
    }
    prevProficienciesRef.current = charProficiencies;

    let changedId: ProfessionId | null = null;
    let changedBefore = DEFAULT_PROFESSION_PROFICIENCY;
    let changedAfter = DEFAULT_PROFESSION_PROFICIENCY;

    for (const [id, value] of Object.entries(charProficiencies)) {
      if (!value) continue;
      const before = prev[id as ProfessionId];
      if (!before || before.xp !== value.xp || before.level !== value.level) {
        changedId = id as ProfessionId;
        changedBefore = before ?? DEFAULT_PROFESSION_PROFICIENCY;
        changedAfter = value;
      }
    }

    if (!changedId) return;

    const oldXP = changedBefore.xp;
    const oldLevel = changedBefore.level;
    const newXP = changedAfter.xp;
    const newLevel = changedAfter.level;

    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    const segments: Segment[] = [];
    const levelsGained = newLevel - oldLevel;

    if (levelsGained === 0) {
      const xpNeeded = getProfessionXPToNextLevel(oldLevel);
      segments.push({
        from: xpNeeded > 0 ? (oldXP / xpNeeded) * 100 : 0,
        to: xpNeeded > 0 ? (newXP / xpNeeded) * 100 : 0,
        duration: 1500,
        level: newLevel,
      });
    } else {
      const firstXpNeeded = getProfessionXPToNextLevel(oldLevel);
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

      const lastXpNeeded = getProfessionXPToNextLevel(newLevel);
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
    setProfessionName(getProfessionName(changedId));
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
  }, [charProficiencies, player.character]);

  if (!visible) return null;

  const xpNeeded = getProfessionXPToNextLevel(displayLevel);

  return (
    <div className={styles.container}>
      <div className="barNotification">
        <div
          className={styles.fill}
          style={{ width: `${Math.min(100, displayPct)}%` }}
        />
        <span className="labelNotification">
          {professionName} Nv.{displayLevel} —{" "}
          {Math.round(xpNeeded > 0 ? (displayPct / 100) * xpNeeded : 0)}/
          {xpNeeded} XP
        </span>
      </div>
      <div className={styles.icon}>
        <Medal size={20} />
      </div>
      {showArrow && (
        <div className={styles.arrow}>
          <ArrowUp size={20} />
        </div>
      )}
    </div>
  );
}
