import { useLayoutEffect, useRef, useState } from "react";
import type { ScenePosition } from "@/utils/types/sceneHooks";
import { saveCompressed, loadCompressed } from "@/utils/save/storage";
import { slotKey } from "@/utils/save/slotManager";

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

const SCENE_POSITIONS_KEY = () => slotKey("scene_return_positions");

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
    const positions =
      loadCompressed<Record<string, ScenePosition>>(SCENE_POSITIONS_KEY()) ??
      {};

    const saved = positions[currentRoute];

    if (saved) {
      setPositionRef.current(saved.x, saved.y, saved.direction);
      delete positions[currentRoute];
      saveCompressed(SCENE_POSITIONS_KEY(), positions);
      setIsReady(true);
      return;
    }

    const pos = initialPositionRef.current;

    if (pos) {
      setPositionRef.current(pos.x, pos.y, pos.direction);
    }

    setIsReady(true);
  }, [map]);

  return { isReady };
}
