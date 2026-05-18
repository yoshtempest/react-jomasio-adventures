import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { CAFETERIA_SCENES } from "@/scenes/Cafeteria";
import type { SceneId } from "@/utils/types/maps/sceneConfig";
import { runSceneEvents } from "@/engine/runSceneEvents";
import { createCafeteria } from "@/interactions/cafeteira";
import { useInventory } from "@/contexts/InventoryContext";
import Talking from "@/components/Talking";
import { useQuestActions } from "@/hooks/useQuestActions";
import { useLocation } from "react-router";


type Props = {
  sceneId: SceneId;
};

export function CafeteriaScene({ sceneId }: Props) {
  const scene = CAFETERIA_SCENES[sceneId];
  const { giveQuest, progressQuest } = useQuestActions();
  const location = useLocation();
  const navigate = useNavigate();
  const { player } = usePlayer();
  const { addItem, hasItem, removeItem } = useInventory();
  const [popup, setPopup] = useState<string | null>(null);
  const [gotKey, setGotKey] = useState(false);

  const lastPage = location.state?.from;

  const spawn = scene
    ? typeof scene.initialPosition === "function"
      ? scene.initialPosition(lastPage)
      : scene.initialPosition
    : undefined;

  const interactionsByPosition = useMemo(() =>
    createCafeteria({
      hasItem,
      addItem,
      removeItem,
      setPopup: (msg) => setPopup(msg),
      gotKey,
      setGotKey,
      progressQuest,
    }),
    [addItem, gotKey]
  );

  // 🚪 exit tile (genérico e seguro)
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
    <div className={`Master Cafeteria`}>
      <ExploreScene
        {...scene}
        initialPosition={spawn}
        lastPage={lastPage}
        onFinish={() => {
          runSceneEvents(scene.events, {
            navigate,
            location,
            giveQuest,
            progressQuest,
          });
        }}
        onInteract={(_, x, y) => {
          if (popup) {
            setPopup(null);
            return true;
          }

          const interaction = interactionsByPosition[`${x},${y}`];
          if (interaction) {
            interaction();
            return true;
          }

          return false;
        }}
      />
      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </div>
  );
}
