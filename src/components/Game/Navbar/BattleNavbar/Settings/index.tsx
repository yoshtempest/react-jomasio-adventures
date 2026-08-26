import styles from "./styles.module.css";
import { BattleTab } from "@/components/Game/Navbar/ExploreNavbar/Config/BattleTab";
import { useSettings } from "@/hooks/useSetting";

export function Settings() {
  const { showComboAction, showHighlight } = useSettings();

  return (
    <div className={`containerOfNavbar ${styles.container}`}>
      <h2 className={styles.title}>Configurações de Batalha</h2>
      <BattleTab
        showComboAction={showComboAction}
        showHighlight={showHighlight}
        selectedIndex={0}
      />
    </div>
  );
}
