import { pcsRoom } from "@/maps/pcRoom/one";
import { pcsRoomTwo } from "@/maps/pcRoom/two";

import { pcsRoomDialogue } from "@/data/maps/pcsRoom/one";
import { pcsRoomTwoDialogue } from "@/data/maps/pcsRoom/two";

import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";

import type { SceneConfig, SceneId } from "@/utils/types/maps/pcRoomTypes";

export const PCS_ROOM_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: {
    id: "one",
    map: pcsRoom,
    dialogueData: pcsRoomDialogue,
    initialPosition: { x: 3, y: 4, direction: "down" },
    npcs: [
      { src: "/src/assets/npcs/janderson/default.svg", gridX: 8, gridY: 8 }
    ],
    audio: { src: MonkeyCircle },

    exitTile: {
      x: 3,
      y: 3,
      route: "/hall/one",
    },

    events: {
      onFinishType: "classModal",
    },
  },

  two: {
    id: "two",
    map: pcsRoomTwo,
    dialogueData: pcsRoomTwoDialogue,
    nextRoute: "/pcroom/three",
    audio: { src: MonkeyCircle },
    npcs: [
      { src: "/src/assets/npcs/hungryDeath/default.svg", gridX: 14, gridY: 4 }
    ],
  },
};