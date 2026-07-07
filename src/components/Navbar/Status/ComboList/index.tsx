import { asset } from "@/utils/asset";
import { getComboMoves } from "@/data/battle/comboMoves";
import styles from "./styles.module.css";

export function ComboList({ characterId }: { characterId: CharacterId }) {
  const combos = getComboMoves(characterId);

  return (
    <div className={styles.section}>
      <p className="StatusTitle">Combos</p>

      {combos.map((combo) => (
        <div key={combo.id} className={styles.comboCard}>
          <div className={styles.comboHeader}>
            <span className={styles.comboName}>{combo.name}</span>
            <div className={styles.sequence}>
              {combo.sequence.map((btn, i) => (
                <span key={i} className={styles.button}>{btn}</span>
              ))}
            </div>
          </div>

          <div className={styles.sprites}>
            {combo.states.map((state) => (
              <img
                key={state}
                src={asset(`assets/player/${characterId}/inFight/${state}.svg`)}
                alt={state}
                className={styles.sprite}
              />
            ))}
          </div>

          <p className={styles.description}>{combo.description}</p>
          <p className={styles.situation}>{combo.situation}</p>
        </div>
      ))}
    </div>
  );
}
