import { hallOne } from "@/maps/hall/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { AfterPcRoomOneDialogue } from "@/data/maps/hall/one/afterPcRoom/one";  

export default function AfterPcRoom() {

  return (
    <div className={`Master HallOne`}>
      <ExploreScene
        map={hallOne}
        dialogueData={AfterPcRoomOneDialogue} 
        nextRoute={"/hall/afterpcroom/two"}
        initialPosition={{ x: 12, y: 7, direction: "left" }}
        npcs={[
          {
            src: "/src/assets/npcs/remedinha/default.svg",
            gridX: 1,
            gridY: 9,
          },
        ]}
      />
    </div>
  );
}