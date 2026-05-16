import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { HALL_SCENES } from "@/scenes/Hall";
import type { SceneId } from "@/utils/types/maps/sceneConfig";
import { runSceneEvents } from "@/engine/runSceneEvents";


type Props = {
  sceneId: SceneId;
};

export function HallScene({ sceneId }: Props) {
  const scene = HALL_SCENES[sceneId];
  const navigate = useNavigate();
  const { player } = usePlayer();

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
      navigate(matchedExit.route);
    }
  }, [player, scene]);

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  return (
      <ExploreScene
        {...scene}
        className={`Master HallOne`}
        onFinish={() => {
          runSceneEvents(scene.events, {
            navigate,
          });
        }}
      />
  );
}