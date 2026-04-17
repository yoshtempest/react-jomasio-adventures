import { blocked } from "@/maps/blocked";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { AfterPcRoomOneDialogue } from "@/data/maps/hall/one/afterPcRoom/one";
import LavenderTown from "@/assets/songs/LavenderTown.m4a";

export default function AfterPcRoom() {

  return (
    <div className={`Master HallOne`}>
      <SceneWithDialogue
        map={blocked}
        dialogueData={AfterPcRoomOneDialogue}
        audio={{src: LavenderTown}}
        nextRoute={"/hall/afterpcroom/two"}

        initialPosition={{ x: 12, y: 7, direction: "left" }}
        npcs={[
          {
            src: "/src/assets/npcs/remedinha/default.svg",
            gridX: 11,
            gridY: 7,
          },
        ]}
      />
    </div>
  );
}