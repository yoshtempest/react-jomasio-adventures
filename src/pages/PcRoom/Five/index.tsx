import { useMemo, useState } from "react";
import { pcsRoom } from "@/maps/pcRoom/pcsRoom";
import { useInventory } from "@/contexts/InventoryContext";
import { createPcsRoom } from "@/interactions/pcsRoom";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import Talking from "@/components/Talking";
import { pcsRoomDialogue } from "@/data/maps/pcsRoom/pcsRoom";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";

export default function PcRoomFive() {

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem } = useInventory();
  const [gotKey, setGotKey] = useState(false);

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
        npcs={[
          {
            src: "/src/assets/npcs/vandinha/default.svg",
            gridX: 12,
            gridY: 4,
          },
          {
            src: "/src/assets/npcs/reincardion/default.svg",
            gridX: 11,
            gridY: 4,
          }
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