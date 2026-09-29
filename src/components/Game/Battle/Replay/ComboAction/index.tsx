import { resolveBattleSprite } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  action: PlayerState;
  charId: string;
};

export function ComboAction({ action, charId }: Props) {
  return (
    <div className={styles.comboActionBox}>
      <div className={styles.comboActionBtn}>
        <img
          src={resolveBattleSprite(charId, action)}
          alt="Combo"
          draggable={false}
        />
        <h3>L</h3>
      </div>
    </div>
  );
}
