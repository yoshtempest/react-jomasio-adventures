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
  map: hellRoomThree,
  events: hellroomThreeEvents,
  audio: { src: MUSICS.default },
  npcs: hellroomThreeNpcs,
};
