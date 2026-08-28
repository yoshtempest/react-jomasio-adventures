import { npcPath } from "@/utils/paths";
import type { CoffinState } from "@/hooks/battle/summon/useCoffinAnimation";
import type { BattleEntityPositioning } from "../types";

type Props = BattleEntityPositioning & {
  coffins: CoffinState[];
  TILE_SIZE: number;
};

export function Coffin({
  coffins,
  TILE_SIZE,
  battleScaleX,
  battleScaleY,
}: Props) {
  return (
    <>
      {coffins.map((c) => {
        const coffinSrc =
          c.phase === "closed"
            ? npcPath("/hungryKing/coffin.svg")
            : npcPath("/hungryKing/coffinOpen.svg");

        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              width: TILE_SIZE * 2,
              height: TILE_SIZE * 2,
              left: c.x * battleScaleX,
              top: c.y * battleScaleY,
              transform: "translate(-50%, -100%)",
              opacity: c.phase === "fading" ? 0 : 1,
              transition: "opacity 500ms linear",
              zIndex: 8,
            }}
          >
            <img
              src={coffinSrc}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        );
      })}
    </>
  );
}
