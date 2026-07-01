import { useStatusMenu } from "@/hooks/menu/useStatus";
import { CharacterInfo } from "./CharacterInfo";
import { CharacterStats } from "./CharacterStats";
import { AvailableStats } from "./AvailableStats";
import { EquipmentList } from "./EquipmentList";
import { RankList } from "./RankList";
import { SkillTreeView } from "./SkillTreeView";
import styles from "./styles.module.css";

export function Status() {
  const { selectedIndex, view } = useStatusMenu(true);

  if (view === "skillTree") {
    return <SkillTreeView />;
  }

  if (view === "ranks") {
    return <RankList />;
  }

  return (
    <div className="containerOfNavbar">
      <h2>Status</h2>

      <div className={styles.flexRow}>
        <CharacterInfo />
        <CharacterStats />
        <AvailableStats selectedIndex={selectedIndex} />
        <EquipmentList />
      </div>
    </div>
  );
}