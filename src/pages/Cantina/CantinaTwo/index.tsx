import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantinaTwo } from "@/maps/cantina/cantinaTwo";
import { cantinaDialogue } from "@/data/maps/cantina/cantinaTwo";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";

export default function CantinaTwo() {
  return (
    <div className={`Master Cantina`}>
      <SceneWithDialogue
        map={cantinaTwo}
        dialogueData={cantinaDialogue}
        nextRoute="/firstBattle"
        initialPosition={{ x: 10, y: 4, direction: "down" }}
        audio={{src: LavenderTown}}
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