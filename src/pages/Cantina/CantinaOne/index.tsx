import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantina } from "@/maps/cantina/cantina";
import { cantinaDialogue } from "@/data/cantina";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";

export default function Cantina() {
  return (
    <div>
      <SceneWithDialogue
        map={cantina}
        dialogueData={cantinaDialogue}
        nextRoute="/director"
        initialPosition={{ x: 5, y: 11, direction: "up" }}
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