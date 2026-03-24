import styles from './styles.module.css';


type Props = {
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function GameButtons({ onConfirm, onCancel }: Props) {
  return (
    <div className={styles.gameButtons}>
      <button className={styles.button} onClick={onCancel}>
        B
      </button>

      <button className={styles.button} onClick={onConfirm}>
        A
      </button>
    </div>
  );
}