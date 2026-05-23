import { pcsRoom } from "@/maps/pcRoom/one";
import { pcsRoomTwo } from "@/maps/pcRoom/two";
import { pcsRoomThree } from "@/maps/pcRoom/three";
import { pcsRoomFive } from "@/maps/pcRoom/five";
import { pcsRoomSix } from "@/maps/pcRoom/six";

import { pcsRoomDialogue } from "@/data/maps/pcsRoom/one";
import { pcsRoomTwoDialogue } from "@/data/maps/pcsRoom/two";
import { pcsRoomThreeDialogue } from "@/data/maps/pcsRoom/three";
import { pcsRoomFourDialogue } from "@/data/maps/pcsRoom/four";
import { pcsRoomFiveDialogue } from "@/data/maps/pcsRoom/five";
import { pcsRoomSixDialogue } from "@/data/maps/pcsRoom/six";

import MonkeyCircle from "/assets/songs/MonkeyCircle.m4a";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

import type { QuestId } from "@/data/quests";

export const PCS_ROOM_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: {
    id: "one",
    map: pcsRoom,
    dialogueData: pcsRoomDialogue,
    initialPosition: { x: 3, y: 4, direction: "down" },
    npcs: [
      { src: "/assets/npcs/janderson/default.svg", gridX: 8, gridY: 8 }
    ],
    audio: { src: MonkeyCircle },

    exitTile: [{
      x: 3,
      y: 3,
      route: "/hall/one",
    }],

    events: [
      { type: "progressQuest", id: "explore_jorjao", value: 1 },
      { type: "openModal", modal: "class" }
    ]
  },

  two: {
    id: "two",
    map: pcsRoomTwo,
    dialogueData: (quests) => {
      const hasQuest = (id: QuestId) =>
        quests.some(q => q.id === id);

      if (hasQuest("x1_hungry")) {
        return pcsRoomThreeDialogue;
      }
      return pcsRoomTwoDialogue;
    },
    events: [
      {
        type: "conditional",
        condition: { notHasFlag: "hungry_intro_done" },
        then: [
          { type: "giveQuest", questId: "x1_hungry" },
          { type: "navigate", to: "/pcroom/battle/one" }
        ],
      },
      {
        type: "conditional",
        condition: { hasQuest: "x1_hungry" },
        then: [
          { type: "progressQuest", id: "x1_hungry", value: 1 },
          { type: "navigate", to: "/pcroom/three" }
        ],
      },
    ],
    audio: { src: MonkeyCircle },
    npcs: [
      { src: "/assets/npcs/hungryDeath/default.svg", gridX: 14, gridY: 4 }
    ],
  },

  three: {
    id: "three",
    map: pcsRoomThree,
    dialogueData: pcsRoomFourDialogue,
    events: [
      { type: "giveQuest", questId: "x1_vandinha" },
      { type: "navigate", to: "/pcroom/battle/two" }
    ],
    audio: { src: MonkeyCircle },
    npcs: [
      { src: "/assets/npcs/vandinhaFragment/right.svg", gridX: 12, gridY: 4 }
    ],
  },

  four: {
    id: "four",
    map: pcsRoomThree,
    dialogueData: pcsRoomFiveDialogue,
    events: [
      { type: "progressQuest", id: "x1_vandinha", value: 1 },
      { type: "navigate", to: "/pcroom/five" }
    ],
    audio: { src: MonkeyCircle },
    npcs: [
      { src: "/assets/npcs/vandinhaFragment/default.svg", gridX: 12, gridY: 4 },
      { src: "/assets/npcs/reincardion/right.svg", gridX: 11, gridY: 4 }
    ],
  },

  five: {
    id: "five",
    map: pcsRoomFive,
    dialogueData: pcsRoomSixDialogue,
    events: [
      { type: "giveQuest", questId: "letter_delivery" },
      { type: "addItem", itemId: "aura_letter"},
      { type: "navigate", to: "/pcroom/six" }
    ],
    audio: { src: MonkeyCircle },
    npcs: [
      { src: "/assets/npcs/reincardion/right.svg", gridX: 11, gridY: 4 }
    ],
  },

  six: {
    id: "six",
    map: pcsRoomSix,
    exitTile: [{
      x: 3,
      y: 3,
      route: "/hall/afterpcroom-one", // navigate -1
    }],
    audio: { src: MonkeyCircle },
    initialPosition: (lastPage?: string) => {
      // console.log("LAST PAGE:", lastPage);
      if (lastPage === "/pcroom/five") {
        return { x: 12, y: 4, direction: "left" as const };
      }

      return { x: 3, y: 4, direction: "down" as const };
    },
  },
};