import styles from "./styles.module.css";
import { ELEMENT_STRONG_AGAINST } from "@/data/types/elementChart";
import type { ElementType } from "@/utils/types/battle/element";
import { asset } from "@/utils/paths";

const ELEMENT_TYPES = Object.keys(ELEMENT_STRONG_AGAINST) as ElementType[];

const RECEIVES_SUPER_EFFECTIVE_FROM: Record<ElementType, ElementType[]> =
  ELEMENT_TYPES.reduce(
    (acc, attacker) => {
      for (const defender of ELEMENT_STRONG_AGAINST[attacker]) {
        (acc[defender] ??= []).push(attacker);
      }
      return acc;
    },
    {} as Record<ElementType, ElementType[]>,
  );

type Props = {
  playerElementTypes: readonly ElementType[];
  npcElementTypes: readonly ElementType[];
};

export function ElementTable({ playerElementTypes, npcElementTypes }: Props) {
  return (
    <div className={styles.table}>
      <h2 className={styles.title}>Tabela de Tipagens</h2>
      <p className={styles.hint}>
        Dano super efetivo = ×1.5. Múltiplas tipagens multiplicam o dano.
      </p>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.badge} ${styles.playerBadge}`}>VOCÊ</span>
          Suas tipagens
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.badge} ${styles.npcBadge}`}>NPC</span>
          Tipagens do inimigo
        </span>
      </div>

      <div className={styles.headerRow}>
        <span className={styles.typeCell}>Tipagem</span>
        <span className={styles.relationLabel}>
          Causa dano super efetivo contra
        </span>
        <span className={styles.relationLabel}>
          Sofre dano super efetivo de
        </span>
      </div>

      <div className={styles.rows}>
        {ELEMENT_TYPES.map((type) => {
          const isPlayer = playerElementTypes.includes(type);
          const isNpc = npcElementTypes.includes(type);
          const rowClass = [
            styles.row,
            isPlayer ? styles.playerRow : "",
            isNpc ? styles.npcRow : "",
          ].join(" ");
          const causes = ELEMENT_STRONG_AGAINST[type];
          const receives = RECEIVES_SUPER_EFFECTIVE_FROM[type];
          return (
            <div key={type} className={rowClass}>
              <div className={styles.typeCell}>
                <img
                  src={asset(
                    `/assets/badges/elements/${type.toLowerCase()}.svg`,
                  )}
                  className={styles.icon}
                />

                {isPlayer && (
                  <span className={`${styles.badge} ${styles.playerBadge}`}>
                    VOCÊ
                  </span>
                )}
                {isNpc && (
                  <span className={`${styles.badge} ${styles.npcBadge}`}>
                    NPC
                  </span>
                )}
              </div>
              <div className={styles.relationCell}>
                {causes.length === 0 ? (
                  <span className={styles.none}>—</span>
                ) : (
                  causes.map((t) => (
                    <img
                      src={asset(
                        `/assets/badges/elements/${t.toLowerCase()}.svg`,
                      )}
                      className={styles.icon}
                    />
                  ))
                )}
              </div>
              <div className={styles.relationCell}>
                {receives.length === 0 ? (
                  <span className={styles.none}>—</span>
                ) : (
                  receives.map((t) => (
                    <img
                      src={asset(
                        `/assets/badges/elements/${t.toLowerCase()}.svg`,
                      )}
                      className={styles.icon}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
