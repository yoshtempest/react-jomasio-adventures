import { useEffect, useRef } from "react";
import { getTileInFront } from "@/utils/getTileInFront";
import { useGameControls } from "@/contexts/GameControlsContext";

export function useInteraction({
  player,
  map,
  onInteract,
}: any) {
  const playerRef = useRef(player);
  const mapRef = useRef(map);
  const onInteractRef = useRef(onInteract);
  const { pushControls, popControls } = useGameControls();

  // mantém sempre atualizado sem re-render
  useEffect(() => {
    playerRef.current = player;
    mapRef.current = map;
    onInteractRef.current = onInteract;
  });

  // registra o handler UMA VEZ
  useEffect(() => {
    const handler = () => {
      const result = getTileInFront(
        playerRef.current,
        mapRef.current
      );

      console.log("INTERACT DEBUG:", result);

      const { x, y, tile } = result;

      onInteractRef.current(tile, x, y);
    };

    pushControls({
      onConfirm: () => {
        const { x, y, tile } = getTileInFront(
          playerRef.current,
          mapRef.current
        );

        return onInteractRef.current(tile, x, y);
      }
    });

    return () => popControls();
  }, [pushControls, popControls]);
}