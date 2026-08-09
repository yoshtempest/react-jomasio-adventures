import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { asset } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  closedSrc: string;
  openedSrc: string;
  onComplete: () => void;
};

const CLOSED_MS = 900;
const OPENED_MS = 700;

export function ChestOpeningAnimation({
  closedSrc,
  openedSrc,
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<"closed" | "opened">("closed");
  const { pushControls } = useGameControls();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const remove = pushControls({
      blockGlobalOpen: true,
      onConfirm: () => true,
      onCancel: () => true,
      onUp: () => true,
      onDown: () => true,
      onLeft: () => true,
      onRight: () => true,
      onOpen: () => true,
    });
    return remove;
  }, [pushControls]);

  useEffect(() => {
    const closedTimer = setTimeout(() => setPhase("opened"), CLOSED_MS);
    const completeTimer = setTimeout(
      () => onCompleteRef.current(),
      CLOSED_MS + OPENED_MS,
    );
    return () => {
      clearTimeout(closedTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  const src = phase === "closed" ? closedSrc : openedSrc;

  return (
    <div className={styles.overlay}>
      <div className={styles.stage}>
        <img
          key={phase}
          className={`${styles.chest} ${
            phase === "closed" ? styles.closed : styles.opened
          }`}
          src={asset(src)}
          alt="Baú"
        />
      </div>
    </div>
  );
}
