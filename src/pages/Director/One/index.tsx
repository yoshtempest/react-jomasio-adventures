import { blocked } from "@/maps/blocked";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";
import { directorDialogue } from "@/data/maps/director/one";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";

export default function Director() {

  return (
    <div className={`Master Director`}>
      <SceneWithDialogue
        map={blocked}
        dialogueData={directorDialogue}
        initialPosition={{ x: 9, y: 5, direction: "up" }}
        audio={{src: LavenderTown}}
        autoStartDialogue={true}
        nextRoute="/director/two"
        npcs={[
          {
            src: "/src/assets/npcs/system/default.svg",
            gridX: 9,
            gridY: 4,
          },
        ]}
      />
    </div>
  );
}