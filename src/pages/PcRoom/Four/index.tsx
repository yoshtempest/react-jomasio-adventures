import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import { pcsRoomFourDialogue } from "@/data/maps/pcsRoom/four";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { pcsRoomFour } from "@/maps/pcRoom/four";

export default function PcRoomFour() {
  return (
    <ExploreScene
      map={pcsRoomFour}
      className={`Master PcsRoom`}
      dialogueData={pcsRoomFourDialogue}
      nextRoute={"/pcroom/battle/two"}
      initialPosition={{ x: 13, y: 4, direction: "left" }}
      audio={{src: MonkeyCircle}}
      autoStartDialogue={true}
      npcs={[
        {
          src: "/src/assets/npcs/vandinhaFragment/right.svg",
          gridX: 12,
          gridY: 3.5,
        }
      ]}
    />
  );
}