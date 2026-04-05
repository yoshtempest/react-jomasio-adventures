import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantinaTwo } from "@/maps/cantinaTwo";
import { cantinaDialogue } from "@/data/cantinaTwo";

export default function CantinaTwo() {
  return (
    <div>
      <SceneWithDialogue
        map={cantinaTwo}
        dialogueData={cantinaDialogue}
        nextRoute="/firstBattle"
        initialPosition={{ x: 10, y: 4, direction: "down" }}
      />
    </div>
  );
}