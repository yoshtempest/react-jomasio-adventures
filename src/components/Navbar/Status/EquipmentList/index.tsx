import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { EQUIPMENT_SLOTS, RANK_COLORS } from "@/utils/types/player/equipment";
import styles from "./styles.module.css";
import { asset } from "@/utils/paths";
import { FILTER_LABELS } from "@/utils/equipment/equipmentMenu";

export function EquipmentList() {
  const { player } = usePlayer();
  const character = player.character;
  const { getEquippedItem } = useEquipment();

  return (
    <div className="StatusColumn">
      <div className="statusMainContainer">
        <img src={asset("/assets/equipments/all.svg")} />
        <h2 className="StatusTitle">Equipamentos</h2>
      </div>
      {EQUIPMENT_SLOTS.map((slot) => {
        const item = getEquippedItem(character, slot);
        return (
          <p key={slot} className={styles.fontSize}>
            <img className="slotTag" src={asset(FILTER_LABELS[slot])} />
            {item ? (
              <span style={{ color: RANK_COLORS[item.rank] }}>{item.name}</span>
            ) : (
              <span className={styles.italic}>Vazio</span>
            )}
          </p>
        );
      })}
    </div>
  );
}
