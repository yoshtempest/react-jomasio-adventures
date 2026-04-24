import { ExploreScene } from "@/components/Game/Scenes/Default";
import { blocked } from "@/maps/blocked";
import { cantinaDialogue } from "@/data/maps/cantina/two";  

export default function CantinaTwo() {
  return (
    <ExploreScene
      map={blocked}
      className={`Master Cantina`}
      dialogueData={cantinaDialogue}
      nextRoute="/cantina/battle"
      initialPosition={{ x: 10, y: 4, direction: "left" }} 
      autoStartDialogue={true}
      npcs={[
        {
          src: "/src/assets/npcs/jhowsimar/default.svg",
          gridX: 9,
          gridY: 4,
        },
      ]}
    />
  );
}