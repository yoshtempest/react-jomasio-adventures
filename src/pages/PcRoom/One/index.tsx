import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css"
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { pcsRoom } from "@/maps/pcRoom/one";
import { useInventory } from "@/contexts/InventoryContext";
import { createPcsRoom } from "@/interactions/pcsRoom";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import Talking from "@/components/Talking";
import { pcsRoomDialogue } from "@/data/maps/pcsRoom/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { useClassSelection } from "@/hooks/menu/useClassSelection";

export default function PcRoomOne() {
  const { player, setMode } = usePlayer();

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem } = useInventory();
  const navigate = useNavigate();
  const [gotKey, setGotKey] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const { classes, selectedIndex } = useClassSelection(showClassModal);

  // 🚪 Transição de mapa
  useEffect(() => {
    if (player.gridX === 3 && player.gridY === 3) {
      navigate("/hall/one");
    }
  }, [player]);

  useEffect(() => {
    if (showClassModal) {
      setMode("select");
    }
  }, [showClassModal]);

  // 🧠 Interações do mapa
  const interactionsByPosition = useMemo(() =>
    createPcsRoom({
      hasItem,
      addItem,
      setPopup: (msg) => setPopup(msg),
      gotKey,
      setGotKey,
    }),
    [hasItem, addItem, gotKey]
  );

  return (
    <div className={`Master PcsRoom`}>
      <ExploreScene
        map={pcsRoom}
        dialogueData={pcsRoomDialogue}
        initialPosition={{ x: 3, y: 4, direction: "down" }}
        audio={{src: MonkeyCircle}}
        onFinish={() => setShowClassModal(true)}
        npcs={[
          {
            src: "/src/assets/npcs/janderson/default.svg",
            gridX: 8,
            gridY: 8,
          },
        ]}
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

      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </div>
  );
}