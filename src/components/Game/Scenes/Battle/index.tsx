import { BattleHUD } from "@/components/Game/BattleHUD";
import { GameMap } from "@/components/Game/GameMap";
import { useGameLayout } from "@/hooks/useGameLayout";
import { useBattleScene } from "@/hooks/battle/useBattleScene";
import { BattleEntities } from "@/components/Game/BattleEntities";
import { VictoryModal } from "@/components/Game/Modal/Victory";
import { DefeatModal } from "@/components/Game/Modal/Defeat";
import { BattleIntro } from "@/components/Game/BattleIntro";

type Props = {
  map: any;
  npcType: string;
  redirectTo?: string;
  victoryDescription: string;
  className?: string;
  audioSrc: string;
  onVictory?: () => void;
};

export function BattleScene(props: Props) {
  const { npcType, className } = props;

  const {
    player,
    npc,
    battle,
    npcStats,
    npcLevel,
    charProgress,
    missingXp,
    xpReward,
    showVictory,
    showDefeat,
    handleRetry,
    handleContinue,
    navigate,
    showIntro,
    skipIntro,
  } = useBattleScene(props);

  const {
    TILE_SIZE,
    offsetX,
    offsetY,
    PLAYER_SIZE,
    MAP_COLS,
    MAP_ROWS,
  } = useGameLayout();

  return (
    <div className={`Master ${className ?? ""}`}>
      <BattleHUD battle={battle} npcStats={npcStats} />
      {showIntro && (
        <BattleIntro
          playerCharacter={player.character}
          npcType={npcType}
          onSkip={skipIntro}
        />
      )}

      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <BattleEntities
          npc={npc}
          player={player}
          battle={battle}
          npcType={npcType}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
        />
      </GameMap>

      {showVictory && (
        <VictoryModal
          isOpen={showVictory}
          enemyType={npcType}
          enemyLevel={npcLevel}
          myLevel={charProgress.level}
          xpReward={xpReward}
          nextLevelXp={missingXp}
          onContinue={handleContinue}
        />
      )}

      {showDefeat && (
        <DefeatModal
          isOpen={showDefeat}
          onContinue={handleRetry}
          onBack={() => navigate(-1)}
        />
      )}
    </div>
  );
}