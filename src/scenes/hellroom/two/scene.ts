import { MUSICS } from "@/scenes/shared/music";
import { getHellroomTwoInitialPosition } from "./position";
import { hellroomTwoNpcs } from "./npcs";
import { getHellroomTwoDialogue } from "./dialogue";
import { hellroomTwoEvents } from "./events";
import { hellRoomTwo } from "@/maps/hellroom/two";

export const twoScene: SceneConfig = {
  id: "two",
  initialPosition: getHellroomTwoInitialPosition,
  dialogueData: getHellroomTwoDialogue,
  map: hellRoomTwo,
  events: hellroomTwoEvents,
  audio: { src: MUSICS.hell },
  npcs: hellroomTwoNpcs,
};
