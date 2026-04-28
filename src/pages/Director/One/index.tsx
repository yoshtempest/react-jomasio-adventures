import { blocked } from "@/maps/blocked";  
import { directorDialogue } from "@/data/maps/director/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { useQuestActions } from "@/hooks/useQuestActions";


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
        giveQuest({
          id: "director_escape",
          name: "Fuja da diretoria",
          image: "/src/assets/npcs/system/default.svg",
          description: "Procure uma forma de sair da diretoria",
          type: "history",
          counter: 1,
          progress: 0,
          completed: false,
        });
      }}
      npcs={[
        {
          src: "/src/assets/npcs/system/default.svg",
          gridX: 9,
          gridY: 4,
        },
      ]}
    />
  );
}