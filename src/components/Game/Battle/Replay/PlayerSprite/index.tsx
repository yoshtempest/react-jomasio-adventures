
import styles from "../styles.module.css";
import { playerPath } from "@/utils/paths";
import type { ReplayFrame } from "@/utils/types/replay";

type Props = {
  frame: ReplayFrame;
  playerSize: number;
};

const CROUCH: Record<string, string> = {
  idleCrounched: "idleCrounched",
  walkCrounched: "walkCrounched",
};

function resolvePlayerState(s: string): string {
  return CROUCH[s] ?? (s === "charging" ? "idle" : s);
}

export function ReplayPlayerSprite({
  frame,
  playerSize,
}: Props) {

  const isCrouching =
    frame.ps === "idleCrounched" ||
    frame.ps === "walkCrounched";

  const isFallen = frame.ps === "fallen";

  const playerSrc = playerPath(
    `/${frame.pchar}/inFight/${resolvePlayerState(
      frame.ps,
    )}.svg`,
  );

  return (
    <div
      className={styles.sprite}
      style={{
        width: playerSize,
        height: playerSize,
        left: frame.px,
        top: frame.py,
        transform: "translate(-50%, -100%)",
      }}
    >
      <img
        src={playerSrc}
        style={{
          height: "100%",
          left: "50%",
          bottom: 0,
          transform: `
            translateX(-50%)
            scaleX(${frame.pd === "left" ? -1 : 1})
            ${
              isCrouching
                ? "scale(0.7)"
                : isFallen
                  ? "scale(0.7) translate(0, 20%)"
                  : ""
            }
          `,
        }}
      />
    </div>
  );
}