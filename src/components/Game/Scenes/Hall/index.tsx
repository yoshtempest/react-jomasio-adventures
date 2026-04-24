import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { HALL_SCENES } from "@/scenes/Hall";
import type { SceneId } from "@/utils/types/maps/sceneConfig";
import { runSceneEvents } from "@/engine/runSceneEventsCantina";


type Props = {
  sceneId: SceneId;
};

export function HallScene({ sceneId }: Props) {
  const scene = HALL_SCENES[sceneId];

  if (!scene) {
    return <div>Scene não encontrada</div>;
  }

  const navigate = useNavigate();
  const { player } = usePlayer();

  // 🚪 exit tile (genérico e seguro)
  useEffect(() => {
    const exit = scene.exitTile;
    if (!exit) return;

    if (
      player.gridX === exit.x &&
      player.gridY === exit.y
    ) {
      navigate(exit.route);
    }
  }, [player, scene]);

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