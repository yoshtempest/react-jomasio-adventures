import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantina } from "@/maps/cantina";
import { cantinaDialogue } from "@/data/cantina";
import LavenderTown from "@/assets/LavenderTown.m4a";

export default function Cantina() {
  return (
    <div>
      <SceneWithDialogue
        map={cantina}
        dialogueData={cantinaDialogue}
        nextRoute="/director"
        backgroundAudioSrc={LavenderTown}
        initialPosition={{ x: 5, y: 11, direction: "up" }}
      />
    </div>
  );
}