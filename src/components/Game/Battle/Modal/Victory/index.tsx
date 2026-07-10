import styles from "./styles.module.css";
import { playerPath } from "@/utils/paths";
import { getNpcDisplayName } from "@/utils/types/npc/npcNames";
import { useVictoryVisibility } from "@/hooks/battle/victory/useVisibility";
import { useVictoryKeyboard } from "@/hooks/battle/victory/useKeyboard";
import { RewardCards } from "@/components/Game/Battle/RewardCards";
import { EquipmentDrops } from "@/components/Game/Battle/Drops/Equipment";
import { ItemDrops } from "@/components/Game/Battle/Drops/Item";
import { ChestDrops } from "@/components/Game/Battle/Drops/Chest";
import { TitleProgresses } from "@/components/Game/Battle/TitleProgresses";
import { getRank, formatRank } from "@/gameRules/rank";
import { formatDuration } from "@/utils/formatDuration";
import { ActivePotionDisplay } from "@/components/ActivePotionDisplay";

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
  skipDelay?: boolean;
  elapsed: number;
  bestTime: number;
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
  skipDelay = false,
  elapsed,
  bestTime,
}: Props) {
  const isVisible = useVictoryVisibility(isOpen, skipDelay);
  useVictoryKeyboard(isVisible, onContinue);

  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className={`modal ${styles.modal}`}>
        <div className={styles.header}>
          <img
            src={playerPath(`/${character}/default.svg`)}
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
            <div className={styles.timeSection}>
              <p className={styles.timeRow}>
                <span className={styles.timeLabel}>Tempo:</span>
                <span>{formatDuration(elapsed)}</span>
              </p>
              <p className={styles.timeRow}>
                <span className={styles.timeLabel}>Melhor tempo:</span>
                <span>{bestTime > 0 ? formatDuration(bestTime) : "0:00"}</span>
              </p>
            </div>
            <ActivePotionDisplay />
            <EquipmentDrops equipmentDrops={rewards?.equipmentDrops ?? []} />
            <ItemDrops itemDrops={rewards?.itemDrops ?? []} />
            <ChestDrops
              chestDrop={rewards?.chestDrop ?? null}
              keyDrop={rewards?.keyDrop ?? null}
            />
            <TitleProgresses />
            <button className={styles.button} onClick={onContinue}>
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
