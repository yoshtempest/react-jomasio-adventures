import { pcsRoomFour } from "@/maps/pcRoom/four";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import { pcsRoomFiveDialogue } from "@/data/maps/pcsRoom/five";
import { ExploreScene } from "@/components/Game/Scenes/Default";

export default function PcRoomFive() {

  return (
    <ExploreScene
      map={pcsRoomFour}
      className={`Master PcsRoom`}
      dialogueData={pcsRoomFiveDialogue}
      audio={{src: MonkeyCircle}}
      nextRoute={"/pcroom/six"}
      autoStartDialogue={true}
      initialPosition={{ x: 13, y: 4, direction: "left" }}
      npcs={[
        {
          src: "/src/assets/npcs/vandinhaFragment/default.svg",
          gridX: 12,
          gridY: 4,
        },
        {
          src: "/src/assets/npcs/reincardion/right.svg",
          gridX: 11,
          gridY: 4,
        }
      ]}
    />
  );
}