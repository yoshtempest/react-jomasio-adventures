import { useMemo, useState } from "react";
import { pcsRoomSix } from "@/maps/pcRoom/pcsRoomSix";
import { useInventory } from "@/contexts/InventoryContext";
import { createPcsRoom } from "@/interactions/pcsRoom";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import Talking from "@/components/Talking";
import { pcsRoomSixDialogue } from "@/data/maps/pcsRoom/pcsRoomSix";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";

export default function PcRoomSix() {

  const [popup, setPopup] = useState<string | null>(null);
  const { addItem, hasItem } = useInventory();

  const interactionsByPosition = useMemo(() =>
    createPcsRoom({
      hasItem,
      addItem,
      setPopup: (msg) => setPopup(msg),
    }),
    [hasItem, addItem]
  );

  return (
    <div className={`Master PcsRoom`}>
      <SceneWithDialogue
        map={pcsRoomSix}
        dialogueData={pcsRoomSixDialogue}
        audio={{src: MonkeyCircle}}
        nextRoute={"/pcroom/seven"}
        initialPosition={{ x: 12, y: 4, direction: "left" }}
        npcs={[
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