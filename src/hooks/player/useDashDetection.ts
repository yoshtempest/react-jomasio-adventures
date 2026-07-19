import { useCallback } from "react";
import { DASH_THRESHOLD, DASH_COOLDOWN } from "@/data/cooldowns";
import { getSkillTree } from "@/data/passiveSkills";

type DashRefs = {
  progressRef: React.RefObject<Record<string, { level: number }>>;
  playerRef: React.RefObject<Player>;
  dashRef: React.RefObject<(dir: "left" | "right") => void>;
  lastLeftPressRef: React.MutableRefObject<number>;
  lastRightPressRef: React.MutableRefObject<number>;
  lastDashTimeRef: React.MutableRefObject<number>;
};

export function useDashDetection(refs: DashRefs) {
  const tryDash = useCallback(
    (dir: "left" | "right", startMoveRef: React.RefObject<() => void>) => {
      const now = Date.now();
      const lastPressRef =
        dir === "left" ? refs.lastLeftPressRef : refs.lastRightPressRef;
      const lastPressTime = lastPressRef.current;

      if (
        now - lastPressTime < DASH_THRESHOLD &&
        now - refs.lastDashTimeRef.current > DASH_COOLDOWN
      ) {
        const character = refs.playerRef.current?.character;
        const level = refs.progressRef.current?.[character]?.level ?? 1;
        const tree = getSkillTree(character);
        const skill = tree.skills.find((s) => s.id === "dash");
        const canDash = skill ? level >= skill.levelRequired : false;

        if (canDash) {
          refs.dashRef.current?.(dir);
          refs.lastDashTimeRef.current = now;
          lastPressRef.current = 0;
          return true;
        }
      }

      startMoveRef.current?.();
      lastPressRef.current = now;
      return false;
    },
    [refs],
  );

  return { tryDash };
}
