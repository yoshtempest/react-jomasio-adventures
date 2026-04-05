import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantina } from "@/maps/cantina";
import { cantinaDialogue } from "@/data/cantina";

export default function Cantina() {
  return (
    <div>
      <SceneWithDialogue
        map={cantina}
        dialogueData={cantinaDialogue}
        nextRoute="/director"
        initialPosition={{ x: 5, y: 11, direction: "up" }}
      />
    </div>
  );
}