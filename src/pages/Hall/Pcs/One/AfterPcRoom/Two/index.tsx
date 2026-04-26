import { hallOne } from "@/maps/hall/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { AfterPcRoomTwoDialogue } from "@/data/maps/hall/one/afterPcRoom/two";
import { AfterPcRoomThreeDialogue } from "@/data/maps/hall/one/afterPcRoom/three"; 
import { useInventory } from "@/contexts/InventoryContext";
import type { Dialogue } from "@/utils/types/dialogue";
import { useState } from "react"


export default function AfterPcRoomTwo() {
  const [pendingReward, setPendingReward] = useState(false);

  const { addItem, hasItem, removeItem } = useInventory();

  const npcInteraction = (startDialogue: (d: Dialogue[]) => void) => {
    if (hasItem("key_02")) {
      setPendingReward(true);
      removeItem("key_02");

      addItem({
        id: "key_05",
        name: "Pó do bom",
        type: "teleport",
      });
      startDialogue(AfterPcRoomTwoDialogue); // 🔥 AGORA É DIÁLOGO REAL
      return;
    }
    if (hasItem("key_05")) {
      startDialogue(AfterPcRoomThreeDialogue);
      return;
    }
    {
      startDialogue([
        {
          src: "/src/assets/npcs/remedinha/right.svg",
          name: "Remedinha",
          message: "Vai lá pegar o negócio pra mim, meu filho.",
        },
      ]);
    }
  };

  return (
    <ExploreScene
      map={hallOne}
      className={`Master HallOne`}
      dialogueData={AfterPcRoomTwoDialogue} 
      initialPosition={{ x: 2, y: 9, direction: "left" }}
      onFinish={() => {
        if (pendingReward) {
          removeItem("key_02");

          addItem({
            id: "key_05",
            name: "Pó do bom",
            type: "teleport"
          });

          setPendingReward(false);
        }
      }}
      npcs={[
        {
          src: "/src/assets/npcs/remedinha/default.svg",
          gridX: 1,
          gridY: 9,
          interaction: npcInteraction,
        },
      ]}
      transitions={[
        {
          positions: [
            { x: 1, y: 10 },
          ],
          to: "/hall/left/one",
        },
        {
          positions: [{ x: 13, y: 7 }],
          to: "/pcroom/seven",
        },
        {
          positions: [
            { x: 7, y: 2 },
            { x: 8, y: 2 },
            { x: 9, y: 2 },
          ],
          to: "/hall/two",
        },
      ]}
    />
  );
}