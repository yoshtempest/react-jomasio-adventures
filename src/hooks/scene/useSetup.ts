import { useLayoutEffect, useRef, useState } from "react";
import type { ScenePosition } from "@/utils/types/sceneHooks";

type Props = {
  map: number[][];
  initialPosition?: ScenePosition;
  setMap: (map: number[][]) => void;
  setPosition: (
    x: number,
    y: number,
    direction: ScenePosition["direction"],
  ) => void;
};

export function useSceneSetup({
  map,
  initialPosition,
  setMap,
  setPosition,
}: Props) {
  const [isReady, setIsReady] = useState(false);
  const setMapRef = useRef(setMap);
  setMapRef.current = setMap;
  const setPositionRef = useRef(setPosition);
  setPositionRef.current = setPosition;
  const initialPositionRef = useRef(initialPosition);
  initialPositionRef.current = initialPosition;

  useLayoutEffect(() => {
    setMapRef.current(map);

    localStorage.removeItem("scene_return_position");

    const currentRoute = window.location.hash.replace(/^#/, "") || "/";
    const stored = localStorage.getItem("scene_return_positions");

    if (stored) {
      let positions: Record<string, ScenePosition> = {};
      try {
        positions = JSON.parse(stored);
      } catch {
        localStorage.removeItem("scene_return_positions");
      }
      const saved = positions[currentRoute];

      if (saved) {
        setPositionRef.current(saved.x, saved.y, saved.direction);
        delete positions[currentRoute];
        localStorage.setItem(
          "scene_return_positions",
          JSON.stringify(positions),
        );
        setIsReady(true);
        return;
      }
    }

    const pos = initialPositionRef.current;

    if (pos) {
      setPositionRef.current(pos.x, pos.y, pos.direction);
    }

    setIsReady(true);
  }, [map]);

  return { isReady };
}
