import { useEffect } from "react";
import { getTileInFront } from "../utils/getTileInFront";

export function useInteraction({
  player,
  map,
  onInteract,
  setOnConfirm,
}: any) {
  useEffect(() => {
    setOnConfirm(() => () => {
      const { x, y } = getTileInFront(player);
      const tile = map[y]?.[x];

      onInteract(tile, x, y);
    });

    return () => setOnConfirm(undefined);
  }, [player, map, onInteract]);
}