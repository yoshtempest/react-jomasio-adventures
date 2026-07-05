import { asset } from "@/utils/asset";

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
  const resolvedState = CROUCH_STATE_MAP[state] ?? (state === "charging" ? "idle" : state);
  const isCrouching = state === "idleCrounched" || state === "walkCrounched";
  const isFallen = state === "fallen";
  const isGrabbed = Date.now() < grabbedUntil && !isFallen && !isCrouching;
  const showFlipped = isGrabbed && grabFlipped;
  const src = asset(`assets/player/${character}/inFight/${resolvedState}.svg`);

  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 600;
  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;

  // PLAYER_SIZE vira escala relativa
  const SCALE = PLAYER_SIZE / BASE_HEIGHT;

  const WIDTH = BASE_WIDTH * SCALE;
  const HEIGHT = BASE_HEIGHT * SCALE;

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
                showFlipped ? "scaleY(-1) translate(-50%, 80%)"
                : isCrouching ? "scale(0.7)"
                : isFallen ? "scale(0.7) translate(0, 20%)"
                : ""
              }
            `,
            transformOrigin: isCrouching || showFlipped ? "bottom center" : undefined,
            pointerEvents: "none",
          }}
      />
    </div>
  );
}
