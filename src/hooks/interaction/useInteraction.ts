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
    const { x, y, tile } = getTileInFront(
      playerRef.current,
      mapRef.current
    );

      onInteractRef.current(tile, x, y);
    };

    pushControls({
      onConfirm: () => handler()
    });

    return () => popControls();
  }, [popControls]);
}