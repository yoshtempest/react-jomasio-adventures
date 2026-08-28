import { useEffect, useRef } from "react";
import { resolveBattleSprite, playerPath } from "@/utils/paths";
import { ProjectileConstants } from "@/data/projectile";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

type Props = {
  x: number;
  y: number;
  PLAYER_SIZE: number;
  state: PlayerState;
  direction: Direction;
  character: CharacterId;
  grabbedUntil?: number;
  grabFlipped?: boolean;
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
  grabbedUntil = 0,
  grabFlipped = false,
}: Props) {
  const resolvedState =
    CROUCH_STATE_MAP[state] ?? (state === "charging" ? "idle" : state);
  const isCrouching = state === "idleCrounched" || state === "walkCrounched";
  const isFallen = state === "fallen";
  const isGrabbed = Date.now() < grabbedUntil && !isFallen && !isCrouching;
  const showFlipped = isGrabbed && grabFlipped;
  const src = resolveBattleSprite(character, resolvedState);
  const ARTUR_SEEING_SRC = playerPath("/artur/inFight/special/arturSeeing.svg");

  const { playSound } = useSoundEffects();
  const prePalmPlayedRef = useRef(false);

  useEffect(() => {
    // Personagem trocou para a imagem arturSeeing.svg -> prePalm.mp3
    if (src === ARTUR_SEEING_SRC) {
      if (!prePalmPlayedRef.current) playSound("prePalm");
      prePalmPlayedRef.current = true;
    } else {
      prePalmPlayedRef.current = false;
    }
  }, [src, ARTUR_SEEING_SRC, playSound]);

  const scaleX = window.innerWidth / ProjectileConstants.MAP_WIDTH;
  const scaleY = window.innerHeight / ProjectileConstants.MAP_HEIGHT;

  // PLAYER_SIZE vira escala relativa
  const SCALE = PLAYER_SIZE / ProjectileConstants.MAP_HEIGHT;

  const WIDTH = (ProjectileConstants.MAP_WIDTH * SCALE) / 1.5;
  const HEIGHT = (ProjectileConstants.MAP_HEIGHT * SCALE) / 1.5;

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
      <img
        src={src}
        style={{
          position: "absolute",
          width: "auto",
          height: "100%",
          left: "50%",
          bottom: 0,
          transform: `
              translateX(-50%) 
              scaleX(${direction === "left" ? -1 : 1})
              ${
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
            isCrouching || showFlipped ? "bottom center" : undefined,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
