import { hallOne } from "@/maps/hall/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { AfterPcRoomOneDialogue } from "@/data/maps/hall/one/afterPcRoom/one";
import { useQuestActions } from "@/hooks/useQuestActions";
import { QUESTS } from "@/data/quests";
import { useInventory } from "@/contexts/InventoryContext";


export default function AfterPcRoom() {
  const { giveQuest } = useQuestActions();
  const { removeItem } = useInventory();

  return (
    <ExploreScene
      map={hallOne}
      className={`Master HallOne`}
      dialogueData={AfterPcRoomOneDialogue} 
      nextRoute={"/hall/afterpcroom/two"}
      initialPosition={{ x: 12, y: 7, direction: "left" }}
      onFinish={() => {
        removeItem("aura_letter")
        giveQuest(QUESTS.search_packaging);
      }}
      npcs={[
        {
          src: "/src/assets/npcs/remedinha/default.svg",
          gridX: 1,
          gridY: 9,
        },
      ]}
    />
  );
}