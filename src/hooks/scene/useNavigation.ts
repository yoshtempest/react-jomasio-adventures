import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import type { PlayerPosition, Transition } from "@/utils/types/sceneHooks";

type Props = {
  player: PlayerPosition;
  transitions?: Transition[];
};

export function useSceneNavigation({
  player,
  transitions,
}: Props) {
  const navigate = useNavigate();
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
        (pos) => pos.x === player.gridX && pos.y === player.gridY
      );

      if (match) {
        hasNavigatedRef.current = true;

        localStorage.setItem(
          "scene_return_position",
          JSON.stringify(previousPositionRef.current)
        );

        navigate(to, {
          state: {
            from: window.location.pathname,
          },
        });
      }
    });
  }, [player, transitions, navigate]);
}