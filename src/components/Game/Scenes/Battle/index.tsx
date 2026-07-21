import { BattleHUD } from "@/components/Game/Battle/HUD";
import { GameMap } from "@/components/Game/Map/Game";
import { useGameLayout } from "@/hooks/game/useGameLayout";
import { useBattleScene } from "@/hooks/battle/useScene";
import { BattleEntities } from "@/components/Game/Battle/Entities";
import { BattleMap } from "@/components/Game/Map/Battle";
import { DamageNumbers } from "@/components/Game/Battle/DamageNumbers";
import { ComboDisplay } from "@/components/Game/Battle/ComboDisplay";
import { Bleeding } from "@/components/Game/Battle/Bleeding";
import { VictoryModal } from "@/components/Game/Battle/Modal/Victory";
import { DefeatModal } from "@/components/Game/Battle/Modal/Defeat";
import { BattleIntro } from "@/components/Game/Battle/Modal/Intro";
import { BattleOutro } from "@/components/Game/Battle/Modal/Outro";
import { ChargeParticles } from "@/components/Game/Battle/ChargeParticles";
import { JumpIndicator } from "@/components/Game/Battle/JumpIndicator";
import { ComboAction } from "@/components/Controls/ComboAction";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BattleMapConfig } from "@/utils/types/maps/battle";
import styles from "./styles.module.css";

type Props = {
  npcType: string;
  redirectTo?: string;
  victoryDescription: string;
  className?: string;
  background?: string;
  audioSrc: string;
  onVictory?: () => void;
  map?: BattleMapConfig;
  training?: boolean;
};

export function BattleScene(props: Props) {
  const { npcType, className, background, map } = props;

  const {
    player,
    npc,
    battle,
    npcStats,
    npcLevel,
    summons,
    coffins,
    pet,
    charProgress,
    missingXp,
    xpReward,
    lastRewards,
    showVictory,
    showDefeat,
    showOutro,
    handleCloseOutro,
    handleRetry,
    handleContinue,
    navigate,
    showIntro,
    skipIntro,
    skipVictoryDelay,
    comboCount,
    comboRank,
    comboProgress,
    nextRank,
    charge,
    defeatElapsed,
    victoryElapsed,
    bestTime,
    defeatProgress,
    grabFlipped,
    getReplayData,
    training: isTraining,
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
    <div
      className={`Master ${className ?? ""}`}
      style={background ? { backgroundImage: `url(${background})` } : undefined}
    >
      <BattleHUD
        battle={{
          ...battle,
          petHP: pet?.hp,
          petMaxHp: pet?.maxHp,
        }}
        npcStats={npcStats}
        npcType={npcType}
        npcLevel={npcLevel}
        summons={summons}
      />
      <ComboDisplay
        count={comboCount}
        rank={comboRank}
        progress={comboProgress}
        nextRank={nextRank}
      />
      <Bleeding />
      {showIntro && !isTraining && (
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
          coffins={coffins}
          pet={pet}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
          scaleX={scaleX}
          scaleY={scaleY}
          grabFlipped={grabFlipped}
        />

        <ChargeParticles
          particles={charge.particles}
          playerX={player.x}
          playerY={player.y}
          chargeReady={charge.chargeReady}
          isCharging={charge.isCharging}
        />

        {npc.jumpLandingX != null && (
          <JumpIndicator
            landingX={npc.jumpLandingX}
            groundY={720}
            scaleX={scaleX}
            scaleY={scaleY}
          />
        )}

        <DamageNumbers
          numbers={battle.damageNumbers}
          scaleX={scaleX}
          scaleY={scaleY}
        />
      </GameMap>

      {showOutro && !isTraining && (
        <BattleOutro
          character={player.character}
          type={showOutro}
          onNext={handleCloseOutro}
        />
      )}

      {!showOutro && showVictory && !isTraining && (
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
          skipDelay={skipVictoryDelay}
          elapsed={victoryElapsed}
          bestTime={bestTime}
          getReplayData={getReplayData}
        />
      )}

      {!showOutro && showDefeat && !isTraining && (
        <DefeatModal
          isOpen={showDefeat}
          onContinue={handleRetry}
          onBack={() => navigate(-1)}
          progress={defeatProgress}
          elapsed={defeatElapsed}
          bestTime={bestTime}
        />
      )}

      <ComboAction />

      {isTraining && (
        <TrainingOverlay onLeave={() => navigate(-1)} />
      )}
    </div>
  );
}

const TRAINING_MAX_SECONDS = 10 * 60;

function TrainingOverlay({ onLeave }: { onLeave: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= TRAINING_MAX_SECONDS) {
          clearInterval(id);
          onLeaveRef.current();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = TRAINING_MAX_SECONDS - elapsed;
  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const timeStr = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

  const handleLeave = useCallback(() => {
    onLeaveRef.current();
  }, []);

  return (
    <button
      className={styles.leaveButton}
      onClick={handleLeave}
      type="button"
    >
      Sair {timeStr}
    </button>
  );
}
