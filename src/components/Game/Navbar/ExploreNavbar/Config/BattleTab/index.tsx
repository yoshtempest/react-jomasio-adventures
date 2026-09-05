import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router";
import { useBattleInfo } from "@/contexts/BattleInfoContext";
import { CardRedeem } from "./CardRedeem";
import { ElementChart } from "./ElementChart";

type Props = {
  showComboAction: boolean;
  showHighlight: boolean;
  selectedIndex: number;
};

export function BattleTab({
  showComboAction,
  showHighlight,
  selectedIndex,
}: Props) {
  const battleInfoCtx = useBattleInfo();
  const { player } = usePlayer();
  const navigate = useNavigate();

  const isInBattle = player.mode === "battle";
  const battleInfo = battleInfoCtx?.battleInfo;

  return (
    <div className={styles.battleContainer}>
      {!battleInfo && !isInBattle && (
        <>
          <p className={styles.empty}>
            Abra as configurações durante uma batalha para ver as informações.
          </p>
          <div
            className={`${styles.toggleItem} ${selectedIndex === 0 ? styles.selected : ""}`}
          >
            {selectedIndex === 0 && <span className={styles.cursor}>▼</span>}
            <h2>Exibir botão de combo: {showComboAction ? "ON" : "OFF"}</h2>
          </div>
          <div
            className={`${styles.toggleItem} ${selectedIndex === 1 ? styles.selected : ""}`}
          >
            {selectedIndex === 1 && <span className={styles.cursor}>▼</span>}
            <h2>Exibir destaque da batalha: {showHighlight ? "ON" : "OFF"}</h2>
          </div>
          <div
            className={`${styles.toggleItem} ${selectedIndex === 2 ? styles.selected : ""}`}
          >
            {selectedIndex === 2 && <span className={styles.cursor}>▼</span>}
            <button
              className={styles.trainingButton}
              onClick={() => navigate("/training")}
              type="button"
            >
              Modo Treino
            </button>
          </div>
          <CardRedeem isSelected={selectedIndex === 3} />
        </>
      )}

      <ElementChart />
    </div>
  );
}
