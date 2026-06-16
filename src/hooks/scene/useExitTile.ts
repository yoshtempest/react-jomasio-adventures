import { useEffect, useRef } from "react";
import type { NavigateFunction, Location } from "react-router";

type ExitTileOptions = {
  scene: SceneConfig;
  player: Player;
  quests: Quest[];
  navigateWithFade: (to: string, options?: { state?: unknown }) => void;
  location: Location;
  handleExit?: (ctx: {
    player: Player;
    scene: SceneConfig;
    navigate: NavigateFunction;
    location: Location;
    quests: Quest[];
  }) => boolean;
  setPopup?: (msg: string | null) => void;
};

export function useExitTile({
  scene,
  player,
  quests,
  navigateWithFade,
  location,
  handleExit,
  setPopup,
}: ExitTileOptions) {
  const sceneInitRef = useRef(true);

  useEffect(() => {
    sceneInitRef.current = false;
  }, [scene]);

  const handleExitRef = useRef(handleExit);
  handleExitRef.current = handleExit;
  const setPopupRef = useRef(setPopup);
  setPopupRef.current = setPopup;
  const playerRef = useRef(player);
  playerRef.current = player;

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
      const route = tile.getRoute(currentPlayer, quests);

      if (route !== null) {
        navigateWithFade(route, {
          state: { from: location.pathname },
        });
      } else {
        setPopupRef.current?.(tile.blockedMessage || "Você não pode ir agora.");
      }

      return;
    }

    if (tile.requiredQuest) {
      const hasQuest = quests.some((q) => q.id === tile.requiredQuest);

      if (!hasQuest) {
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
}
