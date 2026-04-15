import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { cantina } from "@/maps/cantina/one";
import { cantinaDialogue } from "@/data/maps/cantina/one";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";

export default function Cantina() {
  return (
    <div className={`Master Cantina`}>
      <SceneWithDialogue
        map={cantina}
        dialogueData={cantinaDialogue}
        nextRoute="/director/one"
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