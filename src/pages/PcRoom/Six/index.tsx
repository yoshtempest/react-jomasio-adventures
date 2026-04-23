import { pcsRoomSix } from "@/maps/pcRoom/six";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import { pcsRoomSixDialogue } from "@/data/maps/pcsRoom/six";
import { ExploreScene } from "@/components/Game/Scenes/Default";

export default function PcRoomSix() {

  return (
    <div className={`Master PcsRoom`}>
      <ExploreScene
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