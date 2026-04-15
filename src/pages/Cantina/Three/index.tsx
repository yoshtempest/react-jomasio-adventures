import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantinaThree } from "@/maps/cantina/three";
import { cantinaDialogue } from "@/data/maps/cantina/three";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";

export default function CantinaThree() {
  return (
    <div className={`Master Cantina`}>
      <SceneWithDialogue
        map={cantinaThree}
        dialogueData={cantinaDialogue}
        nextRoute={"/cantina/four"}
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