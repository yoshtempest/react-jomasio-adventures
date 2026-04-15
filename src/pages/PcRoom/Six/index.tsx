import { pcsRoomSix } from "@/maps/pcRoom/six";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import { pcsRoomSixDialogue } from "@/data/maps/pcsRoom/six";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";

export default function PcRoomSix() {

  return (
    <div className={`Master PcsRoom`}>
      <SceneWithDialogue
        map={pcsRoomSix}
        dialogueData={pcsRoomSixDialogue}
        audio={{src: MonkeyCircle}}
        nextRoute={"/pcroom/seven"}
        initialPosition={{ x: 12, y: 4, direction: "left" }}
        npcs={[
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