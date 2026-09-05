import { useMemo } from "react";
import { getElementChart } from "@/gameRules/battle/elementRelations";
import type { ElementType } from "@/utils/types/battle/element";
import styles from "./styles.module.css";

function ElementCell({ elements }: { elements: ElementType[] }) {
  if (elements.length === 0) return <span className={styles.none}>—</span>;

  return (
    <span className={styles.list}>
      {elements.map((element) => (
        <span key={element} className={styles.tag}>
          {element}
        </span>
      ))}
    </span>
  );
}

export function ElementChart() {
  const chart = useMemo(() => getElementChart(), []);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Tabela de tipagens</h2>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Tipagem</th>
              <th scope="col" className={styles.superHeader}>
                Super efetivo (1.5x)
              </th>
              <th scope="col">Dano normal (1x)</th>
              <th scope="col" className={styles.weakHeader}>
                Não efetivo (0.5x)
              </th>
            </tr>
          </thead>
          <tbody>
            {chart.map((row) => (
              <tr key={row.attacker}>
                <th scope="row" className={styles.attacker}>
                  {row.attacker}
                </th>
                <td className={styles.superCell}>
                  <ElementCell elements={row.superEffective} />
                </td>
                <td>
                  <ElementCell elements={row.normal} />
                </td>
                <td className={styles.weakCell}>
                  <ElementCell elements={row.notEffective} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
