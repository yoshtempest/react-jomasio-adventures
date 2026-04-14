import { one } from "@/maps/hall/afterPcRoom/one";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { pcsRoomFiveDialogue } from "@/data/maps/pcsRoom/pcsRoomFive";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";

export default function AfterPcRoom() {
  return (
    <div className={`Master HallOne`}>
      <SceneWithDialogue
        map={one}
        dialogueData={pcsRoomFiveDialogue}
        audio={{src: MonkeyCircle}}
        nextRoute={"/hall/afterpcroom/two"}

        initialPosition={{ x: 12, y: 7, direction: "left" }}
        // transitions={[
        //   {
        //     positions: [
        //       { x: 8, y: 11 },
        //       { x: 9, y: 11 },
        //       { x: 10, y: 11 },
        //     ],
        //     to: "/cantina/three",
        //   },
        //   {
        //     positions: [{ x: 13, y: 7 }],
        //     to: "/pcroom/one",
        //   },
        //   {
        //     positions: [
        //       { x: 7, y: 2 },
        //       { x: 8, y: 2 },
        //       { x: 9, y: 2 },
        //     ],
        //     to: "/hall/two",
        //   },
        // ]}
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