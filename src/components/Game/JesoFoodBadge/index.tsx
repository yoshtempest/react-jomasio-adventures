import { useState, useEffect, useCallback } from "react";
import { Timer } from "lucide-react";
import { slotKey } from "@/services/save/slotManager";
import { JESO_FOOD_KEY } from "@/data/storageKeys";
import { JESO_FOOD_COOLDOWN_MS } from "@/data/cooldowns";
import styles from "./styles.module.css";

function formatTime(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function JesoFoodBadge() {
  const calcTimeLeft = useCallback(() => {
    const stored = localStorage.getItem(slotKey(JESO_FOOD_KEY));
    const last = stored ? Number(stored) : 0;
    return Math.max(0, JESO_FOOD_COOLDOWN_MS - (Date.now() - last));
  }, []);

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    const interval = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [calcTimeLeft]);

  const isReady = timeLeft <= 0;

  return (
    <div className={`${styles.badge} ${isReady ? styles.ready : ""}`}>
      <Timer size={14} />
      <span>{isReady ? "Disponível" : formatTime(timeLeft)}</span>
    </div>
  );
}
