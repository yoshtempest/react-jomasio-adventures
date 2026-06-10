import { BattleHUD } from "@/components/Game/Battle/HUD";
import { GameMap } from "@/components/Game/GameMap";
import { useGameLayout } from "@/hooks/useGameLayout";
import { useBattleScene } from "@/hooks/battle/useBattleScene";
import { BattleEntities } from "@/components/Game/Battle/Entities";
import { VictoryModal } from "@/components/Game/Battle/Victory";
import { DefeatModal } from "@/components/Game/Battle/Defeat";
import { BattleIntro } from "@/components/Game/Battle/Intro";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useEffect, useRef } from "react";

type Props = {
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
    summons,
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

  const battleAudio = useGameAudio({
    src: props.audioSrc,
    loop: true,
    volume: 0.5,
  });
  const battleAudioRef = useRef(battleAudio);
  battleAudioRef.current = battleAudio;

  useEffect(() => {
    const shouldPlay = !showIntro && !showVictory && !showDefeat;

    if (shouldPlay && !battleAudioRef.current.isPlaying()) {
      battleAudioRef.current.play();
    }

    else if (!shouldPlay && battleAudioRef.current.isPlaying()) {
      battleAudioRef.current.pause();
    }
  }, [showIntro, showVictory, showDefeat]);

  return (
    <div className={`Master ${className ?? ""}`}>
      <BattleHUD battle={battle} npcStats={npcStats} npcType={npcType} summons={summons} />
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
          summons={summons}
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