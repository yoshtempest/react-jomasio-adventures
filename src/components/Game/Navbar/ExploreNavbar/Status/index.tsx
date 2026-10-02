import { useStatusMenu } from "@/hooks/menu/useStatus";
import { CharacterInfo } from "./CharacterInfo";
import { AvailableStats } from "./AvailableStats";
import { EquipmentList } from "./EquipmentList";
import styles from "./styles.module.css";

export function Status() {
  const { selectedIndex } = useStatusMenu(true);

  return (
    <div className="containerOfNavbar">

      <div className={styles.flexRow}>
        <CharacterInfo />
        <div className={`${styles.flexRow} ${styles.statsAndEquipment}`}>
          <AvailableStats selectedIndex={selectedIndex} />
          <EquipmentList />
        </div>
      </div>
    </div>
  );
}
