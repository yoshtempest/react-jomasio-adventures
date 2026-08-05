import { MUSICS } from "@/scenes/shared/music";
import { getHellroomThreeInitialPosition } from "./position";
import { hellroomThreeNpcs } from "./npcs";
import { getHellroomThreeDialogue } from "./dialogue";
import { hellroomThreeEvents } from "./events";
import { hellRoomThree } from "@/maps/hellroom/three";

export const threeScene: SceneConfig = {
  id: "three",
  initialPosition: getHellroomThreeInitialPosition,
  dialogueData: getHellroomThreeDialogue,
  scaleFix: 2,
  map: hellRoomThree,
  events: hellroomThreeEvents,
  audio: { src: MUSICS.hell },
  npcs: hellroomThreeNpcs,
};
