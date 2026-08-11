import { MUSICS } from "@/scenes/shared/music";
import { getHellroomFourInitialPosition } from "./position";
import { hellroomFourNpcs } from "./npcs";
import { getHellroomFourDialogue } from "./dialogue";
import { hellRoomFour } from "@/maps/hellroom/four";

export const fourScene: SceneConfig = {
  id: "four",
  initialPosition: getHellroomFourInitialPosition,
  dialogueData: getHellroomFourDialogue,
  scaleFix: 2,
  map: hellRoomFour,
  audio: { src: MUSICS.hell },
  npcs: hellroomFourNpcs,
};
