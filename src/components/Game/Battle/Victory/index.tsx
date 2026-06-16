import styles from "./styles.module.css";
import { asset } from "@/utils/asset";
import { useVictoryVisibility } from "@/hooks/battle/useVictoryVisibility";
import { useVictoryKeyboard } from "@/hooks/battle/useVictoryKeyboard";
import { RewardCards } from "@/components/Game/Battle/RewardCards";
import { EquipmentDrops } from "@/components/Game/Battle/EquipmentDrops";
import { ItemDrops } from "@/components/Game/Battle/ItemDrops";
import { TitleProgresses } from "@/components/Game/Battle/TitleProgresses";
import type { RewardInfo } from "@/hooks/battle/useBattleRewards";

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
              Você derrotou um {enemyType} - nv.{enemyLevel}
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
