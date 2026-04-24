// PcRoomScene.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useInventory } from "@/contexts/InventoryContext";
import { createPcsRoom } from "@/interactions/pcsRoom";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { PCS_ROOM_SCENES } from "@/scenes/PcRoom";
import type { SceneId } from "@/utils/types/maps/sceneConfig";
import { runSceneEvents } from "@/engine/runSceneEvents";

type Props = {
  sceneId: SceneId;
};

export function PcRoomScene({ sceneId }: Props) {
  const scene = PCS_ROOM_SCENES[sceneId];
  console.log("sceneId recebido:", sceneId);
console.log("cenas disponíveis:", Object.keys(PCS_ROOM_SCENES));
console.log("scene encontrada:", PCS_ROOM_SCENES[sceneId]);

    if (!scene) {
    return <div>Scene não encontrada</div>;
    }

  const navigate = useNavigate();
  const { player } = usePlayer();
  const [showClassModal, setShowClassModal] = useState(false);

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem } = useInventory();
  const [gotKey, setGotKey] = useState(false);

  const interactionsByPosition = useMemo(() =>
    createPcsRoom({
      hasItem,
      addItem,
      setPopup,
      gotKey,
      setGotKey,
    }),
    [hasItem, addItem, gotKey]
  );

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
      className={`Master PcsRoom`}
      onFinish={() => {
        runSceneEvents(scene.events, {
          navigate,
          setShowClassModal,
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
  );
}