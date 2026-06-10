import { useEffect, useRef } from "react";
import { getTileInFront } from "@/utils/getTileInFront";
import { useGameControls } from "@/contexts/GameControlsContext";
import type { Player } from "@/utils/types/player/player";
import type { InteractionHandler } from "@/utils/types/sceneHooks";

export function useInteraction({
  player,
  map,
  onInteract,
}: {
  player: Player;
  map: number[][];
  onInteract: InteractionHandler;
}) {
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