import styles from "./styles.module.css";
import type { PlayerBattleProps } from "./types";
import { useBattleSprite } from "./hooks/useBattleSprite";
import { useHonoredRotation } from "./hooks/useHonoredRotation";
import { useArturSeeingSound } from "./hooks/useArturSeeingSound";
import { getPlayerDimensions } from "./utils/getPlayerDimensions";
import { getPlayerTransform } from "./utils/getPlayerTransform";
import { getBlinkConfig } from "./utils/getBlink";
import { ChargingKiEffect } from "./ChargingKiEffect";
import { BattleSprite } from "./BattleSprite";
import { AtomicHalo } from "./AtomicHalo";
import { LevelUpParticles } from "@/components/Game/LevelUpParticles";

export function PlayerBattle(props: PlayerBattleProps) {
  const {
    x,
    y,
    PLAYER_SIZE,
    state,
    direction,
    character,
    weapon,
    grabbedUntil = 0,
    grabFlipped = false,
    form,
    transformationFrame = null,
    blinkSilhouette = null,
    teleportSprite = false,
    preAtomic = false,
    atomicHalo = false,
    atomicFlash = false,
    mugetsuBlink = null,
    levelUpParticles = false,
  } = props;

  const isChargingKi =
    character === "emanuel" && state === "chargingKi";

  const isCrouching =
    state === "idleCrounched" ||
    state === "walkCrounched";

  const isFallen = state === "fallen";

  const isGrabbed =
    Date.now() < grabbedUntil &&
    !isFallen &&
    !isCrouching;

  const showFlipped = isGrabbed && grabFlipped;

  const {
    src,
    handleSpriteError,
  } = useBattleSprite({
    character,
    state,
    weapon,
    form,
    transformationFrame,
    teleportSprite,
    preAtomic,
  });

  const isMostHonored = state === "mostHonored";

  const rotationDeg = useHonoredRotation(isMostHonored);

  useArturSeeingSound(src);

  const dimensions = getPlayerDimensions(PLAYER_SIZE);

  const blink = getBlinkConfig(blinkSilhouette);

  const transform = getPlayerTransform({
    direction,
    rotationDeg,
    showFlipped,
    isCrouching,
    isFallen,
  });

  const transformOrigin =
    isCrouching || showFlipped || isMostHonored
      ? "bottom center"
      : undefined;

  const spriteClassName = [
    blink.className,
    atomicFlash ? styles.atomicFlash : "",
    mugetsuBlink === "out" ? styles.mugetsuBlinkOut : "",
    mugetsuBlink === "in" ? styles.mugetsuBlinkIn : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      style={{
        position: "absolute",
        width: dimensions.width,
        height: dimensions.height,
        left: x * dimensions.scaleX,
        top: y * dimensions.scaleY,
        transform: "translate(-50%, -100%)",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      {isChargingKi && (
        <ChargingKiEffect
          width={dimensions.chargingEffectWidth}
          height={dimensions.chargingEffectHeight}
        />
      )}

      <BattleSprite
        src={src}
        className={spriteClassName}
        blinkDuration={blink.duration}
        transform={transform}
        transformOrigin={transformOrigin}
        onError={handleSpriteError}
      />

      {atomicHalo && character === "marcelo" && (
        <AtomicHalo />
      )}

      {levelUpParticles && (
        <LevelUpParticles
          character={character}
          size={Math.round(dimensions.height)}
        />
      )}
    </div>
  );
}