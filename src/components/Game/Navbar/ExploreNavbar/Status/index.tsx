import type { MouseEvent } from "react";
import { useStatusMenu } from "@/hooks/menu/useStatus";
import { useStableCallback } from "@/hooks/useStableCallback";
import { CharacterInfo } from "./CharacterInfo";
import { AvailableStats } from "./AvailableStats";
import { EquipmentList } from "./EquipmentList";
import styles from "./styles.module.css";

export function Status() {
  const { selectedIndex, selectStat, confirmStat, clearStat } =
    useStatusMenu(true);

  /**
   * Clique fora de um stat ou do Confirmar volta a tela ao estado de
   * abertura: nenhum stat marcado, nenhum ponto em risco.
   *
   * A exceção é conferida por atributo (`data-stat-row`, `data-confirm`) em
   * vez de classe, porque as classes do CSS module são hasheadas por build e
   * não servem de seletor estável. O `closest` sobe a árvore, então clicar no
   * `<img>`/`<span>` dentro do botão conta como clicar no botão.
   */
  const onAreaClick = useStableCallback((event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;

    if (target?.closest("[data-stat-row], [data-confirm]")) return;

    clearStat();
  });

  return (
    <div className="containerOfNavbar" onClick={onAreaClick}>
      <div className={styles.flexRow}>
        <CharacterInfo />
        <div className={`${styles.flexRow} ${styles.statsAndEquipment}`}>
          <AvailableStats
            selectedIndex={selectedIndex}
            onSelectStat={selectStat}
            onConfirmStat={confirmStat}
          />
          <EquipmentList />
        </div>
      </div>
    </div>
  );
}
