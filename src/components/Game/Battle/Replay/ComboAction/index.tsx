import { resolveBattleSprite } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  action: string;
  charId: string;
};

export function ComboAction({ action, charId }: Props) {
  const stateName = action.replace(".svg", "");
  return (
    <div className={styles.comboActionBox}>
      <div className={styles.comboActionBtn}>
        <img
          src={resolveBattleSprite(charId, stateName)}
          alt="Combo"
          draggable={false}
        />
        <h3>L</h3>
      </div>
    </div>
  );
}
