import { useEffect, useRef, useState } from "react";
import { Moon } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  useCharacterProgress,
  MAX_SLEEP,
} from "@/contexts/CharacterProgressContext";
import styles from "./styles.module.css";

const ANIM_DURATION = 1200;
const HIDE_DELAY = 1600;

export function SleepBarNotification() {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();

  const sleep = progress[player.character]?.sleep ?? 0;

  const prevSleepRef = useRef(sleep);
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
      prevSleepRef.current = sleep;
      return;
    }

    const oldSleep = prevSleepRef.current;
    const newSleep = sleep;
    prevSleepRef.current = newSleep;

    if (newSleep <= oldSleep) return;

    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    const from = (oldSleep / MAX_SLEEP) * 100;
    const to = (newSleep / MAX_SLEEP) * 100;

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
  }, [sleep, player.character]);

  if (!visible) return null;

  return (
    <div className={styles.container}>
      <div className="barNotification">
        <div
          className={styles.fill}
          style={{ width: `${Math.min(100, displayPct)}%` }}
        />
        <span className="labelNotification">
          Sono {Math.round(displayPct)}/{MAX_SLEEP}
        </span>
      </div>
      <div className={styles.icon}>
        <Moon size={20} />
      </div>
    </div>
  );
}
