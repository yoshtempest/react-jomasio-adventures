import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { blocked } from "@/maps/blocked";
import { cantinaDialogue } from "@/data/maps/cantina/three";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";

export default function CantinaThree() {
  return (
    <div className={`Master Cantina`}>
      <SceneWithDialogue
        map={blocked}
        dialogueData={cantinaDialogue}
        nextRoute={"/cantina/four"}
        initialPosition={{ x: 9, y: 5, direction: "up" }}
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