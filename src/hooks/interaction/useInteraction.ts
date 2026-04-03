import { useEffect, useRef } from "react";
import { getTileInFront } from "@/utils/getTileInFront";

export function useInteraction({
  player,
  map,
  onInteract,
  setOnConfirm,
}: any) {
  const playerRef = useRef(player);
  const mapRef = useRef(map);
  const onInteractRef = useRef(onInteract);

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

    setOnConfirm(() => handler);

    return () => setOnConfirm(undefined);
  }, [setOnConfirm]);
}