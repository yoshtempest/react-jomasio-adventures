import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import { pcsRoomFourDialogue } from "@/data/maps/pcsRoom/four";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { pcsRoomFour } from "@/maps/pcRoom/four";

export default function PcRoomFour() {
  return (
    <div className={`Master PcsRoom`}>
      <SceneWithDialogue
        map={pcsRoomFour}
        dialogueData={pcsRoomFourDialogue}
        nextRoute={"/pcroom/battle/two"}
        initialPosition={{ x: 13, y: 4, direction: "left" }}
        audio={{src: MonkeyCircle}}
        autoStartDialogue={true}
        npcs={[
          {
            src: "/src/assets/npcs/vandinha/default.svg",
            gridX: 12,
            gridY: 4,
          }
        ]}
      />
    </div>
  );
}