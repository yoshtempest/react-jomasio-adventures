import { MUSICS } from "@/scenes/shared/music";
import { getHellroomThreeInitialPosition } from "./position";
import { hellroomThreeNpcs } from "./npcs";
import { getHellroomThreeDialogue } from "./dialogue";
import { hellroomThreeEvents } from "./events";
import { hellRoomThree } from "@/maps/hellroom/three";
import { hellRoomTwoTiles } from "../two/tiles";

export const threeScene: SceneConfig = {
  id: "three",
  initialPosition: getHellroomThreeInitialPosition,
  dialogueData: getHellroomThreeDialogue,
  scaleFix: 2,
  map: hellRoomThree,
  events: hellroomThreeEvents,
  autoStartDialogue: true,
  audio: { src: MUSICS.hell },
  npcs: hellroomThreeNpcs,
  tiles: hellRoomTwoTiles,
};
