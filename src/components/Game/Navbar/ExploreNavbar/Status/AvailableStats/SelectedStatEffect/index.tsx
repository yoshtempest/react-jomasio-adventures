import { STAT_EFFECTS, formatStatValue } from "@/data/player/statEffects";
import {
  getStatIncreases,
  useDerivedStats,
} from "@/hooks/player/useDerivedStats";

import styles from "./styles.module.css";

type SelectedStatEffectProps = {
  selectedIndex: number;
};

/**
 * Status derivados do stat selecionado, exibidos abaixo da linha dele.
 *
 * A coluna de Status foi removida do menu: este é o lugar único onde o
 * jogador vê o efeito real do stat que está sob o cursor, com o `+` do
 * próximo ponto já somado. A lista completa continua em "Todos os Status".
 */
export function SelectedStatEffect({ selectedIndex }: SelectedStatEffectProps) {
  const derived = useDerivedStats();
  const effect = STAT_EFFECTS[selectedIndex];
  const increases = getStatIncreases(selectedIndex, derived);

  if (!effect) return null;

  return (
    <div className={styles.effect}>
      {effect.rows.map((row) => {
        const increase = increases[row.key];

        return (
          <div key={row.key} className={styles.effectRow}>
            <img src={row.icon} alt="" />
            <p>
              {row.label}: {formatStatValue(derived[row.key], row.format)}
              {increase ? (
                <span className={styles.increase}> +{increase}</span>
              ) : (
                ""
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
