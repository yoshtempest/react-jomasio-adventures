import { hallOne } from "@/maps/hall/one";
import { hallTwo } from "@/maps/hall/two";
import { hallLeft } from "@/maps/hall/left";

import { AfterPcRoomOneDialogue } from "@/data/maps/hall/one/afterPcRoom/one";
import { AfterPcRoomTwoDialogue } from "@/data/maps/hall/one/afterPcRoom/two";
import { hallTwoDialogue } from "@/data/maps/hall/two";

import LavenderTown from "/assets/songs/LavenderTown.m4a";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const HALL_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: {
    id: "one",
    map: hallOne,
    initialPosition: { x: 9, y: 10, direction: "up" },
    audio: { src: LavenderTown },
    exitTile: [
      {
        x: 8,
        y: 2,
        route: "/hall/two",
      },
      {
        x: 9,
        y: 2,
        route: "/hall/two",
      },
      {
        x: 7,
        y: 2,
        route: "/hall/two",
      },
      {
        x: 13,
        y: 7,
        route: "/pcroom/one",
      },
      {
        x: 8,
        y: 11,
        route: "/cantina/four",
      },
    ],
  },

  two: {
    id: "two",
    map: hallTwo,
    dialogueData: hallTwoDialogue,
    audio: { src: LavenderTown },
    initialPosition: { x: 9, y: 10, direction: "up" },
    npcs: [
      { src: "/assets/npcs/jailson/default.svg", gridX: 8, gridY: 3 }
    ],
    exitTile: [
      {
        x: 9,
        y: 11,
        route: "/hall/one",
      },
      {
        x: 8,
        y: 11,
        route: "/hall/one",
      }
    ],
  },
  three: {
    id: "afterpcroom/one",
    map: hallOne,
    dialogueData: AfterPcRoomOneDialogue,
    audio: { src: LavenderTown },
    initialPosition: { x: 9, y: 10, direction: "up" },
    events: [
      { type: "navigate", to: "/hall/afterpcroom/two" }
    ],
    npcs: [
      { src: "/assets/npcs/remedinha/default.svg", gridX: 1, gridY: 9 }
    ],
    exitTile: [
      {
        x: 8,
        y: 2,
        route: "/hall/two",
      },
    ],
  },
  four: {
    id: "afterpcroom/two",
    map: hallOne,
    dialogueData: AfterPcRoomTwoDialogue,
    audio: { src: LavenderTown },
    initialPosition: { x: 9, y: 2, direction: "up" },
    npcs: [
      { src: "/assets/npcs/remedinha/default.svg", gridX: 1, gridY: 9 }
    ],
    exitTile: [
      {
        x: 8,
        y: 2,
        route: "/hall/two",
      },
      {
        x: 13,
        y: 7,
        route: "/pcroom/seven",
      },
      {
        x: 8,
        y: 11,
        route: "/cantina/four",
      },
    ],
  },
  five: {
    id: "left/one",
    map: hallLeft,
    dialogueData: AfterPcRoomTwoDialogue,
    audio: { src: LavenderTown },
    initialPosition: { x: 8, y: 10, direction: "up" },
    npcs: [
      { src: "/assets/npcs/solange/default.svg", gridX: 7, gridY: 7 }
    ],
    exitTile: [
      {
        x: 9,
        y: 4,
        route: "/hall/center/one",
      },
      {
        x: 8,
        y: 4,
        route: "/hall/center/one",
      },
      {
        x: 8,
        y: 11,
        route: "/hall/afterpcroom/two",
      },
    ],
  },
};