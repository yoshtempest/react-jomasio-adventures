import { useEffect, useRef } from "react";
import { npcPathProjectile } from "@/utils/paths";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import type { GroundPaper as GroundPaperState } from "@/services/npc/attacks/maugrelo/state";
import type { BattleEntityPositioning } from "../types";

type Props = BattleEntityPositioning & {
  papers: GroundPaperState[];
};

export function GroundPaper({
  papers,
  battleScaleX,
  battleScaleY,
}: Props) {
  const { playSound } = useSoundEffects();

  const explodedPaperIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // paper virou explosion.svg -> explosion.mp3 (uma vez por paper)
    for (const gp of papers) {
      if (gp.sprite === "explosion" && !explodedPaperIdsRef.current.has(gp.id)) {
        explodedPaperIdsRef.current.add(gp.id);
        playSound("explosion");
      }
    }
    const renderedPaperIds = new Set(papers.map((gp) => gp.id));
    for (const id of explodedPaperIdsRef.current) {
      if (!renderedPaperIds.has(id)) explodedPaperIdsRef.current.delete(id);
    }
  }, [papers, playSound]);

  return (
    <>
      {papers.map((gp) => (
        <img
          key={gp.id}
          src={
            gp.sprite === "explosion"
              ? npcPathProjectile("/explosion.svg")
              : npcPathProjectile("/paper.svg")
          }
          style={{
            position: "absolute",
            left: gp.x * battleScaleX,
            top: gp.y * battleScaleY,
            width: 60,
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}