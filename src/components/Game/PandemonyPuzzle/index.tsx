import {
  usePandemonyPuzzle,
  SYMBOLS,
  type PuzzleState,
} from "@/hooks/puzzle/usePandemonyPuzzle";
import styles from "./styles.module.css";

type Props = {
  isOpen: boolean;
  onSolved: () => void;
  onClose: () => void;
};

function renderSlots(state: PuzzleState, selectedSlot: number) {
  return state.map((index, slotIndex) => {
    const isSelected = slotIndex === selectedSlot;
    return (
      <div
        key={slotIndex}
        className={`${styles.slotRow} ${isSelected ? styles.slotRowSelected : ""}`}
      >
        <div className={styles.slotLabel}>Linha {slotIndex + 1}</div>
        <div
          className={`${styles.symbolBox} ${isSelected ? styles.symbolActive : ""}`}
        >
          {SYMBOLS[index]}
        </div>
      </div>
    );
  });
}

export function PandemonyPuzzle({ isOpen, onSolved, onClose }: Props) {
  const { state, selectedSlot, solved } = usePandemonyPuzzle(
    isOpen,
    onSolved,
    onClose,
  );

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.title}>Porta do Pandemônio</div>

        <div className={styles.slotsContainer}>
          {renderSlots(state, selectedSlot)}
        </div>

        <div className={solved ? styles.solved : styles.unsolved}>
          {solved
            ? "Porta destrancada! Pressione L para entrar."
            : "Use ◄/► para trocar o símbolo"}
        </div>
      </div>
    </div>
  );
}
