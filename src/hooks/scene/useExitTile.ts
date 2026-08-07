import { useEffect, useRef } from "react";
import type { NavigateFunction } from "react-router";
import type { ExitTileOptions } from "@/utils/types/maps/exitTiles";
import { useFlags } from "@/contexts/FlagContext";

const OPPOSITE: Record<string, Player["direction"]> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function useExitTile({
  scene,
  player,
  quests,
  navigateWithFade,
  location,
  handleExit,
  setPopup,
  popup,
  setPosition,
}: ExitTileOptions) {
  const sceneInitRef = useRef(true);

  useEffect(() => {
    sceneInitRef.current = false;
  }, [scene]);

  const handleExitRef = useRef(handleExit);
  handleExitRef.current = handleExit;
  const setPopupRef = useRef(setPopup);
  setPopupRef.current = setPopup;
  const setPositionRef = useRef(setPosition);
  setPositionRef.current = setPosition;
  const playerRef = useRef(player);
  playerRef.current = player;
  const { flags } = useFlags();
  const flagsRef = useRef(flags);
  flagsRef.current = flags;

  const prevPositionRef = useRef({
    x: player.gridX,
    y: player.gridY,
    direction: player.direction,
  });
  const blockedPositionRef = useRef<{
    x: number;
    y: number;
    direction: Player["direction"];
  } | null>(null);
  const prevPopupRef = useRef(popup);

  useEffect(() => {
    if (!scene) return;

    if (!sceneInitRef.current) {
      sceneInitRef.current = true;
      return;
    }

    const currentPlayer = playerRef.current;

    if (
      handleExitRef.current?.({
        player: currentPlayer,
        scene,
        navigate: navigateWithFade as NavigateFunction,
        location,
        quests,
      })
    ) {
      return;
    }

    const tile = scene.tiles?.find(
      (t: SceneTile) =>
        currentPlayer.gridX === t.x && currentPlayer.gridY === t.y,
    );

    if (!tile) return;

    if (tile.getRoute) {
      const route = tile.getRoute(currentPlayer, quests, flagsRef.current);

      if (route !== null) {
        navigateWithFade(route, {
          state: { from: location.pathname },
        });
      } else {
        blockedPositionRef.current = { ...prevPositionRef.current };
        setPopupRef.current?.(tile.blockedMessage || "Você não pode ir agora.");
      }

      return;
    }

    if (tile.requiredQuest) {
      const hasQuest = quests.some((q) => q.id === tile.requiredQuest);

      if (!hasQuest) {
        blockedPositionRef.current = { ...prevPositionRef.current };
        setPopupRef.current?.(tile.blockedMessage || "Você não pode ir agora.");
        return;
      }
    }

    if (tile.route) {
      navigateWithFade(tile.route, {
        state: { from: location.pathname },
      });
    }
  }, [player.gridX, player.gridY, scene, quests, navigateWithFade, location]);

  useEffect(() => {
    const prev = prevPositionRef.current;
    const moved =
      player.gridX !== prev.x ||
      player.gridY !== prev.y ||
      player.direction !== prev.direction;

    if (moved) {
      prevPositionRef.current = {
        x: player.gridX,
        y: player.gridY,
        direction: player.direction,
      };
    }
  }, [player.gridX, player.gridY, player.direction]);

  useEffect(() => {
    const wasOpen = prevPopupRef.current !== null;
    const isNowClosed = popup === null;
    prevPopupRef.current = popup;

    if (!wasOpen || !isNowClosed) return;

    const blocked = blockedPositionRef.current;
    if (!blocked) return;
    blockedPositionRef.current = null;

    setPositionRef.current?.(
      blocked.x,
      blocked.y,
      OPPOSITE[blocked.direction] ?? blocked.direction,
    );
  }, [popup, player.direction]);
}
