import { useState, useRef, useEffect } from "react";
import { loadReplays, deleteReplay } from "@/data/replays";
import { getNpcDisplayName } from "@/utils/types/npc/npcNames";
import { formatDuration } from "@/utils/formatDuration";
import { ReplayPlayer } from "@/components/Game/Battle/Replay";
import type { ReplayData } from "@/utils/types/replay";
import styles from "./styles.module.css";

export function ReplayList() {
  const [replays, setReplays] = useState<ReplayData[]>(() => loadReplays());
  const [selectedReplay, setSelectedReplay] = useState<ReplayData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReplays(loadReplays());
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex]);

  if (selectedReplay) {
    return (
      <ReplayPlayer
        replay={selectedReplay}
        onClose={() => setSelectedReplay(null)}
      />
    );
  }

  if (replays.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Nenhum replay salvo.</p>
        <p className={styles.hint}>
          Salve um replay após vencer uma batalha!
        </p>
      </div>
    );
  }

  if (confirmDelete) {
    return (
      <div className={styles.confirmBox}>
        <p>Excluir replay?</p>
        <div className={styles.confirmActions}>
          <button
            className={`${styles.confirmBtn} ${styles.confirmDanger}`}
            onClick={() => {
              deleteReplay(confirmDelete);
              setReplays(loadReplays());
              setConfirmDelete(null);
              setSelectedIndex(0);
            }}
          >
            Sim, excluir
          </button>
          <button
            className={styles.confirmBtn}
            onClick={() => {
              setConfirmDelete(null);
            }}
          >
            Não, voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div ref={listRef} className={styles.list}>
        {replays.map((r, i) => {
          const isSelected = i === selectedIndex;
          const date = new Date(r.date);
          const dateStr = date.toLocaleDateString("pt-BR");
          const timeStr = date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div
              key={r.id}
              className={`${styles.card} ${isSelected ? styles.selected : ""}`}
            >
              <div className={styles.cardInfo}>
                <span className={styles.cardTitle}>
                  {getNpcDisplayName(r.npcType)} — nv.{r.npcLevel}
                </span>
                <span className={styles.cardMeta}>
                  {r.playerCharacter} • {formatDuration(r.duration)} •{" "}
                  {r.frames.length} frames
                </span>
                <span className={styles.cardDate}>
                  {dateStr} {timeStr}
                </span>
              </div>
              {isSelected && (
                <div className={styles.cardActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => setSelectedReplay(r)}
                  >
                    Assistir
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.actionDanger}`}
                    onClick={() => setConfirmDelete(r.id)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
