import { pcsRoomSix } from "@/maps/pcRoom/six";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import { pcsRoomSixDialogue } from "@/data/maps/pcsRoom/six";
import { SceneWithDialogue } from "@/components/Game/Scenes/WithDialogue";

export default function PcRoomSix() {

  return (
    <div className={`Master PcsRoom`}>
      <SceneWithDialogue
        map={pcsRoomSix}
        dialogueData={pcsRoomSixDialogue}
        audio={{src: MonkeyCircle}}
        nextRoute={"/pcroom/seven"}
        autoStartDialogue={true}
        initialPosition={{ x: 12, y: 4, direction: "left" }}
        npcs={[
          {
            src: "/src/assets/npcs/reincardion/right.svg",
            gridX: 11,
            gridY: 3.7,
          }
        ]}
      />
    </div>
  );
}