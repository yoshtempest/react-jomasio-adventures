import { useEffect, useRef, useState } from "react";
import { resolveBattleSprite, playerPath } from "@/utils/paths";
import { ProjectileConstants } from "@/data/projectile";
import { getViewportSize } from "@/utils/viewport";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import {
  HONORED_ONE_RISE_MS,
  BLINK_UNTIL_TELEPORT_MS,
  BLINK_SILHOUETTE_FADE_MS,
} from "@/gameRules/battle/cursedEnergy";
import {
  EMANUEL_KI_CHARGE_EFFECT_ASPECT,
  EMANUEL_KI_CHARGE_EFFECT_SIZE_MULTIPLIER,
} from "@/data/characters/emanuel";
import styles from "./styles.module.css";

type Props = {
  x: number;
  y: number;
  PLAYER_SIZE: number;
  state: PlayerState;
  direction: Direction;
  character: CharacterId;
  weapon?: LucasWeapon;
  grabbedUntil?: number;
  grabFlipped?: boolean;
  /** Pasta de sprites do marcelo (ex: Forma Vastolord). */
  form?: "vastolordForm";
  /** Silhueta do blink do riquelme: preta (antes do teleporte) ou branca (chegando). */
  blinkSilhouette?: "black" | "white" | null;
  /** Emanuel segurando a instância: usa o sprite de teleporte no lugar do estado atual. */
  teleportSprite?: boolean;
};

const CROUCH_STATE_MAP: Record<string, string> = {
  idleCrounched: "idleCrounched",
  walkCrounched: "walkCrounched",
};

export function PlayerBattle({
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
  blinkSilhouette = null,
  teleportSprite = false,
}: Props) {
  const resolvedState =
    CROUCH_STATE_MAP[state] ?? (state === "charging" ? "idle" : state);
  const isChargingKi = character === "emanuel" && state === "chargingKi";
  const isCrouching = state === "idleCrounched" || state === "walkCrounched";
  const isFallen = state === "fallen";
  const isGrabbed = Date.now() < grabbedUntil && !isFallen && !isCrouching;
  const showFlipped = isGrabbed && grabFlipped;
  const src =
    teleportSprite && character === "emanuel"
      ? playerPath(`/emanuel/inFight/attacks/teleport.svg`)
      : resolveBattleSprite(character, resolvedState, weapon, form);
  const ARTUR_SEEING_SRC = playerPath("/artur/inFight/special/arturSeeing.svg");

  const blinkClass =
    blinkSilhouette === "black"
      ? styles.blinkBlack
      : blinkSilhouette === "white"
        ? styles.blinkWhite
        : "";

  const blinkDuration =
    blinkClass === styles.blinkBlack
      ? `${BLINK_UNTIL_TELEPORT_MS}ms`
      : blinkClass === styles.blinkWhite
        ? `${BLINK_SILHOUETTE_FADE_MS}ms`
        : undefined;

  const { playSound } = useSoundEffects();
  const prePalmPlayedRef = useRef(false);

  /**
   * Passiva "O Abençoado": durante mostHonored.svg o sprite gira devagar até
   * 90° ao longo da fase de subida (~5s); ao cair (estado muda para "falling")
   * o ângulo volta a 0°.
   */
  const [rotationDeg, setRotationDeg] = useState(0);
  const isMostHonored = state === "mostHonored";

  useEffect(() => {
    if (!isMostHonored) {
      setRotationDeg(0);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const progress = Math.min(1, (now - start) / HONORED_ONE_RISE_MS);
      setRotationDeg(-90 * progress);
      if (progress < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isMostHonored]);

  useEffect(() => {
    // Personagem trocou para a imagem arturSeeing.svg -> prePalm.mp3
    if (src === ARTUR_SEEING_SRC) {
      if (!prePalmPlayedRef.current) playSound("prePalm");
      prePalmPlayedRef.current = true;
    } else {
      prePalmPlayedRef.current = false;
    }
  }, [src, ARTUR_SEEING_SRC, playSound]);

  const scaleX = getViewportSize().width / ProjectileConstants.MAP_WIDTH;
  const scaleY = getViewportSize().height / ProjectileConstants.MAP_HEIGHT;

  // PLAYER_SIZE vira escala relativa
  const SCALE = PLAYER_SIZE / ProjectileConstants.MAP_HEIGHT;

  const WIDTH = (ProjectileConstants.MAP_WIDTH * SCALE) / 1.5;
  const HEIGHT = (ProjectileConstants.MAP_HEIGHT * SCALE) / 1.5;

  const chargingEffectHeight = HEIGHT * EMANUEL_KI_CHARGE_EFFECT_SIZE_MULTIPLIER;
  const chargingEffectWidth =
    chargingEffectHeight / EMANUEL_KI_CHARGE_EFFECT_ASPECT;

  return (
    <div
      style={{
        position: "absolute",
        width: WIDTH,
        height: HEIGHT,
        left: x * scaleX,
        top: y * scaleY,
        transform: "translate(-50%, -100%)", // grab the feet on the ground
        zIndex: 10,
        overflow: "visible", // important to dont cut the image
      }}
    >
      {isChargingKi && (
        <img
          src={playerPath("/emanuel/inFight/attacks/chargingKiEffect.svg")}
          className={styles.chargingKiEffect}
          style={{
            height: chargingEffectHeight,
            width: chargingEffectWidth,
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%)",
          }}
        />
      )}
      <img
        src={src}
        className={blinkClass}
        style={{
          animationDuration: blinkDuration,
          position: "absolute",
          width: "auto",
          height: "100%",
          left: "50%",
          bottom: 0,
          transform: `
              translateX(-50%) 
              scaleX(${direction === "left" ? -1 : 1})
              ${rotationDeg !== 0 ? `rotate(${rotationDeg}deg) ` : ""}${
                showFlipped
                  ? "scaleY(-1) translate(-50%, 80%)"
                  : isCrouching
                    ? "scale(0.7)"
                    : isFallen
                      ? "scale(0.7) translate(0, 20%)"
                      : ""
              }
            `,
          transformOrigin:
            isCrouching || showFlipped || isMostHonored
              ? "bottom center"
              : undefined,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
