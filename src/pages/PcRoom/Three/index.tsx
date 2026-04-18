import { useMemo, useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { createPcsRoom } from "@/interactions/pcsRoom";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import Talking from "@/components/Talking";
import { pcsRoomThreeDialogue } from "@/data/maps/pcsRoom/three";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { pcsRoomTwo } from "@/maps/pcRoom/two";

export default function PcRoomThree() {

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
        map={pcsRoomTwo}
        dialogueData={pcsRoomThreeDialogue}
        initialPosition={{ x: 13, y: 4, direction: "right" }}
        audio={{src: MonkeyCircle}}
        nextRoute="/pcroom/four"
        autoStartDialogue={true}
        npcs={[
          {
            src: "/src/assets/npcs/jhowsimar/default.svg",
            gridX: 14,
            gridY: 4,
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