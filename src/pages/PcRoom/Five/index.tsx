import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { pcsRoom } from "@/maps/pcsRoom";
import { useInventory } from "@/contexts/InventoryContext";
import { createPcsRoom } from "@/interactions/pcsRoom";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import Talking from "@/components/Talking";
import { pcsRoomDialogue } from "@/data/maps/pcsRoom/pcsRoom";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";

export default function PcRoomFive() {
  const { player } = usePlayer();

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem } = useInventory();
  const navigate = useNavigate();
  const [gotKey, setGotKey] = useState(false);

  // 🚪 Transição de mapa
  useEffect(() => {
    if (player.gridX === 3 && player.gridY === 3) {
      navigate("/hall/one");
    }
  }, [player]);

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
      <SceneWithDialogue
        map={pcsRoom}
        dialogueData={pcsRoomDialogue}

        audio={{src: MonkeyCircle}}
        nextRoute="/pcroom/two"
        npcs={[
          {
            src: "/src/assets/npcs/jhowsimar/default.svg",
            gridX: 8,
            gridY: 5,
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

      {popup && (
        <Talking
          name="Sistema"
          message={popup}
        />
      )}
    </div>
  );
}