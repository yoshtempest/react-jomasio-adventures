import { pcsRoomFour } from "@/maps/pcRoom/four";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import { pcsRoomFiveDialogue } from "@/data/maps/pcsRoom/five";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";

export default function PcRoomFive() {

  return (
    <div className={`Master PcsRoom`}>
      <SceneWithDialogue
        map={pcsRoomFour}
        dialogueData={pcsRoomFiveDialogue}
        audio={{src: MonkeyCircle}}
        nextRoute={"/pcroom/six"}
        autoStartDialogue={true}
        initialPosition={{ x: 13, y: 4, direction: "left" }}
        npcs={[
          {
            src: "/src/assets/npcs/vandinha/default.svg",
            gridX: 12,
            gridY: 4,
          },
          {
            src: "/src/assets/npcs/reincardion/default.svg",
            gridX: 11,
            gridY: 4,
          }
        ]}
      />
    </div>
  );
}