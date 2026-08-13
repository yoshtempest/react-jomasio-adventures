import { BattleHUD } from "@/components/Game/Battle/HUD";
import { PetSkillButton } from "@/components/Game/Battle/PetSkillButton";
import { GameMap } from "@/components/Game/Map/Game";
import { useGameLayout } from "@/hooks/game/useGameLayout";
import { useBattleScene } from "@/hooks/battle/useScene";
import { BattleEntities } from "@/components/Game/Battle/Entities";
import { BattleMap } from "@/components/Game/Map/Battle";
import { DamageNumbers } from "@/components/Game/Battle/DamageNumbers";
import { ComboDisplay } from "@/components/Game/Battle/ComboDisplay";
import { StatusEffects } from "@/components/Game/Battle/StatusEffects";
import { VictoryModal } from "@/components/Game/Battle/Modal/Victory";
import { DefeatModal } from "@/components/Game/Battle/Modal/Defeat";
import { BattleIntro } from "@/components/Game/Battle/Modal/Intro";
import { BattleOutro } from "@/components/Game/Battle/Modal/Outro";
import { BattleHighlight } from "@/components/Game/Battle/Modal/Highlight";
import { ChargeParticles } from "@/components/Game/Battle/ChargeParticles";
import { JumpIndicator } from "@/components/Game/Battle/JumpIndicator";
import { ComboAction } from "@/components/Controls/ComboAction";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { BattleMapConfig } from "@/utils/types/maps/battle";
import { TrainingOverlay } from "@/components/Game/Battle/TrainingOverlay";
import { ProjectileConstants } from "@/data/projectile";
import { BATTLE_SPAWN } from "@/gameRules/battle/spawnPoints";
import { getBossSizeMultiplier } from "@/utils/npc/getSpritePath";
import { npcPath } from "@/utils/paths";

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
  isAlfa?: boolean;
  children?: ReactNode;
};

export function BattleScene(props: Props) {
  const { npcType, className, background, map, isAlfa = false } = props;
  const { stopAll } = useSoundEffects();

  const {
    player,
    npc,
    battle,
    npcStats,
    npcLevel,
    summons,
    coffins,
    pet,
    petSkill,
    charProgress,
    missingXp,
    xpReward,
    lastRewards,
    showVictory,
    showDefeat,
    showOutro,
    showHighlight,
    highlightData,
    handleCloseHighlight,
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
    controlsDisabled,
    showRetry,
  } = useBattleScene({ ...props, isAlfa });

  const {
    TILE_SIZE,
    PLAYER_SIZE,
    MAP_COLS,
    MAP_ROWS,
    scaleX,
    scaleY,
  } = useGameLayout();

  const { setBattleCollision } = usePlayer();

  const containerWidth = window.innerWidth * 0.74;
  const containerHeight = window.innerHeight;

  const initialBgPosRef = useRef({
    x: (BATTLE_SPAWN.player.x / ProjectileConstants.MAP_WIDTH) * 100,
    y: (BATTLE_SPAWN.player.y / ProjectileConstants.MAP_HEIGHT) * 100,
  });

  const maxOffsetX = window.innerWidth - containerWidth;
  const bgXMin = initialBgPosRef.current.x;
  const bgXMax = initialBgPosRef.current.x + (maxOffsetX * 200) / containerWidth;

  const targetBgX = Math.max(
    bgXMin,
    Math.min((player.x / ProjectileConstants.MAP_WIDTH) * 100, bgXMax),
  );
  const targetBgY = Math.max(
    0,
    Math.min((player.y / ProjectileConstants.MAP_HEIGHT) * 100, 100),
  );

  const [bgPosX, setBgPosX] = useState(targetBgX);
  const [bgPosY, setBgPosY] = useState(targetBgY);

  const bgTargetRef = useRef({ x: targetBgX, y: targetBgY });
  bgTargetRef.current.x = targetBgX;
  bgTargetRef.current.y = targetBgY;

  const worldOffsetX = (containerWidth * 0.5 * (bgPosX - initialBgPosRef.current.x)) / 100;
  const worldOffsetY = (containerHeight * 0.5 * (bgPosY - initialBgPosRef.current.y)) / 100;

  const battleScaleX = window.innerWidth / ProjectileConstants.MAP_WIDTH;
  const battleScaleY = window.innerHeight / ProjectileConstants.MAP_HEIGHT;

  const damageTargets = [
    { x: player.x, y: player.y, h: PLAYER_SIZE / 1.5 },
    {
      x: npc.x,
      y: npc.y,
      h: TILE_SIZE * getBossSizeMultiplier(npcType, battle.npcPhase, isAlfa),
    },
    ...(pet
      ? [{ x: pet.x, y: pet.y, h: TILE_SIZE * getBossSizeMultiplier(pet.npcType) }]
      : []),
    ...summons.map((s) => ({
      x: s.x,
      y: s.y,
      h: TILE_SIZE * getBossSizeMultiplier(s.npcType),
    })),
  ];

  useEffect(() => {
    const dx = Math.abs(bgPosX - bgTargetRef.current.x);
    const dy = Math.abs(bgPosY - bgTargetRef.current.y);
    if (dx < 0.5 && dy < 0.5) {
      if (bgPosX !== bgTargetRef.current.x || bgPosY !== bgTargetRef.current.y) {
        setBgPosX(bgTargetRef.current.x);
        setBgPosY(bgTargetRef.current.y);
      }
      return;
    }

    const id = requestAnimationFrame(() => {
      setBgPosX((prev) => {
        const t = bgTargetRef.current.x;
        const next = prev + (t - prev) * 0.1;
        return Math.abs(next - t) < 0.5 ? t : next;
      });
      setBgPosY((prev) => {
        const t = bgTargetRef.current.y;
        const next = prev + (t - prev) * 0.1;
        return Math.abs(next - t) < 0.5 ? t : next;
      });
    });

    return () => cancelAnimationFrame(id);
  }, [bgPosX, bgPosY, targetBgX, targetBgY]);

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
    const shouldPlay =
      !showIntro && !showVictory && !showDefeat && !showHighlight;

    if (shouldPlay && !battleAudioRef.current.isPlaying()) {
      battleAudioRef.current.play();
    } else if (!shouldPlay && battleAudioRef.current.isPlaying()) {
      battleAudioRef.current.pause();
    }

    if (showVictory || showDefeat) {
      stopAll();
    }
  }, [showIntro, showVictory, showDefeat, showHighlight, stopAll]);

  return (
    <div
      className={`Master ${className ?? ""}`}
      style={
        background
          ? {
              backgroundImage: `url(${background})`,
              backgroundSize: "150% 150%",
              backgroundPosition: `${bgPosX}% ${bgPosY}%`,
            }
          : undefined
      }
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
        isAlfa={isAlfa}
      />
      <ComboDisplay
        count={comboCount}
        rank={comboRank}
        progress={comboProgress}
        nextRank={nextRank}
      />
      <StatusEffects />
      {showIntro && !isTraining && (
        <BattleIntro
          playerCharacter={player.character}
          npcType={npcType}
          onSkip={skipIntro}
          onFlee={() => navigate(-1)}
          isAlfa={isAlfa}
        />
      )}

      <div className="SceneMap">
        <GameMap
          TILE_SIZE={TILE_SIZE}
          cols={MAP_COLS}
          rows={MAP_ROWS}
          cameraX={worldOffsetX}
          cameraY={worldOffsetY}
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
            isAlfa={isAlfa}
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
            scaleX={battleScaleX}
            scaleY={battleScaleY}
            targets={damageTargets}
          />
        </GameMap>
      </div>
      {showOutro && !isTraining && (
        <BattleOutro
          character={player.character}
          type={showOutro}
          onNext={handleCloseOutro}
        />
      )}

      {!showOutro && showHighlight && highlightData && !isTraining && (
        <BattleHighlight replay={highlightData} onClose={handleCloseHighlight} />
      )}

      {!showOutro && !showHighlight && showVictory && !isTraining && (
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
          isAlfa={isAlfa}
        />
      )}

      {!showOutro && !showHighlight && showDefeat && !isTraining && (
        <DefeatModal
          isOpen={showDefeat}
          onContinue={handleRetry}
          onBack={() => navigate(-1)}
          progress={defeatProgress}
          elapsed={defeatElapsed}
          bestTime={bestTime}
          showRetry={showRetry}
        />
      )}

      <ComboAction />

      {petSkill && pet && (
        <PetSkillButton
          imageUrl={npcPath(`/${petSkill.definition.npcType}/face.svg)}`)}
          petName={petSkill.definition.name}
          role={petSkill.definition.role}
          skillName={petSkill.definition.skill.name}
          ready={petSkill.ready}
          remaining={petSkill.remaining}
          cooldownMs={petSkill.definition.skill.cooldownMs}
          disabled={controlsDisabled}
          onClick={petSkill.trigger}
        />
      )}

      {isTraining && <TrainingOverlay onLeave={() => navigate(-1)} />}

      {props.children}
    </div>
  );
}
