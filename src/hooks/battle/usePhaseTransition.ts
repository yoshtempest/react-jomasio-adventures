import { useEffect, useRef } from "react";
import type { NPCBattleState } from "@/utils/types/npc/npc";

type Props = {
  npcPhase: number;
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  npc: NPCBattleState & {
    updateNpc: (data: Partial<NPCBattleState>) => void;
    resetNpc: (stateOverride?: NPCBattleState["state"]) => void;
  };
  clearSummons: () => void;
  setIsPhaseTransitioning: (v: boolean) => void;
};

export function usePhaseTransition({
  npcPhase,
  player,
  setPlayer,
  npc,
  clearSummons,
  setIsPhaseTransitioning,
}: Props) {
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (npcPhase !== 2) return;

    clearSummons();
    setIsPhaseTransitioning(true);

    const startPlayerX = player.x;
    const startPlayerY = player.y;
    const startNpcX = npc.x;
    const TARGET_X = 100;
    const TARGET_NPC_X = 900;
    const TARGET_Y = 670;
    const DURATION = 700;

    setPlayer((p) => ({
      ...p,
      state: "walk",
      battleDirection: "right",
    }));
    npc.updateNpc({ direction: "left", state: "walk" });

    const startTime = performance.now();
    let animFrame: number;

    function animate(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      const px = startPlayerX + (TARGET_X - startPlayerX) * ease;
      const py = startPlayerY + (TARGET_Y - startPlayerY) * ease;
      const nx = startNpcX + (TARGET_NPC_X - startNpcX) * ease;

      setPlayer((p) => ({
        ...p,
        x: px,
        y: py,
        groundY: TARGET_Y,
        velY: 0,
        battleDirection: "right",
      }));
      npc.updateNpc({ x: nx, y: TARGET_Y });

      if (t < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setPlayer((p) => ({
          ...p,
          x: TARGET_X,
          y: TARGET_Y,
          groundY: TARGET_Y,
          velY: 0,
          state: "idle",
          battleDirection: "right",
        }));
        npc.resetNpc("pitch");
        phaseTimeoutRef.current = setTimeout(
          () => setIsPhaseTransitioning(false),
          600,
        );
      }
    }

    animFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(phaseTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [npcPhase]);
}
