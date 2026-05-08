import { blocked } from "@/maps/blocked";  
import { directorDialogue } from "@/data/maps/director/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { useQuestActions } from "@/hooks/useQuestActions";
import { QUESTS } from "@/data/quests";


export default function Director() {
  const { giveQuest } = useQuestActions();
  
  return (
    <ExploreScene
      map={blocked}
      className={`Master Director`}
      dialogueData={directorDialogue}
      initialPosition={{ x: 9, y: 5, direction: "up" }} 
      autoStartDialogue={true}
      nextRoute="/director/two"
      onFinish={() => {
        giveQuest(QUESTS.director_escape);
      }}
      npcs={[
        {
          src: "/assets/npcs/system/default.svg",
          gridX: 9,
          gridY: 4,
        },
      ]}
    />
  );
}