import type { ExtraPunchVisual } from "@/hooks/battle/player/useArturOraPunch";
import type { BattleEntityPositioning } from "../types";

type Props = BattleEntityPositioning & {
  extraPunches: ExtraPunchVisual[];
  extraPunchSprite?: string;
  PLAYER_SIZE: number;
};

export function ExtraPunch({
  extraPunches,
  extraPunchSprite,
  PLAYER_SIZE,
  battleScaleX,
  battleScaleY,
}: Props) {
  return (
    <>
      {extraPunches.map((p) => (
        <img
          key={p.id}
          src={extraPunchSprite}
          style={{
            position: "absolute",
            left: p.x * battleScaleX,
            top: p.y * battleScaleY,
            height: PLAYER_SIZE / 1.5,
            width: "auto",
            transform: "translate(-50%, -100%)",
            zIndex: 17,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}
