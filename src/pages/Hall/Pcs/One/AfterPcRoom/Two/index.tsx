import { hallOne } from "@/maps/hall/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { AfterPcRoomTwoDialogue } from "@/data/maps/hall/one/afterPcRoom/two"; 
import { useInventory } from "@/contexts/InventoryContext";
import type { Dialogue } from "@/utils/types/dialogue";


export default function AfterPcRoomTwo() {

  const { addItem, hasItem, removeItem } = useInventory();

  const npcInteraction = (startDialogue: (d: Dialogue[]) => void) => {
    if (hasItem("key_02")) {
      removeItem("key_02");

      addItem({
        id: "key_05",
        name: "Pó do bom",
      });
      startDialogue(AfterPcRoomTwoDialogue); // 🔥 AGORA É DIÁLOGO REAL

    } else {
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