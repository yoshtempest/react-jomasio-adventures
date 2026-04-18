import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { blocked } from "@/maps/blocked";
import { cantinaDialogue } from "@/data/maps/cantina/two";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";

export default function CantinaTwo() {
  return (
    <div className={`Master Cantina`}>
      <SceneWithDialogue
        map={blocked}
        dialogueData={cantinaDialogue}
        nextRoute="/cantina/battle"
        initialPosition={{ x: 10, y: 4, direction: "left" }}
        audio={{src: LavenderTown}}
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