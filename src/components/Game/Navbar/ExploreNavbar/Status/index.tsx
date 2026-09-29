import { useStatusMenu } from "@/hooks/menu/useStatus";
import { CharacterInfo } from "./CharacterInfo";
import { AvailableStats } from "./AvailableStats";
import { EquipmentList } from "./EquipmentList";
import styles from "./styles.module.css";
import { BarsInfos } from "./BarsInfos";

export function Status() {
  const { selectedIndex } = useStatusMenu(true);

  return (
    <div className="containerOfNavbar">
      <h2>Status</h2>

      <div className={styles.flexRow}>
        <CharacterInfo />
        <BarsInfos />
        <AvailableStats selectedIndex={selectedIndex} />
        <EquipmentList />
      </div>
    </div>
  );
}
