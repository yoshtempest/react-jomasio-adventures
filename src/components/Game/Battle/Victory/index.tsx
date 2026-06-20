import styles from "./styles.module.css";
import { asset } from "@/utils/asset";
import { getNpcDisplayName } from "@/utils/types/npc/npcNames";
import { useVictoryVisibility } from "@/hooks/battle/victory/useVisibility";
import { useVictoryKeyboard } from "@/hooks/battle/victory/useKeyboard";
import { RewardCards } from "@/components/Game/Battle/RewardCards";
import { EquipmentDrops } from "@/components/Game/Battle/EquipmentDrops";
import { ItemDrops } from "@/components/Game/Battle/ItemDrops";
import { ChestDrops } from "@/components/Game/Battle/ChestDrop";
import { TitleProgresses } from "@/components/Game/Battle/TitleProgresses";
import type { RewardInfo } from "@/hooks/battle/rewards/useRewards";
import { getRank, formatRank } from "@/gameRules/rank";

type Props = {
  isOpen: boolean;
  character: string;
  enemyType: string;
  enemyLevel: number;
  myLevel: number;
  nextLevelXp: number;
  onContinue: () => void;
  xpReward: number;
  rewards: RewardInfo | null;
};

export function VictoryModal({
  isOpen,
  character,
  enemyType,
  enemyLevel,
  myLevel,
  nextLevelXp,
  onContinue,
  xpReward,
  rewards,
}: Props) {
  const isVisible = useVictoryVisibility(isOpen);
  useVictoryKeyboard(isVisible, onContinue);

  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className={`modal ${styles.modal}`}>
        <div className={styles.header}>
          <img
            src={asset(`/assets/player/${character}/default.svg`)}
            alt={character}
            className={styles.characterImage}
          />
          <div>
            <h1>Vitória!</h1>
            <p>
              Você derrotou um {getNpcDisplayName(enemyType)} - nv.{enemyLevel}
            </p>
            <p className={styles.rankText}>
              NPC: {formatRank(getRank(enemyLevel))}
            </p>
          </div>
        </div>

        <div className={styles.flexRow}>
          <RewardCards
            myLevel={myLevel}
            xpReward={xpReward}
            nextLevelXp={nextLevelXp}
            coinReward={rewards?.coinReward ?? 0}
          />

          <div className={styles.flexColumn}>
            <EquipmentDrops equipmentDrops={rewards?.equipmentDrops ?? []} />
            <ItemDrops itemDrops={rewards?.itemDrops ?? []} />
            <ChestDrops
              chestDrop={rewards?.chestDrop ?? null}
              keyDrop={rewards?.keyDrop ?? null}
            />
            <TitleProgresses />
          </div>
        </div>

        <button className={styles.button} onClick={onContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}
