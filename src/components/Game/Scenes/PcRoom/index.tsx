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
import Talking from "@/components/Talking";
import { useQuestActions } from "@/hooks/useQuestActions";
import { useLocation } from "react-router";


type Props = {
  sceneId: SceneId;
};

export function PcRoomScene({ sceneId }: Props) {
  const scene = PCS_ROOM_SCENES[sceneId];
  const { giveQuest, progressQuest } = useQuestActions();
  const location = useLocation();
  const navigate = useNavigate();
  const { player, setMode } = usePlayer();
  const [showClassModal, setShowClassModal] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);
  const { addItem } = useInventory();
  const [gotKey, setGotKey] = useState(false);

  const lastPage = location.state?.from;

  const spawn = scene
    ? typeof scene.initialPosition === "function"
      ? scene.initialPosition(lastPage)
      : scene.initialPosition
    : undefined;

  const { classes, selectedIndex } = useClassSelection(showClassModal, () => {
    setShowClassModal(false);
    setMode("explore");
    navigate("/pcroom/two");
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
      addItem,
      setPopup,
      gotKey,
      setGotKey,
    }),
    [addItem, gotKey]
  );

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
    <div className={`Master PcsRoom`}>
      <ExploreScene
        {...scene}
        initialPosition={spawn}
        onFinish={() => {
          runSceneEvents(scene.events, {
            navigate,
            location,
            setShowClassModal,
            progressQuest,
            giveQuest,
            addItem,
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
                  <span className="cursor">▼</span>
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

      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </div>
  );
}