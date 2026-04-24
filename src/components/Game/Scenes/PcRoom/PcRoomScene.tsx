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
import styles from "./styles.module.css"
import { useClassSelection } from "@/hooks/menu/useClassSelection";

type Props = {
  sceneId: SceneId;
};

export function PcRoomScene({ sceneId }: Props) {
  const scene = PCS_ROOM_SCENES[sceneId];
  // console.log("sceneId recebido:", sceneId);
  // console.log("cenas disponíveis:", Object.keys(PCS_ROOM_SCENES));
  // console.log("scene encontrada:", PCS_ROOM_SCENES[sceneId]);

  if (!scene) {
  return <div>Scene não encontrada</div>;
  }

  const navigate = useNavigate();
  const { player, setMode } = usePlayer();
  const [showClassModal, setShowClassModal] = useState(false);

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem } = useInventory();
  const [gotKey, setGotKey] = useState(false);

  const { classes, selectedIndex } = useClassSelection(showClassModal, () => {
    setShowClassModal(false),
    setMode("explore");
    navigate("/pcroom/two")
  });

  useEffect(() => {
    if (showClassModal) {
      setMode("select");
    }
    else {
      setMode("explore");
    }
  }, [showClassModal]);

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
    <div className={`Master PcsRoom`}>
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
      {showClassModal && (
        <div className={styles.classModal}>
          <h1>Escolha sua classe</h1>

          <div className={styles.classList}>
            {classes.map((cls, index) => (
              <div
                key={cls}
                className={`${styles.classItem} ${
                  index === selectedIndex ? styles.selected : ""
                }`}
              >
                {index === selectedIndex && (
                  <span className={styles.cursor}>▼</span>
                )}

                <h3>{cls}</h3>

                {cls === "fracote" && <p>-1 no deliciômetro</p>}
                {cls === "idiota" && <p>-8% dano recebido</p>}
                {cls === "amostradinho" && <p>+1% dano causado</p>}
              </div>
            ))}
          </div>
          <p>Sua classe influencia todos os personagens e pode ser alterada futuramente</p>
        </div>
      )}
    </div>
  );
}