import { useEffect, useRef } from "react";
import { useTransitionCtx } from "@/contexts/TransitionContext";

type Props = {
  player: PlayerPosition;
  transitions?: Transition[];
};

export function useSceneNavigation({ player, transitions }: Props) {
  const { navigateWithFade } = useTransitionCtx();
  const hasNavigatedRef = useRef(false);
  const previousPositionRef = useRef({
    x: player.gridX,
    y: player.gridY,
    direction: player.direction,
  });
  const lastPositionRef = useRef({
    x: player.gridX,
    y: player.gridY,
  });

  useEffect(() => {
    const moved =
      player.gridX !== lastPositionRef.current.x ||
      player.gridY !== lastPositionRef.current.y;

    if (!moved) return;

    previousPositionRef.current = {
      x: lastPositionRef.current.x,
      y: lastPositionRef.current.y,
      direction: player.direction,
    };

    lastPositionRef.current = {
      x: player.gridX,
      y: player.gridY,
    };
  }, [player]);

  useEffect(() => {
    if (!transitions || hasNavigatedRef.current) return;

    transitions.forEach(({ positions, to }) => {
      const match = positions.some(
        (pos) => pos.x === player.gridX && pos.y === player.gridY,
      );

      if (match) {
        hasNavigatedRef.current = true;

        const currentRoute = window.location.hash.replace(/^#/, "") || "/";
        const stored = localStorage.getItem("scene_return_positions");
        let map: Record<string, typeof previousPositionRef.current> = {};
        if (stored) {
          try {
            map = JSON.parse(stored);
          } catch {
            map = {};
          }
        }
        map[currentRoute] = previousPositionRef.current;
        localStorage.setItem("scene_return_positions", JSON.stringify(map));

        navigateWithFade(to, {
          state: {
            from: currentRoute,
          },
        });
      }
    });
  }, [player, transitions, navigateWithFade]);
}
