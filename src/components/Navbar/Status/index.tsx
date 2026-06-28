import { useStatusMenu } from "@/hooks/menu/useStatus";
import { CharacterInfo } from "./components/CharacterInfo";
import { CharacterStats } from "./components/CharacterStats";
import { AvailableStats } from "./components/AvailableStats";
import { EquipmentList } from "./components/EquipmentList";
import { RankList } from "./components/RankList";
import { SkillTreeView } from "./components/SkillTreeView";
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