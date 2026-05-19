import { hallOne } from "@/maps/hall/one";
import { hallTwo } from "@/maps/hall/two";
import { hallLeft } from "@/maps/hall/left";
import { afterPcRoom } from "@/maps/hall/afterPcRoom/one";

import { AfterPcRoomOneDialogue } from "@/data/maps/hall/one/afterPcRoom/one";
import { AfterPcRoomTwoDialogue } from "@/data/maps/hall/one/afterPcRoom/two";
import { hallTwoDialogue } from "@/data/maps/hall/two";

import LavenderTown from "/assets/songs/LavenderTown.m4a";
import JailsonTheme from "/assets/songs/JailsonTheme.m4a";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";
import { hallCenter } from "@/maps/hall/center";
import { hallCenterFront } from "@/maps/hall/centerFront";
import { hallThirdClass } from "@/maps/hall/thirdClass";

export const HALL_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: {
    id: "one",
    map: hallOne,
    className: "HallOne",
    initialPosition: (lastPage?: string) => {
      if (lastPage === "/hall/two") {
        return { x: 8, y: 3, direction: "down" as const };
      }

      if (lastPage === "/pcroom/one") {
        return { x: 12, y: 7, direction: "left" as const };
      }

      return { x: 9, y: 10, direction: "up" as const };
    },
    audio: { src: LavenderTown },
    exitTile: [
      {
        x: 8,
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
      {
        x: 1,
        y: 10,
        route: "/hall/left-one",
      },
    ],
  },

  two: {
    id: "two",
    map: hallTwo,
    dialogueData: hallTwoDialogue,
    className: "HallTwo",
    audio: { src: JailsonTheme },
    initialPosition: { x: 9, y: 10, direction: "up" },
    npcs: [
      { src: "/assets/npcs/jailson/default.svg", gridX: 8, gridY: 3 }
    ],
    exitTile: [
      {
        x: 9,
        y: 11,
        route: "/hall/one", // navigate -1
      },
      {
        x: 8,
        y: 11,
        route: "/hall/one", // navigate -1
      }
    ],
  },
  "afterpcroom-one": {
    id: "afterpcroom-one",
    map: afterPcRoom,
    dialogueData: AfterPcRoomOneDialogue,
    className: "HallOne",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      // console.log("LAST PAGE:", lastPage);
      if (lastPage === "/pcroom/seven") {
        return { x: 12, y: 7, direction: "left" as const };
      }

      return { x: 8, y: 3, direction: "down" as const };
    },
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
    ],
    events: [
      { type: "removeItem", itemId: "aura_letter" },
      { type: "giveQuest", questId: "search_packaging" },
      { type: "navigate", to: "/hall/afterpcroom-two" }
    ]
  },
  "afterpcroom-two": {
    id: "afterpcroom-two",
    map: afterPcRoom,
    dialogueData: AfterPcRoomTwoDialogue,
    className: "HallOne",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      // console.log("LAST PAGE:", lastPage);
      if (lastPage === "/pcroom/seven") {
        return { x: 12, y: 7, direction: "left" as const };
      }
      if (lastPage === "/hall/left-one") {
        return { x: 2, y: 10, direction: "right" as const };
      }

      return { x: 2, y: 9, direction: "down" as const };
    },
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
      {
        x: 1,
        y: 10,
        route: "/hall/left-one",
      },
    ],
    events: [
      {
        type: "conditional",
        condition: { hasItem: "package_01" },
        then: [
          { type: "removeItem", itemId: "package_01" },
          { type: "addItem", itemId: "good_powder" },
          { type: "progressQuest", id: "search_packaging", value: 1 }
        ],
        else: [
          {
            type: "conditional",
            condition: { hasItem: "good_powder" },
            then: [
              { type: "giveQuest", questId: "go_cafeteria" }
            ]
          }
        ]
      }
    ]
  },
  "left-one": {
    id: "left-one",
    map: hallLeft,
    dialogueData: AfterPcRoomTwoDialogue,
    className: "HallLeft",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      // console.log("LAST PAGE:", lastPage);
      if (lastPage === "/hall/center-one") {
        return { x: 9, y: 5, direction: "down" as const };
      }

      return { x: 9, y: 10, direction: "up" as const };
    },
    npcs: [
      { src: "/assets/npcs/solange/default.svg", gridX: 2, gridY: 8 }
    ],
    exitTile: [
      {
        x: 9,
        y: 4,
        route: "/hall/center-one",
      },
      {
        x: 8,
        y: 4,
        route: "/hall/center-one",
      },
      {
        x: 9,
        y: 11,
        route: "/hall/afterpcroom-two", // navigate -1
      },
    ],
  },
  "center-one": {
    id: "center-one",
    map: hallCenter,
    className: "HallCenter",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      // console.log("LAST PAGE:", lastPage);
      if (lastPage === "/hall/center-front") {
        return { x: 8, y: 6, direction: "down" as const };
      }

      return { x: 8, y: 10, direction: "up" as const };
    },
    exitTile: [
      {
        x: 3,
        y: 7,
        route: "/cantina/four",
      },
      {
        x: 8,
        y: 5,
        route: "/hall/center-front",
      },
      {
        x: 7,
        y: 11,
        route: "/hall/left-one",
      },
    ],
  },
  "center-front": {
    id: "center-front",
    map: hallCenterFront,
    dialogueData: AfterPcRoomTwoDialogue,
    className: "HallCenterFront",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      // console.log("LAST PAGE:", lastPage);
      if (lastPage === "/hall/thirdclass") {
        return { x: 10, y: 7, direction: "left" as const };
      }

      return { x: 8, y: 10, direction: "up" as const };
    },
    exitTile: [
      {
        x: 11,
        y: 7,
        route: "/hall/thirdclass",
      },
      {
        x: 8,
        y: 11,
        route: "/hall/center-one",
      },
    ],
  },
  "thirdclass": {
    id: "thirdclass",
    map: hallThirdClass,
    dialogueData: AfterPcRoomTwoDialogue,
    className: "HallThirdClass",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      // console.log("LAST PAGE:", lastPage);
      if (lastPage === "/library") {
        return { x: 8, y: 6, direction: "down" as const };
      }

      if (lastPage === "/brodiclass/one") {
        return { x: 4, y: 7, direction: "right" as const };
      }

      return { x: 8, y: 10, direction: "up" as const };
    },
    exitTile: [
      {
        x: 3,
        y: 7,
        route: "/brodiclass/one",
      },
      {
        x: 8,
        y: 5,
        route: "/library",
      },
      {
        x: 9,
        y: 11,
        route: "/hall/center-front",
      },
    ],
  },
};