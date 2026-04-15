import { hallOne } from "@/maps/hall/one";
import { SceneWithDialogue } from "@/components/SceneWithDialogue";
import { pcsRoomFiveDialogue } from "@/data/maps/pcsRoom/five";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";

export default function AfterPcRoomTwo() {
  return (
    <div className={`Master HallOne`}>
      <SceneWithDialogue
        map={hallOne}
        dialogueData={pcsRoomFiveDialogue}
        audio={{src: MonkeyCircle}}

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
      />
    </div>
  );
}