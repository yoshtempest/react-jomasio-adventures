import { ExploreScene } from "@/components/Game/Scenes/Default";
import { blocked } from "@/maps/blocked";
import { cantinaDialogue } from "@/data/maps/cantina/three";  

export default function CantinaThree() {
  return (
    <div className={`Master Cantina`}>
      <ExploreScene
        map={blocked}
        dialogueData={cantinaDialogue}
        nextRoute={"/cantina/four"}
        initialPosition={{ x: 9, y: 5, direction: "up" }} 
        autoStartDialogue={true}
        npcs={[
          {
            src: "/src/assets/npcs/jhowsimar/default.svg",
            gridX: 9,
            gridY: 4,
          },
        ]}
      />
    </div>
  );
}