import { hallOne } from "@/maps/hall/one";
import { ExploreScene } from "@/components/Game/Scenes/Default";
import { AfterPcRoomTwoDialogue } from "@/data/maps/hall/one/afterPcRoom/two";  


export default function AfterPcRoomTwo() {
  return (
    <ExploreScene
      map={hallOne}
      className={`Master HallOne`}
      dialogueData={AfterPcRoomTwoDialogue} 
      initialPosition={{ x: 2, y: 9, direction: "left" }}
      npcs={[
        {
          src: "/src/assets/npcs/remedinha/default.svg",
          gridX: 1,
          gridY: 9,
        },
      ]}
      transitions={[
        {
          positions: [
            { x: 1, y: 10 },
          ],
          to: "/hall/left/one",
        },
        {
          positions: [{ x: 13, y: 7 }],
          to: "/pcroom/seven",
        },
        {
          positions: [
            { x: 7, y: 2 },
            { x: 8, y: 2 },
            { x: 9, y: 2 },
          ],
          to: "/hall/two",
        },
      ]}
    />
  );
}