import { MUSICS } from "@/scenes/shared/music";
import { getHellroomTwoInitialPosition } from "./position";
import { hellroomTwoNpcs } from "./npcs";
import { getHellroomTwoDialogue } from "./dialogue";
import { hellroomTwoEvents } from "./events";
import { hellRoomTwo } from "@/maps/hellroom/two";
import { hellRoomTwoTiles } from "./tiles";

export const twoScene: SceneConfig = {
  id: "two",
  initialPosition: getHellroomTwoInitialPosition,
  dialogueData: getHellroomTwoDialogue,
  autoStartDialogue: true,
  scaleFix: 2,
  tiles: hellRoomTwoTiles,
  map: hellRoomTwo,
  events: hellroomTwoEvents,
  audio: { src: MUSICS.hell },
  npcs: hellroomTwoNpcs,
};
