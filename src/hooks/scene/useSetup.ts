import { useLayoutEffect, useState } from "react";
import type { ScenePosition } from "@/utils/types/sceneHooks";

type Props = {
  map: number[][];
  initialPosition?: ScenePosition;
  setMap: (map: number[][]) => void;
  setPosition: (x: number, y: number, direction: ScenePosition["direction"]) => void;
};

export function useSceneSetup({
  map,
  initialPosition,
  setMap,
  setPosition,
}: Props) {
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    setMap(map);

    const saved = localStorage.getItem("scene_return_position");

    if (saved) {
      const { x, y, direction } = JSON.parse(saved);
      setPosition(x, y, direction);
      localStorage.removeItem("scene_return_position");
      setIsReady(true);
      return;
    }

    if (initialPosition) {
      setPosition(
        initialPosition.x,
        initialPosition.y,
        initialPosition.direction
      );
    }

    setIsReady(true);
  }, [map]);

  return { isReady };
}