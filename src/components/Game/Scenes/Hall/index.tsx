import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { HALL_SCENES } from "@/scenes/Hall";
import type { SceneId } from "@/utils/types/maps/sceneConfig";
import { runSceneEvents } from "@/engine/runSceneEvents";
import { useQuestActions } from "@/hooks/useQuestActions";


type Props = {
  sceneId: SceneId;
};

export function HallScene({ sceneId }: Props) {
  const scene = HALL_SCENES[sceneId];
  const navigate = useNavigate();
  const location = useLocation();
  const { player } = usePlayer();
  const { giveQuest, progressQuest } = useQuestActions();

  const lastPage = location.state?.from;

  const spawn = scene
  ? typeof scene.initialPosition === "function"
    ? scene.initialPosition(lastPage)
    : scene.initialPosition
  : undefined;

  useEffect(() => {
    if (!scene) return;
    const exits = scene.exitTile;
    if (!exits) return;

    const matchedExit = exits.find(
      (exit) =>
        player.gridX === exit.x &&
        player.gridY === exit.y
    );

    if (matchedExit) {
      navigate(matchedExit.route, {
        state: { from: location.pathname }
      });
    }
  }, [player, scene]);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
      <ExploreScene
        {...scene}
        initialPosition={spawn}
        className={`Master ${scene.className}`}
        onFinish={() => {
          runSceneEvents(scene.events, {
            navigate,
            location,
            giveQuest,
            progressQuest,
          });
        }}
      />
  );
}