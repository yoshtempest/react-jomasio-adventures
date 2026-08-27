import { HealthBar } from "@/components/Game/Battle/HUD/HealthBar";
import { ElementBadges } from "@/components/Game/Battle/HUD/ElementBadges";
import { npcPath } from "@/utils/paths";
import { getNpcDisplayName } from "@/data/npc/displayNames";
import type { ElementType } from "@/utils/types/battle/element";
import styles from "../styles.module.css";
import { asset } from "@/utils/paths";
import { getRank, srcRank } from "@/gameRules/rank";

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
  const playerRank = `${srcRank(getRank(npcLevel ?? 1))}`;
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

        <HealthBar hp={npcHP} maxHp={npcMaxHp} reversed />
      </div>
      <div>
        {npcLevel !== undefined && (
          <img
            src={asset(`/assets/badges/ranks/${playerRank}`)}
            className={`${styles.rankBadge} ${styles.npcRankBadge}`}
          />
        )}
        <img
          src={npcPath(`/${npcType}/face.svg`)}
          alt="Npc HUD"
          className="hudImage"
        />
      </div>
    </div>
  );
}
