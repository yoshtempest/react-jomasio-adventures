import { ExploreScene } from "@/components/Game/Scenes/Default";
import { cantina } from "@/maps/cantina/one";
import { cantinaDialogue } from "@/data/maps/cantina/one";  

export default function Cantina() {
  return (
    <div className={`Master Cantina`}>
      <ExploreScene
        map={cantina}
        dialogueData={cantinaDialogue}
        nextRoute="/director/one"
        initialPosition={{ x: 8, y: 11, direction: "up" }} 
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