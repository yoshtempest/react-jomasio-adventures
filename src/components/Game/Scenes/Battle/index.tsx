import { BattleHUD } from "@/components/Game/Battle/HUD";
import { GameMap } from "@/components/Game/GameMap";
import { useGameLayout } from "@/hooks/useGameLayout";
import { useBattleScene } from "@/hooks/battle/useBattleScene";
import { BattleEntities } from "@/components/Game/Battle/Entities";
import { BattleMap } from "@/components/Game/Battle/Map";
import { DamageNumbers } from "@/components/Game/Battle/DamageNumbers";
import { ComboDisplay } from "@/components/Game/Battle/ComboDisplay";
import { VictoryModal } from "@/components/Game/Battle/Victory";
import { DefeatModal } from "@/components/Game/Battle/Defeat";
import { BattleIntro } from "@/components/Game/Battle/Intro";
import { useGameAudio } from "@/hooks/useGameAudio";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect, useRef } from "react";
import type { BattleMapConfig } from "@/utils/types/battleMap";

type Props = {
  npcType: string;
  redirectTo?: string;
  victoryDescription: string;
  className?: string;
  audioSrc: string;
  onVictory?: () => void;
  map?: BattleMapConfig;
};

export function BattleScene(props: Props) {
  const { npcType, className, map } = props;

  const {
    player,
    npc,
    battle,
    npcStats,
    npcLevel,
    summons,
    pet,
    charProgress,
    missingXp,
    xpReward,
    lastRewards,
    showVictory,
    showDefeat,
    handleRetry,
    handleContinue,
    navigate,
    showIntro,
    skipIntro,
    comboCount,
    comboRank,
    comboProgress,
    nextRank,
  } = useBattleScene(props);

  const {
    TILE_SIZE,
    offsetX,
    offsetY,
    PLAYER_SIZE,
    MAP_COLS,
    MAP_ROWS,
    scaleX,
    scaleY,
  } = useGameLayout();

  const { setBattleCollision } = usePlayer();

  useEffect(() => {
    setBattleCollision({
      map: map ?? null,
      TILE_SIZE,
      scaleX,
      scaleY,
    });
  }, [map, TILE_SIZE, scaleX, scaleY, setBattleCollision]);

  useEffect(() => {
    return () => {
      setBattleCollision({ map: null, TILE_SIZE: 0, scaleX: 1, scaleY: 1 });
    };
  }, [setBattleCollision]);

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
    } else if (!shouldPlay && battleAudioRef.current.isPlaying()) {
      battleAudioRef.current.pause();
    }
  }, [showIntro, showVictory, showDefeat]);

  return (
    <div className={`Master ${className ?? ""}`}>
      <BattleHUD
        battle={battle}
        npcStats={npcStats}
        npcType={npcType}
        summons={summons}
      />
      <ComboDisplay
        count={comboCount}
        rank={comboRank}
        progress={comboProgress}
        nextRank={nextRank}
      />
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
        {map && <BattleMap map={map} scaleX={scaleX} scaleY={scaleY} />}

        <BattleEntities
          npc={npc}
          player={player}
          battle={battle}
          npcType={npcType}
          summons={summons}
          pet={pet}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
        />

        <DamageNumbers numbers={battle.damageNumbers} />
      </GameMap>

      {showVictory && (
        <VictoryModal
          isOpen={showVictory}
          character={player.character}
          enemyType={npcType}
          enemyLevel={npcLevel}
          myLevel={charProgress.level}
          xpReward={xpReward}
          nextLevelXp={missingXp}
          rewards={lastRewards}
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
