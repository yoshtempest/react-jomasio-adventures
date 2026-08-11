import { useEffect, useRef, useState } from "react";
import { Utensils } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  useCharacterProgress,
  MAX_HUNGER,
} from "@/contexts/CharacterProgressContext";
import styles from "./styles.module.css";

const ANIM_DURATION = 1200;
const HIDE_DELAY = 1600;

export function HungerBarNotification() {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();

  const hunger = progress[player.character]?.hunger ?? 0;

  const prevHungerRef = useRef(hunger);
  const prevCharacterRef = useRef(player.character);

  const [visible, setVisible] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);

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
      prevHungerRef.current = hunger;
      return;
    }

    const oldHunger = prevHungerRef.current;
    const newHunger = hunger;
    prevHungerRef.current = newHunger;

    if (newHunger <= oldHunger) return;

    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    const from = (oldHunger / MAX_HUNGER) * 100;
    const to = (newHunger / MAX_HUNGER) * 100;

    let segStart = 0;

    setVisible(true);
    setDisplayPct(from);

    function tick(ts: number) {
      if (segStart === 0) segStart = ts;

      const elapsed = ts - segStart;
      const t = Math.min(elapsed / ANIM_DURATION, 1);
      const eased = 1 - (1 - t) * (1 - t) * (1 - t);

      setDisplayPct(from + (to - from) * eased);

      if (t >= 1) {
        hideTimerRef.current = setTimeout(() => {
          setVisible(false);
        }, HIDE_DELAY);
        return;
      }

      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
  }, [hunger, player.character]);

  if (!visible) return null;

  return (
    <div className={styles.container}>
      <div className="barNotification">
        <div
          className={styles.fill}
          style={{ width: `${Math.min(100, displayPct)}%` }}
        />
        <span className="labelNotification">
          Fome {Math.round(displayPct)}/{MAX_HUNGER}
        </span>
      </div>
      <div className={styles.icon}>
        <Utensils size={20} />
      </div>
    </div>
  );
}
