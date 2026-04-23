import { blocked } from "@/maps/blocked";  
import { directorDialogue } from "@/data/maps/director/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";

export default function Director() {

  return (
    <div className={`Master Director`}>
      <ExploreScene
        map={blocked}
        dialogueData={directorDialogue}
        initialPosition={{ x: 9, y: 5, direction: "up" }} 
        autoStartDialogue={true}
        nextRoute="/director/two"
        npcs={[
          {
            src: "/src/assets/npcs/system/default.svg",
            gridX: 9,
            gridY: 4,
          },
        ]}
      />
    </div>
  );
}