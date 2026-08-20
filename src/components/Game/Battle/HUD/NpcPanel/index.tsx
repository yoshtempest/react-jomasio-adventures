import { HealthBar } from "@/components/Game/Battle/HUD/HealthBar";
import { ElementBadges } from "@/components/Game/Battle/HUD/ElementBadges";
import { npcPath } from "@/utils/paths";
import { getNpcDisplayName } from "@/data/npc/displayNames";
import type { ElementType } from "@/utils/types/battle/element";
import styles from "../styles.module.css";
import { formatRank, getRank } from "@/gameRules/rank";

type Props = {
  npcType: string;
  npcLevel?: number;
  npcHP: number;
  npcMaxHp: number;
  isAlfa?: boolean;
  npcElementTypes?: readonly ElementType[];
};

export function NPCHUDPanel({
  npcType,
  npcLevel,
  npcHP,
  npcMaxHp,
  isAlfa = false,
  npcElementTypes,
}: Props) {
  return (
    <div className={styles.container} style={{ right: 10, top: 10 }}>
      <div className={styles.npcInfo}>
        <div className={`${styles.nameRow} ${styles.nameRowEnd}`}>
          {npcElementTypes && <ElementBadges types={npcElementTypes} />}
          <h2 className={`${"hudName"} ${styles.name}`}>
            {isAlfa ? "ALFA " : ""}
            {getNpcDisplayName(npcType)}
          </h2>
        </div>
        {npcLevel !== undefined && (
          <p className={`${"hudRank"} ${styles.npcRank}`}>
            {formatRank(getRank(npcLevel))}
          </p>
        )}

        <HealthBar hp={npcHP} maxHp={npcMaxHp} reversed />
      </div>
      <img
        src={npcPath(`/${npcType}/face.svg`)}
        alt="Npc HUD"
        className="hudImage"
      />
    </div>
  );
}
