import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantinaTwo } from "@/maps/cantinaTwo";
import { cantinaDialogue } from "@/data/cantinaTwo";
import LavenderTown from "@/assets/LavenderTown.m4a";

export default function CantinaTwo() {
  return (
    <div>
      <SceneWithDialogue
        map={cantinaTwo}
        dialogueData={cantinaDialogue}
        nextRoute="/firstBattle"
        backgroundAudioSrc={LavenderTown}
        initialPosition={{ x: 10, y: 4, direction: "down" }}
      />
    </div>
  );
}