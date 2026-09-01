import { npcPathProjectile } from "@/utils/paths";
import type { StuckPaper } from "@/services/npc/attacks/maugrelo/state";
import type { BattleEntityPositioning } from "../types";

type Props = BattleEntityPositioning & {
  papers: StuckPaper[];
  playerX: number;
  playerY: number;
};

export function StuckPapers({
  papers,
  playerX,
  playerY,
  battleScaleX,
  battleScaleY,
}: Props) {
  return (
    <>
      {papers.map((sp, i) => (
        <img
          key={sp.id}
          src={npcPathProjectile("/paper.svg")}
          style={{
            position: "absolute",
            left: (playerX + i * 14) * battleScaleX,
            top: (playerY - 70) * battleScaleY,
            width: 60,
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}
