import { pcsRoom } from "@/maps/pcRoom/one";
import { pcsRoomTwo } from "@/maps/pcRoom/two";
import { pcsRoomFour } from "@/maps/pcRoom/four";
import { pcsRoomSix } from "@/maps/pcRoom/six";

import { pcsRoomDialogue } from "@/data/maps/pcsRoom/one";
import { pcsRoomTwoDialogue } from "@/data/maps/pcsRoom/two";

import { pcsRoomThreeDialogue } from "@/data/maps/pcsRoom/three";
import { pcsRoomFourDialogue } from "@/data/maps/pcsRoom/four";
import { pcsRoomFiveDialogue } from "@/data/maps/pcsRoom/five";
import { pcsRoomSixDialogue } from "@/data/maps/pcsRoom/six";

import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

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

    events: [
      { type: "openModal", modal: "class" }
    ]
  },

  two: {
    id: "two",
    map: pcsRoomTwo,
    dialogueData: pcsRoomTwoDialogue,
    events: [
      { type: "navigate", to: "/pcroom/battle/one" }
    ],
    audio: { src: MonkeyCircle },
    npcs: [
      { src: "/src/assets/npcs/hungryDeath/default.svg", gridX: 14, gridY: 4 }
    ],
  },

  three: {
    id: "three",
    map: pcsRoomTwo,
    dialogueData: pcsRoomThreeDialogue,
    events: [
      { type: "navigate", to: "/pcroom/four" }
    ],
    audio: { src: MonkeyCircle },
    npcs: [
      { src: "/src/assets/npcs/hungryDeath/default.svg", gridX: 14, gridY: 4 }
    ],
  },

  four: {
    id: "four",
    map: pcsRoomFour,
    dialogueData: pcsRoomFourDialogue,
    events: [
      { type: "navigate", to: "/pcroom/battle/two" }
    ],
    audio: { src: MonkeyCircle },
    npcs: [
      { src: "/src/assets/npcs/vandinhaFragment/right.svg", gridX: 12, gridY: 4 }
    ],
  },

  five: {
    id: "five",
    map: pcsRoomFour,
    dialogueData: pcsRoomFiveDialogue,
    events: [
      { type: "navigate", to: "/pcroom/six" }
    ],
    audio: { src: MonkeyCircle },
    npcs: [
      { src: "/src/assets/npcs/vandinhaFragment/default.svg", gridX: 12, gridY: 3.7 },
      { src: "/src/assets/npcs/reincardion/right.svg", gridX: 11, gridY: 3.7 }
    ],
  },

  six: {
    id: "three",
    map: pcsRoomSix,
    dialogueData: pcsRoomSixDialogue,
    events: [
      { type: "navigate", to: "/pcroom/seven" }
    ],
    audio: { src: MonkeyCircle },
    npcs: [
      { src: "/src/assets/npcs/reincardion/right.svg", gridX: 11, gridY: 3.7 }
    ],
  },

  seven: {
    id: "seven",
    map: pcsRoom,
    exitTile: {
      x: 3,
      y: 3,
      route: "/hall/afterpcroom/one",
    },
    dialogueData: pcsRoomDialogue,
    audio: { src: MonkeyCircle },
  },
};