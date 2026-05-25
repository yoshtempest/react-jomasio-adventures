import { hallOne } from "@/maps/hall/one";
import { hallTwo } from "@/maps/hall/two";
import { hallLeft } from "@/maps/hall/left";
import { afterPcRoom } from "@/maps/hall/afterPcRoom";

import { AfterPcRoomOneDialogue } from "@/data/maps/hall/one/one";
import { AfterPcRoomTwoDialogue } from "@/data/maps/hall/one/two";
import { AfterPcRoomThreeDialogue } from "@/data/maps/hall/one/three";
import { AfterPcRoomFourDialogue } from "@/data/maps/hall/one/four";
import { AfterPcRoomFiveDialogue } from "@/data/maps/hall/one/five";
import { AfterPcRoomSixDialogue } from "@/data/maps/hall/one/six";

import { hallJailsonOneDialogue } from "@/data/maps/hall/jailson/one";
import { hallJailsonTwoDialogue } from "@/data/maps/hall/jailson/two";
import { hallJailsonThreeDialogue } from "@/data/maps/hall/jailson/three";
import { hallJailsonFourDialogue } from "@/data/maps/hall/jailson/four";
import { hallJailsonFiveDialogue } from "@/data/maps/hall/jailson/five";
import { hallJailsonSixDialogue } from "@/data/maps/hall/jailson/six";
import { hallJailsonSevenDialogue } from "@/data/maps/hall/jailson/seven";
import { hallJailsonEightDialogue } from "@/data/maps/hall/jailson/eight";
import { hallJailsonNineDialogue } from "@/data/maps/hall/jailson/nine";

import LavenderTown from "/assets/songs/LavenderTown.m4a";
import JailsonTheme from "/assets/songs/JailsonTheme.m4a";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";
import { hallCenter } from "@/maps/hall/center";
import { hallCenterFront } from "@/maps/hall/centerFront";
import { hallThirdClass } from "@/maps/hall/thirdClass";
import type { QuestId } from "@/data/quests";
import { hallJailson } from "@/maps/hall/jailson";


export const HALL_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: {
    id: "one",
    map: hallOne,
    className: "HallOne",
    initialPosition: (lastPage?: string) => {
      if (lastPage === "/hall/jailson-one") {
        return { x: 8, y: 3, direction: "down" as const };
      }

      if (lastPage === "/pcroom/one") {
        return { x: 12, y: 7, direction: "left" as const };
      }

      return { x: 9, y: 10, direction: "up" as const };
    },
    audio: { src: LavenderTown },
    tiles: [
      {
        x: 8,
        y: 2,
        route: "/hall/jailson-one",
      },
      {
        x: 13,
        y: 7,
        route: "/pcroom/one",
      },
      {
        x: 8,
        y: 11,
        route: "/cantina/two",
      },
      {
        x: 1,
        y: 10,
        route: "/hall/left-one",
      },
    ],
  },
  "jailson-one": {
    id: "jailson-one",
    map: hallTwo,
    dialogueData: (quests, items) => {
      const hasQuest = (id: QuestId) =>
        quests.some(q => q.id === id);

      const hasItem = (id: string) =>
        items.some(item => item.id === id);

      if (!hasQuest("give_orange_juice")) {
        return hallJailsonFourDialogue;
      }

      if (hasQuest("give_orange_juice") && !hasItem("orange_juice") && !hasQuest("create_map")) {
        return hallJailsonFiveDialogue;
      }

      if (hasQuest("give_orange_juice") && hasItem("orange_juice")) {
        return hallJailsonSixDialogue;
      }

      if (hasQuest("create_map") && !hasItem("desired_gear") && !hasItem("jorjao_map")) {
        return hallJailsonSevenDialogue;
      }

      if (hasQuest("create_map") && hasItem("desired_gear")) {
        return hallJailsonEightDialogue;
      }

      if (hasItem("jorjao_map")) {
        return hallJailsonNineDialogue;
      }

      return hallJailsonOneDialogue;
    },
    className: "HallTwo",
    audio: { src: JailsonTheme },
    initialPosition: (lastPage?: string) => {
      if (lastPage === "/hall/jailson-two") {
        return { x: 9, y: 4, direction: "left" as const };
      }
      return { x: 9, y: 10, direction: "up" as const };
    },
    npcs: [
      { src: "/assets/npcs/jailson/default.svg", gridX: 8, gridY: 3 }
    ],
    tiles: [
      {
        x: 9,
        y: 11,
        getRoute: (_player, quests) => {
          if (quests.some(q => q.id === "letter_delivery" || "help_jailson" || "x1_slimita")) {
            return "/hall/afterpcroom-one";
          }
          return "/hall/one";
        },
      },
      {
        x: 8,
        y: 11,
        getRoute: (_player, quests) => {
          if (quests.some(q => q.id === "letter_delivery" || "help_jailson" || "x1_slimita")) {
            return "/hall/afterpcroom-one";
          }
          return "/hall/one";
        },
      },
    ],
    events: [
      {
        type: "conditional",
        condition: { notHasQuest: "give_orange_juice" },
        then: [
          { type: "giveQuest", questId: "give_orange_juice" },
        ],
      },
      {
        type: "conditional",
        condition: {
          hasItem: "orange_juice",
          hasQuest: "give_orange_juice"
        },
        then: [
          { type: "removeItem", itemId: "orange_juice" },
          { type: "giveQuest", questId: "create_map" },
          { type: "progressQuest", id: "give_orange_juice", value: 1 },
        ],
      },
      {
        type: "conditional",
        condition: { hasQuest: "create_map", hasItem: "desired_gear" },
        then: [
          { type: "removeItem", itemId: "desired_gear" },
          { type: "addItem", itemId: "jorjao_map" },
          { type: "progressQuest", id: "create_map", value: 1 },
        ],
      },
    ],
  },
  "jailson-two": {
    id: "jailson-two",
    map: hallJailson,
    dialogueData: (quests) => {
      const hasQuest = (id: QuestId) =>
        quests.some(q => q.id === id);

      if (hasQuest("x1_slimita")) {
        return hallJailsonThreeDialogue;
      }

      return hallJailsonTwoDialogue;
    },
    className: "HallTwo",
    audio: { src: JailsonTheme },
    initialPosition: { x: 9, y: 10, direction: "up" },
    npcs: [
      { src: "/assets/npcs/jailson/default.svg", gridX: 8, gridY: 3 },
      { src: "/assets/npcs/slimita/up.svg", gridX: 8, gridY: 4 }
    ],
    tiles: [
      {
        x: 9,
        y: 11,
        route: "/hall/afterpcroom-one",
      },
      {
        x: 8,
        y: 11,
        route: "/hall/afterpcroom-one",
      }
    ],
    events: [
      {
        type: "conditional",
        condition: { notHasFlag: "slimita_battle_won" },
        then: [
          { type: "giveQuest", questId: "x1_slimita" },
          { type: "navigate", to: "/hall/jailson/battle" }
        ],
      },
      {
        type: "conditional",
        condition: {
          hasQuest: "x1_slimita",
          hasFlag: "slimita_battle_won"
        },
        then: [
          { type: "giveQuest", questId: "give_orange_juice" },
          { type: "progressQuest", id: "x1_slimita", value: 1 },
          { type: "navigate", to: "/hall/jailson-one" }
        ],
      },
    ],
  },
  "afterpcroom-one": {
    id: "afterpcroom-one",
    map: afterPcRoom,
    dialogueData: (quests, items) => {
      const hasQuest = (id: QuestId) =>
        quests.some(q => q.id === id);

      const hasItem = (id: string) =>
        items.some(item => item.id === id);

      if (hasItem("aura_letter") && !hasQuest("search_packaging")) {
        return AfterPcRoomOneDialogue;
      }

      if (hasItem("package_01") && !hasItem("good_powder")) {
        return AfterPcRoomThreeDialogue;
      }

      if (hasQuest("search_packaging") && !hasQuest("go_cafeteria")) {
        return AfterPcRoomTwoDialogue;
      }

      if (hasQuest("go_cafeteria") && !hasQuest("return_to_remedinha")) {
        return AfterPcRoomFiveDialogue;
      }

      if (hasQuest("return_to_remedinha") || hasQuest("encounter_deise")) {
        return AfterPcRoomSixDialogue;
      }

      return AfterPcRoomFourDialogue;
    },
    className: "HallOne",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      if (lastPage === "/pcroom/six") {
        return { x: 12, y: 7, direction: "left" as const };
      }
      if (lastPage === "/hall/left-one") {
        return { x: 2, y: 10, direction: "right" as const };
      }
      if (lastPage === "/hall/jailson-one" || lastPage === "/hall/jailson-two") {
        return { x: 8, y: 3, direction: "down" as const };
      }

      return { x: 2, y: 9, direction: "down" as const };
    },
    npcs: [
      { src: "/assets/npcs/remedinha/default.svg", gridX: 1, gridY: 9 }
    ],
    tiles: [
      {
        x: 8,
        y: 2,
        getRoute: (_player, quests) => {
          if (quests.some(q => q.id === "help_jailson")) {
            return "/hall/jailson-two";
          }
          return "/hall/jailson-one";
        },
      },
      {
        x: 9,
        y: 2,
        getRoute: (_player, quests) => {
          if (quests.some(q => q.id === "help_jailson")) {
            return "/hall/jailson-two";
          }
          return "/hall/jailson-one";
        },
      },
      {
        x: 7,
        y: 2,
        getRoute: (_player, quests) => {
          if (quests.some(q => q.id === "help_jailson")) {
            return "/hall/jailson-two";
          }
          return "/hall/jailson-one";
        },
      },
      {
        x: 13,
        y: 7,
        route: "/pcroom/six",
      },
      {
        x: 8,
        y: 11,
        route: "/cantina/two",
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
        condition: { hasItem: "aura_letter" },
        then: [
          { type: "progressQuest", id: "letter_delivery", value: 1 },
          { type: "removeItem", itemId: "aura_letter" },
          { type: "giveQuest", questId: "search_packaging" },
        ],
      },
      {
        type: "conditional",
        condition: { hasItem: "package_01" },
        then: [
          { type: "removeItem", itemId: "package_01" },
          { type: "addItem", itemId: "good_powder" },
          { type: "progressQuest", id: "search_packaging", value: 1 }
        ],
      },
      {
        type: "conditional",
        condition: {
          hasItem: "good_powder",
          notHasQuest: "go_cafeteria"
        },
        then: [
          { type: "giveQuest", questId: "go_cafeteria" }
        ]
      },
      {
        type: "conditional",
        condition: { hasQuest: "return_to_remedinha" },
        then: [
          { type: "progressQuest", id: "encounter_deise", value: 1 },
          { type: "progressQuest", id: "return_to_remedinha", value: 1 },
          { type: "giveQuest", questId: "help_jailson" }
        ],
      },
    ]
  },
  "left-one": {
    id: "left-one",
    map: hallLeft,
    dialogueData: AfterPcRoomTwoDialogue,
    className: "HallLeft",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      if (lastPage === "/hall/center-one") {
        return { x: 9, y: 5, direction: "down" as const };
      }

      return { x: 9, y: 10, direction: "up" as const };
    },
    npcs: [
      { src: "/assets/npcs/solange/default.svg", gridX: 2, gridY: 8 }
    ],
    tiles: [
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
        route: "/hall/afterpcroom-one",
      },
    ],
  },
  "center-one": {
    id: "center-one",
    map: hallCenter,
    className: "HallCenter",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      if (lastPage === "/hall/center-front") {
        return { x: 8, y: 6, direction: "down" as const };
      }

      return { x: 8, y: 10, direction: "up" as const };
    },
    tiles: [
      {
        x: 3,
        y: 7,
        route: "/cantina/two",
      },
      {
        x: 14,
        y: 7,
        route: "/hall/hell",
        requiredQuest: "go_to_hell",
        blockedMessage: "Tem um negão na frente, não dá para passar..."
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
    className: "HallCenterFront",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      if (lastPage === "/hall/thirdclass") {
        return { x: 10, y: 7, direction: "left" as const };
      }

      return { x: 8, y: 10, direction: "up" as const };
    },
    tiles: [
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
    className: "HallThirdClass",
    audio: { src: LavenderTown },
    initialPosition: (lastPage?: string) => {
      if (lastPage === "/library") {
        return { x: 8, y: 6, direction: "down" as const };
      }

      if (lastPage === "/brodiclass/one") {
        return { x: 4, y: 7, direction: "right" as const };
      }

      return { x: 8, y: 10, direction: "up" as const };
    },
    tiles: [
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