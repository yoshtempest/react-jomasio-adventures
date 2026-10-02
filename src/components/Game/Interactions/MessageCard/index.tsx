import { useMemo } from "react";

import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";
import { useStableCallback } from "@/hooks/useStableCallback";

import { resolveAsset, historyPath } from "@/utils/paths";
import type { GameControlLayer } from "@/utils/types/player/controls";

import styles from "./styles.module.css";

type Props = {
  title?: string;
  subtitle?: string;
  description: string;
  onClose: () => void;
};

export function MessageCard({
  title,
  subtitle,
  description,
  onClose,
}: Props) {
  // ── camada de input: o topo da pilha engole tudo e confirm/cancel fecham ──
  const close = useStableCallback(onClose);
  const controls = useMemo<GameControlLayer>(
    () => ({
      onUp: () => true,
      onDown: () => true,
      onLeft: () => true,
      onRight: () => true,
      onConfirm: () => {
        close();
        return true;
      },
      onCancel: () => {
        close();
        return true;
      },
    }),
    [close],
  );

  useGameControlsLayer(controls, [controls]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.cardContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className={styles.cardImage}
          src={resolveAsset(historyPath("messageCard.svg"))}
          alt=""
        />
        <div className={styles.textOverlay}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
          <div className={styles.description}>{description}</div>
        </div>
      </div>
    </div>
  );
}

export default MessageCard;
